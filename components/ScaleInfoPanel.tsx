'use client';

import React, { useState, useMemo } from 'react';
import { Scale, SCALES } from '../data/handpanScales';

interface ScaleInfoPanelProps {
    scale: Scale;
    onScaleSelect?: (scale: Scale) => void;
    noteCountFilter?: number;
    className?: string; // For positioning
    isMobileButtonLayout?: boolean; // To adjust position if needed (or we handle it via className)
    defaultExpanded?: boolean;
    showAllScales?: boolean;
}

export default function ScaleInfoPanel({
    scale,
    onScaleSelect,
    noteCountFilter = 10,
    className = '',
    isMobileButtonLayout = false,
    defaultExpanded = true,
    showAllScales = false
}: ScaleInfoPanelProps) {
    const [isInfoExpanded, setIsInfoExpanded] = useState(defaultExpanded);
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Scale Filter based on noteCountFilter and Search Query
    const filteredScales = useMemo(() => {
        return SCALES.filter(s => {
            const totalNotes = 1 + s.notes.top.length + s.notes.bottom.length;
            // If showAllScales is true, we ONLY show 9 and 10 (supported modes).
            // Otherwise, we match the strict filter.
            const matchesCount = showAllScales
                ? true
                : totalNotes === noteCountFilter;

            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCount && matchesSearch;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [noteCountFilter, searchQuery, showAllScales]);

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
                    </div>

                    {/* ALWAYS VISIBLE SEARCH & LIST */}
                    <div className="flex flex-col h-[500px] bg-slate-800/50 rounded border border-slate-700/50">
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-700/50 shrink-0">
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
                                filteredScales.map(s => {
                                    const noteCount = 1 + s.notes.top.length + s.notes.bottom.length;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            className={`w-full px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-700/50 flex justify-between items-center transition-colors text-left ${scale?.id === s.id
                                                ? 'bg-blue-900/40 text-blue-200 border border-blue-500/30'
                                                : 'text-slate-300 border border-transparent'
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("ScaleInfoPanel Clicked:", s.name);
                                                if (onScaleSelect) {
                                                    onScaleSelect(s);
                                                } else {
                                                    console.warn("onScaleSelect callback is missing!");
                                                }
                                            }}
                                        >
                                            <span>{s.name}</span>
                                            <div className="flex items-center gap-2">
                                                {/* Note Count Badge */}
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${noteCount === 9
                                                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30'
                                                    : 'bg-purple-900/40 text-purple-300 border border-purple-700/30'
                                                    }`}>
                                                    {noteCount}N
                                                </span>
                                                {scale?.id === s.id && <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">Active</span>}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
