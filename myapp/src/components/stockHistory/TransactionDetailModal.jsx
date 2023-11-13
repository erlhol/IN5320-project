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
  Box,
} from "@dhis2/ui";
import { spacers } from "@dhis2/ui";
import classes from "../../App.module.css";

export default function TransactionDetailModal(props) {
  return (
    <Modal onClose={() => props.onClose()} position="middle" large>
      <ModalTitle>Transaction Detail</ModalTitle>
      <ModalContent>
        <Box height="360px">
          <div className={classes.transDetailTimeAndRecipientContainer}>
            <div className={classes.transDetailTimeContainer}>
              <IconCalendar24 />
              <div className={classes.transDetailTimeText}>
                <p>Date and Time</p>
                <p className={classes.bold}>
                  {props.transaction.date + " " + props.transaction.time}
                </p>
              </div>
            </div>
            <div className={classes.transDetailRecipientContainer}>
              <IconLogOut24 />
              <div className={classes.transDetailRecipientText}>
                <p>Recipient</p>
                <p className={classes.bold}>{props.transaction.dispensedTo}</p>
              </div>
            </div>
          </div>
          <div className={classes.transDetailTableCaption}>
            {props.transType} Commodities
          </div>
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCellHead width={spacers.dp250} className={classes.bold}>
                  Commodity
                </TableCellHead>
                <TableCellHead className={classes.bold}>
                  {props.transType} Amount
                </TableCellHead>
                <TableCellHead className={classes.bold}>
                  Updated Stock
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
        </Box>
      </ModalContent>
    </Modal>
  );
}
