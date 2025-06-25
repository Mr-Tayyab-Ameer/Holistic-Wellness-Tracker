import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  healthData: {
    dietaryRestrictions: [String]
  },
  yourData: {
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    fitnessGoals: String,
  }
}, { timestamps: true });

// ✅ Check if model already exists to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
