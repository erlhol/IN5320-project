import React from "react";
import { InputField } from "@dhis2/ui";
const Search = props => {
  // TODO: replace with real values, can be passed with props
  return (
    <InputField
      inputWidth={props.width}
      name="defaultName"
      type="search"
      onChange={() => console.log("Fix")}
      placeholder={props.placeholder}
    />
  );
};
export default Search;
