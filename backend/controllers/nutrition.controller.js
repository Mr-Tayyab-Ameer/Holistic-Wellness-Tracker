import nutritionModel from "../models/nutrition.model.js";

export const getNutritionEntries = async (req, res, next) => {
  try {
    const entries = await nutritionModel.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

export const addNutritionEntry = async (req, res, next) => {
  try {
    const { foodItem, calories, protein, carbs, fats, mealType } = req.body;
    
    const entry = new nutritionModel({
      user: req.user._id,
      foodItem,
      calories,
      protein,
      carbs,
      fats,
      mealType,
      date: Date.now()
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

export const getNutritionSummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entries = await nutritionModel.find({ 
      user: req.user._id,
      date: { $gte: today }
    });

    const summary = entries.reduce((acc, entry) => {
      acc.calories += entry.calories || 0;
      acc.protein += entry.protein || 0;
      acc.carbs += entry.carbs || 0;
      acc.fats += entry.fats || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    res.json(summary);
  } catch (err) {
    next(err);
  }
};