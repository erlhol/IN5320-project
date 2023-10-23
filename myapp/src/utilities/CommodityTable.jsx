import React from "react";
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

const CommodityTable= (props) => {
  return (
    <>
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader width="48px">
              <Checkbox onChange={() => console.log("Toggle All")} />
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => console.log("Sort by Commodity Name")}
              sortDirection="asc"
              sortIconTitle="Sort by Commodity Name"
            >
              Commodity Name
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => console.log("Sort by Stock Balance")}
              sortDirection="asc"
              sortIconTitle="Sort by Stock Balance"
            >
              Stock Balance
            </DataTableColumnHeader>
            <DataTableColumnHeader
              onSortIconClick={() => console.log("Sort by Consumption")}
              sortDirection="desc"
              sortIconTitle="Sort by Consumption"
            >
              Consumption
            </DataTableColumnHeader>
            <DataTableColumnHeader>Last Dispensing</DataTableColumnHeader>
            <DataTableColumnHeader></DataTableColumnHeader>
          </DataTableRow>
        </TableHead>

        <TableBody>
            {props.commodities.map((commodity, i) => 
            <DataTableRow>
                <DataTableCell width="48px">
                <Checkbox
                    onChange={() => console.log("Toggle selected ID "+i)}
                    value={i}
                />
                </DataTableCell>
                <DataTableCell>{commodity.name}</DataTableCell>
                <DataTableCell>{commodity.stockBalance}</DataTableCell>
                <DataTableCell>{commodity.consumption}</DataTableCell>
                <DataTableCell>{commodity.lastdispensing}</DataTableCell>
                <DataTableCell>
                <Button name="Small button" onClick={() => console.log("Dispense ID "+i)} small value="default">
                    Dispense
                </Button>
                </DataTableCell>
            </DataTableRow>)}

          <DataTableRow selected>
            <DataTableCell width="48px">
              <Checkbox
                checked
                onChange={() => console.log("Toggle selected ID 2")}
                value="id_2"
              />
            </DataTableCell>
            <DataTableCell>Commodity 2</DataTableCell>
            <DataTableCell>150</DataTableCell>
            <DataTableCell>-25</DataTableCell>
            <DataTableCell>08/11/2010</DataTableCell>
            <DataTableCell>
              <Button
                name="Small button"
                onClick={() => console.log("Dispense ID 2")}
                small
                value="default"
              >
                Dispense
              </Button>
            </DataTableCell>
          </DataTableRow>

        </TableBody>
        <TableFoot>
          <DataTableRow>
            <DataTableCell colSpan="6">
              <Pagination
                onPageChange={() => console.log("Page Changed")}
                onPageSizeChange={() => console.log("Page Size Changed")}
                page={10}
                pageCount={21}
                pageSize={50}
                total={1035}
              />
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      </DataTable>
    </>
  );
};

export default CommodityTable;
