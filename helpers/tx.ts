import { AccountId, Client, Hbar, PrivateKey, TransferTransaction } from "@hashgraph/sdk";




async function main() {
    const mirror = "127.0.0.1:5600"

    const node = { "127.0.0.1:50211": new AccountId(3) };
    const client = Client.forNetwork(node).setMirrorNetwork(mirror);

    client.setOperator(
        AccountId.fromString("0.0.2"),
        PrivateKey.fromString('302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137')
    );


    // Create a transaction to transfer 100 hbars
    const transaction = new TransferTransaction()
        .addHbarTransfer('0.0.2', new Hbar(-100))
        .addHbarTransfer('0.0.1002', new Hbar(100));

    //Submit the transaction to a Hedera network
    const txResponse = await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus.toString());

    //v2.0.0
}

main()