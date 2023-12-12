import requests
import sqlite3

baseUrl = "https://testnet.mirrornode.hedera.com"

connection = sqlite3.connect('contracts.sqlite')
cursor = connection.cursor()

def main():

    # file_path = '/home/dani/Documents/MsCThesis-Daniel/metrics/contracts/rec/buyerendpoints.txt'
    file_path = '/home/dani/Documents/MsCThesis-Daniel/metrics/contracts/rec/recendpoints.txt'



    # cursor.execute('''CREATE TABLE IF NOT EXISTS buyerTx (
    #                 transaction_id TEXT,
    #                charged_tx_fee INTEGER,
    #                amount INTEGER
    #             )''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS recTx (
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

    for transaction in response.json()['transactions']:
        negativo = 0

        for values in transaction['transfers']:
            if values['account'] == '0.0.829465':
                negativo += values["amount"]
        
        # cursor.execute("INSERT INTO buyerTx (transaction_id,charged_tx_fee,amount ) VALUES (?, ?, ?)", \
        #                (transaction['transaction_id'],transaction['charged_tx_fee'],negativo))
        cursor.execute("INSERT INTO recTx (transaction_id,charged_tx_fee,amount ) VALUES (?, ?, ?)", \
                       (transaction['transaction_id'],transaction['charged_tx_fee'],negativo))



        # print(transaction['transaction_id'])
        # print(transaction['charged_tx_fee'])
        # print(transaction['transfers'][len(transaction['transfers'])-1]['amount'])



def fetchTx():

    first = '/api/v1/transactions?account.id=0.0.829465&timestamp=gte:1697822839.513854941'
    #first = '/api/v1/transactions?account.id=0.0.4551131&timestamp=gte:1697822834.736595096'
    response = requests.get(baseUrl+first)
    while response.json()['links']['next']:
         print(baseUrl+response.json()['links']['next'])
         response = requests.get(baseUrl+response.json()['links']['next'])
main()