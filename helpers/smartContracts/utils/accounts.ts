import { AccountId, Client, PrivateKey } from "@hashgraph/sdk";


export const accountOwner = Client.forTestnet().setOperator(
  AccountId.fromString("0.0.829465"),
  PrivateKey.fromString("302e020100300506032b6570042204208c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da")
);

export const accountBuyer = Client.forTestnet().setOperator(
    AccountId.fromString("0.0.4551131"),
    PrivateKey.fromString("302e020100300506032b657004220420198aeeeda0427e672437d47ec1fafbaca1925fbb9603c16857520ac2c3008b49")
);


export const accountSeller = Client.forTestnet().setOperator(
    AccountId.fromString('0.0.4551481'),
    PrivateKey.fromString('302e020100300506032b6570042204201d830cc11c521c08bccf8cdb51575ac7461da0c1fe3a79cbf9e718e9b6cb9fed')
);