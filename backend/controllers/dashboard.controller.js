import Dashboard from "../models/dashboard.model.js";
import fitnessModel from "../models/fitness.model.js";
import nutritionModel from "../models/nutrition.model.js";
import stressModel from "../models/stress.model.js";

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const fitnessActivities = await fitnessModel.find({ user: userId });
    const nutritionRecords = await nutritionModel.find({ user: userId });
    const stressRecords = await stressModel.find({ user: userId });

    const totalCaloriesBurned = fitnessActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
    const averageCalories = nutritionRecords.length > 0 
  ? nutritionRecords.reduce((sum, record) => sum + record.calories, 0) / nutritionRecords.length
  : 0;
    const averageStressLevel = stressRecords.length > 0 
      ? stressRecords.reduce((sum, record) => sum + record.stressLevel, 0) / stressRecords.length
      : 0;

    res.json({
      totalFitnessActivities: fitnessActivities.length,
      totalCaloriesBurned,
      averageCalories,
      averageStressLevel,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
