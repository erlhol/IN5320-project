import React from "react";
import { useState, useEffect } from "react";

import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Dropdown from "../components/common/Dropdown";
import Stepper from "../components/common/Stepper";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import {
  getTransByCommodityName,
  getTransByPeriod,
  getTransByRecipient,
  categorizeTransByDate,
} from "../utilities";

const Transactions = props => {
  const [currentModal, setCurrentModal] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date("2023-09-01"),
    end: new Date("2023-10-30"),
  });
  const [selectedReceipient, setSelectedReceipient] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [visibleTrans, setVisibleTrans] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

  useEffect(() => {
    console.log("props.transactionData", props.transactionData);
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
    // console.log("visibleTrans: ", visibleTrans);
    // console.log("filteredByPeriod: ", filteredByPeriod);
    // console.log("filteredByName: ", filteredByName);
    setVisibleTrans(filteredByReceipient);
  }, [selectedPeriod, selectedCommodity, selectedReceipient]);

  const handleOnModalChange = value => {
    setCurrentModal(value);
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
        <Search placeholder="Search commodity" width={"320px"} />
        <Dropdown placeholder="Period" />
        <Dropdown placeholder="All transactions" />
        <Dropdown placeholder="Recipient" />
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

      {currentModal === "add_stock" && (
        <Stepper title={"Add stock"} onClose={handleOnModalChange} />
      )}
      {currentModal === "new_dispensing" && (
        <Stepper
          title={"New dispensing"}
          onClose={handleOnModalChange}
          existedTransData={props.transactionData}
        />
      )}
    </>
  );
};

export default Transactions;
