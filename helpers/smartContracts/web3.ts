import { ContractId, PrivateKey } from '@hashgraph/sdk';
import Web3 from 'web3';

const web3Provider = new Web3(new Web3.providers.HttpProvider('https://testnet.hashio.io/api'));
const account = web3Provider.eth.accounts.privateKeyToAccount('0x8c2b8f3f073118f29ca1f6bc790710cb65e1697bd44e6bd0fd6c199904e405da');
web3Provider.eth.accounts.wallet.add(account);
web3Provider.eth.defaultAccount = account.address;
const contractAddress = ContractId.fromString('0.0.4518942').toSolidityAddress();
const contractABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint16[]", "name": "accepted", "type": "uint16[]" }, { "internalType": "uint16[]", "name": "denied", "type": "uint16[]" }], "name": "confirmPayment", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newDevice", "type": "address" }], "name": "insertDevice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "newDevices", "type": "address[]" }], "name": "insertDevices", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint16", "name": "paymentId", "type": "uint16" }], "name": "issuePayment", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "oldDevice", "type": "address" }], "name": "removeDevice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "retrievePayments", "outputs": [{ "components": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }, { "internalType": "address", "name": "from", "type": "address" }], "internalType": "struct DeviceConfirmTransaction.Payment", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "retrievePendingIds", "outputs": [{ "internalType": "uint16[]", "name": "", "type": "uint16[]" }], "stateMutability": "view", "type": "function" }];


async function main() {
    const number = await web3Provider.eth.getBlockNumber()
    console.log('block number '+number)

    web3Provider.eth.getBalance(
        '0x00000000000000000000000000000000000Ca819')
        .then((balance) => {
            console.log('balance', balance);
        })
        .catch(console.error);
    

    const contract = new web3Provider.eth.Contract(contractABI, contractAddress);

    contract.methods.retrievePendingIds().call().then((result)=>{
        console.log('Result '+result)
    })
}

main();