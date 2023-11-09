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

function setPagination(commodities, pSize, cPage) {
  // Return the part of the array based on the pageSize and the currentPage
  return commodities.slice(
    pSize * (cPage - 1),
    Math.min(pSize * cPage, commodities.length) // to avoid out of bounds
  );
}

const PaginationOfTable = props => {
  // Return the pageCount. This is based on the number of commodities. If the number is not round, for instance 2.4, then we will need to 2 pages + 1 page with the remaining amount of commodities
  const pageCount = () => {
    return (props.commodities.length / props.pageSize) % 1 != 0
      ? Math.floor(props.commodities.length / props.pageSize) + 1
      : props.commodities.length / props.pageSize;
  };

  // Need to listen for changes to the searched commodities from the parant component
  useEffect(() => {
    props.setDisplayedCommodities(
      setPagination(props.commodities, props.pageSize, props.currentPage)
    );
  }, [props.commodities]);

  // Handles a update of pagesize. This will reset current page (set current page to 1)
  const handlePageSize = curSize => {
    props.setDisplayedCommodities(setPagination(props.commodities, curSize, 1));
    props.setPageSize(curSize);
    props.setCurrentPage(1);
  };

  const handleCurrentPage = curPage => {
    props.setDisplayedCommodities(
      setPagination(props.commodities, props.pageSize, curPage)
    );
    props.setCurrentPage(curPage);
  };

  return (
    <Pagination
      onPageChange={handleCurrentPage}
      onPageSizeChange={handlePageSize}
      page={props.currentPage}
      pageCount={pageCount()}
      pageSize={props.pageSize}
      total={props.commodities.length}
    />
  );
};

const CommodityTable = props => {
  // State for the current pageSize selected
  const [pageSize, setPageSize] = useState(5);

  // State for the displayed commodities. These are the commodities displayed (and constrained by the pagination component)
  const [displayedCommodities, setDisplayedCommodities] = useState(
    setPagination(props.commodities, pageSize, props.currentPage)
  );

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

  // A sorting function that sorts the commodities using a lambda function
  // Works both for strings and numbers
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
              <PaginationOfTable
                commodities={props.commodities}
                pageSize={pageSize}
                currentPage={props.currentPage}
                setPageSize={setPageSize}
                setCurrentPage={props.setCurrentPage}
                setDisplayedCommodities={setDisplayedCommodities}
              ></PaginationOfTable>
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      </DataTable>
    </>
  );
};

export default CommodityTable;
