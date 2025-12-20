'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Digipan10 from '../../components/Digipan10';
import Digipan9 from '../../components/Digipan9';
import Digipan11 from '../../components/Digipan11';
import Digipan12 from '../../components/Digipan12';
import Digipan14 from '../../components/Digipan14';
import Digipan14M from '../../components/Digipan14M';
import Digipan15M from '../../components/Digipan15M';
import Digipan18M from '../../components/Digipan18M';
import DigipanDM from '../../components/DigipanDM';
import ScaleInfoPanel from '../../components/ScaleInfoPanel';
import { SCALES } from '@mindforge/handpan-data';
import { ChevronDown, RefreshCw, Smartphone, Monitor, Grid, Lock, Unlock, Camera, Check, Eye, EyeOff, MinusCircle, PlayCircle, Play, Ship, Pointer } from 'lucide-react';
import { Digipan3DHandle } from '../../components/Digipan3D';
import { useControls, button, Leva } from 'leva';
import { getNoteFrequency } from '@/constants/noteFrequencies';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export default function Digipan3DTestPage() {
    // Mode State: '9', '10', '11', '12', '14', '14M', '15M', '18M', 'DM'
    const [mode, setMode] = useState<'9' | '10' | '11' | '12' | '14' | '14M' | '15M' | '18M' | 'DM'>('DM');
    const [isMobilePreview, setIsMobilePreview] = useState(false);

    // Dynamic Scale Selection State
    const [selectedScaleId, setSelectedScaleId] = useState<string>('c_rasavali_10');

    // Derived Scale Object
    const scale = SCALES.find(s => s.id === selectedScaleId) || SCALES[0];

    // Shared Digipan Control States
    const [isCameraLocked, setIsCameraLocked] = useState(false);
    const [viewMode, setViewMode] = useState<0 | 1 | 2 | 3 | 4>(3);
    const [showLabels, setShowLabels] = useState(false);
    const [showAxes, setShowAxes] = useState(false); // Default to false - axes hidden on page load
    const [isRecording, setIsRecording] = useState(false);

    // External Control Ref
    const digipanRef = useRef<Digipan3DHandle>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Developer Page Local State for External Buttons
    const [showIdleBoat, setShowIdleBoat] = useState(false); // Default: Off
    const [showTouchText, setShowTouchText] = useState(true); // Default: On
    const [isDemoPlaying, setIsDemoPlaying] = useState(false); // Demo play state

    const handleExternalCapture = async () => {
        if (digipanRef.current) {
            await digipanRef.current.handleCapture();
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleExternalDemoPlay = async () => {
        if (digipanRef.current && !isDemoPlaying) {
            setIsDemoPlaying(true);
            await digipanRef.current.handleDemoPlay();
            setIsDemoPlaying(false);
        }
    };



    // Preload Font and Assets
    useEffect(() => {
        if (typeof window !== 'undefined') {
            THREE.Cache.enabled = true;
            const loader = new FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', () => {
                console.log('TouchText Font preloaded');
            });
        }
    }, []);

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
        else if (totalNotes === 15) setMode('15M');
        else if (totalNotes === 18) setMode('18M');
        else if (totalNotes === 14) {
            // Check for Mutant tag or ID pattern to switch to 14M
            if (newScale.id.includes('mutant') || newScale.tags?.includes('Mutant') || newScale.name.includes('Mutant')) {
                setMode('14M');
            } else {
                setMode('14');
            }
        }
    }, []);

    // 15M Auto-Select
    // 15M Auto-Select logic removed to prevent overriding user selection
    // useEffect(() => {
    //    if (mode === '15M' && selectedScaleId !== 'd_asha_15_mutant') {
    //        setSelectedScaleId('d_asha_15_mutant');
    //    }
    // }, [mode, selectedScaleId]);

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
            // Appended Bottom Tonefields (Updated Manual Layout: ID 10 Left, ID 11 Right)
            { "id": 10, "cx": 0, "cy": 762, "scale": 0, "rotate": 159, "position": "bottom", "angle": 0, "scaleX": 1.24, "scaleY": 1.48 },
            { "id": 11, "cx": 1000, "cy": 762, "scale": 0, "rotate": 205, "position": "bottom", "angle": 0, "scaleX": 1.28, "scaleY": 1.61 }
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

        // Special handling for D Kurd 12: Swap bottom note positions (F3 and G3)
        // This is done POST-mapping to ensure we swap the final visual coordinates
        if (scale.id === 'd_kurd_12') {
            const n10Index = notes.findIndex(n => n.id === 10);
            const n11Index = notes.findIndex(n => n.id === 11);

            if (n10Index !== -1 && n11Index !== -1) {
                const n10 = notes[n10Index];
                const n11 = notes[n11Index];

                // Swap geometric properties
                const tempProps = { cx: n10.cx, cy: n10.cy, rotate: n10.rotate, scaleX: n10.scaleX, scaleY: n10.scaleY };

                n10.cx = n11.cx; n10.cy = n11.cy; n10.rotate = n11.rotate; n10.scaleX = n11.scaleX; n10.scaleY = n11.scaleY;
                n11.cx = tempProps.cx; n11.cy = tempProps.cy; n11.rotate = tempProps.rotate; n11.scaleX = tempProps.scaleX; n11.scaleY = tempProps.scaleY;
            }
        }

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
                "cx": 503,
                "cy": 519,
                "scale": 0,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.36,
                "scaleY": 1.16
            },
            {
                "id": 1,
                "cx": 645,
                "cy": 814,
                "scale": 0,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.89
            },
            {
                "id": 2,
                "cx": 377,
                "cy": 822,
                "scale": 0,
                "rotate": 108,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.9
            },
            {
                "id": 3,
                "cx": 836,
                "cy": 638,
                "scale": 0,
                "rotate": 194,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.93
            },
            {
                "id": 4,
                "cx": 182,
                "cy": 658,
                "scale": 0,
                "rotate": 163,
                "position": "top",
                "angle": 0,
                "scaleX": 0.99,
                "scaleY": 0.91
            },
            {
                "id": 5,
                "cx": 848,
                "cy": 393,
                "scale": 0,
                "rotate": 158,
                "position": "top",
                "angle": 0,
                "scaleX": 0.94,
                "scaleY": 0.82
            },
            {
                "id": 6,
                "cx": 155,
                "cy": 413,
                "scale": 0,
                "rotate": 28,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.85
            },
            {
                "id": 7,
                "cx": 717,
                "cy": 182,
                "scale": 0,
                "rotate": 121,
                "position": "top",
                "angle": 0,
                "scaleX": 1.02,
                "scaleY": 0.89
            },
            {
                "id": 8,
                "cx": 258,
                "cy": 204,
                "scale": 0,
                "rotate": 54,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.99
            },
            {
                "id": 9,
                "cx": 487,
                "cy": 135,
                "scale": 0,
                "rotate": 93,
                "position": "top",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 1.05
            },
            {
                "id": 10,
                "cx": 0,
                "cy": 762,
                "scale": 0,
                "rotate": 158,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 1.5
            },
            {
                "id": 11,
                "cx": 1003,
                "cy": 762,
                "scale": 0,
                "rotate": 24,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.13,
                "scaleY": 1.44
            },
            {
                "id": 12,
                "cx": 383,
                "cy": 316,
                "scale": 0,
                "rotate": 58,
                "position": "top",
                "angle": 0,
                "scaleX": 0.9,
                "scaleY": 0.89,
                "hideGuide": true
            },
            {
                "id": 13,
                "cx": 625,
                "cy": 311,
                "scale": 0,
                "rotate": 117,
                "position": "top",
                "angle": 0,
                "scaleX": 0.85,
                "scaleY": 0.9199999999999999,
                "hideGuide": true
            }
        ];
    }, []);

    const initialNotes15M = useMemo(() => {
        return [
            { "id": 0, "cx": 503, "cy": 519, "scale": 0, "rotate": 89, "position": "center", "angle": 0, "scaleX": 1.36, "scaleY": 1.16 },
            { "id": 1, "cx": 645, "cy": 814, "scale": 0, "rotate": 66, "position": "top", "angle": 0, "scaleX": 1, "scaleY": 0.89 },
            { "id": 2, "cx": 377, "cy": 822, "scale": 0, "rotate": 108, "position": "top", "angle": 0, "scaleX": 0.98, "scaleY": 0.9 },
            { "id": 3, "cx": 836, "cy": 638, "scale": 0, "rotate": 194, "position": "top", "angle": 0, "scaleX": 1, "scaleY": 0.93 },
            { "id": 4, "cx": 182, "cy": 658, "scale": 0, "rotate": 163, "position": "top", "angle": 0, "scaleX": 0.99, "scaleY": 0.91 },
            { "id": 5, "cx": 848, "cy": 393, "scale": 0, "rotate": 158, "position": "top", "angle": 0, "scaleX": 0.94, "scaleY": 0.82 },
            { "id": 6, "cx": 155, "cy": 413, "scale": 0, "rotate": 28, "position": "top", "angle": 0, "scaleX": 0.97, "scaleY": 0.85 },
            { "id": 7, "cx": 717, "cy": 182, "scale": 0, "rotate": 121, "position": "top", "angle": 0, "scaleX": 1.02, "scaleY": 0.89 },
            { "id": 8, "cx": 258, "cy": 204, "scale": 0, "rotate": 54, "position": "top", "angle": 0, "scaleX": 0.98, "scaleY": 0.99 },
            { "id": 9, "cx": 487, "cy": 135, "scale": 0, "rotate": 93, "position": "top", "angle": 0, "scaleX": 1.07, "scaleY": 1.05 },
            { "id": 10, "cx": 381, "cy": 316, "scale": 0, "rotate": 58, "position": "top", "angle": 0, "scaleX": 0.9, "scaleY": 0.89 },
            { "id": 11, "cx": 625, "cy": 311, "scale": 0, "rotate": 117, "position": "top", "angle": 0, "scaleX": 0.85, "scaleY": 0.92 },
            { "id": 12, "cx": 0, "cy": 762, "scale": 0, "rotate": 158, "position": "bottom", "angle": 0, "scaleX": 1.29, "scaleY": 1.61 },
            { "id": 13, "cx": 995, "cy": 762, "scale": 0, "rotate": 24, "position": "bottom", "angle": 0, "scaleX": 1.24, "scaleY": 1.48 },
            { "id": 14, "cx": 0, "cy": 260, "scale": 0, "rotate": 24, "position": "bottom", "angle": 0, "scaleX": 1.3900000000000001, "scaleY": 1.72 }
        ];
    }, []);

    // 18M Initial Notes (Updated with new 18-note data)
    const initialNotes18M = useMemo(() => {
        return [
            {
                "id": 0,
                "cx": 503,
                "cy": 519,
                "scale": 0,
                "rotate": 89,
                "position": "center",
                "angle": 0,
                "scaleX": 1.36,
                "scaleY": 1.16
            },
            {
                "id": 1,
                "cx": 645,
                "cy": 814,
                "scale": 0,
                "rotate": 66,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.89
            },
            {
                "id": 2,
                "cx": 376,
                "cy": 822,
                "scale": 0,
                "rotate": 108,
                "position": "top",
                "angle": 0,
                "scaleX": 0.98,
                "scaleY": 0.9
            },
            {
                "id": 3,
                "cx": 836,
                "cy": 638,
                "scale": 0,
                "rotate": 194,
                "position": "top",
                "angle": 0,
                "scaleX": 1,
                "scaleY": 0.93
            },
            {
                "id": 4,
                "cx": 182,
                "cy": 658,
                "scale": 0,
                "rotate": 163,
                "position": "top",
                "angle": 0,
                "scaleX": 0.99,
                "scaleY": 0.91
            },
            {
                "id": 5,
                "cx": 848,
                "cy": 393,
                "scale": 0,
                "rotate": 158,
                "position": "top",
                "angle": 0,
                "scaleX": 0.94,
                "scaleY": 0.82
            },
            {
                "id": 6,
                "cx": 155,
                "cy": 413,
                "scale": 0,
                "rotate": 28,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.85
            },
            {
                "id": 7,
                "cx": 717,
                "cy": 182,
                "scale": 0,
                "rotate": 121,
                "position": "top",
                "angle": 0,
                "scaleX": 1.02,
                "scaleY": 0.89
            },
            {
                "id": 8,
                "cx": 264,
                "cy": 204,
                "scale": 0,
                "rotate": 51,
                "position": "top",
                "angle": 0,
                "scaleX": 0.97,
                "scaleY": 0.95
            },
            {
                "id": 9,
                "cx": 484,
                "cy": 135,
                "scale": 0,
                "rotate": 93,
                "position": "top",
                "angle": 0,
                "scaleX": 1.07,
                "scaleY": 0.92
            },
            {
                "id": 10,
                "cx": 380,
                "cy": 316,
                "scale": 0,
                "rotate": 58,
                "position": "top",
                "angle": 0,
                "scaleX": 0.9,
                "scaleY": 0.89
            },
            {
                "id": 11,
                "cx": 625,
                "cy": 311,
                "scale": 0,
                "rotate": 117,
                "position": "top",
                "angle": 0,
                "scaleX": 0.85,
                "scaleY": 0.92
            },
            {
                "id": 12,
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
                "id": 13,
                "cx": 996,
                "cy": 762,
                "scale": 0,
                "rotate": 25,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.24,
                "scaleY": 1.48
            },
            {
                "id": 14,
                "cx": 998,
                "cy": 260,
                "scale": 0,
                "rotate": 155,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.25,
                "scaleY": 1.3800000000000001
            },
            {
                "id": 15,
                "cx": 2,
                "cy": 260,
                "scale": 0,
                "rotate": 24,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.2999999999999998,
                "scaleY": 1.5
            },
            {
                "id": 16,
                "cx": 263,
                "cy": 10,
                "scale": 0,
                "rotate": 64,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.3,
                "scaleY": 1.18
            },
            {
                "id": 17,
                "cx": 449,
                "cy": -38,
                "scale": 0,
                "rotate": 77,
                "position": "bottom",
                "angle": 0,
                "scaleX": 1.35,
                "scaleY": 1.22
            }
        ];
    }, []);

    const activeNotes14MRef = useRef<any[]>([]);
    const activeNotes15MRef = useRef<any[]>([]);
    const activeNotes18MRef = useRef<any[]>([]);
    const [copySuccess14M, setCopySuccess14M] = useState(false);
    const [copySuccess15M, setCopySuccess15M] = useState(false);
    const [copySuccess18M, setCopySuccess18M] = useState(false);

    const dynamicSchema14M = useMemo(() => {
        if (mode !== '14M') return {};

        const s: any = {};
        initialNotes14M.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1500, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1500, step: 1, label: `N${note.id} Y` };
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

        const generatedNotes = initialNotes14M.map((n, i) => {
            // Default mapping: index i maps to note i
            let mappedIndex = i;

            // Remapping logic for F# Low Pygmy 14 Mutant to swap Bass and High positions
            if (scale.id === 'fs_low_pygmy_14_mutant') {
                if (i === 10) mappedIndex = 12; // Mesh 10 (Bottom) gets Note 12 (Bass D3)
                else if (i === 11) mappedIndex = 13; // Mesh 11 (Bottom) gets Note 13 (Bass E3)
                else if (i === 12) mappedIndex = 10; // Mesh 12 (Top) gets Note 10 (High E5)
                else if (i === 13) mappedIndex = 11; // Mesh 13 (Top) gets Note 11 (High F#5)
            }

            const noteName = currentScaleNotes[mappedIndex] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[mappedIndex] || "C5";
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

        const sortedByPitch = [...generatedNotes].sort((a, b) => a.frequency - b.frequency);

        return generatedNotes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            return { ...n, subLabel: rank.toString() };
        });
    }, [initialNotes14M, controls14M, mode, scale]);

    useEffect(() => {
        activeNotes14MRef.current = activeNotes14M;
    }, [activeNotes14M]);

    const dynamicSchema15M = useMemo(() => {
        if (mode !== '15M') return {};

        const s: any = {};
        initialNotes15M.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: 0, max: 1500, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: 0, max: 1500, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        // Copy Button
        s.copy = button(() => {
            const controls = activeNotes15MRef.current;
            if (!controls || controls.length === 0) return;

            const exportData = controls.map(n => ({
                id: n.id,
                cx: n.cx,
                cy: n.cy,
                scale: 0,
                rotate: n.rotate || 0,
                position: n.position || 'top',
                angle: n.angle || 0,
                scaleX: n.scaleX,
                scaleY: n.scaleY
            }));
            const jsonString = JSON.stringify(exportData, null, 4);
            navigator.clipboard.writeText(jsonString).then(() => {
                setCopySuccess15M(true);
                setTimeout(() => setCopySuccess15M(false), 2000);
            });
        });

        return s;
    }, [initialNotes15M, mode, copySuccess15M]);

    const controls15M = useControls('Digipan 15M Tuning', dynamicSchema15M, [initialNotes15M, mode]);

    const activeNotes15M = useMemo(() => {
        if (mode !== '15M' || !scale) return [];
        const c = controls15M as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5", "G5", "A5", "B5"];

        const notes = initialNotes15M.map((n, i) => {
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
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: freqForVisual || 440,
                labelOffset: 25,
                cx: (c[`N${n.id}_cx`] !== undefined) ? c[`N${n.id}_cx`] : n.cx,
                cy: (c[`N${n.id}_cy`] !== undefined) ? c[`N${n.id}_cy`] : n.cy,
                rotate: (c[`N${n.id}_rotate`] !== undefined) ? c[`N${n.id}_rotate`] : n.rotate,
                scaleX: (c[`N${n.id}_scaleX`] !== undefined) ? c[`N${n.id}_scaleX`] : (n.scaleX || 1),
                scaleY: (c[`N${n.id}_scaleY`] !== undefined) ? c[`N${n.id}_scaleY`] : (n.scaleY || 1),
                angle: n.angle || 0,
            };
        });



        const sortedByPitch = [...notes].sort((a, b) => a.frequency - b.frequency);

        return notes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            return { ...n, subLabel: rank.toString() };
        });
    }, [initialNotes15M, controls15M, mode, scale]);

    useEffect(() => {
        activeNotes15MRef.current = activeNotes15M;
    }, [activeNotes15M]);

    // ... Toggle Logic ...
    // D Asha 15 Auto-Select Manual Trigger
    useEffect(() => {
        // If switched to 15M and scale is not D Asha 15, force select it
        if (mode === '15M') {
            setSelectedScaleId('d_asha_15_mutant');
        } else if (mode === '14M') {
            setSelectedScaleId('fs_low_pygmy_14_mutant');
        } else if (mode === '18M') {
            setSelectedScaleId('fs_low_pygmy_18_mutant');
        }
    }, [mode]);

    const toggleCycle = () => {
        let newMode: '9' | '10' | '11' | '12' | '14' | '14M' | '15M' | '18M' = '9';
        if (mode === '9') newMode = '10';
        else if (mode === '10') newMode = '11';
        else if (mode === '11') newMode = '12';
        else if (mode === '12') newMode = '14';
        else if (mode === '14') newMode = '14M';
        else if (mode === '14M') newMode = '15M';
        else if (mode === '15M') newMode = '18M';
        else newMode = '9'; // Cycle back to 9

        setMode(newMode);
        if (newMode === '9') setSelectedScaleId('cs_amara_9');
        else if (newMode === '10') setSelectedScaleId('d_kurd_10');
        else if (newMode === '11') setSelectedScaleId('cs_pygmy_11');
        else if (newMode === '12') setSelectedScaleId('f_low_pygmy_12');
        else if (newMode === '14') setSelectedScaleId('e_equinox_14');
        else if (newMode === '14M') setSelectedScaleId('fs_low_pygmy_14_mutant');
        else if (newMode === '15M') setSelectedScaleId('d_asha_15_mutant');
        else if (newMode === '18M') setSelectedScaleId('fs_low_pygmy_18_mutant');
    };

    const toggleControl = (
        <div className="flex flex-col gap-2">
            {/* Mode Switcher */}
            <button
                onClick={toggleCycle}
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
                ) : mode === '14M' ? (
                    <span className="text-[10px] leading-none font-bold">14M</span>
                ) : mode === '15M' ? (
                    <span className="text-[10px] leading-none font-bold">15M</span>
                ) : (
                    <span className="text-[10px] leading-none font-bold">18M</span>
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
            let subLabel = n.id === 0 ? 'D' : rank.toString();

            // C# Pygmy 11 특별 처리
            if (scale?.id === 'cs_pygmy_11') {
                // C#3 노트의 subLabel을 '1'로 설정
                if (n.label === 'C#3') {
                    subLabel = '1';
                }
                // D3 노트의 subLabel을 '2'로 설정
                else if (n.label === 'D3') {
                    subLabel = '2';
                }
            }

            return { ...n, subLabel };
        });

        return notes;
    }, [initialNotes11, controls11, mode, scale]);

    useEffect(() => {
        activeNotes11Ref.current = activeNotes11;
    }, [activeNotes11]);


    // -------------------------------------------------------------------------



    // -------------------------------------------------------------------------
    // Digipan 18M Logic (Editor Mode)
    // -------------------------------------------------------------------------

    const dynamicSchema18M = useMemo(() => {
        if (mode !== '18M') return {};

        const s: any = {};
        initialNotes18M.forEach((note) => {
            s[`N${note.id}_cx`] = { value: note.cx, min: -200, max: 1500, step: 1, label: `N${note.id} X` };
            s[`N${note.id}_cy`] = { value: note.cy, min: -200, max: 1500, step: 1, label: `N${note.id} Y` };
            s[`N${note.id}_rotate`] = { value: note.rotate, min: 0, max: 360, step: 1, label: `N${note.id} Rot` };
            s[`N${note.id}_scaleX`] = { value: note.scaleX || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SX` };
            s[`N${note.id}_scaleY`] = { value: note.scaleY || 1, min: 0.1, max: 3, step: 0.01, label: `N${note.id} SY` };
        });

        const buttonLabel = copySuccess18M ? '✅ Copied!' : 'Export JSON (18M)';
        s[buttonLabel] = button(() => {
            const currentNotes = activeNotes18MRef.current;
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
                setCopySuccess18M(true);
                setTimeout(() => setCopySuccess18M(false), 2000);
            });
        });
        return s;
    }, [initialNotes18M, mode, copySuccess18M]);

    const controls18M = useControls('Digipan 18M Tuning Final', dynamicSchema18M, [initialNotes18M, mode]);

    const activeNotes18M = useMemo(() => {
        if (mode !== '18M' || !scale) return [];
        const c = controls18M as any;
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5", "G5", "A5", "B5", "C6", "D6", "E6"];

        const notes = initialNotes18M.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "C5";
            const visualFrequency = getNoteFrequency(visualNoteName);

            return {
                ...n,
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: visualFrequency || 440,
                labelOffset: 25,
                cx: (c[`N${n.id}_cx`] !== undefined) ? c[`N${n.id}_cx`] : n.cx,
                cy: (c[`N${n.id}_cy`] !== undefined) ? c[`N${n.id}_cy`] : n.cy,
                rotate: (c[`N${n.id}_rotate`] !== undefined) ? c[`N${n.id}_rotate`] : n.rotate,
                scaleX: (c[`N${n.id}_scaleX`] !== undefined) ? c[`N${n.id}_scaleX`] : (n.scaleX || 1),
                scaleY: (c[`N${n.id}_scaleY`] !== undefined) ? c[`N${n.id}_scaleY`] : (n.scaleY || 1),
                angle: n.angle || 0,
            };
        });

        const sortedByPitch = [...notes].sort((a, b) => a.frequency - b.frequency);

        return notes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            return { ...n, subLabel: rank.toString() };
        });
    }, [initialNotes18M, controls18M, mode, scale]);

    useEffect(() => {
        activeNotes18MRef.current = activeNotes18M;
    }, [activeNotes18M]);

    // -------------------------------------------------------------------------

    return (
        <div className="w-full h-screen flex flex-col bg-slate-900">

            {/* Leva Panel Configuration */}
            <Leva
                collapsed={true}
                fill={false}
                flat={true}
                oneLineLabels={false}
                hideCopyButton={false}
                theme={{
                    sizes: {
                        rootWidth: '350px',
                    },
                    space: {
                        md: '10px',
                    }
                }}
            />
            {/* Main Container: Full Width Canvas */}
            <div className="flex flex-1">

                {/* Full Width: 3D Canvas Panel */}
                <div className="flex-1 flex flex-col">
                    {/* Toolbar */}
                    <div className="h-16 border-b border-slate-700 px-6 flex items-center gap-4 bg-slate-800 shadow-lg z-20 transition-colors duration-500">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setMode('9');
                                    setSelectedScaleId('cs_amara_9');
                                }}
                                className={`px-4 py-2 rounded ${mode === '9' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                9
                            </button>
                            <button
                                onClick={() => {
                                    setMode('10');
                                    setSelectedScaleId('d_kurd_10');
                                }}
                                className={`px-4 py-2 rounded ${mode === '10' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                10
                            </button>
                            <button
                                onClick={() => {
                                    setMode('11');
                                    setSelectedScaleId('cs_pygmy_11');
                                }}
                                className={`px-4 py-2 rounded ${mode === '11' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                11
                            </button>
                            <button
                                onClick={() => {
                                    setMode('12');
                                    setSelectedScaleId('f_low_pygmy_12');
                                }}
                                className={`px-4 py-2 rounded ${mode === '12' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                12
                            </button>
                            <button
                                onClick={() => {
                                    setMode('14');
                                    setSelectedScaleId('e_equinox_14');
                                }}
                                className={`px-4 py-2 rounded ${mode === '14' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                14N
                            </button>
                            <button
                                onClick={() => {
                                    setMode('14M');
                                    setSelectedScaleId('fs_low_pygmy_14_mutant');
                                }}
                                className={`px-4 py-2 rounded ${mode === '14M' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                14M
                            </button>
                            <button
                                onClick={() => {
                                    setMode('15M');
                                    setSelectedScaleId('d_asha_15_mutant');
                                }}
                                className={`px-4 py-2 rounded ${mode === '15M' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                15M
                            </button>
                            <button
                                onClick={() => {
                                    setMode('18M');
                                    setSelectedScaleId('fs_low_pygmy_18_mutant');
                                }}
                                className={`px-4 py-2 rounded ${mode === '18M' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                18M
                            </button>

                            {/* Separator */}
                            <div className="w-px h-6 bg-slate-600 mx-2"></div>

                            {/* DM Button (D Kurd 9 shortcut) */}
                            <button
                                onClick={() => {
                                    setMode('DM');
                                    setSelectedScaleId('d_kurd_10');
                                }}
                                className={`px-4 py-2 rounded font-bold ${mode === 'DM' ? 'bg-purple-600 text-white ring-2 ring-purple-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                DM
                            </button>
                        </div>
                    </div>

                    {/* Canvas Container */}
                    <div className={`flex-1 bg-slate-900 relative overflow-hidden ${isMobilePreview ? 'flex items-center justify-center' : ''}`}>

                        {/* Floating Circular Buttons - Top Right */}

                        {/* Recording Toggle - Outside the frame (Left of Axes) */}
                        <button
                            onClick={() => digipanRef.current?.handleRecordToggle()}
                            className={`absolute top-4 right-52 z-[60] w-12 h-12 flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 border text-slate-700 font-bold text-xs ${isRecording
                                ? 'bg-red-100 border-red-400 animate-pulse ring-2 ring-red-200'
                                : 'bg-white/80 border-slate-200 hover:bg-white'
                                }`}
                            title={isRecording ? "Stop Recording" : "Start Recording"}
                        >
                            <div className={`rounded-full transition-all duration-300 ${isRecording ? 'w-4 h-4 bg-red-600 rounded-sm' : 'w-5 h-5 bg-red-600'}`}></div>
                        </button>

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

                        {/* External Controls - Sidebar Style (Always Visible) */}
                        <div className="absolute top-20 right-4 z-[55] flex flex-col gap-3 items-center">
                            {/* Mode Switcher */}
                            <button
                                onClick={toggleCycle}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 font-bold text-xs"
                                title="Toggle Digipan Mode"
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
                                ) : mode === '14M' ? (
                                    <span className="text-[10px] leading-none font-bold">14M</span>
                                ) : mode === '15M' ? (
                                    <span className="text-[10px] leading-none font-bold">15M</span>
                                ) : (
                                    <span className="text-[10px] leading-none font-bold">18M</span>
                                )}
                            </button>

                            {/* Capture */}
                            <button
                                onClick={handleExternalCapture}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200"
                                title="Capture to Clipboard"
                            >
                                {copySuccess ? <Check size={20} className="text-green-600" /> : <Camera size={20} className="text-slate-700" />}
                            </button>



                            {/* View Mode */}
                            <button
                                onClick={() => {
                                    let nextMode: 0 | 1 | 2 | 3 | 4;
                                    if (viewMode === 0) nextMode = 1;
                                    else if (viewMode === 1) nextMode = 2;
                                    else if (viewMode === 2) nextMode = 3;
                                    else if (viewMode === 3) nextMode = 4;
                                    else nextMode = 0;
                                    setViewMode(nextMode);
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200"
                                title={`Toggle View Mode (Current: ${viewMode + 1})`}
                            >
                                <div className="relative flex items-center justify-center w-full h-full">
                                    {viewMode === 0 && <Eye size={20} className="text-slate-700 opacity-50" />}
                                    {viewMode === 1 && <MinusCircle size={20} className="text-slate-700 opacity-50" />}
                                    {viewMode === 2 && <EyeOff size={20} className="text-slate-700 opacity-50" />}
                                    {viewMode === 3 && <EyeOff size={20} className="text-slate-700 opacity-50" />}
                                    {viewMode === 4 && <Eye size={20} className="text-blue-500 opacity-50" />}
                                    <span className="absolute text-xs font-bold text-slate-900">{viewMode + 1}</span>
                                </div>
                            </button>

                            {/* Demo Play */}
                            <button
                                onClick={handleExternalDemoPlay}
                                disabled={isDemoPlaying}
                                className={`w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 ${isDemoPlaying ? 'text-slate-400 cursor-not-allowed' : 'text-red-600'}`}
                                title="Play Demo"
                            >
                                <Play size={24} fill="currentColor" className="pl-1" />
                            </button>



                            {/* Idle Boat Toggle */}
                            <button
                                onClick={() => {
                                    setShowIdleBoat(prev => !prev);
                                    digipanRef.current?.toggleIdleBoat();
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200"
                                title={showIdleBoat ? "Hide Idle Boat" : "Show Idle Boat"}
                            >
                                <Ship size={20} className={`transition-colors duration-200 ${showIdleBoat ? "text-blue-500" : "text-slate-400"}`} />
                            </button>

                            {/* Touch Text Toggle */}
                            <button
                                onClick={() => {
                                    setShowTouchText(prev => !prev);
                                    digipanRef.current?.toggleTouchText();
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200"
                                title={showTouchText ? "Hide Touch Text" : "Show Touch Text"}
                            >
                                <Pointer size={20} className={`transition-colors duration-200 ${showTouchText ? "text-purple-500" : "text-slate-400"}`} />
                            </button>
                        </div>


                        {/* Canvas Wrapper */}
                        <div className={`${isMobilePreview
                            ? 'relative w-[390px] h-[844px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-700/50'
                            : 'absolute inset-0 w-full h-full'
                            }`}>

                            {/* Digipan Components - Disable internal controls to avoid duplication */}
                            {mode === '9' ? (
                                <Digipan9
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes9.length > 0 ? activeNotes9 : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '10' ? (
                                <Digipan10
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes10.length > 0 ? activeNotes10 : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '11' ? (
                                <Digipan11
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes11.length > 0 ? activeNotes11 : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '12' ? (
                                <Digipan12
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes12.length > 0 ? activeNotes12 : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '14' ? (
                                <Digipan14
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes14.length > 0 ? activeNotes14 : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '14M' ? (
                                <Digipan14M
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes14M.length > 0 ? activeNotes14M : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '15M' ? (
                                <Digipan15M
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes15M.length > 0 ? activeNotes15M : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === '18M' ? (
                                <Digipan18M
                                    ref={digipanRef}
                                    scale={scale}
                                    notes={activeNotes18M.length > 0 ? activeNotes18M : undefined}
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : mode === 'DM' ? (
                                <DigipanDM
                                    ref={digipanRef}
                                    scale={scale}
                                    // notes={undefined} // Use internal 10-note layout
                                    isCameraLocked={isCameraLocked}
                                    extraControls={isMobilePreview ? undefined : toggleControl}
                                    showControls={false}
                                    showInfoPanel={false}
                                    initialViewMode={viewMode}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    enableZoom={true}
                                    enablePan={!isCameraLocked}
                                    showLabelToggle={showLabels}
                                    forceCompactView={isMobilePreview}
                                    showAxes={showAxes}
                                    onIsRecordingChange={setIsRecording}
                                />
                            ) : null}


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

            </div>
        </div>
    );
}

