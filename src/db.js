import { MongoClient } from "mongodb";

let db;
async function connectToDB(cb) {
 const url = "mongodb+srv://ramyamusulla:a8DXgS3hAEijyUpg@cluster0.k0ezx.mongodb.net/"
// const url="mongodb://127.0.0.1:27017"
//  const url="mongodb+srv://ramyamusulla:a8DXgS3hAEijyUpg@cluster0.k0ezx.mongodb.net/"
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("ast");
    cb();
}
//  connectToDB()

export { connectToDB, db };