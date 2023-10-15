import {Client, ContractCreateFlow, ContractFunctionParameters, ContractId, TransactionId} from '@hashgraph/sdk'
import fs from 'fs';
import path from "path";

export async function deployContract(dir: string, memo: string, client: Client) : Promise<{txid:TransactionId,contractid:ContractId}>{

  const contractBytecode = fs.readFileSync(
    path.join(__dirname, dir)
  );
  //Create the transaction
  const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(contractBytecode)
    .setContractMemo(memo)
    .setConstructorParameters(new ContractFunctionParameters());

  //Sign the transaction with the client operator key and submit to a Hedera network
  const txResponse = await contractCreate.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  return {txid:txResponse.transactionId,contractid: receipt.contractId!}
}


