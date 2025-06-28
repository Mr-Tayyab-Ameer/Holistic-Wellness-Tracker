import mongoose from 'mongoose';

const NutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItem: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fats: { type: Number },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
  date: { type: Date, default: Date.now }
});

// BMI Weight Management Schema
const BMIWeightManagementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // BMI Data
  bmiData: {
    height: { type: Number },
    weight: { type: Number },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive'] },
    heightUnit: { type: String, enum: ['cm', 'ft'], default: 'cm' },
    weightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    goalWeight: { type: Number },
    goalType: { type: String, enum: ['gain', 'lose', 'maintain'] }
  },
  
  // Height in imperial units
  heightImperial: {
    feet: { type: Number },
    inches: { type: Number }
  },
  
  // BMI Results
  bmiResult: {
    bmi: { type: Number },
    category: { type: String },
    goal: { type: String },
    message: { type: String },
    dailyTarget: { type: Number },
    bmr: { type: Number },
    heightInCm: { type: Number },
    weightInKg: { type: Number },
    recommendedGoalWeight: { type: Number },
    currentWeight: { type: Number },
    weightDifference: { type: Number },
    weeklyWeightChange: { type: Number },
    timeline: { type: Number },
    maintenanceCalories: { type: Number },
    calorieAdjustment: { type: Number }
  },
  
  // Daily Calorie Entries
  dailyEntries: [{
    date: { type: Date, required: true },
    target: { type: Number, required: true },
    actual: { type: Number, required: true },
    status: { type: String, enum: ['Perfect', 'Slightly Over', 'Slightly Under', 'Over', 'Under'] }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
BMIWeightManagementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Nutrition', NutritionSchema);
export const BMIWeightManagement = mongoose.model('BMIWeightManagement', BMIWeightManagementSchema);