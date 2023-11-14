import React from "react";
import { InputField } from "@dhis2/ui";

const RecipientInput = ({ recipient, setRecipient }) => {
  return (
    <div>
      <InputField
        required
        id="recipientInput"
        label="Recipient"
        type="text"
        value={recipient}
        onChange={e => setRecipient(e.value)}
        placeholder="Enter name of recipient"
      />
    </div>
  );
};

export default RecipientInput;
