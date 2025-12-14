import { useState, useRef, useEffect, useCallback } from 'react';

export const useDrumMachine = (bpm: number = 100, durationSeconds: number = 30) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 컴포넌트 마운트 시 AudioContext 준비
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }

        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // --- 사운드 합성 함수들 ---

    const createNoiseBuffer = (ctx: AudioContext) => {
        const bufferSize = ctx.sampleRate * 2; // 2초 분량
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    };

    const playKick = (ctx: AudioContext, time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        osc.start(time);
        osc.stop(time + 0.5);
    };

    const playSnare = (ctx: AudioContext, time: number, noiseBuffer: AudioBuffer) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, time);
        oscGain.gain.setValueAtTime(0.7, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        osc.start(time);
        osc.stop(time + 0.2);

        const noise = ctx.createBufferSource();
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();

        noise.buffer = noiseBuffer;
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseGain.gain.setValueAtTime(1, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

        noise.start(time);
        noise.stop(time + 0.2);
    };

    const playHiHat = (ctx: AudioContext, time: number, noiseBuffer: AudioBuffer) => {
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        source.buffer = noiseBuffer;

        filter.type = 'highpass';
        filter.frequency.value = 5000;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

        source.start(time);
        source.stop(time + 0.05);
    };

    const stopBeat = useCallback(() => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        ctx.suspend();
        setIsPlaying(false);

        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const startBeat = useCallback(() => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        setIsPlaying(true);

        const noiseBuffer = createNoiseBuffer(ctx);
        const startTime = ctx.currentTime + 0.1;
        const beatDuration = 60 / bpm;
        const totalBeats = (durationSeconds / 60) * bpm;

        for (let i = 0; i < totalBeats; i++) {
            const beatTime = startTime + i * beatDuration;

            // 8비트 패턴: 킥-칫-스네어-칫
            if (i % 4 === 0) {
                playKick(ctx, beatTime);
                playHiHat(ctx, beatTime, noiseBuffer);
            } else if (i % 4 === 2) {
                playSnare(ctx, beatTime, noiseBuffer);
                playHiHat(ctx, beatTime, noiseBuffer);
            } else {
                playHiHat(ctx, beatTime, noiseBuffer);
            }
        }

        timerRef.current = setTimeout(() => {
            setIsPlaying(false);
        }, durationSeconds * 1000);
    }, [bpm, durationSeconds]);

    return { isPlaying, startBeat, stopBeat };
};
