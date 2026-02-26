import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, X, Anchor, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SeatProps {
    _id: string;
    number: string;
    isFloater: boolean;
    isBooked: boolean;
    bookedByUserId?: string | null;
    onBook: (seatId: string) => void;
    loading?: boolean;
}

const SeatItem: React.FC<SeatProps> = ({ _id, number, isFloater, isBooked, bookedByUserId, onBook, loading }) => {
    const { user } = useAuth();
    const isMine = bookedByUserId === user?.id;

    return (
        <motion.div
            whileHover={{ scale: !isBooked && !loading ? 1.1 : 1 }}
            whileTap={{ scale: !isBooked && !loading ? 0.95 : 1 }}
            onClick={() => !isBooked && !loading && onBook(_id)}
            className={cn(
                "seat group flex flex-col items-center justify-center relative transition-all duration-300",
                isBooked
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
                    : isFloater
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 hover:shadow-xl shadow-emerald-600/5"
                        : "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-slate-100 dark:border-white/5 hover:border-indigo-400 hover:shadow-xl shadow-indigo-600/5",
                isBooked && isMine && "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/30"
            )}
        >
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-1.5 h-1.5 rounded-full ${isFloater ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={isBooked ? 'booked' : 'free'}
                    className="flex flex-col items-center"
                >
                    {isBooked ? (
                        isMine ? <User size={24} className="animate-bounce" /> : <X size={20} className="opacity-20" />
                    ) : (
                        <span className="text-lg font-black tracking-tighter">{number}</span>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Tooltip */}
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 hidden group-hover:flex px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap z-50 pointer-events-none shadow-2xl border border-white/10 scale-0 group-hover:scale-100 transition-transform origin-top">
                {isFloater ? '🌊 Floater' : '🏢 Designated'} · {number} · {isBooked ? 'Taken' : 'Free'}
            </div>
        </motion.div>
    );
};

interface SeatGridProps {
    seats: any[];
    onBook: (seatId: string) => void;
    loading: boolean;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, onBook, loading }) => {
    const designatedSeats = seats.filter(s => !s.isFloater);
    const floaterSeats = seats.filter(s => s.isFloater);

    const SectionHeader = ({ title, color, icon: Icon, subtitle, count, bookedCount }: any) => (
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-2xl ${color} text-white shadow-xl`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-3xl font-black tabular-nums text-slate-800 dark:text-white">
                    {count - bookedCount}
                    <span className="text-slate-400 text-lg font-bold">/{count}</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Available</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-16">
            {/* Designated Zone */}
            <div>
                <SectionHeader
                    title="Designated Zone"
                    color="bg-indigo-600"
                    icon={Building2}
                    subtitle="Active Batch Allocation · Seats S-1 to S-40"
                    count={designatedSeats.length}
                    bookedCount={designatedSeats.filter((s: any) => s.isBooked).length}
                />
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
                    {designatedSeats.map((seat: any) => (
                        <SeatItem key={seat._id} {...seat} onBook={onBook} loading={loading} />
                    ))}
                </div>
            </div>

            {/* Floater Zone */}
            <div>
                <SectionHeader
                    title="Floater Zone"
                    color="bg-emerald-600"
                    icon={Anchor}
                    subtitle="Dynamic Buffer Pool · Seats S-41 to S-50"
                    count={floaterSeats.length}
                    bookedCount={floaterSeats.filter((s: any) => s.isBooked).length}
                />
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
                    {floaterSeats.map((seat: any) => (
                        <SeatItem key={seat._id} {...seat} onBook={onBook} loading={loading} />
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-10 pt-12 border-t border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
                <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-white dark:bg-slate-900 border-2 border-indigo-300/50 rounded-lg" />
                    <span>Designated — Free</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300/50 rounded-lg" />
                    <span>Floater — Free</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg" />
                    <span>Booked</span>
                </div>
                <div className="flex items-center space-x-3 text-emerald-600">
                    <div className="w-5 h-5 bg-emerald-600 border-2 border-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20" />
                    <span>Your Position</span>
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;
