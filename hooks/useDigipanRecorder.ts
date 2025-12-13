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

                // Construct a default filename with timestamp
                const fileName = `digipan-performance-${Date.now()}.${ext}`;
                const file = new File([blob], fileName, { type: actualMimeType });

                // Method A: Try Web Share API (Mobile Native Experience)
                // This invokes the native share sheet (Save to Files, AirDrop, etc.) which is the strict standard for iOS/Android.
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({
                        files: [file],
                        title: 'Digipan Performance',
                        text: 'Check out my handpan performance!',
                    })
                        .then(() => {
                            console.log('[Recorder] Shared successfully');
                            cleanup();
                        })
                        .catch((err) => {
                            console.warn('[Recorder] Share failed or cancelled, falling back to download:', err);
                            // If user cancels share, we usually don't need to force download, 
                            // but to be safe against errors, we can fallback.
                            // However, 'AbortError' means user closed the sheet. We should probably respect that or just download.
                            if (err.name !== 'AbortError') {
                                triggerDownload(blob, fileName);
                            } else {
                                cleanup();
                            }
                        });
                } else {
                    // Method B: Desktop / Non-Share Fallback
                    // Browsers like Chrome Desktop support this well.
                    triggerDownload(blob, fileName);
                }

                function triggerDownload(blob: Blob, fileName: string) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();

                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        cleanup();
                    }, 100);
                }

                function cleanup() {
                    // Cleanup Audio Nodes
                    if (streamDestRef.current && masterGain) {
                        try {
                            masterGain.disconnect(streamDestRef.current);
                        } catch (err) {
                            console.warn('Failed to disconnect recorder node', err);
                        }
                    }
                    setIsRecording(false);
                    console.log('[Recorder] Finished and cleaned up.');
                }
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

    const stopRecording = useCallback((): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
                reject(new Error('Recorder is not active'));
                return;
            }

            const recorder = mediaRecorderRef.current;

            // Override onstop for this specific stop call to handle the resolution
            recorder.onstop = () => {
                const actualMimeType = recorder.mimeType;
                const blob = new Blob(chunksRef.current, { type: actualMimeType });

                // Cleanup Audio Nodes
                // Cleanup Audio Nodes
                const masterGain = getMasterGain();
                if (streamDestRef.current && masterGain) {
                    try {
                        masterGain.disconnect(streamDestRef.current);
                    } catch (err) {
                        console.warn('Failed to disconnect recorder node', err);
                    }
                }

                setIsRecording(false);
                console.log('[Recorder] Stopped. Blob created size:', blob.size);
                resolve(blob);
            };

            recorder.stop();
        });
    }, [getMasterGain]);

    return {
        isRecording,
        startRecording,
        stopRecording
    };
};
