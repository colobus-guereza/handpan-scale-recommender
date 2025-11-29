import React, { useMemo, useState, useEffect } from 'react';
import { SCALES, Scale, VECTOR_AXES } from '../data/handpanScales';
import { Vibe, VIBES } from './VibeSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Play, ExternalLink, Music2, Filter, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
    selectedVibe: Vibe;
    onBack: () => void;
    onChangeVibe: (vibe: Vibe) => void;
}

export default function ScaleList({ selectedVibe, onBack, onChangeVibe }: Props) {
    const [displayScales, setDisplayScales] = useState<Scale[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedPitches, setSelectedPitches] = useState<Set<string>>(new Set());
    const [showAllScales, setShowAllScales] = useState(false);
    const [showClassificationCriteria, setShowClassificationCriteria] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedNoteCount, setSelectedNoteCount] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<'normal' | 'mutant' | null>(null);

    const CATEGORIES = [
        { id: 'beginner', label: '입문용', tags: ['대중적', '입문추천', '국내인기', 'Bestseller', '기본', '표준', '표준확장'] },
        { id: 'healing', label: '요가명상힐링', tags: ['명상', '힐링', '치유', '차분한', '평화', 'Deep', '피그미', '트랜스', '몽환적', '깊음', '깊은울림'] },
        { id: 'bright', label: '밝은 분위기', tags: ['메이저', '밝음', '상쾌함', '희망적', '행복한', '윤슬', '사파이어', '청량함', '에너지'] },
        { id: 'ethnic', label: '딥 에스닉', tags: ['이국적', '집시', '아라비안', '중동풍', '독특함', '인도풍', '동양적', '하이브리드', '도리안', '블루스', '신비', '매니아', '라사발리', '딥아시아', '신비로움'] }
    ];

    const matchesCategory = (scale: Scale, categoryId: string) => {
        const category = CATEGORIES.find(c => c.id === categoryId);
        if (!category) return true;
        return scale.tags.some(tag => category.tags.includes(tag));
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
            const scale1 = SCALES.find(s => s.id === 'fs_low_pygmy_14');
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
        if (topRankedScales.length > 0) {
            setDisplayScales(topRankedScales);
            setCurrentIndex(0);
        }
    }, [topRankedScales]);

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

    const translateTag = (tag: string) => {
        switch (tag) {
            case 'Minor': return '마이너';
            case 'Major': return '메이저';
            case 'Harmonic': return '하모닉';
            case 'Melodic': return '멜로딕';
            case 'Pentatonic': return '펜타토닉';
            case 'Exotic': return '이국적';
            case 'Meditative': return '명상적';
            case 'Bright': return '밝은';
            case 'Dark': return '어두운';
            case 'Mysterious': return '신비로운';
            case 'Happy': return '행복한';
            case 'Sad': return '슬픈';
            case 'Uplifting': return '고양되는';
            case 'Calm': return '차분한';
            case 'Energetic': return '에너지 넘치는';
            default: return tag;
        }
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

    const currentScale = displayScales[currentIndex];

    return (
        <div className="w-full max-w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    다시 선택
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
                {VIBES.filter(v => v.id !== selectedVibe.id).map(vibe => (
                    <button
                        key={vibe.id}
                        onClick={() => onChangeVibe(vibe)}
                        className="w-32 py-3 px-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm font-medium text-slate-600 text-left"
                    >
                        {vibe.title}
                    </button>
                ))}
            </div>

            {/* Main Carousel Section */}
            <div className="relative">
                {/* Navigation Buttons */}
                {displayScales.length > 1 && (
                    <>
                        {currentIndex > 0 && (
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all hidden md:block"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {currentIndex < displayScales.length - 1 && (
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all hidden md:block"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </>
                )}

                <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScale.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg mb-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                                {/* Video Section */}
                                <div className="w-full aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-inner relative group">
                                    {currentScale.videoUrl ? (
                                        <iframe
                                            src={getEmbedUrl(currentScale.videoUrl) || ""}
                                            title={currentScale.name}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                            <Play className="w-12 h-12 mb-2 opacity-50" />
                                            <span className="text-sm">영상 준비중</span>
                                        </div>
                                    )}
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
                                                            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-bold shadow-sm">
                                                                {rank}위 추천
                                                            </span>
                                                            {rank === 1 && (
                                                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
                                                                    Best Match
                                                                </span>
                                                            )}
                                                            {currentScale.vector.rarePopular > 0.7 && (
                                                                <span className="flex items-center text-amber-500 text-xs font-medium">
                                                                    <Star className="w-3 h-3 fill-current mr-1" /> 인기 스케일
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
                                        <a
                                            href={currentScale.productUrl || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all ${currentScale.productUrl
                                                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
                                                : 'bg-slate-300 cursor-not-allowed'
                                                }`}
                                            title={currentScale.productUrl ? '구매하기' : '준비중'}
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>

                                    <div className="flex items-center mb-2 gap-3">
                                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                            {currentScale.name}
                                        </h1>
                                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium self-center">
                                            {currentScale.id.includes('mutant') ? '뮤턴트' : '일반'}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-sm text-slate-700 font-medium">
                                            {/* Ding */}
                                            <div className="flex items-center mb-1">
                                                <span className="w-16 text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
                                                    Ding
                                                    <span className="text-slate-300 font-normal">(1)</span>
                                                </span>
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-bold">
                                                    {currentScale.notes.ding}
                                                </span>
                                            </div>

                                            {/* Top Notes */}
                                            <div className="flex items-start mb-1">
                                                <span className="w-16 text-xs text-slate-400 font-bold uppercase mt-1.5 flex items-center gap-1">
                                                    Top
                                                    <span className="text-slate-300 font-normal">({currentScale.notes.top.length})</span>
                                                </span>
                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                    {currentScale.notes.top.map((note, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">
                                                            {note}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Bottom Notes */}
                                            {currentScale.notes.bottom.length > 0 && (
                                                <div className="flex items-start">
                                                    <span className="w-16 text-xs text-slate-400 font-bold uppercase mt-1.5 flex items-center gap-1">
                                                        Bottom
                                                        <span className="text-slate-300 font-normal">({currentScale.notes.bottom.length})</span>
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5 flex-1">
                                                        {currentScale.notes.bottom.map((note, i) => (
                                                            <span key={i} className="px-2 py-1 bg-slate-200 text-slate-600 rounded-md">
                                                                {note}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {currentScale.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                                                #{translateTag(tag)}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        {displayScales.length > 1 && currentIndex > 0 && (
                                            <button
                                                onClick={prevSlide}
                                                className="flex-1 md:hidden py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                            >
                                                이전
                                            </button>
                                        )}

                                        {displayScales.length > 1 && currentIndex < displayScales.length - 1 && (
                                            <button
                                                onClick={nextSlide}
                                                className="flex-1 md:hidden py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                            >
                                                다음
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 스케일 분류기준 및 전체 스케일 토글 버튼 */}
            <div className="flex justify-end gap-3 mb-4">
                <button
                    onClick={() => setShowClassificationCriteria(!showClassificationCriteria)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                    <span>스케일 분류기준 {showClassificationCriteria ? '접기' : ''}</span>
                    {showClassificationCriteria ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
                <button
                    onClick={() => setShowAllScales(!showAllScales)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                    <span>전체 스케일 {showAllScales ? '접기' : ''}</span>
                    {showAllScales ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* 스케일 분류기준 섹션 */}
            {showClassificationCriteria && (
                <div className="mb-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.values(VECTOR_AXES).map((axis) => {
                            const value = currentScale.vector[axis.id as keyof typeof currentScale.vector];
                            const percentage = axis.id === 'minorMajor'
                                ? ((value + 1) / 2) * 100
                                : value * 100;

                            return (
                                <div key={axis.id} className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-slate-700">{axis.label}</h4>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {value.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed min-h-[40px]">
                                        {axis.description}
                                    </p>
                                    <div className="relative h-6 flex items-center">
                                        <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300"></div>
                                        </div>
                                        <div
                                            className="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-md transition-all duration-500 z-10"
                                            style={{ left: `calc(${percentage}% - 8px)` }}
                                            title={`${axis.label}: ${value}`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>{axis.minLabel}</span>
                                        <span>{axis.maxLabel}</span>
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
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            전체 스케일
                        </h3>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowFilter(!showFilter);
                            }}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-all ${showFilter
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>필터</span>
                        </button>
                    </div>

                    {/* Filter UI */}
                    {showFilter && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white border border-slate-200 rounded-xl p-4 mb-4"
                        >
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">카테고리 선택</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedCategory(selectedCategory === category.id ? null : category.id);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>



                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">노트 개수 (Note Count) 선택</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {allNoteCounts.map(count => (
                                    <button
                                        key={count}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedNoteCount(selectedNoteCount === count ? null : count);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedNoteCount === count
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>

                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">타입 (Type) 선택</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['normal', 'mutant'].map(type => (
                                    <button
                                        key={type}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedType(selectedType === type ? null : type as 'normal' | 'mutant');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedType === type
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {type === 'normal' ? '일반 (Normal)' : '뮤턴트 (Mutant)'}
                                    </button>
                                ))}
                            </div>

                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">딩 (Ding) 선택</h4>
                            <div className="flex flex-wrap gap-2">
                                {allPitches.map(pitch => (
                                    <button
                                        key={pitch}
                                        onClick={(e) => handlePitchToggle(e, pitch)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedPitches.has(pitch)
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {pitch}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[...SCALES]
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
                            })
                            .map((scale) => (
                                <button
                                    key={scale.name}
                                    onClick={() => {
                                        setDisplayScales([scale]);
                                        setCurrentIndex(0);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`flex items-center justify-between p-4 border rounded-xl transition-all group text-left ${currentScale.name === scale.name
                                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                        : 'bg-white border-slate-200 hover:border-indigo-500/50 hover:shadow-md'
                                        }`}
                                >
                                    <span className={`font-semibold transition-colors ${currentScale.name === scale.name ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-700'
                                        }`}>
                                        {scale.name}
                                    </span>
                                    <span className={`text-xs ${currentScale.name === scale.name ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-400'
                                        }`}>
                                        {currentScale.name === scale.name ? '보고있음' : '선택'}
                                    </span>
                                </button>
                            ))}
                    </div>
                </div>
            )
            }
        </div >
    );
}
