/**
 * Simple Seeded Random Number Generator
 * Using Mulberry32 algorithm
 */
class DailyRNG {
    constructor(seedString) {
        // Create a hash from the seed string to get a 32-bit integer seed
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed = (seed + seedString.charCodeAt(i)) | 0; // Force 32-bit int
            seed = Math.imul(seed ^ seed >>> 15, 0x735a2d97);
        }
        seed = seed ^ seed >>> 15;
        this.state = seed >>> 0; // Force unsigned
    }

    /**
     * Returns a float between 0 (inclusive) and 1 (exclusive)
     */
    next() {
        this.state = (this.state + 0x6D2B79F5) | 0;
        let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Returns an integer between min (inclusive) and max (exclusive)
     */
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }

    /**
     * Shuffles an array in place
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
