import { errorHandle } from "../../utils/handleError.js";
import { createObjectsBatch } from "../../services/hubspot/hubspotServices.js";

export const setPokemons = async (dataArray) => {
  if (!dataArray.length) return;

  const data = {
    obcjetTypeId: "contacts",
    inputs:dataArray,
  };
  const createResponse = await errorHandle(createObjectsBatch, data);

  return createResponse;
};