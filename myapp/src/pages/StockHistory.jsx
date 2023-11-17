import React, { useState, useEffect } from "react";
import { SingleSelect, SingleSelectOption } from "@dhis2/ui";
import globalClasses from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import { categorizeTransByDate } from "../utilities/dataUtility";
import { search } from "../utilities/search";
import { getStockHistoryDefaultPeriod } from "../utilities/dates";
import CustomDatePicker from "../components/common/CustomDatePicker";

const TransactionHistory = props => {
  const [selectedPeriod, setSelectedPeriod] = useState([]);
  const [selectedReceipient, setSelectedReceipient] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [visibleTrans, setVisibleTrans] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

  useEffect(() => {
    const updatedTrans = categorizeTransByDate(filterTrans());
    setVisibleTrans(updatedTrans);
  }, [
    selectedPeriod,
    selectedCommodity,
    selectedReceipient,
    selectedTransactionType,
    props.transactionData,
  ]);

  const onSearch = event => {
    if (event.name === "commodity") return setSelectedCommodity(event.value);
    if (event.name === "recipient") return setSelectedReceipient(event.value);
  };

  const filterTrans = () => {
    return props?.transactionData?.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);
      const defaultPeriod = getStockHistoryDefaultPeriod(props.transactionData);
      const startDate = selectedPeriod[0]
        ? new Date(selectedPeriod[0])
        : new Date(defaultPeriod[0]);
      const endDate = selectedPeriod[1]
        ? new Date(selectedPeriod[1]) //use selected end if already selected
        : new Date(
            selectedPeriod[0]
              ? new Date(selectedPeriod[0])
              : new Date(defaultPeriod[1])
          );

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return (
        transaction?.commodities?.some(commodity =>
          search(commodity, selectedCommodity, "commodityName")
        ) &&
        search(transaction, selectedReceipient, "dispensedTo") &&
        transactionDate >= startDate &&
        transactionDate <= endDate &&
        (selectedTransactionType !== "all"
          ? transaction.type === selectedTransactionType
          : true)
      );
    });
  };

  return (
    <>
      <Header title="Stock History" />
      {/* The different search and filter options */}
      <div className={globalClasses.filterOptions}>
        <Search
          name="commodity"
          placeholder="Search commodity"
          width={"320px"}
          onSearchChange={onSearch}
          currentSearch={selectedCommodity}
        />
        <Search
          name="recipient"
          placeholder="Search recipient"
          width={"320px"}
          onSearchChange={onSearch}
          currentSearch={selectedReceipient}
        />
        <CustomDatePicker
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
        <SingleSelect
          selected={selectedTransactionType}
          onChange={e => setSelectedTransactionType(e.selected)}
          inputWidth="500px"
        >
          <SingleSelectOption label="All transactions" value="all" default />
          <SingleSelectOption label="Restock" value="Restock" />
          <SingleSelectOption label="Dispensing" value="Dispensing" />
        </SingleSelect>
      </div>

      {/* Multiple transactions can be listed here: */}
      {/* <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay>
                <TransactionsForDay date={transaction_by_day.date} transactions={transaction_by_day.transactions}></TransactionsForDay> */}
      {!Object.keys(visibleTrans).length == 0 ? (
        <div className={globalClasses.transactionsContainer}>
          {Object.keys(visibleTrans).map((date, i) => (
            <TransactionsForDay
              key={i}
              date={date}
              transactions={visibleTrans[date]}
            />
          ))}
        </div>
      ) : (
        <div>No transactions found</div>
      )}
    </>
  );
};

export default TransactionHistory;
