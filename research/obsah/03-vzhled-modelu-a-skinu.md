# Vzhled modelů a skinů vlaštovky (art)

> **NÁVRH, ke schválení uživatelem.** Napsal art-director 14. 10. 2026. Odpovídá na zadání uživatele: „rozšířit naší dílnu o další vlaštovky které budou zamčené a půjdou odemknout za mince. A zároveň … různé skiny vlaštovek které by byly odemykatelné za progress ve hře.“
> Platná bible je **Papírové město** (`research/design/05-styl-papir.md`, dále „bible“), stíny `08-stiny.md`, katalog `10/11`. Obsah a podmínky odemčení dává game designer (`01-game-design.md`), obrazovky product-designer (`02-ux-dilna.md`), ceny balance-analyst (`04`). Tady je jen **jak to vypadá a proč**. Podmínky odemčení neurčuji, u skinů jen navrhuji vhodnou vazbu.

**Obrázky a nástroje** (`research/design/img/obsah/`, vše z Node bez prohlížeče a bez závislostí):

| Soubor | Co ukazuje |
|---|---|
| `siluety.png`, `siluety-seda.png` | 8 navržených modelů. Sloupce: telefon 24 px rovně (zvětšeno 4×), telefon 24 px střemhlav, desktop 58 px, telefon 24 px proti večernímu nebi, pohled shora (Dílna) |
| `siluety-pruzkum.png`, `-seda.png` | první průzkum 8 tvarů (široké křídlo, těžký nos, dvouplošník, ploutvičky, vidlice, albatros) |
| `skiny.png` | 16 skinů. Sloupce: zblízka na papíru Copy a na světlém Kraftu, pak za letu na telefonu (24 px, 4×) proti nebi čtvrtí 1, 2, 3 a 4 |
| `siluety.mjs`, `skiny.mjs` | skripty, které obrázky a čísla níže vyrábějí (`node research/design/img/obsah/siluety.mjs [--pruzkum]`) |

Snímky jsou **simulace** (vlastní rasterizace stejné geometrie, pózy, obrysu 2,6 px a barev jako `plane.js`), ne snímky hry. Vzhled ve hře je **NOT ASSESSED** (prohlížeč jsem podle zadání nepoužil).

---

## 0. Shrnutí

1. **Model poznáš podle obrysu, skin podle toho, jak vypadá zblízka.** Na telefonu je vlaštovka asi 24 px dlouhá a má obrys 2,6 px. Za letu z ní zbývá jen silueta a průměrný tón. Proto se modely liší **siluetou z boku** (výška, výběžky, kde je těžiště). Skiny se liší potiskem, který je naplno vidět v Dílně, při míření, ve výsledku a v hlavním menu. Za letu skin nese jen tón a velké pruhy.
2. **Sedm modelů, sedm tvarů na první pohled:** Dart (štíhlý klín), Glider (široký klín), Hawk (dlouhá šípová křídla, „letadýlko“), Kite (vysoký lichoběžník), Skimmer (plochá tupá deska), Sail (plachta nahoru), Needle (tenká jehla s ploutvičkou dolů). Rezerva pro Night Owl je vidlicový ocas. Nejpodobnější pár ve 3 pózách má překryv siluet (IoU) 0,75. Dnešní Dart × Glider mají 0,74, takže nové modely nejsou podobnější než ty dva, které už ve hře jsou.
3. **Co se nemění nikdy:** grafitový obrys 2,6 px, velikost a délka vlaštovky, stín, stopa (barva podle čtvrti), role barev (rajčatová = perfekt, hořčicová = hodnota). **Co skin mění:** potisk (≤ 30 % plochy horních stran), jednu malou ozdobu, razítko a barvu přehybu.
4. **Nové měřitelné pravidlo pro večer:** v Městě lampionů grafitový obrys proti nebi skoro mizí (1,1 : 1), vlaštovku drží jen světlá výplň. Průměrná světlost horní plochy proto musí být **L ≥ 0,45** a papír pod potiskem **L ≥ 0,70**. Všech 16 navržených skinů to splňuje na všech čtyřech papírech (nejhorší je 0,57). **Kraft z návrhu papírů (`#c08550`, L 0,29) to nesplňuje**, je to rozpor (kap. 6).
5. **Technicky levné:** skin = jedna textura 256² z plátna (canvas) na stejném materiálu, **0 draw calls navíc**. Modely mají 4–8 △ (s razítkovým obrysem ×8 nejvýš ~130 △), rozpočet místa (14 DC, 15 tis. △) se nemění.

---

## 1. Vizuální jazyk modelů (silueta a měřítko)

### 1.1 Co hráč na telefonu skutečně vidí

Kamera hry dívá na vlaštovku z boku, křídla jsou natočená ke kameře o 24° (`frame.js tilt`: roll 0,42, yaw −0,2). Na telefonu má vlaštovka asi **21 px × 1,15 = 24 px** (bible kap. 3, rozhodnutí +15 %). Obrys 2,6 px na každé straně zabere skoro čtvrtinu výšky. Z toho plyne:

- **Půdorys křídla se za letu skoro nevidí.** Rozpětí se promítne jen jako výška (sin 24° ≈ 0,4). Tvar, který je krásný shora (vidlicový ocas, `siluety-pruzkum.png` řádek 7), se z boku slije v jednu čáru.
- **Mezery užší než ~7 px zaroste obrys** (2 × 2,6 px + 2 px). Dvouplošník s mezerou křídel 0,17 délky byl kaňka. Funguje až s mezerou ~0,35 délky.
- **Vnitřní detail zmizí.** Přehyby, spodní šedomodré plochy a potisk se na 24 px slijí do jednoho tónu.

**Pravidlo M1 (P1, P4):** model se pozná podle **siluety z boku v póze letu**, ne podle půdorysu ani detailu. Shora (Dílna, ikona) se může lišit víc, ale tam se nerozhoduje.

### 1.2 Osy siluety (slovník)

Každý model má **jeden hlavní podpis** (to, co si hráč zapamatuje) a liší se od všech ostatních aspoň ve **dvou** osách:

| Osa | Škála | Kdo ji nese |
|---|---|---|
| A Výška siluety (rozpětí × vzepětí) | nízká (Needle, Skimmer) → vysoká (Kite) | Kite: vzepětí konců +0,3 |
| B Výběžek nahoru | žádný → plachta / ploutev | Sail: trojúhelníková plachta 0,52 délky |
| C Výběžek dolů | žádný → kýl / ploutvička | Needle: malá ploutvička pod ocasem, Dart: hluboký kýl vzadu |
| D Tvar nosu | ostrý hrot → useknutý | Skimmer a Kite: tupý, rovně useknutý nos |
| E Křídlo oddělené od těla | splývá (klín) → samostatné („letadýlko“) | Hawk: dlouhá úzká šípová křídla, mezi nimi je vidět nebe |
| F Těžiště | vpředu → vzadu | Skimmer: masa vpředu dole (padající konce), Kite: vzadu nahoře |

Předobraz je vždy skutečná papírová skládačka (bible P2, katalog 10 kap. 2 „musí dávat smysl“): Hawk = skládaná „stíhačka“ s odděleným křídlem, Kite = široký „hang glider“ s vytaženými konci, Skimmer = plochá „žába“ s ohnutými konci dolů, Sail = šipka s jedním přehybem nahoru jako plachta, Needle = úzká šipka se zahnutým ocáskem.

### 1.3 Navržené siluety (`siluety.png`)

Sladěno s modely z `01-game-design.md` §2 (jména, osy a „3D model“ v kartách M1–M6).

| Model | Hlavní podpis | Tvar (délka 1, nos vpředu) | Plocha siluety / Dart | △ | Herní osa → proč tenhle tvar |
|---|---|---|---|---|---|
| **Dart** (dnes) | štíhlý klín s hlubokým kýlem vzadu | nos 0,55, rozpětí 0,36, kýl −0,14 | 1,00 | 4 | univerzál, rychlý |
| **Glider** (dnes) | širší klín, zalomená náběžná hrana | rozpětí 0,5 | 1,15 | 6 | delší lety |
| **Hawk** | „letadýlko“: dlouhá úzká křídla šípově dozadu, mezi trupem a křídlem nebe | křídla 0,62 do strany, šíp 0,4 | 1,01 | 8 | ostrý, „dravý“, perfekty (01 M1: „ostrá silueta s dlouhými úzkými křídly“) |
| **Kite** | vysoký lichoběžník, konce křídel nahoře | rozpětí 0,58, vzepětí +0,3, tupý nos 0,3 | 1,34 | 8 | výška, plachtění (01 M2: „široká křídla, krátké tělo“) |
| **Skimmer** | plochá tupá deska, konce křídel dolů | useknutý nos šíře 0,26, konce −0,2, bez kýlu | 1,14 | 8 | nízký let nad vodou (01 M3: „nízký široký tupý tvar“) |
| **Sail** | plachta nahoru uprostřed | trojúhelník výšky 0,52 nad trupem | 1,14 | 6 | vítr (01 M4: „vysoká plachta kýlu“) |
| **Needle** | tenká jehla, malá ploutvička dolů u ocasu | rozpětí 0,16, kýl −0,05 | 0,75 | 6 | krátké rychlé lety (01 M5) |
| *Night Owl* (později) | vidlicový ocas, konce přesahují dozadu | rezerva | 1,16 | 6 | jen tvarová rezerva, skutečný návrh až s Night Route |

**Rozlišitelnost** (IoU siluet s obrysem na 24 px, těžiště zarovnaná, nejhorší ze 3 póz: rovně, stoupání +0,3, střemhlav −0,35; 1 = stejné):

| Pár | IoU | | Pár | IoU |
|---|---|---|---|---|
| Dart × Owl (rezerva) | 0,78 | | Glider × Kite | 0,72 |
| Dart × Needle | 0,75 | | Dart × Hawk | 0,70 |
| Glider × Skimmer | 0,75 | | ostatní páry | 0,42–0,70 |
| **Dart × Glider (dnes ve hře)** | **0,74** | | | |

Pracovní práh: **≤ 0,75 a vizuálně jiný podpis**. Owl (0,78) je rezerva a před návrhem Night Route se upraví. V průzkumu nevyšly: široké křídlo × Glider 0,85, dvouplošník × Glider 0,89 (`siluety-pruzkum.png`), proto v sadě nejsou.

### 1.4 Pravidla měřítka a tvaru

- **M2 Stejná délka.** Všechny modely mají délku 1 × `PLANE_SCALE 7,75` × `plan.plane.scale` (+15 % na úzké scéně). Liší se výškou a rozpětím, ne délkou. Hráč tak odhaduje rychlost a polohu vždy stejně. (P1)
- **M3 Plocha siluety 0,75–1,4 × Dart.** Menší by na telefonu zmizela (Needle je na spodní hranici a drží ji obrys), větší by soupeřila s kruhem QTE a porušila „nic většího než vlaštovka“ v opačném směru: kruh je stavěný na velikost Dartu.
- **M4 Kruh QTE zůstává volný.** Poloměr opsané kružnice od těžiště (s obrysem) ≤ 0,75 délky. Dnes: Dart 0,68, Sail 0,74 (hranice), Owl 0,76 (zkrátit). Volný střed kruhu je `ring.r − QTE_BASE` = 21 log. px. Přepočet log. px na délku vlaštovky na telefonu je **NOT ASSESSED** (ověří game-dev v prohlížeči, kap. 5).
- **M5 Čisté tvary, papírová logika.** Jen rovné trojúhelníky (přehyby), žádné oblé tvary. Každý díl musí jít složit z jednoho listu: plachta Sail a ploutvičky jsou dvojitá vrstva papíru (dva trojúhelníky 1 cm od sebe). (P2)
- **M6 Svislé plochy jsou papír, ne spodek.** Dnešní `planeColors` barví plochy s normálou ny ≤ 0,3 jako spodní (`#cdd3e3`). Plachta Sail a ploutvičky by tak byly šedomodré (`siluety.png` řádek 6). Doporučuji: plochy natočené ke kameře (|nz| > 0,7) barvit jako horní papír. Je to změna kódu pro game-deva (kap. 5).
- **M7 Přehyby jako podpis zblízka.** Každý model má vlastní kresbu přehybů tužkou (`pencil`). Na 24 px nejsou vidět, v Dílně ano, a jsou to „instrukce skládání“: zamčený model v Dílně = **jen přehyby tužkou na listu, bez výplně** (skica, jak se složí). Nepotřebuje zámek ani šedou kopii a sedí do P1 (jediná nakreslená věc je vlaštovka). Navazuje na `02-ux-dilna.md` §0 bod 5 (zamčený vzhled jako tužková skica).
- **M8 Kontrola nového modelu:** spustit `siluety.mjs` s novým tvarem → IoU ≤ 0,75 proti všem, plocha a poloměr v mezích, snímek v šedi čitelný na 24 px.

---

## 2. Systém skinů

### 2.1 Vrstvy vlaštovky

| Vrstva | Co mění | Kdo o ní rozhoduje | Smí se měnit skinem? |
|---|---|---|---|
| 1 **Model** | silueta, přehyby, let | game design, Dílna za mince | ne |
| 2 **Papír** (Copy → Kraft → Washi → Foil) | tón listu, vlákna, korunka 3. úrovně, tvar stopy podle `01-papiry` | žebřík rychlosti, automaticky | ne |
| 3 **Potisk** (skin) | kresba přes papír: linky, plochy, malé motivy | hráč, jeden | **ano** |
| 4 **Ozdoba** (skin, volitelná) | jedna malá 3D věc nebo barva přehybu: mašle na ocase (Kite Tail), cihlová nit místo tužky (Needle Thread), krémový lem v noci (Night Mail) | hráč, se skinem | **ano** |
| 5 **Razítko** | malá nálepka na pravém křídle (01 §3.3) | hráč, jedno nebo žádné | ano (samostatně) |
| — **Obrys** | grafit 2,6 px | bible P1 | **nikdy** |
| — **Stín, velikost** | S4 (`08-stiny`), `plan.plane.scale` | bible | **nikdy** |
| — **Stopa** | barva dle čtvrti (grafit, večer krém), čárka `PAPER_TRAIL` | bible kap. 2.3, 01-papiry | **ne** (kap. 2.4) |

Souhlasím s doporučením game designera (01 BLOCKED 2, varianta a): **skin je potisk přes papír, ne jiný papír.** Z pohledu artu je to také čitelnější: tón papíru (rychlost) zůstane vidět a potisk se zdálky slije do tónu papíru, takže čitelnost za letu se nemění. Rozhodnutí je stejně na uživateli (BLOCKED 2 níže).

### 2.2 Co skin nesmí (čitelnost, P1)

- **S1 Obrys** grafitový 2,6 px, nikdy jiná barva, tloušťka nebo druhý obrys (bible kap. 3 a 6.1). Potisk nesmí kreslit čáru podél okraje: zdvojený obrys by vypadal jako tlustší, rozmazaný.
- **S2 Večerní pravidlo:** průměrná světlost horní plochy (lineárně, jak ji zprůměruje mipmapa) **L ≥ 0,45** na všech papírech. Odvození: grafit × večerní nebe `#1d2b4d`–`#4a5f8f` je 1,1–2,0 : 1 (obrys večer nepomáhá), výplň × `#4a5f8f` ≥ 3 : 1 ⇒ L ≥ 0,449. Spodní plochy jsou papír × `#cdd3e3` (×0,65), proto **papír L ≥ 0,70**.
- **S3 Ve dne nese vlaštovku obrys** (6,7 : 1 ráno, 5,4 poledne, 8,2 zlaté odpoledne, nejhorší pás nebe). Výplň × nebe je u všech skinů 1,0–1,1. To je v pořádku, platí to i pro dnešní bílou (bible 2.4). Potisk proto **nesmí být tmavý u obrysu**: tmavá plocha u okraje by obrys „rozpustila“. Tmavé motivy (grafit, `#22355e`) jen ≥ 0,08 délky od okraje, nebo jako tenké linky.
- **S4 Role barev:** v potisku **nejsou** tokeny `tomato` `#d9472b` (perfekt), `mustard` `#e2a43a` (hodnota), `teal` `#13807d` (úspěch), `cobalt` `#2456c9` (fokus). Červenou zastupuje cihlová `#b5503c` (střechy čtvrti 1), žlutou okrová `#c98a4a` nebo broskvová `#f0a27a`, zelenomodrou šalvějová `#5aa6a0`. **Žádný zlatý ani hořčicový skin** („hořčicová jen hodnota“, 06 a bible 2.2). Proto ani „zlatá vlaštovka za finále“.
- **S5 Pokrytí potiskem ≤ 30 %** horní plochy (01 §3.1), lazura (průsvitný tón přes celou plochu) nejvýš alfa 0,5. U všech 16 skinů je pokrytí 2–20 %, jen Daybreak je lazura.
- **S6 Žádný pohyb a záře ve dne.** Potisk se nehýbe, nebliká, nesvítí. Výjimka: **lampionové skiny smí v Městě lampionů svítit** (bible: emise jen lampiony a okno Dílny). Záře je měkký kruh ≤ 1,5 × délka vlaštovky s alfou ≤ 0,25, ne bílá s grafitem (bible 6.2).
- **S7 Ve výšce letu nic bílého s grafitem** (bible 6.2) platí i pro ozdoby: mašle Kite Tail je papír s obrysem, protože je součástí vlaštovky. Je krátká (≤ 0,4 délky, 3 mašle) a nesmí vypadat jako čárky stopy: mašle jsou **trojúhelníčky v barvě potisku**, ne grafitové čárky.

### 2.3 Paleta skinů

Skin si bere barvy **jen z existujících tokenů a palet čtvrtí** (bible 2.1 a 2.3), žádné nové odstíny. Každý skin má nejvýš **3 barvy potisku** + papír.

| Skupina | Barvy (hex) | Původ |
|---|---|---|
| Linky | `#2a2622` grafit (jen tenké), `#6b6158` tužka, `#3d4f7a` okna / indigo | tokeny, okna čtvrti 1 |
| Teplé | `#b5503c` cihlová, `#f0a27a` broskvová, `#e0a060` lampion, `#d9967a` dálka čtvrti 3, `#c98a4a` okrová, `#9c7a55` kraft tmavý | čtvrti 1 a 3 |
| Studené | `#7f9ed6` modrá ulice, `#5b8fb0` / `#9ec2d6` přístav, `#22355e` námořní, `#5aa6a0` šalvěj | čtvrti 1 a 2 |
| Pastely | `#e98fa0` růžová, `#9cc3a6` mátová, `#ffe0e8` → `#fff0b0` úsvit | čtvrť 1, úsvit za cílem |

**Vazba na čtvrti:** suvenýr čtvrti bere barvy **své** čtvrti (Harbor Chart modré přístavu, Field Almanac okrové pole). Hráč tak nosí kus místa s sebou. Za letu ale nad jinou čtvrtí nesmí splynout. To hlídá S2 a S3 (měřeno proti všem čtyřem nebím, kap. 3).

### 2.4 Stopa a skin

Stopu skin **nemění** (01 §3.1, souhlasím). Stopa je dráha letu a hlavní ukazatel polohy na telefonu (bible 6, 01-papiry §4), barvu jí dává čtvrť a tvar papír. Třetí vrstva by ji přetížila a hráč by ztratil čtení „kde letím“. Původní seznam v zadání („stopa“) proto nepoužívám. Pokud by uživatel stopu jako odměnu chtěl, jediná bezpečná varianta je **tvar čárky** (tečky, steh) při stejné barvě a pokrytí ≥ 50 % délky. Nedoporučuji (BLOCKED 3).

### 2.5 Kde se skin ukáže

| Obrazovka | Velikost vlaštovky | Co ze skinu je vidět |
|---|---|---|
| Let na telefonu | ~24 px | jen tón a velké pruhy (`skiny.png`, sloupce 3–6): poznat jsou Sail Stripes, Morning Paper, Lantern Night, Daybreak; ostatní vypadají jako bílá |
| Let na desktopu | ~58 px | motiv tušený, pruhy a plochy ano |
| Míření, Dílna, výsledek, hlavní menu | dítě drží vlaštovku, náhled Dílny | celý potisk |
| Ikona v Dílně (karta 120 × 132 px) | 2D půdorys | celý potisk (stejná funkce kreslení jako textura) |

Je to záměr, ne chyba: za letu má vyhrát čitelnost (P1). Doporučení pro UX: **ukázat skin zblízka po odemčení** (Dílna se otáčející vlaštovkou, 01-papiry §5.1) a v hlavním menu, kde vlaštovka krouží (01 §3.4).

---

## 3. Karty skinů (16)

Sloupec „Vazba“ je jen návrh vhodné vazby. **Podmínky určuje game designer** (K0–K11 jsou z `01-game-design.md` §3.2, N1–N4 nabízím navíc). „L“ = průměrná světlost horní plochy na papírech Copy / Kraft (světlý `#ead7b5`) / Washi `#fbe8cc` / Foil (zástupně `#e9edf2`), musí být ≥ 0,45 (S2). Kontrast proti nebi: ve dne nese vlaštovku obrys (5,4–8,2 : 1, stejně pro všechny skiny), večer výplň: **výplň × nejsvětlejší horní pás večera `#4a5f8f` = (L + 0,05) / 0,166**. Kód: všechny potisky jsou **textura z plátna** (kap. 4.2), ozdoby jsou malá geometrie nebo barva přehybu.

| # | Skin EN / CS | Motiv | Barvy potisku | Pokrytí | L (C / K / W / F) | Večer výplň × nebe | Za letu (telefon) | Vazba (návrh) |
|---|---|---|---|---|---|---|---|---|
| K0 | **Plain** / Čistý | bez potisku | — | 0 % | 1,00 / 0,69 / 0,83 / 0,84 | 6,3 | bílá | od začátku |
| K1 | **Sunrise Postcard** / Pohled ze střech | linka střech a komínů tužkou přes zadní třetinu, broskvové slunce, známka v rohu | `#2a2622` `#f0a27a` `#5aa6a0` | 4 % | 0,97 / 0,68 / 0,80 / 0,82 | 6,1 | bílá, tečka známky | suvenýr čtvrti 1 (postava čtvrti) |
| K2 | **Harbor Chart** / Přístavní mapa | vrstevnice hloubky, kotva | `#5b8fb0` `#9ec2d6` `#2a2622` | 14 % | 0,93 / 0,66 / 0,78 / 0,79 | 5,9 | světle modravá | suvenýr čtvrti 2 |
| K3 | **Field Almanac** / Polní kalendář | stébla klasů, větrník, hvězdičky | `#c98a4a` `#2a2622` `#6b6158` | 7 % | 0,95 / 0,67 / 0,79 / 0,80 | 6,0 | teplá bílá | suvenýr čtvrti 3 |
| K4 | **Lantern Night** / Lampionová noc | žebra lampionu, broskvový okraj u ocasu, 3 lampiony | `#e0a060` `#d9967a` `#f0a27a` (+ `#b5503c`) | 16 % | 0,90 / 0,65 / 0,76 / 0,77 | 5,7 | teplý tón, pás u ocasu; v čtvrti 4 měkká záře (S6) | suvenýr čtvrti 4 / finále |
| K5 | **Airmail Delivered** / Doručeno | šipky letecké pošty na odtokové hraně, kulaté razítko přes křídlo | `#b5503c` `#3d4f7a` `#6b6158` | 10 % | 0,92 / 0,64 / 0,76 / 0,77 | 5,8 | tmavší zadní hrana | finále „Delivered.“ |
| K6 | **Hawk Feather** / Sokolí pero | tahy per do V tužkou, hnědé konce křídel | `#6b6158` `#9c7a55` | 11 % | 0,91 / 0,64 / 0,75 / 0,77 | 5,8 | jemně šedá | podpis Hawk |
| K7 | **Kite Tail** / Drakův ocas | kosočtverce draka v pastelech + **ozdoba: 3 mašle na ocase** | `#e98fa0` `#7f9ed6` `#9cc3a6` `#6b6158` | 12 % | 0,92 / 0,65 / 0,77 / 0,78 | 5,8 | barevné tečky, mašle | podpis Kite |
| K8 | **Skimmer Ripples** / Kruhy na vodě | soustředné kruhy | `#5aa6a0` | 6 % | 0,96 / 0,67 / 0,80 / 0,81 | 6,1 | bílá | podpis Skimmer |
| K9 | **Sail Stripes** / Plachtové pruhy | námořnické pruhy napříč, ne u nosu | `#22355e` | 19 % | 0,82 / 0,57 / 0,68 / 0,69 | 5,2 (Kraft 3,7) | **pruhy viditelné** | podpis Sail |
| K10 | **Needle Thread** / Nit | steh po délce, **ozdoba: přehyb cihlovou nití** místo tužky | `#b5503c` `#6b6158` | 2 % | 0,98 / 0,68 / 0,81 / 0,83 | 6,2 | bílá | podpis Needle |
| K11 | **Night Mail** / Noční pošta | souhvězdí tečkami, **ozdoba: krémový lem jen v noci** (Night Route) | `#3d4f7a` `#6b6158` | 2 % | 0,99 / 0,68 / 0,81 / 0,83 | 6,3 | bílá, v noci lem | Night Route (později) |
| N1 | **Ruled Notebook** / Linkovaný sešit | modré linky sešitu dítěte, cihlová okrajová linka | `#7f9ed6` `#b5503c` | 16 % | 0,89 / 0,63 / 0,74 / 0,76 | 5,7 | světle modravá | první model koupený za mince („první sešit z Dílny“) |
| N2 | **Morning Paper** / Ranní noviny | sloupce textu šedě, titulek grafitem | `#8c8379` `#2a2622` | 20 % | 0,84 / 0,59 / 0,70 / 0,71 | 5,4 (Kraft 3,9) | **šedá, titulek jako pruh** | Sunrise Roofs: první přelet všech 4 míst čtvrti 1 / „první zpráva“ |
| N3 | **Asanoha** / Origami konopí | japonský vzor hvězdic indigem (origami papír chiyogami) | `#3d4f7a` | 15 % | 0,86 / 0,60 / 0,71 / 0,73 | 5,5 | jemně šedomodrá | první perfektní série (Echo) nebo Washi papír |
| N4 | **Daybreak** / Úsvit | lazura přes přední polovinu: růžová → žlutá úsvitu za cílem | lazura `#ffe0e8` → `#fff0b0`, alfa ≤ 0,5 | lazura | 0,90 / 0,79 / 0,84 / 0,84 | 5,7 | **teplá špička** | úsvit za cílem (po finále) |

Pozn.: L u Kraftu počítá se **světlým Kraftem `#ead7b5`**, který navrhuji místo `#c08550` (kap. 6). S dnešním Kraftem by nevyhověl žádný skin, ani Plain.

**Rezerva** (stejná pravidla, kdyby game designer chtěl víc): Bunting / Praporky (Trh, místo 2), Pinwheel / Větrník (Hřeben větrníků, bonus Pinwheel), Graph Paper / Čtverečkovaný papír, Ticket / Jízdenka (Železnice, místo 4), Seed Packet / Sáček semínek (Zahrady). Nejsou nakreslené v `skiny.png`, před zařazením projdou stejným měřením.

**Zakázané příklady** (měřeno stejně): Blueprint / modrotisk `#2456c9` (L 0,20, večer 1,5 : 1 a kobaltová je fokus), Gold / zlatá `#e2a43a` (hořčicová = hodnota, večer 2,9), Tomato / rajčatová (perfekt, večer 1,5), celý Kraft `#c08550` (večer 2,0).

### 3.1 Razítka (01 §3.3)

Kulatá nebo hranatá nálepka **≤ 10 % plochy** na pravém křídle (u = 0,35, v = 0,75 v souřadnicích listu), krémový podklad `#fbf6ec` s tužkovou kresbou a jedním akcentem z palety skinů. Ikony rozlišené **tvarem bez barvy**: Gust = 3 vlnky, Pigeon = origami holub, Steam = 3 obláčky, Thermal = spirála, Drone = papírový drak, Shooting Star = hvězda s ohonem (pozor: ne pěticípá rajčatová hvězda perfektu, ale 4cípá tužková), Delivered = obálka. Razítko se kreslí do stejné textury jako potisk (0 DC). Za letu není vidět, to je v pořádku.

---

## 4. Technická omezení pro game-deva

### 4.1 Geometrie modelů

- Modely v kódu jako dnes (`geometry.planeShape(model)`, tabulka `SHAPES`). Tvar se dá převzít ze `siluety.mjs` (`M`, polovina se zrcadlí). Pro hru přidat do `planeShape` i **`uv`** (kap. 4.2) a pro svislé plochy příznak „papír“ (M6).
- **Rozpočet: ≤ 12 △ na model** (dnes 4–6, návrh 6–8). Obrys razítkem kreslí 8 kopií (`STAMP_DIRS`), tedy ≤ 96 △ obrysu. Na scénu zanedbatelné proti 15 tis. △ na místo.
- **Draw calls beze změny:** vlaštovka = výplň + obrys + přehyb + stopa (4) + stín do masky (1). Ozdoba (mašle K7) se **sloučí do geometrie výplně** (stejný materiál), takže +0 DC. Záře K4 v čtvrti 4 je jediná výjimka: +1 DC (průhledný kruh), jen ve čtvrti 4.
- **Dílna drží vlaštovku stejným tvarem** (`workshop.js shapeOf`), takže každý nový model musí fungovat i v ruce dítěte (`HAND`) a v náhledu Dílny. Změna modelu = výměna geometrie bez nové alokace za snímek (jako dnes `setModel`, geometrie v cache).

### 4.2 Textura skinu

- **Jedna `CanvasTexture` 256 × 256** pro aktivní skin (a razítko v ní). Vzniká jednou při změně skinu, ne za snímek. Paměť ~256 kB + mipmapy ~340 kB. Mipmapy zapnuté, `colorSpace = SRGB`, anizotropie 4 (vlaštovka je za letu šikmo). Za letu se potisk slije do tónu, což je žádoucí.
- **Data potisku jako čistý modul** (např. `src/render3d/skins.js`, bez three.js a DOM, do `render3d-purity.test.js`): seznam kreslicích příkazů (linky, kruhy, polygony, lazura) v souřadnicích listu 0–1 a barvy z tokenů. Kreslí je jedna funkce do plátna. Stejná funkce kreslí **ikonu do karty v Dílně** (2D DOM canvas), takže ikona a vlaštovka vždy souhlasí. Testy v Node: pokrytí ≤ 30 %, průměrná L ≥ 0,45 na všech papírech, žádný zakázaný token (S4). Měření stejné jako `skiny.mjs`.
- **UV = půdorys listu** (u = od ocasu k nosu, v = rozpětí, normalizované podle modelu). Potisk tak sedí na všech modelech (02 §1: skin nezávislý na modelu). Motivy, které musí být na určitém místě (razítko, známka), se kreslí do středu křídla, kde ho mají všechny modely. Hawk má úzká křídla: razítko se zmenší tak, aby se vešlo (u Hawka v = 0,7 na křídle).
- **Spodní plochy bez potisku a bez druhého materiálu:** UV spodních ploch míří do rohu textury (8 × 8 px vyplněných barvou papíru × `#cdd3e3`), takže zůstane 1 materiál a 1 DC.
- **Materiál:** dnešní `MeshBasicMaterial({vertexColors})` dostane `map`. Barva vrcholů horních ploch = barva papíru (dnes bílá), takže `map × vertexColor` dá potisk na papíru. Papír se nemusí kreslit do textury, textura je potisk na bílém (bílá × papír = papír). Pozor: tmavé linky se tím ztmaví i na Kraftu, což je správně.
- **Lazura** (N4) se kreslí s alfou do bílé textury: výsledek je tón × papír, nikdy tmavší než L 0,45 (test).
- **Žádné shadery navíc** pro potisk. Foil (01-papiry) má vlastní shader podle pohledu. Skin na Foilu se kreslí stejně, jen se nesmí lesknout (S6).

### 4.3 Přístupnost a pohyb

- Skiny jsou statické, reduced motion nic nemění. Mašle K7 se za letu „on twos“ pohupuje (12 kreseb/s jako prostředí, bible 7), s reduced motion stojí. Záře K4 nepulzuje.
- Skin, model ani razítko nenesou jedinou informaci barvou: v Dílně má každý jméno (i18n EN/CS) a jiný tvar ikony.

### 4.4 Ověření v prohlížeči (pro game-deva / art-review po implementaci)

- `measure()` (bible 2.4) se všemi modely a skiny K9, N2 (nejtmavší) ve 4 čtvrtích: obrys × okolí ≥ 3 ve dne, výplň × okolí ≥ 3 ve čtvrti 4.
- Snímky 375 × 667, 932 × 430, 1280 × 800: let (každý model aspoň jednou), událost s kruhem QTE (M4), Dílna s každým modelem v ruce.
- Perf: `__r3d.bench` s nejtěžším skinem a modelem, DC se nesmí změnit (kromě K4 ve čtvrti 4 +1).

---

## 5. Ano / ne

| Téma | Ano | Ne |
|---|---|---|
| Silueta | `siluety.png` řádek 3 (Hawk): odděleným křídlem je vidět nebe, poznáš ho i na 24 px | `siluety-pruzkum.png` řádek 7 (vidlice): krásná shora, z boku na 24 px splyne se šipkou |
| Výběžek | `siluety.png` řádek 6 (Sail): plachta 0,52 délky nad trupem | dvouplošník s mezerou 0,17 (`siluety-pruzkum.png`, první verze): mezeru zaroste obrys |
| Skin za letu | `skiny.png` K9 Sail Stripes: pruhy jsou vidět i na 24 px a vlaštovka zůstane světlá | modrotisk / zlatá / rajčatová (kap. 3, zakázané): večer zmizí, nebo si hráč splete roli |
| Skin zblízka | `skiny.png` K2 Harbor Chart, sloupec 1–2: motiv čtvrti, funguje na Copy i Kraftu | potisk tmavý u okraje (S3): rozpustí obrys |
| Stopa | grafitová čárka podle čtvrti beze změny | barevná stopa za skin (SV15, 01 §3.5) |

---

## 6. Rozpory kód × návrh × bible

1. **Papíry (`research/design/01-papiry.md`) jsou navržené pro neonový styl, ne pro Papírové město.** Schválené 14. 10. (airmail lem Kraftu, vlnky Washi, korunky), ale:
   - Kraft `#c08550` / `#e6b077` má L 0,29 / 0,49. Ve čtvrti 4 je výplň × nebe 2,0 : 1 a obrys tam nepomůže (1,1). **Nesplňuje dvojí hranu bible 6.1.** Návrh: v Papírovém městě světlý Kraft `#ead7b5` (L 0,69, večer 4,5 : 1) s tmavšími vlákny jen jako vzor.
   - Obrysy papírů (Kraft hnědý 2,9 px, Washi indigo 2,0 px, Foil + magentový druhý obrys 4,6 px) jsou v rozporu s bible kap. 3 („obrys grafit 2,6 px, papíry mění tloušťku jen nahoru“) a s koncem magenty a neonu (bible 15). Návrh: obrys vždy grafit, Kraft smí 2,9 px.
   - **„Neon Foil“**: jméno i vzhled (duha `#ff4f9e` `#ffe14d` `#4a22c8` `#5cf2ff`) patří do zrušeného neonu. Návrh: „Foil“ / „Stříbrná fólie“ se studeným perleťovým leskem v paletě úsvitu. Jméno je věc product-designera a uživatele.
   - Kontrastní tabulka 01-papiry §4 je počítaná proti starým nebím Suburbs/Docks/Horizon/Core, ne proti nebím bible 2.3.
   → **Papíry potřebují přepracovat pro Papírové město dřív, než se nad ně položí skiny** (BLOCKED 1).
2. **`planeColors` barví svislé plochy jako spodní** (`plane.js`, ny ≤ 0,3 → `under`). Pro Sail a ploutvičky je to špatně (M6).
3. **`planeShape` nemá UV** (`geometry.js`). Potřeba pro potisk (01-papiry §2 to už zmiňuje).
4. **`02-ux-dilna.md` §0 bod 1** mluví o třech vrstvách (model, papír, vzhled), 01 o pěti (+ razítko, stopa). Tady je to sjednocené v tabulce 2.1, stopa bez kosmetiky (souhlas s 01).
5. **Kruh QTE vs. velikost modelu** (M4): přepočet log. px na CSS px na telefonu jsem bez prohlížeče neověřil (NOT ASSESSED).
6. **Bible 05 zatím nemá kapitolu o modelech a skinech.** Po schválení navrhuji doplnit do bible kap. 3 (pravidla M1–M8) a kap. 13 (kontrolní seznam: IoU, L ≥ 0,45, zakázané tokeny). Vlastník bible je art-director, zapíše se až po schválení.

---

## 7. Otevřené otázky (pro uživatele přes orchestrátora)

**BLOCKED 1: Papíry v Papírovém městě.** Dnešní návrh papírů (Copy, Kraft, Washi, Neon Foil) vznikl pro neonový styl. Kraft je moc tmavý na večerní čtvrť (vlaštovka by tam splynula s nebem, 2,0 : 1) a „Neon Foil“ s duhovým leskem a magentovým obrysem patří do stylu, který končí. Možnosti: (a) přepracovat papíry pro Papírové město: světlý Kraft `#ead7b5`, obrys vždy grafit, místo Neon Foil „Foil / Stříbrná fólie“ v barvách úsvitu; (b) nechat podle 01-papiry a večer Kraft zesvětlit jen ve čtvrti 4; (c) papíry vzhledově neodlišovat vůbec (jen čísla a korunka), vzhled nese skin. **Doporučuji (a)**: papír zůstane vidět, vlaštovka nikdy nezmizí a skiny mají stálý podklad. Příklad: `skiny.png`, sloupec 2 = skiny na světlém Kraftu.

**BLOCKED 2: Co skin mění.** Stejná otázka jako 01 BLOCKED 2, z pohledu artu: (a) **potisk přes papír** (tón listu dává papír, skin kreslí motiv, `skiny.png`); (b) skin přebarví celý list; (c) hráč volí. **Doporučuji (a)**: za letu na telefonu se potisk slije do tónu papíru, takže čitelnost se nemění a papír dál ukazuje rychlost. Daň: za letu na telefonu se většina skinů pozná jen málo (kap. 2.5). Plně je uvidíš v Dílně, při míření a v menu.

**BLOCKED 3: Stopa jako odměna.** Zadání zmiňuje i „stopu“. (a) Stopa bez kosmetiky (barva podle čtvrti, tvar podle papíru); (b) skin smí změnit tvar čárky (tečky, steh) při stejné barvě. **Doporučuji (a)**: stopa je hlavní ukazatel, kde vlaštovka letí, a už nese dvě informace.

**BLOCKED 4: Siluety nových modelů.** `siluety.png`: Hawk jako „letadýlko“ s odděleným šípovým křídlem, Kite jako vysoký lichoběžník, Skimmer jako plochá tupá deska s konci dolů, Sail s plachtou nahoru, Needle jako tenká jehla s ploutvičkou. (a) Schválit tyhle tvary jako zadání pro katalog (game-dev je vymodeluje a ukáže v Dílně i za letu); (b) jiný směr: všechny modely jako varianty klasické šipky (menší rozdíly, na telefonu hůř poznat); (c) méně modelů. **Doporučuji (a)**: na 24 px jsou od sebe rozlišitelné stejně dobře nebo líp než dnešní Dart a Glider.

**BLOCKED 5: Svítící lampionový skin.** Lantern Night (K4) by ve večerní čtvrti jemně svítil jako lampion (měkký teplý kruh, +1 draw call jen tam). (a) Ano, jen ve čtvrti 4; (b) nesvítí nikdy, je jen potisk. **Doporučuji (a)**: lampiony jsou jediné, co smí v Papírovém městě svítit, a skin tak nese příběh čtvrti. Náklad je malý.
