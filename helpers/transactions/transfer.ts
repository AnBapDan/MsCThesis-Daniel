import {
    AccountId,
    Client,
    Hbar,
    HbarUnit,
    PrivateKey,
    TransferTransaction,
} from "@hashgraph/sdk";
import * as fs from 'fs';

export async function testTransaction(id: string, energy: string, price: number, timestamp: string) {
    const node = { "34.94.106.61:50211": new AccountId(3) };

    const ed25519_client =
        Client
            .forNetwork(node)
            .setMirrorNetwork("34.94.106.61:5600")
            .setMaxAttempts(1000000);

    ed25519_client.setOperator(
        AccountId.fromString("0.0.829465"),
        PrivateKey.fromString("302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da")
    );

    /** Creating Transaction Object */
    const transaction = await new TransferTransaction()
        /** Inserting Buyer Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString("0.0.829465"), Hbar.from(-Math.abs(price), HbarUnit.Hbar))

        /** Inserting Seller Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString("0.0.1031"), Hbar.from(Math.abs(price), HbarUnit.Hbar))

        /** Inserting Memo*/
        .setTransactionMemo(`[${id}] Energy transactioned: ${energy}, at ${new Date(timestamp).getTime()}`)

        /**Sealing Transaction and executing on DLT */
        .execute(ed25519_client);

    console.log("Testnet = " + transaction.transactionId.toString())
}

export async function localnode(id: string, energy: string, price: number, timestamp: string) {
    const mirror = "10.255.33.18:5600"
    const node = { "10.255.33.18:50211": new AccountId(3) };
    const deviceWallet =
        Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    const key = PrivateKey.fromString(atob("MzAyZTAyMDEwMDMwMDUwNjAzMmI2NTcwMDQyMjA0MjA2Mjg2Mzg3NTdmMDE0NDhjOTVmMDM2ZGM3MjRhMzc0MDIwZjI0NGMyNjM4ZDIzZTFlZDRhY2JkODk5NjQ1ODc0Cg=="))
    deviceWallet.setOperator(
        AccountId.fromString("0.0.1034"),
        key
    );

    /** Creating Transaction Object */
    const transaction = await new TransferTransaction()
        /** Inserting Buyer Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString("0.0.1034"), Hbar.from(-Math.abs(price), HbarUnit.Hbar))

        /** Inserting Seller Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString("0.0.1002"), Hbar.from(Math.abs(price), HbarUnit.Hbar))

        /** Inserting Memo*/
        .setTransactionMemo(`[${id}] Energy transactioned: ${energy}, at ${new Date(timestamp).getTime()}`)

        /**Sealing Transaction and executing on DLT */
        .execute(deviceWallet);

    console.log("LocalNode = " + transaction.transactionId.toString())
}