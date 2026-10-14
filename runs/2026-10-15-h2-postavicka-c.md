# Dávka H2 Postavička C (15. 10. 2026)

**Zadání:** oblá papírová figurka dítěte C (630 / 130 △, 1 DC s praporkem, `kidMaterial`, hází vzdálená ruka, 7 póz) podle `research/plan-hratelnost/03-art.md` kap. 1 a 6 (H2); upravit katalog 11 (karta H1, souhrn G2b).

## Hotové kroky
1. Díl `lathe` + `plateX` (parts.js, `place` posouvá i `p`), tvar karty `mesh` (paper-cards.js), model `kid.js` (díly 1.3: 630 / 130 △, kostra 1.4, 7 póz 1.7).
2. `kid-rig.js`: [LOD H][praporek][LOD 1] v jednom bufferu, normály za snímek, `kidLod` 44/52 px, ruka T míří na vlaštovku (`armToward`).
3. `paper.js` `kidMaterial` + čistá `kidShade`, `workshop.js` (kidMaterial, setDrawRange, posun hloubky vlaštovky v ruce, klid = vlaštovka mezi dlaněmi), `frame.js` (`kid.px`, `kid.aim`), `launch-site.js` (dítě podle dlaně).
4. Testy: nový `tests/render3d-kid.test.js`, upravené `render3d-models`, `render3d-launch-site`, `render3d-paper-hero`. `npm test` 320/320.

## Rozpracovaný krok
5. Katalog (`prototype/katalog/main.js` kidMaterial), dokument 11 (karta H1, souhrn G2b).

## Další kroky
6. Prohlížeč (port 4191, 3 snímky), commit.

## Předpoklady (karta neurčuje)
- Ve hře dítě stojí chodidly (spodek bot) na pavlači; úhel ruky T v míření se dopočte tak, aby dlaň byla přesně v `LAUNCH.hand` (náčrt 2,71 nejde: délka ruky 0,55 m nedosáhne 1,4 m nad chodidly, proto ~2,9).
- Dýchání ±1 cm on twos (tab. 1.7 klid) i v míření, reduced motion bez dýchání.

## Změněné soubory
src/render3d/models/{kid.js,kid-rig.js,parts.js,launch-site.js}, src/render3d/{paper-cards.js,paper.js,workshop.js,frame.js}, tests/render3d-{kid,models,launch-site,paper-hero}.test.js

## Technická rozhodnutí
- Ruka T: rz i rx míří přesně na vlaštovku (dvě řešení, bere se rx bližší póze). Jen rz (rx z pózy) dávalo při plném nabití 5,4–6 cm, s oběma ≤ 3,5 cm na šířkách 360–1920.
- Vlaštovka v ruce: posun hloubky v prostoru kamery o 0,6 m místo `depthTest:false` (to by kreslilo křídla a kýl v pořadí trojúhelníků); razítko obrysu push 0,15 m místo 2 m.

## Měření
(zatím žádné)
