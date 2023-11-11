import json

# Define the input and output file paths
input_path = "mockdata_11-05.json"
output_path = "mockdata_11-05_AGGREGATED.json"

# Read input data from the input file
with open(input_path, "r") as input_file:
    input_data = json.load(input_file)

# Initialize a dictionary to store aggregated transactions
aggregated_transactions = {}

# Iterate through the input data
for transaction in input_data:
    key = (transaction["date"], transaction["dispensedBy"], transaction["dispensedTo"])

    if key not in aggregated_transactions:
        aggregated_transactions[key] = {
            "date": transaction["date"],
            "time": transaction["time"],
            "type": transaction["type"],
            "dispensedBy": transaction["dispensedBy"],
            "dispensedTo": transaction["dispensedTo"],
            "commodities": [],
        }

    # Create a commodity object for the current transaction
    commodity = {
        "commodityId": transaction["commodityId"],
        "commodityName": transaction["commodityName"],
        "amount": transaction["amount"],
        "balanceAfterTrans": transaction["balanceAfterTrans"],
    }

    # Append the commodity to the list of commodities
    aggregated_transactions[key]["commodities"].append(commodity)

# Convert the dictionary values to a list to get the desired format
output_data = list(aggregated_transactions.values())

# Write the aggregated data to the output file
with open(output_path, "w") as output_file:
    json.dump(output_data, output_file, indent=4)

# Print a message to confirm the completion of the process
print("Aggregated data has been written to", output_path)