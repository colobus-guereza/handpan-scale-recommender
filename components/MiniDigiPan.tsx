'use client';

import React, { useMemo } from 'react';
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
    const NoteComponent = useMemo(() => {
        const topNotesCount = scale.notes.top.length;
        // D Kurd 9 (1 Ding + 8 Top = 9) or any 9-note scale logic
        // D Kurd 10 (1 Ding + 9 Top = 10) logic

        // Simple logic: check if it's 10 notes (Ding + 9 Top) or more?
        // Digipan10 is designed for the 10-note template (1 Ding + 9 Top = 10 Total)
        // Digipan9 is designed for the 9-note template (1 Ding + 8 Top = 9 Total)

        // We can check scale.name or count notes.
        // Assuming 'scale.notes.top' contains the top notes.
        // Total notes = 1 (Ding) + top.length + bottom.length

        const totalNotes = 1 + scale.notes.top.length + scale.notes.bottom.length;

        if (totalNotes === 10) {
            return Digipan10;
        }

        // Default to Digipan9 for 9 notes or fallback
        // Current requirement is mainly to support 9 and 10 notes 3D view
        return Digipan9;
    }, [scale]);

    return (
        <div className="w-full h-[500px] md:h-[700px] relative rounded-2xl overflow-hidden bg-white -mt-2">
            <NoteComponent
                scale={scale}
                isCameraLocked={true}
                showControls={false}
                showInfoPanel={false}
                initialViewMode={3}
                enableZoom={false}
                enablePan={false}
                showLabelToggle={true}
            />
        </div>
    );
}
