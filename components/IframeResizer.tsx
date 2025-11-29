'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
    useEffect(() => {
        const sendHeight = () => {
            // body의 전체 높이 또는 documentElement의 높이 중 큰 값을 사용
            const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight
            );

            // 부모 윈도우로 메시지 전송
            window.parent.postMessage({ type: 'setHeight', height }, '*');
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
            sendHeight();
        });

        // MutationObserver로 내부 컨텐츠 변화도 감지 (더 확실하게)
        const mutationObserver = new MutationObserver(() => {
            sendHeight();
        });

        resizeObserver.observe(document.body);
        mutationObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });

        // 윈도우 리사이즈 이벤트 리스너
        window.addEventListener('resize', sendHeight);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('resize', sendHeight);
        };
    }, []);

    return null;
}
