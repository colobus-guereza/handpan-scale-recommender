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
        label: 'Mood',
        minLabel: 'Minor',
        maxLabel: 'Major'
    },
    pureSpicy: {
        id: 'pureSpicy',
        label: 'Tone',
        minLabel: 'Pure',
        maxLabel: 'Spicy'
    },
    rarePopular: {
        id: 'rarePopular',
        label: 'Popularity',
        minLabel: 'Rare',
        maxLabel: 'Popular'
    }
} as const;
