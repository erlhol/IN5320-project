import React from "react";
import { useState } from "react";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  AlertBar,
} from "@dhis2/ui";
import DateTimePicker from "./DateTimePicker";
import RecipientInput from "./RecipientInput";
import CancelConfirmationModal from "./CancelConfirmationModal";
import CommoditySelect from "./CommoditySelect";
import classes from "../../App.module.css";

const CommodityTransferModal = props => {
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [cancelModalPresent, setCancelModalPresent] = useState(false);
  const [datetime, setDatetime] = useState("");
  const [recipient, setRecipient] = useState("");

  const addCommodity = commodity => {
    console.log(commodity);
    if (
      selectedCommodities.find(
        selectedCommodity =>
          selectedCommodity.commodityName === commodity.commodityName
      )
    ) {
      setAlertOpen(true);
      return;
    }

    const commodityWithRestockAmount = { ...commodity, amountToRestock: "" };
    setSelectedCommodities([
      ...selectedCommodities,
      commodityWithRestockAmount,
    ]);
  };

  const setAmountToRestock = (commodity, value) => {
    const commodityWithRestockAmount = {
      ...commodity,
      amountToRestock: value,
    };
    setSelectedCommodities(
      selectedCommodities.map(selectedCommodity =>
        selectedCommodity.commodityName === commodity.commodityName
          ? commodityWithRestockAmount
          : selectedCommodity
      )
    );
  };

  const removeCommodity = commodity => {
    setSelectedCommodities(
      selectedCommodities.filter(
        selectedCommodity => selectedCommodity !== commodity
      )
    );
  };

  return (
    <Modal large>
      <ModalTitle>{props.title}</ModalTitle>
      <ModalContent className={classes.addStockModal}>
        <div>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "8px" }}>
              <DateTimePicker datetime={datetime} setDatetime={setDatetime} />
            </div>
            {props.dispensing && (
              <div style={{ flex: 1 }}>
                <RecipientInput
                  recipient={recipient}
                  setRecipient={setRecipient}
                />
              </div>
            )}
          </div>

          {/* TODO: should we disable future date and time settings */}
          {/* Main section */}
          <CommoditySelect
            stockData={props.stockData}
            addCommodity={addCommodity}
            selectedCommodities={selectedCommodities}
            removeCommodity={removeCommodity}
            setAmountToRestock={setAmountToRestock}
            dispensing={props.dispensing}
          />
        </div>
        {cancelModalPresent && (
          <CancelConfirmationModal
            setCancelModalPresent={setCancelModalPresent}
            onClose={props.onClose}
          />
        )}
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button onClick={() => setCancelModalPresent(true)} secondary>
            Cancel
          </Button>
          <Button
            onClick={() => props.onClose(true)}
            {...(datetime != "" && selectedCommodities.length > 0
              ? { primary: true }
              : { disabled: true })}
          >
            {/* TODO: Has to be disabled if amount to restock is missing */}
            {/* TODO: Check if amount to restock higher than stock! */}
            Submit
          </Button>
        </ButtonStrip>
      </ModalActions>
      <div className={classes.alertBarModal}>
        {alertOpen && (
          <AlertBar onHidden={() => setAlertOpen(false)} duration={1000}>
            Commodity already selected!
          </AlertBar>
        )}
      </div>
    </Modal>
  );
};
export default CommodityTransferModal;
