import requests
import sqlite3

baseUrl = "https://testnet.mirrornode.hedera.com"

connection = sqlite3.connect('contracts.sqlite')
cursor = connection.cursor()

def main():

    file_path = '/home/dani/Documents/MsCThesis-Daniel/metrics/contracts/device/sellerendpoints.txt'


        # Create a new table called LocalPackets
    cursor.execute('''CREATE TABLE IF NOT EXISTS buyerTx (
                    transaction_id TEXT,
                   charged_tx_fee INTEGER,
                   amount INTEGER
                )''')
    with open(file_path, 'r') as file:
        for line in file:
            try:
                data = line.rsplit()[0]
                # request(line.rsplit()[0])
                request(data)
            except Exception as e:
                print(e)
                print(f"Error executing line: {line}")
    connection.commit()
    connection.close()
    


def request(line):
    response = requests.get(line)
    # print(response.json()['transactions'])
    for transaction in response.json()['transactions']:
        cursor.execute("INSERT INTO buyerTx (transaction_id,charged_tx_fee,amount ) VALUES (?, ?, ?)", \
                       (transaction['transaction_id'],transaction['charged_tx_fee'],transaction['transfers'][len(transaction['transfers'])-1]['amount']))
        # print(transaction['transaction_id'])
        # print(transaction['charged_tx_fee'])
        # print(transaction['transfers'][len(transaction['transfers'])-1]['amount'])


main()