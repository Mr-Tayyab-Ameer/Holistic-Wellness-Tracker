// controllers/user.controller.js

import userModel from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import sendMail from '../utils/sendMail.js';

const VALID_DIETARY_RESTRICTIONS = [
  'Type 1 Diabetes (Insulin-dependent)', 'Type 2 Diabetes (Non-insulin dependent)',
  'Gestational Diabetes', 'Prediabetes/Insulin Resistance', 'Hypoglycemia',
  'Metabolic Syndrome', 'Hypertension (High Blood Pressure)', 'Coronary Heart Disease',
  'High Cholesterol/Hyperlipidemia', 'Heart Failure', 'Celiac Disease (Autoimmune gluten intolerance)',
  'Crohn\'s Disease', 'Ulcerative Colitis', 'Irritable Bowel Syndrome (IBS)',
  'Gastroesophageal Reflux Disease (GERD)', 'Dairy/Milk Allergy', 'Peanut Allergy',
  'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)', 'Shellfish Allergy (Crustaceans & Mollusks)',
  'Egg Allergy', 'Fish Allergy', 'Lactose Intolerance', 'Gluten Sensitivity (Non-celiac)',
  'Fructose Intolerance', 'FODMAP Intolerance', 'Halal (Islamic dietary requirements)',
  'Kosher (Jewish dietary laws)', 'Hindu Vegetarian', 'Jain Vegetarian (Strict vegan + no root vegetables)',
  'Lacto-Ovo Vegetarian', 'Strict Vegan', 'Pescatarian', 'Ketogenic Diet', 'Paleo Diet',
  'Chronic Kidney Disease', 'Kidney Stones', 'Liver Disease', 'Osteoporosis', 'Gout'
];

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// =================== AUTH CONTROLLERS ===================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Missing Credentials" });
    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Missing Credentials" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid Credentials" });

    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =================== PROFILE ===================

export const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.user._id).select('-password');
    if (!userData)
      return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =================== UPDATE PROFILE ===================

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Check if email is being changed and is already in use by someone else
    if (email !== user.email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: "Email already in use by another account" });
      }
      user.email = email;
    }

    // ✅ Update name
    user.name = name;

    // ✅ Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Wrong current password" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// =================== HEALTH DATA ===================

export const restrictions = async (req, res) => {
  try {
    const { dietaryRestrictions } = req.body;
    const userId = req.user._id;
    if (!Array.isArray(dietaryRestrictions))
      return res.status(400).json({ success: false, message: "Please provide dietaryRestrictions array" });

    const invalid = dietaryRestrictions.filter(r => !VALID_DIETARY_RESTRICTIONS.includes(r));
    if (invalid.length)
      return res.status(400).json({ success: false, message: `Invalid dietary restrictions: ${invalid.join(', ')}` });

    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.healthData.dietaryRestrictions = [...new Set(dietaryRestrictions)];
    await user.save();

    res.status(200).json({ success: true, message: "Dietary restrictions updated successfully", userData: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const yourData = async (req, res) => {
  try {
    const { healthData } = req.body;
    const userId = req.user._id;
    if (!healthData || !healthData.age || !healthData.weight || !healthData.height || !healthData.gender)
      return res.status(400).json({ success: false, message: "Please provide complete health data" });

    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.yourData = { ...user.yourData, ...healthData };
    await user.save();
    res.status(200).json({ success: true, message: "Health data updated successfully", userData: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =================== FORGOT PASSWORD ===================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const rawCode = Math.random().toString(36).substring(2, 8);
    const hashedCode = await bcrypt.hash(rawCode, 10);

    user.resetCode = hashedCode;
    user.resetCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendMail({
      email,
      subject: 'Password Reset Code',
      message: `Your reset code is: ${rawCode}\nIt will expire in 1 hour.`
    });

    res.status(200).json({ success: true, message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =================== RESET PASSWORD ===================

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword || newPassword.length < 6)
      return res.status(400).json({ success: false, message: "Invalid input" });

    const user = await userModel.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpiry)
      return res.status(400).json({ success: false, message: "Reset code not set or expired" });

    if (user.resetCodeExpiry < new Date())
      return res.status(400).json({ success: false, message: "Reset code expired" });

    const isMatch = await bcrypt.compare(code, user.resetCode);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid reset code" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
