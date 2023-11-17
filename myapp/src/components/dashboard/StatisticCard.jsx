import React from "react";
import { Card, Button, IconInfo24 } from "@dhis2/ui";
import classes from "./StatisticCard.module.css";
import globalClasses from "../../App.module.css";

const StatisticCard = props => {
  return (
    <Card className={classes.statisticCard}>
      <div className={classes.statisticHeader}>
        <div
          className={`${globalClasses.dashboardCardTitle} ${classes.dayUntilDeliveryTitle}`}
        >
          {props.title}
        </div>
        {props.showStockInfoModal && (
          <div>
            <Button
              secondary
              small
              name="secondary"
              icon={<IconInfo24 />}
              onClick={props.showStockInfoModal}
            />
          </div>
        )}
      </div>
      <div className={classes.statisticContent}>
        <div className={classes.statisticNumber}>{props.number}</div>
        {props.icon}
      </div>
    </Card>
  );
};

export default StatisticCard;
