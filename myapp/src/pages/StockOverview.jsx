import React from "react";
import { useState, useEffect } from "react";
import { Button, CircularLoader } from "@dhis2/ui";
import { DataQuery, useDataQuery, useDataMutation } from "@dhis2/app-runtime";

import classes from "../App.module.css";
import Header from "../components/common/Header";
import Dropdown from "../components/common/Dropdown";
import Search from "../components/common/Search";
import Stepper from "../components/common/Stepper";
import CommodityTable from "../components/stockOverview/CommodityTable";
import { mergeCommodityAndValue } from "../utilities";
import {
  stockRequest,
  stockUpdateRequest,
  transRequest,
  transUpdateRequest,
} from "../requests";

const Inventory = () => {
  // TODO: Replace these mock values
  // let commodity = {name:"Commodity name", stockBalance:20, consumption:-50, lastdispensing:"08/15/2015"}
  // let commodity2 = {name:"Commodity name2", stockBalance:10, consumption:-40, lastdispensing:"08/12/2010"}
  // const list = [commodity,commodity2]

  const [currentModal, setCurrentModal] = useState("");
  // TODO: repace the period
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: "202305" },
  });

  const handleOnModalChange = value => {
    setCurrentModal(value);
  };

  if (error) return <span>ERROR: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    const stockData = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements
    );
    return (
      <>
        {/* The header and the add stock button */}
        <Header
          title="Stock Overview"
          primaryButtonLabel="Add Stock"
          primaryButtonClick={() => handleOnModalChange("add_stock")}
        />

        {/* The input fields */}
        <div className={classes.filterOptions}>
          <Search placeholder="Search commodity" width={"320px"} />
          <Dropdown placeholder="Period" />
        </div>

        <p></p>

        {/* The commodity table */}
        <CommodityTable commodities={stockData} />

        {currentModal === "add_stock" && (
          <Stepper title={"Add stock"} onClose={handleOnModalChange} />
        )}
      </>
    );
  }
};

export default Inventory;
