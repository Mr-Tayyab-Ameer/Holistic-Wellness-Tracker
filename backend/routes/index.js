import { Router } from 'express';
import authRoutes from './auth.route.js';
import fitnessRoutes from './fitness.route.js';
import nutritionRoutes from './nutrition.route.js';
import stressRoutes from './stress.route.js';
import chatbotRoutes from './chatbot.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/fitness', fitnessRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/stress', stressRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;