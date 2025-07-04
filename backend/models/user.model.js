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
  },
  resetCode: { type: String }, // ✅ added for password reset
  resetCodeExpiry: { type: Date }, // ✅ added for expiration check
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
