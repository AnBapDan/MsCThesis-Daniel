import { getEntry } from "../config/parseLogMarket";
import { issuePayment } from "../interact";
import { accountBuyer, accountSeller } from "../utils/accounts";
import { Logger } from "./logs/logger";


const logFilePath = './logs/buyer.log';
const logger = new Logger(logFilePath, 'Buyer');

/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5695621"

export async function buyer(iteration:number) {
    /**Load from file */
    const output = getEntry(iteration)
    console.log(output)

    const result = await issuePayment(
        contractId,
        accountSeller.operatorAccountId?.toString()!,
        iteration,
        (output?.price!*output?.energy!)/0.05,
        accountBuyer
        )

    logger.log('Transaction '+result.transaction)
    logger.log('Status code '+result.status)
    process.exit(0)
}