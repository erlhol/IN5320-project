import React from "react";
import { useState, useEffect } from "react";

import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Stepper from "../components/common/Stepper";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
<<<<<<< HEAD
import { categorizeTransByDate } from "../utilities/dataUtility";
import { getStockHistoryDefaultPeriod } from "../utilities/dates";
import { IconCalendar24 } from "@dhis2/ui";
// NOTE: Calender from dhis2/ui doesn't work. So we have to choose react-multi-date-picker
import DatePicker from "react-multi-date-picker";
=======
import {
  getTransByCommodityName,
  getTransByPeriod,
  getTransByRecipient,
  categorizeTransByDate,
} from "../utilities/dataUtility";
>>>>>>> 5afa7bcd589b72860c38c4f89c460e93a919b6c2

const TransactionHistory = props => {
  const [modalPresent, setModalPresent] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date("2023-08-01"),
    end: new Date("2023-11-30"),
  });
  const [selectedReceipient, setSelectedReceipient] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [visibleTrans, setVisibleTrans] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

<<<<<<< HEAD
  // When the transactionData is refetched, this component need to be rerendered
  useEffect(() => {
    setVisibleTrans(categorizeTransByDate(props.transactionData));
    // this is to remember the filtered Commodities
    const filteredTrans = filterTrans();
    setVisibleTrans(categorizeTransByDate(filteredTrans));
  }, [props.transactionData]);

=======
>>>>>>> 5afa7bcd589b72860c38c4f89c460e93a919b6c2
  useEffect(() => {
    const filteredByPeriod = getTransByPeriod(
      visibleTrans,
      selectedPeriod.start,
      selectedPeriod.end
    );
    const filteredByName = getTransByCommodityName(
      filteredByPeriod,
      selectedCommodity
    );
    const filteredByReceipient = getTransByRecipient(
      filteredByName,
      selectedReceipient
    );

<<<<<<< HEAD
  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

  const onSearch = event => {
    if (event.name === "commodity") return setSelectedCommodity(event.value);
    if (event.name === "recipient") return setSelectedReceipient(event.value);
  };

  const filterTrans = () => {
    return props?.transactionData?.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction?.commodities?.some(commodity =>
          commodity?.commodityName
            .toLowerCase()
            .startsWith(selectedCommodity.toLowerCase())
        ) &&
        transaction.dispensedTo
          .toLowerCase()
          .startsWith(selectedReceipient.toLowerCase()) &&
        transactionDate >= new Date(selectedPeriod[0]) &&
        transactionDate <= new Date(selectedPeriod[1])
      );
    });
  };

=======
    setVisibleTrans(filteredByReceipient);
  }, [selectedPeriod, selectedCommodity, selectedReceipient]);

  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

>>>>>>> 5afa7bcd589b72860c38c4f89c460e93a919b6c2
  return (
    <>
      {/* Navigation buttons to add stock or new dispensing */}
      <Header
        title="Stock History"
        primaryButtonLabel="New Dispensing"
        primaryButtonClick={() => handleOnModalChange("new_dispensing")}
      />
      {/* The different search and filter options */}
      <div className={classes.filterOptions}>
<<<<<<< HEAD
        <Search
          name="commodity"
          placeholder="Search commodity"
          width={"320px"}
          onSearchChange={onSearch}
          currentSearch={selectedCommodity}
        />
        <Search
          name="recipient"
          placeholder="Recipient"
          width={"320px"}
          onSearchChange={onSearch}
          currentSearch={selectedReceipient}
        />
        <div className={classes.datePicker}>
          <IconCalendar24 />
          <DatePicker
            value={selectedPeriod}
            onChange={values => setSelectedPeriod(values)}
            format="MM/DD/YYYY"
            range
            style={{ height: "40px", width: "210px" }}
          />
        </div>
=======
        <Search placeholder="Search commodity" width={"320px"} />
        <Dropdown placeholder="Period" />
        <Dropdown placeholder="All transactions" />
        <Dropdown placeholder="Recipient" />
>>>>>>> 5afa7bcd589b72860c38c4f89c460e93a919b6c2
      </div>

      {/* Multiple transactions can be listed here: */}
      {/* <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay>
                <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay> */}
      {Object.keys(visibleTrans).map((date, i) => (
        <TransactionsForDay
          key={i}
          date={date}
          transactions={visibleTrans[date]}
        />
      ))}

      {modalPresent && (
        <Stepper
          title={"New dispensing"}
          onClose={handleOnModalChange}
          refetchData={props.refetchTransData}
          existedTransData={props.transactionData}
        />
      )}
    </>
  );
};

export default TransactionHistory;
