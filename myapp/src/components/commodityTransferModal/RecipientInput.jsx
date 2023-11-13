import React from "react";
import { Input } from "@dhis2/ui";

const RecipientInput = ({ recipient, setRecipient }) => {
  return (
    <div>
      <label htmlFor="recipientInput">Recipient</label>
      <Input
        id="recipientInput"
        type="text"
        value={recipient}
        onChange={e => setRecipient(e.value)}
        placeholder="Enter Name of Recipient"
      />
    </div>
  );
};

export default RecipientInput;
