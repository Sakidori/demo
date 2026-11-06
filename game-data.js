export const TEAM_COLORS = [
    { id: "red", name: "Red", hex: "#e11d48" },
    { id: "flamingo", name: "Flamingo", hex: "#ff1493" },
    { id: "orange", name: "Orange", hex: "#ea580c" },
    { id: "yellow", name: "Yellow", hex: "#eab308" },
    { id: "lime", name: "Lime", hex: "#65a30d" },
    { id: "emerald", name: "Emerald", hex: "#059669" },
    { id: "teal", name: "Teal", hex: "#0d9488" },
    { id: "sky", name: "Sky", hex: "#7dd3fc" },
    { id: "blue", name: "Blue", hex: "#2563eb" },
    { id: "denim", name: "Denim", hex: "#1e3a8a" },
    { id: "purple", name: "Purple", hex: "#6f2da8" },
    { id: "peach", name: "Peach", hex: "#ffb38a" },
    { id: "lavender", name: "Lavender", hex: "#a78bfa" },
    { id: "pink", name: "Pink", hex: "#f9a8d4" },
    { id: "brown", name: "Brown", hex: "#92400e" },
    { id: "ash", name: "Ash", hex: "#9ca3af" },
    { id: "carbon", name: "Carbon", hex: "#111827" },
    { id: "snow", name: "Snow", hex: "#f8fafc" }
];

export const MAX_PLAYERS = 18;
export const BOMB_PASS_BASE_POINTS = 50;
export const BOMB_PASS_AUTO_SECONDS = 10;
export const BOMB_HOLDER_LOCK_TIMEOUT_SECONDS = 20;
export const BOMB_PASS_POINT_DRAIN_INTERVAL_SECONDS = 5;
export const BOMB_PASS_POINTS_PER_INTERVAL = 1;

export function getBombUnlockedSeconds(unlockedAt, now = Date.now()) {
    const timestamp = Number(unlockedAt);
    if (!Number.isFinite(timestamp) || timestamp <= 0) return 0;
    return Math.max(0, Math.floor((now - timestamp) / 1000));
}

export function getBombPassPoints(unlockedAt, now = Date.now()) {
    const elapsedSeconds = getBombUnlockedSeconds(unlockedAt, now);
    const elapsedIntervals = Math.floor(elapsedSeconds / BOMB_PASS_POINT_DRAIN_INTERVAL_SECONDS);
    return Math.max(0, BOMB_PASS_BASE_POINTS - elapsedIntervals * BOMB_PASS_POINTS_PER_INTERVAL);
}

export function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
}

export const TEAM_ANIMALS = [
    { id: "fox", name: "Fox", plural: "Foxes", avatar: "🦊" },
    { id: "panda", name: "Panda", plural: "Pandas", avatar: "🐼" },
    { id: "frog", name: "Frog", plural: "Frogs", avatar: "🐸" },
    { id: "tiger", name: "Tiger", plural: "Tigers", avatar: "🐯" },
    { id: "octopus", name: "Octopus", plural: "Octopuses", avatar: "🐙" },
    { id: "owl", name: "Owl", plural: "Owls", avatar: "🦉" },
    { id: "penguin", name: "Penguin", plural: "Penguins", avatar: "🐧" },
    { id: "unicorn", name: "Unicorn", plural: "Unicorns", avatar: "🦄" },
    { id: "koala", name: "Koala", plural: "Koalas", avatar: "🐨" },
    { id: "lion", name: "Lion", plural: "Lions", avatar: "🦁" },
    { id: "monkey", name: "Monkey", plural: "Monkeys", avatar: "🐵" },
    { id: "turtle", name: "Turtle", plural: "Turtles", avatar: "🐢" },
    { id: "wolf", name: "Wolf", plural: "Wolves", avatar: "🐺" },
    { id: "rabbit", name: "Rabbit", plural: "Rabbits", avatar: "🐰" },
    { id: "bear", name: "Bear", plural: "Bears", avatar: "🐻" },
    { id: "dolphin", name: "Dolphin", plural: "Dolphins", avatar: "🐬" },
    { id: "whale", name: "Whale", plural: "Whales", avatar: "🐳" },
    { id: "dinosaur", name: "Dinosaur", plural: "Dinosaurs", avatar: "🦖" }
];

export const TONGUE_TWISTERS = [
    "She sells seashells by the seashore.",
    "How much wood could a woodchuck chuck if a woodchuck could chuck wood?",
    "Peter Piper picked a pack of pickled peppers.",
    "How can a clam cram in a clean cream can?",
    "Susie works in a shoeshine shop. Where she shines she sits, and where she sits she shines.",
    "I'm not the pheasant plucker, I'm the pheasant plucker's son.",
    "If a dog chews shoes, whose shoes does he choose?",
    "A skunk sat on a stump and thunk the stump stunk, but the stump thunk the skunk stunk.",
    "I thought a thought. But the thought I thought wasn't the thought I thought I thought.",
    "The big black bug bit a big black bear and the big black bear bled blue-black blood.",
    "Dead in the middle of Little Italy, little did we know that we riddled some middleman who didn't do diddly.",
    "He thrusts his fists against the posts and still insists he sees the ghosts."
];