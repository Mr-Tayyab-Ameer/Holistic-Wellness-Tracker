import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fitnessActivities: [
    {
      date: { type: Date, },
      type: { type: String, },
      duration: { type: Number, },
    },
  ],
  nutrition: [
    {
      date: { type: Date, },
      calories: { type: Number, },
    },
  ],
  stressLevels: [
    {
      date: { type: Date, },
      level: { type: Number },
    },
  ],
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

export default Dashboard;
