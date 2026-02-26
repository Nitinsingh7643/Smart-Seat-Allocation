import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Seat from '../models/Seat';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartseat';

const seedSeats = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected. Clearing existing seats...');

        await Seat.deleteMany({});

        const seatsToInsert = [];

        // Create 40 Designated Seats (S-1 to S-40)
        for (let i = 1; i <= 40; i++) {
            seatsToInsert.push({
                number: `S-${i}`,
                isFloater: false,
            });
        }

        // Create 10 Floater Zone Seats (S-41 to S-50)
        for (let i = 41; i <= 50; i++) {
            seatsToInsert.push({
                number: `S-${i}`,
                isFloater: true,
            });
        }

        console.log(`Inserting ${seatsToInsert.length} uniform seats...`);
        await Seat.insertMany(seatsToInsert);

        console.log('Successfully seeded 50 total seats!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding seats:', error);
        process.exit(1);
    }
};

seedSeats();
