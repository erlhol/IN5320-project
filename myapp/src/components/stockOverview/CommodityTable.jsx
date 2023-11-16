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
  IconInfo24,
  MenuItem,
} from "@dhis2/ui";
import StockDetail from "./StockDetail";
import PreselectionHeader from "./PreselectionHeader";
import { spacers } from "@dhis2/ui";
import classes from "./StockOverview.module.css";

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
      const new_array = [...props.preselectedCommodities, commodity];
      props.setPreselectedCommodities(new_array);
      props.setNumberMultiselected(new_array.length);
    } else {
      const new_array = props.preselectedCommodities.filter(
        item => item.commodityName !== commodity.commodityName
      );
      props.setPreselectedCommodities(new_array);
      props.setNumberMultiselected(new_array.length);
    }
  };

  const checked = commodity =>
    props.preselectedCommodities.some(
      item => item.commodityName === commodity.commodityName
    );

  const checkSelectAllCheckmark = () => {
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

      const new_list = [...props.preselectedCommodities, ...newSelections];
      props.setPreselectedCommodities(new_list);
      props.setNumberMultiselected(new_list.length);
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
      props.setNumberMultiselected(0);
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
                Commodity Name
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
                Stock Balance
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
                Monthly Consumption
              </DataTableColumnHeader>
              <DataTableColumnHeader width={spacers.dp256}>
                Last Dispensing
              </DataTableColumnHeader>
              <DataTableColumnHeader width={spacers.dp128} />
            </DataTableRow>
          </TableHead>
          <TableBody>
            {displayedCommodities.map((commodity, i) => (
              <DataTableRow key={i}>
                {/* if the row should be selected, add the property: selected */}
                <DataTableCell width={spacers.dp48}>
                  <Checkbox
                    onChange={() => preselectCommodity(commodity)}
                    checked={checked(commodity)}
                  />
                  {/* if it should be checked, add the property: checked */}
                </DataTableCell>
                <DataTableCell
                  onClick={() => handleSetSelectedStock(commodity)}
                >
                  {commodity.commodityName}
                </DataTableCell>
                <DataTableCell
                  onClick={() => handleSetSelectedStock(commodity)}
                >
                  {commodity.endBalance}
                </DataTableCell>
                <DataTableCell
                  onClick={() => handleSetSelectedStock(commodity)}
                >
                  {commodity.consumption}
                </DataTableCell>
                <DataTableCell
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
