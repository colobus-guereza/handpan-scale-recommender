export interface ChordSet {
    barStart: number; // 시작 마디 (1, 5, 9, 13)
    notes: string[];  // 재생할 노트 이름 배열 ["D3", "A3", "C4"]
    role: string;     // 디버깅용 역할 이름 (Root, Hope, etc)
}

/**
 * 스케일 노트를 받아서 16마디용 4개의 화음 진행을 계산함
 * @param scaleNotes 스케일 구성음 배열 (예: ["D3", "A3", "Bb3", ...])
 */
export const calculateChordProgression = (scaleNotes: string[]): ChordSet[] => {
    const len = scaleNotes.length;

    // 안전장치: 노트가 너무 적으면 계산 불가
    if (len < 5) return [];

    // 1. 진행 패턴 정의 (스케일 내 인덱스 기준)
    // ★ Standard Pop Progression (1 - 6 - 4 - 5)
    // 0-Index 기준: 0 - 5 - 3 - 4
    // 스토리: 기(Root) -> 승(Hope) -> 전(Groove) -> 결(Climax)
    const progressionIndices = [
        { idx: 0, bar: 1, role: "The Root (I) - Start" },
        { idx: 5 % len, bar: 5, role: "The Hope (VI) - Lift" },
        { idx: 3 % len, bar: 9, role: "The Deep (IV) - Groove" },
        { idx: 4 % len, bar: 13, role: "The Climax (V) - Tension" }
    ];

    const chords: ChordSet[] = progressionIndices.map((prog) => {
        const rootIdx = prog.idx;

        // 징검다리 화법 (Triad Stack: Root + 3rd + 5th)
        // 스케일 내의 음만 사용하므로 무조건 어울림
        const note1 = scaleNotes[rootIdx];
        const note2 = scaleNotes[(rootIdx + 2) % len];
        const note3 = scaleNotes[(rootIdx + 4) % len];

        return {
            barStart: prog.bar,
            notes: [note1, note2, note3],
            role: prog.role
        };
    });

    return chords;
};
