import { useState, useRef, useCallback } from 'react';

interface UseDigipanRecorderProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    getAudioContext: () => AudioContext | null;
    getMasterGain: () => GainNode | null;
}

export const useDigipanRecorder = ({ canvasRef, getAudioContext, getMasterGain }: UseDigipanRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);

    const startRecording = useCallback(() => {
        const canvas = canvasRef.current;
        const audioCtx = getAudioContext();
        const masterGain = getMasterGain();

        if (!canvas || !audioCtx || !masterGain) {
            console.error('[Recorder] Missing dependencies for recording (Canvas, AudioContext, or MasterGain)');
            return;
        }

        try {
            console.log('[Recorder] Initializing...');

            // 1. Capture Video Stream from Canvas (60 FPS for high smoothness)
            const canvasStream = canvas.captureStream(60);

            // 2. Capture Audio Stream from Howler
            // Create a destination node (this effectively creates a "virtual speaker" we can record from)
            const dest = audioCtx.createMediaStreamDestination();
            streamDestRef.current = dest;

            // Connect Master Gain to this destination
            // Note: We do NOT disconnect from the real destination (speakers), so user still hears audio.
            masterGain.connect(dest);

            // 3. Combine Tracks
            const combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...dest.stream.getAudioTracks()
            ]);

            // 4. Setup MediaRecorder
            // Prioritize MP4 with AAC audio for best mobile compatibility
            const mimeTypes = [
                'video/mp4;codecs=h264,aac', // iOS/Android Standard (Best Compatibility)
                'video/mp4;codecs=avc1,mp4a.40.2', // Alternative H.264 + AAC
                'video/mp4',             // Generic MP4
                'video/mp4;codecs=h264', // Safari Explicit
                'video/webm;codecs=vp9', // Chrome Desktop (High Quality)
                'video/webm;codecs=vp8', // Chrome/Android Standard
                'video/webm'             // Generic Fallback
            ];

            let selectedMimeType = '';
            for (const type of mimeTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    selectedMimeType = type;
                    break;
                }
            }

            if (!selectedMimeType) {
                console.warn('[Recorder] No supported mimeType found, trying default constructor.');
            }

            const options: MediaRecorderOptions = {
                mimeType: selectedMimeType || undefined,
                videoBitsPerSecond: 50000000 // Increased to 50 Mbps for High Quality Vertical Video
            };
            console.log(`[Recorder] Using MIME Type: ${selectedMimeType || 'default'} @ 50Mbps`);

            const recorder = new MediaRecorder(combinedStream, options);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                // Determine extension based on actual mimeType used
                const actualMimeType = recorder.mimeType; // e.g. 'video/mp4'
                const ext = actualMimeType.includes('mp4') ? 'mp4' : 'webm';

                // Compile the blob
                const blob = new Blob(chunksRef.current, { type: actualMimeType });
                const url = URL.createObjectURL(blob);

                // Prompt for Filename
                const defaultName = `digipan-performance-${Date.now()}`;

                // Use a short timeout to ensure UI is responsive before blocking with prompt
                setTimeout(() => {
                    const userTitle = window.prompt("Enter a title for your recording:", defaultName);

                    // If user cancels, we still save with default name (or could choose to discard)
                    // Here we save with default if cancelled/empty to prevent data loss.
                    const filename = (userTitle && userTitle.trim().length > 0) ? userTitle : defaultName;

                    // Trigger Download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}.${ext}`;
                    document.body.appendChild(a);
                    a.click();

                    // Cleanup
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                }, 10);

                // Cleanup Audio Nodes
                if (streamDestRef.current && masterGain) {
                    try {
                        masterGain.disconnect(streamDestRef.current); // Disconnect our recorder tap
                    } catch (err) {
                        console.warn('Failed to disconnect recorder node', err);
                    }
                }

                setIsRecording(false);
                console.log('[Recorder] Recording finished and downloaded.');
            };

            // Start
            recorder.start();
            setIsRecording(true);
            console.log('[Recorder] Started.');

            // Safety Timeout (Max 60 seconds - Increased for longer demos)
            setTimeout(() => {
                if (recorder.state === 'recording') {
                    console.log('[Recorder] Max duration reached (60s). Stopping.');
                    recorder.stop();
                }
            }, 60000);

        } catch (err) {
            console.error('[Recorder] Failed to start recording:', err);
            setIsRecording(false);
        }
    }, [canvasRef, getAudioContext, getMasterGain]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording
    };
};
