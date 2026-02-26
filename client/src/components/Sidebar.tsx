import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    CalendarCheck,
    ShieldAlert,
    LogOut,
    Sun,
    Moon,
    ChevronRight,
    Wifi,
    Zap,
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    const navItems = [
        { to: '/', label: 'Seat Map', icon: LayoutGrid, color: 'text-indigo-400', activeBg: 'bg-indigo-600' },
        { to: '/bookings', label: 'My Bookings', icon: CalendarCheck, color: 'text-emerald-400', activeBg: 'bg-emerald-600' },
    ];
    if (user?.role === 'ADMIN') {
        navItems.push({ to: '/dashboard', label: 'Admin Panel', icon: ShieldAlert, color: 'text-red-400', activeBg: 'bg-red-600' });
    }

    const batchLabel = user?.batch === 'BATCH_1' ? 'Batch 1' : 'Batch 2';
    const batchColor = user?.batch === 'BATCH_1' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-72 flex flex-col z-50 border-r border-white/5 transition-colors duration-500"
            style={{ background: 'linear-gradient(180deg, #0c1224 0%, #080d1a 100%)' }}>

            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-72 h-72 opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 40% 20%, #6366f1 0%, transparent 60%)' }} />

            {/* Logo */}
            <div className="relative px-8 pt-8 pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
                        <LayoutGrid size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight leading-none">SmartSeat</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Office Management</p>
                    </div>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em]">System Online</span>
                </div>
            </div>

            {/* Nav section label */}
            <div className="px-8 mb-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Navigation</p>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to}
                        className={({ isActive }) => `
                            group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                            ${isActive
                                ? `${item.activeBg} text-white shadow-lg`
                                : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={`transition-all ${isActive ? 'text-white' : item.color}`} />
                                    <span className="font-semibold text-sm">{item.label}</span>
                                </div>
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                            <ChevronRight size={14} className="text-white/70" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="px-4 pb-6 space-y-3">

                {/* Batch schedule info */}
                <div className="mx-0 p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Zap size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Schedule</span>
                    </div>
                    <p className="text-xs font-bold text-slate-300">
                        W1: Mon-Wed → B1 · Thu-Fri → B2
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        W2: Reversed alternating
                    </p>
                </div>

                {/* Profile Card */}
                <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                            {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm truncate">{user?.firstName} {user?.lastName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${batchColor}`}>
                                    {batchLabel}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold truncate">{user?.squadName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={toggleTheme}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/3 border border-white/5 text-slate-400 hover:text-white hover:bg-white/8 transition-all text-xs font-bold">
                        {theme === 'light'
                            ? <><Moon size={14} /> Dark</>
                            : <><Sun size={14} /> Light</>
                        }
                    </button>
                    <button onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all text-xs font-bold">
                        <LogOut size={14} /> Logout
                    </button>
                </div>

                {/* Connection status */}
                <div className="flex items-center justify-center gap-2 py-1">
                    <Wifi size={10} className="text-slate-600" />
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Connected to SmartSeat Cloud</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
