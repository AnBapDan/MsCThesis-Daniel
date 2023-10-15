import { AccountId, Client, ContractCallQuery, ContractFunctionParameters, Hbar, PrivateKey, TransactionId } from "@hashgraph/sdk";
import { getEntry } from "../config/parseLogMarket";
import { confirmPayment, getMemo, getOwner, retrievePayment, retrievePendingIds } from "../interact";
import { accountSeller } from "../utils/accounts";
import { Logger } from "./logs/logger";


const logFilePath = './logs/seller.log';
const logger = new Logger(logFilePath, 'Seller');


/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5695621"

/**Smart contract needs to be replaced */
export async function seller() {
    let transactions: TransactionId[] = []
    //let output = getEntry(iteration)

    //Get indexes of payments on the contract
    const pending = await retrievePendingIds(contractId, accountSeller)

    //Retrieve its values from the chain 
    for await (const value of pending) {
        const result = await retrievePayment(
            contractId,
            value,
            accountSeller,
        )
        transactions.push(result)
    }

    //Bypass validation = All payments approved
    const txid = await confirmPayment(contractId, pending, [0], accountSeller)
    transactions.push(txid)
    const txs = transactions.map((ids) => logger.log(ids.toString()))

    process.exit(0)
}


