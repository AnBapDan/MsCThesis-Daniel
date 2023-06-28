import uuid
import requests
import time
import hashlib
import os
import sqlite3
from datetime import datetime

### Method responsible for separating different types of retrieval according to the approach used from the server-side
def store_payments(post_request):

    ### Opening Database connection 
    conn = sqlite3.connect('/home/es-admin/setup_meter/payments.sqlite')
    cursor = conn.cursor()

    ### Get json information 
    json_data = post_request.json()

    if "message" in json_data:
        print('['+str(datetime.now())+'] No json or blob: '+post_request.text)

    ### Approach of JSON direct
    elif "jsonlist" in json_data:
        cursor.execute('''CREATE TABLE IF NOT EXISTS json_payments (id INTEGER PRIMARY KEY, identifier TEXT, buyer TEXT, seller TEXT, energy REAL, price REAL, timestamp TEXT)''')           

        #cursor.execute('''CREATE TABLE IF NOT EXISTS dlt_id (dlt TEXT, payment TEXT, FOREIGN KEY (payment) REFERENCES json_payments(identifier)) ''')

        ### Inserting each payment retrieved from POST into db for later processing
        for payment in json_data['jsonlist']['payments']:
            
            cursor.execute('''INSERT INTO json_payments (identifier, buyer, seller, energy, price, timestamp) VALUES (?,?,?,?,?,?)''',
            (str(payment['identifier']),str(payment['buyer']),str(payment['seller']),float(payment['energy']),float(payment['price']),str(int(time.time()))))

            conn.commit()

            print('['+str(datetime.now())+'] Payment '+str(payment['identifier'])+' was commited')
        
    ### Approach using Transaction Objects
    elif "txlist" in json_data:
        cursor.execute('''CREATE TABLE IF NOT EXISTS tx_payments (id INTEGER PRIMARY KEY, tx BLOB, timestamp TEXT)''')
        for payment in json_data['txlist']['payments']:

            cursor.execute('''INSERT INTO tx_payments (tx, timestamp) VALUES (?,?)''', (sqlite3.Binary(payment['transaction']),str(int(time.time()))))

            conn.commit()
            print('['+str(datetime.now())+'] Payment '+str(payment['identifier'])+' was commited')
        

    else:
        print("DEFAULT")


    cursor.close()
        