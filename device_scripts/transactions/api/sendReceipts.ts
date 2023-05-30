import sqlite3 from 'sqlite3';
import { credentials } from "@grpc/grpc-js";
import {
  CreateProductRequest,
  ProductServiceClient,
} from "@nodejs-microservices/protos/dist/product/product";


async function connect() {
    const db = new sqlite3.Database("/home/es-admin/setup_meter/payments.sqlite")

    return db;
}

export async function sendReceipts(){
    var request = require('request');
    var db = await connect()
    db.all('SELECT * FROM issued', (err, rows) => {
        if (err) {

            console.error(err);

        } else {

            rows.forEach(async (entry: any) => {
                const { id, identifier, buyer, seller, energy, price, timestamp } = entry;
               
            })


        }


    });
    // request.post(
    //     'http://es-rec.av.it.pt:3000/transactions/receipt',
    //     { json: { key: 'value' } },

    //     function (error: any, response: any, body: any) {
    //         if (!error && response.statusCode == 200) {
    //             console.log(body);
    //         }
    //     }
    // );
    
}



// const PRODUCT_SERVICE_URL = "0.0.0.0:50051";

// function main() {
//   const client = new ProductServiceClient(
//     PRODUCT_SERVICE_URL,
//     credentials.createInsecure()
//   );

//   const req: CreateProductRequest = {
//     name: "test product",
//     description: "foo bar",
//     image: "https://example.com/image",
//     tags: ["tag-1"],
//   };

//   client.createProduct(req, (err, resp) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Response :", resp);
//     }
//   });
// }

// main();
