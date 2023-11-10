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
    <Modal onClose={() => props.onClose(null)}>
      <ModalContent>
        <h2>{props.selectedStock.commodityName}</h2>
        <div className={classes.modalContainer}>
          <StockInfo
            infoString={"Stock balance"}
            infoValue={props.selectedStock.endBalance}
            icon={<IconDimensionData16></IconDimensionData16>}
          ></StockInfo>

          <StockInfo
            infoString={"Consumption"}
            infoValue={props.selectedStock.consumption}
            icon={<IconArrowDown24></IconArrowDown24>}
          ></StockInfo>

          <StockInfo
            infoString={"Last dispensing"}
            infoValue={props.selectedStock.lastDispensing + "10/13/2023"}
            icon={<IconCalendar24></IconCalendar24>}
          ></StockInfo>
        </div>
        <h3>Consumption History</h3>
        <ConsumptionHistoryChart></ConsumptionHistoryChart>
      </ModalContent>
    </Modal>
  );
};
export default StockDetail;
