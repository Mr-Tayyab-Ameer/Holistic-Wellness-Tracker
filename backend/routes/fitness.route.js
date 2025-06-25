import express from 'express';

import auth from '../middelwares/user.auth.js';
import { addActivity, deleteActivity, getActivities } from '../controllers/fitness.controller.js';

const fitnessRouter = express.Router();

fitnessRouter.route('/')
  .get(auth, getActivities)
  .post(auth, addActivity);

  fitnessRouter.route('/:id')
  .delete(auth, deleteActivity);

export default fitnessRouter;