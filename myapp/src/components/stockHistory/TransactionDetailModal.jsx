import React from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  TableHead,
  TableBody,
  IconCalendar24,
  IconLogOut24,
  Table,
  TableCellHead,
  TableRowHead,
  TableRow,
  TableCell,
} from "@dhis2/ui";
import { spacers } from "@dhis2/ui";
import globalClasses from "../../App.module.css";
import classes from "./TransactionDetailModal.module.css";

import DetailViewInfoBox from "../common/DetailViewInfoBox";

export default function TransactionDetailModal(props) {
  return (
    <Modal onClose={() => props.onClose()} position="middle" large>
      <ModalTitle>Transaction Detail</ModalTitle>
      <ModalContent className={globalClasses.detailViewInfoBoxesContent}>
        <div className={globalClasses.detailViewInfoBoxesContainer}>
          <DetailViewInfoBox
            infoString={"Date and time"}
            infoValue={props.transaction.date + " " + props.transaction.time}
            icon={<IconCalendar24 />}
          />
          <DetailViewInfoBox
            infoString={
              props.transType === "Dispensed" ? "Recipient" : "Restocked by"
            }
            infoValue={props.transaction.dispensedTo}
            icon={<IconLogOut24 />}
          />
        </div>
        <div>
          <div className={globalClasses.modalSubHeadline}>
            {props.transType} Commodities
          </div>
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCellHead width={spacers.dp250} className={classes.bold}>
                  Commodity
                </TableCellHead>
                <TableCellHead className={classes.bold}>
                  {props.transType} amount
                </TableCellHead>
                <TableCellHead className={classes.bold}>
                  New stock balance
                </TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {props.transaction.commodities.map((commodity, i) => (
                <TableRow key={i}>
                  <TableCell width={spacers.dp250}>
                    {commodity.commodityName}
                  </TableCell>
                  <TableCell>{commodity.amount}</TableCell>
                  <TableCell>{commodity.balanceAfterTrans}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ModalContent>
    </Modal>
  );
}
