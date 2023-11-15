import React from "react";
import { useState, useEffect } from "react";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Stepper from "../components/common/Stepper";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import {
  categorizeTransByDate,
  getMostRecentTransactionsObject,
} from "../utilities/dataUtility";
import { getStockHistoryDefaultPeriod } from "../utilities/dates";
import { IconCalendar24 } from "@dhis2/ui";
// NOTE: Calender from dhis2/ui doesn't work. So we have to choose react-multi-date-picker
import DatePicker from "react-multi-date-picker";
import { consumptionRequest } from "../utilities/requests";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { getCurrentMonth } from "../utilities/dates";

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

  const { loading, error, data, refetch } = useDataQuery(consumptionRequest, {
    variables: { period: getCurrentMonth(), dataElement: "Boy3QwztgeZ" },
  });
  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

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
