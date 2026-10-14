---
name: perf-check
description: Změří výkon 3D rendereru Just Throw It v prohlížeči přes claude-in-chrome (window.__r3d.bench, __r3d.stats, ?perf=1, ?timer), porovná s rozpočty draw calls, trojúhelníků a času snímku, otestuje únik paměti a zapíše tabulku do reports/3d/perf.md. Upozorní, když je okno zakryté a čísla neplatí.
when_to_use: „změř výkon“, „kolik fps“, po změně v src/render3d/, podezření na únik paměti nebo zásek.
argument-hint: "[poznámka ke scénáři, např. seed 3, post vyp]"
---

# Perf check

Poznámka ke scénáři: `$ARGUMENTS`

## Rozpočty
| Metrika | Cíl d1 (náš) | Strop desktop | Strop mobil |
|---|---|---|---|
| ms/snímek P95 | ≤ 16,7 | | |
| CPU ms/snímek avg | ≤ 6 | | |
| draw calls | ≤ 120 | 300 | 150 |
| trojúhelníky | | 750 tis. | 300 tis. |
| geometrie | | 300 | 200 |
| textury | | 60 | 40 |

DPR strop 2 (`MAX_DPR` v `src/render3d/index.js`). Metrika bez rozpočtu nebo bez měření = **NOT ASSESSED**, ne „prošlo“.

## Postup
1. Načti skill `claude-in-chrome` a nástroje jedním `ToolSearch` (tabs_context_mcp, tabs_create_mcp, navigate, javascript_tool, computer, read_console_messages).
2. Spusť server `npm start` na pozadí (když už neběží: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4173`).
3. Otevři v nové záložce `http://127.0.0.1:4173/index.html?perf=1`.
4. **Viditelnost okna:** `javascript_tool` → `({hidden: document.hidden, dpr: devicePixelRatio, w: innerWidth, h: innerHeight})`.
   - `hidden: true` → **upozorni:** okno je zakryté, rAF neběží a časovače jsou škrcené. Čísla z panelu `?perf=1` jsou neplatná. Přejdi na `index.html?perf=1&timer` (jen funkční ověření) a časy z `bench` označ jako orientační, ms/snímek z panelu NOT ASSESSED. Uživateli doporuč ruční měření ve viditelném okně.
5. **Scénář:** zapiš seed, místo, velikost plátna a DPR (`__r3d.stats.size`, `.dpr`), post zap/vyp (`__r3d.stats.post`).
6. **Baseline:** 3× `window.__r3d.bench(240, {seed: 1})` (a s `seed` ze `$ARGUMENTS`, pokud je), výsledky `avg`, `p95`, `cpu`, `cpuP95`, `calls`, `tris`. Plus `window.__r3d.stats` (calls, triangles, size, dpr, post, statistiky města) a paměť `window.__r3d.scene.renderer.info.memory` (`geometries`, `textures`).
7. **Únik:** `renderer.info.memory` po načtení → po 10 letech (ručně přes `computer`, nebo 10× `__r3d.reset(seed); __r3d.advance(60)` se seedy 1–10) → po `__r3d.lose()` a `__r3d.restore()` (počkej, až `__r3d.lost` je `false`). Počty geometrií a textur se musí vrátit na stejnou hodnotu.
8. **Konzole:** `read_console_messages` po celou dobu bez chyb.
9. **Porovnání:** tabulka metrika / rozpočet / skutečnost / OK–OVER–NOT ASSESSED, třída úzkého hrdla (CPU / draw calls / fragment / vertex / paměť), regrese proti poslední tabulce v `reports/3d/perf.md`.
10. **Zápis:** nový oddíl s datem do `reports/3d/perf.md` (stroj, prohlížeč, scénář, viditelnost okna, tabulka, únik, závěr). Doporučení s odhadem přínosu a rizikem; potvrzení jen měřením.
11. Výslovně uveď NOT ASSESSED: viditelné okno (pokud zakryté), iPhone 15 Pro, iGPU Radeon, zásek prvního hodu.
