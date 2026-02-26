import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, LogIn, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authService.login({ email, password });
            login(data);
            toast.success(`Welcome back, ${data.user.firstName}!`);
            setTimeout(() => navigate('/'), 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#020617] p-8 transition-colors duration-500">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-1/4 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[10rem] animate-pulse" />
            <div className="absolute bottom-0 -right-1/4 w-[35rem] h-[35rem] bg-indigo-600/10 rounded-full blur-[10rem] animate-pulse delay-700" />

            <div className="fixed top-8 right-8 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-slate-800 dark:text-white"
                >
                    {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', damping: 25 }}
                className="glass w-full max-w-lg p-12 sm:p-14 rounded-[3.5rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl z-10"
            >
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white">
                        <span className="text-blue-600 dark:text-blue-500 mr-2">■</span>SmartSeat
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Intelligent Seat Booking</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" size={24} />
                            <input
                                type="email"
                                required
                                className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Private Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" size={24} />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-blue-600/40 transition-all flex items-center justify-center space-x-3 disabled:bg-slate-300 group"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
                    <p className="text-slate-500 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">No access?</p>
                    <Link to="/signup" className="text-blue-600 font-black text-lg hover:underline decoration-blue-600 decoration-2 underline-offset-8 transition-all">Create Corporate Account</Link>
                </div>
            </motion.div>

            {/* DEMO USER QUICK LOGIN FLAP */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-white dark:bg-slate-900 border-t border-x border-slate-200 dark:border-slate-800 rounded-t-[2rem] p-6 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-blue-900/10 z-50 overflow-hidden"
            >
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Interview Demo Panel</h4>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">password123</span>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-4 custom-scrollbar">
                    <div className="min-w-fit space-y-2">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Batch 1</p>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 25 }, (_, i) => (
                                <button key={`b1-${i}`} type="button" onClick={() => { setEmail(`b1user${i + 1}@demo.com`); setPassword('password123'); }} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600">
                                    B1 U-{i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-[1px] bg-slate-200 dark:bg-slate-800" />
                    <div className="min-w-fit space-y-2">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Batch 2</p>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 25 }, (_, i) => (
                                <button key={`b2-${i}`} type="button" onClick={() => { setEmail(`b2user${i + 1}@demo.com`); setPassword('password123'); }} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600">
                                    B2 U-{i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <Toaster position="bottom-center" />
        </div>
    );
};

export default Login;
