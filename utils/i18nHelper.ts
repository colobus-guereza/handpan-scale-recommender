import { Scale } from '@/data/handpanScales';
import { Language } from '@/constants/translations';

export interface LocalizedContent {
    name: string;
    description: string;
    tags: string[];
}

/**
 * Retrieves the localized content for a given scale and language.
 * Falls back to Korean ('ko') if the requested language data is missing.
 * 
 * @param scale The scale object containing i18n data
 * @param language The target language code ('ko', 'en', etc.)
 * @returns The localized content object (name, description, tags)
 */
export const getLocalizedScale = (scale: Scale, language: Language): LocalizedContent => {
    if (language === 'en') {
        return {
            name: scale.nameEn || scale.name,
            description: scale.descriptionEn || scale.description,
            tags: scale.tagsEn || scale.tags
        };
    }

    // Default to Korean
    return {
        name: scale.name,
        description: scale.description,
        tags: scale.tags
    };
};

/**
 * Helper to check if a scale matches a category based on its tags (localized or not).
 * Since tags are now localized, we might need to check against a specific language's tags
 * or check all available tags.
 * 
 * For simplicity in this app, we usually check the Korean tags for category matching
 * because the category definitions in ScaleList.tsx use Korean tags for matching logic
 * (or we can update ScaleList to be smarter).
 */
export const getScaleTags = (scale: Scale, language: Language = 'ko'): string[] => {
    return getLocalizedScale(scale, language).tags;
};
