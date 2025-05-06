import { request } from '../../utils/request.js';

export const getAll = async ({ slug, limit }) => {
    const url = `https://pokeapi.co/api/v2/${slug}?limit=${limit}&offset=0`;
    const method = 'get';
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const data = await request({url, method});
    return data;
};