# Hudební zadání pro Papírové město

**15. 10. 2026, audio-designer.** Krok 2 hudebního zadání, první část: sekce A–D. Sekce E (mapa intenzity) čeká na časové osy letů v `research/hudba/02-casova-osa.md`.

**Zadání uživatele:** hudba „hlouběji, ne šířeji“, tedy jeden směr dotažený do hloubky, žádné nové žánry ani obsah navíc.

**Závazné podklady:**
- `research/bonusy/06-rozhodnuti.md` ř. 52:
  - rozpočet 0, hudba z kódu nebo CC0,
  - skladba podle nejvzdálenější čtvrti,
  - QTE se nezarovnává na takt, kvantují se jen ozdoby,
  - hudba 60 %, efekty 80 %.
- Stylová bible `research/design/05-styl-papir.md`:
  - pilíře P1–P4 (kap. 1),
  - denní doby čtvrtí (kap. 2.3),
  - názvy čtvrtí (kap. 12),
  - seznam toho, co se ruší (kap. 15).

**Podklad (ne zadání):** `research/hudba/01-vyzkum-a-plan.md`. Vznikl 14. 10. pro neonový styl, `docs/zdroje.md` ho vede jako podklad.

**Co existuje v kódu:**
- `src/music/*.js`: směry A–F, `synth.js` s 35 hlasy, `compose.js`,
- `src/audio-mix.js`, `src/audio.js`, `src/sfx.js`.
- Hra zatím zvuk nenačítá (`docs/stav.md`).

**Štítky:**
- **V** výzkum ověřený v této relaci (s odkazem),
- **H** praxe oboru,
- **N** náš návrh nebo hypotéza,
- „z paměti, neověřeno“ = zdroj jsem v relaci neotevřel.

**Čtvrti a místa podle kódu.** Id v `src/scenes.js` `DISTRICTS`, názvy v `src/locales/*.js`, místa v `ROUTE`.

| # | id v kódu | EN / CS | Denní doba (bible kap. 2.3) | Místa |
|---|---|---|---|---|
| 1 | `violet` | SUNRISE ROOFS / STŘECHY ZA ÚSVITU | ráno | roofs, market, garden, rail |
| 2 | `moon` | BRIGHT HARBOR / SLUNNÝ PŘÍSTAV | poledne u moře | warehouse, cranes, bridge, lighthouse |
| 3 | `sunset` | GOLDEN FIELDS / ZLATÁ POLE | zlaté odpoledne | fields, turbines, peaks, observatory |
| 4 | `core` | LANTERN CITY / MĚSTO LAMPIONŮ | večer s lampiony (jediná tmavá čtvrť) | gate, terraces, tower, port |
| finále | (`ARC[4]`) | „Delivered.“ | úsvit za cílem | |

Id v kódu (`violet`, `moon`, `sunset`, `core`) jsou historická a nesou starou neonovou náladu. Mění se jen texty, takže v hudbě se id nechají a mění se data.

---

## A. Audit šesti směrů v `src/music/` proti stylové bibli

**Měřítko:**
- P2 „Všechno je papír“: zvuk má být hmatový a akustický, ne syntetický neon.
- P3 „Světlo vypráví cestu za sluncem“ jedním dnem: ráno → poledne → odpoledne → večer → úsvit.
- P4 „Klid a jedna věc na obrazovku“.
- Seznam „ruší se“ v kap. 15: neon, noční čtvrti 1–2, „druhý západ“, tištěný komiks.

### A.1 Společný problém všech šesti: oblouk nálady je ještě neonový
`audio-mix.js ARC` a data čtvrtí ve všech směrech nesou starý oblouk:

| Čtvrť | Starý oblouk (`ARC`) | Bible teď |
|---|---|---|
| 1 | Violet Suburbs „dusk, warm and intimate“ | ráno |
| 2 | Moon Docks „space and minor“ (aeolská) | **slunné** poledne u moře |
| 3 | Red Horizon „second sunset“ | zlaté odpoledne (druhý západ bible ruší) |
| 4 | Neon Core „neon night, full groove“ | večer s lampiony z hedvábného papíru |

Dvě věci z toho jsou přímo proti bibli:
1. **Moll v přístavu.** Aeolská tónina v BRIGHT HARBOR nese „měsíční doky“ a v pravidle pro směr B k tomu přistupuje i déšť.
2. **Pět různých motivů v `ARC` není leitmotiv,** jsou to tři různé melodie a dvě jejich obměny. Hráč nemá co poznat (podrobně kap. C).

Plán 01 si přitom leitmotiv přál (§7 „Znělka čtvrti … leitmotiv, který tvoří i základ její hudby“). Test `tests/audio-mix.test.js` hlídá jen délku motivu (4–6 not) a rytmus na jeden takt (8 osmin).

### A.2 Směr po směru

| Směr | Co dnes je (kód) | Proti bibli | Co z něj zůstane | Verdikt |
|---|---|---|---|---|
| **A Neon Glide** (synthwave) | 94–108 BPM, pady z rozladěných pil (`pad` s `sawtooth` ±9 centů), osminový bas z pily s rezonančním filtrem (`bass`), gated-reverb virbl (`snare` s `gate`), clap, crash, tomy, pilový lead s vibratem, arpeggio z `pluck` (pila + čtverec) | Neon už v názvu. Barva je čistě syntetická: pila a čtverec jsou zvuk „světelné reklamy“, ne papíru (P2). Gated reverb je podpis 80. let a noci. Bicí s crashem a kotlem jsou hutné (P4). | Kostra frází (`phrase`, `progAt`, forma A-B-A-C-B-D) je obecná, je v `compose.js` a zůstane | **vypadá** |
| **B Paper Lo-fi** (lo-fi hip hop) | 78–90 BPM, swing 0,62, Rhodes (`epiano`), kontrabas (`upright`), boom-bap, praskání vinylu (`vinyl`), v přístavu déšť (`rain`) a saxofon (`sax`) | „Paper“ je jen v názvu. Lo-fi je žánr noci, studovny a města za oknem. Vinyl je šum desky, ne papíru. Déšť v „Slunném přístavu“ je přímý rozpor s kap. 2.3. Kvalita jen skica. | Kontrabas `upright` (akustický, teplý), myšlenka swingu (`swing()` v `compose.js`), oddechové tempo | **vypadá jako směr,** dva prvky převzít |
| **C Spider-Verse Drop** (breakbeat) | 84–96 BPM, varhanní stabs, slap bas, breakbeat, žestě (`brass`), scratch (`scratch`), glitch | Je postavený na „tištěném komiksu“ (S2 z bible 02), který bible 05 kap. 15 výslovně ruší. Má vysoké vzrušení, a to ruší výkon v QTE (01 §1.1, North & Hargreaves, z paměti). Proti P4. | nic | **vypadá** |
| **D Chip Courier** (chiptune) | 108–126 BPM, pulsní vlny, trojúhelník, periodický šum, akordové arpeggio jedním oscilátorem | Patřil k pixelovému cyber stylu (01 §5 D: „sedí k pixelovému stylu cyber“). Syntetický a nejrychlejší, proti P2 i P4. | nic | **vypadá** |
| **E Above the City** (generativní ambient) | 60–76 BPM. Pady (pila), piano na nesouměřitelných cyklech (6,5 / 9 / 10,75 / 13,5 doby, Eno), FM zvonky, sbor (`choir`), vítr a město jako šum (`air`), měkký puls (`felt`), shaker. Rychlost zvyšuje hustotu not. | **Architekturou sedí nejlépe:** nic se neopakuje, klid (P4), vítr = papírové nebe, hustota podle letu. Barvou ale napůl syntetický: pilové pady, formantový sbor z pil, v „Neon Core“ pulzující pluck z pily. Čtvrti nesou starý oblouk (aeolský přístav se sborem). Tempo 60–70 je na arkádu pomalé (01 §6 riziko „málo arkády“). | Generativní jádro (cykly `LOOPS`, akordový řetěz `chordAt`, hustota podle rychlosti), `air`, `felt`, piano a zvonky jako základ nových nástrojů | **základ pro doporučený směr** (kap. D) |
| **F City Mixtape** (žánr na čtvrť) | Lo-fi (B), dub z E, letní pop, synthwave (A) | Přímo proti zadání „hlouběji, ne šířeji“: čtyři žánry místo jednoho. Dvě ze čtyř částí jsou neonové (A) nebo noční (B). | myšlenka „spojuje je leitmotiv a stejná tónika D“ | **vypadá** |

### A.3 Shrnutí auditu
- **Ke Papírovému městu sedí:**
  - generativní architektura E (žádná smyčka, Eno cykly, hustota podle rychlosti),
  - vítr `air`,
  - měkký „tep“ `felt`,
  - kontrabas `upright`,
  - FM zvonek jako základ hracího strojku,
  - společná tónika D (efekty jsou v ní naladěné),
  - mixový systém vrstev L0–L3 v `audio-mix.js` (je na stylu nezávislý).
- **Neonové nebo komiksové a vypadá:**
  - celé směry A, C, D a F,
  - z B lo-fi rámec (vinyl, déšť, saxofon, boom-bap),
  - ze syntezátoru pilové pady, pilový lead, gated virbl, clap, crash, chip hlasy, scratch, žestě,
  - starý oblouk nálady v `ARC`.

---

## B. Zvuková identita „papírová“

### B.1 Obraz, ze kterého zvuk vychází
Bible: „Město je diorama z barevného kartonu, které by si dítě z Dílny postavilo na stole“ (P2). Hraje se ráno (P3).

**Hudba je tedy malá kapela, která hraje u stolu v podkroví** (N):
- hrací strojek, plstěné piano, drnkačka, flétna,
- prsty a tužka bubnují do krabice od bot,
- okno je otevřené a jde jím vítr.

Blízko, suše, hmatově. Žádný velký sál, žádná elektronika v popředí.

**Čtyři pravidla identity (N):**
1. **Jedna kapela, jedna rodina barev.** Čtvrti se neliší žánrem, liší se tím, který nástroj kapely vede, módem a tempem. Hloubka místo šíře.
2. **Papír je rytmus, ne melodie.** Perkuse jsou papírové zvuky (krabice, list, štětka po papíře, tužka). Melodii nesou laděné akustické nástroje. Inspirace V: Tearaway, kde zvuky papíru vznikaly ze skutečného papíru („it was always easier to have a supply of paper to hand and knock something out there and then“) a pohyb papíru měl jednu dynamickou událost podle šířky, rychlosti a postupu pohybu ([Designing Sound 2013](https://designingsound.org/2013/12/12/the-sound-of-tearaway/)). Podle výpisu hledání měl Tearaway i zásadu „nemít hudbu všude“ ([MCV](https://mcvuk.com/?p=77872), stránka neotevřena).
3. **Malý pokoj, ne katedrála.** Dozvuk je krátký (1–1,8 s, dnes `impulse(ctx, 3.4, 3)` na hudbě). Prostor se otevírá jen tam, kde se otevírá krajina (přístav, finále).
4. **Nikdy se neopakuje přesně.** Generativní jádro z E zůstává. V: Alto's Odyssey má hudbu s náhodnými sekcemi, která je „slightly different each time you play“ ([Tools and Toys](https://toolsandtoys.net/altos-odyssey-official-game-soundtrack/)). Nástroje Alto jsem neověřil.

### B.2 Paleta nástrojů a co už umí `synth.js`
Všechno jde syntézou ve Web Audio, bez souborů a bez závislostí.

| Role v kapele | Nástroj (N) | Dnes v `synth.js` | Co chybí / úprava | Náročnost |
|---|---|---|---|---|
| **Lead ráno, jiskry večer** | hrací strojek (ocelový jazýček) | `bell` / `glock` (FM, ratio 3–3,5) | Nový hlas `musicbox`: sinus + 2 neharmonické partialy (~3× a ~5,4×), útlum 0,6–1,2 s, krátké cvaknutí šumu na náběhu (zub válečku). Odvodit z `bell` volbami. | malá |
| **Harmonie, lead večer** | plstěné piano (felt piano) | `piano` (FM index 2,5 + trojúhelník, jasné) | Volby `felt`: lowpass ~1,2 kHz, index 1,2, pomalejší náběh 6–8 ms, tlumený „thump“ kladívka (sinus 90 Hz, 30 ms) | malá |
| **Ostinato, arpeggia (vlny, větrníky)** | drnkačka: nylonová kytara / harfa | `pluck` = pila + čtverec přes filtr (syntetický, vypadá) | **Nový hlas `ks` (Karplus–Strong).** Pozor: ve Web Audio má `DelayNode` ve zpětnovazební smyčce nejméně 128 vzorků, takže KS přes `DelayNode` hraje jen pod ~375 Hz při 48 kHz (V: [W3C public-audio](https://lists.w3.org/Archives/Public/public-audio/2012AprJun/0346.html), [WPT test](https://searchfox.org/firefox-main/source/testing/web-platform/tests/webaudio/the-audio-api/processing-model/delay-time-clamping.html), z výpisu hledání). Proto **předpočítat** tón KS v JS do `AudioBuffer` (1,5 s mono, deterministicky, cache podle MIDI noty, ~25 not ≈ 7 MB float32 při 48 kHz; při nouzi 1 s a 24 kHz) a přehrávat přes `AudioBufferSourceNode`. AudioWorklet je alternativa, je ale složitější. | střední |
| **Lead poledne a odpoledne** | flétna / okarína (dech) | nic. `lead` je pila, `sax` pila přes pásmovou propust | Nový hlas `flute`: sinus + 15 % trojúhelníku, dechový šum (pásmová propust na 2× f, Q 4, 3 %) s náběhem 60 ms, zpožděné vibrato 5 Hz / 8 centů (`vibrato()` existuje) | malá |
| **Bas** | kontrabas pizzicato | `upright` (ponechat), `sub` (ponechat jen jako kořen pod padem) | – | 0 |
| **Plocha (L0)** | „šeptaný papír“: šum rezonující na tónech akordu | `pad` = 2 rozladěné pily (vypadá) | Nový hlas `paperpad`: šumový buffer (`g.noise`) → 3–4 úzké pásmové propusti (Q 25–40) na tónech akordu → pomalý náběh 1,5 s. Zní jako dech přes papír, tónově, bez syntetické pily. Záloha: `pad` s `wave: 'triangle'` a lowpass 900 Hz. | malá |
| **Plocha večer** | harmonium (jazýčky) | `organ` (aditivní sinusy) | Volby `reed`: lichá harmonická navíc, náběh 80 ms, tremolo 5,5 Hz. Jediný „teplý drone“ kapely, jen v Městě lampionů. | malá |
| **Tep (kick)** | prst do krabice od bot | `felt` (sinus 75 → 48 Hz) | Nový hlas `box`: `felt` + pásmová propust šumu ~350 Hz, 25 ms (lepenka) | malá |
| **Doba 2 a 4 (snare)** | plochá dlaň na list papíru | `snare` (gated, vypadá), `clap` (vypadá) | Nový hlas `page`: šum přes pásmovou propust 1,8 kHz, dvojitý náraz (0 a 9 ms), útlum 40 ms, bez tónové složky | malá |
| **Osminy a šestnáctiny (hi-hat)** | štětka po papíře | `shaker` (pásmová propust 5,5 kHz), `hat` (horní propust 7,5 kHz, vypadá) | `brush` = `shaker` s náběhem 20 ms a pásmem 3–4,5 kHz. Pásmo nad 5 kHz patří větru vlaštovky, viz B.4. | malá |
| **Ozdoba, přechod** | ťuknutí tužky o stůl | `rim` (trojúhelník 1,7 kHz) | `pencil`: kratší (5 ms), vyšší (2,2 kHz), tišší. **Pozor na záměnu s tikem QTE** (`wood` A5): pencil se v okně QTE nehraje. | malá |
| **Fill na konci fráze, hranice čtvrti** | zmačkání papíru | nic | Nový hlas `crumple`: shluk 20–60 krátkých šumových zrn (1–4 ms, pásmové propusti 1–6 kHz) v náhodném seedovaném čase. Princip: zvuk mačkání jsou mnoho drobných cvaknutí, část modelovaná stochasticky (V: Cirio et al., SIGGRAPH Asia 2016, [projekt](https://www.cs.columbia.edu/cg/crumpling), jen abstrakt z výpisu hledání). Na fyzikální model není potřeba. | střední |
| **Vítr** | otevřené okno, nebe | `air` (ponechat) | – | 0 |
| **Dozvuk** | pokoj v podkroví | `impulse(3.4 s)` na hudbě, `impulse(1.8 s)` na efektech | Délka dozvuku podle čtvrti (tab. B.3). Stačí parametr `impulse(sec, decay)` při `applyDistrict` (nový buffer jen při změně čtvrti, ne za letu). | malá |

**Ze `synth.js` se v novém směru nepoužije** (zůstane jen pro staré směry, dokud se nesmažou, viz BLOCKED 1):
- `pad` s pilou, `bass`, `lead`, `pulse`, `chiparp`, `tri`, `cnoise`, `ckick`,
- `kick` (plný bicí), `snare` gate, `clap`, `hat`, `tom`, `crash`,
- `vinyl`, `rain`, `brass`, `scratch`, `sax`, `choir`, `epiano`.

**Výkon (N, ověřit):**
- Všechny nové hlasy jsou šum, sinus nebo předpočítaný buffer, tedy levnější než dnešní dvojice pil s automatizovaným filtrem.
- Jediný paměťový náklad je cache KS (vznikne líně, ~7 MB).
- Zátěž měřit výpadky `playbackStats` v reálném čase ve viditelném okně, ne offline benchmarkem (gotcha z `CLAUDE.md`). Cíl je 0 výpadků za 10 min letu na referenčním notebooku a iPhonu 15 Pro.
- Strop souběžných hlasů ≤ 48 (`a.peak`).

### B.3 Tónina, mód a tempo: den jde dolů o jedno znaménko
Tónika **D** zůstává pro všechny čtvrti. Je v ní naladěný tik QTE (A, 5. stupeň), kombo i znělky v `sfx.js`. Mění se mód, a to tak, že **každá čtvrť ubere jedno zvýšení**. Světlo dne hudebně „klesá“ po stupnici jasu módů a ve finále vyjde slunce znovu (N):

| Čtvrť | Mód na D | Znaménka | Charakteristický tón | BPM | Metrum, pohyb | Vede | Dozvuk |
|---|---|---|---|---|---|---|---|
| 1 Ráno | **lydický** | 3 # (F#, C#, G#) | G# (#4): „zvednutá“ jiskra rána | **84** | 4/4 rovné, řídké | hrací strojek, plstěné piano | 1,2 s, malý pokoj |
| 2 Poledne u moře | **jónský** | 2 # | C# (citlivý tón): jasný, „doma v přístavu“ | **92** | 4/4 se swingem 0,58, houpání | flétna, KS kytara ve vlnách arpeggia | 1,8 s, otevřený prostor |
| 3 Zlaté odpoledne | **mixolydický** | 1 # | C (♭7): teplý, lidový | **96** | cítění 12/8 (swing ~0,66, `swing()`) | KS ostinato (větrníky), flétna dvojhlasně | 0,9 s, venku, víc větru |
| 4 Večer s lampiony | **dórský** | 0 # | F (♭3) + B (velká 6): jediný „teplý moll“ | **100** | 4/4 se synkopami, nejplnější groove (stále měkký) | plstěné piano nízko, hrací strojek v kánonu (lampiony se rozsvěcují jeden po druhém), harmonium | 1,4 s + echo tečkovaná osmina |
| Finále, úsvit | **lydický** (návrat) → závěrečný akord D dur | 3 # | G# zpět: stejné ráno, ale celé | volné ~72, ritardando | rubato | celá kapela postupně (každý nástroj jednu frázi), pak sólo hrací strojek | 2,5 s, nejširší |

**Proč takové tempo:**
- 01 §1.3 doporučoval střední vzrušení 90–115 BPM. Směr E měl 60–76.
- Návrh 84 → 100 BPM drží střední vzrušení a stoupá s postupem hráče: pozdní lety jsou rychlejší a událostí je víc.
- Vrchol vzrušení je ve čtvrti 4, kterou ale bible drží teplou a tichou (P4). Plnost tedy přidává hustota papírových perkusí, ne hlasitost.
- Tempo a výška se při zrychlení klouzání 1,4× a při hitstopu nemění (01 §3.2 platí dál).

**Harmonie (kořeny akordů jako stupně, data pro `progAt` / `chordAt`, N):**

| Čtvrť | Podpis módu | Kořeny |
|---|---|---|
| Ráno | I–II (D–E dur) | `[0,1,0,5,4]` |
| Přístav | I–IV–V–vi | `[0,3,4,5]` |
| Pole | I–♭VII–IV–I (D–C–G–D) | `[0,6,3,0]` |
| Lampiony | i–IV (Dm–G dur) | `[0,3,0,6]` |
| Finále | I–II–IV–I | (bez kořenů v datech) |

**Důsledek pro efekty (chybí v kódu):** `comboNote` stoupá po durové pentatonice D (D E F# A B D). V dórské čtvrti 4 zazní F# proti F v hudbě. Kombo proto musí brát stupně z módu čtvrti, například stupně 1-2-3-5-6-8 zvoleného módu. V dórském dají D E F A B D, jinde stejné tóny jako dnes. Tik na A je ve všech módech v pořádku.

### B.4 Jak hudba nechá prostor efektům
**Kmitočty (N).** Každé pásmo má jednoho vlastníka:

| Pásmo | Vlastník | Co smí hudba |
|---|---|---|
| < 120 Hz | dopad vlaštovky (`flop` 110 → 45 Hz), tep `box` | jen tichý kořen `sub` pod plochou. Při dopadu duck. |
| 120–600 Hz | **hudba** (plocha, bas, piano) | všechno |
| 600 Hz – 1,2 kHz | hudba: **téma v oktávě 4–5** (D4–A5) | Téma dnes hraje `motifBar` v oktávě 5, posunout ho o oktávu níž. Tóny komba a úspěchu (`comboNote` oktáva 5, perfekt +12) pak sedí nad tématem a neslévají se s ním. |
| 1,2–5 kHz | **efekty QTE**: tik `wood` (A5 + partial ~2,4 kHz + cvaknutí 2,6 kHz), třpyt perfektu (`glock` oktáva 6), stinger | Hrací strojek v oktávě 6 jen v klidu. **Ve varování a v okně QTE dolní propust na celé hudbě 1,8 kHz** (dnes filtruje jen plochu `padFilter` 650 Hz a lead stahuje na 35 %). |
| > 5 kHz | vítr a šustění vlaštovky (`sfx.wind`, budoucí šustění papíru) | Štětka `brush` jen 3–4,5 kHz. Žádné hi-haty nad 7 kHz. S rychlostí štětka ustupuje, protože roste vítr. |

**Okamžiky (N, navazuje na `mixTargets`):**
1. **Klidné klouzání** (60–70 % letu, 01 §1.3): hudba je hlavní společník a téma smí zaznít.
2. **Varování a okno QTE:**
   - hudba se ztenčí okamžitě (`urgent` už existuje),
   - lead L3 úplně ztichne (dnes 35 %),
   - perkuse L2 na 12 % zůstávají jako tep.
   - Nic se nepřidává, ani ozdoba.
3. **„Okno ticha“ kolem tiku (nové, N):**
   - Plánovač hudby zná čas tiku dopředu (`createTickPlanner.planned`).
   - Noty L1–L3, které by začaly ±120 ms kolem tiku, se zahodí.
   - Tik tak vždy zazní na čistém místě, i když není na dobu.
   - Je to opak zarovnání QTE na takt: hudba ustoupí QTE, QTE se hudbě nepřizpůsobuje. Rozhodnutí 06 tím zůstává dodržené.
4. **Úspěch / perfekt:**
   - duck −4 dB už existuje (`DUCK`),
   - po perfektu smí přijít jedna kvantovaná ozdoba na další dobu (rozhodnutí 06: kvantují se jen ozdoby), a to ozvěna posledního tónu tématu v hracím strojku.
5. **Minutí:** hudba se nemění. Žádný „smutný“ obrat (01 §7, P13).
6. **Dopad a výsledek:**
   - vrstvy L1–L3 dozní na hranici taktu,
   - zůstane plocha a téma v plstěném pianu, tiše,
   - žádná výherní znělka (P13, 01 §1.1 Dixon et al., z paměti).

**Přístupnost:**
- Každý zvuk má vizuální ekvivalent. Systém `audio.cue()` to už podporuje.
- Hudba nikdy nenese informaci sama.
- `prefers-reduced-motion` se hudby netýká, ale **tichý režim (`calm`) a reduced motion vypnou hluboké dunění dopadu** (`flop` pod 120 Hz). Dunění patří k otřesu obrazovky.
- Hudba a efekty mají samostatné posuvníky, tlačítko ztlumení zůstává.

---

## C. Leitmotiv vlaštovky

### C.1 Téma „Hod“
Jedno téma pro celou hru, zapsané ve stupních módu. Melodie kreslí let papírové vlaštovky:

| Fáze letu | Noty | Hudebně |
|---|---|---|
| výhoz z ruky | 1 → 5 | skok o kvintu nahoru |
| vrchol | 6 | krok výš a výdrž, vlaštovka „visí“ ve vzduchu |
| klouzání | 4 → 3 → 2 | sestup po stupních |
| bez dopadu | konec na 2 | téma zůstává otevřené: „letí dál“ |

Rozřešení na 1 přijde jen ve finále.

- **Stupně (1 = tónika):** 1 – 5 – 6 – 4 – 3 – 2
- **V datech `ARC` (0 = tónika):** `motif: [0, 4, 5, 3, 2, 1]`
- **Rytmus v osminách:** `[1, 1, 3, 1, 1, 1]` = ♪ ♪ ♩. ♪ ♪ ♪ (součet 8 = jeden takt 4/4, splňuje test 4–6 not a 8 osmin)
- **V D jónském (neutrální zápis):** D – A – B – G – F# – E

Inspirace tvarem (V): Lena Raine napsala hlavní melodii Celeste tak, že „if you charted it out on sheet music, you would see an actual diagram of a mountain“, a chtěla ji „reused over and over again“ jako leitmotiv ([Gaming Trend](https://gamingtrend.com/podcasts/gaming-trend-podcast-behind-the-music-of-celeste-lena-raine-interview/)). U nás má melodie tvar letu, ne hory.

**Kde téma zazní (N):**
- v hudbě čtvrti (L3 při kombu ≥ 2, v klidu i v ploše L0 přes plstěné piano),
- ve znělce čtvrti (`sfx.jingle`, dnes hraje motiv `ARC`, takže převezme téma automaticky),
- ve finále celé a rozřešené.

**Volitelné rozšíření S6 (jen návrh):** nabíjení hodu by mohlo stoupat o kvintu D → A, tedy prvním intervalem tématu, místo dnešní oktávy D4 → D5 (`sfx.charge`). Hráč by pak téma „hrál“ při každém hodu. Plnou podobu nabíjení řeší až spec efektů (S6 chce napínání papíru, ne tón).

### C.2 Proměna po čtvrtích
Obrys „skok nahoru, výdrž, sestup“ zůstává vždy stejný. Mění se mód (charakteristický tón), rytmus, nástroj a jeden tah melodie.

| Čtvrť | `motif` | `rhythm` (osminy) | Noty na D | Co se mění | Nálada (bible kap. 2.3, 12) |
|---|---|---|---|---|---|
| 1 Ráno, lydický | `[0,4,5,3,2,1]` | `[1,1,3,1,1,1]` | D A B **G#** F# E | Základní tvar. G# (#4) dává ranní „zvednutí“. Hrací strojek, řídce, každá druhá fráze. | „Out of the Workshop window and over a waking street.“ Probouzení, světlo zprava nahoře |
| 2 Poledne u moře, jónský | `[0,4,5,3,2,1]` | `[1,2,2,1,1,1]` | D A B G F# E | **Houpání:** pátý a šestý stupeň se protáhnou jako vlna. Odpověď v dalším taktu stoupá 6 – 7 – 8 (B – **C#** – D), citlivý tón dovede do přístavu. Flétna, pod ní KS arpeggia jako vlny. | Jasné poledne, moře `#2c6e9b`, vysoké bílé slunce, prostor |
| 3 Zlaté odpoledne, mixolydický | `[0,4,6,5,3,1]` | `[1,1,1,1,2,2]` | D A **C** B G E | **Vrchol zvednutý na ♭7 (C)** a hlava zrychlená do čtyř osmin: točí se jako větrník. Konec se rozvolní. Hlava (1 – 5 – ♭7) běží jako ostinato v KS drnkačce, flétna hraje téma a druhá flétna o tercii níž. | Teplé, dlouhé stíny, větrníky na hřebeni, pole |
| 4 Večer s lampiony, dórský | `[0,4,5,3,2,1]` | `[1,2,1,2,1,1]` | D A B G **F** E | **Synkopa** a moll tercie F. Plstěné piano o oktávu níž, hrací strojek opakuje téma **v kánonu o takt později** v oktávě 6: lampiony se rozsvěcují jeden po druhém. Pod tím harmonium. | Jediná tmavá čtvrť, teplé lampiony z hedvábného papíru, Hodinová věž jako „světelný bod celé cesty“ |
| Finále, lydický | `[0,4,5,3,1,0]` | `[1,1,2,1,1,2]` | D A B G# E **D** | **Poprvé dopadne na tóniku.** Krok 3 se vynechá (2 → 1), aby se téma vešlo do 6 not. Každý nástroj kapely zahraje jednu frázi (strojek, flétna, drnkačka, piano), pak ticho, pak sólo strojek („The Workshop is yours.“). | Úsvit za cílem, „Delivered.“ |

**Proměny uvnitř hudby čtvrti** dělá `motifBar` (obměny 0–5: přímo, posunuté na akord, obrat, rak, fragment s odpovědí, ozdobené) a nic nového nepotřebuje. Obrat a rak jsou vhodné jen do ploch, protože obrys „hodu“ v nich zmizí. Ve znělce a v L3 se proto hraje vždy přímý tvar 0 nebo 5.

**Téma roste s postupem uvnitř čtvrti** (N, viz BLOCKED 2). Na místě 1 čtvrti hraje lead jen hlavu 1 – 5 – 6, na místě 2 přibude 4, na místě 3 celé téma, na místě 4 i odpověď. Řídí to nejvzdálenější místo hráče, ne poloha vlaštovky, stejně jako volbu skladby.

---

## D. Doporučení: jeden směr do hloubky

### D.1 Doporučený směr: **E prohloubené na „Diorama“ (papírová kapela u stolu)**
Generativní jádro směru E (nic se neopakuje, hustota podle rychlosti, vítr) zůstává. Mění se:
1. **barva:** pily, sbor a pulzující pluck nahradí papírová kapela z B.2,
2. **tempo:** 84–100 místo 60–76, aby měla arkáda tep,
3. **oblouk:** den jde dolů o jedno znaménko, lydický → jónský → mixolydický → dórský → lydický (B.3),
4. **jedno téma „Hod“** v pěti proměnách místo pěti různých motivů (C).

Je to jeden žánr (akustický generativní ambient s měkkým tepem), prohloubený do pěti nálad jednoho dne.

### D.2 Porovnání s alternativami (N, ověří slepý poslech a únavový test z 01 §6)

| Kritérium (01 §6) | **E → Diorama** | B Paper Lo-fi přeladěné na den | A Neon Glide přebarvené akusticky | F Mixtape |
|---|---|---|---|---|
| Sedí k bibli (P2 papír, P3 den, P4 klid) | ano ve všech třech | P2 částečně (Rhodes, kontrabas), P3 ne (lo-fi = noc, studovna) | ne, synthwave bez pil a gated bicích už není synthwave | ne (4 žánry) |
| Únava za 10 min (nejčastější riziko, 01 §1.1 Szpunar, z paměti) | nejnižší: nesmyčkuje, generativní | nízká, ale smyčka 4 taktů s pevným beatem | střední | nízká změnou žánru, za cenu soudržnosti |
| Ruší QTE (vzrušení) | nejméně: měkký tep, okno ticha | málo | středně (plné bicí) | podle čtvrti |
| Rozlišení čtvrtí | mód + vedoucí nástroj + tempo + dozvuk | mód + nástroj | mód + hustota bicích | žánr (nejsilnější) |
| Slyšet kombo a klid | ano (L3 téma, L2 papír) | ano | ano | nesourodě |
| Realizovatelné syntézou za 0 Kč | ano, 6 nových levných hlasů + KS (B.2) | středně (Rhodes a swing syntéza zvládne, „lo-fi“ zrno hůř) | ano, ale ztratí identitu | ne bez knihoven |
| Riziko | „nevýrazné, málo arkády“. Řeší tempo 84–100, tep `box`/`page` a téma. | žánr nese noc a město, proti ránu | nejasná identita | proti zadání |

**Proč ne dva směry:** jediný vážný soupeř je B, protože jako jediný další má akustické nástroje. Jeho žánrový rámec (vinyl, déšť, boom-bap, noc) ale jde proti P3 a ze B se stejně převezme to, co sedí (kontrabas `upright`, swing v přístavu a na polích). Volba proto podle mě sporná není.

### D.3 Co se ověří a jak (N)
1. **Prototyp v `prototype-music.html`:** čtvrť 1 „Diorama“ vedle dnešního E a B, slepě (X1–X3). Kritéria a únavový test podle 01 §6.
2. **Podíl perfektů s hudbou a bez ní** na stejných seedech (01 §6 kritérium 3). S oknem ticha nesmí být horší než bez hudby.
3. **Výpadky `playbackStats`** 10 min v reálném čase, okno viditelné, notebook i iPhone 15 Pro.
4. **Rozpoznání tématu:** hráč po 20 min zazpívá nebo pozná hlavu tématu ve znělce čtvrti 3, i když ji slyšel v jiném módu (zkouška leitmotivu, ne jen libosti).

### D.4 Reference: co je ověřené
| Reference | Co platí | Stav |
|---|---|---|
| Tearaway (Media Molecule) | skutečný papír nahraný, jedna dynamická událost papíru, výchozí zvuk + výjimky | V, [Designing Sound](https://designingsound.org/2013/12/12/the-sound-of-tearaway/) |
| Tearaway | „nemít hudbu všude“, ambientní zvuková krajina | jen výpis hledání, [MCV](https://mcvuk.com/?p=77872) neotevřeno |
| Celeste (Lena Raine) | melodie ve tvaru hory, leitmotiv používaný znovu a znovu | V, [Gaming Trend](https://gamingtrend.com/podcasts/gaming-trend-podcast-behind-the-music-of-celeste-lena-raine-interview/) |
| Alto's Odyssey (Todd Baker, Torin Borrowdale) | náhodné sekce a dynamické prvky, pokaždé trochu jiná | V, [Tools and Toys](https://toolsandtoys.net/altos-odyssey-official-game-soundtrack/). Nástroje neověřeny. |
| Monument Valley 2 (Todd Baker) | generativní zvukové sekvence, efekty v tónině | z paměti, neověřeno (rozhovor Audiokinetic vrátil 403) |
| Tiny Wings | zvuk spojený s fyzikou letu | z paměti, neověřeno (hledání nic nenašlo) |
| Cirio et al. 2016 | mačkání papíru = mnoho drobných cvaknutí, část stochasticky | abstrakt z výpisu hledání, [projekt](https://www.cs.columbia.edu/cg/crumpling) |

---

## E. Mapa intenzity (zástupná)
*Čeká na časové osy letů v `research/hudba/02-casova-osa.md` (jiný agent). Až budou hotové, doplní se:*
- vrstvy L0–L3 a filtr po sekundách typického letu v každé čtvrti (rané, střední a pozdní lety),
- kde padnou okna ticha kolem tiku,
- kde téma zazní celé,
- hustota událostí proti tempu,
- přechod hranice čtvrti.

---

## Rozpory a otevřené otázky

**Rozpor podkladu 01 s biblí (není BLOCKED, platí bible):**
- 01 §1.3 bod 5 (oblouk soumrak → doky v moll → druhý západ → neonová noc) i `ARC` v kódu jsou překonané biblí 05 kap. 2.3 a 15.
- Rozhodnutí 06 „ladit ke 3D komiksovému městu“ (14. 10.) překonala pozdější rozhodnutí téhož dne „Nová vizuální identita: směr B Papírové město“ a 15. 10. „Jediný styl je Papírové město“.

**BLOCKED 1: co se starými směry.** Má se šest směrů v `src/music/` a prototypu smazat, nebo zmrazit?
- Příklad: A, C, D, F jsou neonové nebo komiksové (podobně jako cyber větve v U0/R0).
- Doporučení: **A, C, D, F smazat hned** v samostatném commitu (s nimi `pulse`, `chiparp`, `cnoise`, `ckick`, `brass`, `scratch`, `vinyl`, `rain`, `sax` ze `synth.js`). **B a E nechat**, dokud nebude „Diorama“ porovnaná slepým poslechem (D.3), pak smazat i je.

**BLOCKED 2: aranžmá podle místa uvnitř čtvrti.** Smí téma a aranžmá růst podle nejvzdálenějšího místa uvnitř čtvrti (místa 1–4)? Rozhodnutí 06 mluví o skladbě podle nejvzdálenější čtvrti.
- Příklad: na místě 1 hraje jen hlava tématu 1 – 5 – 6, od místa 3 celé téma.
- Doporučení: **ano.** Je to stejný princip (postup hráče, ne poloha vlaštovky), jen jemnější, a hráč slyší pokrok i během 12–17 min v jedné čtvrti (01 §0).

**BLOCKED 3: vlastní nahrávky papíru.** Smí se pro papírové efekty a perkuse použít vlastní nahrávky skutečného papíru? Rozhodnutí 06 říká „hudba generovaná v kódu, případně CC0“ a vlastní nahrávky nezmiňuje.
- Příklad: uživatel telefonem nahraje ~10 krátkých zvuků (zmačkání, přehyb, list o stůl, štětka po papíře), celkem < 200 kB, plná vlastní práva, zápis do `credits.json`.
- Doporučení: **začít syntézou** (B.2, hlasy `page`, `brush`, `crumple`) a vlastní nahrávky povolit jako zálohu, pokud syntéza při poslechu zní „levně“. Tearaway šel cestou nahrávek (D.4).
