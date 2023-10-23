import React from "react";
import { Button } from "@dhis2/ui";
import Dropdown from "../utilities/Dropdown";
import Search from "../utilities/Search";
import CommodityTable from "../utilities/CommodityTable";

const Inventory = () => {

  // Mock values:
  let commodity = {name:"Commodity name", stockBalance:20, consumption:-50, lastdispensing:"08/15/2015"}
  let commodity2 = {name:"Commodity name2", stockBalance:10, consumption:-40, lastdispensing:"08/12/2010"}
  const list = [commodity,commodity2]

  return (
    <>
      {/* The header and the add stock button */}
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}
      >
        <h1 style={{ display: "inline", margin: 0 }}>Inventory</h1>
        <div style={{ textAlign: "right", flex: 1 }}>
          <Button name="Primary button" onClick={() => console.log("Add Stock clicked")} primary value="default" style={{ height: "100%" }}>
            Add Stock
          </Button>
        </div>
      </div>
      <p></p>

      {/* The input fields */}
      <div style={{ display: "flex", gap: '10px' }}>
        
        <Search placeholder='Search commodity' width={'320px'}></Search>
        <Dropdown placeholder= 'Period' ></Dropdown>
      </div>

      <p></p>

      {/* The commodity table */}
      <CommodityTable commodities={list}></CommodityTable>

    </>
  );
};

export default Inventory;