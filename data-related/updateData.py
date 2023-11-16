import json

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

def update_json_file(input_path, output_path):
    try:
        # Read the input JSON file
        with open(input_path, 'r') as input_file:
            json_data = json.load(input_file)

        # Update fields based on type
        updated_data = update_fields(json_data)

        # Write the updated JSON data to the output file
        with open(output_path, 'w') as output_file:
            json.dump(updated_data, output_file, indent=2)

        print(f'File updated successfully. Updated data written to {output_path}')
    except Exception as e:
        print(f'Error: {e}')

# Usage
update_json_file(file_path, output_file_path)