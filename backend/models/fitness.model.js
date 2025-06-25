import mongoose from 'mongoose';

const FitnessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Fitness', FitnessSchema);