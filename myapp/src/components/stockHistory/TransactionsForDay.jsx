import React from "react";
import { Card, IconArrowRight24, IconMore24 } from "@dhis2/ui";
import classes from "../../App.module.css";

const TransactionsForDay = props => {
  /* Displays the transactions for a chosen day.
    The data is passed in through props */
  return (
    <>
      <h2>{props.date}</h2>
      <div className={classes.transactionsItems}>
        {props.transactions.map((transaction, i) => (
          <div key={i}>
            {/* TODO: fix the space-between to be equal - not taking text lenght into account */}
            <Card className={classes.transactionItem}>
              <div className={classes.transactionItemFirstHalf}>
                <span className={classes.transactionCommodities}>
                  {transaction.commodityName}
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
                <div className={classes.transactionAmount}>
                  <div>{transaction.amount}</div>
                  <div>Updated stock: {transaction.balanceAfterTrans}</div>
                </div>
              </div>
              <IconMore24></IconMore24>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransactionsForDay;
