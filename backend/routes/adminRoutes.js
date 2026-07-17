import express from 'express';
import { getAdminMetrics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', protect, admin, getAdminMetrics);

export default router;
