import React from "react";
import classes from "./StockOverview.module.css";
import {Button} from "@dhis2/ui";

const PreselectionHeader = props => {
  // TODO: need to set Modal true
  return (
    <div className={classes.preselectionHeader}>
      <div className={classes.preselectionNumber}>{props.number}</div>
      <div className={classes.preselectionText}>selected</div>
      <Button className={classes.preselectionButton} primary>
        Dispense Selected
      </Button>
    </div>
  );
};

export default PreselectionHeader;