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
        icon: <Sparkles className="w-6 h-6 text-slate-400" />,
        target: { minorMajor: 0.7, pureSpicy: 0.05 } // G Oxalis like
    },
    {
        id: 'meditation',
        title: '요가·명상·힐링',
        description: '',
        icon: <Moon className="w-6 h-6 text-slate-400" />,
        target: { minorMajor: -0.8, pureSpicy: 0.1 } // D Kurd like
    },
    {
        id: 'uplift',
        title: '밝은 Major',
        description: '',
        icon: <Sun className="w-6 h-6 text-slate-400" />,
        target: { minorMajor: 0.9, pureSpicy: 0.1 } // D Sabye like
    },
    {
        id: 'exotic',
        title: '개성강한분위기',
        description: '',
        icon: <Flame className="w-6 h-6 text-slate-400" />,
        target: { minorMajor: -0.3, pureSpicy: 0.7 } // Hijaz like
    }
];

interface Props {
    onSelect: (vibe: Vibe) => void;
}

export default function VibeSelector({ onSelect }: Props) {
    const getHoverStyles = (vibeId: string) => {
        switch (vibeId) {
            case 'jamming':
                return {
                    border: 'hover:border-emerald-500/30',
                    iconBg: 'group-hover:bg-gradient-to-br group-hover:from-emerald-50 group-hover:to-emerald-100',
                    iconColor: 'group-hover:text-emerald-600',
                    textColor: 'group-hover:text-emerald-700'
                };
            case 'meditation':
                return {
                    border: 'hover:border-purple-500/30',
                    iconBg: 'group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-purple-100',
                    iconColor: 'group-hover:text-purple-600',
                    textColor: 'group-hover:text-purple-700'
                };
            case 'uplift':
                return {
                    border: 'hover:border-amber-500/30',
                    iconBg: 'group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-amber-100',
                    iconColor: 'group-hover:text-amber-600',
                    textColor: 'group-hover:text-amber-700'
                };
            case 'exotic':
                return {
                    border: 'hover:border-rose-500/30',
                    iconBg: 'group-hover:bg-gradient-to-br group-hover:from-rose-50 group-hover:via-pink-50 group-hover:to-orange-50',
                    iconColor: 'group-hover:text-rose-600',
                    textColor: 'group-hover:text-rose-700'
                };
            default:
                return {
                    border: 'hover:border-indigo-500/30',
                    iconBg: 'group-hover:bg-gradient-to-br group-hover:from-slate-100 group-hover:to-slate-50',
                    iconColor: 'group-hover:text-slate-600',
                    textColor: 'group-hover:text-slate-900'
                };
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-4 gap-4">
                {VIBES.map((vibe) => {
                    const hoverStyles = getHoverStyles(vibe.id);
                    return (
                        <motion.button
                            key={vibe.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(vibe)}
                            className={`group relative flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md ${hoverStyles.border} transition-all duration-300 overflow-hidden`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {/* 반짝이는 이펙트 */}
                            <div className="absolute inset-0 overflow-hidden rounded-lg">
                                <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className={`relative z-10 mb-3 p-3 bg-slate-50 rounded-lg ${hoverStyles.iconBg} transition-all duration-300`}>
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    {React.cloneElement(vibe.icon as React.ReactElement, { className: `w-9 h-9 text-slate-400 ${hoverStyles.iconColor} transition-all duration-300` })}
                                </div>
                            </div>
                            <h3 className={`relative z-10 text-lg font-bold text-slate-700 ${hoverStyles.textColor} tracking-tight transition-colors`}>
                                {vibe.title}
                            </h3>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
