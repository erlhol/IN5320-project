import React from "react";
import { useState, useEffect } from "react";
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
import modalStyles from "./CommodityTransferModal.module.css";

const CommodityTransferModal = props => {
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [cancelModalPresent, setCancelModalPresent] = useState(false);
  const [datetime, setDatetime] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateInputs = status => {
    setIsValid(status);
  };

  const addCommodity = commodity => {
    const commodityWithRestockAmount = {
      ...commodity,
      amountToRestock: "",
      inputError: "",
    };
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

  const createErrorMessages = () => {
    // Go through selectedCommodities and validate each
    const commoditiesWithValidation = selectedCommodities.map(commodity => {
      const errorMessage = validateInput(
        commodity.amountToRestock,
        commodity.stockBalance
      );
      return {
        ...commodity,
        inputError: errorMessage,
      };
    })

    setSelectedCommodities(commoditiesWithValidation);


   /*  const allValid = selectedCommodities.every(
      commodity => !commodity.inputError
    );
    setIsValid(allValid); */
  };

  const validateForm = () => {
    createErrorMessages();
    const allValid = selectedCommodities.every(
      commodity => !commodity.inputError
    );
    setIsValid(allValid);
    setSubmitAttempted(false);
  }

  /* useEffect(() => {
    validateForm();
  }, [submitAttempted]); */

  const onSubmit = () => {
    console.log(datetime);
    setSubmitAttempted(true);
    validateForm();
    console.log(selectedCommodities);
    if (isValid) {
      console.log("submit");
    }
  };


  const validateInput = (value, stockBalance) => {
    if (value === "" || value === 0) {
      return "Enter amount to restock";
    } else if (value < 0) {
      return "Amount must be a positive";
    } else if (value > stockBalance && props.dispensing) {
      return "Amount cannot be greater than stock balance";
    }
    return "";
  };
  //TODO: preselected commodities to
  return (
    <Modal large>
      <ModalTitle>{props.title}</ModalTitle>
      <ModalContent className={modalStyles.addStockModal}>
        <div className={modalStyles.test}>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "8px" }}>
              <DateTimePicker
                datetime={datetime}
                setDatetime={setDatetime}
                dateIsValid={false} //TODO: compare to current date
                submitAttempted={submitAttempted}
              />
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
            validateInputs={validateInputs}
            submitAttempted={submitAttempted}
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
            onClick={onSubmit}
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
    </Modal>
  );
};
export default CommodityTransferModal;
