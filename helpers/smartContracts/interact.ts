import { AccountId, Client, ContractCallQuery, ContractFunctionParameters, ContractInfoQuery, Hbar, PrivateKey, TopicCreateTransaction } from "@hashgraph/sdk";
const mirror = "10.255.33.18:5600"

const node = { "10.255.33.18:50211": new AccountId(3) };
//  const client = Client.forNetwork(node).setMirrorNetwork(mirror);


async function main() {
  const client = Client.forTestnet()
  client.setOperator(
    AccountId.fromString("0.0.829465"),
    PrivateKey.fromString(
      "302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da"
    )
  );
  console.log('Client Ready')
  const contractQueryTx = new ContractCallQuery()
    .setContractId('0.0.4518863')
    .setGas(100000)
    .setFunction("owner", new ContractFunctionParameters())
    .setMaxQueryPayment(new Hbar(1));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  console.log(contractQuerySubmit.getAddress(0))
}

main()