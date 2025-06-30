import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// import { notFound, errorHandler } from './middlewares/error.js';
import userRouter from './routes/auth.route.js';
import fitnessRouter from './routes/fitness.route.js';
import nutritionRouter from './routes/nutrition.route.js';
import stressRouter from './routes/stress.route.js';
import connectDB from './config/mongo.js';
import dashboardRouter from './routes/dashboard.route.js';
import adminRoutes from './routes/adminRoute.js';
import emotionRouter from './routes/emotion.route.js';
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/auth', userRouter);
app.use('/api/fitness', fitnessRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/stress', stressRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/emotion', emotionRouter);
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});


// Error Handling Middleware
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`Server running in ${ENVIRONMENT} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});