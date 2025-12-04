import { Scale } from '../data/handpanScales';
import { Product } from '../data/products';

export type Language = 'ko' | 'en';

export interface LocalizedContent {
    name: string;
    description?: string;
    tags?: string[];
}

// Using 'any' temporarily for scale/product to allow for the transition period 
// where interfaces might not yet fully reflect the i18n structure in all places,
// or to avoid circular dependency issues if we import types that we are changing.
// However, we should aim to use the correct types. 
// Since we are modifying the types in the data files to include optional i18n, 
// we can cast or just check for existence.

export const getLocalizedScale = (scale: any, lang: Language): LocalizedContent => {
    // 1. Try to use the new i18n structure if it exists
    if (scale.i18n && scale.i18n[lang]) {
        return scale.i18n[lang];
    }

    // 2. Fallback to existing fields (Parallel Change Strategy)
    if (lang === 'en') {
        return {
            name: scale.nameEn || scale.name,
            description: scale.descriptionEn || scale.description,
            tags: scale.tagsEn || scale.tags || []
        };
    }

    // Default to Korean (base fields)
    return {
        name: scale.name,
        description: scale.description,
        tags: scale.tags || []
    };
};

export const getLocalizedProduct = (product: any, lang: Language): LocalizedContent => {
    // 1. Try to use the new i18n structure if it exists
    if (product.i18n && product.i18n[lang]) {
        return product.i18n[lang];
    }

    // 2. Fallback to existing fields
    if (lang === 'en') {
        return {
            name: product.nameEn || product.name,
            description: product.description, // Products currently don't have descriptionEn in old structure
            tags: []
        };
    }

    // Default to Korean
    return {
        name: product.name,
        description: product.description,
        tags: []
    };
};
