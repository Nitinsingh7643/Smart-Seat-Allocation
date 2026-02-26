# SmartSeat — Intelligent Office Seat Management System
//DASHBOARD
<img width="1860" height="1042" alt="Screenshot 2026-02-26 171225" src="https://github.com/user-attachments/assets/1a4e819b-6279-4e30-9fc1-bb99e69528e6" />
<img width="1505" height="796" alt="Screenshot 2026-02-26 171554" src="https://github.com/user-attachments/assets/4e22d9ca-ef03-4e6f-949c-120789e4b015" />
//LANDING PAGE
<img width="1905" height="1067" alt="image" src="https://github.com/user-attachments/assets/bf0812e8-1de7-4d6a-ab14-60ec5b908b99" />
<img width="1614" height="762" alt="image" src="https://github.com/user-attachments/assets/69cdbe78-fcc2-4ada-90f1-6c40596de32c" />
<img width="1858" height="862" alt="image" src="https://github.com/user-attachments/assets/5789a8bd-a2a3-4044-a65a-2fefe136769b" />



> A full-stack hybrid workforce seat management platform with dynamic floater pools, batch scheduling, rule-engine validation, and real-time seat availability.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seeding Demo Data](#seeding-demo-data)
- [Demo Credentials](#demo-credentials)
- [API Reference](#api-reference)
- [Booking Rules Engine](#booking-rules-engine)
- [Project Structure](#project-structure)

---

## Overview

SmartSeat solves a real problem in hybrid workplaces: **efficiently allocating 50 office seats across two alternating batches of employees**, while dynamically releasing unused seats into a shared floater pool.

Built as a portfolio/interview project demonstrating:
- **JWT authentication** with role-based access
- **Rule engine** for complex booking validation
- **Dynamic buffer math** — floater pool auto-expands based on designated attendance
- **Real-time updates** via 8-second client-side polling
- **Optimistic UI** — instant seat feedback before API confirmation

---

## Features

| Feature | Description |
|---------|-------------|
| 🏢 **50-Seat Floor Model** | Seats S-1 to S-40 (Designated) + S-41 to S-50 (Floater Zone) |
| 🔄 **Batch A/B Scheduling** | Week-alternating: Batch 1 / Batch 2 on different days |
| 🌊 **Dynamic Floater Pool** | `Pool = 10 fixed + (40 − active designated bookings)` |
| ⚡ **Real-Time Grid** | Seat map auto-refreshes every 8 seconds |
| 🔒 **Rule Engine** | Prevents double bookings, validates batch schedule, enforces 3PM floater cutoff |
| 📅 **14-Day Horizon** | Book up to 2 weeks in advance, weekdays only |
| 🧪 **Demo Simulation** | Auto-simulates 29/31 colleague bookings on login |
| 👤 **Admin Dashboard** | Utilization analytics and daily trends |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
│                                                                   │
│  Landing → Login/Signup → Home (Seat Map) → My Bookings          │
│                                ↓                                  │
│           Optimistic UI + 8s polling for real-time updates        │
└────────────────────────┬────────────────────────────────────────┘
                         │  REST API (Axios)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express + TS)                        │
│                                                                   │
│  authRoutes → JWT middleware → bookingRoutes / seatRoutes         │
│                                    ↓                              │
│               BookingService → BookingRules (Rule Engine)         │
│                                    ↓                              │
│                    UTC-normalized date handling                    │
└────────────────────────┬────────────────────────────────────────┘
                         │  Mongoose ODM
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Atlas                              │
│                                                                   │
│   Collections:  users │ seats │ bookings                          │
└─────────────────────────────────────────────────────────────────┘
```

### Booking Flow

```
User clicks seat
      │
      ▼
Optimistic UI update (instant)
      │
      ▼
POST /api/bookings/reserve
      │
      ▼
BookingRules.validate()
  ├─ Is it a weekend? → reject
  ├─ Is it within 14 days? → reject if not
  ├─ Which batch is active today?
  │     ├─ Same batch → Designated booking (max 40)
  │     └─ Other batch → Floater booking
  │           ├─ Is it today? → reject (must book tomorrow)
  │           ├─ Is it >1 day ahead? → reject
  │           └─ Is it before 3PM? → reject
  └─ All pass → CREATE booking
      │
      ▼
Success → confirm seat │ Fail → rollback UI
```

### Dynamic Floater Math

```
Active designated bookings   = N  (from active batch today)
Released designated seats    = 40 - N
Fixed floater pool           = 10  (seats S-41 to S-50)
Total floater availability   = 10 + (40 - N)

Example: If 25 Batch 1 employees come in today:
  Floater pool = 10 + (40 - 25) = 25 seats available for Batch 2
```

### Batch Schedule

| Week | Mon–Wed | Thu–Fri |
|------|---------|---------|
| Odd weeks  | Batch 1 | Batch 2 |
| Even weeks | Batch 2 | Batch 1 |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Notification toasts |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type-safe backend |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing |
| date-fns | UTC-safe date manipulation |
| ts-node-dev | TypeScript hot-reload dev server |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas) connection string)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Nitinsingh7643/Smart-Seat-Allocation.git
cd Smart-Seat-Allocation
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env   # then fill in your values
```

See [Environment Variables](#environment-variables) below.

### 4. Seed the database

```bash
cd server

# Create 50 seats (S-1 to S-40 designated, S-41 to S-50 floater)
npx ts-node src/scripts/seedSeats.ts

# Create 62 demo users (30 Batch 1 + 32 Batch 2)
npx ts-node src/scripts/seedDemo.ts
```

### 5. Start the development servers

**Option A — Use the provided batch script (Windows):**
```bash
# From the project root
start_dev.bat
```

**Option B — Manual (two terminals):**
```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

Create `server/.env`:

```env
# MongoDB connection string (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/smartseat

# JWT secret — use a long random string in production
JWT_SECRET=your_super_secret_key_here

# Server port (default: 5000)
PORT=5000
```

Create `server/.env.example` (safe to commit):
```env
MONGODB_URI=mongodb://localhost:27017/smartseat
JWT_SECRET=change_me_in_production
PORT=5000
```

---

## Seeding Demo Data

| Script | What it does |
|--------|-------------|
| `seedSeats.ts` | Drops existing seats → creates 50 uniform seats |
| `seedDemo.ts` | Drops existing demo users → creates 30 B1 + 32 B2 users |

```bash
cd server

# Seats
npx ts-node src/scripts/seedSeats.ts

# Demo users
npx ts-node src/scripts/seedDemo.ts
```

---

## Demo Credentials

> **Password for all accounts:** `password123`

### Batch 1 (30 users)
| Email | Batch |
|-------|-------|
| `b1user1@demo.com` | BATCH_1 |
| `b1user2@demo.com` | BATCH_1 |
| `...` | BATCH_1 |
| `b1user30@demo.com` | BATCH_1 |

### Batch 2 (32 users)
| Email | Batch |
|-------|-------|
| `b2user1@demo.com` | BATCH_2 |
| `b2user2@demo.com` | BATCH_2 |
| `...` | BATCH_2 |
| `b2user32@demo.com` | BATCH_2 |

### How auto-simulation works on login

When you log in, the system automatically simulates today's attendance for your batch (excluding your own account), so the seat map is pre-populated:

| Login as | Seats auto-booked | Your seats free |
|----------|------------------|-----------------|
| Batch 1 user | 29 others → S-1 to S-29 | S-30 to S-50 |
| Batch 2 user | 31 others → S-1 to S-31 | S-32 to S-50 |

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|:---:|
| `POST` | `/api/auth/signup` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login, returns JWT | ❌ |

### Seats

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|:---:|
| `GET` | `/api/seats?date=YYYY-MM-DD` | Get all seats with availability for a date | ✅ |

### Bookings

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|:---:|
| `POST` | `/api/bookings/reserve` | Reserve a seat | ✅ |
| `GET` | `/api/bookings/mine` | Get my bookings | ✅ |
| `DELETE` | `/api/bookings/:id` | Cancel a booking | ✅ |
| `GET` | `/api/bookings/utilization` | Seat utilization analytics | ✅ Admin |
| `POST` | `/api/bookings/simulate` | Simulate batch attendance (demo) | ✅ |

#### `POST /api/bookings/reserve`
```json
{
  "seatId": "mongo_object_id",
  "date": "2026-02-27"
}
```

#### `POST /api/bookings/simulate`
```json
{
  "date": "2026-02-27",
  "batch": "BATCH_1",
  "count": 25,
  "excludeUserId": "mongo_object_id"
}
```

---

## Booking Rules Engine

`server/src/rule-engine/BookingRules.ts`

| Rule | Logic |
|------|-------|
| **No weekends** | Reject if `isWeekend(date)` |
| **14-day window** | `today ≤ date ≤ today + 14` |
| **Batch validation** | Check ISO week parity to determine active batch |
| **Designated limit** | Active batch max 40 bookings/day |
| **Floater time gate** | Opposite batch can only book floaters for *tomorrow*, and only after 3:00 PM today |
| **Floater capacity** | `pool = 10 + (40 − designated bookings)` |
| **Duplicate check** | One booking per user per day (UTC day range query) |

---

## Project Structure

```
Smart-Seat-Allocation/
├── client/                     # React frontend
│   └── src/
│       ├── components/
│       │   ├── Layout.tsx      # App shell with sidebar
│       │   ├── Sidebar.tsx     # Navigation sidebar
│       │   └── SeatGrid.tsx    # Interactive seat map
│       ├── context/
│       │   ├── AuthContext.tsx # JWT auth state
│       │   └── ThemeContext.tsx
│       ├── pages/
│       │   ├── Landing.tsx     # Marketing landing page
│       │   ├── Login.tsx
│       │   ├── Signup.tsx
│       │   ├── Home.tsx        # Seat booking page
│       │   ├── MyBookings.tsx
│       │   └── Dashboard.tsx   # Admin analytics
│       └── services/
│           └── api.ts          # Axios API client
│
├── server/                     # Express backend
│   └── src/
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── bookingController.ts
│       │   └── seatController.ts
│       ├── middleware/
│       │   └── authMiddleware.ts  # JWT verification
│       ├── models/
│       │   ├── User.ts
│       │   ├── Seat.ts
│       │   └── Booking.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── bookingRoutes.ts
│       │   └── seatRoutes.ts
│       ├── rule-engine/
│       │   └── BookingRules.ts    # Core validation logic
│       ├── services/
│       │   └── BookingService.ts  # Booking orchestration
│       ├── scripts/
│       │   ├── seedSeats.ts       # Seat database seeder
│       │   └── seedDemo.ts        # Demo user seeder
│       └── utils/
│           └── dateUtils.ts       # UTC date helpers
│
├── .gitignore
├── README.md
└── start_dev.bat              # Windows dev startup script
```

---

## Key Design Decisions

1. **UTC-only date handling** — All dates stored and queried as UTC midnight (`YYYY-MM-DDT00:00:00.000Z`) to eliminate IST/UTC timezone inconsistencies.

2. **Optimistic UI + real-time polling** — Seats update instantly on click (optimistic), confirmed by server, and auto-refreshed every 8 seconds so multi-user bookings appear live.

3. **Ref-guarded auto-simulation** — Login simulation uses `useRef` to run exactly once, preventing re-triggers on date navigation.

4. **Physical seat zones** — Seats S-41 to S-50 are physically marked `isFloater: true` in the DB, enabling the grid to visually separate zones while booking type remains dynamically determined by the rule engine.

---

## License

MIT © 2026 Nitin Singh
