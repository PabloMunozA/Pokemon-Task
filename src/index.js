import { getAll } from './services/pokemon/pokemonServices.js';
import { getLocations } from './controllers/pokemon/locationControllers.js';
import { getMoves } from './controllers/pokemon/moveControllers.js';
import { getPokemons } from './controllers/pokemon/pokemonControllers.js';

import { setLocations } from './controllers/hubspot/locationsController.js';
import { setMoves } from './controllers/hubspot/movesController.js';
import { setPokemons } from './controllers/hubspot/pokemonsController.js';

import { savePokemonData } from './controllers/database/dataBaseController.js';
import { closeDB, connectDB } from './dataBase/connection.js';
import { getAssociationSummary } from './services/database/stateService.js'; 
import { associatePokemonLocations, associatePokemonMoves } from './controllers/hubspot/associationsController.js'; 
import { getMigrationStatus, setMigrationStatus } from './services/database/migrationStateService.js';

const initMigration = async () => {

  const migrationState = await getMigrationStatus();

  if (migrationState?.completed) {
    console.log("🛑 Migration already completed. It will not run again.");
    await closeDB();
    return;
  }

  console.log("✅ Starting migration...");

  // Get Location
  const locations = await getAll({ slug: 'location', limit: 100 });
  const formatedLocation = await getLocations({ locations: locations.results });
  const hsLocationData = await setLocations(formatedLocation);
  await savePokemonData({ data: hsLocationData, collection: 'locations' }); 
  console.log(JSON.stringify(hsLocationData, null, 2));  

  // Get Move
  const moves = await getAll({ slug: 'move', limit: 100 });
  const formatedMoves = await getMoves({ moves: moves.results });
  const hsMovesData = await setMoves(formatedMoves); 
  console.log(JSON.stringify(hsMovesData, null, 2));
  await savePokemonData({ data: hsMovesData, collection: 'moves' }); 

  // Get Pokémons
  const pokemons = await getAll({ slug: 'pokemon', limit: 100 });
  const formatedPokemon = await getPokemons({ pokemons: pokemons.results });
  const hsPokemonData = await setPokemons(formatedPokemon);
  console.log(JSON.stringify(hsPokemonData, null, 2));
  await savePokemonData({ data: hsPokemonData, collection: 'pokemons' });

  // Get data from MongoDB to create associations
  const db = await connectDB();
  const locationsCollection = db.collection("locations");
  const movesCollection = db.collection("moves");
  const pokemonsCollection = db.collection("pokemons");

  const locationsFromDB = await locationsCollection.find({}).toArray();
  const movesFromDB = await movesCollection.find({}).toArray();
  const pokemonsFromDB = await pokemonsCollection.find({}).toArray();

  console.log(
    `Data retrieved from MongoDB: ${locationsFromDB.length} locations, ${movesFromDB.length} moves, ${pokemonsFromDB.length} pokémons`
  );

  const locationAssociations = await associatePokemonLocations({
    pokemons: pokemonsFromDB,
    targetObjects: locationsFromDB,
    associationType: "locations",
    associationId: 1,
    associationCategoryHubspot: "HUBSPOT_DEFINED",
    fromObjectTypeId: "contacts",
    toObjectTypeId: "companies",
  });

  const moveAssociations = await associatePokemonMoves({
    pokemons: pokemonsFromDB,
    targetObjects: movesFromDB,
    associationType: "moves",
    associationId: 19,
    associationCategoryHubspot: "USER_DEFINED",
    fromObjectTypeId: "contacts",
    toObjectTypeId: "moves",
  });

  // At the end of a successful migration:
  await setMigrationStatus(true);
  await getAssociationSummary();
  console.log("✅ Migration completed and status updated.");
  await closeDB();
};

initMigration();