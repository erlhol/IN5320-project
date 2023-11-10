import React from "react";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
const Dropdown = props => {
  return (
    <>
      <SingleSelectField
        inputWidth="250px"
        onChange={props.onChange}
        required
        selected={props.chosenValue}
        helpText={props.helpText}
      >
        {/* Not sure what the best practice is here
        I want to structure values as a list with two elements,
        the first element is label, the second is value */}
        {props.values?.map(value => (
          <SingleSelectOption label={value[0]} value={value[1]} />
        ))}
      </SingleSelectField>
    </>
  );
};
export default Dropdown;
