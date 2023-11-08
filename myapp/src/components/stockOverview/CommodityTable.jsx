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
import { colors, theme, spacers, layers, elevation } from "@dhis2/ui";

const CommodityTable = props => {
  // Takes out the number of elements from the search commodities based on pagesize and the current page number
  function setPagination(pSize, cPage) {
    return props.commodities.slice(
      pSize * (cPage - 1),
      Math.min(pSize * cPage, props.commodities.length)
    );
  }

  // States for sorting
  const [sortOrder, setSortOrder] = useState({
    column: "commodityName", // Default sorting column
    order: "asc", // Default sorting order
  });

  // States for pagination
  const [pageSize, setPageSize] = useState(5);

  const pageCount = () => {
    return (props.commodities.length / pageSize) % 1 != 0
      ? Math.floor(props.commodities.length / pageSize) + 1
      : props.commodities.length / pageSize;
  };
  const [displayedCommodities, setDisplayedCommodities] = useState(
    setPagination(pageSize, props.currentPage)
  );

  // Need to listen for changes to the searched commodities from the parant component
  useEffect(() => {
    setDisplayedCommodities(setPagination(pageSize, props.currentPage));
  }, [props.commodities]);

  // Handles a update of pagesize. This will reset current page (set current page to 1)
  const handlePageSize = curSize => {
    setDisplayedCommodities(setPagination(curSize, 1));
    setPageSize(curSize);
    props.setCurrentPage(1);
  };

  const handleCurrentPage = curPage => {
    setDisplayedCommodities(setPagination(pageSize, curPage));
    props.setCurrentPage(curPage);
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

  // A sorting function that sorts the commodities using a lambda function
  const sortedData = [...displayedCommodities].sort((a, b) => {
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
