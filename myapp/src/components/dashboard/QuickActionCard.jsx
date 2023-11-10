import React from "react";
import { colors } from "@dhis2/ui";

import { Card, IconImportItems24 } from "@dhis2/ui";
import classes from "../../App.module.css";

// TODO: change icons
const QuickActionCard = () => {
  return (
    <Card className={classes.quickActionCard}>
      <div className={classes.quickAction}>
        <IconImportItems24 color={colors.grey600} />
        <div className={classes.quickActionText}>New Dispensing</div>
      </div>
      <div className={classes.divider} />
      <div className={classes.quickAction}>
        <IconImportItems24 color={colors.grey600} />
        <div>Add Stock</div>
      </div>
    </Card>
  );
};

export default QuickActionCard;
