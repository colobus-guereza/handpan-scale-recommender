'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { CircleFlag } from 'react-circle-flags';

export default function ConditionalContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isCategorySlider = pathname?.includes('/category-slider');
    const [language, setLanguage] = useState<'ko' | 'en'>('ko');

    // URL에서 언어 파라미터 확인
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang');
            if (lang === 'en' || lang === 'ko') {
                setLanguage(lang);
            }
        }
    }, []);

    // 언어 전환 핸들러
    const handleLanguageChange = (lang: 'ko' | 'en') => {
        setLanguage(lang);
        // URL에 언어 파라미터 추가 (현재 페이지 유지)
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.pushState({}, '', url.toString());
        }
    };

    if (isCategorySlider) {
        return (
            <>
                {/* 투명 문자 하나만 넣어서 본문 유지 */}
                <span className="opacity-0">.</span>
                {children}
            </>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center w-full py-4 px-2">
            <div className="w-full max-w-full px-2 md:px-4">
                <div className="flex flex-col items-center space-y-4 glass-card p-4 rounded-3xl border border-glass-border relative min-h-[600px]">
                    {/* Theme Toggle Button (Top Right) - Hidden as requested */}
                    <div className="absolute top-4 right-4 z-50 hidden">
                        <ThemeToggle />
                    </div>

                    <header className="text-center space-y-2 pt-2">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-400 drop-shadow-sm">
                            {language === 'ko' ? '나에게 맞는 핸드팬 스케일 찾기' : "Discover your Handpan scale"}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                            {/* 한국 국기 아이콘 */}
                            <button
                                onClick={() => handleLanguageChange('ko')}
                                className="transition-all duration-200 hover:scale-110 focus:outline-none"
                                aria-label="한국어"
                            >
                                <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full transition-all duration-200 ${language === 'ko'
                                    ? 'ring-2 ring-indigo-600 dark:ring-cosmic shadow-lg dark:shadow-[0_0_10px_rgba(72,255,0,0.3)] scale-105'
                                    : 'opacity-50 hover:opacity-70 ring-1 ring-gray-300 dark:ring-gray-600'
                                    }`}>
                                    <CircleFlag countryCode="kr" height="24" />
                                </div>
                            </button>
                            {/* 미국 국기 아이콘 */}
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className="transition-all duration-200 hover:scale-110 focus:outline-none"
                                aria-label="English"
                            >
                                <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full transition-all duration-200 ${language === 'en'
                                    ? 'ring-2 ring-indigo-600 dark:ring-cosmic shadow-lg dark:shadow-[0_0_10px_rgba(72,255,0,0.3)] scale-105'
                                    : 'opacity-50 hover:opacity-70 ring-1 ring-gray-300 dark:ring-gray-600'
                                    }`}>
                                    <CircleFlag countryCode="us" height="24" />
                                </div>
                            </button>
                        </div>
                    </header>

                    <main className="w-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}


