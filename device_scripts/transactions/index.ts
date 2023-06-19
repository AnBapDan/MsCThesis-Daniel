import { Database } from 'sqlite3';
import { handleTxPayment } from './hedera/sendTransaction';
import { open } from 'sqlite'


async function performDatabaseOperations() {
    const db = await open({
        filename: '/home/es-admin/setup_meter/payments.sqlite',
        driver: Database,
    })


    const output = await db.exec('CREATE TABLE IF NOT EXISTS issued (id INTEGER PRIMARY KEY, payment TEXT, tx TEXT)')
    console.log(`[${new Date()}] Table created `)

    const result = await db.all('SELECT * FROM tx_payments', async (err: any, entries: any[]) => {
        if (err) {
            console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
        }
    })
    
    let ids = [];
    console.log(`[${new Date()}] Handling Transactions `)
    for await (const entry of result) {

        const txId = await handleTxPayment(entry);
        const { id } = entry;
        console.log(id)
        await db.run('DELETE FROM tx_payments WHERE id = ?', [id])
        await db.exec(`INSERT INTO issued (payment, tx) VALUES ('${id}', '${txId}')`)
    }




    // const result = await db.all('SELECT * FROM json_payments', async (err: any, entries: any[]) => {
    //     if (err) {
    //         console.error(`[${new Date()}] This occured when querying with the following error: ${err} `);
    //     }
    // })
    // for await (const entry of result) {

    //     const txId = await handleJsonPayment(entry);
    //     const { identifier } = entry;
    //     await db.run('DELETE FROM json_payments WHERE identifier = ?', [identifier])
    //     await db.exec(`INSERT INTO issued (payment, tx) VALUES ('${identifier}', '${txId}')`)
    // }
    await db.close()
    console.log(`[${new Date()}] Database connection has been closed`);
    process.exit(0)
}

performDatabaseOperations().catch(console.error)
