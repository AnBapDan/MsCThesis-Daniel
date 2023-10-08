import { AccountId, Client, ContractCreateFlow, ContractFunctionParameters, PrivateKey } from '@hashgraph/sdk'
import fs from 'fs';
import path from "path";

async function deployContract(dir: string, memo: string) {

  const contractBytecode = fs.readFileSync(
    path.join(__dirname, dir)
  );
  const client = Client.forTestnet()
  client.setOperator(
    AccountId.fromString("0.0.829465"),
    PrivateKey.fromString(
      "302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da"
    ))
  //Create the transaction
  const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(contractBytecode)
    .setConstructorParameters(new ContractFunctionParameters());

  //Sign the transaction with the client operator key and submit to a Hedera network
  const txResponse = contractCreate.execute(client);

  //Get the receipt of the transaction
  const receipt = (await txResponse).getReceipt(client);

  //Get the new contract ID
  const newContractId = (await receipt).contractId;

  console.log("The new contract ID is " + newContractId);
}

deployContract('../../bin/contracts/ComsolveController.bin', 'Ready to Test (all-mighty)')
deployContract('../../bin/contracts/DeviceConfirmTransaction.bin', 'Ready to Test(peers-control)')
