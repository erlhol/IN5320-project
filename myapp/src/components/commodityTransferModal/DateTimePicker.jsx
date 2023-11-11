import React from "react";
import { InputField } from "@dhis2/ui";

const DateTimePicker = ({ datetime, setDatetime, dateIsValid, submitAttempted }) => {
  return (
    <div>
      <label htmlFor="dateTimeInput">Date and Time</label>
      <InputField
        id="dateTimeInput"
        type="datetime-local"
        value={datetime}
        onChange={e => setDatetime(e.value)}
        error ={!dateIsValid && submitAttempted}
        validationText= {!dateIsValid && submitAttempted ? "Date and time must not be in the future" : null}
      />
    </div>
  );
};

export default DateTimePicker;
