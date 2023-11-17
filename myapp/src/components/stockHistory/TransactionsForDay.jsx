import React, { useState, useEffect } from "react";
import { Card, IconMore24, Tag, Box } from "@dhis2/ui";
import globalClasses from "../../App.module.css";
import classes from "./TransactionsForDay.module.css";

import TransactionDetailModal from "./TransactionDetailModal";

const TransactionsForDay = props => {
  /* Displays the transactions for a chosen day.
    The data is passed in through props */
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
          <div style={{ marginRight: "8px" }}>{firstTwoCommodityNames} </div>
          <Tag positive>{`+ ${extraCommoditiesCount}`}</Tag>
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
    <div className={globalClasses.clickable}>
      <div className={classes.transactionsDate}>{props.date}</div>
      <div className={classes.transactionsItems}>
        {props.transactions?.map((transaction, i) => {
          return (
            <div
              key={i}
              onClick={() => handleCardClick(transaction)}
              className={classes.transactionItemContainer}
            >
              <Box height="76px">
                <Card className={classes.transactionItem}>
                  <div className={classes.transactionItemFirstHalf}>
                    <div className={classes.transactionCommodities}>
                      {getCommodityNames(transaction.commodities)}
                    </div>
                    <span className={classes.transactionTime}>
                      {transaction.time}
                    </span>
                  </div>
                  <div className={classes.transactionItemSecondHalf}>
                    <div className={classes.transactionActors}>
                      <p>
                        <span>By: </span>
                        {transaction.type == "Dispensing"
                          ? transaction.dispensedBy
                          : transaction.dispensedTo}
                      </p>
                      {transaction.type === "Dispensing" && (
                        <p>
                          <span>To: </span>
                          {transaction.dispensedTo}
                        </p>
                      )}
                    </div>
                    <div className={classes.transactionType}>
                      {transaction.type == "Dispensing" ? (
                        <Tag>{`${transaction.type}`}</Tag>
                      ) : (
                        <Tag positive>{`${transaction.type}`}</Tag>
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
                        <div className={classes.updatedStockInfo}>
                          Updated stock:{" "}
                          {transaction.commodities[0].balanceAfterTrans}
                        </div>
                      ) : null}
                    </div>
                  </div>
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
    </div>
  );
};

export default TransactionsForDay;
