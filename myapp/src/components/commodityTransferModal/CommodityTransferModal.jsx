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
  ReactFinalForm,
  InputFieldFF,
} from "@dhis2/ui";

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
  checkDateInFuture,
} from "../../utilities/dataUtility";
import { getDateAndTime } from "../../utilities/dates";

const CommodityTransferModal = props => {
  const [updateStock] = useDataMutation(stockUpdateRequest);
  const [updateTrans] = useDataMutation(transUpdateRequest);
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [cancelModalPresent, setCancelModalPresent] = useState(false);

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

  const removeCommodity = (commodity, form) => {
    setSelectedCommodities(
      selectedCommodities.filter(
        selectedCommodity => selectedCommodity !== commodity
      )
    );
    form.change(commodity.commodityId, undefined); //removes input value from
  };

  const onSubmit = async values => {
    const commoditiesToSubmit = mergeFormWithCommodities(values);
    await updateStockInApi(commoditiesToSubmit);
    await updateTransInApi(
      commoditiesToSubmit,
      values.datetime,
      values.recipient
    );
    await props.refetchData(props.dispensing);
    props.onClose();
  };

  const updateStockInApi = async () => {
    const dataValues = [];
    selectedCommodities.forEach(async commodity => {
      const dataElement = commodity.commodityId;
      const period = getCurrentMonth();
      const endBalanceInfo = {
        dataElement,
        period,
        value: calculateValuesForRequest(commodity).updatedStockBalance,
        categoryOptionCombo: "J2Qf1jtZuj8",
      };
      dataValues.push(endBalanceInfo);

      // update consumption if it is a dispensing
      if (props.dispensing) {
        const consumptionInfo = {
          dataElement,
          period,
          value: Number(commodity.consumption) + Number(commodity.amount),
          categoryOptionCombo: "rQLFnNXXIL0",
        };
        dataValues.push(consumptionInfo);
      }

      //console.log("updateStockParameter", updateStockParameter);
      await updateStock({ dataValues, period });
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

    const { date, time } = getDateAndTime(new Date());
    let transData = {
      type: props.dispensing ? "Dispensing" : "Restock",
      commodities,
      dispensedBy: data.me.displayName,
      dispensedTo: "test",
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
    values.updatedStockBalance = props.dispensing
      ? Number(commodity.endBalance) - Number(commodity.amount)
      : Number(commodity.endBalance) + Number(commodity.amount);
    values.transAmount = props.dispensing
      ? "-" + commodity.amount
      : "+" + commodity.amount;
    return values;
  };

  const mergeFormWithCommodities = values => {
    const commoditiesWithAmounts = selectedCommodities;
    commoditiesWithAmounts.forEach(commodity => {
      commodity.amount = values[commodity.commodityId];
    });
    return commoditiesWithAmounts;
  };

  const dateTimeValidation = value => {
    if (checkDateInFuture(value)) {
      return "Date and time must not be in the future";
    } else if (value == "" || value == undefined || value == null) {
      return "Date and time is required";
    } else {
      return "";
    }
  };

  const recipientValidation = value => {
    if (value?.trim() == "" || value == undefined || value == null) {
      return "Enter recipient name";
    } else {
      return "";
    }
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
        <ReactFinalForm.Form onSubmit={onSubmit}>
          {({ handleSubmit, form, pristine, valid }) => (
            <form onSubmit={handleSubmit}>
              <ModalTitle>
                {props.dispensing ? "New Dispensing" : "Add Restock"}
              </ModalTitle>
              <ModalContent
                className={modalStyles.commodityTransferModalContent}
              >
                <div className={modalStyles.dateTimeRecipientContainer}>
                  <div className={modalStyles.dateTimePicker}>
                    <ReactFinalForm.Field
                      name="datetime"
                      label="Date and time"
                      component={InputFieldFF}
                      initialValue="none"
                      type="datetime-local"
                      required
                      validate={dateTimeValidation}
                    />
                  </div>
                  {props.dispensing && (
                    <div className={modalStyles.recipientInputContainer}>
                      <ReactFinalForm.Field
                        required
                        name="recipient"
                        label="Recipient"
                        component={InputFieldFF}
                        validate={recipientValidation}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <CommoditySelector
                    stockData={allCommodities}
                    addCommodity={addCommodity}
                    selectedCommodities={selectedCommodities}
                    removeCommodity={removeCommodity}
                    dispensing={props.dispensing}
                    form={form}
                  />
                </div>
              </ModalContent>
              <ModalActions>
                <ButtonStrip end>
                  <Button onClick={() => setCancelModalPresent(true)} secondary>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    primary
                    disabled={
                      pristine || !valid || selectedCommodities.length < 1
                    }
                  >
                    Submit
                  </Button>
                </ButtonStrip>
              </ModalActions>
            </form>
          )}
        </ReactFinalForm.Form>
        {cancelModalPresent && (
          <CancelConfirmationModal
            setCancelModalPresent={setCancelModalPresent}
            onClose={props.onClose}
          />
        )}
      </Modal>
    );
  }
};

export default CommodityTransferModal;
