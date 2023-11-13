import React, { useState } from "react";
import { colors } from "@dhis2/ui";
import {
  Box,
  Button,
  IconBlock24,
  IconWarningFilled24,
  CircularLoader,
} from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

import {
  categorizeTransByDate,
  mergeCommodityAndValue,
  getNumberCommoditiesLowInStock,
  mergeDataForDashboard,
} from "../utilities/datautility";
import { stockRequest } from "../utilities/requests";
import { getCurrentMonth, getPeriods } from "../utilities/dates";
import classes from "../App.module.css";

import Header from "../components/common/Header";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import StatisticCard from "../components/dashboard/StatisticCard";
import MostDispensed from "../components/dashboard/charts/MostDispensed";
import DispensingPerCommodity from "../components/dashboard/charts/DispensingPerCommodity";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";

const Dashboard = ({ transactionData }) => {
  const [transactions, setTransactions] = useState(() =>
    categorizeTransByDate(transactionData)
  );

  const {
    loading: currentStockLoading,
    error: currentStockError,
    data: currentStock,
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

  if (currentStockLoading || monthlyStockLoading)
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

  if (currentStock && monthlyStock) {
    const currentStockData = mergeCommodityAndValue(
      currentStock.dataValues?.dataValues,
      currentStock.commodities?.dataSetElements,
      transactionData
    );

    const monthlyStockData = mergeDataForDashboard(
      monthlyStock.dataValues?.dataValues,
      monthlyStock.commodities?.dataSetElements
    );

    const numberCommoditiesOutOfStock = currentStockData.filter(
      commodity => commodity.endBalance === 0
    ).length;

    const numberCommoditiesLowInStock = getNumberCommoditiesLowInStock(
      monthlyStockData,
      currentStockData
    );

    return (
      <>
        <Header title="Dashboard" />
        <Box className={classes.dashboardContent}>
          <Box className={classes.dashboardFirstRow}>
            <QuickActionCard />
            <StatisticCard
              title="Commodities out of stock"
              amount={numberCommoditiesOutOfStock}
              icon={<IconBlock24 color={colors.red400} />}
            />
            <StatisticCard
              title="Commodities low in stock"
              amount={numberCommoditiesLowInStock}
              icon={<IconWarningFilled24 color={colors.yellow400} />}
            />
          </Box>
          <Box className={classes.dashboardSecondRow}>
            <MostDispensed
              title="Most dispensed commodities per month"
              stockDataPerMonth={monthlyStockData}
            />
            <DispensingPerCommodity
              title="Monthly dispensings per commodity over the year"
              stockDataPerMonth={monthlyStockData}
            />
          </Box>
          <Box>
            <div className={classes.transactionsHeader}>
              <h2>Recent transactions</h2>
              <Button secondary name="secondary">
                Show all
              </Button>
            </div>
            {Object.keys(transactions)
              .slice(0, 2)
              .map((date, i) => (
                <TransactionsForDay
                  key={i}
                  date={date}
                  transactions={transactions[date]}
                />
              ))}
          </Box>
        </Box>
      </>
    );
  }
};

export default Dashboard;
