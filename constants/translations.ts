export type Language = 'ko' | 'en' | 'fr' | 'de' | 'ja' | 'zh' | 'tr' | 'ar' | 'hi' | 'pt' | 'es';

export const SUPPORTED_LANGUAGES = [
    { code: 'ko', name: '한국어', flag: 'kr' },
    { code: 'en', name: 'English', flag: 'us' },
    { code: 'fr', name: 'Français', flag: 'fr' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'ja', name: '日本語', flag: 'jp' },
    { code: 'zh', name: '中文', flag: 'cn' },
    { code: 'tr', name: 'Türkçe', flag: 'tr' },
    { code: 'ar', name: 'العربية', flag: 'sa' },
    { code: 'hi', name: 'हिन्दी', flag: 'in' },
    { code: 'pt', name: 'Português', flag: 'pt' },
    { code: 'es', name: 'Español', flag: 'es' }
] as const;

const EN_TRANSLATIONS = {
    title: 'Find Your Perfect Handpan',
    vibeSelector: {
        jamming: 'Beginner',
        meditation: 'Yoga·Meditation·Healing',
        uplift: 'Bright Atmosphere',
        exotic: 'Deep Ethnic'
    },
    scaleList: {
        back: 'Select Again',
        scaleClassification: 'Classification',
        allScales: 'All Scales',
        purchase: 'Buy',
        preparing: 'Coming Soon',
        share: 'Share',
        copied: 'Copied',
        rankRecommendation: 'Recommendation',
        popularScale: 'Popular',
        ding: 'Ding',
        top: 'Top',
        bottom: 'Bottom',
        prev: 'Prev',
        next: 'Next',
        mutant: 'Mutant',
        normal: 'Normal',
        viewing: 'Viewing',
        select: 'Select',
        filter: 'Filter',
        selectCategory: 'Select Category',
        selectType: 'Select Type',
        noteCount: 'Note Count',
        selectDing: 'Select Ding',
        mood: 'Mood',
        tone: 'Tone',
        popularity: 'Popularity',
        minor: 'Minor',
        major: 'Major',
        pure: 'Pure',
        spicy: 'Spicy',
        rare: 'Rare',
        popular: 'Popular',
        digiPan: 'DigiPan',
        implementationPending: 'Implementation Pending',
        axes: {
            minorMajor: {
                label: 'Mood',
                description: 'Represents the overall emotional atmosphere of the scale.',
                minLabel: 'Minor',
                maxLabel: 'Major'
            },
            pureSpicy: {
                label: 'Tone',
                description: 'Represents the degree of simplicity vs. complexity of the sound.',
                minLabel: 'Pure',
                maxLabel: 'Spicy'
            },
            rarePopular: {
                label: 'Popularity',
                description: 'Represents the scarcity and popularity in the market.',
                minLabel: 'Rare',
                maxLabel: 'Popular'
            }
        }
    },
    categories: {
        beginner: 'Beginner',
        healing: 'Yoga & Meditation',
        bright: 'Major Scale',
        ethnic: 'Deep Ethnic',
        case: 'Hard Case',
        softCase: 'Soft Case',
        stand: 'Stand'
    },
    shipping: {
        worldwide: 'Worldwide Shipping',
        worldwideEn: 'Worldwide Shipping'
    },
    tags: {
        minor: 'Minor',
        major: 'Major',
        harmonic: 'Harmonic',
        melodic: 'Melodic',
        pentatonic: 'Pentatonic',
        exotic: 'Exotic',
        meditative: 'Meditative',
        bright: 'Bright',
        dark: 'Dark',
        mysterious: 'Mysterious',
        happy: 'Happy',
        sad: 'Sad',
        uplifting: 'Uplifting',
        calm: 'Calm',
        energetic: 'Energetic'
    }
};

const FR_TRANSLATIONS = {
    title: 'Trouvez votre Handpan idéal',
    vibeSelector: {
        jamming: 'Débutant',
        meditation: 'Yoga·Méditation·Guérison',
        uplift: 'Atmosphère lumineuse',
        exotic: 'Ethnique profond'
    },
    scaleList: {
        back: 'Choisir à nouveau',
        scaleClassification: 'Classification',
        allScales: 'Toutes les gammes',
        purchase: 'Acheter',
        preparing: 'Bientôt disponible',
        share: 'Partager',
        copied: 'Copié',
        rankRecommendation: 'Recommandation',
        popularScale: 'Populaire',
        ding: 'Ding',
        top: 'Haut',
        bottom: 'Bas',
        prev: 'Préc',
        next: 'Suiv',
        mutant: 'Mutant',
        normal: 'Normal',
        viewing: 'Affichage',
        select: 'Sélectionner',
        filter: 'Filtrer',
        selectCategory: 'Choisir une catégorie',
        selectType: 'Choisir un type',
        noteCount: 'Nombre de notes',
        selectDing: 'Choisir le Ding',
        mood: 'Ambiance',
        tone: 'Timbre',
        popularity: 'Popularité',
        minor: 'Mineur',
        major: 'Majeur',
        pure: 'Pur',
        spicy: 'Épicé',
        rare: 'Rare',
        popular: 'Populaire',
        digiPan: 'DigiPan',
        implementationPending: 'Implémentation en attente',
        axes: {
            minorMajor: {
                label: 'Ambiance',
                description: "Représente l'atmosphère émotionnelle globale de la gamme.",
                minLabel: 'Mineur',
                maxLabel: 'Majeur'
            },
            pureSpicy: {
                label: 'Timbre',
                description: 'Représente le degré de simplicité ou de complexité du son.',
                minLabel: 'Pur',
                maxLabel: 'Épicé'
            },
            rarePopular: {
                label: 'Popularité',
                description: 'Représente la rareté et la popularité sur le marché.',
                minLabel: 'Rare',
                maxLabel: 'Populaire'
            }
        }
    },
    categories: {
        beginner: 'Débutant',
        healing: 'Yoga & Méditation',
        bright: 'Gamme Majeure',
        ethnic: 'Ethnique profond',
        case: 'Étui rigide',
        softCase: 'Étui souple',
        stand: 'Support'
    },
    shipping: {
        worldwide: 'Livraison internationale',
        worldwideEn: 'Worldwide Shipping'
    },
    tags: {
        minor: 'Mineur',
        major: 'Majeur',
        harmonic: 'Harmonique',
        melodic: 'Mélodique',
        pentatonic: 'Pentatonique',
        exotic: 'Exotique',
        meditative: 'Méditatif',
        bright: 'Lumineux',
        dark: 'Sombre',
        mysterious: 'Mystérieux',
        happy: 'Joyeux',
        sad: 'Triste',
        uplifting: 'Édifiant',
        calm: 'Calme',
        energetic: 'Énergique'
    }
};

export type TranslationType = typeof EN_TRANSLATIONS;

export const TRANSLATIONS: Record<Language, TranslationType> = {
    ko: {
        title: '나에게 맞는 핸드팬 스케일 찾기',
        vibeSelector: {
            jamming: '입문용',
            meditation: '요가·명상·힐링',
            uplift: '밝은 분위기',
            exotic: '딥 에스닉'
        },
        scaleList: {
            back: '다시 선택',
            scaleClassification: '분류기준',
            allScales: '전체스케일',
            purchase: '구매',
            preparing: '준비중',
            share: '공유',
            copied: '복사됨',
            rankRecommendation: '위 추천',
            popularScale: '인기 스케일',
            ding: 'Ding',
            top: 'Top',
            bottom: 'Bottom',
            prev: '이전',
            next: '다음',
            mutant: '뮤턴트',
            normal: '일반',
            viewing: '보고있음',
            select: '선택',
            filter: '필터',
            selectCategory: '카테고리 선택',
            selectType: '타입 선택',
            noteCount: '노트 개수',
            selectDing: '딩 선택',
            mood: '조성',
            tone: '음향질감',
            popularity: '대중성',
            minor: '마이너',
            major: '메이저',
            pure: '담백함',
            spicy: '화려함',
            rare: '희소함',
            popular: '대중적',
            digiPan: '디지팬',
            implementationPending: '구현 예정',
            axes: {
                minorMajor: {
                    label: '조성 (Mood)',
                    description: '스케일이 주는 전체적인 감정적 분위기를 나타냅니다.',
                    minLabel: 'Minor (단조)',
                    maxLabel: 'Major (장조)'
                },
                pureSpicy: {
                    label: '음향 질감 (Tone)',
                    description: '소리의 담백함과 화려함의 정도를 나타냅니다.',
                    minLabel: 'Pure (담백함)',
                    maxLabel: 'Spicy (화려함)'
                },
                rarePopular: {
                    label: '대중성 (Popularity)',
                    description: '시장에서의 희소성과 대중적인 인기를 나타냅니다.',
                    minLabel: 'Rare (희소함)',
                    maxLabel: 'Popular (대중적)'
                }
            }
        },
        categories: {
            beginner: '입문용',
            healing: '요가명상힐링',
            bright: '메이저 스케일',
            ethnic: '딥 에스닉',
            case: '하드케이스',
            softCase: '소프트케이스',
            stand: '스탠드'
        },
        shipping: {
            worldwide: '전세계 배송 가능',
            worldwideEn: 'Worldwide Shipping'
        },
        tags: {
            minor: '마이너',
            major: '메이저',
            harmonic: '하모닉',
            melodic: '멜로딕',
            pentatonic: '펜타토닉',
            exotic: '이국적',
            meditative: '명상적',
            bright: '밝은',
            dark: '어두운',
            mysterious: '신비로운',
            happy: '행복한',
            sad: '슬픈',
            uplifting: '고양되는',
            calm: '차분한',
            energetic: '에너지 넘치는'
        }
    },
    en: EN_TRANSLATIONS,
    fr: FR_TRANSLATIONS,
    de: EN_TRANSLATIONS,
    ja: EN_TRANSLATIONS,
    zh: EN_TRANSLATIONS,
    tr: EN_TRANSLATIONS,
    ar: EN_TRANSLATIONS,
    hi: EN_TRANSLATIONS,
    pt: EN_TRANSLATIONS,
    es: EN_TRANSLATIONS
} as const;

