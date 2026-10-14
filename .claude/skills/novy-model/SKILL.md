---
name: novy-model
description: Postup pro přidání 3D modelu do katalogu Papírového města Just Throw It (src/render3d/models/) - karta z katalogu 11, tenké díly, LOD 0/1/2, stropy trojúhelníků, stínový proxy, registr, testy, stránka katalogu a předání k art review. Pro game-dev agenty v dávkách katalogu G3-G7 a dalších.
when_to_use: „přidej model“, „udělej skupinu G4“, dávky katalogu modelů, nový objekt do čtvrti.
argument-hint: "[id modelu nebo skupina, např. tree-round nebo G4]"
---

# Nový model do katalogu

Cíl: `$ARGUMENTS`.

## Zdroje
- Karta objektu: `research/design/11-katalog-ctvrt1.md` (tabulka skupin, karta, kap. 1 měřítko a barvy, kap. 4 rozpočty a stropy, kap. 6.1 rozpory). Postup a principy: `10-katalog-modelu.md`. Bible `05-styl-papir.md`.
- Rozhodnutí `research/bonusy/06-rozhodnuti.md`: hodně detailu všude přes tenké díly (scénář C, `panel`/`lista`), jedno měřítko světa, hořčicová jen pro hodnotu (mince), grafit jen vlaštovka a její stopa, praporky `#f2b65a`, stropy na místo platí.
- Vzor: hotové modely v `src/render3d/models/` (`parts.js` díly, `index.js` registr), `src/render3d/paper-cards.js` tvary karet, testy `tests/render3d-models.test.js`, soubory průběhu `runs/*-modely.md`, `runs/*-g2b-*.md`.

## Postup
1. Přečti kartu a zapiš do souboru průběhu, co karta neurčuje (předpoklady k art review).
2. Model jako čistá funkce `build(params, lod)` → karty; barvy jen z `palette.js` tokenů (nový hex jen s tokenem a souhlasem art-directora). Tenké díly (hloubka ≤ 0,15 m) jako `panel`/`lista`; nový tvar karty jen přidávej do `paper-cards.js`, stávající neměň.
3. LOD 0 / 1 / 2 podle vrstvy (ulice / střed / dálka); silueta LOD 2 musí sedět s LOD 0. Stínový proxy `shadow(params)` (nejvýš pár △).
4. Registr v `models/index.js`: id, skupina, stropy `tris:[l0,l1,l2]`, varianty a výchozí parametry, deterministický seed.
5. Testy: registr, stropy △ všech variant, pokles mezi LOD, silueta, měřítko (dveře 1,1 × 2,2 m, člověk 1,7 m, …), barvy (žádná hořčicová ani grafit), determinismus, stín.
6. Katalog `prototype-katalog.html` (`prototype/katalog/main.js`) model ukáže automaticky z registru; zkontroluj štítek skupiny.
7. `npm test` zelený, commit `render3d: modely skupiny <X>`.
8. Report: tabulka △ proti stropům (max / výchozí varianta / stín), předpoklady k art review, NOT ASSESSED (vzhled bez prohlížeče), rozpory s kartou jako `BLOCKED:` s doporučenou variantou v kódu.

## Nesmíš
Zasahovat do herní scény (`workshop.js`, `scene.js`, `city.js`, …), pokud to dávka výslovně nezadá. Zvedat strop bez rozhodnutí uživatele (napiš BLOCKED).
