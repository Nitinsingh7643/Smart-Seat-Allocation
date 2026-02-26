import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#060a14] transition-colors duration-500 relative">
            {/* Global ambient glow */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] opacity-0 dark:opacity-100 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle at 80% 10%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
            <div className="fixed bottom-0 left-72 w-[600px] h-[600px] opacity-0 dark:opacity-100 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle at 30% 80%, rgba(16,185,129,0.04) 0%, transparent 60%)' }} />

            <Sidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {children}
                </motion.div>
            </main>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#0f1629',
                        color: '#e2e8f0',
                        borderRadius: '16px',
                        padding: '14px 20px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#0f1629' },
                    },
                    error: {
                        iconTheme: { primary: '#f43f5e', secondary: '#0f1629' },
                    },
                    loading: {
                        iconTheme: { primary: '#6366f1', secondary: '#0f1629' },
                    },
                }}
            />
        </div>
    );
};

export default Layout;
