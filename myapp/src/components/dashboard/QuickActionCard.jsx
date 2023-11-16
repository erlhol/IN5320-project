import React from "react";
import { colors } from "@dhis2/ui";

import { Card, IconImportItems24, IconExportItems24 } from "@dhis2/ui";
import classes from "../../App.module.css";

const QuickActionCard = ({ onTransferModalChange }) => {
  return (
    <Card className={classes.quickActionCard}>
      <div
        className={classes.quickAction}
        onClick={() => onTransferModalChange("restock")}
      >
        <IconImportItems24 color={colors.grey600} />
        <div className={classes.quickActionText}>Add Stock</div>
      </div>
      <div className={classes.divider} />
      <div
        className={classes.quickAction}
        onClick={() => onTransferModalChange("dispensing")}
      >
        <IconExportItems24 color={colors.grey600} />
        <div className={classes.quickActionText}>New Dispensing</div>
      </div>
    </Card>
  );
};

export default QuickActionCard;
