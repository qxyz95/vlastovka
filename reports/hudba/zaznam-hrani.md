# Jak nahrát 15 minut svého hraní a vyhodnotit ho

Záznam ukáže, co hra opravdu vydala na hlavní sběrnici (hudba + efekty, za limiterem), a log ukáže, kdy se co stalo (stisky, středy QTE, výsledky, obrazovky, čtvrtě, hlasitost). Analyzátor z toho spočítá hlasitost, cvaknutí, výpadky, tiky v maskách ticha a podíl perfektů.

## 1. Nahrání (Chrome na notebooku, viditelné okno)
1. `npm start` a otevři `http://127.0.0.1:4173/?audio=rec,debug`.
   - `rec` zapne záznam, `debug` přidá vlevo dole malý panel (intenzita, vrstvy, maska, čtvrť a místo, LUFS-M, výpadky, délka záznamu).
   - Bez `debug` jde i jen `?audio=rec`.
2. Klepni do hry. Záznam začne s prvním klepnutím (dřív zvuk neexistuje). Panel ukazuje `REC … s`.
3. Hraj normálně asi 15 minut. Okno nech viditelné. Při skryté kartě se zvuk uspí a záznam se zastaví spolu s ním (čas zvuku stojí, takže WAV i log zůstanou srovnané; v logu jsou řádky `sleep` a `wake`).
4. Klepni vpravo dole na **„■ stop rec & save“**. Prohlížeč stáhne tři soubory se stejným časem v názvu:
   - `jti-<čas>.wav`: 16bit PCM stereo, 48 kHz (asi 11 MB na minutu, 15 min ≈ 170 MB). Pro analýzu.
   - `jti-<čas>.json`: log událostí a údaje o zařízení (latence, prohlížeč, nastavení).
   - `jti-<čas>.webm`: stejný zvuk komprimovaný (Opus) na poslech.
   - Když se Chrome zeptá „Povolit stahování více souborů“, povol to.
5. Záznam se sám zastaví po 30 minutách (strop paměti).

Proč WAV a ne jen webm: MediaRecorder dává v Chrome jen ztrátový Opus. Ten mění ostré náběhy (pre-echo, ořez výšek), takže by se cvaknutí a hlasitost měřily špatně. WAV se bere bez komprese přímo z grafu přes AudioWorklet (běží v audio vlákně, hlavní vlákno jen skládá bloky). Převod webm na WAV proto není potřeba. Kdybys přesto chtěl analyzovat webm: `ffmpeg -i jti-<čas>.webm -ar 48000 -ac 2 -c:a pcm_s16le jti-<čas>.wav` (výsledek je ztrátový, cvaknutí ber s rezervou).

## 2. Vyhodnocení
```
node simulation/hudba/analyze-rec.mjs Downloads/jti-<čas>.wav
```
- Log `.json` se stejným jménem se najde sám, jinak ho přidej jako druhý argument.
- `--out reports/hudba/moje-hrani.md` uloží tabulku, `--json` vypíše všechna čísla.
- `--click 0.25` mění práh cvaknutí (skok mezi sousedními vzorky, plná škála = 1).
- `--align -15` nastaví ručně posun záznamu proti logu v ms (jinak se odhadne z tiků).

Trvá to pár sekund i pro 15 minut.

## 3. Co čísla znamenají
| Řádek | Dobře | Pozor |
|---|---|---|
| Posun záznamu proti logu | stálé číslo, v headless Chromu −15 ms (ověřeno pípnutími na přesný čas) | „–“ = v záznamu nebyl žádný tik, ostatní časy pak nejsou srovnané |
| Integrovaná hlasitost | orientačně −22 až −26 LUFS (hudba sama má cíl −22 ± 1,5, výsledek a Dílna jsou tišší; headless test 91 s dal −24,1) | výrazně nad −20 nebo pod −28 stojí za poslech |
| Vzorkový vrchol | ≤ −1 dBFS | nad −1 dBFS hrozí ořez |
| Cvaknutí mimo efekty | 0 | časy v seznamu si pusť v `.wav` (Audacity: Ctrl+J na čas) |
| Výpadky | 0 / 0 / 0 | digitální ticho uprostřed zvuku, ztracený blok záznamu nebo `underruns` z `playbackStats` = zvuk se zadrhl |
| Tiky v maskách ticha | všechny | tik mimo masku = hudba mohla hrát přes střed QTE |
| Maska před tikem | ≤ 0 dB | kladné číslo = před tikem je hlasitěji než před událostí |
| Podíl perfektů | tvoje skutečné hraní | srovnej s hraním bez hudby (Nastavení → Hudba 0 %): když bez hudby trefuješ víc perfektů, hudba ruší |
| Medián odchylky stisku | blízko 0 | trvale −40 ms nebo +40 ms ukazuje na latenci výstupu (Bluetooth sluchátka) |

## 4. Co poslat zpátky
- Tabulku z analyzátoru (`--out`), prohlížeč a sluchátka/reproduktory.
- Pár vět: co tě po 1, 5, 10 a 15 minutách rušilo nebo bavilo, a jestli bys hudbu nechal zapnutou.
- Soubory nahrávek nikam nenahrávej, stačí čísla. Když bude potřeba poslech, domluvíme se.

## Co záznam neumí
- Zvuk po výstupu do zařízení (Bluetooth zpoždění, ořez reproduktoru) v záznamu není; latenci ukazuje jen log (`outputLatency`).
- iPhone: AudioWorklet i MediaRecorder v Safari nejsou ověřené (NOT ASSESSED).
