import sqlite3
import matplotlib.pyplot as plt

# Replace with the path to your SQLite database file
database_file = "real_dataset.sqlite"

# Function to fetch data from a table and return the data as two lists
def fetch_data(table_name):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    
    cursor.execute(f"SELECT total_bytes, row_count FROM {table_name} ORDER BY timestamp")
    rows = cursor.fetchall()
    
    bytes_per_row = [row[0] for row in rows]
    packet_numbers = [row[1] for row in rows]
    
    connection.close()
    
    return bytes_per_row, packet_numbers

# Fetch data from FilteredLocal and FilteredTest tables
filtered_bytes, filtered_packets = fetch_data("FilteredLocal")
test_bytes, test_packets = fetch_data("FilteredTest")

# Create the first line chart for bytes per row
plt.figure(figsize=(10, 5))
plt.plot(filtered_bytes, label='FilteredLocal')
plt.plot(test_bytes, label='FilteredTest')
plt.xlabel('Timestamp')
plt.ylabel('Bytes per Row')
plt.title('Bytes per Row Comparison')
plt.legend()
plt.grid()

# Show the first chart
plt.show()

# Create the second line chart for packet numbers
plt.figure(figsize=(10, 5))
plt.plot(filtered_packets, label='FilteredLocal')
plt.plot(test_packets, label='FilteredTest')
plt.xlabel('Timestamp')
plt.ylabel('Packet Number')
plt.title('Packet Number Comparison')
plt.legend()
plt.grid()

# Show the second chart
plt.show()
