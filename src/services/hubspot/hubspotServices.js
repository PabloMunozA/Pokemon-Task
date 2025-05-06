import { hubspotClient } from "./client.js";

export const createObjectsBatch = async (data) => {
  try {
    const objectsResponse = await hubspotClient.crm.objects.batchApi.create(
      data.obcjetTypeId,
      { inputs: data.inputs }
    );
    return objectsResponse;
  } catch (error) {
    console.error("Error creating objects batch:", error);
    throw error;
  }
};