'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Center, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Scale } from '../data/handpanScales';
import { Lock, Unlock, Camera, Check, Eye, EyeOff, MinusCircle, PlayCircle } from 'lucide-react';
import { HANDPAN_CONFIG, getDomeHeight, TONEFIELD_CONFIG } from '../constants/handpanConfig';
import html2canvas from 'html2canvas';

// Inner component to handle camera reset
const CameraHandler = ({ isLocked, enableZoom = true, enablePan = true }: { isLocked: boolean; enableZoom?: boolean; enablePan?: boolean }) => {
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
            enableRotate={!isLocked} // Disable rotation
            enableZoom={enableZoom}
            enablePan={enablePan}
            minZoom={5}
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
    showLabelToggle = false
}: Digipan3DProps) {
    const [isCameraLockedState, setIsCameraLocked] = useState(isCameraLocked);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [demoNoteId, setDemoNoteId] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // View Mode: 0 = Default (All), 1 = No Labels, 2 = No Mesh (Levels Only), 3 = Hidden (Interaction Only)
    const [viewMode, setViewMode] = useState<0 | 1 | 2 | 3>(initialViewMode);

    const containerRef = useRef<HTMLDivElement>(null);

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

        const sortedNotes = [...notes].sort((a, b) => a.id - b.id);

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

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ background: '#FFFFFF' }}> {/* White Background */}
            {/* Controls Container */}
            <div className="controls-container absolute top-4 right-4 z-10 flex flex-col gap-2">
                {/* 1-3. Admin Controls (Camera, Capture, ViewMode) - Toggle via showControls */}
                {showControls && (
                    <>
                        <button
                            onClick={() => setIsCameraLocked(prev => !prev)}
                            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                            title={isCameraLockedState ? "Unlock View (Free Rotation)" : "Lock View (Top Down)"}
                        >
                            {isCameraLockedState ? <Lock size={24} /> : <Unlock size={24} />}
                        </button>

                        <button
                            onClick={handleCapture}
                            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                            title="Copy Screenshot to Clipboard"
                        >
                            {copySuccess ? <Check size={24} className="text-green-600" /> : <Camera size={24} />}
                        </button>

                        <button
                            onClick={() => setViewMode(prev => (prev + 1) % 4 as 0 | 1 | 2 | 3)}
                            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                            title="Toggle Visibility: All -> No Labels -> Labels Only -> Hidden"
                        >
                            {viewMode === 0 && <Eye size={24} />}
                            {viewMode === 1 && <MinusCircle size={24} />}
                            {viewMode === 2 && <EyeOff size={24} />}
                            {viewMode === 3 && <EyeOff size={24} className="opacity-50" />}
                        </button>
                    </>
                )}

                {/* 3. Label Toggle Button (Simple On/Off for Embedded View) */}
                {showLabelToggle && (
                    <button
                        onClick={() => setViewMode(prev => prev === 3 ? 2 : 3)}
                        className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700"
                        title={viewMode === 3 ? "Show Labels" : "Hide Labels"}
                    >
                        {viewMode === 3 ? <EyeOff size={24} className="opacity-50" /> : <Eye size={24} />}
                    </button>
                )}

                {/* 4. Demo Play - Always Visible unless explicitly hidden (could add showPlayButton prop, but default is desired) */}
                <button
                    onClick={handleDemoPlay}
                    disabled={isPlaying}
                    className={`p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 border border-slate-200 text-slate-700 ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Play Scale Demo"
                >
                    <PlayCircle size={24} className={isPlaying ? "animate-pulse text-green-600" : ""} />
                </button>

                {/* 5. Extra Controls (Injected) - Toggle via showControls to hide external switchers */}
                {showControls && extraControls}
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

                <CameraHandler isLocked={isCameraLockedState} enableZoom={enableZoom} enablePan={enablePan} />

                <Center>
                    <group>
                        {/* Body */}
                        <Suspense fallback={null}>
                            <HandpanImage backgroundImage={backgroundImage} />
                        </Suspense>

                        {/* Static Labels (Decoupled from N0) */}
                        {viewMode === 0 && (
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
                        )}

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
                            />
                        ))}
                    </group>
                </Center>
            </Canvas>


            {/* Scale Info Panel - Bottom Right Overlay */}
            {scale && showInfoPanel && (
                <div className={`absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl text-white shadow-xl z-20 transition-all duration-300 ease-in-out pointer-events-auto ${isInfoExpanded ? 'p-5 max-w-sm' : 'p-3 max-w-[200px]'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Current Scale</h3>
                            {!isInfoExpanded && (
                                <div className="text-sm font-bold text-blue-100 truncate mt-0.5">{scale.name}</div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                            className="text-slate-400 hover:text-white transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-slate-700"
                        >
                            {isInfoExpanded ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {isInfoExpanded && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                                <div className="text-xl font-bold text-blue-100">{scale.name}</div>
                                <button
                                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 transition-colors"
                                    title="Change Scale"
                                >
                                    Change
                                </button>
                            </div>

                            {isSelectorOpen && (
                                <div className="mb-4 flex flex-col max-h-60 bg-slate-800/50 rounded border border-slate-700/50">
                                    {/* Search Input */}
                                    <div className="p-2 border-b border-slate-700/50">
                                        <input
                                            type="text"
                                            placeholder="Search scales..."
                                            className="w-full p-2 text-sm bg-slate-700/50 rounded border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    {/* Scrollable Scale List */}
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar p-1 relative z-50">
                                        {filteredScales.length === 0 ? (
                                            <div className="p-4 text-center text-slate-400 text-xs">
                                                No scales found.
                                            </div>
                                        ) : (
                                            filteredScales.map(s => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    className={`w-full px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-700/50 flex justify-between items-center transition-colors text-left ${scale?.id === s.id
                                                        ? 'bg-blue-900/40 text-blue-200 border border-blue-500/30'
                                                        : 'text-slate-300 border border-transparent'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("Selected scale:", s.name);
                                                        if (onScaleSelect) {
                                                            onScaleSelect(s);
                                                            setIsSelectorOpen(false);
                                                        }
                                                    }}
                                                >
                                                    <span>{s.name}</span>
                                                    {scale?.id === s.id && <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">Active</span>}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* 1. Classification Vectors */}
                                <div className="space-y-1.5">
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
                                <div className="text-sm space-y-1.5 bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-500 font-bold text-xs uppercase tracking-wide w-12 shrink-0">Ding</span>
                                        <span className="font-bold text-lg text-white">{scale.notes.ding}</span>
                                    </div>
                                    <div className="flex items-start gap-2 pt-1 border-t border-slate-700/50">
                                        <span className="text-slate-400 font-bold text-xs uppercase tracking-wide w-12 shrink-0 mt-0.5">Scale</span>
                                        <div className="font-medium text-slate-200 text-sm leading-relaxed">
                                            {scale.notes.top.join(', ')}
                                            {scale.notes.bottom.length > 0 && (
                                                <>
                                                    <span className="text-xs text-slate-500 mx-1">•</span>
                                                    <span className="text-slate-400">
                                                        {scale.notes.bottom.join(', ')}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Tags */}
                                {scale.tags && scale.tags.length > 0 && (
                                    <div className="pt-1">
                                        <div className="flex flex-wrap gap-1.5">
                                            {scale.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-blue-900/40 border border-blue-800/50 px-2 py-0.5 rounded-full text-blue-200">
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
    // ... other props optional for now
}

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
    noteCountFilter?: number;
    // External UI Configuration
    showControls?: boolean;
    showInfoPanel?: boolean;
    initialViewMode?: 0 | 1 | 2 | 3;
    enableZoom?: boolean;
    enablePan?: boolean;
    showLabelToggle?: boolean;
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
    demoActive = false
}: {
    note: NoteData;
    centerX?: number;
    centerY?: number;
    onClick?: (id: number) => void;
    viewMode?: 0 | 1 | 2 | 3;
    demoActive?: boolean;
}) => {
    const [hovered, setHovered] = useState(false);
    const [pulsing, setPulsing] = useState(false);

    // Calculate position
    const cx = note.cx ?? 500;
    const cy = note.cy ?? 500;
    const pos = svgTo3D(cx, cy, centerX, centerY);

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
    const zPos = 0;

    // Trigger Demo Effect
    React.useEffect(() => {
        if (demoActive) {
            // Play Sound
            const filename = note.label.replace('#', '%23');
            const audio = new Audio(`/sounds/${filename}.mp3`);
            audio.volume = 0.6;
            audio.play().catch(() => { /* Ignore */ });

            // Trigger Visual Pulse
            triggerPulse();
        }
    }, [demoActive, note.label]);

    // Animation State logic
    const effectMeshRef = useRef<THREE.Mesh>(null);
    const effectMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const animState = useRef({ active: false, time: 0 });

    // Pulse Configuration
    const PULSE_DURATION = 1.0; // Slightly faster but smoother fade
    const MAX_SCALE_MULT = 1.25; // Expand to 125%

    // Frame Loop for Animation
    useFrame((_state: any, delta: number) => {
        // Only run if active (pulsing state handles visibility, but this handles animation values)
        if (!animState.current.active || !effectMeshRef.current || !effectMaterialRef.current) return;

        animState.current.time += delta;
        const progress = Math.min(animState.current.time / PULSE_DURATION, 1);
        const easeOut = 1 - Math.pow(1 - progress, 2); // Quadratic ease out (softer)

        // Animate Opacity (Fade out)
        // Start at 0.5 opacity, fade to 0
        effectMaterialRef.current.opacity = 0.5 * (1 - easeOut);

        // Animate Scale (Expand)
        // Start at 1.0, end at MAX_SCALE_MULT
        const currentScale = 1 + (MAX_SCALE_MULT - 1) * easeOut;

        // Applying scale to the Group/Mesh. 
        // Note: resizing ring geometry via scale works.
        effectMeshRef.current.scale.set(
            finalRadiusX * currentScale,
            finalRadiusY * currentScale,
            1
        );
        // Wait! The previous Sphere was scaled [finalRadiusX, 0.05, finalRadiusY].
        // The container is rotated [-Math.PI/2, 0, 0] (or similar).
        // Let's check rotation below. 
        // ToneFieldMesh Group > Group rotationZ > Mesh rotationX=90
        // If mesh is RingGeometry (XY plane), and we rotate X 90, it lays flat on XZ.
        // So Scale X acts on X (Width). Scale Y acts on Y (Height -> Depth in 3D).
        // So scale should be [finalRadiusX * s, finalRadiusY * s, 1].

        if (progress >= 1) {
            animState.current.active = false;
            // End of animation
            setPulsing(false);
        }
    });

    const triggerPulse = () => {
        // Start animation
        animState.current = { active: true, time: 0 };
        setPulsing(true); // Make visible via React State

        // Immediate reset of values for the new frame
        if (effectMeshRef.current && effectMaterialRef.current) {
            effectMaterialRef.current.opacity = 0.5;
            effectMeshRef.current.scale.set(finalRadiusX, finalRadiusY, 1);
            effectMeshRef.current.visible = true; // Safety measure
        }
    };

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        onClick?.(note.id);

        // Play Sound
        const filename = note.label.replace('#', '%23');
        const audio = new Audio(`/sounds/${filename}.mp3`);
        audio.volume = 0.6;
        audio.play().catch(() => { /* Ignore */ });

        // Trigger Pulse
        triggerPulse();
    };

    return (
        <group position={[pos.x, pos.y, zPos]}>
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
                    // Visible in 0 (All) and 1 (No Labels). Hidden in 2 (Labels Only) and 3 (Interaction Only)
                    visible={viewMode === 0 || viewMode === 1}
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial
                        color={hovered ? "#60A5FA" : "#FFFFFF"} // Blue Hover, White Idle
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

                {/* 2. Sustain Effect Mesh (Lavender Ring) */}
                <mesh
                    ref={effectMeshRef}
                    position={[0, 0, 0.05]} // Lift slightly above surface to prevent z-fighting
                    rotation={[Math.PI / 2, 0, 0]} // Lay flat
                    // Initial Scale
                    scale={[finalRadiusX, finalRadiusY, 1]}
                    visible={pulsing} // Controlled by State
                >
                    {/* InnerRadius, OuterRadius, ThetaSegments */}
                    <ringGeometry args={[0.85, 1.0, 64]} />
                    <meshBasicMaterial
                        ref={effectMaterialRef}
                        color="#C8A2C8" // Lilac/Lavender distinct from yellow
                        transparent={true}
                        opacity={0}
                        toneMapped={false}
                        depthWrite={false}
                        side={THREE.DoubleSide}
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
                    if (viewMode === 1 || viewMode === 3) return null;

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


        </group >
    );
};


// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
