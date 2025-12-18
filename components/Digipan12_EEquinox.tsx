'use client';

import React, { useMemo } from 'react';
import Digipan3D, { svgTo3D, getTonefieldDimensions, Digipan3DHandle } from './Digipan3D';
import { Scale } from '../data/handpanScales';
import { getNoteFrequency } from '../constants/noteFrequencies';
import { DIGIPAN_VIEW_CONFIG } from '../constants/digipanViewConfig';
import * as THREE from 'three';
import { VisualTonefield } from './VisualTonefield';
import { useTexture } from '@react-three/drei';
import { HANDPAN_CONFIG } from '../constants/handpanConfig';

interface Digipan12_EEquinoxProps {
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
    notes?: any[];
    showAxes?: boolean;
    onIsRecordingChange?: (isRecording: boolean) => void;
}

const Digipan12_EEquinoxBackground = ({ centerX = 500, centerY = 500, visualNotes = [], viewMode }: { centerX?: number; centerY?: number; visualNotes?: any[]; viewMode?: number }) => {
    const tex1 = useTexture('/images/10notes.png');
    const size = HANDPAN_CONFIG.OUTER_RADIUS * 2;
    const pos = svgTo3D(500, 500, centerX, centerY);

    return (
        <group>
            <mesh position={[pos.x, pos.y, -0.5]} rotation={[0, 0, 0]}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial map={tex1} transparent opacity={1} />
            </mesh>
            {viewMode !== 4 && visualNotes.map((note) => {
                const cx = note.cx ?? 500;
                const cy = note.cy ?? 500;
                const notePos = svgTo3D(cx, cy, centerX, centerY);
                const rotationZ = -THREE.MathUtils.degToRad(note.rotate || 0);
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
                        color="#A0522D"
                        opacity={0.6}
                        fillOpacity={0.15}
                    />
                );
            })}
        </group>
    );
};

const Digipan12_EEquinox = React.forwardRef<Digipan3DHandle, Digipan12_EEquinoxProps>(({
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
    onIsRecordingChange
}, ref) => {

    // 10-Note Base Coordinates (Standard)
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
        {
            "id": 10,
            "cx": 0,
            "cy": 762,
            "scale": 0,
            "rotate": 159,
            "position": "bottom",
            "angle": 0,
            "scaleX": 1.24,
            "scaleY": 1.48
        },
        {
            "id": 11,
            "cx": 1000,
            "cy": 762,
            "scale": 0,
            "rotate": 205,
            "position": "bottom",
            "angle": 0,
            "scaleX": 1.28,
            "scaleY": 1.61
        }
    ], []);

    const internalNotes = useMemo(() => {
        if (externalNotes && externalNotes.length > 0) return externalNotes;
        if (!scale) return baseNotes10.map(n => ({ ...n, label: '', frequency: 440, visualFrequency: 440, offset: [0, 0, 0] as [number, number, number] }));

        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5", "E5"];
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];

        const generatedNotes = baseNotes10.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "A4";
            const visualFrequency = getNoteFrequency(visualNoteName);
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

        const sortedByPitch = [...generatedNotes].sort((a, b) => a.frequency - b.frequency);
        return generatedNotes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            const subLabel = rank.toString();
            return { ...n, subLabel };
        });

    }, [scale, externalNotes, baseNotes10]);

    const notesToRender = externalNotes || internalNotes;
    const visualNotes = useMemo(() => {
        return notesToRender.filter(n => n.id >= 10);
    }, [notesToRender]);

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
            backgroundContent={<Digipan12_EEquinoxBackground visualNotes={visualNotes} viewMode={viewMode} />}
            forceCompactView={forceCompactView}
            hideStaticLabels={true}
            showAxes={showAxes}
            sceneSize={sceneSize}
            cameraZoom={DIGIPAN_VIEW_CONFIG['12'].zoom}
            cameraTargetY={DIGIPAN_VIEW_CONFIG['12'].targetY}
        />
    );
});

export default Digipan12_EEquinox;
