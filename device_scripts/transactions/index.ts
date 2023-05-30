import { Database } from 'sqlite3';
import { handleJsonPayment } from './hedera/sendTransaction';
import { open } from 'sqlite'


async function performDatabaseOperations() {
    const db = await open({
        filename: '../payments.sqlite',
        driver: Database,
    })


    const output = await db.exec('CREATE TABLE IF NOT EXISTS issued (id INTEGER PRIMARY KEY, payment TEXT, tx TEXT)')

    const result = await db.all('SELECT * FROM json_payments', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
    })

    let ids = [];
    for await (const entry of result) {
        const txId = await handleJsonPayment(entry);
        const { identifier } = entry;
        console.log(`[${new Date()}] Transaction confirmed (PaymentId, TxId ) -> ${identifier} : ${txId} `)
        //await db.run('DELETE FROM json_payments WHERE identifier = ?', [identifier])
        await db.exec(`INSERT INTO issued (payment, tx) VALUES ('${identifier}', '${txId}')`)
    }
    await db.close()
    console.log(`[${new Date()}] Database connection has been closed`);
    // process.exit(0)
}

performDatabaseOperations().catch(console.error)

