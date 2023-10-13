import { issuePayment } from "../interact";
import { accountBuyer } from "../utils/accounts";


/** Contract ID for Device Controlled Contract */
const contractId = "0.0.4518942"

async function main(){

    issuePayment(contractId,'XXXX',123,123,accountBuyer)

    
}