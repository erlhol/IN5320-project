import React from "react";
import { Card } from "@dhis2/ui";
import classes from "../../App.module.css";

const StatisticCard = props => {
  return (
    <Card className={classes.statisticCard}>
      <div className={classes.dashboardCardTitle}>{props.title}</div>
      <div className={classes.statisticContent}>
        <div className={classes.statisticNumber}>{props.amount}</div>
        {props.icon}
      </div>
    </Card>
  );
};

export default StatisticCard;
