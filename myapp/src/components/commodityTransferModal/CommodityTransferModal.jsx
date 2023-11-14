import React from "react";
import { useState, useMemo } from "react";
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
import CommoditySelector from "./CommoditySelector";
import modalStyles from "./CommodityTransferModal.module.css";
import { getCurrentMonth } from "../../utilities/dates";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
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
  const [updateStock] = useDataMutation(stockUpdateRequest);
  const [updateTrans] = useDataMutation(transUpdateRequest);
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [cancelModalPresent, setCancelModalPresent] = useState(false);
  const [dateTimeState, setDateTimeState] = useState({
    dateTime: "",
    isValid: false,
  });
  const [recipient, setRecipient] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  useMemo(() => {
    if (props.preselectedCommodities) {
      setSelectedCommodities(props.preselectedCommodities);
    }
  });

  // Add commodity to array
  const addCommodity = commodity => {
    const commodityWithRestockAmount = {
      ...commodity,
      amount: "",
      inputError: "Enter amount to restock",
    };
    setSelectedCommodities([
      ...selectedCommodities,
      commodityWithRestockAmount,
    ]);
  };

  const setAmount = (commodity, value, inputError) => {
    const commodityWithRestockAmount = {
      ...commodity,
      amount: value,
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

  const formsAreValid = () => {
    const amountInputsValid = selectedCommodities.every(
      commodity => commodity.inputError === ""
    );
    return (
      amountInputsValid &&
      dateTimeState.isValid &&
      !(recipient === "" && props.dispensing)
    );
  };

  const onSubmit = async () => {
    setSubmitAttempted(true);
    if (formsAreValid()) {
      await updateStockInApi();
      await updateTransInApi();
      await props.refetchData(props.dispensing);
      props.onClose();
      console.log("submitted", selectedCommodities);
    }
  };

  //For each commodity in selectedCommodities, update  the endBalance to endBalance+inputValue(add stock) or endBalance-inputValue(despencing)
  const updateStockInApi = async () => {
    selectedCommodities.forEach(async commodity => {
      await updateStock({
        dataElement: commodity.commodityId,
        categoryOptionCombo: "J2Qf1jtZuj8", //endBalance
        value: calculateValuesForRequest(commodity).updatedStockBalance,
      });
    });
  };

  //For each commodity in selectedCommodities, add a transaction to the existedTransData array, then update the transaction with transUpdateRequest
  const updateTransInApi = async () => {
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
      type: props.dispensing ? "Dispensing" : "Restock",
      commodities,
      dispensedBy: props.dispensing ? data.me.displayName : "",
      dispensedTo: props.dispensing ? recipient : data.me.displayName,
      date,
      time,
    };
    transData = [transData, ...props.existedTransData];
    await updateTrans({ data: transData });
  };

  //Calculate the updated StockBalance and get signed number
  const calculateValuesForRequest = commodity => {
    const values = {
      updatedStockBalance: 0,
      transAmount: "",
    };
    values["updatedStockBalance"] = props.dispensing
      ? Number(commodity.endBalance) - Number(commodity.amount)
      : Number(commodity.endBalance) + Number(commodity.amount);
    values["transAmount"] = props.dispensing
      ? "-" + commodity.amount
      : "+" + commodity.amount;
    return values;
  };

  if (error) return <span>ERROR in getting stock data: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    const allCommodities = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements,
      props.transactionData
    ).sort((a, b) => a.commodityName.localeCompare(b.commodityName));

    return (
      <Modal large>
        <ModalTitle>
          {props.dispensing ? "New Dispensing" : "Add Restock"}
        </ModalTitle>
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

          {/* Main section */}
          <CommoditySelector
            stockData={allCommodities}
            addCommodity={addCommodity}
            selectedCommodities={selectedCommodities}
            removeCommodity={removeCommodity}
            setAmount={setAmount}
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
