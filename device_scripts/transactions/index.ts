import { Database, Statement } from 'sqlite3';
import { emitTopicMessage, handleJsonPayment, handleTxPayment } from './hedera/sendTransaction';
import { open } from 'sqlite'


async function connect() {
    const db = await open({
        filename: '/home/es-admin/setup_meter/payments.sqlite',
        driver: Database,
    })
    return db;
}
async function performDatabaseOperations() {
    const db = await connect();

    const output = await db.exec('CREATE TABLE IF NOT EXISTS issued (id INTEGER PRIMARY KEY, payment TEXT, tx TEXT)')
    console.log(`[${new Date()}] Table created `)
    await txTransactions(db);
    await jsonTransactions(db);
    await db.close()
    process.exit(0)
}

async function jsonTransactions(db:any){
    const result = await db.all('SELECT * FROM json_payments', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
    })
    console.log(`[${new Date()}] Handling Tx Transactions `)
    for await (const entry of result) {
        const txId = await handleJsonPayment(entry);
        const { id } = entry;
        console.log(id)
        await db.run('DELETE FROM json_payments WHERE id = ?', [id])

        await emitTopicMessage({ payment: id, tx: txId })
        await db.exec(`INSERT INTO issued (payment, tx) VALUES ('${id}', '${txId}')`)
    } 
}
async function txTransactions(db: any) {
    const result = await db.all('SELECT * FROM tx_payments', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
    })
    console.log(`[${new Date()}] Handling Tx Transactions `)
    for await (const entry of result) {

        const txId = await handleTxPayment(entry);
        const { id } = entry;
        console.log(id)
        await db.run('DELETE FROM tx_payments WHERE id = ?', [id])

        await emitTopicMessage({ payment: id, tx: txId })
        await db.exec(`INSERT INTO issued (payment, tx) VALUES ('${id}', '${txId}')`)
    }
}

performDatabaseOperations().catch(console.error)
