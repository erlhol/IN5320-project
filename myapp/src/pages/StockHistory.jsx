import React from "react";
import { useState, useEffect } from "react";
import { Button, CircularLoader } from "@dhis2/ui";
import { DataQuery, useDataQuery, useDataMutation } from "@dhis2/app-runtime";

import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Dropdown from "../components/common/Dropdown";
import Stepper from "../components/common/Stepper";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import {
  stockRequest,
  stockUpdateRequest,
  transRequest,
  transUpdateRequest,
} from "../requests";

const Transactions = () => {
  const [currentModal, setCurrentModal] = useState("");
  const { loading, error, data } = useDataQuery(transRequest);

  const handleOnModalChange = value => {
    setCurrentModal(value);
  };

  /* TODO: replace with actual transaction data */
  // TO BE DISCUSSED: data structure of the transactions
  const transaction_by_day = {
    date: "October 13, 2023",
    transactions: [
      {
        commodity_name: "Zink",
        time: "8:30pm",
        sender: "George Slater",
        reciever: "Ralph Hans",
        amount: "-163",
        new_stock: "243",
      },
      {
        commodity_name: "Ibuprofen",
        time: "9:30pm",
        sender: "George Slater",
        reciever: "Ralph Hans",
        amount: "-50",
        new_stock: "200",
      },
    ],
  };

  if (error) return <span>ERROR: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    let transactionData = data.transactionHistory;
    return (
      <>
        {/* Navigation buttons to add stock or new dispensing */}
        <Header
          title="Stock History"
          primaryButtonLabel="New Dispensing"
          primaryButtonClick={() => handleOnModalChange("new_dispensing")}
        />

        {/* The different search and filter options */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Search placeholder="Search commodity" width={"320px"}></Search>
          <Dropdown placeholder="Period"></Dropdown>
          <Dropdown placeholder="All transactions"></Dropdown>
          <Dropdown placeholder="Recipient"></Dropdown>
        </div>

        {/* Multiple transactions can be listed here: */}
        {/* <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay>
                <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay> */}
        <TransactionsForDay
          date={transactionData.data.date}
          transactions={transactionData}
        ></TransactionsForDay>

        {currentModal === "add_stock" && (
          <Stepper title={"Add stock"} onClose={handleOnModalChange}></Stepper>
        )}
        {currentModal === "new_dispensing" && (
          <Stepper
            title={"New dispensing"}
            onClose={handleOnModalChange}
          ></Stepper>
        )}
      </>
    );
  } else
    return (
      <Button
        name="Secondary button"
        onClick={() => handleOnModalChange("add_stock")}
        secondary
        value="add_stock"
        style={{ height: "100%" }}
      >
        Add Stock
      </Button>
    );
};

export default Transactions;
