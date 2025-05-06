import { request } from '../../utils/request.js';

const buildDatamoves = (move) => {
    return {
        properties: {
            move_id: move.id,
            name: move.name || '',
            pp: move?.pp || 0,
            power: move.power || 0,
        }
        
    };
};

export const getMoves = async ({ moves = [] }) => {
    const datamoves= [];

    for (const moveItem of moves) {
        const move = await request({ url: moveItem.url, method: 'get' });
        const builtmove = buildDatamoves(move);
        datamoves.push(builtmove);
    }

    console.error(JSON.stringify(datamoves, null, 2));
    console.log(datamoves.length);
    return datamoves;
};