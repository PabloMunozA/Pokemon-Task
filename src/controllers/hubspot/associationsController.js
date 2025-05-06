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
        console.log(`❌ Pokémon ${pokemon.firstname} no tiene ${associationType} válidos`);
      continue;
    }

    const matchedTargets = targetObjects.filter((obj) => targetIds.includes(obj[`${associationType.slice(0, -1)}_id`]));

    if (matchedTargets.length === 0) {
      console.log(`❌ No se encontraron ${associationType} para ${pokemon.firstname} con IDs: ${targetIds.join(", ")}`);
      continue;
    }

    for (const target of matchedTargets) {
        console.log("Asociando Pokémon:", {
          nombre: pokemon.firstname,
          fromId: pokemon.hs_object_id,
          toId: target.hs_object_id,
        });
  
        const fromId = Number(pokemon.hs_object_id.trim());
        const toId = Number(target.hs_object_id.trim());

      // Imprimir el tipo de dato y valor de fromId y toId para depuración
      console.log(
        `Depuración: fromId (${typeof fromId}): ${fromId}, toId (${typeof toId}): ${toId}`
      );

      if (isNaN(fromId) || isNaN(toId)) {
        console.warn(`⚠️ IDs inválidos para ${pokemon.firstname} y ${target.name}`);
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
  
          console.log(`✅ Asociación exitosa entre ${pokemon.firstname} y ${target.name}`);
          results.push({
            pokemon: pokemon.firstname,
            target: target.name,
            success: true,
          });
  
        } catch (err) {
          console.error(`⚠️ Error al asociar ${pokemon.firstname} con ${target.name}`, err.message);
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
    console.log("🧾 Asociando Pokémon con moves...");
    return await associatePokemonLocations(params);
  };
  