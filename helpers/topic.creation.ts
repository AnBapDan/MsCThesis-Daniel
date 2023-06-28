import {
    AccountId,
    Client,
    PrivateKey,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";


const mirror = "10.255.33.18:5600"
const node = { "10.255.33.18:50211": new AccountId(3) };


async function main() {
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

    console.clear();
    const transaction = new TopicCreateTransaction()
        .setTopicMemo("COMSOLVE COMMUNITY")
        .setSubmitKey(PrivateKey.fromStringED25519("0x302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da").publicKey)

    const txResponse = await transaction.execute(ed25519_client);

    const topicId = (await txResponse.getReceipt(ed25519_client)).topicId;
    console.log("This is the topic Id: " + topicId);
    const submit = await new TopicMessageSubmitTransaction().setTopicId(topicId!).setMessage("Created Now -> ").execute(ed25519_client)
    process.exit(0);
}
main();