"use client";

import { useEffect, useState, useRef } from 'react';

// 쿠폰 스케줄 데이터 정의
const COUPON_SCHEDULE = [
    { start: '2026-01-12T00:00:00+09:00', end: '2026-01-12T23:59:59+09:00', url: 'https://handpan.co.kr/?coupon=1C94E5D228A0E' },
    { start: '2026-01-13T00:00:00+09:00', end: '2026-01-13T23:59:59+09:00', url: 'https://handpan.co.kr/?coupon=B0B994673157A' },
    { start: '2026-01-14T00:00:00+09:00', end: '2026-01-14T23:59:59+09:00', url: 'https://handpan.co.kr/?coupon=67C98668451E3' },
    { start: '2026-01-15T00:00:00+09:00', end: '2026-01-15T23:59:59+09:00', url: 'https://handpan.co.kr/?coupon=C0690700AB531' },
    { start: '2026-01-16T00:00:00+09:00', end: '2026-01-16T20:00:00+09:00', url: 'https://handpan.co.kr/?coupon=4137D4FCEE546' },
];

export default function EventPage() {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isBeforeEvent: boolean;
    } | null>(null);
    const [currentCouponUrl, setCurrentCouponUrl] = useState<string | null>(null);
    const [isWidgetMode, setIsWidgetMode] = useState(false);

    // Iframe Auto-Resize Logic
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 위젯 모드 확인 (?widget=true)
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setIsWidgetMode(searchParams.get('widget') === 'true');
        }

        // 이벤트 일정 설정
        const EVENT_START_DATE = new Date('2026-01-12T00:00:00+09:00');
        const EVENT_END_DATE = new Date('2026-01-16T20:00:00+09:00');

        const calculateTimeLeft = () => {
            const now = new Date();
            const isBeforeEvent = now < EVENT_START_DATE;
            const targetDate = isBeforeEvent ? EVENT_START_DATE : EVENT_END_DATE;

            const difference = targetDate.getTime() - now.getTime();

            // 쿠폰 유효성 체크 (이벤트 기간 내에만 활성화)
            const activeCoupon = COUPON_SCHEDULE.find(schedule => {
                const startTime = new Date(schedule.start).getTime();
                const endTime = new Date(schedule.end).getTime();
                return now.getTime() >= startTime && now.getTime() <= endTime;
            });
            setCurrentCouponUrl(activeCoupon ? activeCoupon.url : null);

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isBeforeEvent
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isBeforeEvent: false };
        };

        // 초기값 설정
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const sendHeight = () => {
            const height = containerRef.current?.offsetHeight || 0;
            if (height > 0) {
                window.parent.postMessage({ type: 'RESIZE_EVENT_WIDGET', height }, '*');
            }
        };

        // Send height on load and whenever content changes
        const sendWithDelay = () => setTimeout(sendHeight, 100);

        const observer = new ResizeObserver(sendWithDelay);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        // Initial send and periodic checks for late rendering
        sendWithDelay();
        window.addEventListener('resize', sendWithDelay);

        // Force check periodically for first few seconds to handle font loading/image rendering
        const interval = setInterval(sendHeight, 500);
        setTimeout(() => clearInterval(interval), 5000);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', sendWithDelay);
            clearInterval(interval);
        };
    }, []);

    const [showCouponModal, setShowCouponModal] = useState(false);

    const handleCouponDownload = async () => {
        if (!currentCouponUrl) return;

        // Try modern clipboard API first
        try {
            await navigator.clipboard.writeText(currentCouponUrl);
            alert('쿠폰 링크가 클립보드에 복사되었습니다.');
            return;
        } catch (err) {
            console.warn('Navigator clipboard failed, trying fallback:', err);
        }

        // Fallback: Use textarea hack for older browsers or webviews
        try {
            const textArea = document.createElement("textarea");
            textArea.value = currentCouponUrl;

            // Ensure it's not visible but part of the DOM
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                alert('쿠폰 링크가 클립보드에 복사되었습니다.');
                return;
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        // Final fallback: Show modal with the link
        setShowCouponModal(true);
    };

    const handleModalConfirm = () => {
        setShowCouponModal(false);
    };

    if (!timeLeft) {
        return (
            <div className="flex items-center justify-center p-4 min-h-[200px]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex items-center justify-center p-2 sm:p-4 w-full"
        >
            <div
                className="w-full text-center bg-white relative overflow-hidden transition-all duration-300 flex flex-col justify-center"
            >
                {/* Overlay for better readability if needed, currently disabled or light */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10"></div>

                {/* <h1 className="text-3xl font-bold mb-8 relative z-10">전품목 할인 이벤트</h1> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch relative z-10 w-full">
                    {/* Limited Stock Section */}
                    {/* Limited Stock Section */}
                    <div className="p-6 bg-red-50 border-2 border-red-100 rounded-lg animate-pulse flex flex-col justify-center items-center h-full gap-2">
                        <h2 className="text-[40px] font-bold text-red-600 mb-0">선착순 10대 남음</h2>
                    </div>

                    {/* Countdown Section */}
                    <div className="p-6 bg-gray-50 rounded-lg flex flex-col justify-center items-center h-full">
                        <h2 className="text-xl font-semibold mb-6">{timeLeft.isBeforeEvent ? '곧 시작합니다.' : '이벤트 종료까지 남은 시간'}</h2>
                        <div className="flex justify-center items-end gap-2 sm:gap-3 w-full">
                            <div className="text-center flex-1">
                                <p className="text-3xl lg:text-4xl font-bold text-blue-600 tabular-nums">{timeLeft.days}</p>
                                <p className="text-xs text-gray-500 mt-1">일</p>
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-gray-300 pb-3 lg:pb-4">:</div>
                            <div className="text-center flex-1">
                                <p className="text-3xl lg:text-4xl font-bold text-red-500 tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</p>
                                <p className="text-xs text-gray-500 mt-1">시간</p>
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-gray-300 pb-3 lg:pb-4">:</div>
                            <div className="text-center flex-1">
                                <p className="text-3xl lg:text-4xl font-bold text-red-500 tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</p>
                                <p className="text-xs text-gray-500 mt-1">분</p>
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-gray-300 pb-3 lg:pb-4">:</div>
                            <div className="text-center flex-1">
                                <p className="text-3xl lg:text-4xl font-bold text-red-500 tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</p>
                                <p className="text-xs text-gray-500 mt-1">초</p>
                            </div>
                        </div>
                    </div>

                    {/* Discount Schedule Section */}
                    <div className="p-4 bg-blue-50 rounded-lg h-full flex flex-col">
                        <h2 className="text-lg font-semibold mb-3 text-blue-800">일자별 할인율 안내</h2>
                        <div className="flex-1 overflow-hidden rounded-lg border border-blue-100 bg-white">
                            <table className="w-full text-sm h-full">
                                <thead className="bg-blue-100/50">
                                    <tr>
                                        <th className="py-2 px-3 text-left font-semibold text-blue-900">날짜</th>
                                        <th className="py-2 px-3 text-right font-semibold text-blue-900">할인율</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100">
                                    <tr>
                                        <td className="py-2 px-3 text-left text-gray-700">1월 12일 (월)</td>
                                        <td className="py-2 px-3 text-right font-bold text-blue-600">25%</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-3 text-left text-gray-700">1월 13일 (화)</td>
                                        <td className="py-2 px-3 text-right font-bold text-blue-600">20%</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-3 text-left text-gray-700">1월 14일 (수)</td>
                                        <td className="py-2 px-3 text-right font-bold text-blue-600">15%</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-3 text-left text-gray-700">1월 15일 (목)</td>
                                        <td className="py-2 px-3 text-right font-bold text-blue-600">10%</td>
                                    </tr>
                                    <tr className="bg-red-50/50">
                                        <td className="py-2 px-3 text-left text-gray-700">1월 16일 (금)</td>
                                        <td className="py-2 px-3 text-right font-bold text-red-600">5%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Purchase Info Section */}
                    <div className="p-6 bg-green-50 border-2 border-green-100 rounded-lg flex flex-col justify-center items-center h-full">
                        <button
                            disabled={timeLeft.isBeforeEvent || !currentCouponUrl}
                            className={`w-full flex-1 min-h-[120px] text-white font-bold rounded-xl text-xl px-4 py-4 transition-all duration-200 shadow-md flex flex-col items-center justify-center gap-2
                                ${!timeLeft.isBeforeEvent && currentCouponUrl
                                    ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:-translate-y-1'
                                    : 'bg-red-200 text-red-50 cursor-not-allowed'}`}
                            onClick={handleCouponDownload}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94c-2.618 0-4.5-1.425-4.5-3.06 0-1.636 1.882-3.06 4.5-3.06V6a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v3.94c2.618 0 4.5 1.425 4.5 3.06 0 1.636-1.882 3.06-4.5 3.06z" clipRule="evenodd" />
                            </svg>
                            <span>
                                {timeLeft.isBeforeEvent
                                    ? '쿠폰 다운받기'
                                    : currentCouponUrl
                                        ? '할인쿠폰 다운받기'
                                        : 'Coming Soon'}
                            </span>
                            {!timeLeft.isBeforeEvent && !currentCouponUrl && <span className="text-sm font-normal mt-1 opacity-90">문의 010-8967-9204</span>}
                        </button>

                        <div className="flex w-full gap-2 mt-3">
                            <a
                                href="tel:+821089679204"
                                className="flex-1 bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-blue-600 transition-colors shadow-sm"
                            >
                                <span>📞</span>
                                <span>문의</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Purchase Guide Section - Hide in Widget Mode */}
                {!isWidgetMode && (
                    <div className="w-full mt-6 bg-white rounded-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">- 간단한 할인구매 방법 -</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-gray-700 mb-2">1</div>
                                <p className="text-lg font-semibold text-gray-700 mb-3">쿠폰 다운받기</p>
                                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                                    <img src="/images/event/guide_step1.png" alt="쿠폰 다운받기" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-gray-700 mb-2">2</div>
                                <p className="text-lg font-semibold text-gray-700 mb-3">핸드팬 고르기</p>
                                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                                    <img src="/images/event/guide_step2.png" alt="핸드팬 고르기" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-gray-700 mb-2">3</div>
                                <p className="text-lg font-semibold text-gray-700 mb-3">결제 시 쿠폰 적용하기</p>
                                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                                    <img src="/images/event/guide_step3.png" alt="결제 시 쿠폰 적용하기" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-gray-700 mb-2">4</div>
                                <p className="text-lg font-semibold text-gray-700 mb-3">할인적용 완료</p>
                                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                                    <img src="/images/event/guide_step4.png" alt="할인적용 완료" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Coupon Modal */}
            {
                showCouponModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-scaleIn text-center ring-1 ring-gray-900/5">
                            <div className="text-6xl mb-6">🎟️</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                {currentCouponUrl ? '쿠폰 링크 확인' : '쿠폰 발급 완료!'}
                            </h3>
                            <p className="text-gray-600 mb-6 whitespace-pre-line text-lg leading-relaxed">
                                {currentCouponUrl ? (
                                    <>
                                        자동 복사에 실패했습니다.<br />
                                        아래 링크를 직접 복사해서 사용해주세요.<br />
                                        <div className="mt-4 p-3 bg-gray-100 rounded-lg break-all text-sm font-mono select-all">
                                            {currentCouponUrl}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        할인쿠폰이 발급되었습니다.<br />
                                        <span className="font-semibold text-green-600">확인</span> 버튼을 누르면 자동 적용됩니다.
                                    </>
                                )}
                            </p>
                            <button
                                onClick={handleModalConfirm}
                                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )
            }

        </div >
    );
}
