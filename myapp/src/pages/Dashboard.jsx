import React, { useState, useEffect } from "react";
import { colors } from "@dhis2/ui";
import {
  Box,
  Button,
  IconWarningFilled24,
  IconCalendar24,
  CircularLoader,
  AlertBar,
} from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import { useNavigate } from "react-router-dom";

import {
  mergeCommodityAndValue,
  getCommoditiesLowInStock,
  getMonthlyStockData,
  getMostRecentTransactionsObject,
  categorizeTransByDate,
} from "../utilities/dataUtility";
import { stockRequest } from "../utilities/requests";
import { getCurrentMonth, getPeriods } from "../utilities/dates";
import classes from "./Dashboard.module.css";
import globalClasses from "../App.module.css";

import Header from "../components/common/Header";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import StatisticCard from "../components/dashboard/StatisticCard";
import MostDispensed from "../components/dashboard/charts/MostDispensed";
import DispensingPerCommodity from "../components/dashboard/charts/DispensingPerCommodity";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";
import StockAmountModal from "../components/dashboard/StockAmountModal";
import CommodityTransferModal from "../components/commodityTransferModal/CommodityTransferModal";

const Dashboard = ({ transactionData, refetchTransData }) => {
  const navigate = useNavigate();

  const recentTransactionsObject = getMostRecentTransactionsObject(
    categorizeTransByDate(transactionData),
    5
  );

  const {
    loading: currentStockLoading,
    error: currentStockError,
    data: currentStock,
    refetch: refetchCurrentStock,
  } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const periods = getPeriods().map(period => period[1]);
  const {
    loading: monthlyStockLoading,
    error: monthlyStockError,
    data: monthlyStock,
    refetch: refetchMonthlyStock,
  } = useDataQuery(stockRequest, {
    variables: { period: periods },
  });

  const [monthlyStockData, setMonthlyStockData] = useState(undefined);
  const [lowInStockCommodities, setLowInStockCommodities] = useState(undefined);

  const [stockAmountModalPresent, setStockAmountModalPresent] = useState(false);
  const [stockAmountModalTitle, setStockAmountModalTitle] = useState("");
  const [stockAmountModalData, setStockAmountModalData] = useState([]);

  const [transferModalPresent, setTransferModalPresent] = useState(null);
  const [alertBarText, setAlertBarText] = useState("");

  useEffect(() => {
    if (currentStock && monthlyStock) {
      const currentStockData = mergeCommodityAndValue(
        currentStock.dataValues?.dataValues,
        currentStock.commodities?.dataSetElements,
        transactionData
      );

      const monthlyStockData = getMonthlyStockData(
        monthlyStock.dataValues?.dataValues,
        monthlyStock.commodities?.dataSetElements
      );
      setMonthlyStockData(monthlyStockData);

      const lowInStockCommoditiesData = getCommoditiesLowInStock(
        monthlyStockData,
        currentStockData
      );
      setLowInStockCommodities(lowInStockCommoditiesData);
    }
  }, [currentStock, monthlyStock, transactionData]);

  const handleShowStockInfoModal = (title, data) => {
    setStockAmountModalPresent(true);
    setStockAmountModalTitle(title);
    setStockAmountModalData(data);
  };

  const handleOnTransferModalChange = value => {
    setTransferModalPresent(value);
  };

  const daysUntilNext14th = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    let daysUntilNext14th;
    if (currentDay <= 14) {
      daysUntilNext14th = 14 - currentDay;
    } else {
      const nextMonth = currentDate.getMonth() + 1;
      const daysInCurrentMonth = new Date(
        currentDate.getFullYear(),
        nextMonth,
        0
      ).getDate();
      daysUntilNext14th = daysInCurrentMonth - (currentDay - 14);
    }

    return daysUntilNext14th;
  };

  const refetchData = async dispensing => {
    refetchCurrentStock();
    refetchMonthlyStock();
    await refetchTransData();
    setAlertBarText(
      dispensing ? "Dispensing successful" : "Restock successful"
    );
  };

  const onAlertHidden = () => {
    setAlertBarText("");
  };

  const navigateToStockHistory = () => {
    navigate("/stock-history");
  };

  if (!monthlyStockData && !lowInStockCommodities)
    return <CircularLoader large />;

  if (currentStockError)
    return (
      <span>
        ERROR in getting current stock data: {currentStockError.message}
      </span>
    );

  if (monthlyStockError)
    return (
      <span>
        ERROR in getting monthly stock data: {monthlyStockError.message}
      </span>
    );

  return (
    <>
      <Header title="Dashboard" />
      <Box className={classes.dashboardContent}>
        <Box className={classes.dashboardFirstRow}>
          <QuickActionCard
            onTransferModalChange={handleOnTransferModalChange}
          />
          <StatisticCard
            title="Commodities low in stock"
            number={lowInStockCommodities.length}
            icon={<IconWarningFilled24 color={colors.red500} />}
            showStockInfoModal={() =>
              handleShowStockInfoModal(
                "Commodities low in stock",
                lowInStockCommodities
              )
            }
          />
          <StatisticCard
            title="Days until new delivery"
            number={daysUntilNext14th()}
            icon={<IconCalendar24 color={colors.blue500} />}
          />
        </Box>
        <Box className={classes.dashboardSecondRow}>
          <MostDispensed
            title="Most dispensed commodities per month"
            stockDataPerMonth={monthlyStockData}
          />
          <DispensingPerCommodity
            title="Monthly commodity consumption over the year"
            stockDataPerMonth={monthlyStockData}
          />
        </Box>
        <Box>
          <div className={classes.transactionsHeader}>
            <h2>Recent Transactions</h2>
            <Button secondary name="secondary" onClick={navigateToStockHistory}>
              Show all
            </Button>
          </div>
          <div className={globalClasses.transactionsContainer}>
            {Object.keys(recentTransactionsObject).map((date, i) => (
              <TransactionsForDay
                key={i}
                date={date}
                transactions={recentTransactionsObject[date]}
              />
            ))}
          </div>
        </Box>
      </Box>
      {stockAmountModalPresent && (
        <StockAmountModal
          title={stockAmountModalTitle}
          commodities={stockAmountModalData}
          closeStockInfoModal={() => setStockAmountModalPresent(false)}
        />
      )}
      {transferModalPresent != null && (
        <CommodityTransferModal
          onClose={handleOnTransferModalChange}
          dispensing={transferModalPresent === "dispensing"}
          refetchData={refetchData}
          allCommodities={currentStock.commodities?.dataSetElements}
          existedTransData={transactionData}
          preselectedCommodities={[]}
        />
      )}
      {alertBarText && (
        <AlertBar
          success
          className={globalClasses.alertBar}
          onHidden={onAlertHidden}
        >
          {alertBarText}
        </AlertBar>
      )}
    </>
  );
};

export default Dashboard;
