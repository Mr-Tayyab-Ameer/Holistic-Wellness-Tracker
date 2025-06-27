import Admin from '../models/Admin.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin registration
export const registerAdmin = async (data) => {
  if (data.password.length < 6) throw new Error('Password must be at least 6 characters');
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await Admin.create({ ...data, password: hashedPassword });
};

// Admin login
export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) return null;
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
  return { token, admin };
};

// Update current admin's password
export const updateAdminPassword = async (adminId, currentPassword, newPassword) => {
  const admin = await Admin.findById(adminId);
  if (!admin) return false;

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  await admin.save();
  return true;
};

// Forgot password: store reset code and expiry
export const setResetCode = async (email, code) => {
  const expiry = Date.now() + 60 * 60 * 1000; // valid for 1 hour
  return await Admin.findOneAndUpdate(
    { email },
    { resetCode: code, resetCodeExpiry: expiry },
    { new: true }
  );
};

// Reset password using reset code
export const resetAdminPassword = async (email, code, newPassword) => {
  const admin = await Admin.findOne({ email });

  if (
    !admin ||
    admin.resetCode !== code ||
    !admin.resetCodeExpiry ||
    admin.resetCodeExpiry < Date.now()
  ) {
    throw new Error('Invalid or expired reset code');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  admin.resetCode = null;
  admin.resetCodeExpiry = null;

  await admin.save();
  return true;
};

// User operations
export const getAllUsers = () => User.find();
export const getUserById = (id) => User.findById(id);
export const updateUserById = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUserById = (id) => User.findByIdAndDelete(id);

// Admin operations
export const getAllAdmins = () => Admin.find();
export const getAdminById = (id) => Admin.findById(id).select('-password');
export const updateAdminById = (id, data) => Admin.findByIdAndUpdate(id, data, { new: true });

export const deleteAdminById = async (requestingAdminId, targetAdminId) => {
  if (requestingAdminId === targetAdminId) {
    throw new Error('Admins cannot delete themselves');
  }
  return await Admin.findByIdAndDelete(targetAdminId);
};
