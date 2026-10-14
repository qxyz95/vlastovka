> **ZASTARALÉ (15. 10. 2026):** příznak `?styl=papir`, „zbytek hry ve starém stylu“ a záloha `?styl=cyber` (jediný styl je Papírové město, cyber větve a přepínač smazané v U0 a R0); dávky P0–P4 jsou hotové; platí `research/design/05-styl-papir.md`. Popis čtvrti 1 a prototypu `prototype-styly.html` zůstává jako podklad. Nečíst jako zadání.

# Spec: Papírové město, čtvrť 1 ve hře

> **NÁVRH, čeká na schválení bible `05-styl-papir.md`** (pilíře, paleta, názvy). Napsal art-director 14. 10. 2026 pro game-deva (a product-designera v kap. 7). Cíl podle rozhodnutí uživatele (06, 14. 10.): **nejdřív jedna čtvrť (místa 1–4 a Dílna) v novém stylu přímo ve hře, zahrát, pak zbytek.** Zbytek hry zatím běží ve starém stylu.

Předloha: prototyp `prototype-styly.html` (výchozí stránka), kód `prototype/styly/papir-data.js` (čistý, přenést skoro beze změny), `prototype/styly/papir.js` (three.js, vzor materiálů a stínů), `prototype/styly/papir.css` (UI). Snímky `research/design/img/papir/`. Čísla a barvy jsou v bibli 05; tady je jen *co a kde* změnit.

---

## 1. Přepínač

**Doporučení: příznak `?styl=papir` pro celou hru** (výchozí vypnuto, starý styl beze změny).
- Čte ho `src/ui.js` (stejně jako `?render=2d`), předá ho rendereru jako `visual.style = 'papir' | 'cyber'` a nastaví `document.body.dataset.styl = 'papir'` (UI tokeny, kap. 4 dávka P4) a `<meta name="theme-color">` na `#d9c4a0`.
- `frame.js` zapíše `plan.style`; `scene.js`, `city.js`, `plane.js`, `workshop.js`, `ui-layer.js` podle něj volí papírovou nebo starou cestu. Paleta přes `palette(plan.style)`, nálada přes `moodAt(x,t,{hold,style})`.
- **Čtvrť 1 (místa 0–3) a Dílna** jsou navržené a hotové podle bible. **Čtvrti 2–4** dostanou v papírovém režimu prozatímní paletu z bible 05 kap. 2.3 a stejné papírové materiály (bez ladění detailu), aby hra byla celá v jednom stylu a šla dohrát. Nejsou předmětem art-review.
- Po schválení uživatelem: příznak se stane výchozím (`?styl=cyber` jako záloha do konce přestavby), pak starou cestu smazat (jako 2D zálohu).

**Proč ne přepínač po čtvrtích** (papír jen na místech 0–3, dál starý styl): dvě různé cesty kreslení v jedné scéně (toon + půltón vs. papír + stencil), post-proces by se přepínal uprostřed letu, mezi místem 4 a 5 by byl tvrdý střih ráno → měsíční noc s neonem; víc shaderových variant a předehřívání; hráč by hodnotil střih, ne styl. Globální příznak je jednodušší a čistší test.

---

## 2. Co zůstává beze změny

Fyzika, události, kamera a režisér (`camera.js`, `frame.js` mimo `plan.style`), rozložení míst (`cityChunk`, `districts/*-layout.js`), život čtvrti jako data (`life.js suburbLife`, pohyb aut, vlaku, balónů), pózy (`pose.js`), smlouvy `render(canvas,f,model,time,visual)`, `view(f)`, `view(null)` = Dílna s HAND na (148, 258), 2D záloha.

---

## 3. Nové a změněné soubory

### Čisté moduly (bez three.js, do `tests/render3d-purity.test.js`)
| Soubor | Co | Zdroj |
|---|---|---|
| `src/render3d/palette.js` | nová paleta `PAPIR` v `PALETTES` se stejnými klíči jako `CYBER` (plane, trail, qte, popup, label, aim, speed, particles, life, workshop, companion, city), tokeny `PAPER_TOKENS`, role `PAPER_ROLE`; `palette('papir')` | bible 05 kap. 2.1–2.2, `papir-data.js TOKENS ROLE QTE` |
| `src/render3d/paper-mood.js` (nový) | 17 klíčových nálad papíru (16 míst + úsvit) ve tvaru `mood.js` + pole `skyAt` (zastávky přechodu), `haze {low,high,from,to,max,curve}`, `light [x,y,z]`, `shadow`, `trail`; místa 0–3 z `D1`, ostatní prozatímní | bible 05 kap. 2.3, 4 |
| `src/render3d/mood.js` | `moodAt(x,t,{hold,style})` volí klíče `MOOD_KEYS` nebo `PAPER_KEYS` | |
| `src/render3d/paper-cards.js` (nový) | `placeCards(chunk,style)`: bloky `cityChunk` → karty (hloubka 4/6/12 m s přední hranou na místě, sedlové střechy, okna-výřezy, dveře, stromy jako kotouč, výška dálky × 0,42, ploché pásy < 1 m bez střech); `lifeCards(life)`; `cardVertices(list)`; `skyline(list,x0,x1,{step,blur})`; `skylineStrip(sk,{pen,z})`; `shadowOffset(dz)`; konstanty `ID`, `SHADOW`, `CARD_D`, `FAR_H` | `papir-data.js` 1:1 (bez barev napevno: barvy z palety/nálady) |
| `src/render3d/quality.js` (nový) | úrovně 0–2 (bible 05 kap. 5), `initialQuality({touch,cssWidth,dpr})`, `nextQuality(prev,frameStatsP95)` jen dolů, nikdy během letu | |
| `src/render3d/comic.js` | `comicLook` pro `style:'papir'`: `halftone 0`, `levels 8` (bez posterizace), obrysy se nepoužijí | |
| `src/render3d/frame.js` | `plan.style`, `plan.quality` z `quality.js` | |

### three.js moduly
| Soubor | Co |
|---|---|
| `src/render3d/paper.js` (nový) | `paperMaterial(id,{cutK,sideK,fiber,haze})` (shader z `papir.js`, uniformy oparu a světla nastavuje `scene.apply` z `plan.mood`), `skylineShadowMaterial(caster)`, `blobMaterial`, `planeShadowMaterial`, `paperPost()` (sRGB, statické zrno 3,5 %, tón, vinětace), `paperSky()` (plátno: přechod + slunce se září, překreslit jen při změně nálady o víc než práh nebo velikosti), `stencilWrite(id)`, `stencilTest(mask)` |
| `src/render3d/scene.js` | `WebGLRenderer({stencil:true})`, render target `stencilBuffer:true`; pro papír: bez `shadowMap`, bez rampy a půltónu, post `paperPost`, nebe `paperSky`; hemisféra a směrová světla se nepoužijí (papírový shader je nečte); `apply` předá opar, světlo a stín z `plan.mood` do sdílených papírových materiálů |
| `src/render3d/city.js` | `buildChunk` v papíru: zem (id 8), dálka (1), střed (2), ulice (4) jako 4 sloučené meshe s `paperMaterial(id)`; 3 meshe stínů ze `skylineStrip` (ulice → maska `0xFC`, střed → `0xFE`, dálka → `0xFF`), z-pozice = přední hrana vrstvy − `dz`; žádný `hull`, `glow`, cedule (neon) ani okna z textury. Vše do `geos` (dispose). Keš míst jako dnes |
| `src/render3d/districts/suburbs.js` | `build` v papíru: doplňky čtvrti 1 jako karty (zahrady: stromy ve středu, živé ploty, skleník; tržnice: stánky s pruhovanou markýzou, vlaječky), vše do vrstvy ulice/střed s jejím id |
| `src/render3d/districts/suburbs-layout.js` | `paper:{farH:.42,roofs:{near:.7,mid:.35,far:.4}}` (čistá data, testovat) |
| `src/render3d/life3d.js` | papírové materiály a barvy z `palette('papir').life` (lidé, auta, vlak, prádlo, vlaječky, balóny, mraky ze tří kotoučů s blob stínem na nebe); kouř a pára krémové s alfou ≤ 0,6 (bible 05 kap. 6.2); drony a robot mimo papírový režim skrýt nebo nechat (rozhodne product-designer) |
| `src/render3d/companion3d.js` | holub a pára v barvách palety papíru (origami tvar později) |
| `src/render3d/plane.js` | papírová vlaštovka: `MeshBasicMaterial` s barvou vrcholů (normála nahoru `#ffffff`, jinak `#cdd3e3`), bez tónování světlem, obrys razítkem 2,6 px `graphite`, přehyb `pencil`; **stín vlaštovky** (kopie trojúhelníků, posun (−2,8; −1,8) m, z = −1,5 m, alfa 0,3, maska `0xF8`); stopa: grafitová čárkovaná (čárka 1,5 m z 2,4 m), poloviční šířka `max(0,22 m, 1,1 CSS px)`, bez lemu |
| `src/render3d/workshop.js` | papírová Dílna a dítě podle `papir.js workshopCards` (krémový dům, rajčatový štít, teplé okno se stolem, papírová cedulka PAPER LAB na provázcích, tyrkysový přístavek, grafitové zábradlí, dítě v hořčicové pláštěnce se skládanou čepicí); stencil id 4; obrysy pryč |
| `src/render3d/ui-layer.js` | čte vše z `palette(plan.style)`: QTE mezikruží krémové 0,95 se stínem (`shadowBlur` 4, posun 3 px), štítky událostí grafitové s krémovým textem, popupy jako papírové štítky, mířidla grafitová, rychlostní čáry jako tenké grafitové čárky (1 px, alfa 0,5) |
| `src/render3d/index.js` | předání `visual.style`, `__r3d.measurePlane()` (měření kontrastu vlaštovky z pixelů jako `papir.js measure`), `__r3d.stats()` doplnit o `style`, `quality` |

### UI
| Soubor | Co |
|---|---|
| `style.css` | blok `body[data-styl=papir]` přepíše vrstvy 1 a 2 tokenů a komponenty podle `papir.css` (stůl `desk`, krémové karty se stínem `--lift`, páska, natočené štítky, tlačítko `tomato-600` se spodní hranou, fokus `cobalt`, písma `--display`/`--body`/`--hand`, malý text na stole `--dim-on-desk`); HUD na telefonu: štítek místa pod scénou |
| `src/ui.js` | čtení `?styl`, `visual.style`, `body.dataset.styl`, `theme-color` |
| `src/locales/en.js`, `cs.js` | **až po schválení názvů** (bible 05 kap. 12), product-designer |

---

## 4. Dávky (bez překryvu souborů)

| Dávka | Vlastník souborů | Obsah | Závisí na |
|---|---|---|---|
| **P0 Základ** | `palette.js`, `paper-mood.js`, `mood.js`, `paper-cards.js`, `quality.js`, `comic.js`, `frame.js`, `src/ui.js`, `tests/render3d-purity.test.js`, nové testy `tests/render3d-paper-*.test.js` | čisté moduly, příznak, `plan.style`, `plan.quality`; testy: skyline = sjednocení (max) karet, rozmazání nezvýší maximum, determinismus `placeCards`, rozpočet ≤ 15 tis. △ a ≤ 14 DC na místo (počítáno z karet), `quality` jen dolů, palety bez neznámých klíčů, `moodAt` s `style` | — |
| **P1 Scéna** | `paper.js`, `scene.js`, `city.js`, `index.js` | materiály, stencil, stíny ze siluet, nebe, post, `measurePlane` | P0 |
| **P4 UI** | `style.css` | papírové tokeny a komponenty | P0 (jen `data-styl`) |
| **P2 Čtvrť 1** | `districts/suburbs.js`, `suburbs-layout.js`, `life3d.js`, `companion3d.js` | doplňky a život v papíru | P0, P1 (materiály) |
| **P3 Hrdina** | `plane.js`, `workshop.js`, `ui-layer.js`, `fx-map.js` | vlaštovka, stín, stopa, Dílna, dítě, QTE, štítky, čáry | P0, P1 (`paper.js` jen import) |

Pořadí: P0 → (P1 ∥ P4) → (P2 ∥ P3) → ověření (kap. 5) → playtest s uživatelem. P1 a P3 se dotknou `paper.js` jen přes import (vlastník P1); pokud P3 potřebuje nový materiál, napíše ho do `plane.js`/`workshop.js`, ne do `paper.js`. Každá dávka v git worktree, `npm test` musí projít.

Odhad: 5 dávek, z toho P1 největší (stencil, stíny).

---

## 5. Kritéria ověření

| # | Kritérium | Jak | Cíl |
|---|---|---|---|
| 1 | Kontrast vlaštovky | `__r3d.measurePlane()` z pixelů, místa 1–4 × 4 okamžiky letu + Dílna + výsledek, šířky 1280, 375, 932 | výplň **nebo** obrys ≥ 3 : 1 všude (prototyp: obrys 6,4–9,6) |
| 2 | QTE | hex (disk 0,95 smíchaný s nejsvětlejším a nejtmavším pásem nebe) + snímek | stopa, úspěch, perfekt, bod ≥ 3 : 1 (prototyp 3,35 / 4,28 / 3,86 / 13,5) |
| 3 | Stopa | hex + snímek | ≥ 3 : 1 proti nebi čtvrti 1 (prototyp 6,7–12,1) |
| 4 | Text UI | hex | ≥ 4,5 : 1 (malý text), ≥ 3 : 1 grafika a fokus (bible 05 kap. 2.4) |
| 5 | Výkon desktop | `?perf=1`, `__r3d.bench` ve viditelném okně, výsledky do `reports/3d/` | P95 ≤ 16,7 ms, CPU ≤ 6 ms, ≤ 120 DC; na místo ≤ 14 DC a ≤ 15 tis. △ |
| 6 | Výkon telefon | skutečný telefon (iPhone 15 Pro nebo střední Android), DPR ≤ 1,5 | ≥ 30 fps v letu nad trhem (nejvíc △), kvalita 1; když ne, kvalita 0 musí dát ≥ 30 fps |
| 7 | Paměť | 10 hodů, přechod místy 0–4 a zpět, `renderer.info.memory` | geometrie a textury se nezvyšují (dispose) |
| 8 | Reduced motion | `prefers-reduced-motion` | bez otřesu, zoomu, záblesku, čar; útržky bez pohybu; hitstop a barvy zůstanou |
| 9 | Telefon | snímky 375 × 667 a 932 × 430 | HUD mimo pás letu, štítek místa pod scénou |
| 10 | Art-review | skill `art-review` proti bibli 05 (po schválení) | žádné Critical a Major |
| 11 | Starý styl | hra bez `?styl` | beze změny (snímky před a po, `npm test`) |

---

## 6. Otevřené body pro game-deva (čekají na uživatele)

1. **Velikost vlaštovky na telefonu** (bible 05 kap. 16, otázka 4): dnes 21 CSS px v letu a 10 px v Dílně. Doporučený návrh: `PLANE_SCALE × 1,15` pro scénu užší než 500 CSS px (pouze vzhled, fyzika beze změny) a v Dílně na úzké scéně `REST.k` z 1,25 na 1,6 (HAND zůstává na 148, 258, mění se jen měřítko záběru; ověřit test smlouvy `view(null)`). Dělat až po rozhodnutí.
2. **Písmo** (otázka 5): zatím systémová písma, žádný soubor.
3. **Názvy** (otázka 3): texty mění product-designer po rozhodnutí; renderer na ně nezávisí.

## 7. Pro product-designera

- Názvy čtvrtí, míst, vět a úvodu: bible 05 kap. 12 (sada C doporučená), klíče beze změny.
- Postavy a události s „cyber“ (Cyber pigeon courier, Ad Drone, neonové reklamy `geometry.SIGNS`, hudba „Neon Glide“) do papírového světa nesedí; návrh v bibli 05 kap. 12, rozhodnutí na uživateli.
- Atlas: pohlednice jako fotky dioramatu v sešitu (bible 05 kap. 10); `prototype/atlas/art.js` až po čtvrti 1.
