'use client';

import React from 'react';
import { Scale } from '../data/handpanScales';
import { Language } from '../constants/translations';
import Digipan9 from './Digipan9';
import Digipan10 from './Digipan10';
import Digipan11 from './Digipan11';

interface MiniDigiPanProps {
    scale: Scale;
    language: Language;
}

export default function MiniDigiPan({ scale, language }: MiniDigiPanProps) {

    // Determine which component to render based on note count
    const totalNotes = 1 + scale.notes.top.length + scale.notes.bottom.length;
    const is10Notes = totalNotes === 10;
    const is11Notes = totalNotes === 11;

    const commonProps = {
        scale: scale,
        isCameraLocked: true as const,
        showControls: false as const,
        showInfoPanel: false as const,
        initialViewMode: 3 as const,
        enableZoom: false as const,
        enablePan: false as const,
        showLabelToggle: true as const,
    };

    // Responsive Container Logic for Digipan 11
    const [isVerticalLayout, setIsVerticalLayout] = React.useState(false);

    React.useEffect(() => {
        const checkLayout = () => {
            // Match the breakpoint used in Digipan11 (1280px)
            setIsVerticalLayout(window.innerWidth < 1280);
        };
        checkLayout();
        window.addEventListener('resize', checkLayout);
        return () => window.removeEventListener('resize', checkLayout);
    }, []);

    // For 11-note scales in Vertical Layout, use a taller aspect ratio
    // Normal: aspect-square (1:1)
    // Vertical 11: aspect-[5/8] (approx 1:1.6) to allow vertical stacking
    const containerClass = (is11Notes && isVerticalLayout)
        ? "w-full aspect-[5/8] max-h-[800px] relative rounded-2xl overflow-hidden bg-white -mt-2"
        : "w-full aspect-square max-h-[500px] md:max-h-[700px] relative rounded-2xl overflow-hidden bg-white -mt-2";

    return (
        <div className={containerClass}>
            {is11Notes ? (
                <Digipan11 {...commonProps} />
            ) : is10Notes ? (
                <Digipan10 {...commonProps} />
            ) : (
                <Digipan9 {...commonProps} />
            )}
        </div>
    );
}
