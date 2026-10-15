# Hudební zadání pro Papírové město

**15. 10. 2026, audio-designer.** Krok 2 hudebního zadání: sekce A–D (směr a identita), E (mapa intenzity podle časových os `research/hudba/02-casova-osa.md`), F (spec pro game-deva na krok 3). Odpovědi uživatele z 15. 10. jsou zapracované (sekce „Rozpory“).

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

**Ze `synth.js` se v novém směru nepoužije.** Podle rozhodnutí 15. 10. se neonové hlasy mažou se směry A, C, D, F (dělá jiný agent). Hlasy, které používají B a E, zůstanou do slepého porovnání:
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

**Téma roste s postupem uvnitř čtvrti** (schválil uživatel 15. 10.). Na místě 1 čtvrti hraje lead jen hlavu 1 – 5 – 6, na místě 2 přibude 4, na místě 3 celé téma, na místě 4 i odpověď. Řídí to nejvzdálenější místo hráče, ne poloha vlaštovky, stejně jako volbu skladby.

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

## E. Mapa intenzity

Zdroj časů: `research/hudba/02-casova-osa.md` (simulátor, bot profilu `average`, 15. 10.). Lidské časování, míření, výsledek a Dílna zvlášť jsou tam NOT ASSESSED, takže pravidla pro tyto obrazovky jsou N.

### E.1 Co z časové osy plyne pro hudbu
| Fakt z 02 | Hudební míra (84–100 BPM, doba 0,60–0,71 s, takt 2,4–2,9 s) | Důsledek (N) |
|---|---|---|
| Let 17–31 s letového času, skutečně ~8 % kratší (klouzání 1,4×, události se nezrychlují) | ≈ 7–11 taktů, tedy zhruba **jedna 8taktová fráze na let** | Fráze `phrase()` se nemusí srovnávat s hodem. Hudba běží dál přes celou smyčku (01 §0), nic nezačíná s hodem. Zrychlení klouzání tempo nemění (B.3). |
| 1. varování **vždy v 1,5 s** po výhozu | ≈ 2–2,5 doby | Po výhozu se nestaví žádný „nástup“ ani drop. Za 2 doby přijde ztenčení. |
| Okno se otevírá 0,8 s po začátku varování (termika 2,0 s), okno 1,2 s, holub ≤ 1,2 s po stisku | varování ≈ 1 doba (termika 3 doby), okno ≈ 2 doby | Ztenčení musí přijít **hned**. Čekání na dobu by zabralo až polovinu varování. |
| Klid mezi událostmi medián 3,0 s, P10 3,0 s, P90 5,3–5,5 s | ≈ 1–1,25 taktu, nejméně 4 doby | Návrat vrstev po události **na nejbližší dobu**, ne na takt. Takt je skoro celý klid. |
| Mimo událost 56–57 % letu (P10–P90 49–62 %), v okně 18–22 % | | Hudba je hlavní společník asi v polovině letu. V druhé polovině ustupuje. |
| Rozestup akcí medián 1,7–5 s, **P10 0,4–0,8 s** (pára 2 stisky, holub stisk + puštění) | 0,4 s ≈ 2/3 doby | Rychlý sled je **uvnitř jedné události**. Mezi událostmi je vždy ≥ 3 s (E.3). |
| Hranice čtvrtí od středního stádia ve 100 % letů, medián 2× (D1→D2 ~9–13 s, D2→D3 ~17–24 s) | | Přechod je běžná věc každého letu, ne událost. Často padne do varování nebo okna (v tabulce 02 B např. seed 93, 108, 109). Viz E.4. |
| Čas ve čtvrtích ~15 / 12 / 16 / 10 min (simulace 54 min proti cíli 82–98 min) | při cíli 90 min po přepočtu ~25 / 20 / 27 / 17 min | Proti únavě se plánuje s horní hranicí, tedy **až ~27 min v jedné čtvrti** (E.5). |

### E.2 Intenzita a vrstvy po fázích smyčky
**Stupnice intenzity:**
- **0** = hudba mlčí (jen vítr nebo pokoj),
- **1** = plocha L0, případně téma tiše v plstěném pianu,
- **2** = L0 + L1 (bas, ostinato), L2 papírové perkuse podle podmínky,
- **3** = L0–L3 (+ téma v leadu).

Hodnoty vrstev navazují na dnešní `mixTargets`. Odchylky od dnešního kódu jsou **tučně**.

| Fáze | Intenzita | Vrstvy (gain) | Filtr celé hudby | Přechod dovnitř |
|---|---|---|---|---|
| **Dílna** (podkroví, menu) | 1 | L0 0,6. **Hlava tématu v plstěném pianu** každou 2. frázi, délka podle místa (C.2). | 2,4 kHz | na takt, náběh 0,5 s |
| **Míření** | 1 → 2 | L0 0,8, L1 0,6 (bas a ostinato, bez perkusí). Nabíjení hodu nese jen SFX. | 7 kHz | na takt |
| **Výhoz** (0–1,5 s) | 2 | L0 0,8, L1 0,85. L2 jen při rychlosti ≥ `FAST` 1,3. Žádný nástup ani drop. | podle rychlosti (2,5–18 kHz, dnešní vzorec) | SFX hned, vrstvy na nejbližší dobu |
| **Klidný let** (56–57 %) | 2–3 | L0 0,8, L1 0,85, L2 0,8 po 1. zásahu nebo od `FAST`, L3 0,7 od komba 2 (oktáva od komba 3) | podle rychlosti | na nejbližší dobu, náběh 0,2 s |
| **Varování** | 1 | L0 0,56 (plocha LP 650 Hz), L1 0,85 (tep zůstává), L2 × 0,12, **L3 0** (dnes × 0,35) | **1,8 kHz na celé hudbě** (nové) | **hned**, 40 ms |
| **Okno QTE** | 1 | jako varování + **okno ticha** (E.3) | 1,8 kHz | hned |
| **Zásah / perfekt** (účinek ≥ 1 s) | 2 → 3 | vrstvy zpět jako v klidném letu. Perfekt: duck −4 dB (`DUCK`) a **jedna ozdoba** (ozvěna posledního tónu tématu v hracím strojku) na další dobu, jen když do dalšího plánovaného středu zbývá > 1 doba. | filtr se otevře až po hysterezi (E.3) | na nejbližší dobu |
| **Minutí** | 2 | návrat bez ozdoby, žádný jiný tón v hudbě | po hysterezi | na nejbližší dobu |
| **Přechod hranice: nová čtvrť** (za rekordem) | beze změny vrstev | přepnutí skladby a krátký stinger jen v klidu (E.4) | – | na takt, jen v klidu |
| **Přechod hranice: známá čtvrť** | beze změny | nic (E.4) | – | – |
| **Dopad** | 2 → 1 | L2 a L3 dozní do konce taktu. Duck −3 dB / 0,3 s pod `flop`. | otevře se na 3,5 kHz | SFX hned, vrstvy na takt |
| **Výsledek** | 1 | L0 0,75, téma v plstěném pianu tiše. Bez výherní znělky (P13). Znělka nové čtvrti (`sfx.jingle`) jen u karty čtvrti (E.4). | 3,5 kHz | na takt |
| **Finále „Delivered.“** | vlastní cue | celé téma kapely (C.2), pak 4 s ticha, pak sólo strojek | – | po dopadu na takt |

**Kde téma zazní celé:**
- v leadu L3 jen při kombu ≥ 2 v klidném letu,
- v Dílně a ve výsledku tiše v pianu,
- ve znělce karty čtvrti.

Délku tématu všude omezuje nejvzdálenější místo (C.2): místo 1 hlava, místo 2 + 1 tón, místo 3 celé, místo 4 i s odpovědí.

### E.3 Rychlé akce za sebou: hystereze filtru a okno ticha
P10 rozestupu akcí je 0,4–0,8 s. Kdyby filtr a ztenčení sledovaly jen fázi „okno“, hudba by v páře (dva stisky po ~0,5 s) nebo u holuba (stisk, puštění) pumpovala. Proto platí:

1. **Ztenčení a filtr 1,8 kHz drží celou událost**, od začátku varování do konce účinku + 0,3 s, ne jen okno.
   - Uvnitř jedné události se filtr nikdy neotevře.
   - Náběh 40 ms, uvolnění 0,4 s.
   - Klid mezi událostmi je vždy ≥ 3 s (P10 v 02 C), takže se filtr mezi událostmi otevře vždy a ztenčení nepřekryje celý let.
   - Stav `mixTargets` „effect“ se tím mění: filtr 1,8 kHz zůstává, vrstvy se vrací (po zásahu může zaznít ozdoba, ale ne nad 1,8 kHz).
2. **Okno ticha ±120 ms** kolem **každého** plánovaného středu:
   - zdroj středů je dnešní `qteCenter` rozšířený na všechny typy,
   - pára má 2 středy po ~0,46–0,5 s,
   - u holuba se střed zná až po stisku (02 B: stisk → střed 0,3–0,9 s),
   - termika má střed jádra.
   
   Pravidla masky:
   - Začátky not L1 a L2 v masce se zahodí (L3 je v události stejně 0). Doznívající tóny se nezkracují.
   - **Masky blíž než 0,4 s se slijí** do jedné. Pára pak má souvislé ticho ~0,7 s, místo aby mezi stisky vklouzl jeden tón basu.
   - Maska se kontroluje **při vyjmutí noty z fronty** (`pump`, předstih `LOOK` 0,12 s), ne při plánování taktu. Středy naplánované později (holub) tak platí i pro už vygenerovaný takt.
   - Střed přeplánovaný po hitstopu (`createTickPlanner`) posune i masku.
3. **Duck se nesčítá a nepumpuje.**
   - Dva perfekty po 0,5 s (pára) dají jeden duck −4 dB s prodlouženým držením, ne dva poklesy.
   - Dnešní `a.duck` dělá `setValueAtTime(1, when)`. Uprostřed běžícího ducku tím skočí gain na 1 a vznikne cvaknutí a pumpa. Je potřeba to opravit (F, test D-3).
4. **Ozdoby** (kvantované, rozhodnutí 06) se v události nikdy nepřidávají. Po perfektu jen tehdy, když do dalšího středu zbývá > 1 doba (v páře tedy ne).

### E.4 Přechod hranice čtvrti za letu
Skladba se řídí postupem (rozhodnutí 06), ne polohou. Rozlišují se dva případy:

**a) Let přejde hranici čtvrti, kterou hráč ještě nemá jako nejvzdálenější („nová“, `boundaryCue` typ `new`).** Dopad je vždy dál než bod přechodu, takže **tento let rekord do nové čtvrti posune**. Přepnutí skladby za letu proto nepředbíhá postup, jen ho ohlásí o pár sekund dřív. Pravidla:
1. Přepnutí (`a.play` s `pending`) se smí stát **jen v klidu**, na první hranici taktu, která padne do klidu a je aspoň 0,5 s před dalším varováním. Klid po účinku trvá ≥ 3 s, takže se vejde jeden takt (2,4–2,9 s), když přechod přijde do ~0,5 s po konci účinku.
2. Padne-li přechod do události (častý případ), přepnutí **počká na další klid**.
3. Nepřijde-li klid do dopadu, přepne se na výsledku.
4. **Stinger za letu:** zmačkání papíru (`crumple`) a hlava tématu v novém módu na hracím strojku, ≤ 1 s, jen spolu s přepnutím, nikdy v události.
5. **Plná znělka čtvrti** (`sfx.jingle`, 2–3 s) se z letu přesouvá **na kartu čtvrti ve výsledku** (02 D: karta čtvrti 4 s). V letu by se do klidu 3 s nevešla bez kolize s varováním.
6. Pokud let přejde i další novou hranici, platí totéž a stinger zazní nejvýš jednou za let. Skladba skončí ve čtvrti dopadu.

**b) Let přejde hranici čtvrti, kterou hráč už má („známá“, `revisit`).** Ve středním a pozdním stádiu se to děje **2× v každém letu**, za kampaň řádově 100–150×.
- **Hudba nedělá nic:** žádná znělka, žádná změna barvy.
- Dnešní plán (01 §3.3 „2s znělka a změna barvy“) by se stal nejčastějším a nejunavujícím zvukem hry (P4, Hicks et al. 2024 v 01 §1.1).
- Informaci nese štítek místa a obraz (přístupnost: nic jen zvukem, a tady ani zvukem).

**Místa uvnitř čtvrti (rozhodnutí 15. 10.):** totéž ve menším. Když let poprvé překročí nové nejvzdálenější místo, téma se prodlouží od **další fráze**. Bez stingeru, protože místa se přecházejí ~9–11× za let.

### E.5 Únava za 10–27 min v jedné čtvrti
Simulace dává 10–16 min na čtvrť, u strategie „paper-first“ až ~20 min v D1 a D3, při cíli 90 min po přepočtu až ~27 min. Vrstvy obrany:

| Vrstva | Délka | Jak (N) |
|---|---|---|
| Fráze | 8 taktů ≈ 19–23 s (≈ jeden let) | `phrase()`. Akord se volí seedovaně z poolu (`progAt` / `chordAt`), nikdy stejný jako minule. |
| Forma | 6 frází (A-B-A-C-B-D) ≈ 2,0–2,3 min | Fráze C je výdech (bez L2, jen ostinato). Každý cyklus formy má nový seed, nic se nesmyčkuje přesně. |
| Eno cykly piana | 6,5 / 9 / 10,75 / 13,5 doby | Souhra se opakuje až po stovkách dob, slyšitelně nikdy. |
| Proměna podle cyklu formy | každé ~2 min | Cyklus 1 lead sám, cyklus 2 lead + zdvojení o oktávu výš (hrací strojek), cyklus 3 téma jen jako obměna 4 (fragment + odpověď) z `motifBar`, pak znovu. |
| Růst tématu podle místa | 4 stupně na čtvrť, ~3–7 min | C.2. Hráč slyší pokrok uvnitř čtvrti. |
| **Ticho** | po každých ~12 min v téže čtvrti | Při další návštěvě Dílny nebo Atlasu hudba na 45–60 s zmizí (fade 2 s) a zůstane jen vítr a pokoj (`air`, tichý). Pak se vrátí jedním taktem plochy. Za letu se ticho nevkládá, tam rozhoduje stav hry. Tearaway měl podle výpisu hledání zásadu „nemít hudbu všude“ ([MCV](https://mcvuk.com/?p=77872), neotevřeno). |
| Výsledek a Dílna | každá 3. návštěva | Jen plocha L0 bez tématu (ani piano). Téma tak neztratí váhu. |

**Měření únavy:** únavový test z 01 §6 rozšířený na hodnocení v 1., 5., 10. a 15. minutě (scénář F.6). Kritérium: hodnocení „nechal bys ji zapnutou?“ v 15. min klesne nejvýš o 1 bod proti 1. min.

---

## Rozpory a otevřené otázky

**Rozpor podkladu 01 s biblí (není BLOCKED, platí bible):**
- 01 §1.3 bod 5 (oblouk soumrak → doky v moll → druhý západ → neonová noc) i `ARC` v kódu jsou překonané biblí 05 kap. 2.3 a 15.
- Rozhodnutí 06 „ladit ke 3D komiksovému městu“ (14. 10.) překonala pozdější rozhodnutí téhož dne „Nová vizuální identita: směr B Papírové město“ a 15. 10. „Jediný styl je Papírové město“.

**Rozhodnuto uživatelem 15. 10.** (06, „Hudba Diorama“), dříve BLOCKED 1–3:
1. **Staré směry:** A, C, D, F se smažou hned i s neonovými hlasy (dělá jiný agent). B a E zůstávají do slepého porovnání (F.6).
2. **Téma roste podle nejvzdálenějšího místa uvnitř čtvrti:** ano (C.2, E.4).
3. **Papírové zvuky:** syntéza (B.2: `page`, `brush`, `crumple`). Vlastní nahrávky papíru jen jako záloha, pokud syntéza při poslechu zní levně. Vlastní nahrávka by pak potřebovala záznam v `credits.json`.

---

## F. Spec pro game-deva: krok 3 (Diorama v prototypu)

**Cíl kroku 3:** směr „Diorama“ hraje v `prototype-music.html` (Auto flight na skutečné mechanice) se všemi pravidly z B, C, E. Je změřený (LUFS, výpadky) a připravený ke slepému poslechu.

**Mimo rozsah:**
- **zapojení do hry** (`ui.js`, `index.html`) je samostatný krok po slepém poslechu,
- mazání A, C, D, F,
- spec efektů (S6).

**Model:**
- Opus pro `audio-mix.js` (masky, hystereze, přechody) a KS,
- Sonnet může dělat hlasy v `synth.js` podle tabulky B.2 a testy.

Platí rozhodnutí 06 ř. 52 a 15. 10.

### F.1 Moduly a soubory
| Soubor | Co (povolené změny) |
|---|---|
| `src/music/diorama.js` (nový, čistý) | Data 4 čtvrtí + finále podle B.3: `bpm`, `mode`, `swing`, `lead`, `verbSec`, `verb[]`, `echo[]`, `pool`. Funkce `bar(i, d, { seed, density, place, cycle })` vrací události jako ostatní směry. Generativní jádro převzaté z `e-above-the-city.js` (`LOOPS`, `chordAt`, hustota). Téma přes `motifBar` s `ARC[d]`, délka podle `place` (C.2). Proměny podle cyklu formy (E.5). Výdech ve frázi C. `cue('finale', …)` pro finále. |
| `src/music/ks.js` (nový, čistý) | `ksSamples(freq, rate, sec, seed) → Float32Array` (Karplus–Strong: šumový burst, průměrovací filtr, útlum). Žádné Web Audio. |
| `src/music/synth.js` | Nové hlasy z B.2: `musicbox`, `ks` (cache `AudioBuffer` podle MIDI a `sampleRate`, líně), `flute`, `paperpad`, `box`, `page`, `brush`, `pencil`, `crumple`. Volby `piano.o.felt`, `organ.o.reed`. `impulse()` beze změny API. |
| `src/music/index.js` | Přidat `Diorama` (id `G`) do `TRACKS`. |
| `src/audio-mix.js` | 1) `ARC` podle C.2: id zůstávají, `name` a `mood` podle bible, módy lydian / ionian / mixolydian / dorian / lydian, `motif` a `rhythm` z tabulky. 2) `comboNote(n, octave, mode = 'ionian')` po stupních 1-2-3-5-6-8 módu. 3) `mixTargets`: v události (varování až konec účinku + 0,3 s) `L[3] = 0`, nové pole `musicFilter: 1800`, stav `effect` drží filtr (E.3/1). 4) `trackFor(progress)` vrací i `place` (0–3) z `best`. 5) Nové čisté funkce: `silenceMask(centres, { pad: 0.12, merge: 0.4 })` → intervaly, `inMask(t, mask)`, `switchAllowed({ t, calmUntil, barTime, urgent })` (E.4/1), `boundaryPlan(prevX, x, best)` = `boundaryCue` + `{ stinger, defer }` (typ `revisit` → `null`), `INTENSITY` (tabulka E.2 jako data), `fatigue({ minutesInDistrict, visits })` → `{ rest, bedOnly }` (E.5). |
| `src/audio.js` | Maska ticha při vyjmutí noty z fronty v `pump` (L1–L2). `setMix` čte `musicFilter` a hysterezi. `a.duck` bez skoku na 1: při běžícím ducku prodloužit hold (E.3/3). `applyDistrict` vymění impulsní odezvu podle `verbSec` (buffer jen při změně čtvrti, cache). Stinger a odložené přepnutí podle `switchAllowed`. Ticho podle `fatigue`. |
| `src/sfx.js` | `success` / `perfect` volají `comboNote(…, mode čtvrti)`. `jingle` hraje nové `ARC` (přímý tvar, obměna 0). `land`: hluboká složka `flop` < 120 Hz vypnutá při `calm` nebo `prefers-reduced-motion` (B.4). |
| `src/audio-loudness.js` (nový, čistý) | `lufs(channels, rate)` podle ITU-R BS.1770 (K-filtr: dvě bikvadratické sekce, bloky 400 ms s překryvem 75 %, absolutní brána −70 LUFS, relativní −10 LU), `momentary`, `samplePeak`. Bez Web Audio, testovatelné v Node. |
| `prototype-music.html`, `prototype/music/*` | Volba „Diorama“. Posuvník místa 1–4 (`place`). Tlačítko „LUFS“ (offline render 60 s na čtvrť, výpis tabulky). Slepý režim upravený podle F.6 včetně vyrovnání hlasitosti. Zobrazení masek ticha na časové ose (vizuální ekvivalent). |
| Testy | `tests/audio-mix.test.js` (rozšířit), nové `tests/music-diorama.test.js`, `tests/music-ks.test.js`, `tests/audio-loudness.test.js` |

**Cizí soubory (neměnit):** `src/flight.js`, `src/ui.js`, `index.html`, `src/render3d/*`, směry A–F (maže jiný agent), `CLAUDE.md`.

### F.2 Rozhraní na stav hry
Prototyp i budoucí hra předávají zvuku **jeden objekt stavu** na snímek: `audio.update(state)`. Odvození ze hry patří do čisté funkce `audioState(flight, model, screen)` v `audio-mix.js`, ať to jde testovat.

| Pole | Typ | Zdroj ve hře |
|---|---|---|
| `screen` | `'workshop' \| 'aim' \| 'flight' \| 'result' \| 'finale'` | `screens.js` |
| `event` | `'none' \| 'warning' \| 'window' \| 'effect'` | fáze aktivní události (`flight.js`) |
| `eventType` | `'gust' \| 'bird' \| 'steam' \| 'thermal' \| 'drone' \| 'star' \| null` | typ události |
| `centres` | `number[]` (čas letu středů, které ještě nenastaly) | rozšířený `qteCenter`: pára 2, holub po stisku, termika 1 |
| `flightT` | number | čas letu (pro plánovač tiku a masky) |
| `effectEnd` | number \| null | konec účinku poslední události (hystereze, klid pro přepnutí) |
| `combo`, `hits` | number | jako dnes |
| `speed` | number (vx / cruise) | jako dnes |
| `height` | number (m) | jako dnes |
| `x`, `prevX` | number (m) | poloha, jen pro `boundaryPlan` |
| `best` | number (m) | rekord, řídí `trackFor` a `place` |
| `calm`, `reducedMotion` | boolean | nastavení zvuku, `matchMedia` |

**Výstupy zvuku zpět do UI:**
- `audio.on('cue', …)`, jako dnes, pro vizuální ekvivalenty,
- nové cue `mask` (okno ticha), `switch` (přepnutí čtvrti), `rest` (ticho proti únavě).

### F.3 Testy (každý bod = alespoň jeden `test()`)
**Téma a harmonie (`music-diorama`, `audio-mix`):**
- T-1 Každé `ARC[d]`:
  - 4–6 not, rytmus 8 osmin (dnešní test zůstává),
  - první interval stoupá o 4 stupně (`motif[1] - motif[0] === 4`),
  - vrchol je za 1. tónem a je maximem,
  - poslední tón je pod vrcholem,
  - jen finále končí na 0.
- T-2 Módy `ARC` jsou v pořadí `lydian, ionian, mixolydian, dorian, lydian`, tónika D.
- T-3 Pro každou čtvrť a 3 seedy je každá laděná nota z `bar()` v 64 taktech `inScale` daného módu.
- T-4 Determinismus: stejné `(i, d, seed, place)` → stejné události. Jiný seed → jiné události aspoň v 1 z 8 taktů.
- T-5 `bar()` používá jen povolené hlasy (seznam B.2). Žádný z mazaných neonových hlasů.
- T-6 `place` 0 / 1 / 2 / 3 → lead L3 obsahuje 3 / 4 / 6 / 6 + odpověď not tématu (C.2).
- T-7 Vyšší `density` → více not L1 (průměr přes 32 taktů).
- T-8 `comboNote(n, 5, mode)` je pro n = 1…8 a všechny módy ve stupnici módu a neklesá.
- T-9 BPM 84 / 92 / 96 / 100, `verbSec` ≤ 1,8 s ve čtvrtích 1–4.

**Mix:**
- M-1 `mixTargets` ve `warning` i `window`: `layers[3] === 0`, `musicFilter === 1800`. V `effect`: vrstvy jako v klidu, `musicFilter === 1800`.
- M-2 Hystereze: sekvence stavů pára (warning → window → window → effect) nikdy nevrátí `musicFilter` > 1800 dřív než 0,3 s po `effectEnd`.
- M-3 `silenceMask([8.13, 8.63])` dá jeden slitý interval [8.01, 8.75]. `[2.0, 3.0]` dá dva. `inMask` na hranách.
- M-4 `boundaryPlan`: `revisit` → `null`. `new` v události → `defer: true`. `new` v klidu → stinger nejvýš 1× za let.
- M-5 `switchAllowed` je false v události a false, pokud by takt začal < 0,5 s před `calmUntil`.
- M-6 `fatigue`: 12 min v téže čtvrti → při další návštěvě Dílny `rest` 45–60 s. Každá 3. návštěva výsledku `bedOnly`.
- M-7 `trackFor({ best })` → `place` 0–3 na hranicích 304,8 m. Čtvrť beze změny proti dnešku.

**Ducking a plánovač** (falešný `ctx` jako v dnešních testech tiku):
- D-1 Noty L1/L2 s časem v masce se nepřehrají, noty L0 ano.
- D-2 Přeplánovaný střed po hitstopu posune masku.
- D-3 Dva ducky po 0,5 s: zaznamenané hodnoty gainu nikdy nevystoupí na 1 mezi nimi a neklesnou pod −4 dB.

**KS a hlasitost:**
- K-1 `ksSamples(220, 48000, 1, s)` je deterministický. Perioda odhadnutá autokorelací je 48000 / 220 ± 2 %. RMS posledních 100 ms < RMS prvních 100 ms / 4.
- L-1 `lufs`: stereo sinus 1 kHz o úrovni −23 dBFS v obou kanálech dá **−23,0 ± 0,1 LUFS** (EBU Tech 3341, zkušební případ 1, z paměti, ověřit v dokumentu EBU při implementaci).
- L-2 Ticho dá `-Infinity`. Sinus −20 dBFS 1 s + 10 s ticha je o méně než 0,5 LU tišší než samotný sinus (brána).
- S-1 (statický) Diorama nenačítá žádný soubor: v `src/music/diorama.js` ani v hlasech není `fetch` ani `decodeAudioData`, `assets/audio/` neobsahuje nic nového.

### F.4 Měření hlasitosti (LUFS)
- **Postup:** v `prototype-music.html` tlačítko „LUFS“ vyrenderuje přes `OfflineAudioContext` 60 s každé čtvrti. Stav je klidný let, kombo 3, `density` 0,7, výchozí nastavení (hudba 60 %, efekty 80 %, master 100 %). Výsledek spočítá `audio-loudness.js`.
- Offline render je pro **obsah** zvuku spolehlivý. Gotcha z `CLAUDE.md` se týká **zátěže**, ne hlasitosti.

| Měřítko | Cíl (N) |
|---|---|
| Integrovaná hlasitost hudby ve výchozím nastavení, každá čtvrť | **−22 ± 1,5 LUFS** |
| Rozdíl mezi čtvrtěmi | ≤ 1,5 LU (večer smí být plnější hustotou, ne hlasitostí) |
| Výsledek a Dílna proti klidnému letu | o 3–6 LU tišší |
| Varování a okno proti klidnému letu (vliv ztenčení a filtru) | o ≥ 4 LU tišší |
| Krátkodobá (momentary) hlasitost perfektu nad hudbou ve stejné chvíli | ≥ +6 LU |
| Tik QTE nad hudbou v okně | ≥ +9 LU |
| Vzorkový vrchol celé směsi | ≤ −1 dBFS (limiter `lim` threshold −8 dB nesmí trvale komprimovat: zisk redukce v klidném letu ≤ 2 dB, čte se `lim.reduction`) |

Ve slepém poslechu se kandidáti **vyrovnají na stejnou integrovanou hlasitost** (−22 LUFS), jinak vyhrává hlasitější.

### F.5 Měření zátěže (`playbackStats`)
- **Prostředí:**
  - reálný čas, okno **viditelné** (ne skryté a ne `?timer`),
  - Chrome na referenčním notebooku,
  - Auto flight 10 min na čtvrť (40 min celkem, lze po čtvrtích).
- **Kritéria přijetí:**
  - `a.stats().underruns` přírůstek **0** za 10 min,
  - `underrunMs` 0,
  - `schedMax` < 5 ms,
  - `peak` hlasů ≤ 48,
  - RAM: cache KS ≤ 8 MB (počet bufferů × délka × 4 B, vypsat).
- **iPhone 15 Pro (Safari):** `playbackStats` tam nemusí být (dnes vrací `null`). Měří se poslechem 10 min (cvaknutí nebo výpadek = selhání) a `schedMax`. Bez zařízení **NOT ASSESSED**, neodhadovat.
- Výsledky do `reports/` (cestu určí orchestrátor) se jménem prohlížeče, zařízení a datem.

### F.6 Slepý poslech na 15 minut
- **Kdo:** uživatel (ideálně + 2 další lidé).
- **Kde:** `prototype-music.html`, slepý režim. Kandidáti X1–X3 = Diorama, E (dnešní), B (dnešní) v náhodném pořadí podle seedu sezení, vyrovnaní na −22 LUFS.
- **Jak:** sluchátka. Telefonní reproduktor jen v bloku 5.
- **Export:** hodnocení JSON, jako dnes.

| Čas | Blok | Co posluchač dělá | Co se měří |
|---|---|---|---|
| 0:00–1:00 | Kalibrace | Nastaví si příjemnou hlasitost na X1, dál ji nemění. | – |
| 1:00–7:00 | 1 Srovnání (čtvrť 1, ráno) | 3 × 2 min Auto flight, QTE mačká sám (mezerník). Po každém hodnotí 1–5: „ladí k rannímu papírovému městu“, „nechal bys ji zapnutou“, „rušila tě při QTE“. | pořadí kandidátů, podíl perfektů na kandidáta (stejné seedy) |
| 7:00–10:00 | 2 Rozlišení čtvrtí (jen Diorama) | 4 × 45 s, čtvrti v náhodném pořadí, bez obrazu. Přiřadí každou k „ráno / poledne u moře / zlaté odpoledne / večer s lampiony“. | kritérium: ≥ 3 ze 4 správně |
| 10:00–13:30 | 3 Únava (jen Diorama, čtvrť 3, místo 4) | Nepřetržitě hraje Auto flight s QTE. V 10:00 a 13:30 hodnotí „nechal bys ji zapnutou“ 1–5. | pokles ≤ 1 bod (E.5). Delší test 1., 5., 10., 15. min zvlášť mimo tento scénář. |
| 13:30–14:30 | 4 Leitmotiv | Slyší 3 krátké znělky na stejných nástrojích: téma ve čtvrti 3 (mixolydické), téma pozpátku (rak) a cizí motiv stejné délky. Vybere „melodii vlaštovky, kterou už slyšel“. | kritérium: správně (náhoda 1/3), u 3 lidí ≥ 2 |
| 14:30–15:00 | 5 Telefon | 30 s Diorama z reproduktoru telefonu. Otázka „je slyšet téma a tik?“ ano / ne. | ano / ne |

**Kritéria přijetí kroku 3:**
- Diorama vyhraje blok 1 průměrem „nechal bys ji zapnutou“, nebo je nejvýš o 0,5 bodu horší s lepším „ladí k městu“.
- Blok 2 a 4 splněny.
- Podíl perfektů s Dioramou není nižší než bez hudby o víc než 5 procentních bodů (stejné seedy, ≥ 20 letů). Tento test je mimo 15 min.
- F.4 a F.5 splněny.
- `npm test` a `npm run format:check` prochází.

Když Diorama blok 1 prohraje, **nic se nesmaže** a výsledek jde orchestrátorovi k rozhodnutí uživatele.
