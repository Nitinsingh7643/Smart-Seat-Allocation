import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { format, subDays, parseISO } from 'date-fns';
import Layout from '../components/Layout';
import {
    TrendingUp,
    Users,
    LayoutGrid,
    ArrowRight,
    ShieldAlert,
    Zap,
    Activity,
    CalendarCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [dateRange, setDateRange] = useState({
        start: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await bookingService.getUtilization(dateRange.start, dateRange.end);
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [dateRange]);

    const StatCard = ({ title, value, subtext, icon: Icon, color, delay = 0 }: any) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0C0C0C] border border-slate-200 dark:border-white/10 shadow-2xl group flex flex-col justify-between"
        >
            <div className={`absolute -right-8 -bottom-8 w-40 h-40 ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-700`} />
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-2">{title}</h4>
                    <p className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-[#F0F0F0] tracking-tighter tabular-nums">{value}</p>
                </div>
                <div className={`p-4 rounded-xl ${color.replace('bg-', 'bg-opacity-10 dark:bg-opacity-20 text-')} text-${color.replace('bg-', '')}`}>
                    <Icon size={28} />
                </div>
            </div>
            <p className="text-slate-500 font-semibold text-xs tracking-wide">{subtext}</p>
        </motion.div>
    );

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0C0C0C]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{format(parseISO(label), 'MMM do, yyyy')}</p>
                    <p className="text-white font-black text-xl flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2A7DE1]" />
                        {payload[0].value} <span className="text-sm font-medium text-slate-400 ml-1">Allocations</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Layout>
            <div className="flex flex-col space-y-12 pb-20 max-w-7xl mx-auto">
                {/* Header Sequence */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200 dark:border-white/5">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Aether Core Active
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-[#F0F0F0] tracking-tighter uppercase leading-none">
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A7DE1] to-[#FF00FF]">Telemetry</span>
                        </h2>
                    </div>

                    {/* Futuristic Date Picker */}
                    <div className="flex items-center gap-4 bg-white dark:bg-[#0C0C0C] p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
                        <div className="px-4 text-slate-400">
                            <CalendarCheck size={20} />
                        </div>
                        <input
                            type="date"
                            className="bg-transparent border-none text-sm font-bold text-slate-800 dark:text-white focus:ring-0 cursor-pointer"
                            value={dateRange.start}
                            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <ArrowRight size={16} className="text-slate-300 dark:text-slate-600" />
                        <input
                            type="date"
                            className="bg-transparent border-none text-sm font-bold text-slate-800 dark:text-white focus:ring-0 cursor-pointer pr-4"
                            value={dateRange.end}
                            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Efficiency Rating"
                        value={`${stats ? stats.utilizationPercentage.toFixed(1) : '0'}%`}
                        subtext="Aggregated Workspace Occupancy"
                        icon={TrendingUp}
                        color="bg-emerald-500"
                        delay={0.1}
                    />
                    <StatCard
                        title="Gross Allocations"
                        value={stats ? stats.bookingsCount : '0'}
                        subtext="Confirmed Seat Reservations"
                        icon={Users}
                        color="bg-[#2A7DE1]"
                        delay={0.2}
                    />
                    <StatCard
                        title="Node Capacity"
                        value={stats ? stats.totalPossibleSlots : '0'}
                        subtext="Maximum Theoretical Yield"
                        icon={LayoutGrid}
                        color="bg-[#FF00FF]"
                        delay={0.3}
                    />
                </div>

                {/* Visualizations Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">

                    {/* Area Chart: Time-Series */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2 relative p-8 rounded-3xl bg-white dark:bg-[#0C0C0C] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="text-[#2A7DE1]" size={24} />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Allocation Flux</h3>
                        </div>
                        <div className="flex-1 w-full relative">
                            {stats?.dailyTrends?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2A7DE1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#2A7DE1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(val) => format(parseISO(val), 'MMM d')}
                                            axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="count" stroke="#2A7DE1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-sm">No Signal Detected</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Bar Chart: Squad Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                        className="relative p-8 rounded-3xl bg-white dark:bg-[#0C0C0C] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Zap className="text-[#E5E500]" size={24} />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Squad Rankings</h3>
                        </div>
                        <div className="flex-1 w-full relative">
                            {stats?.squadStats?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.squadStats} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} width={80} />
                                        <RechartsTooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (<div className="bg-[#0C0C0C] border border-white/10 px-3 py-2 rounded-lg text-white font-bold text-xs"><span className="text-[#E5E500] mr-2">{payload[0].payload.name}:</span>{payload[0].value}</div>);
                                            } return null;
                                        }} />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                            {stats.squadStats.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#E5E500' : '#334155'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-sm text-center">Awaiting Dataset Input</div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Policy Console */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                    className="p-8 lg:p-12 rounded-3xl bg-slate-900 dark:bg-[#080808] border border-white/5 shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] mix-blend-overlay pointer-events-none">
                        <ShieldAlert size={400} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Automated Policy Matrix</h3>
                            <p className="text-slate-500 font-semibold text-sm">System parameters currently enforced by Aether Rules Engine.</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-sm">Weekend Ban: Active</span>
                            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-sm">14-Day Limit: Active</span>
                            <span className="px-4 py-2 rounded-xl bg-[#2A7DE1]/20 border border-[#2A7DE1]/40 text-[#2A7DE1] font-bold text-xs uppercase tracking-widest backdrop-blur-sm">Floater Pool: Autopilot</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </Layout>
    );
};

export default Dashboard;
