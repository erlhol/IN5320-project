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

const Dashboard = props => {
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const [transactions, setTransactions] = useState(() =>
    categorizeTransByDate(props.transactionData)
  );

  const stockDataPerMonth = [];
  for (let period of getPeriods()) {
    const { loading, error, data } = useDataQuery(stockRequest, {
      variables: { period: period[1] },
    });

    const periodStockData = mergeCommodityAndValue(
      data?.dataValues?.dataValues,
      data?.commodities?.dataSetElements,
      props.transactionData
    );

    stockDataPerMonth.push(periodStockData);
  }

  if (error) return <span>ERROR in getting stock data: {error.message}</span>;

  if (loading) return <CircularLoader large />;

  if (stockDataPerMonth && data) {
    const currentStockData = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements,
      props.transactionData
    );

    const numberCommoditiesOutOfStock = currentStockData.filter(
      commodity => commodity.endBalance == 0
    ).length;

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
              stockDataPerMonth={stockDataPerMonth}
            />
            <DispensingPerCommodity
              title="Dispensing per Commodity"
            />
          </Box>
          <Box>
            <div className={classes.transactionsHeader}>
              <h2>Recent Transactions</h2>
              <Button secondary name="secondary" value="add_stock">
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
