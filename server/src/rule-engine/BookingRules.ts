import mongoose from 'mongoose';
import { isWeekend, addDays, isAfter, isBefore, startOfDay, setHours, setMinutes, getISOWeek, getDay } from 'date-fns';
import { IUser } from '../models/User';
import { ISeat } from '../models/Seat';
import { utcDayRange, utcMidnight } from '../utils/dateUtils';

export interface RuleResult {
    allowed: boolean;
    reason?: string;
    seatType?: 'designated' | 'floater';
}

export class BookingRules {
    /**
     * Check if booking is allowed based on dynamic buffer architecture.
     */
    static async validate(user: IUser, seat: ISeat, date: Date): Promise<RuleResult> {
        // Use UTC-based dates to avoid IST/UTC timezone mismatch
        const dateStr = date.toISOString().split('T')[0];
        const bookingDate = utcMidnight(dateStr);
        const today = utcMidnight(new Date().toISOString().split('T')[0]);

        // 1. Validate: Not weekend, Within 14 days
        if (isWeekend(bookingDate)) {
            return { allowed: false, reason: 'Booking not allowed on weekends.' };
        }

        const maxDate = addDays(today, 14);
        if (isAfter(bookingDate, maxDate) || isBefore(bookingDate, today)) {
            return { allowed: false, reason: 'Booking only allowed within 14 days from today.' };
        }

        // 2. Determine Week type and Allowed batch for that day
        const weekNumber = getISOWeek(bookingDate);
        const isWeek1 = weekNumber % 2 === 1;
        const dayOfWeek = getDay(bookingDate); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

        // Week 1: Mon,Tue,Wed = Batch 1 | Thu,Fri = Batch 2
        // Week 2: Mon,Tue,Wed = Batch 2 | Thu,Fri = Batch 1
        let allowedBatchName = '';
        if (isWeek1) {
            allowedBatchName = [1, 2, 3].includes(dayOfWeek) ? 'BATCH_1' : 'BATCH_2';
        } else {
            allowedBatchName = [1, 2, 3].includes(dayOfWeek) ? 'BATCH_2' : 'BATCH_1';
        }

        // Calculate dynamic bookings state — use UTC day range to catch all timestamps
        const { start: dayStart, end: dayEnd } = utcDayRange(dateStr);
        const bookings = await mongoose.models.Booking.find({
            date: { $gte: dayStart, $lte: dayEnd },
            status: 'CONFIRMED'
        }).populate('userId');

        // 3. Calculate Final Bookings State
        // activeDesignatedBookings ONLY counts non-floater bookings from the active batch
        const activeDesignatedBookings = bookings.filter((b: any) => b.userId?.batch === allowedBatchName && b.seatType === 'designated').length;
        // floaterBookings ONLY counts bookings that were explicitly booked as floaters
        const floaterBookings = bookings.filter((b: any) => b.seatType === 'floater').length;

        // CASE 1 — Employee belongs to ALLOWED BATCH (Team Day)
        if (user.batch === allowedBatchName) {
            if (activeDesignatedBookings < 40) {
                return { allowed: true, seatType: 'designated' };
            } else {
                return { allowed: false, reason: 'Batch capacity reached. The active batch has already booked 40 designated seats today.' };
            }
        }

        // CASE 2 — Employee belongs to OPPOSITE BATCH (Non-Team Day / Floater)
        else {
            const now = new Date();

            if (bookingDate.getTime() === today.getTime()) {
                return {
                    allowed: false,
                    reason: `Your profile batch is ${user.batch || 'undefined'}, but today is designated for ${allowedBatchName}. Floater seats (off-schedule batch days) cannot be booked for the same day. Try booking for tomorrow instead.`
                };
            }

            const tomorrowStr = addDays(new Date(), 1).toISOString().split('T')[0];
            const tomorrow = utcMidnight(tomorrowStr);

            if (isAfter(bookingDate, tomorrow)) {
                return { allowed: false, reason: 'Floater pool seats can only be booked exactly one day in advance.' };
            }

            // Booking for tomorrow needs to be after 3 PM today.
            if (bookingDate.getTime() === tomorrow.getTime()) {
                const cutoffTime = setMinutes(setHours(startOfDay(now), 15), 0);
                if (isBefore(now, cutoffTime)) {
                    return { allowed: false, reason: 'Floater pool bookings for tomorrow are only unlocked after 3:00 PM today.' };
                }
            }

            // DYNAMIC BUFFER MODEL MATH (PERFECT IMPLEMENTATION)
            // 1. Fixed floaters = 10
            // 2. Released designated = (40 - activeDesignatedBookings)
            // 3. floaterAvailable = 10 + releasedDesignatedSeats - floaterBookings

            const releasedDesignatedSeats = Math.max(0, 40 - activeDesignatedBookings);
            const floaterAvailable = 10 + releasedDesignatedSeats - floaterBookings;

            if (floaterAvailable > 0) {
                return { allowed: true, seatType: 'floater' };
            } else {
                return { allowed: false, reason: `Dynamic floater pool is full. There were no surplus floater seats available today.` };
            }
        }
    }
}
