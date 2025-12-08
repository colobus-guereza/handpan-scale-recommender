'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Digipan10 from '../../components/Digipan10';
import Digipan9 from '../../components/Digipan9';
import { SCALES } from '@/data/handpanScales';
import { Grid, Monitor } from 'lucide-react';
import { useControls, button } from 'leva';
import { getNoteFrequency } from '@/constants/noteFrequencies';

export default function Digipan3DTestPage() {
    // Mode State: '9' (Image Only) or '10' (Full Implementation)
    const [mode, setMode] = useState<'9' | '10'>('9');

    // Dynamic Scale Selection State
    const [selectedScaleId, setSelectedScaleId] = useState<string>('d_kurd_9');

    // Derived Scale Object
    const scale = SCALES.find(s => s.id === selectedScaleId) || SCALES[0];

    // Handle Scale Change
    const handleScaleSelect = React.useCallback((newScale: any) => {
        console.log("Scale selected in Page:", newScale.name);
        setSelectedScaleId(newScale.id);
    }, []);

    // -------------------------------------------------------------------------
    // Digipan 9 Logic (Editor Mode)
    // -------------------------------------------------------------------------

    // Initial Data for Digipan 9 (Updated from User Screenshot)
    const initialNotes9 = useMemo(() => {
        return [
            { "id": 0, "cx": 513, "cy": 528, "scale": 0, "rotate": 89, "position": "center", "angle": 0, "scaleX": 1.43, "scaleY": 1.22 },
            { "id": 1, "cx": 662, "cy": 808, "scale": 0, "rotate": 66, "position": "top", "angle": 0, "scaleX": 1.00, "scaleY": 0.89 },
            { "id": 2, "cx": 349, "cy": 810, "scale": 0, "rotate": 107, "position": "top", "angle": 0, "scaleX": 1.04, "scaleY": 0.87 },
            { "id": 3, "cx": 843, "cy": 589, "scale": 0, "rotate": 187, "position": "top", "angle": 0, "scaleX": 0.89, "scaleY": 0.91 },
            { "id": 4, "cx": 172, "cy": 599, "scale": 0, "rotate": 154, "position": "top", "angle": 0, "scaleX": 1.10, "scaleY": 0.91 },
            { "id": 5, "cx": 788, "cy": 316, "scale": 0, "rotate": 145, "position": "top", "angle": 0, "scaleX": 1.03, "scaleY": 0.94 },
            { "id": 6, "cx": 201, "cy": 350, "scale": 0, "rotate": 148, "position": "top", "angle": 0, "scaleX": 1.20, "scaleY": 0.79 },
            { "id": 7, "cx": 594, "cy": 184, "scale": 0, "rotate": 188, "position": "top", "angle": 0, "scaleX": 1.27, "scaleY": 0.77 },
            { "id": 8, "cx": 370, "cy": 195, "scale": 0, "rotate": 144, "position": "top", "angle": 0, "scaleX": 1.18, "scaleY": 0.78 }
        ];
    }, []);

    // Ref to hold the latest active notes for the export button callback
    // This bypasses Leva's 'get' issues and closure staleness
    const activeNotes9Ref = useRef<any[]>([]);

    // Feedback State for Export Button
    const [copySuccess9, setCopySuccess9] = useState(false);

    // Leva Schema generation for Mode 9
    const dynamicSchema9 = useMemo(() => {
        if (mode !== '9') return {}; // Don't show controls in Mode 10

        const s: any = {};
        initialNotes9.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1000, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1000, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess9 ? '✅ Copied!' : 'Export JSON (9)';

        s[buttonLabel] = button(() => {
            // Use the Ref to get the LATEST values
            const currentNotes = activeNotes9Ref.current;

            const exportData = currentNotes.map((n) => ({
                id: n.id,
                cx: Math.round(n.cx),
                cy: Math.round(n.cy),
                scale: 0,
                rotate: Math.round(n.rotate),
                position: n.position || 'top',
                angle: n.angle || 0,
                scaleX: n.scaleX,
                scaleY: n.scaleY
            }));

            const jsonString = JSON.stringify(exportData, null, 4);
            navigator.clipboard.writeText(jsonString).then(() => {
                // Trigger Visual Feedback
                setCopySuccess9(true);
                setTimeout(() => setCopySuccess9(false), 2000);
            });
        });

        return s;
    }, [initialNotes9, mode, copySuccess9]);

    const controls9 = useControls('Digipan 9 Tuning', dynamicSchema9, [initialNotes9, mode]);

    // Construct Active Notes for Mode 9
    const activeNotes9 = useMemo(() => {
        if (mode !== '9' || !scale) return [];

        const c = controls9 as any;

        // Combine Ding and Top notes for the 9-note array
        // D Kurd 9 has 1 Ding + 8 Top notes = 9 notes
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top];

        // Template Notes for "D Kurd 9" (Fixed Visual Layout)
        // These frequencies match the original geometry of the 9notes.png
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4"];

        const notes = initialNotes9.map((n, i) => {
            const noteName = currentScaleNotes[i] || ''; // e.g., "D3", "A3"
            const frequency = getNoteFrequency(noteName);

            // Visual Frequency: Always use the Template's frequency for this index
            const visualNoteName = TEMPLATE_NOTES[i] || "A4";
            const visualFrequency = getNoteFrequency(visualNoteName);

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName, // Use the actual note name (e.g. "D3") as label
                frequency: frequency || 440,
                visualFrequency: visualFrequency || 440, // Lock geometry to template
                labelOffset: 25
            };
        });

        return notes;
    }, [initialNotes9, controls9, mode, scale]);

    // Update Ref whenever activeNotes9 changes
    useEffect(() => {
        activeNotes9Ref.current = activeNotes9;
    }, [activeNotes9]);


    // -------------------------------------------------------------------------

    // Toggle Button Control
    const toggleControl = (
        <button
            onClick={() => {
                const newMode = mode === '9' ? '10' : '9';
                setMode(newMode);
                // Switch default scale based on mode
                if (newMode === '9') {
                    setSelectedScaleId('d_kurd_9');
                } else {
                    setSelectedScaleId('d_kurd_10');
                }
            }}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1 w-14 h-14"
            title="Toggle Digipan 9 / 10"
        >
            {mode === '9' ? (
                <>
                    <span className="text-[10px] leading-none">9</span>
                    <Grid size={16} />
                </>
            ) : (
                <>
                    <span className="text-[10px] leading-none">10</span>
                    <Monitor size={16} />
                </>
            )}
        </button>
    );

    return (
        <div className="w-full h-screen flex bg-white">
            {/* Left: 3D Workspace */}
            <div className="flex-1 relative">
                {mode === '9' ? (
                    <Digipan9
                        notes={activeNotes9} // Pass interactive notes
                        scale={scale} // Pass scale for reference if needed
                        isCameraLocked={true} // Auto-lock as per previous logic, or user preference
                        onScaleSelect={handleScaleSelect}
                        extraControls={toggleControl}
                    />
                ) : (
                    <Digipan10
                        scale={scale}
                        onScaleSelect={handleScaleSelect}
                        onNoteClick={(id) => console.log(`Clicked note ${id}`)}
                        extraControls={toggleControl}
                    />
                )}
            </div>

            {/* Right: Data Panel */}
            <div className="w-[300px] bg-slate-800 border-l border-slate-700 p-6 flex flex-col shadow-2xl z-10 transition-colors duration-500">
                <h2 className="text-xl font-bold text-white mb-2">
                    {mode === '9' ? '📷 Digipan 9 Preview' : '🎵 Digipan 10 Demo'}
                </h2>

                {/* Always show scale info if a scale is selected */}
                {scale && (
                    <div className="mb-4">
                        <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Current Scale</span>
                        <div className="text-white font-bold text-lg">{scale.name}</div>
                    </div>
                )}

                <p className="text-slate-400 text-sm mb-4">
                    {mode === '9'
                        ? "Digipan 9 Editor Mode. Adjust tonefield positions."
                        : "Fully interactive 10-note implementation with tonefields and sound."
                    }
                </p>
            </div>
        </div>
    );
}
