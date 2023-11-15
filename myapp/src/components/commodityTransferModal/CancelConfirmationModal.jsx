import React from "react";
import {
  Button,
  ButtonStrip,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions
} from "@dhis2/ui";

const CancelConfirmationModal = ({ setCancelModalPresent, onClose }) => {
  return (
    <Modal small>
      <ModalTitle>Are you sure you want to cancel?</ModalTitle>
      <ModalContent>All changes to this transaction will be lost.</ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button onClick={() => setCancelModalPresent(false)} secondary>
            No
          </Button>
          <Button
            destructive
            onClick={() => {
              setCancelModalPresent(false);
              onClose(null);
            }}
          >
            Yes
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
};

export default CancelConfirmationModal;
