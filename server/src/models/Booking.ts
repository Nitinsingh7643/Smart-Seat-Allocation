import mongoose, { Schema, Document } from 'mongoose';

export enum BookingStatus {
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    seatId: mongoose.Types.ObjectId;
    date: Date;
    status: BookingStatus;
    seatType: 'designated' | 'floater';
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seatId: { type: Schema.Types.ObjectId, ref: 'Seat', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.CONFIRMED },
    seatType: { type: String, enum: ['designated', 'floater'], required: true }
}, { timestamps: true });

// Ensure a user can only have one CONFIRMED booking per day
BookingSchema.index({ userId: 1, date: 1 }, {
    unique: true,
    partialFilterExpression: { status: BookingStatus.CONFIRMED }
});

// Ensure a seat can only have one CONFIRMED booking per day
BookingSchema.index({ seatId: 1, date: 1 }, {
    unique: true,
    partialFilterExpression: { status: BookingStatus.CONFIRMED }
});

// For quickly finding bookings on a specific date (real-time availability)
BookingSchema.index({ date: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
