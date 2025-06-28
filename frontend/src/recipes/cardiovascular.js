// Cardiovascular Conditions recipes
// Includes: Hypertension, Coronary Heart Disease, High Cholesterol, Heart Failure
export const cardiovascularRecipes = [
  {
    id: 'cardio_001',
    name: 'DASH Diet Mediterranean Salad',
    description: 'Low-sodium Mediterranean salad rich in potassium and heart-healthy fats',
    ingredients: ['mixed greens', 'cucumber', 'tomatoes', 'olives', 'feta cheese', 'olive oil', 'lemon', 'herbs', 'no-salt seasoning'],
    instructions: 'Wash and chop vegetables. Combine with olives and feta. Dress with olive oil, lemon, and herbs. Use no-salt seasoning instead of salt.',
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 12,
      fats: 14,
      fiber: 6,
      sodium: 85,
      potassium: 650,
      magnesium: 45
    },
    mealType: 'lunch',
    image: '🥗',
    medicalBenefits: {
      'Hypertension (High Blood Pressure)': 'Very low sodium and high potassium content help lower blood pressure, in line with DASH diet recommendations.',
      'Heart Failure': 'Low sodium reduces fluid retention, and heart-healthy fats from olive oil support cardiovascular function.',
      'High Cholesterol/Hyperlipidemia': 'Monounsaturated fats from olive oil and fiber from vegetables help lower LDL cholesterol and improve lipid profile.',
      'Coronary Heart Disease': 'Rich in antioxidants and healthy fats, which reduce inflammation and support arterial health.',
      'Lacto-Ovo Vegetarian': 'Contains no meat or fish, suitable for vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Type 1 Diabetes (Insulin-dependent)': 'Low glycemic load and high fiber help stabilize blood sugar.',
      'Type 2 Diabetes (Non-insulin dependent)': 'High fiber and healthy fats support blood sugar control and insulin sensitivity.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free if gluten-free feta is used.',
      'Celiac Disease (Autoimmune gluten intolerance)': 'Safe if gluten-free feta and seasonings are used.'
    },
    compatibleWith: [
      'Hypertension (High Blood Pressure)',
      'Heart Failure',
      'High Cholesterol/Hyperlipidemia',
      'Coronary Heart Disease',
      'Lacto-Ovo Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)'
    ],
    incompatibleWith: [
      'Dairy/Milk Allergy',
      'Lactose Intolerance',
      'Strict Vegan',
      'Hindu Vegetarian'
    ]
  },
  {
    id: 'cardio_002',
    name: 'Herb-Crusted Salmon with Roasted Vegetables',
    description: 'Omega-3 rich salmon with potassium-rich vegetables and no added salt',
    ingredients: ['salmon fillet', 'broccoli', 'sweet potato', 'bell peppers', 'herbs', 'lemon', 'olive oil', 'garlic', 'no-salt seasoning'],
    instructions: 'Season salmon with herbs and lemon (no salt). Roast vegetables with olive oil and herbs. Serve with lemon-herb sauce.',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 25,
      fats: 18,
      fiber: 8,
      sodium: 95,
      potassium: 1200,
      omega3: 2100
    },
    mealType: 'dinner',
    image: '🐟',
    medicalBenefits: {
      'Hypertension (High Blood Pressure)': 'Very low sodium, high potassium, and omega-3s help lower blood pressure and support vascular health.',
      'Heart Failure': 'Omega-3s support heart function, and low sodium reduces fluid retention.',
      'High Cholesterol/Hyperlipidemia': 'Omega-3 fatty acids lower triglycerides and raise HDL cholesterol.',
      'Coronary Heart Disease': 'Omega-3s reduce inflammation and support heart rhythm.',
      'Pescatarian': 'Contains fish as the main protein source.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients if halal salmon is used.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients if kosher salmon is used.',
      'Type 1 Diabetes (Insulin-dependent)': 'High protein and healthy fats help stabilize blood sugar.',
      'Type 2 Diabetes (Non-insulin dependent)': 'Omega-3s improve insulin sensitivity and reduce inflammation.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free.',
      'Celiac Disease (Autoimmune gluten intolerance)': 'Naturally gluten-free, safe for celiac disease.'
    },
    compatibleWith: [
      'Hypertension (High Blood Pressure)',
      'Heart Failure',
      'High Cholesterol/Hyperlipidemia',
      'Coronary Heart Disease',
      'Pescatarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)'
    ],
    incompatibleWith: [
      'Fish Allergy',
      'Shellfish Allergy (Crustaceans & Mollusks)',
      'Strict Vegan',
      'Hindu Vegetarian'
    ]
  },
  {
    id: 'cardio_003',
    name: 'Low-Sodium Quinoa and Black Bean Bowl',
    description: 'Protein-rich quinoa bowl with potassium-rich vegetables and no added salt',
    ingredients: ['quinoa', 'black beans', 'avocado', 'tomatoes', 'corn', 'lime', 'olive oil', 'herbs', 'no-salt seasoning'],
    instructions: 'Cook quinoa without salt. Combine with rinsed black beans and vegetables. Dress with lime, olive oil, and herbs. Use no-salt seasoning.',
    prepTime: 20,
    cookTime: 20,
    servings: 2,
    nutrition: {
      calories: 420,
      protein: 18,
      carbs: 55,
      fats: 16,
      fiber: 14,
      sodium: 75,
      potassium: 850,
      magnesium: 120
    },
    mealType: 'lunch',
    image: '🥗',
    medicalBenefits: {
      'Hypertension (High Blood Pressure)': 'Very low sodium, high potassium, and magnesium support healthy blood pressure.',
      'Heart Failure': 'Low sodium reduces fluid retention, and high fiber supports heart health.',
      'High Cholesterol/Hyperlipidemia': 'Soluble fiber from beans and healthy fats from avocado help lower cholesterol.',
      'Coronary Heart Disease': 'Plant-based protein and fiber support cardiovascular health.',
      'Lacto-Ovo Vegetarian': 'Contains no meat or fish, suitable for vegetarians.',
      'Strict Vegan': 'All ingredients are plant-based.',
      'Hindu Vegetarian': 'Contains no animal flesh, suitable for Hindu vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free.',
      'Celiac Disease (Autoimmune gluten intolerance)': 'Naturally gluten-free, safe for celiac disease.'
    },
    compatibleWith: [
      'Hypertension (High Blood Pressure)',
      'Heart Failure',
      'High Cholesterol/Hyperlipidemia',
      'Coronary Heart Disease',
      'Lacto-Ovo Vegetarian',
      'Strict Vegan',
      'Hindu Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)'
    ],
    incompatibleWith: [
      'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)'
    ]
  }
]; 