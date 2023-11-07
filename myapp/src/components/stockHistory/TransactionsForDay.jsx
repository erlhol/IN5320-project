import React from "react";
import { Card, IconArrowRight24, IconMore24 } from "@dhis2/ui";
import classes from "../../App.module.css";

const TransactionsForDay = props => {
  /* Displays the transactions for a chosen day.
    The data is passed in through props */
  //console.log("props.transactions:", props.transactions);

  const getCommodityNames = commodities =>
    commodities.map(c => c.commodityName).join(", ");

  const getTransactionAmount = commodities => {
    const totalAmount = commodities.reduce((accumulator, obj) => {
      const amount =
        obj.amount[0] === "-"
          ? Number(obj.amount.substring(1))
          : Number(obj.amount);
      return accumulator + amount;
    }, 0);
    return `${totalAmount >= 0 ? "+" : ""}${totalAmount}`;
  };

  return (
    <>
      <h2>{props.date}</h2>
      <div className={classes.transactionsItems}>
        {props.transactions.map((transaction, i) => {
          return (
            <div key={i}>
              {/* TODO: fix the space-between to be equal - not taking text lenght into account */}
              <Card className={classes.transactionItem}>
                <div className={classes.transactionItemFirstHalf}>
                  <span className={classes.transactionCommodities}>
                    {getCommodityNames(transaction.commodities)}
                  </span>
                  <span>{transaction.time.substring(0, 5)}</span>
                </div>
                <div className={classes.transactionItemSecondHalf}>
                  <div
                    className={`${classes.stockHistoryData} ${classes.transactionActors}`}
                  >
                    <span className={classes.transactionActor}>
                      {transaction.dispensedBy}
                    </span>
                    <IconArrowRight24></IconArrowRight24>
                    <span className={classes.transactionActor}>
                      {transaction.dispensedTo}
                    </span>
                  </div>
                  <div>{transaction.type}</div>
                  <div className={classes.transactionAmount}>
                    <div>{getTransactionAmount(transaction.commodities)}</div>
                    {transaction.commodities.length === 1 ? (
                      <div>
                        Updated stock:{" "}
                        {transaction.commodities[0].balanceAfterTrans}
                      </div>
                    ) : null}
                  </div>
                </div>
                <IconMore24></IconMore24>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TransactionsForDay;
