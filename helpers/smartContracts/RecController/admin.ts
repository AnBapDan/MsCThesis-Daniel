import { AccountBalanceQuery, AccountId, Hbar, HbarUnit, TransferTransaction } from "@hashgraph/sdk";
import { deployContract } from "../config/deploy"
import { getOwner, insertDevices, removeDevice, retrievePayment, retrievePendingIds } from "../interact"
import { accountBuyer, accountOwner, accountSeller } from "../utils/accounts"
import { Logger } from "../DeviceController/logs/logger";


const logFilePath = './logs/admin.log';
const logger = new Logger(logFilePath, 'REC Manager');



/** Contract ID for Device Controlled Contract */
const contractId = "0.0.5737788"

async function overwatch() {
    const pending = await retrievePendingIds(contractId, accountOwner, logger)


    for await (const payment of pending.array) {
        const result = await retrievePayment(contractId, payment, accountOwner, logger)
    }
    /**Logic below... */
}

async function insert(accountId: string) {
    const result = await insertDevices(contractId, accountId, accountOwner)
    logger.log('New User ' + result)
}

async function remove(accountId: string) {
    const result = await removeDevice(contractId, accountId, accountOwner)
    logger.log('' + result)
    process.exit(0)
}

async function init() {
    const contractRec = await deployContract(
        '../../../bin/contracts/ComsolveController.bin',
        'Ready to Test (all-mighty)',
        accountOwner
    )
    logger.log('Transaction ' + contractRec.txid)
    logger.log('Contract REC ' + contractRec.contractid)

}

async function queryBalances() {
    let balance = await new AccountBalanceQuery()
        .setAccountId(accountBuyer.operatorAccountId?.toString()!)
        .execute(accountOwner);
    logger.log(' Buyer initial Balance ' + balance.toString())

    balance = await new AccountBalanceQuery()
        .setAccountId(accountSeller.operatorAccountId?.toString()!)
        .execute(accountOwner);

    logger.log(' Seller initial Balance ' + balance.toString())

    balance = await new AccountBalanceQuery()
    .setAccountId(accountOwner.operatorAccountId?.toString()!)
    .execute(accountOwner);

logger.log(' REC initial Balance ' + balance.toString())
}

async function addBalance() {

    const transaction = await new TransferTransaction()
        /** Inserting Buyer Account and Hbar Value */
        .addHbarTransfer(accountOwner.operatorAccountId!, Hbar.from(-Math.abs(9000), HbarUnit.Hbar))

        /** Inserting Seller Account and Hbar Value */
        .addHbarTransfer(accountSeller.operatorAccountId!, Hbar.from(Math.abs(4500), HbarUnit.Hbar))
        .addHbarTransfer(accountBuyer.operatorAccountId!, Hbar.from(Math.abs(4500), HbarUnit.Hbar))

        /**Sealing Transaction and executing on DLT */
        .execute(accountOwner);
    process.exit(0)
}


//init()
queryBalances()
//insert(accountBuyer.operatorAccountId?.toString()!)
//insert(accountSeller.operatorAccountId?.toString()!)