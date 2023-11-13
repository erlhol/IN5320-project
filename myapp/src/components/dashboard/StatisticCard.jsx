import React from "react";
import { Card, Button, IconInfo24 } from "@dhis2/ui";
import classes from "../../App.module.css";

const StatisticCard = props => {
  return (
    <Card className={classes.statisticCard}>
      <div className={classes.statisticHeader}>
        <div className={classes.dashboardCardTitle}>{props.title}</div>
        <div>
          <Button
            secondary
            small
            name="secondary"
            icon={<IconInfo24 />}
            onClick={() => {}}
          />
        </div>
      </div>
      <div className={classes.statisticContent}>
        <div className={classes.statisticNumber}>{props.amount}</div>
        {props.icon}
      </div>
    </Card>
  );
};

export default StatisticCard;
