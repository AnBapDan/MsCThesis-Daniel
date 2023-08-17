import { AccountId, AccountInfoQuery, Client, PrivateKey } from "@hashgraph/sdk";



async function queryTestNet() {

    const node = {"35.237.119.55:50211": AccountId.fromString("0.0.4")}
    const account = Client.forNetwork(node);
    account.setOperator(
        AccountId.fromString("0.0.3685177"),
        PrivateKey.fromString("302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da")
    )

    const query = new AccountInfoQuery().setAccountId("0.0.3685177")
    const result = await query.execute(account)
    console.log(result)
}
queryTestNet()