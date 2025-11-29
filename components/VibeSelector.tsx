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

export const VIBES: Vibe[] = [
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
        title: '밝은 분위기',
        description: '',
        icon: <Sun className="w-6 h-6 text-slate-400" />,
        target: { minorMajor: 0.9, pureSpicy: 0.1 } // D Sabye like
    },
    {
        id: 'exotic',
        title: '딥 에스닉',
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
                    bg: 'bg-gradient-to-br from-emerald-50/50 to-white group-hover:from-emerald-50 group-hover:to-emerald-100/50',
                    border: 'border-emerald-200/50 hover:border-emerald-400/60',
                    iconColor: 'text-emerald-600 group-hover:text-emerald-700',
                    textColor: 'text-slate-700 group-hover:text-emerald-800'
                };
            case 'meditation':
                return {
                    bg: 'bg-gradient-to-br from-purple-50/50 to-white group-hover:from-purple-50 group-hover:to-purple-100/50',
                    border: 'border-purple-200/50 hover:border-purple-400/60',
                    iconColor: 'text-purple-600 group-hover:text-purple-700',
                    textColor: 'text-slate-700 group-hover:text-purple-800'
                };
            case 'uplift':
                return {
                    bg: 'bg-gradient-to-br from-amber-50/50 to-white group-hover:from-amber-50 group-hover:to-amber-100/50',
                    border: 'border-amber-200/50 hover:border-amber-400/60',
                    iconColor: 'text-amber-600 group-hover:text-amber-700',
                    textColor: 'text-slate-700 group-hover:text-amber-800'
                };
            case 'exotic':
                return {
                    bg: 'bg-gradient-to-br from-rose-50/30 via-pink-50/30 to-orange-50/30 group-hover:from-rose-50/60 group-hover:via-pink-50/60 group-hover:to-orange-50/60',
                    border: 'border-rose-200/50 hover:border-rose-400/60',
                    iconColor: 'text-rose-600 group-hover:text-rose-700',
                    textColor: 'text-slate-700 group-hover:text-rose-800'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-slate-50/50 to-white group-hover:from-slate-100/50 group-hover:to-slate-50',
                    border: 'border-slate-200 hover:border-slate-300',
                    iconColor: 'text-slate-600 group-hover:text-slate-700',
                    textColor: 'text-slate-700 group-hover:text-slate-900'
                };
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-4 gap-6">
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
                            className={`group relative flex flex-col items-center justify-center p-9 ${hoverStyles.bg} border-2 ${hoverStyles.border} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
                        >
                            {/* 반짝이는 이펙트 */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                                <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="relative z-10 mb-4 transition-all duration-300">
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    {React.cloneElement(vibe.icon as React.ReactElement, { className: `w-16 h-16 ${hoverStyles.iconColor} transition-all duration-300` })}
                                </div>
                            </div>
                            <h3 className={`relative z-10 text-2xl font-bold ${hoverStyles.textColor} tracking-tight transition-colors duration-300`}>
                                {vibe.title}
                            </h3>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
