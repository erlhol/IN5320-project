import React from "react";
import { useState, useEffect } from "react";
import { CircularLoader, AlertBar } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import CommodityTable from "../components/stockOverview/CommodityTable";
import {
  mergeCommodityAndValue,
  mergeDataForDashboard,
  categorizeTransByDate,
} from "../utilities/dataUtility";
import CommodityTransferModal from "../components/commodityTransferModal/CommodityTransferModal";
import { stockRequest } from "../utilities/requests";
import { getCurrentMonth, getPeriods } from "../utilities/dates";
import { filterBySearch } from "../utilities/search";

const StockInventory = props => {
  const [transactions, setTransactions] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

  const [modalPresent, setModalPresent] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [monthlyStockData, setMonthlyStockData] = useState(null);
  const [filteredStockData, setFilteredStockData] = useState(null);
  const [preselectedCommodities, setPreselectedCommodities] = useState([]);
  const [alertBarText, setAlertBarText] = useState("");
  const [numberMultiSelected, setNumberMultiselected] = useState(0);

  const {
    loading: allMonthsLoading,
    error: allMonthsError,
    data: allMonthsData,
    refetch,
  } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const periods = getPeriods().map(period => period[1]);
  const {
    loading: monthlyStockLoading,
    error: monthlyStockError,
    data: monthlyStock,
  } = useDataQuery(stockRequest, {
    variables: { period: periods },
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleOnModalChange = value => {
    setModalPresent(value);
  };

  useEffect(() => {
    if (modalPresent != null) {
      setPreselectedCommodities([]);
      setNumberMultiselected(0);
    }
  }, [modalPresent]);

  const handleOnChangeSearch = searchobj => {
    setCurrentSearch(searchobj.value);
    setCurrentPage(1); // Need to reset the current page to avoid searching out of bounds error
  };

  useEffect(() => {
    // Check if both requests have completed
    if (!allMonthsLoading && !monthlyStockLoading) {
      const stockData = mergeCommodityAndValue(
        allMonthsData?.dataValues?.dataValues,
        allMonthsData?.commodities?.dataSetElements,
        props.transactionData
      );

      const mStockData = mergeDataForDashboard(
        monthlyStock?.dataValues?.dataValues,
        monthlyStock?.commodities?.dataSetElements
      );
      setMonthlyStockData(mStockData);

      const filteredStock = filterBySearch(
        stockData,
        currentSearch,
        "commodityName"
      );
      setFilteredStockData(filteredStock);
    }
  }, [
    allMonthsLoading,
    monthlyStockLoading,
    allMonthsData,
    monthlyStock,
    currentSearch,
  ]);

  const refetchData = dispensing => {
    refetch();
    setAlertBarText(
      dispensing ? "Dispensing successful" : "Restock successful"
    );
  };

  if (allMonthsError)
    return <span>ERROR in getting stock data: {allMonthsError.message}</span>;

  if (monthlyStockError)
    return (
      <span>ERROR in getting stock data: {monthlyStockError.message}</span>
    );

  return (
    <>
      {/* Loading indicator while waiting for data */}
      {!filteredStockData && !monthlyStockData ? (
        <CircularLoader large />
      ) : (
        <>
          {/* The header and the add stock button */}
          <Header
            title="Stock Overview"
            primaryButtonLabel="Add Stock"
            primaryButtonClick={() => handleOnModalChange("add_stock")}
          />

          {/* The input fields */}
          <div className={classes.filterOptions}>
            <Search
              currentSearch={currentSearch}
              onSearchChange={handleOnChangeSearch}
              placeholder="Search commodity"
              width={"320px"}
            />
          </div>

          {/* The commodity table */}
          <CommodityTable
            transactions={transactions}
            commodities={filteredStockData}
            monthlyStockData={monthlyStockData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            preselectedCommodities={preselectedCommodities}
            setPreselectedCommodities={setPreselectedCommodities}
            numberMultiSelected={numberMultiSelected}
            setNumberMultiselected={setNumberMultiselected}
            handleOnModalChange={handleOnModalChange}
          />

          {modalPresent && (
            <CommodityTransferModal
              onClose={handleOnModalChange}
              dispensing={modalPresent === "dispensing"}
              refetchData={refetchData}
              allCommodities={allMonthsData.commodities?.dataSetElements}
              existedTransData={props.transactionData}
              preselectedCommodities={
                modalPresent === "dispensing" ? preselectedCommodities : []
              }
            />
          )}
          {alertBarText && (
            <AlertBar type="success" className={classes.alertBar}>
              {alertBarText}
            </AlertBar>
          )}
        </>
      )}
    </>
  );
};

export default StockInventory;
