import React, { useMemo } from 'react';
import Digipan3D from './Digipan3D';
import { useTexture } from '@react-three/drei';
import { HANDPAN_CONFIG } from '../constants/handpanConfig';
import { Scale } from '../data/handpanScales';
import { getNoteFrequency } from '../constants/noteFrequencies';

// Composite Background Component for Digipan 11
const Digipan11Background = ({ useVerticalLayout }: { useVerticalLayout: boolean }) => {
    // Load both textures
    const tex1 = useTexture('/images/9notes.png');
    const tex2 = useTexture('/images/bottom_2notes.png');

    const size = HANDPAN_CONFIG.OUTER_RADIUS * 2; // 57cm

    // Layout configuration
    // Desktop: Left (-28.5) / Right (+28.5)
    // Vertical Layout (Mobile/Tablet/Narrow PC): Top (+28) / Bottom (-28)
    const pos1: [number, number, number] = useVerticalLayout ? [0, 28, -0.5] : [-28.5, 0, -0.5];
    const pos2: [number, number, number] = useVerticalLayout ? [0, -28, -0.5] : [28.5, 0, -0.5];

    return (
        <group>
            {/* Top/Left Image */}
            <mesh position={pos1} rotation={[0, 0, 0]}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial map={tex1} transparent opacity={1} />
            </mesh>

            {/* Bottom/Right Image */}
            <mesh position={pos2} rotation={[0, 0, 0]}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial map={tex2} transparent opacity={1} />
            </mesh>
        </group>
    );
};

interface Digipan11Props {
    scale?: Scale | null;
    onScaleSelect?: (scale: Scale) => void;
    onNoteClick?: (noteId: number) => void;
    isCameraLocked?: boolean;
    extraControls?: React.ReactNode;
    notes?: any[]; // Allow passing notes for editor mode override
    // New Props
    showControls?: boolean;
    showInfoPanel?: boolean;
    initialViewMode?: 0 | 1 | 2 | 3;
    enableZoom?: boolean;
    enablePan?: boolean;
    showLabelToggle?: boolean;
    forceCompactView?: boolean;
}

export default function Digipan11({
    scale,
    onScaleSelect,
    onNoteClick,
    isCameraLocked = false,
    extraControls,
    notes: externalNotes,
    showControls = true,
    showInfoPanel = true,
    initialViewMode = 3,
    enableZoom = true,
    enablePan = true,
    showLabelToggle = false,
    forceCompactView = false
}: Digipan11Props) {
    const [useVerticalLayout, setUseVerticalLayout] = React.useState(false);

    React.useEffect(() => {
        // Use a wider breakpoint (1280px) to prevent cropping on narrow desktop windows/tablets
        const checkLayout = () => setUseVerticalLayout(window.innerWidth < 1280);
        checkLayout();
        window.addEventListener('resize', checkLayout);
        return () => window.removeEventListener('resize', checkLayout);
    }, []);

    // Internal Note Generation (C# Pygmy 11 Layout)
    const internalNotes = useMemo(() => {
        if (!scale || externalNotes) return [];

        // Fine-tuned 11-Note Coordinates (from digipan-3d-test/page.tsx)
        const templateData = [
            { "id": 0, "cx": 512, "cy": 530, "scale": 0, "rotate": 89, "position": "center", "angle": 0, "scaleX": 1.48, "scaleY": 1.26 },
            { "id": 1, "cx": 662, "cy": 808, "scale": 0, "rotate": 66, "position": "top", "angle": 0, "scaleX": 1, "scaleY": 1 },
            { "id": 2, "cx": 349, "cy": 810, "scale": 0, "rotate": 107, "position": "top", "angle": 0, "scaleX": 1.04, "scaleY": 1.04 },
            { "id": 3, "cx": 837, "cy": 588, "scale": 0, "rotate": 199, "position": "top", "angle": 0, "scaleX": 0.93, "scaleY": 0.89 },
            { "id": 4, "cx": 175, "cy": 599, "scale": 0, "rotate": 164, "position": "top", "angle": 0, "scaleX": 1.07, "scaleY": 0.8900000000000001 },
            { "id": 5, "cx": 788, "cy": 316, "scale": 0, "rotate": 145, "position": "top", "angle": 0, "scaleX": 0.97, "scaleY": 0.92 },
            { "id": 6, "cx": 201, "cy": 348, "scale": 0, "rotate": 43, "position": "top", "angle": 0, "scaleX": 1.19, "scaleY": 0.8499999999999999 },
            { "id": 7, "cx": 597, "cy": 180, "scale": 0, "rotate": 188, "position": "top", "angle": 0, "scaleX": 1.17, "scaleY": 0.77 },
            { "id": 8, "cx": 370, "cy": 195, "scale": 0, "rotate": 144, "position": "top", "angle": 0, "scaleX": 1.18, "scaleY": 0.8099999999999999 },
            // Bottom Notes
            { "id": 9, "cx": 813, "cy": 564, "scale": 0, "rotate": 14, "position": "bottom", "angle": 0, "scaleX": 1.32, "scaleY": 1.9 },
            { "id": 10, "cx": 185, "cy": 558, "scale": 0, "rotate": 172, "position": "bottom", "angle": 0, "scaleX": 1.49, "scaleY": 2.1 }
        ];

        // Template Notes for frequency lookup (Visual Sizing)
        const TEMPLATE_NOTES = ["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "D5"];

        // Determine Scale Notes (Ding + Top + Bottom)
        const currentScaleNotes = [scale.notes.ding, ...scale.notes.top, ...(scale.notes.bottom || [])];

        // 1. Generate Notes with Frequency and Offsets
        const generatedNotes = templateData.map((n, i) => {
            const noteName = currentScaleNotes[i] || '';
            const frequency = getNoteFrequency(noteName);
            const visualNoteName = TEMPLATE_NOTES[i] || "A4";
            const visualFrequency = getNoteFrequency(visualNoteName);

            // Determine offset based on ID (0-8 = Top -> Left, 9-10 = Bottom -> Right)
            const isBottom = n.id >= 9;

            // Dynamic Offset Logic
            let offset: [number, number, number];
            if (useVerticalLayout) {
                // Vertical Layout: Top-Bottom
                // Top Shell: Move UP (+28)
                // Bottom Shell: Move DOWN (-28)
                offset = isBottom ? [0, -28, 0] : [0, 28, 0];
            } else {
                // Horizontal Layout: Left-Right
                // Top Shell: Move LEFT (-28.5)
                // Bottom Shell: Move RIGHT (+28.5)
                offset = isBottom ? [28.5, 0, 0] : [-28.5, 0, 0];
            }

            return {
                ...n,
                label: noteName, // Default label
                frequency: frequency || 440,
                visualFrequency: visualFrequency || 440,
                labelOffset: 25,
                offset: offset
            };
        });

        // 2. Sort by Pitch to determine Rank (1-based index) for subLabel
        const sortedByPitch = [...generatedNotes].sort((a, b) => a.frequency - b.frequency);

        // 3. Assign subLabel based on Rank (Ding is 'D', others are Rank)
        const finalNotes = generatedNotes.map(n => {
            const rank = sortedByPitch.findIndex(x => x.id === n.id) + 1;
            const subLabel = n.id === 0 ? 'D' : rank.toString();
            return { ...n, subLabel };
        });

        return finalNotes;

    }, [scale, externalNotes, useVerticalLayout]);

    // Use external notes if provided (Editor Mode), otherwise use internal default (Standard Component)
    const notesToRender = externalNotes || internalNotes;

    // Calculate Scene Size for Camera Auto-Fit
    // Horizontal (Desktop): Width ~120, Height ~60
    // Vertical (Mobile/Tablet): Width ~60, Height ~115 (Tighter fit)
    const sceneSize = useVerticalLayout
        ? { width: 60, height: 115 } // Tighter vertical fit
        : { width: 125, height: 60 };

    return (
        <Digipan3D
            notes={notesToRender}
            scale={scale}
            isCameraLocked={isCameraLocked}
            onNoteClick={onNoteClick}
            onScaleSelect={onScaleSelect}
            // Background is simpler now - we pass content instead of string
            backgroundContent={<Digipan11Background useVerticalLayout={useVerticalLayout} />}
            // tonefieldOffset={[-28.5, 0, 0]} // REMOVED global offset, will use per-note offset
            extraControls={extraControls}
            noteCountFilter={9} // Keep filter as 9 for now as it duplicates 9
            showControls={showControls}
            showInfoPanel={showInfoPanel}
            initialViewMode={initialViewMode}
            enableZoom={enableZoom}
            enablePan={enablePan}
            showLabelToggle={showLabelToggle}
            forceCompactView={forceCompactView}
            hideStaticLabels={true} // Hide RS/LS/H labels
            sceneSize={sceneSize} // Pass dynamic scene size
        />
    );
}
