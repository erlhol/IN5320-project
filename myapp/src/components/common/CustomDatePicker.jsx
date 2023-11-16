import React, { useRef } from "react";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/teal.css";
import { InputField } from "@dhis2/ui";

const CustomDatePicker = ({ selectedPeriod, setSelectedPeriod }) => {
  console.log(selectedPeriod);
  const handleChange = newDates => {
    console.log([newDates[0], newDates[1]]);
    setSelectedPeriod([newDates[0], newDates[1]]);
  };

  const datePickerRef = useRef(); // Ref für den DatePicker

  return (
    <div>
      <DatePicker
        ref={datePickerRef} // Ref zuweisen
        value={[selectedPeriod[0], selectedPeriod[1]]}
        onChange={e => handleChange(e)}
        range
        rangeHover
        eachDaysInRange
        format="MM/DD/YYYY"
        className="teal"
        render={
          <CustomRangeInput
            datePickerRef={datePickerRef}
            value={selectedPeriod}
          />
        }
      />
    </div>
  );
};

function CustomRangeInput({ datePickerRef, value }) {
  const handleFocus = () => {
    if (datePickerRef.current) {
      datePickerRef.current.openCalendar();
    }
  };

  let from = value[0] ? value[0] : "";
  let to = value[1] ? value[1] : "";

  return (
    <InputField
      onFocus={handleFocus}
      value={formatPeriod([from, to])}
      inputWidth={"200px"}
    />
  );
}

const formatPeriod = dates => {
  let from = dates[0] ? dates[0] : "";
  let to = dates[1] ? dates[1] : "";

  return from && to ? ` ${from} - ${to}` : from;
};
export default CustomDatePicker;
