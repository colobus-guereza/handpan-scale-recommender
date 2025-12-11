'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GripHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface DraggablePanelProps {
    children: React.ReactNode;
    title?: string;
    initialPosition?: { x: number; y: number };
    className?: string; // Applied to the expanded container
    onClose?: () => void;
    defaultExpanded?: boolean;
}

export default function DraggablePanel({
    children,
    title = 'Panel',
    initialPosition = { x: 20, y: 20 },
    className = '',
    onClose,
    defaultExpanded = false
}: DraggablePanelProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const dragOffset = useRef({ x: 0, y: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            setIsDragging(true);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={panelRef}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 1000,
            }}
            className={`flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden ${isDragging ? 'transition-none' : 'transition-all duration-300'} ${isExpanded ? className : 'w-auto h-auto'}`}
        >
            {/* Draggable Header */}
            <div
                onMouseDown={handleMouseDown}
                className="flex items-center justify-between px-3 py-2.5 bg-slate-800/80 border-b border-slate-700 cursor-move select-none active:bg-slate-800 min-w-[200px]"
            >
                <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                    <GripHorizontal size={14} className="text-slate-500" />
                    <span>{title}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            {isExpanded && (
                <div className="overflow-hidden flex-1 flex flex-col">
                    {children}
                </div>
            )}
        </div>
    );
}
