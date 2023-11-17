import React from "react";

import { Modal, ModalTitle, ModalContent, Divider, Tag } from "@dhis2/ui";
import classes from "../../App.module.css";

const StockAmountModal = props => {
  return (
    <Modal onClose={props.closeStockInfoModal}>
      <ModalTitle>{props.title}</ModalTitle>
      <ModalContent className={classes.stockInfoModalContent}>
        {props.commodities.map((commodity, index) => (
          <div key={index}>
            <div className={classes.stockInfoModalCommodities}>
              <div>
                <span>{commodity.commodityName}</span>
                <div className={classes.stockInfoModalEndBalance}>
                  Remaining Stock:
                  {` ${commodity.endBalance}`}
                </div>
              </div>

              <Tag
                className={
                  commodity.endBalance === 0
                    ? classes.commoditiesOutTag
                    : classes.commoditiesLowTag
                }
              >
                {commodity.endBalance === 0 ? "Out of stock" : "Low in stock"}
              </Tag>
            </div>
            {index < props.commodities.length - 1 && <Divider />}
          </div>
        ))}
      </ModalContent>
    </Modal>
  );
};

export default StockAmountModal;
