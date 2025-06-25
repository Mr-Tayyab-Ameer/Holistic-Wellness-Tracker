import mongoose from 'mongoose';

const StressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stressLevel: { type: Number, required: true, min: 1, max: 10 },
  factors: [String],
  notes: String,
  copingStrategies: [String],
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Stress', StressSchema);