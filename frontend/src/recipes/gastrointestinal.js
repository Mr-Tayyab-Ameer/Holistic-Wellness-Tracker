// Gastrointestinal Disorders recipes
// Includes: Celiac Disease, Crohn's Disease, Ulcerative Colitis, IBS, GERD
export const gastrointestinalRecipes = [
  {
    id: 'gi_001',
    name: 'Gluten-Free Buckwheat Pancakes',
    description: 'Nutritious buckwheat pancakes with almond flour for a gluten-free breakfast',
    ingredients: ['buckwheat flour', 'almond flour', 'eggs', 'unsweetened almond milk', 'baking powder', 'vanilla extract', 'stevia', 'berries'],
    instructions: 'Mix buckwheat and almond flour with eggs and almond milk. Add baking powder and vanilla. Cook on griddle until golden. Serve with fresh berries.',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 22,
      fats: 8,
      fiber: 4,
      glycemicIndex: 40
    },
    mealType: 'breakfast',
    image: '🥞',
    medicalBenefits: {
      'Celiac Disease (Autoimmune gluten intolerance)': '100% gluten-free ingredients prevent autoimmune reactions and support gut healing.',
      'Gluten Sensitivity (Non-celiac)': 'Safe alternative to wheat-based pancakes, reducing digestive discomfort.',
      'Irritable Bowel Syndrome (IBS)': 'Gluten-free and low-FODMAP, gentle on sensitive digestive systems.',
      "Crohn's Disease": 'Easily digestible, low-residue ingredients reduce irritation during flare-ups.',
      'Ulcerative Colitis': 'Low-fiber, gentle ingredients suitable during remission or mild flare-ups.',
      'Lacto-Ovo Vegetarian': 'Contains no meat or fish, suitable for vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Type 1 Diabetes (Insulin-dependent)': 'Low glycemic index and moderate carbs help with blood sugar control.',
      'Type 2 Diabetes (Non-insulin dependent)': 'High fiber and low glycemic index support stable blood sugar.'
    },
    compatibleWith: [
      'Celiac Disease (Autoimmune gluten intolerance)',
      'Gluten Sensitivity (Non-celiac)',
      'Crohn\'s Disease',
      'Ulcerative Colitis',
      'Irritable Bowel Syndrome (IBS)',
      'Lacto-Ovo Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)'
    ],
    incompatibleWith: [
      'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)',
      'Egg Allergy',
      'Strict Vegan'
    ]
  },
  {
    id: 'gi_002',
    name: 'Quinoa Buddha Bowl with Tahini Dressing',
    description: 'Nutrient-packed quinoa bowl with roasted vegetables and gluten-free tahini dressing',
    ingredients: ['quinoa', 'sweet potato', 'chickpeas', 'kale', 'avocado', 'tahini', 'lemon', 'garlic', 'olive oil', 'herbs'],
    instructions: 'Cook quinoa. Roast sweet potato and chickpeas. Massage kale with olive oil. Prepare tahini dressing. Assemble bowl with avocado.',
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    nutrition: {
      calories: 450,
      protein: 16,
      carbs: 55,
      fats: 20,
      fiber: 12,
      glycemicIndex: 35
    },
    mealType: 'lunch',
    image: '🥗',
    medicalBenefits: {
      'Celiac Disease (Autoimmune gluten intolerance)': 'Naturally gluten-free, provides essential nutrients often deficient in celiac patients.',
      'Gluten Sensitivity (Non-celiac)': 'Safe and nutritious meal option, free from gluten.',
      'Irritable Bowel Syndrome (IBS)': 'Prebiotic fiber supports gut health and is gentle on digestion.',
      "Crohn's Disease": 'Anti-inflammatory ingredients and easily digestible quinoa support gut healing.',
      'Ulcerative Colitis': 'Low-residue, anti-inflammatory ingredients support colon health.',
      'Lacto-Ovo Vegetarian': 'Contains no meat or fish, suitable for vegetarians.',
      'Strict Vegan': 'All ingredients are plant-based.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Hindu Vegetarian': 'Contains no animal flesh, suitable for Hindu vegetarians.',
      'Type 1 Diabetes (Insulin-dependent)': 'High fiber and low glycemic index help with blood sugar control.',
      'Type 2 Diabetes (Non-insulin dependent)': 'High fiber and low glycemic index support stable blood sugar.'
    },
    compatibleWith: [
      'Celiac Disease (Autoimmune gluten intolerance)',
      'Gluten Sensitivity (Non-celiac)',
      'Crohn\'s Disease',
      'Ulcerative Colitis',
      'Irritable Bowel Syndrome (IBS)',
      'Lacto-Ovo Vegetarian',
      'Strict Vegan',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Hindu Vegetarian',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)'
    ],
    incompatibleWith: [
      'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)'
    ]
  },
  {
    id: 'gi_003',
    name: 'Gentle Chicken and Rice Soup',
    description: 'Soothing chicken soup with easily digestible rice and vegetables for gut healing',
    ingredients: ['chicken breast', 'white rice', 'carrots', 'celery', 'ginger', 'turmeric', 'herbs', 'low-sodium broth'],
    instructions: 'Simmer chicken in low-sodium broth with ginger and turmeric. Add rice and vegetables. Cook until tender. Season with herbs.',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    nutrition: {
      calories: 280,
      protein: 25,
      carbs: 35,
      fats: 6,
      fiber: 3,
      sodium: 120
    },
    mealType: 'dinner',
    image: '🍲',
    medicalBenefits: {
      'Gastroesophageal Reflux Disease (GERD)': 'Low-fat, easily digestible ingredients reduce acid reflux and heartburn.',
      'Irritable Bowel Syndrome (IBS)': 'Gentle on the digestive system, anti-inflammatory ginger and turmeric soothe the gut.',
      "Crohn's Disease": 'Easily digestible protein and carbohydrates, soothing broth for inflamed intestines.',
      'Ulcerative Colitis': 'Low-fiber, anti-inflammatory ingredients suitable during flare-ups.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Type 1 Diabetes (Insulin-dependent)': 'Balanced protein and carbs help with blood sugar control.',
      'Type 2 Diabetes (Non-insulin dependent)': 'Low glycemic index and balanced macronutrients support stable blood sugar.',
      'Hypertension (High Blood Pressure)': 'Low sodium and high potassium support healthy blood pressure.'
    },
    compatibleWith: [
      'Gastroesophageal Reflux Disease (GERD)',
      'Irritable Bowel Syndrome (IBS)',
      'Crohn\'s Disease',
      'Ulcerative Colitis',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Hypertension (High Blood Pressure)'
    ],
    incompatibleWith: [
      'Strict Vegan',
      'Lacto-Ovo Vegetarian',
      'Pescatarian',
      'Hindu Vegetarian'
    ]
  }
]; 