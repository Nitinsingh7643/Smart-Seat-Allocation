import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';
import Booking, { BookingStatus } from '../models/Booking';
import { AuthRequest } from '../middleware/authMiddleware';

export const bookSeat = async (req: AuthRequest, res: Response) => {
    try {
        const { seatId, date } = req.body;
        const userId = req.user.userId;

        const booking = await BookingService.bookSeat(userId, seatId, date);
        res.status(201).json(booking);
    } catch (err: any) {
        res.status(400).json({ message: err.message || 'Booking failed.' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await BookingService.cancelBooking(id, userId);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message || 'Cancellation failed.' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const bookings = await Booking.find({ userId, status: BookingStatus.CONFIRMED }).populate('seatId');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookings.' });
    }
};

export const getUtilization = async (req: AuthRequest, res: Response) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ message: 'Start and end dates required.' });

        const stats = await BookingService.getUtilization(new Date(start as string), new Date(end as string));
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error calculating utilization.' });
    }
};
