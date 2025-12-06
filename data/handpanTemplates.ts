/**
 * Handpan Coordinate Templates
 * Defines the x, y, rotation, and other layout properties for standard note arrangements.
 * Coordinates are based on an SVG 1000x1000 system (Center 500, 500).
 */

export interface NoteTemplate {
    id: number;
    cx: number;
    cy: number;
    scale: number;
    rotate: number;
    labelX?: number;
    labelY?: number;
    position: 'center' | 'top' | 'bottom';
    angle: number;
}

export const HANDPAN_TEMPLATES: Record<string, NoteTemplate[]> = {
    // Standard 9-Note Layout (1 Ding + 8 Tonefields)
    // Based on "C# Amara 9" manual adjustment
    NOTES_9: [
        {
            id: 0,
            cx: 500,
            cy: 500,
            scale: 389.7,
            rotate: 90,
            labelY: 514, // Note: Label offsets might be dynamic in 3D logic
            position: 'center',
            angle: 0
        },
        {
            id: 1,
            cx: 661,
            cy: 779,
            scale: 286, // Note: Scale values here are SVG-relative, 3D logic remaps them.
            rotate: 121,
            labelY: 886,
            position: 'top',
            angle: 0
        },
        {
            id: 2,
            cx: 335,
            cy: 776,
            scale: 285,
            rotate: 61,
            labelY: 884,
            position: 'top',
            angle: 0
        },
        {
            id: 3,
            cx: 813,
            cy: 595,
            scale: 253,
            rotate: 128,
            labelY: 697,
            position: 'top',
            angle: 0
        },
        {
            id: 4,
            cx: 195,
            cy: 594,
            scale: 249,
            rotate: 47,
            labelY: 699,
            position: 'top',
            angle: 0
        },
        {
            id: 5,
            cx: 808,
            cy: 358,
            scale: 237,
            rotate: 55,
            labelY: 453,
            position: 'top',
            angle: 0
        },
        {
            id: 6,
            cx: 204,
            cy: 366,
            scale: 238,
            rotate: 125,
            labelY: 458,
            position: 'top',
            angle: 0
        },
        {
            id: 7,
            cx: 630,
            cy: 201,
            scale: 226,
            rotate: 48,
            labelY: 295,
            position: 'top',
            angle: 0
        },
        {
            id: 8,
            cx: 363,
            cy: 200,
            scale: 232,
            rotate: 133,
            labelY: 295,
            position: 'top',
            angle: 0
        }
    ]
};
