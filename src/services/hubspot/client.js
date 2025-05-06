import { Client } from "@hubspot/api-client";
import { config } from "../../config/config.js";

export const hubspotClient = new Client({ accessToken: config.HUBSPOT_API_KEY });