import express from 'express';
import auth from '../middelwares/user.auth.js';
import { 
  addNutritionEntry, 
  getNutritionEntries, 
  getNutritionSummary,
  getBMIWeightManagement,
  saveBMIWeightManagement,
  addDailyCalorieEntry,
  getDailyCalorieEntries
} from '../controllers/nutrition.controller.js';

const nutritionRouter = express.Router();

nutritionRouter.route('/')
  .get(auth, getNutritionEntries)
  .post(auth, addNutritionEntry);

nutritionRouter.get('/summary', auth, getNutritionSummary);

// BMI Weight Management routes
nutritionRouter.get('/bmi-weight-management', auth, getBMIWeightManagement);
nutritionRouter.post('/bmi-weight-management', auth, saveBMIWeightManagement);
nutritionRouter.post('/daily-calorie-entry', auth, addDailyCalorieEntry);
nutritionRouter.get('/daily-calorie-entries', auth, getDailyCalorieEntries);

export default nutritionRouter;