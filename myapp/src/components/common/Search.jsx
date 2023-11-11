import React from "react";
import { InputField } from "@dhis2/ui";
const Search = props => {
  // TODO: replace with real values, can be passed with props
  return (
    <InputField
      inputWidth={props.width}
      value={props.currentSearch}
      name="defaultName"
      type="search"
      onChange={props.onSearchChange}
      placeholder={props.placeholder}
    />

  );
};
export default Search;
