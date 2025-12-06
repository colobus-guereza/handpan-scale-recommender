'use client';

import React, { useMemo } from 'react';
import Digipan3D from '../../components/Digipan3D';
import { SCALES } from '@/data/handpanScales';

import { HANDPAN_TEMPLATES } from '@/data/handpanTemplates';

// Note Frequencies
const NOTE_FREQUENCIES: Record<string, number> = {
    'C#3': 138.59,
    'G#3': 207.65,
    'B3': 246.94,
    'C#4': 277.18,
    'D#4': 311.13,
    'E4': 329.63,
    'F#4': 369.99,
    'G#4': 415.30,
    'B4': 493.88
};

export default function Digipan3DTestPage() {
    // Select C# Amara 9 Scale
    const targetScaleId = 'cs_amara_9';
    const scale = SCALES.find(s => s.id === targetScaleId);

    const notes = useMemo(() => {
        if (!scale) return [];

        // Select Template based on note count (or explicit logic)
        // For now, defaulting to NOTES_9
        const templateData = HANDPAN_TEMPLATES.NOTES_9;

        // Ding
        const dingTemplate = templateData[0];
        const dingNote = {
            ...dingTemplate,
            label: scale.notes.ding,
            frequency: NOTE_FREQUENCIES[scale.notes.ding] || 440,
            labelOffset: 25
        };

        // Top Notes
        const topNotes = scale.notes.top.map((pitch, index) => {
            // Note indices start from 1 (0 is ding)
            const template = templateData[index + 1];
            if (!template) return null; // Should not happen if count matches

            return {
                ...template,
                label: pitch,
                frequency: NOTE_FREQUENCIES[pitch] || 440,
                labelOffset: 25
            };
        }).filter(n => n !== null);

        return [dingNote, ...topNotes];
    }, [scale]);

    return (
        <div className="w-full h-screen bg-white">
            <Digipan3D
                notes={notes as any[]} // Type casting to match strict props if needed, though structure aligns
                onNoteClick={(id) => console.log(`Clicked note ${id}`)}
                scale={scale} // Pass scale object if component uses it
            />
        </div>
    );
}
