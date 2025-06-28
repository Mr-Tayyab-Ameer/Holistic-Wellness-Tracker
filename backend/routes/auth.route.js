import express from 'express';
import {
  registerUser,
  authUser,
  getProfile,
  updateUserProfile, // ✅ Import updateUserProfile
  restrictions,
  yourData,
  forgotPassword,
  resetPassword
} from '../controllers/user.controller.js';

import auth from '../middelwares/user.auth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', authUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Protected routes
userRouter.get('/profile', auth, getProfile);
userRouter.put('/profile', auth, updateUserProfile); // ✅ Add profile update route
userRouter.put('/update-health', auth, restrictions);
userRouter.put('/update-health-data', auth, yourData);

export default userRouter;