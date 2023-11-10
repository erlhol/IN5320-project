import React from "react";
import { useState } from "react";
import {
  Button,
  DataTable,
  DataTableRow,
  DataTableColumnHeader,
  TableHead,
  Checkbox,
  TableBody,
  DataTableCell,
  TableFoot,
  Pagination,
  IconInfo24,
  MenuItem,
} from "@dhis2/ui";
import StockDetail from "./StockDetail";
import classes from "../../App.module.css";

const CommodityTable = props => {
  const [selectedStock, setSelectedStock] = useState(null); // No stock selected by default

  const [sortOrder, setSortOrder] = useState({
    column: "commodityName", // Default sorting column
    order: "asc", // Default sorting order
  });

  const handleSetSelectedStock = value => {
    setSelectedStock(value);
  };

  const handleSort = column => {
    setSortOrder(prevSortOrder => ({
      column,
      order:
        prevSortOrder.column === column && prevSortOrder.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // A sorting function that compares two and two elements a and b
  const sortedData = [...props.commodities].sort((a, b) => {
    const columnA = a[sortOrder.column];
    const columnB = b[sortOrder.column];
    if (sortOrder.order === "asc") {
      return columnA > columnB ? 1 : -1;
    } else {
      return columnA < columnB ? 1 : -1;
    }
  });

  return (
    <>
      {selectedStock && (
        <StockDetail
          selectedStock={selectedStock}
          onClose={handleSetSelectedStock}
        ></StockDetail>
      )}
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader width="48px">
              <Checkbox onChange={() => console.log("Toggle All")} />
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => handleSort("commodityName")}
              sortDirection={
                sortOrder.column === "commodityName"
                  ? sortOrder.order
                  : "default"
              }
              sortIconTitle="Sort by Commodity Name"
            >
              Commodity Name
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => handleSort("endBalance")}
              sortDirection={
                sortOrder.column === "endBalance" ? sortOrder.order : "default"
              }
              sortIconTitle="Sort by Stock Balance"
            >
              Stock Balance
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => handleSort("consumption")}
              sortDirection={
                sortOrder.column === "consumption" ? sortOrder.order : "default"
              }
              sortIconTitle="Sort by Consumption"
            >
              Monthly Consumption
            </DataTableColumnHeader>
            <DataTableColumnHeader>Last Dispensing</DataTableColumnHeader>
            <DataTableColumnHeader></DataTableColumnHeader>
          </DataTableRow>
        </TableHead>

        <TableBody>
          {sortedData.map((commodity, i) => (
            <DataTableRow key={i}>
              {/* if the row should be selected, add the property: selected */}
              <DataTableCell width="48px">
                <Checkbox
                  onChange={() => console.log("Toggle selected ID " + i)}
                  value={"" + i}
                />
                {/* if it should be checked, add the property: checked */}
              </DataTableCell>
              <DataTableCell>
                <div className={classes.inlineFlex}>
                  <p>{commodity.commodityName}</p>
                  <MenuItem
                    onClick={() => handleSetSelectedStock(commodity)}
                    icon={<IconInfo24></IconInfo24>}
                  ></MenuItem>
                </div>
              </DataTableCell>
              <DataTableCell>{commodity.endBalance}</DataTableCell>
              <DataTableCell>{commodity.consumption}</DataTableCell>
              <DataTableCell>{commodity.lastDispensing}</DataTableCell>
              <DataTableCell>
                <Button
                  name="Small button"
                  onClick={() => console.log("Dispense ID " + i)}
                  small
                  value="default"
                >
                  Dispense
                </Button>
              </DataTableCell>
            </DataTableRow>
          ))}
        </TableBody>
        <TableFoot>
          <DataTableRow>
            <DataTableCell colSpan="6">
              {/* TODO: add pagination logic */}
              <Pagination
                onPageChange={() => console.log("Page Changed")}
                onPageSizeChange={() => console.log("Page Size Changed")}
                page={1}
                pageCount={2}
                pageSize={10}
                total={props.commodities.length}
              />
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      </DataTable>
    </>
  );
};

export default CommodityTable;
