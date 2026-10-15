# Hudba Diorama, krok 3 (game-dev, 15. 10. 2026)

**Zadání:** implementovat směr „Diorama“ v hudebním prototypu podle `research/hudba/03-hudebni-zadani.md` kap. F (B–E podklad), bez zapojení do hry; testy T/M/D/K/L/S, měření LUFS a výpadků, scénář slepého poslechu.

Větev: worktree `worktree-agent-a590831da6dcbe307`. **Stav: hotovo**, čeká na kontrolu orchestrátora.

## Hotové kroky
1. `src/music/ks.js` + K-1 (e259504).
2. `src/audio-loudness.js` + L-1, L-2 (a45e485); reference ověřeny v PDF EBU Tech 3341 V4 (11/2023) tab. 1 a ITU-R BS.1770-5 tab. 1–2.
3. `audio-mix.js`: ARC, comboNote, INTENSITY, musicFilter + hystereze, place, boundaryPlan, switchAllowed, silenceMask, fatigue, duckPlan, eventCentres, audioState, qteCenter z e.w; T-1, T-2, T-8, M-1…M-7 (e67c276).
4. Hlasy papírové kapely v `synth.js`, `diorama.js`, `index.js`; T-3…T-7, T-9, S-1 (05d7765).
5. Engine `audio.js` + `sfx.js`; D-1…D-3 (dc8d0b1).
6. Vyvážení vrstev `layerDb`, perfekt a tik podle LUFS, předehřátí KS (8c5ece6, 593f365).
7. Prototyp (1df7a02), přesuny práce mimo plánovač (43c96d3, 997285d).
8. Měření `reports/hudba/diorama-mereni.md`, scénář `reports/hudba/slepy-poslech.md`.

## Rozpracováno
- nic

## Další kroky (pro orchestrátora)
- Měření ve viditelném okně a na iPhonu (NOT ASSESSED), slepý poslech uživatelem.

## Změněné soubory
`src/music/ks.js`, `src/audio-loudness.js`, `src/audio-mix.js`, `src/music/synth.js`, `src/music/diorama.js`, `src/music/index.js`, `src/audio.js`, `src/sfx.js`, `prototype-music.html`, `prototype/music/main.js`, `prototype/music/blind.js`, `tests/audio-mix.test.js`, `tests/music-diorama.test.js`, `tests/music-ks.test.js`, `tests/audio-loudness.test.js`, `tests/helpers/fake-audio.js`, `reports/hudba/diorama-mereni.md`, `reports/hudba/slepy-poslech.md`, tento soubor.

## Měření
- `reports/hudba/diorama-mereni.md` (headless Chromium 151 přes CDP; rozšíření Chrome nedostupné).
