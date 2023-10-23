import React from "react";
import {SingleSelectField, SingleSelectOption} from '@dhis2/ui'
const Dropdown = (props) => {
    // TODO: replace with real values. Can be passed with props
    console.log(props.placeholder)
    return (<>
      <SingleSelectField inputWidth="200px" onChange={() => console.log("Period changed")} placeholder={props.placeholder} required>
        <SingleSelectOption label="one" value="1" />
        <SingleSelectOption label="two" value="2" />
        
      </SingleSelectField></>)
}
export default Dropdown;