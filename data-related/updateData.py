import json
import random
from datetime import datetime

file_path = 'mockdata_11-05_AGGREGATED.json'
output_file_path = 'mockData_11-16.json'

def update_fields(json_data):
    for item in json_data:
        if 'type' in item:
            if item['type'] == 'Dispensing':
                item['dispensedBy'] = 'John abel'
                item['dispensedTo'] = 'recipient'
            elif item['type'] == 'Restock':
                item['dispensedBy'] = ''
                item['dispensedTo'] = 'John abel'
    return json_data


def update_recipient(json_data):
    names = ["Ethan Robinson", "Sara Brown", "Ella Garcia", "Mia Miller", "Mason Liu", "Aria Ali"]
    for entry in json_data:
        if "dispensedTo" in entry and entry["dispensedTo"] == "recipient":
            entry["dispensedTo"] = random.choice(names)
    return json_data

def convert_time_format(json_data):
    for entry in json_data:
        if "time" in entry:
            # Parse input time string
            input_datetime = datetime.strptime(entry["time"], '%H:%M:%S')
            # Format the datetime object in 12-hour clock format with AM/PM
            output_time = input_datetime.strftime('%I:%M %p')
            entry["time"] = output_time
    return json_data


def update_json_file(input_path, output_path):
    try:
        # Read the input JSON file
        with open(input_path, 'r') as input_file:
            json_data = json.load(input_file)

        # Update fields based on type
        updated_data = update_fields(json_data)
        updated_data = update_recipient(updated_data)
        updated_data = convert_time_format(updated_data)

        # Write the updated JSON data to the output file
        with open(output_path, 'w') as output_file:
            json.dump(updated_data, output_file, indent=2)

        print(f'File updated successfully. Updated data written to {output_path}')
    except Exception as e:
        print(f'Error: {e}')

# Usage
update_json_file(file_path, output_file_path)