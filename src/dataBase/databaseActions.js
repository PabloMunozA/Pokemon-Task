import { connectDB } from "./connection.js";


export const createDocument = async (colection,data) =>{
  try {
    const db = await connectDB();

    const toInsertData = { ...data};

    const collection = db.collection(colection);
    return await collection.insertOne(toInsertData);
    
  } catch (error) {
    console.error(error);
  }
}

export const insertMultipleDocuments = async(colection,data) =>{
  try {
    const db = await connectDB();
    const collection = db.collection(colection);
    const toInsertData = data;

    const result = await collection.insertMany(toInsertData);

    return result;

  } catch (error) {
    return error;
  }
}

export const getDocuments = async (colection) =>{
  try {
    const db = await connectDB();
    const collection = db.collection(colection); 
    const allData = await collection.find().toArray();
    return allData;
  } catch (error) {
    console.error(error);
  }
}