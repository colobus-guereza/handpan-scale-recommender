'use client';

import React, { useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Scale } from '../data/handpanScales';
import { Lock, Unlock, Camera, Check } from 'lucide-react';
import { HANDPAN_CONFIG, getDomeHeight, TONEFIELD_CONFIG } from '../constants/handpanConfig';
import html2canvas from 'html2canvas';

// Inner component to handle camera reset
const CameraHandler = ({ isLocked }: { isLocked: boolean }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>(null);

    React.useEffect(() => {
        if (isLocked) {
            // Reset to Top View
            camera.position.set(0, 0, 100); // 1m away
            camera.lookAt(0, 0, 0);
            camera.zoom = 12; // Adjusted for 57cm object in ~600px+ viewport
            camera.updateProjectionMatrix();
            if (controlsRef.current) {
                controlsRef.current.reset();
            }
        }
    }, [isLocked, camera]);

    return (
        <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableRotate={!isLocked} // Disable rotation if locked
            enableZoom={true}
            enablePan={true}
            minZoom={5}
            maxZoom={50}
        />
    );
};

// ... (HandpanBody, ToneFieldMesh components remain the same)

export default function Digipan3D({
    notes,
    scale,
    centerX = 500,
    centerY = 500,
    onNoteClick
}: Digipan3DProps) {
    const [isCameraLocked, setIsCameraLocked] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleCapture = async () => {
        if (!containerRef.current) return;

        try {
            // Temporarily hide the controls for the screenshot if desired, 
            // but user said "visible space", so we keep them or hide them?
            // Usually "screenshot" implies capturing the content, not the tools.
            // Let's hide the buttons during capture for a cleaner look.
            const controls = containerRef.current.querySelector('.controls-container') as HTMLElement;
            if (controls) controls.style.display = 'none';

            const canvas = await html2canvas(containerRef.current, {
                backgroundColor: '#1E50A0', // Ensure background color is captured
                logging: false,
                useCORS: true // Important for external images/fonts if any
            });

            // Restore controls
            if (controls) controls.style.display = 'flex';

            canvas.toBlob(async (blob) => {
                if (!blob) return;
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                } catch (err) {
                    console.error('Failed to copy to clipboard:', err);
                }
            });
        } catch (err) {
            console.error('Failed to capture canvas:', err);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '600px', background: '#1E50A0' }}> {/* Blueprint Blue */}
            {/* Controls Container */}
            <div className="controls-container absolute top-4 right-4 z-10 flex flex-col gap-2">
                {/* Camera Toggle Button */}
                <button
                    onClick={() => setIsCameraLocked(!isCameraLocked)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-all duration-200 border border-white/30 text-white"
                    title={isCameraLocked ? "Unlock View (Free Rotation)" : "Lock View (Top Down)"}
                >
                    {isCameraLocked ? <Lock size={24} /> : <Unlock size={24} />}
                </button>

                {/* Screen Capture Button */}
                <button
                    onClick={handleCapture}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-all duration-200 border border-white/30 text-white"
                    title="Copy Screenshot to Clipboard"
                >
                    {copySuccess ? <Check size={24} className="text-green-400" /> : <Camera size={24} />}
                </button>
            </div>

            <Canvas
                orthographic
                gl={{ preserveDrawingBuffer: true }}
                camera={{
                    zoom: 12, // Adjusted for 57cm object
                    position: [0, 0, 100],
                    near: 0.1,
                    far: 2000
                }}
            >
                {/* Lighting - Adjusted for Blueprint look */}
                <ambientLight intensity={1.0} /> {/* Bright ambient for flat look */}
                <pointLight position={[0, 0, 100]} intensity={0.2} color="#ffffff" />
                <directionalLight position={[-50, 100, 100]} intensity={0.5} />

                <CameraHandler isLocked={isCameraLocked} />

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

            {/* Scale Info Panel - Bottom Right Overlay */}
            {scale && (
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-4 rounded-xl text-white shadow-xl max-w-sm z-10 pointer-events-none select-none">
                    <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-1">Current Scale</h3>
                    <div className="text-xl font-bold mb-3 text-blue-100 border-b border-slate-700 pb-2">{scale.name}</div>

                    <div className="space-y-3">
                        {/* 1. Classification Vectors */}
                        <div className="space-y-1">
                            <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Sound Profile</span>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-slate-800/50 p-2 rounded text-center flex flex-col items-center justify-center">
                                    <span className="text-slate-400 text-[10px] uppercase mb-0.5">Mood</span>
                                    <span className="font-medium text-blue-200 leading-tight">
                                        {(scale.vector?.minorMajor ?? 0) < 0 ? 'Minor' : 'Major'}
                                        <div className="opacity-75 text-[10px]">({scale.vector?.minorMajor ?? 0})</div>
                                    </span>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded text-center flex flex-col items-center justify-center">
                                    <span className="text-slate-400 text-[10px] uppercase mb-0.5">Tone</span>
                                    <span className="font-medium text-blue-200 leading-tight">
                                        {(scale.vector?.pureSpicy ?? 0) <= 0.5 ? 'Pure' : 'Spicy'}
                                        <div className="opacity-75 text-[10px]">({scale.vector?.pureSpicy ?? 0})</div>
                                    </span>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded text-center flex flex-col items-center justify-center">
                                    <span className="text-slate-400 text-[10px] uppercase mb-0.5">Popularity</span>
                                    <span className="font-medium text-blue-200 leading-tight">
                                        {(scale.vector?.rarePopular ?? 0) <= 0.5 ? 'Rare' : 'Popular'}
                                        <div className="opacity-75 text-[10px]">({scale.vector?.rarePopular ?? 0})</div>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Notes Info */}
                        <div className="text-sm space-y-1">
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-500 font-bold w-10 shrink-0">Ding:</span>
                                <span className="font-medium">{scale.notes.ding}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-slate-400 font-bold w-10 shrink-0">Notes:</span>
                                <div className="font-medium text-slate-200 leading-snug">
                                    {scale.notes.top.join(', ')}
                                    {scale.notes.bottom.length > 0 && (
                                        <>
                                            <br />
                                            <span className="text-xs text-slate-400 block mt-1">
                                                +{scale.notes.bottom.length} Bottom: {scale.notes.bottom.join(', ')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Tags */}
                        {scale.tags && scale.tags.length > 0 && (
                            <div>
                                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Tags</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {scale.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-slate-700/50 px-2 py-0.5 rounded-full text-slate-300">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// -----------------------------------------------------------------------------
// Constants & Types
// -----------------------------------------------------------------------------

const TONEFIELD_RATIO_X = 0.3;
const TONEFIELD_RATIO_Y = 0.425;

interface NoteData {
    id: number;
    label: string; // Note Name (e.g., C#3)
    frequency: number; // Hz
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

// Convert SVG coordinates (Top-Left origin) to 3D coordinates (Center origin, cm units)
// SVG ViewBox: -400 -1100 1800 3200
// SVG Center: 500, 500
// SVG Radius: ~480
// Real Radius: 28.5 cm
const svgTo3D = (x: number, y: number, centerX: number = 500, centerY: number = 500) => {
    const svgScale = HANDPAN_CONFIG.PAN_RADIUS / 480; // Map 480px to 28.5cm
    return {
        x: (x - centerX) * svgScale,
        y: -(y - centerY) * svgScale,
    };
};

// Helper to calculate parametric tonefield dimensions
const getTonefieldDimensions = (hz: number, isDing: boolean) => {
    const { DING, NORMAL, RATIOS } = TONEFIELD_CONFIG;
    const refConfig = isDing ? DING : NORMAL;

    // 1. Calculate size based on frequency ratio (Exponential scaling)
    // Formula: Size = RefSize * (RefHz / TargetHz) ^ ScalingFactor
    const ratio = Math.pow((refConfig.REF_HZ / hz), refConfig.SCALING_FACTOR);
    const height = refConfig.REF_HEIGHT * ratio; // cm

    // 2. Calculate width based on aspect ratio
    const width = height * RATIOS.ASPECT_W_H; // cm

    // 3. Determine dimple scale
    // Condition: Ding OR Frequency <= F#3 (185Hz) -> Large Dimple (0.45)
    // Else -> Small Dimple (0.40)
    const useLargeDimple = isDing || hz <= RATIOS.F_SHARP_3_HZ;
    const dimpleRatio = useLargeDimple ? RATIOS.DIMPLE_LARGE : RATIOS.DIMPLE_SMALL;

    return {
        width,
        height,
        dimpleWidth: width * dimpleRatio,
        dimpleHeight: height * dimpleRatio
    };
};

// -----------------------------------------------------------------------------
// Sub-Components
// -----------------------------------------------------------------------------

const HandpanBody = () => {
    const shellRadius = HANDPAN_CONFIG.PAN_RADIUS; // 27.5 cm
    const outerRadius = HANDPAN_CONFIG.OUTER_RADIUS; // 28.5 cm

    return (
        <group position={[0, 0, 0]}> {/* Centered at 0,0,0 for 2D plane */}
            {/* 1. Main Shell Body - Diameter 55cm */}
            <mesh receiveShadow castShadow rotation={[0, 0, 0]} position={[0, 0, 0]}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                    <mesh scale={[1, 0.01, 1]}>
                        <sphereGeometry args={[shellRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial
                            color="#FFFFFF"
                            roughness={0.9}
                            metalness={0.0}
                            wireframe={true}
                        />
                    </mesh>
                </group>
            </mesh>

            {/* 2. Rim - Outer Edge (55cm -> 57cm) */}
            {/* Visualized as a ring or outer wireframe from 55cm to 57cm */}
            {/* RingGeometry is in XY plane by default, matching the flattened Shell in XY */}
            <mesh position={[0, 0, -0.01]}> {/* Slightly behind */}
                {/* RingGeometry: innerRadius, outerRadius, thetaSegments */}
                <ringGeometry args={[shellRadius, outerRadius, 64]} />
                <meshBasicMaterial
                    color="#A0C0FF"
                    wireframe={true}
                    transparent
                    opacity={0.5}
                />
            </mesh>

            {/* Outer Boundary Line for Rim (57cm) */}
            <mesh position={[0, 0, 0]}>
                <ringGeometry args={[outerRadius - 0.05, outerRadius, 64]} />
                <meshBasicMaterial color="#FFFFFF" />
            </mesh>

            {/* Horizontal Axis */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}> {/* Z=0 */}
                <cylinderGeometry args={[0.02, 0.02, 60, 8]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.5} transparent />
            </mesh>

            {/* Vertical Axis */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}> {/* Z=0 */}
                <cylinderGeometry args={[0.02, 0.02, 60, 8]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.5} transparent />
            </mesh>
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

    // Calculate size (Converted to cm)

    // Rotation
    const rotationZ = -THREE.MathUtils.degToRad(note.rotate || 0);

    // Ding logic
    const isDing = note.id === 0;

    // Parametric Size Calculation
    // Default to 440Hz if frequency is missing (safety fallback)
    const hz = note.frequency || 440;
    const dimensions = getTonefieldDimensions(hz, isDing);

    const rx = dimensions.width;
    const ry = dimensions.height;

    // Dimple size is now calculated in dimensions
    // But existing code uses scale prop for dimple? 
    // No, existing code used rx * dimpleRatio.
    // We can use dimensions.dimpleWidth / 2 (since scale is diameter-ish? No, scale is radius-ish in geometry args?)
    // SphereGeometry args: [1, ...] -> Radius 1.
    // Scale [rx, ry] -> Radius becomes rx, ry.
    // So rx is the radius in X, ry is radius in Y.
    // Our dimensions.width is likely the Diameter (based on "Size" description usually implying diameter or length).
    // User said "Base Size (Vertical Length) ... Height = Size".
    // If Height is 145mm (14.5cm), that's likely the major axis diameter.
    // So radius should be Height / 2.

    const radiusX = dimensions.width / 2;
    const radiusY = dimensions.height / 2;
    const dimpleRadiusX = dimensions.dimpleWidth / 2;
    const dimpleRadiusY = dimensions.dimpleHeight / 2;

    // Z-position: Place on the 0,0 coordinate plane (Top of dome)

    // User requested "0,0 coordinate plane based 2D style"
    const zPos = 0;

    return (
        <group position={[pos.x, pos.y, zPos]}>
            <group rotation={[0, 0, rotationZ]}>
                {/* Tone Field Group: Body, Dimple, Labels */}

                {/* 1. Tone Field Body - Wireframe */}
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
                    scale={[radiusX, 0.05, radiusY]} // Flattened
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color={hovered ? "#A0C0FF" : "#FFFFFF"}
                        emissive={hovered ? "#1E50A0" : "#000000"}
                        emissiveIntensity={hovered ? 0.5 : 0}
                        roughness={0.9}
                        metalness={0.0}
                        wireframe={true}
                    />
                </mesh>

                {/* 2. Dimple - Wireframe */}
                <mesh
                    position={[0, 0, 0.01]}
                    rotation={[isDing ? Math.PI / 2 : -Math.PI / 2, 0, 0]}
                    scale={[dimpleRadiusX, 0.05, dimpleRadiusY]}
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color="#FFFFFF"
                        roughness={0.9}
                        metalness={0.0}
                        wireframe={true}
                    />
                </mesh>

            </group>

            {/* 3. Labels (Separated from rotation group to stay upright) */}
            <group position={[0, 0, 1]}> {/* Lifted slightly above mesh */}
                {/* Helper to calculate bottom point of rotated ellipse */}
                {(() => {
                    const calculateBottomOffset = (rx: number, ry: number, rotZ: number) => {
                        // We want to find the point on the ellipse with the lowest Y value (Visual Bottom)
                        // Ellipse parametric: x = rx*cos(t), y = ry*sin(t)
                        // Rotated: 
                        // x' = x*cos(rot) - y*sin(rot)
                        // y' = x*sin(rot) + y*cos(rot)
                        // We want deriv(y', t) = 0

                        // Note: rotationZ in this component is already in radians
                        const phi = rotZ;

                        // tan(t) = (ry/rx) * cot(phi)
                        let t1;
                        if (Math.abs(Math.sin(phi)) < 0.001) {
                            // If rotation is near 0 or 180, bottom is at t = -PI/2 (270 deg)
                            t1 = -Math.PI / 2;
                        } else {
                            // deriv y' wrt t: -rx*sin(t)*sin(phi) + ry*cos(t)*cos(phi) = 0
                            // ry*cos(t)*cos(phi) = rx*sin(t)*sin(phi)
                            // tan(t) = (ry/rx) * cot(phi)
                            const val = (ry / rx) / Math.tan(phi);
                            t1 = Math.atan(val);
                        }
                        const t2 = t1 + Math.PI;

                        const getP = (t: number) => ({
                            x: rx * Math.cos(t) * Math.cos(phi) - ry * Math.sin(t) * Math.sin(phi),
                            y: rx * Math.cos(t) * Math.sin(phi) + ry * Math.sin(t) * Math.cos(phi)
                        });

                        const p1 = getP(t1);
                        const p2 = getP(t2);

                        // In 3D (Y-up), bottom is Lowest Y
                        return p1.y < p2.y ? p1 : p2;
                    };

                    const bottomPos = calculateBottomOffset(radiusX, radiusY, rotationZ);

                    return (
                        <>
                            {/* Pitch Label (Center) - Remains at 0,0 but upright */}
                            <Text
                                position={[0, 0, 0]}
                                fontSize={1.5}
                                color="#FFFFFF"
                                anchorX="center"
                                anchorY="middle"
                                fontWeight="bold"
                                outlineWidth={0.05}
                                outlineColor="#1E50A0"
                            >
                                {note.label}
                            </Text>

                            {/* Number Label (Visual Bottom / 6 o'clock) */}
                            {note.id !== 0 && (
                                <Text
                                    position={[bottomPos.x, bottomPos.y - 0.5, 0]} // Position at bottom point + reduced padding (was 1.5)
                                    fontSize={1}
                                    color="#FFFFFF"
                                    anchorX="center"
                                    anchorY="top" // Hang below the point
                                    fontWeight="bold"
                                >
                                    {note.id}
                                </Text>
                            )}

                            {note.id === 0 && (
                                <Text
                                    position={[bottomPos.x, bottomPos.y - 0.5, 0]} // Reduced padding
                                    fontSize={1}
                                    color="#FFFFFF"
                                    anchorX="center"
                                    anchorY="top"
                                    fontWeight="bold"
                                >
                                    D
                                </Text>
                            )}
                        </>
                    );
                })()}
            </group>

            {/* Markers - White */}
            {
                note.id === 0 && (
                    <>
                        <Text
                            position={[25, 0, 0.5]} // 25cm right
                            fontSize={1.2}
                            color="#FFFFFF" // Gold
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            RS
                        </Text>
                        <Text
                            position={[-25, 0, 0.5]} // 25cm left
                            fontSize={1.2}
                            color="#FFFFFF" // Gold
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            LS
                        </Text>
                        <Text
                            position={[0, -15, 0.5]} // 15cm down
                            fontSize={1.2}
                            color="#FFFFFF" // Gold
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            H
                        </Text>
                    </>
                )
            }

        </group >
    );
};


// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
