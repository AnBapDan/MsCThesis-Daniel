import { deployContract } from "../config/deploy"
import { insertDevices, removeDevice, retrievePayment, retrievePendingIds } from "../interact"
import { accountBuyer, accountOwner, accountSeller } from "../utils/accounts"
import { Logger } from "./logs/logger";


const logFilePath = './logs/admin.log';
const logger = new Logger(logFilePath, 'REC Manager');



/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5695621"

async function overwatch() {
    const pending = await retrievePendingIds(contractId, accountOwner)
    logger.log('gas =' + pending.gas)


    for await (const payment of pending.array) {
        const result = await retrievePayment(contractId, payment, accountOwner)
        logger.log('gas = ' + result.gasUsed)
    }
    /**Logic below... */
}


async function insert(accountId: string) {
    const result = await insertDevices(contractId, accountId, accountOwner)
    logger.log(''+result)
}

async function remove(accountId: string) {
    const result = await removeDevice(contractId, accountId, accountOwner)
    logger.log(''+result)
}

async function init() {
    const contractRec = await deployContract(
        '../../../bin/contracts/ComsolveController.bin',
        'Ready to Test (all-mighty)',
        accountOwner
    )
    logger.log('Transaction ' + contractRec.txid)
    logger.log('Contract REC ' + contractRec.contractid)


    const contractDev = await deployContract(
        '../../../bin/contracts/DeviceConfirmTransaction.bin',
        'Ready to Test(peers-control)',
        accountOwner
    )

    logger.log('Transaction ' + contractDev.txid)
    logger.log('Contract Devices ' + contractDev.contractid)
}
