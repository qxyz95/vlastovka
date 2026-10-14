# Hudba pro „Just Throw It“: výzkum, analýza a plán

**14. 10. 2026.** Výzkum agenta Plan. Webové zdroje otevřeny 14. 10. 2026. Štítky: **V** = výzkum, **H** = praxe oboru, **N** = naše hypotéza. „(z paměti, neověřeno)“ = zdroj v této relaci neotevřený. Hra dnes nemá zvuk.

## 0. Shrnutí
- Nejdřív procedurální demo šesti směrů v `prototype-music.html`, napojené na skutečný let (`src/core.js`, `events.js`). Porovnání naslepo podle kritérií v §6. Až potom rozhodnout o zdroji finální hudby (vlastní kód, knihovna, AI, skladatel).
- Psychologie:
  - hlavní riziko je únava z opakování (~100 letů za hodinu, jednu čtvrť hráč poslouchá 12–17 min),
  - hudba s vysokým vzrušením zhoršuje výkon v náročném úkolu (V),
  - hráči často raději poslouchají vlastní hudbu (V, slabé),
  - kasinové zvuky zkreslují vnímání výhry (V), proto platí P13.
- Hudba nezačíná znovu s každým hodem. Hraje plynule přes celou smyčku workshop → aim → flight → result a mění jen vrstvy.
- Skladbu určuje čtvrť, kde hráč právě postupuje (nejvzdálenější dosažená), ne poloha vlaštovky. Pozdní lety přeletí 4 čtvrti za ~30 s, takže sledování polohy by střídalo hudbu každých ~7 s.

## 1. Psychologie hudby ve hrách
### 1.1 Doložené (V)
| Zjištění | Zdroj | Co z toho plyne |
|---|---|---|
| Tempo mění hlavně vzrušení, tónina hlavně náladu | Husain, Thompson & Schellenberg 2002 (z paměti) | tempo a hustotu vrstev použít jako regulátor vzrušení, náladu čtvrti nést tóninou a barvou |
| Rychlá hlasitá hudba zhoršila výkon v závodní hře | North & Hargreaves 1999 (z paměti) | při varování a v okně QTE hudbu zeštíhlit, nikdy nepřidávat |
| Hudba s vysokým vzrušením, kterou vybral experimentátor: nejhorší výkon; hudba, kterou si vybral hráč, nejlepší (n = 125) | Cassidy & MacDonald 2009 | hudba a efekty zvlášť nastavitelné, hodně lidí poslouchá vlastní playlist |
| Bez zvuku nejhorší výkon, s nesouvisející hudbou nejlepší (n = 20) | Tan, Baxa & Spackman 2010 (KB 05) | zvuk má smysl, hudba není posvátná |
| Hudba zvyšuje požitek přes pozitivní emoce | Klimmt et al. 2019 (KB 05) | lehká nálada je bezpečnější než temná |
| Interakce zvuku a hudby u napětí a flow | Nacke, Grimshaw & Lindley 2010 (KB 05) | hudba a efekty musí ladit |
| Hudba mění vnímání času jen v jedné ze dvou metod, imerzi může zvýšit i snížit | Sanders & Cairns 2010 ([PDF](https://www-users.york.ac.uk/~pc530/pubs/Sanders_HCI2010.pdf)) | nespoléhat, že hudba zkrátí let; špatná volba imerzi kazí, proto testovat na letu |
| Obliba hudby s opakováním nejdřív roste, pak klesá (obrácené U), u jednoduché dřív | Szpunar et al. 2004 (z paměti), Berlyne (H) | dlouhé smyčky, variace, procedurální obměna |
| Zvuky automatu zvyšují vzrušení a přeceňování výher | Dixon et al. 2014 (z paměti) | žádné výherní znělky u mincí ani hudba, která po dopadu láká k dalšímu hodu (P13) |
| Zvuk se časuje přesněji než záblesk | Booth & Elliott 2015 (KB 06) | tik na středu QTE dává smysl, na přesném čase hry, ne na takt |
| Zvuk je vnímán jako současný se stiskem do 20–70 ms | Kaaresoja 2014 (KB 05) | zvuk stisku okamžitě; Bluetooth 150–300 ms, proto kalibrace a zvuk nikdy jako jediná informace |
| Šťavnaté zvuky unavují, pomáhají variace a ticho | Hicks et al. 2024 (KB 05) | hudba musí nechat místo pro perfekt a znělky |

### 1.2 Praxe oboru (H)
- Collins, *Game Sound* (2008): interaktivní vs. adaptivní zvuk, problém opakování smyček (z paměti).
- Sweet (2014), Phillips (2014): vertikální vrstvení (stems) a horizontální přeskládání na hranici taktu se stingery, smyčky 1–3 min s variacemi (z paměti).
- Huron, *Sweet Anticipation* (2006): napětí a uvolnění z očekávání; hranice čtvrti je přirozené místo pro uvolnění (teorie).
- GDC: Bastion, Hi-Fi Rush, Journey (z paměti): kvantovat změny vrstev na takt, efekty ladit do tóniny.
- Výzkum „hudba → flow“ je slabý, hudbu jako nástroj flow neprodávat.

### 1.3 Co z toho plyne pro naši hru (N)
1. 60–70 % letu hráč nic nemačká. V klidu je hudba hlavní společník, při varování a v okně QTE ustoupí (filtr, bez bicích).
2. Na čtvrť je potřeba 2–3 min nerepetitivního materiálu nebo generativní obměna. Žádné intro při každém hodu.
3. Střední vzrušení, 90–115 BPM, vrcholy jen krátce (kombo, hranice čtvrti).
4. Oslava jen za výkon (P1, P13). Výsledek a Dílna jsou hudebně klidné.
5. Hudební oblouk „za sluncem“:
   - soumrak: teplé a intimní,
   - doky: prostor a moll,
   - druhý západ: otevření,
   - neonová noc: plný groove,
   - úsvit ve finále: rozuzlení.
6. Hudba a efekty zvlášť, hra plně hratelná bez zvuku (P11).

## 2. Podobné hry
| Hra | Převzít | Nepřevzít |
|---|---|---|
| Learn to Fly | – (ukázka, proč hráči hudbu ztlumí) | krátkou smyčku bez variace |
| Burrito Bison | stoupající tón komba, humor zvuků dopadu | trvale vysoké vzrušení |
| Alto's Odyssey | nálada podle denní doby, dlouhé plochy, zen režim | pasivitu pro arkádu |
| Tiny Wings | zvuk spojený s fyzikou | jednu smyčku na celou hru |
| Jetpack Joyride | čitelné stingery u power-upů | stálé vysoké tempo |
| Celeste | leitmotiv na čtvrť, vrstvy podle postupu, přístupnost | dlouhé kompozice závislé na řízeném postupu |
| Spider-Verse (film) | identita komiksového stylu, scratch nebo „rewind“ jako stinger | hustotu, která přehluší QTE |
| Sayonara Wild Hearts | nejbližší tematická reference (let nad neonovým městem) | závislost na zpívaném popu |
| Jet Set Radio | reference ke směru C | samplované skladby (licence) |
| Tetris Effect / Rez | efekty v tónině, ozdoby kvantované na takt (vstup ne) | – |

(Popisy hudby her z paměti, neověřeno.)

## 3. Technické řešení ve webu bez závislostí
### 3.1 Architektura
**Nové soubory:**
- `src/audio-mix.js` (čistý, testovatelný v `node --test`):
  - `mixTargets(state)`: cílové hlasitosti busů a vrstev a filtr podle stavu (workshop/aim/flight/result), fáze události, komba, rychlosti a výšky,
  - `trackFor` (volba skladby),
  - `nextBoundary` (kvantizace na dobu nebo takt),
  - `duck` (ducking),
  - `scaleNote` (ladění efektů do tóniny),
  - deterministický generátor vzorů.
- `src/audio.js` (prezentace): `AudioContext`, busy master/music/sfx, odemčení, načítání, plánovač, nastavení v `localStorage['just-throw-it-audio']`.
- `src/music/<směr>.js` (data směru) a `src/sfx.js` (procedurální efekty).

**Napojení v `ui.js`:**
- `show()` mění stav mixu,
- `release()` → throw,
- `juiceEvents()` → success/perfect/miss/boost/land,
- `updateFlightUI()` → milníky a hranice čtvrti,
- začátek varování → naplánovat tik,
- `visibilitychange` → suspend/resume.

Funkce `feedback(type, info)` v `ui.js` volá `fxEvent` i `sfx`, takže se vizuál a zvuk nerozejdou.

### 3.2 Klíčové body
- **Odemčení:** `AudioContext` vznikne „suspended“, `resume()` při prvním `pointerdown`/`keydown`. Na iOS je potřeba `navigator.audioSession.type='playback'` (ověřit na zařízení).
- **Smyčky bez mezer:** `AudioBufferSourceNode` s `loopStart`/`loopEnd` v samplech z manifestu, ne `<audio loop>`.
- **Vrstvy:** společný `start(when)`, stejná délka v celých taktech, mění se jen gain (rampy kvantované na dobu nebo takt).
- **Přechod čtvrtí:** na hranici taktu, stinger překryje šev.
- **Ducking:** −4 až −6 dB na 150–300 ms pod perfektem a znělkou. Při varování a v okně QTE ztenčení: lowpass na pad, bicí pryč, basový puls zůstane.
- **Synchronizace:**
  - plánovač s předstihem („A Tale of Two Clocks“),
  - **tik QTE se nekvantuje**, plánuje se na skutečný čas středu okna podle `windows(f)`, při hitstopu se přeplánuje,
  - kompenzace latence (`outputLatency`) a ruční kalibrace,
  - kvantují se jen ozdoby.
- **Zrychlení klouzání 1,4× a hitstop** hudbu nemění (`playbackRate` by měnil výšku tónu). Zrychlení jde naznačit filtrem.
- **Formáty:**
  - Ogg Opus (96–128 kb/s mix, 48–64 kb/s mono vrstvy).
  - Safari podporuje Ogg plně od 18.4 ([caniuse](https://caniuse.com/opus)), `decodeAudioData` ověřit zvlášť.
  - Záloha AAC `.m4a` přes `canPlayType`.
  - Electron a NW.js Opus umí, Tauri na macOS má codecy Safari.
- **Paměť:**
  - Stažení Opus ≈ 0,7 MB/min.
  - Dekódované PCM ~384 kB/s (stereo 48 kHz float). 4 vrstvy × 60 s ≈ 92 MB RAM, mono polovina.
  - Dekódovat jen aktuální a příští čtvrť. Procedurální hudba tenhle problém nemá.
- **Preload:** aktuální čtvrť po prvním gestu, další líně. Hra na hudbu nečeká.
- **Nastavení:**
  - Master, Music a SFX, tlačítko reproduktoru v HUD, klávesa M,
  - výchozí hudba ~60 %, efekty ~80 % (doladit),
  - suspend při skryté záložce.
- **Server:** `server.mjs` nezná MIME pro `.ogg/.opus/.webm/.m4a/.wav` (drobnost).
- **Přístupnost:** každý zvuk musí mít vizuální ekvivalent (pravidlo pro testy a review). Volitelně „Calm audio“.
- **Steam:** Electron s `autoplay-policy=no-user-gesture-required`, balík ~150 MB+. Steam Overlay s Electronem dělá známé potíže.
- **Testy:**
  - `tests/audio-mix.test.js`: stavy mixu, ztenčení při varování, kombo jen při úspěchu, kvantizace, stabilita volby skladby, tóny ve stupnici, délky smyček, determinismus, falešný `ctx` pro plánování tiku.
  - `tests/audio-licenses.test.js`: každý soubor v `assets/audio/` má licenci v `credits.json`. Selže na NC, ND, SA a GPL.

### 3.3 Volba skladby
- **Doporučená varianta:**
  - skladbu určuje čtvrť nejvzdálenějšího doletu (frontier),
  - první překročení hranice za letu dá stinger a přechod do nové skladby,
  - pozdější průlety hranic jen 2s znělku a změnu barvy.
- **Alternativa:** hudba sleduje vlaštovku s výdrží aspoň 8 taktů.
- **Finále:** vlastní cue s rozuzlením, pak ticho, pak tichá smyčka „The Workshop is yours.“

### 3.4 Vrstvy podle intenzity
| Vrstva | Kdy |
|---|---|
| L0 Bed (pad) | vždy |
| L1 Pulse (bas, jemné perkuse) | aim, flight |
| L2 Groove (bicí) | let po prvním úspěchu nebo při vysoké rychlosti, při varování a v okně ztlumená |
| L3 Lead / arpeggio | kombo ≥ 2, od komba 3 o oktávu výš nebo druhý hlas |
| Stingery | perfekt, hranice čtvrti, dopad, finále |

## 4. Zdroje hudby a licence
| Možnost | Cena | Licence a Steam | Kvalita | Adaptivita | Riziko |
|---|---|---|---|---|---|
| a) Procedurální ve Web Audio | 0, čas vývoje | plná práva | synth žánry dobré, akustika slabá | maximální | „levný“ zvuk, CPU na slabém mobilu |
| b1) CC0 (Kenney, OGA, freesound) | 0 | bez podmínek | kolísá | nízká | malý výběr |
| b2) CC-BY (Incompetech) | 0 / placená licence | atribuce; licence hry výslovně nezmiňuje, ověřit ([incompetech](https://incompetech.com/music/royalty-free/licenses/)) | dobrá, velmi známá | nízká | generické |
| b3) Pixabay Music | 0 | komerční užití bez atribuce, zakázaná samostatná distribuce ([license](https://pixabay.com/service/license-summary/)) | střední až dobrá | nízká | Content ID nároky u streamerů (neověřeno) |
| b4) Packy z itch.io | ~$5–30 | podle packu, vyhnout se NC a SA | dobrá | někdy varianty | číst každou licenci |
| c1) Suno (placený tarif) | předplatné | práva k výstupu převedena bez záruky autorské ochrany ([terms](https://suno.com/terms), revize 10. 8. 2026), free tarif nekomerčně. Steam vyžaduje zveřejnění AI obsahu (revize 16. 1. 2026). | dobrá, slabší kontrola | nízká | nemusí být chráněné autorským právem, reputace, štítek AI |
| c2) Udio | – | po vyrovnání s UMG stažení vypnutá | – | – | pro hru nepoužitelné |
| d) Skladatel | ~$100–1 000/min, pro nás ~12–16 min ≈ $2 000–15 000 | smlouva: trvalá licence nebo výkup, Steam, web, OST, trailery, bez Content ID | nejvyšší, vlastní identita | vysoká se stems | cena, termíny |
| e) Claude v kódu | 0 | jako a) | jako a), hudba jako editovatelná data | maximální | omezená „lidská“ muzikalita, ladit poslechem |

**Zadání pro skladatele:**
- na každou čtvrť smyčka 60–120 s ve 3–4 vrstvách stejné délky a BPM,
- intro a outro, stinger hranice, znělka čtvrti, cue finále, varianta pro Dílnu,
- mapa tónin a BPM, WAV 48 kHz / 24 bit, loop body v samplech.

**Bez závislostí:** vlastní mini sekvencer (~400–700 řádků) pokryje oscilátory, ADSR, filtry, šumové bicí, FM zvonky a dozvuk z generované impulzní odezvy. Tone.js (MIT) by šel vendorovat, ale lepší je vlastní kód. Vypečení do WAV přes `OfflineAudioContext`, Opus by vyžadoval ffmpeg jako krok tvorby assetů (k rozhodnutí).

## 5. Šest hudebních směrů k výběru
### A. „Neon Glide“: synthwave / chillwave
- **Tempo:** 100–110 BPM.
- **Nástroje:** analogové pady, osminový bas, arpeggio, gated-reverb bicí, zvonkový lead.
- **Nálada:** nostalgická teplá noc.
- **Čtvrti:**
  - Suburbs: D lydická, bez bicích,
  - Docks: D moll a dozvuk,
  - Horizon: mixolydická, široké akordy,
  - Core: plné bicí a arpeggio.
- **Intenzita:** rychlost otevírá filtr, kombo přidá arpeggio, perfekt ozvěnu.
- **Reference stylu:** The Midnight, FM-84, Timecop1983, Sayonara Wild Hearts.
- **Rizika:** klišé, monotónnost bez obměny harmonie.
- **Zdroj:** procedurálně (velmi realistické).

### B. „Paper Lo-fi“: lo-fi hip hop / chillhop
- **Tempo:** 80–90 BPM, swing.
- **Nástroje:** Rhodes, praskání vinylu, tlumený boom-bap, jazzové akordy, kontrabas, déšť.
- **Nálada:** útulná, pozorovací.
- **Čtvrti:** Suburbs Rhodes, Docks déšť a saxofon, Horizon kytara, Core tvrdší beat.
- **Reference stylu:** Nujabes, Jinsang, Lofi Girl.
- **Plus:** nejnižší únava.
- **Rizika:** málo energie, přeplněný žánr.
- **Zdroj:** knihovna nebo skladatel, procedurálně jen střední kvalita.

### C. „Spider-Verse Drop“: funky breakbeat / hip hop s komiksovými efekty
- **Tempo:** 90–100 BPM, vrcholy double-time.
- **Nástroje:** breakbeat, 808, žesťové stabs, scratch, glitch, basová kytara, sbor.
- **Nálada:** drzá, komiksová.
- **Čtvrti:** Suburbs funk, Docks dub, Horizon filmové žestě, Core plný breakbeat s glitchem.
- **Intenzita:** kombo přidá žestě, perfekt scratch „rewind“, hranice komiksový stinger.
- **Reference stylu:** Daniel Pemberton, Hideki Naganuma, Jetpack Joyride.
- **Plus:** sedí ke komiksovému 3D městu.
- **Rizika:** vysoké vzrušení ruší výkon a nejrychleji unavuje.
- **Zdroj:** skladatel, procedurálně slabě.

### D. „Chip Courier“: chiptune / bitpop
- **Tempo:** 120–140 BPM.
- **Nástroje:** pulsní a trojúhelníkové vlny, šum, arpeggiované akordy.
- **Nálada:** hravá, retro.
- **Reference stylu:** Anamanaguchi, Jake Kaufman, Disasterpeace.
- **Plus:** sedí k pixelovému stylu cyber, nulová velikost.
- **Rizika:** ostrost a únava, nehodí se k 3D komiksu.
- **Zdroj:** procedurálně (velmi realistické).

### E. „Above the City“: generativní ambient s adaptivními vrstvami
- **Tempo:** volné, ~70 BPM.
- **Nástroje:** piano, pady, zvonky, sbor, vítr a město jako šum.
- **Nálada:** klidná, prostorná, úžas.
- **Intenzita:** rychlost zvyšuje hustotu not, kombo přidá pulz.
- **Reference stylu:** Alto's Odyssey, Journey, Brian Eno.
- **Plus:** nejmenší únava, nikdy se neopakuje, nejlépe nechá místo pro tik.
- **Rizika:** málo arkády, může působit nevýrazně.
- **Zdroj:** procedurálně (realistické).

### F. „City Mixtape“: každá čtvrť jiný žánr, rádio města
- **Tempo:** 85–115 BPM podle čtvrti.
- **Žánry:** Suburbs lo-fi, Docks ambientní dub, Horizon filmový „letní“ pop, Core synthwave nebo breakbeat. Spojuje je leitmotiv (4–6 not) a stejná tónika.
- **Reference stylu:** rádia v GTA a Jet Set Radio, Broadcast Tower a On Air, Zippy.
- **Plus:** únavu řeší změnou žánru po ~15 min a hudebně vypráví postup.
- **Rizika:** nesoudržnost, nejvíc práce.
- **Zdroj:** kombinace (A a E procedurálně, zbytek knihovna nebo skladatel).

Vyřazeno: samostatný orchestrální letní pop (zůstal jen jako Horizon ve směru F).

## 6. Jak vybrat
- **`prototype-music.html` + `prototype/music/*.js`** (první verze budoucích `audio-mix.js` a `audio.js`):
  - volba směru A–F a čtvrti, posuvník intenzity, tlačítka událostí,
  - **Auto flight**: přehraje skutečný let ze `core.js`, vykreslený přes `render.js`, QTE mezerníkem,
  - **slepý režim** X1–X6 s hodnocením 1–5 a exportem,
  - **únavový test**: 10 min letů v jedné čtvrti, hodnocení v 1., 5. a 10. min,
  - načtení vlastních souborů (drag & drop) pro kandidáty z knihoven nebo AI,
  - volitelně `?music=A` v 3D prototypu.
- **Kritéria:**
  1. ladí s obloukem nálady,
  2. únava v 10. minutě,
  3. ruší QTE? (podíl perfektů s hudbou a bez ní na stejných seedech),
  4. rozlišení čtvrtí,
  5. je slyšet kombo a klid,
  6. „nechal bys ji zapnutou?“,
  7. cena a licence,
  8. CPU a velikost.

## 7. Zvukové efekty a znělky (navazuje na `08` §8.6)
- Společná tónika D pro všechny čtvrti, mění se jen mód. Efekty berou tóny z pentatoniky D.
- **Tik QTE:** dřevěný klik na 5. stupni, na přesném čase středu okna, kalibrovaný, samostatný přepínač.
- **Pára:** každý obláček ve skutečném čase, tón stoupá stupnicí.
- **Echo:** ozvěna tónu perfektu, zpoždění tečkovaná osmina podle BPM.
- **Kombo:** stoupající stupně 1-2-3-5-6-8, při minutí jen tichý tlumený tón (žádný smutný trombon).
- **Perfekt:** oktáva a třpyt a ducking −4 dB. Úspěch je kratší.
- **Nabíjení hodu:** tón sleduje ukazatel síly.
- **Znělka čtvrti:** 2–4 s, leitmotiv, který tvoří i základ její hudby.
- **Mince:** střídmé tiky, žádná fanfára (P12, P13).
- **Vítr a dopad:** vítr filtrovaný šum, dopad krátký „flop“ podle povrchu.
- Každý efekt má vizuální ekvivalent.

## 8. Plán po fázích (pracovní dny Clauda)
| Fáze | Obsah | Odhad |
|---|---|---|
| F0 | Rozhodnutí k otázkám níže | – |
| F1 | Jádro `audio-mix.js` a testy, `audio.js`, nastavení, MIME, `credits.json` a licenční test | 1–1,5 |
| F2 | Procedurální efekty přes `feedback()`, tik s kalibrací | 1 |
| F3 | `prototype-music.html`: 6 dem (A, D, E kvalitně, B, C, F jako skici), Auto flight, slepé hodnocení, únavový test, vlastní soubory | 2–3 |
| F4 | Výběr uživatele a dotažení zdroje (procedurálně 2–4 dny / knihovna 1–3 dny / skladatel 3–8 týdnů) | viz text |
| F5 | Integrace: volba skladby, vrstvy, přechody, finále, calm audio | 1–2 |
| F6 | Playtest zvuk zap./vyp., únava, podíl perfektů | 0,5 + hráči |
| F7 | Později Electron, autoplay, codecy, případně OST | 1–2 |

## Otázky k rozhodnutí
1. Rozpočet: 0 / do ~$100 (packy) / $2–15 tis. (skladatel)?
2. Je AI hudba přijatelná, včetně štítku AI na Steamu a nejisté autorské ochrany?
3. Skladba podle postupu (doporučeno), nebo podle polohy vlaštovky?
4. Zarovnat QTE na takt hudby? Doporučeno ne, kvantovat jen ozdoby.
5. Je vypečení procedurální hudby do Opus přes ffmpeg přijatelné jako krok tvorby assetů?
6. Hudba ve výchozím stavu zapnutá (na webu po prvním klepnutí) a s jakou hlasitostí?
7. Ke kterému vizuálnímu stylu hudbu ladit (pixel cyber, 2D komiks, 3D)?
8. Soundtrack jako DLC na Steamu (ovlivní smlouvu se skladatelem)?
