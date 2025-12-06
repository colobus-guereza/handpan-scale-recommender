'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { Scale } from '../data/handpanScales';
import { TRANSLATIONS, Language } from '../constants/translations';
import { Settings } from 'lucide-react';

// 톤필드 가로세로 비율 상수
const TONEFIELD_RATIO_X = 0.3;  // 가로 반지름 비율
const TONEFIELD_RATIO_Y = 0.425; // 세로 반지름 비율

// 노트 데이터 타입 정의
interface NoteData {
    id: number;
    label: string;
    position: 'center' | 'top' | 'bottom';
    angle: number; // degree (시계 12시 방향을 0도로 기준, 시계방향 진행)
    radius?: number; // 중앙에서의 거리
    // 캘리브레이션 가능한 속성들
    cx?: number; // 직접 지정된 X 좌표
    cy?: number; // 직접 지정된 Y 좌표
    scale?: number; // 톤필드 스케일 (비율 유지)
    rotate?: number; // 회전 각도 (0~360)
    // 계산된 값들 (scale 기반)
    rx?: number; // 계산된 가로 반지름 (scale * TONEFIELD_RATIO_X)
    ry?: number; // 계산된 세로 반지름 (scale * TONEFIELD_RATIO_Y)
    // 라벨 위치 캘리브레이션
    labelX?: number; // 라벨 X 좌표 (직접 지정)
    labelY?: number; // 라벨 Y 좌표 (직접 지정)
    labelOffset?: number; // 라벨 오프셋 (기본값: 25)
    // 기호 텍스트 'RS' 캘리브레이션 (딩만)
    symbolX?: number; // 기호 RS X 좌표 (직접 지정)
    symbolY?: number; // 기호 RS Y 좌표 (직접 지정)
    symbolOffset?: number; // 기호 RS 오프셋 (기본값: 15)
    // 기호 텍스트 'LS' 캘리브레이션 (딩만)
    symbolLeftX?: number; // 기호 LS X 좌표 (직접 지정)
    symbolLeftY?: number; // 기호 LS Y 좌표 (직접 지정)
    symbolLeftOffset?: number; // 기호 LS 오프셋 (기본값: 15)
    // 기호 텍스트 'H' 캘리브레이션 (딩만)
    symbolBottomX?: number; // 기호 H X 좌표 (직접 지정)
    symbolBottomY?: number; // 기호 H Y 좌표 (직접 지정)
    symbolBottomOffset?: number; // 기호 H 오프셋 (기본값: 15)
    // 피치 텍스트 캘리브레이션
    pitchTextX?: number; // 피치 텍스트 X 좌표 (기본값: cx)
    pitchTextY?: number; // 피치 텍스트 Y 좌표 (기본값: cy)
    pitchTextScale?: number; // 피치 텍스트 사이즈 (기본값: 37 for D, 30 for others)
    pitchTextRotate?: number; // 피치 텍스트 회전 각도 (기본값: 0)
}

// 시계 각도를 SVG 각도로 변환하는 헬퍼 함수
const clockToSvgAngle = (clockAngle: number): number => {
    return ((clockAngle - 90 + 360) % 360);
};

// 피치 문자열을 비교하는 헬퍼 함수 (낮은 피치부터 정렬)
const comparePitch = (a: string, b: string): number => {
    // 숫자 추출 (옥타브)
    const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.match(/\d+/)?.[0] || '0');

    // 옥타브가 다르면 옥타브로 비교
    if (aNum !== bNum) return aNum - bNum;

    // 옥타브가 같으면 알파벳 부분 비교
    const aNote = a.replace(/\d+/g, '').trim();
    const bNote = b.replace(/\d+/g, '').trim();

    // 음표 순서 정의 (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
    const noteOrder: { [key: string]: number } = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
        'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    // 알파벳 부분에서 음표 추출 (예: "A3" -> "A", "Bb3" -> "Bb")
    const getNoteValue = (noteStr: string): number => {
        // # 또는 b이 포함된 경우
        if (noteStr.includes('#') || noteStr.includes('b')) {
            const match = noteStr.match(/^([A-G][#b]?)/);
            if (match) {
                const note = match[1];
                return noteOrder[note] ?? 999;
            }
        }
        // 단순 알파벳인 경우
        const singleNote = noteStr.charAt(0);
        return noteOrder[singleNote] ?? 999;
    };

    const aValue = getNoteValue(aNote);
    const bValue = getNoteValue(bNote);

    return aValue - bValue;
};

// 톤필드 사이즈 계산 헬퍼 함수
interface ToneSize {
    rx: number;
    ry: number;
}

const DING_BASE_RX = 180;
const DING_BASE_RY = 150;

const calculateToneSize = (label: string): ToneSize => {
    if (label === 'D') {
        return { rx: DING_BASE_RX, ry: DING_BASE_RY };
    }

    const noteNumber = parseInt(label);
    if (isNaN(noteNumber) || noteNumber < 1 || noteNumber > 8) {
        return { rx: DING_BASE_RX * 0.55, ry: DING_BASE_RY * 0.55 };
    }

    const maxRatio = 0.833;
    const minRatio = 0.5;
    const ratio = minRatio + (maxRatio - minRatio) * ((8 - noteNumber) / 7);

    return { rx: DING_BASE_RX * ratio, ry: DING_BASE_RY * ratio };
};

// localStorage에서 캘리브레이션 데이터 불러오기
const loadCalibrationFromStorage = (key: string): any[] | null => {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error(`Failed to load calibration from ${key}:`, error);
    }
    return null;
};

// 초기 노트 데이터 생성 함수 (템플릿 개수에 따라 생성)
const createInitialNotes = (centerX: number, centerY: number, templateCount: number | string = 9, scale?: Scale | null): NoteData[] => {
    // 템플릿별로 독립적인 localStorage 키 사용
    // 스케일이 있으면 스케일 ID를 우선 사용 (개별 저장)
    const storageKeySuffix = scale ? `scale_${scale.id}` : templateCount;
    const toneFieldKey = `minidigipan_tonefield_calibration_${storageKeySuffix}`;
    const labelKey = `minidigipan_label_calibration_${storageKeySuffix}`;

    // localStorage에서 톤필드 캘리브레이션 불러오기
    let storedToneFieldCalibration = loadCalibrationFromStorage(toneFieldKey);
    let storedLabelCalibration = loadCalibrationFromStorage(labelKey);

    // F# Low Pygmy 18의 경우, 기존 데이터에 중복된 ID(12, 13)가 저장되어 있을 수 있으므로 정제
    if (scale?.id === 'fs_low_pygmy_18_mutant' && (templateCount === '14M' || templateCount === 18)) {
        if (storedToneFieldCalibration) {
            // ID가 중복되면 뒤에 있는 것을 제거하거나, 특정 조건에 따라 필터링
            // 여기서는 12, 13번이 중복될 수 있으므로, 일단 중복 제거 (Set 사용 또는 filter)
            const uniqueIds = new Set();
            storedToneFieldCalibration = storedToneFieldCalibration.filter((note: any) => {
                if (uniqueIds.has(note.id)) return false;
                uniqueIds.add(note.id);
                return true;
            });
        }
        if (storedLabelCalibration) {
            const uniqueIds = new Set();
            storedLabelCalibration = storedLabelCalibration.filter((note: any) => {
                if (uniqueIds.has(note.id)) return false;
                uniqueIds.add(note.id);
                return true;
            });
        }
    }

    // F# Low Pygmy 18의 경우 저장된 데이터가 있어도 하판 노트 4개가 없으면 추가 (이제 6개 추가: 12, 13, 14, 15, 16, 17)
    if (scale?.id === 'fs_low_pygmy_18_mutant' && (templateCount === '14M' || templateCount === 18)) {
        // 기존 노트들(12, 13, 14, 15)이 있는지 확인
        const hasBaseBottomNotes = storedToneFieldCalibration?.some((n: any) => n.id === 12 || n.id === 13 || n.id === 14 || n.id === 15);
        // 새로운 노트들(16, 17)이 있는지 확인
        const hasNewBottomNotes = storedToneFieldCalibration?.some((n: any) => n.id === 16 || n.id === 17);

        if (!hasBaseBottomNotes || !hasNewBottomNotes) {
            // 하판 노트가 없으면 F# Low Pygmy 14 데이터를 기반으로 추가
            const fsLowPygmy14ToneFieldKey = `minidigipan_tonefield_calibration_scale_fs_low_pygmy_14_mutant`;
            const fsLowPygmy14LabelKey = `minidigipan_label_calibration_scale_fs_low_pygmy_14_mutant`;
            const fsLowPygmy14ToneField = loadCalibrationFromStorage(fsLowPygmy14ToneFieldKey);
            const fsLowPygmy14Label = loadCalibrationFromStorage(fsLowPygmy14LabelKey);

            if (fsLowPygmy14ToneField) {
                const baseToneField = storedToneFieldCalibration || fsLowPygmy14ToneField;
                const d3Note = baseToneField.find((n: any) => n.id === 10) || fsLowPygmy14ToneField.find((n: any) => n.id === 10);
                const e3Note = baseToneField.find((n: any) => n.id === 11) || fsLowPygmy14ToneField.find((n: any) => n.id === 11);
                const d3Cx = d3Note?.cx || -118;
                const d3Cy = d3Note?.cy || 608;
                const e3Cx = e3Note?.cx || 1118;
                const e3Cy = e3Note?.cy || 608;

                // 기존 데이터 유지하면서 없는 노트만 추가
                let newToneFieldCalibration = [...baseToneField];

                // 12, 13, 14, 15 추가 (없으면)
                if (!hasBaseBottomNotes) {
                    newToneFieldCalibration.push(
                        // B3 (id 12) -> Label 6
                        {
                            id: 12,
                            label: '6',
                            cx: d3Cx + 100,
                            cy: d3Cy,
                            scale: d3Note?.scale || 300,
                            rotate: d3Note?.rotate || 164,
                        },
                        // C#4 (id 13) -> Label 7
                        {
                            id: 13,
                            label: '7',
                            cx: e3Cx - 100,
                            cy: e3Cy,
                            scale: e3Note?.scale || 300,
                            rotate: e3Note?.rotate || 19,
                        },
                        // B4 (id 14) -> Label 13
                        {
                            id: 14,
                            label: '13',
                            cx: d3Cx,
                            cy: d3Cy - 150,
                            scale: d3Note?.scale || 300,
                            rotate: d3Note?.rotate || 164,
                        },
                        // C#5 (id 15) -> Label 14
                        {
                            id: 15,
                            label: '14',
                            cx: e3Cx,
                            cy: e3Cy - 150,
                            scale: e3Note?.scale || 300,
                            rotate: e3Note?.rotate || 19,
                        }
                    );
                }

                // 16, 17 추가 (없으면)
                if (!hasNewBottomNotes) {
                    newToneFieldCalibration.push(
                        // C#5 (id 16) -> F#5 (17) -> Label 17
                        {
                            id: 16,
                            label: '17',
                            cx: e3Cx + 100,
                            cy: e3Cy - 300,
                            scale: e3Note?.scale || 300,
                            rotate: e3Note?.rotate || 19,
                        },
                        // F#5 (id 17) -> G#5 (18) -> Label 18
                        {
                            id: 17,
                            label: '18',
                            cx: d3Cx - 100,
                            cy: d3Cy - 300,
                            scale: d3Note?.scale || 300,
                            rotate: d3Note?.rotate || 164,
                        }
                    );
                }

                // 모든 노트의 라벨을 강제로 업데이트 (1~18)
                // ID 매핑:
                // 0: F#3 (Ding) -> 3
                // 1: G#3 -> 4
                // 2: A3 -> 5
                // 3: C#4 -> 7 (원래 Top이었으나 Bottom으로 이동? 아니면 ID 매핑이 다름?)
                // F# Low Pygmy 14의 기본 ID 매핑을 확인해야 함.
                // 일단 사용자가 제공한 순서대로 매핑:
                // 1 D3 (Bottom) -> ID 10 (D3)
                // 2 E3 (Bottom) -> ID 11 (E3)
                // 3 F#3 (Top) -> ID 0 (Ding)
                // 4 G#3 (Top) -> ID 1
                // 5 A3 (Top) -> ID 2
                // 6 B3 (Bottom) -> ID 12
                // 7 C#4 (Bottom) -> ID 13
                // 8 D4 (Top) -> ID 3
                // 9 E4 (Top) -> ID 4
                // 10 F#4 (Top) -> ID 5
                // 11 G#4 (Top) -> ID 6
                // 12 A4 (Top) -> ID 7
                // 13 B4 (Bottom) -> ID 14
                // 14 C#5 (Bottom) -> ID 15
                // 15 D5 (Top) -> ID 8
                // 16 E5 (Top) -> ID 9
                // 17 F#5 (Top) -> ID 16
                // 18 G#5 (Top) -> ID 17

                const labelMapping: { [key: number]: string } = {
                    10: '1',  // D3
                    11: '2',  // E3
                    0: '3',   // F#3
                    1: '4',   // G#3
                    2: '5',   // A3
                    12: '6',  // B3
                    13: '7',  // C#4
                    3: '8',   // D4
                    4: '9',   // E4
                    5: '10',  // F#4
                    6: '11',  // G#4
                    7: '12',  // A4
                    14: '13', // B4
                    15: '14', // C#5
                    8: '15',  // D5
                    9: '16',  // E5
                    16: '17', // F#5
                    17: '18', // G#5
                };

                newToneFieldCalibration = newToneFieldCalibration.map(note => {
                    if (labelMapping[note.id]) {
                        return { ...note, label: labelMapping[note.id] };
                    }
                    return note;
                });

                storedToneFieldCalibration = newToneFieldCalibration;
            }

            if (fsLowPygmy14Label) {
                const baseLabel = storedLabelCalibration || fsLowPygmy14Label;
                const d3Label = baseLabel.find((n: any) => n.id === 10) || fsLowPygmy14Label.find((n: any) => n.id === 10);
                const e3Label = baseLabel.find((n: any) => n.id === 11) || fsLowPygmy14Label.find((n: any) => n.id === 11);
                const d3LabelX = d3Label?.labelX || -98;
                const d3LabelY = d3Label?.labelY || 750;
                const e3LabelX = e3Label?.labelX || 1084;
                const e3LabelY = e3Label?.labelY || 750;

                storedLabelCalibration = [
                    ...baseLabel,
                    // B3 라벨 (id 12)
                    {
                        id: 12,
                        label: '13',
                        labelX: d3LabelX + 100,
                        labelY: d3LabelY,
                        labelOffset: 25,
                    },
                    // C#4 라벨 (id 13)
                    {
                        id: 13,
                        label: '14',
                        labelX: e3LabelX - 100,
                        labelY: e3LabelY,
                        labelOffset: 25,
                    },
                    // B4 라벨 (id 14)
                    {
                        id: 14,
                        label: '15',
                        labelX: d3LabelX,
                        labelY: d3LabelY - 150,
                        labelOffset: 25,
                    },
                    // C#5 라벨 (id 15)
                    {
                        id: 15,
                        label: '16',
                        labelX: e3LabelX,
                        labelY: e3LabelY - 150,
                        labelOffset: 25,
                    },
                ];
            }
        }
    }

    // 14M, 15, 18 템플릿의 경우 F# Low Pygmy 14의 저장된 데이터를 기본값으로 사용
    if (!storedToneFieldCalibration && (templateCount === '14M' || templateCount === 15 || templateCount === 18)) {
        const fsLowPygmy14ToneFieldKey = `minidigipan_tonefield_calibration_scale_fs_low_pygmy_14_mutant`;
        const fsLowPygmy14LabelKey = `minidigipan_label_calibration_scale_fs_low_pygmy_14_mutant`;
        const fsLowPygmy14ToneField = loadCalibrationFromStorage(fsLowPygmy14ToneFieldKey);
        const fsLowPygmy14Label = loadCalibrationFromStorage(fsLowPygmy14LabelKey);

        if (fsLowPygmy14ToneField) {
            if (templateCount === 15) {
                // 15 템플릿: F# Low Pygmy 14 데이터 + id 14 노트 추가 (G3)
                // E3(id 10)의 위치를 확인하고 그 위에 G3 배치
                const e3Note = fsLowPygmy14ToneField.find((n: any) => n.id === 10);
                const e3Cy = e3Note?.cy || 608;
                // E3 상단에 G3 배치 (cy를 더 작게)
                storedToneFieldCalibration = [
                    ...fsLowPygmy14ToneField,
                    {
                        id: 14,
                        label: '15',
                        cx: e3Note?.cx || -118,
                        cy: e3Cy - 150, // E3 위쪽에 배치
                        scale: e3Note?.scale || 300,
                        rotate: e3Note?.rotate || 164,
                    }
                ];
            } else if ((templateCount === '14M' || templateCount === 18) && scale?.id === 'fs_low_pygmy_18_mutant') {
                // F# Low Pygmy 18: F# Low Pygmy 14 데이터 + 하판 노트 4개 추가 (B3, C#4, B4, C#5)
                // D3(id 10), E3(id 11)는 이미 있음
                // B3, C#4, B4, C#5를 하판에 추가 (id 12, 13, 14, 15)
                const d3Note = fsLowPygmy14ToneField.find((n: any) => n.id === 10);
                const e3Note = fsLowPygmy14ToneField.find((n: any) => n.id === 11);
                const d3Cx = d3Note?.cx || -118;
                const d3Cy = d3Note?.cy || 608;
                const e3Cx = e3Note?.cx || 1118;
                const e3Cy = e3Note?.cy || 608;

                storedToneFieldCalibration = [
                    ...fsLowPygmy14ToneField,
                    // B3 (id 12) - D3 근처에 배치
                    {
                        id: 12,
                        label: '13',
                        cx: d3Cx + 100,
                        cy: d3Cy,
                        scale: d3Note?.scale || 300,
                        rotate: d3Note?.rotate || 164,
                    },
                    // C#4 (id 13) - E3 근처에 배치
                    {
                        id: 13,
                        label: '14',
                        cx: e3Cx - 100,
                        cy: e3Cy,
                        scale: e3Note?.scale || 300,
                        rotate: e3Note?.rotate || 19,
                    },
                    // B4 (id 14) - D3 위쪽에 배치
                    {
                        id: 14,
                        label: '15',
                        cx: d3Cx,
                        cy: d3Cy - 150,
                        scale: d3Note?.scale || 300,
                        rotate: d3Note?.rotate || 164,
                    },
                    // C#5 (id 15) - E3 위쪽에 배치
                    {
                        id: 15,
                        label: '16',
                        cx: e3Cx,
                        cy: e3Cy - 150,
                        scale: e3Note?.scale || 300,
                        rotate: e3Note?.rotate || 19,
                    },
                    // C#5 (id 16) - 추가 요청 (14/C#5) - 우측 상단 배치
                    {
                        id: 16,
                        label: '17',
                        cx: e3Cx + 100,
                        cy: e3Cy - 300,
                        scale: e3Note?.scale || 300,
                        rotate: e3Note?.rotate || 19,
                    },
                    // F#5 (id 17) - 추가 요청 (17/F#5) - 좌측 상단 배치
                    {
                        id: 17,
                        label: '18',
                        cx: d3Cx - 100,
                        cy: d3Cy - 300,
                        scale: d3Note?.scale || 300,
                        rotate: d3Note?.rotate || 164,
                    },
                ];
            } else {
                storedToneFieldCalibration = fsLowPygmy14ToneField;
            }
        }
        if (fsLowPygmy14Label) {
            if (templateCount === 15) {
                // 15 템플릿: F# Low Pygmy 14 라벨 데이터 + id 14 라벨 추가
                const e3Label = fsLowPygmy14Label.find((n: any) => n.id === 10);
                storedLabelCalibration = [
                    ...fsLowPygmy14Label,
                    {
                        id: 14,
                        label: '15',
                        labelX: e3Label?.labelX || -98,
                        labelY: (e3Label?.labelY || 750) - 150, // E3 라벨 위쪽에 배치
                        labelOffset: 25,
                    }
                ];
            } else if ((templateCount === '14M' || templateCount === 18) && scale?.id === 'fs_low_pygmy_18_mutant') {
                const baseLabel = storedLabelCalibration || fsLowPygmy14Label;
                const d3Label = baseLabel.find((n: any) => n.id === 10) || fsLowPygmy14Label.find((n: any) => n.id === 10);
                const e3Label = baseLabel.find((n: any) => n.id === 11) || fsLowPygmy14Label.find((n: any) => n.id === 11);
                const d3LabelX = d3Label?.labelX || -98;
                const d3LabelY = d3Label?.labelY || 750;
                const e3LabelX = e3Label?.labelX || 1084;
                const e3LabelY = e3Label?.labelY || 750;

                // 기존 데이터 유지하면서 없는 라벨만 추가
                let newLabelCalibration = [...baseLabel];

                // 기존 라벨들(12, 13, 14, 15)이 있는지 확인
                const hasBaseBottomLabels = storedLabelCalibration?.some((n: any) => n.id === 12 || n.id === 13 || n.id === 14 || n.id === 15);
                // 새로운 라벨들(16, 17)이 있는지 확인
                const hasNewBottomLabels = storedLabelCalibration?.some((n: any) => n.id === 16 || n.id === 17);

                if (!hasBaseBottomLabels) {
                    // 기존 14M 데이터에서 12, 13번 라벨 제거 (중복 방지)
                    const filteredBaseLabel = newLabelCalibration.filter((n: any) => n.id !== 12 && n.id !== 13);
                    newLabelCalibration = [
                        ...filteredBaseLabel,
                        // B3 라벨 (id 12)
                        {
                            id: 12,
                            label: '13',
                            labelX: d3LabelX + 100,
                            labelY: d3LabelY,
                            labelOffset: 25,
                        },
                        // C#4 라벨 (id 13)
                        {
                            id: 13,
                            label: '14',
                            labelX: e3LabelX - 100,
                            labelY: e3LabelY,
                            labelOffset: 25,
                        },
                        // B4 라벨 (id 14)
                        {
                            id: 14,
                            label: '15',
                            labelX: d3LabelX,
                            labelY: d3LabelY - 150,
                            labelOffset: 25,
                        },
                        // C#5 라벨 (id 15)
                        {
                            id: 15,
                            label: '16',
                            labelX: e3LabelX,
                            labelY: e3LabelY - 150,
                            labelOffset: 25,
                        }
                    ];
                }

                if (!hasNewBottomLabels) {
                    newLabelCalibration.push(
                        // C#5 라벨 (id 16) -> F#5 (17)
                        {
                            id: 16,
                            label: '17',
                            labelX: e3LabelX + 100,
                            labelY: e3LabelY - 300,
                            labelOffset: 25,
                        },
                        // F#5 라벨 (id 17) -> G#5 (18)
                        {
                            id: 17,
                            label: '18',
                            labelX: d3LabelX - 100,
                            labelY: d3LabelY - 300,
                            labelOffset: 25,
                        }
                    );
                }

                storedLabelCalibration = newLabelCalibration;
            } else {
                storedLabelCalibration = fsLowPygmy14Label;
            }
        }
    }

    // 템플릿별 기본 캘리브레이션 데이터
    const getDefaultCalibrationData = (count: number | string): any[] => {
        // E Equinox 14 전용 하드코딩 설정
        if (scale?.id === 'e_equinox_14' && count === '14N') {
            const base12N = getDefaultCalibrationData('12N');
            return [
                ...base12N,
                // 추가 노트 1 (id 12, Label 13) - 상단 좌측
                {
                    id: 12,
                    label: '13',
                    cx: 420,
                    cy: 120,
                    scale: 180,
                    rotate: 340,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
                // 추가 노트 2 (id 13, Label 14) - 상단 우측
                {
                    id: 13,
                    label: '14',
                    cx: 580,
                    cy: 120,
                    scale: 180,
                    rotate: 20,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
            ];
        }

        // 9 Notes 템플릿 기본값
        const default9Notes = [
            {
                id: 0,
                label: 'D',
                cx: 500,
                cy: 500,
                scale: 389.7,
                rotate: 90,
                labelX: null,
                labelY: 514,
                labelOffset: 25,
                symbolX: 945,
                symbolY: null,
                symbolOffset: 15,
                symbolLeftX: 59,
                symbolLeftY: null,
                symbolLeftOffset: 15,
                symbolBottomX: null,
                symbolBottomY: 665,
                symbolBottomOffset: 15,
            },
            {
                id: 1,
                label: '1',
                cx: 661,
                cy: 779,
                scale: 286,
                rotate: 121,
                labelX: null,
                labelY: 886,
                labelOffset: 25,
            },
            {
                id: 2,
                label: '2',
                cx: 335,
                cy: 776,
                scale: 285,
                rotate: 61,
                labelX: null,
                labelY: 884,
                labelOffset: 25,
            },
            {
                id: 3,
                label: '3',
                cx: 813,
                cy: 595,
                scale: 253,
                rotate: 128,
                labelX: null,
                labelY: 697,
                labelOffset: 25,
            },
            {
                id: 4,
                label: '4',
                cx: 195,
                cy: 594,
                scale: 249,
                rotate: 47,
                labelX: null,
                labelY: 699,
                labelOffset: 25,
            },
            {
                id: 5,
                label: '5',
                cx: 808,
                cy: 358,
                scale: 237,
                rotate: 55,
                labelX: null,
                labelY: 453,
                labelOffset: 25,
            },
            {
                id: 6,
                label: '6',
                cx: 204,
                cy: 366,
                scale: 238,
                rotate: 125,
                labelX: null,
                labelY: 458,
                labelOffset: 25,
            },
            {
                id: 7,
                label: '7',
                cx: 630,
                cy: 201,
                scale: 226,
                rotate: 48,
                labelX: null,
                labelY: 295,
                labelOffset: 25,
            },
            {
                id: 8,
                label: '8',
                cx: 363,
                cy: 200,
                scale: 232,
                rotate: 133,
                labelX: null,
                labelY: 295,
                labelOffset: 25,
            },
        ];

        // 10 Notes 템플릿 기본값 (9 Notes + 9번 노트)
        if (count === 10) {
            return [
                {
                    id: 0,
                    label: 'D',
                    cx: 500,
                    cy: 500,
                    scale: 389.7,
                    rotate: 90,
                    labelX: null,
                    labelY: 514,
                    labelOffset: 25,
                    symbolX: 945,
                    symbolY: null,
                    symbolOffset: 15,
                    symbolLeftX: 59,
                    symbolLeftY: null,
                    symbolLeftOffset: 15,
                    symbolBottomX: null,
                    symbolBottomY: 665,
                    symbolBottomOffset: 15,
                },
                {
                    id: 1,
                    label: '1',
                    cx: 661,
                    cy: 779,
                    scale: 286,
                    rotate: 121,
                    labelX: null,
                    labelY: 886,
                    labelOffset: 25,
                },
                {
                    id: 2,
                    label: '2',
                    cx: 335,
                    cy: 776,
                    scale: 285,
                    rotate: 61,
                    labelX: null,
                    labelY: 884,
                    labelOffset: 25,
                },
                {
                    id: 3,
                    label: '3',
                    cx: 813,
                    cy: 595,
                    scale: 253,
                    rotate: 128,
                    labelX: null,
                    labelY: 697,
                    labelOffset: 25,
                },
                {
                    id: 4,
                    label: '4',
                    cx: 195,
                    cy: 594,
                    scale: 249,
                    rotate: 47,
                    labelX: null,
                    labelY: 699,
                    labelOffset: 25,
                },
                {
                    id: 5,
                    label: '5',
                    cx: 808,
                    cy: 358,
                    scale: 237,
                    rotate: 55,
                    labelX: null,
                    labelY: 453,
                    labelOffset: 25,
                },
                {
                    id: 6,
                    label: '6',
                    cx: 204,
                    cy: 366,
                    scale: 238,
                    rotate: 125,
                    labelX: null,
                    labelY: 458,
                    labelOffset: 25,
                },
                {
                    id: 7,
                    label: '7',
                    cx: 688,
                    cy: 201,
                    scale: 226,
                    rotate: 48,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 8,
                    label: '8',
                    cx: 321,
                    cy: 203,
                    scale: 232,
                    rotate: 133,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 9,
                    label: '9',
                    cx: 501,
                    cy: 143,
                    scale: 200,
                    rotate: 0,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
            ];
        }

        // 11 Notes 템플릿 기본값 (중앙 딩 1개 + Top 8개 + 림 바깥 좌우 딩 2개)
        if (count === 11) {
            return [
                // 중앙 딩
                {
                    id: 0,
                    label: '3',
                    cx: 500,
                    cy: 500,
                    scale: 389.7,
                    rotate: 90,
                    labelX: null,
                    labelY: 514,
                    labelOffset: 25,
                    symbolX: 945,
                    symbolY: null,
                    symbolOffset: 15,
                    symbolLeftX: 59,
                    symbolLeftY: null,
                    symbolLeftOffset: 15,
                    symbolBottomX: null,
                    symbolBottomY: 665,
                    symbolBottomOffset: 15,
                },
                // Top 노트 1-8 (11 템플릿에서는 4-11으로 표시)
                {
                    id: 1,
                    label: '4',
                    cx: 661,
                    cy: 779,
                    scale: 286,
                    rotate: 121,
                    labelX: null,
                    labelY: 886,
                    labelOffset: 25,
                },
                {
                    id: 2,
                    label: '5',
                    cx: 335,
                    cy: 776,
                    scale: 285,
                    rotate: 61,
                    labelX: null,
                    labelY: 884,
                    labelOffset: 25,
                },
                {
                    id: 3,
                    label: '6',
                    cx: 813,
                    cy: 595,
                    scale: 253,
                    rotate: 128,
                    labelX: null,
                    labelY: 697,
                    labelOffset: 25,
                },
                {
                    id: 4,
                    label: '7',
                    cx: 195,
                    cy: 594,
                    scale: 249,
                    rotate: 47,
                    labelX: null,
                    labelY: 699,
                    labelOffset: 25,
                },
                {
                    id: 5,
                    label: '8',
                    cx: 808,
                    cy: 358,
                    scale: 237,
                    rotate: 55,
                    labelX: null,
                    labelY: 453,
                    labelOffset: 25,
                },
                {
                    id: 6,
                    label: '9',
                    cx: 204,
                    cy: 366,
                    scale: 238,
                    rotate: 125,
                    labelX: null,
                    labelY: 458,
                    labelOffset: 25,
                },
                {
                    id: 7,
                    label: '10',
                    cx: 630,
                    cy: 201,
                    scale: 226,
                    rotate: 48,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 8,
                    label: '11',
                    cx: 363,
                    cy: 200,
                    scale: 232,
                    rotate: 133,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                // 림 바깥 좌측 딩 (1번 D3)
                {
                    id: 10,
                    label: '1',
                    cx: -118,
                    cy: 608,
                    scale: 300,
                    rotate: 164,
                    labelX: -98,
                    labelY: 750,
                    labelOffset: 25,
                },
                // 림 바깥 우측 딩 (2번)
                {
                    id: 11,
                    label: '2',
                    cx: 1118,
                    cy: 608,
                    scale: 300,
                    rotate: 19,
                    labelX: 1084,
                    labelY: 750,
                    labelOffset: 25,
                },
            ];
        }

        // 12N 템플릿 기본값 (상판 10개: 중앙 딩 + Top 9개 + 하판 2개: 좌우 딩)
        if (count === '12N') {
            return [
                // 중앙 딩 (3번)
                {
                    id: 0,
                    label: '3',
                    cx: 500,
                    cy: 500,
                    scale: 389.7,
                    rotate: 90,
                    labelX: null,
                    labelY: 514,
                    labelOffset: 25,
                    symbolX: 945,
                    symbolY: null,
                    symbolOffset: 15,
                    symbolLeftX: 59,
                    symbolLeftY: null,
                    symbolLeftOffset: 15,
                    symbolBottomX: null,
                    symbolBottomY: 665,
                    symbolBottomOffset: 15,
                },
                // Top 노트 1-9 (10 템플릿의 상판)
                {
                    id: 1,
                    label: '1',
                    cx: 661,
                    cy: 779,
                    scale: 286,
                    rotate: 121,
                    labelX: null,
                    labelY: 886,
                    labelOffset: 25,
                },
                {
                    id: 2,
                    label: '2',
                    cx: 335,
                    cy: 776,
                    scale: 285,
                    rotate: 61,
                    labelX: null,
                    labelY: 884,
                    labelOffset: 25,
                },
                {
                    id: 3,
                    label: '3',
                    cx: 813,
                    cy: 595,
                    scale: 253,
                    rotate: 128,
                    labelX: null,
                    labelY: 697,
                    labelOffset: 25,
                },
                {
                    id: 4,
                    label: '4',
                    cx: 195,
                    cy: 594,
                    scale: 249,
                    rotate: 47,
                    labelX: null,
                    labelY: 699,
                    labelOffset: 25,
                },
                {
                    id: 5,
                    label: '5',
                    cx: 808,
                    cy: 358,
                    scale: 237,
                    rotate: 55,
                    labelX: null,
                    labelY: 453,
                    labelOffset: 25,
                },
                {
                    id: 6,
                    label: '6',
                    cx: 204,
                    cy: 366,
                    scale: 238,
                    rotate: 125,
                    labelX: null,
                    labelY: 458,
                    labelOffset: 25,
                },
                {
                    id: 7,
                    label: '7',
                    cx: 688,
                    cy: 201,
                    scale: 226,
                    rotate: 48,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 8,
                    label: '8',
                    cx: 321,
                    cy: 203,
                    scale: 232,
                    rotate: 133,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 9,
                    label: '9',
                    cx: 501,
                    cy: 143,
                    scale: 200,
                    rotate: 0,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
                // 하판 좌측 딩 (베이스 1)
                {
                    id: 10,
                    label: '1',
                    cx: -118,
                    cy: 608,
                    scale: 300,
                    rotate: 164,
                    labelX: -98,
                    labelY: 750,
                    labelOffset: 25,
                },
                // 하판 우측 딩 (베이스 2)
                {
                    id: 11,
                    label: '2',
                    cx: 1118,
                    cy: 608,
                    scale: 300,
                    rotate: 19,
                    labelX: 1084,
                    labelY: 750,
                    labelOffset: 25,
                },
            ];
        }

        // 14N 템플릿 (E Equinox 14 캘리브레이션 데이터)
        if (count === '14N') {
            return [
                // 중앙 딩 (3번)
                {
                    id: 0,
                    label: '3',
                    cx: 500,
                    cy: 500,
                    scale: 389.7,
                    rotate: 90,
                    labelX: null,
                    labelY: 514,
                    labelOffset: 25,
                    symbolX: 945,
                    symbolY: null,
                    symbolOffset: 15,
                    symbolLeftX: 59,
                    symbolLeftY: null,
                    symbolLeftOffset: 15,
                    symbolBottomX: null,
                    symbolBottomY: 665,
                    symbolBottomOffset: 15,
                },
                // Top 노트 1-9
                {
                    id: 1,
                    label: '1',
                    cx: 661,
                    cy: 779,
                    scale: 286,
                    rotate: 121,
                    labelX: null,
                    labelY: 886,
                    labelOffset: 25,
                },
                {
                    id: 2,
                    label: '2',
                    cx: 335,
                    cy: 776,
                    scale: 285,
                    rotate: 61,
                    labelX: null,
                    labelY: 884,
                    labelOffset: 25,
                },
                {
                    id: 3,
                    label: '3',
                    cx: 813,
                    cy: 595,
                    scale: 253,
                    rotate: 128,
                    labelX: null,
                    labelY: 697,
                    labelOffset: 25,
                },
                {
                    id: 4,
                    label: '4',
                    cx: 195,
                    cy: 594,
                    scale: 249,
                    rotate: 47,
                    labelX: null,
                    labelY: 699,
                    labelOffset: 25,
                },
                {
                    id: 5,
                    label: '5',
                    cx: 808,
                    cy: 358,
                    scale: 237,
                    rotate: 55,
                    labelX: null,
                    labelY: 453,
                    labelOffset: 25,
                },
                {
                    id: 6,
                    label: '6',
                    cx: 204,
                    cy: 366,
                    scale: 238,
                    rotate: 125,
                    labelX: null,
                    labelY: 458,
                    labelOffset: 25,
                },
                {
                    id: 7,
                    label: '7',
                    cx: 688,
                    cy: 201,
                    scale: 226,
                    rotate: 48,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 8,
                    label: '8',
                    cx: 321,
                    cy: 203,
                    scale: 232,
                    rotate: 133,
                    labelX: null,
                    labelY: 295,
                    labelOffset: 25,
                },
                {
                    id: 9,
                    label: '9',
                    cx: 501,
                    cy: 143,
                    scale: 200,
                    rotate: 0,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
                // 하판 좌측 딩 (베이스 1)
                {
                    id: 10,
                    label: '1',
                    cx: -118,
                    cy: 608,
                    scale: 300,
                    rotate: 164,
                    labelX: -98,
                    labelY: 750,
                    labelOffset: 25,
                },
                // 하판 우측 딩 (베이스 2)
                {
                    id: 11,
                    label: '2',
                    cx: 1118,
                    cy: 608,
                    scale: 300,
                    rotate: 19,
                    labelX: 1084,
                    labelY: 750,
                    labelOffset: 25,
                },
                // 하판 중앙 노트 1 (id 12, D5)
                {
                    id: 12,
                    label: '13',
                    cx: 420,
                    cy: -96,
                    scale: 180,
                    rotate: 251,
                    labelX: null,
                    labelY: -29,
                    labelOffset: 25,
                },
                // 하판 중앙 노트 2 (id 13, E5)
                {
                    id: 13,
                    label: '14',
                    cx: 609,
                    cy: -90,
                    scale: 146,
                    rotate: 290,
                    labelX: null,
                    labelY: -20,
                    labelOffset: 25,
                },
            ];
        }

        // 14M 템플릿 (12N 기반 + 2개 추가)
        if (count === '14M') {
            const base12N = getDefaultCalibrationData('12N');
            return [
                ...base12N,
                // 추가 노트 1 (id 12)
                {
                    id: 12,
                    label: '13',
                    cx: 500,
                    cy: 500,
                    scale: 200,
                    rotate: 0,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
                // 추가 노트 2 (id 13)
                {
                    id: 13,
                    label: '14',
                    cx: 500,
                    cy: 500,
                    scale: 200,
                    rotate: 0,
                    labelX: null,
                    labelY: null,
                    labelOffset: 25,
                },
            ];
        }

        // 기본값은 9 Notes
        return default9Notes;
    };

    const defaultCalibrationData = getDefaultCalibrationData(templateCount);

    // 저장된 톤필드 캘리브레이션이 있으면 사용, 없으면 기본값 사용
    const toneFieldData = storedToneFieldCalibration || defaultCalibrationData;

    // 저장된 라벨 캘리브레이션이 있으면 사용, 없으면 defaultCalibrationData의 라벨 값 사용
    // 저장된 값과 기본값을 병합하여 저장된 값이 없는 속성은 기본값 사용
    const labelCalibrationMap = new Map();

    // 먼저 기본값으로 맵 초기화 (toneFieldData를 사용하여 실제 사용되는 노트만 처리)
    toneFieldData.forEach((item: any) => {
        // 기본값에서 해당 id의 라벨 데이터 찾기
        const defaultItem = defaultCalibrationData.find((d: any) => d.id === item.id);
        labelCalibrationMap.set(item.id, {
            labelX: defaultItem?.labelX,
            labelY: defaultItem?.labelY,
            labelOffset: defaultItem?.labelOffset || 25,
            symbolX: defaultItem?.symbolX,
            symbolY: defaultItem?.symbolY,
            symbolOffset: defaultItem?.symbolOffset,
            symbolLeftX: defaultItem?.symbolLeftX,
            symbolLeftY: defaultItem?.symbolLeftY,
            symbolLeftOffset: defaultItem?.symbolLeftOffset,
            symbolBottomX: defaultItem?.symbolBottomX,
            symbolBottomY: defaultItem?.symbolBottomY,
            symbolBottomOffset: defaultItem?.symbolBottomOffset,
            pitchTextX: defaultItem?.pitchTextX,
            pitchTextY: defaultItem?.pitchTextY,
            pitchTextScale: defaultItem?.pitchTextScale,
            pitchTextRotate: defaultItem?.pitchTextRotate,
        });
    });

    // 저장된 값이 있으면 병합 (저장된 값이 우선, 없는 속성은 기본값 유지)
    if (storedLabelCalibration) {
        storedLabelCalibration.forEach((item: any) => {
            const defaultItem = labelCalibrationMap.get(item.id) || {};
            labelCalibrationMap.set(item.id, {
                ...defaultItem,
                ...item, // 저장된 값이 우선
            });
        });
    }

    // 캘리브레이션 데이터를 NoteData 형식으로 변환
    return toneFieldData.map((data) => {
        const labelData = labelCalibrationMap.get(data.id);
        return {
            id: data.id,
            label: data.label,
            position: data.id === 0 ? 'center' : (data.id === 10 || data.id === 11 || data.id === 12 || data.id === 13 || data.id === 14 || data.id === 15 ? 'bottom' : 'top'),
            angle: 0, // angle은 더 이상 사용하지 않지만 호환성을 위해 유지
            cx: data.cx,
            cy: data.cy,
            scale: data.scale,
            rotate: data.rotate,
            // 라벨 캘리브레이션이 있으면 사용, 없으면 기본값 사용
            // null 값도 유효한 값으로 처리 (명시적으로 null로 설정된 경우)
            labelX: labelData?.labelX !== undefined ? labelData.labelX : (data.labelX !== undefined ? data.labelX : undefined),
            labelY: labelData?.labelY !== undefined ? labelData.labelY : (data.labelY !== undefined ? data.labelY : undefined),
            labelOffset: labelData?.labelOffset !== undefined ? labelData.labelOffset : (data.labelOffset || 25),
            // 기호 텍스트 캘리브레이션 (딩만) - RS
            symbolX: labelData?.symbolX !== undefined ? labelData.symbolX : (data.symbolX !== undefined ? data.symbolX : undefined),
            symbolY: labelData?.symbolY !== undefined ? labelData.symbolY : (data.symbolY !== undefined ? data.symbolY : undefined),
            symbolOffset: labelData?.symbolOffset !== undefined ? labelData.symbolOffset : (data.symbolOffset !== undefined ? data.symbolOffset : undefined),
            // 기호 텍스트 캘리브레이션 (딩만) - LS
            symbolLeftX: labelData?.symbolLeftX !== undefined ? labelData.symbolLeftX : (data.symbolLeftX !== undefined ? data.symbolLeftX : undefined),
            symbolLeftY: labelData?.symbolLeftY !== undefined ? labelData.symbolLeftY : (data.symbolLeftY !== undefined ? data.symbolLeftY : undefined),
            symbolLeftOffset: labelData?.symbolLeftOffset !== undefined ? labelData.symbolLeftOffset : (data.symbolLeftOffset !== undefined ? data.symbolLeftOffset : undefined),
            // 기호 텍스트 캘리브레이션 (딩만) - H
            symbolBottomX: labelData?.symbolBottomX !== undefined ? labelData.symbolBottomX : (data.symbolBottomX !== undefined ? data.symbolBottomX : undefined),
            symbolBottomY: labelData?.symbolBottomY !== undefined ? labelData.symbolBottomY : (data.symbolBottomY !== undefined ? data.symbolBottomY : undefined),
            symbolBottomOffset: labelData?.symbolBottomOffset !== undefined ? labelData.symbolBottomOffset : (data.symbolBottomOffset !== undefined ? data.symbolBottomOffset : undefined),
            // 피치 텍스트 캘리브레이션
            // pitchTextX/pitchTextY가 null이면 undefined로 설정하여 톤필드 위치와 분리
            // null은 명시적으로 "톤필드 위치 사용 안 함"을 의미
            pitchTextX: labelData?.pitchTextX !== undefined && labelData.pitchTextX !== null ? labelData.pitchTextX : (data.pitchTextX !== undefined && data.pitchTextX !== null ? data.pitchTextX : data.cx),
            pitchTextY: labelData?.pitchTextY !== undefined && labelData.pitchTextY !== null ? labelData.pitchTextY : (data.pitchTextY !== undefined && data.pitchTextY !== null ? data.pitchTextY : data.cy),
            pitchTextScale: labelData?.pitchTextScale !== undefined ? labelData.pitchTextScale : (data.pitchTextScale !== undefined ? data.pitchTextScale : undefined),
            pitchTextRotate: labelData?.pitchTextRotate !== undefined ? labelData.pitchTextRotate : (data.pitchTextRotate !== undefined ? data.pitchTextRotate : undefined),
        };
    });
};

// 톤필드 컴포넌트 Props
interface ToneFieldProps {
    note: NoteData;
    isSelected: boolean;
    onSelect: () => void;
    isCalibrationEnabled?: boolean;
    onUpdateNote?: (id: number, updates: Partial<NoteData>) => void;
    svgRef?: React.RefObject<SVGSVGElement>;
}

// 톤필드 컴포넌트
const ToneField: React.FC<ToneFieldProps> = ({ note, isSelected, onSelect, isCalibrationEnabled = true, onUpdateNote, svgRef }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [triggerRipple, setTriggerRipple] = useState(false);

    const cx = note.cx || 500;
    const cy = note.cy || 500;
    const baseScale = note.scale || 100; // 기본 스케일값
    const rotate = note.rotate || 0;

    // scale 기반으로 rx, ry 계산 (비율 유지) - 크기 변화 없음
    const baseRx = baseScale * TONEFIELD_RATIO_X;
    const baseRy = baseScale * TONEFIELD_RATIO_Y;

    // 딤플 사이즈: 톤필드 타원의 35% 비율
    const dimpleRx = baseRx * 0.35;
    const dimpleRy = baseRy * 0.35;

    // 호버/클릭 시 색상 변화 - 황동(Brass) 금속 그라데이션 사용
    const isDing = note.label === 'D';
    // 모든 톤필드는 동일한 황동 그라데이션 사용
    const currentFill = 'url(#toneFieldMetalGradient)';
    const currentDimpleFill = 'url(#dimpleGradient)';

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(true);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
        // 일반 클릭 시 리플 효과 트리거 (캘리브레이션 Off일 때도 유지)
        setTriggerRipple(true);
        setTimeout(() => {
            setTriggerRipple(false);
        }, 800); // 애니메이션 시간(0.8s) 후 리플 제거
        // 캘리브레이션 On일 때만 선택
        if (isCalibrationEnabled) {
            onSelect();
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsActive(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        setIsActive(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation();
        setIsActive(false);
        // 리플 효과 트리거
        setTriggerRipple(true);
        setTimeout(() => {
            setTriggerRipple(false);
        }, 800); // 애니메이션 시간(0.8s) 후 리플 제거
        onSelect();
    };

    // 선택된 노트는 빨간색 테두리, 기본은 stroke 제거하여 그라데이션만으로 자연스러운 블렌딩
    const strokeColor = isSelected ? '#ef4444' : 'none';
    const strokeWidth = isSelected ? '3' : '0';
    const strokeOpacity = isSelected ? '1' : '0';

    // 상태에 따른 transform과 filter
    // Active 상태: scale(0.98) + brightness(1.25) sepia(0.2)
    // Hover 상태: brightness(1.1)만 (움직임 없음)
    // Default 상태: 기본값
    const scaleValue = isActive ? 0.98 : 1;
    // SVG transform 속성 사용: translate로 중심점 이동 -> rotate -> scale -> 다시 원위치로 translate
    const svgTransform = `translate(${cx}, ${cy}) rotate(${rotate}) scale(${scaleValue}) translate(${-cx}, ${-cy})`;

    let activeFilter = 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))';
    if (isActive) {
        activeFilter = 'brightness(1.25) sepia(0.2) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))';
    } else if (isHovered) {
        activeFilter = 'brightness(1.1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))';
    }

    const activeTransition = isActive ? 'none' : 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';



    return (
        <g
            className="tone-field-group"
            transform={svgTransform}
            style={{
                cursor: isCalibrationEnabled ? 'pointer' : 'pointer',
                transition: activeTransition,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Outer Shape - 톤필드 영역 */}
            <ellipse
                cx={cx}
                cy={cy}
                rx={baseRx}
                ry={baseRy}
                fill={currentFill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                className="tone-field-ellipse"
                style={{
                    filter: activeFilter,
                    transition: activeTransition,
                }}
            />

            {/* Inner Dimple */}
            <ellipse
                cx={cx}
                cy={cy}
                rx={dimpleRx}
                ry={dimpleRy}
                fill={currentDimpleFill}
                stroke={strokeColor}
                strokeWidth={isSelected ? "2" : "1"}
                className="tone-field-dimple"
                style={{
                    transition: activeTransition,
                }}
            />


            {/* Sound Ripple Effect */}
            {triggerRipple && (
                <ellipse
                    cx={cx}
                    cy={cy}
                    rx={baseRx}
                    ry={baseRy}
                    fill="none"
                    stroke="#90EE90"
                    strokeWidth="4"
                    className="sound-ripple"
                    style={{
                        pointerEvents: 'none',
                        transformOrigin: 'center',
                        transformBox: 'fill-box',
                    }}
                />
            )}
        </g>
    );
};

// 라벨 컴포넌트 (톤필드 외부에 배치)
interface LabelProps {
    note: NoteData;
    rx: number;
    ry: number;
    rotate: number;
    isSelected: boolean;
    onSelect: () => void;
    isCalibrationEnabled?: boolean;
    activeTemplateCount?: number | string;
    selectedTemplate?: number | string | null;
    scale?: Scale | null;
}

const ToneFieldLabel: React.FC<LabelProps> = ({ note, rx, ry, rotate, isSelected, onSelect, isCalibrationEnabled = true, activeTemplateCount = 9, selectedTemplate = null, scale = null }) => {
    const cx = note.cx || 500;
    const cy = note.cy || 500;

    // 타원의 가장 아래쪽(World Y기준) 좌표를 계산하는 함수
    const calculateEllipseBottom = (cx: number, cy: number, rx: number, ry: number, rotateDeg: number) => {
        const phi = (rotateDeg * Math.PI) / 180;
        // tan(theta) = (Ry/Rx) * cot(phi)
        // phi가 0 또는 180도 근처일 때(cot가 무한대) 처리
        if (Math.abs(Math.sin(phi)) < 1e-6) {
            return { x: cx, y: cy + ry };
        }

        const tanTheta = (ry / rx) / Math.tan(phi);
        const theta1 = Math.atan(tanTheta);
        const theta2 = theta1 + Math.PI;

        // 두 후보 지점 중 Y가 더 큰(화면 아래쪽) 점 선택
        const getPoint = (theta: number) => ({
            x: cx + rx * Math.cos(theta) * Math.cos(phi) - ry * Math.sin(theta) * Math.sin(phi),
            y: cy + rx * Math.cos(theta) * Math.sin(phi) + ry * Math.sin(theta) * Math.cos(phi)
        });

        const p1 = getPoint(theta1);
        const p2 = getPoint(theta2);

        return p1.y > p2.y ? p1 : p2;
    };

    // 라벨 위치 계산: 직접 지정된 좌표가 있으면 사용, 없으면 기본 계산 (타원 최하단)
    const defaultOffset = note.labelOffset || 25;

    // 계산된 최하단 좌표
    const bottomPoint = calculateEllipseBottom(cx, cy, rx, ry, rotate);

    // labelX/labelY가 명시적으로 있으면 사용, 없으면 계산된 최하단 좌표 사용
    const labelX = (note.labelX !== null && note.labelX !== undefined) ? note.labelX : bottomPoint.x;
    const labelY = (note.labelY !== null && note.labelY !== undefined) ? note.labelY : (bottomPoint.y + defaultOffset);

    // 폰트 사이즈 (60% 상향: 18 * 1.6 = 28.8)
    const fontSize = 28.8;

    const handleClick = (e: React.MouseEvent) => {
        if (!isCalibrationEnabled) return;
        e.stopPropagation();
        onSelect();
    };

    // 11 템플릿일 때 label 매핑
    const getDisplayLabel = (): string => {
        if (activeTemplateCount === 11) {
            // 11 템플릿 매핑: 왼쪽 하판 딩(10) → "1", 우측 하판 딩(11) → "2", 가운데 딩(0) → "3", Top 노트(1-8) → "4-11"
            if (note.id === 10) return '1';
            if (note.id === 11) return '2';
            if (note.id === 0) return '3';
            if (note.id >= 1 && note.id <= 8) {
                return String(note.id + 3); // 1→4, 2→5, ..., 8→11
            }
        }
        // 15 템플릿일 때 label 매핑 (D Asha 15)
        if (activeTemplateCount === 15 || selectedTemplate === 15) {
            if (scale?.id === 'd_asha_15_mutant') {
                // D Asha 15 실제 배열 순서: D3(0)→1, E3(10)→2, F#3(11)→3, G3(14)→4, A3(1)→5, B3(2)→6, C#4(3)→7, D4(4)→8, E4(5)→9, F#4(6)→10, G4(7)→11, A4(8)→12, B4(9)→13, C#5(12)→14, D5(13)→15
                if (note.id === 0) return '1'; // 딩 D3
                if (note.id === 10) return '2'; // 하판 좌측 E3
                if (note.id === 11) return '3'; // 하판 우측 F#3
                if (note.id === 14) return '4'; // 하판 추가 G3
                if (note.id === 1) return '5'; // 상판 A3
                if (note.id === 2) return '6'; // 상판 B3
                if (note.id === 3) return '7'; // 상판 C#4
                if (note.id === 4) return '8'; // 상판 D4
                if (note.id === 5) return '9'; // 상판 E4
                if (note.id === 6) return '10'; // 상판 F#4
                if (note.id === 7) return '11'; // 상판 G4
                if (note.id === 8) return '12'; // 상판 A4
                if (note.id === 9) return '13'; // 상판 B4
                if (note.id === 12) return '14'; // 상판 C#5
                if (note.id === 13) return '15'; // 상판 D5
            }
        }
        // F# Low Pygmy 18 특별 매핑
        if (scale?.id === 'fs_low_pygmy_18_mutant' && (activeTemplateCount === '14M' || activeTemplateCount === 18 || selectedTemplate === '14M' || selectedTemplate === 18)) {
            // ID 13은 항상 '7'로 표시
            if (note.id === 13) {
                return '7';
            }
            // F# Low Pygmy 18: label '16'을 가진 톤필드는 '6'으로 표시
            if (note.label === '16') {
                return '6';
            }
            // ID 12는 '14'로 표시
            if (note.id === 12) {
                return '14';
            }
            // 기존 매핑 유지
            const labelMapping: { [key: number]: string } = {
                10: '1',  // D3
                11: '2',  // E3
                0: '3',   // F#3
                1: '4',   // G#3
                2: '5',   // A3
                12: '6',  // B3 -> '14'로 변경됨
                13: '7',  // C#4
                3: '8',   // D4
                4: '9',   // E4
                5: '10',  // F#4
                6: '11',  // G#4
                7: '12',  // A4
                14: '13', // B4
                15: '14', // C#5
                8: '15',  // D5
                9: '16',  // E5 -> '6'으로 변경됨
                16: '17', // F#5
                17: '18', // G#5
            };
            if (labelMapping[note.id] !== undefined) {
                return labelMapping[note.id];
            }
        }
        // 12N, 14N, 14M 템플릿일 때 label 매핑
        if (selectedTemplate === '12N' || activeTemplateCount === '12N' ||
            selectedTemplate === '14N' || activeTemplateCount === '14N' ||
            selectedTemplate === '14M' || activeTemplateCount === '14M' ||
            (activeTemplateCount === 12 && scale && scale.notes.top.length === 9 && scale.notes.bottom.length === 2)) {
            // D Kurd 12 특별 매핑: 딩(0) → "1", 하판 좌측 F3(10) → "2", 하판 우측 G3(11) → "3", Top 노트 → "4"-"12"
            if (scale?.id === 'd_kurd_12') {
                if (note.id === 0) return '1';
                if (note.id === 10) return '2'; // 하판 좌측 F3
                if (note.id === 11) return '3'; // 하판 우측 G3
                // Top 노트 매핑: A3→4, Bb3→5, C4→6, D4→7, E4→8, F4→9, G4→10, A4→11, C5→12
                const dKurd12TopMapping: { [key: number]: string } = {
                    1: '4',  // A3
                    2: '5',  // Bb3
                    3: '6',  // C4
                    4: '7',  // D4
                    5: '8',  // E4
                    6: '9',  // F4
                    7: '10', // G4
                    8: '11', // A4
                    9: '12'  // C5
                };
                if (note.id >= 1 && note.id <= 9) {
                    return dKurd12TopMapping[note.id] || String(note.id + 3);
                }
            }
            // C# Deepasia 14 특별 매핑
            else if (scale?.id === 'cs_deepasia_14') {
                // 딩(0) → "1", 하판 좌측(10) → "2", 하판 우측(11) → "3", 상판 노트 → "4"-"12", 하판 추가(12) → "7", 하판 추가(13) → 표시 안 함
                if (note.id === 0) return '1'; // 딩
                if (note.id === 10) return '2'; // 하판 좌측 D#3
                if (note.id === 11) return '3'; // 하판 우측 F3
                if (note.id === 12) return '7'; // 하판 추가 D#4
                if (note.id === 13) return ''; // 하판 추가 F4 - 라벨 표시 안 함
                // 상판 노트 매핑: G#3→4, A#3→5, C#4→6, F4→7(이미 12가 7), F#4→8, G#4→9, C#5→9, D#5→10, F5→11, (추가)→12
                const csDeepasia14TopMapping: { [key: number]: string } = {
                    1: '4',  // G#3
                    2: '5',  // A#3
                    3: '6',  // C#4
                    4: '9',  // G#4 (요청: x="187" y="461" → "9")
                    5: '8',  // F#4
                    6: '9',  // C#5 (요청: x="202" y="458" → "9", "10"에서 "9"로 변경)
                    7: '10', // D#5 (요청: x="659.8155838963952" y="295" → "10", "11"에서 "10"으로 변경)
                    8: '11', // F5 (요청: x="349.8476531460914" y="295" → "11", "12"에서 "11"로 변경)
                    9: '12'  // (요청: x="501" y="253" → "12", "13"에서 "12"로 변경)
                };
                if (note.id >= 1 && note.id <= 9) {
                    return csDeepasia14TopMapping[note.id] || String(note.id + 3);
                }
            }
            // 일반 12N/14N/14M 템플릿 매핑: 하판 좌측 베이스(10) → "1", 하판 우측 베이스(11) → "2", 딩(0) → "3", Top 노트(1-9) → "4"-"12"
            else {
                // F# Low Pygmy 18의 경우 ID 13은 '7'로 표시 (이미 위에서 처리됨)
                if (scale?.id === 'fs_low_pygmy_18_mutant' && note.id === 13) {
                    return '7';
                }
                if (note.id === 10) return '1';
                if (note.id === 11) return '2';
                if (note.id === 0) return '3';
                if (note.id >= 1 && note.id <= 9) {
                    return String(note.id + 3); // 1→4, 2→5, ..., 9→12
                }
                // 14N/14M 추가 노트
                if (note.id === 12) return '13';
                if (note.id === 13) return '14';
            }
        }
        // 그 외의 경우 기본 label 사용
        return note.label;
    };

    const displayLabel = getDisplayLabel();
    
    // 빈 문자열이면 렌더링하지 않음
    if (!displayLabel) {
        return null;
    }
    
    return (
        <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="hanging"
            fill={isSelected ? "#ef4444" : "#C2A164"}
            fontSize={fontSize}
            fontWeight="bold"
            opacity={isSelected ? "1" : "0.9"}
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{
                cursor: 'pointer',
                transition: 'fill 0.2s ease, opacity 0.2s ease',
                textShadow: isSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}
            onClick={handleClick}
        >
            {displayLabel}
        </text>
    );
};

interface MiniDigiPanProps {
    scale?: Scale | null;
    language?: Language;
}

export default function MiniDigiPan({ scale = null, language = 'ko' }: MiniDigiPanProps) {
    const { theme } = useTheme();
    const t = TRANSLATIONS[language];
    const centerX = 500;
    const centerY = 500;
    const svgRef = useRef<SVGSVGElement>(null);

    // 스케일이 지원되는 템플릿에 맞는지 확인 (9, 10, 11, 12, 14, 15, 18 notes)
    const isCompatibleScale = useMemo(() => {
        if (!scale) return false;
        const totalNotes = scale.notes.top.length + scale.notes.bottom.length + 1; // 딩 + Top + Bottom
        const supportedCounts = [9, 10, 11, 12, 14, 15, 18];
        // 지원되는 노트 개수와 일치하는 경우
        if (!supportedCounts.includes(totalNotes)) return false;

        // 11 notes 템플릿: 딩 1개 + Top 8개 + Bottom 2개
        if (totalNotes === 11) {
            return scale.notes.top.length === 8 && scale.notes.bottom.length === 2;
        }

        // 12 notes 템플릿 (12N): 딩 1개 + Top 9개 + Bottom 2개
        if (totalNotes === 12) {
            return scale.notes.top.length === 9 && scale.notes.bottom.length === 2;
        }

        // 14 notes 템플릿 (14N/14M)
        if (totalNotes === 14) {
            return true;
        }

        // 15 notes 템플릿
        if (totalNotes === 15) {
            return true;
        }

        // 18 notes 템플릿
        if (totalNotes === 18) {
            return true;
        }

        // 그 외 템플릿: bottom이 0이어야 함
        return scale.notes.bottom.length === 0;
    }, [scale]);

    // 템플릿 선택 상태 (다른 상태보다 먼저 선언되어야 함)
    const [selectedTemplate, setSelectedTemplate] = useState<number | string | null>(null);

    // 현재 활성화된 템플릿 개수 결정 (템플릿 선택 시 템플릿 개수, 아니면 스케일 기반 또는 9)
    const activeTemplateCount = useMemo(() => {
        if (selectedTemplate !== null) {
            // 12N과 12M은 모두 12로 처리하지 않고 문자열 그대로 반환하여 createInitialNotes에서 구분
            if (selectedTemplate === '12N' || selectedTemplate === '12M' || selectedTemplate === '14N' || selectedTemplate === '14M') {
                return selectedTemplate;
            }
            return typeof selectedTemplate === 'number' ? selectedTemplate : 12;
        }
        // 템플릿이 선택되지 않았을 때는 스케일 호환성에 따라 결정
        if (scale && isCompatibleScale) {
            // 총 노트 개수 계산 (딩 + Top + Bottom)
            const totalNotes = scale.notes.top.length + scale.notes.bottom.length + 1;
            // 11개 음 스케일의 경우 11 템플릿으로 설정
            if (totalNotes === 11) {
                return 11;
            }
            // 12개 음 스케일(상판 9개 + 하판 2개)의 경우 12N 템플릿으로 설정
            if (totalNotes === 12 && scale.notes.top.length === 9 && scale.notes.bottom.length === 2) {
                return '12N'; // 12N 템플릿 사용
            }
            // 14개 음 스케일
            if (totalNotes === 14) {
                // F# Low Pygmy 14 (Mutant) -> 14M
                if (scale.id.includes('mutant')) {
                    return '14M';
                }
                // C# Deepasia 14, E Equinox 14 (Normal) -> 14N
                return '14N';
            }
            // 15개 음 스케일
            if (totalNotes === 15) {
                return 15;
            }
            // 18개 음 스케일 -> 14M 템플릿 사용
            if (totalNotes === 18) {
                return '14M';
            }
            // 15개 음 스케일
            if (totalNotes === 15) {
                return 15;
            }
            // 18개 음 스케일
            if (totalNotes === 18) {
                return 18;
            }
            // 그 외의 경우 딩 + Top 노트 개수
            return scale.notes.top.length + 1;
        }
        return 9; // 기본값
    }, [selectedTemplate, scale, isCompatibleScale]);

    // 초기 노트 데이터를 useState로 관리 (템플릿 개수에 따라, 초기값은 9)
    const [notes, setNotes] = useState<NoteData[]>(() => {
        // 초기 렌더링 시에는 기본값 9 사용 (나중에 useEffect에서 업데이트됨)
        return createInitialNotes(centerX, centerY, 9, scale);
    });
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);
    const [selectedSymbolId, setSelectedSymbolId] = useState<number | null>(null); // RS 기호 선택 (딩만)
    const [selectedLeftSymbolId, setSelectedLeftSymbolId] = useState<number | null>(null); // LS 기호 선택 (딩만)
    const [selectedBottomSymbolId, setSelectedBottomSymbolId] = useState<number | null>(null); // H 기호 선택 (딩만)
    const [selectedPitchId, setSelectedPitchId] = useState<number | null>(null);
    const [copyButtonText, setCopyButtonText] = useState<string>('Copy JSON Config');
    const [copyLabelButtonText, setCopyLabelButtonText] = useState<string>('Copy JSON Config');
    const [saveButtonText, setSaveButtonText] = useState<string>('배치 저장');
    const [isToneFieldPanelExpanded, setIsToneFieldPanelExpanded] = useState<boolean>(false);
    const [isLabelPanelExpanded, setIsLabelPanelExpanded] = useState<boolean>(false);
    const [isPitchPanelExpanded, setIsPitchPanelExpanded] = useState<boolean>(false);
    const [isCalibrationEnabled, setIsCalibrationEnabled] = useState<boolean>(true);
    const [showDeveloperTools, setShowDeveloperTools] = useState<boolean>(false);

    // 선택된 노트를 useMemo로 메모이제이션하여 notes 변경 시 자동 업데이트
    const selectedNote = useMemo(() => {
        if (selectedNoteId === null) return null;
        return notes.find(note => note.id === selectedNoteId) || null;
    }, [notes, selectedNoteId]);

    // 선택된 라벨 노트를 useMemo로 메모이제이션하여 notes 변경 시 자동 업데이트
    const selectedLabelNote = useMemo(() => {
        if (selectedLabelId === null) return null;
        return notes.find(note => note.id === selectedLabelId) || null;
    }, [notes, selectedLabelId]);

    // 선택된 기호 노트를 useMemo로 메모이제이션 (RS 기호용)
    const selectedSymbolNote = useMemo(() => {
        if (selectedSymbolId === null) return null;
        return notes.find(note => note.id === selectedSymbolId) || null;
    }, [notes, selectedSymbolId]);

    // 선택된 왼쪽 기호 노트를 useMemo로 메모이제이션 (LS 기호용)
    const selectedLeftSymbolNote = useMemo(() => {
        if (selectedLeftSymbolId === null) return null;
        return notes.find(note => note.id === selectedLeftSymbolId) || null;
    }, [notes, selectedLeftSymbolId]);

    // 선택된 하단 기호 노트를 useMemo로 메모이제이션 (H 기호용)
    const selectedBottomSymbolNote = useMemo(() => {
        if (selectedBottomSymbolId === null) return null;
        return notes.find(note => note.id === selectedBottomSymbolId) || null;
    }, [notes, selectedBottomSymbolId]);

    // 기호 텍스트 패널에서 사용할 선택된 노트 (라벨 또는 기호)
    const selectedSymbolTextNote = useMemo(() => {
        return selectedBottomSymbolNote || selectedLeftSymbolNote || selectedSymbolNote || selectedLabelNote;
    }, [selectedBottomSymbolNote, selectedLeftSymbolNote, selectedSymbolNote, selectedLabelNote]);

    // 선택된 피치 노트를 useMemo로 메모이제이션하여 notes 변경 시 자동 업데이트
    const selectedPitchNote = useMemo(() => {
        if (selectedPitchId === null) return null;
        return notes.find(note => note.id === selectedPitchId) || null;
    }, [notes, selectedPitchId]);

    // 선택된 라벨의 기본 Y 위치 계산
    const defaultLabelY = useMemo(() => {
        if (!selectedLabelNote) return 500;
        const cy = selectedLabelNote.cy || 500;
        const scale = selectedLabelNote.scale || 100;
        const ry = scale * TONEFIELD_RATIO_Y;
        const offset = selectedLabelNote.labelOffset || 25;
        return cy + ry + offset;
    }, [selectedLabelNote]);

    // 톤필드 선택 시 패널 자동 확장
    useEffect(() => {
        if (selectedNoteId !== null) {
            setIsToneFieldPanelExpanded(true);
        }
    }, [selectedNoteId]);

    // 라벨 또는 기호 선택 시 패널 자동 확장
    useEffect(() => {
        if (selectedLabelId !== null || selectedSymbolId !== null || selectedLeftSymbolId !== null || selectedBottomSymbolId !== null) {
            setIsLabelPanelExpanded(true);
        }
    }, [selectedLabelId, selectedSymbolId, selectedLeftSymbolId, selectedBottomSymbolId]);

    // 피치 선택 시 패널 자동 확장
    useEffect(() => {
        if (selectedPitchId !== null) {
            setIsPitchPanelExpanded(true);
        }
    }, [selectedPitchId]);

    // 템플릿이 변경될 때마다 해당 템플릿의 캘리브레이션을 로드하여 notes 업데이트
    useEffect(() => {
        // selectedTemplate이 있으면 그것을 사용
        // 없으면 activeTemplateCount 사용하되, 12개 음 스케일(상판 9개 + 하판 2개)인 경우 '12N' 사용
        let templateKey: number | string;
        if (selectedTemplate !== null) {
            templateKey = selectedTemplate;
        } else if (scale && isCompatibleScale) {
            const totalNotes = scale.notes.top.length + scale.notes.bottom.length + 1;
            // 12개 음 스케일이고 상판 9개 + 하판 2개인 경우 '12N' 템플릿 사용
            if (totalNotes === 12 && scale.notes.top.length === 9 && scale.notes.bottom.length === 2) {
                templateKey = '12N';
            } else {
                templateKey = activeTemplateCount;
            }
        } else {
            templateKey = activeTemplateCount;
        }
        let loadedNotes = createInitialNotes(centerX, centerY, templateKey, scale);

        // localStorage에서 C# Pygmy 11의 설정값 불러오기 (11 템플릿)
        const csPygmy11ToneFieldKey = `minidigipan_tonefield_calibration_11`;
        const csPygmy11LabelKey = `minidigipan_label_calibration_11`;
        const csPygmy11ToneFieldCalibration = loadCalibrationFromStorage(csPygmy11ToneFieldKey);
        const csPygmy11LabelCalibration = loadCalibrationFromStorage(csPygmy11LabelKey);

        // C# Pygmy 11의 하판 베이스 노트 설정값 추출
        let csPygmy11BottomSettings = null;
        if (csPygmy11ToneFieldCalibration) {
            const note10 = csPygmy11ToneFieldCalibration.find((n: any) => n.id === 10);
            const note11 = csPygmy11ToneFieldCalibration.find((n: any) => n.id === 11);
            if (note10 && note11) {
                const label10 = csPygmy11LabelCalibration?.find((n: any) => n.id === 10);
                const label11 = csPygmy11LabelCalibration?.find((n: any) => n.id === 11);
                csPygmy11BottomSettings = {
                    note10: {
                        cx: note10.cx,
                        cy: note10.cy,
                        scale: note10.scale,
                        rotate: note10.rotate,
                        labelX: label10?.labelX ?? note10.labelX,
                        labelY: label10?.labelY ?? note10.labelY,
                    },
                    note11: {
                        cx: note11.cx,
                        cy: note11.cy,
                        scale: note11.scale,
                        rotate: note11.rotate,
                        labelX: label11?.labelX ?? note11.labelX,
                        labelY: label11?.labelY ?? note11.labelY,
                    }
                };
            }
        }

        // F Low Pygmy 12, D Kurd 12, E Equinox 12에 C# Pygmy 11의 하판 베이스 노트 설정 적용
        if (csPygmy11BottomSettings && (scale?.id === 'f_low_pygmy_12' || scale?.id === 'd_kurd_12' || scale?.id === 'e_equinox_12')) {
            loadedNotes = loadedNotes.map(note => {
                if (note.id === 10) {
                    // C# Pygmy 11의 하판 좌측 베이스 노트 설정 적용
                    return {
                        ...note,
                        cx: csPygmy11BottomSettings.note10.cx,
                        cy: csPygmy11BottomSettings.note10.cy,
                        scale: csPygmy11BottomSettings.note10.scale,
                        rotate: csPygmy11BottomSettings.note10.rotate,
                        labelX: csPygmy11BottomSettings.note10.labelX,
                        labelY: csPygmy11BottomSettings.note10.labelY,
                    };
                } else if (note.id === 11) {
                    // C# Pygmy 11의 하판 우측 베이스 노트 설정 적용
                    return {
                        ...note,
                        cx: csPygmy11BottomSettings.note11.cx,
                        cy: csPygmy11BottomSettings.note11.cy,
                        scale: csPygmy11BottomSettings.note11.scale,
                        rotate: csPygmy11BottomSettings.note11.rotate,
                        labelX: csPygmy11BottomSettings.note11.labelX,
                        labelY: csPygmy11BottomSettings.note11.labelY,
                    };
                }
                return note;
            });
        }

        // D Kurd 12의 경우 하판 F3와 G3 톤필드 위치 교체 (C# Pygmy 11 설정 적용 후)
        if (scale?.id === 'd_kurd_12') {
            const note10Current = loadedNotes.find(n => n.id === 10);
            const note11Current = loadedNotes.find(n => n.id === 11);
            if (note10Current && note11Current) {
                loadedNotes = loadedNotes.map(note => {
                    if (note.id === 10) {
                        // id 10 (하판 좌측)을 id 11의 위치로 이동
                        return {
                            ...note,
                            cx: note11Current.cx,
                            cy: note11Current.cy,
                            rotate: note11Current.rotate,
                            labelX: note11Current.labelX,
                            labelY: note11Current.labelY,
                        };
                    } else if (note.id === 11) {
                        // id 11 (하판 우측)을 id 10의 위치로 이동
                        return {
                            ...note,
                            cx: note10Current.cx,
                            cy: note10Current.cy,
                            rotate: note10Current.rotate,
                            labelX: note10Current.labelX,
                            labelY: note10Current.labelY,
                        };
                    }
                    return note;
                });
            }
        }

        setNotes(loadedNotes);
        // 선택 상태 초기화
        setSelectedNoteId(null);
        setSelectedLabelId(null);
        setSelectedSymbolId(null);
        setSelectedLeftSymbolId(null);
        setSelectedBottomSymbolId(null);
        setSelectedPitchId(null);
    }, [selectedTemplate, activeTemplateCount, scale, isCompatibleScale, centerX, centerY]);

    // API에서 레이아웃 불러오기 (비동기)
    useEffect(() => {
        const loadLayoutFromApi = async () => {
            if (!scale) return;
            try {
                const response = await fetch(`/api/get-layout?scaleId=${scale.id}`);
                if (response.ok) {
                    const layoutData = await response.json();
                    if (Array.isArray(layoutData) && layoutData.length > 0) {
                        setNotes(layoutData);
                    }
                }
            } catch (error) {
                console.error('Failed to load layout from API:', error);
            }
        };

        if (scale) {
            loadLayoutFromApi();
        }
    }, [scale]);

    // 노트 업데이트 함수 (자동으로 localStorage에 저장, 템플릿별로 독립 저장)
    const updateNote = (id: number, updates: Partial<NoteData>) => {
        setNotes(prevNotes => {
            const updatedNotes = prevNotes.map(note =>
                note.id === id ? { ...note, ...updates } : note
            );

            // 템플릿별로 독립적인 localStorage 키 사용 (selectedTemplate 우선)
            // 스케일이 있으면 스케일 ID를 우선 사용 (개별 저장)
            const templateKey = selectedTemplate !== null ? selectedTemplate : activeTemplateCount;
            const storageKeySuffix = scale ? `scale_${scale.id}` : templateKey;

            const toneFieldKey = `minidigipan_tonefield_calibration_${storageKeySuffix}`;
            const labelKey = `minidigipan_label_calibration_${storageKeySuffix}`;

            // 톤필드 캘리브레이션 자동 저장
            const toneFieldData = updatedNotes.map(({ id, label, cx, cy, scale, rotate }) => ({
                id,
                label,
                cx: cx || 500,
                cy: cy || 500,
                scale: scale || 100,
                rotate: rotate || 0,
            }));
            try {
                localStorage.setItem(toneFieldKey, JSON.stringify(toneFieldData));
            } catch (error) {
                console.error(`Failed to save tonefield calibration to localStorage (${toneFieldKey}):`, error);
            }

            // 라벨 캘리브레이션 자동 저장 (null 값도 명시적으로 저장)
            const labelData = updatedNotes.map((note) => ({
                id: note.id,
                label: note.label,
                labelX: note.labelX !== undefined ? note.labelX : null,
                labelY: note.labelY !== undefined ? note.labelY : null,
                labelOffset: note.labelOffset !== undefined ? note.labelOffset : 25,
                symbolX: note.symbolX !== undefined ? note.symbolX : null,
                symbolY: note.symbolY !== undefined ? note.symbolY : null,
                symbolOffset: note.symbolOffset !== undefined ? note.symbolOffset : null,
                symbolLeftX: note.symbolLeftX !== undefined ? note.symbolLeftX : null,
                symbolLeftY: note.symbolLeftY !== undefined ? note.symbolLeftY : null,
                symbolLeftOffset: note.symbolLeftOffset !== undefined ? note.symbolLeftOffset : null,
                symbolBottomX: note.symbolBottomX !== undefined ? note.symbolBottomX : null,
                symbolBottomY: note.symbolBottomY !== undefined ? note.symbolBottomY : null,
                symbolBottomOffset: note.symbolBottomOffset !== undefined ? note.symbolBottomOffset : null,
                pitchTextX: note.pitchTextX !== undefined ? note.pitchTextX : null,
                pitchTextY: note.pitchTextY !== undefined ? note.pitchTextY : null,
                pitchTextScale: note.pitchTextScale !== undefined ? note.pitchTextScale : null,
                pitchTextRotate: note.pitchTextRotate !== undefined ? note.pitchTextRotate : null,
            }));
            try {
                localStorage.setItem(labelKey, JSON.stringify(labelData));
            } catch (error) {
                console.error(`Failed to save label calibration to localStorage (${labelKey}):`, error);
            }

            return updatedNotes;
        });
    };

    // 톤필드 JSON 내보내기 및 localStorage 저장 (템플릿별로 독립 저장)
    const exportJson = () => {
        const exportData = notes.map(({ id, label, cx, cy, scale, rotate }) => ({
            id,
            label,
            cx: cx || 500,
            cy: cy || 500,
            scale: scale || 100,
            rotate: rotate || 0,
        }));

        const jsonString = JSON.stringify(exportData, null, 2);

        // 템플릿별로 독립적인 localStorage 키 사용 (selectedTemplate 우선)
        // 스케일이 있으면 스케일 ID를 우선 사용 (개별 저장)
        const templateKey = selectedTemplate !== null ? selectedTemplate : activeTemplateCount;
        const storageKeySuffix = scale ? `scale_${scale.id}` : templateKey;
        const toneFieldKey = `minidigipan_tonefield_calibration_${storageKeySuffix}`;
        try {
            localStorage.setItem(toneFieldKey, JSON.stringify(exportData));
        } catch (error) {
            console.error(`Failed to save tonefield calibration to localStorage (${toneFieldKey}):`, error);
        }

        // 클립보드에 복사
        navigator.clipboard.writeText(jsonString).then(() => {
            setCopyButtonText('저장 완료!');
            setTimeout(() => {
                setCopyButtonText('Copy JSON Config');
            }, 2000);
        }).catch(() => {
            // 클립보드 복사 실패 시 console.log
            console.log('=== MiniDigiPan ToneField Calibration Data ===');
            console.log(jsonString);
            setCopyButtonText('콘솔에 출력됨');
            setTimeout(() => {
                setCopyButtonText('Copy JSON Config');
            }, 2000);
        });
    };

    // 라벨 JSON 내보내기 및 localStorage 저장
    const exportLabelJson = () => {
        // H, LS, RS, 또는 D가 선택되었을 때는 해당 속성 포함
        const exportData = notes.map((note) => {
            if (selectedBottomSymbolId !== null && note.id === 0) {
                // H 선택 시: symbolBottom 속성 포함, label은 "H"
                return {
                    id: note.id,
                    label: 'H',
                    symbolBottomX: note.symbolBottomX !== undefined && note.symbolBottomX !== null ? note.symbolBottomX : null,
                    symbolBottomY: note.symbolBottomY !== undefined && note.symbolBottomY !== null ? note.symbolBottomY : null,
                    symbolBottomOffset: note.symbolBottomOffset !== undefined ? note.symbolBottomOffset : 15,
                };
            } else if (selectedLeftSymbolId !== null && note.id === 0) {
                // LS 선택 시: symbolLeft 속성 포함, label은 "LS"
                return {
                    id: note.id,
                    label: 'LS',
                    symbolLeftX: note.symbolLeftX !== undefined && note.symbolLeftX !== null ? note.symbolLeftX : null,
                    symbolLeftY: note.symbolLeftY !== undefined && note.symbolLeftY !== null ? note.symbolLeftY : null,
                    symbolLeftOffset: note.symbolLeftOffset !== undefined ? note.symbolLeftOffset : 15,
                };
            } else if (selectedSymbolId !== null && note.id === 0) {
                // RS 선택 시: symbol 속성 포함, label은 "RS"
                return {
                    id: note.id,
                    label: 'RS',
                    symbolX: note.symbolX !== undefined && note.symbolX !== null ? note.symbolX : null,
                    symbolY: note.symbolY !== undefined && note.symbolY !== null ? note.symbolY : null,
                    symbolOffset: note.symbolOffset !== undefined ? note.symbolOffset : 15,
                };
            } else if (note.id === 0) {
                // 딩이지만 H, RS나 LS가 선택되지 않았을 때: label 속성 포함, label은 "D"
                return {
                    id: note.id,
                    label: note.label,
                    labelX: note.labelX !== undefined && note.labelX !== null ? note.labelX : null,
                    labelY: note.labelY !== undefined && note.labelY !== null ? note.labelY : null,
                    labelOffset: note.labelOffset || 25,
                };
            } else {
                // 다른 노트: label 속성 포함
                return {
                    id: note.id,
                    label: note.label,
                    labelX: note.labelX !== undefined && note.labelX !== null ? note.labelX : null,
                    labelY: note.labelY !== undefined && note.labelY !== null ? note.labelY : null,
                    labelOffset: note.labelOffset || 25,
                };
            }
        });

        const jsonString = JSON.stringify(exportData, null, 2);

        // 템플릿별로 독립적인 localStorage 키 사용 (selectedTemplate 우선)
        // 스케일이 있으면 스케일 ID를 우선 사용 (개별 저장)
        const templateKey = selectedTemplate !== null ? selectedTemplate : activeTemplateCount;
        const storageKeySuffix = scale ? `scale_${scale.id}` : templateKey;
        const labelKey = `minidigipan_label_calibration_${storageKeySuffix}`;
        try {
            localStorage.setItem(labelKey, JSON.stringify(exportData));
        } catch (error) {
            console.error(`Failed to save label calibration to localStorage (${labelKey}):`, error);
        }

        // 클립보드에 복사
        navigator.clipboard.writeText(jsonString).then(() => {
            setCopyLabelButtonText('저장 완료!');
            setTimeout(() => {
                setCopyLabelButtonText('Copy JSON Config');
            }, 2000);
        }).catch(() => {
            // 클립보드 복사 실패 시 console.log
            console.log('=== MiniDigiPan Label Calibration Data ===');
            console.log(jsonString);
            setCopyLabelButtonText('콘솔에 출력됨');
            setTimeout(() => {
                setCopyLabelButtonText('Copy JSON Config');
            }, 2000);
        });
    };

    // 레이아웃 저장 함수 (API 호출 + localStorage 저장)
    const saveLayout = async () => {
        if (!scale) {
            setSaveButtonText('스케일 정보 없음');
            setTimeout(() => {
                setSaveButtonText('배치 저장');
            }, 2000);
            return;
        }

        // localStorage에도 저장 (스케일별로 독립 저장)
        const templateKey = selectedTemplate !== null ? selectedTemplate : activeTemplateCount;
        const storageKeySuffix = `scale_${scale.id}`;
        const toneFieldKey = `minidigipan_tonefield_calibration_${storageKeySuffix}`;
        const labelKey = `minidigipan_label_calibration_${storageKeySuffix}`;

        // 톤필드 캘리브레이션 저장
        const toneFieldData = notes.map(({ id, label, cx, cy, scale, rotate }) => ({
            id,
            label,
            cx: cx || 500,
            cy: cy || 500,
            scale: scale || 100,
            rotate: rotate || 0,
        }));
        try {
            localStorage.setItem(toneFieldKey, JSON.stringify(toneFieldData));
        } catch (error) {
            console.error(`Failed to save tonefield calibration to localStorage (${toneFieldKey}):`, error);
        }

        // 라벨 캘리브레이션 저장 (피치 텍스트 포함)
        const labelData = notes.map((note) => ({
            id: note.id,
            label: note.label,
            labelX: note.labelX !== undefined ? note.labelX : null,
            labelY: note.labelY !== undefined ? note.labelY : null,
            labelOffset: note.labelOffset !== undefined ? note.labelOffset : 25,
            symbolX: note.symbolX !== undefined ? note.symbolX : null,
            symbolY: note.symbolY !== undefined ? note.symbolY : null,
            symbolOffset: note.symbolOffset !== undefined ? note.symbolOffset : null,
            symbolLeftX: note.symbolLeftX !== undefined ? note.symbolLeftX : null,
            symbolLeftY: note.symbolLeftY !== undefined ? note.symbolLeftY : null,
            symbolLeftOffset: note.symbolLeftOffset !== undefined ? note.symbolLeftOffset : null,
            symbolBottomX: note.symbolBottomX !== undefined ? note.symbolBottomX : null,
            symbolBottomY: note.symbolBottomY !== undefined ? note.symbolBottomY : null,
            symbolBottomOffset: note.symbolBottomOffset !== undefined ? note.symbolBottomOffset : null,
            pitchTextX: note.pitchTextX !== undefined ? note.pitchTextX : null,
            pitchTextY: note.pitchTextY !== undefined ? note.pitchTextY : null,
            pitchTextScale: note.pitchTextScale !== undefined ? note.pitchTextScale : null,
            pitchTextRotate: note.pitchTextRotate !== undefined ? note.pitchTextRotate : null,
        }));
        try {
            localStorage.setItem(labelKey, JSON.stringify(labelData));
        } catch (error) {
            console.error(`Failed to save label calibration to localStorage (${labelKey}):`, error);
        }

        // API에도 저장
        try {
            const response = await fetch('/api/save-layout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scaleId: scale.id,
                    layoutData: notes,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setSaveButtonText('저장 완료!');
                setTimeout(() => {
                    setSaveButtonText('배치 저장');
                }, 2000);
            } else {
                setSaveButtonText('저장 실패');
                setTimeout(() => {
                    setSaveButtonText('배치 저장');
                }, 2000);
            }
        } catch (error) {
            console.error('Error saving layout:', error);
            setSaveButtonText('오류 발생');
            setTimeout(() => {
                setSaveButtonText('배치 저장');
            }, 2000);
        }
    };


    // 패널 바깥 클릭 시 패널 닫기 및 선택 해제 핸들러
    const handleOutsideClick = (e: React.MouseEvent) => {
        // 패널이 하나도 열려있지 않으면 아무것도 하지 않음
        if (!isToneFieldPanelExpanded && !isLabelPanelExpanded && !isPitchPanelExpanded) {
            return;
        }

        // 패널 내부 클릭은 무시
        const target = e.target as HTMLElement;
        if (target.closest('.panel-container')) {
            return;
        }
        // SVG 영역 클릭은 무시 (톤필드/라벨 클릭은 ToneField/Label 컴포넌트에서 처리)
        if (target.closest('svg')) {
            return;
        }

        // 그 외 영역 클릭 시 패널 닫기 및 선택 해제
        setIsToneFieldPanelExpanded(false);
        setIsLabelPanelExpanded(false);
        setIsPitchPanelExpanded(false);
        setSelectedNoteId(null);
        setSelectedLabelId(null);
        setSelectedSymbolId(null);
        setSelectedLeftSymbolId(null);
        setSelectedBottomSymbolId(null);
        setSelectedPitchId(null);
    };

    return (
        <div
            className="glass-card rounded-2xl p-4 mb-4 relative overflow-hidden transition-opacity duration-150"
            onClick={handleOutsideClick}
        >
            <div className="flex flex-col gap-2">
                {/* 스케일 이름 또는 템플릿 제목 - 항상 표시 */}
                <div className="w-full max-w-[600px] mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {selectedTemplate !== null
                            ? `${selectedTemplate} Notes 템플릿`
                            : scale
                                ? scale.name
                                : '디지팬'}
                    </h2>
                </div>

                {/* 디지팬과 캘리브레이션 패널을 나란히 배치 */}
                <div className="flex flex-col gap-2 items-start">
                    {/* 핸드팬 SVG 영역 */}
                    <div
                        className="w-full max-w-[600px] mx-auto aspect-square relative border border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <svg
                            viewBox="-400 -400 1800 1800"
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 핸드팬 몸체 - 그라데이션 정의 */}
                            <defs>
                                {/* 핸드팬 몸체 - 따뜻하고 은은한 파스텔 로즈-코퍼(Soft Pastel Rose-Copper) 금속 질감 그라데이션 */}
                                <radialGradient id="bodyMetalGradient" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
                                    <stop offset="0%" stopColor="#C2A89C" />
                                    <stop offset="60%" stopColor="#9C8479" />
                                    <stop offset="100%" stopColor="#3D2E29" />
                                </radialGradient>

                                {/* 톤필드 - 따뜻하고 은은한 파스텔 로즈-코퍼(Soft Pastel Rose-Copper) 금속 질감 그라데이션 (반투명 엣지로 몸체와 자연스러운 블렌딩) */}
                                <radialGradient id="toneFieldMetalGradient" cx="50%" cy="50%" r="75%" fx="30%" fy="30%">
                                    <stop offset="0%" stopColor="#F5E8E0" />
                                    <stop offset="25%" stopColor="#D4B8A8" />
                                    <stop offset="50%" stopColor="#B89685" />
                                    <stop offset="90%" stopColor="#7A5F52" />
                                    <stop offset="100%" stopColor="#3D2E29" stopOpacity="0.4" />
                                </radialGradient>

                                {/* 딤플 - 따뜻하고 은은한 파스텔 로즈-코퍼(Soft Pastel Rose-Copper) 딤플 그라데이션 */}
                                <radialGradient id="dimpleGradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#3D2E29" />
                                    <stop offset="100%" stopColor="#7A5F52" />
                                </radialGradient>

                                {/* 림(Rim) - 평평한 금속 테두리 그라데이션 */}
                                <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="85%" stopColor="#8B6F62" />
                                    <stop offset="95%" stopColor="#A6897A" />
                                    <stop offset="100%" stopColor="#2F241F" />
                                </radialGradient>

                                {/* 호환성을 위한 기존 그라데이션 ID 유지 */}
                                <radialGradient id="handpanGradient" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
                                    <stop offset="0%" stopColor="#C2A89C" />
                                    <stop offset="60%" stopColor="#9C8479" />
                                    <stop offset="100%" stopColor="#3D2E29" />
                                </radialGradient>
                                <radialGradient id="handpanGradientDark" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
                                    <stop offset="0%" stopColor="#C2A89C" />
                                    <stop offset="60%" stopColor="#9C8479" />
                                    <stop offset="100%" stopColor="#3D2E29" />
                                </radialGradient>
                                <radialGradient id="noteGradient" cx="50%" cy="50%" r="65%" fx="30%" fy="30%">
                                    <stop offset="0%" stopColor="#F5E8E0" />
                                    <stop offset="25%" stopColor="#D4B8A8" />
                                    <stop offset="50%" stopColor="#B89685" />
                                    <stop offset="90%" stopColor="#7A5F52" />
                                    <stop offset="100%" stopColor="#3D2E29" />
                                </radialGradient>

                                <filter id="handpanShadow">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                    <feOffset dx="0" dy="4" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* 핸드팬 림(Rim) - 가장 아래 레이어 */}
                            <circle
                                cx={centerX}
                                cy={centerY}
                                r="498"
                                fill="url(#rimGradient)"
                                style={{
                                    transition: 'all 0.3s ease',
                                }}
                            />

                            {/* 핸드팬 몸체 */}
                            <circle
                                cx={centerX}
                                cy={centerY}
                                r="480"
                                fill="url(#bodyMetalGradient)"
                                stroke="#3D2E29"
                                strokeWidth="1"
                                style={{
                                    transition: 'all 0.3s ease',
                                    filter: 'url(#handpanShadow)',
                                }}
                            />

                            {/* 가이드라인 - 원 중앙을 가로지르는 가로선과 세로선 */}
                            <line
                                x1="-400"
                                y1={centerY}
                                x2="1400"
                                y2={centerY}
                                stroke="#ffffff"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                                opacity="0.6"
                                className="dark:stroke-white"
                            />
                            <line
                                x1={centerX}
                                y1="-400"
                                x2={centerX}
                                y2="1400"
                                stroke="#ffffff"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                                opacity="0.6"
                                className="dark:stroke-white"
                            />

                            {/* 톤필드 렌더링 */}
                            {notes.map((note) => {
                                const baseScale = note.scale || 100;
                                const baseRx = baseScale * TONEFIELD_RATIO_X;
                                const baseRy = baseScale * TONEFIELD_RATIO_Y;
                                const rotate = note.rotate || 0;

                                return (
                                    <g key={note.id}>
                                        <ToneField
                                            note={note}
                                            isSelected={note.id === selectedNoteId}
                                            onSelect={() => setSelectedNoteId(note.id)}
                                            isCalibrationEnabled={isCalibrationEnabled}
                                            onUpdateNote={updateNote}
                                            svgRef={svgRef}
                                        />
                                        <ToneFieldLabel
                                            note={note}
                                            rx={baseRx}
                                            ry={baseRy}
                                            rotate={rotate}
                                            isSelected={note.id === selectedLabelId && selectedSymbolId === null && selectedLeftSymbolId === null && selectedBottomSymbolId === null}
                                            onSelect={() => {
                                                setSelectedLabelId(note.id);
                                                setSelectedSymbolId(null); // RS 선택 해제
                                                setSelectedLeftSymbolId(null); // LS 선택 해제
                                                setSelectedBottomSymbolId(null); // H 선택 해제
                                            }}
                                            isCalibrationEnabled={isCalibrationEnabled}
                                            activeTemplateCount={activeTemplateCount}
                                            selectedTemplate={selectedTemplate}
                                            scale={scale}
                                        />
                                    </g>
                                );
                            })}

                            {/* 기호 텍스트 'RS' (딩의 3시 방향 외곽선 안쪽) */}
                            {(() => {
                                const dingNote = notes.find(note => note.id === 0);
                                if (!dingNote) return null;

                                const baseScale = dingNote.scale || 100;
                                const baseRx = baseScale * TONEFIELD_RATIO_X;
                                // RS/LS는 딩의 초기 위치(500, 500)를 기준으로 계산하여 딩 이동과 독립적으로 유지
                                const defaultDingCx = 500;
                                const defaultDingCy = 500;

                                // 3시 방향 외곽선 안쪽 위치 계산
                                const defaultOffset = dingNote.symbolOffset !== undefined ? dingNote.symbolOffset : 15; // 외곽선에서 안쪽으로의 오프셋
                                const symbolX = dingNote.symbolX !== undefined && dingNote.symbolX !== null
                                    ? dingNote.symbolX
                                    : (defaultDingCx + baseRx - defaultOffset);
                                const symbolY = dingNote.symbolY !== undefined && dingNote.symbolY !== null
                                    ? dingNote.symbolY
                                    : defaultDingCy;

                                const fontSize = 28.8; // 라벨과 동일한 폰트 사이즈
                                const isSymbolSelected = selectedSymbolId === 0;

                                return (
                                    <text
                                        x={symbolX}
                                        y={symbolY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={isSymbolSelected ? "#ef4444" : "#C2A164"}
                                        fontSize={fontSize}
                                        fontWeight="bold"
                                        opacity={isSymbolSelected ? "1" : "0.9"}
                                        fontFamily="system-ui, -apple-system, sans-serif"
                                        style={{
                                            cursor: isCalibrationEnabled ? 'pointer' : 'default',
                                            transition: 'fill 0.2s ease, opacity 0.2s ease',
                                            textShadow: isSymbolSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
                                        }}
                                        onClick={(e) => {
                                            if (!isCalibrationEnabled) return;
                                            e.stopPropagation();
                                            setSelectedSymbolId(0);
                                            setSelectedLabelId(null); // D 선택 해제
                                            setSelectedLeftSymbolId(null); // LS 선택 해제
                                            setSelectedBottomSymbolId(null); // H 선택 해제
                                        }}
                                    >
                                        RS
                                    </text>
                                );
                            })()}

                            {/* 기호 텍스트 'LS' (딩의 9시 방향 외곽선 안쪽) */}
                            {(() => {
                                const dingNote = notes.find(note => note.id === 0);
                                if (!dingNote) return null;

                                const baseScale = dingNote.scale || 100;
                                const baseRx = baseScale * TONEFIELD_RATIO_X;
                                // RS/LS는 딩의 초기 위치(500, 500)를 기준으로 계산하여 딩 이동과 독립적으로 유지
                                const defaultDingCx = 500;
                                const defaultDingCy = 500;

                                // 9시 방향 외곽선 안쪽 위치 계산
                                const defaultOffset = dingNote.symbolLeftOffset !== undefined ? dingNote.symbolLeftOffset : 15; // 외곽선에서 안쪽으로의 오프셋
                                const symbolLeftX = dingNote.symbolLeftX !== undefined && dingNote.symbolLeftX !== null
                                    ? dingNote.symbolLeftX
                                    : (defaultDingCx - baseRx + defaultOffset);
                                const symbolLeftY = dingNote.symbolLeftY !== undefined && dingNote.symbolLeftY !== null
                                    ? dingNote.symbolLeftY
                                    : defaultDingCy;

                                const fontSize = 28.8; // 라벨과 동일한 폰트 사이즈
                                const isLeftSymbolSelected = selectedLeftSymbolId === 0;

                                return (
                                    <text
                                        x={symbolLeftX}
                                        y={symbolLeftY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={isLeftSymbolSelected ? "#ef4444" : "#C2A164"}
                                        fontSize={fontSize}
                                        fontWeight="bold"
                                        opacity={isLeftSymbolSelected ? "1" : "0.9"}
                                        fontFamily="system-ui, -apple-system, sans-serif"
                                        style={{
                                            cursor: isCalibrationEnabled ? 'pointer' : 'default',
                                            transition: 'fill 0.2s ease, opacity 0.2s ease',
                                            textShadow: isLeftSymbolSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
                                        }}
                                        onClick={(e) => {
                                            if (!isCalibrationEnabled) return;
                                            e.stopPropagation();
                                            setSelectedLeftSymbolId(0);
                                            setSelectedLabelId(null); // D 선택 해제
                                            setSelectedSymbolId(null); // RS 선택 해제
                                            setSelectedBottomSymbolId(null); // H 선택 해제
                                        }}
                                    >
                                        LS
                                    </text>
                                );
                            })()}

                            {/* 기호 텍스트 'H' (딩의 하단 외곽선 안쪽) */}
                            {(() => {
                                const dingNote = notes.find(note => note.id === 0);
                                if (!dingNote) return null;

                                const baseScale = dingNote.scale || 100;
                                const baseRy = baseScale * TONEFIELD_RATIO_Y;
                                // H 기호도 딩의 초기 위치(500, 500)를 기준으로 계산하여 딩 이동과 독립적으로 유지
                                const defaultDingCx = 500;
                                const defaultDingCy = 500;

                                // 하단 외곽선 안쪽 위치 계산
                                const defaultOffset = dingNote.symbolBottomOffset !== undefined ? dingNote.symbolBottomOffset : 15; // 외곽선에서 안쪽으로의 오프셋
                                const symbolBottomX = dingNote.symbolBottomX !== undefined && dingNote.symbolBottomX !== null
                                    ? dingNote.symbolBottomX
                                    : defaultDingCx;
                                const symbolBottomY = dingNote.symbolBottomY !== undefined && dingNote.symbolBottomY !== null
                                    ? dingNote.symbolBottomY
                                    : (defaultDingCy + baseRy - defaultOffset);

                                const fontSize = 28.8; // 라벨과 동일한 폰트 사이즈
                                const isBottomSymbolSelected = selectedBottomSymbolId === 0;

                                return (
                                    <text
                                        x={symbolBottomX}
                                        y={symbolBottomY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={isBottomSymbolSelected ? "#ef4444" : "#C2A164"}
                                        fontSize={fontSize}
                                        fontWeight="bold"
                                        opacity={isBottomSymbolSelected ? "1" : "0.9"}
                                        fontFamily="system-ui, -apple-system, sans-serif"
                                        style={{
                                            cursor: isCalibrationEnabled ? 'pointer' : 'default',
                                            transition: 'fill 0.2s ease, opacity 0.2s ease',
                                            textShadow: isBottomSymbolSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
                                        }}
                                        onClick={(e) => {
                                            if (!isCalibrationEnabled) return;
                                            e.stopPropagation();
                                            setSelectedBottomSymbolId(0);
                                            setSelectedLabelId(null); // D 선택 해제
                                            setSelectedSymbolId(null); // RS 선택 해제
                                            setSelectedLeftSymbolId(null); // LS 선택 해제
                                        }}
                                    >
                                        H
                                    </text>
                                );
                            })()}

                            {/* 피치 텍스트 렌더링 (모든 노트, 톤필드 회전과 독립적) */}
                            {notes.map((note) => {
                                // 스케일 데이터에서 피치 가져오기
                                let pitchLabel: string | null = null;

                                // 템플릿이 선택된 경우 스케일 정보와 동기화하지 않음 (기본값 사용)
                                if (selectedTemplate !== null) {
                                    // 템플릿 모드: 기본값 사용
                                    // id 12, 13, 14, 15, 16, 17는 특정 스케일(F# Low Pygmy 18 등)에서만 사용되므로 템플릿 모드에서는 표시하지 않음
                                    if (note.id === 12 || note.id === 13 || note.id === 14 || note.id === 15 || note.id === 16 || note.id === 17) {
                                        pitchLabel = null;
                                    } else {
                                        const defaultPitchLabels: { [key: number]: string } = {
                                            0: 'D3',
                                            1: 'A',
                                            2: 'Bb',
                                            3: 'C4',
                                            4: 'D',
                                            5: 'E',
                                            6: 'F',
                                            7: 'G',
                                            8: 'A',
                                        };
                                        pitchLabel = defaultPitchLabels[note.id] || null;
                                    }
                                } else if (isCompatibleScale && scale) {
                                    // 스케일 모드: 스케일 정보와 동기화
                                    if (note.id === 0) {
                                        // 중앙 딩은 notes.ding에서 가져오기
                                        pitchLabel = scale.notes.ding;
                                    } else if (note.id >= 1 && note.id <= 9) {
                                        if (scale.id === 'fs_low_pygmy_18_mutant') {
                                            // F# Low Pygmy 18 (18 템플릿): 1~18번 라벨 기반 매핑
                                            // ID 1은 label '4'이고 G#3으로 표시
                                            if (note.id === 1) {
                                                pitchLabel = 'G#3';
                                            } else if (note.id === 2) {
                                                // ID 2는 A3으로 표시
                                                pitchLabel = 'A3';
                                            } else if (note.id === 3) {
                                                // ID 3은 D4로 표시
                                                pitchLabel = 'D4';
                                            } else if (note.id === 4) {
                                                // ID 4는 E4로 표시
                                                pitchLabel = 'E4';
                                            } else if (note.id === 5) {
                                                // ID 5는 F#4로 표시
                                                pitchLabel = 'F#4';
                                            } else if (note.id === 6) {
                                                // ID 6은 G#4로 표시
                                                pitchLabel = 'G#4';
                                            } else if (note.id === 7) {
                                                // ID 7은 A4로 표시
                                                pitchLabel = 'A4';
                                            } else if (note.id === 8) {
                                                // ID 8은 D5로 표시
                                                pitchLabel = 'D5';
                                            } else if (note.id === 9) {
                                                // ID 9는 E5로 표시
                                                pitchLabel = 'E5';
                                            } else if (note.label === '6' || note.label === '16' || note.label === '13') {
                                                // label '6', '16', 또는 '13'을 가진 톤필드는 B3으로 표시
                                                pitchLabel = 'B3';
                                            } else {
                                                const labelToPitch: { [key: string]: string } = {
                                                    '1': 'D3',
                                                    '2': 'E3',
                                                    '3': 'F#3',
                                                    '4': 'G#3',
                                                    '5': 'A3',
                                                    '6': 'B3',
                                                    '7': 'C#4',
                                                    '8': 'D4',
                                                    '9': 'E4',
                                                    '10': 'F#4',
                                                    '11': 'G#4',
                                                    '12': 'A4',
                                                    '13': 'B4',
                                                    '14': 'C#5',
                                                    '15': 'D5',
                                                    '16': 'E5',
                                                    '17': 'F#5',
                                                    '18': 'G#5'
                                                };
                                                pitchLabel = labelToPitch[note.label] || null;
                                            }
                                        } else {
                                            // C# Deepasia 14 특별 처리: note.id 6에 G#4 강제 설정
                                            if (scale.id === 'cs_deepasia_14' && note.id === 6) {
                                                pitchLabel = 'G#4';
                                            } else {
                                                // 일반적인 경우: Top 노트를 낮은 피치부터 정렬하여 1부터 순서대로 배치
                                                const sortedTopNotes = [...scale.notes.top].sort(comparePitch);
                                                pitchLabel = sortedTopNotes[note.id - 1] || null;
                                            }
                                        }
                                    } else if (note.id === 10 || note.id === 11) {
                                        // 림 바깥 좌우 딩 (11 템플릿 또는 12N 템플릿): bottom 노트 사용
                                        if (scale.id === 'fs_low_pygmy_18_mutant') {
                                            // F# Low Pygmy 18 (18 템플릿): 1~18번 라벨 기반 매핑
                                            const labelToPitch: { [key: string]: string } = {
                                                '1': 'D3',
                                                '2': 'E3',
                                                '3': 'F#3',
                                                '4': 'G#3',
                                                '5': 'A3',
                                                '6': 'B3',
                                                '7': 'C#4',
                                                '8': 'D4',
                                                '9': 'E4',
                                                '10': 'F#4',
                                                '11': 'G#4',
                                                '12': 'A4',
                                                '13': 'B4',
                                                '14': 'C#5',
                                                '15': 'D5',
                                                '16': 'E5',
                                                '17': 'F#5',
                                                '18': 'G#5'
                                            };
                                            pitchLabel = labelToPitch[note.label] || null;
                                        } else {
                                            const bottomNotes = [...scale.notes.bottom].sort(comparePitch);
                                            // D Kurd 12의 경우 하판 F3와 G3 위치: 좌측에 F3, 우측에 G3
                                            if (scale.id === 'd_kurd_12') {
                                                if (note.id === 10) {
                                                    pitchLabel = bottomNotes[0] || null; // 좌측 딩에 F3
                                                } else if (note.id === 11) {
                                                    pitchLabel = bottomNotes[1] || null; // 우측 딩에 G3
                                                }
                                            } else {
                                                // 일반적인 경우
                                                if (note.id === 10) {
                                                    pitchLabel = bottomNotes[0] || null; // 좌측 딩
                                                } else if (note.id === 11) {
                                                    pitchLabel = bottomNotes[1] || null; // 우측 딩
                                                }
                                            }
                                        }
                                    } else if (note.id === 12 || note.id === 13 || note.id === 14 || note.id === 15 || note.id === 16 || note.id === 17) {
                                        // 14N/14M/15/18 템플릿의 하판 노트
                                        if (scale.id === 'fs_low_pygmy_18_mutant') {
                                            // F# Low Pygmy 18 (18 템플릿): 1~18번 라벨 기반 매핑
                                            // 1: D3, 2: E3, 3: F#3, 4: G#3, 5: A3, 6: B3, 7: C#4, 8: D4, 9: E4
                                            // 10: F#4, 11: G#4, 12: A4, 13: B4, 14: C#5, 15: D5, 16: E5, 17: F#5, 18: G#5
                                            // ID 13은 label '7'이고 C#4로 표시
                                            if (note.id === 13) {
                                                pitchLabel = 'C#4';
                                            } else if (note.id === 14) {
                                                // ID 14는 B4로 표시
                                                pitchLabel = 'B4';
                                            } else if (note.id === 15) {
                                                // ID 15는 C#5로 표시
                                                pitchLabel = 'C#5';
                                            } else if (note.label === '13') {
                                                // label '13'을 가진 다른 톤필드는 B3으로 표시
                                                pitchLabel = 'B3';
                                            } else {
                                                const labelToPitch: { [key: string]: string } = {
                                                    '1': 'D3',
                                                    '2': 'E3',
                                                    '3': 'F#3',
                                                    '4': 'G#3',
                                                    '5': 'A3',
                                                    '6': 'B3',
                                                    '7': 'C#4',
                                                    '8': 'D4',
                                                    '9': 'E4',
                                                    '10': 'F#4',
                                                    '11': 'G#4',
                                                    '12': 'A4',
                                                    '13': 'B4',
                                                    '14': 'C#5',
                                                    '15': 'D5',
                                                    '16': 'E5',
                                                    '17': 'F#5',
                                                    '18': 'G#5'
                                                };
                                                pitchLabel = labelToPitch[note.label] || null;
                                            }
                                        } else if (scale.id === 'cs_deepasia_14') {
                                            // C# Deepasia 14 (14N 템플릿): bottom에 D#3, F3, D#4, F4가 있음
                                            // note.id 13에 F4 강제 설정
                                            if (note.id === 13) {
                                                pitchLabel = 'F4';
                                            } else if (note.id === 12) {
                                                // note.id 12는 D#4
                                                const bottomNotes = [...scale.notes.bottom].sort(comparePitch);
                                                pitchLabel = bottomNotes[2] || null; // D#4
                                            }
                                        } else if (scale.id === 'd_asha_15_mutant') {
                                            // D Asha 15 (15 템플릿): top에 C#5, D5가 있음
                                            // id 12 → C#5 (top의 10번째, 번호 14), id 13 → D5 (top의 11번째, 번호 15)
                                            const sortedTopNotes = [...scale.notes.top].sort(comparePitch);
                                            if (note.id === 12) {
                                                pitchLabel = sortedTopNotes[9] || null; // C#5
                                            } else if (note.id === 13) {
                                                pitchLabel = sortedTopNotes[10] || null; // D5
                                            } else if (note.id === 14) {
                                                // id 14 → G3 (bottom의 3번째, 번호 4)
                                                const bottomNotes = [...scale.notes.bottom].sort(comparePitch);
                                                pitchLabel = bottomNotes[2] || null; // G3
                                            }
                                            // id 15는 D Asha 15에서 사용되지 않음
                                            if (note.id === 15) {
                                                pitchLabel = null;
                                            }
                                        } else if (scale.id === 'e_equinox_14') {
                                            // E Equinox 14 (14N): bottom = [C3, D3, D5, E5]
                                            // id 12 → D5 (3번째), id 13 → E5 (4번째)
                                            const bottomNotes = [...scale.notes.bottom].sort(comparePitch);
                                            if (note.id === 12) {
                                                pitchLabel = bottomNotes[2] || null; // D5
                                            } else if (note.id === 13) {
                                                pitchLabel = bottomNotes[3] || null; // E5
                                            }
                                            // id 14, 15는 E Equinox 14에서 사용되지 않음
                                            if (note.id === 14 || note.id === 15) {
                                                pitchLabel = null;
                                            }
                                        } else if (scale.id === 'fs_low_pygmy_14_mutant') {
                                            // F# Low Pygmy 14 (14M): top에 E5, F#5가 있음
                                            // id 12 → E5, id 13 → F#5
                                            if (note.id === 12) {
                                                pitchLabel = 'E5';
                                            } else if (note.id === 13) {
                                                pitchLabel = 'F#5';
                                            }
                                            // id 14, 15는 F# Low Pygmy 14에서 사용되지 않음
                                            if (note.id === 14 || note.id === 15) {
                                                pitchLabel = null;
                                            }
                                        } else {
                                            // 다른 스케일의 경우: id 12, 13, 14, 15, 16, 17는 사용되지 않으므로 피치 텍스트 표시 안 함
                                            pitchLabel = null;
                                        }
                                    } else if (note.id === 14) {
                                        // 15 템플릿의 추가 노트 (D Asha 15 등)
                                        if (scale.id === 'd_asha_15_mutant') {
                                            // D Asha 15: bottom = [E3, F#3, G3]
                                            // id 14 → G3 (3번째, 번호 15)
                                            const bottomNotes = [...scale.notes.bottom].sort(comparePitch);
                                            pitchLabel = bottomNotes[2] || null; // G3
                                        } else {
                                            // 다른 15 스케일의 경우
                                            const bottomNotes = [...scale.notes.bottom].sort(comparePitch);
                                            pitchLabel = bottomNotes[2] || null;
                                        }
                                    } else if (note.id >= 1) {
                                        // D Kurd 12의 경우 특별한 Top 노트 매핑
                                        if (scale.id === 'd_kurd_12') {
                                            // D Kurd 12 Top 노트 순서: A3→4, Bb3→5, C4→6, D4→7, E4→8, F4→9, G4→10, A4→11, C5→12
                                            const topNoteMapping: { [key: number]: string } = {
                                                1: 'A3',  // 4번
                                                2: 'Bb3', // 5번
                                                3: 'C4',  // 6번
                                                4: 'D4',  // 7번
                                                5: 'E4',  // 8번
                                                6: 'F4',  // 9번
                                                7: 'G4',  // 10번
                                                8: 'A4',  // 11번
                                                9: 'C5'   // 12번
                                            };
                                            pitchLabel = topNoteMapping[note.id] || null;
                                        } else {
                                            // 일반적인 경우: Top 노트를 낮은 피치부터 정렬하여 1부터 순서대로 배치
                                            const sortedTopNotes = [...scale.notes.top].sort(comparePitch);
                                            pitchLabel = sortedTopNotes[note.id - 1] || null;
                                        }
                                    }
                                } else {
                                    // 스케일이 없거나 호환되지 않으면 기본값 사용
                                    // id 12, 13, 14, 15, 16, 17는 특정 스케일에서만 사용되므로 여기서는 표시하지 않음
                                    if (note.id === 12 || note.id === 13 || note.id === 14 || note.id === 15 || note.id === 16 || note.id === 17) {
                                        pitchLabel = null;
                                    } else {
                                        const defaultPitchLabels: { [key: number]: string } = {
                                            0: 'D3',
                                            1: 'A',
                                            2: 'Bb',
                                            3: 'C4',
                                            4: 'D',
                                            5: 'E',
                                            6: 'F',
                                            7: 'G',
                                            8: 'A',
                                        };
                                        pitchLabel = defaultPitchLabels[note.id] || null;
                                    }
                                }

                                if (!pitchLabel) return null;

                                const cx = note.cx || 500;
                                const cy = note.cy || 500;

                                // 피치 텍스트 캘리브레이션 값
                                // pitchTextX/pitchTextY가 null이면 톤필드 위치(cx, cy) 사용
                                // undefined이면 초기값으로 톤필드 위치 사용 (하지만 이후 톤필드 이동 시 독립적으로 유지)
                                const pitchX = (note.pitchTextX !== undefined && note.pitchTextX !== null) ? note.pitchTextX : cx;
                                const pitchY = (note.pitchTextY !== undefined && note.pitchTextY !== null) ? note.pitchTextY : cy;
                                // D3는 기본값 37, 나머지는 30
                                const defaultPitchScale = note.id === 0 ? 37 : 30;
                                const pitchScale = (note.pitchTextScale !== undefined && note.pitchTextScale !== null) ? note.pitchTextScale : defaultPitchScale;
                                // 피치 텍스트 회전: 항상 0도로 고정 (사용자 요청)
                                const pitchRotate = 0;
                                const isPitchSelected = selectedPitchId === note.id;

                                return (
                                    <g
                                        key={`pitch-${note.id}`}
                                        onClick={(e) => {
                                            if (!isCalibrationEnabled) return;
                                            e.stopPropagation();
                                            setSelectedPitchId(note.id);
                                        }}
                                        style={{ cursor: isCalibrationEnabled ? 'pointer' : 'default' }}
                                    >
                                        <text
                                            x={pitchX}
                                            y={pitchY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill={isPitchSelected ? "#ef4444" : "#ffffff"}
                                            fontSize={pitchScale}
                                            fontWeight="bold"
                                            fontFamily="system-ui, -apple-system, sans-serif"
                                            transform={`rotate(${pitchRotate} ${pitchX} ${pitchY})`}
                                            style={{
                                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                                                transition: 'fill 0.2s ease',
                                            }}
                                        >
                                            {pitchLabel}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* 호환되지 않는 스케일일 경우 중앙에 '구현 예정' 메시지 표시 (템플릿 모드가 아닐 때만) */}
                            {selectedTemplate === null && scale && !isCompatibleScale && (
                                <text
                                    x={centerX}
                                    y={centerY}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#ffffff"
                                    fontSize="48"
                                    fontWeight="bold"
                                    fontFamily="system-ui, -apple-system, sans-serif"
                                    style={{
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {t.scaleList.implementationPending}
                                </text>
                            )}
                        </svg>
                    </div>

                    {/* 개발자 도구 토글 버튼 */}
                    <div className="w-full flex justify-center">
                        <button
                            onClick={() => setShowDeveloperTools(!showDeveloperTools)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            title={showDeveloperTools ? '개발자 도구 숨기기' : '개발자 도구 보이기'}
                        >
                            <Settings className={`w-5 h-5 transition-transform duration-300 ${showDeveloperTools ? 'rotate-90' : ''}`} />
                        </button>
                    </div>

                    {/* 디지팬 아래 캘리브레이션 버튼 및 패널 영역 */}
                    {showDeveloperTools && (
                        <div className="w-full flex flex-col gap-4">
                        {/* 캘리브레이션 On/Off 버튼 */}
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => {
                                    const newValue = !isCalibrationEnabled;
                                    setIsCalibrationEnabled(newValue);
                                    // Off로 전환할 때 모든 선택 상태 초기화
                                    if (!newValue) {
                                        setSelectedNoteId(null);
                                        setSelectedLabelId(null);
                                        setSelectedSymbolId(null);
                                        setSelectedLeftSymbolId(null);
                                        setSelectedBottomSymbolId(null);
                                        setSelectedPitchId(null);
                                    }
                                }}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isCalibrationEnabled
                                    ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20'
                                    }`}
                            >
                                캘리브레이션 {isCalibrationEnabled ? 'On' : 'Off'}
                            </button>
                            {/* 저장 버튼 */}
                            {isCalibrationEnabled && scale && (
                                <button
                                    onClick={saveLayout}
                                    className={`ml-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${saveButtonText === '저장 완료!'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : saveButtonText === '저장 실패' || saveButtonText === '오류 발생' || saveButtonText === '스케일 정보 없음'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {saveButtonText}
                                </button>
                            )}
                        </div>

                        {/* 톤필드 캘리브레이션 패널 */}
                        {isCalibrationEnabled && (
                            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden panel-container"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsToneFieldPanelExpanded(!isToneFieldPanelExpanded);
                                    }}
                                >
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                        <span>{isToneFieldPanelExpanded ? '톤필드 캘리브레이션' : '톤필드'}</span>
                                        <span className="text-sm font-normal">{isToneFieldPanelExpanded ? '▲' : '▼'}</span>
                                    </h3>
                                </div>
                                {isToneFieldPanelExpanded && (
                                    <div className="p-4 pt-0 max-h-[45vh] overflow-y-auto">

                                        {selectedNote ? (
                                            <div className="space-y-4">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded text-sm font-medium text-indigo-900 dark:text-indigo-100">
                                                    선택된 노트: <strong>{selectedNote.label}</strong>
                                                </div>

                                                {/* Position X */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Position X (cx)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="-400"
                                                            max="1400"
                                                            step="1"
                                                            value={selectedNote.cx || 500}
                                                            onChange={(e) => updateNote(selectedNote.id, { cx: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="-400"
                                                            max="1400"
                                                            step="0.1"
                                                            value={selectedNote.cx?.toFixed(1) || 500}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedNote.id, { cx: Math.max(-400, Math.min(1400, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Position Y */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Position Y (cy)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="-400"
                                                            max="1400"
                                                            step="1"
                                                            value={selectedNote.cy || 500}
                                                            onChange={(e) => updateNote(selectedNote.id, { cy: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="-400"
                                                            max="1400"
                                                            step="0.1"
                                                            value={selectedNote.cy?.toFixed(1) || 500}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedNote.id, { cy: Math.max(-400, Math.min(1400, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Size (비율 유지) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Size (scale)
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                                            (rx: {((selectedNote.scale || 100) * TONEFIELD_RATIO_X).toFixed(1)}, ry: {((selectedNote.scale || 100) * TONEFIELD_RATIO_Y).toFixed(1)})
                                                        </span>
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="10"
                                                            max="500"
                                                            step="1"
                                                            value={selectedNote.scale || 100}
                                                            onChange={(e) => updateNote(selectedNote.id, { scale: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="10"
                                                            max="500"
                                                            step="0.1"
                                                            value={selectedNote.scale?.toFixed(1) || 100}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedNote.id, { scale: Math.max(10, Math.min(500, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Rotation */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Rotation (°)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="360"
                                                            step="1"
                                                            value={selectedNote.rotate || 0}
                                                            onChange={(e) => updateNote(selectedNote.id, { rotate: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="360"
                                                            step="0.1"
                                                            value={selectedNote.rotate?.toFixed(1) || 0}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedNote.id, { rotate: Math.max(0, Math.min(360, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                                                톤필드를 클릭하여 선택하세요
                                            </div>
                                        )}

                                        {/* JSON 내보내기 버튼 */}
                                        <div className="mt-6 pt-4 border-t border-slate-300 dark:border-slate-700">
                                            <button
                                                onClick={exportJson}
                                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                {copyButtonText}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 기호 텍스트 캘리브레이션 패널 */}
                        {isCalibrationEnabled && (
                            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden panel-container"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsLabelPanelExpanded(!isLabelPanelExpanded);
                                    }}
                                >
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                        <span>{isLabelPanelExpanded ? '기호 텍스트 캘리브레이션' : '기호 텍스트'}</span>
                                        <span className="text-sm font-normal">{isLabelPanelExpanded ? '▲' : '▼'}</span>
                                    </h3>
                                </div>
                                {isLabelPanelExpanded && (
                                    <div className="p-4 pt-0 max-h-[45vh] overflow-y-auto">

                                        {selectedSymbolTextNote ? (
                                            <div className="space-y-4">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm font-medium text-purple-900 dark:text-purple-100">
                                                    선택된 기호: <strong>{selectedBottomSymbolId !== null ? 'H' : selectedLeftSymbolId !== null ? 'LS' : selectedSymbolId !== null ? 'RS' : selectedSymbolTextNote.label}</strong>
                                                </div>

                                                {/* Position X */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Position X ({selectedBottomSymbolId !== null ? 'symbolBottomX' : selectedLeftSymbolId !== null ? 'symbolLeftX' : selectedSymbolId !== null ? 'symbolX' : 'labelX'})
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                                            (null이면 자동 계산)
                                                        </span>
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="-400"
                                                            max="1400"
                                                            step="1"
                                                            value={selectedBottomSymbolId !== null
                                                                ? (selectedSymbolTextNote.symbolBottomX !== undefined && selectedSymbolTextNote.symbolBottomX !== null
                                                                    ? selectedSymbolTextNote.symbolBottomX
                                                                    : (selectedSymbolTextNote.cx || 500))
                                                                : selectedLeftSymbolId !== null
                                                                    ? (selectedSymbolTextNote.symbolLeftX !== undefined && selectedSymbolTextNote.symbolLeftX !== null
                                                                        ? selectedSymbolTextNote.symbolLeftX
                                                                        : (() => {
                                                                            const cx = selectedSymbolTextNote.cx || 500;
                                                                            const scale = selectedSymbolTextNote.scale || 100;
                                                                            const rx = scale * TONEFIELD_RATIO_X;
                                                                            const offset = selectedSymbolTextNote.symbolLeftOffset !== undefined ? selectedSymbolTextNote.symbolLeftOffset : 15;
                                                                            return cx - rx + offset;
                                                                        })())
                                                                    : selectedSymbolId !== null
                                                                        ? (selectedSymbolTextNote.symbolX !== undefined && selectedSymbolTextNote.symbolX !== null
                                                                            ? selectedSymbolTextNote.symbolX
                                                                            : (() => {
                                                                                const cx = selectedSymbolTextNote.cx || 500;
                                                                                const scale = selectedSymbolTextNote.scale || 100;
                                                                                const rx = scale * TONEFIELD_RATIO_X;
                                                                                const offset = selectedSymbolTextNote.symbolOffset !== undefined ? selectedSymbolTextNote.symbolOffset : 15;
                                                                                return cx + rx - offset;
                                                                            })())
                                                                        : (selectedSymbolTextNote.labelX !== undefined ? selectedSymbolTextNote.labelX : (selectedSymbolTextNote.cx || 500))}
                                                            onChange={(e) => {
                                                                if (selectedBottomSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolBottomX: parseFloat(e.target.value) });
                                                                } else if (selectedLeftSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolLeftX: parseFloat(e.target.value) });
                                                                } else if (selectedSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolX: parseFloat(e.target.value) });
                                                                } else {
                                                                    updateNote(selectedSymbolTextNote.id, { labelX: parseFloat(e.target.value) });
                                                                }
                                                            }}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="-400"
                                                            max="1400"
                                                            step="0.1"
                                                            value={selectedBottomSymbolId !== null
                                                                ? (selectedSymbolTextNote.symbolBottomX !== undefined && selectedSymbolTextNote.symbolBottomX !== null ? selectedSymbolTextNote.symbolBottomX.toFixed(1) : '')
                                                                : selectedLeftSymbolId !== null
                                                                    ? (selectedSymbolTextNote.symbolLeftX !== undefined && selectedSymbolTextNote.symbolLeftX !== null ? selectedSymbolTextNote.symbolLeftX.toFixed(1) : '')
                                                                    : selectedSymbolId !== null
                                                                        ? (selectedSymbolTextNote.symbolX !== undefined && selectedSymbolTextNote.symbolX !== null ? selectedSymbolTextNote.symbolX.toFixed(1) : '')
                                                                        : (selectedSymbolTextNote.labelX !== undefined && selectedSymbolTextNote.labelX !== null ? selectedSymbolTextNote.labelX.toFixed(1) : '')}
                                                            placeholder="auto"
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                                                if (value === undefined || !isNaN(value)) {
                                                                    if (selectedBottomSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            symbolBottomX: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    } else if (selectedLeftSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            symbolLeftX: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    } else if (selectedSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            symbolX: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    } else {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            labelX: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Position Y */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Position Y ({selectedBottomSymbolId !== null ? 'symbolBottomY' : selectedLeftSymbolId !== null ? 'symbolLeftY' : selectedSymbolId !== null ? 'symbolY' : 'labelY'})
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                                            (null이면 자동 계산)
                                                        </span>
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="-400"
                                                            max="1400"
                                                            step="1"
                                                            value={selectedBottomSymbolId !== null
                                                                ? (selectedSymbolTextNote.symbolBottomY !== undefined && selectedSymbolTextNote.symbolBottomY !== null
                                                                    ? selectedSymbolTextNote.symbolBottomY
                                                                    : (() => {
                                                                        const cy = selectedSymbolTextNote.cy || 500;
                                                                        const scale = selectedSymbolTextNote.scale || 100;
                                                                        const ry = scale * TONEFIELD_RATIO_Y;
                                                                        const offset = selectedSymbolTextNote.symbolBottomOffset !== undefined ? selectedSymbolTextNote.symbolBottomOffset : 15;
                                                                        return cy + ry - offset;
                                                                    })())
                                                                : selectedLeftSymbolId !== null
                                                                    ? (selectedSymbolTextNote.symbolLeftY !== undefined && selectedSymbolTextNote.symbolLeftY !== null
                                                                        ? selectedSymbolTextNote.symbolLeftY
                                                                        : (selectedSymbolTextNote.cy || 500))
                                                                    : selectedSymbolId !== null
                                                                        ? (selectedSymbolTextNote.symbolY !== undefined && selectedSymbolTextNote.symbolY !== null
                                                                            ? selectedSymbolTextNote.symbolY
                                                                            : (selectedSymbolTextNote.cy || 500))
                                                                        : (selectedSymbolTextNote.labelY !== undefined ? selectedSymbolTextNote.labelY : (() => {
                                                                            const cy = selectedSymbolTextNote.cy || 500;
                                                                            const scale = selectedSymbolTextNote.scale || 100;
                                                                            const ry = scale * TONEFIELD_RATIO_Y;
                                                                            const offset = selectedSymbolTextNote.labelOffset || 25;
                                                                            return cy + ry + offset;
                                                                        })())}
                                                            onChange={(e) => {
                                                                if (selectedBottomSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolBottomY: parseFloat(e.target.value) });
                                                                } else if (selectedLeftSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolLeftY: parseFloat(e.target.value) });
                                                                } else if (selectedSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolY: parseFloat(e.target.value) });
                                                                } else {
                                                                    updateNote(selectedSymbolTextNote.id, { labelY: parseFloat(e.target.value) });
                                                                }
                                                            }}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="-400"
                                                            max="1400"
                                                            step="0.1"
                                                            value={selectedBottomSymbolId !== null
                                                                ? (selectedSymbolTextNote.symbolBottomY !== undefined && selectedSymbolTextNote.symbolBottomY !== null ? selectedSymbolTextNote.symbolBottomY.toFixed(1) : '')
                                                                : selectedLeftSymbolId !== null
                                                                    ? (selectedSymbolTextNote.symbolLeftY !== undefined && selectedSymbolTextNote.symbolLeftY !== null ? selectedSymbolTextNote.symbolLeftY.toFixed(1) : '')
                                                                    : selectedSymbolId !== null
                                                                        ? (selectedSymbolTextNote.symbolY !== undefined && selectedSymbolTextNote.symbolY !== null ? selectedSymbolTextNote.symbolY.toFixed(1) : '')
                                                                        : (selectedSymbolTextNote.labelY !== undefined && selectedSymbolTextNote.labelY !== null ? selectedSymbolTextNote.labelY.toFixed(1) : '')}
                                                            placeholder="auto"
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                                                if (value === undefined || !isNaN(value)) {
                                                                    if (selectedBottomSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            symbolBottomY: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    } else if (selectedLeftSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            symbolLeftY: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    } else if (selectedSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            symbolY: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    } else {
                                                                        updateNote(selectedSymbolTextNote.id, {
                                                                            labelY: value === undefined ? undefined : Math.max(-400, Math.min(1400, value))
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Offset */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Offset ({selectedBottomSymbolId !== null ? 'symbolBottomOffset' : selectedLeftSymbolId !== null ? 'symbolLeftOffset' : selectedSymbolId !== null ? 'symbolOffset' : 'labelOffset'})
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                                            (자동 계산 시 사용)
                                                        </span>
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            value={selectedBottomSymbolId !== null
                                                                ? (selectedSymbolTextNote.symbolBottomOffset !== undefined ? selectedSymbolTextNote.symbolBottomOffset : 15)
                                                                : selectedLeftSymbolId !== null
                                                                    ? (selectedSymbolTextNote.symbolLeftOffset !== undefined ? selectedSymbolTextNote.symbolLeftOffset : 15)
                                                                    : selectedSymbolId !== null
                                                                        ? (selectedSymbolTextNote.symbolOffset !== undefined ? selectedSymbolTextNote.symbolOffset : 15)
                                                                        : (selectedSymbolTextNote.labelOffset || 25)}
                                                            onChange={(e) => {
                                                                if (selectedBottomSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolBottomOffset: parseFloat(e.target.value) });
                                                                } else if (selectedLeftSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolLeftOffset: parseFloat(e.target.value) });
                                                                } else if (selectedSymbolId !== null) {
                                                                    updateNote(selectedSymbolTextNote.id, { symbolOffset: parseFloat(e.target.value) });
                                                                } else {
                                                                    updateNote(selectedSymbolTextNote.id, { labelOffset: parseFloat(e.target.value) });
                                                                }
                                                            }}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.1"
                                                            value={selectedBottomSymbolId !== null
                                                                ? (selectedSymbolTextNote.symbolBottomOffset !== undefined ? selectedSymbolTextNote.symbolBottomOffset : 15).toFixed(1)
                                                                : selectedLeftSymbolId !== null
                                                                    ? (selectedSymbolTextNote.symbolLeftOffset !== undefined ? selectedSymbolTextNote.symbolLeftOffset : 15).toFixed(1)
                                                                    : selectedSymbolId !== null
                                                                        ? (selectedSymbolTextNote.symbolOffset !== undefined ? selectedSymbolTextNote.symbolOffset : 15).toFixed(1)
                                                                        : (selectedSymbolTextNote.labelOffset || 25).toFixed(1)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    if (selectedBottomSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, { symbolBottomOffset: Math.max(0, Math.min(100, value)) });
                                                                    } else if (selectedLeftSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, { symbolLeftOffset: Math.max(0, Math.min(100, value)) });
                                                                    } else if (selectedSymbolId !== null) {
                                                                        updateNote(selectedSymbolTextNote.id, { symbolOffset: Math.max(0, Math.min(100, value)) });
                                                                    } else {
                                                                        updateNote(selectedSymbolTextNote.id, { labelOffset: Math.max(0, Math.min(100, value)) });
                                                                    }
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                                                라벨을 클릭하여 선택하세요
                                            </div>
                                        )}

                                        {/* JSON 내보내기 버튼 */}
                                        <div className="pt-2 border-t border-slate-300 dark:border-slate-700">
                                            <button
                                                onClick={exportLabelJson}
                                                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                {copyLabelButtonText}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 피치 캘리브레이션 패널 */}
                        {isCalibrationEnabled && (
                            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden panel-container"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsPitchPanelExpanded(!isPitchPanelExpanded);
                                    }}
                                >
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                        <span>{isPitchPanelExpanded ? '피치 캘리브레이션' : '피치'}</span>
                                        <span className="text-sm font-normal">{isPitchPanelExpanded ? '▲' : '▼'}</span>
                                    </h3>
                                </div>
                                {isPitchPanelExpanded && (
                                    <div className="p-4 pt-0 max-h-[45vh] overflow-y-auto">
                                        {selectedPitchNote ? (
                                            <div className="space-y-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    선택된 피치: <strong>{(() => {
                                                        const pitchLabels: { [key: number]: string } = {
                                                            0: 'D3',
                                                            1: 'A',
                                                            2: 'Bb',
                                                            3: 'C4',
                                                            4: 'D',
                                                            5: 'E',
                                                            6: 'F',
                                                            7: 'G',
                                                            8: 'A',
                                                        };
                                                        return pitchLabels[selectedPitchNote.id] || '';
                                                    })()}</strong>
                                                </div>

                                                {/* Position X */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Position X (pitchTextX)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="-400"
                                                            max="1400"
                                                            step="1"
                                                            value={(selectedPitchNote.pitchTextX !== undefined && selectedPitchNote.pitchTextX !== null) ? selectedPitchNote.pitchTextX : (selectedPitchNote.cx || 500)}
                                                            onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextX: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="-400"
                                                            max="1400"
                                                            step="0.1"
                                                            value={((selectedPitchNote.pitchTextX !== undefined && selectedPitchNote.pitchTextX !== null) ? selectedPitchNote.pitchTextX : (selectedPitchNote.cx || 500)).toFixed(1)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedPitchNote.id, { pitchTextX: Math.max(-400, Math.min(1400, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Position Y */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Position Y (pitchTextY)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="-400"
                                                            max="1400"
                                                            step="1"
                                                            value={(selectedPitchNote.pitchTextY !== undefined && selectedPitchNote.pitchTextY !== null) ? selectedPitchNote.pitchTextY : (selectedPitchNote.cy || 500)}
                                                            onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextY: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="-400"
                                                            max="1400"
                                                            step="0.1"
                                                            value={((selectedPitchNote.pitchTextY !== undefined && selectedPitchNote.pitchTextY !== null) ? selectedPitchNote.pitchTextY : (selectedPitchNote.cy || 500)).toFixed(1)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedPitchNote.id, { pitchTextY: Math.max(-400, Math.min(1400, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Size (가로세로비율 유지) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Size (pitchTextScale)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="10"
                                                            max="100"
                                                            step="1"
                                                            value={(selectedPitchNote.pitchTextScale !== undefined && selectedPitchNote.pitchTextScale !== null) ? selectedPitchNote.pitchTextScale : (selectedPitchNote.id === 0 ? 37 : 30)}
                                                            onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextScale: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="10"
                                                            max="100"
                                                            step="0.1"
                                                            value={((selectedPitchNote.pitchTextScale !== undefined && selectedPitchNote.pitchTextScale !== null) ? selectedPitchNote.pitchTextScale : (selectedPitchNote.id === 0 ? 37 : 30)).toFixed(1)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedPitchNote.id, { pitchTextScale: Math.max(10, Math.min(100, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Rotation */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                        Rotation (°) (pitchTextRotate)
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="360"
                                                            step="1"
                                                            value={(selectedPitchNote.pitchTextRotate !== undefined && selectedPitchNote.pitchTextRotate !== null) ? selectedPitchNote.pitchTextRotate : 0}
                                                            onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextRotate: parseFloat(e.target.value) })}
                                                            className="flex-1"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="360"
                                                            step="0.1"
                                                            value={((selectedPitchNote.pitchTextRotate !== undefined && selectedPitchNote.pitchTextRotate !== null) ? selectedPitchNote.pitchTextRotate : 0).toFixed(1)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    updateNote(selectedPitchNote.id, { pitchTextRotate: Math.max(0, Math.min(360, value)) });
                                                                }
                                                            }}
                                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                                                피치 텍스트를 클릭하여 선택하세요
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 템플릿 선택 패널 */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden panel-container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                                    템플릿
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {[9, 10, 11].map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => {
                                                // 토글: 같은 버튼 클릭 시 비활성화, 다른 버튼 클릭 시 활성화
                                                setSelectedTemplate(selectedTemplate === count ? null : count);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === count
                                                ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                    {/* 12N 버튼 */}
                                    <button
                                        onClick={() => {
                                            setSelectedTemplate(selectedTemplate === '12N' ? null : '12N');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === '12N'
                                            ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        12N
                                    </button>
                                    {/* 12M 버튼 */}
                                    <button
                                        onClick={() => {
                                            setSelectedTemplate(selectedTemplate === '12M' ? null : '12M');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === '12M'
                                            ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        12M
                                    </button>
                                    {/* 14N 버튼 */}
                                    <button
                                        onClick={() => {
                                            setSelectedTemplate(selectedTemplate === '14N' ? null : '14N');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === '14N'
                                            ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        14N
                                    </button>
                                    {/* 14M 버튼 */}
                                    <button
                                        onClick={() => {
                                            setSelectedTemplate(selectedTemplate === '14M' ? null : '14M');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === '14M'
                                            ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        14M
                                    </button>
                                    {[15, 18].map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => {
                                                // 토글: 같은 버튼 클릭 시 비활성화, 다른 버튼 클릭 시 활성화
                                                setSelectedTemplate(selectedTemplate === count ? null : count);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === count
                                                ? 'bg-indigo-600 dark:bg-cosmic/20 text-white dark:text-cosmic border border-transparent dark:border-cosmic/30 shadow-sm dark:shadow-[0_0_10px_rgba(72,255,0,0.2)]'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
