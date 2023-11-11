import React from "react";
import { useState } from "react";
import { Button, CircularLoader } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

import classes from "../App.module.css";
import Header from "../components/common/Header";
import Dropdown from "../components/common/Dropdown";
import Search from "../components/common/Search";
import Stepper from "../components/common/Stepper";
import CommodityTable from "../components/stockOverview/CommodityTable";
import { mergeCommodityAndValue } from "../utilities/datautility";
import {stockRequest,} from "../utilities/requests";
import { getCurrentMonth } from "../utilities/dates";
import { filterBySearch } from "../utilities/search";

const Inventory = props => {
  const [modalPresent, setModalPresent] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");

  const { loading, error, data, refetch } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const handleOnModalChange = () => {
    setModalPresent(previousValue => !previousValue);
  };

  const handleOnChangeSearch = value => {
    setCurrentSearch(value.value);
  };

  if (error) return <span>ERROR in getting stock data: {error.message}</span>;
  if (loading) return <CircularLoader large />;
  if (data) {
    const stockData = mergeCommodityAndValue(
      data.dataValues?.dataValues,
      data.commodities?.dataSetElements,
      props.transactionData
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

        {/* The commodity table */}
        <CommodityTable commodities={filteredStockData} />

        {modalPresent && (
          <Stepper
            title={"Add stock"}
            onClose={handleOnModalChange}
            refetchData = {refetch}
            allCommodities={data.commodities?.dataSetElements}
            existedTransData={props.transactionData}
          />
        )}
      </>
    );
  }
};

export default Inventory;