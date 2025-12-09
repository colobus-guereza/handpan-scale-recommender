'use client';

import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Center, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Scale } from '../data/handpanScales';
import { Lock, Unlock, Camera, Check, Eye, EyeOff, MinusCircle, PlayCircle } from 'lucide-react';
import { HANDPAN_CONFIG, getDomeHeight, TONEFIELD_CONFIG } from '../constants/handpanConfig';
import html2canvas from 'html2canvas';
import { useHandpanAudio } from '../hooks/useHandpanAudio';
import { usePathname } from 'next/navigation';
import ScaleInfoPanel from './ScaleInfoPanel';

// Inner component to handle camera reset
const CameraHandler = ({
    isLocked,
    enableZoom = true,
    enablePan = true,
    sceneSize = { width: 60, height: 60 }
}: {
    isLocked: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    sceneSize?: { width: number; height: number; };
}) => {
    const { camera, gl, size } = useThree();
    const controlsRef = useRef<any>(null);

    React.useEffect(() => {
        const updateZoom = () => {
            if (isLocked) {
                // Smart Auto-Fit Logic
                // Calculate zoom needed to fit width and height
                // Orthographic Camera Zoom = (Screen Dimension / World Dimension) / 2? No.
                // For R3F Orthographic Camera (default zoom=1 matches 1 unit = 1 pixel?), no.
                // Standard R3F Orthographic: zoom is a multiplier.
                // With basic setup, zoom=1 means top=height/2, bottom=-height/2?
                // Actually Digipan3D uses: <Canvas orthographic camera={{ zoom: 12 ... }}>
                // This suggests custom handling.
                // Let's rely on ratio:
                // Current '12' fits ~60 units into ~700px?
                // If Screen Width 700 / 12 = 58 units.
                // So Zoom ~ ScreenDimension / WorldDimension.

                const zoomX = size.width / sceneSize.width;
                const zoomY = size.height / sceneSize.height;

                // Use the smaller zoom to ensure BOTH dimensions fit (contain)
                // Multiply by 0.9 for safety margin (padding)
                const targetZoom = Math.min(zoomX, zoomY) * 0.9;

                // Apply
                camera.position.set(0, 0, 100);
                camera.lookAt(0, 0, 0);
                camera.zoom = targetZoom;
                camera.updateProjectionMatrix();

                if (controlsRef.current) {
                    controlsRef.current.target.set(0, 0, 0);
                    controlsRef.current.update();
                }
            }
        };

        // Update on params change or resize
        updateZoom();
    }, [isLocked, camera, size.width, size.height, sceneSize.width, sceneSize.height]);

    return (
        <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableRotate={!isLocked}
            enableZoom={enableZoom}
            enablePan={enablePan}
            minZoom={2} // Allow zooming out more for large vertical stacks
            maxZoom={50}
        />
    );
};

// ... (HandpanBody, ToneFieldMesh components remain the same)

import { SCALES } from '@/data/handpanScales';

interface Digipan3DProps {
    notes: NoteData[];
    scale?: Scale | null;
    centerX?: number;
    centerY?: number;
    onNoteClick?: (noteId: number) => void;
    isCameraLocked?: boolean;
    onScaleSelect?: (scale: Scale) => void;
    backgroundImage?: string | null;
    extraControls?: React.ReactNode;
    noteCountFilter?: number; // Optional filter for scale list
    enableZoom?: boolean;
    enablePan?: boolean;
    showControls?: boolean;
    showInfoPanel?: boolean;
    initialViewMode?: 0 | 1 | 2 | 3;
    showLabelToggle?: boolean;
    forceCompactView?: boolean;
    backgroundContent?: React.ReactNode;
    tonefieldOffset?: [number, number, number];
    hideStaticLabels?: boolean;
    sceneSize?: { width: number; height: number }; // New Prop for Auto-Fit
}

export default function Digipan3D({
    notes,
    onNoteClick,
    isCameraLocked = false,
    scale,
    centerX = 500,
    centerY = 500,
    onScaleSelect,
    backgroundImage,
    extraControls,
    noteCountFilter = 10,
    // Defaults for Dev Mode (Show All)
    showControls = true,
    showInfoPanel = true,
    initialViewMode = 0,
    enableZoom = true,
    enablePan = true,
    showLabelToggle = false,
    forceCompactView = false,
    backgroundContent,
    tonefieldOffset = [0, 0, 0],
    hideStaticLabels = false,
    sceneSize = { width: 60, height: 60 } // Default for Single Pan
}: Digipan3DProps) {
    const pathname = usePathname();
    // ScaleInfoPanel은 /digipan-3d-test 경로에서만 표시
    const isDevPage = pathname === '/digipan-3d-test';

    const [isCameraLockedState, setIsCameraLocked] = useState(isCameraLocked);
    const [copySuccess, setCopySuccess] = useState(false);
    // Default expanded unless forced compact
    const [isInfoExpanded, setIsInfoExpanded] = useState(!forceCompactView);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [demoNoteId, setDemoNoteId] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // View Mode: 0 = Default (All), 1 = No Labels, 2 = No Mesh (Levels Only), 3 = Hidden (Interaction Only)
    const [viewMode, setViewMode] = useState<0 | 1 | 2 | 3>(initialViewMode);

    // Audio Preloader Hook - Loads all sounds on mount for instant playback
    const { isLoaded: isAudioLoaded, playNote } = useHandpanAudio();

    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-collapse panel when switching to compact view (Mobile Preview)
    useEffect(() => {
        if (forceCompactView) {
            setIsInfoExpanded(false);
        }
    }, [forceCompactView]);

    // Dynamic Scale Filter based on noteCountFilter and Search Query
    const filteredScales = useMemo(() => {
        return SCALES.filter(s => {
            const totalNotes = 1 + s.notes.top.length + s.notes.bottom.length;
            const matchesCount = totalNotes === noteCountFilter;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCount && matchesSearch;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [noteCountFilter, searchQuery]);

    const handleCapture = async () => {
        if (!containerRef.current) return;

        try {
            const controls = containerRef.current.querySelector('.controls-container') as HTMLElement;
            if (controls) controls.style.display = 'none';

            const canvas = await html2canvas(containerRef.current, {
                background: '#FFFFFF',
                logging: false,
                useCORS: true
            });

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

    const handleDemoPlay = async () => {
        if (isPlaying) return;
        setIsPlaying(true);

        // Sort notes by frequency for musical correctness (Low -> High), keeping Ding (ID 0) first
        const ding = notes.find(n => n.id === 0);
        const others = notes.filter(n => n.id !== 0).sort((a, b) => a.frequency - b.frequency);
        const sortedNotes = ding ? [ding, ...others] : others;

        // Helper to trigger a single note
        const playNote = async (id: number, duration: number) => {
            setDemoNoteId(id);
            // Add slight random variation (Rubato)
            const rubato = Math.random() * 30;
            await new Promise(resolve => setTimeout(resolve, duration + rubato));

            setDemoNoteId(null);
            // Minimal gap for clean pulse
            await new Promise(resolve => setTimeout(resolve, 30));
        };

        // 1. Ascending (0 -> Max)
        for (let i = 0; i < sortedNotes.length; i++) {
            const id = sortedNotes[i].id;
            const isDing = id === 0;
            const isTop = i === sortedNotes.length - 1;

            // Timing Logic:
            // - Ding (Root): 500ms (Heavy start)
            // - Top Note: 800ms (Fermata/Peak linger)
            // - Others: 180ms (Fluid flow)
            let baseTime = isDing ? 500 : 180;
            if (isTop) baseTime = 800; // Linger at the peak

            await playNote(id, baseTime);

            // [Modified] 1. Initial Ding Emphasis: Add breath after the first Ding
            if (isDing) {
                await new Promise(resolve => setTimeout(resolve, 600));
            }
        }

        // Explicit Pause/Breath at the Top before descending
        await new Promise(resolve => setTimeout(resolve, 400));

        // 2. Descending (Max -> 0)
        // Repeats the top note to start the descent, as per "D...9 9...D" structure
        for (let i = sortedNotes.length - 1; i >= 0; i--) {
            const id = sortedNotes[i].id;
            const isDing = id === 0;

            // [Modified] 2. Ending Emphasis: Add breath before the final Ding
            if (isDing) {
                await new Promise(resolve => setTimeout(resolve, 600));
            }

            // Standard flow for descent, Ding lasts longer at the end
            const baseTime = isDing ? 800 : 180;

            await playNote(id, baseTime);
        }

        setIsPlaying(false);
    };

    // Determine if we're in mobile mode (either preview or embedded)
    const isMobileButtonLayout = forceCompactView || showLabelToggle;

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ background: '#FFFFFF', touchAction: 'pan-y' }}> {/* White Background, Allow vertical scroll */}
            {/* Top-Right Controls Container - Hidden in Mobile Layout */}
            {!isMobileButtonLayout && (
                <div className="controls-container absolute top-4 right-4 z-50 flex flex-col gap-2 items-center">
                    {/* 1-3. Admin Controls (Camera, Capture, ViewMode) - Toggle via showControls */}
                    {showControls && (
                        <>
                            <button
                                onClick={() => setIsCameraLocked(prev => !prev)}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                                title={isCameraLockedState ? "Unlock View (Free Rotation)" : "Lock View (Top Down)"}
                            >
                                {isCameraLockedState ? <Lock size={20} /> : <Unlock size={20} />}
                            </button>

                            <button
                                onClick={handleCapture}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                                title="Copy Screenshot to Clipboard"
                            >
                                {copySuccess ? <Check size={20} className="text-green-600" /> : <Camera size={20} />}
                            </button>

                            <button
                                onClick={() => setViewMode(prev => (prev + 1) % 4 as 0 | 1 | 2 | 3)}
                                className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                                title="Toggle Visibility: All -> No Labels -> Labels Only -> Hidden"
                            >
                                {viewMode === 0 && <Eye size={20} />}
                                {viewMode === 1 && <MinusCircle size={20} />}
                                {viewMode === 2 && <EyeOff size={20} />}
                                {viewMode === 3 && <EyeOff size={20} className="opacity-50" />}
                            </button>
                        </>
                    )}

                    {/* 4. Demo Play - Always Visible in Desktop Mode */}
                    <button
                        onClick={handleDemoPlay}
                        disabled={isPlaying}
                        className={`w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Play Scale Demo"
                    >
                        <PlayCircle size={24} className={isPlaying ? "animate-pulse text-green-600" : ""} />
                    </button>

                    {/* 5. Extra Controls (Injected) - Toggle via showControls to hide external switchers */}
                    {showControls && extraControls}
                </div>
            )}

            {/* Mobile Layout: Bottom Corner Buttons */}
            {isMobileButtonLayout && (
                <>
                    {/* Bottom-Left: Label Toggle (정보 표시/숨김) */}
                    <div className="absolute bottom-4 left-4 z-50">
                        <button
                            onClick={() => setViewMode(prev => prev === 3 ? 2 : 3)}
                            className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                            title={viewMode === 3 ? "Show Labels" : "Hide Labels"}
                        >
                            {viewMode === 3 ? <EyeOff size={20} className="opacity-50" /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Bottom-Right: Auto-Play (자동재생) */}
                    <div className="absolute bottom-4 right-4 z-50">
                        <button
                            onClick={handleDemoPlay}
                            disabled={isPlaying}
                            className={`w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Play Scale Demo"
                        >
                            <PlayCircle size={24} className={isPlaying ? "animate-pulse text-green-600" : ""} />
                        </button>
                    </div>
                </>
            )}

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

                <CameraHandler
                    isLocked={isCameraLockedState}
                    enableZoom={enableZoom}
                    enablePan={enablePan}
                    sceneSize={sceneSize}
                />

                <Center>
                    <group>
                        {/* Body */}
                        <Suspense fallback={null}>
                            {backgroundContent ? backgroundContent : <HandpanImage backgroundImage={backgroundImage} />}
                        </Suspense>

                        <Text
                            visible={viewMode === 0 && !hideStaticLabels}
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
                            visible={viewMode === 0 && !hideStaticLabels}
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
                            visible={viewMode === 0 && !hideStaticLabels}
                            position={[0, -15, 0.5]} // 15cm down
                            fontSize={1.2}
                            color="#FFFFFF" // Gold
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            H
                        </Text>

                        {/* Tone Fields */}
                        {notes.map((note) => (
                            <ToneFieldMesh
                                key={note.id}
                                note={note}
                                centerX={centerX}
                                centerY={centerY}
                                onClick={onNoteClick}
                                viewMode={viewMode}
                                demoActive={demoNoteId === note.id}
                                playNote={playNote}
                                offset={note.offset || tonefieldOffset} // Prefer note offset, fallback to global
                            />
                        ))}
                    </group>
                </Center>
            </Canvas>



            {/* Scale Info Panel - Bottom Right Overlay (only shown in /digipan-3d-test dev page) */}
            {isDevPage && scale && (
                <ScaleInfoPanel
                    scale={scale}
                    onScaleSelect={onScaleSelect}
                    noteCountFilter={noteCountFilter} // Still passed, but overridden by showAllScales
                    className={`absolute ${isMobileButtonLayout ? 'bottom-20 right-4' : 'bottom-4 right-4'}`}
                    isMobileButtonLayout={isMobileButtonLayout}
                    defaultExpanded={isInfoExpanded}
                    showAllScales={true} // Forcing Global List Logic
                />
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
    frequency: number; // Hz - Used for Audio and Click Feedback
    visualFrequency?: number; // Optional: Override for Visual Geometry calculation
    subLabel?: string; // Number (e.g., 1, 2, 8) - inferred from index if missing
    cx?: number;
    cy?: number;
    scale?: number;
    rotate?: number;
    scaleX?: number; // Independent X Scale multiplier
    scaleY?: number; // Independent Y Scale multiplier
    labelX?: number;
    labelY?: number;
    labelOffset?: number;
    offset?: [number, number, number]; // Per-note offset
    // ... other props optional for now
}

// Duplicate interface removed

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

// Image Component
const HandpanImage = ({ backgroundImage }: { backgroundImage?: string | null }) => {
    // Load the texture if provided
    // Use useTexture inside a conditional or ensure path is valid?
    // useTexture throws if path is invalid. Ideally we only render if path exists.

    // CAUTION: hooks are unconditional. We must use a valid path for useTexture even if we don't use it, 
    // or we must structure this so HandpanImage is only mounted when backgroundImage is valid.
    // However, hooks order matters. 
    // Easier approach: If no image, render nothing inside, but we need to handle useTexture.
    // useTexture can take an array or string.

    // Better: Pass the texture url to HandpanImage. HandpanImage calls useTexture.
    // If we want it optional, we might need a separate component or handle it carefully.
    // For now, let's assume we pass a valid string or a default transparent placeholder if null?
    // Actually, simply: Conditional rendering of the component in the parent.

    if (!backgroundImage) return null;

    return <HandpanImageRenderer url={backgroundImage} />;
};

const HandpanImageRenderer = ({ url }: { url: string }) => {
    const texture = useTexture(url);
    const size = HANDPAN_CONFIG.OUTER_RADIUS * 2;
    return (
        <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={texture} transparent opacity={1} />
        </mesh>
    );
};

const ToneFieldMesh = ({
    note,
    centerX = 500,
    centerY = 500,
    onClick,
    viewMode = 0, // 0: All, 1: No Labels, 2: No Mesh inside, 3: Interaction Only
    demoActive = false,
    playNote,
    offset
}: {
    note: NoteData;
    centerX?: number;
    centerY?: number;
    onClick?: (id: number) => void;
    viewMode?: 0 | 1 | 2 | 3;
    demoActive?: boolean;
    playNote?: (noteName: string, volume?: number) => void;
    offset?: [number, number, number];
}) => {
    const [hovered, setHovered] = useState(false);
    const [pulsing, setPulsing] = useState(false);

    // Calculate position
    const cx = note.cx ?? 500;
    const cy = note.cy ?? 500;
    const pos = svgTo3D(cx, cy, centerX, centerY);

    // Apply Offset
    const [offX, offY, offZ] = offset || [0, 0, 0];
    const finalPosX = pos.x + offX;
    const finalPosY = pos.y + offY;
    const finalPosZ = 0 + offZ; // zPos logic moved here

    // Calculate size (Converted to cm)

    // Rotation
    const rotationZ = -THREE.MathUtils.degToRad(note.rotate || 0);

    // Ding logic
    const isDing = note.id === 0;

    // Dimensions Calculation
    // We use Frequency-based calculation to maintain consistency with the original tuning logic.
    // If visualFrequency is provided (e.g. for Digipan 9 fixed layout), use it. Otherwise use the audio frequency.
    const visualHz = note.visualFrequency ?? (note.frequency || 440);
    const dimensions = getTonefieldDimensions(visualHz, isDing);

    const rx = dimensions.width;
    const ry = dimensions.height;

    const radiusX = rx / 2;
    const radiusY = ry / 2;

    // Calculate Dimple Radius
    // Condition: Ding OR Frequency <= F#3 (185Hz) -> Large Dimple (0.45)
    // Else -> Small Dimple (0.40)
    // Note: When using fixed layout (note.scale), we don't strictly have frequency driving the size, 
    // but we can still use the note's frequency property to determine dimple ratio.
    const dimpleRatio = (isDing || (visualHz) <= TONEFIELD_CONFIG.RATIOS.F_SHARP_3_HZ)
        ? TONEFIELD_CONFIG.RATIOS.DIMPLE_LARGE
        : TONEFIELD_CONFIG.RATIOS.DIMPLE_SMALL;

    const dimpleRadiusX = radiusX * dimpleRatio;
    const dimpleRadiusY = radiusY * dimpleRatio;

    // Apply Overrides (Multipliers)
    // If scaleX/Y are provided, they multiply the calculated radius (or base unit).
    const scaleXMult = note.scaleX ?? 1;
    const scaleYMult = note.scaleY ?? 1;

    const finalRadiusX = radiusX * scaleXMult;
    const finalRadiusY = radiusY * scaleYMult;

    // Z-position: Place on the 0,0 coordinate plane (Top of dome)
    const zPos = finalPosZ; // Use offset Z

    // Trigger Demo Effect
    React.useEffect(() => {
        if (demoActive) {
            // Play Sound via preloaded Howler (instant playback)
            if (playNote) {
                playNote(note.label);
            }

            // Trigger Visual Pulse
            triggerPulse();
        }
    }, [demoActive, note.label, playNote]);

    // ========================================
    // CLICK EFFECT CONFIGURATION
    // ========================================
    const CLICK_EFFECT_CONFIG = {
        // Main Sphere Effect (Breathing Glow)
        sphere: {
            color: '#FF0000',        // Red - TEST
            baseSize: 1.05,          // 5% larger than tonefield
            maxOpacity: 0.1,         // 10% opacity at peak
            scalePulse: 0.15,        // 15% scale variation
        },
        // Impact Ring Effect (Initial strike)
        ring: {
            color: '#FFFFFF',        // White - TEST
            maxOpacity: 0.4,         // 40% opacity at start
            duration: 0.3,           // Quick 0.3s flash
            expandScale: 1.5,        // Expands to 150%
        },
        // Timing
        timing: {
            duration: 1.2,           // Total duration (1.2 seconds)
            attackPhase: 0.15,       // Fast attack (15% of duration)
        }
    };

    // Animation State logic
    const effectMeshRef = useRef<THREE.Mesh>(null);
    const effectMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const impactRingRef = useRef<THREE.Mesh>(null);
    const impactMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const animState = useRef({ active: false, time: 0 });

    // Sound Breathing Configuration
    const SUSTAIN_DURATION = CLICK_EFFECT_CONFIG.timing.duration;

    // Frame Loop for Click Effects Animation
    useFrame((_state: any, delta: number) => {
        if (!animState.current.active || !effectMeshRef.current || !effectMaterialRef.current) {
            return;
        }

        animState.current.time += delta;
        const progress = Math.min(animState.current.time / SUSTAIN_DURATION, 1);

        // === EFFECT 1: Main Sphere (Breathing Glow) ===
        const attackPhase = CLICK_EFFECT_CONFIG.timing.attackPhase;
        let breathCurve: number;

        if (progress < attackPhase) {
            // Very fast fade-in: 0 → 1 in first 15%
            const attackProgress = progress / attackPhase;
            breathCurve = Math.sin(attackProgress * Math.PI / 2);
        } else {
            // Faster fade-out: 1 → 0 in remaining 85%
            const decayProgress = (progress - attackPhase) / (1 - attackPhase);
            breathCurve = Math.cos(decayProgress * Math.PI / 2);
        }

        const opacity = CLICK_EFFECT_CONFIG.sphere.maxOpacity * breathCurve;
        effectMaterialRef.current.opacity = opacity;

        const scaleMultiplier = 1 + CLICK_EFFECT_CONFIG.sphere.scalePulse * breathCurve;
        effectMeshRef.current.scale.set(
            finalRadiusX * CLICK_EFFECT_CONFIG.sphere.baseSize * scaleMultiplier,
            finalRadiusY * CLICK_EFFECT_CONFIG.sphere.baseSize * scaleMultiplier,
            1
        );

        // === EFFECT 2: Impact Ring (Initial Strike Flash) ===
        if (impactRingRef.current && impactMaterialRef.current) {
            const ringDuration = CLICK_EFFECT_CONFIG.ring.duration;
            const ringProgress = Math.min(animState.current.time / ringDuration, 1);

            if (ringProgress < 1) {
                // Quick fade-out with expansion
                const ringCurve = Math.cos(ringProgress * Math.PI / 2); // 1 → 0
                const ringOpacity = CLICK_EFFECT_CONFIG.ring.maxOpacity * ringCurve;
                const ringScale = 1 + (CLICK_EFFECT_CONFIG.ring.expandScale - 1) * ringProgress;

                impactMaterialRef.current.opacity = ringOpacity;

                impactRingRef.current.scale.set(
                    finalRadiusX * ringScale,
                    finalRadiusY * ringScale,
                    1
                );
            } else {
                // Hide ring after duration
                impactMaterialRef.current.opacity = 0;
            }
        }

        if (progress >= 1) {
            animState.current.active = false;
            setPulsing(false);
        }
    });

    // Initialize opacity - DISABLED for testing (JSX now sets opacity={1.0})
    // useEffect(() => {
    //     if (effectMaterialRef.current) {
    //         effectMaterialRef.current.opacity = 0;
    //     }
    // }, []);

    const triggerPulse = () => {
        // Start animation
        animState.current = { active: true, time: 0 };
        setPulsing(true);

        // Initialize at 0 (animation will fade in)
        if (effectMaterialRef.current) {
            effectMaterialRef.current.opacity = 0;
        }
    };

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        onClick?.(note.id);

        // Play Sound via preloaded Howler (instant playback, no network delay)
        if (playNote) {
            playNote(note.label);
        }

        // Trigger Sound Breathing effect
        triggerPulse();
    };

    return (
        <group position={[finalPosX, finalPosY, zPos]}>
            <group rotation={[0, 0, rotationZ]}>
                {/* 1. Tone Field Body */}
                {/* 1-a. Interaction Mesh (Invisible Hit Box) - Always handles events */}
                <mesh
                    onPointerDown={handlePointerDown}
                    onPointerOver={() => {
                        document.body.style.cursor = 'pointer';
                        setHovered(true);
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        setHovered(false);
                    }}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[finalRadiusX, 0.05, finalRadiusY]} // Flattened
                    visible={true} // Must be visible to receive raycast events
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshBasicMaterial
                        transparent={true}
                        opacity={0} // Invisible
                        depthWrite={false} // Prevent depth issues
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* 1-b. Visual Mesh (Wireframe) - No events, controlled by ViewMode */}
                <mesh
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[finalRadiusX, 0.05, finalRadiusY]}
                    visible={viewMode === 0 || viewMode === 1}
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color={hovered ? "#60A5FA" : "#FFFFFF"}
                        emissive={hovered ? "#1E40AF" : "#000000"}
                        emissiveIntensity={hovered ? 0.5 : 0}
                        roughness={0.9}
                        metalness={0.0}
                        wireframe={true}
                        toneMapped={false}
                        transparent={true}
                        opacity={1}
                    />
                </mesh>

                {/* === CLICK EFFECTS === */}

                {/* EFFECT 1: Impact Ring (White Flash) */}
                <mesh
                    ref={impactRingRef}
                    position={[0, 0, 0.6]} // Above the main sphere
                    scale={[finalRadiusX, finalRadiusY, 1]}
                    visible={pulsing}
                    renderOrder={1000} // Above main sphere
                >
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshBasicMaterial
                        ref={impactMaterialRef}
                        color={CLICK_EFFECT_CONFIG.ring.color}
                        transparent={true}
                        opacity={0}
                        toneMapped={false}
                        depthWrite={false}
                        depthTest={false}
                        side={2}
                    />
                </mesh>

                {/* EFFECT 2: Main Sphere (Breathing Glow) */}
                <mesh
                    ref={effectMeshRef}
                    position={[0, 0, 0.5]} // Slightly above tonefield
                    scale={[
                        finalRadiusX * CLICK_EFFECT_CONFIG.sphere.baseSize,
                        finalRadiusY * CLICK_EFFECT_CONFIG.sphere.baseSize,
                        1
                    ]}
                    visible={pulsing}
                    renderOrder={999}
                >
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshBasicMaterial
                        ref={effectMaterialRef}
                        color={CLICK_EFFECT_CONFIG.sphere.color}
                        transparent={true}
                        opacity={0}
                        toneMapped={false}
                        depthWrite={false}
                        depthTest={false}
                        side={2}
                    />
                </mesh>

                {/* 2. Dimple - Wireframe */}
                <mesh
                    position={[0, 0, 0.01]}
                    rotation={[isDing ? Math.PI / 2 : -Math.PI / 2, 0, 0]}
                    scale={[dimpleRadiusX, 0.05, dimpleRadiusY]}
                    // Visible in 0 (All) and 1 (No Labels). Hidden in 2 (Labels Only) and 3 (Interaction Only)
                    visible={viewMode === 0 || viewMode === 1}
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color="#FFFFFF"
                        roughness={0.9}
                        metalness={0.0}
                        wireframe={true}
                        transparent={true}
                        opacity={1} // Was opacity conditional, now controlled by visible prop
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

                    const bottomPos = calculateBottomOffset(finalRadiusX, finalRadiusY, rotationZ);

                    // Show labels only if viewMode is 0 (All Visible) or 2 (Labels Only/No Mesh)
                    // Mode 1 = Mesh Only (No Labels) and Mode 3 = Interaction Only (No Labels, No Mesh)
                    // if (viewMode === 1 || viewMode === 3) return null; // Removed early return to keep components mounted

                    const areLabelsVisible = viewMode === 0 || viewMode === 2;

                    return (
                        <>
                            {/* Pitch Label (Center) - Remains at 0,0 but upright */}
                            <Text
                                visible={areLabelsVisible}
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
                            {/* Determine Display Label: Use subLabel if present, otherwise ID (or 'D' for ID 0) */}
                            {(() => {
                                const displayText = note.subLabel ? note.subLabel : (note.id === 0 ? 'D' : note.id.toString());
                                return (
                                    <Text
                                        visible={areLabelsVisible}
                                        position={[bottomPos.x, bottomPos.y - 0.5, 0]}
                                        fontSize={1}
                                        color="#FFFFFF"
                                        anchorX="center"
                                        anchorY="top"
                                        fontWeight="bold"
                                    >
                                        {displayText}
                                    </Text>
                                );
                            })()}
                        </>
                    );
                })()}
            </group>

            {/* Markers - White */}


        </group >
    );
};


// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
