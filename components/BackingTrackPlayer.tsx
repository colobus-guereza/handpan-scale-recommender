'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useChordSynth } from '@/hooks/useChordSynth';
import { generateAccompanimentData } from '@/utils/musicTheory';
import { SCALES } from '@/data/handpanScales';

type ScaleKey = string;

const BackingTrackPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedScaleId, setSelectedScaleId] = useState<ScaleKey>('d_kurd_9');
    const [currentBar, setCurrentBar] = useState<number>(-1);
    const [currentChordName, setCurrentChordName] = useState<string>('Ready');

    const audioCtxRef = useRef<AudioContext | null>(null);
    const { playChord } = useChordSynth(audioCtxRef.current);

    // [진단 1] 데이터 생성 확인
    const compositionEvents = useMemo(() => {
        const scale = SCALES.find(s => s.id === selectedScaleId) || SCALES[0];
        const data = generateAccompanimentData(scale);
        console.log(`[Data Check] Scale: ${selectedScaleId}, Events Generated:`, data.length, data);
        return data;
    }, [selectedScaleId]);

    const nextNoteTimeRef = useRef<number>(0);
    const currentEventIndexRef = useRef<number>(0);
    const timerRef = useRef<number | null>(null);

    const SCHEDULE_AHEAD_TIME = 0.1;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContext();
            console.log("[Init] AudioContext Initialized. State:", audioCtxRef.current.state);
        }
        return () => stopPlayer();
    }, []);

    const nextNote = () => {
        if (compositionEvents.length === 0) return;

        if (currentEventIndexRef.current >= compositionEvents.length) {
            currentEventIndexRef.current = 0;
        }

        const event = compositionEvents[currentEventIndexRef.current];

        // [진단 4] 실제 재생 명령 로그
        console.log(`[Play] Bar: ${event.barIndex}, Chord: ${event.chordName}`);

        if (audioCtxRef.current) {
            playChord(
                event.frequencies,
                nextNoteTimeRef.current,
                event.duration * (60 / 100) // Duration calculation (BPM 100)
            );
        }

        const timeUntilEvent = nextNoteTimeRef.current - audioCtxRef.current!.currentTime;
        setTimeout(() => {
            setCurrentBar(event.barIndex);
            setCurrentChordName(event.chordName);
        }, Math.max(0, timeUntilEvent * 1000));

        nextNoteTimeRef.current += event.duration * (60 / 100);
        currentEventIndexRef.current++;
    };

    const scheduler = () => {
        if (!audioCtxRef.current) return;

        // [진단 5] 스케줄러 루프 작동 확인 (로그 너무 많으면 주석 처리)
        // console.log("[Loop] Scheduler running..."); 

        while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + SCHEDULE_AHEAD_TIME) {
            nextNote();
        }

        if (isPlaying) {
            timerRef.current = window.setTimeout(scheduler, 25);
        }
    };

    const startPlayer = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) {
            console.error("[Error] No AudioContext found!");
            return;
        }

        // [진단 2] AudioContext 재개 (가장 중요한 부분)
        if (ctx.state === 'suspended') {
            console.log("[Start] Resuming AudioContext...");
            ctx.resume().then(() => {
                console.log("[Start] AudioContext Resumed! State:", ctx.state);
                launchSequencer(ctx);
            });
        } else {
            launchSequencer(ctx);
        }
    };

    const launchSequencer = (ctx: AudioContext) => {
        setIsPlaying(true);
        currentEventIndexRef.current = 0;
        nextNoteTimeRef.current = ctx.currentTime + 0.1;

        console.log("[Start] Sequencer Launched at:", nextNoteTimeRef.current);
        scheduler();
    };

    const stopPlayer = () => {
        console.log("[Stop] Player Stopped");
        setIsPlaying(false);
        setCurrentBar(-1);
        setCurrentChordName('Ready');
        if (timerRef.current) window.clearTimeout(timerRef.current);
    };

    // [진단 3] 강제 사운드 테스트 (스케줄러 무시)
    const testSound = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        if (ctx.state === 'suspended') ctx.resume();

        console.log("[Test] Trying to play D Minor chord directly...");
        // D Minor (D3, F3, A3) -> frequencies approx
        playChord([146.83, 174.61, 220.00], ctx.currentTime, 1.0);
    };

    return (
        <div className="p-6 bg-slate-800 text-white rounded-xl max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Harmony Debugger</h2>

            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                <p>Status: {isPlaying ? "Playing 🎵" : "Stopped"}</p>
                <p>Current Bar: {currentBar + 1}</p>
                <p>Chord: {currentChordName}</p>
            </div>

            <div className="w-full space-y-4 mb-4">
                <select
                    value={selectedScaleId}
                    onChange={(e) => setSelectedScaleId(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    {SCALES.map((scale) => (
                        <option key={scale.id} value={scale.id} className="bg-indigo-900">
                            {scale.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={isPlaying ? stopPlayer : startPlayer}
                    className="w-full bg-indigo-500 py-3 rounded-lg font-bold hover:bg-indigo-600"
                >
                    {isPlaying ? "Stop" : "▶ Start Sequencer"}
                </button>

                <button
                    onClick={testSound}
                    className="w-full bg-pink-600 py-2 rounded-lg font-bold hover:bg-pink-700 text-sm"
                >
                    🔔 Test Sound (Direct Play)
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-400">
                * F12 개발자 도구 Console 탭을 확인하세요.
            </div>
        </div>
    );
};

export default BackingTrackPlayer;
