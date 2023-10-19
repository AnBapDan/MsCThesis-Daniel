import { AccountId, Hbar, TransferTransaction } from "@hashgraph/sdk";
import { accountBuyer, accountOwner, accountSeller } from '/home/dani/Documents/MsCThesis-Daniel/helpers/smartContracts/utils/accounts';
async function freeze() {

    const transferTx = new TransferTransaction()
        .setTransactionMemo(`[64f84eb150e852c156fde834] Energy transactioned: 0.0034, at 2023-09-16T19:27:00Z}`)
        .addHbarTransfer(accountBuyer.operatorAccountId!, new Hbar(-Math.abs(0.00544)))
        .addHbarTransfer(accountSeller.operatorAccountId!, new Hbar(Math.abs(0.00544)));


    const pending = transferTx.freezeWith(accountOwner);
    console.log("pending: " + pending)
    const signed = await pending.signWithOperator(accountOwner);
    const array = signed.toBytes()
    console.log(array.byteLength)

}
freeze()