# C2a Nové události ve scéně (15. 10. 2026, game-dev Opus)

Zadání: vizuál a QTE značky všech událostí (pára, termika, Sky Lantern, hvězda, výtrysk, kombo + Chimes, poryv bez ventilace) v render vrstvě podle `research/atlas/05-art-udalosti.md` a rozhodnutí 06 (15. 10.).

## Plán
1. Čistý modul `src/render3d/event-fx.js`: kruh QTE z `e.w` (zóny, průběh, pecky, zarážky), poloměr na mobilu, polohy objektů událostí, výtrysk, kombo.
2. `ui-layer.js`: drawQte (škála, zóny ve varování, pecky, zarážky, half stopa, hvězda bez úspěchu), drawBurst, drawCombo + Chimes.
3. `frame.js`: plan.ui.qte z události (ne z visual.qte zón), plan.ui.burst, plan.ui.combo, vEff pro rychlostní čáry, plan.evs (data pro 3D).
4. Modely `models/sky-lantern.js`, `thermal.js`, `shooting-star.js` (registr + katalog), `palette.js` nové klíče.
5. `companion3d.js`: pára (ventilace jen pára), termika, lampion (+ záře čtvrť 4), hvězda + hvězdičky; poryv bez ventilace.
6. Ladění `?events=all|steam|thermal|drone|star` v `index.js` (jen __r3d ladicí let).
7. Testy, format, npm test, prohlížeč (port 4192), commit.

## Hotové kroky
- 1–6 kód: event-fx.js, ui-layer (drawQte/zoom/pecky/zarážky, drawBurst, drawCombo), frame (ui.qte z e.w, ui.burst, ui.combo jen s visual.combo, evs, vEff), modely sky-lantern/thermal/shooting-star v registru (katalog je ukáže sám), companion3d (pára, termika, lampion, hvězda + hvězdičky, poryv bez ventilace), life.companion jen holub, scene předává kit/evs/burst/district, index ?events=.
- 7a testy: nový tests/render3d-events.test.js (9 testů), upravené render3d-{life,living-colors,models,paper-mood,purity,ui}. npm run format, npm test 468/468. Locales bez změny (Prettier je přeformátoval, vráceno).

- 7b prohlížeč (port 4192, skryté okno, ?timer, snímky přes __r3d.snapshot): pára, termika, lampion den + čtvrť 4 (po opravě kontaktu: základ lampionu = odhad X + vx·Δ, Y + vy·Δ, dřív minul o 7–8 m), hvězda + výtrysk + kombo ×2, 360 px v iframe (cs), katalog (3 modely, LOD 72/30/0). Konzole bez chyb. lose/restore: geometrie 40 → 40, textury 6 → 6. Server vypnut, záložka zavřena.
- 8 commit.

## Rozpracovaný krok
- žádný

## Změněné soubory
- nové: src/render3d/event-fx.js, models/sky-lantern.js, models/thermal.js, models/shooting-star.js, tests/render3d-events.test.js
- src/render3d/{companion3d,frame,index,life,palette,scene,ui-layer}.js, models/index.js
- tests/render3d-{life,living-colors,models,paper-mood,purity,ui}.test.js

## Měření
- Node (render3d-events): každá událost ≤ 4 DC a ≤ 400 △ včetně hvězdiček výtrysku, čtvrť 1 i 4; mimo událost 0 DC.
