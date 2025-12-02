'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
    useEffect(() => {
        // PC 웹(독립 실행)에서는 리사이저 로직을 아예 실행하지 않음 -> 성능 오버헤드 0
        if (typeof window === 'undefined' || window.self === window.top) return;

        let lastHeight = 0;
        let timeoutId: NodeJS.Timeout;

        const sendHeight = (height: number) => {
            if (typeof window === 'undefined' || window.parent === window) return;

            // Only send if height changed by more than 2px to avoid loops
            if (Math.abs(height - lastHeight) > 2) {
                lastHeight = height;
                window.parent.postMessage({ type: 'setHeight', height }, '*');
            }
        };

        const debouncedSendHeight = (height: number) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => sendHeight(height), 100);
        };

        // 초기 높이 전송 (Initial check)
        const initialHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        sendHeight(initialHeight);

        // 모바일 중복 스크롤 방지 및 높이 자동 조절을 위한 스타일 강제 적용
        if (window.self !== window.top) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.width = '100%';
            document.body.style.width = '100%';
            document.body.style.minHeight = 'auto';

            // min-h-screen 및 h-full 등의 스타일이 iframe 높이를 강제로 늘리는 것을 방지
            const style = document.createElement('style');
            style.textContent = `
                .min-h-screen {
                    min-height: auto !important;
                }
                html, body {
                    height: auto !important;
                    min-height: auto !important;
                }
            `;
            document.head.appendChild(style);
        }

        // DOM 변화 감지를 위한 Observer
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Use contentRect to get height without forcing reflow
                const height = entry.contentRect.height;
                debouncedSendHeight(height);
            }
        });

        resizeObserver.observe(document.body);

        // Fallback for window resize
        const onWindowResize = () => {
            const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            debouncedSendHeight(height);
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    return null;
}
