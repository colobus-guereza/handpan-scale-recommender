import { useRef, useEffect, useCallback } from 'react';

export interface ResonanceSettings {
    trimStart: number;      // Seconds to cut from start (Attack removal)
    fadeInDuration: number; // Seconds for fade-in
    fadeInCurve: number;    // Exponential factor (1 = linear, 5 = very steep)
    delayTime: number;      // Seconds to delay playback (Latency)
    masterGain: number;     // Volume of the harmonic
}

export const useOctaveResonance = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBuffers = useRef<Map<string, AudioBuffer>>(new Map());

    // Initialize AudioContext on mount (or first interaction)
    useEffect(() => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContext();
        }
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Load Audio Buffer (Memoized)
    const loadBuffer = useCallback(async (noteName: string) => {
        if (!audioContextRef.current) return null;

        // Return existing if already loaded
        if (audioBuffers.current.has(noteName)) {
            return audioBuffers.current.get(noteName);
        }

        try {
            // Note names in file system might need sanitization if they contain #
            // But based on existing code, they seem to be stored as "A#3.mp3" etc.
            // encodeURIComponent might be safer for URL
            const fileName = noteName.replace('#', '%23'); // Simple manual encode for #
            const response = await fetch(`/sounds/${fileName}.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            audioBuffers.current.set(noteName, audioBuffer);
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
        // We pass this offset to start()

        // 2. Fade In (Exponential Ramp)
        // Initial silence
        gainNode.gain.setValueAtTime(0, startTime);

        // Ramp up
        // Using setTargetAtTime for "pressed to the right" exponential feel, or exponentialRampToValueAtTime
        // exponentialRampToValueAtTime requires start value > 0.
        // Let's use linearRamp for simple tests, or custom curve.
        // User asked for "pressed to the right" (~exponential).

        if (settings.fadeInCurve > 1) {
            // approximating curve with setTargetAtTime
            // value approaches target with exponential decay
            // We want the opposite: slow start, fast end? No, fade in is usuall S-curve or Exp.
            // "Pressed to the right" usually means Convex (slow rise then fast) -> High exponent power.

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
            // Initialize if not ready
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContext();
            }
        }

        // Parallel loading without blocking
        noteNames.forEach(note => {
            loadBuffer(note).catch(err => console.warn(`[Resonance] Preload failed for ${note}`, err));
        });
    }, [loadBuffer]);

    return {
        playResonantNote,
        preloadNotes
    };
};
