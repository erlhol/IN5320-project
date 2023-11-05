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
    start: new Date("2023-05-23"),
    end: new Date("2023-08-23"),
  });
  const [selectedReceipient, setSelectedReceipient] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [visibleTrans, setVisibleTrans] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

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
    // console.log("visibleTrans: ", visibleTrans);
    // console.log("filteredByPeriod: ", filteredByPeriod);
    // console.log("filteredByName: ", filteredByName);
    setVisibleTrans(filteredByReceipient);
  }, [selectedPeriod, selectedCommodity, selectedReceipient]);

  const handleOnModalChange = value => {
    setCurrentModal(value);
  };

  if (error) return <span>ERROR: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    // Can data be false?
    let transactionData = data.transactionHistory;
    return (
      <>
        {/* Navigation buttons to add stock or new dispensing */}
        <Header
          title="Stock History"
          primaryButtonLabel="New Dispensing"
          primaryButtonClick={() => handleOnModalChange("new_dispensing")}
        />

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
          <Stepper title={"New dispensing"} onClose={handleOnModalChange} />
        )}
      </>
    );
  }
};

export default Transactions;
