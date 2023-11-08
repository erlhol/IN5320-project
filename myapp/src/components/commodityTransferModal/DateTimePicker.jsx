import React from "react";
import { Input } from "@dhis2/ui";

const DateTimePicker = ({ datetime, setDatetime }) => {
  return (
    <div>
      <label htmlFor="dateTimeInput">Date and Time</label>
      <Input
        id="dateTimeInput"
        type="datetime-local"
        value={datetime}
        onChange={e => setDatetime(e.value)}
      />
    </div>
  );
};

export default DateTimePicker;
