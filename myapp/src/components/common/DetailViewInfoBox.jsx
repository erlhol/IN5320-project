import React from "react";
import classes from "./Common.module.css";

const DetailViewInfoBox = props => {
  return (
    <div className={classes.infoBox}>
      {props.icon}
      <div className={classes.infoBoxContainer}>
        <div className={classes.infoBoxTitle}>{props.infoString}</div>
        <div className={classes.infoBoxValueContainer}>
          {props.infoValueText && (
            <div className={classes.infoBoxValueText}>
              {props.infoValueText}
            </div>
          )}
          <div className={classes.infoBoxValue}>{props.infoValue}</div>
        </div>
      </div>
    </div>
  );
};

export default DetailViewInfoBox;