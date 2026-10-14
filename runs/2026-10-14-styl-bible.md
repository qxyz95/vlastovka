# Styl bible (art-director), 14. 10. 2026

Zadání: první verze stylové bible `research/design/02-styl.md` (NÁVRH) z toho, co ve hře funguje, se snímky a variantami pilířů a palety pro uživatele.

Smí měnit: `research/design/02-styl.md`, `research/design/img/*`, tento soubor.

## Hotové kroky
- 2. Mapování (palette.js, toon.js, comic.js, mood.js, scene.js, plane.js, districts, style.css, atlas art.js/css, 01-papiry, svet §2.2). Hlavní rozpory: UI style.css (Neon District cyan/magenta na #090d1b) × Atlas (indigo #1b1444, Bahnschrift) × 3D (fialový soumrak); 3 různé inkousty (#15101f, #07051a, #120a2a); VERSE[0] tyrkysové ráno × mood fialový soumrak; tloušťka obrysu comicLook (1,6–2,2) se v scene.js nepoužije (2,5/2,6); barvy natvrdo v life3d.js a workshop.js mimo palette.js; meta theme-color #162e32 zbytek zelené UI.

- 3. Snímky v Chrome hotové (15 souborů v research/design/img/). Okno bylo skryté (visibilityState hidden), kresleno přes ?timer; statický vzhled posouzen, plynulost NOT ASSESSED. Čtvrti 2–4 přes teleport ladicího letu (__r3d.reset + f.x) a __r3d.snapshot. Atlas prototyp nešel spustit (content.js bez exportu UI, rozpracováno product-designerem), pohlednice vykresleny přímo z art.js. Save v localStorage zálohován (scratchpad/localStorage-backup.json) a po hodech obnoven (ověřeno ===).
- Kontrasty změřeny (WCAG) včetně barev vlaštovky ze snímků: Horizon 1,07, Core 1,21 výplň vs. obloha; stopa Core vs. tyrkysový pás 1,01.

- 4. Bible `research/design/02-styl.md` (NÁVRH) napsána: 10 kapitol + kap. 11 rozpory R1–R17.
- 5. Varianty pilířů (A/B/C, kap. 1.1) a palety (A/B/C, kap. 2.5, img/varianty-palety.png), otevřené otázky kap. 10.

- 6. Uživatel rozhodl (06, blok „Ke stylové bibli“): vše podle doporučení. Bible upravena na „Schváleno 14. 10. 2026“, varianty B/C jen jako zamítnuté, přidán R18 (obzor Core).
- 7. Plán `research/design/03-styl-implementace.md`: úkoly U1–U22 podle priority, dávky G0 (tokeny) → G1/G2/G3/P1/P2 bez překryvu souborů.

## Rozpracovaný krok
- žádný, hotovo.

## Další kroky
- Orchestrátor spustí dávky podle 03; art-director dělá art-review po každé dávce.

## Změněné soubory
- `runs/2026-10-14-styl-bible.md`
- `research/design/02-styl.md` (nový, schválený)
- `research/design/03-styl-implementace.md` (nový)
- `research/design/img/` (16 obrázků, nový adresář)
