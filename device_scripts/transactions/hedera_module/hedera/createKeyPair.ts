import { PrivateKey } from "@hashgraph/sdk";
import axios from 'axios';
import * as uname from 'node-uname';

export async function genkeys(){
  const privateKey = await PrivateKey.generateED25519Async();
  const publicKey = privateKey.publicKey;
  const response= await axios.post("http://10.255.33.19:3000/transactions/account",{
    pubkey:publicKey.toStringDer(),
    deviceId: uname.uname().nodename
  })
  
  console.log(privateKey+"|"+publicKey);
}

export async function t(){

  const response= await axios.post("http://10.255.33.19:3000/transactions/account",{
    pubkey:"302a300506032b6570032100112b84ec494512f25e2c4f7b466ea88b2054ee92161a2d1b2fbc7c5b6f2390e6",
    deviceId: uname.uname().nodename
  })

  console.log(response.data)

}
t()