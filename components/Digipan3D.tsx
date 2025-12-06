'use client';

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls, OrthographicCamera, Center, Environment, ContactShadows, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Scale } from '../data/handpanScales';

// -----------------------------------------------------------------------------
// Constants & Types
// -----------------------------------------------------------------------------

const TONEFIELD_RATIO_X = 0.3;
const TONEFIELD_RATIO_Y = 0.425;

interface NoteData {
    id: number;
    label: string; // Note Name (e.g., C#3)
    subLabel?: string; // Number (e.g., 1, 2, 8) - inferred from index if missing
    cx?: number;
    cy?: number;
    scale?: number;
    rotate?: number;
    labelX?: number;
    labelY?: number;
    labelOffset?: number;
    // ... other props optional for now
}

interface Digipan3DProps {
    notes: NoteData[];
    scale?: Scale | null;
    centerX?: number;
    centerY?: number;
    onNoteClick?: (noteId: number) => void;
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

const svgTo3D = (x: number, y: number, centerX: number = 500, centerY: number = 500) => {
    return {
        x: x - centerX,
        y: -(y - centerY),
        z: 0
    };
};

// -----------------------------------------------------------------------------
// Sub-Components
// -----------------------------------------------------------------------------

const HandpanBody = ({ radius = 480 }: { radius?: number }) => {
    return (
        <group position={[0, 0, -5]}>
            {/* Main Body - Matte Dark Brown */}
            <mesh receiveShadow castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius, radius, 10, 64]} />
                <meshStandardMaterial
                    color="#5D4E46" // Dark Taupe/Brown from image
                    roughness={0.7} // Matte finish
                    metalness={0.1} // Low metalness
                />
            </mesh>
            {/* Rim - Slightly darker */}
            <mesh position={[0, -6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius + 18, radius + 18, 2, 64]} />
                <meshStandardMaterial color="#3E332E" roughness={0.8} metalness={0.1} />
            </mesh>

            {/* Axis Lines (Dotted) */}
            {/* Horizontal */}
            <Line
                points={[[-600, 0, 6], [600, 0, 6]]}
                color="#8D6E63"
                lineWidth={1}
                dashed
                dashSize={10}
                gapSize={10}
                opacity={0.5}
                transparent
            />
            {/* Vertical */}
            <Line
                points={[[0, -600, 6], [0, 600, 6]]}
                color="#8D6E63"
                lineWidth={1}
                dashed
                dashSize={10}
                gapSize={10}
                opacity={0.5}
                transparent
            />
        </group>
    );
};

const ToneFieldMesh = ({
    note,
    centerX,
    centerY,
    onClick
}: {
    note: NoteData;
    centerX: number;
    centerY: number;
    onClick?: (id: number) => void;
}) => {
    const [hovered, setHovered] = useState(false);

    // Calculate position
    const cx = note.cx ?? 500;
    const cy = note.cy ?? 500;
    const pos = svgTo3D(cx, cy, centerX, centerY);

    // Calculate size
    const scale = note.scale || 100;
    const rx = scale * TONEFIELD_RATIO_X;
    const ry = scale * TONEFIELD_RATIO_Y;

    // Rotation
    const rotationZ = -THREE.MathUtils.degToRad(note.rotate || 0);

    // Ding logic: id 0 is the Ding (Central Note)
    // User requested Ding dimple size to be 45%, others 40%
    const isDing = note.id === 0;
    const dimpleRatio = isDing ? 0.45 : 0.4;

    return (
        <group position={[pos.x, pos.y, 1]}>
            <group rotation={[0, 0, rotationZ]}>
                {/* Tone Field Body - Beige/Light Brown */}
                {/* 
                    Geometry: Unit Hemisphere (radius 1)
                    Rotation: X=90 deg to point the dome along Z axis
                    Scale: [rx, height, ry] -> X=width, Y=height(Z), Z=length(Y)
                */}
                <mesh
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.(note.id);
                    }}
                    onPointerOver={() => {
                        document.body.style.cursor = 'pointer';
                        setHovered(true);
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        setHovered(false);
                    }}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[rx, 5, ry]} // Z-height is 5
                >
                    <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color={hovered ? "#EFEBE9" : "#D7CCC8"} // Light Beige
                        emissive={hovered ? "#D7CCC8" : "#000000"}
                        emissiveIntensity={hovered ? 0.2 : 0}
                        roughness={0.4}
                        metalness={0.1}
                    />
                </mesh>

                {/* Dimple - Inner Ellipse (Scaled by dimpleRatio) */}
                <mesh
                    position={[0, 0, 1]} // Slightly above tone field
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[rx * dimpleRatio, 8, ry * dimpleRatio]} // Slightly taller (8)
                >
                    <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color="#BCAAA4"
                        roughness={0.5}
                        metalness={0.1}
                    />
                </mesh>
            </group>

            {/* Note Label (White, Bold) */}
            {(() => {
                let labelX = note.labelX;
                let labelY = note.labelY;

                if (labelX === undefined || labelX === null) labelX = cx;
                if (labelY === undefined || labelY === null) {
                    // For the image style, labels are CENTERED on the note
                    // The previous logic put them below. Let's center them by default if no explicit override.
                    // But wait, the image shows them centered.
                    labelX = cx;
                    labelY = cy;
                }

                const labelPos = svgTo3D(labelX, labelY, centerX, centerY);

                return (
                    <group position={[labelPos.x - pos.x, labelPos.y - pos.y, 15]}>
                        <Text
                            fontSize={28}
                            color="#FFFFFF"
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                            outlineWidth={1}
                            outlineColor="#5D4E46" // Dark outline for contrast against beige
                        >
                            {note.label}
                        </Text>

                        {/* Sub-Label (Number) - Gold, Below */}
                        {note.id !== 0 && (
                            <Text
                                position={[0, -35, 0]} // Fixed offset below note
                                fontSize={20}
                                color="#FFD700" // Gold
                                anchorX="center"
                                anchorY="top"
                                fontWeight="bold"
                            >
                                {note.id}
                            </Text>
                        )}

                        {/* Ding Sub-Label (D) - Gold, Below */}
                        {note.id === 0 && (
                            <Text
                                position={[0, -35, 0]}
                                fontSize={20}
                                color="#FFD700"
                                anchorX="center"
                                anchorY="top"
                                fontWeight="bold"
                            >
                                D
                            </Text>
                        )}
                    </group>
                );
            })()}

            {/* Markers (RS, LS, H) */}
            {note.id === 0 && (
                <>
                    <Text
                        position={[445, 0, 5]}
                        fontSize={24}
                        color="#FFD700" // Gold
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        RS
                    </Text>
                    <Text
                        position={[-445, 0, 5]}
                        fontSize={24}
                        color="#FFD700" // Gold
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        LS
                    </Text>
                    <Text
                        position={[0, -250, 5]} // H marker position (approximate)
                        fontSize={24}
                        color="#FFD700" // Gold
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        H
                    </Text>
                </>
            )}

        </group>
    );
};


// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function Digipan3D({
    notes,
    scale,
    centerX = 500,
    centerY = 500,
    onNoteClick
}: Digipan3DProps) {

    return (
        <div className="w-full h-full relative" style={{ minHeight: '600px', background: 'white' }}>
            <Canvas
                orthographic
                camera={{
                    zoom: 0.6,
                    position: [0, 0, 1000],
                    near: 0.1,
                    far: 2000
                }}
            >
                {/* Soft Studio Lighting */}
                <ambientLight intensity={0.8} />
                <pointLight position={[0, 0, 1000]} intensity={0.5} color="#ffffff" />
                <directionalLight position={[-500, 1000, 1000]} intensity={0.8} />

                <OrbitControls enableRotate={false} enableZoom={true} enablePan={true} />

                <Center>
                    <group>
                        {/* Body */}
                        <HandpanBody />

                        {/* Tone Fields */}
                        {notes.map((note) => (
                            <ToneFieldMesh
                                key={note.id}
                                note={note}
                                centerX={centerX}
                                centerY={centerY}
                                onClick={onNoteClick}
                            />
                        ))}
                    </group>
                </Center>
            </Canvas>
        </div>
    );
}
