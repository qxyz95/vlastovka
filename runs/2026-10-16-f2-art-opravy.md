# F2 opravná dávka: art review Atlasu a událostí (16. 10. 2026, game-dev)

Zadání: opravy B1–B16 (a levné B17–B18) z `runs/2026-10-16-art-review-atlas.md` kap. A doslova, barvy čtvrtí podle 06 (16. 10.), oprava specu 05-art kap. 3.1 a bible kap. 12 a 17.4 (Sky Lantern).

## Hotové kroky
1. Kód B1–B18, spec 05-art kap. 3.1 (z −0,8), bible kap. 12 a 17.4 (Drone = Sky Lantern).
2. Testy `tests/f2-art-opravy.test.js` (8 testů), úpravy `c3-kapsy` (B5, B6) a `render3d-paper-mood` (klíč `ability`). `npm run format`, `npm test` 521/521.

3. Prohlížeč (server 4192, vlastní záložka, okno skryté `document.hidden = true`, `?timer`): snímky scény přes `__r3d.reset/advance/snapshot`
   (desktop 2560), iframy 360×740, 932×430, 390×740 (`lang=cs`, pozdní save 8 456 m, na konci vrácen). Záložka zavřená, server vypnutý.
   - B1: v kontaktu lampion ve volném středu kruhu vpravo od nosu, vlaštovka se kreslí přes něj (den, čtvrť 1).
   - B2 DOM: okraje čtvrtí rgb(61,79,122) / (44,110,155) / (122,59,46) / (29,43,77), obrys max úrovně rgb(42,38,34).
   - B11 DOM: `filter: drop-shadow(...)`, `paint-order: stroke`, světlý řez. B12: silo + stodola, vzducholoď, stromy vidět na 360 px.
   - B13 DOM: 932×430 detail `position: fixed`, x 496, šířka 400 px, karty vlevo (padding-right 409 px) vidět.
   - B14: vzorky papírů u 4 druhů (Copy linky, Kraft, Washi, Fólie), snímek.
   - B3: na 360 px řetěz ×3 se zvonečkem na krémovém štítku vpravo nahoře (ladicí let, výchozí kotva).
   - Konzole: jediná výjimka `ui.js:755` vznikla, když jsem přepsal `body` hostitelské stránky (chybí `#pocket-hint`), artefakt testu.
   - Použito 8 snímků + 3 zvětšení.

## Rozpracovaný krok
- žádný (commit hotový)

## Další kroky
- žádné

## NOT ASSESSED
- Pára a termika ve scéně (ořez neukázal objekt pod vlaštovkou), záře lampionu ve čtvrti 4 (noc), polštář a pás Dive na obrazovce (jen testy).
- Kombo na 360 px v pravé hře (kotva z HUD), ikony ◣ ◠ na iOS/Androidu, reduced motion, viditelné okno, výkon.

## Změněné soubory
`src/render3d/{event-fx,ui-layer,companion3d,palette,plane}.js`, `src/atlas-ui.js`, `src/atlas-postcards.js`, `src/workshop-ui.js`, `src/ui.js` (jen POCKET_ICON), `style.css`, `research/atlas/05-art-udalosti.md`, `research/design/05-styl-papir.md`, `tests/f2-art-opravy.test.js`, `tests/c3-kapsy.test.js`, `tests/render3d-paper-mood.test.js`.

## Odškrtnutí B1–B18 (důkaz)
- [x] B1 `LANTERN_FX` ahead 3,5, z −0,8; test B1 (|lanX − X| = 3,5 ≤ 3,6, z < 0)
- [x] B2 `--district-1…4(-accent)`, TONES morning/noon/afternoon/evening, obrys max úrovně `--ink`; test B2 (bez barev rolí, kontrast okraje 5,1–13 : 1)
- [x] B3 `comboZoom`, `bellZoom` (14 × 16), krémový podklad alfa 0,9 se stínem; test B3 (360/390/640/1280)
- [x] B4 `◣` / `◠`; test B4
- [x] B5 polštář páska + kraftDark čárkovaně [3,2], +4 px; test c3
- [x] B6 pás Dive px−40…px+260, gradient 30 px, čáry teal; test c3
- [x] B7 záře 16 segmentů, alfa 0,3 → 0, poloměr 1,0 · 4,4, barva mix; test B7
- [x] B8 tělo termiky inset 0,5 m, horní třetina alfa → 0; test B8
- [x] B9 `half` = big; test B9
- [x] B10 spodní polovina obláčků mix(cream, #5b4f7a, .25), jet [2,0; 1,0]; test B10
- [x] B11 drop-shadow + řez paint-order stroke 0,8, light = cream-50; test B11
- [x] B12 fields / port / terraces podle review; test B12
- [x] B13 detail jako pravý sloupec na šířku; test B13
- [x] B14 vzorek papíru 32 × 22 + páska aktivního druhu; test B14
- [x] B15 `.preview` hrana `--ink`; test B15
- [x] B16 `introTextSize(…, cssHeight)`; test B16 (932 × 430 → 51,6 / 18)
- [x] B17 `.pocket-active` inset −2 px ink; test
- [x] B18 seigaiha .28 a /.085, průměrné L ≥ 0,69; test B18
