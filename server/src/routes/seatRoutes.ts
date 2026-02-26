import express from 'express';
import { getAllSeats } from '../controllers/seatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware as any);

router.get('/all', getAllSeats as any);

export default router;
