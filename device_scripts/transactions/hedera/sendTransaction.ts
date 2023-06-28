import {
    AccountId,
    Client,
    Hbar,
    HbarUnit,
    PrivateKey,
    TopicMessageSubmitTransaction,
    Transaction,
    TransactionResponse,
    TransferTransaction,
} from "@hashgraph/sdk";

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

async function getTxId(transaction: TransactionResponse, ed25519_client: Client) {

    try {
        const transactionReceipt = await transaction.getReceipt(ed25519_client)
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

    const ed25519_client =
        Client
            //.forNetwork(node)
            .forTestnet()
            //.setMirrorNetwork(mirror)
            .setMaxAttempts(1000000);

    ed25519_client.setOperator(
        AccountId.fromString("0.0.1022"),
        PrivateKey.fromStringED25519("0xa608e2130a0a3cb34f86e757303c862bee353d9ab77ba4387ec084f881d420d4")
    );
    const { identifier, buyer, seller, energy, price, timestamp } = entry;
    if (!AccountId.fromString(buyer).equals(ed25519_client.operatorAccountId!)) return '-1';

    /** Creating Transaction Object */
    const transaction = await new TransferTransaction()
        /** Inserting Buyer Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString(buyer), Hbar.from(-Math.abs(price), HbarUnit.Tinybar))

        /** Inserting Seller Account and Hbar Value */
        .addHbarTransfer(AccountId.fromString(seller), Hbar.from(Math.abs(price), HbarUnit.Tinybar))

        /** Inserting Memo*/
        .setTransactionMemo(`[${identifier}] Energy transactioned: ${energy}, at ${new Date(timestamp)}`)

        /**Sealing Transaction and executing on DLT */
        .execute(ed25519_client);

    return await getTxId(transaction, ed25519_client);
}


export async function handleTxPayment(entry: any) {
    const ed25519_client =
        Client
            //.forNetwork(node)
            .forTestnet()
            .setMirrorNetwork(mirror)
            .setMaxAttempts(1000000);

    ed25519_client.setOperator(
        AccountId.fromString("0.0.1022"),
        PrivateKey.fromStringED25519("0xa608e2130a0a3cb34f86e757303c862bee353d9ab77ba4387ec084f881d420d4")
    );

    const { tx } = entry;
    /**Load Bytearray into Transaction Object */
    const payload = Transaction.fromBytes(tx);

    console.log(payload.transactionMemo)

    const transaction = await payload.execute(ed25519_client)

    return await getTxId(transaction, ed25519_client);
}

export async function emitTopicMessage(entry: any) {
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


    const { payment, tx } = entry;

    const submit = await new TopicMessageSubmitTransaction()
        .setTopicId("0.0.15010788")
        .setMessage(`${payment} : ${tx}`)
        .execute(ed25519_client);

    console.log((await submit.getReceipt(ed25519_client)).status.toString());
}
