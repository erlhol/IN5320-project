import React from "react";
import { Button } from "@dhis2/ui";

import classes from "../../App.module.css";

const Header = ({
  title,
  subTitle,
  secondaryButtonLabel,
  primaryButtonLabel,
  secondaryButtonClick,
  primaryButtonClick,
}) => {
  return (
    <div className={classes.header}>
      <div>
        <h1 className={classes.headerTitle}>{title}</h1>
        <p>{subTitle}</p>
      </div>
      <div className={classes.headerButtons}>
        {secondaryButtonLabel && (
          <Button
            secondary
            name="secondary"
            value="add_stock"
            onClick={secondaryButtonClick}
          >
            {secondaryButtonLabel}
          </Button>
        )}
        {primaryButtonLabel && (
          <Button
            primary
            name="primary"
            value="new_dispensing"
            onClick={primaryButtonClick}
          >
            {primaryButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
