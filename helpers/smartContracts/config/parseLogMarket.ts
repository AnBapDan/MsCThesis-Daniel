
import * as fs from 'fs';

export function getEntry(iteration: number) {
    // Read the log file
    const logFilePath = '../../../metrics/market.log';
    const logData = fs.readFileSync(logFilePath, 'utf-8');
    const entries = logData.split('\n')
    const output = parseDataLine(entries[iteration])
    return output


}

function parseDataLine(line: string) {
    const regex = /timestamp: "([^"]+)",buyerID: "([^"]+)",sellerID: "([^"]+)",energy: ([\d.]+),price: ([\d.]+),id: "([^"]+)"/;
    const match = line.match(regex);

    if (match) {
        const [timestamp, buyerID, sellerID, energy, price, id] = match.slice(1);

        return {
            timestamp,
            buyerID,
            sellerID,
            energy: parseFloat(energy),
            price: parseFloat(price),
            id,
        };
    } else {
        return null; // Return null if the line does not match the expected format
    }
}