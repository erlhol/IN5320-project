import React from "react";
import {
  MenuItem,
  Modal,
  ModalContent,
  IconDimensionData16,
  IconArrowDown24,
  IconCalendar24,
} from "@dhis2/ui";
import classes from "../../App.module.css";
import ConsumptionHistoryChart from "./ConsumptionHistoryChart";
import DetailViewInfoBox from "../common/DetailViewInfoBox";
import TransactionsForDay from "../stockHistory/TransactionsForDay";
import {
  getTransByCommodityName,
  getMostRecentTransactionsObject,
} from "../../utilities/dataUtility";

const StockDetail = props => {
  const filteredByName = getTransByCommodityName(
    props.transactions,
    props.selectedStock.commodityName
  );

  // TODO: merge with dashboard function
  const firstFiveTransactions = getMostRecentTransactionsObject(
    filteredByName,
    5
  );

  return (
    <Modal large onClose={() => props.onClose(null)}>
      <ModalContent>
        <h2>{props.selectedStock.commodityName}</h2>
        <div className={classes.detailViewInfoBoxesContainer}>
          <DetailViewInfoBox
            infoString={"Stock balance"}
            infoValue={props.selectedStock.endBalance}
            icon={<IconDimensionData16></IconDimensionData16>}
          />
          <DetailViewInfoBox
            infoString={"Consumption"}
            infoValue={props.selectedStock.consumption}
            icon={<IconArrowDown24></IconArrowDown24>}
          />
          <DetailViewInfoBox
            infoString={"Last dispensing"}
            infoValue={props.selectedStock.lastDispensingAmount}
            infoValueText={props.selectedStock.lastDispensingDate}
            icon={<IconCalendar24 />}
          />
        </div>
        <h3 className={classes.subtitleDetailView}>Consumption History</h3>
        <ConsumptionHistoryChart
          commodity={props.selectedStock}
          monthlyStockData={props.monthlyStockData}
        />
        <h3>Recent Transactions</h3>
        {Object.keys(firstFiveTransactions).map((date, i) => (
          <TransactionsForDay
            key={i}
            date={date}
            transactions={firstFiveTransactions[date]}
          />
        ))}
      </ModalContent>
    </Modal>
  );
};
export default StockDetail;
