import { confirmPayment, retrievePayment, retrievePendingIds } from "../interact";
import { accountOwner} from "../utils/accounts";
import { Logger } from "../DeviceController/logs/logger";
import { BigNumber } from "@hashgraph/sdk/lib/Transfer";


const logFilePath = './logs/rec.log';
const logger = new Logger(logFilePath, 'REC');


/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5737788"

/**Smart contract needs to be replaced */
export async function rec() {
    // let output = getEntry(iteration)

    //Get indexes of payments on the contract
    const pending = await retrievePendingIds(contractId, accountOwner, logger)
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
            accountOwner,
            logger
        )
        /** Additional Validation */

    }
    //Bypass validation = All payments approved
    const txid = await confirmPayment(contractId, numberids, [], accountOwner)
    logger.log('Transaction '+ txid)
    await new Promise(f => setTimeout(f, 100));
    process.exit(0)
}
rec()
