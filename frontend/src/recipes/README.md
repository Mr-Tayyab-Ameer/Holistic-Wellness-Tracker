# Modular Recipe Structure

This directory contains a modular recipe system organized by dietary condition categories. Each file contains recipes specifically designed for different health conditions and dietary restrictions.

## File Structure

```
recipes/
├── index.js                    # Aggregator file - combines all recipe modules
├── metabolicEndocrine.js       # Metabolic & Endocrine Conditions
├── cardiovascular.js          # Cardiovascular Conditions  
├── gastrointestinal.js        # Gastrointestinal Disorders
├── lifestyleDiets.js          # Ethical & Lifestyle Diets
└── README.md                  # This documentation file
```

## Recipe Categories

### 1. Metabolic & Endocrine Conditions (`metabolicEndocrine.js`)
- **Conditions**: Type 1/2 Diabetes, Gestational Diabetes, Prediabetes, Hypoglycemia, Metabolic Syndrome
- **Focus**: Low glycemic index, blood sugar management, insulin sensitivity
- **Sample Recipes**: 3 recipes including low-GI oatmeal, grilled salmon, and Greek yogurt parfait

### 2. Cardiovascular Conditions (`cardiovascular.js`)
- **Conditions**: Hypertension, Coronary Heart Disease, High Cholesterol, Heart Failure
- **Focus**: Low sodium, heart-healthy fats, potassium-rich foods
- **Sample Recipes**: 3 recipes including DASH diet salad, herb-crusted salmon, and quinoa bowl

### 3. Gastrointestinal Disorders (`gastrointestinal.js`)
- **Conditions**: Celiac Disease, Crohn's Disease, Ulcerative Colitis, IBS, GERD
- **Focus**: Gluten-free, easily digestible, anti-inflammatory ingredients
- **Sample Recipes**: 3 recipes including gluten-free pancakes, quinoa bowl, and gentle chicken soup

### 4. Ethical & Lifestyle Diets (`lifestyleDiets.js`)
- **Conditions**: Vegetarian, Vegan, Pescatarian, Ketogenic, Paleo
- **Focus**: Plant-based proteins, ethical considerations, lifestyle choices
- **Sample Recipes**: 3 recipes including tofu scramble, lentil curry, and keto avocado bowl

## Recipe Structure

Each recipe follows this standardized structure:

```javascript
{
  id: 'unique_id',
  name: 'Recipe Name',
  description: 'Detailed description',
  ingredients: ['ingredient1', 'ingredient2', ...],
  instructions: 'Step-by-step cooking instructions',
  prepTime: 15, // minutes
  cookTime: 30, // minutes
  servings: 4,
  nutrition: {
    calories: 350,
    protein: 25,
    carbs: 30,
    fats: 15,
    fiber: 8,
    // Additional nutrition info as needed
  },
  mealType: 'breakfast|lunch|dinner|snack',
  image: '🍳', // Emoji representation
  medicalBenefits: {
    'Condition Name': 'Specific benefit description'
  },
  compatibleWith: [
    'Dietary Restriction 1',
    'Dietary Restriction 2'
  ],
  incompatibleWith: [
    'Allergy or Restriction 1',
    'Allergy or Restriction 2'
  ]
}
```

## Usage

### Importing Recipes

```javascript
// Import all recipes
import { allRecipes } from '../recipes/index.js';

// Import specific categories
import { metabolicEndocrineRecipes } from '../recipes/metabolicEndocrine.js';
import { cardiovascularRecipes } from '../recipes/cardiovascular.js';

// Use helper functions
import { 
  getRecipesByCategory, 
  getRecipesByRestriction,
  getRecipesByMultipleRestrictions 
} from '../recipes/index.js';
```

### Helper Functions

The `index.js` file provides several helper functions:

- `getRecipesByCategory(category)` - Get recipes by category name
- `getRecipesByRestriction(restriction)` - Get recipes compatible with a single restriction
- `getRecipesByMultipleRestrictions(restrictions)` - Get recipes compatible with multiple restrictions

### Adding New Recipes

1. **Choose the appropriate category file** based on the primary health condition
2. **Add the recipe** to the array in that file
3. **Ensure proper compatibility** by updating `compatibleWith` and `incompatibleWith` arrays
4. **Update the aggregator** - the `index.js` file automatically includes all recipes

### Adding New Categories

1. **Create a new file** following the naming convention (e.g., `kidneyLiver.js`)
2. **Export the recipes array** with the category name
3. **Update `index.js`** to import and include the new category
4. **Update this README** to document the new category

## Benefits of Modular Structure

1. **Maintainability**: Easy to find and update recipes for specific conditions
2. **Scalability**: Can add hundreds of recipes without affecting performance
3. **Organization**: Clear separation of concerns by health condition
4. **Collaboration**: Multiple developers can work on different categories
5. **Testing**: Can test recipes by category independently
6. **Performance**: Only load recipes for relevant conditions

## Future Expansion

This modular structure makes it easy to add:
- More recipe categories (e.g., kidney/liver conditions, bone/joint conditions)
- More recipes per category
- Additional metadata (cooking difficulty, cost, seasonal availability)
- Recipe ratings and reviews
- Nutritional analysis tools
- Meal planning features

## Integration with Recipe Service

The `recipeService.js` file automatically imports all recipes from this modular structure and provides IndexedDB-based storage and retrieval functionality. 