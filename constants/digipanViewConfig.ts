// Centralized configuration for Digipan Camera View Settings
// Defines Camera Zoom and Vertical Offset (TargetY) for each template
//
// targetY:
// - 0: Center (Default)
// - Positive (>0): Move Object DOWN (Camera looks up) -> Used for 14M/15M/18M to give headroom
// - Negative (<0): Move Object UP (Camera looks down) -> Use to fix "Top Heavy" margin issues (Digipan 9/10/11/12)

export interface DigipanViewSettings {
    zoom: number;
    targetY: number;
}

export interface DigipanViewSettingsResponsive {
    web: DigipanViewSettings;
    mobile: DigipanViewSettings;
}

// Helper to check if settings are responsive
export function isResponsiveSettings(settings: DigipanViewSettings | DigipanViewSettingsResponsive): settings is DigipanViewSettingsResponsive {
    return 'web' in settings && 'mobile' in settings;
}

// Helper to get settings based on device type
export function getDeviceSettings(settings: DigipanViewSettings | DigipanViewSettingsResponsive, isMobile: boolean): DigipanViewSettings {
    if (isResponsiveSettings(settings)) {
        return isMobile ? settings.mobile : settings.web;
    }
    return settings;
}

// Helper for simple (non-responsive) config access - for backward compatibility
export function getSimpleSettings(key: string): DigipanViewSettings {
    const settings = DIGIPAN_VIEW_CONFIG[key];
    if (isResponsiveSettings(settings)) {
        // Default to web settings for simple access
        return settings.web;
    }
    return settings;
}

export const DIGIPAN_VIEW_CONFIG: Record<string, DigipanViewSettings | DigipanViewSettingsResponsive> = {
    '9': {
        web: { zoom: 13.5, targetY: 0 },
        mobile: { zoom: 14.5, targetY: 5 }
    },
    '10': {
        web: { zoom: 13.5, targetY: 0 },
        mobile: { zoom: 14.5, targetY: 5 }
    },
    '11': {
        web: { zoom: 12, targetY: 0 },
        mobile: { zoom: 12.5, targetY: 6 }
    },
    '12': {
        web: { zoom: 12, targetY: 3 },
        mobile: { zoom: 12, targetY: 6 }
    },
    '14': {
        web: { zoom: 12, targetY: 5 },
        mobile: { zoom: 12, targetY: 10 }
    },
    '14M': {
        web: { zoom: 12, targetY: 5 },
        mobile: { zoom: 12, targetY: 7 }
    },
    '15M': {
        web: { zoom: 12, targetY: 3 },
        mobile: { zoom: 12, targetY: 7 }
    },
    '18M': {
        web: { zoom: 12, targetY: 5 },
        mobile: { zoom: 12, targetY: 10 }
    },
    'DM': { zoom: 12, targetY: 0 },
};

export const DIGIPAN_LABEL_POS_FACTOR = 0.20;
