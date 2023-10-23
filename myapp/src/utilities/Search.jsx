import React from "react";
import {InputField } from '@dhis2/ui'
const Search = (props) => {
    // TODO: use props to set the values
    return (<InputField inputWidth={props.width} name="defaultName" type='search' onChange={() => console.log("Fix")} placeholder={props.placeholder} />)
}
export default Search;
