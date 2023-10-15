import { getEntry } from "../config/parseLogMarket";
import { confirmPayment, retrievePayment, retrievePendingIds } from "../interact";
import { accountSeller } from "../utils/accounts";
import { Logger } from "./logs/logger";


const logFilePath = './logs/seller.log';
const logger = new Logger(logFilePath, 'Seller');


/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5695621"

/**Smart contract needs to be replaced */
async function main(iteration: number) {
    let transactions: any[] = []
    let output = getEntry(iteration)

    //Get indexes of payments on the contract
    const pending = await retrievePendingIds(contractId, accountSeller)
    logger.log('gas ='+ pending.gas)
    //Retrieve its values from the chain 
    for await (const value of pending.array) {
        const result = await retrievePayment(
            contractId,
            value,
            accountSeller,
        )
        transactions.push(result)
    }
    
    //Bypass validation = All payments approved
    await confirmPayment(contractId, pending.array, [], accountSeller)

}
main(0)