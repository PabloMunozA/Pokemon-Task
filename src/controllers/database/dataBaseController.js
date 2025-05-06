import { insertMultipleDocuments } from "../../dataBase/databaseActions.js";

const filterData = (data, collection) => {
    if (collection === 'locations') {
        const { hs_object_id, name, number_of_areas, location_id, state, generation } = data.properties;
        return { hs_object_id, name, number_of_areas, location_id, state, generation };
    }
    if (collection === 'moves') {
        const { hs_object_id, move_id, name, pp, power } = data.properties;
        return { hs_object_id, move_id, name, pp, power } ;
    }

    if (collection === 'pokemons') {
        const { hs_object_id, firstname, hp, attack, defense, special_defense, special_attack, speed, types, moves, locations } = data.properties;
        return { hs_object_id, firstname, hp, attack, defense, special_defense, special_attack, speed, types, moves, locations };
    }
}

export const savePokemonData = async ({data, collection}) => {

    const { results } = data;
    const fullData  = [];

    for (const result of results) {
        const properties = filterData(result, collection);

        fullData.push(properties);
    }
    
    await insertMultipleDocuments(collection, fullData);
    console.log(fullData);
};