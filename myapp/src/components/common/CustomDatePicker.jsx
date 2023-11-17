import React, { useRef } from "react";
// NOTE: Calender from dhis2/ui doesn't work. So we have to choose react-multi-date-picker
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/teal.css";
import { InputField } from "@dhis2/ui";

const CustomDatePicker = ({ selectedPeriod, setSelectedPeriod }) => {
  const handleChange = newDates => {
    setSelectedPeriod([newDates[0], newDates[1]]);
  };

  const datePickerRef = useRef();

  return (
    <div>
      <DatePicker
        ref={datePickerRef}
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
            setSelectedPeriod={setSelectedPeriod}
          />
        }
      />
    </div>
  );
};

function CustomRangeInput({ datePickerRef, value, setSelectedPeriod }) {
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
      inputWidth={"220px"}
      placeholder="Filter by date"
      type="search"
      onChange={() => setSelectedPeriod([])} //needed for reset button
    />
  );
}

const formatPeriod = dates => {
  let from = dates[0] ? dates[0] : "";
  let to = dates[1] ? dates[1] : "";

  return from && to ? ` ${from} - ${to}` : from;
};
export default CustomDatePicker;
