import express from 'express';
import { bookSeat, cancelBooking, getUtilization, getMyBookings } from '../controllers/bookingController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware as any);

router.post('/reserve', bookSeat as any);
router.delete('/:id', cancelBooking as any);
router.get('/mine', getMyBookings as any);

// Utilization dashboard (admin only)
router.get('/utilization', adminMiddleware as any, getUtilization as any);

// INTERVIEW DEMO ROUTE ONLY (DANGEROUS IN PROD)
router.post('/simulate', async (req, res) => {
    try {
        const { date, batch, count, excludeUserId } = req.body;
        const mongoose = require('mongoose');
        const { utcDayRange, utcMidnight } = require('../utils/dateUtils');
        const { start: dayStart, end: dayEnd } = utcDayRange(date);
        const targetDate = utcMidnight(date); // Store at exact UTC midnight

        const BookingModel = require('../models/Booking').default;
        const UserModel = require('../models/User').default;
        const SeatModel = require('../models/Seat').default;

        // Step 1: Clear ALL bookings for this date using a day range (catches IST/UTC variants)
        await BookingModel.deleteMany({ date: { $gte: dayStart, $lte: dayEnd } });

        // Step 2: Find users matching the batch — EXCLUDING the logged-in user
        const query: any = { batch };
        if (excludeUserId) {
            query._id = { $ne: new mongoose.Types.ObjectId(excludeUserId) };
        }
        const users = await UserModel.find(query).limit(count);

        // Step 3: Get all seats
        const seats = await SeatModel.find();

        // Step 4: Force-create designated bookings at UTC midnight
        let booked = 0;
        for (let i = 0; i < users.length && booked < count && booked < seats.length; i++) {
            const booking = new BookingModel({
                userId: users[i]._id,
                seatId: seats[booked]._id,
                date: targetDate,
                status: 'CONFIRMED',
                seatType: 'designated'
            });
            await booking.save();
            booked++;
        }

        res.json({ message: `Successfully simulated ${booked} active bookings for ${batch} on ${date}` });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
