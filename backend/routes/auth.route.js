import express from 'express';
import { registerUser, authUser, getProfile, restrictions, yourData } from '../controllers/user.controller.js';
import auth from '../middelwares/user.auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', authUser);
userRouter.get('/profile', auth, getProfile);
userRouter.put('/update-health', auth, restrictions);
userRouter.put('/update-health-data', auth, yourData);



export default userRouter;