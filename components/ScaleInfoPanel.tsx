'use client';

import React, { useState, useMemo } from 'react';
import { Scale, SCALES } from '../data/handpanScales';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ScaleInfoPanelProps {
    scale: Scale;
    onScaleSelect?: (scale: Scale) => void;
    noteCountFilter?: number;
    className?: string; // For positioning
    isMobileButtonLayout?: boolean; // To adjust position if needed (or we handle it via className)
    defaultExpanded?: boolean;
}

export default function ScaleInfoPanel({
    scale,
    onScaleSelect,
    noteCountFilter = 10,
    className = '',
    isMobileButtonLayout = false,
    defaultExpanded = true
}: ScaleInfoPanelProps) {
    const [isInfoExpanded, setIsInfoExpanded] = useState(defaultExpanded);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Scale Filter based on noteCountFilter and Search Query
    const filteredScales = useMemo(() => {
        return SCALES.filter(s => {
            const totalNotes = 1 + s.notes.top.length + s.notes.bottom.length;
            const matchesCount = totalNotes === noteCountFilter;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCount && matchesSearch;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [noteCountFilter, searchQuery]);

    return (
        <div className={`bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl text-white shadow-xl z-20 transition-all duration-300 ease-in-out pointer-events-auto ${isInfoExpanded ? 'p-5 max-w-sm' : 'p-3 max-w-[200px]'} ${className}`}>
            <div className="flex justify-between items-start mb-1">
                <div>
                    <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Current Scale</h3>
                    {!isInfoExpanded && (
                        <div className="text-sm font-bold text-blue-100 truncate mt-0.5">{scale.name}</div>
                    )}
                </div>
                <button
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    className="text-slate-400 hover:text-white transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-slate-700"
                >
                    {isInfoExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    )}
                </button>
            </div>

            {isInfoExpanded && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                        <div className="text-xl font-bold text-blue-100">{scale.name}</div>
                        <button
                            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 transition-colors"
                            title="Change Scale"
                        >
                            Change
                        </button>
                    </div>

                    {isSelectorOpen && (
                        <div className="mb-4 flex flex-col max-h-60 bg-slate-800/50 rounded border border-slate-700/50">
                            {/* Search Input */}
                            <div className="p-2 border-b border-slate-700/50">
                                <input
                                    type="text"
                                    placeholder="Search scales..."
                                    className="w-full p-2 text-sm bg-slate-700/50 rounded border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            {/* Scrollable Scale List */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar p-1 relative z-50">
                                {filteredScales.length === 0 ? (
                                    <div className="p-4 text-center text-slate-400 text-xs">
                                        No scales found.
                                    </div>
                                ) : (
                                    filteredScales.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            className={`w-full px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-700/50 flex justify-between items-center transition-colors text-left ${scale?.id === s.id
                                                ? 'bg-blue-900/40 text-blue-200 border border-blue-500/30'
                                                : 'text-slate-300 border border-transparent'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("Selected scale:", s.name);
                                                if (onScaleSelect) {
                                                    onScaleSelect(s);
                                                    setIsSelectorOpen(false);
                                                }
                                            }}
                                        >
                                            <span>{s.name}</span>
                                            {scale?.id === s.id && <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">Active</span>}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 1. Classification Vectors */}
                        <div className="space-y-1.5">
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-slate-800/50 p-2 rounded text-center flex flex-col items-center justify-center">
                                    <span className="text-slate-400 text-[10px] uppercase mb-0.5">Mood</span>
                                    <span className="font-medium text-blue-200 leading-tight">
                                        {(scale.vector?.minorMajor ?? 0) < 0 ? 'Minor' : 'Major'}
                                        <div className="opacity-75 text-[10px]">({scale.vector?.minorMajor ?? 0})</div>
                                    </span>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded text-center flex flex-col items-center justify-center">
                                    <span className="text-slate-400 text-[10px] uppercase mb-0.5">Tone</span>
                                    <span className="font-medium text-blue-200 leading-tight">
                                        {(scale.vector?.pureSpicy ?? 0) <= 0.5 ? 'Pure' : 'Spicy'}
                                        <div className="opacity-75 text-[10px]">({scale.vector?.pureSpicy ?? 0})</div>
                                    </span>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded text-center flex flex-col items-center justify-center">
                                    <span className="text-slate-400 text-[10px] uppercase mb-0.5">Popularity</span>
                                    <span className="font-medium text-blue-200 leading-tight">
                                        {(scale.vector?.rarePopular ?? 0) <= 0.5 ? 'Rare' : 'Popular'}
                                        <div className="opacity-75 text-[10px]">({scale.vector?.rarePopular ?? 0})</div>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Notes Info */}
                        <div className="text-sm space-y-1.5 bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 font-bold text-xs uppercase tracking-wide w-12 shrink-0">Ding</span>
                                <span className="font-bold text-lg text-white">{scale.notes.ding}</span>
                            </div>
                            <div className="flex items-start gap-2 pt-1 border-t border-slate-700/50">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-wide w-12 shrink-0 mt-0.5">Scale</span>
                                <div className="font-medium text-slate-200 text-sm leading-relaxed">
                                    {scale.notes.top.join(', ')}
                                    {scale.notes.bottom.length > 0 && (
                                        <>
                                            <span className="text-xs text-slate-500 mx-1">•</span>
                                            <span className="text-slate-400">
                                                {scale.notes.bottom.join(', ')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Tags */}
                        {scale.tags && scale.tags.length > 0 && (
                            <div className="pt-1">
                                <div className="flex flex-wrap gap-1.5">
                                    {scale.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-blue-900/40 border border-blue-800/50 px-2 py-0.5 rounded-full text-blue-200">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
