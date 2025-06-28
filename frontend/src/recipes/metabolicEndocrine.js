// Metabolic & Endocrine Conditions recipes
// Includes: Type 1/2 Diabetes, Gestational Diabetes, Prediabetes, Hypoglycemia, Metabolic Syndrome
export const metabolicEndocrineRecipes = [
  {
    id: 'metab_001',
    name: 'Low-GI Steel-Cut Oatmeal with Berries',
    description: 'Steel-cut oats with antioxidant-rich berries and heart-healthy nuts for stable blood sugar',
    ingredients: ['steel-cut oats', 'blueberries', 'strawberries', 'almonds', 'cinnamon', 'stevia', 'unsweetened almond milk'],
    instructions: 'Cook steel-cut oats with unsweetened almond milk. Top with fresh berries, chopped almonds, and a sprinkle of cinnamon. Sweeten with stevia if needed.',
    prepTime: 5,
    cookTime: 20,
    servings: 2,
    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 35,
      fats: 14,
      fiber: 8,
      glycemicIndex: 30
    },
    mealType: 'breakfast',
    image: '🥣',
    medicalBenefits: {
      'Type 1 Diabetes (Insulin-dependent)': 'Low glycemic index (30), high fiber content slows glucose absorption',
      'Type 2 Diabetes (Non-insulin dependent)': 'Complex carbs with 8g fiber help stabilize blood sugar',
      'Gestational Diabetes': 'Nutrient-dense breakfast that prevents blood sugar spikes',
      'Prediabetes/Insulin Resistance': 'Cinnamon improves insulin sensitivity, fiber supports gut health',
      'Metabolic Syndrome': 'High fiber and healthy fats address multiple risk factors',
      'Lacto-Ovo Vegetarian': 'Contains no meat or fish, suitable for vegetarians and provides plant-based protein.',
      'Strict Vegan': 'All ingredients are plant-based, providing complete protein and essential nutrients for vegans.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free, safe for those with gluten sensitivity.',
      'Celiac Disease (Autoimmune gluten intolerance)': '100% gluten-free ingredients prevent autoimmune reactions and support gut healing.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.'
    },
    compatibleWith: [
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Gestational Diabetes',
      'Prediabetes/Insulin Resistance',
      'Metabolic Syndrome',
      'Lacto-Ovo Vegetarian',
      'Strict Vegan',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)'
    ],
    incompatibleWith: [
      'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)'
    ]
  },
  {
    id: 'metab_002',
    name: 'Grilled Salmon with Quinoa and Vegetables',
    description: 'Omega-3 rich salmon with protein-packed quinoa and non-starchy vegetables',
    ingredients: ['salmon fillet', 'quinoa', 'broccoli', 'asparagus', 'bell peppers', 'olive oil', 'lemon', 'garlic', 'herbs'],
    instructions: 'Grill salmon with herbs and lemon. Cook quinoa separately. Steam vegetables until tender-crisp. Serve with lemon-herb sauce.',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    nutrition: {
      calories: 420,
      protein: 38,
      carbs: 28,
      fats: 18,
      fiber: 6,
      glycemicIndex: 35
    },
    mealType: 'dinner',
    image: '🐟',
    medicalBenefits: {
      'Type 1 Diabetes (Insulin-dependent)': 'High protein (38g) helps maintain muscle mass and stabilizes blood sugar',
      'Type 2 Diabetes (Non-insulin dependent)': 'Omega-3s improve insulin sensitivity, low glycemic index',
      'Gestational Diabetes': 'Essential fatty acids support fetal brain development',
      'Prediabetes/Insulin Resistance': 'Protein and healthy fats prevent blood sugar spikes',
      'Metabolic Syndrome': 'Addresses multiple risk factors: inflammation, insulin resistance, blood pressure',
      'Pescatarian': 'Contains fish as the main protein source.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free, safe for those with gluten sensitivity.',
      'Celiac Disease (Autoimmune gluten intolerance)': 'Naturally gluten-free, safe for celiac disease.'
    },
    compatibleWith: [
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Gestational Diabetes',
      'Prediabetes/Insulin Resistance',
      'Metabolic Syndrome',
      'Pescatarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
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
    id: 'metab_003',
    name: 'Greek Yogurt Parfait with Low-GI Fruits',
    description: 'Protein-rich Greek yogurt with low-glycemic fruits and nuts for blood sugar control',
    ingredients: ['plain greek yogurt', 'raspberries', 'blackberries', 'almonds', 'chia seeds', 'cinnamon', 'stevia'],
    instructions: 'Layer unsweetened Greek yogurt with berries. Top with chopped almonds, chia seeds, and a sprinkle of cinnamon.',
    prepTime: 8,
    cookTime: 0,
    servings: 1,
    nutrition: {
      calories: 220,
      protein: 20,
      carbs: 18,
      fats: 10,
      fiber: 6,
      glycemicIndex: 25
    },
    mealType: 'snack',
    image: '🥣',
    medicalBenefits: {
      'Type 1 Diabetes (Insulin-dependent)': 'High protein (20g) prevents blood sugar spikes',
      'Type 2 Diabetes (Non-insulin dependent)': 'Low glycemic index (25), cinnamon improves insulin sensitivity',
      'Gestational Diabetes': 'Calcium and protein support pregnancy needs',
      'Prediabetes/Insulin Resistance': 'Probiotics support gut health and metabolism',
      'Hypoglycemia': 'Balanced macronutrients prevent blood sugar drops',
      'Metabolic Syndrome': 'High protein and fiber support metabolic health.',
      'Lacto-Ovo Vegetarian': 'Contains no meat or fish, suitable for vegetarians.',
      'Halal (Islamic dietary requirements)': 'Contains only halal ingredients.',
      'Kosher (Jewish dietary laws)': 'Contains only kosher ingredients.',
      'Gluten Sensitivity (Non-celiac)': 'Naturally gluten-free, safe for those with gluten sensitivity.',
      'Celiac Disease (Autoimmune gluten intolerance)': 'Naturally gluten-free, safe for celiac disease.'
    },
    compatibleWith: [
      'Type 1 Diabetes (Insulin-dependent)',
      'Type 2 Diabetes (Non-insulin dependent)',
      'Gestational Diabetes',
      'Prediabetes/Insulin Resistance',
      'Hypoglycemia',
      'Metabolic Syndrome',
      'Lacto-Ovo Vegetarian',
      'Halal (Islamic dietary requirements)',
      'Kosher (Jewish dietary laws)',
      'Gluten Sensitivity (Non-celiac)',
      'Celiac Disease (Autoimmune gluten intolerance)'
    ],
    incompatibleWith: [
      'Dairy/Milk Allergy',
      'Lactose Intolerance',
      'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)',
      'Strict Vegan',
      'Hindu Vegetarian'
    ]
  }
]; 