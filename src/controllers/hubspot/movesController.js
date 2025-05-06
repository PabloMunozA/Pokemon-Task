import { errorHandle } from "../../utils/errorHandle.js";
import { createObjectsBatch } from "../../services/hubspot/hubspotServices.js";

export const setMoves = async (dataArray) => {
  if (!dataArray.length) return;

  const data = {
    obcjetTypeId: "2-43184557",
    inputs:dataArray,
  };
  const createResponse = await errorHandle(createObjectsBatch, data);

  return createResponse;
};