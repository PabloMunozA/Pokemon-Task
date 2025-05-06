import { connectDB } from "../../dataBase/connection.js";

/**
 * Retrieves the association state for a specific Pokémon
 * @param {string} pokemonId - Pokémon ID in HubSpot
 * @returns {Object|null} - Association state or null if it doesn't exist
 */
export const getAssociationState = async (pokemonId) => {
  try {
    const db = await connectDB();
    const collection = db.collection("association_states");
    const state = await collection.findOne({ pokemon_id: pokemonId });
    return state;
  } catch (error) {
    console.error("Error retrieving association state:", error);
    return null;
  }
};

/**
 * Updates or creates the association state for a Pokémon
 * @param {Object} state - Association state to be saved
 * @returns {Object} - Updated document or operation result
 */
export const updateAssociationState = async (state) => {
  try {
    if (!state?.pokemon_id) {
      throw new Error("The 'state' object must contain a 'pokemon_id'");
    }

    const db = await connectDB();
    const collection = db.collection("association_states");

    const updatedState = {
      ...state,
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { pokemon_id: state.pokemon_id },
      { $set: updatedState },
      { upsert: true, returnDocument: "after" }
    );

    return result.value;
  } catch (error) {
    console.error("Error updating association state:", error);
    throw error;
  }
};

/**
 * Retrieves a summary of all association states
 * @returns {Object} - Summary of association states
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
    console.error("Error retrieving association summary:", error);
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      completionPercentage: 0,
    };
  }
};