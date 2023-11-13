import React, { useState, useEffect } from "react";
import { Card, IconArrowRight24, IconMore24, Tag, Box } from "@dhis2/ui";
import classes from "../../App.module.css";
import TransactionDetailModal from "./TransactionDetailModal";

const TransactionsForDay = props => {
  /* Displays the transactions for a chosen day.
    The data is passed in through props */
  //console.log("props.transactions:", props.transactions);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleCardClick = transaction => {
    setSelectedTransaction(transaction);
  };

  const getCommodityNames = commodities => {
    const firstTwoCommodityNames = commodities
      .slice(0, 2)
      .map(c => c.commodityName)
      .join(", ");

    if (commodities.length > 2) {
      const extraCommoditiesCount = commodities.length - 2;
      return (
        <>
          <div style={{ marginRight: "8px" }}>{firstTwoCommodityNames}, </div>
          <Tag positive>+ {extraCommoditiesCount}</Tag>
        </>
      );
    }
    return firstTwoCommodityNames;
  };

  const getTransactionAmount = (commodities, type) => {
    if (commodities.length === 1) return commodities[0].amount;
    const totalAmount = commodities.reduce(
      (accumulator, obj) => accumulator + Number(obj.amount),
      0
    );
    return `${totalAmount > 0 ? "+" : ""}${totalAmount}`;
  };

  return (
    <>
      <div className={classes.transactionsDate}>{props.date}</div>
      <div className={classes.transactionsItems}>
        {props.transactions.map((transaction, i) => {
          return (
            <div
              key={i}
              onClick={() => handleCardClick(transaction)}
              className={classes.transactionItemContainer}
            >
              {/* TODO: fix the space-between to be equal - not taking text lenght into account */}
              <Box height="76px">
                <Card className={classes.transactionItem}>
                  <div className={classes.transactionItemFirstHalf}>
                    <div className={classes.transactionCommodities}>
                      {getCommodityNames(transaction.commodities)}
                    </div>
                    <span className={classes.transactionTime}>
                      {transaction.time.match(/(\d+:\d+):/)[1]}
                    </span>
                  </div>
                  <div className={classes.transactionItemSecondHalf}>
                    <div
                      className={`${classes.stockHistoryData} ${classes.transactionActors}`}
                    >
                      <span className={classes.dispensedBy}>
                        {transaction.dispensedBy}
                      </span>
                      <IconArrowRight24></IconArrowRight24>
                      <span className={classes.dispensedTo}>
                        {transaction.dispensedTo}
                      </span>
                    </div>
                    <div>
                      {transaction.type == "Dispensing" ? (
                        <Tag> {transaction.type} </Tag>
                      ) : (
                        <Tag positive> {transaction.type} </Tag>
                      )}
                    </div>
                    <div className={classes.transactionAmount}>
                      <div
                        style={{
                          color: transaction.type === "Restock" && "green",
                        }}
                      >
                        {getTransactionAmount(transaction.commodities)}
                      </div>
                      {transaction.commodities.length === 1 ? (
                        <div>
                          Updated stock:{" "}
                          {transaction.commodities[0].balanceAfterTrans}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <IconMore24 />
                </Card>
              </Box>
            </div>
          );
        })}
      </div>
      {selectedTransaction && (
        <div className={classes.transDetailModalWrapper}>
          <TransactionDetailModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            transType={
              selectedTransaction.type === "Dispensing"
                ? "Dispensed"
                : "Restocked"
            }
          />
        </div>
      )}
    </>
  );
};

export default TransactionsForDay;
