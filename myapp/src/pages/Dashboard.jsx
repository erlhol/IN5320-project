import React, { useState } from "react";
import { colors } from "@dhis2/ui";
import {
  Box,
  IconBlock24,
  IconWarningFilled24,
  CircularLoader,
} from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

import { categorizeTransByDate, mergeCommodityAndValue } from "../utilities";
import { stockRequest } from "../requests";

import classes from "../App.module.css";

import Header from "../components/common/Header";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import StatisticCard from "../components/dashboard/StatisticCard";
import MostDispensed from "../components/dashboard/charts/MostDispensed";
import DispensingPerCommodity from "../components/dashboard/charts/DispensingPerCommodity";
import TransactionsForDay from "../components/stockHistory/TransactionsForDay";

const Dashboard = props => {
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: "202305" }, // TODO: right period?
  });

  const [transactions, setTransactions] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

  if (error) return <span>ERROR in getting stock data: {error.message}</span>;

  if (loading) return <CircularLoader large />;

  if (data) {
    const stockData = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements,
      props.transactionData
    );

    const numberCommoditiesOutOfStock = stockData.filter(
      commodity => commodity.endBalance == 0
    ).length;

    const mostDispensedCommodities = stockData
      .sort((a, b) => {
        return b.consumption - a.consumption;
      })
      .slice(0, 4);

    return (
      <>
        <Header title="Dashboard" />
        <Box className={classes.dashboardContent}>
          <Box className={classes.dashboardFirstRow}>
            <QuickActionCard />
            <StatisticCard
              title="Commodities out of Stock"
              amount={numberCommoditiesOutOfStock}
              icon={<IconBlock24 color={colors.red400} />}
            />
            <StatisticCard
              title="Commodities low in Stock"
              amount="20"
              icon={<IconWarningFilled24 color={colors.yellow400} />}
            />
          </Box>
          <Box className={classes.dashboardSecondRow}>
            <MostDispensed
              title="Most dispensed Commodities"
              data={mostDispensedCommodities}
            />
            <DispensingPerCommodity
              title="Dispensing per Commodity"
              data={stockData}
            />
          </Box>
          <Box>
            <span>Recent Transactions</span>
            {/* TODO: add link */}
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
