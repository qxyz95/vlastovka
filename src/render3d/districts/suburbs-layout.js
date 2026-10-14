// Rozložení čtvrti Violet Suburbs (místa 0–3) pro cityChunk (geometry.js). Čisté, bez three.js. Vlastní D1 (Suburbs).
// kinds: hustota a rozsahy řad [dens,hmin,hmax,wmin,wmax] pro ulici (near) a střed (mid), podíl reklam; open = řídké panorama; lamps:false = bez lamp.
// extras(kind,api) přidá zvláštnosti místa v lokálních souřadnicích (x 0…W). api={add,rng,between,W,index}; pořadí volání rng drží determinismus.
export const SUBURBS_LAYOUT = {
  id: 'suburbs',
  places: [0, 1, 2, 3],
  tall: 1,
  kinds: {
    roofs: { near: [0.9, 8, 22, 10, 18], mid: [0.85, 16, 40], signs: 0.35 },
    market: { near: [0.95, 6, 14, 8, 12], mid: [0.8, 14, 34], signs: 0.8 },
    garden: { near: [0.25, 5, 9, 8, 12], mid: [0.5, 10, 24], signs: 0.1, trees: 14 },
    rail: { near: [0.5, 6, 12, 14, 22], mid: [0.7, 12, 30], signs: 0.2, train: true },
  },
  extras(kind, { add, rng, between, W }) {
    const k = this.kinds[kind];
    if (k.trees)
      for (let i = 0; i < k.trees; i++)
        add({
          type: 'pyramid',
          x: rng() * W,
          w: 4,
          z: -14 - rng() * 10,
          d: 4,
          h: between(6, 11),
          tone: 4,
        });
    if (k.train) {
      for (let i = 0; i < 5; i++)
        add({ x: 60 + i * 21, w: 20, z: -9, d: 4, h: 4.5, y: 0.4, tone: 3 });
      add({ x: 0, w: W, z: -9, d: 5, h: 0.4, tone: 1 });
    }
  },
};
