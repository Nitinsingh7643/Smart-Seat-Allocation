import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE'
}

export enum Batches {
    BATCH_1 = 'BATCH_1',
    BATCH_2 = 'BATCH_2'
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    squadName?: string;
    batch: Batches;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.EMPLOYEE },
    squadName: { type: String },
    batch: { type: String, enum: Object.values(Batches), required: true },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
