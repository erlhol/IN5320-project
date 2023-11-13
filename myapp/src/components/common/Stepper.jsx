import React from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  Chip,
  CircularLoader,
  InputField,
  SingleSelectOption,
  SingleSelectField,
} from "@dhis2/ui";
import { useState, useEffect } from "react";
import {
  stockRequest,
  stockUpdateRequest,
  transUpdateRequest,
} from "../../utilities/requests";
import { getCurrentMonth, getDateAndTime } from "../../utilities/dates";
import { mergeCommodityAndValue } from "../../utilities/dataUtility";
import { DataQuery, useDataQuery, useDataMutation } from "@dhis2/app-runtime";

const Step = props => {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Chip>{props.step}</Chip>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>Step {props.step}</p>
        <p>{props.step_name}</p>
      </div>
    </div>
  );
};

const Stepper = props => {
  /* props.step1, props.step2, props.step3 */
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [updateStock] = useDataMutation(stockUpdateRequest);
  const [updateTrans] = useDataMutation(transUpdateRequest);

  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const addToSelectedCommodities = commodity => {
    const commodityAlreadySelected = selectedCommodities.find(
      c => c.commodityName === commodity.commodityName
    );
    if (!commodityAlreadySelected) {
      commodity["inputValue"] = null;
      setSelectedCommodities([...selectedCommodities, commodity]);
    }
  };

  const removeFromSelectedCommodities = commodityName => {
    const updatedCommodities = selectedCommodities.filter(
      commodity => commodity.commodityName !== commodityName
    );
    return updatedCommodities;
  };

  const getCommodityInputValue = commodityName => {
    const commodity = selectedCommodities.find(
      commodity => commodity.commodityName === commodityName
    );
    return commodity.inputValue;
  };

  const setCommodityInputValue = (name, value) => {
    const updatedCommodies = selectedCommodities.map(commodity => {
      if (commodity.commodityName === name)
        return { ...commodity, inputValue: value };
      return commodity; // Return unchanged commodities
    });
    setSelectedCommodities(updatedCommodies);
  };

  const onConfirm = async () => {
    await updateTransInApi();
    await updateStockInApi();
    props.refetchData();
    alert("Stock/Dispensing successfully added!!");
  };

  //For each commodity in selectedCommodities, update  the endBalance to endBalance+inputValue(add stock) or endBalance-inputValue(despencing)
  const updateStockInApi = async () =>
    selectedCommodities.forEach(async commodity => {
      await updateStock({
        dataElement: commodity.commodityId,
        categoryOptionCombo: "J2Qf1jtZuj8", //endBalance
        value: getValuesBasedOnTitel(commodity).updatedStockBalance,
      });
    });

  //For each commodity in selectedCommodities, add a transaction to the existedTransData array, then update the transaction with transUpdateRequest
  const updateTransInApi = async () => {
    const commodities = selectedCommodities.map(commodity => {
      const { updatedStockBalance, transAmount } =
        getValuesBasedOnTitel(commodity);
      return {
        commodityId: commodity.commodityId,
        commodityName: commodity.commodityName,
        amount: transAmount,
        balanceAfterTrans: updatedStockBalance,
      };
    });

    const { date, time } = getDateAndTime(new Date());
    let transData = {
      type: props.title === "New dispensing" ? "Dispensing" : "Restock",
      commodities,
      dispensedBy: data.me.displayName,
      dispensedTo: "test",
      date,
      time,
    };
    transData = [transData, ...props.existedTransData];
    await updateTrans({ data: transData });
  };

  const getValuesBasedOnTitel = commodity => {
    const allValues = {
      updatedStockBalance: 0,
      transAmount: "",
    };
    allValues["updatedStockBalance"] =
      props.title === "New dispensing"
        ? Number(commodity.endBalance) - Number(commodity.inputValue)
        : Number(commodity.endBalance) + Number(commodity.inputValue);
    allValues["transAmount"] =
      props.title === "New dispensing"
        ? "-" + commodity.inputValue
        : "+" + commodity.inputValue;
    return allValues;
  };

  if (error) return <span>ERROR in getting stock data: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    const allCommodities = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements,
      props.transactionData
    );

    return (
      <Modal onClose={() => props.onClose("")} large>
        <ModalTitle>{props.title}</ModalTitle>
        <ModalContent>
          <div style={{ display: "flex", gap: "10px" }}>
            {/* Steps: */}
            <div
              style={{ display: "flex", gap: "20px", flexDirection: "column" }}
            >
              <Step step={1} step_name={"Commodity"}></Step>
              <Step step={2} step_name={"Additional information"}></Step>
              <Step step={3} step_name={"Dispensing summary"}></Step>
            </div>
            {/* Main section */}
            <div>
              <h3>Commodity section</h3>
              <SingleSelectField
                onChange={value => addToSelectedCommodities(value.selected)}
              >
                {allCommodities.map(c => (
                  <SingleSelectOption
                    key={c.commodityName}
                    label={c.commodityName}
                    value={c}
                  />
                ))}
              </SingleSelectField>
              {selectedCommodities.map(selectedCommodity => (
                <div
                  style={{
                    display: "flex",
                  }}
                  key={selectedCommodities.commodityId}
                >
                  <div>{selectedCommodity.commodityName}</div>
                  <div>{selectedCommodity.endBalance}</div>
                  <InputField
                    value={getCommodityInputValue(
                      selectedCommodity.commodityName
                    )}
                    name={selectedCommodity.commodityName}
                    onChange={({ name, value }) =>
                      setCommodityInputValue(name, value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <ButtonStrip end>
            <Button onClick={() => console.log("Hei")} secondary>
              Previous
            </Button>
            <Button onClick={() => onConfirm()} primary>
              Next
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    );
  }
};
export default Stepper;
