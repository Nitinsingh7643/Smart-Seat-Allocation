import { Request, Response } from 'express';
import Seat from '../models/Seat';
import Booking, { BookingStatus } from '../models/Booking';
import { utcDayRange } from '../utils/dateUtils';

export const getAllSeats = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required for availability check.' });

        // Use UTC day range to find ALL bookings regardless of timezone offset
        const { start, end } = utcDayRange(date as string);

        const seats = await Seat.find();

        const bookings = await Booking.find({
            date: { $gte: start, $lte: end },
            status: BookingStatus.CONFIRMED
        });

        const bookedSeatIds = new Set(bookings.map(b => b.seatId.toString()));

        const seatAvailability = seats.map(seat => ({
            ...seat.toObject(),
            isBooked: bookedSeatIds.has(seat._id.toString()),
            bookedByUserId: bookings.find(b => b.seatId.toString() === seat._id.toString())?.userId || null
        }));

        res.json(seatAvailability);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching seats.' });
    }
};
