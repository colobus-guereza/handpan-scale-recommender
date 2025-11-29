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
        // 각 버튼별 다크모드 호버 색상
        const darkHoverColors: Record<string, { border: string; icon: string; text: string; shadow: string }> = {
            'jamming': {
                border: 'dark:hover:border-[#48FF00]/10',
                icon: 'dark:group-hover:text-[#48FF00]',
                text: 'dark:group-hover:text-white',
                shadow: 'dark:group-hover:drop-shadow-[0_0_8px_rgba(72,255,0,0.5)]'
            },
            'meditation': {
                border: 'dark:hover:border-[#DDA0DD]/10',
                icon: 'dark:group-hover:text-[#DDA0DD]',
                text: 'dark:group-hover:text-white',
                shadow: 'dark:group-hover:drop-shadow-[0_0_8px_rgba(221,160,221,0.5)]'
            },
            'uplift': {
                border: 'dark:hover:border-[#FCFF48]/10',
                icon: 'dark:group-hover:text-[#FCFF48]',
                text: 'dark:group-hover:text-white',
                shadow: 'dark:group-hover:drop-shadow-[0_0_8px_rgba(252,255,72,0.5)]'
            },
            'exotic': {
                border: 'dark:hover:border-[#FFB6C1]/20',
                icon: 'dark:group-hover:text-[#FFB6C1]',
                text: 'dark:group-hover:text-white',
                shadow: 'dark:group-hover:drop-shadow-[0_0_8px_rgba(255,182,193,0.6)]'
            }
        };

        const darkColors = darkHoverColors[vibeId] || darkHoverColors['jamming'];

        return {
            bg: 'glass-card hover:bg-indigo-50 dark:hover:bg-white/5',
            border: `border-glass-border hover:border-indigo-300 ${darkColors.border}`,
            iconColor: `text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 ${darkColors.icon} group-hover:drop-shadow-sm ${darkColors.shadow}`,
            textColor: `text-slate-600 dark:text-slate-300 group-hover:text-slate-900 ${darkColors.text} group-hover:drop-shadow-sm dark:group-hover:drop-shadow-md`
        };
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            className={`group relative flex flex-col items-center justify-center p-9 ${hoverStyles.bg} border-2 ${hoverStyles.border} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${vibe.id === 'exotic' ? 'dark:group-hover:bg-exotic-gradient/20' : ''}`}
                        >
                            {/* 반짝이는 이펙트 */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                                <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
