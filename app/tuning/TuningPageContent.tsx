'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls, Center, Text } from '@react-three/drei';
import { useControls, folder } from 'leva';
import * as THREE from 'three';
import { HANDPAN_TEMPLATES } from '@/data/handpanTemplates';
import { HANDPAN_CONFIG } from '@/constants/handpanConfig';

// -----------------------------------------------------------------------------
// Constants & Helpers
// -----------------------------------------------------------------------------

// Convert SVG coordinates (Top-Left origin) to 3D coordinates (Center origin, cm units)
// Matches Digipan3D logic
const svgTo3D = (x: number, y: number, centerX: number = 500, centerY: number = 500) => {
    const svgScale = HANDPAN_CONFIG.PAN_RADIUS / 480; // Map 480px to 28.5cm
    return {
        x: (x - centerX) * svgScale,
        y: -(y - centerY) * svgScale,
    };
};

const HandpanImage = () => {
    const texture = useTexture('/images/10notes.png');
    const size = HANDPAN_CONFIG.OUTER_RADIUS * 2;

    return (
        <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={texture} transparent opacity={1} />
        </mesh>
    );
};

const TuningToneField = ({
    id,
    data,
    isSelected,
    onSelect
}: {
    id: string;
    data: any;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) => {
    // Convert current SVG data to 3D position
    const pos = svgTo3D(data.cx, data.cy);

    // Scale Logic:
    // Template 'scale' is roughly Diameter in generic units?
    // In Digipan3D: height = refHeight * ratio; width = height * aspectW_H
    // Here we let the user control arbitrary Scale X/Y relative to a base unit.
    // Let's assume the user manipulates a raw multiplier.
    // Visualizing as a simple circle/ellipse for matching.

    const radiusX = (data.scale / 20) * (data.scaleX || 1); // Arbitrary divisor to make 200-300 range reasonable in cm
    const radiusY = (data.scale / 20) * (data.scaleY || 1); // Or we can just let 'scale' be the diameter in pixels and map it.

    // Let's stick closer to the SVG logic:
    // SVG Scale ~200-300.
    // 3D Scale ~ 10-15cm diameter.
    // Factor: HANDPAN_CONFIG.PAN_RADIUS / 480 approx 0.06
    // 300 * 0.06 = 18cm. Reasonable.
    const svgScaleFactor = HANDPAN_CONFIG.PAN_RADIUS / 480;
    const rX = (data.scale * (data.scaleX || 1)) * svgScaleFactor / 2;
    const rY = (data.scale * (data.scaleY || 1)) * svgScaleFactor / 2;

    const rotationZ = -THREE.MathUtils.degToRad(data.rotate || 0);

    return (
        <group position={[pos.x, pos.y, 0]}>
            <mesh
                rotation={[0, 0, rotationZ]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(id);
                }}
            >
                {/* Visual shape: Ellipse */}
                {/* Sphere scaled to be flat ellipsoid */}
                <sphereGeometry args={[1, 32, 16]} />
                <meshBasicMaterial
                    color={isSelected ? "#ff0000" : "#ffffff"}
                    wireframe={true}
                    transparent
                    opacity={isSelected ? 0.8 : 0.3}
                />
                {/* Apply scale to the mesh to make it an ellipse of radius rX, rY */}
                <group scale={[rX, rY, 0.1]} />
                {/* Wait, scaling the geometry or the mesh? */}
            </mesh>
            {/* Re-implementing correctly: Scale prop on Mesh */}
            <mesh
                rotation={[0, 0, rotationZ]}
                scale={[rX, rX * (data.ratio || 1), 0.05]} // Use circular base and aspect ratio?
                // User asked for Scale X / Scale Y.
                // Let's use the calculated rX, rY
                // If geometry is radius 1, scaling by N makes radius N.
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(id);
                }}
            >
                <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshBasicMaterial
                    color={isSelected ? "#ff0000" : "#ffffff"}
                    wireframe={true}
                    transparent
                    opacity={isSelected ? 1 : 0.4}
                />
            </mesh>
            {/* Label */}
            <Text
                position={[pos.x, pos.y, 2]}
                fontSize={2}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {data.id}
            </Text>
        </group>
    );
};

export default function TuningPageContent() {
    // Initialize with NOTES_10
    // We add scaleX/scaleY/ratio to the state for tuning, even if template doesn't have it yet.
    const initialNotes = React.useMemo(() => {
        const templates = HANDPAN_TEMPLATES.NOTES_10;
        const notesObj: Record<string, any> = {};
        templates.forEach(t => {
            notesObj[`Note_${t.id}`] = {
                ...t,
                scaleX: 1,
                scaleY: 1, // Default aspect ratio implies circle if equal, but usually we want ellipse
                // Actually existing template only has 'scale' (diameter-ish) and 'rotate'
                // We'll let user tweak 'scale' (size) and 'ratio' (aspect) or just generic scaleX/Y
            };
        });
        return notesObj;
    }, []);

    const [notes, setNotes] = useState(initialNotes);
    const [selectedNoteKey, setSelectedNoteKey] = useState("Note_0");

    // Helper to update note
    const updateNote = useCallback((prop: string, value: any) => {
        setNotes(prev => ({
            ...prev,
            [selectedNoteKey]: { ...prev[selectedNoteKey], [prop]: value }
        }));
    }, [selectedNoteKey]);

    // Leva Controls
    // We create a control for selecting the note, and a folder for its properties.
    // The "SelectedNote" control needs to update selectedNoteKey state.
    // The "Transform" folder needs to be reactive to the selected note's current values.

    useControls({
        NoteSelector: {
            value: selectedNoteKey,
            options: Object.keys(notes),
            onChange: (v) => setSelectedNoteKey(v)
        }
    });

    const selectedNoteData = notes[selectedNoteKey];

    useControls('Note Transform', {
        cx: {
            value: selectedNoteData.cx,
            min: 0, max: 1000, step: 1,
            onChange: (v) => updateNote('cx', v)
        },
        cy: {
            value: selectedNoteData.cy,
            min: 0, max: 1000, step: 1,
            onChange: (v) => updateNote('cy', v)
        },
        rotate: {
            value: selectedNoteData.rotate,
            min: 0, max: 360, step: 1,
            onChange: (v) => updateNote('rotate', v)
        },
        scale: {
            value: selectedNoteData.scale,
            min: 50, max: 500, step: 1,
            onChange: (v) => updateNote('scale', v)
        },
        // Optional ratio tuning
        scaleX: {
            value: selectedNoteData.scaleX || 1,
            min: 0.5, max: 2, step: 0.01,
            onChange: (v) => updateNote('scaleX', v)
        },
        scaleY: {
            value: selectedNoteData.scaleY || 1,
            min: 0.5, max: 2, step: 0.01,
            onChange: (v) => updateNote('scaleY', v)
        },
    }, [selectedNoteKey, notes]); // Re-bind when selection changes

    const logData = () => {
        // Format back to array
        const result = Object.values(notes).map((n: any) => ({
            id: n.id,
            cx: Math.round(n.cx),
            cy: Math.round(n.cy),
            scale: Math.round(n.scale), // Base scale
            rotate: Math.round(n.rotate),
            labelY: Math.round(n.cy + (n.scale * 0.4)), // Approximation for labelY
            position: n.position,
            angle: n.angle,
            // We might want to save extra props if we decide to extend the template
            // scaleX: n.scaleX,
            // scaleY: n.scaleY
        }));

        console.log("JSON DATA For handpanTemplates.ts:");
        console.log(JSON.stringify(result, null, 4));
        alert("Check Console for JSON Data!");
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
            <button
                onClick={logData}
                className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500 font-bold"
            >
                💾 Export JSON to Console
            </button>
            <div className="absolute top-16 left-4 z-50 text-white text-sm bg-black/50 p-2 rounded pointer-events-none">
                <p>1. Select a Note (on mesh or dropdown)</p>
                <p>2. Adjust sliders to match image</p>
                <p>3. Export and copy JSON</p>
            </div>

            <Canvas
                orthographic
                camera={{
                    zoom: 12, // Match main app
                    position: [0, 0, 100],
                    near: 0.1,
                    far: 2000
                }}
            >
                <ambientLight intensity={1} />
                <Center>
                    <group>
                        <Suspense fallback={null}>
                            <HandpanImage />
                        </Suspense>

                        {Object.entries(notes).map(([key, data]: [string, any]) => (
                            <TuningToneField
                                key={key}
                                id={key}
                                data={data}
                                isSelected={selectedNoteKey === key}
                                onSelect={setSelectedNoteKey}
                            />
                        ))}
                    </group>
                </Center>
                <OrbitControls enableRotate={false} />
            </Canvas>
        </div>
    );
}
