import { AccountCreateTransaction, Hbar, PrivateKey } from "@hashgraph/sdk";
import { accountOwner } from "../utils/accounts";



export async function generateAccount(memo: string) {
    const privateKey = PrivateKey.generateED25519()
    const publicKey = privateKey.publicKey
    const txResponse = await new AccountCreateTransaction()
        .setAccountMemo(memo)
        .setInitialBalance(new Hbar(300))
        .setKey(privateKey)
        .execute(accountOwner)

    const txReceipt = await txResponse.getReceipt(accountOwner)
    console.log('Account Id = '+txReceipt.accountId)
    console.log('Private Key = '+privateKey)
}
