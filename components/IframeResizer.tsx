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
                .min-h-screen { min-height: 0 !important; }
                .min-h-\\[600px\\] { min-height: 0 !important; }
                html, body {
                    height: auto !important;
                    min-height: 0 !important;
                    overflow: hidden !important;
                }
                /* 레이아웃 패딩 제거 */
                body > div {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    min-height: 0 !important;
                }
            `;
            document.head.appendChild(style);
        }

        // DOM 변화 감지를 위한 Observer
        const resizeObserver = new ResizeObserver(() => {
            // document.documentElement.offsetHeight를 사용하여 전체 콘텐츠 높이 측정
            const height = document.documentElement.offsetHeight;
            debouncedSendHeight(height);
        });

        resizeObserver.observe(document.body);
        resizeObserver.observe(document.documentElement);

        // Fallback for window resize
        const onWindowResize = () => {
            const height = document.documentElement.offsetHeight;
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
