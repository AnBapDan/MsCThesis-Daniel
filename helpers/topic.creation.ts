import {
  AccountId,
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

async function main() {
  const client = Client.forTestnet()
  client.setOperator(
    AccountId.fromString("0.0.829465"),
    PrivateKey.fromString(
      "302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da"
    )
  );
  console.log('Client Ready')
  const transaction = new TopicCreateTransaction()
    .setTopicMemo("COMSOLVE COMMUNITY")
    .setSubmitKey(PrivateKey.fromStringED25519("0x302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da").publicKey)

  const txResponse = await transaction.execute(client);

  const topicId = (await txResponse.getReceipt(client)).topicId;
  console.log("This is the topic Id: " + topicId);
  const submit = await new TopicMessageSubmitTransaction().setTopicId(topicId!).setMessage("Created Now -> ").execute(client)
  process.exit(0);
}
main();