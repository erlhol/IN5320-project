import React from "react";
import { useState, useEffect } from "react";
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
} from "@dhis2/ui";
import { spacers } from "@dhis2/ui";
import StockDetail from "./StockDetailModal";
import PreselectionHeader from "./PreselectionHeader";
import classes from "./StockOverview.module.css";
import commonclasses from "../../App.module.css";
import { getCurrentMonthName } from "../../utilities/dates";

const CommodityTable = props => {
  const [selectedStock, setSelectedStock] = useState(null); // No stock selected by default
  // State for the current pageSize selected
  const [pageSize, setPageSize] = useState(10);

  // State for displayed commodities
  const [displayedCommodities, setDisplayedCommodities] = useState([]);

  /* The sorting logic */
  // State for sorting order
  const [sortOrder, setSortOrder] = useState({
    column: "commodityName", // Default sorting column
    order: "asc", // Default sorting order
  });

  const handleSetSelectedStock = value => {
    setSelectedStock(value);
  };

  // Handles the event when you want to change the sort order. If it is the same column, then we change the order, if it is not, we set the new order to asc
  const handleSort = column => {
    setSortOrder(prevSortOrder => ({
      column,
      order:
        prevSortOrder.column === column && prevSortOrder.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  useEffect(() => {
    // Update displayedCommodities whenever commodities, sortOrder, currentPage, or pageSize changes
    const sortedData = [...props.commodities].sort((a, b) => {
      const columnA = a[sortOrder.column];
      const columnB = b[sortOrder.column];
      if (sortOrder.order === "asc") {
        return columnA > columnB ? 1 : -1;
      } else {
        return columnA < columnB ? 1 : -1;
      }
    });

    const startIndex = (props.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    setDisplayedCommodities(paginatedData);
  }, [props.commodities, sortOrder, props.currentPage, pageSize]);

  // Handles a update of pagesize. This will reset current page (set current page to 1)
  const handlePageSize = size => {
    setPageSize(size);
    props.setCurrentPage(1);
  };

  const handleCurrentPage = page => {
    props.setCurrentPage(page);
  };

  // Return the pageCount. This is based on the number of commodities. If the number is not round, for instance 2.4, then we will need to 2 pages + 1 page with the remaining amount of commodities
  const pageCount = () => {
    return (props.commodities.length / pageSize) % 1 != 0
      ? Math.floor(props.commodities.length / pageSize) + 1
      : props.commodities.length / pageSize;
  };

  const preselectCommodity = commodity => {
    if (
      !props.preselectedCommodities.some(
        item => item.commodityName === commodity.commodityName
      )
    ) {
      const updatedPreselectCommodities = [
        ...props.preselectedCommodities,
        commodity,
      ];
      props.setPreselectedCommodities(updatedPreselectCommodities);
      props.setNumberMultiselected(updatedPreselectCommodities.length);
    } else {
      const updatedPreselectCommodities = props.preselectedCommodities.filter(
        item => item.commodityName !== commodity.commodityName
      );
      props.setPreselectedCommodities(updatedPreselectCommodities);
      props.setNumberMultiselected(updatedPreselectCommodities.length);
    }
  };

  const checked = commodity =>
    props.preselectedCommodities.some(
      item => item.commodityName === commodity.commodityName
    );

  const checkSelectAllCheckmark = () => {
    if (displayedCommodities.length === 0) {
      return false;
    }
    return displayedCommodities.every(commodity =>
      props.preselectedCommodities.some(
        selected => selected.commodityName === commodity.commodityName
      )
    );
  };

  const preselectAllCommodities = () => {
    // Check if all displayed commodities are already selected
    const areAllDisplayedSelected = displayedCommodities.every(commodity =>
      props.preselectedCommodities.some(
        selected => selected.commodityName === commodity.commodityName
      )
    );

    if (!areAllDisplayedSelected) {
      //  Select all displayed commodities that are not selected ye
      const newSelections = displayedCommodities.filter(
        displayed =>
          !props.preselectedCommodities.some(
            selected => selected.commodityName === displayed.commodityName
          )
      );

      const updatedPreselectCommodities = [
        ...props.preselectedCommodities,
        ...newSelections,
      ];
      props.setPreselectedCommodities(updatedPreselectCommodities);
      props.setNumberMultiselected(updatedPreselectCommodities.length);
    } else {
      // Deselect all displayed commodities
      props.setPreselectedCommodities(
        props.preselectedCommodities.filter(
          selected =>
            !displayedCommodities.some(
              displayed => displayed.commodityName === selected.commodityName
            )
        )
      );
      props.setNumberMultiselected(props.numberMultiSelected - displayedCommodities.length);
    }
  };

  const dispenseSingleCommodity = commodity => {
    props.setPreselectedCommodities([commodity]);
    props.handleOnModalChange("dispensing");
  };

  return (
    <>
      {selectedStock && (
        <StockDetail
          selectedStock={selectedStock}
          onClose={handleSetSelectedStock}
          transactions={props.transactions}
          monthlyStockData={props.monthlyStockData}
        />
      )}
      <div className={classes.commodityTable}>
        {/* Change the test*/}
        {props.numberMultiSelected > 0 && (
          <PreselectionHeader
            number={props.numberMultiSelected}
            handleOnModalChange={props.handleOnModalChange}
          />
        )}
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader width={spacers.dp48}>
                <Checkbox
                  onChange={() => preselectAllCommodities()}
                  checked={checkSelectAllCheckmark()}
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
                Commodity name
              </DataTableColumnHeader>
              <DataTableColumnHeader
                onSortIconClick={() => handleSort("endBalance")}
                sortDirection={
                  sortOrder.column === "endBalance"
                    ? sortOrder.order
                    : "default"
                }
                sortIconTitle="Sort by Stock Balance"
                width={spacers.dp192}
              >
                Stock balance
              </DataTableColumnHeader>
              <DataTableColumnHeader
                onSortIconClick={() => handleSort("consumption")}
                sortDirection={
                  sortOrder.column === "consumption"
                    ? sortOrder.order
                    : "default"
                }
                sortIconTitle="Sort by Consumption"
                width={spacers.dp192}
              >
                Consumption for {getCurrentMonthName()}
              </DataTableColumnHeader>
              <DataTableColumnHeader width={spacers.dp256}>
                Last dispensed amount
              </DataTableColumnHeader>
              <DataTableColumnHeader width={spacers.dp128} />
            </DataTableRow>
          </TableHead>
          <TableBody>
            {displayedCommodities.length > 0 &&
              displayedCommodities.map((commodity, i) => (
                <DataTableRow key={i}>
                  {/* if the row should be selected, add the property: selected */}
                  <DataTableCell
                    className={commonclasses.clickable}
                    width={spacers.dp48}
                  >
                    <Checkbox
                      onChange={() => preselectCommodity(commodity)}
                      checked={checked(commodity)}
                    />
                    {/* if it should be checked, add the property: checked */}
                  </DataTableCell>
                  <DataTableCell
                    className={commonclasses.clickable}
                    onClick={() => handleSetSelectedStock(commodity)}
                  >
                    {commodity.commodityName}
                  </DataTableCell>
                  <DataTableCell
                    className={commonclasses.clickable}
                    onClick={() => handleSetSelectedStock(commodity)}
                  >
                    {commodity.endBalance}
                  </DataTableCell>
                  <DataTableCell
                    className={commonclasses.clickable}
                    onClick={() => handleSetSelectedStock(commodity)}
                  >
                    {commodity.consumption}
                  </DataTableCell>
                  <DataTableCell
                    className={commonclasses.clickable}
                    onClick={() => handleSetSelectedStock(commodity)}
                  >
                    <div className={classes.commodityTableLastDispensing}>
                      <span>{commodity.lastDispensingDate}</span>
                      <span>{commodity.lastDispensingAmount}</span>
                    </div>
                  </DataTableCell>
                  <DataTableCell className={classes.dispenseColumn}>
                    <Button
                      name="Small button"
                      onClick={() => dispenseSingleCommodity(commodity)}
                      small
                      value="default"
                    >
                      Dispense
                    </Button>
                  </DataTableCell>
                </DataTableRow>
              ))}
            {displayedCommodities.length === 0 && (
              <DataTableRow>
                <DataTableCell colSpan="6">No commodities found</DataTableCell>
              </DataTableRow>
            )}
          </TableBody>
          <TableFoot>
            <DataTableRow>
              <DataTableCell colSpan="6">
                <Pagination
                  onPageChange={handleCurrentPage}
                  onPageSizeChange={handlePageSize}
                  page={props.currentPage}
                  pageCount={pageCount()}
                  pageSize={pageSize}
                  total={props.commodities.length}
                />
              </DataTableCell>
            </DataTableRow>
          </TableFoot>
        </DataTable>
      </div>
    </>
  );
};

export default CommodityTable;
