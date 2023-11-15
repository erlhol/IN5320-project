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
import classes from "../../App.module.css";
import { convertDateFormat } from "../../utilities/dates";

const CommodityTable = props => {
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
      var columnA = a[sortOrder.column];
      var columnB = b[sortOrder.column];
      if (sortOrder.column == "lastDispensingDate") {
        columnA = convertDateFormat(a[sortOrder.column]);
        columnB = convertDateFormat(b[sortOrder.column]);
      }
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

  return (
    <>
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader width={spacers.dp48}>
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
              width={spacers.dp192}
            >
              Stock Balance
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => handleSort("consumption")}
              sortDirection={
                sortOrder.column === "consumption" ? sortOrder.order : "default"
              }
              sortIconTitle="Sort by Consumption"
              width={spacers.dp192}
            >
              Monthly Consumption
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => handleSort("lastDispensingDate")}
              sortDirection={
                sortOrder.column === "lastDispensingDate"
                  ? sortOrder.order
                  : "default"
              }
              sortIconTitle="Sort by dispensed date"
              width={spacers.dp256}
            >
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
                  onChange={() => console.log("Toggle selected ID " + i)}
                  value={"" + i}
                />
                {/* if it should be checked, add the property: checked */}
              </DataTableCell>
              <DataTableCell>{commodity.commodityName}</DataTableCell>
              <DataTableCell>{commodity.endBalance}</DataTableCell>
              <DataTableCell>{commodity.consumption}</DataTableCell>
              <DataTableCell>
                <div className={classes.commodityTableLastDispensing}>
                  <span>{commodity.lastDispensingDate}</span>
                  <span>
                    {commodity.lastDispensingAmount
                      .toString()
                      .replace(/-/g, "")}
                  </span>
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
    </>
  );
};

export default CommodityTable;
