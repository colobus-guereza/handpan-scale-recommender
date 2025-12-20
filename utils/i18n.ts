import { Scale } from '@/data/handpan-data';
import { Product } from '../data/products';
import { Language } from '../constants/translations';

export interface LocalizedContent {
    name: string;
    description?: string;
    tags?: string[];
}

export interface LocalizedProductContent {
    name: string;
    description?: string;
    options?: string[];
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

    // 3. Fallback to English for French, German, Spanish, Russian, Japanese, Chinese, Persian, Portuguese, UAE Arabic, and Italian if i18n not found
    if ((lang === 'fr' || lang === 'de' || lang === 'es' || lang === 'ru' || lang === 'ja' || lang === 'zh' || lang === 'fa' || lang === 'pt' || lang === 'ae' || lang === 'it') && scale.i18n && scale.i18n['en']) {
        return scale.i18n['en'];
    }
    if ((lang === 'fr' || lang === 'de' || lang === 'es' || lang === 'ru' || lang === 'ja' || lang === 'zh' || lang === 'fa' || lang === 'pt' || lang === 'ae' || lang === 'it') && (scale.nameEn || scale.descriptionEn)) {
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

export const getLocalizedProduct = (product: Product, lang: Language): LocalizedProductContent => {
    // 1. Try to use the new i18n structure if it exists
    if (product.i18n && product.i18n[lang]) {
        return product.i18n[lang];
    }

    // 2. Fallback to existing fields (Parallel Change Strategy)
    if (lang === 'en') {
        return {
            name: product.nameEn || product.name,
            description: product.description, // English description not separated yet in Product interface
            options: product.options
        };
    }

    // 3. Fallback to English for French, German, Spanish, Russian, Japanese, Chinese, Persian, Portuguese, UAE Arabic, and Italian if i18n not found
    if ((lang === 'fr' || lang === 'de' || lang === 'es' || lang === 'ru' || lang === 'ja' || lang === 'zh' || lang === 'fa' || lang === 'pt' || lang === 'ae' || lang === 'it') && product.i18n && product.i18n['en']) {
        return product.i18n['en'];
    }
    if ((lang === 'fr' || lang === 'de' || lang === 'es' || lang === 'ru' || lang === 'ja' || lang === 'zh' || lang === 'fa' || lang === 'pt' || lang === 'ae' || lang === 'it') && product.nameEn) {
        return {
            name: product.nameEn || product.name,
            description: product.description,
            options: product.options
        };
    }

    // Default to Korean (base fields)
    return {
        name: product.name,
        description: product.description,
        options: product.options
    };
};
