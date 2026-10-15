# Plán: Atlas s bonusy do hry (15. 10. 2026)

Architekt (Opus, Plan), schváleno orchestrátorem. Rozhodnutí uživatele v `research/bonusy/06-rozhodnuti.md` mají přednost.

## Shrnutí
- Atlas nad dnešní fyzikou nejde: `core.simulate`, 100 letů (hod 0,95, 90 % zásahů), plná Dílna 5/5/5 → průměr 722 m (max 879 m), let 42 s. Hráč najde jen místa 1–3 ze 16. 06 (13. 10.) chce opak: s bonusy roste rychlost, 4,9 km za desítky sekund.
- **Jeden model letu pro hru i simulátor:** mechaniku z `simulation/progression/model.mjs` přenést do `src/flight.js` (čísla `src/progression-numbers.js`, PROVISIONAL kopie `params.mjs` s testem shody); simulátor ji importuje a nechá si jen boty. Důkaz věrnosti: výstupy simulátoru před/po přesunu bajtově shodné. Pravidlo `.claude/rules/simulace.md` („nezávislý na src“) se tím mění.
- Odhad: ~27 h práce agentů, ve dvou linkách 14–16 h na hodinách.

## 1. Rozdíl simulátor × hra
**Hra dnes:** arkádové klouzání (návrat k `cruise`), jen poryv a holub, práh 8 m, ≤ 10 událostí, Dílna 3 × 5 (Paper = klouzavost), vítr 0, bez komba, π, β a výtrysků.
**Simulátor navíc:** tempo π z Paperu (rychlost i klouzavost), push `1,5·π·(1+E)·perfekt·S` (E strop 2,0), posílení β (strop 0,5), výtrysky, vítr podle seedu, plující střed QTE (hody 3–15), odpuštění předčasného stisku 0,12 s, švih ×1,05, zrychlení klidného klouzání 1,4×, ≤ 12 událostí s váženým výběrem, Dílna Power 3 / Folds 3 / Paper 12 (4 druhy), přeladěný Glider.

| Bonus | Simulátor | Hra |
|---|---|---|
| Glider | model 14/4/11/30°/qte 1,15 | stará čísla |
| Crowd Chain | krok a strop komba | chybí (není kombo) |
| Pinwheel | 1–3 přetočení větru, úr. 3 bez protivětru | chybí |
| Steam Hop | událost ťuk-ťuk, zdvih a push, úr. 2 +E, úr. 3 výtrysk | chybí |
| Packing Tape | minutí 30/50/75 % účinku | chybí |
| Crane Lift | start +1,5 m za úroveň | chybí |
| Stone Skip | odraz od země (1/1/2) | chybí |
| Gull Escort | delší nesení holubem, push | chybí |
| Momentum | β s počtem přeletěných míst | chybí |
| Thermal | událost, ťuk ve sloupci, úr. 3 druhý sloup | chybí |
| Echo | po perfektu za 0,6 s zopakuje část pushe | chybí |
| Shooting Star | vzácná událost, výtrysk 4 s, kombo +2 | chybí |
| Ad Drone | ťuk před kontaktem | chybí, drony škrtnuté |
| Paper Crane | dopad dotáhne k hranici místa (9/15/24 m) | chybí |
| On Air | β při kombu ≥ 3 | chybí |
| Kapsy | Dive, Cushion, Whistle, Rocket, Sharp, Calm, jedno tlačítko (Z6) | chybí |

## 2. Dílna a Atlas
- Atlas je **vedle** Dílny. Dílna: Power 3, Paper 12 (Copy, Kraft, Washi, fólie; další druh na 3. místě čtvrti), Folds 3, model. Atlas: 16 bonusů míst (úr. 1 zdarma doletem, 2–3 za mince), kapsy, uzly. Dnešní `BRANCHES` 3 × 5 a `PRICES` končí.
- Mince beze změny (`10 + dolet/10`). Ceny neladěné (balance až po schválení obsahu).
- Objev místa `i·304,76 m`; Atlas se odkryje na 2. místě. Cesta: čip výsledku → Dílna → Atlas.
- Chyba: `p.completed` dnes = 500 m, má být dolet 4 876 m.

## 3. Zastaralý obsah a i18n
- Texty Atlasu nejdou přes i18n (`atlas-content.js` jen EN, `atlas-text.js` en-US čísla); 322 klíčů EN+CS z `03-texty.md` nikdy nepřešlo do locales.
- Kyber zbytky: čtvrti Violet Suburbs / Moon Docks / Red Horizon / Neon Core (+ věty `frame`, barvy); místa Antennas, Wind Ridge, Metropolis, Broadcast Tower; příběhy „night market“, „neon city“; postavy Bolts (robot), Zippy (reklamní dron); místní Cyber Pigeon, Drone Pigeon, AC Exhaust, Turbine Wake; Ad Drone, On Air, Neon Foil (→ Silver Foil), `autoDrone`; locales `event.drone`.
- ID míst ≠ `ROUTE` (gardens/garden, railway/rail …): do `PLACES` přidat `kind`, jména z `place.<kind>`. Zdroj pravdy = locales, `03-texty.md` dostane ZASTARALÉ.

## 4. Rozhodnutí uživatele
Viz `06-rozhodnuti.md` (15. 10., Atlas s bonusy).

## 5. Dávky
Max 2 současně, `ui.js` vždy jeden vlastník.
- **A1 Jádro letu ve src** (Opus, 3 h): `src/flight.js`, `src/progression-numbers.js`, `model.mjs` (jen přesun), `atlas-numbers.js`, testy. Přijetí: čistý modul, `--set` funguje, `run.mjs --out a1-before/after` shodné, `tests/progression*` beze změny, test shody čísel, API hry beze změny.
- **A2 Obsah a texty Atlasu přes i18n** (narrative-writer, Sonnet, 2 h): `atlas-content.js`, `atlas-text.js`, locales, testy, hlavička `03-texty.md`. Přijetí: vše přes klíče EN/CS, čísla přes `num/unit/pct`, zakázané formulace v obou jazycích, strážní test zastaralých slov, ID bonusů beze změny.
- **M2 Hra na novém modelu** (Opus, 3,5 h, po A1): `core.js`, `events.js`, `config.js`, `throw.js`, `storage.js`, `reveal.js`, `result.js`, nový `src/workshop-ui.js`, `ui.js`, testy. `kitOf(p)`, save v5, `completed` = 4 876 m, `fold`×`folds`, nové události za příznakem. Přijetí: let hra = `fly` simulátoru (1e-9), plná výbava medián ≥ 4 876 m a let ≤ 35 s, migrace v1–v4 → v5, smoke test.
- **B1a Panel Atlasu** (Sonnet, 2,5 h, po A2): `src/atlas-ui.js` (`mountAtlas`), `index.html` `#atlas`, `style.css` `.atlas-*`, `bonus.html`, test. Spec 01 §3–5, bible kap. 10. Přijetí: 16 stavů, nejvýš jeden teaser, detail jako spodní panel, koupě + Undo, kapsy, 44 px, `aria-live`, šipky, fokus, reduced motion, jen `t()`.
- **C1 Zapojení Atlasu** (Sonnet, 1,5 h, po M2 a B1a): `ui.js` — otevírání, `discoveries` → jedna novinka do výsledku, `clearUndo`, tečka, přeskočení renderu. Smoke: Market → Crowd Chain → úr. 2 → účinek v letu.
- **C2a Nové události ve scéně** (Opus + spec art-directora, 3 h): `ui-layer.js`, `events-view.js`, `companion3d.js`, modely (termika, lampion, hvězda). Art review, perf-check.
- **C2b Vstupy nových událostí** (Opus, 1,5 h): `ui.js`, locales; první setkání se zpomalením, vypnutí příznaku.
- **C3 Kapsy a schopnosti** (Opus, 2,5 h): jedno tlačítko Z6, čip při míření, výlučnost Sharp × Calm.
- **C4 Dílna 3/12/3** (Sonnet, 2 h): `workshop-ui.js`, locales podle `research/obsah/02-ux-dilna.md`; žebřík papírů, náhled „≈ +X m“, Undo.
- **G1 Papíry na vlaštovce** (Opus, 2 h): `plane.js`, `palette.js` (bible 17.3).
- **G2 Pohlednice** (Sonnet, 1,5 h): `assets/atlas/`.
- **QA** (qa-tester, art review, a11y, smoke, 1 h).

Linka 1: A1 → M2 → C1 → C2b → C3 → QA. Linka 2: A2 → B1a → C2a → C4 → G1 → G2.

## 6. Rizika
1. Přesun mechaniky rozbije determinismus simulátoru (pojistka: shoda výstupů).
2. Balanc neladěný (F5 nemíří na 90 min, chybí Q, „Paper napřed“ se zasekává na Kraftu) — hratelné, délka ne.
3. 3D při ~160 m/s: hrubé čtvrti 2–4, zbytky cyber, zásek streamování → perf-check po M2.
4. `ui.js` úzké hrdlo → vyjmout `workshop-ui.js` v M2.
5. Migrace save hráče.
6. Paper z klouzavosti na rychlost rozbije `bestAngle`, `angleHint`, `coinLine`, `throwDiff` → patří do M2.
7. Nové události bez vzhledu → spec art-directora předem.
