'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
    useEffect(() => {
        let lastHeight = 0;
        let timeoutId: NodeJS.Timeout;

        const sendHeight = () => {
            if (typeof window === 'undefined' || window.parent === window) return;

            const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight
            );

            // Only send if height changed by more than 2px to avoid loops
            if (Math.abs(height - lastHeight) > 2) {
                lastHeight = height;
                window.parent.postMessage({ type: 'setHeight', height }, '*');
            }
        };

        const debouncedSendHeight = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(sendHeight, 100);
        };

        // 초기 높이 전송
        sendHeight();

        // 모바일 중복 스크롤 방지를 위한 스타일 강제 적용 (iframe 내부일 때만)
        if (window.self !== window.top) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.width = '100%';
            document.body.style.width = '100%';
            document.body.style.minHeight = 'auto'; // 100vh로 인한 강제 늘어남 방지
        }

        // DOM 변화 감지를 위한 Observer
        const resizeObserver = new ResizeObserver(() => {
            debouncedSendHeight();
        });

        // MutationObserver로 내부 컨텐츠 변화도 감지 (더 확실하게)
        const mutationObserver = new MutationObserver(() => {
            debouncedSendHeight();
        });

        resizeObserver.observe(document.body);
        mutationObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });

        // 윈도우 리사이즈 이벤트 리스너
        window.addEventListener('resize', debouncedSendHeight);

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('resize', debouncedSendHeight);
        };
    }, []);

    return null;
}
