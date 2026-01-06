'use client';

import React, { useState, useRef, useMemo, Suspense, useEffect, useCallback } from 'react';
import * as Tone from 'tone';

// Shared mobile button style for consistent size and appearance
const btnMobile = "w-[38.4px] h-[38.4px] flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 hover:bg-white transition-all duration-200";
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Center, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Scale } from '@/data/handpan-data';
import { Lock, Unlock, Camera, Check, Eye, EyeOff, MinusCircle, PlayCircle, Play, Ship, Pointer, Disc, Square, Drum, Music, Music2, Download, Trash2 } from 'lucide-react';
import { HANDPAN_CONFIG, getDomeHeight, TONEFIELD_CONFIG } from '../constants/handpanConfig';
import { DIGIPAN_VIEW_CONFIG, DIGIPAN_LABEL_POS_FACTOR } from '../constants/digipanViewConfig';
import html2canvas from 'html2canvas';
import { useHandpanAudio } from '../hooks/useHandpanAudio';
import { usePathname } from 'next/navigation';
import ScaleInfoPanel from './ScaleInfoPanel';
import TouchText from './TouchText';
import CyberBoat from './CyberBoat';
import { useOctaveResonance, ResonanceSettings } from '../hooks/useOctaveResonance';
import { DEFAULT_HARMONIC_SETTINGS, DigipanHarmonicConfig } from '../constants/harmonicDefaults';
import { useDigipanRecorder } from '../hooks/useDigipanRecorder';
import { useJamSession } from '@/hooks/useJamSession';
import { calculateChordProgression, ChordSet } from '../utils/ChordCalculator';
import { useRhythmEngine, RhythmPreset } from '@/hooks/useRhythmEngine';

const CameraHandler = ({
    isLocked,
    enableZoom = true,
    enablePan = true,
    sceneSize = { width: 60, height: 60 },
    cameraTargetY = 0,
    cameraZoom = 12 // Default base zoom
}: {
    isLocked: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    sceneSize?: { width: number; height: number; };
    cameraTargetY?: number;
    cameraZoom?: number;
}) => {
    const { camera, gl, size } = useThree();
    const controlsRef = useRef<any>(null);

    React.useEffect(() => {
        const updateZoom = () => {
            if (isLocked) {
                const zoomX = size.width / sceneSize.width;
                const zoomY = size.height / sceneSize.height;

                const zoomFactor = cameraZoom / 12;
                const targetZoom = Math.min(zoomX, zoomY) * 0.9 * zoomFactor;

                camera.position.set(0, cameraTargetY, 100);
                camera.lookAt(0, cameraTargetY, 0);
                camera.zoom = targetZoom;
                camera.updateProjectionMatrix();

                if (controlsRef.current) {
                    controlsRef.current.target.set(0, cameraTargetY, 0);
                    controlsRef.current.update();
                }
            } else {
                if (controlsRef.current) {
                    controlsRef.current.target.setY(cameraTargetY);
                    controlsRef.current.update();
                }
            }
        };

        updateZoom();
    }, [isLocked, camera, size.width, size.height, sceneSize.width, sceneSize.height, cameraZoom, cameraTargetY]);

    // Locked 모드일 때는 OrbitControls를 아예 렌더링하지 않음 (모바일 스크롤 문제 해결)
    if (isLocked) return null;

    return (
        <OrbitControls
            ref={controlsRef}
            enableRotate={!isLocked}
            enableZoom={enableZoom}
            enablePan={enablePan}
            minZoom={2}
            maxZoom={50}
            touches={{ ONE: null, TWO: null }}
        />
    );
};

import { SCALES } from '@/data/handpan-data';

interface NoteData {
    id: number;
    label: string;
    frequency: number;
    visualFrequency?: number;
    subLabel?: string;
    cx?: number;
    cy?: number;
    scale?: number;
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
    labelX?: number;
    labelY?: number;
    labelOffset?: number;
    offset?: [number, number, number];
    position?: string;
    hideGuide?: boolean;
    textColor?: string;
    outlineColor?: string;
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
    enableZoom?: boolean;
    enablePan?: boolean;
    showControls?: boolean;
    showInfoPanel?: boolean;
    initialViewMode?: 0 | 1 | 2 | 3 | 4;
    viewMode?: 0 | 1 | 2 | 3 | 4;
    onViewModeChange?: (mode: 0 | 1 | 2 | 3 | 4) => void;
    showLabelToggle?: boolean;
    forceCompactView?: boolean;
    backgroundContent?: React.ReactNode;
    tonefieldOffset?: [number, number, number];
    hideStaticLabels?: boolean;
    sceneSize?: { width: number; height: number };
    cameraTargetY?: number;
    showAxes?: boolean;
    harmonicSettings?: DigipanHarmonicConfig;
    onIsRecordingChange?: (isRecording: boolean) => void;
    cameraZoom?: number;
    hideTouchText?: boolean;
    drumPreset?: string; // e.g. 'basic', 'lofi'
}

export interface Digipan3DHandle {
    handleCapture: () => Promise<void>;
    handleDemoPlay: () => Promise<void>;
    handleRecordToggle: () => Promise<void>;
    toggleViewMode: () => void;
    toggleIdleBoat: () => void;
    toggleTouchText: () => void;
}

const TONEFIELD_RATIO_X = 0.3;
const TONEFIELD_RATIO_Y = 0.425;

export const svgTo3D = (x: number, y: number, centerX: number = 500, centerY: number = 500) => {
    const svgScale = HANDPAN_CONFIG.PAN_RADIUS / 480;
    return {
        x: (x - centerX) * svgScale,
        y: -(y - centerY) * svgScale,
    };
};

export const getTonefieldDimensions = (hz: number, isDing: boolean) => {
    const { DING, NORMAL, RATIOS } = TONEFIELD_CONFIG;
    const refConfig = isDing ? DING : NORMAL;
    const ratio = Math.pow((refConfig.REF_HZ / hz), refConfig.SCALING_FACTOR);
    const height = refConfig.REF_HEIGHT * ratio;
    const width = height * RATIOS.ASPECT_W_H;
    const useLargeDimple = isDing || hz <= RATIOS.F_SHARP_3_HZ;
    const dimpleRatio = useLargeDimple ? RATIOS.DIMPLE_LARGE : RATIOS.DIMPLE_SMALL;
    return { width, height, dimpleWidth: width * dimpleRatio, dimpleHeight: height * dimpleRatio };
};

const HandpanImage = ({ backgroundImage, centerX = 500, centerY = 500 }: { backgroundImage?: string | null; centerX?: number; centerY?: number; }) => {
    if (!backgroundImage) return null;
    const pos = svgTo3D(500, 500, centerX, centerY);
    return <HandpanImageRenderer url={backgroundImage} position={[pos.x, pos.y, -0.5]} />;
};

const HandpanImageRenderer = ({ url, position }: { url: string; position: [number, number, number] }) => {
    const texture = useTexture(url);
    useEffect(() => {
        console.log(`[DEBUG_SYNC] HandpanImage RENDERED (Suspense Resolved): ${url} at ${Date.now()}`);
    }, [url]);

    const size = HANDPAN_CONFIG.OUTER_RADIUS * 2;
    return (
        <mesh position={position} rotation={[0, 0, 0]}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={texture} transparent opacity={1} />
        </mesh>
    );
};

const ToneFieldMesh = React.memo(({
    note,
    centerX = 500,
    centerY = 500,
    onClick,
    viewMode = 0,
    demoActive = false,
    playNote,
    offset,
    isScrollingRef
}: {
    note: NoteData;
    centerX?: number;
    centerY?: number;
    onClick?: (id: number) => void;
    viewMode?: 0 | 1 | 2 | 3 | 4;
    demoActive?: boolean;
    playNote?: (noteName: string, volume?: number) => void;
    offset?: [number, number, number];
    isScrollingRef?: React.MutableRefObject<boolean>;
}) => {
    // Log note rendering - Removed for production optimization
    // if (note.id === 0) {
    //     console.log(`[DEBUG_SYNC] ToneFieldMesh (Ding) RENDERED at ${Date.now()}`);
    // }

    const [hovered, setHovered] = useState(false);
    const [pulsing, setPulsing] = useState(false);

    // Shader Warmup State
    const isWarmedUp = useRef(false);

    useEffect(() => {
        // [Shader Warmup]
        // Force strict visibility on mount to trigger shader compilation
        if (!isWarmedUp.current) {
            setPulsing(true);

            // Immediately hide via direct access to prevent flash
            if (effectMaterialRef.current) effectMaterialRef.current.opacity = 0;
            if (impactMaterialRef.current) impactMaterialRef.current.opacity = 0;

            const timer = setTimeout(() => {
                setPulsing(false);
                isWarmedUp.current = true;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const cx = note.cx ?? 500;
    const cy = note.cy ?? 500;
    const pos = svgTo3D(cx, cy, centerX, centerY);
    const [offX, offY, offZ] = offset || [0, 0, 0];
    const finalPosX = pos.x + offX;
    const finalPosY = pos.y + offY;
    const finalPosZ = 0 + offZ;
    const rotationZ = -THREE.MathUtils.degToRad(note.rotate || 0);
    const isDing = note.id === 0;
    const isBottom = note.position === 'bottom';
    const visualHz = note.visualFrequency ?? (note.frequency || 440);
    const dimensions = getTonefieldDimensions(visualHz, isDing);
    const rx = dimensions.width;
    const ry = dimensions.height;
    const radiusX = rx / 2;
    const radiusY = ry / 2;
    const dimpleRatio = (isDing || (visualHz) <= TONEFIELD_CONFIG.RATIOS.F_SHARP_3_HZ)
        ? TONEFIELD_CONFIG.RATIOS.DIMPLE_LARGE
        : TONEFIELD_CONFIG.RATIOS.DIMPLE_SMALL;
    const dimpleRadiusX = radiusX * dimpleRatio;
    const dimpleRadiusY = ry * dimpleRatio;
    const scaleXMult = note.scaleX ?? 1;
    const scaleYMult = note.scaleY ?? 1;
    const finalRadiusX = radiusX * scaleXMult;
    const finalRadiusY = radiusY * scaleYMult;
    const zPos = finalPosZ;

    React.useEffect(() => {
        if (demoActive) {
            if (playNote) playNote(note.label);
            triggerPulse();
        }
    }, [demoActive, note.label, playNote]);

    const CLICK_EFFECT_CONFIG = {
        sphere: { color: '#00FF00', baseSize: 1.05, maxOpacity: 0.1, scalePulse: 0.15 },
        ring: { color: '#000000', maxOpacity: 0.4, duration: 0.3, expandScale: 1.5 },
        timing: { duration: 1.2, attackPhase: 0.15 }
    };
    const effectMeshRef = useRef<THREE.Mesh>(null);
    const effectMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const impactRingRef = useRef<THREE.Mesh>(null);
    const impactMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const animState = useRef({ active: false, time: 0 });
    const SUSTAIN_DURATION = CLICK_EFFECT_CONFIG.timing.duration;

    useFrame((_state: any, delta: number) => {
        // Skip changes if we are just warming up (keep opacity 0)
        if (!isWarmedUp.current) {
            if (effectMaterialRef.current) effectMaterialRef.current.opacity = 0;
            if (impactMaterialRef.current) impactMaterialRef.current.opacity = 0;
            return;
        }

        if (!animState.current.active || !effectMeshRef.current || !effectMaterialRef.current) return;
        animState.current.time += delta;
        const progress = Math.min(animState.current.time / SUSTAIN_DURATION, 1);
        const attackPhase = CLICK_EFFECT_CONFIG.timing.attackPhase;
        let breathCurve;
        if (progress < attackPhase) {
            breathCurve = Math.sin((progress / attackPhase) * Math.PI / 2);
        } else {
            breathCurve = Math.cos(((progress - attackPhase) / (1 - attackPhase)) * Math.PI / 2);
        }
        const opacity = CLICK_EFFECT_CONFIG.sphere.maxOpacity * breathCurve;
        effectMaterialRef.current.opacity = opacity;
        const scaleMultiplier = 1 + CLICK_EFFECT_CONFIG.sphere.scalePulse * breathCurve;
        effectMeshRef.current.scale.set(finalRadiusX * CLICK_EFFECT_CONFIG.sphere.baseSize * scaleMultiplier, finalRadiusY * CLICK_EFFECT_CONFIG.sphere.baseSize * scaleMultiplier, 1);
        if (impactRingRef.current && impactMaterialRef.current) {
            const ringDuration = CLICK_EFFECT_CONFIG.ring.duration;
            const ringProgress = Math.min(animState.current.time / ringDuration, 1);
            if (ringProgress < 1) {
                const ringCurve = Math.cos(ringProgress * Math.PI / 2);
                const ringOpacity = CLICK_EFFECT_CONFIG.ring.maxOpacity * ringCurve;
                const ringScale = 1 + (CLICK_EFFECT_CONFIG.ring.expandScale - 1) * ringProgress;
                impactMaterialRef.current.opacity = ringOpacity;
                impactRingRef.current.scale.set(finalRadiusX * ringScale, finalRadiusY * ringScale, 1);
            } else impactMaterialRef.current.opacity = 0;
        }
        if (progress >= 1) { animState.current.active = false; setPulsing(false); }
    });

    const triggerPulse = () => {
        animState.current = { active: true, time: 0 };
        setPulsing(true);
        if (effectMaterialRef.current) effectMaterialRef.current.opacity = 0;
    };

    const handlePointerDown = (e: any) => {
        // 스크롤 중이면 음 재생 건너뛰고 이벤트 전파 허용 (페이지 스크롤)
        if (isScrollingRef?.current) {
            return;
        }
        e.stopPropagation();
        onClick?.(note.id);
        if (playNote) playNote(note.label);
        triggerPulse();
    };

    return (
        <group position={[finalPosX, finalPosY, zPos]}>
            <group rotation={[0, 0, rotationZ]}>
                <mesh
                    onPointerDown={handlePointerDown}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[finalRadiusX, 0.05, finalRadiusY]}
                    position={[0, 0, 0.2]}
                    visible={true}
                >
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} scale={[finalRadiusX, 0.05, finalRadiusY]} visible={viewMode === 0 || viewMode === 1}>
                    <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color={hovered ? "#60A5FA" : "#FFFFFF"} emissive={hovered ? "#1E40AF" : "#000000"} emissiveIntensity={hovered ? 0.5 : 0} roughness={0.9} metalness={0.0} wireframe transparent opacity={1} />
                </mesh>
                {isBottom && !note.hideGuide && (
                    <mesh position={[0, 0, 0.1]} rotation={[0, 0, 0]} scale={[1.5 * scaleXMult, 1.5 * scaleXMult, 1.5 * scaleXMult]} visible={viewMode === 4}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial color={hovered ? "#60A5FA" : "#A0522D"} emissive={hovered ? "#1E40AF" : "#000000"} emissiveIntensity={hovered ? 0.5 : 0} roughness={0.4} metalness={0.0} transparent opacity={0.9} />
                    </mesh>
                )}
                <mesh ref={impactRingRef} position={[0, 0, 0.6]} scale={[finalRadiusX, finalRadiusY, 1]} visible={pulsing} renderOrder={1000}>
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshBasicMaterial ref={impactMaterialRef} color={CLICK_EFFECT_CONFIG.ring.color} transparent opacity={0} side={2} depthWrite={false} depthTest={false} toneMapped={false} />
                </mesh>
                <mesh ref={effectMeshRef} position={[0, 0, 0.5]} scale={[finalRadiusX * 1.05, finalRadiusY * 1.05, 1]} visible={pulsing} renderOrder={999}>
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshBasicMaterial ref={effectMaterialRef} color={CLICK_EFFECT_CONFIG.sphere.color} transparent opacity={0} side={2} depthWrite={false} depthTest={false} toneMapped={false} />
                </mesh>
                {!isBottom && (
                    <mesh position={[0, 0, 0.01]} rotation={[isDing ? Math.PI / 2 : -Math.PI / 2, 0, 0]} scale={[dimpleRadiusX, 0.05, dimpleRadiusY]} visible={viewMode === 0 || viewMode === 1}>
                        <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial color="#FFFFFF" roughness={0.9} metalness={0.0} wireframe transparent opacity={1} />
                    </mesh>
                )}
            </group>
            <group position={[0, 0, 1]}>
                {(() => {
                    const calculateBottomOffset = (rx: number, ry: number, rotZ: number) => {
                        const phi = rotZ;
                        let t1;
                        if (Math.abs(Math.sin(phi)) < 0.001) t1 = -Math.PI / 2;
                        else t1 = Math.atan((ry / rx) / Math.tan(phi));
                        const t2 = t1 + Math.PI;
                        const getP = (t: number) => ({
                            x: rx * Math.cos(t) * Math.cos(phi) - ry * Math.sin(t) * Math.sin(phi),
                            y: rx * Math.cos(t) * Math.sin(phi) + ry * Math.sin(t) * Math.cos(phi)
                        });
                        const p1 = getP(t1), p2 = getP(t2);
                        return p1.y < p2.y ? p1 : p2;
                    };
                    const bottomPos = calculateBottomOffset(finalRadiusX * DIGIPAN_LABEL_POS_FACTOR, finalRadiusY * DIGIPAN_LABEL_POS_FACTOR, rotationZ);
                    const areLabelsVisible = viewMode === 0 || viewMode === 2;
                    return (
                        <>
                            <Text visible={areLabelsVisible} position={[0, 0, 0]} fontSize={3.0} color={note.textColor || (isBottom ? '#333333' : '#FFFFFF')} anchorX="center" anchorY="middle" fontWeight="bold" outlineWidth={0.05} outlineColor={note.outlineColor || (isBottom ? '#CCCCCC' : '#000000')}>{note.label}</Text>
                            <Text visible={areLabelsVisible} position={[bottomPos.x, bottomPos.y - 0.05, 0]} fontSize={2.0} color={note.textColor || (isBottom ? '#333333' : '#FFFFFF')} anchorX="center" anchorY="top" fontWeight="bold" outlineWidth={0.05} outlineColor={note.outlineColor || (isBottom ? '#CCCCCC' : '#000000')}>{note.subLabel || (note.id + 1).toString()}</Text>
                        </>
                    );
                })()}
            </group>
        </group>
    );
});

const Digipan3D = React.forwardRef<Digipan3DHandle, Digipan3DProps>(({
    notes, onNoteClick, isCameraLocked = false, scale, centerX = 500, centerY = 500, onScaleSelect, backgroundImage, extraControls, noteCountFilter = 10, showControls = true, showInfoPanel = true, initialViewMode = 0, viewMode: controlledViewMode, onViewModeChange, enableZoom = true, enablePan = true, showLabelToggle = false, forceCompactView = false, backgroundContent, tonefieldOffset = [0, 0, 0], hideStaticLabels = false, sceneSize = { width: 60, height: 60 }, cameraTargetY = 0, showAxes = false, harmonicSettings, onIsRecordingChange, cameraZoom, hideTouchText = false, drumPreset
}, ref) => {
    const pathname = usePathname();
    const isDevPage = pathname === '/digipan-dev';
    const [isCameraLockedState, setIsCameraLocked] = useState(isCameraLocked);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isInfoExpanded, setIsInfoExpanded] = useState(!forceCompactView);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [demoNoteId, setDemoNoteId] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [drumTimer, setDrumTimer] = useState<number | null>(null);
    const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);
    const { isLoaded: isAudioLoaded, loadingProgress, playNote, getAudioContext, getMasterGain } = useHandpanAudio();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 터치 제스처 판별을 위한 상태 (스크롤 vs 탭)
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const isScrollingRef = useRef(false);
    const SCROLL_THRESHOLD = 10; // px - 세로 이동 임계값

    useEffect(() => {
        if (containerRef.current) {
            const canvasEl = containerRef.current.querySelector('canvas');
            if (canvasEl) (canvasRef as any).current = canvasEl;
        }
    }, []);

    const isMobileButtonLayout = forceCompactView || showLabelToggle;

    const downloadFile = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    };

    const handleSaveRecording = async (filename: string, directBlob?: Blob) => {
        const blobToUse = directBlob || currentBlob;
        if (!blobToUse) return;
        const ext = blobToUse.type.includes('mp4') ? 'mp4' : 'webm';
        const fullFilename = `${filename}.${ext}`;
        const file = new File([blobToUse], fullFilename, { type: blobToUse.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: 'Digipan Performance', text: 'Check out my handpan performance!' }); } catch (err: any) { if (err.name !== 'AbortError') downloadFile(blobToUse, fullFilename); }
        } else downloadFile(blobToUse, fullFilename);
        if (!directBlob) setCurrentBlob(null);
    };

    const handleRecordingComplete = useCallback((blob: Blob) => {
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobileUA) setCurrentBlob(blob);
        else { try { handleSaveRecording(`digipan-performance-${Date.now()}`, blob); } catch (err) { console.error("Auto-save failed:", err); setCurrentBlob(blob); } }
    }, []);

    const { isRecording, startRecording, stopRecording } = useDigipanRecorder({ canvasRef, getAudioContext, getMasterGain, onRecordingComplete: handleRecordingComplete });

    useEffect(() => { if (onIsRecordingChange) onIsRecordingChange(isRecording); }, [isRecording]);

    const dingNote = notes.find(n => n.id === 0)?.label || "D3";
    const scaleNoteNames = useMemo(() => notes.map(n => n.label), [notes]);

    // Use the new isolated engine
    const { togglePlay: toggleJam, isPlaying: isJamPlaying, introCountdown, onInteraction } = useRhythmEngine({
        bpm: 100,
        rootNote: dingNote,
        scaleNotes: scaleNoteNames,
        preset: (drumPreset as RhythmPreset) || 'basic'
    });

    const totalDuration = 38.4;
    const toggleDrum = () => { toggleJam(); if (drumTimer !== null) setDrumTimer(null); else setDrumTimer(Math.ceil(totalDuration)); };

    const [isIdle, setIsIdle] = useState(true);
    const [showIdleBoat, setShowIdleBoat] = useState(false);
    const [showTouchText, setShowTouchText] = useState(!hideTouchText);
    const lastInteractionTime = useRef(Date.now() - 6000);
    const IDLE_TIMEOUT = 5000;
    const idleCheckInterval = useRef<NodeJS.Timeout | null>(null);

    const resetIdleTimer = useCallback((delayOverhead = 0) => { lastInteractionTime.current = Date.now() + delayOverhead; setIsIdle(prev => prev ? false : prev); }, []);

    useEffect(() => {
        idleCheckInterval.current = setInterval(() => { const now = Date.now(); if (now - lastInteractionTime.current > IDLE_TIMEOUT) setIsIdle(true); }, 1000);
        return () => { if (idleCheckInterval.current) clearInterval(idleCheckInterval.current); };
    }, []);

    useEffect(() => {
        if (drumTimer === null || drumTimer <= 0) { if (drumTimer === 0) { setDrumTimer(null); if (isJamPlaying) toggleJam(); } return; }
        const interval = setInterval(() => { setDrumTimer(prev => (prev === null || prev <= 1) ? null : prev - 1); }, 1000);
        return () => clearInterval(interval);
    }, [drumTimer, isJamPlaying]);

    const [internalViewMode, setInternalViewMode] = useState<0 | 1 | 2 | 3 | 4>(controlledViewMode !== undefined ? controlledViewMode : initialViewMode);
    useEffect(() => { if (controlledViewMode !== undefined) setInternalViewMode(controlledViewMode); }, [controlledViewMode]);
    const viewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

    const setViewMode = (modeOrFn: 0 | 1 | 2 | 3 | 4 | ((prev: 0 | 1 | 2 | 3 | 4) => 0 | 1 | 2 | 3 | 4)) => {
        let newMode: 0 | 1 | 2 | 3 | 4;
        if (typeof modeOrFn === 'function') newMode = modeOrFn(viewMode);
        else newMode = modeOrFn;
        if (onViewModeChange) onViewModeChange(newMode);
        else setInternalViewMode(newMode);
    };

    const { playResonantNote, preloadNotes } = useOctaveResonance({ getAudioContext, getMasterGain });
    const activeHarmonicConfig = harmonicSettings || DEFAULT_HARMONIC_SETTINGS;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if (forceCompactView) setIsInfoExpanded(false); }, [forceCompactView]);
    useEffect(() => { setIsCameraLocked(isCameraLocked); }, [isCameraLocked]);

    const resonanceMap = useMemo(() => {
        const map: Record<number, { label: string; settings: ResonanceSettings }[]> = {};
        notes.forEach(sourceNote => {
            if (!sourceNote.frequency) return;
            const targets: { label: string; settings: ResonanceSettings }[] = [];
            notes.forEach(targetNote => {
                if (targetNote.id === sourceNote.id || !targetNote.frequency) return;
                const ratio = targetNote.frequency / sourceNote.frequency;
                if ((Math.abs(ratio - 2.0) < 0.03 || Math.abs(ratio - 4.0) < 0.03) && activeHarmonicConfig.octave.active) targets.push({ label: targetNote.label, settings: { trimStart: activeHarmonicConfig.octave.trim, fadeInDuration: activeHarmonicConfig.octave.fade, fadeInCurve: activeHarmonicConfig.octave.curve, delayTime: activeHarmonicConfig.octave.latency, masterGain: activeHarmonicConfig.octave.gain } });
                if (Math.abs(ratio - 3.0) < 0.03 && activeHarmonicConfig.fifth.active) targets.push({ label: targetNote.label, settings: { trimStart: activeHarmonicConfig.fifth.trim, fadeInDuration: activeHarmonicConfig.fifth.fade, fadeInCurve: activeHarmonicConfig.fifth.curve, delayTime: activeHarmonicConfig.fifth.latency, masterGain: activeHarmonicConfig.fifth.gain } });
            });
            if (targets.length > 0) map[sourceNote.id] = targets;
        });
        return map;
    }, [notes, activeHarmonicConfig]);

    useEffect(() => { if (!notes || notes.length === 0) return; const uniqueNotes = new Set<string>(); notes.forEach(n => uniqueNotes.add(n.label)); preloadNotes(Array.from(uniqueNotes)); }, [notes]);

    const [interactionCount, setInteractionCount] = useState(0);
    const handleToneFieldClick = useCallback((id: number) => {
        const resonantTargets = resonanceMap[id];
        if (resonantTargets) resonantTargets.forEach(target => playResonantNote(target.label, target.settings));
        resetIdleTimer(3500); setInteractionCount(prev => prev + 1);
        if (onNoteClick) onNoteClick(id); if (isJamPlaying) onInteraction();
    }, [resonanceMap, playResonantNote, onNoteClick, resetIdleTimer, isJamPlaying, onInteraction]);

    const handleCapture = async () => {
        if (!containerRef.current) return;
        const controls = containerRef.current.querySelector('.controls-container') as HTMLElement;
        if (controls) controls.style.display = 'none';
        const canvas = await html2canvas(containerRef.current, { backgroundColor: '#FFFFFF', logging: false, useCORS: true });
        if (controls) controls.style.display = 'flex';
        canvas.toBlob(async (blob) => { if (blob) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } catch (err) { console.error('Failed to copy to clipboard:', err); } } });
    };

    const handleDemoPlay = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        const sortedNotes = [...notes].sort((a: any, b: any) => a.frequency - b.frequency);
        console.log(`[DemoPlay] Starting. Total notes: ${sortedNotes.length}`);
        const lowestNoteId = sortedNotes.length > 0 ? sortedNotes[0].id : -1;
        const playNoteInternal = async (id: number, duration: number, indexLabel: string) => {
            console.log(`[DemoPlay] Playing Note: ${id} (${indexLabel}), duration: ${duration}ms`);
            setDemoNoteId(id);
            const rubato = Math.random() * 30;
            await new Promise(resolve => setTimeout(resolve, duration + rubato));
            setDemoNoteId(null); await new Promise(resolve => setTimeout(resolve, 30));
        };
        resetIdleTimer(10000);
        for (let i = 0; i < sortedNotes.length; i++) {
            const id = sortedNotes[i].id;
            const isRoot = id === lowestNoteId;
            const isTop = i === sortedNotes.length - 1;
            let baseTime = isRoot ? 500 : 180;
            if (isTop) baseTime = 800;
            await playNoteInternal(id, baseTime, `Ascending ${i + 1}/${sortedNotes.length}`);
            if (isRoot) { console.log(`[DemoPlay] Root Emphasis Breath (Ascending): 600ms`); await new Promise(resolve => setTimeout(resolve, 600)); }
        }
        await new Promise(resolve => setTimeout(resolve, 400));
        for (let i = sortedNotes.length - 1; i >= 0; i--) {
            const id = sortedNotes[i].id;
            const isRoot = id === lowestNoteId;
            if (i === 0) { console.log(`[DemoPlay] FINAL cadence breath: 600ms start...`); await new Promise(resolve => setTimeout(resolve, 600)); console.log(`[DemoPlay] FINAL cadence breath: done. Playing last note now.`); }
            const baseTime = (id === lowestNoteId) ? 800 : 180;
            await playNoteInternal(id, baseTime, `Descending ${sortedNotes.length - i}/${sortedNotes.length}`);
        }
        console.log(`[DemoPlay] Finished.`);
        setIsPlaying(false); resetIdleTimer(5000);
    };

    const handleSaveAction = async () => { if (currentBlob) { await handleSaveRecording(`digipan-performance-${Date.now()}`, currentBlob); setCurrentBlob(null); } };
    useEffect(() => { if (currentBlob && isMobileButtonLayout) handleSaveAction(); }, [currentBlob]);
    const handleDiscardAction = () => setCurrentBlob(null);
    const handleRecordToggle = async () => { if (isRecording) stopRecording(); else startRecording(); };

    // 터치 제스처 핸들러 (스크롤 vs 탭 구분)
    const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };
        isScrollingRef.current = false;
    }, []);

    const handleContainerTouchMove = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current) return;

        const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
        const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);

        // 세로 이동량이 가로보다 크고 임계값 이상이면 스크롤 모드
        if (deltaY > deltaX && deltaY > SCROLL_THRESHOLD) {
            isScrollingRef.current = true;
        }
    }, []);

    const handleContainerTouchEnd = useCallback(() => {
        touchStartRef.current = null;
        // 다음 터치를 위해 스크롤 모드 해제
        setTimeout(() => { isScrollingRef.current = false; }, 100);
    }, []);

    React.useImperativeHandle(ref, () => ({ handleCapture, handleDemoPlay, handleRecordToggle, toggleViewMode: () => setViewMode(prev => (prev + 1) % 5 as 0 | 1 | 2 | 3 | 4), toggleIdleBoat: () => setShowIdleBoat(prev => !prev), toggleTouchText: () => setShowTouchText(prev => !prev) }));

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ background: '#FFFFFF', touchAction: 'pan-y' }}
            onTouchStart={handleContainerTouchStart}
            onTouchMove={handleContainerTouchMove}
            onTouchEnd={handleContainerTouchEnd}>
            {isMobileButtonLayout && showControls && extraControls && <div className="controls-container absolute top-12 right-4 z-50 flex flex-col gap-2 items-center">{extraControls}</div>}
            {!isDevPage && (
                <div className={`absolute ${isMobileButtonLayout ? 'top-2' : 'top-4'} right-4 z-50 flex flex-row items-center gap-2`}>
                    <button onClick={() => setViewMode(prev => prev === 3 ? 2 : 3)} className={btnMobile} title={viewMode === 3 ? "Show Labels" : "Hide Labels"}>{viewMode === 3 ? <EyeOff size={16} className="opacity-50" /> : <Eye size={16} />}</button>
                    <button onClick={handleDemoPlay} disabled={isPlaying} className={`${btnMobile} ${isPlaying ? 'text-red-600 cursor-not-allowed' : 'text-slate-400'}`} title="Play Scale Demo"><Play size={24} fill="currentColor" className="pl-1" /></button>
                    <a href="https://handpan-transformer.vercel.app/playground/reelpan" target="_top" className={`${btnMobile} text-red-600`} title="ReelPan으로 이동"><Disc size={16} fill="currentColor" /></a>
                    <button onClick={toggleDrum} className={`${btnMobile} relative ${isJamPlaying ? 'animate-heartbeat' : ''}`} style={{ color: '#0066FF' }} title={isJamPlaying ? "Castling 중지" : "Castling 시작"}><span className="text-3xl font-black leading-none relative z-10">C</span></button>
                </div>
            )}
            <Canvas orthographic dpr={isDevPage ? [1, 2.5] : [1, 2.0]} gl={{ preserveDrawingBuffer: true }} camera={{ zoom: cameraZoom || 12, position: [0, cameraTargetY, 100], near: 0.1, far: 2000 }} style={{ touchAction: 'pan-y' }}>
                <color attach="background" args={['#ffffff']} />
                <ambientLight intensity={1.0} /><pointLight position={[0, 0, 100]} intensity={0.2} color="#ffffff" /><directionalLight position={[-50, 100, 100]} intensity={0.5} />
                <CameraHandler isLocked={isCameraLockedState} enableZoom={enableZoom} enablePan={enablePan} sceneSize={sceneSize} cameraTargetY={cameraTargetY} cameraZoom={cameraZoom} />
                <group>
                    <CyberBoat isIdle={isIdle && showIdleBoat} />
                    <Suspense fallback={null}>
                        {(showTouchText || introCountdown) && (
                            <TouchText isIdle={isIdle && !isJamPlaying && showTouchText} suppressExplosion={false} overrideText={introCountdown} interactionTrigger={interactionCount} />
                        )}
                        {backgroundContent ? backgroundContent : <HandpanImage backgroundImage={backgroundImage} centerX={centerX} centerY={centerY} />}
                        {isDevPage && showAxes && (
                            <><mesh position={[0, 0, 0]}><sphereGeometry args={[0.5, 16, 16]} /><meshBasicMaterial color="#ff0000" /></mesh><Text position={[0, -1.5, 0]} fontSize={1} color="#000000" anchorX="center" anchorY="middle">(0, 0, 0)</Text><mesh position={[10, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 20, 8]} /><meshBasicMaterial color="#0000ff" /></mesh><mesh position={[20, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.3, 1, 8]} /><meshBasicMaterial color="#0000ff" /></mesh><Text position={[21, 0, 0]} fontSize={0.8} color="#0000ff" anchorX="left" anchorY="middle">X</Text><mesh position={[0, 10, 0]}><cylinderGeometry args={[0.1, 0.1, 20, 8]} /><meshBasicMaterial color="#ff0000" /></mesh><mesh position={[0, 20, 0]}><coneGeometry args={[0.3, 1, 8]} /><meshBasicMaterial color="#ff0000" /></mesh><Text position={[0, 21, 0]} fontSize={0.8} color="#ff0000" anchorX="center" anchorY="bottom">Y</Text><mesh position={[0, 0, 10]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 20, 8]} /><meshBasicMaterial color="#00ff00" /></mesh><mesh position={[0, 0, 20]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.3, 1, 8]} /><meshBasicMaterial color="#00ff00" /></mesh><Text position={[0, 0, 21]} fontSize={0.8} color="#00ff00" anchorX="center" anchorY="middle">Z</Text></>
                        )}
                        {notes.map((note) => <ToneFieldMesh key={note.id} note={note} centerX={centerX} centerY={centerY} onClick={handleToneFieldClick} viewMode={viewMode} demoActive={demoNoteId === note.id} playNote={playNote} offset={note.offset || tonefieldOffset} isScrollingRef={isScrollingRef} />)}
                    </Suspense>
                </group>
            </Canvas>
            {isDevPage && scale && !forceCompactView && showInfoPanel && <ScaleInfoPanel scale={scale} onScaleSelect={onScaleSelect} noteCountFilter={noteCountFilter} isMobileButtonLayout={isMobileButtonLayout} defaultExpanded showAllScales />}
            {currentBlob && !isMobileButtonLayout && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-[90%] w-[320px]">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2"><Check size={24} /></div>
                        <h3 className="text-xl font-bold text-gray-900">Recording Finished</h3><p className="text-gray-500 text-center text-sm mb-4">Your performance is ready. <br />Save it to your device or share it.</p>
                        <div className="flex flex-row gap-3 w-full"><button onClick={handleDiscardAction} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors whitespace-nowrap"><Trash2 size={18} />Remove</button><button onClick={handleSaveAction} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 whitespace-nowrap"><Download size={18} />Save in Album</button></div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Digipan3D;
