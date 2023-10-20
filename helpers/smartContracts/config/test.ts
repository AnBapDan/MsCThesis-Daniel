import { ContractExecuteTransaction, ContractFunctionParameters, ContractInfoQuery, Hbar, HbarUnit } from "@hashgraph/sdk";
import { deployContract } from "./deploy"
import { accountOwner } from "../utils/accounts"
import { Logger } from "../DeviceController/logs/logger";

const logFilePath = './logs/test.log';
const logger = new Logger(logFilePath, 'Buyer');
async function init() {
    // const contractRec = await deployContract(
    //     '../../../bin/contracts/ComsolveController.bin',
    //     'Ready to Test (all-mighty)',
    //     accountOwner
    // )
    // logger.log('Transaction ' + contractRec.txid)
    // logger.log('Contract REC ' + contractRec.contractid)


    const contractDev = await deployContract(
        '../../../bin/contracts/test.bin',
        'test',
        accountOwner
    )

    logger.log('Transaction ' + contractDev.txid)
    logger.log('Contract Devices ' + contractDev.contractid)

}

const contractid = '0.0.5737788'
async function carregar() {




    const prompt = new ContractExecuteTransaction()
        .setContractId(contractid)
        .setFunction('receive',
            new ContractFunctionParameters())
        .setGas(10000000)
        .setPayableAmount(new Hbar(10, HbarUnit.Hbar))

    const promptResponse = await prompt.execute(accountOwner)
    const promptReceipt = await promptResponse.getReceipt(accountOwner)
    showContractBalanceFcn(contractid)
}


async function showContractBalanceFcn(cId: string) {
    const info = await new ContractInfoQuery().setContractId(cId).execute(accountOwner);
    console.log(`- Contract balance (ContractInfoQuery SDK): ${info.balance.toString()}`);
}

async function levantar() {
   console.log (accountOwner._network._network)
    // const contractExecuteTx = new ContractExecuteTransaction()
    //     .setContractId(contractid)
    //     .setGas(800000)
    //     .setFunction('transferHbar', new ContractFunctionParameters().addUint256(999999990))
    // const contractExecuteSubmit = await contractExecuteTx.execute(accountOwner);
    // const contractExecuteRx = await contractExecuteSubmit.getReceipt(accountOwner);
    // console.log(contractExecuteRx);
}
//levantar()
showContractBalanceFcn('0.0.5737788')