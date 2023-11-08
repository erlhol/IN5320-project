import React from "react";
import { useState } from "react";
import {
  InputField,
  TableRowHead,
  TableCellHead,
  TableHead,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Button
} from "@dhis2/ui";
import { filterBySearch } from "../../search";
const SearchInModal = props => {

   const [currentSearch, setCurrentSearch] = useState("");

   const handleOnChangeSearch = value => {
     setCurrentSearch(value.value);
   };

    const filteredStockData = filterBySearch(props.stockData, currentSearch);
  return (
    <div>
      <InputField
        inputWidth={props.width}
        value={currentSearch}
        name="defaultName"
        type="search"
        onChange={handleOnChangeSearch}
        placeholder="Search Commodity"
      />
      <Table>
        <TableBody>
          {currentSearch != "" &&
            filteredStockData.map((commodity, i) => (
              <TableRow>
                <TableCell>{commodity.commodityName}</TableCell>
                <TableCell>Stock: {commodity.endBalance}</TableCell>
                <TableCell>
                  <Button onClick={() => props.addCommodity(commodity)} name="Small button">
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default SearchInModal;
