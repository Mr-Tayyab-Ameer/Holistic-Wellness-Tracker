import express from 'express';
import { getStressHistory, getStressRecommendations, logStress } from '../controllers/stress.controller.js';
import auth from '../middelwares/user.auth.js';



const stressRouter = express.Router();

stressRouter.post('/log', auth, logStress);
stressRouter.get('/history', auth, getStressHistory);
stressRouter.get('/recommendations', auth, getStressRecommendations);

export default stressRouter;