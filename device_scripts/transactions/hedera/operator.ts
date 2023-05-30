import { AccountId, Client, PrivateKey } from "@hashgraph/sdk";

const mirror = "127.0.0.1:5600"

export const node = { "127.0.0.1:50211": new AccountId(3) };



export const client = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);
export const ed25519_client = Client.forNetwork(node).setMirrorNetwork(mirror).setMaxAttempts(1000000);

client.setOperator(
    AccountId.fromString("0.0.1004"),
    PrivateKey.fromString(
        "b4d7f7e82f61d81c95985771b8abf518f9328d019c36849d4214b5f995d13814"
    )
);

ed25519_client.setOperator(
    AccountId.fromString("0.0.1022"),
    PrivateKey.fromStringED25519("0xa608e2130a0a3cb34f86e757303c862bee353d9ab77ba4387ec084f881d420d4")
);