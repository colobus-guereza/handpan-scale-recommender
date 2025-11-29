import React from 'react';
import { Sparkles, Flame, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Vibe {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    target: { minorMajor: number; pureSpicy: number };
}

const VIBES: Vibe[] = [
    {
        id: 'jamming',
        title: '입문용',
        description: '',
        icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
        target: { minorMajor: 0.7, pureSpicy: 0.05 } // G Oxalis like
    },
    {
        id: 'meditation',
        title: '요가·명상·힐링',
        description: '',
        icon: <Moon className="w-6 h-6 text-indigo-500" />,
        target: { minorMajor: -0.8, pureSpicy: 0.1 } // D Kurd like
    },
    {
        id: 'uplift',
        title: '밝은 Major',
        description: '',
        icon: <Sun className="w-6 h-6 text-amber-500" />,
        target: { minorMajor: 0.9, pureSpicy: 0.1 } // D Sabye like
    },
    {
        id: 'exotic',
        title: '개성강한분위기',
        description: '',
        icon: <Flame className="w-6 h-6 text-rose-500" />,
        target: { minorMajor: -0.3, pureSpicy: 0.7 } // Hijaz like
    }
];

interface Props {
    onSelect: (vibe: Vibe) => void;
}

export default function VibeSelector({ onSelect }: Props) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-4 gap-3">
                {VIBES.map((vibe) => (
                    <motion.button
                        key={vibe.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(vibe)}
                        className="group relative flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 mb-2 p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
                            {vibe.icon}
                        </div>
                        <h3 className="relative z-10 text-sm font-medium text-slate-700 group-hover:text-slate-900 tracking-tight transition-colors">
                            {vibe.title}
                        </h3>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
