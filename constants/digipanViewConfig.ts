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
    '9': { zoom: 14, targetY: 2 },    // Adjusted to +2 per user request (Moves object DOWN)
    '10': { zoom: 14, targetY: 2 },   // Adjusted to +2 per user request
    '11': { zoom: 12, targetY: 2 },   // Adjusted to +2 consistent with direction fix
    '12': { zoom: 12, targetY: 2 },   // Adjusted to +2 consistent with direction fix
    '14': { zoom: 12, targetY: 0 },
    '14M': { zoom: 12, targetY: 0 },
    '15M': { zoom: 12, targetY: 3 },  // Kept existing offset (lowering object)
    '18M': { zoom: 12, targetY: 3 },  // Kept existing offset (lowering object)
    'DM': { zoom: 12, targetY: 0 },
};
