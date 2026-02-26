import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format, addDays, isWeekend, startOfDay, isToday, isTomorrow } from 'date-fns';
import { seatService, bookingService } from '../services/api';
import SeatGrid from '../components/SeatGrid';
import Layout from '../components/Layout';
import { Calendar, ChevronLeft, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Fixed simulated attendance counts per batch
const BATCH_ATTENDANCE: Record<string, number> = {
    BATCH_1: 30,
    BATCH_2: 32,
};

const Home: React.FC = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [seats, setSeats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const hasSimulated = useRef(false); // Prevent multiple simulate calls

    // ─── Fetch seats for the selected date ────────────────────────────────────
    const fetchSeats = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await seatService.getAll(format(selectedDate, 'yyyy-MM-dd'));
            setSeats(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error fetching seats.');
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    // Fetch seats every time the selected date changes
    useEffect(() => {
        fetchSeats();
    }, [fetchSeats]);

    // ─── Real-time polling ────────────────────────────────────────────────────
    // Silently re-fetch every 8 seconds so live bookings from other users appear
    const isBookingRef = useRef(false);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isBookingRef.current) fetchSeats();
        }, 8000);
        return () => clearInterval(interval);
    }, [fetchSeats]);

    // ─── Auto-simulate on first login ─────────────────────────────────────────
    // Runs ONCE only (tracked with ref). Simulates today's attendance for the
    // logged-in user's batch, excluding them so they can book their own seat.
    useEffect(() => {
        if (hasSimulated.current || !user?.batch || !user?.id) return;
        hasSimulated.current = true;

        const runSimulate = async () => {
            const today = format(new Date(), 'yyyy-MM-dd');
            const count = BATCH_ATTENDANCE[user.batch as string] ?? 25;
            try {
                await bookingService.simulate({
                    date: today,
                    batch: user.batch as string,
                    count,
                    excludeUserId: user.id,
                });
                // Only refresh the grid if today is the selected date
                if (format(selectedDate, 'yyyy-MM-dd') === today) {
                    const { data } = await seatService.getAll(today);
                    setSeats(data);
                }
            } catch {
                // Silent fail
            }
        };

        runSimulate();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Book a seat ──────────────────────────────────────────────────────────
    const handleBook = async (seatId: string) => {
        isBookingRef.current = true; // Pause polling during booking

        // Optimistic update — instant visual feedback
        const previousSeats = seats;
        setSeats(prev => prev.map(s =>
            s._id === seatId
                ? { ...s, isBooked: true, bookedByUserId: user?.id }
                : s
        ));

        const loadingToast = toast.loading('Reserving seat...');
        try {
            await bookingService.reserve({ seatId, date: format(selectedDate, 'yyyy-MM-dd') });
            toast.success('✅ Seat reserved!', { id: loadingToast });
            fetchSeats(); // Confirm with server truth
        } catch (err: any) {
            setSeats(previousSeats); // Rollback on failure
            toast.error(err.response?.data?.message || 'Booking failed.', { id: loadingToast });
        } finally {
            isBookingRef.current = false; // Resume polling
        }
    };

    // ─── Date navigation ──────────────────────────────────────────────────────
    const nextValidDate = () => {
        let next = addDays(selectedDate, 1);
        while (isWeekend(next)) next = addDays(next, 1);
        setSelectedDate(next);
    };

    const prevValidDate = () => {
        let prev = addDays(selectedDate, -1);
        while (isWeekend(prev) || prev < startOfDay(new Date())) prev = addDays(prev, -1);
        if (prev >= startOfDay(new Date())) setSelectedDate(prev);
    };

    const bookedCount = seats.filter(s => s.isBooked).length;
    const availableCount = seats.length - bookedCount;

    return (
        <Layout>
            <div className="flex flex-col space-y-12 pb-20">
                {/* ── Header + Date Picker ── */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
                            Workspace <span className="text-blue-600">Allocation</span>
                        </h2>
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.25em] text-xs">
                            Select your position for {isToday(selectedDate) ? 'Today' : isTomorrow(selectedDate) ? 'Tomorrow' : format(selectedDate, 'EEEE, MMM do')}
                        </p>
                    </div>

                    <div className="flex bg-white dark:bg-slate-900 rounded-[2rem] p-3 shadow-2xl shadow-blue-600/5 border border-slate-100 dark:border-slate-800">
                        <button
                            onClick={prevValidDate}
                            disabled={isToday(selectedDate)}
                            className="p-4 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-2xl disabled:opacity-20 transition-all active:scale-90"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <div className="flex items-center space-x-4 px-10 border-x border-slate-100 dark:border-slate-800">
                            <Calendar className="text-blue-600" size={24} />
                            <span className="font-black tabular-nums text-slate-800 dark:text-white text-xl">
                                {format(selectedDate, 'MMM do, yyyy')}
                            </span>
                        </div>
                        <button
                            onClick={nextValidDate}
                            className="p-4 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-2xl transition-all active:scale-90"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </header>

                {/* ── Metrics Banner ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-between group hover:border-slate-300 transition-colors">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Capacity</p>
                            <p className="text-4xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">{seats.length || 50}</p>
                        </div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🏢</div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 shadow-xl shadow-indigo-600/5 flex items-center justify-between group hover:border-indigo-300 transition-colors">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Total Present Today</p>
                            <p className="text-4xl font-black text-indigo-600 tabular-nums tracking-tighter">{bookedCount}</p>
                        </div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🧑‍💻</div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 shadow-xl shadow-emerald-600/5 flex items-center justify-between group hover:border-emerald-300 transition-colors">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Seats Available</p>
                            <p className="text-4xl font-black text-emerald-600 tabular-nums tracking-tighter">{availableCount}</p>
                        </div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🪑</div>
                    </div>
                </div>

                {/* ── Seat Grid ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDate.toString()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="glass p-12 lg:p-16 rounded-[4rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden"
                    >
                        {loading && (
                            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                            </div>
                        )}
                        <SeatGrid seats={seats} onBook={handleBook} loading={loading} />
                    </motion.div>
                </AnimatePresence>

                {/* ── Info Cards ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-indigo p-10 rounded-[2.5rem] flex items-start space-x-6 border-indigo-500/10">
                        <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30">
                            <Info size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Policies Applied</h4>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Seats are governed by batch schedules. Floater slots for next-day reservations activate today at 15:00.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-10 rounded-[2.5rem] flex items-start space-x-6 bg-slate-50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 text-slate-500">
                        <div className="p-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-400 dark:text-slate-500 mb-2 tracking-tight">Weekend Restriction</h4>
                            <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400">SmartSeat Rules Active</p>
                            <p className="mt-1 font-medium italic">Office closed. No bookings authorized for Sat/Sun.</p>
                        </div>
                    </div>
                </section>


            </div>
        </Layout>
    );
};

export default Home;
