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
const StockDetail = props => {
  return (
    <Modal onClose={() => props.onClose(null)}>
      <h1>{props.selectedStock.commodityName}</h1>
      <div className={classes.modalContainer}>
        <div className={classes.stockInfo}>
          <div style={{ height: "100%" }}>
            <IconDimensionData16
              style={{ fontSize: "24px" }}
            ></IconDimensionData16>
          </div>
          <div>
            <p>Stock balance</p>
            <b>{props.selectedStock.endBalance}</b>
          </div>
        </div>
        <div className={classes.stockInfo}>
          <IconArrowDown24></IconArrowDown24>
          <div>
            <p>Consumption</p>
            <b>{props.selectedStock.consumption}</b>
          </div>
        </div>
        <div className={classes.stockInfo}>
          <IconCalendar24></IconCalendar24>
          <div>
            <p>Last dispensing</p>
            <b>10/13/2023{props.selectedStock.lastDispensing}</b>
          </div>
        </div>
      </div>
      <ModalContent>StockDetail</ModalContent>
    </Modal>
  );
};
export default StockDetail;
