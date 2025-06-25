import * as adminService from '../services/adminService.js';

// Admin registration
export const registerAdmin = async (req, res) => {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  const result = await adminService.loginAdmin(req.body);
  if (!result) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(result);
};

// Get current admin profile
/*export const getCurrentAdminProfile = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.admin._id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Failed to  load profile' });
  }
};
*/
// Update admin's own password
export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Invalid input. Password must be at least 6 characters.' });
    }
    const result = await adminService.updateAdminPassword(req.admin._id, currentPassword, newPassword);
    if (!result) return res.status(400).json({ error: 'Current password is incorrect' });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Password update failed' });
  }
};

// Users
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const users = await adminService.getAllUsers(search);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  res.json(await adminService.getUserById(req.params.id));
};

export const updateUserById = async (req, res) => {
  res.json(await adminService.updateUserById(req.params.id, req.body));
};

export const deleteUserById = async (req, res) => {
  res.json(await adminService.deleteUserById(req.params.id));
};

// Admins
export const getAllAdmins = async (req, res) => {
  try {
    console.log('🔍 Controller: Fetching all admins');
    const search = req.query.search || '';
    const admins = await adminService.getAllAdmins(search);
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
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

export const updateAdminById = async (req, res) => {
  res.json(await adminService.updateAdminById(req.params.id, req.body));
};