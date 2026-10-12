export function createFunkyMusic() {
    const volume = 0.3;
    const fadeOutDuration = 700;
    let track = null;
    let isPlaying = false;
    let fadeInterval = null;

    function cancelFade() {
        if (fadeInterval === null) return;
        clearInterval(fadeInterval);
        fadeInterval = null;
    }

    async function start() {
        if (!track) {
            track = new Audio(new URL("./bgm.mp3", import.meta.url));
            track.loop = true;
            track.preload = "auto";
            track.volume = volume;
        }
        const wasFading = fadeInterval !== null;
        cancelFade();
        track.volume = volume;
        if (isPlaying && !wasFading) return;
        const playback = track.play();
        isPlaying = true;
        try {
            await playback;
        } catch (error) {
            isPlaying = false;
            throw error;
        }
    }

    function stop() {
        if (!track || (!isPlaying && fadeInterval === null)) return;
        isPlaying = false;
        cancelFade();
        const startingVolume = track.volume;
        const fadeStartedAt = performance.now();
        fadeInterval = setInterval(() => {
            const progress = Math.min((performance.now() - fadeStartedAt) / fadeOutDuration, 1);
            track.volume = startingVolume * (1 - progress);
            if (progress < 1) return;
            cancelFade();
            track.pause();
            track.volume = volume;
        }, 25);
    }

    return {
        start,
        stop,
        get isPlaying() { return isPlaying; }
    };
}