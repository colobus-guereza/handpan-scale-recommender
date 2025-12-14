export class PolyphonicPadEngine {
    private ctx: AudioContext;
    private masterGain: GainNode;

    // 현재 재생 중인 모든 오실레이터 노드를 추적하여 필요 시 중단(Stop)할 수 있게 함
    private activeNodes: AudioScheduledSourceNode[] = [];

    constructor(audioContext: AudioContext) {
        this.ctx = audioContext;

        // Master Output
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // 전체 볼륨 (너무 크지 않게)
        this.masterGain.connect(this.ctx.destination);
    }

    /**
     * 단일 코드(여러 주파수)를 지정된 시간에 예약(Schedule)합니다.
     * Lookahead 방식이나 전체 곡을 미리 스케줄링할 때 사용.
     */
    public scheduleChord(frequencies: number[], startTime: number, duration: number) {
        // 코드가 비어있거나 시간이 과거라면 무시
        if (!frequencies.length) return;

        const attackTime = 0.5;
        const releaseTime = 1.0;

        // 실제 소리가 나는 시간은 attack + sustain + release
        // 하지만 다음 코드와 겹치지 않게 하려면 duration 내에 해결하거나,
        // 서로 겹치게(Legato) 하려면 노드를 별도로 관리해야 함.
        // 여기서는 "Pad" 느낌을 위해 약간의 겹침(Release overlap)을 허용.

        frequencies.forEach((freq, index) => {
            this.createVoice(freq, startTime, duration, attackTime, releaseTime, index);
        });
    }

    /**
     * 단일 보이스(Oscillator) 생성 및 연결
     */
    private createVoice(freq: number, startTime: number, duration: number, attack: number, release: number, index: number) {
        const t = startTime;
        const dur = duration; // 지속 시간 (s)

        // 1. Oscillator Generation
        const osc = this.ctx.createOscillator();
        // 톱니파(Sawtooth)나 삼각파(Triangle)가 Pad에 적합
        // 베이스(저음)는 Triangle, 화음(고음)은 Sawtooth로 섞어 쓸 수도 있음
        osc.type = freq < 200 ? 'triangle' : 'sawtooth';
        osc.frequency.value = freq;

        // Detune: 풍성한 코러스 효과를 위해 미세하게 비틂
        // 랜덤하게 -10 ~ +10 cents
        const detuneVal = (Math.random() - 0.5) * 15;
        osc.detune.value = detuneVal;

        // 2. Filter (Low Pass)
        // 톱니파의 날카로운 배음을 깎아 부드럽게 만듦
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800; // Cutoff
        filter.Q.value = 1; // Resonance

        // 3. Envelope (Gain)
        const env = this.ctx.createGain();
        env.gain.value = 0;

        // 연결 그래프: Osc -> Filter -> Envelope -> Master
        osc.connect(filter);
        filter.connect(env);
        env.connect(this.masterGain);

        // 4. ADSR Scheduling
        // Attack
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.2, t + attack); // Max Volume 0.2

        // Sustain (유지) -> Release
        // duration 시점에서 릴리즈 시작
        env.gain.setValueAtTime(0.2, t + dur);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur + release);

        // 5. Start / Stop
        osc.start(t);
        osc.stop(t + dur + release + 0.1); // 충분히 여유를 두고 정지

        // 가비지 컬렉션을 위해 배열에 넣었다가 끝나면 빼는 로직이 있으면 좋지만,
        // Web Audio 노드는 연결이 끊기고 정지되면 자동 수거되므로, 
        // "비상 정지(Stop All)" 기능을 위해서만 activeNodes에 보관한다.
        this.activeNodes.push(osc);

        osc.onended = () => {
            // 배열에서 제거 (메모리 관리)
            const idx = this.activeNodes.indexOf(osc);
            if (idx > -1) this.activeNodes.splice(idx, 1);
        };
    }

    /**
     * 모든 소리 즉시 중단 (비상용/스케일 변경 시)
     */
    public stopAll() {
        this.activeNodes.forEach(node => {
            try {
                node.stop();
                node.disconnect();
            } catch (e) {
                // 이미 멈춘 노드일 수 있음
            }
        });
        this.activeNodes = [];

        // Gain reset
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    }
}
