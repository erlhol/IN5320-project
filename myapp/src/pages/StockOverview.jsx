import React from "react";
import { useState, useEffect } from "react";
import { CircularLoader } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import Stepper from "../components/common/Stepper";
import CommodityTable from "../components/stockOverview/CommodityTable";
import {
  mergeCommodityAndValue,
  mergeDataForDashboard,
  categorizeTransByDate,
} from "../utilities/dataUtility";
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

  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

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

      const filteredStock = filterBySearch(stockData, currentSearch);
      setFilteredStockData(filteredStock);
    }
  }, [allMonthsLoading, monthlyStockLoading, allMonthsData, monthlyStock]);

  if (allMonthsError)
    return <span>ERROR in getting stock data: {error.message}</span>;

  return (
    <>
      {/* Loading indicator while waiting for data */}
      {allMonthsLoading || monthlyStockLoading ? (
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
          {filteredStockData && monthlyStockData && (
            <CommodityTable
              transactions={transactions}
              commodities={filteredStockData}
              monthlyStockData={monthlyStockData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}

          {modalPresent && (
            <Stepper
              title={"Add stock"}
              onClose={handleOnModalChange}
              refetchData={refetch}
              allCommodities={data.commodities?.dataSetElements}
              existedTransData={props.transactionData}
            />
          )}
        </>
      )}
    </>
  );
};

export default StockInventory;
