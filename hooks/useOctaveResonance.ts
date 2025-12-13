import { useRef, useEffect, useCallback } from 'react';

export interface ResonanceSettings {
    trimStart: number;      // Seconds to cut from start (Attack removal)
    fadeInDuration: number; // Seconds for fade-in
    fadeInCurve: number;    // Exponential factor (1 = linear, 5 = very steep)
    delayTime: number;      // Seconds to delay playback (Latency)
    masterGain: number;     // Volume of the harmonic
}

// Global Cache for AudioBuffers (Persists across component unmounts)
const globalAudioBuffers = new Map<string, AudioBuffer>();

export const useOctaveResonance = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize AudioContext on mount (or first interaction)
    useEffect(() => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContext();
        }
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(e => console.warn("Failed to close AC", e));
            }
        };
    }, []);

    // Load Audio Buffer (Global Cache)
    const loadBuffer = useCallback(async (noteName: string) => {
        // Return existing from Global Cache if available
        if (globalAudioBuffers.has(noteName)) {
            return globalAudioBuffers.get(noteName)!;
        }

        if (!audioContextRef.current) return null;

        try {
            const fileName = noteName.replace('#', '%23'); // Simple manual encode for #
            const response = await fetch(`/sounds/${fileName}.mp3`);
            const arrayBuffer = await response.arrayBuffer();

            // decoding audio data requires a context
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            globalAudioBuffers.set(noteName, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Failed to load resonance audio: ${noteName}`, error);
            return null;
        }
    }, []);

    const playResonantNote = useCallback(async (noteName: string, settings: ResonanceSettings) => {
        if (!audioContextRef.current) return;

        // Resume context if suspended (browser autoplay policy)
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        const buffer = await loadBuffer(noteName);
        if (!buffer) return;

        const ctx = audioContextRef.current;
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Create Gain Node for Envelope Control
        const gainNode = ctx.createGain();
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Schedule Timing
        const now = ctx.currentTime;
        const startTime = now + settings.delayTime;

        // 1. Attack Trim (Offset start position)

        // 2. Fade In (Exponential Ramp)
        // Initial silence
        gainNode.gain.setValueAtTime(0, startTime);

        if (settings.fadeInCurve > 1) {
            // WebAudio implementation:
            gainNode.gain.linearRampToValueAtTime(0.01, startTime); // Prevent 0 error for exp
            gainNode.gain.exponentialRampToValueAtTime(settings.masterGain, startTime + settings.fadeInDuration);
        } else {
            // Linear
            gainNode.gain.linearRampToValueAtTime(settings.masterGain, startTime + settings.fadeInDuration);
        }

        // Play
        // start(when, offset, duration)
        source.start(startTime, settings.trimStart);

        // Stop after buffer duration (optional, garbage collection handles it)
    }, [loadBuffer]);

    // Smart Preloading Function
    const preloadNotes = useCallback(async (noteNames: string[]) => {
        if (!audioContextRef.current) {
            // Initialize if not ready for preloading context
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContext();
            }
        }

        // Parallel loading without blocking
        noteNames.forEach(note => {
            // Only load if not already in global cache
            if (!globalAudioBuffers.has(note)) {
                loadBuffer(note).catch(err => console.warn(`[Resonance] Preload failed for ${note}`, err));
            }
        });
    }, [loadBuffer]);

    return {
        playResonantNote,
        preloadNotes
    };
};
