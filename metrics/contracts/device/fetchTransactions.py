import requests
import sqlite3

baseUrl = "https://testnet.mirrornode.hedera.com"


def main():

    file_path = '/home/dani/Documents/MsCThesis-Daniel/metrics/contracts/device/sellerendpoints.txt'

    with open(file_path, 'r') as file:
        for line in file:
            try:
                print(line)
                request(line)
            except Exception as e:
                print(f"Error executing line: {line}")

    


def request(line):
    response = requests.get(line)
    print(response)
    print(response.json())

main()