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
import { getCurrentMonth } from "../dates";
import { filterBySearch } from "../search";

const Inventory = () => {
  // TODO: Replace these mock values
  // let commodity = {name:"Commodity name", stockBalance:20, consumption:-50, lastdispensing:"08/15/2015"}
  // let commodity2 = {name:"Commodity name2", stockBalance:10, consumption:-40, lastdispensing:"08/12/2010"}
  // const list = [commodity,commodity2]

  const [modalPresent, setModalPresent] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  // TODO: repace the period
  const { loading, error, data } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

  const handleOnChangeSearch = value => {
    setCurrentSearch(value.value);
  };

  if (error) return <span>ERROR: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    const stockData = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements
    );
    const filteredStockData = filterBySearch(stockData, currentSearch);
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
          <Search
            currentSearch={currentSearch}
            onSearchChange={handleOnChangeSearch}
            placeholder="Search commodity"
            width={"320px"}
          />
        </div>

        <p></p>

        {/* The commodity table */}
        <CommodityTable commodities={filteredStockData} />

        {modalPresent && (
          <Stepper title={"Add stock"} onClose={handleOnModalChange} />
        )}
      </>
    );
  }
};

export default Inventory;