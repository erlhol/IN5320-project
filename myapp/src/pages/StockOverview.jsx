import React from "react";
import { useState, useEffect } from "react";
import { CircularLoader, AlertBar } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import classes from "../App.module.css";
import Header from "../components/common/Header";
import Search from "../components/common/Search";
import CommodityTransferModal from "../components/commodityTransferModal/CommodityTransferModal";
import CommodityTable from "../components/stockOverview/CommodityTable";
import { mergeCommodityAndValue } from "../utilities/dataUtility.js";
import { stockRequest } from "../utilities/requests";
import { getCurrentMonth } from "../utilities/dates";
import { filterBySearch } from "../utilities/search";

const StockInventory = props => {
  const [modalPresent, setModalPresent] = useState(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const [preselectedCommodities, setPreselectedCommodities] = useState([]);
  const [alertBarText, setAlertBarText] = useState("");

  const { loading, error, data, refetch } = useDataQuery(stockRequest, {
    variables: { period: getCurrentMonth() },
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleOnModalChange = value => {
    setModalPresent(value);

  };

  useEffect(() => {
    if (modalPresent != null ) {
      setPreselectedCommodities([]);
    }
  }, [modalPresent])

  const handleOnChangeSearch = searchobj => {
    setCurrentSearch(searchobj.value);
    setCurrentPage(1); // Need to reset the current page to avoid searching out of bounds error
  };

  const refetchData = dispensing => {
    refetch();
    setAlertBarText(
      dispensing ? "Dispensing successful" : "Restock successful"
    );
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
          primaryButtonClick={() => handleOnModalChange("restock")}
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
        <CommodityTable
          commodities={filteredStockData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          preselectedCommodities={preselectedCommodities}
          setPreselectedCommodities={setPreselectedCommodities}
          handleOnModalChange={handleOnModalChange}
        />

        {modalPresent != null && (
          <CommodityTransferModal
            onClose={handleOnModalChange}
            dispensing={modalPresent === "dispensing"}
            refetchData={refetchData}
            allCommodities={data.commodities?.dataSetElements}
            existedTransData={props.transactionData}
            preselectedCommodities={preselectedCommodities}
          />
        )}
        {alertBarText && (
          <AlertBar type="success" className={classes.alertBar}>
            {alertBarText}
          </AlertBar>
        )}
      </>
    );
  }
};

export default StockInventory;
