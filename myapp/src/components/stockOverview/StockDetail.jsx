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
  getTransByPeriod,
  getTransByCommodityName,
} from "../../utilities/dataUtility";

const StockDetail = props => {
  const selectedPeriod = {
    start: new Date("2023-08-01"),
    end: new Date("2023-11-30"),
  };

  const filteredByPeriod = getTransByPeriod(
    props.transactions,
    selectedPeriod.start,
    selectedPeriod.end
  );

  const filteredByName = getTransByCommodityName(
    filteredByPeriod,
    props.selectedStock.commodityName
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
          ></DetailViewInfoBox>
          <DetailViewInfoBox
            infoString={"Consumption"}
            infoValue={props.selectedStock.consumption}
            icon={<IconArrowDown24></IconArrowDown24>}
          ></DetailViewInfoBox>
          <DetailViewInfoBox
            infoString={"Last dispensing"}
            infoValue={props.selectedStock.lastDispensingAmount}
            infoValueText={props.selectedStock.lastDispensingDate}
            icon={<IconCalendar24 />}
          ></DetailViewInfoBox>
        </div>
        <h3 className={classes.subtitleDetailView}>Consumption History</h3>
        <ConsumptionHistoryChart
          commodity={props.selectedStock}
          monthlyStockData={props.monthlyStockData}
        ></ConsumptionHistoryChart>
        <h3>Transaction History</h3>
        {Object.keys(filteredByName).map((date, i) => (
          <TransactionsForDay
            key={i}
            date={date}
            transactions={filteredByName[date]}
          ></TransactionsForDay>
        ))}
      </ModalContent>
    </Modal>
  );
};
export default StockDetail;
