import { AccountId, Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, ContractId, ContractInfoQuery, Hbar, PrivateKey, TopicCreateTransaction } from "@hashgraph/sdk";
import { toSolidityAddress } from "@hashgraph/sdk/lib/EntityIdHelper";

const client = Client.forTestnet()
client.setOperator(
  AccountId.fromString("0.0.829465"),
  PrivateKey.fromString(
    "302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da"
  )
);

async function getOwner(contractId: string) {
  console.log('Getting contract owner...')
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("owner", new ContractFunctionParameters())
    .setMaxQueryPayment(new Hbar(1));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  console.log(contractQuerySubmit.getAddress(0))
}

async function getMemo(contractId: string) {
  console.log('Getting contract memo...')
  const query = new ContractInfoQuery().setContractId(contractId)
  const info = await query.execute(client);
  console.log(info.contractMemo)
  process.exit(0)

}

async function insertDevices(contractId: string, accountId: string) {
  const accid = AccountId.fromString(accountId)
  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('insertDevices', new ContractFunctionParameters().addAddressArray([accid.toSolidityAddress()]))
    .setGas(100000)

  const promptResponse = await prompt.execute(client)
  console.log('' + promptResponse)
  const promptReceipt = await promptResponse.getReceipt(client)
  console.log('' + promptReceipt)
}

async function removeDevice(contractId: string, accountId: string) {
  const accid = AccountId.fromString(accountId)
  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('removeDevice', new ContractFunctionParameters().addAddressArray([accid.toSolidityAddress()]))
    .setGas(100000)

  const promptResponse = await prompt.execute(client)
  console.log(promptResponse)
  const promptReceipt = await promptResponse.getReceipt(client)
  console.log(promptReceipt)
}

async function retrievePendingIds(contractId: string) {
  console.log('Getting pending ids...')
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("retrievePendingIds", new ContractFunctionParameters())
    .setMaxQueryPayment(new Hbar(1));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  console.log("Passed")
  const array = contractQuerySubmit.getResult(["uint16[]"])[0]
  console.log(array)
  process.exit(0)
  //TODO checkar este array
}



export async function issuePayment(contractId: string, accountId: string, paymentId: number, price: number , buyer: Client) {

  const accid = AccountId.fromString(accountId)
  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('issuePayment',
      new ContractFunctionParameters()
        .addAddress(accid.toSolidityAddress())
        .addUint16(paymentId))
    .setGas(100000)
    .setPayableAmount(new Hbar(price))

  const promptResponse = await prompt.execute(buyer)
  const promptReceipt = await promptResponse.getReceipt(buyer)
  console.log(promptReceipt.status + "\t Address = " + promptReceipt.contractId)

}

//removeDevice('0.0.4518942', "0.0.829465")
//getMemo('0.0.4518942')
retrievePendingIds('0.0.4518942')
//sendPayment('0.0.4518942',"0.0.829465",12345)