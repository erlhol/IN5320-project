import React from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  CircularLoader,
} from "@dhis2/ui";
import DateTimePicker from "./DateTimePicker";
import RecipientInput from "./RecipientInput";
import CancelConfirmationModal from "./CancelConfirmationModal";
import CommoditySelect from "./CommoditySelect";
import modalStyles from "./CommodityTransferModal.module.css";
import { getCurrentMonth } from "../../utilities/dates";
import { DataQuery, useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import {
  stockRequest,
  stockUpdateRequest,
  transUpdateRequest,
} from "../../utilities/requests";
import {
  mergeCommodityAndValue,
  getDateAndTime,
} from "../../utilities/datautility";

const CommodityTransferModal = props => {
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [cancelModalPresent, setCancelModalPresent] = useState(false);

  const [dateTimeState, setDateTimeState] = useState({
    dateTime: "",
    isValid: false,
  });

  const [recipient, setRecipient] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
   const [updateStock] = useDataMutation(stockUpdateRequest);
   const [updateTrans] = useDataMutation(transUpdateRequest);

  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const addCommodity = commodity => {
    const commodityWithRestockAmount = {
      ...commodity,
      amountToRestock: "",
      inputError: "Enter amount to restock",
    };
    setSelectedCommodities([
      ...selectedCommodities,
      commodityWithRestockAmount,
    ]);
  };

  const setAmountToRestock = (commodity, value, inputError) => {
    const commodityWithRestockAmount = {
      ...commodity,
      amountToRestock: value,
      inputError: inputError,
    };
    setSelectedCommodities(
      selectedCommodities.map(selectedCommodity =>
        selectedCommodity.commodityName === commodity.commodityName
          ? commodityWithRestockAmount
          : selectedCommodity
      )
    );
  };

  const removeCommodity = commodity => {
    setSelectedCommodities(
      selectedCommodities.filter(
        selectedCommodity => selectedCommodity !== commodity
      )
    );
  };

  const validateForm = () => {
    const amountInputsValid = selectedCommodities.every(
      commodity => commodity.inputError === ""
    );
    console.log("amountInputsValid", amountInputsValid);
    console.log("dateTimeState.isValid", dateTimeState.isValid);
    return (
      amountInputsValid &&
      dateTimeState.isValid &&
      !(recipient === "" && props.dispensing)
    );
  };

  const onSubmit = () => {
    setSubmitAttempted(true);
    if (validateForm()) {
      updateStockInApi();
      updateTransInApi();
      props.refetchData();
      props.onClose(true);

      console.log("submitted", selectedCommodities);
    }
  };

  //For each commodity in selectedCommodities, update  the endBalance to endBalance+inputValue(add stock) or endBalance-inputValue(despencing)
  const updateStockInApi = () =>
    selectedCommodities.forEach(commodity => {
      updateStock({
        dataElement: commodity.commodityId,
        categoryOptionCombo: "J2Qf1jtZuj8", //endBalance
        value: calculateValuesForRequest(commodity).updatedStockBalance,
      });
    });

  //For each commodity in selectedCommodities, add a transaction to the existedTransData array, then update the transaction with transUpdateRequest
  const updateTransInApi = () => {
    const commodities = selectedCommodities.map(commodity => {
      const { updatedStockBalance, transAmount } =
        calculateValuesForRequest(commodity);
      return {
        commodityId: commodity.commodityId,
        commodityName: commodity.commodityName,
        amount: transAmount,
        balanceAfterTrans: updatedStockBalance,
      };
    });

    const { date, time } = getDateAndTime(new Date(dateTimeState.dateTime));
    let transData = {
      type: props.title === props.dispensing ? "Dispensing" : "Restock",
      commodities,
      dispensedBy: data.me.displayName,
      dispensedTo: recipient,
      date,
      time,
    };
    transData = [transData, ...props.existedTransData];
    updateTrans({ data: transData });
  };

  const calculateValuesForRequest = commodity => {
    const values = {
      updatedStockBalance: 0,
      transAmount: "",
    };
    values["updatedStockBalance"] = props.dispensing
      ? Number(commodity.endBalance) - Number(commodity.amountToRestock)
      : Number(commodity.endBalance) + Number(commodity.amountToRestock);
    values["transAmount"] = props.dispensing
      ? "-" + commodity.amountToRestock
      : "+" + commodity.amountToRestock;
    return values;
  };

  if (error) return <span>ERROR in getting stock data: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    const allCommodities = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements,
      props.transactionData
    );

    //TODO: preselected commodities to
    return (
      <Modal large>
        <ModalTitle>{props.title}</ModalTitle>
        <ModalContent className={modalStyles.addStockModal}>
          <div className={modalStyles.dateTimeRecipientContainer}>
            <div className={modalStyles.dateTimePicker}>
              <DateTimePicker
                dateTimeState={dateTimeState}
                setDateTimeState={setDateTimeState}
                submitAttempted={submitAttempted}
              />
            </div>
            {props.dispensing && (
              <div style={{ flex: 1 }}>
                <RecipientInput
                  recipient={recipient}
                  setRecipient={setRecipient}
                />
              </div>
            )}
          </div>

          {/* TODO: should we disable future date and time settings */}
          {/* Main section */}
          <CommoditySelect
            stockData={allCommodities}
            addCommodity={addCommodity}
            selectedCommodities={selectedCommodities}
            removeCommodity={removeCommodity}
            setAmountToRestock={setAmountToRestock}
            dispensing={props.dispensing}
            submitAttempted={submitAttempted}
          />

          {cancelModalPresent && (
            <CancelConfirmationModal
              setCancelModalPresent={setCancelModalPresent}
              onClose={props.onClose}
            />
          )}
        </ModalContent>
        <ModalActions>
          <ButtonStrip end>
            <Button onClick={() => setCancelModalPresent(true)} secondary>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              {...(dateTimeState.dateTime != "" &&
              selectedCommodities.length > 0 &&
              !(recipient === "" && props.dispensing)
                ? { primary: true }
                : { disabled: true })}
            >
              Submit
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    );
  }
};
export default CommodityTransferModal;
