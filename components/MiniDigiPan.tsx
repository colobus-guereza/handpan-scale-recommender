'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

// 톤필드 가로세로 비율 상수
const TONEFIELD_RATIO_X = 0.3;  // 가로 반지름 비율
const TONEFIELD_RATIO_Y = 0.425; // 세로 반지름 비율

// 노트 데이터 타입 정의
interface NoteData {
    id: number;
    label: string;
    position: 'center' | 'top';
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

// 초기 노트 데이터 생성 함수
const createInitialNotes = (centerX: number, centerY: number): NoteData[] => {
    // localStorage에서 톤필드 캘리브레이션 불러오기
    const storedToneFieldCalibration = loadCalibrationFromStorage('minidigipan_tonefield_calibration');
    const storedLabelCalibration = loadCalibrationFromStorage('minidigipan_label_calibration');

    // 제공된 캘리브레이션 데이터로 초기화 (톤필드 캘리브레이션 초기설정 값)
    const defaultCalibrationData = [
        {
            id: 0,
            label: 'D',
            cx: 500,
            cy: 500,
            scale: 389.7,
            rotate: 90,
            labelX: 500,
            labelY: 514,
            labelOffset: 25,
            symbolX: 937,
            symbolY: null,
            symbolOffset: 15,
            symbolLeftX: 354,
            symbolLeftY: 331,
            symbolLeftOffset: 25,
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

    // 저장된 톤필드 캘리브레이션이 있으면 사용, 없으면 기본값 사용
    const toneFieldData = storedToneFieldCalibration || defaultCalibrationData;

    // 저장된 라벨 캘리브레이션이 있으면 사용, 없으면 defaultCalibrationData의 라벨 값 사용
    const labelCalibrationMap = new Map();
    if (storedLabelCalibration) {
        storedLabelCalibration.forEach((item: any) => {
            labelCalibrationMap.set(item.id, item);
        });
    } else {
        // 저장된 라벨 캘리브레이션이 없으면 defaultCalibrationData의 라벨 값 사용
        defaultCalibrationData.forEach((item: any) => {
            labelCalibrationMap.set(item.id, {
                labelX: item.labelX,
                labelY: item.labelY,
                labelOffset: item.labelOffset,
                symbolX: item.symbolX,
                symbolY: item.symbolY,
                symbolOffset: item.symbolOffset,
                symbolLeftX: item.symbolLeftX,
                symbolLeftY: item.symbolLeftY,
                symbolLeftOffset: item.symbolLeftOffset,
                symbolBottomX: item.symbolBottomX,
                symbolBottomY: item.symbolBottomY,
                symbolBottomOffset: item.symbolBottomOffset,
            });
        });
    }

    // 캘리브레이션 데이터를 NoteData 형식으로 변환
    return toneFieldData.map((data) => {
        const labelData = labelCalibrationMap.get(data.id);
        return {
            id: data.id,
            label: data.label,
            position: data.id === 0 ? 'center' : 'top',
            angle: 0, // angle은 더 이상 사용하지 않지만 호환성을 위해 유지
            cx: data.cx,
            cy: data.cy,
            scale: data.scale,
            rotate: data.rotate,
            // 라벨 캘리브레이션이 있으면 사용, 없으면 기본값 사용
            // null 값도 유효한 값으로 처리 (명시적으로 null로 설정된 경우)
            labelX: labelData?.labelX !== undefined && labelData.labelX !== null ? labelData.labelX : undefined,
            labelY: labelData?.labelY !== undefined && labelData.labelY !== null ? labelData.labelY : undefined,
            labelOffset: labelData?.labelOffset !== undefined ? labelData.labelOffset : (data.labelOffset || 25),
            // 기호 텍스트 캘리브레이션 (딩만) - RS
            symbolX: labelData?.symbolX !== undefined && labelData.symbolX !== null ? labelData.symbolX : (data.symbolX !== undefined ? data.symbolX : undefined),
            symbolY: labelData?.symbolY !== undefined && labelData.symbolY !== null ? labelData.symbolY : (data.symbolY !== undefined ? data.symbolY : undefined),
            symbolOffset: labelData?.symbolOffset !== undefined ? labelData.symbolOffset : (data.symbolOffset !== undefined ? data.symbolOffset : undefined),
            // 기호 텍스트 캘리브레이션 (딩만) - LS
            symbolLeftX: labelData?.symbolLeftX !== undefined && labelData.symbolLeftX !== null ? labelData.symbolLeftX : (data.symbolLeftX !== undefined ? data.symbolLeftX : undefined),
            symbolLeftY: labelData?.symbolLeftY !== undefined && labelData.symbolLeftY !== null ? labelData.symbolLeftY : (data.symbolLeftY !== undefined ? data.symbolLeftY : undefined),
            symbolLeftOffset: labelData?.symbolLeftOffset !== undefined ? labelData.symbolLeftOffset : (data.symbolLeftOffset !== undefined ? data.symbolLeftOffset : undefined),
            // 기호 텍스트 캘리브레이션 (딩만) - H
            symbolBottomX: labelData?.symbolBottomX !== undefined && labelData.symbolBottomX !== null ? labelData.symbolBottomX : (data.symbolBottomX !== undefined ? data.symbolBottomX : undefined),
            symbolBottomY: labelData?.symbolBottomY !== undefined && labelData.symbolBottomY !== null ? labelData.symbolBottomY : (data.symbolBottomY !== undefined ? data.symbolBottomY : undefined),
            symbolBottomOffset: labelData?.symbolBottomOffset !== undefined ? labelData.symbolBottomOffset : (data.symbolBottomOffset !== undefined ? data.symbolBottomOffset : undefined),
        };
    });
};

// 톤필드 컴포넌트 Props
interface ToneFieldProps {
    note: NoteData;
    isSelected: boolean;
    onSelect: () => void;
}

// 톤필드 컴포넌트
const ToneField: React.FC<ToneFieldProps> = ({ note, isSelected, onSelect }) => {
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
        // 리플 효과 트리거
        setTriggerRipple(true);
        setTimeout(() => {
            setTriggerRipple(false);
        }, 800); // 애니메이션 시간(0.8s) 후 리플 제거
        onSelect();
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

    // 선택된 노트는 빨간색 테두리, 기본은 황동 톤에 맞는 테두리
    const strokeColor = isSelected ? '#ef4444' : '#5E4B32';
    const strokeWidth = isSelected ? '3' : '1';

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
                cursor: 'pointer',
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
                className="dark:stroke-slate-300 tone-field-ellipse"
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
                    stroke="#FFD700"
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
}

const ToneFieldLabel: React.FC<LabelProps> = ({ note, rx, ry, rotate, isSelected, onSelect }) => {
    const cx = note.cx || 500;
    const cy = note.cy || 500;

    // 라벨 위치 계산: 직접 지정된 좌표가 있으면 사용, 없으면 기본 계산
    // null 또는 undefined일 때 기본값 사용
    const defaultOffset = note.labelOffset || 25;
    const labelX = (note.labelX !== null && note.labelX !== undefined) ? note.labelX : cx;
    const labelY = (note.labelY !== null && note.labelY !== undefined) ? note.labelY : (cy + ry + defaultOffset);

    // 폰트 사이즈 (60% 상향: 18 * 1.6 = 28.8)
    const fontSize = 28.8;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
    };

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
            {note.label}
        </text>
    );
};

export default function MiniDigiPan() {
    const { theme } = useTheme();
    const centerX = 500;
    const centerY = 500;

    // 초기 노트 데이터를 useState로 관리
    const [notes, setNotes] = useState<NoteData[]>(() => createInitialNotes(centerX, centerY));
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);
    const [selectedSymbolId, setSelectedSymbolId] = useState<number | null>(null); // RS 기호 선택 (딩만)
    const [selectedLeftSymbolId, setSelectedLeftSymbolId] = useState<number | null>(null); // LS 기호 선택 (딩만)
    const [selectedBottomSymbolId, setSelectedBottomSymbolId] = useState<number | null>(null); // H 기호 선택 (딩만)
    const [selectedPitchId, setSelectedPitchId] = useState<number | null>(null);
    const [copyButtonText, setCopyButtonText] = useState<string>('Copy JSON Config');
    const [copyLabelButtonText, setCopyLabelButtonText] = useState<string>('Copy JSON Config');
    const [isToneFieldPanelExpanded, setIsToneFieldPanelExpanded] = useState<boolean>(false);
    const [isLabelPanelExpanded, setIsLabelPanelExpanded] = useState<boolean>(false);
    const [isPitchPanelExpanded, setIsPitchPanelExpanded] = useState<boolean>(false);

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

    // 노트 업데이트 함수 (자동으로 localStorage에 저장)
    const updateNote = (id: number, updates: Partial<NoteData>) => {
        setNotes(prevNotes => {
            const updatedNotes = prevNotes.map(note =>
                note.id === id ? { ...note, ...updates } : note
            );
            
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
                localStorage.setItem('minidigipan_tonefield_calibration', JSON.stringify(toneFieldData));
            } catch (error) {
                console.error('Failed to save tonefield calibration to localStorage:', error);
            }
            
            // 라벨 캘리브레이션 자동 저장
            const labelData = updatedNotes.map((note) => ({
                id: note.id,
                label: note.label,
                labelX: note.labelX !== undefined && note.labelX !== null ? note.labelX : null,
                labelY: note.labelY !== undefined && note.labelY !== null ? note.labelY : null,
                labelOffset: note.labelOffset || 25,
                symbolX: note.symbolX !== undefined && note.symbolX !== null ? note.symbolX : null,
                symbolY: note.symbolY !== undefined && note.symbolY !== null ? note.symbolY : null,
                symbolOffset: note.symbolOffset !== undefined ? note.symbolOffset : null,
                symbolLeftX: note.symbolLeftX !== undefined && note.symbolLeftX !== null ? note.symbolLeftX : null,
                symbolLeftY: note.symbolLeftY !== undefined && note.symbolLeftY !== null ? note.symbolLeftY : null,
                symbolLeftOffset: note.symbolLeftOffset !== undefined ? note.symbolLeftOffset : null,
                symbolBottomX: note.symbolBottomX !== undefined && note.symbolBottomX !== null ? note.symbolBottomX : null,
                symbolBottomY: note.symbolBottomY !== undefined && note.symbolBottomY !== null ? note.symbolBottomY : null,
                symbolBottomOffset: note.symbolBottomOffset !== undefined ? note.symbolBottomOffset : null,
            }));
            try {
                localStorage.setItem('minidigipan_label_calibration', JSON.stringify(labelData));
            } catch (error) {
                console.error('Failed to save label calibration to localStorage:', error);
            }
            
            return updatedNotes;
        });
    };

    // 톤필드 JSON 내보내기 및 localStorage 저장
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

        // localStorage에 저장 (다음 로드 시 자동으로 초기값으로 사용)
        try {
            localStorage.setItem('minidigipan_tonefield_calibration', JSON.stringify(exportData));
        } catch (error) {
            console.error('Failed to save tonefield calibration to localStorage:', error);
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

        // localStorage에 저장 (다음 로드 시 자동으로 초기값으로 사용)
        try {
            localStorage.setItem('minidigipan_label_calibration', JSON.stringify(exportData));
        } catch (error) {
            console.error('Failed to save label calibration to localStorage:', error);
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
            <div className="flex flex-col gap-4">
                {/* 스케일 이름 */}
                <div className="w-full max-w-[600px] mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        D Kurd 9
                    </h2>
                </div>
                
                {/* 핸드팬 SVG 영역 */}
                <div
                    className="w-full max-w-[600px] mx-auto aspect-square relative flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg
                        viewBox="0 0 1000 1000"
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 핸드팬 몸체 - 그라데이션 정의 */}
                        <defs>
                            {/* 핸드팬 몸체 - 황동(Brass) 금속 질감 그라데이션 */}
                            <radialGradient id="bodyMetalGradient" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
                                <stop offset="0%" stopColor="#C2A164" />
                                <stop offset="70%" stopColor="#5E4B32" />
                                <stop offset="100%" stopColor="#2A2115" />
                            </radialGradient>

                            {/* 톤필드 - 황동(Brass) 금속 질감 그라데이션 */}
                            <radialGradient id="toneFieldMetalGradient" cx="50%" cy="50%" r="65%" fx="30%" fy="30%">
                                <stop offset="0%" stopColor="#F7EED6" />
                                <stop offset="35%" stopColor="#C2A164" />
                                <stop offset="85%" stopColor="#5E4B32" />
                                <stop offset="100%" stopColor="#423422" />
                            </radialGradient>

                            {/* 딤플 - 황동(Brass) 딤플 그라데이션 */}
                            <radialGradient id="dimpleGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#423422" />
                                <stop offset="100%" stopColor="#5E4B32" />
                            </radialGradient>

                            {/* 림(Rim) - 평평한 금속 테두리 그라데이션 */}
                            <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="85%" stopColor="#4A3B2A" />
                                <stop offset="95%" stopColor="#8C7D64" />
                                <stop offset="100%" stopColor="#2A2115" />
                            </radialGradient>

                            {/* 호환성을 위한 기존 그라데이션 ID 유지 */}
                            <radialGradient id="handpanGradient" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
                                <stop offset="0%" stopColor="#C2A164" />
                                <stop offset="70%" stopColor="#5E4B32" />
                                <stop offset="100%" stopColor="#2A2115" />
                            </radialGradient>
                            <radialGradient id="handpanGradientDark" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
                                <stop offset="0%" stopColor="#C2A164" />
                                <stop offset="70%" stopColor="#5E4B32" />
                                <stop offset="100%" stopColor="#2A2115" />
                            </radialGradient>
                            <radialGradient id="noteGradient" cx="50%" cy="50%" r="65%" fx="30%" fy="30%">
                                <stop offset="0%" stopColor="#F7EED6" />
                                <stop offset="35%" stopColor="#C2A164" />
                                <stop offset="85%" stopColor="#5E4B32" />
                                <stop offset="100%" stopColor="#423422" />
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
                            stroke="#261E14"
                            strokeWidth="1"
                            style={{
                                transition: 'all 0.3s ease',
                                filter: 'url(#handpanShadow)',
                            }}
                        />

                        {/* 가이드라인 - 원 중앙을 가로지르는 가로선과 세로선 */}
                        <line
                            x1="0"
                            y1={centerY}
                            x2="1000"
                            y2={centerY}
                            stroke="#ffffff"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                            opacity="0.6"
                            className="dark:stroke-white"
                        />
                        <line
                            x1={centerX}
                            y1="0"
                            x2={centerX}
                            y2="1000"
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
                            const cx = dingNote.cx || 500;
                            const cy = dingNote.cy || 500;
                            
                            // 3시 방향 외곽선 안쪽 위치 계산
                            const defaultOffset = dingNote.symbolOffset !== undefined ? dingNote.symbolOffset : 15; // 외곽선에서 안쪽으로의 오프셋
                            const symbolX = dingNote.symbolX !== undefined && dingNote.symbolX !== null 
                                ? dingNote.symbolX 
                                : (cx + baseRx - defaultOffset);
                            const symbolY = dingNote.symbolY !== undefined && dingNote.symbolY !== null
                                ? dingNote.symbolY
                                : cy;
                            
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
                                        cursor: 'pointer',
                                        transition: 'fill 0.2s ease, opacity 0.2s ease',
                                        textShadow: isSymbolSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
                                    }}
                                    onClick={(e) => {
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
                            const cx = dingNote.cx || 500;
                            const cy = dingNote.cy || 500;
                            
                            // 9시 방향 외곽선 안쪽 위치 계산
                            const defaultOffset = dingNote.symbolLeftOffset !== undefined ? dingNote.symbolLeftOffset : 15; // 외곽선에서 안쪽으로의 오프셋
                            const symbolLeftX = dingNote.symbolLeftX !== undefined && dingNote.symbolLeftX !== null 
                                ? dingNote.symbolLeftX 
                                : (cx - baseRx + defaultOffset);
                            const symbolLeftY = dingNote.symbolLeftY !== undefined && dingNote.symbolLeftY !== null
                                ? dingNote.symbolLeftY
                                : cy;
                            
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
                                        cursor: 'pointer',
                                        transition: 'fill 0.2s ease, opacity 0.2s ease',
                                        textShadow: isLeftSymbolSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
                                    }}
                                    onClick={(e) => {
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
                            const cx = dingNote.cx || 500;
                            const cy = dingNote.cy || 500;
                            
                            // 하단 외곽선 안쪽 위치 계산
                            const defaultOffset = dingNote.symbolBottomOffset !== undefined ? dingNote.symbolBottomOffset : 15; // 외곽선에서 안쪽으로의 오프셋
                            const symbolBottomX = dingNote.symbolBottomX !== undefined && dingNote.symbolBottomX !== null 
                                ? dingNote.symbolBottomX 
                                : cx;
                            const symbolBottomY = dingNote.symbolBottomY !== undefined && dingNote.symbolBottomY !== null
                                ? dingNote.symbolBottomY
                                : (cy + baseRy - defaultOffset);
                            
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
                                        cursor: 'pointer',
                                        transition: 'fill 0.2s ease, opacity 0.2s ease',
                                        textShadow: isBottomSymbolSelected ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)',
                                    }}
                                    onClick={(e) => {
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
                            // 피치 텍스트 라벨 매핑 (1~8번 노트)
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
                            
                            const pitchLabel = pitchLabels[note.id];
                            if (!pitchLabel) return null;
                            
                            const cx = note.cx || 500;
                            const cy = note.cy || 500;
                            
                            // 피치 텍스트 캘리브레이션 값
                            const pitchX = note.pitchTextX !== undefined ? note.pitchTextX : cx;
                            const pitchY = note.pitchTextY !== undefined ? note.pitchTextY : cy;
                            // D3는 기본값 37, 나머지는 30
                            const defaultPitchScale = note.id === 0 ? 37 : 30;
                            const pitchScale = note.pitchTextScale !== undefined ? note.pitchTextScale : defaultPitchScale;
                            const pitchRotate = note.pitchTextRotate !== undefined ? note.pitchTextRotate : 0;
                            const isPitchSelected = selectedPitchId === note.id;
                            
                            return (
                                <g
                                    key={`pitch-${note.id}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPitchId(note.id);
                                    }}
                                    style={{ cursor: 'pointer' }}
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
                    </svg>
                </div>

                {/* 패널 컨테이너 */}
                <div
                    className="w-full flex flex-col md:flex-row gap-4 panel-container"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 톤필드 캘리브레이션 패널 */}
                    <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
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
                                                    min="0"
                                                    max="1000"
                                                    step="1"
                                                    value={selectedNote.cx || 500}
                                                    onChange={(e) => updateNote(selectedNote.id, { cx: parseFloat(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    step="0.1"
                                                    value={selectedNote.cx?.toFixed(1) || 500}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (!isNaN(value)) {
                                                            updateNote(selectedNote.id, { cx: Math.max(0, Math.min(1000, value)) });
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
                                                    min="0"
                                                    max="1000"
                                                    step="1"
                                                    value={selectedNote.cy || 500}
                                                    onChange={(e) => updateNote(selectedNote.id, { cy: parseFloat(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    step="0.1"
                                                    value={selectedNote.cy?.toFixed(1) || 500}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (!isNaN(value)) {
                                                            updateNote(selectedNote.id, { cy: Math.max(0, Math.min(1000, value)) });
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

                    {/* 라벨 캘리브레이션 패널 */}
                    <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
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
                                                    min="0"
                                                    max="1000"
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
                                                    min="0"
                                                    max="1000"
                                                    step="0.1"
                                                    value={selectedBottomSymbolId !== null
                                                        ? (selectedSymbolTextNote.symbolBottomX !== undefined && selectedSymbolTextNote.symbolBottomX !== null ? selectedSymbolTextNote.symbolBottomX.toFixed(1) : '')
                                                        : selectedLeftSymbolId !== null
                                                        ? (selectedSymbolTextNote.symbolLeftX !== undefined && selectedSymbolTextNote.symbolLeftX !== null ? selectedSymbolTextNote.symbolLeftX.toFixed(1) : '')
                                                        : selectedSymbolId !== null
                                                        ? (selectedSymbolTextNote.symbolX !== undefined && selectedSymbolTextNote.symbolX !== null ? selectedSymbolTextNote.symbolX.toFixed(1) : '')
                                                        : (selectedSymbolTextNote.labelX !== undefined ? selectedSymbolTextNote.labelX.toFixed(1) : '')}
                                                    placeholder="auto"
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                                        if (value === undefined || !isNaN(value)) {
                                                            if (selectedBottomSymbolId !== null) {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    symbolBottomX: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
                                                                });
                                                            } else if (selectedLeftSymbolId !== null) {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    symbolLeftX: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
                                                                });
                                                            } else if (selectedSymbolId !== null) {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    symbolX: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
                                                                });
                                                            } else {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    labelX: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
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
                                                    min="0"
                                                    max="1000"
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
                                                    min="0"
                                                    max="1000"
                                                    step="0.1"
                                                    value={selectedBottomSymbolId !== null
                                                        ? (selectedSymbolTextNote.symbolBottomY !== undefined && selectedSymbolTextNote.symbolBottomY !== null ? selectedSymbolTextNote.symbolBottomY.toFixed(1) : '')
                                                        : selectedLeftSymbolId !== null
                                                        ? (selectedSymbolTextNote.symbolLeftY !== undefined && selectedSymbolTextNote.symbolLeftY !== null ? selectedSymbolTextNote.symbolLeftY.toFixed(1) : '')
                                                        : selectedSymbolId !== null
                                                        ? (selectedSymbolTextNote.symbolY !== undefined && selectedSymbolTextNote.symbolY !== null ? selectedSymbolTextNote.symbolY.toFixed(1) : '')
                                                        : (selectedSymbolTextNote.labelY !== undefined ? selectedSymbolTextNote.labelY.toFixed(1) : '')}
                                                    placeholder="auto"
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                                        if (value === undefined || !isNaN(value)) {
                                                            if (selectedBottomSymbolId !== null) {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    symbolBottomY: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
                                                                });
                                                            } else if (selectedLeftSymbolId !== null) {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    symbolLeftY: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
                                                                });
                                                            } else if (selectedSymbolId !== null) {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    symbolY: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
                                                                });
                                                            } else {
                                                                updateNote(selectedSymbolTextNote.id, {
                                                                    labelY: value === undefined ? undefined : Math.max(0, Math.min(1000, value))
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
                    
                    {/* 피치 캘리브레이션 패널 */}
                    <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
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
                                                    min="0"
                                                    max="1000"
                                                    step="1"
                                                    value={selectedPitchNote.pitchTextX !== undefined ? selectedPitchNote.pitchTextX : (selectedPitchNote.cx || 500)}
                                                    onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextX: parseFloat(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    step="0.1"
                                                    value={(selectedPitchNote.pitchTextX !== undefined ? selectedPitchNote.pitchTextX : (selectedPitchNote.cx || 500)).toFixed(1)}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (!isNaN(value)) {
                                                            updateNote(selectedPitchNote.id, { pitchTextX: Math.max(0, Math.min(1000, value)) });
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
                                                    min="0"
                                                    max="1000"
                                                    step="1"
                                                    value={selectedPitchNote.pitchTextY !== undefined ? selectedPitchNote.pitchTextY : (selectedPitchNote.cy || 500)}
                                                    onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextY: parseFloat(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    step="0.1"
                                                    value={(selectedPitchNote.pitchTextY !== undefined ? selectedPitchNote.pitchTextY : (selectedPitchNote.cy || 500)).toFixed(1)}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (!isNaN(value)) {
                                                            updateNote(selectedPitchNote.id, { pitchTextY: Math.max(0, Math.min(1000, value)) });
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
                                                    value={selectedPitchNote.pitchTextScale !== undefined ? selectedPitchNote.pitchTextScale : (selectedPitchNote.id === 0 ? 37 : 30)}
                                                    onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextScale: parseFloat(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    min="10"
                                                    max="100"
                                                    step="0.1"
                                                    value={(selectedPitchNote.pitchTextScale !== undefined ? selectedPitchNote.pitchTextScale : (selectedPitchNote.id === 0 ? 37 : 30)).toFixed(1)}
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
                                                    value={selectedPitchNote.pitchTextRotate !== undefined ? selectedPitchNote.pitchTextRotate : 0}
                                                    onChange={(e) => updateNote(selectedPitchNote.id, { pitchTextRotate: parseFloat(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="360"
                                                    step="0.1"
                                                    value={(selectedPitchNote.pitchTextRotate !== undefined ? selectedPitchNote.pitchTextRotate : 0).toFixed(1)}
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
                </div>
            </div>
        </div>
    );
}
