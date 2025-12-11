'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Digipan10 from '../../components/Digipan10';
import Digipan9 from '../../components/Digipan9';
import Digipan11 from '../../components/Digipan11';
import Digipan12 from '../../components/Digipan12';
import Digipan14 from '../../components/Digipan14';
import Digipan14M from '../../components/Digipan14M';
import ScaleInfoPanel from '../../components/ScaleInfoPanel';
import { SCALES } from '@/data/handpanScales';
import { Grid, Monitor, Smartphone, Lock, Unlock, Camera, Check, PlayCircle, Eye, EyeOff, MinusCircle } from 'lucide-react';
import { Digipan3DHandle } from '../../components/Digipan3D';
import { useControls, button } from 'leva';
import { getNoteFrequency } from '@/constants/noteFrequencies';

export default function Digipan3DTestPage() {
    // Mode State: '9', '10', '11', '12', '14', '14M'
    const [mode, setMode] = useState<'9' | '10' | '11' | '12' | '14' | '14M'>('9');
    // Mobile Preview State
    const [isMobilePreview, setIsMobilePreview] = useState(false);

    // Dynamic Scale Selection State
    const [selectedScaleId, setSelectedScaleId] = useState<string>('d_kurd_9');

    // Derived Scale Object
    const scale = SCALES.find(s => s.id === selectedScaleId) || SCALES[0];

    // Shared Digipan Control States
    const [isCameraLocked, setIsCameraLocked] = useState(false);
    const [viewMode, setViewMode] = useState<0 | 1 | 2 | 3 | 4>(3);
    const [showLabels, setShowLabels] = useState(false);
    const [showAxes, setShowAxes] = useState(false); // Default to false - axes hidden on page load

    // External Control Ref
    const digipanRef = useRef<Digipan3DHandle>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleExternalCapture = async () => {
        if (digipanRef.current) {
            await digipanRef.current.handleCapture();
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleExternalDemoPlay = () => {
        if (digipanRef.current) {
            digipanRef.current.handleDemoPlay();
        }
    };

    // Handle Scale Change
    const handleScaleSelect = React.useCallback((newScale: any) => {
        console.log("Scale selected in Page:", newScale.name);
        setSelectedScaleId(newScale.id);

        // Auto-switch Mode based on Note Count
        const totalNotes = 1 + newScale.notes.top.length + newScale.notes.bottom.length;
        if (totalNotes === 9) setMode('9');
        else if (totalNotes === 10) setMode('10');
        else if (totalNotes === 11) setMode('11');
        else if (totalNotes === 12) setMode('12');
        else if (totalNotes === 14) {
            // Check for Mutant tag or ID pattern to switch to 14M
            if (newScale.id.includes('mutant') || newScale.tags?.includes('Mutant') || newScale.name.includes('Mutant')) {
                setMode('14M');
            } else {
                setMode('14');
            }
        }
    }, []);

    // ... (Digipan 9, 10, 11 logic remains same, collapsing for brevity in tool call if not modifying them) ...

    // ... Keeping 9, 10, 11 sections as is ...

    // -------------------------------------------------------------------------
    // Digipan 12 Logic (Based on 10 + 2 Bottom from 11)
    // -------------------------------------------------------------------------

    const initialNotes12 = useMemo(() => {
        return [
            // 0-9 from Digipan 10
            { "id": 0, "cx": 508, "cy": 515, "scale": 0, "rotate": 89, "position": "center", "angle": 0, "scaleX": 1.36, "scaleY": 1.16 },
            { "id": 1, "cx": 639, "cy": 811, "scale": 0, "rotate": 66, "position": "top", "angle": 0, "scaleX": 1, "scaleY": 0.89 },
            { "id": 2, "cx": 356, "cy": 811, "scale": 0, "rotate": 103, "position": "top", "angle": 0, "scaleX": 0.98, "scaleY": 0.9 },
            { "id": 3, "cx": 822, "cy": 626, "scale": 0, "rotate": 194, "position": "top", "angle": 0, "scaleX": 1, "scaleY": 0.93 },
            { "id": 4, "cx": 178, "cy": 609, "scale": 0, "rotate": 163, "position": "top", "angle": 0, "scaleX": 0.99, "scaleY": 0.91 },
            { "id": 5, "cx": 832, "cy": 391, "scale": 0, "rotate": 158, "position": "top", "angle": 0, "scaleX": 0.94, "scaleY": 0.82 },
            { "id": 6, "cx": 184, "cy": 367, "scale": 0, "rotate": 28, "position": "top", "angle": 0, "scaleX": 0.97, "scaleY": 0.85 },
            { "id": 7, "cx": 703, "cy": 215, "scale": 0, "rotate": 142, "position": "top", "angle": 0, "scaleX": 1.02, "scaleY": 0.8 },
            { "id": 8, "cx": 314, "cy": 200, "scale": 0, "rotate": 57, "position": "top", "angle": 0, "scaleX": 0.98, "scaleY": 0.83 },
            { "id": 9, "cx": 508, "cy": 143, "scale": 0, "rotate": 138, "position": "top", "angle": 0, "scaleX": 1.07, "scaleY": 0.79 },
            // Appended Bottom Tonefields (Matches Digipan 11's N9, N10 positions)
            { "id": 10, "cx": 1000, "cy": 762, "scale": 0, "rotate": 21, "position": "bottom", "angle": 0, "scaleX": 1.24, "scaleY": 1.48 },
            { "id": 11, "cx": 4, "cy": 762, "scale": 0, "rotate": 158, "position": "bottom", "angle": 0, "scaleX": 1.29, "scaleY": 1.61 }
        ];
    }, []);

    const activeNotes12Ref = useRef<any[]>([]);
    const [copySuccess12, setCopySuccess12] = useState(false);

    const dynamicSchema12 = useMemo(() => {
        if (mode !== '12') return {};

        const s: any = {};
        initialNotes12.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1000, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1000, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess12 ? '✅ Copied!' : 'Export JSON (12)';
        s[buttonLabel] = button(() => {
            const currentNotes = activeNotes12Ref.current;
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
                setCopySuccess12(true);
                setTimeout(() => setCopySuccess12(false), 2000);
            });
        });

        return s;
    }, [initialNotes12, mode, copySuccess12]);

    const controls12 = useControls('Digipan 12 Tuning', dynamicSchema12, [initialNotes12, mode]);

    const activeNotes12 = useMemo(() => {
        if (mode !== '12' || !scale) return [];
        const c = controls12 as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5"];

        // Only map what we have
        const notes = initialNotes12.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "C5";
            const visualFrequency = getNoteFrequency(visualNoteName);

            // Manual visual frequency override for bottom notes to match D11 sizing if needed
            let freqForVisual = visualFrequency;
            if (n.id === 10) freqForVisual = getNoteFrequency("C5");
            if (n.id === 11) freqForVisual = getNoteFrequency("D5");

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: freqForVisual || 440,
                labelOffset: 25
            };
        });

        // Sort by frequency for subLabel assignment (lowest = 1)
        const sortedByPitch = [...notes].sort((a, b) => a.frequency - b.frequency);

        // Assign subLabel based on frequency ranking
        return notes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            return { ...n, subLabel: rank.toString() };
        });
    }, [initialNotes12, controls12, mode, scale]);

    useEffect(() => {
        activeNotes12Ref.current = activeNotes12;
    }, [activeNotes12]);


    // -------------------------------------------------------------------------
    // Digipan 14 Logic (Based on 12 + 2 Bottom)
    // -------------------------------------------------------------------------

    const initialNotes14 = useMemo(() => {
        return [
            {
                "id": 0,
                "cx": 508,
                "cy": 515,
                "scale": 0,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.36,
                "scaleY": 1.16
            },
            {
                "id": 1,
                "cx": 639,
                "cy": 811,
                "scale": 0,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.89
            },
            {
                "id": 2,
                "cx": 356,
                "cy": 811,
                "scale": 0,
                "rotate": 103,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.9
            },
            {
                "id": 3,
                "cx": 822,
                "cy": 626,
                "scale": 0,
                "rotate": 194,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.93
            },
            {
                "id": 4,
                "cx": 178,
                "cy": 609,
                "scale": 0,
                "rotate": 163,
                "position": "top",
                "angle": 0,
                "scaleX": 0.99,
                "scaleY": 0.91
            },
            {
                "id": 5,
                "cx": 832,
                "cy": 391,
                "scale": 0,
                "rotate": 158,
                "position": "top",
                "angle": 0,
                "scaleX": 0.94,
                "scaleY": 0.82
            },
            {
                "id": 6,
                "cx": 184,
                "cy": 367,
                "scale": 0,
                "rotate": 28,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.85
            },
            {
                "id": 7,
                "cx": 703,
                "cy": 215,
                "scale": 0,
                "rotate": 142,
                "position": "top",
                "angle": 0,
                "scaleX": 1.02,
                "scaleY": 0.8
            },
            {
                "id": 8,
                "cx": 314,
                "cy": 200,
                "scale": 0,
                "rotate": 57,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.83
            },
            {
                "id": 9,
                "cx": 508,
                "cy": 142,
                "scale": 0,
                "rotate": 138,
                "position": "top",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 0.79
            },
            {
                "id": 10,
                "cx": 0,
                "cy": 762,
                "scale": 0,
                "rotate": 158,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.29,
                "scaleY": 1.61
            },
            {
                "id": 11,
                "cx": 998,
                "cy": 762,
                "scale": 0,
                "rotate": 21,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.24,
                "scaleY": 1.48
            },
            {
                "id": 12,
                "cx": 386,
                "cy": -21,
                "scale": 0,
                "rotate": 76,
                "position": "bottom",
                "angle": 0,
                "scaleX": 0.9,
                "scaleY": 0.9
            },
            {
                "id": 13,
                "cx": 635,
                "cy": -12,
                "scale": 0,
                "rotate": 101,
                "position": "bottom",
                "angle": 0,
                "scaleX": 0.85,
                "scaleY": 0.85
            }
        ];
    }, []);

    const activeNotes14Ref = useRef<any[]>([]);
    const [copySuccess14, setCopySuccess14] = useState(false);

    const dynamicSchema14 = useMemo(() => {
        if (mode !== '14') return {};

        const s: any = {};
        initialNotes14.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: -30, max: 1500, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: -30, max: 1500, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess14 ? '✅ Copied!' : 'Export JSON (14)';
        s[buttonLabel] = button(() => {
            const currentNotes = activeNotes14Ref.current;
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
                setCopySuccess14(true);
                setTimeout(() => setCopySuccess14(false), 2000);
            });
        });

        return s;
    }, [initialNotes14, mode, copySuccess14]);

    const controls14 = useControls('Digipan 14 Tuning', dynamicSchema14, [initialNotes14, mode]);

    const activeNotes14 = useMemo(() => {
        if (mode !== '14' || !scale) return [];
        const c = controls14 as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];

        const notes = initialNotes14.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "C5";
            const visualFrequency = getNoteFrequency(visualNoteName);

            let freqForVisual = visualFrequency;
            if (n.id === 10) freqForVisual = getNoteFrequency("C5");
            if (n.id === 11) freqForVisual = getNoteFrequency("D5");
            if (n.id === 12) freqForVisual = getNoteFrequency("D5");
            if (n.id === 13) freqForVisual = getNoteFrequency("E5");

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: freqForVisual || 440,
                labelOffset: 25
            };
        });

        const sortedByPitch = [...notes].sort((a, b) => a.frequency - b.frequency);

        return notes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            return { ...n, subLabel: rank.toString() };
        });
    }, [initialNotes14, controls14, mode, scale]);

    useEffect(() => {
        activeNotes14Ref.current = activeNotes14;
    }, [activeNotes14]);

    // -------------------------------------------------------------------------
    // Digipan 14M Logic (Cloned from 14N for independence)
    // -------------------------------------------------------------------------

    const initialNotes14M = useMemo(() => {
        return [
            {
                "id": 0,
                "cx": 508,
                "cy": 515,
                "scale": 0,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.36,
                "scaleY": 1.16
            },
            {
                "id": 1,
                "cx": 639,
                "cy": 811,
                "scale": 0,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.89
            },
            {
                "id": 2,
                "cx": 356,
                "cy": 811,
                "scale": 0,
                "rotate": 103,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.9
            },
            {
                "id": 3,
                "cx": 822,
                "cy": 626,
                "scale": 0,
                "rotate": 194,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.93
            },
            {
                "id": 4,
                "cx": 178,
                "cy": 609,
                "scale": 0,
                "rotate": 163,
                "position": "top",
                "angle": 0,
                "scaleX": 0.99,
                "scaleY": 0.91
            },
            {
                "id": 5,
                "cx": 832,
                "cy": 391,
                "scale": 0,
                "rotate": 158,
                "position": "top",
                "angle": 0,
                "scaleX": 0.94,
                "scaleY": 0.82
            },
            {
                "id": 6,
                "cx": 184,
                "cy": 367,
                "scale": 0,
                "rotate": 28,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.85
            },
            {
                "id": 7,
                "cx": 703,
                "cy": 215,
                "scale": 0,
                "rotate": 142,
                "position": "top",
                "angle": 0,
                "scaleX": 1.02,
                "scaleY": 0.8
            },
            {
                "id": 8,
                "cx": 314,
                "cy": 200,
                "scale": 0,
                "rotate": 57,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.83
            },
            {
                "id": 9,
                "cx": 508,
                "cy": 142,
                "scale": 0,
                "rotate": 138,
                "position": "top",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 0.79
            },
            {
                "id": 10,
                "cx": 0,
                "cy": 762,
                "scale": 0,
                "rotate": 158,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.29,
                "scaleY": 1.61
            },
            {
                "id": 11,
                "cx": 998,
                "cy": 762,
                "scale": 0,
                "rotate": 21,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.24,
                "scaleY": 1.48
            },
            {
                "id": 12,
                "cx": 386,
                "cy": -21,
                "scale": 0,
                "rotate": 76,
                "position": "bottom",
                "angle": 0,
                "scaleX": 0.9,
                "scaleY": 0.9
            },
            {
                "id": 13,
                "cx": 635,
                "cy": -12,
                "scale": 0,
                "rotate": 101,
                "position": "bottom",
                "angle": 0,
                "scaleX": 0.85,
                "scaleY": 0.85
            }
        ];
    }, []);

    const activeNotes14MRef = useRef<any[]>([]);
    const [copySuccess14M, setCopySuccess14M] = useState(false);

    const dynamicSchema14M = useMemo(() => {
        if (mode !== '14M') return {};

        const s: any = {};
        initialNotes14M.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: -30, max: 1500, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: -30, max: 1500, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess14M ? '✅ Copied!' : 'Export JSON (14M)';
        s[buttonLabel] = button(() => {
            const currentNotes = activeNotes14MRef.current;
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
                setCopySuccess14M(true);
                setTimeout(() => setCopySuccess14M(false), 2000);
            });
        });

        return s;
    }, [initialNotes14M, mode, copySuccess14M]);

    const controls14M = useControls('Digipan 14M Tuning', dynamicSchema14M, [initialNotes14M, mode]);

    const activeNotes14M = useMemo(() => {
        if (mode !== '14M' || !scale) return [];
        const c = controls14M as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];

        const notes = initialNotes14M.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "C5";
            const visualFrequency = getNoteFrequency(visualNoteName);

            let freqForVisual = visualFrequency;
            if (n.id === 10) freqForVisual = getNoteFrequency("C5");
            if (n.id === 11) freqForVisual = getNoteFrequency("D5");
            if (n.id === 12) freqForVisual = getNoteFrequency("D5");
            if (n.id === 13) freqForVisual = getNoteFrequency("E5");

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: freqForVisual || 440,
                labelOffset: 25
            };
        });

        const sortedByPitch = [...notes].sort((a, b) => a.frequency - b.frequency);

        return notes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            return { ...n, subLabel: rank.toString() };
        });
    }, [initialNotes14M, controls14M, mode, scale]);

    useEffect(() => {
        activeNotes14MRef.current = activeNotes14M;
    }, [activeNotes14M]);

    // ... Toggle Logic ...
    const toggleControl = (
        <div className="flex flex-col gap-2">
            {/* Mode Switcher */}
            <button
                onClick={() => {
                    let newMode: '9' | '10' | '11' | '12' | '14' | '14M' = '9';
                    if (mode === '9') newMode = '10';
                    else if (mode === '10') newMode = '11';
                    else if (mode === '11') newMode = '12';
                    else if (mode === '12') newMode = '14';
                    else if (mode === '14') newMode = '14M';
                    else if (mode === '14M') newMode = '9';

                    setMode(newMode);
                    if (newMode === '9') setSelectedScaleId('d_kurd_9');
                    else if (newMode === '10') setSelectedScaleId('d_kurd_10');
                    else if (newMode === '11') setSelectedScaleId('cs_pygmy_11');
                    else if (newMode === '12') setSelectedScaleId('d_kurd_12');
                    else if (newMode === '14') setSelectedScaleId('e_equinox_14');
                    else if (newMode === '14M') setSelectedScaleId('fs_low_pygmy_14_mutant');
                }}
                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 font-bold text-xs"
                title="Toggle Digipan 9 / 10 / 11 / 12"
            >
                {mode === '9' ? (
                    <span className="text-[10px] leading-none font-bold">9</span>
                ) : mode === '10' ? (
                    <span className="text-[10px] leading-none font-bold">10</span>
                ) : mode === '11' ? (
                    <span className="text-[10px] leading-none font-bold">11</span>
                ) : mode === '12' ? (
                    <span className="text-[10px] leading-none font-bold">12</span>
                ) : mode === '14' ? (
                    <span className="text-[10px] leading-none font-bold">14N</span>
                ) : (
                    <span className="text-[10px] leading-none font-bold">14M</span>
                )}
            </button>
            {/* ... other buttons ... */}
        </div >
    );


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
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4"];

        const notes = initialNotes9.map((n, i) => {
            const noteName = currentScaleNotes[i] || ''; // e.g., "D3", "A3"
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "A4";
            const visualFrequency = getNoteFrequency(visualNoteName);

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: visualFrequency || 440,
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
    // Digipan 10 Logic (Editor Mode)
    // -------------------------------------------------------------------------

    // Initial Data for Digipan 10
    const initialNotes10 = useMemo(() => {
        return [
            {
                "id": 0,
                "cx": 508,
                "cy": 515,
                "scale": 0,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.36,
                "scaleY": 1.16
            },
            {
                "id": 1,
                "cx": 639,
                "cy": 811,
                "scale": 0,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.89
            },
            {
                "id": 2,
                "cx": 356,
                "cy": 811,
                "scale": 0,
                "rotate": 103,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.9
            },
            {
                "id": 3,
                "cx": 822,
                "cy": 626,
                "scale": 0,
                "rotate": 194,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.93
            },
            {
                "id": 4,
                "cx": 178,
                "cy": 609,
                "scale": 0,
                "rotate": 163,
                "position": "top",
                "angle": 0,
                "scaleX": 0.99,
                "scaleY": 0.91
            },
            {
                "id": 5,
                "cx": 832,
                "cy": 391,
                "scale": 0,
                "rotate": 158,
                "position": "top",
                "angle": 0,
                "scaleX": 0.94,
                "scaleY": 0.82
            },
            {
                "id": 6,
                "cx": 184,
                "cy": 367,
                "scale": 0,
                "rotate": 28,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.85
            },
            {
                "id": 7,
                "cx": 703,
                "cy": 215,
                "scale": 0,
                "rotate": 142,
                "position": "top",
                "angle": 0,
                "scaleX": 1.02,
                "scaleY": 0.8
            },
            {
                "id": 8,
                "cx": 314,
                "cy": 200,
                "scale": 0,
                "rotate": 57,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.83
            },
            {
                "id": 9,
                "cx": 508,
                "cy": 143,
                "scale": 0,
                "rotate": 138,
                "position": "top",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 0.79
            }
        ];
    }, []);

    const activeNotes10Ref = useRef<any[]>([]);
    const [copySuccess10, setCopySuccess10] = useState(false);

    const dynamicSchema10 = useMemo(() => {
        if (mode !== '10') return {};

        const s: any = {};
        initialNotes10.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1000, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1000, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess10 ? '✅ Copied!' : 'Export JSON (10)';

        s[buttonLabel] = button(() => {
            const currentNotes = activeNotes10Ref.current;
            const exportData = currentNotes.map((n) => ({
                id: n.id,
                cx: Math.round(n.cx),
                cy: Math.round(n.cy),
                scale: 0, // Using scale 0 to indicate manual scaleX/Y
                rotate: Math.round(n.rotate),
                position: n.position || 'top',
                angle: n.angle || 0,
                scaleX: n.scaleX,
                scaleY: n.scaleY
            }));

            const jsonString = JSON.stringify(exportData, null, 4);
            navigator.clipboard.writeText(jsonString).then(() => {
                setCopySuccess10(true);
                setTimeout(() => setCopySuccess10(false), 2000);
            });
        });

        return s;
    }, [initialNotes10, mode, copySuccess10]);

    const controls10 = useControls('Digipan 10 Tuning', dynamicSchema10, [initialNotes10, mode]);

    const activeNotes10 = useMemo(() => {
        if (mode !== '10' || !scale) return [];
        const c = controls10 as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"];

        // Only map up to what we can support (10 notes max)
        const notes = initialNotes10.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "C5";
            const visualFrequency = getNoteFrequency(visualNoteName);

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: visualFrequency || 440,
                labelOffset: 25
            };
        });
        return notes;
    }, [initialNotes10, controls10, mode, scale]);

    useEffect(() => {
        activeNotes10Ref.current = activeNotes10;
    }, [activeNotes10]);



    // -------------------------------------------------------------------------
    // Digipan 11 Logic (Sandbox Mode - Cloned from 9)
    // -------------------------------------------------------------------------

    // Initial Data for Digipan 11 (Clone of 9)
    const initialNotes11 = useMemo(() => {
        return [
            {
                "id": 0,
                "cx": 512,
                "cy": 530,
                "scale": 0,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.48,
                "scaleY": 1.26
            },
            {
                "id": 1,
                "cx": 662,
                "cy": 808,
                "scale": 0,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 1
            },
            {
                "id": 2,
                "cx": 349,
                "cy": 810,
                "scale": 0,
                "rotate": 107,
                "position": "top",
                "angle": 0,
                "scaleX": 1.04,
                "scaleY": 1.04
            },
            {
                "id": 3,
                "cx": 837,
                "cy": 588,
                "scale": 0,
                "rotate": 199,
                "position": "top",
                "angle": 0,
                "scaleX": 0.93,
                "scaleY": 0.89
            },
            {
                "id": 4,
                "cx": 175,
                "cy": 599,
                "scale": 0,
                "rotate": 164,
                "position": "top",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 0.8900000000000001
            },
            {
                "id": 5,
                "cx": 788,
                "cy": 316,
                "scale": 0,
                "rotate": 145,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.92
            },
            {
                "id": 6,
                "cx": 201,
                "cy": 348,
                "scale": 0,
                "rotate": 43,
                "position": "top",
                "angle": 0,
                "scaleX": 1.19,
                "scaleY": 0.8499999999999999
            },
            {
                "id": 7,
                "cx": 597,
                "cy": 180,
                "scale": 0,
                "rotate": 188,
                "position": "top",
                "angle": 0,
                "scaleX": 1.17,
                "scaleY": 0.77
            },
            {
                "id": 8,
                "cx": 370,
                "cy": 195,
                "scale": 0,
                "rotate": 144,
                "position": "top",
                "angle": 0,
                "scaleX": 1.18,
                "scaleY": 0.8099999999999999
            },
            {
                "id": 9,
                "cx": 1000,
                "cy": 762,
                "scale": 0,
                "rotate": 21,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.24,
                "scaleY": 1.48
            },
            {
                "id": 10,
                "cx": 1,
                "cy": 762,
                "scale": 0,
                "rotate": 158,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.29,
                "scaleY": 1.61
            }
        ];
    }, []);

    const activeNotes11Ref = useRef<any[]>([]);
    const [copySuccess11, setCopySuccess11] = useState(false);

    const dynamicSchema11 = useMemo(() => {
        if (mode !== '11') return {};

        const s: any = {};
        initialNotes11.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1000, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1000, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess11 ? '✅ Copied!' : 'Export JSON (11)';

        s[buttonLabel] = button(() => {
            const currentNotes = activeNotes11Ref.current;
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
                setCopySuccess11(true);
                setTimeout(() => setCopySuccess11(false), 2000);
            });
        });

        return s;
    }, [initialNotes11, mode, copySuccess11]);

    const controls11 = useControls('Digipan 11 Tuning', dynamicSchema11, [initialNotes11, mode]);

    const activeNotes11 = useMemo(() => {
        if (mode !== '11' || !scale) return [];
        const c = controls11 as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5"]; // Extended template

        // 1. Generate Notes with Frequency
        const generatedNotes = initialNotes11.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "A4";
            const visualFrequency = getNoteFrequency(visualNoteName);

            // Determine offset based on ID (0-8 = Top -> Left, 9-10 = Bottom -> Right)
            // No offset needed as we are now using a consolidated single view

            return {
                ...n,
                cx: c[`N${n.id}_cx`],
                cy: c[`N${n.id}_cy`],
                rotate: c[`N${n.id}_rotate`],
                scaleX: c[`N${n.id}_scaleX`],
                scaleY: c[`N${n.id}_scaleY`],
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: visualFrequency || 440,
                labelOffset: 25,
                offset: [0, 0, 0] as [number, number, number]
            };
        });

        // 2. Sort by Pitch to determine Rank (1-based index)
        const sortedByPitch = [...generatedNotes].sort((a, b) => a.frequency - b.frequency);

        // 3. Assign subLabel based on Rank (Ding is 'D', others are Rank)
        const notes = generatedNotes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            // Rank 1 is usually Ding in frequency sort (C#3 < D3).
            // Assign 'D' if ID=0, otherwise Rank.
            const subLabel = n.id === 0 ? 'D' : rank.toString();
            return { ...n, subLabel };
        });

        return notes;
    }, [initialNotes11, controls11, mode, scale]);

    useEffect(() => {
        activeNotes11Ref.current = activeNotes11;
    }, [activeNotes11]);


    // -------------------------------------------------------------------------

    return (
        <div className="w-full h-screen flex bg-gray-100">
            {/* Left: 3D Workspace */}
            <div className={`flex-1 relative flex items-center justify-center overflow-hidden transition-all duration-500 ${isMobilePreview ? 'bg-gray-200' : 'bg-white'}`}>

                {/* Axes Toggle - Outside the frame */}
                <button
                    onClick={() => setShowAxes(!showAxes)}
                    className={`absolute top-4 right-36 z-[60] w-12 h-12 flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 border text-slate-700 font-bold text-xs ${showAxes
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-white/80 border-slate-200 hover:bg-white'
                        }`}
                    title={showAxes ? "축 및 좌표 숨기기" : "축 및 좌표 표시"}
                >
                    <Grid size={20} />
                </button>

                {/* Camera Lock Toggle - Outside the frame */}
                <button
                    onClick={() => setIsCameraLocked(!isCameraLocked)}
                    className={`absolute top-4 right-20 z-[60] w-12 h-12 flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 border text-slate-700 font-bold text-xs ${isCameraLocked
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-white/80 border-slate-200 hover:bg-white'
                        }`}
                    title={isCameraLocked ? "카메라 잠금 해제 (회전 활성화)" : "카메라 잠금 (시점 초기화 및 회전 비활성화)"}
                >
                    {isCameraLocked ? <Lock size={20} /> : <Unlock size={20} />}
                </button>

                {/* Mobile Preview Toggle - Outside the frame */}
                <button
                    onClick={() => {
                        const nextState = !isMobilePreview;
                        setIsMobilePreview(nextState);
                        if (nextState) {
                            setIsCameraLocked(true); // Auto-lock camera for correct zoom in mobile
                        }
                    }}
                    className={`absolute top-4 right-4 z-[60] w-12 h-12 flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 border text-slate-700 font-bold text-xs ${isMobilePreview
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-white/80 border-slate-200 hover:bg-white'
                        }`}
                    title={isMobilePreview ? "Exit Mobile Preview" : "Mobile Preview"}
                >
                    <Smartphone size={20} />
                </button>

                {/* Exit Mobile Preview Button - Outside the frame */}
                {isMobilePreview && (
                    <>
                        <button
                            onClick={() => setIsMobilePreview(false)}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg transition-all duration-200 border border-slate-600"
                            title="데스크톱 모드로 돌아가기"
                        >
                            <Monitor size={16} />
                            <span className="text-xs font-medium">데스크톱 모드</span>
                        </button>

                        {/* External Controls for Mobile Preview (Outside Frame) */}
                        <div className="absolute top-20 right-4 z-[60] flex flex-col gap-3">
                            {/* 1. Capture Button */}
                            <button
                                onClick={handleExternalCapture}
                                className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                                title="스크린샷 캡처"
                            >
                                {copySuccess ? <Check size={20} className="text-green-600" /> : <Camera size={20} />}
                            </button>

                            {/* 2. View Mode Toggle */}
                            <button
                                onClick={() => setViewMode(prev => (prev + 1) % 4 as 0 | 1 | 2 | 3)}
                                className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                                title="보기 모드 변경"
                            >
                                {viewMode === 0 && <Eye size={20} />}
                                {viewMode === 1 && <MinusCircle size={20} />}
                                {viewMode === 2 && <EyeOff size={20} />}
                                {viewMode === 3 && <EyeOff size={20} className="opacity-50" />}
                            </button>

                            {/* 3. Demo Play Button */}
                            <button
                                onClick={handleExternalDemoPlay}
                                className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                                title="데모 재생"
                            >
                                <PlayCircle size={24} />
                            </button>

                            {/* 4. Digipan Mode Toggle (New) */}
                            <button
                                onClick={() => {
                                    let newMode: '9' | '10' | '11' | '12' | '14' | '14M' = '9';
                                    if (mode === '9') newMode = '10';
                                    else if (mode === '10') newMode = '11';
                                    else if (mode === '11') newMode = '12';
                                    else if (mode === '12') newMode = '14';
                                    else if (mode === '14') newMode = '14M';
                                    else if (mode === '14M') newMode = '9';

                                    setMode(newMode);
                                    if (newMode === '9') setSelectedScaleId('d_kurd_9');
                                    else if (newMode === '10') setSelectedScaleId('d_kurd_10');
                                    else if (newMode === '11') setSelectedScaleId('cs_pygmy_11');
                                    else if (newMode === '12') setSelectedScaleId('d_kurd_12');
                                    else if (newMode === '14') setSelectedScaleId('e_equinox_14');
                                    else if (newMode === '14M') setSelectedScaleId('fs_low_pygmy_14_mutant');
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 font-bold text-xs"
                                title="Toggle Digipan 9 / 10 / 11 / 12"
                            >
                                {mode === '9' ? <span className="text-[10px] leading-none font-bold">9</span> :
                                    mode === '10' ? <span className="text-[10px] leading-none font-bold">10</span> :
                                        mode === '11' ? <span className="text-[10px] leading-none font-bold">11</span> :
                                            mode === '12' ? <span className="text-[10px] leading-none font-bold">12</span> :
                                                mode === '14' ? <span className="text-[10px] leading-none font-bold">14N</span> :
                                                    <span className="text-[10px] leading-none font-bold">14M</span>}
                            </button>
                        </div>

                        {/* Floating Scale Panel - Outside the frame on the left/right */}
                        {scale && (
                            <ScaleInfoPanel
                                scale={scale}
                                onScaleSelect={handleScaleSelect}
                                noteCountFilter={mode === '9' ? 9 : 10} // Still pass it, but showAllScales overrides it
                                showAllScales={true}
                                className="absolute right-[calc(50%+200px)] bottom-20 z-[60]"
                                defaultExpanded={true}
                            />
                        )}
                    </>
                )}

                {/* 3D Container Wrapper - Changes size based on mode */}
                <div
                    className={`relative flex flex-col transition-all duration-500 ease-in-out shadow-2xl overflow-hidden bg-white ${isMobilePreview
                        ? 'w-[375px] h-[700px] rounded-[40px] border-[12px] border-slate-800 ring-2 ring-slate-300/50 mt-16'
                        : 'w-full h-full'
                        }`}
                >
                    {/* Status Bar for Mobile Look */}
                    {isMobilePreview && (
                        <div className="absolute top-0 left-0 w-full h-7 bg-slate-800 z-50 flex items-center justify-center">
                            <div className="w-20 h-4 bg-black rounded-b-xl"></div>
                        </div>
                    )}

                    {/* 3D Digipan View */}
                    <div className="flex-1 w-full h-full relative flex items-center justify-center bg-slate-100 overflow-hidden">
                        {mode === '9' ? (
                            <Digipan9
                                ref={digipanRef}
                                scale={scale} // Pass selected scale
                                notes={activeNotes9.length > 0 ? activeNotes9 : undefined}
                                isCameraLocked={isCameraLocked}
                                extraControls={isMobilePreview ? undefined : toggleControl} // Hide internal mode toggle in mobile preview
                                showControls={true}
                                showInfoPanel={false} // Hide inside 3D view (moved to overlay)
                                initialViewMode={viewMode}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                enableZoom={true} // Dynamic Zoom handled inside
                                enablePan={!isCameraLocked}
                                showLabelToggle={showLabels} // Pass label visibility state
                                forceCompactView={isMobilePreview}
                                showAxes={showAxes}
                            />
                        ) : mode === '10' ? (
                            <Digipan10
                                ref={digipanRef}
                                scale={scale}
                                notes={activeNotes10.length > 0 ? activeNotes10 : undefined}
                                isCameraLocked={isCameraLocked}
                                extraControls={isMobilePreview ? undefined : toggleControl}
                                showControls={true}
                                showInfoPanel={false}
                                initialViewMode={viewMode}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                enableZoom={true}
                                enablePan={!isCameraLocked}
                                showLabelToggle={showLabels}
                                forceCompactView={isMobilePreview}
                                showAxes={showAxes}
                            />

                        ) : mode === '11' ? (
                            <Digipan11
                                ref={digipanRef}
                                scale={scale} // C# Pygmy 11
                                notes={activeNotes11.length > 0 ? activeNotes11 : undefined}
                                isCameraLocked={isCameraLocked}
                                extraControls={isMobilePreview ? undefined : toggleControl}
                                showControls={true}
                                showInfoPanel={false}
                                initialViewMode={viewMode} // Use shared view mode
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                enableZoom={true}
                                enablePan={!isCameraLocked}
                                showLabelToggle={showLabels}
                                forceCompactView={isMobilePreview}
                                showAxes={showAxes}
                            />
                        ) : mode === '12' ? (
                            <Digipan12
                                ref={digipanRef}
                                scale={scale}
                                notes={activeNotes12.length > 0 ? activeNotes12 : undefined}
                                isCameraLocked={isCameraLocked}
                                extraControls={isMobilePreview ? undefined : toggleControl}
                                showControls={true}
                                showInfoPanel={false}
                                initialViewMode={viewMode}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                enableZoom={true}
                                enablePan={!isCameraLocked}
                                showLabelToggle={showLabels}
                                forceCompactView={isMobilePreview}
                                showAxes={showAxes}
                            />

                        ) : mode === '14' ? (
                            <Digipan14
                                ref={digipanRef}
                                scale={scale}
                                notes={activeNotes14.length > 0 ? activeNotes14 : undefined}
                                isCameraLocked={isCameraLocked}
                                extraControls={isMobilePreview ? undefined : toggleControl}
                                showControls={true}
                                showInfoPanel={false}
                                initialViewMode={viewMode}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                enableZoom={true}
                                enablePan={!isCameraLocked}
                                showLabelToggle={showLabels}
                                forceCompactView={isMobilePreview}
                                showAxes={showAxes}
                            />
                        ) : mode === '14M' ? (
                            <Digipan14M
                                ref={digipanRef}
                                scale={scale}
                                notes={activeNotes14M.length > 0 ? activeNotes14M : undefined}
                                isCameraLocked={isCameraLocked}
                                extraControls={isMobilePreview ? undefined : toggleControl}
                                showControls={true}
                                showInfoPanel={false}
                                initialViewMode={viewMode}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                enableZoom={true}
                                enablePan={!isCameraLocked}
                                showLabelToggle={showLabels}
                                forceCompactView={isMobilePreview}
                                showAxes={showAxes}
                            />
                        ) : null /* Default case if mode is not 9, 10, 11, 12 or 14 */}


                        {/* Scale Info Panel Overlay (Desktop: Absolute, Mobile: Hidden/Outside) */}
                        {!isMobilePreview && (
                            <div className="absolute top-4 left-4 z-10 w-80 pointer-events-auto">
                                <ScaleInfoPanel
                                    scale={scale}
                                    onScaleSelect={handleScaleSelect}
                                    showAllScales={true}
                                />
                            </div>
                        )}


                    </div>
                </div>
            </div>

            {/* Right: Data Panel */}
            <div className="w-[300px] bg-slate-800 border-l border-slate-700 p-6 flex flex-col shadow-2xl z-10 transition-colors duration-500">
                <h2 className="text-xl font-bold text-white mb-2">
                    {mode === '9' ? '📷 Digipan 9 Preview' : mode === '10' ? '🎵 Digipan 10 Demo' : mode === '11' ? '🧪 Digipan 11 Sandbox' : mode === '12' ? '✨ Digipan 12' : mode === '14' ? '🚀 Digipan 14N' : '🌌 Digipan 14M'}
                </h2>
                <div className="mb-6 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${isMobilePreview ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {isMobilePreview ? 'Mobile View' : 'Desktop View'}
                    </span>
                </div>

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
                        : mode === '10'
                            ? "Fully interactive 10-note implementation with tonefields and sound."
                            : mode === '14' ? "Advanced 14-note model with extended bottom notes."
                                : "Experimental 14-note Mutant model."
                    }
                </p>
                {isMobilePreview && (
                    <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg text-xs text-blue-200">
                        ℹ️ Mobile Zoom (6.5) is active because the canvas width is &lt; 768px.
                    </div>
                )}
            </div>
        </div>
    );
}
