import { AccountId, Client, ContractCreateFlow, PrivateKey } from '@hashgraph/sdk'
import fs from 'fs';
import path from "path";

const mirror = "10.255.33.18:5551"
const node = { "10.255.33.18:50211": new AccountId(3) };

async function deployContract(dir:string,memo:string){

    const contractBytecode = fs.readFileSync(
        path.join(__dirname, dir)
      );
    let manager = Client.forNetwork(node).setMirrorNetwork(mirror);

    manager.setOperator(
        AccountId.fromString("0.0.2"),
        PrivateKey.fromString(
          "302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137"
        )

    );

   const contract = new ContractCreateFlow().setBytecode(contractBytecode).setContractMemo(memo).setGas(10_000_000);
   
   const txResponse = await contract.execute(manager);
   const receipt = await txResponse.getReceipt(manager)
   console.log(receipt.contractId)
}

deployContract('../../bin/contracts/ComsolveController.bin','COMSOLVE Community')
