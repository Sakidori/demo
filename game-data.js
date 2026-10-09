export const TEAM_COLORS = [
    { id: "red", name: "Red", hex: "#e11d48" },
    { id: "orange", name: "Orange", hex: "#ea580c" },
    { id: "amber", name: "Amber", hex: "#ca8a04" },
    { id: "lime", name: "Lime", hex: "#65a30d" },
    { id: "green", name: "Green", hex: "#16a34a" },
    { id: "emerald", name: "Emerald", hex: "#059669" },
    { id: "teal", name: "Teal", hex: "#0d9488" },
    { id: "cyan", name: "Cyan", hex: "#0891b2" },
    { id: "sky", name: "Sky", hex: "#0284c7" },
    { id: "blue", name: "Blue", hex: "#2563eb" },
    { id: "indigo", name: "Indigo", hex: "#4f46e5" },
    { id: "violet", name: "Violet", hex: "#7c3aed" },
    { id: "purple", name: "Purple", hex: "#9333ea" },
    { id: "fuchsia", name: "Fuchsia", hex: "#c026d3" },
    { id: "pink", name: "Pink", hex: "#db2777" },
    { id: "slate", name: "Slate", hex: "#475569" },
    { id: "silver", name: "Silver", hex: "#cbd5e1" },
    { id: "brown", name: "Brown", hex: "#92400e" }
];

export const MAX_PLAYERS = 18;

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