import sqlite3
import matplotlib.pyplot as plt
def fetch(table_name):       
    # Connect to your SQLite database
    conn = sqlite3.connect('txmetrics.sqlite')
    cursor = conn.cursor()

    # Retrieve the fee and transferred values from your table (replace 'your_table' with the actual table name)
    cursor.execute(f"SELECT fee, transferred, total FROM {table_name}")
    data = cursor.fetchall()
    fees = [row[0] for row in data]
    transferred_values = [row[1] for row in data]
    total = [row[2] for row in data]

    # Close the database connection
    conn.close()
    return fees,transferred_values,total


localfee,localtransfer,localtotal = fetch("localtxmetrics")
testfee,testtransfer,testtotal= fetch("testtxmetrics")

plt.figure(figsize=(10, 5))
plt.plot(testfee, label='Fee')
plt.plot(testtransfer, label='Transferred')
plt.xlabel('Transaction number')
plt.ylabel('Tinybars')
plt.title('Comparison ')
plt.legend()
plt.grid()
# Show the plot or save it to a file
plt.show()

