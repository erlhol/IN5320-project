import React, { useState, useEffect } from "react";
import { AlertBar, IconCalendar24 } from "@dhis2/ui";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import { categorizeTransByDate } from "../utilities/dataUtility";
import CommodityTransferModal from "../components/commodityTransferModal/CommodityTransferModal";
import { search } from "../utilities/search";
import { getStockHistoryDefaultPeriod } from "../utilities/dates";
// NOTE: Calender from dhis2/ui doesn't work. So we have to choose react-multi-date-picker
import CustomDatePicker from "../components/common/CustomDatePicker";

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
          search(commodity, selectedCommodity, "commodityName")
        ) &&
        search(transaction, selectedReceipient, "dispensedTo") &&
        transactionDate >= new Date(selectedPeriod[0]) &&
        transactionDate <= new Date(selectedPeriod[1] ? selectedPeriod[1] : selectedPeriod[0])
      );
    });
  };

  const refetchData = async dispensing => {
    await props.refetchTransData();
    setAlertBarText(
      dispensing ? "Dispensing successful" : "Restock successful"
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
        <CustomDatePicker selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
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
          dispensing
          existedTransData={props.transactionData}
          refetchData={refetchData}
          preselectedCommodities={[]}
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
