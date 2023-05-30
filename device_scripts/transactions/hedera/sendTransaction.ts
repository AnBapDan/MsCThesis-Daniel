import {
    AccountBalanceQuery,
    AccountId,
    AccountUpdateTransaction,
    Client,
    Hbar,
    HbarUnit,
    PrivateKey,
    TransactionReceiptQuery,
    TransactionRecordQuery,
    TransferTransaction,
} from "@hashgraph/sdk";
import { ed25519_client } from "./operator";

export async function handleJsonPayment(entry: any) {
    const { id, identifier, buyer, seller, energy, price, timestamp } = entry;
    
    const transaction = await new TransferTransaction()
        //THIS FIRST PART NEED REFACTOR ON DEPLOY
        .addHbarTransfer(ed25519_client.operatorAccountId!, Hbar.from(-Math.abs(price), HbarUnit.Tinybar))
        .addHbarTransfer(AccountId.fromString("0.0.2"), Hbar.from(Math.abs(price), HbarUnit.Tinybar))
        .setTransactionMemo(`[${identifier}] Energy transactioned: ${energy}, from ${new Date(timestamp)}`)
        .execute(ed25519_client);
    const transactionReceipt = await transaction.getReceipt(ed25519_client);
    console.log(`[${new Date()}] Transaction "${transaction.transactionId.toString()}" with status: ${transactionReceipt.status.toString()} `)
    if(transactionReceipt.status.toString()==="SUCCESS"){
        return transaction.transactionId.toString()
    }
   
}
