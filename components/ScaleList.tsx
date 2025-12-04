import React, { useMemo, useState, useEffect } from 'react';
import { SCALES, Scale, VECTOR_AXES } from '../data/handpanScales';
import { Vibe, VIBES } from './VibeSelector';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Play, ExternalLink, Music2, Filter, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Sparkles, Moon, Sun, Flame, Share2, Check } from 'lucide-react';
import { TRANSLATIONS, Language } from '@/constants/translations';

interface Props {
    selectedVibe: Vibe;
    onBack: () => void;
    onChangeVibe: (vibe: Vibe) => void;
    initialScaleId?: string;
    language: Language;
}

const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getOrdinalSuffix = (rank: number): string => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
};

const VideoPlayer = ({ url, title }: { url: string; title: string }) => {
    const videoId = getVideoId(url);

    if (!videoId) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Play className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm">영상 준비중</span>
            </div>
        );
    }

    return (
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
};

export default function ScaleList({ selectedVibe, onBack, onChangeVibe, initialScaleId, language }: Props) {
    const t = TRANSLATIONS[language];
    const [displayScales, setDisplayScales] = useState<Scale[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 디버깅: initialScaleId 확인
    useEffect(() => {
        if (initialScaleId) {
            console.log('Initial Scale ID from URL:', initialScaleId);
        }
    }, [initialScaleId]);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedPitches, setSelectedPitches] = useState<Set<string>>(new Set());
    const [showAllScales, setShowAllScales] = useState(true);
    const [showClassificationCriteria, setShowClassificationCriteria] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedNoteCount, setSelectedNoteCount] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<'normal' | 'mutant' | null>(null);
    const [selectedMood, setSelectedMood] = useState<'minor' | 'major' | null>(null);
    const [selectedTone, setSelectedTone] = useState<'pure' | 'spicy' | null>(null);
    const [selectedPopularity, setSelectedPopularity] = useState<'rare' | 'popular' | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const CATEGORIES = [
        { id: 'beginner', label: t.categories.beginner, tags: ['대중적', '입문추천', '국내인기', 'Bestseller', '기본', '표준', '표준확장', 'Popular', 'Recommended for Beginners', 'Domestic Popular', 'Basic', 'Standard', 'Standard Extended'], icon: <Sparkles className="w-6 h-6 text-slate-400" /> },
        { id: 'healing', label: t.categories.healing, tags: ['명상', '힐링', '치유', '차분한', '평화', 'Deep', '피그미', '트랜스', '몽환적', '깊음', '깊은울림', 'Meditation', 'Healing', 'Calm', 'Peace', 'Pygmy', 'Trance', 'Dreamy', 'Deep Resonance'], icon: <Moon className="w-6 h-6 text-slate-400" /> },
        { id: 'bright', label: t.categories.bright, tags: ['메이저', '밝음', '상쾌함', '희망적', '행복한', '윤슬', '사파이어', '청량함', '에너지', 'Major', 'Bright', 'Refreshing', 'Hopeful', 'Happy', 'Yunsl', 'Sapphire', 'Energy'], icon: <Sun className="w-6 h-6 text-slate-400" /> },
        { id: 'ethnic', label: t.categories.ethnic, tags: ['이국적', '집시', '아라비안', '중동풍', '독특함', '인도풍', '동양적', '하이브리드', '도리안', '블루스', '신비', '매니아', '라사발리', '딥아시아', '신비로움', 'Exotic', 'Gypsy', 'Arabian', 'Middle Eastern', 'Unique', 'Indian Style', 'Oriental', 'Hybrid', 'Dorian', 'Blues', 'Mysterious', 'Mania', 'Rasavali', 'Deep Asia'], icon: <Flame className="w-6 h-6 text-slate-400" /> }
    ];

    // VibeSelector와 동일한 호버 스타일 함수
    const getHoverStyles = (categoryId: string) => {
        const hoverColors: Record<string, { border: string; icon: string; text: string; shadow: string }> = {
            'beginner': {
                border: 'hover:border-[#48FF00]/20 dark:hover:border-[#48FF00]/10',
                icon: 'group-hover:text-[#48FF00]',
                text: 'group-hover:text-slate-900 dark:group-hover:text-white',
                shadow: 'group-hover:drop-shadow-[0_0_8px_rgba(72,255,0,0.5)]'
            },
            'healing': {
                border: 'hover:border-[#DDA0DD]/20 dark:hover:border-[#DDA0DD]/10',
                icon: 'group-hover:text-[#DDA0DD]',
                text: 'group-hover:text-slate-900 dark:group-hover:text-white',
                shadow: 'group-hover:drop-shadow-[0_0_8px_rgba(221,160,221,0.5)]'
            },
            'bright': {
                border: 'hover:border-[#FCFF48]/20 dark:hover:border-[#FCFF48]/10',
                icon: 'group-hover:text-[#FCFF48]',
                text: 'group-hover:text-slate-900 dark:group-hover:text-white',
                shadow: 'group-hover:drop-shadow-[0_0_8px_rgba(252,255,72,0.5)]'
            },
            'ethnic': {
                border: 'hover:border-[#DC2626]/20 dark:hover:border-[#DC2626]/20',
                icon: 'group-hover:text-[#DC2626]',
                text: 'group-hover:text-slate-900 dark:group-hover:text-white',
                shadow: 'group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]'
            }
        };

        const colors = hoverColors[categoryId] || hoverColors['beginner'];

        return {
            bg: `glass-card hover:bg-indigo-50 dark:hover:bg-white/5`,
            border: `border-2 border-glass-border ${colors.border}`,
            iconColor: `text-slate-400 dark:text-slate-400 ${colors.icon} group-hover:drop-shadow-sm ${colors.shadow}`,
            textColor: `text-slate-600 dark:text-slate-300 ${colors.text} group-hover:drop-shadow-sm dark:group-hover:drop-shadow-md`
        };
    };

    // 현재 보여줄 스케일 (Effect용)
    const currentScaleForEffect = displayScales[currentIndex];

    // URL 복사 함수 - 현재 선택된 스케일 ID를 포함한 URL 생성
    const handleShare = async () => {
        try {
            const currentScale = displayScales[currentIndex];
            if (!currentScale) return;

            // 현재 URL의 기본 경로 가져오기
            const baseUrl = window.location.origin + window.location.pathname;
            // 스케일 ID를 쿼리 파라미터로 추가
            const shareUrl = `${baseUrl}?scale=${currentScale.id}`;

            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000); // 2초 후 원래 아이콘으로 복귀
        } catch (err) {
            console.error('URL 복사 실패:', err);
            // Fallback: 구형 브라우저 지원
            const currentScale = displayScales[currentIndex];
            if (!currentScale) return;

            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = `${baseUrl}?scale=${currentScale.id}`;

            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    };

    // 내부 상태 변경 시 높이 재계산을 위한 Effect
    useEffect(() => {
        if (typeof window === 'undefined' || window.self === window.top) return;

        const sendHeight = () => {
            const height = document.documentElement.offsetHeight;
            window.parent.postMessage({ type: 'setHeight', height }, '*');
        };

        // 상태 변경 직후 및 약간의 지연 후 높이 전송 (애니메이션 고려)
        sendHeight();
        const timer = setTimeout(sendHeight, 100);
        const timer2 = setTimeout(sendHeight, 300); // 애니메이션이 긴 경우를 대비

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, [showClassificationCriteria, showAllScales, showFilter, displayScales, currentScaleForEffect?.name]);

    // 스케일 변경 시 복사 상태 초기화
    useEffect(() => {
        setIsCopied(false);
    }, [currentIndex]);

    const matchesCategory = (scale: Scale, categoryId: string) => {
        const category = CATEGORIES.find(c => c.id === categoryId);
        if (!category) return true;
        return scale.tags.some(tag => category.tags.includes(tag));
    };

    // VIBE ID를 카테고리 ID로 매핑
    const getCategoryIdFromVibeId = (vibeId: string): string => {
        const mapping: Record<string, string> = {
            'jamming': 'beginner',
            'meditation': 'healing',
            'uplift': 'bright',
            'exotic': 'ethnic'
        };
        return mapping[vibeId] || 'beginner';
    };

    // 카테고리 ID를 VIBE로 변환
    const getVibeFromCategoryId = (categoryId: string): Vibe | null => {
        const mapping: Record<string, string> = {
            'beginner': 'jamming',
            'healing': 'meditation',
            'bright': 'uplift',
            'ethnic': 'exotic'
        };
        const vibeId = mapping[categoryId];
        return VIBES.find(v => v.id === vibeId) || null;
    };

    // Recommendation Logic
    const recommendedScales = useMemo(() => {
        const target = selectedVibe.target;

        // Calculate distance and sort
        const sorted = [...SCALES].map(scale => {
            const distance = Math.sqrt(
                Math.pow(scale.vector.minorMajor - target.minorMajor, 2) +
                Math.pow(scale.vector.pureSpicy - target.pureSpicy, 2)
            );
            return { ...scale, distance };
        }).sort((a, b) => {
            // Primary Sort: Distance (Ascending)
            const distDiff = a.distance - b.distance;

            // If distance is very similar (within 0.1), prefer higher popularity
            if (Math.abs(distDiff) < 0.1) {
                return b.vector.rarePopular - a.vector.rarePopular;
            }

            return distDiff;
        });

        return sorted;
    }, [selectedVibe]);

    // Initialize displayScales with top 3 results (카테고리별 하드코딩된 순위)
    // Top 3 Scales Logic (Memoized for reuse in rendering)
    const topRankedScales = useMemo(() => {
        let topScales: Scale[] = [];

        // 카테고리별 1위, 2위, 3위 하드코딩
        if (selectedVibe.id === 'jamming') {
            // 입문용: 1위 D Kurd 10, 2위 D Kurd 12, 3위 F Low Pygmy 9
            const scale1 = SCALES.find(s => s.id === 'd_kurd_10');
            const scale2 = SCALES.find(s => s.id === 'd_kurd_12');
            const scale3 = SCALES.find(s => s.id === 'f_low_pygmy_9');
            if (scale1) topScales.push(scale1);
            if (scale2) topScales.push(scale2);
            if (scale3) topScales.push(scale3);
        } else if (selectedVibe.id === 'meditation') {
            // 요가명상힐링: 1위 F# Low Pygmy 14, 2위 C# Pygmy 11, 3위 F# Low Pygmy 18 Mutant
            const scale1 = SCALES.find(s => s.id === 'fs_low_pygmy_14_mutant');
            const scale2 = SCALES.find(s => s.id === 'cs_pygmy_11');
            const scale3 = SCALES.find(s => s.id === 'fs_low_pygmy_18_mutant');
            if (scale1) topScales.push(scale1);
            if (scale2) topScales.push(scale2);
            if (scale3) topScales.push(scale3);
        } else if (selectedVibe.id === 'uplift') {
            // 밝은 Major: 1위 D Asha 15, 3위 Eb MUJU 10
            const scale1 = SCALES.find(s => s.id === 'd_asha_15_mutant');
            const scale3 = SCALES.find(s => s.id === 'eb_muju_10');
            if (scale1) topScales.push(scale1);
            // 2위는 추천 알고리즘에서 채움
            for (const scale of recommendedScales) {
                if (topScales.length >= 2) break;
                if (!topScales.find(s => s.id === scale.id) && scale.id !== 'eb_muju_10') {
                    topScales.push(scale);
                }
            }
            // 3위는 Eb MUJU 10
            if (scale3) topScales.push(scale3);
        } else if (selectedVibe.id === 'exotic') {
            // 개성강한분위기: 1위 E Equinox 10, 2위 E Romanian Hijaz 10, 3위 E La Sirena 10
            const scale1 = SCALES.find(s => s.id === 'e_equinox_10');
            const scale2 = SCALES.find(s => s.id === 'e_romanian_hijaz_10');
            const scale3 = SCALES.find(s => s.id === 'e_la_sirena_10');
            if (scale1) topScales.push(scale1);
            if (scale2) topScales.push(scale2);
            if (scale3) topScales.push(scale3);
        } else {
            // 기본: 추천 알고리즘 사용
            for (const scale of recommendedScales) {
                if (topScales.length >= 3) break;
                topScales.push(scale);
            }
        }
        return topScales;
    }, [recommendedScales, selectedVibe.id]);

    // Initialize displayScales with top 3 results
    useEffect(() => {
        // initialScaleId가 있으면 우선 처리 (URL 파라미터로 지정된 경우)
        if (initialScaleId && topRankedScales.length === 0) {
            const targetScale = SCALES.find(s => s.id === initialScaleId);
            if (targetScale) {
                setDisplayScales([targetScale]);
                setCurrentIndex(0);
                return;
            }
        }

        if (topRankedScales.length > 0) {
            let finalScales = topRankedScales;
            let finalIndex = 0;

            // initialScaleId가 있으면 해당 스케일을 찾아서 선택
            if (initialScaleId) {
                const scaleIndex = topRankedScales.findIndex(s => s.id === initialScaleId);
                if (scaleIndex !== -1) {
                    // topRankedScales에 이미 있으면 해당 인덱스 사용
                    finalIndex = scaleIndex;
                } else {
                    // topRankedScales에 없으면 전체 SCALES에서 찾아서 추가
                    // URL 파라미터로 지정된 경우 카테고리 체크 무시하고 무조건 표시
                    const targetScale = SCALES.find(s => s.id === initialScaleId);
                    if (targetScale) {
                        // 해당 스케일을 첫 번째로 추가 (카테고리 체크 없이)
                        finalScales = [targetScale, ...topRankedScales.filter(s => s.id !== targetScale.id)];
                        finalIndex = 0;
                    }
                }
            }

            setDisplayScales(finalScales);
            setCurrentIndex(finalIndex);

            // 데이터 로드 및 렌더링 후 높이 재전송 (초기 로딩 시 높이 문제 해결)
            if (typeof window !== 'undefined' && window.self !== window.top) {
                setTimeout(() => {
                    const height = document.documentElement.offsetHeight;
                    window.parent.postMessage({ type: 'setHeight', height }, '*');
                }, 100);
            }
        }
    }, [topRankedScales, initialScaleId, selectedVibe.id]);

    // 딩의 피치 추출 함수 (예: "C3" -> "C", "C#3" -> "C#", "Db3" -> "Db")
    const getPitchFromNote = (note: string): string => {
        if (!note) return '';
        const match = note.match(/^([A-G][#b]?)/);
        return match ? match[1] : note.charAt(0);
    };

    // 모든 가능한 피치 추출 (딩 노트 기준)
    const allPitches = useMemo(() => {
        const pitches = new Set<string>();
        SCALES.forEach(scale => {
            const pitch = getPitchFromNote(scale.notes.ding);
            if (pitch) pitches.add(pitch);
        });
        // CDEFGAB 순서로 정렬 (Db 제외)
        const order = ['C', 'C#', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
        return Array.from(pitches)
            .filter(pitch => pitch !== 'Db') // Db 제거
            .sort((a, b) => {
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
    }, []);

    // 스케일 이름에서 노트 개수 추출 (예: "D Kurd 9" -> 9)
    const getNoteCount = (name: string): number | null => {
        const match = name.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
    };

    // 모든 가능한 노트 개수 추출
    const allNoteCounts = useMemo(() => {
        const counts = new Set<number>();
        SCALES.forEach(scale => {
            const count = getNoteCount(scale.name);
            if (count) counts.add(count);
        });
        return Array.from(counts).sort((a, b) => a - b);
    }, []);

    // 피치 토글 함수
    const togglePitch = (pitch: string) => {
        const newSelected = new Set(selectedPitches);
        if (newSelected.has(pitch)) {
            newSelected.delete(pitch);
        } else {
            newSelected.add(pitch);
        }
        setSelectedPitches(newSelected);
    };

    const handlePitchToggle = (e: React.MouseEvent<HTMLButtonElement>, pitch: string) => {
        e.preventDefault();
        e.stopPropagation();
        togglePitch(pitch);
    };

    // 필터링된 스케일 개수 계산
    const filteredScaleCount = useMemo(() => {
        return SCALES.filter(s => {
            // Filter by category
            if (selectedCategory && !matchesCategory(s, selectedCategory)) {
                return false;
            }

            // Filter by note count
            if (selectedNoteCount) {
                const count = getNoteCount(s.name);
                if (count !== selectedNoteCount) return false;
            }

            // Filter by type
            if (selectedType) {
                const isMutant = s.id.includes('mutant');
                if (selectedType === 'mutant' && !isMutant) return false;
                if (selectedType === 'normal' && isMutant) return false;
            }

            // Filter by selected pitches if any (딩 노트 기준)
            if (selectedPitches.size > 0) {
                const pitch = getPitchFromNote(s.notes.ding);
                if (pitch === 'Db') {
                    return selectedPitches.has('C#');
                }
                return selectedPitches.has(pitch);
            }

            // Filter by mood (조성)
            if (selectedMood) {
                if (selectedMood === 'minor' && s.vector.minorMajor >= 0) return false;
                if (selectedMood === 'major' && s.vector.minorMajor < 0) return false;
            }

            // Filter by tone (음향질감)
            if (selectedTone) {
                if (selectedTone === 'pure' && s.vector.pureSpicy >= 0.5) return false;
                if (selectedTone === 'spicy' && s.vector.pureSpicy < 0.5) return false;
            }

            // Filter by popularity (대중성)
            if (selectedPopularity) {
                if (selectedPopularity === 'rare' && s.vector.rarePopular >= 0.5) return false;
                if (selectedPopularity === 'popular' && s.vector.rarePopular < 0.5) return false;
            }

            return true;
        }).length;
    }, [selectedCategory, selectedNoteCount, selectedType, selectedPitches, selectedMood, selectedTone, selectedPopularity, matchesCategory, getNoteCount, getPitchFromNote]);

    const totalScaleCount = SCALES.length;
    const hasActiveFilters = selectedCategory || selectedNoteCount || selectedType || selectedPitches.size > 0 || selectedMood || selectedTone || selectedPopularity;

    const translateTag = (tag: string) => {
        // If language is English, return the tag itself if it's already English (or map if needed)
        // But since we want to show English tags when lang is en, and Korean when lang is ko.
        // The tags in data are mixed.
        // Let's rely on the t.tags mapping for common tags.

        const lowerTag = tag.toLowerCase();
        // Try to find a matching key in t.tags
        const key = Object.keys(t.tags).find(k => k.toLowerCase() === lowerTag || t.tags[k as keyof typeof t.tags].toLowerCase() === lowerTag);

        if (key) {
            return t.tags[key as keyof typeof t.tags];
        }

        return tag;
    };

    const getEmbedUrl = (url?: string) => {
        if (!url) return null;
        // Simple parser for YouTube URLs
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    const nextSlide = () => {
        if (currentIndex < displayScales.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    if (displayScales.length === 0) return null;

    // currentScale을 직접 계산하여 항상 최신 값 보장
    const currentScale = displayScales[currentIndex] || null;

    if (!currentScale || currentIndex < 0 || currentIndex >= displayScales.length) return null;

    return (
        <div className="w-full max-w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="hidden flex items-center text-sm font-medium text-slate-600/50 dark:text-slate-400/50 hover:text-indigo-700 dark:hover:text-cosmic transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-white/5"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    {t.scaleList.back}
                </button>

                {/* 카테고리 버튼 */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                    {CATEGORIES.map(category => {
                        const isActive = getCategoryIdFromVibeId(selectedVibe.id) === category.id;
                        const vibe = getVibeFromCategoryId(category.id);

                        return (
                            <button
                                key={category.id}
                                onClick={() => vibe && onChangeVibe(vibe)}
                                className={`whitespace-nowrap px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base font-bold rounded-lg transition-all shadow-sm ${isActive
                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border-2 border-indigo-300 dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.3)]'
                                    : 'text-slate-600/50 dark:text-slate-400/50 bg-white dark:bg-glass-light border-2 border-slate-200 dark:border-glass-border hover:bg-indigo-50 dark:hover:bg-white/5 hover:border-indigo-300 dark:hover:border-cosmic/10 hover:text-indigo-700 dark:hover:text-cosmic'
                                    }`}
                            >
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>



            {/* Main Carousel Section */}
            <div className="relative">
                {/* Navigation Buttons */}
                {displayScales.length > 1 && (
                    <>
                        {currentIndex > 0 && (
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 p-2 glass-card rounded-full text-slate-500 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-cosmic transition-colors hidden md:block shadow-sm"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {currentIndex < displayScales.length - 1 && (
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 p-2 glass-card rounded-full text-slate-500 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-cosmic transition-colors hidden md:block shadow-sm"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </>
                )}

                <div className="overflow-hidden">
                    {/* AnimatePresence 제거 - 카드 구조 고정 */}
                    <div className="glass-card rounded-2xl p-4 mb-4 relative overflow-hidden transition-opacity duration-150">
                        {/* 변경: motion.div → div, 부드러운 CSS transition만 추가 */}
                        {/* Glow Effect Background (Dark Mode Only) */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none opacity-0 dark:opacity-100 transition-opacity" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center relative z-10">
                            {/* Video Section */}
                            <div className="w-full aspect-video bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shadow-inner relative group border border-slate-200 dark:border-slate-700">
                                <VideoPlayer key={currentScale.id} url={currentScale.videoUrl || ""} title={currentScale.name} />
                            </div>

                            {/* Info Section */}
                            <div className="flex flex-col justify-center self-center">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        {(() => {
                                            // topRankedScales에서 현재 스케일의 순위 찾기
                                            const rankIndex = topRankedScales.findIndex(s => s.id === currentScale.id);
                                            const rank = rankIndex + 1;

                                            // topRankedScales에 포함되어 있고 1~3위인 경우에만 라벨 표시
                                            if (rankIndex >= 0 && rank <= 3) {
                                                return (
                                                    <>
                                                        <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-cosmic/20 text-indigo-700/80 dark:text-cosmic/80 border border-indigo-200 dark:border-cosmic/30 text-sm font-bold shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.3)]">
                                                            {language === 'ko' ? `${rank}${t.scaleList.rankRecommendation}` : getOrdinalSuffix(rank)}
                                                        </span>
                                                        {currentScale.vector.rarePopular > 0.7 && (
                                                            <span className="flex items-center text-amber-600/80 dark:text-stardust/80 text-xs font-medium drop-shadow-sm">
                                                                <Star className="w-3 h-3 fill-current mr-1 animate-pulse-slow" /> {t.scaleList.popularScale}
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    {/* Mobile Navigation Indicators */}
                                    {displayScales.length > 1 && (
                                        <div className="flex space-x-1 md:hidden">
                                            {displayScales.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center mb-2 gap-3 flex-wrap">
                                    <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm whitespace-nowrap md:whitespace-normal truncate md:truncate-none">
                                        {currentScale.name}
                                    </h1>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-medium self-center flex-shrink-0">
                                        {currentScale.id.includes('mutant') ? t.scaleList.mutant : t.scaleList.normal}
                                    </span>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {/* Official Mall Button */}
                                        {(() => {
                                            // currentScale의 ownUrl을 직접 참조하여 항상 최신 값 사용
                                            const purchaseUrl = displayScales[currentIndex]?.ownUrl;
                                            const scaleId = displayScales[currentIndex]?.id;
                                            const scaleName = displayScales[currentIndex]?.name;

                                            return purchaseUrl ? (
                                                <a
                                                    key={`purchase-${scaleId}-${currentIndex}`}
                                                    href={purchaseUrl}
                                                    className="px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-1.5 bg-indigo-600 dark:bg-cosmic/50 hover:bg-indigo-700 dark:hover:bg-[#48FF00]/60 text-white hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                                                    title={`${language === 'en' ? (currentScale.nameEn || currentScale.name) : currentScale.name} - ${t.scaleList.purchase}`}
                                                >
                                                    <span>{t.scaleList.purchase}</span>
                                                </a>
                                            ) : (
                                                <button
                                                    key={`purchase-disabled-${scaleId}-${currentIndex}`}
                                                    disabled
                                                    className="px-4 py-2 rounded-lg text-sm font-medium shadow-md bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50 text-slate-500 whitespace-nowrap"
                                                >
                                                    {t.scaleList.preparing}
                                                </button>
                                            );
                                        })()}
                                        {/* Share Button */}
                                        <button
                                            onClick={handleShare}
                                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700"
                                            title={t.scaleList.share}
                                        >
                                            {isCopied ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <Share2 className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-800 dark:text-slate-300 font-medium shadow-inner">
                                        {/* Ding */}
                                        <div className="flex items-center mb-1">
                                            <span className="w-24 text-xs text-slate-600 font-bold uppercase flex items-center gap-1">
                                                {t.scaleList.ding}
                                                <span className="text-slate-500 dark:text-slate-600 font-normal">(1)</span>
                                            </span>
                                            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-md font-bold shadow-sm">
                                                {currentScale.notes.ding}
                                            </span>
                                        </div>

                                        {/* Top Notes */}
                                        <div className="flex items-start mb-1">
                                            <span className="w-24 text-xs text-slate-600 font-bold uppercase mt-1.5 flex items-center gap-1">
                                                {t.scaleList.top}
                                                <span className="text-slate-500 dark:text-slate-600 font-normal">({currentScale.notes.top.length})</span>
                                            </span>
                                            <div className="flex flex-wrap gap-1.5 flex-1">
                                                {currentScale.notes.top.map((note, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-800 dark:text-slate-300 shadow-sm font-semibold">
                                                        {note}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bottom Notes */}
                                        {currentScale.notes.bottom.length > 0 && (
                                            <div className="flex items-start">
                                                <span className="w-24 text-xs text-slate-600 font-bold uppercase mt-1.5 flex items-center gap-1">
                                                    {t.scaleList.bottom}
                                                    <span className="text-slate-500 dark:text-slate-600 font-normal">({currentScale.notes.bottom.length})</span>
                                                </span>
                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                    {currentScale.notes.bottom.map((note, i) => (
                                                        <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-white/5 shadow-sm font-medium">
                                                            {note}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg break-keep">
                                        {language === 'en' ? (currentScale.descriptionEn || currentScale.description) : currentScale.description}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    {displayScales.length > 1 && currentIndex > 0 && (
                                        <button
                                            onClick={prevSlide}
                                            className="flex-1 md:hidden py-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            {t.scaleList.prev}
                                        </button>
                                    )}

                                    {displayScales.length > 1 && currentIndex < displayScales.length - 1 && (
                                        <button
                                            onClick={nextSlide}
                                            className="flex-1 md:hidden py-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            {t.scaleList.next}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 변경: motion.div, AnimatePresence 닫기 태그 제거 */}
                </div>
            </div>

            {/* 스케일 분류기준 및 전체 스케일 토글 버튼 */}
            <div className="flex flex-wrap items-center justify-end gap-4 mb-4">
                {/* 우측: 기능 버튼 */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowClassificationCriteria(!showClassificationCriteria)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600/50 dark:text-slate-300/50 bg-glass-light border border-glass-border rounded-lg hover:bg-indigo-50 dark:hover:bg-white/5 hover:border-indigo-300 dark:hover:border-cosmic/10 hover:text-indigo-700 dark:hover:text-cosmic transition-all backdrop-blur-sm shadow-sm"
                    >
                        <span>{t.scaleList.scaleClassification}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${showClassificationCriteria ? 'rotate-90' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowAllScales(!showAllScales)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600/50 dark:text-slate-300/50 bg-glass-light border border-glass-border rounded-lg hover:bg-indigo-50 dark:hover:bg-white/5 hover:border-indigo-300 dark:hover:border-cosmic/10 hover:text-indigo-700 dark:hover:text-cosmic transition-all backdrop-blur-sm shadow-sm"
                    >
                        <span>{t.scaleList.allScales}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${showAllScales ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </div>

            {/* 스케일 분류기준 섹션 */}
            {showClassificationCriteria && (
                <div className="mb-4 p-6 glass-card border border-glass-border rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(Object.keys(VECTOR_AXES) as Array<keyof typeof VECTOR_AXES>).map((key) => {
                            // Explicitly type axis to avoid 'never' inference
                            const axis = VECTOR_AXES[key] as {
                                id: string;
                                label: string;
                                labelEn?: string;
                                description: string;
                                descriptionEn?: string;
                                minLabel: string;
                                minLabelEn?: string;
                                maxLabel: string;
                                maxLabelEn?: string;
                            };
                            const value = currentScale.vector[key];
                            const percentage = key === 'minorMajor'
                                ? ((value + 1) / 2) * 100
                                : value * 100;

                            const label = language === 'en' ? axis.labelEn || axis.label : axis.label;
                            const description = language === 'en' ? axis.descriptionEn || axis.description : axis.description;
                            const minLabel = language === 'en' ? axis.minLabelEn || axis.minLabel : axis.minLabel;
                            const maxLabel = language === 'en' ? axis.maxLabelEn || axis.maxLabel : axis.maxLabel;

                            return (
                                <div key={axis.id} className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{label}</h4>
                                        <span className="text-xs font-mono text-indigo-700 dark:text-cosmic bg-indigo-50 dark:bg-cosmic/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-cosmic/20">
                                            {value.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-h-[40px]">
                                        {description}
                                    </p>
                                    <div className="relative h-6 flex items-center">
                                        <div className="absolute left-0 right-0 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400 dark:bg-white/20"></div>
                                        </div>
                                        <div
                                            className="absolute w-4 h-4 bg-indigo-600 dark:bg-cosmic border-2 border-white rounded-full shadow-md dark:shadow-[0_0_10px_rgba(72,255,0,0.5)] transition-all duration-500 z-10"
                                            style={{ left: `calc(${percentage}% - 8px)` }}
                                            title={`${label}: ${value}`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>{minLabel}</span>
                                        <span>{maxLabel}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* List Section */}
            {showAllScales && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                {t.scaleList.allScales}
                            </h3>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                {hasActiveFilters ? `${filteredScaleCount} / ${totalScaleCount}` : totalScaleCount}
                            </span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowFilter(!showFilter);
                            }}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-bold border rounded-lg transition-all shadow-sm ${showFilter
                                ? 'bg-indigo-100 dark:bg-cosmic/20 border-indigo-300 dark:border-cosmic/30 text-indigo-800 dark:text-cosmic'
                                : 'bg-white dark:bg-glass-light border-slate-200 dark:border-glass-border text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-white/5 hover:border-indigo-300 dark:hover:border-cosmic/10 hover:text-indigo-700 dark:hover:text-cosmic'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>{t.scaleList.filter}</span>
                        </button>
                    </div>

                    {/* Filter UI */}
                    {showFilter && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card border border-glass-border rounded-xl p-4 mb-4"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                {/* 카테고리 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.selectCategory}</h4>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {CATEGORIES.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedCategory(selectedCategory === category.id ? null : category.id);
                                                }}
                                                className={`w-fit px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === category.id
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 타입 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.selectType}</h4>
                                    <div className="flex flex-col gap-1.5">
                                        {['normal', 'mutant'].map(type => (
                                            <button
                                                key={type}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedType(selectedType === type ? null : type as 'normal' | 'mutant');
                                                }}
                                                className={`w-fit px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedType === type
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {type === 'normal' ? t.scaleList.normal : t.scaleList.mutant}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 노트 개수 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.noteCount}</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {allNoteCounts.map(count => (
                                            <button
                                                key={count}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedNoteCount(selectedNoteCount === count ? null : count);
                                                }}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${selectedNoteCount === count
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 딩 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.selectDing}</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {allPitches.map(pitch => (
                                            <button
                                                key={pitch}
                                                onClick={(e) => handlePitchToggle(e, pitch)}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${selectedPitches.has(pitch)
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {pitch}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 조성 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.mood}</h4>
                                    <div className="flex flex-col gap-1.5">
                                        {[
                                            { id: 'minor', label: t.scaleList.minor },
                                            { id: 'major', label: t.scaleList.major }
                                        ].map(mood => (
                                            <button
                                                key={mood.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedMood(selectedMood === mood.id ? null : mood.id as 'minor' | 'major');
                                                }}
                                                className={`w-fit px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedMood === mood.id
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {mood.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 음향질감 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.tone}</h4>
                                    <div className="flex flex-col gap-1.5">
                                        {[
                                            { id: 'pure', label: t.scaleList.pure },
                                            { id: 'spicy', label: t.scaleList.spicy }
                                        ].map(tone => (
                                            <button
                                                key={tone.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedTone(selectedTone === tone.id ? null : tone.id as 'pure' | 'spicy');
                                                }}
                                                className={`w-fit px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedTone === tone.id
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {tone.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 대중성 선택 */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">{t.scaleList.popularity}</h4>
                                    <div className="flex flex-col gap-1.5">
                                        {[
                                            { id: 'rare', label: t.scaleList.rare },
                                            { id: 'popular', label: t.scaleList.popular }
                                        ].map(pop => (
                                            <button
                                                key={pop.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedPopularity(selectedPopularity === pop.id ? null : pop.id as 'rare' | 'popular');
                                                }}
                                                className={`w-fit px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedPopularity === pop.id
                                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {pop.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <ScaleGrid
                        scales={SCALES}
                        selectedCategory={selectedCategory}
                        selectedNoteCount={selectedNoteCount}
                        selectedType={selectedType}
                        selectedPitches={selectedPitches}
                        selectedMood={selectedMood}
                        selectedTone={selectedTone}
                        selectedPopularity={selectedPopularity}
                        currentScaleName={currentScale.name}
                        matchesCategory={matchesCategory}
                        getNoteCount={getNoteCount}
                        getPitchFromNote={getPitchFromNote}
                        onScaleSelect={(scale) => {
                            setDisplayScales([scale]);
                            setCurrentIndex(0);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        language={language}
                    />
                </div>
            )}
        </div>
    );
}

// Memoized Scale Grid Component to prevent unnecessary re-renders
const ScaleGrid = React.memo(({
    scales,
    selectedCategory,
    selectedNoteCount,
    selectedType,
    selectedPitches,
    selectedMood,
    selectedTone,
    selectedPopularity,
    currentScaleName,
    matchesCategory,
    getNoteCount,
    getPitchFromNote,
    onScaleSelect,
    language
}: {
    scales: Scale[];
    selectedCategory: string | null;
    selectedNoteCount: number | null;
    selectedType: 'normal' | 'mutant' | null;
    selectedPitches: Set<string>;
    selectedMood: 'minor' | 'major' | null;
    selectedTone: 'pure' | 'spicy' | null;
    selectedPopularity: 'rare' | 'popular' | null;
    currentScaleName: string;
    matchesCategory: (scale: Scale, categoryId: string) => boolean;
    getNoteCount: (name: string) => number | null;
    getPitchFromNote: (note: string) => string;
    onScaleSelect: (scale: Scale) => void;
    language: Language;
}) => {
    const t = TRANSLATIONS[language];
    const filteredScales = useMemo(() => {
        return [...scales]
            .filter(s => {
                // Filter by category
                if (selectedCategory && !matchesCategory(s, selectedCategory)) {
                    return false;
                }

                // Filter by note count
                if (selectedNoteCount) {
                    const count = getNoteCount(s.name);
                    if (count !== selectedNoteCount) return false;
                }

                // Filter by type
                if (selectedType) {
                    const isMutant = s.id.includes('mutant');
                    if (selectedType === 'mutant' && !isMutant) return false;
                    if (selectedType === 'normal' && isMutant) return false;
                }

                // Filter by selected pitches if any (딩 노트 기준)
                if (selectedPitches.size > 0) {
                    const pitch = getPitchFromNote(s.notes.ding);
                    // Db는 C#과 동일하게 처리 (Db 필터가 없으므로 C# 선택 시 Db도 표시)
                    if (pitch === 'Db') {
                        return selectedPitches.has('C#');
                    }
                    return selectedPitches.has(pitch);
                }

                // Filter by mood (조성)
                if (selectedMood) {
                    if (selectedMood === 'minor' && s.vector.minorMajor >= 0) return false;
                    if (selectedMood === 'major' && s.vector.minorMajor < 0) return false;
                }

                // Filter by tone (음향질감)
                if (selectedTone) {
                    if (selectedTone === 'pure' && s.vector.pureSpicy >= 0.5) return false;
                    if (selectedTone === 'spicy' && s.vector.pureSpicy < 0.5) return false;
                }

                // Filter by popularity (대중성)
                if (selectedPopularity) {
                    if (selectedPopularity === 'rare' && s.vector.rarePopular >= 0.5) return false;
                    if (selectedPopularity === 'popular' && s.vector.rarePopular < 0.5) return false;
                }

                return true;
            })
            .sort((a, b) => {
                // 딩 노트의 알파벳 순서로 정렬 - CDEFGAB 순서
                const pitchA = getPitchFromNote(a.notes.ding);
                const pitchB = getPitchFromNote(b.notes.ding);
                // 피치에서 첫 글자만 추출 (예: "C" -> "C", "C#" -> "C", "Bb" -> "B")
                const letterA = pitchA.charAt(0).toUpperCase();
                const letterB = pitchB.charAt(0).toUpperCase();

                // CDEFGAB 순서 정의
                const order = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
                const indexA = order.indexOf(letterA);
                const indexB = order.indexOf(letterB);

                // 순서에 없는 경우(예: 잘못된 노트)는 뒤로
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;

                return indexA - indexB;
            });
    }, [scales, selectedCategory, selectedNoteCount, selectedType, selectedPitches, matchesCategory, getNoteCount, getPitchFromNote]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredScales.map((scale) => (
                <button
                    key={scale.name}
                    onClick={() => onScaleSelect(scale)}
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all group text-left ${currentScaleName === scale.name
                        ? 'bg-indigo-50 dark:bg-cosmic/10 border-indigo-200 dark:border-cosmic/30 ring-1 ring-indigo-200 dark:ring-cosmic/20'
                        : 'bg-glass-light border-glass-border hover:border-indigo-300 dark:hover:border-cosmic/10 hover:bg-indigo-50 dark:hover:bg-white/5'
                        }`}
                >
                    <span className={`font-semibold transition-colors ${currentScaleName === scale.name ? 'text-indigo-700 dark:text-cosmic' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-cosmic'
                        }`}>
                        {language === 'en' ? (scale.nameEn || scale.name) : scale.name}
                    </span>
                    <span className={`text-xs ${currentScaleName === scale.name ? 'text-indigo-600 dark:text-cosmic/70' : 'text-slate-500 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-cosmic/70'
                        }`}>
                        {currentScaleName === scale.name ? t.scaleList.viewing : t.scaleList.select}
                    </span>
                </button>
            ))}
        </div>
    );
});

