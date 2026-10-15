# G2 Pohlednice Atlasu (15. 10.)

Zadání: čtvrť 1 jako snímky 3D scény (`assets/atlas/<placeId>.webp`), čtvrti 2–4 papírová silueta dominanty (`src/atlas-postcards.js`), karta a detail v `atlas-ui.js`.

## Hotovo
- 4 snímky `roofs`, `market`, `gardens`, `railway` (.webp 480×300, 8–13 kB).
- `src/atlas-postcards.js`: `SHAPES` pro všech 16 `kind` (čtvrti 2–4 = 12 tvarů, čtvrť 1 jako záloha při chybě načtení), `silhouette(kind)`, `imageUrl`, `altKey`.
- `atlas-ui.js`: `postcardOf`, `cardModel.postcard`, `detailModel.postcard/tone`, `postcardEl` (lazy `<img>` + SVG záloha). Teaser a unknown beze změny (bez prozrazení).
- Klíče `atlas.postcard.<placeId>.alt` EN+CS, CSS `.atlas-pc*` (náklon při hoveru jen v `prefers-reduced-motion: no-preference`), `tests/atlas-postcards.test.js`.

## Postup snímků (zopakovat, až budou modely čtvrtí 2–4)
1. `PORT=4191 node server.mjs`, stránka `/?timer&dev=1`.
2. V konzoli: `const f=__r3d.reset(1); f.x=<metry>; f.y=<výška>; __r3d.advance(0); __r3d.scene.draw();` (ladicí let se dá přesunout přepsáním `f.x/f.y`; místo i je na `i*304.76 m`, záběr `x = (i+0.25)*304.76`, `y` 20–30).
3. `__r3d.scene.renderer.domElement` (jen 3D, bez UI vrstvy) vyříznout na poměr 1,6 ze středu, zmenšit na 480×300 na dočasném canvasu, `toBlob('image/webp', 0.8)`.
4. Uložení: dočasný příjemce HTTP (POST blob → soubor) v scratchpadu, ne v repu.
5. Použité záběry: roofs x=150 y=30; market x=1.25·304.76 y=28; gardens x=2.25·304.76 y=20; railway x=3.25·304.76 y=28.
6. U čtvrtí 2–4: až budou modely, přidat placeId do `IMAGE_PLACES`, snímky do `assets/atlas/`, klíče `atlas.postcard.<id>.alt`.

## Ověřeno
- `npm test` 478/478, `npm run format`.
- Prohlížeč (port 4191, `?timer&dev=1`, EN i CS): 16 karet, 5 obrázků načteno (4 karty + detail), 11 SVG siluet, konzole bez chyb.
