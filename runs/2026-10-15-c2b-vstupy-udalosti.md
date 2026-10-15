# C2b Vstupy nových událostí (15. 10. 2026, game-dev Opus)

Zadání: zapnout nové události (pára, termika, lampion, hvězda) ve hře se vstupy Space/dotyk, prvním setkáním (0,5× + věta), popupy half/partial, kombem v HUD s aria-live a shodou hra × fly.

## Plán
1. config NEW_EVENTS = true, oprava testů kitOf.
2. events-view: termika ťuk (nový popisek), pára „ťuk ťuk“, štítek „Again!“ u druhého kusu (e.follow) ve varování.
3. juice.js: fxEvent 'partial' (popup ½, bez hitstopu), čisté funkce prvního setkání (firstMeet, meetScale) a hlášení komba (comboNews).
4. ui.js: juiceEvents half/partial, nápověda podle typu, první setkání (zpomalení, banner + aria), kotva komba, aria-live komba.
5. ui-layer: barva popupu half (qte.half).
6. Locales EN/CS.
7. Testy (vstupy × simulátor, první setkání, popupy, shoda se všemi událostmi), format, npm test.
8. Prohlížeč (port 4192), commit.

## Hotové kroky
- 1–7: NEW_EVENTS = true; events-view (termika ťuk `event.riseTap`, pára `event.tapTwice`, `event.again` u e.follow ve varování); juice (fxEvent 'partial' = popup ½ styl half bez hitstopu, resultFx, isFirstMeet/meetScale/MEET_SLOW, comboNews/COMBO_SAY); ui-layer barva popupu half = qte.half; ui.js (první setkání: zpomalení advance ve varování, věta v #banner a #event-help; nápověda podle typu; kombo visual.combo = kotva pod .hud-right; aria-live komba); locales EN/CS; testy tests/c2b-vstupy.test.js (8) + rozšířený test shody M2 v core.test.js (12 letů se všemi událostmi, zpomalení prvního setkání). npm run format, npm test 490/490.

- 8a prohlížeč EN (port 4192, ?timer&dev=1, skryté okno, bot v stránce posílá Space keydown/keyup podle plan.ui.qte): 7 letů; pára success/perfect (2 ťuky) i partial (1 ťuk, popup ½), termika perfect i half (popup ½), hvězda perfect, poryv, holub; ťuk ve varování bez trestu; první setkání pára a hvězda: tempo letu ve varování 0,51× (další pára 1,0×), věta v banneru a #event-help; aria-live komba „Combo ×1/×2/×3/×4“, „Combo broken“. Konzole bez chyb (sledováno od 2. běhu).

- 8b prohlížeč CS (6 letů, úhel 28°): lampion success i miss, druhý lampion a druhý sloup termiky se štítkem „↻ ZNOVU!“, hvězda miss, termika half, pára partial; první setkání všech 4 typů 0,49–0,5×, další výskyty 0,97–1,03×. Konzole bez chyb (tool + window.onerror).
- 8c věty nápovědy zkráceny, aby se na 360 px vešly do #banner (nowrap + ellipsis): EN 282–302 px, CS 306–330 px při max 336 px (měřeno v iframe 360 × 640). Kotva komba +20 px pod .hud-right (štítek ×N se dotýkal čipu mincí). Snímky: desktop let s kruhem lampionu, kombo ×6 + Chimes, banner; iframe 360 CS termika + banner, kombo ×0 pod ❚❚.
- 9 format, npm test 490/490, server 4192 vypnut, záložka zavřena, commit.

## Rozpracovaný krok
- žádný

## Změněné soubory
- src/config.js, src/juice.js, src/ui.js, src/render3d/events-view.js, src/render3d/ui-layer.js, src/locales/en.js, cs.js
- tests/core.test.js, nový tests/c2b-vstupy.test.js

## Poznámky
- Uložení prvního setkání do save: p.atlas.seen má význam „viděno v Atlasu“ (tečka novinky) a validace storage.js pouští jen známá ID → bez změny struktury nejde. BLOCKED, zatím jen v paměti sezení.
