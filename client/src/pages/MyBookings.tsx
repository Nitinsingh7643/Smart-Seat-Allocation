import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import Layout from '../components/Layout';
import { format, isPast, isToday } from 'date-fns';
import { MapPin, X, Calendar, User, Zap, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await bookingService.getMine();
            setBookings(data);
        } catch (err) {
            toast.error('Failed to load your reservations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        const cancelToast = toast.loading('Processing cancellation...');
        try {
            await bookingService.cancel(id);
            toast.success('Reservation cancelled.', { id: cancelToast });
            fetchBookings();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Cancellation failed.', { id: cancelToast });
        }
    };

    return (
        <Layout>
            <div className="flex flex-col space-y-12 pb-20">
                <header className="flex flex-col space-y-4">
                    <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
                        Reservation <span className="text-emerald-600">History</span>
                    </h2>
                    <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.25em] text-xs">
                        Managing your active workspace positions
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="glass p-20 rounded-[4rem] text-center flex flex-col items-center justify-center space-y-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl"
                        >
                            <div className="p-10 rounded-[3rem] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 shadow-xl shadow-indigo-600/5">
                                <Calendar size={80} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Workspace Empty</h3>
                                <p className="text-slate-500 font-medium">You haven't reserved any positions yet.</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-blue-600/30 transition-all flex items-center space-x-3"
                            >
                                <span>Find a Seat</span>
                                <ArrowRight size={24} />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {bookings.map((booking, idx) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass group p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden active:scale-95 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`p-4 rounded-2xl ${booking.isFloater ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-blue-600 text-white shadow-blue-600/20'} shadow-xl`}>
                                            <MapPin size={24} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{booking.seatId?.type || 'CORE'}</p>
                                            <p className="text-3xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">{booking.seatId?.number}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                                            <Calendar size={18} />
                                            <span className="font-black text-lg">{format(new Date(booking.date), 'EEEE, MMM do')}</span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-xl shadow-blue-500/50" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Reservation</span>
                                        </div>

                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className="w-full py-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-xs"
                                        >
                                            <Trash2 size={16} />
                                            <span className="mt-0.5">Cancel Workspace</span>
                                        </button>
                                    </div>

                                    <div className={`absolute -right-20 -bottom-20 w-48 h-48 ${booking.isFloater ? 'bg-emerald-600' : 'bg-blue-600'} opacity-[0.03] rotate-45 pointer-events-none group-hover:scale-110 transition-transform`} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default MyBookings;
