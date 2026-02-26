import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
    BarChart3, Lock, Zap, Building2, RefreshCw, CalendarDays,
    ArrowRight, CheckCircle2, Sparkles, Sun, Moon,
    Users, Clock, TrendingUp, Shield
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
    { icon: BarChart3, label: 'Real-Time Analytics', desc: '78% avg utilization tracked live', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: Lock, label: 'Zero Conflicts', desc: 'Rule-engine prevents double booking', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Zap, label: 'Instant Confirm', desc: 'Sub-200ms seat reservation', color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { icon: Building2, label: 'Batch Scheduling', desc: 'Week-alternating A/B rotation', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: RefreshCw, label: 'Dynamic Floater Pool', desc: 'Released seats auto-added after 3PM', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: CalendarDays, label: '14-Day Horizon', desc: 'Book up to 2 weeks in advance', color: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
];

const STATS = [
    { value: '50', label: 'Seats Managed', icon: Users },
    { value: '<200ms', label: 'Booking Speed', icon: Clock },
    { value: '99.9%', label: 'Uptime SLA', icon: TrendingUp },
    { value: 'JWT', label: 'Secured Auth', icon: Shield },
];

// Animated seat grid preview
const SeatGrid: React.FC = () => {
    const [booked, setBooked] = useState<Set<number>>(new Set([0, 1, 4, 7]));
    const [pulse, setPulse] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const idx = Math.floor(Math.random() * 9);
            setPulse(idx);
            setTimeout(() => {
                setBooked(prev => {
                    const next = new Set(prev);
                    if (next.has(idx)) next.delete(idx); else next.add(idx);
                    return next;
                });
                setTimeout(() => setPulse(null), 300);
            }, 300);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                    key={i}
                    animate={pulse === i
                        ? { scale: [1, 0.85, 1.1, 1], opacity: [1, 0.5, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.4 }}
                    className={`h-14 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-colors duration-500 ${booked.has(i)
                            ? 'bg-slate-800 border-slate-700 text-slate-500'
                            : i === 8
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/40'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/30'
                        }`}
                >
                    {booked.has(i) ? '✕' : i === 8 ? '●' : `S-${i + 1}`}
                </motion.div>
            ))}
        </div>
    );
};

const Landing: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
    const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
        mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
    };

    return (
        <div className="min-h-screen bg-[#060a14] text-slate-100 overflow-x-hidden" onMouseMove={handleMouseMove}>

            {/* Background grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />

            {/* Ambient glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)' }} />
            <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)' }} />

            {/* ── Navbar ── */}
            <nav className="relative z-50 flex justify-between items-center px-8 lg:px-16 py-5 border-b border-white/5 backdrop-blur-xl bg-[#060a14]/60">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
                        <Building2 size={16} className="text-white" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">SmartSeat</span>
                    <span className="hidden sm:block ml-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        v2.0
                    </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-5">
                    <button onClick={toggleTheme}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                        Sign in
                    </Link>
                    <Link to="/signup"
                        className="flex items-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40">
                        Get Started <ArrowRight size={14} />
                    </Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-20">
                {/* Left */}
                <div className="lg:w-1/2 space-y-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Sparkles size={12} /> Intelligent Office Management
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                            Smart Seats.
                            <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Zero Conflict.
                            </span>
                            <br />
                            <span className="text-slate-400">Always Live.</span>
                        </h1>

                        <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed mt-6">
                            Hybrid workforce seat management with dynamic floater pools, batch scheduling,
                            and real-time availability built for modern offices.
                        </p>
                    </motion.div>

                    <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2.5 px-7 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all">
                                Start Booking <ArrowRight size={16} />
                            </motion.button>
                        </Link>
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2.5 px-7 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all">
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div className="flex items-center gap-4 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        <div className="flex -space-x-2">
                            {['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'].map((c, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#060a14] flex items-center justify-center text-xs font-black text-white"
                                    style={{ background: c }}>
                                    {['A', 'B', 'C', 'D', 'E'][i]}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            <span className="text-white font-bold">62 demo accounts</span> seeded & ready to test
                        </p>
                    </motion.div>
                </div>

                {/* Right: Interactive card */}
                <motion.div className="lg:w-1/2 w-full"
                    style={{ rotateX: springY, rotateY: springX, transformStyle: 'preserve-3d' }}
                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>

                    <div className="relative rounded-3xl p-8 border border-white/10 shadow-2xl"
                        style={{ background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(8,13,26,0.95))', backdropFilter: 'blur(20px)' }}>

                        {/* Card header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Floor Map</span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">TODAY</span>
                        </div>

                        <SeatGrid />

                        {/* Stats row */}
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {[
                                { label: 'Occupied', value: '4', color: 'text-slate-400' },
                                { label: 'Available', value: '4', color: 'text-indigo-400' },
                                { label: 'Yours', value: '1', color: 'text-emerald-400' },
                            ].map(s => (
                                <div key={s.label} className="text-center p-3 rounded-xl bg-white/3 border border-white/5">
                                    <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link to="/login" className="block mt-4">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm">
                                Reserve Your Seat Now <ArrowRight size={14} />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ── Stats bar ── */}
            <section className="relative z-10 border-y border-white/5 bg-white/[0.02] py-10">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Icon size={18} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white tracking-tight">{value}</p>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 py-28">
                <div className="text-center mb-16">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">Capabilities</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                        Everything you need to
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"> run hybrid</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map(({ icon: Icon, label, desc, color, bg, border }) => (
                        <motion.div key={label}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className={`p-6 rounded-2xl border ${border} ${bg} backdrop-blur-sm cursor-default group transition-all duration-300`}>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon size={20} className="text-white" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-1.5">{label}</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="relative z-10 bg-white/[0.02] border-y border-white/5 py-28">
                <div className="max-w-7xl mx-auto px-8 lg:px-16">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Simple Process</p>
                        <h2 className="text-4xl font-black text-white">Book in 3 steps</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                        {/* Connector line */}
                        <div className="hidden lg:block absolute top-10 left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-emerald-500/50" />

                        {[
                            { num: '01', title: 'Pick a date', desc: 'Navigate up to 14 days. Weekends are auto-blocked. System validates your batch schedule.', icon: CalendarDays, color: 'from-indigo-500 to-blue-600' },
                            { num: '02', title: 'Select a seat', desc: 'Visual floor map with real-time availability. Designated zone (S-1 to S-40) or Floater zone (S-41 to S-50).', icon: Building2, color: 'from-purple-500 to-indigo-600' },
                            { num: '03', title: 'Confirm instantly', desc: 'Rule engine validates in <200ms. Seat locked instantly. No double bookings ever possible.', icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
                        ].map(({ num, title, desc, icon: Icon, color }) => (
                            <motion.div key={num} whileHover={{ y: -4 }}
                                className="relative p-8 rounded-3xl bg-white/3 border border-white/8 backdrop-blur-sm">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-xl`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <span className="absolute top-6 right-6 text-5xl font-black text-white/[0.04] select-none">{num}</span>
                                <h3 className="text-xl font-black text-white mb-3">{title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm font-medium">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 py-28 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl p-16 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>

                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

                    <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Ready to deploy?</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                            Start managing seats
                            <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">the smart way</span>
                        </h2>
                        <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">
                            62 demo accounts ready. No setup required.
                            Login instantly and see the system in action.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 mx-auto">
                                    Create Account <ArrowRight size={16} />
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                                    className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 flex items-center gap-2 mx-auto">
                                    Demo Login
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-white/5 px-8 lg:px-16 py-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Building2 size={13} className="text-white" />
                        </div>
                        <span className="font-black text-white">SmartSeat</span>
                        <span className="text-slate-600 text-sm font-medium">© 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        All systems operational
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
