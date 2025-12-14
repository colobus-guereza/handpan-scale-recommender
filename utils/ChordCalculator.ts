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
    // 스토리: 기(Root) -> 승(High) -> 전(Mid) -> 결(Tension)
    // D Kurd 예시: 0(D) -> 5(F) -> 2(Bb) -> 3(C)
    const progressionIndices = [
        { idx: 0, bar: 1, role: "The Root (Start)" },
        { idx: 5 % len, bar: 5, role: "The Hope (Lift)" },    // 6번째 음
        { idx: 2 % len, bar: 9, role: "The Deep (Emotion)" }, // 3번째 음
        { idx: 3 % len, bar: 13, role: "The Tension (Return)" } // 4번째 음
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
