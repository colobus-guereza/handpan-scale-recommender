'use client';

import React from 'react';
import { Scale } from '../data/handpanScales';
import { Language } from '../constants/translations';
import Digipan9 from './Digipan9';
import Digipan10 from './Digipan10';

interface MiniDigiPanProps {
    scale: Scale;
    language: Language;
}

export default function MiniDigiPan({ scale, language }: MiniDigiPanProps) {

    // Determine which component to render based on note count
    const totalNotes = 1 + scale.notes.top.length + scale.notes.bottom.length;
    const is10Notes = totalNotes === 10;

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

    return (
        <div className="w-full aspect-square max-h-[500px] md:max-h-[700px] relative rounded-2xl overflow-hidden bg-white -mt-2">
            {is10Notes ? (
                <Digipan10 {...commonProps} />
            ) : (
                <Digipan9 {...commonProps} />
            )}
        </div>
    );
}
