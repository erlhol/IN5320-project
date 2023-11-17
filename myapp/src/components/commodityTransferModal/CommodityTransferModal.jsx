import React, { useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  ReactFinalForm,
  InputFieldFF,
} from "@dhis2/ui";

import CancelConfirmationModal from "./CancelConfirmationModal";
import CommoditySelector from "./CommoditySelector";
import modalStyles from "./CommodityTransferModal.module.css";
import { getCurrentMonth } from "../../utilities/dates";
import { useDataMutation } from "@dhis2/app-runtime";
import {
  stockUpdateRequest,
  transUpdateRequest,
} from "../../utilities/requests";
import { checkDateInFuture } from "../../utilities/dataUtility";

import { getDateAndTime, getYearMonth } from "../../utilities/dates";
const CommodityTransferModal = props => {
  const [updateStock] = useDataMutation(stockUpdateRequest);
  const [updateTrans] = useDataMutation(transUpdateRequest);
  const [selectedCommodities, setSelectedCommodities] = useState(
    props.preselectedCommodities
  );
  const [cancelModalPresent, setCancelModalPresent] = useState(false);
  // Add commodity to array
  const addCommodity = commodity => {
    const commodityWithRestockAmount = {
      ...commodity,
      amount: "",
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
    await updateStockInApi(commoditiesToSubmit, values.datetime);
    await updateTransInApi(
      commoditiesToSubmit,
      values.datetime,
      values.recipient
    );
    await props.refetchData(props.dispensing);
    props.onClose();
  };

  const updateStockInApi = async (commoditiesToSubmit, datetime) => {
    const dataValues = [];
    commoditiesToSubmit.forEach(async commodity => {
      const dataElement = commodity.commodityId;
      const period = getYearMonth(getDateAndTime(new Date(datetime))[0]);
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
          value:
            period === getCurrentMonth()
              ? Number(commodity.consumption) + Number(commodity.amount)
              : Number(commodity.consumption),
          categoryOptionCombo: "rQLFnNXXIL0",
        };
        dataValues.push(consumptionInfo);
      }
      await updateStock({ dataValues, period });
    });
  };

  //For each commodity in selectedCommodities, add a transaction to the existedTransData array, then update the transaction with transUpdateRequest
  const updateTransInApi = async (commoditiesToSubmit, datetime, recipient) => {
    const commodities = commoditiesToSubmit.map(commodity => {
      const { updatedStockBalance, transAmount } =
        calculateValuesForRequest(commodity);
      return {
        commodityId: commodity.commodityId,
        commodityName: commodity.commodityName,
        amount: transAmount,
        balanceAfterTrans: updatedStockBalance,
      };
    });

    const { date, time } = getDateAndTime(new Date(datetime));

    let transData = {
      type: props.dispensing ? "Dispensing" : "Restock",
      commodities,
      dispensedBy: props.dispensing ? props.displayName : "",
      dispensedTo: props.dispensing ? recipient : props.displayName,
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
    } else if (
      value == "" ||
      value == undefined ||
      value == null ||
      value == "none"
    ) {
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

  if (!props.allCommodities) return <span>ERROR in getting stock data</span>;
  return (
    <Modal large>
      <ReactFinalForm.Form onSubmit={onSubmit}>
        {({ handleSubmit, form, pristine, valid }) => (
          <form onSubmit={handleSubmit}>
            <ModalTitle>
              {props.dispensing ? "New Dispensing" : "Add Restock"}
            </ModalTitle>
            <ModalContent className={modalStyles.commodityTransferModalContent}>
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
                  stockData={props.allCommodities.sort((a, b) =>
                    a.commodityName.localeCompare(b.commodityName)
                  )}
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
};

export default CommodityTransferModal;
