import { request } from '../../utils/request.js';

const buildDataLocations = (location) => {
    return {
        properties: {
            name: location.name || '',
            number_of_areas: location?.areas.length || 0,
            location_id: location.id,
            state: location?.region?.name || '',
            generation: location?.game_indices[0]?.generation?.name || '',
        }
    };
}; 

export const getLocations = async ({ locations = [] }) => {
    const dataLocations= [];

    for (const locationItem of locations) {
        const location = await request({ url: locationItem.url, method: 'get' });
        const builtLocation = buildDataLocations(location);
        dataLocations.push(builtLocation);
    }

    return dataLocations;
};