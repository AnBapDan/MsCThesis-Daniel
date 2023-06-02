import {
    AccountId,
    Client,
    Hbar,
    HbarUnit,
    PrivateKey,
    TransferTransaction,
} from "@hashgraph/sdk";

export async function handleJsonPayment(entry: any) {
    const mirror = "10.255.33.18:5600"

    const node = { "10.255.33.18:50211": new AccountId(3) };
    const ed25519_client = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
    ed25519_client.setOperator(
        AccountId.fromString("0.0.1023"),
        PrivateKey.fromStringED25519("0xbbd0894de0b4ecfa862e963825c5448d2d17f807a16869526bff29185747acdb")
    );

    const { id, identifier, buyer, seller, energy, price, timestamp } = entry;

    const transaction = await new TransferTransaction()
        //THIS FIRST PART NEED REFACTOR ON DEPLOY
        .addHbarTransfer(ed25519_client.operatorAccountId!, Hbar.from(-Math.abs(price), HbarUnit.Tinybar))
        .addHbarTransfer(AccountId.fromString("0.0.2"), Hbar.from(Math.abs(price), HbarUnit.Tinybar))
        .setTransactionMemo(`[${identifier}] Energy transactioned: ${energy}, from ${new Date(timestamp)}`)
        .execute(ed25519_client);
    const transactionReceipt = await transaction.getReceipt(ed25519_client);
    console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}" with status: ${transactionReceipt.status.toString()} `)
    if (transactionReceipt.status.toString() === "SUCCESS") {
        return transaction.transactionId.toString()
    }

}
