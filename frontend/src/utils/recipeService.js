// Recipe Service for IndexedDB Management
const DB_NAME = 'WellnessTrackerDB';
const DB_VERSION = 1;
const RECIPE_STORE = 'recipes';
const USER_STORE = 'users';

// Import recipes from modular structure
import { allRecipes } from '../recipes/index.js';

// Use the modular recipes as sample recipes
const SAMPLE_RECIPES = allRecipes;

console.log('Recipe service loaded with', SAMPLE_RECIPES.length, 'sample recipes');

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create recipes store
      if (!db.objectStoreNames.contains(RECIPE_STORE)) {
        const recipeStore = db.createObjectStore(RECIPE_STORE, { keyPath: 'id' });
        recipeStore.createIndex('mealType', 'mealType', { unique: false });
        recipeStore.createIndex('compatibleWith', 'compatibleWith', { unique: false });
        console.log('Created recipes store in IndexedDB');
      }

      // Create users store
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: 'id' });
        console.log('Created users store in IndexedDB');
      }
    };
  });
};

// Initialize recipes (check if empty and add sample recipes if needed)
const initializeRecipes = async () => {
  try {
    console.log('Initializing recipes...');
    const existingRecipes = await getAllRecipes();
    
    // Check if recipes exist and have medicalBenefits
    const hasValidRecipes = existingRecipes.length > 0 && 
                           existingRecipes.some(recipe => recipe.medicalBenefits && Object.keys(recipe.medicalBenefits).length > 0);
    
    // If no recipes exist OR recipes don't have medicalBenefits, add sample recipes
    if (existingRecipes.length === 0 || !hasValidRecipes) {
      console.log('No valid recipes found or recipes missing medicalBenefits, adding sample recipes...');
      await addSampleRecipes();
    } else {
      console.log(`Found ${existingRecipes.length} existing recipes with medicalBenefits`);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing recipes:', error);
    return false;
  }
};

// Add sample recipes to IndexedDB
const addSampleRecipes = async () => {
  try {
    console.log('Adding sample recipes to IndexedDB...');
    console.log('Total sample recipes to add:', SAMPLE_RECIPES.length);
    
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readwrite');
    const store = transaction.objectStore(RECIPE_STORE);

    // Clear existing recipes
    console.log('Clearing existing recipes from IndexedDB...');
    await store.clear();

    // Add sample recipes
    for (const recipe of SAMPLE_RECIPES) {
      console.log(`Adding recipe: ${recipe.name}`);
      console.log(`Recipe ID: ${recipe.id}`);
      console.log(`Has medicalBenefits:`, !!recipe.medicalBenefits);
      console.log(`medicalBenefits keys:`, Object.keys(recipe.medicalBenefits || {}));
      console.log(`compatibleWith:`, recipe.compatibleWith);
      await store.add(recipe);
    }

    console.log(`Successfully added ${SAMPLE_RECIPES.length} sample recipes to IndexedDB`);
    
    // Verify the recipes were added correctly
    const verifyRecipes = await getAllRecipes();
    console.log(`Verification: Retrieved ${verifyRecipes.length} recipes from IndexedDB`);
    verifyRecipes.forEach((recipe, index) => {
      console.log(`Verification Recipe ${index + 1}: ${recipe.name}`);
      console.log(`Verification Has medicalBenefits:`, !!recipe.medicalBenefits);
      console.log(`Verification medicalBenefits keys:`, Object.keys(recipe.medicalBenefits || {}));
    });
    
    return true;
  } catch (error) {
    console.error('Error adding sample recipes:', error);
    return false;
  }
};

// Reset to sample recipes (clear and reload)
const resetToSample = async () => {
  try {
    console.log('Resetting to sample recipes...');
    await addSampleRecipes();
    return true;
  } catch (error) {
    console.error('Error resetting to sample recipes:', error);
    return false;
  }
};

// Get all recipes
const getAllRecipes = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readonly');
    const store = transaction.objectStore(RECIPE_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Retrieved ${request.result.length} recipes from IndexedDB`);
        // Debug: Check if medicalBenefits are present
        request.result.forEach((recipe, index) => {
          console.log(`Recipe ${index + 1}: ${recipe.name}`);
          console.log(`Has medicalBenefits:`, !!recipe.medicalBenefits);
          console.log(`medicalBenefits keys:`, Object.keys(recipe.medicalBenefits || {}));
        });
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Error getting recipes from IndexedDB:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

// Get recipes by dietary restrictions (alias for getRecipesByRestrictions)
const filterRecipesByRestrictions = async (restrictions) => {
  return getRecipesByRestrictions(restrictions);
};

// Get recipes by dietary restrictions
const getRecipesByRestrictions = async (restrictions) => {
  try {
    console.log('Filtering recipes for restrictions:', restrictions);
    const allRecipes = await getAllRecipes();
    
    if (!restrictions || restrictions.length === 0) {
      console.log('No restrictions provided, returning empty array');
      return [];
    }

    const filtered = allRecipes.filter(recipe => {
      // Check if recipe is compatible with ALL restrictions
      const isCompatible = restrictions.every(restriction => 
        recipe.compatibleWith.includes(restriction)
      );
      return isCompatible;
    });

    console.log(`Found ${filtered.length} recipes compatible with restrictions:`, restrictions);
    return filtered;
  } catch (error) {
    console.error('Error filtering recipes by restrictions:', error);
    return [];
  }
};

// Add a new recipe
const addRecipe = async (recipe) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readwrite');
    const store = transaction.objectStore(RECIPE_STORE);
    
    // Generate unique ID if not provided
    if (!recipe.id) {
      recipe.id = Date.now().toString();
    }
    
    await store.add(recipe);
    console.log('Recipe added successfully');
    return true;
  } catch (error) {
    console.error('Error adding recipe:', error);
    return false;
  }
};

// Update a recipe
const updateRecipe = async (recipe) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readwrite');
    const store = transaction.objectStore(RECIPE_STORE);
    
    await store.put(recipe);
    console.log('Recipe updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating recipe:', error);
    return false;
  }
};

// Delete a recipe
const deleteRecipe = async (recipeId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readwrite');
    const store = transaction.objectStore(RECIPE_STORE);
    
    await store.delete(recipeId);
    console.log('Recipe deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
};

// Get recipe by ID
const getRecipeById = async (recipeId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readonly');
    const store = transaction.objectStore(RECIPE_STORE);
    const request = store.get(recipeId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    return null;
  }
};

// Get recipes by meal type
const getRecipesByMealType = async (mealType) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RECIPE_STORE], 'readonly');
    const store = transaction.objectStore(RECIPE_STORE);
    const index = store.index('mealType');
    const request = index.getAll(mealType);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting recipes by meal type:', error);
    return [];
  }
};

// Export the recipe service
export const recipeService = {
  initDB,
  initializeRecipes,
  addSampleRecipes,
  resetToSample,
  getAllRecipes,
  getRecipesByRestrictions,
  filterRecipesByRestrictions,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesByMealType
}; 