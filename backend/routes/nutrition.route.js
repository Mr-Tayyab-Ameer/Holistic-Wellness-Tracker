import express from 'express';
import auth from '../middelwares/user.auth.js';
import { addNutritionEntry, getNutritionEntries, getNutritionSummary } from '../controllers/nutrition.controller.js';


const nutritionRouter = express.Router();

nutritionRouter.route('/')
  .get(auth, getNutritionEntries)
  .post(auth, addNutritionEntry);

  nutritionRouter.get('/summary', auth, getNutritionSummary);

export default nutritionRouter;