// Rozložení čtvrti Neon Core (místa 12–15) pro cityChunk (geometry.js). Čisté, bez three.js. Vlastní D4 (Core). Formát viz suburbs-layout.js.
export const CORE_LAYOUT = {
  id: 'core',
  places: [12, 13, 14, 15],
  tall: 1.4,
  kinds: {
    gate: { near: [0.6, 10, 24, 10, 16], mid: [0.8, 20, 50], signs: 0.5, gate: true },
    terraces: { near: [0.7, 8, 18, 12, 20], mid: [0.85, 24, 60], signs: 0.4, terraces: true },
    tower: { near: [0.8, 12, 30, 10, 16], mid: [0.9, 30, 80], signs: 0.5, tower: true },
    port: { near: [0.9, 14, 34, 10, 18], mid: [0.95, 30, 90], signs: 0.6 },
  },
  extras(kind, { add, W }) {
    const k = this.kinds[kind];
    if (k.gate) {
      for (const f of [0.35, 0.6]) add({ x: W * f, w: 7, z: -40, d: 7, h: 60, tone: 0 });
      add({ x: W * 0.35, w: W * 0.25 + 7, z: -40, d: 6, h: 5, y: 55, tone: 3, sign: 'METROPOLIS' });
    }
    if (k.terraces)
      for (let i = 0; i < 4; i++)
        add({ x: 80 + i * 14, w: 40 - i * 8, z: -60 + i * 6, d: 14, h: 46 - i * 10, tone: 1 });
    if (k.tower) {
      const x = W * 0.5;
      add({ x, w: 14, z: -70, d: 14, h: 180, tone: 1 });
      add({ x: x + 6, w: 2, z: -70, d: 2, h: 40, y: 180, tone: 3, beacon: true });
    }
  },
};
