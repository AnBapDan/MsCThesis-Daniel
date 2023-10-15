import fs from 'fs';

export class Logger {

    private logFilePath: string;
    private entity: string


    constructor(logFilePath: string, entity: string) {
        this.logFilePath = logFilePath;
        this.entity = entity
    }

    log(message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${this.entity}: ${message}\n`;

        fs.appendFile(this.logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Error writing to the log file:', err);
            } else {
                console.log('Logged:', logMessage);
            }
        });
    }
}
