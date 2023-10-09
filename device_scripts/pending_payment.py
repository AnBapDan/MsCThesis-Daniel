import uuid
import requests
import time
import hashlib
import os
import sqlite3
from datetime import datetime
import subprocess
import mysql.connector


db_config = {
    "host": "localhost",     # Hostname of the database server
    "user": "root",     # Your database username
    "password": "", # Your database password
    "database": "payments"    # Name of the database
}


### Method responsible for separating different types of retrieval according to the approach used from the server-side
def store_payments(post_request):

    ### Opening Database connection 
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    ### Get json information 
    json_data = post_request.json()
    print(json_data)
    if "message" in json_data:
        print('['+str(datetime.now())+'] No json or blob: '+post_request.text)

    ### Approach of JSON direct
    elif "json" in json_data:
        cursor.execute('''CREATE TABLE IF NOT EXISTS json_payments (id INT AUTO_INCREMENT PRIMARY KEY, identifier TEXT, buyer TEXT, seller TEXT, energy FLOAT, price FLOAT, timestamp TEXT)''')

        for payment in json_data['json']:
            sql = '''INSERT INTO json_payments (identifier, buyer, seller, energy, price, timestamp) VALUES (%s, %s, %s, %s, %s, %s)'''
            values = (str(payment['id']), str(payment['buyerID']), str(payment['sellerID']), float(payment['energy']), float(payment['price']), str(payment['timestamp']))
            cursor.execute(sql, values)

            conn.commit()

            print('[' + str(datetime.now()) + '] Payment ' + str(payment['identifier']) + ' was committed')

    elif "transactions" in json_data:
        cursor.execute('''CREATE TABLE IF NOT EXISTS tx_payments (id INT AUTO_INCREMENT PRIMARY KEY, tx LONGBLOB, timestamp TEXT)''')
        
        for payment in json_data['transactions']['payments']:
            sql = '''INSERT INTO tx_payments (tx, timestamp) VALUES (%s, %s)'''
            values = (payment['transaction'], str(int(time.time())))
            cursor.execute(sql, values)

            conn.commit()
            print('[' + str(datetime.now()) + '] Payment was committed')

    else:
        print("DEFAULT")

    # Close the cursor and connection
    cursor.close()
    conn.close()

    # Command to run
    command = ['npx', 'ts-node', '/home/es-admin/Transactions/transactions/index.ts']

    try:
        # Run the command and capture the output
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        
        # Print the captured output
        print("Command output:")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        # If the command returns a non-zero exit code, handle the error
        print("Command failed with exit code:", e.returncode)
        print("Error output:")
        print(e.stderr)



