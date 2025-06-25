import Admin from '../models/Admin.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerAdmin = async (data) => {
  if (data.password.length < 6) throw new Error('Password must be at least 6 characters');
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await Admin.create({ ...data, password: hashedPassword });
};

export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) return null;
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
  return { token, admin };
};
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
export const getAllUsers = () => User.find();
export const getUserById = (id) => User.findById(id);
export const updateUserById = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUserById = (id) => User.findByIdAndDelete(id);

export const getAllAdmins = () => Admin.find();

export const getAdminById = (id) => Admin.findById(id);
export const updateAdminById = (id, data) => Admin.findByIdAndUpdate(id, data, { new: true });
export const deleteAdminById = async (requestingAdminId, targetAdminId) => {
  if (requestingAdminId === targetAdminId) {
    throw new Error("Admins cannot delete themselves");
  }
  return await Admin.findByIdAndDelete(targetAdminId);
};
