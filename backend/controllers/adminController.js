import * as adminService from '../services/adminService.js';
import sendMail from '../utils/sendMail.js';
import Admin from '../models/Admin.js';
import User from '../models/user.js'; // 🔧 Needed for updateUserById
import bcrypt from 'bcryptjs';

// ✅ Register Admin (now protected route)
export const registerAdmin = async (req, res) => {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Login
export const loginAdmin = async (req, res) => {
  const result = await adminService.loginAdmin(req.body);
  if (!result) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(result);
};

// ✅ Get current profile
export const getCurrentAdminProfile = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.admin._id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch {
    res.status(500).json({ error: 'Failed to load profile' });
  }
};

// ✅ Update current profile (name/email)
export const updateCurrentAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin._id.toString() !== req.admin._id.toString()) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const updatedAdmin = await adminService.updateAdminById(req.admin._id, { name, email });
    res.json(updatedAdmin);
  } catch (err) {
    console.error('Update Admin Profile Error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ✅ Update own password
export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Invalid input. Password must be at least 6 characters.' });
    }

    const result = await adminService.updateAdminPassword(req.admin._id, currentPassword, newPassword);
    if (!result) return res.status(400).json({ error: 'Current password is incorrect' });

    res.json({ message: 'Password updated successfully' });
  } catch {
    res.status(500).json({ error: 'Password update failed' });
  }
};

// ✅ Forgot password (email + temp code)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const rawCode = Math.random().toString(36).substring(2, 8);
    const hashedCode = await bcrypt.hash(rawCode, 10);

    admin.resetCode = hashedCode;
    admin.resetCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await admin.save();

    await sendMail({
      email,
      subject: 'Your Temporary Password',
      message: `Here is your temporary password: ${rawCode}\n\nIt is valid for 1 hour.`,
    });

    res.status(200).json({ message: 'Reset code sent to your email' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Reset password using temp code
export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.resetCode || !admin.resetCodeExpiry) {
      return res.status(400).json({ error: 'Reset code not found. Please request again.' });
    }

    if (admin.resetCodeExpiry < new Date()) {
      return res.status(400).json({ error: 'Reset code expired' });
    }

    const isCodeValid = await bcrypt.compare(code, admin.resetCode);
    if (!isCodeValid) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetCode = null;
    admin.resetCodeExpiry = null;
    await admin.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Admin management
export const getAllAdmins = async (req, res) => {
  try {
    const search = req.query.search || '';
    const admins = await adminService.getAllAdmins(search);
    res.json(admins);
  } catch {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

export const updateAdminById = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin._id.toString() !== req.params.id) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const updatedAdmin = await adminService.updateAdminById(req.params.id, req.body);
    res.json(updatedAdmin);
  } catch {
    res.status(500).json({ error: 'Failed to update admin' });
  }
};

export const deleteAdminById = async (req, res) => {
  try {
    const requestingAdminId = req.admin._id;
    const targetAdminId = req.params.id;
    const result = await adminService.deleteAdminById(requestingAdminId, targetAdminId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ User management
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const users = await adminService.getAllUsers(search);
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  res.json(user);
};

export const updateUserById = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const updatedUser = await adminService.updateUserById(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUserById = async (req, res) => {
  const result = await adminService.deleteUserById(req.params.id);
  res.json(result);
};
