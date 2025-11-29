'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
    useEffect(() => {
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

        // 초기 높이 전송 (Initial check still needs to query DOM, but only once)
        const initialHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        sendHeight(initialHeight);

        // 모바일 중복 스크롤 방지를 위한 스타일 강제 적용 (iframe 내부일 때만)
        if (window.self !== window.top) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.width = '100%';
            document.body.style.width = '100%';
            document.body.style.minHeight = 'auto'; // 100vh로 인한 강제 늘어남 방지
        }

        // DOM 변화 감지를 위한 Observer
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Use contentRect or borderBoxSize to get height without forcing reflow
                const height = entry.contentRect.height;
                // Add some padding if needed, or use scrollHeight if body overflow is hidden
                // Since we observe document.body, contentRect.height should be close to what we want
                // But let's be safe and use a slightly larger value if needed, or just trust it.
                // Actually, for body, we might want to check if scrollHeight is larger?
                // But checking scrollHeight forces reflow.
                // Let's trust contentRect.height for the stream of updates.
                debouncedSendHeight(height);
            }
        });

        resizeObserver.observe(document.body);

        // 윈도우 리사이즈 이벤트 리스너 (Fallback)
        const handleResize = () => {
            const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            debouncedSendHeight(height);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return null;
}
