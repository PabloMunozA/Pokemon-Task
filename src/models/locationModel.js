import { db } from '../database/db.js';

export const addLocations = async (data) => {
    await db.read();
    db.data.locations.push(...data);
    await db.write();
    return data;
  };