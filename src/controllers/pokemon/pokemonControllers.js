import { request } from '../../utils/request.js';

const buildDatapokemons = (pokemon) => {
    return {
        properties: {
            pokedex_id: pokemon.id,
            firstname: pokemon.name || '',
            hp: pokemon?.stats?.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
            attack: pokemon?.stats?.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
            defense: pokemon?.stats?.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
            special_defense: pokemon?.stats?.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0,
            special_attack: pokemon?.stats?.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0,
            speed: pokemon?.stats?.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
            types: pokemon?.types?.map(type => type.type?.name).join(';') || '',
            moves: pokemon?.moves?.map(move => {
                const url = move.move?.url || '';
                const id = url.split('/').filter(Boolean).pop();
                return id;
            }).join(';') || '',
            locations: pokemon?.location_area_encounters_data?.join(';') || ''
        }
    };
};


export const getPokemons = async ({ pokemons = [] }) => {
    const datapokemons = [];

    for (const pokemonItem of pokemons) {
        const pokemon = await request({ url: pokemonItem.url, method: 'get' });

        const locationData = await request({ url: pokemon.location_area_encounters, method: 'get' });

        // Get actual location from location_area
        const locationPromises = locationData.map(async loc => {
            const locationAreaUrl = loc.location_area?.url;
            if (locationAreaUrl) {
                const locationAreaData = await request({ url: locationAreaUrl, method: 'get' });
                const locationUrl = locationAreaData?.location?.url;
                if (locationUrl) {
                    return locationUrl.split('/').filter(Boolean).pop(); // ID Real Location
                }
            }
            return null;
        });

        const resolvedLocations = await Promise.all(locationPromises);
        const uniqueLocationIds = [...new Set(resolvedLocations.filter(Boolean))]; // Avoid duplicates and nulls

        pokemon.location_area_encounters_data = uniqueLocationIds;

        const builtpokemon = buildDatapokemons(pokemon);
        datapokemons.push(builtpokemon);
    }

    console.error(JSON.stringify(datapokemons, null, 2));
    console.log(datapokemons.length);

    return datapokemons;
};