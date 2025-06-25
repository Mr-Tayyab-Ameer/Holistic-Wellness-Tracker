import userModel from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// API for user register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Credentials" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = createToken(user._id);

    res.status(201).json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing Credentials" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {  // 🔥 FIXED here
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken(user._id);

    res.status(200).json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const userData = await userModel.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const restrictions = async (req, res) => {
  try {
    const { dietaryRestrictions } = req.body;
    const userId = req.user._id;

    if (!dietaryRestrictions || !Array.isArray(dietaryRestrictions)) {
      return res.status(400).json({ success: false, message: "Please provide dietaryRestrictions array" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.healthData.dietaryRestrictions = dietaryRestrictions;
    await user.save();

    res.status(200).json({ success: true, message: "Dietary restrictions updated successfully", userData: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// API to update health data
export const yourData = async (req, res) => {
  try {
    const { healthData } = req.body;
    const userId = req.user._id;


    if (!healthData || !healthData.age || !healthData.weight || !healthData.height || !healthData.gender) {
      return res.status(400).json({ success: false, message: "Please provide complete health data" });
    }

    const user = await userModel.findById(userId);

    console.log(user);
    

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.yourData = { ...user.yourData, ...healthData };

    await user.save();

    res.status(200).json({ success: true, message: "Health data updated successfully", userData: user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
