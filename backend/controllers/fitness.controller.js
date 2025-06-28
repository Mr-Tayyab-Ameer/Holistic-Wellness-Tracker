import fitnessModel from "../models/fitness.model.js";
import UserModel from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";
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
      date: date || Date.now(),
    });

    await activity.save();

    // Fetch user to get email
    const user = await UserModel.findById(req.user._id);
    if (user && user.email) {
      const subject = "New Activity Plan Added";
      const message = `Hi ${user.name || 'there'}!\n\nYou have successfully added a new activity plan: "${activityType}". Keep up the great work!`;
      
      await sendMail({ email: user.email, subject, message });
    }

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
      throw new Error("Activity not found");
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // Fetch user before deleting activity
    const user = await UserModel.findById(req.user._id);

    await activity.deleteOne();

    // Send email if user email exists
    if (user && user.email) {
      const subject = "Activity Plan Deleted";
      const message = `Hi ${user.name || "there"},\n\nYour activity plan "${activity.activityType}" has been successfully deleted.`;

      await sendMail({ email: user.email, subject, message });
    }

    res.json({ message: "Activity plan deleted successfully" });
  } catch (err) {
    next(err);
  }
};