import { errorHandle } from "../../utils/errorHandle.js";
import { createObjectsBatch } from "../../services/hubspot/hubspotServices.js";

export const setLocations = async (dataArray) => {
  if (!dataArray.length) return;

  const data = {
    obcjetTypeId: "companies",
    inputs:dataArray,
  };
  const createResponse = await errorHandle(createObjectsBatch, data);

  return createResponse;
};