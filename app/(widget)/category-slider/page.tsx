'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { SCALES } from '@/data/handpanScales';
import { PRODUCTS as ACCESSORY_PRODUCTS } from '@/data/products';
import IframeResizer from '@/components/IframeResizer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// CSS 스타일 추가
const hideContainerStyle = `
  header {
    display: none !important;
  }
  .glass-card {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    min-height: auto !important;
    box-shadow: none !important;
  }
  .min-h-screen.flex.items-start {
    padding: 0 !important;
    min-height: 100vh !important;
  }
  .w-full.max-w-full {
    padding: 0 !important;
  }
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
`;

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
        price: '4,500,000원',
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
        name: 'Eb Muju 10',
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

// Case 카테고리용 제품 목록
const CASE_PRODUCTS = [
    {
        id: 1,
        name: 'Evatek 하드케이스',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/evatek.png',
    },
    {
        id: 2,
        name: 'Avaja 고급 소프트케이스',
        price: '484,000원',
        rating: 4.8,
        reviewCount: 120,
        image: '/images/products/avaja.png',
    },
];

// Stand 카테고리용 제품 목록
const STAND_PRODUCTS = [
    {
        id: 1,
        name: '고급 원목스탠드 S',
        price: '85,000원',
        rating: 4.8,
        reviewCount: 0,
        image: '/images/products/stand_s.png',
    },
    {
        id: 2,
        name: '고급 원목스탠드 M',
        price: '105,000원',
        rating: 4.8,
        reviewCount: 0,
        image: '/images/products/stand_m.png',
    },
];

// 제품명 매핑 (페이지 제품명 -> DB 제품명)
const productNameMap: Record<string, string> = {
    '고급 원목스탠드 S': '원목 핸드팬스탠드 S',
    '고급 원목스탠드 M': '원목 핸드팬스탠드 M',
};



// 제품명으로 ownUrl을 찾는 헬퍼 함수
const getProductUrl = (productName: string): string | null => {
    // 먼저 스케일에서 찾기
    const scale = SCALES.find(s => s.name === productName);
    if (scale?.ownUrl) {
        return scale.ownUrl;
    }

    // 제품명 매핑 적용
    const mappedName = productNameMap[productName] || productName;

    // PRODUCTS에서 찾기
    const product = ACCESSORY_PRODUCTS.find(p => p.name === mappedName || p.name === productName);
    return product?.ownUrl || null;
};

export default function CategorySliderPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 스타일 태그 추가
        const style = document.createElement('style');
        style.textContent = hideContainerStyle;
        document.head.appendChild(style);

        // 페이지 로드 완료 후 로딩 상태 해제
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100); // 최소한의 지연으로 부드러운 전환

        return () => {
            clearTimeout(timer);
            // cleanup
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // 로딩 중일 때 로딩 인디케이터 표시
    if (isLoading) {
        return (
            <>
                <style dangerouslySetInnerHTML={{ __html: hideContainerStyle }} />
                <div className="w-full min-h-screen bg-white flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-gray-100 border-t-gray-300 rounded-full animate-spin opacity-50"></div>
                </div>
            </>
        );
    }



    return (
        <>
            <IframeResizer />
            <style dangerouslySetInnerHTML={{ __html: hideContainerStyle }} />
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-4 gap-8">
                <div className="w-full max-w-[1400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">입문용</h2>
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
                                slidesPerView: 5,
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
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price}
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
                <div className="w-full max-w-[1400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">요가명상힐링</h2>
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
                                slidesPerView: 5,
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
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price}
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
                <div className="w-full max-w-[1400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">메이저 스케일</h2>
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
                                slidesPerView: 5,
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
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price}
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
                <div className="w-full max-w-[1400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">딥 에스닉</h2>
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
                                slidesPerView: 5,
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
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price}
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
                <div className="w-full max-w-[1400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Case</h2>
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
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                        }}
                        className="mySwiper !pb-10 !px-2"
                    >
                        {CASE_PRODUCTS.map((product) => {
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
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price}
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
                <div className="w-full max-w-[1400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Stand</h2>
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
                                slidesPerView: 5,
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
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </>
    );
}
