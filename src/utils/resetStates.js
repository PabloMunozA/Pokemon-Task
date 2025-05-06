import { connectDB, closeDB } from './dataBase/connection.js';

const resetAssociationStates = async () => {
  try {
    const db = await connectDB();
    
    // Opción 1: Eliminar completamente la colección de estados
    await db.collection('association_states').drop().catch(() => console.log('La colección no existía, continuando...'));
    
    // Opción 2: O si prefieres mantener un registro, reinicia los estados
    // await db.collection('association_states').updateMany(
    //   {},
    //   { $set: { completed: false, moves_associated: false, locations_associated: false, processed_moves: [], processed_locations: [] } }
    // );
    
    console.log('Estados de asociación reiniciados correctamente');
    
    // También puedes eliminar los resultados anteriores si lo deseas
    await db.collection('association_results').drop().catch(() => console.log('La colección no existía, continuando...'));
    console.log('Resultados de asociación eliminados correctamente');
    
    await closeDB();
  } catch (error) {
    console.error('Error al reiniciar estados:', error);
  }
};

resetAssociationStates();