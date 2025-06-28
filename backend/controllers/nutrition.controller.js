import nutritionModel, { BMIWeightManagement } from "../models/nutrition.model.js";

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

// BMI Weight Management Controllers
export const getBMIWeightManagement = async (req, res, next) => {
  try {
    let bmiData = await BMIWeightManagement.findOne({ user: req.user._id });
    
    if (!bmiData) {
      return res.json({
        bmiData: null,
        heightImperial: null,
        bmiResult: null,
        dailyEntries: []
      });
    }
    
    res.json(bmiData);
  } catch (err) {
    next(err);
  }
};

export const saveBMIWeightManagement = async (req, res, next) => {
  try {
    const { bmiData, heightImperial, bmiResult, dailyEntries } = req.body;
    
    let existingData = await BMIWeightManagement.findOne({ user: req.user._id });
    
    if (existingData) {
      // Update existing data
      existingData.bmiData = bmiData;
      existingData.heightImperial = heightImperial;
      existingData.bmiResult = bmiResult;
      existingData.dailyEntries = dailyEntries;
      await existingData.save();
      res.json(existingData);
    } else {
      // Create new data
      const newData = new BMIWeightManagement({
        user: req.user._id,
        bmiData,
        heightImperial,
        bmiResult,
        dailyEntries
      });
      await newData.save();
      res.status(201).json(newData);
    }
  } catch (err) {
    next(err);
  }
};

export const addDailyCalorieEntry = async (req, res, next) => {
  try {
    const { date, target, actual, status } = req.body;
    
    let bmiData = await BMIWeightManagement.findOne({ user: req.user._id });
    
    if (!bmiData) {
      return res.status(404).json({ message: 'BMI data not found. Please calculate BMI first.' });
    }
    
    // Remove existing entry for the same date if exists
    bmiData.dailyEntries = bmiData.dailyEntries.filter(entry => 
      new Date(entry.date).toDateString() !== new Date(date).toDateString()
    );
    
    // Add new entry
    bmiData.dailyEntries.push({
      date: new Date(date),
      target,
      actual,
      status
    });
    
    await bmiData.save();
    res.json(bmiData);
  } catch (err) {
    next(err);
  }
};

export const getDailyCalorieEntries = async (req, res, next) => {
  try {
    const bmiData = await BMIWeightManagement.findOne({ user: req.user._id });
    
    if (!bmiData) {
      return res.json({ dailyEntries: [] });
    }
    
    res.json({ dailyEntries: bmiData.dailyEntries });
  } catch (err) {
    next(err);
  }
};