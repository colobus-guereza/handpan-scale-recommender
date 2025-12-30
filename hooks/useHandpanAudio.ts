'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// All available notes in the handpan sound library
const ALL_NOTES = [
    'A3', 'A4', 'A5',
    'Ab3', 'Ab4',
    'B3', 'B4', 'B5',
    'Bb3', 'Bb4', 'Bb5',
    'C3', 'C4', 'C5', 'C6',
    'C#3', 'C#4', 'C#5',
    'D3', 'D4', 'D5',
    'Db3', 'Db4', 'Db5',
    'D#3', 'D#4', 'D#5',
    'E3', 'E4', 'E5',
    'Eb3', 'Eb4', 'Eb5',
    'F3', 'F4', 'F5',
    'F#3', 'F#4', 'F#5',
    'G3', 'G4', 'G5',
    'G#3', 'G#4', 'G#5',
];

// Note name normalization for consistent cache hits
// Maps enharmonic equivalents (A# → Bb, Db → C#, etc.)
const normalizeNote = (note: string): string => {
    const map: Record<string, string> = {
        // A# → Bb (Bb exists in ALL_NOTES)
        'A#3': 'Bb3', 'A#4': 'Bb4', 'A#5': 'Bb5',
        // Gb → F# (F# exists in ALL_NOTES)
        'Gb3': 'F#3', 'Gb4': 'F#4', 'Gb5': 'F#5',
        // Ab → G# (G# exists in ALL_NOTES) - BUT Ab also exists, so skip
        // Db → C# (C# exists in ALL_NOTES) - BUT Db also exists, so skip
        // Eb → D# (D# exists in ALL_NOTES) - BUT Eb also exists, so skip
    };
    return map[note] || note;
};

export interface UseHandpanAudioReturn {
    isLoaded: boolean;
    loadingProgress: number;
    playNote: (noteName: string, volume?: number) => void;
    resumeAudio: () => void;
    getAudioContext: () => any;
    getMasterGain: () => any;
    preloadScaleNotes: (notes: string[]) => Promise<void>; // NEW: Preload specific scale notes
}

// Type for Howl instance (avoid importing at top level for SSR compatibility)
type HowlInstance = {
    play: () => void;
    volume: (vol: number) => void;
    unload: () => void;
    state: () => string;
};

/**
 * Custom hook for preloading and playing handpan sounds using Howler.js
 * 
 * Key features:
 * - Preloads all sounds on mount for instant playback
 * - Uses Web Audio API (html5: false) for zero-latency playback
 * - Supports polyphony (overlapping sounds for natural reverb)
 * - Dynamic import to avoid SSR issues with Next.js
 * - Fallback to HTML5 Audio if Howler fails
 */
// Global Cache State (Singleton)
const GLOBAL_SOUND_CACHE: Record<string, any> = {};
let IS_GLOBAL_LOAD_INITIATED = false;
let GLOBAL_LOADING_PROGRESS = 0;
let IS_GLOBAL_LOADED = false;
let GLOBAL_HOWLER: any = null; // NEW: Module-level Howler reference for faster access
const OBSERVERS: ((progress: number, isLoaded: boolean) => void)[] = [];

// Helper to notify all hooks of progress
const notifyObservers = () => {
    OBSERVERS.forEach(cb => cb(GLOBAL_LOADING_PROGRESS, IS_GLOBAL_LOADED));
};

export const useHandpanAudio = (): UseHandpanAudioReturn => {
    const [isLoaded, setIsLoaded] = useState(IS_GLOBAL_LOADED);
    const [loadingProgress, setLoadingProgress] = useState(GLOBAL_LOADING_PROGRESS);

    // Subscribe to global progress updates
    useEffect(() => {
        const handler = (progress: number, loaded: boolean) => {
            setLoadingProgress(progress);
            setIsLoaded(loaded);
        };
        OBSERVERS.push(handler);
        return () => {
            const index = OBSERVERS.indexOf(handler);
            if (index > -1) OBSERVERS.splice(index, 1);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Initialize Howler & Preload ONLY ONCE
        if (!IS_GLOBAL_LOAD_INITIATED) {
            IS_GLOBAL_LOAD_INITIATED = true;
            const startTime = performance.now();
            // Assuming priorityNotes is not passed to the hook, logging 0.
            console.log(`[AudioDebug] 🟢 Preloading Started. Priority: 0 notes`);


            import('howler').then(({ Howl, Howler }) => {
                GLOBAL_HOWLER = Howler; // Store in module variable

                // --- Audio Context & Limiter Logic ---
                const resumeAudioContext = async () => {
                    const now = performance.now();

                    // 1. Resume Howler
                    if (Howler && Howler.ctx && Howler.ctx.state === 'suspended') {
                        Howler.ctx.resume();
                    }

                    // 2. Resume Tone.js (Dynamic Import to avoid SSR issues if not already imported)
                    // We check global Tone or import it
                    try {
                        const Tone = await import('tone');
                        if (Tone.context && Tone.context.state === 'suspended') {
                            Tone.start();
                        }
                    } catch (e) {
                        // Tone might not be used/installed in this scope, ignore
                    }
                };

                // Limiter Implementation
                if (Howler && Howler.ctx && Howler.masterGain) {
                    try {
                        const ctx = Howler.ctx as AudioContext;
                        const masterGain = Howler.masterGain as GainNode;
                        try {
                            // Helper to safely check/create limiter
                            // (Avoid re-connecting errors by checking if already connected - tricky with WebAudio, so we wrap in try)
                            const limiter = ctx.createDynamicsCompressor();
                            limiter.threshold.value = -2.0;
                            limiter.knee.value = 0.0;
                            limiter.ratio.value = 20.0;
                            limiter.attack.value = 0.001;
                            limiter.release.value = 0.1;

                            // Only connect if we can (Simplified logic: we assume this runs once on init)
                            masterGain.disconnect();
                            masterGain.connect(limiter);
                            limiter.connect(ctx.destination);
                        } catch (e) {
                            // Limiter application skipped (already connected or error)
                        }
                    } catch (err) { console.warn('Limiter setup failed:', err); }
                }

                // Global Resume Listeners (Passive: true is good for scroll, but we want IMMEDIATE execution)
                // We use useCapture=true for 'touchstart' to catch it as early as possible? 
                // Actually, just standard bubble is fine, but we want to ensure it runs.
                ['touchstart', 'touchend', 'click', 'keydown'].forEach(event => {
                    document.addEventListener(event, resumeAudioContext, { passive: true });
                });

                // --- Loading Sounds ---
                const totalSounds = ALL_NOTES.length;
                let loadedCount = 0;

                ALL_NOTES.forEach((note) => {
                    const filename = note.replace('#', '%23');
                    GLOBAL_SOUND_CACHE[note] = new Howl({
                        src: [`/sounds/${filename}.mp3`],
                        preload: true,
                        html5: false,
                        volume: 0.6,
                        onload: () => {
                            loadedCount++;
                            GLOBAL_LOADING_PROGRESS = Math.round((loadedCount / totalSounds) * 100);
                            notifyObservers();

                            if (loadedCount === totalSounds) {
                                IS_GLOBAL_LOADED = true;
                                GLOBAL_LOADING_PROGRESS = 100;
                                notifyObservers();
                                console.log('[useHandpanAudio] All sounds preloaded');
                            }
                        },
                        onloaderror: (_id: number, error: unknown) => {
                            console.error(`[AudioDebug] Failed ${note}`, error);
                            loadedCount++; // Count anyway to avoid stuck state
                            if (loadedCount === totalSounds) {
                                IS_GLOBAL_LOADED = true;
                                notifyObservers();
                            }
                        }
                    });
                });

                // Fallback Timer
                setTimeout(() => {
                    if (!IS_GLOBAL_LOADED && loadedCount > totalSounds * 0.9) {
                        console.warn('[AudioDebug] Force finish (fallback timer)');
                        IS_GLOBAL_LOADED = true;
                        GLOBAL_LOADING_PROGRESS = 100;
                        notifyObservers();
                    }
                }, 10000);

            }).catch(err => console.error('[AudioDebug] Howler import failed', err));
        } else {
            console.log("[AudioDebug] Global Load already initiated (Singleton check passed)");
            // If already initiated, try to capture Howler ref if possible (lazy)
            import('howler').then(({ Howler }) => {
                GLOBAL_HOWLER = Howler;
            });
        }
    }, []);

    const playNote = useCallback((noteName: string, volume: number = 0.6) => {
        // Optimized Resume Check: Use GLOBAL_HOWLER for faster access
        if (GLOBAL_HOWLER?.ctx?.state === 'suspended') {
            GLOBAL_HOWLER.ctx.resume(); // Fire and forget
        }

        // Normalize note name for consistent cache hits (A# → Bb, Gb → F#)
        const normalized = normalizeNote(noteName);
        const sound = GLOBAL_SOUND_CACHE[normalized];
        if (sound) {
            try {
                sound.volume(volume);
                sound.play();
                return;
            } catch (e) {
                // Fallback
            }
        }

        // Fallback Logic
        const filename = normalized.replace('#', '%23');
        const audio = new Audio(`/sounds/${filename}.mp3`);
        audio.volume = volume;
        audio.play().catch(e => console.error(e));
    }, []);

    const getAudioContext = useCallback(() => {
        return GLOBAL_HOWLER?.ctx;
    }, []);

    const getMasterGain = useCallback(() => {
        return GLOBAL_HOWLER?.masterGain;
    }, []);

    // resumeAudio for external AudioContext resume
    const resumeAudio = useCallback(() => {
        if (GLOBAL_HOWLER?.ctx?.state === 'suspended') {
            GLOBAL_HOWLER.ctx.resume();
        }
    }, []);

    // preloadScaleNotes: Ensure specific scale notes are fully loaded
    const preloadScaleNotes = useCallback(async (notes: string[]): Promise<void> => {
        if (!notes || notes.length === 0) return;

        const promises: Promise<void>[] = [];

        notes.forEach(note => {
            const normalized = normalizeNote(note);
            const sound = GLOBAL_SOUND_CACHE[normalized];

            if (sound && sound.state() !== 'loaded') {
                // Wait for this sound to finish loading
                promises.push(new Promise<void>((resolve) => {
                    const checkState = () => {
                        if (sound.state() === 'loaded') {
                            resolve();
                        } else {
                            setTimeout(checkState, 50);
                        }
                    };
                    checkState();
                }));
            }
        });

        if (promises.length > 0) {
            await Promise.all(promises);
            console.log(`[useHandpanAudio] Preloaded ${notes.length} scale notes`);
        }
    }, []);

    return { isLoaded, loadingProgress, playNote, resumeAudio, getAudioContext, getMasterGain, preloadScaleNotes };
};
