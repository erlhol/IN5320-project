import React from "react";
import classes from "./StockOverview.module.css";
import { Button } from "@dhis2/ui";

const PreselectionHeader = props => {
  return (
    <div className={classes.preselectionHeader}>
      <div className={classes.preselectionNumber}>{props.number}</div>
      <div className={classes.preselectionText}> commodities selected</div>
      <Button
        small
        className={classes.preselectionButton}
        onClick={() => props.handleOnModalChange("dispensing")}
      >
        Dispense selected
      </Button>
    </div>
  );
};

export default PreselectionHeader;
