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
} from "@dhis2/ui";
import { colors, theme, spacers, layers, elevation } from "@dhis2/ui";

const CommodityTable = props => {
  const [sortOrder, setSortOrder] = useState({
    column: "commodityName", // Default sorting column
    order: "asc", // Default sorting order
  });

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = () => {
    return (props.commodities.length / pageSize) % 1 != 0
      ? Math.floor(props.commodities.length / pageSize) + 1
      : props.commodities.length / pageSize;
  };

  const [displayedCommodities, setDisplayedCommodities] = useState(
    props.commodities.slice(
      pageSize * (currentPage - 1),
      Math.min(pageSize * currentPage, props.commodities.length)
    )
  );

  const handlePageSize = value => {
    setDisplayedCommodities(
      props.commodities.slice(0, Math.min(value, props.commodities.length))
    );
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleCurrentPage = value => {
    setDisplayedCommodities(
      props.commodities.slice(
        pageSize * (value - 1),
        Math.min(pageSize * value, props.commodities.length)
      )
    );
    setCurrentPage(value);
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
                page={currentPage}
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
