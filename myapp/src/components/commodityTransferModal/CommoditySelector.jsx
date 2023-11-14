import React from "react";
import { useState } from "react";

import {
  SingleSelect,
  SingleSelectOption,
  Button,
  NoticeBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableRowHead,
  TableCellHead,
  InputField,
  IconCross24,
} from "@dhis2/ui";

import { spacers } from "@dhis2/ui";
import modalStyles from "./CommodityTransferModal.module.css";
import classes from "../../App.module.css";

const CommoditySelector = props => {
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);

  const selectCommodity = e => {
    setSelectedCommodity(e);
    setAddButtonDisabled(false);
  };

  const addCommodityToTable = selectedCommodity => {
    props.addCommodity(selectedCommodity);
    setSelectedCommodity("");
    setAddButtonDisabled(true);
  };

  const showSelectedCheckmark = selectedCommodityName => {
    return props.selectedCommodities.some(
      commodity => commodity.commodityName === selectedCommodityName
    );
  };

  const validateInput = (value, stockBalance) => {
    if (value === "") {
      return "Enter amount to restock";
    } else if (value < 0) {
      return "Amount must be a positive";
    } else if (value > stockBalance && props.dispensing) {
      return "Stock balance not sufficient";
    } else {
      return "";
    }
  };

  const getValidationText = inputError => {
    if (props.submitAttempted === true) {
      return inputError;
    }
    return "";
  };

  const onChangeInput = (commodity, value) => {
    props.setAmount(
      commodity,
      value,
      validateInput(value, commodity.endBalance)
    );
  };

  return (
    <div>
      <div className={classes.modalSubHeadline}>Commodity Selection</div>
      <div className={modalStyles.commoditySelectorContainer}>
        <div className={modalStyles.commoditySingleSelect}>
          <SingleSelect
            filterable
            onChange={selectedOption =>
              selectCommodity(selectedOption.selected)
            }
            placeholder="Select commodity"
            selected={selectedCommodity}
            noMatchText="No match found"
          >
            {props.stockData.map(commodity => (
              <SingleSelectOption
                label={commodity.commodityName}
                key={commodity.commodityName}
                value={commodity.commodityName}
                disabled={showSelectedCheckmark(commodity.commodityName)}
              />
            ))}
          </SingleSelect>
        </div>
        <Button
          onClick={() =>
            addCommodityToTable(
              props.stockData.find(
                commodity => commodity.commodityName === selectedCommodity
              )
            )
          }
          disabled={addButtonDisabled}
          primary
        >
          Add
        </Button>
      </div>
      <div style={{ paddingTop: spacers.dp24 }}>
        {props.selectedCommodities.length == 0 && (
          <NoticeBox title="No commodity selected">
            Search for a commodity to add it to the{" "}
            {props.dispensing ? "dispensing" : "restock"}.
          </NoticeBox>
        )}
        {props.selectedCommodities.length > 0 && (
          <Table className={modalStyles.commodityTable}>
            <TableHead>
              <TableRowHead>
                <TableCellHead>Commodity name</TableCellHead>
                <TableCellHead>Stock balance</TableCellHead>
                <TableCellHead>
                  {props.dispensing
                    ? "Amount to dispense"
                    : "Amount to restock"}
                </TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {props.selectedCommodities.map((commodity, i) => (
                <TableRow className={modalStyles.tableRow} key={i}>
                  <TableCell className={modalStyles.commodityNameCell}>
                    {commodity.commodityName}
                  </TableCell>
                  <TableCell className={modalStyles.stockBalanceCell}>
                    {commodity.endBalance}
                  </TableCell>
                  <TableCell className={modalStyles.amountCell}>
                    <InputField
                      className={modalStyles.amountInput}
                      dense
                      error={
                        commodity.inputError != "" && props.submitAttempted
                      }
                      type="number"
                      value={commodity.amount}
                      onChange={e => onChangeInput(commodity, e.value)}
                      validationText={getValidationText(commodity.inputError)}
                    />
                    <Button
                      small
                      icon={<IconCross24 />}
                      className={modalStyles.removeButton}
                      onClick={() => props.removeCommodity(commodity)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
export default CommoditySelector;
