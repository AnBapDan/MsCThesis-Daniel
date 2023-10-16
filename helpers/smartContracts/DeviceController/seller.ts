import { AccountId, Client, ContractCallQuery, ContractFunctionParameters, Hbar, PrivateKey, TransactionId } from "@hashgraph/sdk";
import { getEntry } from "../config/parseLogMarket";
import { confirmPayment, getMemo, getOwner, retrievePayment, retrievePendingIds } from "../interact";
import { accountSeller } from "../utils/accounts";
import { Logger } from "./logs/logger";
import { BigNumber } from "@hashgraph/sdk/lib/Transfer";


const logFilePath = './logs/seller.log';
const logger = new Logger(logFilePath, 'Seller');


/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5699479"

/**Smart contract needs to be replaced */
export async function seller() {
    //let output = getEntry(iteration)

    //Get indexes of payments on the contract
    const pending = await retrievePendingIds(contractId, accountSeller, logger)
    const numberids: number[] = pending.map((num: BigNumber) => num.toNumber())
    if (numberids.length === 0) {
        console.log('Nothing to confirm')
        logger.log('Skipped')
        process.exit(0)
    }

    //Retrieve its values from the chain 
    for await (const value of numberids) {
        const result = await retrievePayment(
            contractId,
            value,
            accountSeller,
            logger
        )
        /** Additional Validation */
    }
    //Bypass validation = All payments approved
    const txid = await confirmPayment(contractId, numberids, [0], accountSeller)
    logger.log('Transaction '+ txid)

    process.exit(0)
}
seller()