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
const StockInfo = props => {
  return (
    <div className={classes.stockInfo}>
      {props.icon}
      <div>
        <p>{props.infoString}</p>
        <b>{props.infoValue}</b>
      </div>
    </div>
  );
};

const StockDetail = props => {
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
        ></ConsumptionHistoryChart>
        <h3>Transaction History</h3>
      </ModalContent>
    </Modal>
  );
};
export default StockDetail;
