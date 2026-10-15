# Měření hudby Diorama (krok 3, 03 F.4 a F.5)

**15. 10. 2026, game-dev.** Větev `worktree-agent-a590831da6dcbe307`, commit `593f365` (hlasitost) a `997285d` (zátěž, stejné hlasy, starší vyvážení vrstev).

## Prostředí a omezení
- **Rozšíření Claude in Chrome nebylo dostupné** (`list_connected_browsers` vrátil prázdný seznam, každá akce v záložce končila chybou). Měřilo se proto v **headless Chromiu 151** (Playwright `chromium-1234`, `--headless=new`, `--autoplay-policy=no-user-gesture-required`) přes CDP skriptem, na uživatelově notebooku (Windows 11), `npm start`, `prototype-music.html`.
- V headless režimu je `document.hidden === false` a `visibilityState === 'visible'` (ověřeno v každém běhu, `hiddenSamples` 0), ale **nejde o viditelné okno na obrazovce** a zvuk nešel do skutečného výstupního zařízení. Podle F.5 je proto splnění kritérií zátěže pro referenční notebook **NOT ASSESSED**; níže uvedená čísla jsou informativní.
- Gesto uživatele nahradil přepínač autoplay (AudioContext `running` bez klepnutí). Skutečné odemčení prvním klepnutím ve viditelném okně: NOT ASSESSED.
- Konzole po celou dobu všech běhů: žádné chyby ani výjimky, jen 404 `favicon.ico` (stránka favicon nemá).

## F.4 Hlasitost (LUFS)
Metoda: tlačítko „LUFS“ v prototypu (`lufsAll()`), `OfflineAudioContext` 48 kHz, 60 s na čtvrť, výchozí nastavení (hudba 60 %, efekty 80 %, master 100 %), celý graf včetně limiteru. Stav „klidný let“ = let, kombo 3, 3 zásahy, rychlost 1,2, `density` 0,7, místo 4. Výpočet `src/audio-loudness.js` (ITU-R BS.1770-5, ověřeno testy proti EBU Tech 3341 případ 1, 2 a 4). Offline render je pro obsah zvuku spolehlivý, gotcha z `CLAUDE.md` se týká zátěže.

Diorama, commit `593f365` (běh 207 s):

| Měřítko | Cíl | Naměřeno | Verdikt |
|---|---|---|---|
| Integrovaná hlasitost, čtvrť 1 / 2 / 3 / 4 | −22 ± 1,5 LUFS | −23,0 / −22,9 / −23,0 / −22,4 | splněno |
| Rozdíl mezi čtvrtěmi | ≤ 1,5 LU | 0,7 LU | splněno |
| Dílna proti klidnému letu (čtvrť 1) | 3–6 LU tišší | 5,3 LU | splněno |
| Výsledek proti klidnému letu (čtvrť 1) | 3–6 LU tišší | 3,4 LU | splněno |
| Okno QTE proti klidnému letu (čtvrť 1, ustálený stav) | ≥ 4 LU tišší | 4,4 LU | splněno (těsně) |
| Perfekt nad hudbou, momentary 400 ms (čtvrť 1) | ≥ +6 LU | +8,5 LU | splněno |
| Tik nad hudbou v okně, momentary 400 ms | ≥ +9 LU | +11,3 LU | splněno |
| Vzorkový vrchol hudby (60 s, čtvrti 1–4) | ≤ −1 dBFS | −6,0 až −7,5 dBFS | splněno |
| Vzorkový vrchol samotného tiku / perfektu | – | −3,0 / −15,1 dBFS | – |
| Vrchol celé směsi (hudba + efekty naráz) | ≤ −1 dBFS | – | NOT ASSESSED (hudba a efekty měřeny zvlášť) |
| Redukce limiteru v klidném letu | ≤ 2 dB | max 0,83 dB, průměr 0,02 dB (realtime headless, 10 min, `997285d`) | splněno v headless; viditelné okno NOT ASSESSED |

Okno QTE se měří jako ustálený stav (ztenčené vrstvy a filtr 1,8 kHz po celých 60 s, bez masky ticha). Perfekt a tik: render 10 s, hudba zvlášť (se ztlumením −4 dB, resp. s maskou ticha kolem tiku) a efekt zvlášť, momentary blok se středem 0,15 s po úderu.

### Kandidáti slepého poslechu (bez vyrovnání, 60 s, commit `997285d`, Diorama ještě se starším vyvážením)
| Směr | Čtvrť 1 | 2 | 3 | 4 | Vrchol |
|---|---|---|---|---|---|
| B Paper Lo-fi | −20,8 | −21,0 | −20,9 | −20,4 | −4,6 až −5,3 dBFS |
| E Above the City | −24,8 | −24,5 | −24,5 | −24,9 | −11,9 až −13,2 dBFS |
| G Diorama (`593f365`) | −23,0 | −22,9 | −23,0 | −22,4 | −6,0 až −7,5 dBFS |

Rozdíl mezi kandidáty je až 4 LU, proto slepý režim každého kandidáta v každé čtvrti nejdřív změří (30 s offline) a vyrovná na −22 LUFS přes `trim` v grafu (`store.trims` v `localStorage`). Samotné vyrovnání ve slepém režimu v prohlížeči jsem nespouštěl; výpočet trimu je testovaný (`trimFor`), průchod tlačítkem: NOT ASSESSED.

Postup ladění (20 s rendery, čtvrť 1): původně hrála vrstva L1 (puls) −22,5 LUFS a ostatní vrstvy −33 až −37, takže Dílna byla o 17,6 LU tišší a okno QTE jen o 0,2 LU. Vyvážení vrstev `layerDb` v datech čtvrtí (plocha nese, puls je pod ztenčením) a zesílení perfektu (+3,5 dB) a tiku (+3 dB a delší doznění 40 ms) dostalo všechna měřítka do cíle.

## F.5 Zátěž (`playbackStats`)
Realtime, Auto flight „Podle postupu“, bot 70 %, fáze hry „pozdní“, Diorama od 0 m: za 10 min 22 hodů, všechny 4 čtvrti, 3 přepnutí se stingerem, finále. Commit `997285d`.

| Měřítko | Cíl | Naměřeno (headless, 600 s) | Verdikt |
|---|---|---|---|
| `underruns` přírůstek | 0 | 0 | headless splněno; viditelné okno NOT ASSESSED |
| `underrunMs` | 0 | 0 | headless splněno; viditelné okno NOT ASSESSED |
| `schedMax` | < 5 ms | 58 ms (jediný průchod v 542. s, přehrání 1 noty bez generování taktu); všech ostatních ~6000 vzorků ≤ 1,6 ms | **nesplněno** v headless |
| Špička hlasů `peak` | ≤ 48 | 33–34 | splněno |
| Cache KS | ≤ 8 MB | 25 bufferů × 1,5 s × 48 kHz × 4 B = 7,2 MB | splněno |
| `lim.reduction` v letu | ≤ 2 dB | max 0,83 dB | splněno |

Průběh `schedMax` po úpravách (stejný 10min scénář):
- před přesunem dozvuku: 14,9 ms; pomalé průchody jsou přepnutí čtvrti (nastavení `ConvolverNode.buffer` stojí ~10 ms hlavního vlákna),
- po přesunu dozvuku mimo průchod (`43c96d3`): 7,2–7,6 ms při přepnutí a jednou 115 ms,
- po přesunu posluchačů přepnutí (stinger) mimo průchod (`997285d`): přepnutí už pomalé průchody nedělají, zbyl jediný 58ms průchod bez zjevné práce (1 nota). Nejspíš je to pauza garbage collectoru nebo plánovače headless prohlížeče. Neověřeno, záznam `audio.stats().spikes` to ukáže i ve viditelném okně.

Výpadky zvuku to nezpůsobilo (předstih plánovače 0,3 s), ale kritérium < 5 ms ve všech průchodech v headless splněné není.

**NOT ASSESSED:** viditelné okno na referenčním notebooku (10 min na čtvrť, 40 min), iPhone 15 Pro (Safari, poslech 10 min a `schedMax`), poslech cvaknutí, odemčení zvuku gestem. Bez zařízení a bez funkčního rozšíření Chrome jsem tato měření neprovedl.

## Jak měření zopakovat ve viditelném okně
1. `npm start`, otevřít `http://127.0.0.1:4173/prototype-music.html`, klepnout do scény.
2. Hlasitost: tlačítko **LUFS** v panelu „Vrstvy a zátěž“ (všichni tři kandidáti, asi 6–9 minut), výsledek se vypíše pod tlačítko a do `musicProto.lufs`.
3. Zátěž: v konzoli `musicProto.monitor.start()`, zapnout „Podle postupu“, QTE „Bot 70 %“, **▶ Auto flight**, nechat 10 min viditelné, pak `musicProto.monitor.report()` a `musicProto.audio.stats().spikes`.
