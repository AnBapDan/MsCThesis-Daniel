import * as mariadb from 'mariadb';
import axios from 'axios';
const pool = mariadb.createPool({host: 'localhost', user: 'root', connectionLimit: 5, database:'payments'});

export async function sendReceipts(){

    var db = await pool.getConnection()
    let issued = {receipts:[{}]}
    await db.query('SELECT * FROM issued', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
        

        for await (const entry of entries){
           issued.receipts.push({paymentID:entry.payment, txID: entry.tx})
        }
    });
    await db.query('TRUNCATE TABLE issued')
    await db.release()
    const response = await axios.post('http://10.255.33.19:3000/transactions/receipt',issued)
    
}