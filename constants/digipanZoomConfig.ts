export const DIGIPAN_ZOOM_CONFIG = {
    '9': 14,
    '10': 14,
    '11': 12,
    '12': 12,
    '14': 12,
    '14M': 12,
    '15M': 12,
    '18M': 12,
    'DM': 12,
} as const;

export type DigipanTemplateType = keyof typeof DIGIPAN_ZOOM_CONFIG;
