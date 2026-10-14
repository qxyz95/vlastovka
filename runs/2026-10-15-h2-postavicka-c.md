# Dávka H2 Postavička C (15. 10. 2026)

**Zadání:** oblá papírová figurka dítěte C (630 / 130 △, 1 DC s praporkem, `kidMaterial`, hází vzdálená ruka, 7 póz) podle `research/plan-hratelnost/03-art.md` kap. 1 a 6 (H2); upravit katalog 11 (karta H1, souhrn G2b).

## Hotové kroky
1. Díl `lathe` + `plateX` (parts.js, `place` posouvá i `p`), tvar karty `mesh` (paper-cards.js), model `kid.js` (díly 1.3: 630 / 130 △, kostra 1.4, 7 póz 1.7).
2. `kid-rig.js`: [LOD H][praporek][LOD 1] v jednom bufferu, normály za snímek, `kidLod` 44/52 px, ruka T míří na vlaštovku (`armToward`).
3. `paper.js` `kidMaterial` + čistá `kidShade`, `workshop.js` (kidMaterial, setDrawRange, posun hloubky vlaštovky v ruce, klid = vlaštovka mezi dlaněmi), `frame.js` (`kid.px`, `kid.aim`), `launch-site.js` (dítě podle dlaně).
4. Testy: nový `tests/render3d-kid.test.js`, upravené `render3d-models`, `render3d-launch-site`, `render3d-paper-hero`. `npm test` 320/320.

5. Katalog (`prototype/katalog/{main,paper}.js` kidMaterial), dokument 11 (karta H1, souhrn G2b ≤ 1 400, tab. 4.1–4.3). Commit 3dee437.
6. Prohlížeč (port 4191, okno skryté, `?timer`): 3 snímky (míření 1004 px, míření 375 px v iframe, katalog), konzole bez chyb.

## Rozpracovaný krok
(žádný, dávka hotová)

## Další kroky
art-review (H2 kap. 6: 375 × 667, 932 × 430, 1280 × 800, šeď 25 %), perf-check ve viditelném okně.

## Předpoklady (karta neurčuje)
- Ve hře dítě stojí chodidly (spodek bot) na pavlači; úhel ruky T v míření se dopočte tak, aby dlaň byla přesně v `LAUNCH.hand` (vychází 2,81 místo 2,71 z náčrtu, aby dlaň byla v 1,4 m nad podlahou).
- Dýchání ±1 cm on twos (tab. 1.7 klid) i v míření, reduced motion bez dýchání.

## Změněné soubory
src/render3d/models/{kid.js,kid-rig.js,parts.js,launch-site.js}, src/render3d/{paper-cards.js,paper.js,workshop.js,frame.js}, tests/render3d-{kid,models,launch-site,paper-hero}.test.js

## Technická rozhodnutí
- Ruka T: rz i rx míří přesně na vlaštovku (dvě řešení, bere se rx bližší póze). Jen rz (rx z pózy) dávalo při plném nabití 5,4–6 cm, s oběma ≤ 3,5 cm na šířkách 360–1920.
- Vlaštovka v ruce: posun hloubky v prostoru kamery o 0,6 m místo `depthTest:false` (to by kreslilo křídla a kýl v pořadí trojúhelníků); razítko obrysu push 0,15 m místo 2 m.

## Měření (skryté okno, `?timer`; výkon NOT ASSESSED)
| | před (HEAD~2, port 4192) | po |
|---|---|---|
| draw calls (míření, 1004 × 565) | 38 | 38 |
| trojúhelníky (scéna + maska) | 34 867 | 35 444 (+577) |
| geometrie / textury po načtení | 28 / 5 | 28 / 5 |
- drawRange míření: start 0, count 1 896 (LOD H + praporek); za letu LOD 1 (start 1 890, count 396, dítě 7,5 px).
- nabíjení 96 %: dlaň T (70,231; 11,968; −0,014) × vlaštovka (70,241; 12,003; 0) = 3,9 cm.
- iframe 375 px: plátno 312 px, dítě 53 px → LOD H.
- Katalog: LOD H 630 / 760, LOD 1 130 / 160, 4 DC, 824 △ ve scéně.
