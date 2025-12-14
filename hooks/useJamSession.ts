import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { calculateChordProgression, ChordSet } from '@/utils/ChordCalculator';

interface JamSessionProps {
    bpm?: number;
    rootNote: string;      // e.g., "D3" (스케일 Ding)
    scaleNotes: string[];  // 전체 스케일 노트
}

export const useJamSession = ({
    bpm = 100,
    rootNote,
    scaleNotes
}: JamSessionProps) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // === Synth Refs ===
    const padSynthRef = useRef<Tone.PolySynth | null>(null);
    const kickRef = useRef<Tone.MembraneSynth | null>(null);
    const snareRef = useRef<Tone.NoiseSynth | null>(null);
    const hatRef = useRef<Tone.NoiseSynth | null>(null);

    // === Sequence/Part Refs ===
    const chordPartRef = useRef<Tone.Part | null>(null);
    const drumLoopIdRef = useRef<number | null>(null);

    // === Effect Chain Refs (for cleanup) ===
    const effectsRef = useRef<Tone.ToneAudioNode[]>([]);

    // === Dynamic Refs ===
    const currentStepRef = useRef(0);
    const kickPitchRef = useRef(40);
    const chordSetsRef = useRef<ChordSet[]>([]);

    // === [1] 악기 초기화 (한 번만 실행) ===
    useEffect(() => {
        // Master Bus
        const limiter = new Tone.Limiter(-1).toDestination();
        const masterGain = new Tone.Gain(0.225).connect(limiter); // Drum master (lowered 10%)

        // --- PAD SYNTH (from useDreamyPad) ---
        const reverb = new Tone.Reverb({
            decay: 10,
            wet: 0.5,
            preDelay: 0.2
        }).connect(masterGain);

        const delay = new Tone.PingPongDelay({
            delayTime: "4n.",
            feedback: 0.35,
            wet: 0.25
        }).connect(reverb);

        const chorus = new Tone.Chorus({
            frequency: 0.3,
            delayTime: 4.5,
            depth: 0.7,
            spread: 180
        }).connect(delay).start();

        const autoFilter = new Tone.AutoFilter({
            frequency: 0.1,
            baseFrequency: 400,
            octaves: 2,
            filter: { type: "lowpass", rolloff: -24, Q: 1 }
        }).connect(chorus).start();

        padSynthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "fattriangle",
                count: 3,
                spread: 40
            },
            envelope: {
                attack: 2.5,
                decay: 2.0,
                sustain: 1.0,
                release: 4.0,
                attackCurve: "exponential"
            },
            volume: -16 // Pad volume (raised 10%)
        });
        padSynthRef.current.maxPolyphony = 6;
        padSynthRef.current.connect(autoFilter);

        // --- DRUM SYNTHS (from useToneDrum) ---
        kickRef.current = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 6,
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
                attackCurve: "exponential"
            },
            volume: -4
        }).connect(masterGain);

        snareRef.current = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
            volume: -6
        }).connect(masterGain);

        // Soft Hi-Hat: NoiseSynth with Bandpass Filter (No metallic harshness)
        const hatFilter = new Tone.Filter({
            type: "bandpass",
            frequency: 1200,    // Center around 1.2kHz (mellow, low-pitched)
            rolloff: -24,
            Q: 1.5              // Narrow band for focused tone
        }).connect(masterGain);

        hatRef.current = new Tone.NoiseSynth({
            noise: { type: "pink" },  // Pink noise = softer than white
            envelope: {
                attack: 0.002,
                decay: 0.05,          // Short, tight decay
                sustain: 0,
                release: 0.01
            },
            volume: -14               // Slightly louder to compensate for filtering
        }).connect(hatFilter);

        // Store effects for cleanup
        effectsRef.current = [limiter, masterGain, reverb, delay, chorus, autoFilter, hatFilter];

        return () => {
            padSynthRef.current?.dispose();
            kickRef.current?.dispose();
            snareRef.current?.dispose();
            hatRef.current?.dispose();
            effectsRef.current.forEach(e => e.dispose());
            if (drumLoopIdRef.current !== null) {
                Tone.Transport.clear(drumLoopIdRef.current);
            }
            chordPartRef.current?.dispose();
        };
    }, []);

    // === Ref to track previous scale for change detection ===
    const prevScaleRef = useRef<string>("");

    // === [2] 스케일 변경 시 데이터 업데이트 + 자동 중지 ===
    useEffect(() => {
        if (!rootNote || scaleNotes.length < 5) return;

        // 스케일 변경 감지를 위한 키 생성
        const scaleKey = `${rootNote}-${scaleNotes.join(',')}`;
        const scaleChanged = prevScaleRef.current !== "" && prevScaleRef.current !== scaleKey;
        prevScaleRef.current = scaleKey;

        // ★ 스케일이 실제로 변경되었을 때만 재생 중지 (Transport 상태로 확인)
        if (scaleChanged && Tone.Transport.state === "started") {
            Tone.Transport.stop();
            Tone.Transport.position = 0;
            padSynthRef.current?.releaseAll();
            currentStepRef.current = 0;
            if (drumLoopIdRef.current !== null) {
                Tone.Transport.clear(drumLoopIdRef.current);
                drumLoopIdRef.current = null;
            }
            if (chordPartRef.current) {
                chordPartRef.current.dispose();
                chordPartRef.current = null;
            }
            setIsPlaying(false);
            console.log(`[JamSession] Scale changed - auto-stopped playback`);
        }

        // A. 킥 피치 튜닝: Root -24 semitones (2 octaves down)
        kickPitchRef.current = Tone.Frequency(rootNote).transpose(-24).toFrequency();

        // B. 화성 진행 계산
        chordSetsRef.current = calculateChordProgression(scaleNotes);

        console.log(`[JamSession] Scale Updated: Root=${rootNote}, KickHz=${kickPitchRef.current.toFixed(1)}`);
        console.log(`[JamSession] Chords:`, chordSetsRef.current);

    }, [rootNote, scaleNotes]); // ← isPlaying 제거! 무한 루프 방지


    // === [3] 시퀀스 스케줄링 ===
    const scheduleSession = useCallback(() => {
        const chordSets = chordSetsRef.current;
        if (chordSets.length < 4 || !padSynthRef.current) return;

        Tone.Transport.bpm.value = bpm;

        // --- CHORD PART ---
        if (chordPartRef.current) {
            chordPartRef.current.dispose();
        }

        chordPartRef.current = new Tone.Part((time, chord: ChordSet) => {
            padSynthRef.current?.triggerAttackRelease(chord.notes, "4m", time);
            console.log(`[Chord] Bar ${chord.barStart}: ${chord.role}`, chord.notes);
        }, [
            ["0:0:0", chordSets[0]],   // Bar 1
            ["4:0:0", chordSets[1]],   // Bar 5
            ["8:0:0", chordSets[2]],   // Bar 9
            ["12:0:0", chordSets[3]]   // Bar 13
        ]);
        chordPartRef.current.start(0);
        chordPartRef.current.loop = false; // 한 번만 재생

        // --- DRUM LOOP (16n Grid, 16 Bars = 256 steps) ---
        if (drumLoopIdRef.current !== null) {
            Tone.Transport.clear(drumLoopIdRef.current);
        }
        currentStepRef.current = 0;

        // Patterns (from useToneDrum)
        const stdKick = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        const stdSnare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        const stdHat = [1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2];
        const fillSimpleKick = [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        const fillSimpleSnare = [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1];
        const fillHalfKick = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        const fillHalfSnare = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        const fillEndKick = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];

        drumLoopIdRef.current = Tone.Transport.scheduleRepeat((time) => {
            const step = currentStepRef.current % 256;
            const barIndex = Math.floor(step / 16);
            const stepInBar = step % 16;
            const patternIndex32 = step % 32;

            let kVal = 0, sVal = 0, hVal = 0;

            // Pattern selection based on bar
            if (barIndex === 15) {
                kVal = fillEndKick[stepInBar];
            } else if (barIndex === 7) {
                kVal = fillHalfKick[stepInBar];
                sVal = fillHalfSnare[stepInBar];
            } else if (barIndex === 3 || barIndex === 11) {
                kVal = fillSimpleKick[stepInBar];
                sVal = fillSimpleSnare[stepInBar];
            } else {
                kVal = stdKick[patternIndex32];
                sVal = stdSnare[patternIndex32];
                hVal = stdHat[patternIndex32];
            }

            // Play drums
            if (kVal && kickRef.current) {
                kickRef.current.triggerAttackRelease(kickPitchRef.current, "8n", time);
            }
            if (sVal && snareRef.current) {
                const lag = Math.random() * 0.02;
                snareRef.current.triggerAttackRelease("8n", time + lag);
            }
            if (hVal && hatRef.current) {
                const vel = hVal === 1 ? -18 : -26;
                hatRef.current.volume.value = vel;
                hatRef.current.triggerAttackRelease("32n", time);
            }

            currentStepRef.current++;

            // Auto-stop after 16 bars
            if (currentStepRef.current >= 256) {
                Tone.Transport.stop();
                padSynthRef.current?.releaseAll();
                setIsPlaying(false);
                currentStepRef.current = 0;
            }
        }, "16n");

    }, [bpm]);


    // === [4] 통합 재생 제어 ===
    const togglePlay = useCallback(async () => {
        await Tone.start();

        if (isPlaying) {
            // STOP
            Tone.Transport.stop();
            Tone.Transport.position = 0;
            padSynthRef.current?.releaseAll();
            currentStepRef.current = 0;
            if (drumLoopIdRef.current !== null) {
                Tone.Transport.clear(drumLoopIdRef.current);
                drumLoopIdRef.current = null;
            }
            if (chordPartRef.current) {
                chordPartRef.current.dispose();
                chordPartRef.current = null;
            }
            setIsPlaying(false);
        } else {
            // START
            scheduleSession();
            Tone.Transport.start();
            setIsPlaying(true);
        }
    }, [isPlaying, scheduleSession]);

    return { togglePlay, isPlaying };
};
