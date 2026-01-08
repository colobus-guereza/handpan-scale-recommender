"use client";

import { useEffect, useState } from 'react';

// 쿠폰 스케줄 데이터 정의
const COUPON_SCHEDULE = [
    { start: '2026-01-12T00:00:00', end: '2026-01-12T23:59:59', url: 'https://handpan.co.kr/?coupon=1C94E5D228A0E' },
    { start: '2026-01-13T00:00:00', end: '2026-01-13T23:59:59', url: 'https://handpan.co.kr/?coupon=B0B994673157A' },
    { start: '2026-01-14T00:00:00', end: '2026-01-14T23:59:59', url: 'https://handpan.co.kr/?coupon=67C98668451E3' },
    { start: '2026-01-15T00:00:00', end: '2026-01-15T23:59:59', url: 'https://handpan.co.kr/?coupon=C0690700AB531' },
    { start: '2026-01-16T00:00:00', end: '2026-01-16T20:00:00', url: 'https://handpan.co.kr/?coupon=4137D4FCEE546' },
];

export default function EventPage() {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [currentCouponUrl, setCurrentCouponUrl] = useState<string | null>(null);

    useEffect(() => {
        // 기준 날짜: 2026년 1월 16일 저녁 8시 (20:00:00)
        const targetDate = new Date('2026-01-16T20:00:00');

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            // 쿠폰 유효성 체크
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
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        // 초기값 설정
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleCouponDownload = () => {
        if (currentCouponUrl) {
            setShowCouponModal(true);
        }
    };

    const handleModalConfirm = () => {
        if (currentCouponUrl) {
            window.location.href = currentCouponUrl;
        }
        setShowCouponModal(false);
    };

    if (!timeLeft) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full border border-gray-300 rounded-2xl p-10 text-center">
                    <h1 className="text-3xl font-bold mb-4">Event Page</h1>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-2 sm:p-4 w-full">
            <div
                className="w-full text-center bg-white relative overflow-hidden transition-all duration-300 flex flex-col justify-center"
            >
                {/* Overlay for better readability if needed, currently disabled or light */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10"></div>

                {/* <h1 className="text-3xl font-bold mb-8 relative z-10">전품목 할인 이벤트</h1> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch relative z-10 w-full">
                    {/* Limited Stock Section */}
                    <div className="p-6 bg-red-50 border-2 border-red-100 rounded-lg animate-pulse flex flex-col justify-center items-center h-full">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">⚠ 선착순 3대 남음</h2>
                        <p className="text-red-500 font-medium">서두르세요!<br />재고가 빠르게 소진되고 있습니다.</p>
                    </div>

                    {/* Countdown Section */}
                    <div className="p-6 bg-gray-50 rounded-lg flex flex-col justify-center items-center h-full">
                        <h2 className="text-xl font-semibold mb-6">이벤트 종료까지 남은 시간</h2>
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
                            disabled={!currentCouponUrl}
                            className={`w-full h-full min-h-[120px] text-white font-bold rounded-xl text-xl px-4 py-4 transition-all duration-200 shadow-md flex flex-col items-center justify-center gap-2
                                ${currentCouponUrl
                                    ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-1'
                                    : 'bg-gray-400 opacity-70'}`}
                            onClick={handleCouponDownload}
                        >
                            <span className="text-3xl">🎟️</span>
                            <span>{currentCouponUrl ? '할인쿠폰 다운받기' : 'Coming Soon'}</span>
                            {!currentCouponUrl && <span className="text-sm font-normal mt-1 opacity-90">문의 010-8967-9204</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Coupon Modal */}
            {showCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-scaleIn text-center ring-1 ring-gray-900/5">
                        <div className="text-6xl mb-6">🎟️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">쿠폰 발급 완료!</h3>
                        <p className="text-gray-600 mb-8 whitespace-pre-line text-lg leading-relaxed">
                            할인쿠폰이 발급되었습니다.<br />
                            <span className="font-semibold text-green-600">확인</span> 버튼을 누르면 자동 적용됩니다.
                        </p>
                        <button
                            onClick={handleModalConfirm}
                            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
