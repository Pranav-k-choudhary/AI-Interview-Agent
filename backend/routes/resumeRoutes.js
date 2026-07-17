import express from 'express';
import { uploadAndAnalyzeResume, getResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Route to handle resume uploads and analysis
router.post('/upload', protect, upload.single('resume'), uploadAndAnalyzeResume);

// Route to fetch the active resume
router.get('/', protect, getResume);

export default router;
