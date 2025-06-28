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

  // Calculate BMI and Weight Management Plan
  const calculateBMI = async () => {
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
    
    let category, goal, message, recommendedGoalWeight;
    
    // Determine category and recommended goal weight
    if (bmi < 18.5) {
      category = 'Underweight';
      goal = 'Gain Weight';
      message = 'You are underweight. Focus on healthy weight gain.';
      // Calculate healthy weight range (BMI 18.5-24.9)
      const minHealthyWeight = 18.5 * (heightInMeters * heightInMeters);
      const maxHealthyWeight = 24.9 * (heightInMeters * heightInMeters);
      recommendedGoalWeight = Math.round((minHealthyWeight + maxHealthyWeight) / 2);
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal Weight';
      goal = 'Maintain Weight';
      message = 'You are at a healthy weight. Keep up the good work!';
      recommendedGoalWeight = Math.round(weightInKg);
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      goal = 'Lose Weight';
      message = 'You are overweight. Focus on healthy weight loss.';
      // Target BMI of 22 (middle of healthy range)
      recommendedGoalWeight = Math.round(22 * (heightInMeters * heightInMeters));
    } else {
      category = 'Obese';
      goal = 'Lose Weight';
      message = 'You are obese. Consult a healthcare provider for guidance.';
      // Target BMI of 22 (middle of healthy range)
      recommendedGoalWeight = Math.round(22 * (heightInMeters * heightInMeters));
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (bmiData.gender === 'male') {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * parseFloat(bmiData.age)) + 5;
    } else {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * parseFloat(bmiData.age)) - 161;
    }

    // Calculate maintenance calories based on activity level
    const maintenanceCalories = Math.round(bmr * activityMultipliers[bmiData.activityLevel]);

    // Calculate weight change timeline
    const currentWeight = weightInKg;
    const goalWeight = bmiData.goalWeight ? parseFloat(bmiData.goalWeight) : recommendedGoalWeight;
    const weightDifference = goalWeight - currentWeight;
    
    let timeline, weeklyChange, dailyTarget, goalType;
    
    if (Math.abs(weightDifference) < 1) {
      // Maintain weight
      timeline = 'Maintain current weight';
      weeklyChange = 0;
      dailyTarget = maintenanceCalories;
      goalType = 'maintain';
    } else if (weightDifference > 0) {
      // Gain weight (surplus of 500 calories = ~0.5kg/week)
      weeklyChange = 0.5;
      const weeksToGoal = Math.ceil(weightDifference / weeklyChange);
      timeline = `${weeksToGoal} weeks to reach ${goalWeight}kg`;
      dailyTarget = maintenanceCalories + 500; // 500 calorie surplus
      goalType = 'gain';
    } else {
      // Lose weight (deficit of 500 calories = ~0.5kg/week)
      weeklyChange = -0.5;
      const weeksToGoal = Math.ceil(Math.abs(weightDifference) / Math.abs(weeklyChange));
      timeline = `${weeksToGoal} weeks to reach ${goalWeight}kg`;
      dailyTarget = maintenanceCalories - 500; // 500 calorie deficit
      goalType = 'lose';
    }

    const result = {
      bmi,
      category,
      goal,
      message,
      bmr: Math.round(bmr),
      maintenanceCalories,
      dailyTarget,
      timeline,
      weeklyChange,
      recommendedGoalWeight,
      currentWeight,
      goalWeight,
      weightDifference: Math.abs(goalWeight - currentWeight)
    };

    setBmiResult(result);
    
    // Save to IndexedDB with updated bmiData including goalType
    try {
      const updatedBmiData = { ...bmiData, goalType: goalType };
      await bmiTrackingService.saveBMIData(updatedBmiData, heightImperial, result);
      setBmiData(updatedBmiData); // Update local state with goalType
      toast.success('BMI calculated and saved!');
    } catch (error) {
      console.error('Error saving BMI data:', error);
      toast.error('Failed to save BMI data');
    }
  };

  // Add daily calorie entry
  const addDailyEntry = async () => {
    if (!dailyCalories || !bmiResult) {
      toast.error('Please enter calories and calculate BMI first');
      return;
    }

    const entry = {
      date: selectedDate,
      target: bmiResult.dailyTarget,
      actual: parseInt(dailyCalories),
      status: getStatus(parseInt(dailyCalories), bmiResult.dailyTarget)
    };

    try {
      // Save to IndexedDB
      await bmiTrackingService.updateDailyEntry(
        selectedDate,
        bmiResult.dailyTarget,
        parseInt(dailyCalories),
        entry.status
      );

      // Update local state
      const updatedEntries = await bmiTrackingService.getDailyEntries();
      setDailyEntries(updatedEntries);
      setDailyCalories('');
      toast.success('Daily entry added and saved!');
    } catch (error) {
      console.error('Error saving daily entry:', error);
      toast.error('Failed to save daily entry');
    }
  };

  // Get status for daily entry
  const getStatus = (actual, target) => {
    const difference = Math.abs(actual - target);
    const percentage = (difference / target) * 100;
    
    if (percentage <= 5) return 'Perfect';
    if (percentage <= 15) return actual > target ? 'Slightly Over' : 'Slightly Under';
    return actual > target ? 'Over' : 'Under';
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
    const percentage = Math.min((actual / target) * 100, 100);
    const filledBars = Math.floor(percentage / 10);
    const emptyBars = 10 - filledBars;
    
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
    
    if (bmiData.goalWeight && bmiData.weight && bmiData.goalType) {
      const currentWeight = parseFloat(bmiData.weight);
      const goalWeight = parseFloat(bmiData.goalWeight);
      const weightDifference = Math.abs(currentWeight - goalWeight);
      
      if (weightDifference > 0) {
        // Calculate total weeks in the plan based on weekly target
        const weeklyTarget = bmiData.goalType === 'gain' ? 0.5 : -0.5; // Default weekly target
        totalWeeks = Math.ceil(weightDifference / Math.abs(weeklyTarget));
        
        // Calculate weeks completed based on total days tracked
        const totalDaysTracked = dailyEntries.length;
        weeksCompleted = Math.floor(totalDaysTracked / 7);
        
        // Calculate timeline progress percentage
        timelineProgressPercentage = Math.min((weeksCompleted / totalWeeks) * 100, 100);
        
        // Calculate weeks remaining
        weeksRemaining = Math.max(0, totalWeeks - weeksCompleted);
        
        // Calculate success rate based on goal type (for calorie adherence)
        if (bmiData.goalType === 'gain') {
          // For weight gain: success is being in calorie surplus
          onTargetDays = recentEntries.filter(entry => entry.actual > entry.target).length;
          overTargetDays = recentEntries.filter(entry => entry.actual > entry.target + 200).length;
          underTargetDays = recentEntries.filter(entry => entry.actual <= entry.target).length;
          
          if (expectedWeightChange > 0) {
            progressMessage = `Great progress! You're ${expectedWeightChange.toFixed(2)} kg closer to your goal weight. ${weeksRemaining} weeks remaining at this rate.`;
          } else if (expectedWeightChange < 0) {
            progressMessage = `This week you're moving away from your goal. You need to increase your calorie intake to reach your target weight.`;
          } else {
            progressMessage = `You're maintaining your weight this week. You need to eat more calories to gain weight.`;
          }
        } else if (bmiData.goalType === 'lose') {
          // For weight loss: success is being in calorie deficit
          onTargetDays = recentEntries.filter(entry => entry.actual < entry.target).length;
          overTargetDays = recentEntries.filter(entry => entry.actual < entry.target - 200).length;
          underTargetDays = recentEntries.filter(entry => entry.actual >= entry.target).length;
          
          if (expectedWeightChange < 0) {
            progressMessage = `Great progress! You're ${Math.abs(expectedWeightChange).toFixed(2)} kg closer to your goal weight. ${weeksRemaining} weeks remaining at this rate.`;
          } else if (expectedWeightChange > 0) {
            progressMessage = `This week you're moving away from your goal. You need to reduce your calorie intake to reach your target weight.`;
          } else {
            progressMessage = `You're maintaining your weight this week. You need to eat fewer calories to lose weight.`;
          }
        }
        
        // Use timeline progress as the main success rate
        successRate = Math.round(timelineProgressPercentage);
      } else {
        // No weight difference, fall back to original calculation
        onTargetDays = recentEntries.filter(entry => entry.status === 'Perfect').length;
        overTargetDays = recentEntries.filter(entry => entry.status.includes('Over')).length;
        underTargetDays = recentEntries.filter(entry => entry.status.includes('Under')).length;
        successRate = Math.round((onTargetDays / totalDays) * 100);
        progressMessage = `You're maintaining your weight this week.`;
      }
    } else {
      // Fallback to original calculation if no goal set
      onTargetDays = recentEntries.filter(entry => entry.status === 'Perfect').length;
      overTargetDays = recentEntries.filter(entry => entry.status.includes('Over')).length;
      underTargetDays = recentEntries.filter(entry => entry.status.includes('Under')).length;
      successRate = Math.round((onTargetDays / totalDays) * 100);
      progressMessage = `You're maintaining your weight this week.`;
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
                onChange={(e) => setBmiData({...bmiData, height: e.target.value === '' ? '' : parseFloat(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="170"
            />
          </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feet</label>
            <input
              type="number"
                  value={heightImperial.feet}
                  onChange={(e) => setHeightImperial({...heightImperial, feet: e.target.value})}
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
                  onChange={(e) => setHeightImperial({...heightImperial, inches: e.target.value})}
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
              onChange={(e) => setBmiData({...bmiData, weight: e.target.value === '' ? '' : parseFloat(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={bmiData.weightUnit === 'kg' ? '70' : '154'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Weight ({bmiData.weightUnit === 'kg' ? 'kg' : 'lbs'})</label>
            <input
              type="number"
              value={bmiData.goalWeight || ''}
              onChange={(e) => setBmiData({...bmiData, goalWeight: e.target.value === '' ? '' : parseFloat(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={bmiData.weightUnit === 'kg' ? '65' : '143'}
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
              onChange={(e) => setBmiData({...bmiData, age: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="25"
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
                {bmiResult.recommendedGoalWeight} kg
              </div>
              <div className="text-sm text-purple-600">
                Goal Weight
              </div>
            </div>
          </div>
          {/* Weight Management Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-medium">{bmiResult.goal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight to {bmiResult.goal === 'Gain Weight' ? 'gain' : bmiResult.goal === 'Lose Weight' ? 'lose' : 'maintain'}:</span>
                  <span className="font-medium">{bmiResult.weightDifference} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly target:</span>
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
              <h3 className="text-lg font-semibold mb-3">Calorie Targets</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-600">BMR (Basal Metabolic Rate)</div>
                  <div className="text-lg font-bold text-blue-800">{bmiResult.bmr} cal/day</div>
                  <div className="text-xs text-blue-600">Calories burned at rest</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Maintenance Calories</div>
                  <div className="text-xl font-bold text-gray-800">{bmiResult.maintenanceCalories} cal/day</div>
                  <div className="text-xs text-gray-600">BMR × Activity Level</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-sm text-green-600">Daily Target</div>
                  <div className="text-xl font-bold text-green-800">{bmiResult.dailyTarget} cal/day</div>
                  <div className="text-xs text-green-600">Adjusted for weight goal</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">
              <strong>Medical Guidelines:</strong> This plan follows evidence-based nutrition science. 
              {bmiResult.goal === 'Gain Weight' ? ' Safe weight gain is 0.25-0.5 kg per week.' : 
               bmiResult.goal === 'Lose Weight' ? ' Safe weight loss is 0.5-1 kg per week.' : 
               ' Maintain your current healthy weight.'}
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
              <h2 className="text-xl font-semibold mb-4">Weekly Progress ({weeklyStats.weekStart} - {weeklyStats.weekEnd})</h2>

              {/* Success Rate and Progress Message */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {weeklyStats.totalWeeks > 0 ? `${weeklyStats.progressPercentage}%` : `${weeklyStats.successRate}%`}
                  </div>
                  <div className="text-gray-600">
                    {weeklyStats.totalWeeks > 0 ? 
                      `Timeline Progress (${weeklyStats.weeksCompleted}/${weeklyStats.totalWeeks} weeks)` : 
                      'Weekly Success Rate'
                    }
                  </div>
                  {weeklyStats.progressMessage && (
                    <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border">
                      {weeklyStats.progressMessage}
                    </div>
                  )}
                  {weeklyStats.totalWeeks > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-1">Overall plan progress:</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${weeklyStats.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {weeklyStats.weeksCompleted} of {weeklyStats.totalWeeks} weeks completed ({weeklyStats.weeksRemaining} weeks remaining)
                      </div>
                    </div>
                  )}
                  {weeklyStats.progressPercentage > 0 && weeklyStats.totalWeeks === 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-1">Progress toward goal this week:</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${weeklyStats.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {weeklyStats.progressPercentage}% of weekly goal achieved
                      </div>
                    </div>
                  )}
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
