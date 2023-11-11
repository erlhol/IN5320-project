import React from "react";
import { useState, useEffect } from "react";

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
  IconCheckmark16,
  IconCross24,
  Tooltip,
} from "@dhis2/ui";

import { spacers, spacersNum } from "@dhis2/ui";
import modalStyles from "./CommodityTransferModal.module.css";

const CommoditySelect = props => {
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
      return "Amount must be a positive number";
    } else if (value > stockBalance && props.dispensing) {
      return "Amount cannot be greater than stock balance";
    }
  };

  const onChangeInput = (commodity, value) => {
    props.setAmountToRestock(commodity, value);
  };

  return (
    <div className={modalStyles.test}>
      <h3>Commodity Selection</h3>
      <div className={modalStyles.commoditySelectorContainer}>
        <div className={modalStyles.commoditySingleSelect}>
          <SingleSelect
            filterable
            onChange={selectedOption =>
              selectCommodity(selectedOption.selected)
            }
            placeholder="Select Commodity"
            selected={selectedCommodity}
          >
            {props.stockData.map(commodity => (
              <SingleSelectOption
                label={
                  <div className={modalStyles.verticalAllign}>
                    {commodity.commodityName}
                    {showSelectedCheckmark(commodity.commodityName) &&
                      selectedCommodity != commodity.commodityName && (
                        <IconCheckmark16 />
                      )}
                  </div>
                }
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
          primary={!addButtonDisabled}
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
                <TableCellHead>Commodity Name</TableCellHead>
                <TableCellHead>Stock Balance</TableCellHead>
                <TableCellHead>
                  {props.dispensing
                    ? "Amount to Dispense"
                    : "Amount to Restock"}
                </TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {props.selectedCommodities.map((commodity, i) => (
                <TableRow className={modalStyles.tableRow}>
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
                      error={commodity.inputError != ""}
                      type="number"
                      value={commodity.amountToRestock}
                      onChange={e => onChangeInput(commodity, e.value)}
                      validationText={
                        // props.submitAttempted ? commodity.inputError : ""
                        <div className={modalStyles.validationText}>
                          {" "}
                          {commodity.inputError}
                        </div>
                      }
                    />
                    <Button
                      className={modalStyles.removeButton}
                      onClick={() => props.removeCommodity(commodity)}
                    >
                      <IconCross24 />
                    </Button>
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
export default CommoditySelect;
