import React from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  Chip,
} from "@dhis2/ui";
import Search from "./Search";
import {
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
} from "../../requests";
import { mergeCommodityAndValue } from "../../utilities";
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
  // {id, name, balance, newBalance}
  const [selectedCommodities, setSelectedCommodities] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: "202310" },
  });

  useEffect(() => {
    console.log("selectedCommodities: ", selectedCommodities);
  }, [selectedCommodities]);

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

  const [updateStock] = useDataMutation(stockUpdateRequest);
  const [updateTrans] = useDataMutation(transUpdateRequest);

  const onConfirm = () => {
    if (props.title === "Add stock") updateStockInApi();
    if (props.title === "New dispensing") updateTransInApi();
  };

  // case1: If it's add stock, for each commodity in selectedCommodities, update  the endBalance to endBalance+inputValue
  const updateStockInApi = () =>
    selectedCommodities.forEach(commodity => {
      updateStock({
        dataElement: commodity.commodityId,
        categoryOptionCombo: "J2Qf1jtZuj8", //endBalance
        value: commodity.inputValue + commodity.endBalance,
      });
    });

  // case2: If it's add dispensing,for each commodity in selectedCommodities,update  the endBalance to endBalance-inputValue with stockUpdateRequest AND add a transaction to the array, then update the transaction with transUpdateRequest
  const updateTransInApi = () => {
    let transData = selectedCommodities.map(commodity => {
      const balanceAfterTrans = commodity.endBalance - commodity.inputValue;
      return {
        commodityId: commodity.commodityId,
        commodityName: commodity.commodityName,
        amount: -commodity.inputValue,
        balanceAfterTrans,
        dispensedBy: "",
        dispensedTo: "",
        date: "",
        time: "",
      };
    });
    transData = { ...transData, ...props.existedTransData };
    updateTrans({ data: transData });
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
              {/* <Search
                placeholder="Search commodity"
                width={"320px"}
                onClick={() => setShoswDropDown(true)}
              ></Search> */}
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
            <Button onClick={() => console.log("Hei")} primary>
              Next
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    );
  }
};
export default Stepper;
