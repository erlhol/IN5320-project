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
  Input,
} from "@dhis2/ui";

import { spacers, spacersNum } from "@dhis2/ui";
import classes from "../../App.module.css";

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
  return (
    <div>
      <h3>Commodity Selection</h3>
      <div className={classes.commoditySelectorContainer}>
        <div className={classes.commoditySingleSelect}>
          <SingleSelect
            filterable
            onChange={e => selectCommodity(e.selected)}
            placeholder="Select Commodity"
            selected={selectedCommodity}
          >
            {props.stockData.map(commodity => (
              <SingleSelectOption
                label={commodity.commodityName}
                value={commodity.commodityName}
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
          <Table>
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
                <TableRow>
                  <TableCell>{commodity.commodityName}</TableCell>
                  <TableCell>{commodity.endBalance}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: spacersNum.dp8 }}>
                      <Input
                        type="number"
                        value={commodity.amountToRestock}
                        onChange={e =>
                          props.setAmountToRestock(commodity, e.value)
                        }
                      />
                      <Button onClick={() => props.removeCommodity(commodity)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6.6129 5.2097L6.70711 5.29289L12 10.585L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0676 5.65338 19.0953 6.22061 18.7903 6.6129L18.7071 6.70711L13.415 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3466 19.0676 17.7794 19.0953 17.3871 18.7903L17.2929 18.7071L12 13.415L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.93241 18.3466 4.90468 17.7794 5.2097 17.3871L5.29289 17.2929L10.585 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.65338 4.93241 6.22061 4.90468 6.6129 5.2097Z"
                            fill="#4A5768"
                          />
                        </svg>
                      </Button>
                    </div>
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

/*


const CommoditySelector = (
  stockData,
  addCommodity,
  removeCommodity,
  selectedCommodities
) => {
  return (
    <div>
      <h3>Commodity section</h3>
      <SingleSelect
        className="select"
        filterable
        onChange={e => addCommodity(e.selected)}
        placeholder="Select Commodity"
      >
        {stockData.map(commodity => (
          <SingleSelectOption
            label={commodity.commodityName}
            value={commodity}
          />
        ))}
      </SingleSelect>
      <div style={{ paddingTop: spacers.dp24 }}>
        {selectedCommodities.length == 0 && (
          <NoticeBox title="No commodity selected">
            Search for a commodity to add it to the dispensing.
          </NoticeBox>
        )}
        {selectedCommodities.length > 0 && (
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCellHead>Commodity Name</TableCellHead>
                <TableCellHead>Stock Balance</TableCellHead>
                <TableCellHead>Amount to Restock</TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {selectedCommodities.map((commodity, i) => (
                <TableRow>
                  <TableCell>{commodity.commodityName}</TableCell>
                  <TableCell>{commodity.endBalance}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: "100px" }}>
                      <Input
                        type="number"
                        value={commodity.amountToRestock}
                        onChange={e => (commodity.amountToRestock = e.value)}
                      />
                      <Button onClick={() => removeCommodity(commodity)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6.6129 5.2097L6.70711 5.29289L12 10.585L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0676 5.65338 19.0953 6.22061 18.7903 6.6129L18.7071 6.70711L13.415 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3466 19.0676 17.7794 19.0953 17.3871 18.7903L17.2929 18.7071L12 13.415L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.93241 18.3466 4.90468 17.7794 5.2097 17.3871L5.29289 17.2929L10.585 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.65338 4.93241 6.22061 4.90468 6.6129 5.2097Z"
                            fill="#4A5768"
                          />
                        </svg>
                      </Button>
                    </div>
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
export default CommoditySelector; */
