import { config } from '../config/config.js';
import { MongoClient } from "mongodb";

const uri = config.dbUrl;
const dbName = config.dbName;

let dbInstance = null;
let clientInstance = null;

export async function connectDB() {
  if (!dbInstance) {
    clientInstance = await MongoClient.connect(uri);
    dbInstance = clientInstance.db(dbName);
  }
  return dbInstance;
}

export async function closeDB() {
  if (clientInstance) {
    await clientInstance.close();
    dbInstance = null;
    clientInstance = null;
    console.log("MongoDB connection closed.");
  }
}