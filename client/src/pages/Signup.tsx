import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Mail, Lock, ArrowRight, Layers, LayoutGrid, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        confirmPassword: '', squadName: 'Squad 1', batch: 'BATCH_1', role: 'EMPLOYEE'
    });
    const [loading, setLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!"); return;
        }

        setLoading(true);
        try {
            await authService.signup(formData);
            toast.success('Account created successfully!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-24 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#020617] p-8 transition-colors duration-500">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-1/4 w-[45rem] h-[45rem] bg-indigo-600/10 rounded-full blur-[12rem] animate-pulse" />
            <div className="absolute bottom-0 -right-1/4 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[12rem] animate-pulse delay-1000" />

            <div className="fixed top-8 right-8 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-slate-800 dark:text-white"
                >
                    {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass w-full max-w-4xl p-12 sm:p-14 rounded-[4rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl z-10"
            >
                <div className="text-center mb-16 px-4">
                    <h2 className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white">
                        <span className="text-blue-600 dark:text-blue-500 mr-2">■</span>Join SmartSeat
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.25em] text-xs">Establish Corporate Identity</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <input name="firstName" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" placeholder="John" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <input name="lastName" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <input type="email" name="email" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" placeholder="john.doe@company.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Squad Designation</label>
                        <div className="relative">
                            <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <select name="squadName" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold appearance-none dark:text-white">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={`Squad ${n}`}>Squad {n}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Work Batch</label>
                        <div className="relative">
                            <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <select name="batch" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold appearance-none dark:text-white">
                                <option value="BATCH_1">Morning Batch (01)</option>
                                <option value="BATCH_2">Afternoon Batch (02)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Set Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <input type="password" name="password" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Verify Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={24} />
                            <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-600/15 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-10">
                        <motion.button
                            whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                            type="submit" disabled={loading}
                            className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl hover:shadow-2xl hover:shadow-blue-600/40 transition-all flex items-center justify-center space-x-3 disabled:bg-slate-300"
                        >
                            {loading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> :
                                <><span className="mt-1">Create Account</span><ArrowRight size={28} /></>}
                        </motion.button>
                    </div>
                </form>

                <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600 font-black ml-2 hover:underline decoration-2 underline-offset-8">Sign In</Link>
                    </p>
                </div>
            </motion.div>
            <Toaster position="bottom-center" />
        </div>
    );
};

export default Signup;
