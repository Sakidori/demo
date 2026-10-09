export function createFunkyMusic() {
    let track = null;
    let isPlaying = false;

    async function start() {
        if (isPlaying) return;
        if (!track) {
            track = new Audio(new URL("./bgm.mp3", import.meta.url));
            track.loop = true;
            track.preload = "auto";
            track.volume = 0.3;
        }
        await track.play();
        isPlaying = true;
    }

    function stop() {
        if (!track || !isPlaying) return;
        track.pause();
        isPlaying = false;
    }

    return {
        start,
        stop,
        get isPlaying() { return isPlaying; }
    };
}