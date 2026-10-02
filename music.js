export function createFunkyMusic() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    let context;
    let masterGain;
    let noiseBuffer;
    let scheduler;
    let isPlaying = false;
    let nextStepTime = 0;
    let step = 0;

    const tempo = 106;
    const stepLength = 60 / tempo / 4;
    const bassBars = [
        [36, 0, 36, 43, 46, 0, 48, 46, 36, 0, 43, 0, 45, 46, 43, 0],
        [36, 0, 36, 43, 46, 0, 48, 46, 36, 43, 46, 0, 45, 46, 43, 48],
        [41, 0, 41, 0, 48, 51, 48, 0, 41, 0, 48, 0, 51, 53, 51, 0],
        [43, 0, 43, 0, 50, 53, 50, 0, 43, 0, 50, 0, 53, 55, 53, 43]
    ];
    const kickPatterns = [[0, 7, 10], [0, 6, 10, 14], [0, 7, 10], [0, 6, 10, 15]];
    const snarePatterns = [[4, 12], [4, 12], [4, 12], [4, 12, 15]];
    const chordPatterns = [[0, 6, 10, 14], [0, 7, 10, 14], [0, 6, 12, 14], [0, 4, 10, 14]];
    const chordVoicings = [
        [60, 67, 70, 74],
        [60, 64, 67, 70],
        [65, 72, 75, 79],
        [67, 71, 74, 77]
    ];
    const midiFrequency = (note) => 440 * Math.pow(2, (note - 69) / 12);

    function ensureAudioGraph() {
        if (!AudioContextConstructor) throw new Error("Web Audio is not supported in this browser.");
        if (context) return;

        context = new AudioContextConstructor();
        masterGain = context.createGain();
        masterGain.gain.value = 0.0001;
        masterGain.connect(context.destination);

        const bufferLength = context.sampleRate * 2;
        noiseBuffer = context.createBuffer(1, bufferLength, context.sampleRate);
        const noise = noiseBuffer.getChannelData(0);
        for (let index = 0; index < bufferLength; index++) noise[index] = Math.random() * 2 - 1;
    }

    function playKick(time) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(135, time);
        oscillator.frequency.exponentialRampToValueAtTime(48, time + 0.13);
        envelope.gain.setValueAtTime(0.48, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        oscillator.connect(envelope);
        envelope.connect(masterGain);
        oscillator.start(time);
        oscillator.stop(time + 0.21);
    }

    function playNoise(time, cutoff, volume, duration, filterType) {
        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const envelope = context.createGain();
        source.buffer = noiseBuffer;
        filter.type = filterType;
        filter.frequency.value = cutoff;
        envelope.gain.setValueAtTime(volume, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
        source.connect(filter);
        filter.connect(envelope);
        envelope.connect(masterGain);
        source.start(time);
        source.stop(time + duration);
    }

    function playSnare(time) {
        playNoise(time, 1500, 0.18, 0.12, "highpass");

        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = "triangle";
        oscillator.frequency.value = 185;
        envelope.gain.setValueAtTime(0.11, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
        oscillator.connect(envelope);
        envelope.connect(masterGain);
        oscillator.start(time);
        oscillator.stop(time + 0.1);
    }

    function playBass(time, note) {
        const oscillator = context.createOscillator();
        const filter = context.createBiquadFilter();
        const envelope = context.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = midiFrequency(note);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(720, time);
        filter.frequency.exponentialRampToValueAtTime(260, time + 0.15);
        envelope.gain.setValueAtTime(0.001, time);
        envelope.gain.linearRampToValueAtTime(0.24, time + 0.012);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
        oscillator.connect(filter);
        filter.connect(envelope);
        envelope.connect(masterGain);
        oscillator.start(time);
        oscillator.stop(time + 0.17);
    }

    function playChord(time, notes) {
        const envelope = context.createGain();
        envelope.gain.setValueAtTime(0.001, time);
        envelope.gain.linearRampToValueAtTime(0.075, time + 0.008);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        envelope.connect(masterGain);

        notes.forEach((note) => {
            const oscillator = context.createOscillator();
            oscillator.type = "triangle";
            oscillator.frequency.value = midiFrequency(note);
            oscillator.connect(envelope);
            oscillator.start(time);
            oscillator.stop(time + 0.16);
        });
    }

    function scheduleStep(time, barIndex, stepIndex) {
        const swing = stepIndex % 2 ? stepLength * 0.12 : 0;
        const noteTime = time + swing;

        if (kickPatterns[barIndex].includes(stepIndex)) playKick(noteTime);
        if (snarePatterns[barIndex].includes(stepIndex)) playSnare(noteTime);
        if (stepIndex % 2 === 0 || stepIndex === 7 || stepIndex === 15) {
            const openHat = (barIndex === 1 || barIndex === 3) && stepIndex === 14;
            playNoise(noteTime, 7600, stepIndex % 4 === 0 ? 0.045 : 0.025, openHat ? 0.09 : 0.045, "highpass");
        }
        if (barIndex === 1 && stepIndex === 11) playNoise(noteTime, 1900, 0.045, 0.065, "highpass");
        if (bassBars[barIndex][stepIndex]) playBass(noteTime, bassBars[barIndex][stepIndex]);
        if (chordPatterns[barIndex].includes(stepIndex)) playChord(noteTime, chordVoicings[barIndex]);
    }

    function scheduleAhead() {
        const now = context.currentTime;
        if (nextStepTime < now) nextStepTime = now + 0.02;

        while (nextStepTime < now + 0.12) {
            scheduleStep(nextStepTime, Math.floor(step / 16), step % 16);
            nextStepTime += stepLength;
            step = (step + 1) % (bassBars.length * 16);
        }
    }

    async function start() {
        if (isPlaying) return;
        ensureAudioGraph();
        await context.resume();
        masterGain.gain.cancelScheduledValues(context.currentTime);
        masterGain.gain.setTargetAtTime(0.28, context.currentTime, 0.04);
        nextStepTime = context.currentTime + 0.04;
        isPlaying = true;
        scheduleAhead();
        scheduler = window.setInterval(scheduleAhead, 25);
    }

    function stop() {
        if (!isPlaying) return;
        isPlaying = false;
        window.clearInterval(scheduler);
        masterGain.gain.cancelScheduledValues(context.currentTime);
        masterGain.gain.setTargetAtTime(0.0001, context.currentTime, 0.025);
        window.setTimeout(() => {
            if (!isPlaying && context.state === "running") context.suspend();
        }, 180);
    }

    return {
        start,
        stop,
        get loopBars() { return bassBars.length; },
        get loopDuration() { return bassBars.length * 16 * stepLength; },
        get isPlaying() { return isPlaying; }
    };
}