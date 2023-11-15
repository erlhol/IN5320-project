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
import PreselectionHeader from "./PreselectionHeader";
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

  const preselectCommodity = commodity => {
    if (
      !props.preselectedCommodities.some(
        item => item.commodityName === commodity.commodityName
      )
    ) {
      props.setPreselectedCommodities([
        ...props.preselectedCommodities,
        commodity,
      ]);
    } else {
      props.setPreselectedCommodities(
        props.preselectedCommodities.filter(
          item => item.commodityName !== commodity.commodityName
        )
      );
      console.log("Unpreselecting " + commodity.commodityName);
    }
  };

  const checked = commodity =>
    props.preselectedCommodities.some(
      item => item.commodityName === commodity.commodityName
    );

  const preselectAllCommodities = () => {
    if (props.preselectedCommodities.length !== props.commodities.length) {
      props.setPreselectedCommodities([...props.commodities]); //TODO: just select visible Stock
    } else {
      props.setPreselectedCommodities([]);
    }
  };

  const dispenseSingleCommodity = commodity => {
    props.setPreselectedCommodities(commodity);
    // show modal
  };

  return (
    <>
      {selectedStock && (
        <StockDetail
          selectedStock={selectedStock}
          onClose={handleSetSelectedStock}
        ></StockDetail>
      )}
      {props.preselectedCommodities.length > 0 && (
        <PreselectionHeader number={props.preselectedCommodities.length} />
      )}
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader width="48px">
              <Checkbox
                onChange={() => preselectAllCommodities()}
                checked={
                  props.preselectedCommodities.length ===
                  props.commodities.length
                }
              />
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
                  onChange={() => preselectCommodity(commodity)}
                  checked={checked(commodity)}
                />
                {/* if it should be checked, add the property: checked */}
              </DataTableCell>
              <DataTableCell onClick={() => handleSetSelectedStock(commodity)}>
                {commodity.commodityName}
              </DataTableCell>
              <DataTableCell onClick={() => handleSetSelectedStock(commodity)}>
                {commodity.endBalance}
              </DataTableCell>
              <DataTableCell onClick={() => handleSetSelectedStock(commodity)}>
                {commodity.consumption}
              </DataTableCell>
              <DataTableCell onClick={() => handleSetSelectedStock(commodity)}>
                <div className={classes.commodityTableLastDispensing}>
                  <span>{commodity.lastDispensingDate}</span>
                  <span>{commodity.lastDispensingAmount}</span>
                </div>
              </DataTableCell>
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
