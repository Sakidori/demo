export function createFunkyMusic() {
    let volume = 0.3;
    const fadeDuration = 1000;
    const tracks = new Map([
        ["lobby", new Audio(new URL("./bgm.mp3", import.meta.url))],
        ["game-2", new Audio(new URL("./bgm2.mp3", import.meta.url))],
        ["game-3", new Audio(new URL("./bgm3.mp3", import.meta.url))],
        ["game-4", new Audio(new URL("./bgm4.mp3", import.meta.url))],
        ["game-5", new Audio(new URL("./bgm5.mp3", import.meta.url))]
    ]);
    const gamePlaylist = ["game-2", "game-3", "game-4", "game-5"];
    let desiredTrack = null;
    let activeTrack = null;
    let selectedPlaylist = null;
    let gamePlaylistIndex = 0;
    let fadeInterval = null;

    tracks.forEach((track, name) => {
        track.loop = name === "lobby";
        track.preload = "auto";
        track.volume = 0;
    });

    function cancelFade() {
        if (fadeInterval === null) return;
        clearInterval(fadeInterval);
        fadeInterval = null;
    }

    async function startTrack(trackName, playlistName) {
        const targetTrack = tracks.get(trackName);
        activeTrack = trackName;
        if (targetTrack.paused) {
            try {
                await targetTrack.play();
            } catch (error) {
                if (desiredTrack === playlistName) {
                    desiredTrack = null;
                    activeTrack = null;
                    fadeTo(null);
                }
                throw error;
            }
        }
        if (desiredTrack !== playlistName || activeTrack !== trackName) {
            targetTrack.pause();
            return;
        }
        fadeTo(trackName);
    }

    gamePlaylist.forEach((trackName, index) => {
        tracks.get(trackName).addEventListener("ended", () => {
            if (desiredTrack !== "game" || activeTrack !== trackName) return;
            gamePlaylistIndex = (index + 1) % gamePlaylist.length;
            void startTrack(gamePlaylist[gamePlaylistIndex], "game")
                .catch((error) => console.error(`Could not play ${gamePlaylist[gamePlaylistIndex]}.`, error));
        });
    });

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

    function changeGameTrack(direction) {
        if (selectedPlaylist !== "game") return Promise.resolve();
        gamePlaylistIndex = (gamePlaylistIndex + direction + gamePlaylist.length) % gamePlaylist.length;
        if (desiredTrack !== "game") return Promise.resolve();
        return startTrack(gamePlaylist[gamePlaylistIndex], "game");
    }

    async function start(trackName = "lobby") {
        if (trackName !== "lobby" && trackName !== "game") {
            throw new Error(`Unknown music track: ${trackName}`);
        }
        if (desiredTrack === trackName
            && (activeTrack === null || !tracks.get(activeTrack).paused || fadeInterval !== null)) return;

        desiredTrack = trackName;
        if (trackName === "lobby") {
            selectedPlaylist = "lobby";
            activeTrack = "lobby";
            await startTrack("lobby", "lobby");
            return;
        }
        if (selectedPlaylist !== "game") gamePlaylistIndex = 0;
        selectedPlaylist = "game";
        await startTrack(gamePlaylist[gamePlaylistIndex], "game");
    }

    function stop() {
        if (desiredTrack === null && Array.from(tracks.values()).every((track) => track.paused)) return;
        desiredTrack = null;
        activeTrack = null;
        fadeTo(null);
    }

    function setVolume(level) {
        const nextVolume = Math.max(0, Math.min(1, Number(level) || 0));
        if (nextVolume === volume) return;
        volume = nextVolume;
        if (desiredTrack !== null && activeTrack !== null) fadeTo(activeTrack);
    }

    return {
        start,
        stop,
        setVolume,
        nextTrack: () => changeGameTrack(1),
        previousTrack: () => changeGameTrack(-1),
        get isPlaying() { return desiredTrack !== null; },
        get currentTrack() { return desiredTrack; },
        get volume() { return volume; }
    };
}