import hubspot from "@hubspot/api-client";
import { config } from "../../config/config.js";

const hubspotClient = new hubspot.Client({
  accessToken: config.HUBSPOT_API_KEY,
});

export const associatePokemonLocations = async ({ pokemons, targetObjects, associationType, associationId, associationCategoryHubspot, fromObjectTypeId, toObjectTypeId }) => {
  const results = [];

  for (const pokemon of pokemons) {
    const targetIds = pokemon[associationType]
      ?.split(";")
      .map((id) => id.trim())
      .filter((id) => parseInt(id) <= 100);

    if (!targetIds || targetIds.length === 0) {
      console.log(`❌ Pokémon ${pokemon.firstname} has no valid ${associationType}`);
      continue;
    }

    const matchedTargets = targetObjects.filter((obj) => targetIds.includes(obj[`${associationType.slice(0, -1)}_id`]));

    if (matchedTargets.length === 0) {
      console.log(`❌ No ${associationType} found for ${pokemon.firstname} with IDs: ${targetIds.join(", ")}`);
      continue;
    }

    for (const target of matchedTargets) {
      console.log("Associating Pokémon:", {
        name: pokemon.firstname,
        fromId: pokemon.hs_object_id,
        toId: target.hs_object_id,
      });

      const fromId = Number(pokemon.hs_object_id.trim());
      const toId = Number(target.hs_object_id.trim());

      // Print the data type and value of fromId and toId for debugging purposes
      console.log(
        `Debug: fromId (${typeof fromId}): ${fromId}, toId (${typeof toId}): ${toId}`
      );

      if (isNaN(fromId) || isNaN(toId)) {
        console.warn(`⚠️ Invalid IDs for ${pokemon.firstname} and ${target.name}`);
        results.push({
          pokemon: pokemon.firstname,
          target: target.name,
          success: false,
          reason: "Invalid ID format",
        });
        continue;
      }

      try {
        const BatchInputPublicAssociationMultiPost = {
          inputs: [
            {
              types: [
                {
                  associationCategory: associationCategoryHubspot,
                  associationTypeId: associationId,
                },
              ],
              _from: { id: fromId },
              to: { id: toId },
            },
          ],
        };
        const fromObjectType = fromObjectTypeId;
        const toObjectType = toObjectTypeId;

        const response = await hubspotClient.crm.associations.v4.batchApi.create(
          fromObjectType,
          toObjectType,
          BatchInputPublicAssociationMultiPost
        );

        console.log(`✅ Successful association between ${pokemon.firstname} and ${target.name}`);
        results.push({
          pokemon: pokemon.firstname,
          target: target.name,
          success: true,
        });

      } catch (err) {
        console.error(`⚠️ Error associating ${pokemon.firstname} with ${target.name}`, err.message);
        results.push({
          pokemon: pokemon.firstname,
          target: target.name,
          success: false,
          reason: err.message,
        });
      }
    }
  }

  return results;
};

export const associatePokemonMoves = async (params) => {
  console.log("🧾 Associating Pokémon with moves...");
  return await associatePokemonLocations(params);
};