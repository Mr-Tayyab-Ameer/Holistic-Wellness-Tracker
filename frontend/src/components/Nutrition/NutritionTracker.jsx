import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { recipeService } from '../../utils/recipeService';
import { bmiTrackingService } from '../../utils/bmiTrackingService';

export default function NutritionTracker() {
  const { backendUrl } = useContext(AppContext);
  const [meals, setMeals] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  
  // BMI Calculator State
  const [bmiData, setBmiData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    heightUnit: 'cm',
    weightUnit: 'kg',
    goalWeight: '', // Target weight in kg
    goalType: '' // 'gain', 'lose', 'maintain'
  });
  
  // Feet/Inches state for imperial units
  const [heightImperial, setHeightImperial] = useState({
    feet: '',
    inches: ''
  });
  
  // BMI Results
  const [bmiResult, setBmiResult] = useState(null);
  
  // Daily Tracking
  const [dailyCalories, setDailyCalories] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyEntries, setDailyEntries] = useState([]);
  
  // Monthly Progress
  const [monthlyData, setMonthlyData] = useState([]);
  
  const token = localStorage.getItem('token');

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    veryActive: 1.9      // Very hard exercise, physical job
  };

  // Activity level descriptions
  const activityDescriptions = {
    sedentary: 'Little or no exercise',
    light: 'Light exercise 1-3 days/week',
    moderate: 'Moderate exercise 3-5 days/week',
    active: 'Hard exercise 6-7 days/week',
    veryActive: 'Very hard exercise, physical job'
  };

  useEffect(() => {
    const fetchDietaryRestrictions = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/auth/profile', {
          headers: { token }
        });
        const restrictions = res.data?.userData?.healthData?.dietaryRestrictions || [];
        setDietaryRestrictions(restrictions);
      } catch (error) {
        console.error('Error fetching dietary restrictions:', error);
        setDietaryRestrictions([]);
      }
    };
    fetchDietaryRestrictions();
  }, [backendUrl, token]);

  // Load BMI weight management data from IndexedDB
  useEffect(() => {
    const loadBMIWeightManagementData = async () => {
      try {
        const bmiData = await bmiTrackingService.getBMIData();
        const dailyEntries = await bmiTrackingService.getDailyEntries();
        
        if (bmiData) {
          setBmiData(bmiData.bmiData);
          setHeightImperial(bmiData.heightImperial || { feet: '', inches: '' });
          setBmiResult(bmiData.bmiResult);
        }
        
        if (dailyEntries) {
          setDailyEntries(dailyEntries);
        }
      } catch (error) {
        console.error('Error loading BMI weight management data:', error);
      }
    };
    
    loadBMIWeightManagementData();
  }, []);

  useEffect(() => {
    const initializeAndFilterRecipes = async () => {
      try {
        setLoadingRecipes(true);
        await recipeService.initializeRecipes();
        
        if (dietaryRestrictions && dietaryRestrictions.length > 0) {
          const filtered = await recipeService.filterRecipesByRestrictions(dietaryRestrictions);
          setFilteredRecipes(filtered);
        } else {
          setFilteredRecipes([]);
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoadingRecipes(false);
      }
    };

    initializeAndFilterRecipes();
  }, [dietaryRestrictions]);

  // Enhanced Weight Management Strategy
  const calculateWeightLossStrategy = (bmiData, weightInKg, heightInMeters) => {
    // Comprehensive weight management calculation
    const calculateHealthyWeightRange = () => {
      // Advanced weight calculation considering multiple health factors
      const calculateBaseWeight = () => {
        // Muscle-based ideal weight calculation
        const muscleIndexFactors = {
          male: {
            light: 0.8,
            moderate: 1,
            heavy: 1.2
          },
          female: {
            light: 0.7,
            moderate: 1,
            heavy: 1.1
          }
        };

        // Muscle mass potential based on age and gender
        const ageMuscleFactors = {
          male: {
            young: 1.1,   // 18-30
            middle: 1,    // 31-45
            mature: 0.9   // 46+
          },
          female: {
            young: 1.05,  // 18-30
            middle: 1,    // 31-45
            mature: 0.95  // 46+
          }
        };

        // Determine age category
        let ageCategory = 'middle';
        if (bmiData.age < 30) ageCategory = 'young';
        else if (bmiData.age > 45) ageCategory = 'mature';

        // Base calculations using height-based formulas
        const baseWeight = {
          male: {
            light: 50 + (2.3 * ((heightInMeters * 100 / 2.54) - 60)),
            moderate: 55 + (2.3 * ((heightInMeters * 100 / 2.54) - 60)),
            heavy: 60 + (2.3 * ((heightInMeters * 100 / 2.54) - 60))
          },
          female: {
            light: 45 + (2.3 * ((heightInMeters * 100 / 2.54) - 60)),
            moderate: 50 + (2.3 * ((heightInMeters * 100 / 2.54) - 60)),
            heavy: 55 + (2.3 * ((heightInMeters * 100 / 2.54) - 60))
          }
        };

        // Muscle mass potential
        const muscleIndex = bmiData.muscleIndex || 'moderate';
        const muscleAdjustment = muscleIndexFactors[bmiData.gender][muscleIndex];
        const ageAdjustment = ageMuscleFactors[bmiData.gender][ageCategory];

        // Activity level impact
        const activityAdjustmentFactors = {
          sedentary: 0.9,
          light: 0.95,
          moderate: 1,
          active: 1.05,
          veryActive: 1.1
        };
        const activityAdjustment = activityAdjustmentFactors[bmiData.activityLevel];

        // Calculate adjusted ideal weight
        const adjustedIdealWeight = Math.round(
          baseWeight[bmiData.gender][muscleIndex] * 
          muscleAdjustment * 
          ageAdjustment * 
          activityAdjustment
        );

        // Define healthy weight ranges with more nuanced approach
        const minHealthyWeight = Math.round(adjustedIdealWeight * 0.9);
        const maxHealthyWeight = Math.round(adjustedIdealWeight * 1.1);

        return {
          idealWeight: adjustedIdealWeight,
          minHealthyWeight,
          maxHealthyWeight
        };
      };

      // Calculate personalized weight recommendations
      return calculateBaseWeight();
    };

    // Calculate personalized weight recommendations
    const weightRecommendations = calculateHealthyWeightRange();
    
    // Determine goal weight with more sophisticated logic
    const goalWeight = bmiData.goalWeight 
      ? parseFloat(bmiData.goalWeight) 
      : weightRecommendations.idealWeight;

    // Calculate weight change projection
    const currentWeight = weightInKg;
    const weightDifference = goalWeight - currentWeight;

    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = bmiData.gender === 'male'
      ? (10 * weightInKg) + (6.25 * (heightInMeters * 100)) - (5 * bmiData.age) + 5
      : (10 * weightInKg) + (6.25 * (heightInMeters * 100)) - (5 * bmiData.age) - 161;

    // Activity-based maintenance calories
    const maintenanceCalories = Math.round(
      bmr * activityMultipliers[bmiData.activityLevel]
    );

    // Medically correct daily target calculation
    let dailyTarget;
    if (weightDifference > 0) { // weight gain
      dailyTarget = Math.round(maintenanceCalories + 500);
    } else if (weightDifference < 0) { // weight loss
      dailyTarget = Math.round(maintenanceCalories - 500);
    } else { // maintenance
      dailyTarget = maintenanceCalories;
    }

    // Weight gain/loss projection
    const weightChangeProjection = {
      weeklyCalorieSurplus: 0,
      expectedWeightChangePerWeek: 0,
      timeToGoal: null
    };

    // Calculate time to goal weight
    if (Math.abs(weightDifference) > 0) {
      weightChangeProjection.timeToGoal = Math.ceil(
        Math.abs(weightDifference) / Math.abs(weightChangeProjection.expectedWeightChangePerWeek)
      );
    }

    return {
      bmr: Math.round(bmr),
      maintenanceCalories: maintenanceCalories,
      dailyTarget: dailyTarget,
      goalType: weightDifference > 0 ? 'gain' : (weightDifference < 0 ? 'lose' : 'maintain'),
      currentWeight,
      goalWeight,
      weightToLose: Math.round(Math.abs(weightDifference) * 10) / 10,
      weightDifference: Math.abs(Math.round(weightDifference * 10) / 10),
      weeklyChange: 0,
      timeline: weightChangeProjection.timeToGoal 
        ? `${weightChangeProjection.timeToGoal} weeks` 
        : 'Maintain current weight',
      
      // Detailed weight range guidance
      minHealthyWeight: weightRecommendations.minHealthyWeight,
      maxHealthyWeight: weightRecommendations.maxHealthyWeight,
      recommendedGoalWeight: weightRecommendations.idealWeight
    };
  };

  // Comprehensive Status Determination
  const determineNutritionStatus = (actual, target, goalType = 'lose') => {
    const difference = actual - target;
    const percentageDifference = Math.abs(difference / target) * 100;

    // Logging for debugging
    console.log('Status Calculation:', {
      actual,
      target,
      difference,
      percentageDifference,
      goalType
    });

    // Weight Loss Goal Specific Logic
    if (goalType === 'lose') {
      // Exact match or within 5% is Perfect
      if (Math.abs(difference) <= (target * 0.05)) return 'Perfect';
      
      // Slightly over/under within 15%
      if (percentageDifference <= 15) {
        return difference > 0 ? 'Slightly Over' : 'Slightly Under';
      }
      
      // Significant deviation
      return difference > 0 ? 'Over' : 'Under';
    }

    // Weight Gain or Maintenance Goals
    if (goalType === 'gain') {
      // Exact match or within 5% is Perfect
      if (Math.abs(difference) <= (target * 0.05)) return 'Perfect';
      
      // Slightly over/under within 15%
      if (percentageDifference <= 15) {
        return difference < 0 ? 'Slightly Under' : 'Slightly Over';
      }
      
      // Significant deviation
      return difference < 0 ? 'Under' : 'Over';
    }

    // Default maintenance logic
    return Math.abs(difference) <= (target * 0.05) ? 'Perfect' : 'Deviation';
  };

  // Modify calculateBMI to use new weight loss strategy
  const calculateBMI = async () => {
    try {
      // Debug logging
      console.log('BMI Calculation Started', {
        bmiData,
        heightImperial,
        height: bmiData.height,
        weight: bmiData.weight,
        age: bmiData.age
      });

      // Additional input validations
      if (bmiData.height && parseFloat(bmiData.height) <= 0) {
        toast.error('Height must be a positive number');
        return;
      }

      if (bmiData.weight && parseFloat(bmiData.weight) <= 0) {
        toast.error('Weight must be a positive number');
        return;
      }

      if (bmiData.age && (parseFloat(bmiData.age) < 1 || parseFloat(bmiData.age) > 120)) {
        toast.error('Age must be between 1 and 120');
        return;
      }

    let heightInCm;
    let weightInKg;
    
    // Convert height to centimeters based on unit
    if (bmiData.heightUnit === 'cm') {
      if (!bmiData.height || !bmiData.weight || isNaN(bmiData.height) || isNaN(bmiData.weight)) {
        toast.error('Please enter valid height and weight values');
        return;
      }
      heightInCm = parseFloat(bmiData.height);
    } else {
      // Imperial units (feet/inches)
      if (!heightImperial.feet || !heightImperial.inches || !bmiData.weight || 
          isNaN(heightImperial.feet) || isNaN(heightImperial.inches) || isNaN(bmiData.weight)) {
        toast.error('Please enter valid height (feet and inches) and weight values');
        return;
      }
      // Convert feet and inches to centimeters
      heightInCm = (parseInt(heightImperial.feet) * 30.48) + (parseInt(heightImperial.inches) * 2.54);
        console.log('Imperial Height Conversion', { 
          feet: heightImperial.feet, 
          inches: heightImperial.inches, 
          heightInCm 
        });
    }

    // Convert weight to kilograms based on unit
    if (bmiData.weightUnit === 'kg') {
      weightInKg = parseFloat(bmiData.weight);
    } else {
      // Convert pounds to kilograms
      weightInKg = parseFloat(bmiData.weight) * 0.453592;
    }

    // Validate age
    if (!bmiData.age || isNaN(bmiData.age)) {
      toast.error('Please enter a valid age');
      return;
    }

    const heightInMeters = heightInCm / 100; // Convert cm to meters
    const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    
      console.log('BMI Calculation Details', {
        heightInCm,
        weightInKg,
        heightInMeters,
        bmi
      });

      // Use new weight loss strategy calculation
      const weightLossStrategy = calculateWeightLossStrategy(
        bmiData, 
        weightInKg, 
        heightInMeters
      );

      // Combine with existing BMI result
      const completeResult = {
        bmi: parseFloat(bmi),
        category: bmi < 18.5 ? 'Underweight' :
                  bmi < 25 ? 'Normal Weight' :
                  bmi < 30 ? 'Overweight' : 'Obese',
        goal: weightLossStrategy.goalType,
        message: weightLossStrategy.goalType === 'lose' 
          ? 'Focus on healthy, sustainable weight loss' 
          : 'Maintain your current health status',
        ...weightLossStrategy
      };

      // Ensure all required properties exist with default values
      const safeResult = {
        bmr: completeResult.bmr || 0,
        maintenanceCalories: completeResult.maintenanceCalories || 0,
        dailyTarget: completeResult.dailyTarget || 0,
        currentWeight: completeResult.currentWeight || 0,
        goalWeight: completeResult.goalWeight || 0,
        weightDifference: completeResult.weightDifference || 0,
        weeklyChange: completeResult.weeklyChange || 0,
        timeline: completeResult.timeline || 'No timeline available',
        ...completeResult
      };

      setBmiResult(safeResult);
      
      // Save to tracking service
      await bmiTrackingService.saveBMIData(
        bmiData, 
        heightImperial, 
        safeResult
      );

      return safeResult;
    } catch (error) {
      console.error('BMI Calculation Error:', error);
      toast.error('Failed to calculate BMI. Please check your inputs.');
      
      // Set a default/fallback result to prevent rendering errors
      const fallbackResult = {
        bmi: 0,
        category: 'Unknown',
        goal: 'maintain',
        message: 'Unable to calculate BMI',
        bmr: 0,
        maintenanceCalories: 0,
        dailyTarget: 0,
        currentWeight: 0,
        goalWeight: 0,
        weightDifference: 0,
        weeklyChange: 0,
        timeline: 'No timeline available'
      };
      
      setBmiResult(fallbackResult);
      return fallbackResult;
    }
  };

  // Update addDailyEntry to use new status determination
  const addDailyEntry = async () => {
    if (!bmiResult) {
      toast.error('Please calculate BMI first');
      return;
    }

    const actualCalories = parseInt(dailyCalories);
    if (isNaN(actualCalories)) {
      toast.error('Please enter a valid calorie intake');
      return;
    }

    const entry = {
      date: selectedDate,
      target: bmiResult.dailyTarget,
      actual: actualCalories,
      status: determineNutritionStatus(
        actualCalories, 
        bmiResult.dailyTarget, 
        bmiResult.goalType
      )
    };

    try {
      await bmiTrackingService.updateDailyEntry(
        selectedDate,
        bmiResult.dailyTarget,
        actualCalories,
        entry.status
      );

      const updatedEntries = await bmiTrackingService.getDailyEntries();
      setDailyEntries(updatedEntries);
      setDailyCalories('');
      
      toast.success(`Entry logged: ${entry.status}`);
    } catch (error) {
      console.error('Error saving daily entry:', error);
      toast.error('Failed to save daily entry');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Perfect': return 'text-green-600';
      case 'Slightly Over':
      case 'Slightly Under': return 'text-yellow-600';
      case 'Over':
      case 'Under': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get status emoji
  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Perfect': return '✅';
      case 'Slightly Over':
      case 'Slightly Under': return '⚠️';
      case 'Over':
      case 'Under': return '❌';
      default: return '📊';
    }
  };

  // Calculate progress bar
  const getProgressBar = (actual, target) => {
    // Handle edge cases
    if (target <= 0 || actual < 0) {
      return '░'.repeat(10); // Empty progress bar
    }

    // Prevent division by zero
    if (target === 0) {
      return actual > 0 ? '█'.repeat(10) : '░'.repeat(10);
    }

    const percentage = Math.min(Math.max((actual / target) * 100, 0), 100);
    const filledBars = Math.floor(percentage / 10);
    const emptyBars = Math.max(10 - filledBars, 0);
    
    return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
  };

  // Get today's entry
  const getTodayEntry = () => {
    return dailyEntries.find(entry => entry.date === selectedDate);
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthEntries = dailyEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    if (monthEntries.length === 0) return null;

    const totalDays = monthEntries.length;
    const onTargetDays = monthEntries.filter(entry => entry.status === 'Perfect').length;
    const averageCalories = Math.round(monthEntries.reduce((sum, entry) => sum + entry.actual, 0) / totalDays);
    const overTargetDays = monthEntries.filter(entry => entry.status.includes('Over')).length;
    const underTargetDays = monthEntries.filter(entry => entry.status.includes('Under')).length;

    return {
      totalDays,
      onTargetDays,
      averageCalories,
      overTargetDays,
      underTargetDays,
      successRate: Math.round((onTargetDays / totalDays) * 100)
    };
  };

  // Calculate weekly stats (only when 7 days complete)
  const getWeeklyStats = () => {
    if (!dailyEntries.length) return null;

    // Sort entries by date to find the most recent entries
    const sortedEntries = [...dailyEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Only show weekly stats when we have exactly 7 days
    const recentEntries = sortedEntries.slice(0, 7);
    
    if (recentEntries.length < 7) {
      return {
        isComplete: false,
        daysCompleted: recentEntries.length,
        daysRemaining: 7 - recentEntries.length,
        message: `Track ${7 - recentEntries.length} more day${7 - recentEntries.length === 1 ? '' : 's'} to see your weekly progress!`
      };
    }

    const totalDays = recentEntries.length;
    const averageCalories = Math.round(recentEntries.reduce((sum, entry) => sum + entry.actual, 0) / totalDays);
    
    // Calculate weekly calorie surplus/deficit
    const totalCalories = recentEntries.reduce((sum, entry) => sum + entry.actual, 0);
    const totalTarget = recentEntries.reduce((sum, entry) => sum + entry.target, 0);
    const weeklyCalorieSurplus = totalCalories - totalTarget;
    
    // Calculate expected weight change for the week
    const expectedWeightChange = weeklyCalorieSurplus / 7700; // 7700 cal = 1 kg

    // Calculate timeline-based progress percentage
    let timelineProgressPercentage = 0;
    let weeksCompleted = 0;
    let totalWeeks = 0;
    let progressMessage = '';
    let weeksRemaining = 0;
    let onTargetDays = 0;
    let overTargetDays = 0;
    let underTargetDays = 0;
    let successRate = 0;
    
    // Retrieve total timeline from BMI calculation
    if (bmiResult && bmiResult.timeToGoal) {
      totalWeeks = parseInt(bmiResult.timeToGoal);
      
      // Calculate weeks completed based on total days tracked
      const totalDaysTracked = dailyEntries.length;
      weeksCompleted = Math.floor(totalDaysTracked / 7);
      
      // Calculate timeline progress percentage
      timelineProgressPercentage = Math.min((weeksCompleted / totalWeeks) * 100, 100);
      
      // Calculate weeks remaining
      weeksRemaining = Math.max(0, totalWeeks - weeksCompleted);
      
      // Determine progress message based on weight loss goal
      if (expectedWeightChange < 0) {
        progressMessage = `Great progress! You're ${Math.abs(expectedWeightChange).toFixed(2)} kg closer to your goal weight. ${weeksRemaining} weeks remaining at this rate.`;
      } else if (expectedWeightChange > 0) {
        progressMessage = `This week you're moving away from your goal. You need to adjust your calorie intake to reach your target weight.`;
      } else {
        progressMessage = `You're maintaining your current weight this week. Stay consistent with your plan.`;
      }
      
      // Calculate success rate based on calorie target adherence
      onTargetDays = recentEntries.filter(entry => 
        Math.abs(entry.actual - entry.target) <= (entry.target * 0.1)
      ).length;
      overTargetDays = recentEntries.filter(entry => entry.actual > entry.target * 1.1).length;
      underTargetDays = recentEntries.filter(entry => entry.actual < entry.target * 0.9).length;
      
      successRate = Math.round((onTargetDays / totalDays) * 100);
    }

    // Get date range for display
    const earliestDate = new Date(recentEntries[recentEntries.length - 1].date);
    const latestDate = new Date(recentEntries[0].date);

    return {
      isComplete: true,
      totalDays,
      onTargetDays,
      averageCalories,
      overTargetDays,
      underTargetDays,
      successRate,
      weeklyCalorieSurplus: Math.round(weeklyCalorieSurplus),
      expectedWeightChange: Math.round(expectedWeightChange * 1000) / 1000,
      weekStart: earliestDate.toLocaleDateString(),
      weekEnd: latestDate.toLocaleDateString(),
      progressMessage,
      progressPercentage: Math.round(timelineProgressPercentage),
      weeksRemaining,
      weeksCompleted,
      totalWeeks
    };
  };

  // Get weekly progress summary (flexible 7-day periods)
  const getWeeklyProgressSummary = () => {
    if (!dailyEntries.length) return [];

    const weeks = [];
    const sortedEntries = [...dailyEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Create 4 flexible 7-day periods from the earliest entries
    for (let i = 0; i < 4; i++) {
      const startIndex = i * 7;
      const endIndex = startIndex + 7;
      const weekEntries = sortedEntries.slice(startIndex, endIndex);

      if (weekEntries.length > 0) {
        const totalCalories = weekEntries.reduce((sum, entry) => sum + entry.actual, 0);
        const totalTarget = weekEntries.reduce((sum, entry) => sum + entry.target, 0);
        const weeklyCalorieSurplus = totalCalories - totalTarget;
        const expectedWeightChange = weeklyCalorieSurplus / 7700;

        // Get date range for this week
        const earliestDate = new Date(weekEntries[0].date);
        const latestDate = new Date(weekEntries[weekEntries.length - 1].date);

        weeks.push({
          weekNumber: i + 1,
          weekStart: earliestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weekEnd: latestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          daysTracked: weekEntries.length,
          averageCalories: Math.round(totalCalories / weekEntries.length),
          weeklyCalorieSurplus: Math.round(weeklyCalorieSurplus),
          expectedWeightChange: Math.round(expectedWeightChange * 1000) / 1000,
          onTargetDays: weekEntries.filter(entry => entry.status === 'Perfect').length,
          successRate: Math.round((weekEntries.filter(entry => entry.status === 'Perfect').length / weekEntries.length) * 100)
        });
      }
    }

    return weeks; // Return in chronological order (earliest first)
  };

  const monthlyStats = getMonthlyStats();
  const weeklyStats = getWeeklyStats();
  const weeklyProgress = getWeeklyProgressSummary();

  // Reset recipes function
  const handleResetRecipes = async () => {
    try {
      setLoadingRecipes(true);
      await recipeService.resetRecipes();
      if (dietaryRestrictions && dietaryRestrictions.length > 0) {
        const filtered = await recipeService.filterRecipesByRestrictions(dietaryRestrictions);
        setFilteredRecipes(filtered);
      }
      toast.success('Recipes updated successfully!');
    } catch (error) {
      console.error('Error resetting recipes:', error);
      toast.error('Failed to update recipes');
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Clear BMI tracking data (for testing/demo purposes)
  const handleClearBMIData = async () => {
    try {
      await bmiTrackingService.clearAllData();
      setBmiResult(null);
      setDailyEntries([]);
      setBmiData({
        height: '',
        weight: '',
        age: '',
        gender: 'male',
        activityLevel: 'moderate',
        heightUnit: 'cm',
        weightUnit: 'kg',
        goalWeight: '',
        goalType: ''
      });
      setHeightImperial({ feet: '', inches: '' });
      toast.success('BMI data cleared successfully!');
    } catch (error) {
      console.error('Error clearing BMI data:', error);
      toast.error('Failed to clear BMI data');
    }
  };

  // Get recipe benefits for selected restrictions
  const getRecipeBenefits = (recipe) => {
    if (!recipe.medicalBenefits || !dietaryRestrictions.length) return null;
    
    const relevantBenefits = [];
    dietaryRestrictions.forEach(restriction => {
      // Check for exact matches and aliases
      const matchingCondition = Object.keys(recipe.medicalBenefits).find(condition => {
        const conditionLower = condition.toLowerCase();
        const restrictionLower = restriction.toLowerCase();
        
        // Exact match
        if (conditionLower === restrictionLower) return true;
        
        // Alias matches
        if (restrictionLower.includes('diabetes') && conditionLower.includes('diabetes')) return true;
        if (restrictionLower.includes('celiac') && conditionLower.includes('celiac')) return true;
        if (restrictionLower.includes('hypertension') && conditionLower.includes('hypertension')) return true;
        if (restrictionLower.includes('cholesterol') && conditionLower.includes('cholesterol')) return true;
        if (restrictionLower.includes('vegan') && conditionLower.includes('vegan')) return true;
        
        return false;
      });
      
      if (matchingCondition && recipe.medicalBenefits[matchingCondition]) {
        relevantBenefits.push({
          condition: restriction,
          benefit: recipe.medicalBenefits[matchingCondition]
        });
      }
    });
    
    if (relevantBenefits.length === 0) return null;
    
    return (
      <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
        <div className="text-xs font-medium text-blue-800 mb-1">Medical Benefits:</div>
        {relevantBenefits.map((benefit, index) => (
          <div key={index} className="text-xs text-blue-700 mb-1">
            <span className="font-medium">{benefit.condition}:</span> {benefit.benefit}
          </div>
        ))}
      </div>
    );
  };

  const analyzeBMIProgress = (bmiData) => {
    const recommendations = {
      overweight: {
        primaryGoals: [
          'Gradual weight loss',
          'Improve diet quality',
          'Increase physical activity',
          'Regular health check-ups'
        ],
        healthRisks: [
          'Cardiovascular disease',
          'Type 2 diabetes',
          'Hypertension',
          'Joint problems'
        ],
        trackingMetrics: [
          'Weight',
          'Waist circumference',
          'Body fat percentage',
          'Blood pressure',
          'Cholesterol levels'
        ]
      }
    };

    const generatePersonalizedPlan = (bmiData) => ({
      weightLossStrategy: {
        method: 'Calorie deficit',
        safeDeficit: '500 calories/day',
        expectedWeightLoss: '0.5 kg/week'
      },
      fitnessRecommendations: {
        cardio: '150 minutes/week',
        strengthTraining: '2-3 sessions/week',
        flexibilityExercises: 'Daily stretching'
      },
      nutritionGuidelines: {
        macroBalance: {
          protein: '20-30%',
          carbs: '45-55%',
          fats: '20-30%'
        },
        foodFocus: [
          'Whole grains',
          'Lean proteins',
          'Fruits and vegetables',
          'Limit processed foods'
        ]
      }
    });

    const assessBMIRisk = (bmi) => {
      if (bmi < 18.5) return 'Underweight';
      if (bmi >= 18.5 && bmi < 25) return 'Normal Weight';
      if (bmi >= 25 && bmi < 30) return 'Overweight';
      if (bmi >= 30 && bmi < 35) return 'Obese (Class I)';
      if (bmi >= 35 && bmi < 40) return 'Obese (Class II)';
      return 'Obese (Class III)';
    };

    const riskLevel = assessBMIRisk(bmiData.currentBMI);

    return {
      category: riskLevel,
      recommendations: recommendations[riskLevel.toLowerCase().split(' ')[0]] || recommendations.overweight,
      personalizedPlan: generatePersonalizedPlan(bmiData),
      riskAssessment: {
        currentBMI: bmiData.currentBMI,
        riskCategory: riskLevel,
        immediateActions: riskLevel !== 'Normal Weight' 
          ? ['Consult healthcare professional', 'Develop comprehensive wellness plan']
          : ['Maintain current healthy lifestyle']
      }
    };
  };

  return (
    <div className="mx-auto md:mx-60">
      <h1 className="text-3xl font-bold text-primary mb-4">BMI Weight Management Tool</h1>

      {/* BMI Calculator */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">BMI Calculator</h2>
        
        {/* Height Unit Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Height Unit</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="cm"
                checked={bmiData.heightUnit === 'cm'}
                onChange={(e) => setBmiData({...bmiData, heightUnit: e.target.value})}
                className="mr-2"
              />
              Centimeters (cm)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="ft"
                checked={bmiData.heightUnit === 'ft'}
                onChange={(e) => setBmiData({...bmiData, heightUnit: e.target.value})}
                className="mr-2"
              />
              Feet & Inches (ft/in)
            </label>
          </div>
        </div>
        
        {/* Weight Unit Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight Unit</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="kg"
                checked={bmiData.weightUnit === 'kg'}
                onChange={(e) => setBmiData({...bmiData, weightUnit: e.target.value})}
                className="mr-2"
              />
              Kilograms (kg)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="lbs"
                checked={bmiData.weightUnit === 'lbs'}
                onChange={(e) => setBmiData({...bmiData, weightUnit: e.target.value})}
                className="mr-2"
              />
              Pounds (lbs)
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height Input - Conditional based on unit */}
          {bmiData.heightUnit === 'cm' ? (
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
                type="number"
                value={bmiData.height || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value));
                  setBmiData({...bmiData, height: value});
                }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="170"
                min="0"
            />
          </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feet</label>
            <input
              type="number"
                  value={heightImperial.feet}
              onChange={(e) => setHeightImperial({...heightImperial, feet: Math.max(0, e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                  min="0"
                  max="8"
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inches</label>
            <input
              type="number"
                  value={heightImperial.inches}
              onChange={(e) => setHeightImperial({...heightImperial, inches: Math.max(0, e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8"
                  min="0"
                  max="11"
            />
          </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight ({bmiData.weightUnit === 'kg' ? 'kg' : 'lbs'})</label>
            <input
              type="number"
              value={bmiData.weight || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value));
                setBmiData({...bmiData, weight: value});
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={bmiData.weightUnit === 'kg' ? '70' : '154'}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Weight ({bmiData.weightUnit === 'kg' ? 'kg' : 'lbs'})</label>
            <input
              type="number"
              value={bmiData.goalWeight || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value));
                setBmiData({...bmiData, goalWeight: value});
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={bmiData.weightUnit === 'kg' ? '65' : '143'}
              min="0"
            />
            <div className="text-xs text-gray-500 mt-1">
              Leave empty to use recommended goal weight
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              value={bmiData.age}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value));
                setBmiData({...bmiData, age: value});
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="25"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={bmiData.gender}
              onChange={(e) => setBmiData({...bmiData, gender: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
            <select
              value={bmiData.activityLevel}
              onChange={(e) => setBmiData({...bmiData, activityLevel: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sedentary">Sedentary - Little or no exercise</option>
              <option value="light">Light - Exercise 1-3 days/week</option>
              <option value="moderate">Moderate - Exercise 3-5 days/week</option>
              <option value="active">Active - Exercise 6-7 days/week</option>
              <option value="veryActive">Very Active - Hard exercise, physical job</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="flex gap-2">
            <button
                onClick={calculateBMI}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
              >
                Calculate BMI & Daily Target
              </button>
              <button
                onClick={handleClearBMIData}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                title="Clear all BMI data (for testing)"
              >
                Clear Data
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* BMI Results */}
      {bmiResult && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Weight Management Plan</h2>
          {/* BMI and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-800 mb-1">
                BMI: {bmiResult.bmi}
              </div>
              <div className="text-sm text-blue-600">
                Category: {bmiResult.category}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800 mb-1">
                {bmiResult.currentWeight} kg
              </div>
              <div className="text-sm text-green-600">
                Current Weight
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-800 mb-1">
                {bmiResult.goalWeight} kg
              </div>
              <div className="text-sm text-purple-600">
                Goal Weight
              </div>
            </div>
          </div>
          {/* Weight Management Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Weight Management Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-medium capitalize">{bmiResult.goalType} Weight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight Difference:</span>
                  <span className="font-medium">{bmiResult.weightDifference} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Target:</span>
                  <span className="font-medium">{bmiResult.weeklyChange} kg/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{bmiResult.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activity Level:</span>
                  <span className="font-medium">{activityDescriptions[bmiData.activityLevel]}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Weight Range Guidance</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-600">Minimum Healthy Weight</div>
                  <div className="text-lg font-bold text-blue-800">{bmiResult.minHealthyWeight} kg</div>
                  <div className="text-xs text-blue-600">Based on personalized health factors</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-sm text-green-600">Maximum Healthy Weight</div>
                  <div className="text-lg font-bold text-green-800">{bmiResult.maxHealthyWeight} kg</div>
                  <div className="text-xs text-green-600">Based on personalized health factors</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-sm text-purple-600">Recommended Goal Weight</div>
                  <div className="text-lg font-bold text-purple-800">{bmiResult.recommendedGoalWeight} kg</div>
                  <div className="text-xs text-purple-600">Tailored to your unique profile</div>
                </div>
              </div>
            </div>
          </div>
          {/* Medical Guidelines for Weight Management */}
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">
              <strong>Medical Guidelines:</strong> 
              {bmiResult.goalType === 'gain' ? (
                <>
                  Safe weight gain focuses on lean muscle mass and healthy body composition:
                  <ul className="list-disc list-inside mt-2">
                    <li>Recommended gain: 0.25-0.5 kg per week</li>
                    <li>Prioritize nutrient-dense, protein-rich foods</li>
                    <li>Combine with strength training for muscle development</li>
                    <li>Avoid excessive fat accumulation</li>
                  </ul>
                  <div className="mt-2 font-semibold text-blue-700">
                    Consult a nutritionist or healthcare provider for personalized guidance.
                  </div>
                </>
              ) : bmiResult.goalType === 'lose' ? (
                ' Safe weight loss is 0.5-1 kg per week through balanced diet and exercise.'
              ) : (
                ' Maintain your current healthy weight through balanced nutrition and regular activity.'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calorie Targets Section */}
      {bmiResult && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Calorie Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-blue-600">BMR (Basal Metabolic Rate)</div>
              <div className="text-lg font-bold text-blue-800">
                {bmiResult.bmr || 0} cal/day
              </div>
              <div className="text-xs text-blue-600">Calories burned at rest</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm text-green-600">Maintenance Calories</div>
              <div className="text-xl font-bold text-green-800">
                {bmiResult.maintenanceCalories || 0} cal/day
              </div>
              <div className="text-xs text-green-600">BMR × Activity Level</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-sm text-purple-600">Daily Target</div>
              <div className="text-xl font-bold text-purple-800">
                {bmiResult.dailyTarget || 0} cal/day
              </div>
              <div className="text-xs text-purple-600">Adjusted for weight goal</div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Tracking */}
      {bmiResult && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Daily Calorie Tracking</h2>
          {/* Date Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Daily Entry Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories Eaten Today</label>
              <input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1800"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addDailyEntry}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
              >
                Add Entry
              </button>
            </div>
          </div>
          {/* Today's Progress */}
          {getTodayEntry() && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Today's Progress ({selectedDate})</h3>
              <div className="text-lg font-bold mb-2">
                {getTodayEntry().actual} / {getTodayEntry().target} calories
              </div>
              <div className="text-sm font-mono mb-2">
                {getProgressBar(getTodayEntry().actual, getTodayEntry().target)}
              </div>
              <div className={`font-medium ${getStatusColor(getTodayEntry().status)}`}> 
                {getStatusEmoji(getTodayEntry().status)} {getTodayEntry().status}
              </div>
              {getTodayEntry().actual < getTodayEntry().target && (
                <div className="text-sm text-gray-600 mt-1">
                  Need {getTodayEntry().target - getTodayEntry().actual} more calories
                </div>
              )}
              {getTodayEntry().actual > getTodayEntry().target && (
                <div className="text-sm text-gray-600 mt-1">
                  {getTodayEntry().actual - getTodayEntry().target} calories over target
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Weekly Progress */}
      {weeklyStats && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {!weeklyStats.isComplete ? (
            // Incomplete week - show progress toward 7 days
            <div>
              <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {weeklyStats.daysCompleted}/7
                </div>
                <div className="text-lg text-blue-800 mb-3">Days Tracked</div>
                <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(weeklyStats.daysCompleted / 7) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-blue-700 mb-2">
                  {weeklyStats.message}
                </div>
                <div className="text-xs text-blue-600">
                  Complete 7 days to see your weekly success rate and weight progress analysis
                </div>
              </div>
            </div>
          ) : (
            // Complete week - show full stats
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Weight Loss Timeline Progress ({weeklyStats.weekStart} - {weeklyStats.weekEnd})
              </h2>

              {/* Overall Timeline Progress */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {weeklyStats.progressPercentage}%
                  </div>
                  <div className="text-gray-600">
                    Overall Timeline Progress
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${weeklyStats.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {weeklyStats.weeksCompleted} of {weeklyStats.totalWeeks} weeks completed
                  </div>
                </div>

                {/* Detailed Timeline Information */}
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {weeklyStats.weeksCompleted}
                    </div>
                    <div className="text-xs text-gray-600">Weeks Completed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {weeklyStats.weeksRemaining}
                    </div>
                    <div className="text-xs text-gray-600">Weeks Remaining</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {weeklyStats.totalWeeks}
                    </div>
                    <div className="text-xs text-gray-600">Total Weeks</div>
                  </div>
                </div>

                {/* Progress Message */}
                {weeklyStats.progressMessage && (
                  <div className="text-sm text-gray-700 mt-4 p-3 bg-white rounded border">
                    {weeklyStats.progressMessage}
                  </div>
                )}
              </div>

              {/* Weekly Performance Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Weekly Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Calories:</span>
                      <span className="font-medium">{weeklyStats.averageCalories} cal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calorie Surplus/Deficit:</span>
                      <span className={`font-medium ${weeklyStats.weeklyCalorieSurplus > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {weeklyStats.weeklyCalorieSurplus > 0 ? '+' : ''}{weeklyStats.weeklyCalorieSurplus} cal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Weight Change:</span>
                      <span className={`font-medium ${weeklyStats.expectedWeightChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {weeklyStats.expectedWeightChange} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className={`font-medium ${weeklyStats.successRate >= 80 ? 'text-green-600' : weeklyStats.successRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {weeklyStats.successRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Weekly Tracking</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">On Target Days:</span>
                      <span className="font-medium text-green-600">{weeklyStats.onTargetDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Over Target Days:</span>
                      <span className="font-medium text-red-600">{weeklyStats.overTargetDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Under Target Days:</span>
                      <span className="font-medium text-yellow-600">{weeklyStats.underTargetDays}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Progress Summary */}
      {weeklyProgress.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Progress Summary</h2>
          <div className="space-y-3">
            {weeklyProgress.map((week, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">
                    Week {index + 1}: {week.weekStart} - {week.weekEnd}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    week.successRate >= 80 ? 'bg-green-100 text-green-800' :
                    week.successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {week.successRate}% Success
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Days:</span> {week.daysTracked}
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Calories:</span> {week.averageCalories}
                  </div>
                  <div>
                    <span className="text-gray-600">On Target:</span> {week.onTargetDays}/{week.daysTracked}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Recommendations - Keep as is */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recommended Recipes</h2>
          <button
            onClick={handleResetRecipes}
            className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition duration-200"
          >
            Update Recipes
          </button>
        </div>
        {/* Show selected conditions */}
        {dietaryRestrictions.length > 0 && (
          <div className="mb-4 text-primary font-semibold">
            Here are recipes for: {dietaryRestrictions.join(', ')}
          </div>
        )}
        {loadingRecipes ? (
          <div>Loading recipes...</div>
        ) : dietaryRestrictions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p className="text-lg mb-2">No dietary restrictions added yet</p>
            <p className="text-sm">Add dietary restrictions to your profile to see personalized recipe recommendations</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p className="text-lg mb-2">No recipes match your current dietary restrictions</p>
            <p className="text-sm">Try adding different restrictions or contact support for more recipe options</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Showing {filteredRecipes.length} recipe(s) compatible with your dietary restrictions
            </p>
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-2xl">{recipe.image} <span className="font-bold text-lg">{recipe.name}</span></div>
                <div className="text-gray-700 text-sm mb-1">{recipe.description}</div>
                <div className="text-xs text-gray-500 mb-1">Meal Type: {recipe.mealType}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} className="bg-primary text-white px-2 py-1 rounded">{ing}</span>
                  ))}
                </div>
                <div className="text-xs mt-2">Calories: {recipe.nutrition.calories} | Protein: {recipe.nutrition.protein}g | Carbs: {recipe.nutrition.carbs}g | Fats: {recipe.nutrition.fats}g</div>
                <div className="text-xs text-gray-400">Compatible with: {recipe.compatibleWith?.join(', ')}</div>
                {/* Show medical benefits for selected restrictions */}
                {getRecipeBenefits(recipe)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
