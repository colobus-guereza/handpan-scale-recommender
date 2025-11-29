'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all duration-300 ${theme === 'dark'
                    ? 'bg-glass-light border border-glass-border text-cosmic shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-white/80 border border-slate-200 text-amber-500 shadow-md backdrop-blur-sm'
                }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? (
                <Moon className="w-5 h-5 fill-current" />
            ) : (
                <Sun className="w-5 h-5 fill-current" />
            )}
        </motion.button>
    );
}
