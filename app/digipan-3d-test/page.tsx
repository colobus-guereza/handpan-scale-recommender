'use client';

import React from 'react';
import Digipan3D from '../../components/Digipan3D';

const sampleNotes = [
    {
        id: 0,
        label: 'D',
        cx: 500,
        cy: 500,
        scale: 389.7,
        rotate: 90,
        labelX: undefined,
        labelY: 514,
        labelOffset: 25,
        symbolX: 945,
        symbolY: undefined,
        symbolOffset: 15,
        symbolLeftX: 59,
        symbolLeftY: undefined,
        symbolLeftOffset: 15,
        symbolBottomX: undefined,
        symbolBottomY: 665,
        symbolBottomOffset: 15,
        position: 'center' as const,
        angle: 0
    },
    {
        id: 1,
        label: 'A3',
        cx: 661,
        cy: 779,
        scale: 286,
        rotate: 121,
        labelX: undefined,
        labelY: 886,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 2,
        label: 'Bb3',
        cx: 335,
        cy: 776,
        scale: 285,
        rotate: 61,
        labelX: undefined,
        labelY: 884,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 3,
        label: 'C4',
        cx: 813,
        cy: 595,
        scale: 253,
        rotate: 128,
        labelX: undefined,
        labelY: 697,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 4,
        label: 'D4',
        cx: 195,
        cy: 594,
        scale: 249,
        rotate: 47,
        labelX: undefined,
        labelY: 699,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 5,
        label: 'E4',
        cx: 808,
        cy: 358,
        scale: 237,
        rotate: 55,
        labelX: undefined,
        labelY: 453,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 6,
        label: 'F4',
        cx: 204,
        cy: 366,
        scale: 238,
        rotate: 125,
        labelX: undefined,
        labelY: 458,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 7,
        label: 'G4',
        cx: 630,
        cy: 201,
        scale: 226,
        rotate: 48,
        labelX: undefined,
        labelY: 295,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
    {
        id: 8,
        label: 'A4',
        cx: 363,
        cy: 200,
        scale: 232,
        rotate: 133,
        labelX: undefined,
        labelY: 295,
        labelOffset: 25,
        position: 'top' as const,
        angle: 0
    },
];

export default function Digipan3DTestPage() {
    return (
        <div className="w-full h-screen bg-white">
            <Digipan3D
                notes={sampleNotes}
                onNoteClick={(id) => console.log(`Clicked note ${id}`)}
            />
        </div>
    );
}
