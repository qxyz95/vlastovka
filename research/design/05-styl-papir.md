# Stylová bible Just Throw It: Papírové město (směr B)

> **Schváleno 14. 10. 2026** (`research/bonusy/06-rozhodnuti.md`): pilíře „Diorama za úsvitu“, paleta čtvrti 1 beze změny, názvy čtvrtí sada C, vlaštovka na úzkých obrazovkách +15 %, písmo zatím systémové (rozhodne se po zahrání). Bible nahrazuje `02-styl.md` pro styl `?styl=papir`; co se z 02 přebírá a co ruší, je v kap. 15. Do přepnutí celé hry platí 02 pro výchozí styl.

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

**Tvarosloví (Monument Valley):** kvádry, sedlové střechy se štítem ke kameře (70 % malých domů v ulici, 35 % ve středu, 40 % v dálce), jehlany jen na kopcích a nádržích, kotouče (stromy jako papírový kotouč na kmeni, hlavy postav, balóny, mraky ze tří kotoučů, větrníky jako čtverec natočený o 45°), vlaječky jako trojúhelníky. Okna jsou **malé tmavé výřezy** `mix(barva stěny, #3d4f7a, .6)`, ve středu větší a řidší, v dálce žádná (jen silueta). Dveře jen v ulici. **P2, P4.**

**Hustota detailu podle hloubky:** ulice = okna, dveře, komíny, prádlo, vlaječky, lidé, auta; střed = okna, komíny, antény, stromy; dálka = siluety (výška × 0,42 proti dnešku, aby ráno nad předměstím nebyly věže metropole), kopce. **P3, P4.**

**Měřítko vlaštovky:** desktop 58–59 CSS px, na šířku 36–37 px, **telefon 21 px** (kamera hry, `PLANE_SCALE 7,75`). Cíl z 02 (≥ 24 px na telefonu) dnes neplní ani starý styl. Návrh v `06-papir-ctvrt1.md` kap. 6 (zvětšit vlaštovku nebo přiblížit kameru na úzké scéně), otázka v kap. 16.

**Obrys vlaštovky:** razítkem (`toon.stampOutlineMaterial`, 8 směrů) 2,6 px `graphite` na všech šířkách a kvalitách; přehyb tenkou linkou `pencil`. Papíry (01-papiry) mění tloušťku jen nahoru.

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
2. **Nic ve výšce letu nemá kombinaci „bílá + grafit“.** Mraky jsou krémové bez obrysu a výš než pás letu; pára z ventilace a kouř jsou krémové obláčky s alfou ≤ 0,6 a menší než vlaštovka; žádná jiná grafitová čára v pásu letu kromě stopy a poryvu (poryv je krémový proužek s grafitovým lemem a krátce, jen během události).
3. **Stín vlaštovky** (30 %) jí dává druhou hranu proti světlému nebi a ukazuje „zvednutý papír“. Nesmí být tmavší než obrys.
4. **Opar dělá pozadí tiché:** dálka a kopce mají kontrast proti nebi < 1,5 : 1, ulice nejsytější. Hodnota (světlost), ne detail.
5. **HUD nesmí zakrýt pás letu.** Na telefonu je štítek místa **pod scénou**, ve scéně jen malý štítek vzdálenosti vpravo nahoře (`mobil-udalost.jpg`); vlaštovka letí v levé části obrazu (px 148/640).
6. **QTE nad vším:** krémový disk 95 % se stínem zvednutého papíru (kap. 11).

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

## 9. Dílna

Dílna je **papírový dům dítěte na začátku města** (`desktop-dilna.jpg`, `papir.js workshopCards`): krémové stěny, rajčatová sedlová střecha, velké teplé okno, ve kterém je vidět stůl dítěte (deska, kelímek s tužkami, vystřižená vlaštovka), tmavomodré dveře. Cedule **PAPER LAB je papírová cedulka** (krémová, grafitové písmo, rajčatové podtržení) zavěšená na dvou provázcích, ne neon. Přístavek je tyrkysový s plochou krémovou střechou a grafitovým zábradlím; na něm stojí dítě.

**Dítě:** papírová postavička ze stejných kvádrů jako dnes (`workshop.js px()`, měřítko `S = 0,25`): hořčicová pláštěnka, tmavomodré nohy, **skládaná papírová čepice** (bílý trojúhelník). V ruce vlaštovka v poloze `HAND`. Animace z `pose.js` beze změny.

Pravidla: Dílna je jediné místo s teplým světlem v okně ve dne (domov). Kamera Dílny zůstává (`restCamera`, HAND na 148, 258). **Na telefonu je dítě i vlaštovka maličké** (vlaštovka 10 CSS px, `mobil-dilna-cs.jpg`); návrh v 06 kap. 6, otázka v kap. 16.

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
2. **Materiál:** papírový shader (čelo, řezaná hrana, boky, vlákna, opar). Žádný obrys, žádná textura s detailem, žádná emise kromě lampionů a okna Dílny. (P2)
3. **Paleta:** jen tokeny kap. 2.1 a barvy čtvrti kap. 2.3; nová barva = nový token se jménem role. (P3)
4. **Vrstva a stencil:** prvek patří do jedné vrstvy (ulice / střed / dálka / nebe) a zapisuje její id; jinak by na něj padaly špatné stíny. (P2)
5. **Hierarchie:** ve výšce letu nic bílého s grafitem; nic většího a světlejšího než vlaštovka v pásu letu. (P1)
6. **Kontrast:** text ≥ 4,5 : 1, grafika ≥ 3 : 1, vlaštovka podle dvojí hrany, změřeno z pixelů. (P1)
7. **Rozpočet:** na místo ≤ 14 draw calls a 15 tis. △ (dnes 7 DC a 3,4–8,6 tis. △), scéna ≤ 120 DC; nic nealokovat za snímek; vše `dispose`. Statické věci do sloučené geometrie vrstvy.
8. **Pohyb:** varianta reduced motion; blikání ≤ 3 Hz; prostředí „on twos“.
9. **Telefon:** snímek 375 × 667 a 932 × 430; HUD mimo pás letu.
10. **Text:** přes i18n EN i CS, délka CS ověřená (`mobil-dilna-cs.jpg`).

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
- `workshop.js`: neonová cedule, kyberdítě → kap. 9.
- `src/locales/*`: názvy kap. 12.
- **Vlaštovka na telefonu 21 CSS px** (bible chce ≥ 24) a **v Dílně na telefonu 10 px**: rozpor i v dnešní hře.
- `.claude/rules/render3d.md` zmiňuje `quality.js`, který neexistuje; `plan.quality` je natvrdo 2.

**Prototyp × bible** (zjednodušení prototypu, ve hře udělat podle bible): prototyp nemá rychlostní čáry, útržky, popupy, holuba, večerní čtvrť, pohlednice v novém stylu a pohyb aut a vlaku; vlákna a zrno nejsou laděné pro telefon; režimy „shadow map“ v prototypu používají `MeshLambertMaterial` (jen pro měření, vzhled se liší).

**Otevřené otázky pro uživatele** (jdou přes orchestrátora jako `BLOCKED:`):
1. Pilíře: varianta A „Diorama za úsvitu“, nebo B „Tiché protisvětlo“ (kap. 1.1)? Doporučuji A.
2. Paleta čtvrti 1 „ráno“ (kap. 2.3, `paleta.png`, `desktop-let-1-strechy.jpg`): takhle, teplejší (víc broskvové a hořčicové), nebo chladnější (víc modré a šalvěje)? Doporučuji takhle.
3. Názvy čtvrtí: sada A, B, nebo C (kap. 12)? Doporučuji C (Sunrise Roofs, Bright Harbor, Golden Fields, Lantern City).
4. Vlaštovka na telefonu je malá (21 px, v Dílně 10 px): zvětšit vlaštovku o 15 % jen na úzkých obrazovkách, přiblížit kameru, nebo nechat? Doporučuji zvětšit vlaštovku (nemění záběr ani hratelnost).
5. Písmo: zůstat u systémových písem (Trebuchet MS, nic se nestahuje), nebo přidat jedno volné oblé písmo jako soubor v repu? Doporučuji zatím systémová, rozhodnout po zahrání.
