import React from "react";
import {
  ModalTitle,
  Modal,
  ModalContent,
  IconDimensionData16,
  IconArrowDown24,
  IconCalendar24,
} from "@dhis2/ui";
import classes from "../../App.module.css";
import ConsumptionHistoryChart from "./charts/ConsumptionHistoryChart";
import DetailViewInfoBox from "../common/DetailViewInfoBox";
import TransactionsForDay from "../stockHistory/TransactionsForDay";
import {
  getTransByCommodityName,
  getMostRecentTransactionsObject,
} from "../../utilities/dataUtility";
import { getCurrentMonthName } from "../../utilities/dates";

const StockDetail = props => {
  const filteredByName = getTransByCommodityName(
    props.transactions,
    props.selectedStock.commodityName
  );

  const firstFiveTransactions = getMostRecentTransactionsObject(
    filteredByName,
    5
  );

  return (
    <Modal large onClose={() => props.onClose(null)}>
      <ModalTitle>{props.selectedStock.commodityName}</ModalTitle>
      <ModalContent className={classes.detailViewInfoBoxesContent}>
        <div className={classes.detailViewInfoBoxesContainer}>
          <DetailViewInfoBox
            infoString={"Stock balance"}
            infoValue={props.selectedStock.endBalance}
            icon={<IconDimensionData16></IconDimensionData16>}
          />
          <DetailViewInfoBox
            infoString={`Consumption for ${getCurrentMonthName()}`}
            infoValue={props.selectedStock.consumption}
            icon={<IconArrowDown24></IconArrowDown24>}
          />
          <DetailViewInfoBox
            infoString={"Last dispensing amount"}
            infoValue={props.selectedStock.lastDispensingAmount}
            infoValueText={props.selectedStock.lastDispensingDate}
            icon={<IconCalendar24 />}
          />
        </div>
        <div>
          <div className={classes.modalSubHeadline}>Consumption History</div>
          <ConsumptionHistoryChart
            commodity={props.selectedStock}
            monthlyStockData={props.monthlyStockData}
          />
        </div>
        <div>
          <div className={classes.modalSubHeadline}>Recent Transactions</div>
          <div className={classes.transactionsContainer}>
            {Object.keys(firstFiveTransactions).map((date, i) => (
              <TransactionsForDay
                key={i}
                date={date}
                transactions={firstFiveTransactions[date]}
              />
            ))}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
export default StockDetail;
