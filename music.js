export function createFunkyMusic() {
    let volume = 0.3;
    const fadeDuration = 1000;
    const tracks = new Map([
        ["lobby", new Audio(new URL("./bgm.mp3", import.meta.url))],
        ["game", new Audio(new URL("./bgm2.mp3", import.meta.url))]
    ]);
    let desiredTrack = null;
    let fadeInterval = null;

    tracks.forEach((track) => {
        track.loop = true;
        track.preload = "auto";
        track.volume = 0;
    });

    function cancelFade() {
        if (fadeInterval === null) return;
        clearInterval(fadeInterval);
        fadeInterval = null;
    }

    function fadeTo(trackName) {
        cancelFade();
        const startingVolumes = new Map(Array.from(tracks, ([name, track]) => [name, track.volume]));
        const startedAt = performance.now();
        fadeInterval = window.setInterval(() => {
            const progress = Math.min((performance.now() - startedAt) / fadeDuration, 1);
            tracks.forEach((track, name) => {
                const targetVolume = name === trackName ? volume : 0;
                const startingVolume = startingVolumes.get(name) || 0;
                track.volume = startingVolume + (targetVolume - startingVolume) * progress;
            });
            if (progress < 1) return;

            cancelFade();
            tracks.forEach((track, name) => {
                if (name === trackName) return;
                track.pause();
                track.volume = 0;
            });
        }, 25);
    }

    async function start(trackName = "lobby") {
        const targetTrack = tracks.get(trackName);
        if (!targetTrack) throw new Error(`Unknown music track: ${trackName}`);
        if (desiredTrack === trackName && (!targetTrack.paused || fadeInterval !== null)) return;

        desiredTrack = trackName;
        if (targetTrack.paused) {
            try {
                await targetTrack.play();
            } catch (error) {
                if (desiredTrack === trackName) {
                    desiredTrack = null;
                    fadeTo(null);
                }
                throw error;
            }
        }
        if (desiredTrack !== trackName) return;
        fadeTo(trackName);
    }

    function stop() {
        if (desiredTrack === null && Array.from(tracks.values()).every((track) => track.paused)) return;
        desiredTrack = null;
        fadeTo(null);
    }

    function setVolume(level) {
        const nextVolume = Math.max(0, Math.min(1, Number(level) || 0));
        if (nextVolume === volume) return;
        volume = nextVolume;
        if (desiredTrack !== null) fadeTo(desiredTrack);
    }

    return {
        start,
        stop,
        setVolume,
        get isPlaying() { return desiredTrack !== null; },
        get currentTrack() { return desiredTrack; },
        get volume() { return volume; }
    };
}