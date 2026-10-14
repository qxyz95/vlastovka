# Obsah: výchozí rozbor ekonomiky pro nové modely a skiny (balance-analyst)

**Zadání:** rozbor příjmu a výdajů mincí v kampani, kam vložit ceny 4–6 nových modelů vlaštovky, omezení statistik modelů a co chybí v simulátoru. Výstup `research/obsah/04-ekonomika.md`. `params.mjs` se nemění, necommituje se.

## Vstupy
- FOUND: `simulation/progression/params.mjs` (sada F5, `targets`), 08 §10.2, 06 (rozhodnutí 14. 10.: mince rostou rychleji než lineárně = 3. kolo, zatím `10 + dolet/10`), 12-ladeni2.md, `out/f5-base-x2.md`.
- ABSENT: `research/obsah/01-game-design.md` (návrh modelů od game designera).

## Hotové běhy
- `node simulation/progression/run.mjs --profileset x2 --profiles weak,average,expert --strategies realistic --n 100 --no-probes --raw --out obs-econ-x2` → `out/obs-econ-x2.md` (+ raw JSON)
- totéž `--profileset skills --out obs-econ-skills` → `out/obs-econ-skills.md`
- rozbor raw skripty ve scratchpadu (`econ.mjs`, `left.mjs`): příjem průměrný x2 24,2k ◈ (D1 2,3k / D2 4,8k / D3 7,0k / D4 10,0k), ◈/hod 67/181/284/359, zůstatek v cíli med ~1,4k, nekoupený katalog v cíli 20–32k ◈ (Neon Foil skoro nikdo, kapsa 2 nikdo).

- citlivost statistik (x2, weak/average/expert, realistic, n 60, `--set models.dart.*` + `models.glider.*`): `out/obs-mod-base`, `-cruise5`, `-cruise10`, `-glide5`, `-speed5`, `-qte10`, `-trade5`. Průměrný hody: 111 / 109 / 107 / 106 / **95** / 101 / 116. Speed +5 % = −14 % hodů.
- volba modelu: `out/obs-mod-onlydart` (120 hodů), `-onlyglider` (108) vs better 111.
- „daň“ přes cenu 1. kapsy: `out/obs-tax-pocket1300` (+1 000 ◈ → průměrný +5 hodů, D3 31), `-pocket2300` (+2 000 ◈ → +8 hodů, D3 35 = FAIL).
- sonda statistik modelů z 01-game-design (jen základní pole, scratchpad `models.mjs`): Hawk +25–34 % doletu (ideal 34°!), Needle +3–9 % doletu a ◈/min +26 %, Kite +3–14 % a let 31–39 s, Skimmer −25 % (bez ground), Sail −5 % (bez windK).

- kampaně s modely z 01 v místě kluzáku (x2, n 60): `out/obs-mod-hawk-as-glider` (průměrný 79 hodů / 46,7 min, D2 15 = CRITICAL), `-needle-as-glider` (113 / 53,3 min, expert 64), `-kite-as-glider` (111 / 65,5 min, max let 56,9 s), `obs-mod-ideal4` (ideal +4° → 86 hodů).
- zapsáno `research/obsah/04-ekonomika.md` (§0–8, BLOCKED 1–4).
- `npm test` 275/275 OK (params beze změny).

## Rozpracováno
nic, hotovo

## Další kroky (pro orchestrátora)
1. rozhodnutí BLOCKED 1–4 v 04-ekonomika.md §8
2. game-dev: rozšíření simulátoru (§4), pak ladění cen modelů workflow (x2 + SKILLS, n 200)

## Změny v params.mjs
žádné
