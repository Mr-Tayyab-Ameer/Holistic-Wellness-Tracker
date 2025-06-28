// Ethical & Lifestyle Diets recipes
// Includes: Lacto-Ovo Vegetarian, Strict Vegan, Pescatarian, Ketogenic Diet, Paleo Diet
export const lifestyleDietsRecipes = [
  {
    id: 'lifestyle_001',
    name: 'Tofu Scramble with Vegetables',
    description: 'Protein-rich tofu scramble with colorful vegetables and turmeric for a vegan breakfast',
    ingredients: ['firm tofu', 'spinach', 'bell peppers', 'onions', 'turmeric', 'nutritional yeast', 'olive oil', 'garlic', 'herbs'],
    instructions: 'Crumble tofu and sauté with vegetables. Add turmeric for color and nutritional yeast for cheesy flavor. Season with herbs and spices.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    nutrition: {
      calories: 220,
      protein: 18,
      carbs: 12,
      fats: 12,
      fiber: 6,
      iron: 8,
      calcium: 350
    },
    mealType: 'breakfast',
    image: '🍳',
    medicalBenefits: {
      'Strict Vegan': 'All ingredients are plant-based, providing complete protein and essential nutrients for vegans.',
      'Lacto-Ovo Vegetarian': 'Dairy-free alternative to scrambled eggs, rich in plant protein.',
      'Type 1 Diabetes (Insulin-dependent)': 'Low glycemic index and high protein help stabilize blood sugar.',
      'Type 2 Diabetes (Non-insulin dependent)': 'Low glycemic index and high protein content support blood sugar control.',
      'High Cholesterol/Hyperlipidemia': 'No cholesterol, heart-healthy fats from olive oil help lower LDL cholesterol.',
      'Hypertension (High Blood Pressure)': 'Low sodium and high potassium from vegetables support healthy blood pressure.',
      'Hindu Vegetarian': 'Contains no animal flesh, suitable for Hindu vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.'
    },
    compatibleWith: [
      'Strict Vegan',
      'Lacto-Ovo Vegetarian',
      'Hindu Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'High Cholesterol/Hyperlipidemia',
      'Hypertension (High Blood Pressure)'
    ],
    incompatibleWith: [
      'Soy Allergy',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)'
    ]
  },
  {
    id: 'lifestyle_002',
    name: 'Lentil and Sweet Potato Curry',
    description: 'Hearty lentil curry with sweet potatoes and aromatic spices for a nutritious vegan meal',
    ingredients: ['red lentils', 'sweet potato', 'coconut milk', 'onions', 'garlic', 'ginger', 'curry powder', 'turmeric', 'spinach', 'brown rice'],
    instructions: 'Sauté onions, garlic, and ginger. Add lentils, sweet potato, and spices. Simmer with coconut milk until lentils are tender. Serve over brown rice.',
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 58,
      fats: 12,
      fiber: 14,
      iron: 12,
      vitaminC: 45
    },
    mealType: 'dinner',
    image: '🍛',
    medicalBenefits: {
      'Strict Vegan': 'All ingredients are plant-based, providing complete protein and iron for vegans.',
      'Lacto-Ovo Vegetarian': 'Nutritious plant-based meal option, high in fiber and protein.',
      'Type 1 Diabetes (Insulin-dependent)': 'High fiber and low glycemic index help with blood sugar control.',
      'Type 2 Diabetes (Non-insulin dependent)': 'High fiber content helps stabilize blood sugar and improve insulin sensitivity.',
      'High Cholesterol/Hyperlipidemia': 'Soluble fiber from lentils helps lower cholesterol.',
      'Hypertension (High Blood Pressure)': 'Potassium-rich sweet potatoes and low sodium support healthy blood pressure.',
      'Hindu Vegetarian': 'Contains no animal flesh, suitable for Hindu vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free.',
      'Celiac Disease (Autoimmune gluten intolerance)': 'Naturally gluten-free, safe for celiac disease.'
    },
    compatibleWith: [
      'Strict Vegan',
      'Lacto-Ovo Vegetarian',
      'Hindu Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'High Cholesterol/Hyperlipidemia',
      'Hypertension (High Blood Pressure)'
    ],
    incompatibleWith: [
      'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)'
    ]
  },
  {
    id: 'lifestyle_003',
    name: 'Keto Avocado and Egg Bowl',
    description: 'High-fat, low-carb breakfast bowl perfect for ketogenic diet',
    ingredients: ['eggs', 'avocado', 'bacon', 'spinach', 'cheese', 'olive oil', 'herbs', 'salt', 'pepper'],
    instructions: 'Cook eggs to preference. Sauté spinach with olive oil. Assemble bowl with avocado, bacon, eggs, and cheese. Season with herbs.',
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 8,
      fats: 35,
      fiber: 6,
      netCarbs: 2
    },
    mealType: 'breakfast',
    image: '🥑',
    medicalBenefits: {
      'Ketogenic Diet': 'High fat, low net carbs maintain ketosis and provide sustained energy.',
      'Paleo Diet': 'Whole food ingredients, no processed foods, suitable for paleo diets.',
      'Lacto-Ovo Vegetarian': 'Contains eggs and dairy, suitable for lacto-ovo vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Type 2 Diabetes (Non-insulin dependent)': 'Minimal carbs prevent glucose spikes and support insulin sensitivity.',
      'Metabolic Syndrome': 'High fat and low carbs improve insulin sensitivity and metabolic health.'
    },
    compatibleWith: [
      'Ketogenic Diet',
      'Paleo Diet',
      'Lacto-Ovo Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Metabolic Syndrome'
    ],
    incompatibleWith: [
      'Strict Vegan',
      'Hindu Vegetarian',
      'Jain Vegetarian (Strict vegan + no root vegetables)',
      'Egg Allergy',
      'Dairy/Milk Allergy',
      'Lactose Intolerance'
    ]
  }
]; 