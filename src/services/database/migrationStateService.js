import { connectDB } from "../../dataBase/connection.js";

const COLLECTION = "migration_status";
const DOC_ID = "global"; // Unique ID for the global document

export const getMigrationStatus = async () => {
  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION);
    const status = await collection.findOne({ _id: DOC_ID });
    return status;
  } catch (error) {
    console.error("Error retrieving global migration status:", error);
    return null;
  }
};

export const setMigrationStatus = async (completed = false) => {
  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION);

    const result = await collection.findOneAndUpdate(
      { _id: DOC_ID },
      {
        $set: {
          completed,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    return result.value;
  } catch (error) {
    console.error("Error updating global migration status:", error);
    throw error;
  }
};