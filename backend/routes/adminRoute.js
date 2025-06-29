import express from 'express';
import * as adminController from '../controllers/adminController.js';
import adminAuth from '../middelwares/adminAuthMiddleware.js';

const router = express.Router();

// 🌐 Public routes
router.post('/login', adminController.loginAdmin);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password', adminController.resetPassword);

// 🔐 Protected routes — everything below requires valid JWT
router.use(adminAuth);

// ✅ Admin registration (must be logged in)
router.post('/register', adminController.registerAdmin);

// ✅ Admin profile
router.get('/profile', adminController.getCurrentAdminProfile);
router.put('/profile', adminController.updateCurrentAdminProfile);
router.put('/update-password', adminController.updateAdminPassword);

// ✅ Admin Management
router.get('/admins', adminController.getAllAdmins);
router.put('/admins/:id', adminController.updateAdminById);
router.delete('/admins/:id', adminController.deleteAdminById);

// ✅ User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUserById);
router.delete('/users/:id', adminController.deleteUserById);

export default router;
