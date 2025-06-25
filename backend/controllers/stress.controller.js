import stressModel from "../models/stress.model.js";


export const logStress = async (req, res, next) => {
  try {
    const { stressLevel, factors, notes, copingStrategies } = req.body;
    
    const entry = new stressModel({
      user: req.user._id,
      stressLevel,
      factors,
      notes,
      copingStrategies,
      date: Date.now()
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

export const getStressHistory = async (req, res, next) => {
  try {
    const entries = await stressModel.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    
    const avgStress = entries.reduce((sum, entry) => sum + entry.stressLevel, 0) / entries.length;
    
    res.json({
      entries,
      averageStress: avgStress.toFixed(1),
      totalEntries: entries.length
    });
  } catch (err) {
    next(err);
  }
};

export const getStressRecommendations = async (req, res, next) => {
  try {
    const entries = await stressModel.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    const avgStress = entries.reduce((sum, entry) => sum + entry.stressLevel, 0) / entries.length;
    
    let recommendations = [];
    
    if (avgStress > 7) {
      recommendations = [
        "Practice deep breathing exercises 3 times daily",
        "Consider scheduling a therapist appointment",
        "Reduce caffeine intake",
        "Prioritize 7-9 hours of sleep"
      ];
    } else if (avgStress > 5) {
      recommendations = [
        "Try a 10-minute meditation session",
        "Go for a 30-minute walk in nature",
        "Practice progressive muscle relaxation",
        "Journal about your stressors"
      ];
    } else {
      recommendations = [
        "Maintain your healthy habits",
        "Practice gratitude journaling",
        "Stay physically active",
        "Connect with friends and family"
      ];
    }

    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
};