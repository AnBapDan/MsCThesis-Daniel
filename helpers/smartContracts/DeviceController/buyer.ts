import { getEntry } from "../config/parseLogMarket";
import { getOwner, issuePayment, retrievePendingIds } from "../interact";
import { accountBuyer, accountSeller } from "../utils/accounts";
import { Logger } from "./logs/logger";


const logFilePath = './logs/buyer.log';
const logger = new Logger(logFilePath, 'Buyer');

/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5699479"

export async function buyer(iteration:number) {
    /**Load from file */
    const output = getEntry(iteration)
    console.log(output)
    if(output?.buyerID === undefined){
        console.log('No value for this timestamp')
        process.exit(0)
    }
    const result = await issuePayment(
        contractId,
        accountSeller.operatorAccountId?.toString()!,
        iteration,
        parseFloat(((output?.price!*output?.energy!)/0.05).toFixed(8)),
        accountBuyer
        )

    logger.log('Transaction '+result.transaction)
    logger.log('Status code '+result.status)
    await getOwner(contractId,accountBuyer)
    process.exit(0)
}