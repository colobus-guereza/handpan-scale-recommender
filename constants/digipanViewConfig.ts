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

export const DIGIPAN_VIEW_CONFIG: Record<string, DigipanViewSettings> = {
    '9': { zoom: 13.5, targetY: 0 },    // Adjusted zoom to 13.5 per user request
    '10': { zoom: 13.5, targetY: 0 },   // Changed to 0 per user request
    '11': { zoom: 12, targetY: 0 },   
    '12': { zoom: 12, targetY: 3 },   // Keep user requested +3 for 12 if desired, or reset to 0? Usually 0.
    '14': { zoom: 12, targetY: 5 },   // Adjusted to +5 per user request
    '14M': { zoom: 12, targetY: 5 },  // Adjusted to +5 per user request
    '15M': { zoom: 12, targetY: 3 },  // Adjusted to +3 per user request
    '18M': { zoom: 12, targetY: 5 },  // Adjusted to +5 per user request
    'DM': { zoom: 12, targetY: 0 },
};

export const DIGIPAN_LABEL_POS_FACTOR = 0.20;
