// Rozložení čtvrti Moon Docks (místa 4–7) pro cityChunk (geometry.js). Čisté, bez three.js. Vlastní D2 (Docks). Formát viz suburbs-layout.js.
export const DOCKS_LAYOUT = {
  id: 'docks',
  places: [4, 5, 6, 7],
  tall: 0.7,
  kinds: {
    warehouse: { near: [0.85, 8, 14, 24, 40], mid: [0.6, 10, 22], signs: 0.3 },
    cranes: { near: [0.4, 6, 10, 16, 26], mid: [0.5, 10, 20], signs: 0.15, cranes: 3 },
    bridge: { near: [0], mid: [0.3, 8, 16], signs: 0, bridge: true, lamps: false },
    lighthouse: { near: [0.15, 4, 8, 10, 16], mid: [0.3, 6, 14], signs: 0.1, lighthouse: true },
  },
  extras(kind, { add, W }) {
    const k = this.kinds[kind];
    if (k.cranes)
      for (let i = 0; i < k.cranes; i++) {
        const cx = 40 + (i * W) / k.cranes;
        add({ x: cx, w: 2.5, z: -45, d: 2.5, h: 46, tone: 3 });
        add({ x: cx - 14, w: 44, z: -45, d: 2, h: 3, y: 42, tone: 3 });
        for (let j = 0; j < 4; j++)
          add({ x: cx + 10 + j * 7, w: 6, z: -30, d: 3, h: 3, y: (j % 2) * 3, tone: 3 });
      }
    if (k.bridge) {
      add({ x: 0, w: W, z: -14, d: 8, h: 2, y: 9, tone: 1 });
      for (let x = 20; x < W; x += 70) add({ x, w: 3, z: -14, d: 9, h: 34, tone: 1 });
    }
    if (k.lighthouse) {
      const b = add({ x: W * 0.7, w: 5, z: -32, d: 5, h: 34, tone: 0 });
      add({ x: b.x - 1, w: 7, z: -32, d: 7, h: 4, y: 34, tone: 3, beacon: true });
    }
  },
};
