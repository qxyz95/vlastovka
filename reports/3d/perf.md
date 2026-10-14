# Výkon 3D rendereru (fáze a5/a6)

**14. 10. 2026.** Měřeno po integraci 3D jako výchozího rendereru hry (`index.html`).

## Stroj a prohlížeč
- ASUS ROG Strix G513IM: Ryzen 7 4800H, RTX 3060 Laptop + Radeon iGPU, 16 GB RAM, displej 1920×1080.
- Prohlížeč: **Brave** (Chromium 155), DPR 1,65 (zvětšení stránky), plátno 3D 1669×938 px (DPR strop 2).
- **GPU:** `chrome://gpu` nešlo z automatizace otevřít (interní URL) a Brave maskuje `WEBGL_debug_renderer_info` (vrací „Brave“).
  Podle `nvidia-smi` běží oba GPU procesy Brave (`brave.exe`, typ C+G) na **RTX 3060 Laptop**. Ruční ověření: `brave://gpu`, řádek *GL_RENDERER*.

## Omezení měření
- Okno prohlížeče z automatizace bylo **zakryté** (`document.hidden = true`), viditelné okno se nepodařilo zajistit. rAF v takovém okně neběží
  a časovače jsou škrcené, proto hra šla ověřit jen s `?timer` (smyčka přes MessageChannel). Intervaly snímků z panelu `?perf=1` jsou v tomto
  režimu nespolehlivé (25–40 ms, kadenci určuje škrcení, ne GPU) a do výsledků nejsou brané.
- Spolehlivé číslo dává `__r3d.bench(n)`: synchronní snímky (`step` + `planFrame` + `apply` + `draw`) s `readPixels`, který čeká na GPU.

## `__r3d.bench` (let nad Violet Suburbs, post-proces zapnutý, 1669×938)
| běh | snímků | vzdálenost | ms/snímek avg | P95 | CPU avg | CPU P95 | draw calls | trojúhelníky |
|---|---|---|---|---|---|---|---|---|
| seed 1 | 230 | 43 m | 5,94 | 9,2 | 1,95 | 2,8 | 81 | 51,4 tis. |
| seed 2 | 230 | 43 m | 5,13 | 6,4 | 2,60 | 3,6 | 89 | 51,3 tis. |
| seed 3 | 1190 | 162 m | 5,18 | 6,1 | 1,86 | 2,6 | 89 | 51,4 tis. |
| seed 4 | 1190 | 162 m | 9,18 | 19,9 | 3,55 | 3,9 | 89 | 51,4 tis. |

Dřívější série (jiné spuštění): 9,16 / 7,57 / 33,86 ms avg (P95 16,6 / 15,8 / 82). Výkyvy přicházejí v sériích a odpovídají zakrytému oknu
(Windows a prohlížeč mu snižují prioritu), CPU část zůstává 2–4 ms.

**Závěr:** typicky **5–6 ms/snímek (≈ 170–190 fps možných), CPU ≈ 2–3 ms, 81–89 draw calls, ~51 tis. trojúhelníků** → cíl d1
(P95 ≤ 16,7 ms, CPU ≤ 6 ms, ≤ 120 draw calls) splněn ve většině běhů; P95 nad 16,7 ms jen v sériích se škrceným oknem.

## Předehřátí a 30 fps
- V Dílně se po prvním snímku dostaví místa 2–5 (po jednom za snímek, `city.prewarm`) a jednou `renderer.compile` přes celou scénu včetně
  skrytých objektů (vlaštovka, stopa, holub, pára). `stats().cached` = 6 před prvním hodem.
- Dílna a výsledek kreslí nejvýš 30 fps (naměřeno ~21 vykreslení/s v režimu `?timer`), míření a let plnou frekvencí, skrytá záložka nekreslí.
- Zásek při prvním hodu ve viditelném okně **neověřen** (viz omezení). Doporučení: změřit ručně v `index.html?perf=1` ve viditelném okně
  a doplnit sem, včetně běhu na integrované Radeon (Windows → Nastavení grafiky → Brave → Úsporný režim).
