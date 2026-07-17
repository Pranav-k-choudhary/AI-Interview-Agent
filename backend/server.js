import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize, { connectDB } from './config/db.js';

// Import associations so models register and link together before sync
import './models/association.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to support cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Agent API (MySQL Edition) is running...' });
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('Express Error Handler:', err);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to Database, Sync schemas, and Start listening
const startServer = async () => {
  try {
    await connectDB();
    
    console.log('Synchronizing database schemas...');
    
    
    await sequelize.sync(); 
    
    console.log('MySQL Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server fully running on port ${PORT}`);
    });
  } catch (dbError) {
    console.error('Failed to sync schemas or start server:', dbError.message);
  }
};
startServer();

