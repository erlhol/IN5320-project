import React from "react";
import { useState, useEffect } from "react";
import { Button, CircularLoader } from "@dhis2/ui";
import Dropdown from "../components/common/Dropdown";
import Search from "../components/common/Search";
import Stepper from "../components/common/Stepper";
import { mergeCommodityAndValue } from "../utilities";
import CommodityTable from "../components/stockOverview/CommodityTable";
import { DataQuery, useDataQuery, useDataMutation } from "@dhis2/app-runtime";
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ display: "inline", margin: 0 }}>Stock Overview</h1>
          <div style={{ textAlign: "right", flex: 1 }}>
            <Button
              name="Primary button"
              onClick={() => handleOnModalChange("add_stock")}
              primary
              value="default"
              style={{ height: "100%" }}
            >
              Add Stock
            </Button>
          </div>
        </div>
        <p></p>

        {/* The input fields */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Search placeholder="Search commodity" width={"320px"}></Search>
          <Dropdown placeholder="Period"></Dropdown>
        </div>

        <p></p>

        {/* The commodity table */}
        <CommodityTable commodities={stockData}></CommodityTable>

        {currentModal === "add_stock" && (
          <Stepper title={"Add stock"} onClose={handleOnModalChange}></Stepper>
        )}
      </>
    );
  }
};

export default Inventory;
