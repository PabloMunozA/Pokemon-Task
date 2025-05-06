import { connectDB } from "../../dataBase/connection.js";

/**
 * Obtiene el estado de asociación para un pokémon específico
 * @param {string} pokemonId - ID del pokémon en HubSpot
 * @returns {Object|null} - Estado de asociación o null si no existe
 */
export const getAssociationState = async (pokemonId) => {
  try {
    const db = await connectDB();
    const collection = db.collection("association_states");
    const state = await collection.findOne({ pokemon_id: pokemonId });
    return state;
  } catch (error) {
    console.error("Error al obtener estado de asociación:", error);
    return null;
  }
};

/**
 * Actualiza o crea el estado de asociación para un pokémon
 * @param {Object} state - Estado de asociación a guardar
 * @returns {Object} - Resultado de la operación
 */
export const updateAssociationState = async (state) => {
  try {
    const db = await connectDB();
    const collection = db.collection("association_states");

    // Actualizar si existe, insertar si no
    const result = await collection.updateOne({ pokemon_id: state.pokemon_id }, { $set: state }, { upsert: true });

    return result;
  } catch (error) {
    console.error("Error al actualizar estado de asociación:", error);
    throw error;
  }
};

/**
 * Obtiene un resumen del estado de todas las asociaciones
 * @returns {Object} - Resumen del estado de asociaciones
 */
export const getAssociationSummary = async () => {
  try {
    const db = await connectDB();
    const collection = db.collection("association_states");

    const total = await collection.countDocuments();
    const completed = await collection.countDocuments({ completed: true });
    const inProgress = await collection.countDocuments({ completed: false });

    return {
      total,
      completed,
      inProgress,
      completionPercentage: total > 0 ? (completed / total) * 100 : 0,
    };
  } catch (error) {
    console.error("Error al obtener resumen de asociaciones:", error);
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      completionPercentage: 0,
    };
  }
};