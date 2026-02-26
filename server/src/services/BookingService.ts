import mongoose from 'mongoose';
import Booking, { BookingStatus, IBooking } from '../models/Booking';
import User from '../models/User';
import Seat from '../models/Seat';
import { BookingRules } from '../rule-engine/BookingRules';
import { utcDayRange, utcMidnight } from '../utils/dateUtils';

export class BookingService {
    /**
     * Main reservation logic using MongoDB transactions.
     */
    static async bookSeat(userId: string, seatId: string, dateStr: string): Promise<IBooking> {
        // Always parse as UTC midnight to guarantee consistent storage
        const date = utcMidnight(dateStr);
        const { start: dayStart, end: dayEnd } = utcDayRange(dateStr);

        const user = await User.findById(userId);
        const seat = await Seat.findById(seatId);

        if (!user || !seat) {
            throw new Error('User or Seat not found.');
        }

        // 1. Run Rule Engine
        const validation = await BookingRules.validate(user, seat, date);
        if (!validation.allowed) {
            throw new Error(validation.reason || 'Booking rejected by rule engine.');
        }

        // 2. Check seat availability — use day range to catch any timezone-stored booking
        const existingSeatBooking = await Booking.findOne({
            seatId: seat._id,
            date: { $gte: dayStart, $lte: dayEnd },
            status: BookingStatus.CONFIRMED
        });

        if (existingSeatBooking) {
            throw new Error('Seat is already booked for this day.');
        }

        // 3. Check user doesn't already have a booking today — use day range
        const existingUserBooking = await Booking.findOne({
            userId: user._id,
            date: { $gte: dayStart, $lte: dayEnd },
            status: BookingStatus.CONFIRMED
        });

        if (existingUserBooking) {
            throw new Error('User already has a seat booked for this day.');
        }

        // 4. Create the booking — save at exact UTC midnight for consistency
        const newBooking = new Booking({
            userId: user._id,
            seatId: seat._id,
            date,
            status: BookingStatus.CONFIRMED,
            seatType: validation.seatType
        });

        await newBooking.save();

        return newBooking;
    }

    static async cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
        const booking = await Booking.findById(bookingId);
        if (!booking) throw new Error('Booking not found.');
        if (booking.userId.toString() !== userId) throw new Error('Unauthorized.');

        booking.status = BookingStatus.CANCELLED;
        return await booking.save();
    }

    static async getUtilization(dateFrom: Date, dateTo: Date): Promise<any> {
        const totalSeatsCount = await Seat.countDocuments();
        const totalDays = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24)) + 1;
        const totalPossibleSlots = totalSeatsCount * totalDays;

        const bookingsCount = await Booking.countDocuments({
            date: { $gte: dateFrom, $lte: dateTo },
            status: BookingStatus.CONFIRMED
        });

        const dailyTrends = await Booking.aggregate([
            { $match: { date: { $gte: dateFrom, $lte: dateTo }, status: BookingStatus.CONFIRMED } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { date: "$_id", count: 1, _id: 0 } }
        ]);

        const squadStats = await Booking.aggregate([
            { $match: { date: { $gte: dateFrom, $lte: dateTo }, status: BookingStatus.CONFIRMED } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $group: { _id: '$user.squadName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { name: "$_id", count: 1, _id: 0 } }
        ]);

        return {
            totalPossibleSlots,
            bookingsCount,
            utilizationPercentage: totalPossibleSlots > 0 ? (bookingsCount / totalPossibleSlots) * 100 : 0,
            dailyTrends,
            squadStats
        };
    }
}
