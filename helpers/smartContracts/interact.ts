import { AccountId, Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, ContractInfoQuery, Hbar, TransactionId } from "@hashgraph/sdk";
import { BigNumber } from "@hashgraph/sdk/lib/Transfer";
import Long from "long";


/**Publicly Methods */
export async function getOwner(contractId: string, client: Client) {
  console.log('Getting contract owner...')
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("owner", new ContractFunctionParameters())
    .setMaxQueryPayment(new Hbar(1));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  return contractQuerySubmit.getAddress(0)
}

export async function getMemo(contractId: string, client: Client) {
  console.log('Getting contract memo...')
  const query = new ContractInfoQuery().setContractId(contractId)
  const info = await query.execute(client);
  return info.contractMemo

}


/**Administrator Exclusive Methods */
export async function insertDevices(contractId: string, accountId: string, admin: Client) {
  const accid = AccountId.fromString(accountId)
  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('insertDevices', new ContractFunctionParameters().addAddressArray([accid.toSolidityAddress()]))
    .setGas(100000)

  const promptResponse = await prompt.execute(admin)
  return promptResponse.transactionId
}

export async function removeDevice(contractId: string, accountId: string, admin: Client) {
  const accid = AccountId.fromString(accountId)
  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('removeDevice', new ContractFunctionParameters().addAddressArray([accid.toSolidityAddress()]))
    .setGas(100000)

  const promptResponse = await prompt.execute(admin)
  return promptResponse.transactionId
}

/** Buyer exclusive Methods */
export async function issuePayment(contractId: string, accountId: string, paymentId: number, price: number, buyer: Client): Promise<{status:string ,transaction:string}>{

  const accid = AccountId.fromString(accountId)
  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('issuePayment',
      new ContractFunctionParameters()
        .addAddress(accid.toSolidityAddress())
        .addUint256(paymentId))
    .setGas(10000000)
    .setPayableAmount(new Hbar(price))

  const promptResponse = await prompt.execute(buyer)
  consol
  const promptReceipt = await promptResponse.getReceipt(buyer)

  return {status: promptReceipt.status.toString(), transaction : promptResponse.transactionId.toString()}
}

/** Validation Entity Exclusive Methods (Seller or Administrator) */
export async function retrievePendingIds(contractId: string, client: Client){
  const contractQueryTx = new ContractCallQuery()
  .setContractId(contractId)
  .setGas(100000)
  .setFunction("retrievePendingIds", new ContractFunctionParameters())
  .setMaxQueryPayment(new Hbar(1))
  const contractQuerySubmit = await contractQueryTx.execute(client)
  const array = contractQuerySubmit.getResult(["uint[]"])[0]
  return array
}

export async function retrievePayment(contractId: string, paymentId: number, client: Client) {
  const prompt = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("retrievePendingIds", new ContractFunctionParameters())
    .setMaxQueryPayment(new Hbar(1));

  const promptResponse = await prompt.execute(client)
  const result = promptResponse.getResult(['uint', 'address'])[0]
  return promptResponse.gasUsed, result
}

export async function confirmPayment(contractId:string, accepted: BigNumber[], denied: number[], client: Client):Promise<TransactionId> {
  const numberids = accepted.map((num) =>num.toNumber())

  const prompt = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction('confirmPayment',
      new ContractFunctionParameters()
        .addUint256Array(numberids)
        .addUint256Array(denied))
    .setGas(100000)

  const promptResponse = await prompt.execute(client)
  return promptResponse.transactionId

}
