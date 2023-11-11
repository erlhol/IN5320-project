import json
import csv

# Specify the paths for your JSON and CSV files
json_file_path = 'mockData.json'  # Replace with the path to your JSON file
csv_file_path = 'mockData.csv'  # Replace with the desired path for your CSV file

# Read JSON data from the file
with open(json_file_path, 'r') as json_file:
    json_data = json.load(json_file)

# Check if the JSON data is a list of dictionaries
if not isinstance(json_data, list) or not all(isinstance(item, dict) for item in json_data):
    print("JSON data should be a list of dictionaries.")
else:
    # Extract column headers from the first dictionary
    headers = json_data[0].keys()

    # Write the JSON data to a CSV file
    with open(csv_file_path, 'w', newline='') as csv_file:
        csv_writer = csv.DictWriter(csv_file, fieldnames=headers)
        csv_writer.writeheader()
        csv_writer.writerows(json_data)

    print(f"JSON data has been successfully converted to CSV and saved as '{csv_file_path}'.")