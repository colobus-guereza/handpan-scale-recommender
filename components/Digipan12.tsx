'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Digipan3D, { svgTo3D, getTonefieldDimensions, Digipan3DHandle } from './Digipan3D';
import { Scale } from '@/data/handpan-data';
import { getNoteFrequency } from '../constants/noteFrequencies';
import { DIGIPAN_VIEW_CONFIG, getDeviceSettings } from '../constants/digipanViewConfig';
import * as THREE from 'three';
import { VisualTonefield } from './VisualTonefield';
import { useTexture } from '@react-three/drei';
import { HANDPAN_CONFIG } from '../constants/handpanConfig';

interface Digipan12Props {
    scale?: Scale | null;
    onScaleSelect?: (scale: Scale) => void;
    onNoteClick?: (noteId: number) => void;
    isCameraLocked?: boolean;
    extraControls?: React.ReactNode;
    showControls?: boolean;
    showInfoPanel?: boolean;
    initialViewMode?: 0 | 1 | 2 | 3 | 4;
    viewMode?: 0 | 1 | 2 | 3 | 4;
    onViewModeChange?: (mode: 0 | 1 | 2 | 3 | 4) => void;
    enableZoom?: boolean;
    enablePan?: boolean;
    showLabelToggle?: boolean;

    forceCompactView?: boolean;
    notes?: any[]; // Allow passing notes for editor mode override
    showAxes?: boolean;
    onIsRecordingChange?: (isRecording: boolean) => void;
    hideTouchText?: boolean;
}

// Composite Background Component for Digipan 12 (10 notes image + 2 visual tonefields)
const Digipan12Background = ({ centerX = 500, centerY = 500, visualNotes = [], viewMode }: { centerX?: number; centerY?: number; visualNotes?: any[]; viewMode?: number }) => {
    // Load texture (Using 10notes.png as base)
    const tex1 = useTexture('/images/10notes.png');

    const size = HANDPAN_CONFIG.OUTER_RADIUS * 2; // 57cm

    // Calculate Image Position to adjust for Center Offset
    const pos = svgTo3D(500, 500, centerX, centerY);

    return (
        <group>
            {/* Top Image (10 Notes) */}
            <mesh position={[pos.x, pos.y, -0.5]} rotation={[0, 0, 0]}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial map={tex1} transparent opacity={1} />
            </mesh>

            {/* Permanent Visual Tonefields for Bottom Notes (N10, N11) */}
            {/* Show in Modes 0-3 (UI 1-4), Hide in Mode 4 (UI 5 - Guide Mode uses Spheres) */}
            {viewMode !== 4 && visualNotes.map((note) => {
                const cx = note.cx ?? 500;
                const cy = note.cy ?? 500;
                const notePos = svgTo3D(cx, cy, centerX, centerY);
                const rotationZ = -THREE.MathUtils.degToRad(note.rotate || 0);

                // Dimension Calc
                const isDing = note.id === 0;
                const visualHz = note.visualFrequency ?? (note.frequency || 440);
                const dims = getTonefieldDimensions(visualHz, isDing);

                const rx = dims.width;
                const ry = dims.height;
                const radiusX = rx / 2;
                const radiusY = ry / 2;

                const scaleXMult = note.scaleX ?? 1;
                const scaleYMult = note.scaleY ?? 1;
                const finalRadiusX = radiusX * scaleXMult;
                const finalRadiusY = radiusY * scaleYMult;

                return (
                    <VisualTonefield
                        key={`vis-${note.id}`}
                        position={[notePos.x, notePos.y, -0.1]}
                        rotationZ={rotationZ}
                        radiusX={finalRadiusX}
                        radiusY={finalRadiusY}
                        // Style matches Digipan 11 final polish
                        color="#A0522D"
                        opacity={0.6}
                        fillOpacity={0.15}
                    />
                );
            })}

            {/* Permanent Visual Tonefields for Bottom Notes REMOVED - Handled by ToneFieldMesh in Digipan3D now */}
        </group>
    );
};


const Digipan12 = React.forwardRef<Digipan3DHandle, Digipan12Props>(({
    scale,
    onScaleSelect,
    onNoteClick,
    isCameraLocked = false,
    extraControls,
    showControls = true,
    showInfoPanel = true,
    initialViewMode = 2,
    viewMode,
    onViewModeChange,
    enableZoom = true,
    enablePan = true,
    showLabelToggle = false,
    forceCompactView = false,
    notes: externalNotes,
    showAxes = false,
    onIsRecordingChange,
    hideTouchText = false
}, ref) => {

    // Mobile detection for responsive settings
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Get device-specific settings
    const viewSettings = getDeviceSettings(DIGIPAN_VIEW_CONFIG['12'], isMobile);

    // 10-Note Base Coordinates (from Digipan10.tsx)
    const baseNotes10 = useMemo(() => [
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
    ], []);

    const internalNotes = useMemo(() => {
        // If externalNotes provided, use them. If no scale, return base notes for fallback.
        if (externalNotes && externalNotes.length > 0) return externalNotes;
        if (!scale) return baseNotes10.map(n => ({ ...n, label: '', frequency: 440, visualFrequency: 440, offset: [0, 0, 0] as [number, number, number] }));

        // Special handling for D Kurd 12: Swap bottom note positions (F3 and G3)
        // Default: ID 10 (Left), ID 11 (Right)
        // D Kurd 12: ID 10 (Right), ID 11 (Left)
        let activeTemplateNotes = JSON.parse(JSON.stringify(baseNotes10)); // Deep copy

        if (scale.id === 'd_kurd_12') {
            console.log("[Digipan12] D Kurd 12 detected (Root). Swapping bottom notes.");
            const t10Index = activeTemplateNotes.findIndex((t: any) => t.id === 10);
            const t11Index = activeTemplateNotes.findIndex((t: any) => t.id === 11);

            if (t10Index !== -1 && t11Index !== -1) {
                const t10 = activeTemplateNotes[t10Index];
                const t11 = activeTemplateNotes[t11Index];

                // Swap geometric properties
                const tempProps = { cx: t10.cx, cy: t10.cy, rotate: t10.rotate, scaleX: t10.scaleX, scaleY: t10.scaleY };

                t10.cx = t11.cx; t10.cy = t11.cy; t10.rotate = t11.rotate; t10.scaleX = t11.scaleX; t10.scaleY = t11.scaleY;
                t11.cx = tempProps.cx; t11.cy = tempProps.cy; t11.rotate = tempProps.rotate; t11.scaleX = tempProps.scaleX; t11.scaleY = tempProps.scaleY;
            }
        }

        // Template Notes for frequency lookup (Visual Sizing)
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5"]; // Extended for 12

        // Determine Scale Notes (Ding + Top + Bottom)
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];

        const generatedNotes = activeTemplateNotes.map((n: any, i: number) => {
            const noteName = currentScaleNotes[i] || ''; // e.g., "D3", "A3"
            const frequency = getNoteFrequency(noteName);

            // Use A4 shape for bottom visual placeholders if notes overrun
            const visualNoteName = TEMPLATE_NOTES[i] || "A4";
            const visualFrequency = getNoteFrequency(visualNoteName);

            // For the bottom permanent tonefields (N10, N11), we might want to manually set a size reference
            // if we want them to look exactly like D11's N9/N10.
            // In D11, N9 used index 9, N10 used index 10.
            // Here, N10 uses index 10, N11 uses index 11.
            // D11 N9 (index 9) visual freq was TEMPLATE_NOTES[9] = "C5"
            // D11 N10 (index 10) visual freq was TEMPLATE_NOTES[10] = "D5"

            // Here:
            // index 10 -> TEMPLATE_NOTES[10] -> "D5" (Matches D11's N10)
            // index 9 from D11 was C5. Here index 10 corresponds to D11's N9 position.
            // Wait, D11 N9 is ID 9. Here it is ID 10.
            // So we need TEMPLATE_NOTES[10] to be "C5" to match D11's N9 size?
            // Let's adjust TEMPLATE_NOTES to ensure consistency.

            // D11 Template: ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5"]
            // D11 N9 (ID 9) -> "C5"
            // D11 N10 (ID 10) -> "D5"

            // D12 Base: 10 notes (0-9).
            // D12 N10 (ID 10) should correspond to D11 N9 (ID 9).
            // D12 N11 (ID 11) should correspond to D11 N10 (ID 10).

            // So visualFrequency lookup:
            // if i === 10 (D12 N10) -> use "C5"
            // if i === 11 (D12 N11) -> use "D5"

            let freqForVisual = visualFrequency;
            if (n.id === 10) freqForVisual = getNoteFrequency("C5");
            if (n.id === 11) freqForVisual = getNoteFrequency("D5");

            return {
                ...n,
                label: noteName,
                frequency: frequency || 440,
                visualFrequency: freqForVisual || 440,
                labelOffset: 25,
                offset: [0, 0, 0] as [number, number, number]
            };
        });

        // Sort for numbering by frequency (lowest = 1)
        const sortedByPitch = [...generatedNotes].sort((a: any, b: any) => a.frequency - b.frequency);

        return generatedNotes.map((n: any) => {
            // All notes get their frequency-based rank (1 = lowest frequency)
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            const subLabel = rank.toString();
            return { ...n, subLabel };
        });

    }, [scale, externalNotes, baseNotes10]);

    const notesToRender = externalNotes || internalNotes;

    // Filter notes for the Permanent Visual Layer (Bottom 2 notes: IDs 10, 11)
    const visualNotes = useMemo(() => {
        return notesToRender.filter((n: any) => n.id >= 10);
    }, [notesToRender]);

    // Define sceneSize based on forceCompactView
    const sceneSize = forceCompactView ? { width: 66, height: 50 } : { width: 64, height: 60 };

    return (
        <Digipan3D
            ref={ref}
            scale={scale}
            notes={notesToRender.length > 0 ? notesToRender : baseNotes10.map(n => ({ ...n, label: '', frequency: 440, visualFrequency: 440, offset: [0, 0, 0] as [number, number, number] }))}
            onNoteClick={onNoteClick}
            isCameraLocked={isCameraLocked}
            extraControls={extraControls}
            showControls={showControls}
            showInfoPanel={showInfoPanel}
            initialViewMode={initialViewMode}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            enableZoom={enableZoom}
            enablePan={enablePan}
            showLabelToggle={showLabelToggle}
            backgroundContent={<Digipan12Background visualNotes={visualNotes} viewMode={viewMode} />}
            forceCompactView={forceCompactView}
            hideStaticLabels={true}
            showAxes={showAxes}
            onIsRecordingChange={onIsRecordingChange}
            hideTouchText={hideTouchText}
            sceneSize={forceCompactView ? { width: 66, height: 50 } : { width: 64, height: 60 }}
            cameraZoom={viewSettings.zoom}
            cameraTargetY={viewSettings.targetY}
        />
    );
});

export default Digipan12;
