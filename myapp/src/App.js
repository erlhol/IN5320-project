import React, { useState, useEffect } from "react";
import { DataQuery, useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import classes from "./App.module.css";
import { CircularLoader } from "@dhis2/ui";
import { transRequest, transUpdateRequest } from "./requests";
import mockData from "./data/mockdata11-04.json";

import Sidenav from "./components/common/Sidenav";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/StockOverview";
import Transactions from "./pages/StockHistory";

const MyApp = () => {
  /* State for handling navigation */
  const [activePage, setActivePage] = useState("Dashboard");

  function activePageHandler(page) {
    setActivePage(page);
  }

  // 3. For Stock Update:
  //    const [updateStock] = useDataMutation(stockUpdateRequest);
  //     useEffect(() => {
  //       updateStock({
  //           dataElement: "W1XtQhP6BGd",
  //           categoryOptionCombo: "J2Qf1jtZuj8",  //endBalance
  //           value: "321",
  //       })
  //     }, [])

  //4. For Transaction Update:
  // const [transData, setTransData] = useState(mockData);
  // const [updateTrans] = useDataMutation(transUpdateRequest);
  // useEffect(() => {
  //   updateTrans({ data: transData });
  // }, []);

  const { loading, error, data } = useDataQuery(transRequest);
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
          <Sidenav
            activePage={activePage}
            activePageHandler={activePageHandler}
          />
        </div>
        <section className={classes.content}>
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "StockOverview" && (
            <Inventory transactionData={transactionData} />
          )}
          {activePage === "StockHistory" && (
            <Transactions transactionData={transactionData} />
          )}
        </section>
      </div>
    );
  }
};

export default MyApp;
