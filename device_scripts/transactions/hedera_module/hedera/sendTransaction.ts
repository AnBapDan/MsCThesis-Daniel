import {
    AccountId,
    Client,
    Hbar,
    HbarUnit,
    PrivateKey,
    TopicId,
    TopicMessageSubmitTransaction,
    Transaction,
    TransactionResponse,
    TransferTransaction,
} from "@hashgraph/sdk";
import { getAccountId, retrieve } from "./loadKeys";

const mirror = "10.255.33.18:5600"
const node = { "10.255.33.18:50211": new AccountId(3) };

async function dummyTransaction() {
    const ed25519_client =
        Client
            //.forNetwork(node)
            .forTestnet()
            //.setMirrorNetwork(mirror)
            .setMaxAttempts(1000000);

    ed25519_client.setOperator(
        AccountId.fromString("0.0.3685177"),
        PrivateKey.fromStringED25519("0x302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da")
    );

    /** Creating Transaction Object */
    const transaction = await new TransferTransaction()
        /** Inserting Buyer Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString("0.0.3685177"), Hbar.from(-Math.abs(1), HbarUnit.Tinybar))

        /** Inserting Seller Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString("0.0.3782782"), Hbar.from(Math.abs(1), HbarUnit.Tinybar))

        /** Inserting Memo*/
        //.setTransactionMemo(`[${identifier}] Energy transactioned: ${energy}, at ${new Date(timestamp)}`)

        /**Sealing Transaction and executing on DLT */
        .execute(ed25519_client);

    return await getTxId(transaction, ed25519_client)
}

async function getTxId(transaction: TransactionResponse, deviceWallet: Client) {

    try {
        const transactionReceipt = await transaction.getReceipt(deviceWallet)
        console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}" with status: ${transactionReceipt.status.toString()} `)
        if (transactionReceipt.status.toString() === "SUCCESS") {
            return transaction.transactionId.toString()
        }
    } catch (error: any) {
        console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}": ${error.status} `)
        return '-1';
    }

}

export async function handleJsonPayment(entry: any) {

    const deviceWallet =
        Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    const key = await retrieve()
    const accountID = await getAccountId(key.publicKey.toStringDer())
    deviceWallet.setOperator(
        accountID,
        key
    );
    const { identifier, buyer, seller, energy, price, timestamp } = entry;
    if (!AccountId.fromString(buyer).equals(deviceWallet.operatorAccountId!)) return '-1';

    /** Creating Transaction Object */
    const transaction = await new TransferTransaction()
        /** Inserting Buyer Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString(buyer), Hbar.from(-Math.abs(price), HbarUnit.Tinybar))

        /** Inserting Seller Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString(seller), Hbar.from(Math.abs(price), HbarUnit.Tinybar))

        /** Inserting Memo*/
        .setTransactionMemo(`[${identifier}] Energy transactioned: ${energy}, at ${new Date(timestamp)}`)

        /**Sealing Transaction and executing on DLT */
        .execute(deviceWallet);

    return await getTxId(transaction, deviceWallet);
}


export async function handleTxPayment(entry: any) {
    const deviceWallet =
        Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    const key = await retrieve()
    const accountID = await getAccountId(key.publicKey.toStringDer())
    deviceWallet.setOperator(
        accountID,
        key
    );
    const { tx } = entry;
    /**Load Bytearray into Transaction Object */
    const payload = Transaction.fromBytes(tx);

    console.log(payload.transactionMemo)

    const transaction = await payload.execute(deviceWallet)

    return await getTxId(transaction, deviceWallet);
}

export async function emitTopicMessage(entry: any) {
    const deviceWallet =
        Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    const key = await retrieve()
    const accountID = await getAccountId(key.publicKey.toStringDer())
    deviceWallet.setOperator(
        accountID,
        key
    );
    const { payment, tx } = entry;

    const submit = await new TopicMessageSubmitTransaction()
        .setTopicId(TopicId.fromString("0.0.1066"))
        .setMessage(`${payment} : ${tx}`)
        .execute(deviceWallet);

    console.log((await submit.getReceipt(deviceWallet)).status.toString());
}
