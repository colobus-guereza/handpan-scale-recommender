import * as Tone from 'tone';

export interface ChordSet {
    barStart: number; // 시작 마디 (1, 5, 9, 13)
    notes: string[];  // 재생할 노트 이름 배열 ["D3", "A3", "C4"]
    role: string;     // 디버깅용 역할 이름 (Root, Hope, etc)
    chordType: string; // 화음 유형 (major, minor, power)
}

/**
 * [Smart Harmony Logic]
 * 단순 인덱스가 아닌, '반음 간격(Semitone)'을 계산하여
 * 불협화음이 없는 최적의 3화음 혹은 파워코드(2화음)를 찾아냅니다.
 * 
 * 핵심 원리:
 * - 3도: Root + 3 semitones (단3도) 또는 + 4 semitones (장3도)
 * - 5도: Root + 7 semitones (완전5도)
 * - Fallback: 3도가 스케일에 없으면 Power Chord(1+5)만 사용
 * 
 * @param scaleNotes 스케일 구성음 배열 (예: ["D3", "A3", "Bb3", ...])
 */
export const calculateChordProgression = (scaleNotes: string[]): ChordSet[] => {
    const len = scaleNotes.length;

    // 안전장치: 노트가 너무 적으면 계산 불가
    if (len < 5) return [];

    // 1. MIDI Note Map 생성 (계산 효율화)
    const noteToMidi = new Map<string, number>();
    const midiToNote = new Map<number, string>();

    scaleNotes.forEach(note => {
        const midi = Tone.Frequency(note).toMidi();
        noteToMidi.set(note, midi);
        midiToNote.set(midi, note);
    });

    // 스케일의 모든 MIDI 노트 배열 (오름차순 정렬)
    const sortedMidis = Array.from(noteToMidi.values()).sort((a, b) => a - b);

    /**
     * Helper: 스케일 내에서 가장 잘 어울리는 3rd, 5th 찾기
     * @param rootNote 루트 노트 문자열 (예: "D3")
     * @returns 화음을 구성할 노트 배열 및 화음 유형
     */
    const findHarmonicNotes = (rootNote: string): { notes: string[], chordType: string } => {
        const rootMidi = noteToMidi.get(rootNote);
        if (rootMidi === undefined) return { notes: [rootNote], chordType: 'single' };

        const chordNotes: string[] = [rootNote];
        let chordType = 'power'; // 기본값: Power Chord

        // 1. Find Perfect 5th (+7 semitones)
        // 스케일에 정확히 +7인 음이 있으면 베스트, 없으면 ±1 범위 내에서 찾기
        let perfectFifthMidi: number | undefined;

        // 정확히 +7 찾기
        perfectFifthMidi = sortedMidis.find(m => m === rootMidi + 7);

        // 없으면 +6 또는 +8 범위에서 찾기 (diminished 5th 또는 augmented 5th)
        if (!perfectFifthMidi) {
            perfectFifthMidi = sortedMidis.find(m => m === rootMidi + 6 || m === rootMidi + 8);
        }

        // 옥타브 위에서도 찾기 (+7+12 = +19)
        if (!perfectFifthMidi) {
            perfectFifthMidi = sortedMidis.find(m => m === rootMidi + 19);
        }

        // 2. Find 3rd (+3 Minor or +4 Major)
        const minor3rdMidi = sortedMidis.find(m => m === rootMidi + 3);
        const major3rdMidi = sortedMidis.find(m => m === rootMidi + 4);

        // 옥타브 위에서도 찾기
        const minor3rdOctaveMidi = sortedMidis.find(m => m === rootMidi + 15); // +3+12
        const major3rdOctaveMidi = sortedMidis.find(m => m === rootMidi + 16); // +4+12

        // 3도 결정: 스케일에 있는 것 우선
        // 단3도 → 장3도 → 옥타브 위 단3도 → 옥타브 위 장3도 순으로 탐색
        let thirdMidi: number | undefined;

        if (minor3rdMidi) {
            thirdMidi = minor3rdMidi;
            chordType = 'minor';
        } else if (major3rdMidi) {
            thirdMidi = major3rdMidi;
            chordType = 'major';
        } else if (minor3rdOctaveMidi) {
            thirdMidi = minor3rdOctaveMidi;
            chordType = 'minor';
        } else if (major3rdOctaveMidi) {
            thirdMidi = major3rdOctaveMidi;
            chordType = 'major';
        }

        // 화음 구성 (순서: Root → 3rd → 5th)
        if (thirdMidi && midiToNote.has(thirdMidi)) {
            chordNotes.push(midiToNote.get(thirdMidi)!);
        }

        if (perfectFifthMidi && midiToNote.has(perfectFifthMidi)) {
            chordNotes.push(midiToNote.get(perfectFifthMidi)!);
        }

        // 3도가 없으면 Power Chord 유지
        if (!thirdMidi) {
            chordType = 'power';
        }

        return { notes: chordNotes, chordType };
    };

    // 2. Progression Pattern (Standard Pop: 1 - 6 - 4 - 5)
    // 스케일 내 인덱스 기준으로 Root를 결정하되, 화음 구성은 스마트 로직 사용
    const progressionIndices = [
        { idx: 0, bar: 1, role: "The Root (I)" },
        { idx: 5 % len, bar: 5, role: "The Hope (VI)" },
        { idx: 3 % len, bar: 9, role: "The Deep (IV)" },
        { idx: 4 % len, bar: 13, role: "The Climax (V)" }
    ];

    return progressionIndices.map(prog => {
        const rootNote = scaleNotes[prog.idx];
        // 여기서 스마트하게 화음 구성
        const { notes: harmonicNotes, chordType } = findHarmonicNotes(rootNote);

        return {
            barStart: prog.bar,
            notes: harmonicNotes,
            role: prog.role,
            chordType
        };
    });
};

/**
 * 디버깅용: 스케일과 계산된 화음 정보를 콘솔에 출력
 */
export const debugChordProgression = (scaleNotes: string[], scaleName?: string): void => {
    console.group(`🎵 Chord Progression Analysis ${scaleName ? `for ${scaleName}` : ''}`);
    console.log('Scale Notes:', scaleNotes);

    const chords = calculateChordProgression(scaleNotes);

    chords.forEach(chord => {
        console.log(
            `Bar ${chord.barStart}: ${chord.role}`,
            `| Type: ${chord.chordType}`,
            `| Notes: [${chord.notes.join(', ')}]`
        );
    });

    console.groupEnd();
};
