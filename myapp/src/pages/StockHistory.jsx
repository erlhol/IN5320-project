import React from "react";
import { useState, useEffect } from "react";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Dropdown from "../components/common/Dropdown";
import Stepper from "../components/common/Stepper";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import {
  getTransByCommodityNameQuery,
  getTransByPeriod,
  getTransByRecipient,
  categorizeTransByDate,
} from "../utilities/dataUtility";
import { getStockHistoryDefaultPeriod } from "../utilities/dates";
// NOTE: Calender from dhis2/ui doesn't work. So we have to choose react-multi-date-picker
//import { CalendarInput, CalendarStoryWrapper, Calendar } from "@dhis2/ui";
import DatePicker from "react-multi-date-picker";

const TransactionHistory = props => {
  const [modalPresent, setModalPresent] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState([
    getStockHistoryDefaultPeriod().start,
    getStockHistoryDefaultPeriod().end,
  ]);
  const [selectedReceipient, setSelectedReceipient] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [visibleTrans, setVisibleTrans] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

  // The reason for having this useEffect is because after confirmed adding transactions, the refetch function is invoked before the new added transaction is added to dataStore. Therefor we need to rerender StockHistory to get the updated data once it's added.
  // useEffect(() => {
  //   setVisibleTrans(categorizeTransByDate(props.transactionData));
  //   setSelectedCommodity[selectedCommodity];
  // }, [props.transactionData]);

  useEffect(() => {
    const filteredTrans = filterTrans();
    setVisibleTrans(categorizeTransByDate(filteredTrans));
  }, [selectedPeriod, selectedCommodity, selectedReceipient]);

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

  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

  const onSearch = event => {
    console.log("event in onSelectCommodity: ", event);
    if (event.name === "commodity") return setSelectedCommodity(event.value);
    if (event.name === "recipient") return setSelectedReceipient(event.value);
  };

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

        <DatePicker
          value={selectedPeriod}
          onChange={values => setSelectedPeriod(values)}
          format="MM/DD/YYYY"
          range
          style={{ height: "40px", width: "210px" }}
        />
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
          refetchData={() => props.refetchTransData()}
          existedTransData={props.transactionData}
        />
      )}
    </>
  );
};

export default TransactionHistory;
