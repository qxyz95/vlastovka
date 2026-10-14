---
name: art-review
description: Art review grafiky Just Throw It proti stylové bibli research/design/02-styl.md - snímky 3D hry, prototypu nebo UI na mobilní i desktopové šířce, kontrola palety, siluet, obrysů, půltónu, světla, čitelnosti letu, efektů a UI, se závažností Critical / Major / Minor / Suggestion a konkrétním doporučením.
when_to_use: „zkontroluj grafiku“, „sedí to do stylu?“, „art review“, po každé vizuální změně v src/render3d/, style.css, prototypech nebo nových assetech.
argument-hint: "[URL nebo soubor, např. index.html, prototype-atlas.html; volitelně oblast: čtvrť, efekt, UI]"
---

# Art review

Cíl: `$ARGUMENTS` (bez argumentu hra `index.html`, všechny čtvrti).

## Závažnost
- **Critical:** hráč ztratí vlaštovku nebo dráhu letu, nečitelná informace nutná ke hraní, porušení pilíře stylu.
- **Major:** prvek zjevně z jiného stylu (barva mimo paletu, chybí obrys, jiná hustota detailu, cizí typografie), rozpor mezi čtvrtěmi bez důvodu.
- **Minor:** drobná odchylka (tloušťka obrysu, odstín, odsazení). **Suggestion:** zlepšení nad rámec bible.
- Co nešlo ověřit (skryté okno, chybí stav), je **NOT ASSESSED**, ne „prošlo“.

## Postup
1. Přečti `research/design/02-styl.md`. Když chybí nebo má hlavičku „NÁVRH“, uveď to v reportu a hodnoť proti návrhu.
2. Načti skill `claude-in-chrome` a nástroje jedním `ToolSearch` (tabs_context_mcp, tabs_create_mcp, navigate, computer, javascript_tool, resize_window, read_console_messages). Pracuj ve vlastní nové záložce.
3. `npm start` na pozadí, pak `http://127.0.0.1:4173/<cíl>` (ne `file://`). Ověř `document.hidden === false`, jinak vzhled = NOT ASSESSED.
4. Předem vypiš matici snímků: šířky 375×667, 932×430, 1280×800 × stavy (Dílna, míření, let, událost/QTE, výsledek, panely) × čtvrti (posun přes `window.__r3d.advance`). Neúspěšné body nevyškrtávej.
5. Ke každému snímku projdi kapitoly bible:
   - **Paleta:** barvy ze `getComputedStyle` (UI) a vzorek pixelů ze snímku (3D) proti hex hodnotám bible a `src/render3d/palette.js`.
   - **Tvar a měřítko:** siluety, proporce, hustota detailu podle vzdálenosti, obrysy, půltón.
   - **Světlo a nálada:** odpovídá čtvrti a postupu.
   - **Čitelnost:** vlaštovka a dráha letu vždy nejkontrastnější (hodnota světlosti, ne jen barva); HUD nepřekrývá dráhu.
   - **Efekty a pohyb:** intenzita a časování podle bible; reduced motion (nelze-li emulovat, NOT ASSESSED).
   - **UI:** typografie, ikony, rámečky, tokeny ze `style.css`.
   - **Jednota:** porovnej sousední čtvrti a nový prvek se starým; stejná věc má vypadat stejně.
6. Pro výkonné dopady (nové geometrie, efekty) odkaž na skill `perf-check`, pro kontrast textu a dotykové cíle na `a11y-audit`. Sám je neopakuj.
7. **Report:** `reports/art/<YYYY-MM-DD>-<cíl>.md`, snímky do `reports/art/img/`. Tabulka: závažnost, kapitola bible, místo (stav, čtvrť, šířka, soubor:řádek, je-li znám), problém, doporučení. Pak „co je dobré a nechat“, rozpory bible × kód (návrh, co platí), seřazené další kroky a seznam NOT ASSESSED.
