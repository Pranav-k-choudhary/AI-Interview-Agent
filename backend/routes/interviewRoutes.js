import express from 'express';
import {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewReport,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/submit-answer', protect, submitAnswer);
router.get('/history', protect, getInterviewHistory);
router.get('/report/:id', protect, getInterviewReport);

export default router;
