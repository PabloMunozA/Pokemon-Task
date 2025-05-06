import dotenv from "dotenv";

dotenv.config();

export const config = {
    HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY,
    dbUrl: process.env.DB_URL,
    dbName: process.env.DB_NAME,
};



