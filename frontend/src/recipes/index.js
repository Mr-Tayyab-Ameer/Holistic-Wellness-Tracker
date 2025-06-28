// Recipe Aggregator - Combines all recipe modules
import { metabolicEndocrineRecipes } from './metabolicEndocrine.js';
import { cardiovascularRecipes } from './cardiovascular.js';
import { gastrointestinalRecipes } from './gastrointestinal.js';
import { lifestyleDietsRecipes } from './lifestyleDiets.js';

// Combine all recipes into a single array
export const allRecipes = [
  ...metabolicEndocrineRecipes,
  ...cardiovascularRecipes,
  ...gastrointestinalRecipes,
  ...lifestyleDietsRecipes
];

// Export individual modules for specific use cases
export {
  metabolicEndocrineRecipes,
  cardiovascularRecipes,
  gastrointestinalRecipes,
  lifestyleDietsRecipes
};

// Helper function to get recipes by category
export const getRecipesByCategory = (category) => {
  const categoryMap = {
    'metabolicEndocrine': metabolicEndocrineRecipes,
    'cardiovascular': cardiovascularRecipes,
    'gastrointestinal': gastrointestinalRecipes,
    'lifestyleDiets': lifestyleDietsRecipes
  };
  
  return categoryMap[category] || [];
};

// Helper function to get recipes by dietary restriction
export const getRecipesByRestriction = (restriction) => {
  return allRecipes.filter(recipe => 
    recipe.compatibleWith.includes(restriction)
  );
};

// Helper function to get recipes by multiple restrictions
export const getRecipesByMultipleRestrictions = (restrictions) => {
  if (!restrictions || restrictions.length === 0) {
    return [];
  }
  
  return allRecipes.filter(recipe => {
    // Check if recipe is compatible with ALL restrictions
    return restrictions.every(restriction => 
      recipe.compatibleWith.includes(restriction)
    );
  });
}; 