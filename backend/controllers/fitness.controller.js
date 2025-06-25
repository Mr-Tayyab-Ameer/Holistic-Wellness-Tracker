import fitnessModel from "../models/fitness.model.js";

export const getActivities = async (req, res, next) => {
  try {
    const activities = await fitnessModel.find({ user: req.user._id }).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

export const addActivity = async (req, res, next) => {
  try {
    const { activityType, duration, caloriesBurned, date } = req.body;
    
    const activity = new fitnessModel({
      user: req.user._id,
      activityType,
      duration,
      caloriesBurned,
      date: date || Date.now()
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await fitnessModel.findById(req.params.id);
    
    if (!activity) {
      res.status(404);
      throw new Error('Activity not found');
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (err) {
    next(err);
  }
};