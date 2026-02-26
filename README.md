![1000218774](https://github.com/user-attachments/assets/a31e00c4-c134-46a6-95af-dba444526093)


# Smart Office Seat Booking System

A production-ready booking system for managing office occupancy efficiently.

## 🚀 Overview
Built with **React, TypeScript, Node.js, and MongoDB**, this system provides a premium desktop-class experience for office seat management.

### Key Features
- **Seat Visualization**: Interactive seat map (Squad Section & Floater Zone).
- **Rule Engine**: Validates bookings for weekends, 14-day window, and floater cutoff (3 PM).
- **Real-time Availability**: Checks seat status instantly for selected dates.
- **Admin Dashboard**: Real-time utilization metrics and occupancy tracking.
- **Transaction-safe**: MongoDB transations ensure no seat is double-booked.
- **Role-based Auth**: Secure access for Admins and Employees.

## 🛠 Tech Stack
- **Frontend**: Vite, React, TypeScript, Tailwind CSS, Lucide icons, date-fns.
- **Backend**: Express, TypeScript, Mongoose, JWT, Bcrypt.
- **Database**: MongoDB (Requires a Replica Set if using transactions locally).

## 📂 Folder Structure
```text
/
├── server/           # Express + Mongoose
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── rule-engine/
│   │   └── index.ts
├── client/           # React + Vite
    ├── src/
        ├── components/
        ├── pages/
        ├── context/
        └── services/
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Running on `localhost:27017` with a Replica Set for transactions).

### 2. Backend Setup
1. Move to `server/` directory.
2. Install dependencies: `npm install`.
3. Configure `.env` (already created with defaults).
4. Start dev server: `npm run dev`.

### 3. Frontend Setup
1. Move to `client/` directory.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev`.

## 📌 Implementation Details
- **Double Booking Prevention**: Handled via compound unique indexes on `(userId, date)` and `(seatId, date)` for `CONFIRMED` bookings.
- **Floater Rule**: Automatically calculated in the `BookingRules` engine.
- **Seeder**: Automatically initializes 50 seats (40 Squad, 10 Floater) upon the first server start.

---
**Author**: Developed for Premium Smart Office Management.
