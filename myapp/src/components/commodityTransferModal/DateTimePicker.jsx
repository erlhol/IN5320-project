import React from "react";
import { InputField } from "@dhis2/ui";
import { checkDateInFuture } from "../../utilities/datautility";

const DateTimePicker = props => {
  const onChange = e => {
    props.setDateTimeState({
      dateTime: e,
      isValid: !checkDateInFuture(e),
    });
  };

  const validationText = () => {
    if (props.submitAttempted && props.dateTimeState.isValid === false) {
      return "Date and time must not be in the future";
    }
    return "";
  };
  return (
    <div>
      <label htmlFor="dateTimeInput">Date and Time</label>
      <InputField
        id="dateTimeInput"
        type="datetime-local"
        value={props.dateTimeState.dateTime}
        onChange={e => onChange(e.value)}
        error={props.submitAttempted && props.dateTimeState.isValid === false}
        validationText={validationText()}
      />
    </div>
  );
};

export default DateTimePicker;
