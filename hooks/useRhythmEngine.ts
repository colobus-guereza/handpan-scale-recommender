// ... imports
import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { calculateChordProgression, ChordSet } from '@/utils/ChordCalculator';

export type RhythmPreset = 'basic' | 'lofi' | 'funky';

interface RhythmEngineProps {
    bpm?: number;
    rootNote: string;
    scaleNotes: string[];
    preset?: RhythmPreset; // New Prop
}

export const useRhythmEngine = ({
    bpm = 100,
    rootNote,
    scaleNotes,
    preset = 'basic'
}: RhythmEngineProps) => {
    // ... (Keep existing state/refs same as JamSession) ...
    const [isPlaying, setIsPlaying] = useState(false);

    // === Synth Refs ===
    const padSynthRef = useRef<Tone.PolySynth | null>(null);
    const kickRef = useRef<Tone.MembraneSynth | null>(null);
    const snareRef = useRef<Tone.NoiseSynth | null>(null);
    const hatRef = useRef<Tone.NoiseSynth | null>(null);

    // === Sequence/Part Refs ===
    const chordPartRef = useRef<Tone.Part | null>(null);
    const drumLoopIdRef = useRef<number | null>(null);

    // === Effect Chain Refs ===
    const effectsRef = useRef<Tone.ToneAudioNode[]>([]);
    const masterGainRef = useRef<Tone.Gain | null>(null);
    const reverbRef = useRef<Tone.Reverb | null>(null);
    const delayRef = useRef<Tone.PingPongDelay | null>(null);

    // === Dynamic Refs ===
    const currentStepRef = useRef(-32);
    const kickPitchRef = useRef(40);
    const chordSetsRef = useRef<ChordSet[]>([]);

    // === [1] Init Instruments (Same as JamSession) ===
    useEffect(() => {
        const limiter = new Tone.Limiter(-1).toDestination();
        const masterGain = new Tone.Gain(0.225).connect(limiter);

        // ... (Keep existing Instrument setup code exactly the same) ...
        const reverb = new Tone.Reverb({ decay: 10, wet: 0.5, preDelay: 0.2 }).connect(masterGain);
        const delay = new Tone.PingPongDelay({ delayTime: "4n.", feedback: 0.35, wet: 0.25 }).connect(reverb);
        const chorus = new Tone.Chorus({ frequency: 0.3, delayTime: 4.5, depth: 0.7, spread: 180 }).connect(delay).start();
        const autoFilter = new Tone.AutoFilter({ frequency: 0.1, baseFrequency: 400, octaves: 2, filter: { type: "lowpass", rolloff: -24, Q: 1 } }).connect(chorus).start();

        padSynthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "fattriangle", count: 3, spread: 40 },
            envelope: { attack: 2.5, decay: 2.0, sustain: 1.0, release: 4.0, attackCurve: "exponential" },
            volume: -16
        });
        padSynthRef.current.maxPolyphony = 6;
        padSynthRef.current.connect(autoFilter);

        kickRef.current = new Tone.MembraneSynth({
            pitchDecay: 0.05, octaves: 6, oscillator: { type: "sine" },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: "exponential" },
            volume: -4
        }).connect(masterGain);

        snareRef.current = new Tone.NoiseSynth({
            noise: { type: "white" }, envelope: { attack: 0.005, decay: 0.1, sustain: 0 }, volume: -6
        }).connect(masterGain);

        const hatFilter = new Tone.Filter({ type: "bandpass", frequency: 1200, rolloff: -24, Q: 1.5 }).connect(masterGain);
        hatRef.current = new Tone.NoiseSynth({
            noise: { type: "pink" }, envelope: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.01 }, volume: -14
        }).connect(hatFilter);

        effectsRef.current = [limiter, masterGain, reverb, delay, chorus, autoFilter, hatFilter];
        masterGainRef.current = masterGain;
        reverbRef.current = reverb;
        delayRef.current = delay;

        return () => {
            padSynthRef.current?.dispose();
            kickRef.current?.dispose();
            snareRef.current?.dispose();
            hatRef.current?.dispose();
            effectsRef.current.forEach(e => e.dispose());
            if (drumLoopIdRef.current !== null) Tone.Transport.clear(drumLoopIdRef.current);
            chordPartRef.current?.dispose();
        };
    }, []);

    const prevScaleRef = useRef("");

    // [2] Scale Change Logic (Same)
    useEffect(() => {
        if (!rootNote || scaleNotes.length < 5) return;
        const scaleKey = `${rootNote}-${scaleNotes.join(',')}`;
        const scaleChanged = prevScaleRef.current !== "" && prevScaleRef.current !== scaleKey;
        prevScaleRef.current = scaleKey;

        if (scaleChanged && Tone.Transport.state === "started") {
            Tone.Transport.stop();
            Tone.Transport.position = 0;
            padSynthRef.current?.releaseAll();
            currentStepRef.current = -32;
            if (drumLoopIdRef.current !== null) {
                Tone.Transport.clear(drumLoopIdRef.current);
                drumLoopIdRef.current = null;
            }
            if (chordPartRef.current) {
                chordPartRef.current.dispose();
                chordPartRef.current = null;
            }
            setIsPlaying(false);
        }

        kickPitchRef.current = Tone.Frequency(rootNote).transpose(-24).toFrequency();
        chordSetsRef.current = calculateChordProgression(scaleNotes);
    }, [rootNote, scaleNotes]);

    const [introCountdown, setIntroCountdown] = useState<string | null>(null);
    const hasInteractedRef = useRef(false);
    const onInteraction = useCallback(() => { hasInteractedRef.current = true; }, []);

    // === [3] Sequence Scheduling (MODIFIED FOR PRESETS) ===
    const scheduleSession = useCallback(() => {
        const chordSets = chordSetsRef.current;
        if (chordSets.length < 4 || !padSynthRef.current) return;

        Tone.Transport.bpm.value = bpm;

        // --- Chord Part (Same) ---
        if (chordPartRef.current) chordPartRef.current.dispose();
        chordPartRef.current = new Tone.Part((time, value) => {
            const chord = value as ChordSet;
            padSynthRef.current?.triggerAttackRelease(chord.notes, "4m", time);
        }, [
            ["2:0:0", chordSets[0]], ["6:0:0", chordSets[1]],
            ["10:0:0", chordSets[2]], ["14:0:0", chordSets[3]]
        ]);
        chordPartRef.current.start(0);
        chordPartRef.current.loop = false;

        // --- Drum Patterns ---
        if (drumLoopIdRef.current !== null) Tone.Transport.clear(drumLoopIdRef.current);
        currentStepRef.current = -32;
        setIntroCountdown(null);

        // Pattern Definitions based on Preset
        // 1. Basic (Strict Machine)
        const basicKick = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]; // 1 & 3
        const basicSnare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]; // 2 & 4

        // 2. Lofi / Funky (Syncopated)
        const syncKick = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        const syncSnare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];

        // Shared Hat
        const stdHat = [1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2];

        // Fill Patterns (Restored from useJamSession.ts)
        const fillSimpleKick = [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        const fillSimpleSnare = [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1];
        const fillHalfKick = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        const fillHalfSnare = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        const fillEndKick = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];

        // Select Active Pattern
        const isBasic = preset === 'basic';
        const activeKick = isBasic ? basicKick : syncKick;
        const activeSnare = isBasic ? basicSnare : syncSnare;

        drumLoopIdRef.current = Tone.Transport.scheduleRepeat((time) => {
            const currentStep = currentStepRef.current;
            let kVal = 0, sVal = 0, hVal = 0;
            let countdownText: string | null = null;

            if (currentStep === -3) hasInteractedRef.current = false;

            // Countdown Logic
            if (currentStep >= -32 && currentStep < -24) countdownText = "4";
            else if (currentStep >= -24 && currentStep < -16) countdownText = "3";
            else if (currentStep >= -16 && currentStep < -8) countdownText = "2";
            else if (currentStep >= -8 && currentStep < -3) countdownText = "1";
            else if (currentStep >= -3 && currentStep < 4) countdownText = "Touch!";

            Tone.Draw.schedule(() => { if (Tone.Transport.state === 'started') setIntroCountdown(countdownText); }, time);

            if (currentStep < 0) {
                // === INTRO PHASE (Restored) ===
                const introIndex = currentStep + 32;
                const introBarIndex = Math.floor(introIndex / 16); // 0 or 1
                const stepInBar = introIndex % 16;
                const patternIndex32 = introIndex % 32;

                if (introBarIndex === 1) {
                    // Intro Bar 2: Use Fill End Kick only (쿵 쿵쿵)
                    kVal = fillEndKick[stepInBar];
                    sVal = 0;
                    hVal = 0;
                } else {
                    // Intro Bar 1: Standard Pattern
                    kVal = activeKick[patternIndex32];
                    sVal = activeSnare[patternIndex32];
                    hVal = stdHat[patternIndex32];
                }
            } else {
                // === MAIN LOOP PHASE (Restored Fill Logic) ===
                const step = currentStep % 256;
                const barIndex = Math.floor(step / 16);
                const stepInBar = step % 16;
                const patternIndex32 = step % 32;

                if (barIndex === 15) {
                    // 16번째 마디: End Fill (킥만)
                    kVal = fillEndKick[stepInBar];
                } else if (barIndex === 7) {
                    // 8번째 마디: Half Fill (킥+스네어)
                    kVal = fillHalfKick[stepInBar];
                    sVal = fillHalfSnare[stepInBar];
                } else if (barIndex === 3 || barIndex === 11) {
                    // 4번째, 12번째 마디: Simple Fill (킥+스네어)
                    kVal = fillSimpleKick[stepInBar];
                    sVal = fillSimpleSnare[stepInBar];
                } else {
                    // 일반 마디: Standard Pattern
                    kVal = activeKick[patternIndex32];
                    sVal = activeSnare[patternIndex32];
                    hVal = stdHat[patternIndex32];
                }
            }

            // Trigger Instruments
            if (kVal && kickRef.current) {
                kickRef.current.triggerAttackRelease(kickPitchRef.current, "8n", time);
            }
            if (sVal && snareRef.current) {
                // RAYBACK LOGIC
                let delay = 0;
                let jitter = Math.random() * 0.02; // Default humanize

                if (preset === 'lofi') {
                    // Lofi: Heavy Lag (60ms) + Jitter
                    delay = 0.060;
                    jitter = Math.random() * 0.01;
                } else {
                    // Basic: Tight (0 delay) + Minimal Jitter
                    delay = 0;
                }

                snareRef.current.triggerAttackRelease("8n", time + delay + jitter);
            }
            if (hVal && hatRef.current) {
                const vel = hVal === 1 ? -18 : -26;
                hatRef.current.volume.value = vel;
                hatRef.current.triggerAttackRelease("32n", time);
            }

            currentStepRef.current++;
            if (currentStepRef.current >= 256) {
                Tone.Transport.stop();
                padSynthRef.current?.releaseAll();
                setIsPlaying(false);
                currentStepRef.current = -32;
                setIntroCountdown(null);
            }
        }, "16n");

    }, [bpm, preset]); // Add preset dep

    // [4] Toggle Play (Same)
    const togglePlay = useCallback(async () => {
        await Tone.start();
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            Tone.Transport.position = 0;
            padSynthRef.current?.releaseAll();
            if (masterGainRef.current) {
                masterGainRef.current.gain.cancelScheduledValues(Tone.now());
                masterGainRef.current.gain.linearRampToValueAtTime(0, Tone.now() + 0.5);
            }
            currentStepRef.current = -32;
            if (drumLoopIdRef.current !== null) {
                Tone.Transport.clear(drumLoopIdRef.current);
                drumLoopIdRef.current = null;
            }
            if (chordPartRef.current) chordPartRef.current.dispose();
            setIsPlaying(false);
            setIntroCountdown(null);
        } else {
            if (masterGainRef.current) masterGainRef.current.gain.value = 0.225;
            if (reverbRef.current) reverbRef.current.wet.value = 0.5;
            Tone.Transport.cancel();
            Tone.Transport.position = 0;
            currentStepRef.current = -32;
            scheduleSession();
            Tone.Transport.start();
            setIsPlaying(true);
        }
    }, [scheduleSession]);

    return { togglePlay, isPlaying, introCountdown, onInteraction };
};
