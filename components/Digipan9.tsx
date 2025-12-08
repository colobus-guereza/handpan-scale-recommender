'use client';

import React from 'react';
import Digipan3D from './Digipan3D';
import { Scale } from '../data/handpanScales';

interface Digipan9Props {
    scale?: Scale | null;
    onScaleSelect?: (scale: Scale) => void;
    onNoteClick?: (noteId: number) => void; // Optional, might not do anything in visual-only mode
    isCameraLocked?: boolean;
    extraControls?: React.ReactNode;
    notes?: any[]; // Allow passing notes for editor mode
}

export default function Digipan9({
    scale,
    onScaleSelect,
    onNoteClick,
    isCameraLocked = false,
    extraControls,
    notes = [] // Default to empty if not provided, but parent provides it now
}: Digipan9Props) {

    // Digipan 9 Mode
    // If notes are provided (Editor Mode), use them. 
    // Otherwise empty (Image Only Mode fallback).

    return (
        <Digipan3D
            notes={notes}
            scale={scale}
            isCameraLocked={isCameraLocked}
            onNoteClick={onNoteClick}
            onScaleSelect={onScaleSelect}
            backgroundImage="/images/9notes.png"
            extraControls={extraControls}
            noteCountFilter={9}
        />
    );
}
