---
name: a11y-audit
description: Audit přístupnosti stránky nebo prototypu Just Throw It podle checklistu WCAG 2.2 (POUR) a herních bodů - kontrast, focus, klávesnice, dotykové cíle 44 px, reduced motion, text v canvasu, QTE bez spoléhání na barvu - se závažností Critical / Serious / Moderate / Minor a odhadem pracnosti.
when_to_use: „zkontroluj přístupnost“, „a11y“, před předáním mockupu nebo po změně UI, HUD, Dílny či Atlasu.
argument-hint: "[URL nebo soubor, např. index.html, prototype-atlas.html]"
---

# Audit přístupnosti

Cíl auditu: `$ARGUMENTS` (bez argumentu `index.html` hry).

## Závažnost a pracnost
- **Critical:** znemožní hraní nebo ovládání (nejde hodit bez myši, past focusu, blikání > 3×/s).
- **Serious:** výrazně ztíží (kontrast pod limitem v HUD, cíl < 44 px, informace jen barvou).
- **Moderate:** obtěžuje, má obchvat. **Minor:** kosmetika.
- Pracnost: do 1 h / 1–4 h / víc. Co nešlo ověřit, je **NOT ASSESSED**, ne „prošlo“.

## Postup
1. Načti skill `claude-in-chrome` a nástroje jedním `ToolSearch` (tabs_context_mcp, tabs_create_mcp, navigate, read_page, find, javascript_tool, computer, resize_window, read_console_messages).
2. Hra: `npm start` na pozadí, pak `http://127.0.0.1:4173/<cíl>` (ne `file://`). Prototyp: stejně přes server.
3. Předem vypiš, co budeš kontrolovat: šířky 320, 360, 1280 × stavy (Dílna, míření, let, QTE, výsledek, panely), jazyky `?lang=en` a `?lang=cs`. Neúspěšné kontroly nevyškrtávej.
4. **Vnímatelnost**
   - Kontrast přes `javascript_tool` (spočti z `getComputedStyle` barvy textu a pozadí): text 4,5:1, velký text (≥ 24 px, nebo ≥ 18,7 px tučně) 3:1, prvky UI a focus 3:1. U canvasu (kruh QTE, mířidla) odhadni ze snímku a označ jako vizuální kontrolu.
   - Informace nikdy jen barvou: úspěch, neúspěch a perfekt QTE mají i tvar, ikonu nebo text.
   - **Text v canvasu:** velikost aspoň 18 px při 1080p a stejná informace dostupná v DOM (popisky HUD, `aria-label`, `aria-live`).
   - `lang` na `<html>` odpovídá jazyku (`?lang=cs` → `cs`). Reflow na 320 px bez vodorovného posunu (`document.documentElement.scrollWidth <= innerWidth`).
5. **Ovladatelnost**
   - Klávesnice: projdi `Tab`/`Shift+Tab` (`computer` key), hod a QTE jen klávesnicí, žádná past focusu, pořadí odpovídá vzhledu.
   - Viditelný focus u každého ovládacího prvku. Žádný kladný `tabindex`, žádný klikací `div` bez role (`read_page` / `find`).
   - Dotykové cíle ≥ 44 × 44 px: `javascript_tool` přes `getBoundingClientRect()` všech `button, a, [role=button], input`.
   - Žádné povinné současné stisky ani tažení. Pauza kdykoli. Bez blikání víc než 3× za sekundu.
6. **Srozumitelnost:** stavové zprávy (rekord, nákup, nové místo) přes `aria-live`; tlačítka mají srozumitelný název v EN i CS.
7. **Robustnost a herní body**
   - `prefers-reduced-motion`: najdi v CSS a JS (`grep -rn "prefers-reduced-motion" src/ index.html`), ověř, že pohyb a otřes zmizí a zpětná vazba zůstane. Emulace v prohlížeči nejde, proto ověření ve hře = NOT ASSESSED, pokud nejde přepnout v OS.
   - Možnost usnadnit QTE (širší okno, auto-splnění, delší držení) bez trestu: existuje? Pokud ne, nález Serious.
   - Konzole bez chyb během celé kontroly.
8. **Report:** `reports/a11y/<YYYY-MM-DD>-<cíl>.md`. Tabulka: závažnost, kritérium WCAG (např. 1.4.3), místo, problém, dopad, doporučení, pracnost. Pak sekce „co je dobré a nechat“, seřazené další kroky a seznam NOT ASSESSED.
