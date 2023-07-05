import { PrivateKey } from "@hashgraph/sdk";

export async function genkeys(){
  const privateKey = await PrivateKey.generateED25519Async();
  const publicKey = privateKey.publicKey;
  console.log("private key = " + privateKey);
  console.log("public key = " + publicKey);
  return {publicKey, privateKey}
}

export async function getAccountId(pubkey:string){
  const response = await axios.get(`http://10.255.33.18:5551/api/v1/accounts?account.publickey=${pubkey}`)
}
