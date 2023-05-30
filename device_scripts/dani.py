import uuid
import requests
import time
import hashlib
import os
import sqlite3
from datetime import datetime


def measure():
    activeImport = 33333
    activeExport = 11111
    reactiveInductive = 22222
    reactiveCapacitive = 44444
    url = "http://es-rec.av.it.pt:3000/meters/measurement"
    meterId = os.uname().nodename
    timestamp = str(int(time.time()))
    mac = hex(uuid.getnode())
    apikey = "dev-"+meterId+"-it"
    e = meterId+timestamp+apikey+mac
    hash = hashlib.sha512(str.encode(e)).digest().hex()

    measure_JSON = {
        "deviceId": meterId,
        "activeImport": activeImport,
        "activeExport": activeExport,
        "reactiveInductive": reactiveInductive,
        "reactiveCapacitive": reactiveCapacitive,
        "timestamp": timestamp
    }

    r = requests.post(url,
                    headers={
                        'authorization': hash,
                        'deviceid': meterId,
                        'timestamp': timestamp
                    },
                    json=measure_JSON
                    )
    print('['+str(datetime.now())+'] Measurements sent.')

    store_payments(r)




def store_payments(r):
        conn = sqlite3.connect('/home/es-admin/setup_meter/payments.sqlite')
        cursor = conn.cursor()
        
        json_data = r.json()

        if "message" in json_data:
            print('['+str(datetime.now())+'] No json or blob: '+r.text)

        elif "jsonlist" in json_data:
            cursor.execute('''CREATE TABLE IF NOT EXISTS json_payments (id INTEGER PRIMARY KEY, identifier TEXT, buyer TEXT, seller TEXT, energy REAL, price REAL, timestamp TEXT)''')           

            #cursor.execute('''CREATE TABLE IF NOT EXISTS dlt_id (dlt TEXT, payment TEXT, FOREIGN KEY (payment) REFERENCES json_payments(identifier)) ''')

            for payment in json_data['jsonlist']['payments']:
                
                cursor.execute('''INSERT INTO json_payments (identifier, buyer, seller, energy, price, timestamp) VALUES (?,?,?,?,?,?)''',
                (str(payment['identifier']),str(payment['buyer']),str(payment['seller']),float(payment['energy']),float(payment['price']),str(int(time.time()))))

                conn.commit()

                print('['+str(datetime.now())+'] Payment '+str(payment['identifier'])+' was commited')
            
                

        elif "txlist" in json_data:
            cursor.execute('''CREATE TABLE IF NOT EXISTS tx_payments (id INTEGER PRIMARY KEY, tx BLOB, timestamp TEXT)''')
            for payment in json_data['txlist']['payments']:

                cursor.execute('''INSERT INTO tx_payments (tx, timestamp) VALUES (?,?)''', (sqlite3.Binary(payment['transaction']),str(int(time.time()))))

                conn.commit()
                print('['+str(datetime.now())+'] Payment '+str(payment['identifier'])+' was commited')
            

        else:
            print("DEFAULT")


        cursor.close()
        

measure()