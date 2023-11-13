import React from "react";
import { useState, useEffect } from "react";
import { AlertBar } from "@dhis2/ui";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Dropdown from "../components/common/Dropdown";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import {
  getTransByCommodityName,
  getTransByPeriod,
  getTransByRecipient,
  categorizeTransByDate,
} from "../utilities/dataUtility";
import CommodityTransferModal from "../components/commodityTransferModal/CommodityTransferModal";

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
  const [alertBarText, setAlertBarText] = useState("");

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

    setVisibleTrans(filteredByReceipient);
  }, [selectedPeriod, selectedCommodity, selectedReceipient]);

  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

  const refetchData = async dispensing => {
    await props.refetchTransData();
    setAlertBarText(
      dispensing ? "Dispensing Successful" : "Restock Successful"
    );
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

      {modalPresent && (
        <CommodityTransferModal
          onClose={handleOnModalChange}
          dispensing={true}
          existedTransData={props.transactionData}
          refetchData={refetchData}
        />
      )}
      {alertBarText && (
        <AlertBar type="success" className={classes.alertBar}>
          {alertBarText}
        </AlertBar>
      )}
    </>
  );
};

export default TransactionHistory;
