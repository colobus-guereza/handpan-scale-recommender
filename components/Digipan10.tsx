'use client';

import React, { useMemo } from 'react';
import Digipan3D from './Digipan3D';
import { Scale } from '../data/handpanScales';
import { getNoteFrequency } from '../constants/noteFrequencies';

interface Digipan10Props {
    scale?: Scale | null;
    onScaleSelect?: (scale: Scale) => void;
    onNoteClick?: (noteId: number) => void;
    isCameraLocked?: boolean;
    extraControls?: React.ReactNode;
}

export default function Digipan10({
    scale,
    onScaleSelect,
    onNoteClick,
    isCameraLocked = false,
    extraControls
}: Digipan10Props) {

    // 10-Note Specific Layout (Coordinates for 10notes.png)
    const notes = useMemo(() => {
        if (!scale) return [];

        // Hardcoded Coordinates for '10notes.png'
        const userProvidedData = [
            {
                "id": 0,
                "cx": 505,
                "cy": 515,
                "scale": 202,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.3599999999999999,
                "scaleY": 1.16
            },
            {
                "id": 1,
                "cx": 643,
                "cy": 808,
                "scale": 129,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.8899999999999999
            },
            {
                "id": 2,
                "cx": 361,
                "cy": 812,
                "scale": 285,
                "rotate": 103,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.9
            },
            {
                "id": 3,
                "cx": 825,
                "cy": 620,
                "scale": 253,
                "rotate": 194,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.93
            },
            {
                "id": 4,
                "cx": 179,
                "cy": 620,
                "scale": 249,
                "rotate": 163,
                "position": "top",
                "angle": 0,
                "scaleX": 0.99,
                "scaleY": 0.91
            },
            {
                "id": 5,
                "cx": 820,
                "cy": 377,
                "scale": 237,
                "rotate": 158,
                "position": "top",
                "angle": 0,
                "scaleX": 0.9400000000000001,
                "scaleY": 0.82
            },
            {
                "id": 6,
                "cx": 178,
                "cy": 379,
                "scale": 238,
                "rotate": 28,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.85
            },
            {
                "id": 7,
                "cx": 684,
                "cy": 210,
                "scale": 201,
                "rotate": 142,
                "position": "top",
                "angle": 0,
                "scaleX": 1.02,
                "scaleY": 0.7999999999999999
            },
            {
                "id": 8,
                "cx": 301,
                "cy": 210,
                "scale": 265,
                "rotate": 57,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.83
            },
            {
                "id": 9,
                "cx": 492,
                "cy": 149,
                "scale": 220,
                "rotate": 182,
                "position": "top",
                "angle": 0,
                "scaleX": 1.23,
                "scaleY": 0.67
            }
        ];

        // Template Frequencies (D Kurd 10) - Fixed for Visual Layout
        const TEMPLATE_FREQUENCIES = [
            getNoteFrequency('D3'),  // Ding (0)
            getNoteFrequency('A3'),  // 1
            getNoteFrequency('Bb3'), // 2
            getNoteFrequency('C4'),  // 3
            getNoteFrequency('D4'),  // 4
            getNoteFrequency('E4'),  // 5
            getNoteFrequency('F4'),  // 6
            getNoteFrequency('G4'),  // 7
            getNoteFrequency('A4'),  // 8
            getNoteFrequency('C5')   // 9
        ];

        // Map Scale Frequencies to this layout
        const dingNote = {
            ...userProvidedData[0],
            label: scale.notes.ding,
            frequency: TEMPLATE_FREQUENCIES[0],
            labelOffset: 25
        };

        const topNotes = scale.notes.top.map((pitch, index) => {
            const template = userProvidedData[index + 1];
            if (!template) return null;

            return {
                ...template,
                label: pitch,
                frequency: TEMPLATE_FREQUENCIES[index + 1] || 440,
                labelOffset: 25
            };
        }).filter(n => n !== null);

        return [dingNote, ...topNotes] as any[];
    }, [scale]);

    return (
        <Digipan3D
            notes={notes}
            scale={scale}
            isCameraLocked={isCameraLocked}
            onNoteClick={onNoteClick}
            onScaleSelect={onScaleSelect}
            backgroundImage="/images/10notes.png" // Fixed Background for Digipan10
            extraControls={extraControls}
            noteCountFilter={10}
        />
    );
}
