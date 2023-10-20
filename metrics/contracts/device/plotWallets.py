import sqlite3
import matplotlib.pyplot as plt

# Connect to the SQLite database
conn = sqlite3.connect('contracts.sqlite')
cursor = conn.cursor()

# Initialize initial values
initial_value = 200  # Initial value

# Retrieve the "amount" column from the "sellerTx" table and scale the values
cursor.execute("SELECT amount FROM sellerTx")
seller_data = [initial_value]  # Start with the initial value
for row in cursor.fetchall():
    initial_value += row[0] / 100_000_000  # Divide by 100 million
    seller_data.append(initial_value)

# Reset initial value
initial_value = 200  # Reset initial value

# Retrieve the "amount" column from the "BuyerTx" table and scale the values
cursor.execute("SELECT amount FROM BuyerTx")
buyer_data = [initial_value]  # Start with the initial value
for row in cursor.fetchall():
    initial_value += row[0] / 100_000_000  # Divide by 100 million
    buyer_data.append(initial_value)
    buyer_data.append(initial_value)
    buyer_data.append(initial_value)
    buyer_data.append(initial_value)

# Close the database connection
conn.close()

print('Buyer final value:'+str(buyer_data[-1]))
print('Seller final value:'+str(seller_data[-1]))
# Create x-axis values
x_values = list(range(1, max(len(seller_data), len(buyer_data)) + 1))

# Plot the data
plt.plot(x_values[:len(seller_data)], seller_data, label='SellerWallet', marker='o')
plt.plot(x_values[:len(buyer_data)], buyer_data, label='BuyerWallet', marker='s')

# Set axis labels and a legend
plt.xlabel('Temporal Transactions',fontsize=40)
plt.ylabel('Wallet Funds (HBar)',fontsize=40)
plt.legend(fontsize=36)
plt.xticks(fontsize=36)  # Adjust the fontsize as needed
plt.yticks(fontsize=36)  # Adjust the fontsize as needed
# Display the chart
plt.show()
