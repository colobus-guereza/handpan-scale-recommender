"use client";

import { useState, useEffect, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VibeSelector, { Vibe, VIBES } from "@/components/VibeSelector";
import ScaleList from "@/components/ScaleList";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { SCALES } from '@/data/handpanScales';
import { PRODUCTS as ACCESSORY_PRODUCTS } from '@/data/products';
import { CircleFlag } from 'react-circle-flags';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, Language } from '@/constants/translations';
import { getLocalizedProduct } from '../utils/i18n';
import ThemeToggle from "@/components/ThemeToggle";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Mock Data
const PRODUCTS = [
    {
        id: 1,
        name: 'D Kurd 10',
        price: '2,860,000원',
        rating: 5.0,
        reviewCount: 280,
        image: '/images/products/10.png',
    },
    {
        id: 2,
        name: 'D Kurd 12',
        price: '3,520,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/12_normal.png',
    },
    {
        id: 3,
        name: 'F Low Pygmy 9',
        price: '2,640,000원',
        rating: 4.9,
        reviewCount: 85,
        image: '/images/products/9.png',
    },
    {
        id: 4,
        name: 'C# Annapurna 9',
        price: '2,640,000원',
        rating: 4.7,
        reviewCount: 310,
        image: '/images/products/9.png',
    },
    {
        id: 5,
        name: 'F Aeolian 10',
        price: '2,860,000원',
        rating: 4.6,
        reviewCount: 50,
        image: '/images/products/10.png',
    },
    {
        id: 6,
        name: 'D Asha 9',
        price: '2,640,000원',
        rating: 4.9,
        reviewCount: 150,
        image: '/images/products/9.png',
    },
    {
        id: 7,
        name: 'C# Pygmy 9',
        price: '2,640,000원',
        rating: 4.8,
        reviewCount: 200,
        image: '/images/products/9.png',
    },
    {
        id: 9,
        name: 'D Kurd 9',
        price: '2,640,000원',
        rating: 5.0,
        reviewCount: 280,
        image: '/images/products/9.png',
    },
];

// 요가명상힐링 카테고리용 제품 목록
const HEALING_PRODUCTS = [
    {
        id: 101,
        name: 'F# Low Pygmy 14',
        price: '4,400,000원',
        rating: 5.0,
        reviewCount: 280,
        image: '/images/products/14_silver.png',
    },
    {
        id: 2,
        name: 'C# Pygmy 11',
        price: '3,300,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/12_normal.png',
    },
    {
        id: 3,
        name: 'F# Low Pygmy 18',
        price: '5,720,000원',
        rating: 4.9,
        reviewCount: 85,
        image: '/images/products/14.png',
    },
    {
        id: 6,
        name: 'F Low Pygmy 12',
        price: '3,520,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/12_normal.png',
    },
    {
        id: 4,
        name: 'F Low Pygmy 9',
        price: '2,640,000원',
        rating: 4.7,
        reviewCount: 310,
        image: '/images/products/9.png',
    },
    {
        id: 5,
        name: 'C# Pygmy 9',
        price: '2,640,000원',
        rating: 4.6,
        reviewCount: 50,
        image: '/images/products/9.png',
    },
];

// 메이저 스케일 카테고리용 제품 목록
const MAJOR_SCALE_PRODUCTS = [
    {
        id: 201,
        name: 'D Asha 15',
        price: '4,730,000원',
        rating: 5.0,
        reviewCount: 280,
        image: '/images/products/14.png',
    },
    {
        id: 203,
        name: 'Eb MUJU 10',
        price: '2,860,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/10.png',
    },
    {
        id: 204,
        name: 'C Major 10',
        price: '2,860,000원',
        rating: 4.7,
        reviewCount: 310,
        image: '/images/products/10.png',
    },
    {
        id: 202,
        name: 'D Asha 9',
        price: '2,640,000원',
        rating: 4.9,
        reviewCount: 150,
        image: '/images/products/9.png',
    },
    {
        id: 205,
        name: 'C 윤슬 9',
        nameEn: 'C Yunsl 9',
        price: '2,640,000원',
        rating: 4.9,
        reviewCount: 85,
        image: '/images/products/9.png',
    },
    {
        id: 206,
        name: 'C# Annapurna 9',
        price: '2,640,000원',
        rating: 4.7,
        reviewCount: 310,
        image: '/images/products/9.png',
    },
];

// 딥 에스닉 카테고리용 제품 목록
const DEEP_ETHNIC_PRODUCTS = [
    {
        id: 301,
        name: 'E Equinox 12',
        price: '3,520,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/12_normal.png',
    },
    {
        id: 302,
        name: 'E Equinox 14',
        price: '3,960,000원',
        rating: 4.7,
        reviewCount: 150,
        image: '/images/products/12_normal.png',
    },
    {
        id: 303,
        name: 'E Romanian Hijaz 10',
        price: '2,860,000원',
        rating: 4.9,
        reviewCount: 200,
        image: '/images/products/10.png',
    },
    {
        id: 304,
        name: 'E La Sirena 10',
        price: '2,860,000원',
        rating: 4.6,
        reviewCount: 90,
        image: '/images/products/10.png',
    },
    {
        id: 305,
        name: 'C# Deepasia 14',
        price: '3,960,000원',
        rating: 4.8,
        reviewCount: 180,
        image: '/images/products/12_normal.png',
    },
    {
        id: 306,
        name: 'C Rasavali 9',
        price: '2,640,000원',
        rating: 4.7,
        reviewCount: 140,
        image: '/images/products/9.png',
    },
    {
        id: 307,
        name: 'D Saladin 9',
        price: '2,640,000원',
        rating: 4.9,
        reviewCount: 250,
        image: '/images/products/9.png',
    },
];

// Hard Case 카테고리용 제품 목록
const CASE_PRODUCTS = [
    {
        id: 1,
        name: 'HTC Evatek (M, Black)',
        nameEn: 'HTC Evatek (M, Black)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/evatek.png',
    },
    {
        id: 2,
        name: 'HTC Evatek (M, Cayenne)',
        nameEn: 'HTC Evatek (M, Cayenne)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/evatek_cayenne.png',
        soldOut: true,
    },
    {
        id: 3,
        name: 'HTC Evatek (M, Woodbine)',
        nameEn: 'HTC Evatek (M, Woodbine)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/evatek_woodbine.png',
        soldOut: true,
    },
    {
        id: 4,
        name: 'HTC Evatek (M, Mustang)',
        nameEn: 'HTC Evatek (M, Mustang)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/evatek_mustang.png',
        soldOut: true,
    },
    {
        id: 5,
        name: 'HTC Evatek (M, AJP)',
        nameEn: 'HTC Evatek (M, AJP)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/evatek_ajp.png',
        soldOut: true,
    },
];

// 소프트케이스 카테고리용 제품 목록
const SOFT_CASE_PRODUCTS = [
    {
        id: 2,
        name: 'Avaja Premium (M, Grey)',
        nameEn: 'Avaja Premium (M, Grey)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/avaja_titanmid_grey.png',
        i18n: {
            fr: {
                name: 'Avaja Premium (M, Gris)'
            }
        }
    },
    {
        id: 3,
        name: 'Avaja Premium (M, Green)',
        nameEn: 'Avaja Premium (M, Green)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/avaja_titanmid_green.png',
        soldOut: true,
        i18n: {
            fr: {
                name: 'Avaja Premium (M, Vert)'
            }
        }
    },
    {
        id: 4,
        name: 'Avaja Premium (M, White)',
        nameEn: 'Avaja Premium (M, White)',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/avaja_titanmid_white.png',
        soldOut: true,
        i18n: {
            fr: {
                name: 'Avaja Premium (M, Blanc)'
            }
        }
    },
];

// Stand 카테고리용 제품 목록
const STAND_PRODUCTS = [
    {
        id: 1,
        name: '고급 원목스탠드 S',
        nameEn: 'Wood Handpan Stand S',
        price: '85,000원',
        rating: 4.8,
        reviewCount: 0,
        image: '/images/products/stand_s.png',
        i18n: {
            fr: {
                name: 'Support de handpan en bois S'
            }
        }
    },
    {
        id: 2,
        name: '고급 원목스탠드 M',
        nameEn: 'Wood Handpan Stand M',
        price: '105,000원',
        rating: 4.8,
        reviewCount: 0,
        image: '/images/products/stand_m.png',
        i18n: {
            fr: {
                name: 'Support de handpan en bois M'
            }
        }
    },
];

// 제품명 매핑 (페이지 제품명 -> DB 제품명)
const productNameMap: Record<string, string> = {
    '고급 원목스탠드 S': '원목 핸드팬스탠드 S',
    '고급 원목스탠드 M': '원목 핸드팬스탠드 M',
};

// 제품명으로 productUrl을 찾는 헬퍼 함수
const getProductUrl = (productName: string): string | null => {
    // 먼저 스케일에서 찾기
    const scale = SCALES.find(s => s.name === productName);
    if (scale?.ownUrl) {
        return scale.ownUrl;
    }
    // ownUrl이 없으면 productUrl 사용
    if (scale?.productUrl) {
        return scale.productUrl;
    }

    // Avaja Premium 제품들은 모두 같은 링크 사용
    if (productName.includes('Avaja Premium')) {
        const avajaProduct = ACCESSORY_PRODUCTS.find(p => p.name === 'Avaja 고급 소프트케이스');
        if (avajaProduct?.ownUrl) {
            return avajaProduct.ownUrl;
        }
    }

    // 제품명 매핑 적용
    const mappedName = productNameMap[productName] || productName;

    // PRODUCTS에서 찾기
    const product = ACCESSORY_PRODUCTS.find(p => p.name === mappedName || p.name === productName);
    return product?.ownUrl || null;
};

export default function Home() {
    const [scaleIdFromUrl, setScaleIdFromUrl] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>('ko');
    const t = TRANSLATIONS[language];

    // 클라이언트 측에서 URL 파라미터 읽기
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const scaleId = params.get('scale');
            setScaleIdFromUrl(scaleId);

            // URL에서 언어 파라미터 확인
            const lang = params.get('lang');
            const isSupported = SUPPORTED_LANGUAGES.some(l => l.code === lang);
            if (isSupported && lang) {
                setLanguage(lang as Language);
            }
        }
    }, []);

    // 초기값을 '요가명상힐링' (meditation)으로 설정
    const initialVibe = VIBES.find(v => v.id === 'meditation') || null;
    const [step, setStep] = useState<'selection' | 'result'>('result');
    const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(initialVibe);
    const [isLoading, setIsLoading] = useState(true);

    // 언어 전환 핸들러
    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        // URL에 언어 파라미터 추가 (현재 페이지 유지)
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.pushState({}, '', url.toString());
        }
    };

    // 가격 포맷 변환 함수
    const formatPrice = (price: string): string => {
        if (language !== 'ko') {
            // "2,860,000원" -> "KRW 2,860,000"
            return price.replace('원', '').trim() ? `KRW ${price.replace('원', '').trim()}` : price;
        }
        // 한글 모드: 그대로 반환
        return price;
    };



    useEffect(() => {
        // 페이지 로드 완료 후 로딩 상태 해제
        const timer = setTimeout(() => {
            setIsLoading(false);

            // 로딩 완료 후 높이 갱신 메시지 전송 (아이프레임 높이 조절)
            if (typeof window !== 'undefined' && window.self !== window.top) {
                setTimeout(() => {
                    const height = document.documentElement.offsetHeight;
                    window.parent.postMessage({ type: 'setHeight', height }, '*');
                }, 100); // 렌더링 및 레이아웃 안정화 시간 고려
            }
        }, 300); // 이미지 로드 시간을 고려한 지연

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleVibeSelect = (vibe: Vibe) => {
        setSelectedVibe(vibe);
        setStep('result');
    };

    const handleBack = () => {
        setStep('selection');
        setSelectedVibe(null);
    };

    // 로딩 중일 때 로딩 인디케이터 표시
    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-300 rounded-full animate-spin opacity-50"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/* Main Service Container - Preserving Original Styles */}
            <div className="w-full max-w-full px-2 md:px-4">
                <div className="flex flex-col items-center space-y-4 glass-card p-4 rounded-3xl border border-glass-border relative min-h-[600px]">
                    {/* Theme Toggle Button (Top Right) - Hidden as requested */}
                    <div className="absolute top-4 right-4 z-50 hidden">
                        <ThemeToggle />
                    </div>

                    {/* Worldwide Shipping Badge - Top Right */}
                    <div className="absolute top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full shadow-lg animate-pulse hover:animate-none transition-all duration-300 hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 md:h-6 md:w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M3.055 11H1m2.055 0c-.01.33-.055.66-.055 1 0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2c-1.66 0-3.2.405-4.555 1.11M3.055 11l1.11-1.11M21 11h-2m-2 0h2m-2 0a2 2 0 00-2-2h-2m4 2v1a2 2 0 01-2 2h-2m4-3V9a2 2 0 00-2-2h-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h2m-2 0v2m2-2v2m0 0h2m-2 0H9m2 0v2m0-2V9" />
                        </svg>
                        <span className="text-sm md:text-base font-bold whitespace-nowrap">
                            {t.shipping.worldwide}
                        </span>
                    </div>

                    <header className="text-center space-y-2 pt-2">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-400 drop-shadow-sm">
                            {language === 'ko' ? '나에게 맞는 핸드팬 스케일 찾기' : "Discover your Handpan scale"}
                        </h1>
                        <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl mx-auto">
                            {SUPPORTED_LANGUAGES.filter(lang => ['ko', 'en', 'fr'].includes(lang.code)).map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className="transition-all duration-200 hover:scale-110 focus:outline-none"
                                    aria-label={lang.name}
                                >
                                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full transition-all duration-200 ${language === lang.code
                                        ? 'ring-2 ring-indigo-600 dark:ring-cosmic shadow-lg dark:shadow-[0_0_10px_rgba(72,255,0,0.3)] scale-105'
                                        : 'opacity-50 hover:opacity-70 ring-1 ring-gray-300 dark:ring-gray-600'
                                        }`}>
                                        <CircleFlag countryCode={lang.flag} height="24" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </header>

                    <main className="w-full">
                        {step === 'selection' ? (
                            <div className="w-full">
                                <VibeSelector onSelect={handleVibeSelect} language={language} />
                            </div>
                        ) : (
                            <section className="w-full bg-white dark:bg-slate-950 py-8">
                                {selectedVibe && (
                                    <ScaleList
                                        selectedVibe={selectedVibe}
                                        onBack={handleBack}
                                        onChangeVibe={handleVibeSelect}
                                        initialScaleId={scaleIdFromUrl || undefined}
                                        language={language}
                                    />
                                )}
                            </section>
                        )}
                    </main>
                </div>
            </div>

            {/* Category Slider Container - Full Width */}
            <section className="w-full bg-white dark:bg-slate-950 py-8 mt-8">
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.beginner}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className="flex flex-col group cursor-pointer"
                                        onClick={() => {
                                            if (productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-0">
                                                {getLocalizedProduct(product as any, language).name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className="w-full border-t border-gray-300 my-8"></div>
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.healing}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {HEALING_PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className="flex flex-col group cursor-pointer"
                                        onClick={() => {
                                            if (productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-0">
                                                {getLocalizedProduct(product as any, language).name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className="w-full border-t border-gray-300 my-8"></div>
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.bright}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {MAJOR_SCALE_PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className="flex flex-col group cursor-pointer"
                                        onClick={() => {
                                            if (productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-0">
                                                {getLocalizedProduct(product as any, language).name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className="w-full border-t border-gray-300 my-8"></div>
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.ethnic}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {DEEP_ETHNIC_PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className="flex flex-col group cursor-pointer"
                                        onClick={() => {
                                            if (productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-0">
                                                {getLocalizedProduct(product as any, language).name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className="w-full border-t border-gray-300 my-8"></div>
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.case}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {CASE_PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);
                            const isSoldOut = (product as any).soldOut || false;

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className={`flex flex-col group ${isSoldOut ? 'cursor-default' : 'cursor-pointer'}`}
                                        onClick={() => {
                                            if (!isSoldOut && productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className={`w-full h-full object-cover transition-transform duration-300 ${isSoldOut ? '' : 'group-hover:scale-105'}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'contain',
                                                    opacity: isSoldOut ? 0.7 : 1
                                                }}
                                            />
                                            {isSoldOut && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                                                        {language === 'ko' ? '품절' : language === 'fr' ? 'Épuisé' : 'Sold Out'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-medium line-clamp-1 mb-0 ${isSoldOut ? 'text-gray-400' : 'text-gray-900'}`}>
                                                {language === 'en' ? ((product as any).nameEn || product.name) : product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-lg font-bold ${isSoldOut ? 'text-gray-400' : 'text-gray-900'}`}>
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className="w-full border-t border-gray-300 my-8"></div>
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.softCase}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {SOFT_CASE_PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);
                            const isSoldOut = (product as any).soldOut || false;

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className={`flex flex-col group ${isSoldOut ? 'cursor-default' : 'cursor-pointer'}`}
                                        onClick={() => {
                                            if (!isSoldOut && productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className={`w-full h-full object-cover transition-transform duration-300 ${isSoldOut ? '' : 'group-hover:scale-105'}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'cover',
                                                    opacity: isSoldOut ? 0.7 : 1
                                                }}
                                            />
                                            {isSoldOut && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                                                        {language === 'ko' ? '품절' : language === 'fr' ? 'Épuisé' : 'Sold Out'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-medium line-clamp-1 mb-0 ${isSoldOut ? 'text-gray-400' : 'text-gray-900'}`}>
                                                {getLocalizedProduct(product as any, language).name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-lg font-bold ${isSoldOut ? 'text-gray-400' : 'text-gray-900'}`}>
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
                <div className="w-full border-t border-gray-300 my-8"></div>
                <div className="w-full max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2 text-center">{t.categories.stand}</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {STAND_PRODUCTS.map((product) => {
                            const productUrl = getProductUrl(product.name);

                            return (
                                <SwiperSlide key={product.id}>
                                    <div
                                        className="flex flex-col group cursor-pointer"
                                        onClick={() => {
                                            if (productUrl) {
                                                window.open(productUrl, '_top');
                                            }
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-xl bg-white mb-5"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1 / 1',
                                                minHeight: '200px'
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-0">
                                                {getLocalizedProduct(product as any, language).name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </section>
        </div>
    );
}
