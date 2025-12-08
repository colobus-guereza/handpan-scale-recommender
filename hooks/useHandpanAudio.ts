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

export interface UseHandpanAudioReturn {
    isLoaded: boolean;
    loadingProgress: number;
    playNote: (noteName: string, volume?: number) => void;
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
export const useHandpanAudio = (): UseHandpanAudioReturn => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const soundsRef = useRef<Record<string, HowlInstance>>({});
    const loadedCountRef = useRef(0);
    const howlerLoadedRef = useRef(false);

    useEffect(() => {
        // Skip if running on server
        if (typeof window === 'undefined') return;

        // Dynamic import to avoid SSR issues
        import('howler').then(({ Howl }) => {
            howlerLoadedRef.current = true;
            const totalSounds = ALL_NOTES.length;
            loadedCountRef.current = 0;

            // Create Howl instances for all notes with preloading
            ALL_NOTES.forEach((note) => {
                // Encode # as %23 for URL
                const filename = note.replace('#', '%23');

                soundsRef.current[note] = new Howl({
                    src: [`/sounds/${filename}.mp3`],
                    preload: true,      // Critical: Download immediately on creation
                    html5: false,       // Critical: Use Web Audio API, not HTML5 Audio (prevents streaming delay)
                    volume: 0.6,
                    onload: () => {
                        loadedCountRef.current++;
                        const progress = Math.round((loadedCountRef.current / totalSounds) * 100);
                        setLoadingProgress(progress);

                        // All sounds loaded
                        if (loadedCountRef.current === totalSounds) {
                            setIsLoaded(true);
                            console.log('[useHandpanAudio] All sounds preloaded via Web Audio API');
                        }
                    },
                    onloaderror: (_id: number, error: unknown) => {
                        console.error(`[useHandpanAudio] Failed to load ${note}:`, error);
                        // Still count as loaded to prevent blocking
                        loadedCountRef.current++;
                        if (loadedCountRef.current === totalSounds) {
                            setIsLoaded(true);
                        }
                    }
                });
            });
        }).catch(err => {
            console.error('[useHandpanAudio] Failed to load Howler:', err);
            // Mark as loaded anyway so UI is not blocked
            setIsLoaded(true);
        });

        // Cleanup: Unload all sounds on unmount
        return () => {
            Object.values(soundsRef.current).forEach(sound => {
                try { sound.unload(); } catch (e) { /* ignore */ }
            });
            soundsRef.current = {};
        };
    }, []);

    const playNote = useCallback((noteName: string, volume: number = 0.6) => {
        const sound = soundsRef.current[noteName];

        // Try Howler first if available and loaded
        if (sound) {
            try {
                sound.volume(volume);
                sound.play();
                return;
            } catch (e) {
                console.warn(`[useHandpanAudio] Howler play failed for ${noteName}, using fallback:`, e);
            }
        }

        // Fallback: Use HTML5 Audio API (works but has latency)
        console.log(`[useHandpanAudio] Using fallback Audio for ${noteName}`);
        const filename = noteName.replace('#', '%23');
        const audio = new Audio(`/sounds/${filename}.mp3`);
        audio.volume = volume;
        audio.play().catch(err => {
            console.error(`[useHandpanAudio] Fallback audio failed for ${noteName}:`, err);
        });
    }, []);

    return { isLoaded, loadingProgress, playNote };
};
