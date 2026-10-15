# Hudební zadání pro Papírové město (audio-designer, 15. 10. 2026)

**Zadání:** `research/hudba/03-hudebni-zadani.md`: sekce A–D (audit, identita, leitmotiv, doporučení), pak E (mapa intenzity podle `02-casova-osa.md`) a F (spec pro game-deva na krok 3).

## Hotové kroky
- Čtení podkladů (06, 01, bible 05, stav, zdroje, `src/music/*`, `audio-mix.js`, `audio.js`, `sfx.js`).
- Reference ověřeny (03 kap. D.4).
- A–D napsány, doporučení E → „Diorama“, téma „Hod“ `[0,4,5,3,2,1]` / `[1,1,3,1,1,1]`.
- Odpovědi uživatele 15. 10. zapracovány: A, C, D, F se smažou (jiný agent), B a E do slepého poslechu; téma roste podle místa; syntéza, nahrávky jen záloha.
- E napsána z `02-casova-osa.md`: E.1 fakta → míra v dobách, E.2 tabulka fází s intenzitou 0–3 a přechody, E.3 hystereze filtru (celá událost + 0,3 s), okno ticha se slitím masek < 0,4 s, duck bez pumpy, E.4 nová hranice = přepnutí jen v klidu, znělka na kartu čtvrti, známá hranice = nic, E.5 únava (fráze ≈ let, forma ~2 min, růst tématu, ticho 45–60 s po 12 min).
- F napsána: moduly, rozhraní `audio.update(state)`, testy T/M/D/K/L/S, LUFS cíle, `playbackStats` kritéria, slepý poslech 15 min.

## Rozpracováno
- nic

## Další kroky
- Krok 3 (game-dev podle 03 kap. F).

## Změněné soubory
- `research/hudba/03-hudebni-zadani.md`
- `runs/2026-10-15-hudba-zadani.md`
