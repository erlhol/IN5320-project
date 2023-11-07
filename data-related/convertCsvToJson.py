import csv
import json

# Specify the paths for your CSV and JSON files
csv_file_path = 'mockdata_11-05.csv'  # Replace with the path to your CSV file
json_file_path = 'mockdata_11-05.json'  # Replace with the desired path for your JSON file

# Initialize an empty list to store the JSON data
json_data = []

# Read CSV data and convert it to JSON
with open(csv_file_path, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter=';')
    for row in csv_reader:
        json_data.append({
            "commodityId": row['commodityId'],
            "commodityName": row['commodityName'],
            "amount": int(row['amount']),
            "balanceAfterTrans": int(row['balanceAfterTrans']),
            "dispensedBy": row['dispensedBy'],
            "dispensedTo": row['dispensedTo'],
            "date": row['date'],
            "time": row['time'],
            "type": row['type']
        })

# Write JSON data to a JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

print(f"CSV data with semicolon delimiter has been successfully converted to JSON and saved as '{json_file_path}'.")
