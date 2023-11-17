import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useEffect } from "react";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import classes from "./App.module.css";
import { CircularLoader } from "@dhis2/ui";
import { transRequest } from "./utilities/requests";
import Sidenav from "./components/common/Sidenav";
import Dashboard from "./pages/Dashboard";
import StockInventory from "./pages/StockOverview";
import StockHistory from "./pages/StockHistory";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("appContainer")?.scrollIntoView();
  }, [pathname]);

  return null;
};

const MyApp = () => {
  return (
    <Router>
      <ScrollToTop />
      <MyAppContent />
    </Router>
  );
};

const MyAppContent = () => {
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
      <div className={classes.container} id="appContainer">
        <div className={classes.sidenav}>
          <Sidenav />
        </div>
        <section className={classes.content}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  transactionData={transactionData}
                  refetchTransData={refetch}
                />
              }
            />
            <Route
              path="/stock-overview"
              element={
                <StockInventory
                  transactionData={transactionData}
                  refetchTransData={refetch}
                />
              }
            />
            <Route
              path="/stock-history"
              element={
                <StockHistory
                  transactionData={transactionData}
                  refetchTransData={refetch}
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
