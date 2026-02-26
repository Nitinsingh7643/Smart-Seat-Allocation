import mongoose, { Schema, Document } from 'mongoose';

export interface ISeat extends Document {
    number: string;
    isFloater: boolean; // Physical zone: true = floater zone (seats 41-50)
    createdAt: Date;
    updatedAt: Date;
}

const SeatSchema: Schema = new Schema({
    number: { type: String, required: true, unique: true },
    isFloater: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<ISeat>('Seat', SeatSchema);
