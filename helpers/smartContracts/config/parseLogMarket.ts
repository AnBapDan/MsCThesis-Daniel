
import * as fs from 'fs';

async function main() {


    // Read the log file
    const logFilePath = '/home/dani/Documents/MsCThesis-Daniel/metrics/market.log';
    const logData = fs.readFileSync(logFilePath, 'utf-8');
   
    // Split the log data into individual entries based on the timestamps
    const entries = logData.split(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/m);

}

main()