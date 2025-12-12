'use client';

import React, { useState, useMemo } from 'react';
import { Scale, SCALES } from '../data/handpanScales';
import DraggablePanel from './DraggablePanel';
import { Filter, SortAsc, SortDesc, Search, Music2 } from 'lucide-react';

interface ScaleInfoPanelProps {
    scale: Scale;
    onScaleSelect?: (scale: Scale) => void;
    // noteCountFilter prop is deprecated in favor of internal filter, but kept for compatibility if needed
    noteCountFilter?: number;
    className?: string; // Ignored largely due to DraggablePanel fixed positioning, but kept for signature
    isMobileButtonLayout?: boolean;
    defaultExpanded?: boolean; // controlled by Panel now
    showAllScales?: boolean; // Always treated as true for this full panel
}

export default function ScaleInfoPanel({
    scale,
    onScaleSelect,
    className = '',
}: ScaleInfoPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter States
    const [activeNoteFilter, setActiveNoteFilter] = useState<number | 'ALL' | '14M'>('ALL');
    const [sortBy, setSortBy] = useState<'NAME' | 'COUNT' | 'POPULARITY'>('NAME');
    const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');

    // Dynamic Scale Filter & Sort
    const filteredScales = useMemo(() => {
        let result = SCALES.filter(s => {
            const totalNotes = 1 + s.notes.top.length + s.notes.bottom.length;

            // Note Count Filter
            let matchesCount = false;

            if (activeNoteFilter === 'ALL') {
                matchesCount = true;
            } else if (activeNoteFilter === '14M') {
                matchesCount = totalNotes === 14 && (s.id.includes('mutant') || s.tags?.includes('Mutant') || s.name.includes('Mutant'));
            } else if (activeNoteFilter === 14) {
                // 14N (Standard) - exclude mutants
                matchesCount = totalNotes === 14 && !(s.id.includes('mutant') || s.tags?.includes('Mutant') || s.name.includes('Mutant'));
            } else {
                matchesCount = totalNotes === activeNoteFilter;
            }

            // Search Filter
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCount && matchesSearch;
        });

        // Sorting
        result = result.sort((a, b) => {
            let valA: any, valB: any;

            if (sortBy === 'NAME') {
                valA = a.name;
                valB = b.name;
            } else if (sortBy === 'COUNT') {
                valA = 1 + a.notes.top.length + a.notes.bottom.length;
                valB = 1 + b.notes.top.length + b.notes.bottom.length;
            } else if (sortBy === 'POPULARITY') {
                valA = a.vector.rarePopular; // 0=Rare, 1=Popular
                valB = b.vector.rarePopular;
            }

            if (valA < valB) return sortDir === 'ASC' ? -1 : 1;
            if (valA > valB) return sortDir === 'ASC' ? 1 : -1;
            return 0;
        });

        return result;
    }, [activeNoteFilter, searchQuery, sortBy, sortDir]);

    // Dimensions for the grid container
    // We want roughly 5 columns x visible rows
    // Buttons are compact.

    return (
        <DraggablePanel
            title="Scale Selector"
            initialPosition={{ x: 20, y: 80 }} // Position top left
            className="w-[400px] h-[600px] max-h-[80vh]" // Fixed size initially
            defaultExpanded={false} // Start collapsed
        >
            <div className="flex flex-col h-full bg-slate-900 text-slate-200">
                {/* Controls Area */}
                <div className="p-3 border-b border-slate-700 bg-slate-800/50 space-y-3">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find a scale..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/50 border border-slate-600 rounded-md focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        <FilterButton label="All" active={activeNoteFilter === 'ALL'} onClick={() => setActiveNoteFilter('ALL')} />
                        <FilterButton label="9N" active={activeNoteFilter === 9} onClick={() => setActiveNoteFilter(9)} />
                        <FilterButton label="10N" active={activeNoteFilter === 10} onClick={() => setActiveNoteFilter(10)} />
                        <FilterButton label="11N" active={activeNoteFilter === 11} onClick={() => setActiveNoteFilter(11)} />
                        <FilterButton label="12N" active={activeNoteFilter === 12} onClick={() => setActiveNoteFilter(12)} />
                        <FilterButton label="14N" active={activeNoteFilter === 14} onClick={() => setActiveNoteFilter(14)} />
                        <FilterButton label="14M" active={activeNoteFilter === '14M'} onClick={() => setActiveNoteFilter('14M')} />
                    </div>

                    {/* Sort Row */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-2">
                            <span>Sort:</span>
                            <SortButton label="Name" active={sortBy === 'NAME'} onClick={() => setSortBy('NAME')} />
                            <SortButton label="Notes" active={sortBy === 'COUNT'} onClick={() => setSortBy('COUNT')} />
                            <SortButton label="Pop" active={sortBy === 'POPULARITY'} onClick={() => setSortBy('POPULARITY')} />
                        </div>
                        <button
                            onClick={() => setSortDir(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
                            className="flex items-center gap-1 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-700"
                        >
                            {sortDir === 'ASC' ? <SortAsc size={12} /> : <SortDesc size={12} />}
                        </button>
                    </div>
                </div>

                {/* Grid List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredScales.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                            No scales match your filter.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Featured: Currently Selected Scale */}
                            {scale && (
                                <div className="mb-4">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
                                        <Music2 size={12} />
                                        <span>Current Scale</span>
                                    </div>
                                    <div className="relative p-4 rounded-xl border-2 border-blue-500 bg-gradient-to-br from-blue-950 to-slate-900 shadow-lg shadow-blue-500/20">
                                        <div className="absolute top-2 right-2 flex items-center gap-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                                {(() => {
                                                    const noteCount = 1 + scale.notes.top.length + scale.notes.bottom.length;
                                                    return noteCount === 14 && (scale.id.includes('mutant') || scale.tags?.includes('Mutant')) ? '14M' : `${noteCount}N`;
                                                })()}
                                            </span>
                                            {scale.id.includes('mutant') && (
                                                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" title="Mutant" />
                                            )}
                                        </div>
                                        <div className="pr-14">
                                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                                {scale.name}
                                            </h3>
                                            <div className="text-xs text-blue-200 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400">Ding:</span>
                                                    <span className="font-mono font-semibold">{scale.notes.ding}</span>
                                                </div>
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-slate-400 font-bold w-3 text-[10px]">T</span>
                                                        <span className="font-mono text-[10px] flex-1 leading-snug">
                                                            {scale.notes.top.join(' • ')}
                                                        </span>
                                                    </div>
                                                    {scale.notes.bottom.length > 0 && (
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-slate-400 font-bold w-3 text-[10px]">B</span>
                                                            <span className="font-mono text-[10px] flex-1 leading-snug">
                                                                {scale.notes.bottom.join(' • ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grid: Other Scales */}
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 px-1">
                                    All Scales ({filteredScales.length})
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {filteredScales.map(s => {
                                        const isActive = scale?.id === s.id;
                                        const noteCount = 1 + s.notes.top.length + s.notes.bottom.length;
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => onScaleSelect && onScaleSelect(s)}
                                                className={`
                                                    relative flex flex-col items-start justify-center p-2 rounded-lg border transition-all text-left h-14 group
                                                    ${isActive
                                                        ? 'bg-blue-600/50 border-blue-400 text-white ring-2 ring-blue-500/30'
                                                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500 text-slate-300'}
                                                `}
                                            >
                                                <div className="flex items-center justify-between w-full mb-0.5">
                                                    <span className={`text-[10px] font-bold px-1.5 rounded-sm ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-900 text-slate-500'}`}>
                                                        {noteCount === 14 && (s.id.includes('mutant') || s.tags?.includes('Mutant')) ? '14M' : `${noteCount}N`}
                                                    </span>
                                                    {s.id.includes('mutant') && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Mutant" />
                                                    )}
                                                </div>
                                                <span className={`text-xs font-semibold truncate w-full ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                                    {s.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Footer */}
                <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                    <span>{filteredScales.length} scales found</span>
                    <span>Total: {SCALES.length}</span>
                </div>
            </div>
        </DraggablePanel>
    );
}

// Sub-components for cleaner render
function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`
                px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors whitespace-nowrap
                ${active
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'}
            `}
        >
            {label}
        </button>
    );
}

function SortButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`
                px-1.5 py-0.5 rounded transition-colors
                ${active ? 'text-blue-400 font-bold bg-blue-400/10' : 'hover:text-slate-200'}
            `}
        >
            {label}
        </button>
    );
}
