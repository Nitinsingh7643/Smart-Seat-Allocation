import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole, Batches } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, role, squadName, batch } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists.' });

        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            passwordHash,
            firstName,
            lastName,
            role: role || UserRole.EMPLOYEE,
            squadName,
            batch: batch || Batches.BATCH_1,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed.' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign(
            { userId: user._id, role: user.role, squadName: user.squadName, batch: user.batch },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, squadName: user.squadName, batch: user.batch } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed.' });
    }
};
