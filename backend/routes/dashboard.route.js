import express from 'express';
import auth from '../middelwares/user.auth.js';
import { getDashboardData } from '../controllers/dashboard.controller.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/', auth, getDashboardData);

export default dashboardRouter;
