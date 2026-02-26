import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole, Batches } from '../models/User';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartseat';

const seedDemoUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected. Clearing old demo users...');

        // Only delete users with the @demo.com domain so we don't delete your real admin/tester accounts!
        await User.deleteMany({ email: /@demo\.com/ });

        const passwordHash = await bcrypt.hash('password123', 10);
        const usersToInsert = [];

        // Create 30 Users for Batch 1
        for (let i = 1; i <= 30; i++) {
            usersToInsert.push({
                firstName: 'Batch1',
                lastName: `Employee ${i}`,
                email: `b1user${i}@demo.com`,
                passwordHash,
                role: UserRole.EMPLOYEE,
                squadName: `Squad ${(i % 10) + 1}`,
                batch: Batches.BATCH_1
            });
        }

        // Create 32 Users for Batch 2
        for (let i = 1; i <= 32; i++) {
            usersToInsert.push({
                firstName: 'Batch2',
                lastName: `Employee ${i}`,
                email: `b2user${i}@demo.com`,
                passwordHash,
                role: UserRole.EMPLOYEE,
                squadName: `Squad ${(i % 10) + 1}`,
                batch: Batches.BATCH_2
            });
        }

        console.log('Inserting 62 new demo users...');
        await User.insertMany(usersToInsert);

        console.log('\n✅ Successfully generated 62 Demo Users for your interview!');
        console.log('---------------------------------------------------------');
        console.log('🔹 Batch 1 Emails: b1user1@demo.com   through   b1user30@demo.com  (30 users)');
        console.log('🔹 Batch 2 Emails: b2user1@demo.com   through   b2user32@demo.com  (32 users)');
        console.log('🔑 Password for EVERY account: password123');
        console.log('---------------------------------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding demo users:', error);
        process.exit(1);
    }
};

seedDemoUsers();
