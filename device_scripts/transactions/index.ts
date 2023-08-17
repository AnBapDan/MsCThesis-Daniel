import * as mariadb from 'mariadb';

import { emitTopicMessage, handleJsonPayment, handleTxPayment } from './hedera/sendTransaction';

const pool = mariadb.createPool({host: 'localhost', user: 'root', connectionLimit: 5, database:'payments'});
async function performDatabaseOperations() {
    const db = await pool.getConnection()
    
    const output = await db.query('CREATE TABLE IF NOT EXISTS issued (id INT AUTO_INCREMENT PRIMARY KEY, payment TEXT, tx TEXT)')
    console.log(`[${new Date()}] Table created `)
    await txTransactions(db);
    await jsonTransactions(db);
    await db.release()
    process.exit(0)
}

async function jsonTransactions(db:mariadb.PoolConnection){
    console.log(`[${new Date()}] Handling json payments `)
    const result = await db.query('SELECT * FROM json_payments', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
    })
    console.log(`[${new Date()}] Handling Tx Transactions `)
    for await (const entry of result) {
        const txId = await handleJsonPayment(entry);
        const { id } = entry;
        console.log(id)
        await db.query('DELETE FROM json_payments WHERE id = ?', [id])

        await emitTopicMessage({ payment: id, tx: txId })
        await db.query(`INSERT INTO issued (payment, tx) VALUES ('${id}', '${txId}')`)
    } 
}

async function txTransactions(db: mariadb.PoolConnection) {
    console.log(`[${new Date()}] Handling Byte Array payments `)
    const result = await db.query('SELECT * FROM tx_payments', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
    })
    console.log(`[${new Date()}] Handling Tx Transactions `)
    for await (const entry of result) {

        const txId = await handleTxPayment(entry);
        const { id } = entry;
        console.log(id)
        await db.query('DELETE FROM tx_payments WHERE id = ?', [id])

        await emitTopicMessage({ payment: id, tx: txId })
        await db.query(`INSERT INTO issued (payment, tx) VALUES ('${id}', '${txId}')`)
    }
}

performDatabaseOperations().catch(() =>{console.error; process.exit(-1)})
