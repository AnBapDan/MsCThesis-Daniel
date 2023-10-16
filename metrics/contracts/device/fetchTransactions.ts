import axios from 'axios';

async function main() {
    let firstLink ="/api/v1/transactions?account.id=0.0.4551481&timestamp=gte:1697461838.419080663"
    let results = await mirrorQuery(firstLink);
    //console.log(results);


}

async function mirrorQuery(append:string) {
    let baseUrl = "https://testnet.mirrornode.hedera.com"
    let response = await axios.get(baseUrl+append)
    console.log(response.data)
    //JSON.parse(`{"transactions":${response.data.transactions}}`)
    //console.log(response.data.transactions);

    //let info = await response.json();
    return JSON.parse(response.data);
}
main();