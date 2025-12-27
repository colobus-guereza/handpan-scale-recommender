export interface Scale {
    id: string;
    name: string;
    notes: {
        ding: string;
        top: string[];
        bottom: string[];
    };
    vector: {
        minorMajor: number; // -1.0 (Dark) ~ 1.0 (Bright)
        pureSpicy: number;  // 0.0 (Pure) ~ 1.0 (Spicy)
        rarePopular: number; // 0.0 (Rare) ~ 1.0 (Popular)
    };
    tags: string[];
    tagsEn?: string[];
    description: string;
    descriptionEn?: string;
    videoUrl?: string;
    productUrl?: string;
    ownUrl?: string;
    ownUrlEn?: string;
    nameEn?: string;
    i18n?: Record<string, {
        name: string;
        description?: string;
        tags?: string[];
    }>;
}

export interface NoteData {
    id: number;
    label: string;
    frequency?: number;
    cx?: number;
    cy?: number;
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
    position?: 'top' | 'bottom' | 'center';
    visualFrequency?: number;
    hideGuide?: boolean;
    textColor?: string;
    outlineColor?: string;
    subLabel?: string;
    angle?: number;
    offset?: [number, number, number];
}

export const VECTOR_AXES = {
    minorMajor: {
        id: 'minorMajor',
        label: '조성 (Mood)',
        description: '스케일이 주는 전체적인 감정적 분위기를 나타냅니다.',
        minLabel: 'Minor (단조)',
        maxLabel: 'Major (장조)',
        range: '-1.0 ~ +1.0'
    },
    pureSpicy: {
        id: 'pureSpicy',
        label: '음향 질감 (Tone)',
        description: '소리의 담백함과 화려함의 정도를 나타냅니다.',
        minLabel: 'Pure (담백함)',
        maxLabel: 'Spicy (화려함)',
        range: '0.0 ~ 1.0'
    },
    rarePopular: {
        id: 'rarePopular',
        label: '대중성 (Popularity)',
        description: '시장에서의 희소성과 대중적인 인기를 나타냅니다.',
        minLabel: 'Rare (희소함)',
        maxLabel: 'Popular (대중적)',
        range: '0.0 ~ 1.0'
    }
} as const;
