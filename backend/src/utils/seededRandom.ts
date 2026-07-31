// Mulberry32 PRNG - deterministic pseudo-random number generator
// Same seed always produces the same sequence
export function createSeededRandom(seed: number): () => number {
    let state = seed | 0;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Helper: pick random element from array using seeded RNG
export function seededPick<T>(rng: () => number, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}

// Helper: random int in [min, max] inclusive
export function seededInt(rng: () => number, min: number, max: number): number {
    return min + Math.floor(rng() * (max - min + 1));
}
