import { AccountId, Client, ContractCallQuery, ContractInfoQuery, PrecheckStatusError, PrivateKey } from "@hashgraph/sdk";

const mirror = "10.255.33.18:5600"
const node = { "10.255.33.18:50211": new AccountId(3) };

export async function getContract(){
    const deviceWallet = Client.forNetwork(node).setMirrorNetwork(mirror);
    deviceWallet.setOperator(
        AccountId.fromString("0.0.1012"),
        // PrivateKey.fromString("302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137")
        PrivateKey.fromStringECDSA("105d050185ccb907fba04dd92d8de9e32c18305e097ab41dadda21489a211524")
        );
 
        
    const query = new ContractInfoQuery() .setContractId("0.0.1036");
    const info = await query.execute(deviceWallet);

    console.log(info.balance.toTinybars().toString());
    //Getting owner of the contract
    let callquery = new ContractCallQuery().setGas(100000).setFunction("owner").setContractId("0.0.1036");
    let output = await callquery.execute(deviceWallet)
    console.log("Gas fee = " +output.gasUsed.toString()+"\t Owner = "+AccountId.fromSolidityAddress(output.getAddress(0)))
    //withdrawing my funds
    callquery = new ContractCallQuery().setGas(100000).setFunction("withdrawFunds").setContractId("0.0.1036");
    try{
        output = await callquery.execute(deviceWallet)
    }catch(e){
        console.log("reverted")
    }
    

    //console.log("Gas fee = " +output.gasUsed.toString()+"\t Owner ="+output.getAddress(0))
    process.exit(0)

}

getContract()