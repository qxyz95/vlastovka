# Stylová bible Just Throw It: Papírové město (směr B)

> **Schváleno 14. 10. 2026** (`research/bonusy/06-rozhodnuti.md`): pilíře „Diorama za úsvitu“, paleta čtvrti 1 beze změny, názvy čtvrtí sada C, vlaštovka na úzkých obrazovkách +15 %, písmo zatím systémové (rozhodne se po zahrání). Bible nahrazuje `02-styl.md` pro styl `?styl=papir`; co se z 02 přebírá a co ruší, je v kap. 15. Do přepnutí celé hry platí 02 pro výchozí styl.
>
> **Doplněno 14. 10. 2026 podle schválených rozhodnutí** (06, bloky „Začátek hodu, místo odhodu a kamera“ 1–7 a „Odemykatelný obsah“ 1–8): jedno měřítko světa (kap. 3.1, M-1 až M-4), místo odhodu „podkrovní dílna v řezu“ místo Dílny PAPER LAB (kap. 9, S-1 až S-7), modely vlaštovek, papíry a skiny (kap. 17), rozpory R-S1 až R-S9 vyřešené (kap. 16.1). Zdroje: `research/start/02-misto-odhodu-vzhled.md`, `research/obsah/03-vzhled-modelu-a-skinu.md`. **Pozor na podobná označení:** s pomlčkou (M-1, S-1) = místo odhodu, bez pomlčky (M1, S1) = modely a skiny vlaštovky; jsou převzaté beze změny, aby šly dohledat ve zdrojových návrzích.
>
> **Doplněno 15. 10. 2026 podle rozhodnutí uživatele** (06, „Plán hratelnosti, odpovědi na otázky“ body 13–15; podrobnosti a dávky v `research/plan-hratelnost/03-art.md`): dítě je **oblá figurka C** z mnoha stěn s vlastní rampou po stěnách (kap. 9.4, výjimka v kap. 3); kouř z komínů je **papírový a jen daleko od místa odhodu** (S-6, kap. 6 bod 2, kap. 7); hra začíná **úvodním záběrem** na dům s dílnou s nápisem „Throw it“ nahoře v nebi (kap. 9.2).

**Vyzkoušej si to:** `npm start` → http://127.0.0.1:4173/prototype-styly.html (výchozí stránka je teď tento návrh; srovnání 5 směrů z `04-nove-smery.md` je na `?srovnani=1`). Nahoře se přepíná záběr (Dílna, let, událost s QTE, výsledek), místo 1–4, velikost (1280×800, telefon 375×667 a 932×430), druh stínů a jazyk. Tlačítko „Změřit“ vypíše kontrast vlaštovky z pixelů a výkon.

Prototyp kreslí **skutečné rozložení hry**: místa z `cityChunk` (`src/render3d/geometry.js`), život čtvrti ze `suburbLife` (`src/render3d/life.js`), kamery `cameraFor` (`frame.js`) a `restCamera` (`pose.js`), polohu ruky dítěte `HAND` a `KID`. Mění jen to, jak se to kreslí. Kód: `prototype/styly/papir-data.js` (čistá data a geometrie, běží v Node), `papir.js` (three.js), `papir.css` (UI).

**Jak číst:** „Pravidlo“ má platit, „proč“ odkazuje na pilíř (**P1–P4**) nebo referenci, kterou si uživatel vybral. Čísla jsou z prototypu, kontrasty změřené (WCAG poměr), ne odhadnuté.

**Snímky** (`research/design/img/papir/`, 14. 10., Chrome, okno viditelné, DPR 1,25):

| Snímek | Co ukazuje |
|---|---|
| `desktop-dilna.jpg` | Dílna, celá stránka 1280 × 800 |
| `desktop-let-1-strechy.jpg` … `desktop-let-4-zeleznice.jpg` | let nad místy 1–4 čtvrti 1 |
| `desktop-udalost-qte.jpg` | událost „poryv od tržnice“ s QTE kruhem |
| `desktop-vysledek.jpg` | výsledek hodu |
| `mobil-udalost.jpg`, `mobil-dilna-cs.jpg` | telefon 375 × 667 (Dílna česky) |
| `nasirku-let-zeleznice.jpg` | telefon na šířku 932 × 430 |
| `stiny-1-zadne.jpg`, `stiny-2-siluety.jpg`, `stiny-3-shadowmap.jpg` | stejný záběr trhu bez stínů, se stíny ze siluet (doporučeno) a s plnou shadow map |
| `paleta.png` | paleta čtvrti 1 a role |

Po pořízení snímků se v prototypu ještě ztmavil malý text na stole (`#4a4038`) a tlačítko (`#c43f25`) kvůli kontrastu (kap. 8); na snímcích je starší, světlejší verze.

---

## 1. Pilíře stylu

- **P1 Vlaštovka je vždy vidět.** Je to jediná věc ve světě, která je *nakreslená*: bílý papír s grafitovou linkou. Všechno ostatní je vystřižené a nemá obrys. Čitelnost letu má přednost před ozdobou. (Převzato z 02 S1.)
- **P2 Všechno je papír.** Město je diorama z barevného kartonu, které by si dítě z Dílny postavilo na stole: tenké karty ve vrstvách, světlá řezaná hrana, vlákna papíru, měkký stín mezi vrstvami. Tvary jsou čisté a geometrické jako v Monument Valley, nedokonalost nese materiál (vlákna, zrno, natočené štítky), ne křivé tvary. (Tearaway, Paper Mario, Monument Valley.)
- **P3 Světlo vypráví cestu za sluncem.** Každá čtvrť je jedna denní doba s jednou náladou: ráno, poledne u moře, zlaté odpoledne, večer, za cílem úsvit. Hloubku dělá opar (vzdálené vrstvy světlejší a bližší barvě nebe), ne detail. (Alto's Odyssey.)
- **P4 Klid a jedna věc na obrazovku.** Pastely, vzduch, málo barev na scénu. Každá obrazovka má jeden vrchol pozornosti (let: vlaštovka; výsledek: vzdálenost; Atlas: pohlednice). Efekty jsou odměna, ne kulisa. (Převzato z 02 S4, Mini Metro.)

**Co hra není:** neon a kyberpunk (končí), fotorealistický papír s těžkými texturami, cestovní plakát (uživatel nechce), „levná kartonová krabice“ (ploché barvy bez řezané hrany, světla a stínu), tmavé UI, pastel bez kontrastu (vlaštovka a QTE vždy nad 3 : 1).

### 1.1 Varianty k rozhodnutí
| | **A Diorama za úsvitu (doporučuji)** | B Tiché protisvětlo |
|---|---|---|
| Věty | P1–P4 výše | P1 + „Svět jsou siluety v oparu, papír jen vlaštovka a UI“ + P3 + P4 |
| Jak vypadá | `desktop-let-1-strechy.jpg`: barevné karty, okna-výřezy, stíny mezi vrstvami, opar v dálce | blíž `research/design/img/smery/e-1-predmesti-vysledek.png`: město jako tmavé siluety proti světlu |
| Plus | splní všechny tři reference, které se uživateli líbí; papírová vlaštovka patří do papírového světa | nejlevnější, nejklidnější |
| Minus | víc práce (materiál, stíny) | ztrácí „svět z papíru“ (Tearaway, Paper Mario), podobá se Alto |

---

## 2. Paleta

Obrázek: `img/papir/paleta.png`. Pravidlo: **každá role má jednu barvu**, odstíny jen jako `mix()` z tokenu (převzato z 02). Tokeny ve třech vrstvách: primitivní (hex) → role → komponenty (kap. 8).

### 2.1 Primitivní tokeny (`prototype/styly/papir-data.js TOKENS`, `papir.css`)

| Token | Hex | Kde |
|---|---|---|
| `paper` | `#ffffff` | vlaštovka (horní plochy) |
| `cream` | `#fbf6ec` | karty UI, disk QTE, mraky `#fffaf0` |
| `card` | `#f4ecdc` | druhá plocha UI, cedule Dílny |
| `graphite` | `#2a2622` | **jediná tuš:** obrys vlaštovky, stopa, text, štítek události |
| `pencil` / `pencil-700` | `#6b6158` / `#4a4038` | popisky na kartách / malý text na stole |
| `desk` | `#d9c4a0` | pozadí stránky (stůl, kraft) |
| `kraft-600` | `#9c7a55` | kmeny, kolejové lože |
| `tape` | `#efe0a8` | lepicí páska, podtržení aktivní záložky |
| `tomato` / `-600` / `-700` | `#d9472b` / `#c43f25` / `#a8341e` | perfekt; hlavní tlačítko; hrana tlačítka |
| `teal` | `#13807d` | úspěch |
| `mustard` / `-800` | `#e2a43a` / `#8a5a00` | hodnota (mince); text hodnoty |
| `cobalt` | `#2456c9` | fokus klávesnice |
| `warm-grey` | `#8c8379` | minutí, stopa kruhu QTE |
| `shade` | `#3b3560` | barva stínů (studená fialová, alfa 20–30 %) |

### 2.2 Role

| Role | Barva | Proč |
|---|---|---|
| Hráč (vlaštovka) | `paper` + obrys `graphite` 2,6 px, spodní plochy `#cdd3e3` | P1: jediná nakreslená věc |
| Stopa letu | `graphite` čárkovaná (čárka 1,5 m, mezera 0,9 m), alfa 0,85 | P1, P2: „dráha nakreslená tužkou“; ve dne ≥ 6,7 : 1 |
| Úspěch | `teal` | jedna barva pro „povedlo se“ |
| Perfekt | `tomato` + tvar hvězdy | stav nikdy jen barvou (02); magenta končí s neonem |
| Hodnota | `mustard` (ikona), `mustard-800` (text) | **„hořčicová jen hodnota“**: nástupce pravidla „zlatá jen hodnota“ z 02 |
| Minutí | `warm-grey` | minutí je vtip, ne trest |
| Varování („Get ready“) | štítek `graphite` s krémovým textem | nejsilnější kontrast, bez nové barvy |
| Fokus | `cobalt` 3 px | jediná studená sytá barva v UI, nepoplete se s rolí |
| Nebezpečí | žádná barva | hra nemá trest (02) |

### 2.3 Čtvrti a denní doby

Čtvrť 1 je navržená a ověřená v prototypu. Čtvrti 2–4 jsou **prozatímní** (z prototypu 04, upravené k pilířům), navrhnou se až po zahrání čtvrti 1.

| | 1 Ráno (navrženo) | 2 Poledne u moře (prozatímní) | 3 Zlaté odpoledne (prozatímní) | 4 Večer s lampiony (prozatímní) | Úsvit za cílem |
|---|---|---|---|---|---|
| Nebe shora → obzor | `#78b4dc` `#a6d0e8` `#d8e9ea` `#fce4c6` (plynule, zastávky 0 / 0,42 / 0,74 / 0,9) | `#4fa3d1` `#7cbde0` `#b5dbe9` `#e9f2ef` | `#f1b45a` `#f6cb7c` `#f9dfa6` `#fbeccc` | `#1d2b4d` `#2b3f6b` `#4a5f8f` `#e08a74` | `#9ab8f0` `#ffd0e0` `#fff0b0` |
| Slunce | `#fff8e8`, záře `#ffd9a8`, vpravo nahoře | vysoko, bílé | velké nízko | měsíc `#f6eedd` | na obzoru |
| Opar (nízko / vysoko) | `#f6e6d2` / `#cfe2ec`, 20–700 m, max 0,72 | `#d7e9ef` | `#f7dcae` | `#3a4a73` | |
| Ulice (blízko) | `#e8735a` `#f2b65a` `#5aa6a0` `#f4ece0` `#e98fa0` `#7f9ed6` `#f0a27a` `#9cc3a6` | `#22355e` `#c8a079` `#f6eedd` `#e0533a` | `#b8863b` `#f6eedd` `#e0533a` `#8fb07a` | `#1d2b4d` `#26365c` + lampiony `#f2c14e` | |
| Střed | `#e9b9a5` `#c6d8c0` `#b6c9e4` `#f0d59e` `#e2bfd5` `#f2c7a8` | `#3d6f8f` `#e8b03e` `#5b8fb0` | `#d9a35a` `#c98a4a` `#e0b070` | `#2b3f6b` `#33497a` `#5a4a7a` | |
| Dálka, kopce | `#a9b6d6` `#b4b1d4` `#a7bdd6`; kopce `#b3c3dc` `#bfc6e0` | `#9ec2d6` | `#d9967a` | `#3a4a73` | |
| Střechy | `#3d4f7a` `#b5503c` `#6a5a8e` | `#22355e` | `#7a3b2e` | `#151f38` | |
| Zeleň, kmen | `#7fb08a` `#5f9e86` `#a8c48a` `#8fbf9a`, `#9c7a55` | | | | |
| Země (blízko / střed / dálka) | `#dcc29b` / `#e8d6b8` / `#efe3cf` | `#c8a079`, moře `#2c6e9b` | `#b8863b` | `#1d2b4d` | |
| Stopa | `graphite` | `graphite` | `graphite` | `cream` (večer obráceně) | `graphite` |

Pravidla:
- **Jedna nálada na čtvrť, plynulý přechod mezi místy** (jako dnes `moodAt` se `smooth`). Kontrast kolem vlaštovky se nemění skokem. **P3, P1.**
- **Teplé světlo, studený stín** ve dne (stín `#3b3560`), večer obráceně (studené nebe, teplé lampiony). **P3.**
- **Zelená je povolená** (zahrady, stromy). Zákaz zelené z 02 se ruší, patřil k neonové paletě. **P2.**
- **Večer (čtvrť 4) je jediná tmavá čtvrť;** vlaštovku tam drží bílá výplň (04: 6,6 : 1), stopa se obrací na krémovou. Večerní světlo nesou lampiony z hedvábného papíru místo neonu. **P1, P3.**

### 2.4 Změřené kontrasty

Vlaštovka je změřená **z vykresleného snímku** (`__papir.measure()`: pixely, které zmizí, když vlaštovku i její stín skryjeme, okolí 48 × 48 CSS px; 4 místa × 4 okamžiky letu + Dílna, událost, výsledek, na 3 šířkách):

| Dvojice | Poměr | Verdikt |
|---|---|---|
| Obrys vlaštovky × okolí (nejhorší ze 60 měření) | **6,4** (desktop 7,0–9,6, telefon 6,4–8,8, na šířku 6,6–9,3) | drží vlaštovku všude |
| Výplň vlaštovky × okolí | 1,29–1,71 | splývá s ranním nebem, nese to obrys (pravidlo „dvojí hrany“ splněno jednou hranou, kap. 5) |
| Stopa `graphite` × nebe `#78b4dc` / `#a6d0e8` / `#fce4c6` | 6,7 / 9,2 / 12,1 | dobré |
| QTE na krémovém disku 95 % (nejhorší přes pásy nebe) | stopa 3,35, úspěch 4,28, perfekt 3,86, bod 13,5 | vše ≥ 3 : 1 |
| Text `graphite` × `cream` | 13,9 | AAA |
| Popisek `pencil` × `cream` | 5,6 | AA |
| Text hodnoty `mustard-800` × `cream` | 5,5 | AA |
| Úspěch `teal` × `cream` („New best“) | 4,4 | AA velký text, jinak těsně pod |
| Tlačítko `cream` × `tomato-600` | 4,8 | AA (původní `tomato` 4,0 jen pro velký text) |
| Malý text `pencil-700` × `desk` | 5,9 | AA (`pencil` na stole jen 3,6, proto nepoužívat) |
| Fokus `cobalt` × `desk` / `cream` | 3,8 / 6,0 | grafika ≥ 3 : 1 |

---

## 3. Tvar, materiál a měřítko

**Karty.** Každá budova je tenká karta (diorama): hloubka ulice 4 m, střed 6 m, dálka 12 m; přední hrana zůstává tam, kde ji má `cityChunk`, takže rozložení hry se nemění (`papir-data.js placeCards`). **P2.**

**Materiál papíru** (`papir.js paperMaterial`, jeden shader pro celé město):
- **čelo** = barva karty, nahoře o 5 % světlejší (světlo shora);
- **horní řez** (plochy s normálou nahoru) = světlé jádro kartonu, `mix(barva, #fffaf0, .55)`: tenká světlá linka na hraně, která říká „tohle je papír“ místo obrysu;
- **boky a odvrácené střechy** = `mix(barva, #5b4f7a, .3)`, přivrácené ke slunci lehce světlejší;
- **vlákna**: 3 oktávy šumu ve světových metrech (perioda ~1,1 m, 0,27 m, 0,08 m), síla ±7 % jasu, na zemi 5 %, na mracích 4 %. Statická, nehýbou se s kamerou. **P2.**
- **žádné obrysy světa, žádný půltón, žádná posterizace, žádná toon rampa** (vše z 02 S2 končí).
- **Výjimka: dítě** (jediná plastická postava, kap. 9.4) má vlastní plynulejší rampu po stěnách (`kidMaterial`), aby byly vidět jeho stěny. Pořád jeden plochý tón na stěnu, vlákna, žádný lesk ani obrys.

**Tvarosloví (Monument Valley):** kvádry, sedlové střechy se štítem ke kameře (70 % malých domů v ulici, 35 % ve středu, 40 % v dálce), jehlany jen na kopcích a nádržích, kotouče (stromy jako papírový kotouč na kmeni, hlavy postav, balóny, mraky ze tří kotoučů, větrníky jako čtverec natočený o 45°), vlaječky jako trojúhelníky. Okna jsou **malé tmavé výřezy** `mix(barva stěny, #3d4f7a, .6)`, ve středu větší a řidší, v dálce žádná (jen silueta). Dveře jen v ulici. **P2, P4.**

**Hustota detailu podle hloubky:** ulice = okna, dveře, komíny, prádlo, vlaječky, lidé, auta; střed = okna, komíny, antény, stromy; dálka = siluety (výška × 0,42 proti dnešku, aby ráno nad předměstím nebyly věže metropole), kopce. **P3, P4.**

**Měřítko vlaštovky:** za letu desktop 58–59 CSS px, na šířku 36–37 px, telefon 21 px (kamera hry, `PLANE_SCALE 7,75`). **Rozhodnuto:** na úzkých obrazovkách o 15 % větší (≈ 24 px) a za letu na telefonu nikdy pod 24 px (06, „Začátek hodu“ bod 3). Při míření a oddálení platí M-2 (kap. 3.1).

**Obrys vlaštovky:** razítkem (`toon.stampOutlineMaterial`, 8 směrů) 2,6 px `graphite` na všech šířkách a kvalitách; přehyb tenkou linkou `pencil`. **Obrys je vždy grafitový** na všech papírech, modelech a skinech; jen Kraft smí 2,9 px (kap. 17.3). Žádný druhý obrys, žádná jiná barva obrysu (06, „Odemykatelný obsah“ bod 8; ruší hnědý, indigový a magentový obrys z `01-papiry.md`).

### 3.1 Jedno měřítko světa (schváleno 14. 10.)

Obrázky: `img/start/dnes.png` (dnes: dítě 11,75 m, stejně vysoké jako dům), `img/start/zaber.png` (šířka záběru při míření 8 / **16** / 55 m). Zdroj: `research/start/02-misto-odhodu-vzhled.md` kap. 2.

- **M-1 Svět, Dílna i dítě mají skutečné míry** podle katalogu 11 kap. 1.1: patro 3 m, přízemí 3–3,5 m, okno 1,2 × 1,4 m, dveře 1,1 × 2,2 m, člověk 1,7 m, **dítě 1,2 m** (model `person` × 0,7), zábradlí 0,95 m. Výjimky „dílenské okno 11 m“, „dveře 4,2 × 6 m“ a „dítě × `S = 0,25`“ končí. **P2:** v diorámatu z papíru vypadá obří dítě jako chyba, ne jako stylizace.
- **M-2 Vlaštovka je jediná výjimka a její velikost se řídí obrazovkou, ne světem.** V ruce dítěte má **0,5 m** („velká hračka“), během oddálení po výhozu plynule roste na velikost letu (7,75 m, na úzké scéně × 1,15). Růst je mocninou šířky záběru `W`: `L(W) = 0,5 · (W / W_aim)^k`, kde `k = ln(L_let / 0,5) / ln(W_let / W_aim)`; na desktopu (16 m → 120 m) `k = 1,36`. Na obrazovce vlaštovka během oddálení roste ze 40 na 83 px (1280 px) a nikdy není vedle dítěte velká, protože je v tu chvíli metry daleko. Za letu na telefonu vždy ≥ 24 px. Fyzika a QTE se nemění (pro fyziku je vlaštovka bod, kruh QTE je v UI vrstvě). Přesný průběh a tlumení vlastní game design (`research/start/01-zacatek-a-kamera.md` §3.7, dávka S3). **P1:** vlaštovka je jediná *nakreslená* věc, smí se řídit obrazovkou.
- **M-3 Ruka dítěte je ve výšce výhozu fyziky, 12 m.** Podlaha pavlače je tedy 10,6 m (ruka 1,4 m nad chodidly při nápřahu). Délka letů se nemění (06 bod 4).
- **M-4 Hrdina zblízka má víc detailu (LOD H).** Při míření je 80 px/m (desktop) a 54 px/m (telefon na výšku), 12× víc než ulice za letu. Pro dioráma startu platí **LOD H**: nejmenší detail 0,03 m (rám okna, klika, tužky na stole, řez papíru na hraně střechy). Domy ulice do ~150 m od startu jsou v záběru míření ~6× zvětšené (42 px/m), patří jim plný LOD 0 včetně rámů a parapetů. Karty a rozpočet: katalog 11, skupina G2b.

| Záběr | Šířka záběru | Dítě 1,2 m | Vlaštovka |
|---|---|---|---|
| **Míření** (polodetail, sklon −8°) | **16 m**, telefon na výšku **7 m** | 96 px / telefon 64 px | 0,5 m: 40 px / 27 px |
| Let | 120 m (telefon náčrt 70 m) | – | 7,75 m: 83 px / ≥ 24 px |
| Menu | 25–43 m (koncept 2: 28 m) | 36–62 px (54 px) | krouží po křivce |
| Panel Dílny (stůl v řezu) | ~5 m | – | na stole, celý potisk |

Spočteno z kamery hry v Node (`pose.project`, `geometry.follow`, fov 20°), v prohlížeči **NOT ASSESSED**.

---

## 4. Světlo, opar a denní doba

- **Obloha je plynulý přechod** (japonské *bokashi*, Alto), ne posterizované pásy. Slunce = papírový kotouč s tenkým světlým lemem a velkou měkkou září (poloměr záře 9× kotouč). Kreslí se jednou do plátna při změně velikosti, ne každý snímek. **P3.**
- **Opar podle hloubky** (Alto): barva vrstvy se mísí do barvy oparu podle vzdálenosti za rovinou letu, `max · ((−z − 20)/680)^0,8`, max 0,72; barva oparu jde od `low` u země k `high` ve 160 m. Výsledek: střed ~18 %, dálka ~50 %, kopce ~60 %. Vrstvy se odliší hodnotou, ne detailem. **P3, P4.**
- **Světlo je stylizované dioramatické:** jeden směr ke slunci `[.62, .5, .6]` (vpravo, nahoře, ke kameře) jen pro odstín boků a stíny. Žádná směrová světla three.js, žádné stínové mapy (kap. 5).
- **Stíny jsou měkké, krátké a studené:** barva `shade #3b3560`, alfa ulice 20 %, střed 16 %, dálka 11 %, vlaštovka 30 %, mraky 12 %. Délka stínu nezávisí na skutečné vzdálenosti vrstev (ta je ve hře 84–270 m), ale na stylizované hloubce: posun `(−0,07; −0,045) · dz`, měkkost `0,022 · dz`, `dz` max 140 m. Vypadá to jako papírové kulisy blízko u sebe. **P2.**
- **Post-proces:** jen zrno papíru (3,5 %, **statické**, papír nešumí v čase), teplý tón `#fffaf2` a vinětace 0,14. Žádné rozmazání, bloom ani posterizace.
- **Zadržení dechu při události zůstává** (`breath`): pozadí ztratí sytost, vlaštovka a QTE ne. **P4.**
- **Den jde dál po čtvrtích** (kap. 2.3), večer svítí lampiony z hedvábného papíru (teplé průsvitné výřezy), ne okna v neonových barvách.

---

## 5. Měkké stíny a výkon

Měkké stíny byly v 04 největší riziko pro telefon (shadow map 2048², PCFSoft). Navrhuji techniku, která využívá to, že město jsou **ploché vrstvy rovnoběžné s kamerou**:

**Siluety vrstev (doporučeno).** Při stavbě místa (ne každý snímek) se z karet jedné vrstvy spočítá **profil výšek** `h(x)` (vzorek po 1 m, sjednocení všech karet, rozmazání klouzavým průměrem přes šířku polostínu). Z profilu vznikne jeden pruh trojúhelníků. Shader ho posune podle světla a ztmaví vše pod profilem s měkkým horním okrajem `1 − smoothstep(−pen, pen, y − h)`. Kam stín smí padnout, určuje **stencil**: každá vrstva při kreslení zapíše své id (dálka 1, střed 2, ulice 4, země 8, mraky 16, balóny 32), stín ulice se kreslí jen tam, kde je id ∈ {nebe, dálka, střed} (maska `0xFC`), stín středu jen na dálku a nebe (`0xFE`), stín dálky jen na nebe (`0xFF`). Překryvy se nesčítají (jeden profil na vrstvu), stín nikdy nepadne na zem ani na vrstvu před sebou. Stín vlaštovky = její vlastní trojúhelníky posunuté o (−2,8; −1,8) m těsně za ní, maska `0xF8`. Stíny mraků = měkké elipsy jen na nebe. Kód: `papir-data.js skyline / skylineStrip / shadowOffset / ID / SHADOW`, `papir.js skylineShadowMaterial / blobMaterial`.

| Technika | Náklady (odhad) | Změřeno (prototyp, let nad místem 1 a 2) | Vzhled | Verdikt |
|---|---|---|---|---|
| Bez stínů | 0 | 14–17 draw calls, 7,4–11 tis. △, GPU 5,48–5,49 ms (1200 × 675), 1,07–1,15 ms (433 × 243) | ploché, „krabice“ (`stiny-1-zadne.jpg`) | jen kvalita 0 (stín vlaštovky zůstává) |
| **Siluety vrstev + stencil** | +3 draw calls na místo, +1,2–1,8 tis. △ na místo, nic za snímek, průhledné pásy přes ~40 % obrazu | 21–25 DC, 10–14 tis. △, GPU **+0,03–0,09 ms** | měkké, klidné, nikdy neplavou (`stiny-2-siluety.jpg`) | **doporučuji** |
| Blob (vlaštovka, mraky) | 1 DC na skupinu | v řádku výše | jemný, „zvednutý papír“ | součást doporučení |
| Shadow map 1024², PCF, jen ulice | shadow pass casterů každý snímek, mapa jede s kamerou | 21–25 DC, 17–23 tis. △, GPU +0,07–0,1 ms | tvrdší, plave s kamerou, akné | ne |
| Shadow map 2048², PCFSoft, vše (04) | dvojnásobek △, 2048² hloubka, mnoho vzorků na pixel | 28–33 DC, 21,5–25,7 tis. △, GPU +0,06–0,3 ms (na telefonním rozlišení +27 %) | realistické, tmavší, ztrácí opar (`stiny-3-shadowmap.jpg`) | ne (nejdražší) |
| Zapečené světelné mapy | UV a výpočet pro každé místo | neměřeno | nejlepší | ne: město se generuje, žádné UV |

Měřeno v Chrome na notebooku (okno viditelné, `EXT_disjoint_timer_query_webgl2`, 120 snímků). **Telefon NOT ASSESSED** (iPhone 15 Pro ani jiný telefon nebyl k dispozici; číslo „433 × 243“ je telefonní rozlišení na notebooku, ne telefon). Velkou část GPU času (5,5 ms na 1200 × 675) tvoří MSAA 4× a post-proces, ne stíny.

Trojúhelníky na místo (karty + život + stíny): 4,9 / 8,6 / 3,4 / 3,9 tis., obloha 3,6 tis. Draw calls na místo: země, dálka, střed, ulice a 3 stíny = 7. Rozpočet 14 DC a 15 tis. △ na místo (`.claude/rules/render3d.md`) platí s rezervou.

**Kvalitativní úrovně** (návrh pro `src/render3d/quality.js`, dnes neexistuje, `plan.quality` je jen číslo 2):

| Úroveň | Kdy | Co |
|---|---|---|
| 0 nízká | slabý telefon, P95 > 33 ms 2 s po sobě | DPR 1, bez MSAA, bez siluetových stínů (stín vlaštovky zůstává), bez vláken a zrna; opar zůstává |
| 1 střední | výchozí na telefonu (dotyk, šířka < 900 px) | DPR ≤ 1,5, MSAA 2×, stín jen ulice → dál, stín vlaštovky, vlákna, zrno |
| 2 vysoká | výchozí na desktopu | vše: 3 vrstvy stínů, stíny mraků, MSAA 4× |

Pokles úrovně automaticky (P95 snímku), nikdy nahoru během letu; čitelnost (obrys vlaštovky, QTE) je na všech úrovních stejná. **P1.**

---

## 6. Hierarchie čitelnosti

Pořadí: **vlaštovka a stopa > QTE a nejbližší událost > ulice > střed > dálka a obloha.** **P1, P4.**

1. **Dvojí hrana** (z 02): výplň nebo obrys vlaštovky ≥ 3 : 1 proti okolí v každé čtvrti, změřené z pixelů. Ve dne nese vlaštovku obrys (6,4–9,6), večer výplň. Ráno výplň sama splývá (1,3–1,7), proto **obrys nesmí nikdy zeslábnout pod 2,6 px** ani zmizet s mlhou/oparem (vlaštovka opar nemá).
2. **Nic ve výšce letu nemá kombinaci „bílá + grafit“.** Mraky jsou krémové bez obrysu a výš než pás letu; pára z ventilace a kouř z komínů jsou krémové obláčky s alfou ≤ 0,6 a nejvýš ⅓ vlaštovky na obrazovce, kouř jen na komínech ≥ 200 m od ruky (S-6); žádná jiná grafitová čára v pásu letu kromě stopy a poryvu (poryv je krémový proužek s grafitovým lemem a krátce, jen během události).
3. **Stín vlaštovky** (30 %) jí dává druhou hranu proti světlému nebi a ukazuje „zvednutý papír“. Nesmí být tmavší než obrys.
4. **Opar dělá pozadí tiché:** dálka a kopce mají kontrast proti nebi < 1,5 : 1, ulice nejsytější. Hodnota (světlost), ne detail.
5. **HUD nesmí zakrýt pás letu.** Na telefonu je štítek místa **pod scénou**, ve scéně jen malý štítek vzdálenosti vpravo nahoře (`mobil-udalost.jpg`); vlaštovka letí v levé části obrazu (px 148/640).
6. **QTE nad vším:** krémový disk 95 % se stínem zvednutého papíru (kap. 11).
7. **Při míření je za vlaštovkou vždy nebe** a kolem ruky nic bílého ani grafitového (zábradlí tmavomodré, čepice dítěte kraftová): kap. 9, S-1 až S-3 a S-6.

Kontrolní test (pro art-review): snímek do šedi a zmenšit na 25 %. Vlaštovka a stopa musí být první, co oko najde (v prototypu splněno díky grafitu na světlém pozadí; večerní čtvrť NOT ASSESSED).

---

## 7. Efekty a pohyb

| Efekt | Papírové pojetí | Čísla (z dneška) | Reduced motion |
|---|---|---|---|
| Rychlostní čáry | tenké grafitové **čárky tužkou** (1 px, alfa 0,5), vynechat pás ±24 px kolem vlaštovky | od 40 m/s, 6–24 čar, „on twos“ 12 fps | vypnuté |
| Úspěch | 6–10 **papírových útržků** v `teal` a krémové, padají a točí se | hitstop 0,05 s | útržky bez pohybu (zablesknou a zmizí), hitstop zůstává |
| Perfekt | rajčatová **hvězda** vystřižená z papíru + útržky, záblesk krémový alfa 0,18 | hitstop 0,09 s, ≤ 1 Hz | bez záblesku a pohybu, hvězda zůstane 0,6 s |
| Milník, mince | hořčicové kolečko s grafitovým lemem | | bez stoupání |
| Dopad | vlaštovka se lehce zmačká (squash z `pose.js`) a sklouzne | hitstop 0,12 s | bez otřesu |
| Popupy | **papírové štítky** (krém, lehce natočené, stín zvednutí), písmo `--display` | život 1,1 s, náběh 0,25 s | bez škálování a stoupání |
| Poryv (událost) | zvlněné krémové proužky s grafitovým lemem (`desktop-udalost-qte.jpg`) | jen během události | statické proužky |
| Holub | origami holub (skládaný papír, šedomodrý) | | |
| Kouř z komínů | **ploché krémové obláčky** (kotouč o 8 stěnách, `PAPIR.steam`), ¼ komínů, jen ≥ 200 m od ruky (S-6) | ⌀ 0,8 → 2,2 m, alfa 0,5, 5 obláčků na komín, život 3,2 s, stoupá 1,3 m/s, vítr 0,9 m/s po směru praporku, „on twos“; ≤ 64 obláčků, 1 DC (03-art kap. 3.3) | obláčky stojí (sloupek zamrzne) |
| Prostředí | „on twos“ 12 kreseb/s (stop-motion papíru sedí ještě víc než ke komiksu) | | prostředí zamrzne |

Pravidla: efekt je odměna (vypuštění < úspěch < perfekt < milník); barva efektu = role (kap. 2.2); blikání ≤ 3 Hz na velké ploše; reduced motion: pohyb pryč, informace zůstane (převzato z 02). **P4, P1.**

---

## 8. UI a typografie

Celé UI je **papír na stole**: stránka je kraft `desk`, panely jsou krémové karty se stínem zvednutého papíru, štítky jsou lehce natočené (±1–1,5°), některé přidržuje lepicí páska. Tvrdé tušové rámy a indigo z 02 končí. Maketa: `papir.css`, snímky `desktop-*.jpg`, `mobil-*.jpg`.

**Tokeny ve třech vrstvách** (jako `style.css` dnes): 1 primitivní (`--graphite-900`, `--cream-50`, `--tomato-600` …), 2 role (`--ink`, `--text`, `--dim`, `--dim-on-desk`, `--card`, `--desk`, `--color-success`, `--color-perfect`, `--color-reward`, `--color-reward-text`, `--color-miss`, `--focus`, `--display`, `--body`, `--hand`, `--lift`, `--lift-hi`, `--r 4px`, `--t-fast`, `--t-mid`), 3 komponenty (`--btn-*`, `--tag-bg`, `--tape`, `--qte-*`). Komponenty čtou jen vrstvu 3 nebo 2.

**Typografie:**
- `--display` (nadpisy, čísla, tlačítka): Trebuchet MS → Segoe UI Semibold → Avenir Next, tučně, čísla `tabular-nums`. Humanistické bezpatkové „z popisky na krabici“. **Žádné monospace, žádné zúžené verzálky z plakátu.**
- `--body`: Segoe UI → Avenir Next → system-ui.
- `--hand` (Segoe Print → Bradley Hand): **jen jedna krátká řádka na obrazovku** (podtitul, „Delivered.“, podpis pohlednice). Nikdy čísla, tlačítka ani důležitý text.
- Malý text jen na krémových kartách nebo `--dim-on-desk` na stole (kap. 2.4).
- Otázka: vlastní písmo (např. oblé humanistické OFL jako soubor `.woff2`) místo systémových, kap. 16.

**Prvky:** tlačítko hlavní `tomato-600` s krémovým textem a tmavší spodní hranou 4 px (zvednutý papír), stisk = posun 3 px; vedlejší krémové; min. 48 px (malé 44 px). Fokus: obrys `cobalt` 3 px, odsazení 3 px. Štítky HUD: krém, malé verzálky `--dim` + velká čísla `--text`. Mince: hořčicové kolečko s grafitovým lemem. Komiksové bubliny (Bolts, hlášky): krémová karta s ocáskem, bez tušového rámu. Stav nikdy jen barvou (tečky úrovní + text).

**HUD na telefonu:** štítek místa pod scénou, vzdálenost vpravo nahoře, nic vlevo nahoře (kap. 6).

---

## 9. Místo odhodu: podkrovní dílna v řezu

> **Schváleno 14. 10. 2026** (06, „Začátek hodu, místo odhodu a kamera“ body 1–7; koncept 2 z `research/start/02-misto-odhodu-vzhled.md`). **Nahrazuje** dřívější Dílnu PAPER LAB (dům 24 × 12 m s tyrkysovým přístavkem, dítě 11,75 m, kamera `restCamera` 244 m), kartu 5 v katalogu 11 a model K4 `workshop`. Mechanika startu a kamera podle rychlosti: `research/start/01-zacatek-a-kamera.md`. Karty modelů H1–H6 a rozpočet: katalog 11, skupina G2b.

Obrázky (`img/start/`): **ano** `koncept-2-podkrovi.png` (míření, oddálení, menu; 16 : 9 a telefon na výšku), `zaber.png` (16 m), `vyhled.png` (pás výhledu); **ne** `dnes.png` (obří dítě, kamera 244 m, nic neříká „odtud se hází“).

### 9.1 Co to je
Úzký krémový dům s rajčatovou sedlovou střechou na nízké opěrné zdi nad ulicí místa 1 (zeď 1,1 m + přízemí 3,5 m + 2 patra = podlaha podkroví 10,6 m). **Podkroví je rozříznuté jako domeček pro panenky:** přední stěna chybí a řez střechy ukazuje světlé jádro kartonu (P2: „tohle je papír“). Uvnitř je dílna dítěte: stůl s lampou a stohy papíru, police s rolemi papírů, nástěnka s pohlednicemi z Atlasu, hotové vlaštovky na provázku. Z boku podkroví vedou půdní dveře na **pavlač** s tmavomodrým zábradlím; na ní stojí dítě. Nad pavlačí trčí **trám s kladkou** a košíkem papírů (místo pro hák Crane Lift). Pod podkrovím visí papírová cedulka PAPER LAB (krémová, grafitové písmo, rajčatové podtržení), ne neon. **P2, P3** (hráč míří z domova ke slunci).

Dům zůstává krémový s rajčatovou střechou, aby ho hráč poznal i v novém tvaru. **Postup hry je vidět doma**, ne změnou denní doby (S-5): pohlednice na nástěnce přibývají s místy Atlasu, role na polici s druhy papíru (Copy, Kraft, Washi, Stříbrná fólie), hák jeřábu s úrovněmi Crane Lift.

### 9.2 Tři záběry, jedna scéna
Menu, míření i Dílna jsou **jedna boční kamera**, jen jinak blízko; mezi záběry kamera jede, nestřihá (výjimky: „Throw again“ pod kartou výsledku a reduced motion, 01 §2.3 a §3.8). Za hlavním menu je tahle scéna, ne nejvzdálenější čtvrť (06 bod 2, mění `07-menu.md` §2.1).

| Záběr | Šířka | Co je v obraze | Pravidla |
|---|---|---|---|
| **Úvod** (ustavující, rozhodnuto 15. 10.) | **30 m**, telefon na výšku 18 m, sklon +2° | dům s dílnou v řezu vlevo, dítě na pavlači vpravo od středu v póze klid, nebe a slunce vpravo | nápis „Throw it“ (a „Hold and release“) **nahoře v nebi nad hřebenem**, vodorovně na střed, grafit bez podkladu, s prvním stiskem zmizí (0,2 s). Nic nezakryje dítě a vlaštovku. Po prvním stisku jízda 0,6 s do míření, vstup se přijímá hned; úvod po spuštění a po Dílně / Atlasu, ne po „Hodit znovu“. Reduced motion: střih. Podrobně `03-art.md` kap. 2, obrázek `img/hratelnost/uvod-c.png`. |
| **Menu** (ustavující) | 25–43 m (náčrt 28 m), sklon +2° | celý domek v řezu, dítě na pavlači, slunce, kus města | dítě a dílna v **pravých dvou třetinách** (desktop, UI vlevo ve sloupci 27 %) nebo v pásu 25–60 % výšky (telefon, UI dole ~40 %), nikdy pod tlačítky. Vlaštovka krouží po křivce (07-menu §6). |
| **Míření** (polodetail) | **16 m**, telefon na výšku 7 m, sklon −8° | dítě od kolen nahoru, vlaštovka v ruce, zábradlí, kus podkroví a dveře vlevo, trám nad dítětem, nebe a slunce vpravo nahoře, střechy dole | **za vlaštovkou je vždy nebe** (obrys grafit × ranní nebe 6,7–12,2 : 1, změřeno z hex). Mířidla směřují ke slunci (P3). Kamera mírně zespodu, aby se dítě nekreslilo proti fasádám. HUD v rozích nezakrývá dítě ani oblouk mířidel. Ruka na (0,38; 0,60) obrazu, na výšku (0,40; 0,62). |
| **Oddálení** (po výhozu) | 16 → 120 m do 1,2 s | dům zůstane na levém okraji (červený štít v řezu), otevře se ulice | sklon se vrací z −8° na +6°; vlaštovka roste podle M-2; stopa začíná přesně v ruce. Dál šířka podle přebytku rychlosti (01 §3). |
| **Panel Dílny** | ~5 m | stůl v řezu, na něm zvolená vlaštovka s potiskem | panel vpravo (desktop) nebo dole (telefon); stůl je pozadí, ne druhá obrazovka (S7 v 01, nápad na později). |

### 9.3 Pravidla místa odhodu (S-1 až S-7)
- **S-1 Pás výhledu.** Do ~150 m za startem nesmí střed (vrstva −110 m) přesahovat výšku ruky + 1 m (**≤ 13 m**, dnes 17–38 m) a ulice do ~60 m před dítětem výšku ruky − 1 m (≤ 11 m). Dál výšky plynule rostou k dnešním. Mění rozložení místa 1 (`cityChunk(0)`, dávka S4), ne fyziku. Obrázek `img/start/vyhled.png`. **P3, P1.**
- **S-2 Hrana.** Dítě stojí u viditelné hrany (pavlač se zábradlím). Zábradlí a dveře jsou **tmavomodré `#3d4f7a`** (barva oken a střech čtvrti 1, `D1.window`), nikdy grafit. Zábradlí × ranní nebe 3,6–6,6 : 1 (čte se, ale slabší než obrys vlaštovky 6,7–12,2). **P1:** černá čára patří jen vlaštovce a stopě.
- **S-3 Dítě není bílé ani hořčicové:** pláštěnka `#f2b65a` (`D1.near[1]`), čepice skládaná z kraftového papíru `PT.kraft #c9a57c` s rajčatovým proužkem, nohy `#3d4f7a`, bez obrysu. Vlaštovka je vedle něj jediná bílá věc s grafitem (papír × čepice 2,3 : 1). **P1, „hořčicová jen hodnota“.**
- **S-4 Domov je jediné teplé světlo ve dne:** teplé sklo `#ffe2a8` (`PAPER_WARM`) jen v podkroví a oknech domu dítěte; lampa na stole smí svítit (teplý kruh jako okno).
- **S-5 Ráno vždy.** Místo odhodu je za úsvitu ve všech fázích hry (P3: cesta za sluncem začíná doma). Postup ukazují věci v diorámatu (kap. 9.1), ne denní doba.
- **S-6 Nic v pásu letu nepřebije vlaštovku.** Trám s kladkou, košík a praporek větru jsou nad nebo za dítětem, matné (kraft, páska), menší než vlaštovka na obrazovce. **V pásu výhledu místa odhodu nic nestoupá ani nelétá** (kouř, balóny, ptáci, drony): za dítětem je jen nebe, slunce, mraky výš než hřeben a střechy pod S-1. **Kouř z komínů** (rozhodnuto 15. 10., 06 bod 14) je jen papírový: ploché krémové obláčky (`PAPIR.steam`, alfa 0,5, nejvýš ⅓ vlaštovky na obrazovce), kouří ¼ komínů a **jen ≥ 200 m od ruky**, takže ho úvod, míření ani oddálení po výhozu neukáže. Čísla v kap. 7 a `03-art.md` kap. 3.3, obrázek `img/hratelnost/kour-papir.png`. Praporek větru je proužek pásky `PT.tape #efe0a8`, ne bílý. Hotové vlaštovky na provázku v dílně jsou barevné a **bez obrysu**; jediná bílá s obrysem je ta zvolená. **P1.**
- **S-7 Reduced motion:** dioráma stojí (žádné vlání praporku ani krouživá vlaštovka v menu, dítě nedýchá a nemává); kouř ve městě zamrzne. Přechody střihem nebo prolnutím 0,2 s (01 §3.8). Informace zůstává: směr větru ukazuje natočený praporek bez vlání.

### 9.4 Dítě
> **Rozhodnuto 15. 10. 2026 (06 bod 13): oblá figurka C.** Obrázky `img/hratelnost/postavicka-c.png` (tvar, velikosti ze hry, LOD 1, šeď), `postavicka-c-pozy.png` (pózy). Díly, klouby, pózy a rozpočet: `research/plan-hratelnost/03-art.md` kap. 1 (dávka H2). Nahrazuje „hlava kotouč, pláštěnka lichoběžník“ (ploché karty).

**Papírový model z mnoha dílků** (papercraft), **1,2 m**, karta H1 v 11: hlava, pláštěnka, čepice, ruce, nohy a boty jsou tuhé „soustružené“ díly s 6–16 stěnami (hlava a pláštěnka 16, čepice-kornout 12, ruce a nohy 8, dlaně a boty 6). Hlava ⌀ 0,34 m („hlavičková“ proporce jako Tearaway), čepice-kornout z kraftu s rajčatovým proužkem **nad očima**, vlasy jako skořápka vzadu na hlavě, oči dvě destičky na přivrácené straně. **Proč papír, ne plast (P2):** každá stěna má **jeden plochý tón** (žádné hladké stínování, lesk ani přechod uvnitř stěny), vlákna papíru jako zbytek města, žádný obrys.
- **Stínování po stěnách** (`kidMaterial`, výjimka z kap. 3): stěna ke kameře = barva dílu, k bokům plynule do `mix(barva, #5b4f7a, .32)`, přivrácené ke slunci o 0,08 světlejší, horní plochy jen `mix(barva, #fffaf0, .25)` (ne 0,55 jako řez karty: temeno a ramena nesmí zbělat vedle vlaštovky), spodní `mix(barva, #5b4f7a, .42)`. Ramena nemají vodorovnou plochu (pláštěnka končí kuželem ke krku).
- **Natočení ke kameře** (¾ pohled) 14–52° podle pózy, jinak by z boku byl vidět jen profil a objem by se ztratil.
- **Hází vzdálenější ruka** (jde za hlavou nahoru k bodu výhozu), blízká ruka ukazuje směr hodu. Obličej tak zůstane vidět. Dlaň vzdálené ruky je v míření přesně v bodě výhozu (M-3); ruka se nenatahuje, dítě neklouže.
- **Vlaštovku v ruce nic nezakryje** (P1): dokud ji dítě drží, kreslí se přes dítě.
- **LOD:** H **630 △** (míření 64–96 px, úvod na desktopu 51 px), LOD 1 **130 △** (dítě < 48 px: úvod na telefonu, oddálení), za letu 0. Jeden draw call s praporkem. Lidé ve městě (`person`) zůstávají ploší: hrdina je jediná plastická postava, protože je jediná zblízka (80 px/m proti 4–10 px).

Pózy: klid (úvod, obě dlaně s vlaštovkou před hrudí), míření, nabíjení (záklon a couvnutí jako dnes `kidPose`), výhoz (švih, trup se stočí za hodem), mávání po hodu, sed na pavlači (menu, pokud zůstane), u stolu (panel Dílny). Úhly v `03-art.md` kap. 1.7.

| Část | Barva | Token |
|---|---|---|
| pláštěnka | `#f2b65a` | `D1.near[1]` (dnes `PT.mustard`, mění se) |
| čepice | `#c9a57c` + proužek `#d9472b` | `PT.kraft` + `PT.tomato` (dnes `PT.paper`, mění se) |
| nohy | `#3d4f7a` | `D1.window` |
| boty, oko | `#4a4038` | `PT.pencil700` |
| kůže | `#f3d2b4` | `life.people.skin[0]` |

**Kontrast dítěte proti nebi je nízký** (pláštěnka 1,1–1,5 : 1, čepice 1,0–1,9 : 1 proti ranním pásům, změřeno z hex); dítě se odliší odstínem (oranžová × modrá) a tmavomodrýma nohama, ne hodnotou. Objem C pomáhá: tmavší boky po obvodu pláštěnky (≈ `#c29564`) mají proti nebi 1,65–2,16 : 1 (z hex) a v náčrtu v šedi na 64 px je dítě kompaktní tvar hned za vlaštovkou. To je v souladu s P1 (≥ 3 : 1 platí pro vlaštovku), ale čitelnost dítěte ve hře na telefonu v šedi je **NOT ASSESSED** (kap. 16.2).

### 9.5 Barvy diorámatu
Jen z tokenů a palety čtvrti 1, nové hexy nevznikají: stěna `PT.cream` (`PAPIR.workshop.wall`), střecha `PT.tomato`, řez střechy `mix(tomato, city.cut, .55)` jako horní řez karet (kap. 3), interiér podkroví o tón tmavší a méně sytý než fasáda (je ve stínu střechy; `mix(barva, city.side, .2)`), rámy oken, dveře a zábradlí `#3d4f7a`, deska pavlače a košík `PT.kraftDark #9c7a55`, opěrná zeď `D1.ground.near #dcc29b` (návrh 02 měl `#d9bf98`, sjednoceno na existující barvu), klika krémová `PT.cream` (dnes `PT.mustard`, mění se), provázky `PT.pencil` (dnes grafit, mění se).

---

## 10. Atlas a pohlednice

Pohlednice jsou **fotky dioramatu přilepené páskou do sešitu**: krémový okraj 10 px, měkký stín, natočení ±1,2°, kus pásky nahoře, podpis místa písmem `--hand` pod obrázkem (vzor: `research/design/img/smery/b-pohlednice.png`). Obrázek = záběr místa v barvách jeho čtvrti a denní doby (zdroj pravdy: paleta čtvrti v kap. 2.3, po implementaci `paper-mood.js`), bez půltónu a vzorů v nebi. Panel Atlasu je krémová stránka sešitu na stole; mapa trasy jako tužková čára s papírovými kapsami. Identitu čtvrti bez barvy nese název a silueta dominanty (převzato z 02). **P2, P4.**

---

## 11. QTE

- **Podklad:** jako ve hře dnes mezikruží ±9 px kolem kruhu (`ui-layer.drawQte`, `QTE_BASE`), střed zůstává volný, takže vlaštovka uvnitř kruhu nic neztratí. Nově krémový `cream`, alfa 0,95, se stínem zvednutého papíru (canvas `shadowBlur` 4 px, posun 3 px, `rgb(40 25 10 / .35)`). Prototyp kreslí plný disk vedle vlaštovky jen kvůli jednoduchosti (DOM), ve hře platí mezikruží kolem vlaštovky.
- **Stopa kruhu** `warm-grey` 6 px (3,35 : 1), **úspěch** `teal` 9 px (4,28), **perfekt** `tomato` 11 px (3,86) + rajčatová hvězda uprostřed, **bod** `graphite` (13,5).
- **Štítek** („GUST! Tap“): grafitová páska s krémovým textem, natočená −2°.
- Velikost a poloha kruhu se nemění (`eventView(type).ring`, kolem vlaštovky).
- Reduced motion: kruh se nezvětšuje, bod se posouvá (informace), žádné pulzování.

Měřeno z hex (disk smíchaný s nejsvětlejším i nejtmavším pásem ranního nebe). V pixelech ve hře NOT ASSESSED.

---

## 12. Názvy a nálady čtvrtí

Dnešní názvy nesou neon a noc (*Violet Suburbs*, *Neon Core*, „Night flight“, „Cut through the night“). Návrh tří sad (velkými písmeny jako v HUD):

| | Sada A: denní doba | Sada B: papír | **Sada C: světlo + jeden obraz (doporučuji)** |
|---|---|---|---|
| 1 | MORNING ROOFS / RANNÍ STŘECHY | PAPER SUBURBS / PAPÍROVÉ PŘEDMĚSTÍ | **SUNRISE ROOFS / STŘECHY ZA ÚSVITU** |
| 2 | NOON HARBOR / POLEDNÍ PŘÍSTAV | CARDBOARD DOCKS / KARTONOVÉ DOKY | **BRIGHT HARBOR / SLUNNÝ PŘÍSTAV** |
| 3 | GOLDEN FIELDS / ZLATÁ POLE | KRAFT HILLS / KOPCE Z LEPENKY | **GOLDEN FIELDS / ZLATÁ POLE** |
| 4 | EVENING CITY / VEČERNÍ MĚSTO | TISSUE CITY / MĚSTO Z HEDVÁBNÉHO PAPÍRU | **LANTERN CITY / MĚSTO LAMPIONŮ** |
| Proč | nejjasnější cesta za sluncem, ale suché | papír řečený slovy je zbytečný (svět ho ukazuje), CS dlouhé | denní doba + jedna konkrétní věc, kterou hráč uvidí; krátké; lampiony nahradí neon |

**16 míst (sada C).** Klíče (`place.<kind>`) zůstávají, mění se jen texty. Tučně = změna.

| # | Klíč | EN | CS |
|---|---|---|---|
| 1 | roofs | Workshop & First Roofs | Dílna a první střechy |
| 2 | market | **Market under the Bunting** | **Trh pod praporky** |
| 3 | garden | Gardens at the Edge | Zahrady na okraji |
| 4 | rail | Railway to the River | Železnice k řece |
| 5 | warehouse | Warehouses by the Water | Skladiště u vody |
| 6 | cranes | Crane Forest | Les přístavních jeřábů |
| 7 | bridge | Bridge over the Bay | Most přes záliv |
| 8 | lighthouse | Lighthouse at the Pier's End | Maják na konci mola |
| 9 | fields | Fields beyond the Bay | Pole za zálivem |
| 10 | turbines | **Windmill Ridge** | **Hřeben větrníků** |
| 11 | peaks | Mountain Saddle | Horské sedlo |
| 12 | observatory | Observatory above the Valley | Observatoř nad údolím |
| 13 | gate | **Gates of the Lantern City** | **Brány Města lampionů** |
| 14 | terraces | Sky Terraces | Zahrady ve výškách |
| 15 | tower | **Clock Tower** | **Hodinová věž** |
| 16 | port | Rooftop Harbor | Střešní přístav |

**Věty míst a úvod, které nesou noc nebo neon** (návrh, mění product-designer přes i18n):
- `place.roofs.story`: „Out of the Workshop window and over a **waking** street.“ / „Z okna dílny vyrážíš nad **probouzející se** ulici.“
- `place.market.story`: „Past the houses, a square opens up with a **morning** market.“ / „Za domy se otevírá náměstí s **ranním** trhem.“
- `place.turbines.story`: „**Paper windmills** turn above the fields.“ / „Nad poli se točí **papírové větrníky**.“
- `place.gate.story`: „Down from the hills you reach the gates of the **lantern city**.“ / „Z kopců přilétáš k branám **města lampionů**.“
- `place.tower.story`: „You pass the **clock tower**, the bright point of the whole journey.“ / „Míjíš **hodinovou věž**, světelný bod celé cesty.“
- `intro.eyebrow`: „SUNRISE ROOFS / MORNING FLIGHT“ / „STŘECHY ZA ÚSVITU / RANNÍ LET“; `intro.line1`: „Aim. Charge. **Fly toward the sun.**“ / „Zamiř. Nabij hod. **Leť za sluncem.**“; `intro.line2`: „… **to the lantern city**.“ / „… až **do města lampionů**.“
- Mimo tento úkol, ale nesedí: „Cyber pigeon courier“, robot Bolts, Ad Drone, neonové reklamy (`geometry.SIGNS`), hudba „Neon Glide“. Návrh: Paper pigeon / papírový holub, Bolts jako plechový robot zůstává (vtip), Ad Drone jako papírový drak s reklamní stužkou. Rozhodne product-designer.

Nálady čtvrtí: kap. 2.3.

---

## 13. Pravidla pro nové prvky (kontrolní seznam)

1. **Silueta** čitelná v malém (25 %, šeď); dominanta místa poznat do 1 s; tvar čistý (kvádr, štít, kotouč, trojúhelník). (P2, P4)
2. **Materiál:** papírový shader (čelo, řezaná hrana, boky, vlákna, opar). Žádný obrys, žádná textura s detailem, žádná emise kromě lampionů a okna Dílny. Jediná výjimka je rampa po stěnách dítěte (kap. 9.4). (P2)
3. **Paleta:** jen tokeny kap. 2.1 a barvy čtvrti kap. 2.3; nová barva = nový token se jménem role. (P3)
4. **Vrstva a stencil:** prvek patří do jedné vrstvy (ulice / střed / dálka / nebe) a zapisuje její id; jinak by na něj padaly špatné stíny. (P2)
5. **Hierarchie:** ve výšce letu nic bílého s grafitem; nic většího a světlejšího než vlaštovka v pásu letu. (P1)
6. **Kontrast:** text ≥ 4,5 : 1, grafika ≥ 3 : 1, vlaštovka podle dvojí hrany, změřeno z pixelů. (P1)
7. **Rozpočet:** na místo ≤ 14 draw calls a 15 tis. △ (dnes 7 DC a 3,4–8,6 tis. △), scéna ≤ 120 DC; nic nealokovat za snímek; vše `dispose`. Statické věci do sloučené geometrie vrstvy.
8. **Pohyb:** varianta reduced motion; blikání ≤ 3 Hz; prostředí „on twos“.
9. **Telefon:** snímek 375 × 667 a 932 × 430; HUD mimo pás letu.
10. **Text:** přes i18n EN i CS, délka CS ověřená (`mobil-dilna-cs.jpg`).
11. **Měřítko:** skutečné míry podle M-1 (kap. 3.1); jediná výjimka je vlaštovka (M-2) a jmenovité herní velikosti v kartách katalogu (holub, větrník, praporky). Prvek u místa odhodu kreslit v LOD H (M-4) a projít S-1 až S-7 (kap. 9.3).
12. **Nový model vlaštovky:** M1–M8 (kap. 17.2): silueta z boku v póze letu, IoU ≤ 0,75 proti všem modelům na 24 px (`img/obsah/siluety.mjs`), plocha 0,75–1,4 × Dart, opsaná kružnice ≤ 0,75 délky, ≤ 12 △, stejná délka.
13. **Nový skin nebo papír:** S1–S7 (kap. 17.4): obrys nedotčený, průměrná světlost horní plochy L ≥ 0,45, papír L ≥ 0,69, pokrytí ≤ 30 %, žádný token role (rajčatová, hořčicová, tyrkysová, kobaltová), 0 draw calls navíc (`img/obsah/skiny.mjs`).

---

## 14. Ano / ne

| Kap. | Ano | Ne |
|---|---|---|
| 1 Pilíře | `desktop-let-1-strechy.jpg`: papírové karty, opar, jediná nakreslená věc je vlaštovka | `img/smery/b-1-predmesti-vysledek.png` (první B): ploché barvy bez řezané hrany a oparu, „kartonová krabice“ |
| 2 Paleta | `paleta.png`: ulice sytá, střed pastel, dálka do oparu | `img/desktop-let-1-suburbs.jpg` (A0): všechno ve stejném pásmu sytosti |
| 3 Tvar | `desktop-let-2-trh.jpg`: štíty, vlaječky, stánky, čisté tvary | `papir-data.js` před opravou: kolejové lože dostalo štít přes celé místo a v ulici vznikl obří zelený svah (opraveno: ploché pásy pod 1 m bez střech; `desktop-let-4-zeleznice.jpg` je po opravě) |
| 3 Detail | `desktop-let-3-zahrady.jpg`: stromy ve středu i v ulici, dálka bez oken | první verze zahrad: prázdné šedé karty (proto doplněny stromy, ploty, skleník) |
| 4 Světlo | `desktop-dilna.jpg`: slunce se září, opar, studené stíny | `stiny-3-shadowmap.jpg`: shadow map ztmaví dálku, opar zmizí |
| 5 Stíny | `stiny-2-siluety.jpg` | `stiny-1-zadne.jpg`: bez stínu vrstvy splývají |
| 6 Hierarchie | `mobil-udalost.jpg`: štítek místa pod scénou, pás letu volný | první verze telefonu: štítek místa vlevo nahoře zakryl vlaštovku (Železnice) |
| 7 Efekty | `desktop-udalost-qte.jpg`: poryv jako papírové proužky | rychlostní čáry přes vlaštovku (02, R11) |
| 8 UI | `desktop-vysledek.jpg`: papírová karta s páskou, „Delivered.“ rukopisem jen jednou | `pencil` text přímo na stole (3,6 : 1), opraveno na `pencil-700` |
| 3.1 Měřítko | `img/start/zaber.png` prostřední: dítě 1,2 m, vlaštovka v ruce 0,5 m, záběr 16 m | `img/start/dnes.png`: dítě 11,75 m vysoké jako dům, dveře 4,2 × 6 m |
| 9 Místo odhodu | `img/start/koncept-2-podkrovi.png`: pavlač nad ulicí, za vlaštovkou nebe, domov v řezu | `img/start/vyhled.png` horní: za dítětem zeď domů 38 m, slunce zakryté (S-1) |
| 9.4 Dítě | `img/hratelnost/postavicka-c.png` „C hra“: objem z mnoha stěn, oči pod čepicí vidět, v šedi na 64 px hned za vlaštovkou | stejný list, „C náčrt“: proužek čepice přes oči; `postavicka-varianty.png` „Dnes“: plochá karta, ze strany výstřižek |
| 9.3 S-6 Kouř | `img/hratelnost/kour-papir.png` 2 a 5: malé krémové obláčky daleko za startem, při míření žádný kouř | `kour-papir.png` 1 a `img/hratelnost/zbytky-stareho-stylu.png` 1: fialové koule 3–7 m, za dítětem |
| 17 Modely | `img/obsah/siluety.png` řádek 3 (Hawk): oddělené křídlo, mezi ním a trupem je vidět nebe i na 24 px | `img/obsah/siluety-pruzkum.png` řádek 7 (vidlicový ocas): krásný shora, z boku splyne se šipkou |
| 17 Skiny | `img/obsah/skiny.png` K9 Sail Stripes: pruhy vidět na 24 px, vlaštovka zůstane světlá | modrotisk, zlatá, rajčatová (03 kap. 3, zakázané): večer zmizí, nebo si hráč splete roli barvy |

---

## 15. Co se přebírá z bible 02 a co se ruší

**Přebírá se:** S1 → P1 (vlaštovka vždy vidět, dvojí hrana, měření z pixelů, obrys vlaštovky ≥ 2,6 px a nejsilnější), S4 → P4 (jedna věc na obrazovku), „jedna role = jedna barva“, „stav nikdy jen barvou“ (hvězda u perfektu), **„zlatá jen hodnota“ jako „hořčicová jen hodnota“**, tabulka efektů a reduced motion (kap. 6 v 02), blikání ≤ 3 Hz, tokeny ve třech vrstvách, 44/48 px cíle, kouř a pára pod jas vlaštovky, rozpočty, kontrolní test v šedi, „barva čtvrti = denní doba“ (S3 v nové podobě P3).

**Ruší se:** S2 „Tištěný komiks“ (tušové obrysy budov 2,5 / 1,7 px, půltón, posterizace, toon rampa), neon (cedule, okna ve 4 barvách, `mood.neon`), magenta jako perfekt a azurová jako úspěch, UI na indigových tokenech Atlasu, Bahnschrift a tiskový posun písma, zákaz zelené, tvrdé jednobarevné stíny (`BasicShadowMap`), noční čtvrti 1–2 (Suburbs soumrak, Docks měsíční noc) a „druhý západ“ (místo toho jeden den). Rozpory R1–R18 z 02 se po přechodu většinou stanou bezpředmětnými; R15 (`PLANE_SCALE` 6,5 × 7,75) a R16 (HUD 7–8 px na telefonu) platí dál.

---

## 16. Rozpory a otevřené otázky

**Rozpory kód × bible** (kód je dnes celý ve stylu A0, plán změn je `06-papir-ctvrt1.md`):
- `src/render3d/toon.js`, `comic.js`, `scene.js`: toon rampa, obrysy, půltón, posterizace, `BasicShadowMap` 2048² → papírový shader, siluetové stíny, jen zrno.
- `palette.js`, `mood.js`: neon, magenta, azurová, noční čtvrti → paleta kap. 2.
- `style.css`: indigo tokeny Atlasu → papírové tokeny kap. 8.
- `workshop.js`, `models/workshop.js` (K4): neonová cedule, kyberdítě, Dílna 24 × 12 m s přístavkem → kap. 9 (podkroví v řezu, karty H1–H6 v 11).
- `palette.js PAPIR.workshop`: `shirt` a `knob` hořčicové, `visor` bílý, `rail`, `frame`, `string` grafitové → kap. 9.4 a 9.5.
- `src/locales/*`: názvy kap. 12.
- **Vlaštovka na telefonu 21 CSS px** (bible chce ≥ 24) a **v Dílně na telefonu 10 px**: rozpor i v dnešní hře. Řeší rozhodnutí +15 % na úzké scéně a M-2 s polodetailem 16 m (v ruce 27 px), dávky S2 a S3.
- `plane.js planeColors`: svislé plochy (ny ≤ 0,3) barví jako spodní → M6 (kap. 17.2). `geometry.planeShape` nemá UV → potřeba pro potisk (kap. 17.4).
- `01-papiry.md`: tóny, obrysy a Neon Foil pro neonový styl → kap. 17.3 (světlý Kraft, Stříbrná fólie, obrys grafit).

### 16.1 Rozpory místa odhodu R-S1 až R-S9 (vyřešeno 14. 10.)

Všechny rozpory z `research/start/02-misto-odhodu-vzhled.md` kap. 6 rozhodl uživatel v 06 („Začátek hodu, místo odhodu a kamera“). V dokumentech platí rozhodnutí, **kód je zatím po staru** a mění se v dávkách S1–S5 z `research/start/01-zacatek-a-kamera.md` (pořadí 06 bod 7).

| # | Kde | Bylo | Platí (06) | Kód čeká na |
|---|---|---|---|---|
| R-S1 | bible kap. 9, 11 karta 5, `models/workshop.js` (K4), `workshop.js` | Dílna 24 × 12 m s přístavkem, dítě `S = 0,25` | koncept 2, podkroví v řezu (bod 1); karty H1–H6, skupina G2b v 11; K4 `workshop` se nahrazuje | G2b v katalogu, S4 |
| R-S2 | bible kap. 9 „kamera `restCamera`“, 11 kap. 1.2 „Dílna ~5 px/m“ | klid 244 m | míření 16 m (80 px/m), menu 25–43 m, jedna boční kamera (body 2, 3) | S2, S5 |
| R-S3 | 11 kap. 1.1 „vlaštovka 7,75 m“ | stálá velikost | M-2: v ruce 0,5 m, roste s šířkou záběru (bod 3) | S3 |
| R-S4 | `PAPIR.workshop.rail`, `frame`, `string` | grafit `#2a2622` | zábradlí a rámy `#3d4f7a`, provázky `PT.pencil` (bod 6, S-2) | S4 |
| R-S5 | `PAPIR.workshop.visor`, `shirt` (a `knob`) | bílá, hořčicová | čepice kraft `#c9a57c`, pláštěnka `#f2b65a`, klika krémová (bod 6, S-3) | S4 (barvy lze dřív, 02 kap. 7 bod 3a) |
| R-S6 | `07-menu.md` §2.1 | menu = nejvzdálenější čtvrť | menu = dioráma startu, pokoj v podkroví (bod 2) | S5; text 07-menu upraví product-designer |
| R-S7 | `pose.js HAND` × `core.js` y0 | ruka 16 m, fyzika 12 m | ruka 12 m, fyzika beze změny (bod 4, M-3) | S2, S4 |
| R-S8 | `cityChunk(0)` střed | 17–38 m hned za startem | pás výhledu ≤ 13 m do 150 m (bod 5, S-1) | S4 |
| R-S9 | 01 §3.3 `W_aim` | 55 m (telefon 45 m) | ~16 m (telefon na výšku 7 m) (bod 3) | S2; číslo v 01 upraví game designer |

### 16.2 Otevřené body po rozhodnutích 14. 10. (bez rozhodnutí uživatele)
- **Čitelnost dítěte na telefonu v šedi** (kap. 9.4): pláštěnka a čepice mají proti nebi jen 1,0–1,9 : 1 (boky figurky C 1,65–2,16). Ověřit art-review po dávce H2 (03-art kap. 6; snímek do šedi, 25 %). Kdyby se dítě ztrácelo, první krok je tmavší vlasy a nohy, ne obrys (obrys patří vlaštovce).
- **Výkon místa 0** s diorámatem: ~17 draw calls proti stropu 14 na místo; návrh řešení je v 11, skupina G2b (sloučení stínů). Měří game-dev (`perf-check`), NOT ASSESSED.
- **Kruh QTE × velikost modelu** (M4): přepočet logických px na CSS px na telefonu NOT ASSESSED.
- **Copy × skin N1 Ruled Notebook:** oba mají modré linky sešitu; na Copy by N1 skoro nebyl vidět. Návrh pro game designera: N1 kreslit čtverečkovaně (Graph Paper z rezervy 03), nebo linky Copy ztišit na vlákna. Rozhodne se se skiny v dávce, nemění schválený vzhled.
- **Práh papíru:** 03 uvádělo L ≥ 0,70, správně je 0,69 (světlý Kraft 0,694 × `#cdd3e3` 0,651 = 0,452 ≥ 0,449). Opraveno v 03 i tady.

### 16.3 Záře Washi (rozhodnuto 14. 10.)

**Rozhodnuto (a):** Washi úr. 3 „papírový lampion“ svítí jen ve Městě lampionů (čtvrť 4), jinde má teplejší výplň bez záře. Stejné pravidlo jako lampionový skin: všechno, co svítí, svítí jen ve večerní čtvrti (rozhodnutí 06). Původní otázka:

Dříve BLOCKED: **Smí Washi na 3. úrovni („papírový lampion“) svítit i mimo večerní čtvrť?** Schválený návrh papírů (`01-papiry.md`) má korunku Washi „vlaštovka svítí zevnitř, teplá aura“ a Washi slabou vnitřní záři. Bible ale dovoluje světlo jen lampionům a oknu domova, a u lampionového skinu uživatel rozhodl „svítí jen ve čtvrti 4“. Možnosti: (a) **stejně jako lampionový skin: záře jen ve Městě lampionů, jinde teplejší výplň bez záře**; (b) svítí všude (ve dne je záře na světlém nebi skoro neviditelná a soupeří s obrysem); (c) Washi nesvítí nikdy. **Doporučuji (a)**: jedno pravidlo pro všechno, co svítí, a korunka má svou chvíli ve večerní čtvrti. Obrázek pro srovnání: `img/obsah/skiny.png`, sloupec 6 (večerní nebe).

### 16.4 Prototyp × bible a otázky prvního návrhu
- `.claude/rules/render3d.md` zmiňuje `quality.js`, který neexistuje; `plan.quality` je natvrdo 2.

**Prototyp × bible** (zjednodušení prototypu, ve hře udělat podle bible): prototyp nemá rychlostní čáry, útržky, popupy, holuba, večerní čtvrť, pohlednice v novém stylu a pohyb aut a vlaku; vlákna a zrno nejsou laděné pro telefon; režimy „shadow map“ v prototypu používají `MeshLambertMaterial` (jen pro měření, vzhled se liší).

**Otázky pro uživatele z prvního návrhu bible** (všech 5 zodpovězeno 14. 10., viz hlavička; ponecháno kvůli dohledatelnosti):
1. Pilíře: varianta A „Diorama za úsvitu“, nebo B „Tiché protisvětlo“ (kap. 1.1)? Doporučuji A.
2. Paleta čtvrti 1 „ráno“ (kap. 2.3, `paleta.png`, `desktop-let-1-strechy.jpg`): takhle, teplejší (víc broskvové a hořčicové), nebo chladnější (víc modré a šalvěje)? Doporučuji takhle.
3. Názvy čtvrtí: sada A, B, nebo C (kap. 12)? Doporučuji C (Sunrise Roofs, Bright Harbor, Golden Fields, Lantern City).
4. Vlaštovka na telefonu je malá (21 px, v Dílně 10 px): zvětšit vlaštovku o 15 % jen na úzkých obrazovkách, přiblížit kameru, nebo nechat? Doporučuji zvětšit vlaštovku (nemění záběr ani hratelnost).
5. Písmo: zůstat u systémových písem (Trebuchet MS, nic se nestahuje), nebo přidat jedno volné oblé písmo jako soubor v repu? Doporučuji zatím systémová, rozhodnout po zahrání.

---

## 17. Vlaštovka: modely, papíry a skiny

> **Schváleno 14. 10. 2026** (06, „Odemykatelný obsah: vlaštovky za mince a skiny“ body 1, 5, 7, 8; vše podle doporučení). Zdroj a měření: `research/obsah/03-vzhled-modelu-a-skinu.md` (dál „03“), obrázky `img/obsah/siluety.png`, `siluety-seda.png`, `skiny.png`, skripty `img/obsah/siluety.mjs`, `skiny.mjs` (Node, bez prohlížeče). Obsah a podmínky odemčení: `research/obsah/01-game-design.md`, obrazovky: `02-ux-dilna.md`, ceny: `04-ekonomika.md`. Snímky jsou simulace (stejná geometrie, póza, obrys 2,6 px a barvy jako `plane.js`), **vzhled ve hře NOT ASSESSED**.

**Základní věta (P1, P4):** model poznáš podle **siluety z boku**, papír podle **tónu a tvaru stopy**, skin podle **potisku zblízka**. Za letu na telefonu (~24 px) zbývá silueta a průměrný tón, potisk se slije.

### 17.1 Vrstvy vlaštovky

| Vrstva | Co mění | Kdo rozhoduje | Smí měnit skin? |
|---|---|---|---|
| 1 Model | silueta, přehyby, let | game design, Dílna za mince | ne |
| 2 Papír (Copy → Kraft → Washi → Stříbrná fólie) | tón listu, vzor, tvar stopy, korunka | žebřík rychlosti | ne |
| 3 Potisk (skin) | kresba přes papír | hráč, jeden skin pro všechny vlaštovky | **ano** |
| 4 Ozdoba (se skinem) | jedna malá věc nebo barva přehybu (mašle K7, nit K10, lem K11) | hráč | ano |
| 5 Razítko | nálepka na pravém křídle | hráč, jedno nebo žádné | ano (samostatně) |
| — Obrys | grafit 2,6 px (Kraft 2,9 px) | bible P1 | **nikdy** |
| — Stín, velikost | `08-stiny`, M-2, `plan.plane.scale` | bible | **nikdy** |
| — Stopa | barva podle čtvrti (grafit, večer krém), tvar podle papíru | bible kap. 2.3, kap. 17.3 | **nikdy** (stopa bez kosmetiky, 06 bod 7) |

### 17.2 Modely (M1–M8)

- **M1 Silueta z boku.** Model se pozná podle siluety v póze letu (křídla natočená ke kameře o 24°), ne podle půdorysu ani detailu. Mezery užší než ~7 px zaroste obrys, vnitřní detail zmizí. Každý model má **jeden hlavní podpis** a od ostatních se liší aspoň ve **dvou osách**: A výška siluety, B výběžek nahoru, C výběžek dolů, D tvar nosu, E křídlo oddělené od těla, F těžiště. Předobraz je vždy skutečná papírová skládačka. **P1, P2.**
- **M2 Stejná délka:** všechny modely `PLANE_SCALE 7,75` × `plan.plane.scale` (+15 % na úzké scéně), liší se výškou a rozpětím. **P1.**
- **M3 Plocha siluety 0,75–1,4 × Dart.**
- **M4 Kruh QTE zůstává volný:** poloměr opsané kružnice od těžiště (s obrysem) ≤ 0,75 délky.
- **M5 Čisté tvary, papírová logika:** jen rovné trojúhelníky, každý díl jde složit z jednoho listu; plachty a ploutvičky jsou dvojitá vrstva. **P2.**
- **M6 Svislé plochy jsou papír, ne spodek:** plochy natočené ke kameře (|nz| > 0,7) mají barvu horního papíru (dnes `planeColors` barví ny ≤ 0,3 jako spodní; změna kódu pro game-deva).
- **M7 Přehyby jako podpis zblízka:** každý model má vlastní kresbu přehybů tužkou (`pencil`), vidět v Dílně a při míření.
- **M8 Kontrola nového modelu:** `siluety.mjs` → IoU ≤ 0,75 proti všem modelům (24 px, 3 pózy), plocha a poloměr v mezích, ≤ 12 △, snímek v šedi čitelný na 24 px.

| Model | Hlavní podpis | Tvar (délka 1) | Plocha / Dart | △ | Herní osa |
|---|---|---|---|---|---|
| Dart (dnes) | štíhlý klín, hluboký kýl vzadu | nos 0,55, rozpětí 0,36, kýl −0,14 | 1,00 | 4 | univerzál |
| Glider (dnes) | širší klín, zalomená náběžná hrana | rozpětí 0,5 | 1,15 | 6 | delší lety |
| **Hawk** | „letadýlko“: dlouhá úzká šípová křídla, mezi trupem a křídlem nebe | křídla 0,62, šíp 0,4 | 1,01 | 8 | perfekty |
| **Kite** | vysoký lichoběžník, konce křídel nahoře | rozpětí 0,58, vzepětí +0,3, tupý nos 0,3 | 1,34 | 8 | výška, plachtění |
| **Skimmer** | plochá tupá deska, konce dolů | useknutý nos 0,26, konce −0,2, bez kýlu | 1,14 | 8 | nízký let nad vodou |
| **Sail** | plachta nahoru uprostřed | trojúhelník 0,52 nad trupem | 1,14 | 6 | vítr |
| **Needle** | tenká jehla, ploutvička dolů u ocasu | rozpětí 0,16, kýl −0,05 | 0,75 | 6 | krátké rychlé lety |
| *Night Owl* (rezerva) | vidlicový ocas | — | 1,16 | 6 | navrhne se s Night Route (dnes IoU 0,78 s Dartem, upravit) |

Rozlišitelnost: nejpodobnější schválený pár 0,75 (Dart × Needle, Glider × Skimmer), dnešní Dart × Glider 0,74. Karty siluet jako zadání pro katalog: 11, skupina V.

### 17.3 Papíry v Papírovém městě

**Schválené jádro (06 bod 8):** světlý Kraft `#ead7b5` místo `#c08550`, **Stříbrná fólie** místo Neon Foil, obrys vždy grafit. Ostatní řádky převádějí schválený `research/design/01-papiry.md` do pravidel této bible (bez neonu, magenty, azurové, toon rampy a půltónu); nejde o nové volby, ale vzhled je **NOT ASSESSED** a ověří ho art-review v prototypu papírů. Balanc Stříbrné fólie a 2. kapsy přeladí simulace ve 3. kole (06 bod 8), mimo art.

| | Copy (úr. 1–3) | Kraft (4–6) | Washi (7–9) | Stříbrná fólie (10–12) |
|---|---|---|---|---|
| List (horní plochy) | `#ffffff`, L 1,00 | **`#ead7b5`**, L 0,69 | `#fbe8cc`, L 0,83 | podklad `#e9edf2` (zástupně), L 0,84 |
| Spodní plochy | list × `#cdd3e3` | dtto | dtto | dtto |
| Večer: výplň × nebe `#4a5f8f` | 6,3 : 1 | 4,5 : 1 | 5,3 : 1 | 5,4 : 1 |
| Obrys | grafit 2,6 px | grafit **2,9 px** (pevný papír) | grafit 2,6 px | grafit 2,6 px, bez druhého obrysu |
| Přehyby | `pencil` plná | `kraftDark` čárkovaná (steh) | `pencil` jemná | `pencil` |
| Vzor (zblízka, zdálky se slije) | linky sešitu `#7f9ed6`, okrajová linka u ocasu `#b5503c` | vlákna `#9c7a55`, airmail lem `#b5503c` / `#3d4f7a` na odtokové hraně, razítko | seigaiha jemně `#3d4f7a`, dlouhá vlákna | perleťový lesk podle úhlu pohledu v barvách úsvitu a oparu `#cfe2ec` → `#ffe0e8` → `#fff0b0`, 3 pruhy lišící se jasem, jemné šikmé rýhy; **bez duhy a magenty** |
| Stopa (tvar; barvu dává čtvrť) | 1 páska | provázek (2 tenké pásky) | měkký široký pás s užším jádrem | kometa (zužující se pás) bez světlého jádra (bílá + grafit patří vlaštovce) |
| Částice | krémové čtverečky | vlákna `kraftDark` | krémové lístky | 4cípé krémové hvězdičky, blikání ≤ 3 Hz |
| Rychlostní čáry (vždy grafit tužkou, kap. 7) | rovné | čárkované (steh) | štětcové zúžené | dvojité tenké |
| Korunka (3. úroveň) | dvě linky `#7f9ed6` z konců křídel | krémové kapky tříště | teplá výplň „lampion“; záře jen podle kap. 16.3 | delší kometa |

Pravidla: **papír L ≥ 0,69** (spodní plochy list × `#cdd3e3` pak drží L ≥ 0,45, S2); Foil se mění jen natočením vlaštovky, při reduced motion ne v čase; Foil se nesmí lesknout přes potisk (S6). Jméno EN („Silver Foil“ je návrh) a texty papírů jsou věc product-designera a i18n.

### 17.4 Skiny (S1–S7)

Skin je **potisk přes papír**, ne jiný papír; **jeden skin platí pro všechny vlaštovky**; skiny jsou **jen za postup** (suvenýry čtvrtí, finále, podpisové za první trik modelu) a k nim 7 razítek (06 bod 7). Karty 16 skinů (K0–K11, N1–N4) s motivy, barvami a změřeným L jsou v 03 kap. 3 a platí jako zadání; podmínky odemčení dává game design.

- **S1 Obrys** grafitový 2,6 px nedotčený. Potisk nekreslí čáru podél okraje (zdvojený obrys by vypadal rozmazaně).
- **S2 Večerní pravidlo:** průměrná světlost horní plochy (lineárně, jak ji zprůměruje mipmapa) **L ≥ 0,45** na všech papírech; papír pod potiskem **L ≥ 0,69**. Odvození: grafit × večerní nebe je jen 1,1–2,0 : 1, vlaštovku drží výplň; výplň × `#4a5f8f` ≥ 3 : 1 ⇒ L ≥ 0,449. Všech 16 skinů vyhovuje (nejhorší 0,57).
- **S3 Ve dne nese vlaštovku obrys** (5,4–8,2 : 1). Tmavé motivy (grafit, `#22355e`) jen ≥ 0,08 délky od okraje nebo jako tenké linky; tmavá plocha u okraje by obrys „rozpustila“.
- **S4 Role barev nejsou v potisku:** žádná `tomato` `#d9472b`, `mustard` `#e2a43a`, `teal` `#13807d`, `cobalt` `#2456c9`. Červenou zastupuje cihlová `#b5503c`, žlutou okrová `#c98a4a` nebo broskvová `#f0a27a`, zelenomodrou šalvějová `#5aa6a0`. **Žádný zlatý ani hořčicový skin.**
- **S5 Pokrytí potiskem ≤ 30 %** horní plochy; lazura přes celou plochu nejvýš alfa 0,5.
- **S6 Žádný pohyb ani záře ve dne.** Výjimka: lampionový skin (K4 Lantern Night) **jemně svítí jen ve čtvrti 4** (06 bod 7): měkký kruh ≤ 1,5 × délka vlaštovky, alfa ≤ 0,25, nepulzuje.
- **S7 Ve výšce letu nic bílého s grafitem** platí i pro ozdoby: mašle K7 jsou trojúhelníčky v barvě potisku, ≤ 0,4 délky, nesmí vypadat jako čárky stopy.

**Paleta skinů** (jen existující tokeny a palety čtvrtí, nejvýš 3 barvy potisku + papír): linky `#2a2622` (jen tenké), `#6b6158`, `#3d4f7a`; teplé `#b5503c` `#f0a27a` `#e0a060` `#d9967a` `#c98a4a` `#9c7a55`; studené `#7f9ed6` `#5b8fb0` `#9ec2d6` `#22355e` `#5aa6a0`; pastely `#e98fa0` `#9cc3a6`, úsvit `#ffe0e8` → `#fff0b0`. Suvenýr čtvrti bere barvy své čtvrti.

**Razítka:** nálepka ≤ 10 % plochy na pravém křídle, krémový podklad `#fbf6ec`, tužková kresba a jeden akcent z palety skinů; ikony rozlišené tvarem (Gust 3 vlnky, Pigeon origami holub, Steam 3 obláčky, Thermal spirála, Drone papírový drak, Shooting Star 4cípá tužková hvězda, ne rajčatová pěticípá perfektu, Delivered obálka).

**Kde se skin ukáže:** naplno v Dílně, při míření (vlaštovka v ruce 0,5 m, 40 px), ve výsledku a v hlavním menu; za letu na telefonu jen tón a velké pruhy. To je záměr (P1). Viditelnost skinů za letu na telefonu se řeší až s telefonem na konci (06 bod 7).

### 17.5 Technika a rozpočet

- Model ≤ **12 △** (dnes 4–6, nové 6–8), obrys razítkem 8 kopií ≤ 96 △. Geometrie v cache, výměna bez alokace za snímek (`setModel`). Každý model musí fungovat i v ruce dítěte a na stole Dílny.
- Skin = jedna `CanvasTexture` 256² (potisk + razítko), vzniká při změně skinu, mipmapy, sRGB, anizotropie 4. Data potisku jako čistý modul bez three.js a DOM; stejná funkce kreslí ikonu v Dílně. Spodní plochy míří UV do rohu textury (1 materiál). Testy v Node: pokrytí, L, zakázané tokeny.
- **Draw calls beze změny** (výplň, obrys, přehyb, stopa + stín do masky); ozdoby sloučené do výplně. Jediná výjimka: záře K4 ve čtvrti 4 +1 DC.
- `planeShape` potřebuje UV (u od ocasu k nosu, v rozpětí) a příznak svislé plochy (M6).

### 17.6 Dílna a zamčené modely

Podle 06 bod 5: vlastněné vlaštovky a **2 nejbližší zamčené plně s cenou**, další **jako silueta**. Art pro siluetu navrhuje tužkovou skicu přehybů na listu bez výplně (M7, „instrukce skládání“): nepotřebuje zámek ani šedou kopii a jediná nakreslená věc zůstává vlaštovka. Podobu karty určuje `02-ux-dilna.md` (product-designer). Po odemčení skinu ukázat vlaštovku zblízka (stůl v podkroví, kap. 9.2).
