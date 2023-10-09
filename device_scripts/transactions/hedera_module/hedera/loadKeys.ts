import fs from 'fs';
import { AccountId, PrivateKey } from "@hashgraph/sdk";
import axios from 'axios';

export async function retrieve():Promise<PrivateKey>{
    let content = fs.readFileSync(process.env.HOME+"/store.key",'utf-8')
    console.log(content)
    const priv = PrivateKey.fromString(atob(content))
    console.log(priv)
    console.log(priv.publicKey.toStringDer())
    return priv
  }

 export async function getAccountId(pubkey:string):Promise<AccountId>{
    const response = await axios.get(`http://10.255.33.18:5551/api/v1/accounts?account.publickey=${pubkey}`)
    console.log(response.data.accounts[0].account)
    return AccountId.fromString(response.data.accounts[0].account)

    //TODO need to verify
  }