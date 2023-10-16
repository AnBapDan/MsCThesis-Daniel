import {
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";
import { accountOwner } from '/home/dani/Documents/MsCThesis-Daniel/helpers/smartContracts/utils/accounts';

async function create() {

  const transaction = new TopicCreateTransaction()
    .setTopicMemo("COMSOLVE COMMUNITY")
    .setSubmitKey(PrivateKey.fromStringED25519("0x302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da").publicKey)

  const txResponse = await transaction.execute(accountOwner);

  const topicId = (await txResponse.getReceipt(accountOwner)).topicId;
  console.log("This is the topic Id: " + topicId);
  const submit = await new TopicMessageSubmitTransaction().setTopicId(topicId!).setMessage("123456 - 0.0.829465@1695745800.195571337").execute(accountOwner)
  console.log(submit.transactionId.toString());
  process.exit(0);
}

create()