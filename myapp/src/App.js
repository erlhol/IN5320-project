import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import classes from "./App.module.css";
import { CircularLoader } from "@dhis2/ui";
import { transRequest } from "./utilities/requests";
import mockData from "./data/mockdata_11-05_AGGREGATED.json";
import Sidenav from "./components/common/Sidenav";
import Dashboard from "./pages/Dashboard";
import StockInventory from "./pages/StockOverview";
import StockHistory from "./pages/StockHistory";

const MyApp = () => {
  return (
    <Router>
      <MyAppContent />
    </Router>
  );
};

const MyAppContent = () => {
  // 3. For Stock Update:
  // const [updateStock] = useDataMutation(stockUpdateRequest);
  // useEffect(() => {
  //   const endBalances = {
  //     Boy3QwztgeZ: "0",
  //     hJNC4Bu2Mkv: "0",
  //     BXgDHhPdFVU: "16",
  //     Dkapzovo8Ll: "28",
  //     dY4OCwl0Y7Y: "24",
  //     W1XtQhP6BGd: "197",
  //     o15CyZiTvxa: "98",
  //     f27B1G7B3m3: "54",
  //     TCfIC3NDgQK: "392",
  //     WjDoIR27f31: "97",
  //     Lz8MM2Y9DNh: "42",
  //     d9vZ3HOlzAd: "40",
  //     JIazHXNSnFJ: "32",
  //   };

  //   for (const commodity in endBalances) {
  //     updateStock({
  //       dataElement: commodity,
  //       categoryOptionCombo: "J2Qf1jtZuj8", //endBalance
  //       value: endBalances[commodity],
  //     });
  //   }
  // }, []);

  //4. For Transaction Update:
  // const [transData, setTransData] = useState(mockData);
  // const [updateTrans] = useDataMutation(transUpdateRequest);
  // useEffect(() => {
  //   updateTrans({ data: transData });
  // }, []);

  const { loading, error, data, refetch } = useDataQuery(transRequest);

  if (error)
    return (
      <span>
        ERROR in getting transaction/stock history data: {error.message}
      </span>
    );
  if (loading) return <CircularLoader large />;
  if (data) {
    let transactionData = data.transactionHistory.data;
    return (
      <div className={classes.container}>
        <div className={classes.sidenav}>
          <Sidenav />
        </div>
        <section className={classes.content}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/stock-overview"
              element={<StockInventory transactionData={transactionData} />}
            />
            <Route
              path="/stock-history"
              element={
                <StockHistory
                  transactionData={transactionData}
                  refetchTransData={() => refetch()}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </section>
      </div>
    );
  }
};

export default MyApp;
