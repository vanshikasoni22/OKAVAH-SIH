// Small deterministic PRNG helpers shared by the mock data modules, so the
// same inputs always resolve to the same numbers instead of flickering on
// every render/refresh.

export function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

// One-off deterministic 0..1 value for a given seed/salt pair.
export function seededRandom(seed, salt) {
  return (hashString(`${seed}::${salt}`) % 10000) / 10000;
}

// A seeded PRNG (mulberry32) for generating a *sequence* of deterministic
// 0..1 values, e.g. for a random-walk time series.
export function createRng(seed) {
  let a = hashString(String(seed));
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
