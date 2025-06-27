// src/routes/adminRoute.js

import express from 'express';
import * as adminController from '../controllers/adminController.js';
import adminAuth from '../middelwares/adminAuthMiddleware.js';

const router = express.Router();

// 🌐 Public routes
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/forgot-password', adminController.forgotPassword);  // ✅ Fixed
router.post('/reset-password', adminController.resetPassword);    // ✅ Fixed

// 🔐 Protected routes
router.use(adminAuth);

// ✅ Get current admin profile
router.get('/profile', adminController.getCurrentAdminProfile);
router.put('/profile', adminController.updateCurrentAdminProfile);

// ✅ Admin password update (self only)
router.put('/update-password', adminController.updateAdminPassword);

// ✅ Admin Management
router.get('/admins', adminController.getAllAdmins);
router.delete('/admins/:id', adminController.deleteAdminById);
router.put('/admins/:id', adminController.updateAdminById);

// ✅ User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUserById);
router.delete('/users/:id', adminController.deleteUserById);

export default router;
