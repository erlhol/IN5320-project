import React from "react";
import { useState, useEffect } from "react";
import { AlertBar } from "@dhis2/ui";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Dropdown from "../components/common/Dropdown";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import { categorizeTransByDate } from "../utilities/datautility";
import CommodityTransferModal from "../components/commodityTransferModal/CommodityTransferModal";
import { search } from "../utilities/search";

const Transactions = props => {
  const [modalPresent, setModalPresent] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState([
    new Date("2023-08-01"),
    new Date("2023-11-30"),
  ]);
  const [selectedReceipient, setSelectedReceipient] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [visibleTrans, setVisibleTrans] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );
  const [alertBarText, setAlertBarText] = useState("");

  useEffect(() => {
    const updatedTrans = categorizeTransByDate(filterTrans());
    setVisibleTrans(updatedTrans);
  }, [
    selectedPeriod,
    selectedCommodity,
    selectedReceipient,
    props.transactionData,
  ]);


  const filterTrans = () => {
    return props?.transactionData?.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction?.commodities?.some(commodity =>
          commodity?.commodityName
            .toLowerCase()
            .includes(selectedCommodity.toLowerCase())
        ) &&
        transaction.dispensedTo
          .toLowerCase()
          .includes(selectedReceipient.toLowerCase()) &&
        transactionDate >= new Date(selectedPeriod[0]) &&
        transactionDate <= new Date(selectedPeriod[1])
      );
    });
  };

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

export default Transactions;
