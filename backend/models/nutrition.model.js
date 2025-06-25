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

export default mongoose.model('Nutrition', NutritionSchema);