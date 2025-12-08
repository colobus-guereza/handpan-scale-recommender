'use client';

import React, { useMemo, useState } from 'react';
import Digipan3D from '../../components/Digipan3D';
import { SCALES } from '@/data/handpanScales';
import { HANDPAN_TEMPLATES } from '@/data/handpanTemplates';
import { getNoteFrequency } from '@/constants/noteFrequencies';
import { useControls, button, folder } from 'leva';

export default function Digipan3DTestPage() {
    // Dynamic Scale Selection State
    const [selectedScaleId, setSelectedScaleId] = useState<string>('d_kurd_10');

    // Derived Scale Object
    const scale = SCALES.find(s => s.id === selectedScaleId) || SCALES[0];

    // Handle Scale Change from Digipan3D UI
    const handleScaleSelect = (newScale: any) => {
        setSelectedScaleId(newScale.id);
    };

    // Initial notes calculation (Static Base from User JSON)
    const initialNotes = useMemo(() => {
        if (!scale) return [];

        // User Provided JSON Configuration (Layout Template for 10 Notes)
        // Ideally this should also be dynamic based on note count, but for now we stick to 10-note template
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
        // The user's JSON was tuned for these specific frequencies. 
        // We must use these to calculate dimensions to match the "Golden Standard" layout.
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
        // Ding
        const dingNote = {
            ...userProvidedData[0],
            label: scale.notes.ding,
            // Visual Frequency: Fixed to Template (D3)
            frequency: TEMPLATE_FREQUENCIES[0],
            labelOffset: 25
        };

        // Top Notes
        // Ensure we only map up to available template slots
        const topNotes = scale.notes.top.map((pitch, index) => {
            const template = userProvidedData[index + 1];
            if (!template) return null;

            return {
                ...template,
                label: pitch,
                // Visual Frequency: Fixed to Template (Slot Index + 1)
                frequency: TEMPLATE_FREQUENCIES[index + 1] || 440,
                labelOffset: 25
            };
        }).filter(n => n !== null);

        return [dingNote, ...topNotes] as any[];
    }, [scale]);

    // -------------------------------------------------------------------------
    // Leva Logic
    // -------------------------------------------------------------------------

    // CORRECT STRATEGY FOR LEVA KEYS:
    // We will generate a schema with explicit keys like `0_cx`, `0_cy`.
    const dynamicSchema = useMemo(() => {
        const s: any = {};
        initialNotes.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1000, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1000, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scale`] = { value: note.scale, min: 50, max: 500, step: 1, label: `N${note.id} Size` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        // Add Export Button
        s['Export JSON'] = button(() => {
            // Logic handled by separate button below
            handleCopy();
        });

        return s;
    }, [initialNotes]);

    const controls = useControls('Tuning', dynamicSchema, [initialNotes]);

    // Map controls back to notes
    const activeNotes = useMemo(() => {
        const c = controls as any;
        return initialNotes.map(n => ({
            ...n,
            cx: c[`N${n.id}_cx`],
            cy: c[`N${n.id}_cy`],
            rotate: c[`N${n.id}_rotate`],
            scale: c[`N${n.id}_scale`],
            scaleX: c[`N${n.id}_scaleX`],
            scaleY: c[`N${n.id}_scaleY`],
        }));
    }, [initialNotes, controls]);

    // Filter notes for export (keep only template relevant data)
    const exportData = useMemo(() => {
        return activeNotes.map((n: any) => ({
            id: n.id,
            cx: Math.round(n.cx),
            cy: Math.round(n.cy),
            scale: Math.round(n.scale),
            rotate: Math.round(n.rotate),
            // labelY: Math.round(n.cy + (n.scale * 0.4)), // Can be recalculated or kept
            labelY: undefined, // Let the app calculate defaults if preferred, or save specific
            position: n.position || 'top',
            angle: n.angle || 0,
            scaleX: n.scaleX,
            scaleY: n.scaleY
        }));
    }, [activeNotes]);

    const handleCopy = () => {
        const jsonString = JSON.stringify(exportData, null, 4);
        navigator.clipboard.writeText(jsonString).then(() => {
            alert("✅ JSON Copied to Clipboard!");
        });
    };

    return (
        <div className="w-full h-screen flex bg-white">
            {/* Left: 3D Workspace */}
            <div className="flex-1 relative">
                <Digipan3D
                    notes={activeNotes}
                    onNoteClick={(id) => console.log(`Clicked note ${id}`)}
                    scale={scale}
                    // Pass the handler to Digipan3D
                    onScaleSelect={handleScaleSelect}
                />
            </div>

            {/* Right: Data Panel */}
            <div className="w-[400px] bg-slate-800 border-l border-slate-700 p-6 flex flex-col shadow-2xl z-10">
                <h2 className="text-xl font-bold text-white mb-2">🛠️ Tuning Maker</h2>
                <div className="mb-4">
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Current Scale</span>
                    <div className="text-white font-bold text-lg">{scale.name}</div>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                    Adjust Leva controls to align notes. Copy the JSON below to update templates.
                </p>

                {/* JSON Display */}
                <div className="flex-1 relative mb-4">
                    <textarea
                        readOnly
                        value={JSON.stringify(exportData, null, 4)}
                        className="w-full h-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-lg border border-slate-700 focus:outline-none resize-none"
                    />
                </div>

                {/* Actions */}
                <button
                    onClick={handleCopy}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <span>📋 Copy JSON Data</span>
                </button>
            </div>
        </div>
    );
}
