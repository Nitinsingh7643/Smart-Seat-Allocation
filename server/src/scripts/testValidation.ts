import mongoose from 'mongoose';
import { BookingRules } from '../rule-engine/BookingRules';
import { ISeat, SeatType } from '../models/Seat';
import { IUser, UserRole, Batches } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartseat');
    const user = { batch: 'BATCH_2', squadName: 'Squad 1', role: 'EMPLOYEE' } as IUser;
    const seat = { _id: new mongoose.Types.ObjectId(), type: 'SQUAD', number: 'WS-01' } as any;
    const date = new Date('2026-02-26');
    console.log("Date parsed as:", date.toString());
    const result = await BookingRules.validate(user, seat, date);
    console.log("Result:", result);
    process.exit(0);
};
run();
