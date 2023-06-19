import {
    AccountId,
    Client,
    Hbar,
    HbarUnit,
    PrivateKey,
    Transaction,
    TransferTransaction,
} from "@hashgraph/sdk";


async function availabilityTest() {
    console.log("here")
    // const mirror = "10.255.33.18:5600"

    // const node = { "10.255.33.18:50211": new AccountId(3) };
    // const ed25519_client = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    // ed25519_client.setOperator(
    //     AccountId.fromString("0.0.1022"),
    //     PrivateKey.fromStringED25519("0xa608e2130a0a3cb34f86e757303c862bee353d9ab77ba4387ec084f881d420d4")
    // );

    const mirror = "10.255.33.18:5600"

    const node = { "10.255.33.18:50211": new AccountId(3) };
    let managerClient = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);

    managerClient.setOperator(
        AccountId.fromString("0.0.2"),
        PrivateKey.fromString("302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137"),
    );

    const transaction = await new TransferTransaction()
        //THIS FIRST PART NEED REFACTOR ON DEPLOY
        .addHbarTransfer(managerClient.operatorAccountId!, Hbar.from(-1, HbarUnit.Tinybar))
        .addHbarTransfer(AccountId.fromString("0.0.2"), Hbar.from(1, HbarUnit.Tinybar))
        .execute(managerClient);
    const transactionReceipt = await transaction.getReceipt(managerClient);
    console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}" with status: ${transactionReceipt.status.toString()} `)
    if (transactionReceipt.status.toString() === "SUCCESS") {
        return transaction.transactionId.toString()
    }
}



export async function handleJsonPayment(entry: any) {
    const mirror = "10.255.33.18:5600"

    const node = { "10.255.33.18:50211": new AccountId(3) };
    const ed25519_client = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    ed25519_client.setOperator(
        AccountId.fromString("0.0.1022"),
        PrivateKey.fromStringED25519("0xa608e2130a0a3cb34f86e757303c862bee353d9ab77ba4387ec084f881d420d4")
    );

    const { id, identifier, buyer, seller, energy, price, timestamp } = entry;

    const transaction = await new TransferTransaction()
        //THIS FIRST PART NEED REFACTOR ON DEPLOY
        .addHbarTransfer(ed25519_client.operatorAccountId!, Hbar.from(-Math.abs(price), HbarUnit.Tinybar))
        .addHbarTransfer(AccountId.fromString("0.0.2"), Hbar.from(Math.abs(price), HbarUnit.Tinybar))
        .setTransactionMemo(`[${identifier}] Energy transactioned: ${energy}, at ${new Date(timestamp)}`)
        .execute(ed25519_client);
    const transactionReceipt = await transaction.getReceipt(ed25519_client);
    console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}" with status: ${transactionReceipt.status.toString()} `)
    if (transactionReceipt.status.toString() === "SUCCESS") {
        return transaction.transactionId.toString()
    }
}


export async function handleTxPayment(entry: any) {
    const mirror = "10.255.33.18:5600"

    const node = { "10.255.33.18:50211": new AccountId(3) };
    const ed25519_client = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    ed25519_client.setOperator(
        AccountId.fromString("0.0.1022"),
        PrivateKey.fromStringED25519("0xa608e2130a0a3cb34f86e757303c862bee353d9ab77ba4387ec084f881d420d4")
    );

    const { id, tx, timestamp } = entry;

    const payload = Transaction.fromBytes(tx);
    console.log(payload.transactionMemo)
    const transaction = await payload.execute(ed25519_client)
    const transactionReceipt = await transaction.getReceipt(ed25519_client);
    console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}" with status: ${transactionReceipt.status.toString()} `)
    if (transactionReceipt.status.toString() === "SUCCESS") {
        return transaction.transactionId.toString()
    }
}

