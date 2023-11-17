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
  InputFieldFF,
  IconCross24,
  ReactFinalForm,
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

  const commodityAlreadySelected = selectedCommodityName => {
    return props.selectedCommodities.some(
      commodity => commodity.commodityName === selectedCommodityName
    );
  };

  const validateInput = (value, stockBalance, dispensing) => {
    if (value == "" || value == null || value == undefined || value == 0) {
      if (dispensing) {
        return "Enter amount to dispense";
      }
      return "Enter amount to restock";
    } else if (!Number.isInteger(Number(value))) {
      return "Only whole amounts allowed";
    } else if (value < 0) {
      return "Amount must be a positive";
    } else if (value > stockBalance && props.dispensing) {
      return "Stock balance not sufficient";
    } else {
      return "";
    }
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
                disabled={commodityAlreadySelected(commodity.commodityName)}
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
                    <ReactFinalForm.Field
                      className={modalStyles.amountInput}
                      dense
                      required
                      type="number"
                      name={commodity.commodityId}
                      component={InputFieldFF}
                      validate={e =>
                        validateInput(e, commodity.endBalance, props.dispensing)
                      }
                    />
                    <Button
                      small
                      icon={<IconCross24 />}
                      className={modalStyles.removeButton}
                      onClick={() =>
                        props.removeCommodity(commodity, props.form)
                      }
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
