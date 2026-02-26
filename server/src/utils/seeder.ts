import Seat, { SeatType } from '../models/Seat';

export const seedInitialData = async () => {
    const count = await Seat.countDocuments();
    if (count > 0) return;

    const seats = [];

    // Squad Seats: 40 seats (10 squads, 4 seats each)
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 4; j++) {
            seats.push({
                number: `S${i}-${j}`,
                type: SeatType.SQUAD,
                squadName: `Squad ${i}`
            });
        }
    }

    // Floater Seats: 10 seats
    for (let i = 1; i <= 10; i++) {
        seats.push({
            number: `F${i}`,
            type: SeatType.FLOATER
        });
    }

    await Seat.insertMany(seats);
    console.log('Seeded 50 initial seats (40 Squad, 10 Floater)');
};
