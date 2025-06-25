import { Router } from 'express';
import authRoutes from './auth.js';
import fitnessRoutes from './fitness.js';
import nutritionRoutes from './nutrition.js';
import stressRoutes from './stress.js';
import chatbotRoutes from './chatbot.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/fitness', fitnessRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/stress', stressRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;