# Blok 6 — Časování, QTE a ovládání

**Datum rešerše:** 13. 10. 2026 · **Stav:** první verze, prošla ověřovacím kolem 13. 10. 2026 (změny viz poslední oddíl).
**Navazuje na:** `KB zabavnost a motivace.md` (B01 brzy/pozdě, B06 čitelnost prvního QTE). Tamní tabulka časování QTE je starší snímek kódu (okno 2 s, ±0,2 s). Tento dokument vychází z aktuálního `src/events.js`: poryv má varování 0,8 s, pruh 1,2 s, střed 1,4 s od začátku události, úspěch ±0,28 s a perfektní zásah ±0,10 s. Holub měří délku držení se středem 0,75 s, úspěch ±0,25 s a perfektní zásah ±0,10 s. Okna se násobí faktorem přehybů 1 + 0,1·úroveň (ověřeno v kódu: `UPGRADE.window = 0.1` v `config.js`, `windows(f)` v `events.js`; střed se nenásobí).

Štítky: **V** výzkumný poznatek · **H** heuristika nebo praxe oboru · **N** naše hypotéza pro Just Throw It. Čísla v hranatých závorkách odkazují do registru zdrojů (sekce 6).

---

## 1. Klíčová zjištění v kostce

1. **V — Časované stisky mají vlastní model chyb.** Lee a Oulasvirta [1] popisují „temporal pointing“ (stisk v časovém okně) modelem chyb podobným Fittsovu zákonu. Hráč má implicitní bod zamíření v okně. Kolem něj vzniká gaussovský rozptyl ze tří zdrojů: vnitřních hodin, motorického provedení a zpracování vstupu v zařízení. Chybovost tedy roste se zužováním okna a s délkou intervalu, který musí hráč odměřit. Pokud je okno širší než reakční doba (~300 ms), může hráč místo předvídání jen reagovat.
2. **V — Na dotykových zařízeních je časování horší, a nejde jen o latenci.** U dotyku je méně jasné, ve kterém okamžiku senzor vstup zaznamená, a to zvětšuje rozptyl [1]. Uvolnění (release) přišlo v jejich datech v průměru o 10–20 ms později než stisk.
3. **V — Celková latence zařízení se liší až čtyřnásobně.** Na 26 telefonech byla součtová latence displeje a dotyku 35–140 ms (IQR 60–90 ms) a Android měl delší latenci displeje než iOS [2]. Měřily se nativní aplikace. Pro web (doplněno v ověřovacím kole) naměřili Pronk a kol. [33] u webové aplikace na dvou telefonech průměrné nadhodnocení reakční doby 58 ms (iPhone 6S) a 66–70 ms (Galaxy S7), se směrodatnou odchylkou jen ~7 ms. Prohlížeč tedy na těchto zařízeních nepřidal řádově víc než nativní rozsah. Rozdíl mezi zařízeními (~100 ms) je srovnatelný s naším perfektním oknem ±100 ms. Jde ale hlavně o **stálý posun** daného zařízení, ne o náhodný rozptyl.
4. **H/V — Naše okna jsou velmi tolerantní.** Úspěšné okno poryvu (±280 ms) je širší než nejmírnější hodnocení v osu! (50 při OD 0: ±200 ms) i v StepManii (Boo ±180 ms). Perfektní okno (±100 ms) zhruba odpovídá hodnocení „100“ v osu! při OD 5. Šířka sama o sobě tedy problém není. Problém je jinde, viz bod 5.
5. **V/N — Stálý střed okna mění úkol ve vnitřní odměřování.** Při pevném intervalu mezi výstrahou a cílem si lidé vytvářejí časové očekávání; tuto přípravu dokládá výzkum předperiody („foreperiod“) [14][15]. Směrodatná odchylka odměřeného intervalu roste úměrně jeho délce (skalární vlastnost), u lidí bez počítání s variačním koeficientem asi 0,10–0,16 (Wearden 1991, ověřeno plným textem) [11][12]. U nás je střed poryvu vždy 1,4 s od začátku varování a 0,6 s od začátku pruhu. Hráč tedy může ignorovat kruh a odměřovat. Pro bezpečný úspěch to stačí. Perfektní zásah odměřením od začátku pruhu vychází zhruba v 70–90 % a u holuba v 60–80 % (viz výpočty v sekci 3.4).
6. **V — Zvuk se časuje přesněji než záblesk; plynulý pohyb pomáhá dohnat zvuk.** Synchronizace se zvukovými rytmy je přesnější než s vizuálními záblesky. Spojitý pohyblivý vizuální podnět (pohybující se tečka) rozdíl zmenšuje [13]. Prostá zraková reakční doba je delší než sluchová, v malé studii ~331 proti ~284 ms [9]. Zmenšující se kruh je pohyblivý podnět, což je dobře. Krátký zvukový „tik“ na středu okna by mohl pomoci ještě víc (N).
7. **H — Přístupnost:** Game Accessibility Guidelines [21][22] a Xbox Accessibility Guidelines [19][20] doporučují QTE vynechat, nebo nabídnout jejich zjednodušení či přeskočení a zpomalení hry. Doporučují také nevyžadovat přesné časování a nahrazovat dlouhé držení přepínačem. U nás už pomáhá, že nečinnost se netrestá a stisk během varování se ignoruje. Chybí nastavení.
8. **V — Věk:** Jednoduchá reakční doba se mění málo zhruba do 50 let, výběrová se zpomaluje v celé dospělosti [10]. Děti (~9,5 roku) mají v úloze koincidenčně-anticipačního časování (CAT) větší absolutní i variabilní chybu než dospělí a chyba roste s rychlostí podnětu [7].
9. **H — Odpuštění vstupu je standardní, a když je skryté, funguje nejlépe.** Celeste používá coyote time, vyrovnávací paměť skoku a další neviditelné tolerance [29]. Rytmické hry nabízejí ruční nebo automatickou kalibraci zpoždění zvuku a obrazu [28].
10. **N — Ukazatel síly je už teď velmi odpouštějící.** Cosinový průběh `chargeAt` je u vrcholu plochý. „Perfektní síly“ (≥93 %) se dosáhne kdekoli v okně ±198 ms kolem 1,15 s, a to stojí nejvýš ~2,5 % rychlosti. Dovednost v hodu se tak projevuje hlavně v hrubé chybě (pustit příliš brzy nebo pozdě o půl sekundy), ne v jemném časování.

---

## 2. Rychlá mapa důkazů

| Podtéma | Nejsilnější zdroj | Síla | Přenositelnost |
|---|---|---|---|
| Model chyb v časovém okně | Lee & Oulasvirta 2016 [1] | V, recenzovaný CHI, N = 20 + 10 | Střední: laboratoř, klávesnice a touchpad, ne dotyková obrazovka telefonu |
| Latence zařízení | Nicosia et al. 2022 [2] | V, robotické měření, 26 telefonů | Nativní aplikace, web nezahrnut |
| Vnímání latence dotyku | Deber et al. 2015 [3] | V, plný text, N = 14 (24 sezení) | Vnímání zpoždění odezvy, ne přesnost časování |
| Latence webu na telefonu | Pronk et al. 2020 [33] | V, externí měření, 2 telefony + 2 notebooky | Starší špičkové telefony, ne levný Android |
| Tolerance latence podle typu hry | Claypool & Claypool 2006 [5]; Long & Gutwin 2018 [6] | V | Hrubé prahy, síťové hry |
| Koincidenčně-anticipační časování | Figueiredo & Barreiros 2013 [7]; Kim 2023 [8] | V, malé vzorky | Bassinův časovač ≠ obrazovka |
| Reakční doba a věk | Der & Deary 2006 [10] | V, N = 7 130 | Laboratorní RT, ne hra |
| Skalární časování | Wearden 1991 [12]; Green, Ivry & Woodruff-Pak 1999 [11] | V, plné texty | Intervaly 200 ms – 1,5 s odpovídají našim; malé vzorky, laboratorní produkce intervalu |
| Okna rytmických her | osu! wiki [25][26], StepMania [27] | H (primární specifikace) | Pro srovnání, ne norma |
| Přístupnost | GAG [21][22], XAG [19][20], Apple HIG [17] | H | Přímo použitelné |
| Kritika QTE | Leach 2010 [24], Mc Donald 2026 [23] | H / teoretický abstrakt | Empirický výzkum QTE jsem nenašel |

---

## 3. Podrobné sekce

### 3.1 QTE: co o nich víme a co ne

**Stav výzkumu.** Kontrolovanou recenzovanou studii, která by měřila prožitek z QTE (imerzi, frustraci, učení), jsem nenašel. Hledal jsem obecně i cíleně (CHI PLAY, FDG, Heavy Rain). Literatura o QTE je převážně esejistická. **Pozor:** po vyčerpání vyhledávacího limitu jsem nemohl pokračovat v ACM DL ani Google Scholar. Absence tedy znamená „nenalezeno“, ne „neexistuje“.

- **H — Rozpor mezi QTE a sledováním scény.** Leach [24] (Gamasutra, 2010) tvrdí, že výzva QTE odvádí zrak od děje. Hráč přepíná mezi příběhem a výzvou. Srovnává umístění výzev: Indigo Prophecy je má uprostřed přes akci, God of War 3 na okrajích obrazovky (pozice = tlačítko, čte se periferně), Heavy Rain u místa akce. Batman: Arkham Asylum ukazuje jen symbol nad útočníkem, takže hráč reaguje na scénu, ne na tlačítko. *Síla:* esej bez dat, autor sám uvádí rozporné studie o dělení pozornosti. *Přenositelnost:* vysoká. Náš časovací kruh je kreslený u vlaštovky, tedy v místě, kam se hráč dívá, což odpovídá doporučenému směru.
- **H/teorie — Varianty vstupu mění emoční průběh.** Mc Donald [23] (DiGRA 2026, rozšířený abstrakt, University of Malta) teoreticky srovnává mačkání tlačítka a jeho přístupnou variantu „podržet“ v QTE z The Last of Us Part II. Předpokládá, že mačkání vytváří ostřejší špičky napětí, zatímco držení dává plošší a trvalejší průběh. Jde o konceptuální křivky bez dat. *Přenositelnost:* nízká, náš žánr nestaví na napětí. Užitečný je argument, že přístupnostní varianta mění zážitek, a proto má být volitelná, ne výchozí.
- **V (nepřímo) — Kdy QTE fungují:** jen ze syntézy [1][14] a heuristik. Fungují, když je výzva čitelná dopředu, okno odpovídá schopnostem hráče a výsledek je zpětně vysvětlitelný. Nefungují, když se z nich stane test reakční doby na nečekaný podnět nebo memorování. Existující KB pro to už navrhuje B01 („brzy / pozdě“).

**Omezení:** Typický filmový QTE (náhlá výzva + tlačítko) je jiný úkol než náš. My máme ohlášenou událost s viditelným odpočtem, což má blíž k jedné notě rytmické hry nebo ke golfovému ukazateli.

### 3.2 Model chyb v časovém okně (temporal pointing)

**V — Lee & Oulasvirta 2016 [1], CHI, recenzováno.**
- *Experiment 1 (N = 20, věk M = 28):* bliká kruh s pevnou periodou. Šířky okna Wt = 50 / 116,7 / 200 ms (celková šířka, tj. ±25 až ±100 ms), vzdálenosti Dt = 600 / 900 / 1 200 ms. Pět vstupních metod: stisk klávesy, uvolnění klávesy a tři varianty dotyku na touchpadu notebooku. Každý účastník provedl 100 výběrů na úroveň.
- *Hlavní nálezy:* Rozptyl odpovědí roste s Dt i Wt. Model vysvětluje chybovost s R² = 0,997, pokud se vyřadí Dt = 600 ms. Pod ~600 ms přestává pro vizuální podnět platit, protože narazí na rychlostní limity synchronizace. Střed rozložení odpovědí (posun proti cíli) vyšel pro dotyk-stisk 12,4 ms, stisk klávesy 23,7 ms, dotyk-uvolnění 36 ms a uvolnění klávesy 43,5 ms. **Uvolnění přichází o 10–20 ms později než stisk.**
- *Experiment 2 (N = 10):* replika Flappy Bird s časovými okny 21–264 ms. Model vystihl chybovost s R² = 0,87.
- *Doporučení autorů:* Pro vizuálně ohlášený úkol volit Dt ≥ 700 ms, pro zvukový stačí i 250 ms. Je-li okno širší než reakční doba (~300 ms), hráč může přestat předvídat a začne reagovat. Model dál navrhuje skrytou personalizaci šířky okna podle odhadnutých parametrů hráče a návrh vstupu, u kterého je fyzicky jasné, kdy vstup „nastal“.
- *Dotyk:* Model vysvětluje, proč je hraní na dotykové obrazovce v časových úlohách výrazně horší než s fyzickými tlačítky (cituje až 150% zhoršení ze studií Zamana a kol.). Kromě latence je u dotyku nejistý okamžik registrace a prst má proměnlivou výšku nad plochou.
- *Omezení:* Dotyk se měřil na touchpadu, ne na obrazovce telefonu. Vzorek tvořili studenti. Úlohy byly bez prostorového míření.
- *Přenositelnost:* vysoká pro poryv, kde jde o čisté časování s kruhem jako vizuálním odpočtem (Dt ≈ 600 ms od začátku pruhu ke středu), a střední pro holuba (doba držení).

### 3.3 Reakční doba vs. anticipační časování

- **V — Prostá reakční doba.** Shelton & Kumar 2010 [9] (N = 14, notebook, DirectRT) naměřili zrakovou RT ~331 ms a sluchovou ~284 ms. *Omezení:* malý vzorek, chybí statistika a věk. Absolutní hodnoty zahrnují latenci notebooku. Robustní je směr (sluch rychlejší), ne čísla.
- **V — Věk.** Der & Deary 2006 [10] (N = 7 130, UK Health and Lifestyle Survey): prostá RT se zhruba do 50 let zpomaluje jen málo, výběrová RT se zpomaluje v celé dospělosti. Významné rozdíly mezi pohlavími se týkají hlavně variability výběrové RT. *Přenositelnost:* Naše QTE jsou úlohou s jedinou odpovědí (blíž prosté RT), ale s anticipací, ne reakcí.
- **V — Koincidenčně-anticipační časování (Bassinův časovač).** Úloha se podobá té naší: světelná řada „běží“ k cíli a stisk má přijít v okamžiku příchodu.
  - Figueiredo & Barreiros 2013 [7] (12 dětí ~9,5 roku, 12 vysokoškoláků, rychlosti 0,36–3,21 m/s): dospělí jsou přesnější a konzistentnější při všech rychlostech. Chyba roste s rychlostí, nejrychlejší podmínka byla výrazně nejhorší. Autoři sami uvádějí, že starší studie našly opak (horší výkon při pomalých rychlostech). *Omezení:* malé vzorky, chyby uváděné v logaritmické transformaci, nesoulad stupňů volnosti v ANOVA.
  - Kim 2023 [8] (pilotní studie, 25 mužů, 1,34–4,02 m/s): absolutní chyba sportovců ~41–47 ms. Rychlost ovlivnila konstantní chybu (směr brzy/pozdě), absolutní chybu ne. *Omezení:* text si protiřečí ve směru zkreslení, jen muži, pilotní rozsah.
  - Meeuwsen a kol. 1997 (10 mladých a 10 starších žen): starší ženy měly větší absolutní i variabilní chybu. **Neověřeno**, znám jen ze souhrnu ve vyhledávání.
  - *Přenositelnost:* Typická absolutní chyba zdravého dospělého při CAT vychází v desítkách ms, tedy hluboko pod naším oknem ±280 ms a na hraně perfektního ±100 ms. Bassinův časovač ale nemá latenci obrazovky ani nejistotu dotyku. **N:** Pro dospělé je úspěch poryvu snadný, perfektní zásah realistický. U dětí a na pomalém zařízení se rozdíl projeví hlavně v perfektním okně.
- **V — Zvuk vs. obraz při synchronizaci.** Booth & Elliott 2015 [13] (Frontiers, přehled v úvodu + experiment, N = 10) shrnují předchozí práce. Diskrétní zvukové podněty dávají nejpřesnější synchronizaci, vizuální záblesky výrazně horší a spojitý pohyblivý vizuální podnět dosahuje úrovně zvuku. Jejich vlastní experiment ukázal, že předbíhající vizuální distraktory (−100 a −200 ms) posunuly synchronizaci dopředu o ~60 ms, zpožděné nikoli. *Přenositelnost:* Kruh u vlaštovky je spojitý pohyblivý podnět, správná volba. Pohyblivé dekorace a hejna ve scéně by mohly fungovat jako distraktory (N, jejich vliv neověřen).

### 3.4 Předvídatelnost vs. variabilita, odměřování intervalu

- **V — Skalární vlastnost časování.** Green, Ivry & Woodruff-Pak 1999 [11] (Psychological Science): „Variabilita časování je konstantním podílem odměřovaného intervalu, alespoň pro intervaly 200 ms až 1,5 s.“ Naše intervaly (0,6 s do středu pruhu, 1,4 s od začátku varování, 0,75 s držení holuba) leží přesně v tomto rozsahu. *Ověřovací kolo (plný text, 1999, 10(1), 19–23):* věta je v úvodu a autoři ji přebírají z Gettyho (1975) a Gibbona (1991). Nejde o jejich vlastní měření, vlastní data mají intervaly 325–550 ms. Jejich model navíc obsahuje složku rozptylu nezávislou na délce intervalu (`rozptyl = k²·interval² + c`), tedy motorický a smyslový šum. U krátkých intervalů proto variační koeficient nemusí být přesně konstantní.
- **V — Wearden 1991 [12] (ověřeno plným textem 13. 10. 2026; textová vrstva PDF je čitelná, *Learning and Motivation* 22, 59–83).** U lidské produkce intervalů *bez počítání* byl variační koeficient „v rozmezí 0,10–0,16“ a s délkou intervalu se systematicky neměnil. Pro náš rozsah je nejbližší soubor Wearden & McShane 1988: **4 dospělí, intervaly 0,5–1,3 s, CV 0,11–0,14**. Po každém pokusu dostávali zpětnou vazbu s přesností na setiny sekundy. Data Zeilera a kol. (3 osoby, sami experimentátoři) dala CV 0,14–0,16. **Počítání** („jedna a dva a…“) snižuje CV pod 0,10, většinou pod 0,05, ale bylo měřeno u intervalů 2–32 s. U 0,5–1 s podle Weardenova rozboru Treismanových dat lidé spontánně nepočítají. *Omezení:* velmi malé vzorky, laboratorní produkce bez rušivé scény. Hráč s vlaštovkou a dekoracemi bude spíš na horní hraně rozpětí nebo nad ní.
- **V — Předperioda.** Při náhodně proměnné předperiodě je RT u krátkých intervalů delší a u dlouhých kratší, protože s ubíhajícím časem roste podmíněná pravděpodobnost, že podnět přijde. Klasický přehled Niemi & Näätänen 1981 [15] znám jen ze sekundárních citací. Schmalbrock & Frings 2021 [14] (N = 40, předperiody 400–1 600 ms) naměřili rozdíl ~19 ms mezi krátkými a dlouhými předperiodami. *Přenositelnost:* Princip ano, velikost efektu je malá. Změna rozptylu středu okna o pár desítek ms nic nezmění. Učení lze rozbít až posuny ve stovkách ms.
- **N — Výpočet pro holuba (aproximace, ne měření; ověřovací kolo zpřesnilo CV).** Pokud by hráč odměřoval 750 ms „naslepo“ s variačním koeficientem 0,10–0,16 (SD 75–120 ms) a mířil na střed, pak:
  - úspěch (±250 ms) = ±2,1 až ±3,3 SD → ~96–99,9 %,
  - perfektní (±100 ms) = ±0,8 až ±1,3 SD → ~59–82 %.

  Pro užší pásmo naměřené u intervalů 0,5–1,3 s (CV 0,11–0,14 [12], SD 83–105 ms): úspěch ~98–99,8 %, perfektní ~66–78 %. K tomu přistupuje posun uvolnění ~10–20 ms [1] a latence zařízení [2][33]. Závěr se nemění: **úspěch holuba lze zvládnout bez sledování kruhu, perfektní zásah ne zcela.** Memorizace je tedy reálná, a to hlavně pro úspěch.
- **N — Výpočet pro memorování poryvu (doplněno v ověřovacím kole, normální aproximace, bez latence zařízení).**
  - Odměřování od začátku pruhu (0,6 s, CV 0,10–0,16, SD 60–96 ms): úspěch ±280 ms ≈ 99,6–100 %, perfektní ±100 ms ≈ 70–90 %.
  - Odměřování od začátku varování (1,4 s, SD 140–224 ms): úspěch ≈ 79–95 %, perfektní ≈ 35–53 %. Racionální hráč bude odměřovat od pruhu.
  - **Posun středu** při memorování od pruhu (SD 66–84 ms): o ±150 ms → perfektní ~22–27 %, úspěch ~94–98 %; o ±200 ms → perfektní ~7–12 %, úspěch ~83–89 %; o ±250 ms → perfektní ~1–4 %, úspěch ~64–68 %.
  - Pro R-N1 z toho plyne: posun ±150–250 ms je *malý vzhledem k délce pruhu* (12–21 %), ale *velký vzhledem k přesnosti odměřování* (2–4 SD). Memorování perfektního zásahu znemožní, memorování úspěchu jen oslabí. Chce-li hra, aby i úspěch vyžadoval čtení kruhu, musí se posuny blížit šířce okna úspěchu (±280 ms). Pak ale roste podíl nezdarů u hráčů, kteří kruh nečtou. Rozhodnout to musí test (N4).
- **N — Výpočet pro poryv.** Střed je 1,4 s od začátku varování a 0,6 s od začátku pruhu. Úspěšné okno se otevírá 0,32 s po začátku pruhu. Hráč, který čistě *reaguje* na objevení pruhu (zraková RT ~250–330 ms [9] + latence displeje a dotyku 35–140 ms [2]), stiskne kolem 0,29–0,47 s, tedy těsně před otevřením okna nebo v jeho začátku. Předčasný stisk spotřebuje pokus. Strategie „reaguj na pruh“ tak vede k neintuitivním selháním „brzy“, jinak řečeno k trestu za rychlou reakci. Vyplatí se to ověřit v telemetrii (`qte_resolved` s odchylkou, viz existující KB).
- **H — Memorizace v rytmických hrách.** U rytmických her je memorování map legitimní dovedností (hráči je výslovně trénují). U QTE uprostřed letu ale stálý střed vede k tomu, že hráč přestane číst scénu. Empirickou studii, která by srovnávala „čtení signálu“ a memorování ve hrách, jsem nenašel. Nalezené zdroje byly komunitní diskuse a studentské práce, proto je necituji.

### 3.5 Časová okna rytmických her — srovnání

Všechna okna v tabulce jsou **polovina šířky (±)**. Zdroje: osu! wiki [25], zdrojový kód StepManie [27], naše `events.js`.

| Hra / úroveň | Nejpřísnější | Střední | Nejmírnější „zásah“ | Poznámka |
|---|---|---|---|---|
| osu!standard OD 0 | 300: ±80 ms | 100: ±140 ms | 50: ±200 ms | Vzorce 80−6·OD / 140−8·OD / 200−10·OD |
| osu!standard OD 5 | ±50 | ±100 | ±150 | |
| osu!standard OD 8 | ±32 | ±76 | ±120 | |
| osu!taiko OD 5 | Great ±35 | Ok ±80 | Miss-hranice ±95 | |
| osu!mania OD 5 | MAX ±16 | 300 ±49 | 50 ±136 | |
| StepMania (výchozí) | W1 ±22,5 | W2 ±45 / W3 ±90 | W4 ±135 / W5 ±180 | Hold 250 ms, Roll 500 ms tolerance |
| Lee & Oulasvirta (lab) [1] | ±25 | ±58 | ±100 | Celkové šířky 50–200 ms |
| Flappy Bird (replika) [1] | ±11 | ±28–45 | ±132 | Celkové šířky 21–264 ms |
| **JTI poryv (bez přehybů)** | **perfektní ±100** | — | **úspěch ±280** | Střed vždy 1,4 s od varování |
| JTI poryv (přehyby, např. +30 %) | ±130 | — | ±364 | Faktor 1 + 0,1·úroveň (ověřeno v `config.js` a `events.js`) |
| **JTI holub (délka držení)** | **perfektní 650–850 ms (±100)** | — | **úspěch 500–1 000 ms (±250)** | Jde o měřené držení, ne o okamžik stisku |

Doplňkové údaje osu! [26]: předstih zobrazení objektu (preempt) je 1 200 ms při AR 5, 1 800 ms při AR 0 a 450 ms při AR 10. Zmenšující se „approach circle“ se s kruhem objektu překryje v okamžiku, kdy je správné kliknout. Náš pruh 1,2 s se středem v 0,6 s je tedy co do předstihu srovnatelný se středně rychlou mapou osu!. Střed okna ale nastává v půli animace, ne na jejím konci (N: ověřit, zda kruh vizuálně „dosedá“ právě na střed).

*Interpretace (N):* Úspěšné okno poryvu je asi 1,4× mírnější než nejmírnější zásah v osu! při OD 0. Perfektní okno je přibližně ve třídě „100/Great“ středně těžké rytmické hry. Pro kasuální arkádu je to rozumné. Hodnoty z rytmických her ale nejsou normou: tam hráč hraje stovky not za minutu, my máme nejvýš deset událostí za let.

*Rhythm Heaven:* Konkrétní milisekundová okna jsem z důvěryhodného zdroje neověřil (**neověřeno**).

### 3.6 Odpuštění vstupu (coyote time, buffering, kalibrace)

- **H — Celeste [29].** Maddy Thorson popisuje sadu skrytých tolerancí: coyote time (skok jde ještě krátce po opuštění hrany), vyrovnávací paměť skoku (stisk těsně před dopadem se provede na snímku dopadu), korekce rohů, poloviční gravitace na vrcholu skoku a zeď, od které jde odskočit už ze 2 px. Přesné délky v ms neuvádí (**neověřeno**; obecné průvodce udávají 50–150 ms, ale nejde o ověřený zdroj).
- **H — Kalibrace latence v rytmických hrách [28].** Harmonix (Rock Band 4) nabízí automatickou kalibraci (kytara se senzorem u reproduktoru a u obrazovky) i ruční (brnkání do rytmu, sledování ručičky). Výchozí hodnoty se liší podle typu televizoru a pro zvuk a obraz zvlášť (např. LCD 80/50, plazma 50/50, CRT 0/0; jednotky stránka neuvádí, kontext naznačuje ms).
- **N — Co to znamená pro nás:** Naše „ignoruj stisk během varování“ je forma odpuštění, protože anticipace nestojí pokus. Opačná hrana, kdy předčasný stisk v otevřené fázi pruhu pokus spotřebuje, je přísnější než buffering. Kandidát: stisk do ~100 ms před otevřením okna nevyhodnocovat jako „miss“, ale ignorovat nebo posunout, podobně jako buffer v Celeste.

### 3.7 Latence vstupu a displeje na webu a mobilu

- **V — Nicosia a kol. 2022 [2]** (Behavior Research Methods, robot LaTARbot, 26 telefonů, 18 Android / 8 iOS): průměrná dotyková latence ~15 ms, průměrná latence displeje ~60 ms (Android 64,5 vs. iOS 48,6 ms, p < 0,001), celková latence 35–140 ms (IQR 60–90 ms). Autoři doporučují zaznamenávat model zařízení a pro efekty menší než ~150 ms nepoužívat vlastní zařízení účastníků. *Omezení:* výslovně jen nativní aplikace, ne prohlížeč ani Unity či OpenGL. Bez zátěže CPU, výpadky snímků se nehodnotily.
- **V — Vnímání latence dotyku.** Deber a kol. 2015 [3] (CHI) uvádějí práh rozlišitelnosti (JND) na dotykové obrazovce 69 ms pro klepnutí a 11 ms pro tažení (touchpad 96 / 55 ms). *Ověřovací kolo: čísla potvrzena z plného textu.* Metoda: 14 praváků (24 sezení, 12 klepnutí a 12 tažení), vysokorychlostní dotykový senzor s projektorem a referenční latencí ~1 ms, adaptivní schodová metoda s nucenou volbou „co je rychlejší“. Ve druhém experimentu byla rozpoznatelná zlepšení latence už o ~8,3 ms, hlavně při tažení. U klepnutí při základní latenci ≤ 33 ms už zlepšení skoro nebylo poznat. *Pozor na přenos:* JND popisuje, kdy hráč *postřehne zpoždění odezvy* proti téměř nulové latenci. Neříká, jak přesně dokáže *časovat* stisk. Pro nás to znamená, že vizuální potvrzení zásahu má přijít do ~70 ms od klepnutí (blok 05), ne že by okno ±100 ms bylo nefér. Nishida a kol. 2023 [4] dále ukazují, že čekání na rozlišení jednoduchého a dvojitého klepnutí přidává 150–500 ms.
- **V — Latence webové aplikace na telefonu (doplněno v ověřovacím kole, mezera S26).** Pronk a kol. 2020 [33] (*Behavior Research Methods*) měřili webové aplikace externě: světelným čidlem a solenoidem, který ťukal do displeje. Ve Chrome, Firefoxu a Safari na iPhonu 6S, Samsungu Galaxy S7 a dvou noteboocích. Při časování přes `requestAnimationFrame` nadhodnocovala webová aplikace reakční dobu (tedy součet latence displeje, dotyku a prohlížeče) v průměru takto: Android Chrome 69,8 ms (SD 7,4; rozsah 46–104), Android Firefox 66,1 ms (SD 7,5), iOS 57,6–58,0 ms (SD 6,5–7,5). iOS kvantoval odezvy na snímky 60 Hz. *Přenositelnost:* čísla leží uvnitř nativního rozsahu Nicosia [2] (35–140 ms). Prohlížeč na těchto zařízeních tedy nepřidal řádový rozdíl. Rozptyl v rámci zařízení (~7 ms) je proti oknu ±100 ms malý, rozhoduje **stálý posun** podle zařízení. *Omezení:* jen dva telefony, v době měření 3–4 roky staré špičkové modely, bez zátěže CPU. Na levném Androidu a při náročném canvasu to může být horší. Autoři to výslovně uvádějí.
- **V — Tolerance podle typu hry.** Claypool & Claypool 2006 [5] (WPI technická zpráva, verze pro CACM) uvádějí orientační prahy: hry z pohledu první osoby ~100 ms, z pohledu třetí osoby ~500 ms, „všudypřítomné“ (RTS) ~1 000 ms. Citlivost roste s požadovanou přesností a těsností termínu akce. Long & Gutwin 2018 [6] (CHI PLAY, jen abstrakt) ukazují, že dříve publikované prahy se rozcházejí mezi 50 a 500 ms a že citlivost na lag závisí na rychlosti hry. Jejich model chybovosti podle lagu a rychlosti hry se potvrdil ve druhé studii.
- **H — Webová platforma (MDN [30]).**
  - `Event.timeStamp` je časová značka vysokého rozlišení vztažená k počátku stránky. Prohlížeče ji zaokrouhlují: Chrome na 0,1 ms, Safari a Firefox na 1 ms, Firefox s `resistFingerprinting` na 16,667 ms.
  - Callback `requestAnimationFrame` dostává čas konce předchozího snímku a běží s obnovovací frekvencí displeje (60/75/120/144 Hz). Na pozadí se pozastavuje.
  - `pointercancel` přijde, když prohlížeč převezme ukazatel k posunu, zoomu nebo scrollu.
  - `touch-action: manipulation` ruší čekání na dvojité klepnutí (zpoždění `click`), `none` vypíná všechna gesta prohlížeče.
- **N — Pozorování v našem kódu (k ověření, ne hotová chyba):**
  1. Vstup QTE se vyhodnocuje časem simulace `f.t` v okamžiku obsluhy události. Simulace ale postupuje po krocích 1/60 s jen uvnitř `requestAnimationFrame`. Časování je tedy kvantováno na snímek (~17 ms při 60 Hz) a nese posun daný tím, kdy v rámci snímku událost přijde. Proti oknu ±280 ms je to zanedbatelné, proti perfektnímu ±100 ms okrajové. Přesnější varianta: přepočítat `e.timeStamp` vůči času posledního snímku.
  2. Plátno má `touch-action: none` jen ve fázi míření (`canvas.aiming`). Během letu ho nemá, přestože se do scény smí klepat. Na dotyku tak hrozí, že prohlížeč při malém pohybu prstu během držení holuba vyhodnotí gesto jako posun a pošle `pointercancel`. Hra pak držení zruší. Ověřit na reálném telefonu.
  3. Nabíjení síly sčítá `heldTime` po snímcích. Při výpadku snímku (limit 0,1 s) tak hra běží pomaleji než skutečný čas. U plochého vrcholu cosinu to má malý dopad.

### 3.8 Ukazatel síly, nabíjení a hold-and-release

- **H — Golfový „3-click swing“.** První klik spustí ukazatel, druhý určí sílu, třetí přesnost (sweet spot). Podle Wikipedie byl Golf (NES, 1984) první golfovou hrou s ukazatelem síly a přesnosti a ten „se od té doby používá ve většině golfových her“ [31]. Článek Wireframe (podle vyhledávání, stránku jsem neotevřel, **neověřeno**) uvádí dřívější podobné systémy v PGA Golf (Intellivision, 1980) a 3D Golf Simulation (MSX, 1983) a jako přednost zmiňuje komprimaci složitého pohybu do jednoduchého vstupu. Novější PGA Tour 2K23 nahradila první klik podržením a uvolněním v požadovaném rozsahu síly (rovněž jen ze souhrnu recenze, **neověřeno**). Recenzované srovnání ovládání švihu jsem nenašel.
- **Slingshot (Angry Birds):** Žádnou empirickou studii ovládání prakem jsem neověřil (**neověřeno**). Dostupné byly jen designérské komentáře a patenty. Z HCI lze říct jen obecně, že jde o přímou manipulaci s mapováním polohy, kdy síla je vzdálenost tahu a nikoli čas. To je jiný princip než náš časovaný ukazatel.
- **V — Uvolnění jako vstup.** Podle [1] přichází uvolnění klávesy o 10–20 ms později než stisk a u dotyku je méně přesně definované. Zajímavé je, že hudebníci měli při uvolnění dotyku *menší* šum než při stisku. Nejde tedy o jednoznačně horší vstup. U StepManie má držení (hold) vlastní toleranci 250 ms [27], protože zvednout a vrátit nohu chvíli trvá.
- **N — Náš ukazatel síly:** `chargeAt(t) = (1 − cos(π·t/1,15))/2`, multiplikátor rychlosti 0,7 + 0,4·síla.
  - Okno pro „Perfektní sílu“ (≥ 93 %) je **±198 ms** kolem 1,15 s (a dalších vrcholů po 2,3 s) a výsledek je nejméně 1,072 z maximálních 1,10.
  - „Silný hod“ (≥ 70 %) platí v okně ±424 ms.
  - Cosinový profil tedy sám funguje jako odpuštění u vrcholu. Je výrazně mírnější než lineární golfový ukazatel, kde se chyba v čase promítá do síly rovnoměrně.
  - Přehyby k tomu přidávají „odpuštění síly“: efektivní síla = síla + (1 − síla) · 0,15 · úroveň (`core.js`, `UPGRADE.steady`). Ztráta z nepřesného uvolnění se tak s každou úrovní dál zmenšuje. Výpočty výše platí pro úroveň 0.
  - Důsledek: Rozdíl mezi dobrým a skvělým hodem je ~2,5 % rychlosti (u balistiky bez odporu ~5 % doletu, s odporem méně; neověřeno simulací). Prostor pro mistrovství v hodu je malý, prostor pro začátečníka velký. Jestli je to žádoucí, je otázka designu, ne výzkumu.

### 3.9 Únava a opakování

- **H** — XAG 107 [19]: dlouhé držení způsobuje únavu, proto nabídnout přepínač nebo auto-držení. Rychlé opakované stisky (QTE, mačkání) nevyžadovat nebo nabídnout méně náročnou alternativu či přeskočení.
- **H** — Apple HIG [17]: pro časté interakce používat co nejjednodušší gesto a omezovat opakovaná a velká gesta.
- **V (nepřímo)** — Model [1] počítá s variabilitou, která roste s nepozorností a únavou, ale únavu přímo neměřil. Studii únavy z opakovaných QTE ve hrách jsem nenašel.
- **N** — U nás jde o nejvýš 10 událostí s mezerami 4–7 s a držení holuba do 1 s. Fyzickou únavu nepředpokládáme. Mentální únava z monotónnosti (stále stejný rytmus) je pravděpodobnější a souvisí s problémem stálého středu.

### 3.10 Ovládání jedním palcem a dotykové cíle

- **V — Parhi, Karlson & Bederson 2006 [16]** (MobileHCI, ovládání jedním palcem): Rychlost rostla s velikostí cíle. Mezi cíli **≥ 9,6 mm** (diskrétní úlohy) a **≥ 7,7 mm** (sériové) se chybovost významně nelišila. Autoři doporučují 9,2 mm pro diskrétní a 9,6 mm pro sériové úlohy. *Ověřovací kolo (plný text, rozpor R6):* obě věty jsou doslova v abstraktu a nejsou ve sporu. První popisuje jen chybovost, doporučení navíc zohledňuje rozptyl dopadů (2 SD) a subjektivní hodnocení. Testované velikosti byly diskrétně 3,8 / 5,8 / 7,7 / 9,6 / 11,5 mm a sériově 5,8–13,4 mm. 9,2 mm je tedy odvozená hodnota, ne testovaná podmínka. Vzorek tvořilo **20 praváků** (17 mužů, 19–42 let), kteří stáli a ovládali přístroj jedním palcem. Výběr se potvrzoval zvednutím prstu (lift-off). Nejpohodlnější byl střed displeje, nejhorší rohy vlevo a vpravo dole (subjektivně potřebné cíle ~7,5–7,7 mm proti ~6 mm uprostřed). *Omezení:* PDA z roku 2006, malý vzorek, převážně muži.
- **H — Platformy:**
  - Apple HIG [17]: výchozí velikost ovládacího prvku na iOS 44×44 pt, minimum 28×28 pt. Kolem prvků s rámečkem ~12 pt odstupu, bez rámečku ~24 pt. Omezovat prvky, které mizí po časovém limitu. Ve hrách zvážit úpravy obtížnosti včetně „upravení reakční doby“.
  - Google [18]: alespoň 48×48 dp, což odpovídá ~9 mm fyzicky. Doporučený rozsah 7–10 mm, odstup ≥ 8 dp.
  - XAG 107 [19]: minimum na telefonu 15×15 mm, na tabletu 24×24 mm. XAG také doporučuje aktivaci ovládacích prvků při uvolnění (touch-end), ne při stisku. To platí pro tlačítka rozhraní, ne pro časované herní vstupy.
- **N — Náš stav:** Celá scéna je zásahová plocha pro QTE, což je z hlediska Fittsova zákona ideální (cíl „nekonečně“ velký). Tlačítko `#action` má minimum 48 CSS px na výšku a 150–175 px na šířku, tedy splňuje Google a Apple, ale ne přísnější XAG 15 mm. Okno QTE nezávisí na míření, takže velikost cíle u nás časování nezhoršuje. Lee & Oulasvirta [1] upozorňují, že kombinace prostorového míření a časování přidává další zdroj chyb, a tomu se vyhýbáme.

### 3.11 Přístupnost časovaných vstupů

- **H — Game Accessibility Guidelines:**
  - „Avoid repeated inputs (button-mashing/quick time events)“ [21], úroveň Intermediate, kategorie Motor: QTE jsou obtížné zejména kvůli těsným oknům. Pokud se jim nelze vyhnout, má hra nabídnout nastavení, které je zjednoduší nebo přeskočí či vypne. Příklady: Castlevania: Lords of Shadow 2 (vypínač QTE), The Witcher 2 (obtížnost QTE), Uncharted 4.
  - „Do not make precise timing essential to gameplay“ [22], úroveň Advanced, Motor: přesné časování má být volitelné, akce proveditelné v pauze nebo přeskočitelné. Příklady: Final Fantasy XV (wait mode), Fallout 3 (VATS).
  - Na přehledové stránce úrovně Intermediate je navíc „Include an option to adjust the game speed“.
- **H — Xbox Accessibility Guidelines:**
  - XAG 116 (časové limity) [20]: časové limity používat jen tam, kde jsou nezbytné. Hráč by měl mít možnost limit předem prodloužit alespoň na 10× výchozí hodnotu, nebo ho vypnout. Výjimkou jsou limity nezbytné pro samotný úkol (např. odpočet jádra hratelnosti). Specifická pravidla pro QTE stránka neobsahuje.
  - XAG 107 [19]: umožnit zpomalení hry, nabídnout přepínač místo držení, vyhnout se současným stiskům a umožnit libovolné přemapování.
- **Praxe (H, neověřeno přímým otevřením):** Directive 8020 podle souhrnu vyhledávání nabízí QTE vždy na stejné tlačítko, držení místo mačkání a režim bez časového limitu QTE.
- **N — Naše výchozí pozice je dobrá:** QTE nejsou povinné (nečinnost bez trestu, jen bez bonusu), časování není nezbytné pro postup, stačí jeden vstup a lze klepnout kamkoli. Chybí nastavení „širší okna / pomalejší let“, „holub bez držení“ (klepnutí místo držení) a „automatické QTE“. Podle GAG je to Intermediate až Advanced, ne Basic.

---

## 4. Rozpory a otevřené otázky

1. **Rychlost podnětu a chyba CAT.** Figueiredo & Barreiros [7] našli horší výkon při vysoké rychlosti, starší studie (podle nich samých) při nízké. Kim [8] neviděl vliv rychlosti na absolutní chybu. Pro nás to znamená, že nelze spolehlivě říct, zda by „rychlejší kruh“ byl těžší.
2. **Stisk vs. uvolnění na dotyku.** Lee & Oulasvirta [1] ukazují, že uvolnění je v průměru pozdější, ale u hudebníků méně šumné. XAG doporučuje aktivaci na uvolnění u tlačítek rozhraní. Pro časovaný herní vstup zůstává otevřené, která hrana je přesnější na telefonu. Měřeno bylo na touchpadu.
3. **Původ golfového ukazatele.** Wikipedie připisuje prvenství Golfu (NES, 1984), souhrn Wireframe uvádí dřívější tituly z let 1980 a 1983. Pro nás to nemá praktický význam.
4. **Latence na webu.** Data [2] jsou pro nativní aplikace. *Ověřovací kolo:* Pronk a kol. [33] naměřili u webové aplikace na dvou starších špičkových telefonech průměrnou latenci 58–70 ms s rozptylem ~7 ms. To je uvnitř nativního rozsahu. Otevřené zůstává, kolik přidá náš canvas (render a přepis DOM v každém snímku) na *levném* Androidu. Protože jde hlavně o stálý posun, je pro férovost perfektního okna užitečnější kalibrace nebo telemetrie odchylky podle zařízení (N12) než plošné rozšíření okna.
5. **Široké okno vs. reaktivní strategie.** Lee & Oulasvirta [1] uvádějí, že okno širší než ~300 ms umožňuje reagovat místo anticipovat. Naše okno má 560 ms, ale otevírá se až 320 ms po začátku pruhu, takže rychlá reakce na začátek pruhu může vést k předčasnému stisku. Dá se to rozhodnout jen telemetrií.
6. **Memorizace: problém, nebo dovednost?** V rytmických hrách je učení map přijímané. U nás jde o 2 typy událostí se stálou strukturou. Otázka: vadí hráčům stereotypie (nuda), nebo jim stálost dává pocit zvládnutí? Výzkum, který by to rozhodl pro arkády, jsem nenašel.
7. **Empirie QTE.** Kvantitativní studie prožitku z QTE chybí, nebo jsem ji v rámci limitu nenašel. Kritika je převážně esejistická [24].

---

## 5. Relevance pro Just Throw It — kandidátní implikace (N)

*Nejde o doporučení k implementaci, ale o hypotézy k ověření (playtest, telemetrie, simulace). Číslování navazuje na backlog jen volně.*

**Ukazatel síly**
- **N1.** Cosinový profil dává okno „Perfektní síla“ ±198 ms a ztrátu nejvýš ~2,5 % rychlosti. Pokud má hod nést dovednost, testovat ostřejší vrchol (např. menší zónu „perfektní“ nebo nelineární bonus nad 93 %). Pokud ne, ponechat a nekomunikovat hod jako výkonovou výzvu. Rozhodnutí patří do bloku 4 (obtížnost).
- **N2.** První vrchol za 1,15 s je delší než doporučené Dt ≥ 700 ms pro vizuální odpočet [1], takže je vhodně „čitelný“. Opakované vrcholy po 2,3 s jsou pro začátečníka záchranou, ne chybou.
- **N3.** Výsledkový text by mohl uvádět odchylku od vrcholu v čase („pustil jsi 0,3 s po vrcholu“), což navazuje na B01 a B02 v existující KB.

**Poryv**
- **N4.** Zrušit stálý střed: náhodně posouvat střed okna v pruhu (např. ±150–250 ms) a kruh dál nechat ukazovat cíl. Hráč pak musí číst signál. Posuny musí být ve stovkách ms, efekty předperiody v desítkách ms [14] nestačí. *Upřesněno v ověřovacím kole (výpočet 3.4, CV podle [12]):* posun ±150–250 ms zabrání memorovat *perfektní* zásah (zbude ~1–27 %). *Úspěch* memorováním zůstane z velké části dosažitelný (~64–98 %). Se 04 N10 to není v rozporu: posun je malý vůči pruhu a velký vůči přesnosti odměřování. Zavádět ho postupně, například od druhého letu nebo od určitého počtu zvládnutých QTE.
- **N5.** Zvážit, aby úspěšné okno nezačínalo 320 ms po začátku pruhu (tedy v pásmu reakční doby + latence). Buď zkrátit náběh, nebo předčasný stisk těsně před oknem ignorovat (buffer), místo aby spotřeboval pokus.
- **N6.** Zvukový „tik“ v okamžiku středu (nebo krátký rytmický odpočet), protože zvuková synchronizace je přesnější [13][9]. Musí respektovat ztišení a jít vypnout.
- **N7.** Ověřit, že kruh vizuálně „dosedá“ právě na střed okna, podle vzoru approach circle v osu! [26].

**Kyberholub (držení)**
- **N8.** Délka držení 750 ± 250 ms se dá zvládnout odměřením bez sledování kruhu (výpočet v 3.4). Kandidát: proměnlivý cíl délky držení (např. 0,6–0,95 s) ukazovaný kruhem.
- **N9.** Kompenzovat systematické zpoždění uvolnění (~10–20 ms [1]): posunout střed perfektního okna holuba o ~15 ms. Malé, levné, ověřitelné telemetrií (průměrná odchylka by měla být kolem 0).
- **N10.** Doplnit `touch-action: none` na plátno i během letu. Ověřit na telefonu, zda pohyb prstu při držení nevyvolává `pointercancel` (3.7).

**Ovládání a technika**
- **N11.** Vyhodnocovat čas vstupu z `event.timeStamp` přepočteného na herní čas, ne z `f.t` v okamžiku obsluhy. Odstraní se tím kvantizace na snímek.
- **N12.** Volitelná kalibrace offsetu (jednoduchý test „klepni do rytmu“, vzor Harmonix [28]), nebo aspoň telemetrie průměrné odchylky podle typu zařízení. Rozdíly 35–140 ms mezi telefony [2] jsou srovnatelné s perfektním oknem. Ve webu je rozptyl v rámci zařízení malý (SD ~7 ms [33]) a hlavní je stálý posun, kalibrace tedy dává smysl. Pozor: zpoždění, které se přičte stejně k obrazu i ke vstupu, se při časování podle kruhu zčásti vyruší. Kalibrace má kompenzovat jen čistou vstupní a výstupní latenci, ne „posun hráče“.
- **N13.** `#action` zvětšit na ≥ 15 mm výšky na telefonu (XAG [19]). Zásah kamkoli do scény je už teď nejlepší možná volba. *Pozn. z ověřovacího kola (R-N8):* empirická opora [16] (plný text) ukazuje, že u palce stačí ~9,2–9,6 mm. 48 CSS px je na běžném telefonu zhruba 7,5–9 mm podle hustoty. XAG 15 mm je přísnější platformní norma, ne empirické minimum. N13 je tedy volba normy, ne oprava chyby. Prioritu má umístění tlačítka mimo rohy (rohy byly v [16] nejhorší).

**Přístupnost**
- **N14.** Volba „Pohodlné časování“: okna ×1,5–2 nebo zpomalení letu během QTE (GAG game speed [21], XAG [19][20]).
- **N15.** Volba „Holub klepnutím“ (bez držení) a volba „Automatické QTE“ (úspěch bez perfektního bonusu, aby nevznikla dominantní strategie). GAG to výslovně podporuje [21][22].
- **N16.** Telemetrie a playtest rozdělit podle věkových skupin, pokud hraje i mládež: u dětí čekat větší rozptyl [7].

---

## 6. Registr zdrojů

Hodnocení kvality: **A** recenzovaná primární studie nebo velký vzorek · **B** recenzované, ale malé nebo jen abstrakt · **C** dokumentace platformy nebo primární specifikace hry · **D** esej, blog nebo sekundární zdroj · **⚠** neověřeno přímým otevřením.

1. **Lee, B., & Oulasvirta, A. (2016).** Modelling Error Rates in Temporal Pointing. *CHI ’16*, 1857–1868. DOI 10.1145/2858036.2858143. Studie, N = 20 + 10. PDF: https://displaydaily.com/wp-content/uploads/2016/06/modeling-errors-chi2016.pdf. **A.** Přenositelnost vysoká pro poryv. Omezení: touchpad, laboratoř.
2. **Nicosia, J., Wang, B., Aschenbrenner, A. J., … Hassenstab, J. (2022/2023).** To BYOD or not: Are device latencies important for bring-your-own-device (BYOD) smartphone cognitive testing? *Behavior Research Methods*, 55(6), 2800–2812. https://pmc.ncbi.nlm.nih.gov/articles/PMC9918597. Měření 26 telefonů. **A.** Omezení: nativní aplikace, ne web.
3. **Deber, J., Jota, R., Forlines, C., & Wigdor, D. (2015).** How Much Faster is Fast Enough? User Perception of Latency & Latency Improvements in Direct and Indirect Touch. *CHI ’15*. DOI 10.1145/2702123.2702300. PDF: https://www.tactuallabs.com/papers/howMuchFasterIsFastEnoughCHI15.pdf. Dva experimenty, N = 14 (24 sezení). **B.** Plný text ověřen 13. 10. 2026, čísla JND 69 / 11 / 96 / 55 ms potvrzena (dříve B⚠, převzato ze [4]).
4. **Nishida, N., Ikematsu, K., Sato, J., Yamanaka, S., & Tsubouchi, K. (2023).** Single-tap Latency Reduction with Single- or Double-tap Prediction. *Proc. ACM HCI 7 (MHCI)*, 224. https://arxiv.org/abs/2408.02525. **A** (pro vlastní tvrzení), **D** pro citaci [3].
5. **Claypool, M., & Claypool, K. (2006).** On Latency and Player Actions in Online Games (WPI-CS-TR-06-13; verze v CACM 49(11)). https://ftp.cs.wpi.edu/pub/techreports/pdf/06-13.pdf. Syntéza vlastních experimentů. **B.** Omezení: síťové hry, hrubé prahy.
6. **Long, M., & Gutwin, C. (2018).** Characterizing and Modeling the Effects of Local Latency on Game Performance and Experience. *CHI PLAY ’18*, 285–297. DOI 10.1145/3242671.3242678. **B** (ověřen jen abstrakt přes Semantic Scholar).
7. **Figueiredo, L., & Barreiros, J. (2013).** Effects of Age and Stimulus Velocity in the Performance of a Complex Coincidence-anticipation Task by Children and Adults. SciTePress (icSPORTS 2013). https://scitepress.org/Papers/2013/46655/pdf/index.html. N = 24. **B.** Omezení: malý vzorek, nejasná statistika.
8. **Kim, H. (2023).** Coincidence anticipation timing requirements across different stimulus speeds in various sports: A pilot study. *The Sport Journal*. https://thesportjournal.org/article/coincidence-anticipation-timing-requirements-across-different-stimulus-speeds-in-various-sports-a-pilot-study/. N = 25. **B−** (pilotní studie, vnitřní rozpory).
9. **Shelton, J., & Kumar, G. P. (2010).** Comparison between auditory and visual simple reaction times. *Neuroscience & Medicine*, 1(1), 30–32. https://coachsci.sdsu.edu/csa/vol191/shelton.htm. N = 14. **B−.**
10. **Der, G., & Deary, I. J. (2006).** Age and sex differences in reaction time in adulthood: Results from the United Kingdom Health and Lifestyle Survey. *Psychology and Aging*, 21(1), 62–73. DOI 10.1037/0882-7974.21.1.62. https://www.research.ed.ac.uk/en/publications/age-and-sex-differences-in-reaction-time-in-adulthood-results-fro/. N = 7 130. **A** (ověřen abstrakt).
11. **Green, J. T., Ivry, R. B., & Woodruff-Pak, D. S. (1999).** Timing in eyeblink classical conditioning and timed-interval tapping. *Psychological Science*, 10(1), 19–23. DOI 10.1111/1467-9280.00100. PDF: https://ivrylab.berkeley.edu/files/organized_pubs_pdfs/1995_papka_m_ivry_r_and_woodru.pdf (název souboru je zavádějící, obsah je tento článek). N = 23 + 80. **A.** Pro nás použito jen tvrzení o skalární vlastnosti 200 ms – 1,5 s, které je v článku citací Gettyho a Gibbona, ne vlastním měřením. Rok 1999 a ročník ověřeny v PDF (záhlaví „Vol. 10, No. 1, January 1999“) a v Crossref 13. 10. 2026.
12. **Wearden, J. H. (1991).** Do humans possess an internal clock with scalar timing properties? *Learning and Motivation*, 22, 59–83. https://www.keele.ac.uk/media/keeleuniversity/facnatsci/schpsych/weardenpublications/wearden1991.pdf. **B.** Plný text ověřen 13. 10. 2026 (textová vrstva PDF čitelná přes `pdftotext`). CV 0,10–0,16 potvrzeno (abstrakt i text). Pro intervaly 0,5–1,3 s CV 0,11–0,14 (n = 4, se zpětnou vazbou). Malé vzorky, proto B.
13. **Booth, A. J., & Elliott, M. T. (2015).** Early, but not late visual distractors affect movement synchronization to a temporal-spatial visual cue. *Frontiers in Psychology*, 6:866. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00866/full. N = 10 + přehled literatury. **B.**
14. **Schmalbrock, P., & Frings, C. (2021/2022).** Temporal expectancy modulates stimulus–response integration. *Attention, Perception, & Psychophysics*, 84(1), 221–230. https://pmc.ncbi.nlm.nih.gov/articles/PMC8794897. N = 40. **A** (pro efekt předperiody jen okrajově).
15. **Niemi, P., & Näätänen, R. (1981).** Foreperiod and simple reaction time. *Psychological Bulletin*. **D⚠.** Znám jen ze sekundárních citací.
16. **Parhi, P., Karlson, A. K., & Bederson, B. B. (2006).** Target size study for one-handed thumb use on small touchscreen devices. *MobileHCI ’06* (začátek na s. 203 podle názvu PDF, rozsah neověřen). DOI 10.1145/1152215.1152260. PDF: https://www.cs.umd.edu/~bederson/images/pubs_pdfs/p203-parhi.pdf. N = 20. **B** (plný text ověřen 13. 10. 2026, malý vzorek; blok 07 [Z25] sjednocen na stejné hodnocení).
17. **Apple (n.d., přístup 2026).** Human Interface Guidelines: Accessibility. https://developer.apple.com/design/human-interface-guidelines/accessibility. **C.**
18. **Google (n.d.).** Android Accessibility Help: Touch target size. https://support.google.com/accessibility/android/answer/7101858. **C.**
19. **Microsoft (n.d.).** XAG 107: Input. https://devdocs.xbox.com/build/game-principles/accessibility/xag-deep-dives/xag-107-input.md. **C.**
20. **Microsoft (n.d.).** XAG 116: Time limits. https://devdocs.xbox.com/build/game-principles/accessibility/xag-deep-dives/xag-116-time-limits. **C.**
21. **Game Accessibility Guidelines (n.d.).** Avoid repeated inputs (button-mashing/quick time events). https://gameaccessibilityguidelines.com/avoid-repeated-inputs-button-mashing-quick-time-events/. Přehled úrovně Intermediate: https://gameaccessibilityguidelines.com/intermediate/. **C.**
22. **Game Accessibility Guidelines (n.d.).** Do not make precise timing essential to gameplay. https://gameaccessibilityguidelines.com/do-not-make-precise-timing-essential-to-gameplay-offer-alternatives-actions-that-can-be-carried-out-while-paused-or-a-skip-mechanism/. **C.**
23. **Mc Donald, L. (2026).** How Accessible QTE Inputs Reshape Suspense Trajectories in Survival Horror Games. *Abstract Proceedings of DiGRA 2026*. https://dl.digra.org/index.php/dl/article/view/3009. Rozšířený abstrakt, teoretický. **D** (bez dat).
24. **Leach, A. (2010).** Seeing Circles. *Game Developer* (Gamasutra). https://www.gamedeveloper.com/design/seeing-circles. Esej. **D.**
25. **osu! wiki.** Overall difficulty. https://osu.ppy.sh/wiki/en/Beatmap/Overall_difficulty. **C** (primární specifikace hry).
26. **osu! wiki.** Approach rate; Hit circle. https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate, https://osu.ppy.sh/wiki/en/Gameplay/Hit_object/Hit_circle. **C.**
27. **StepMania (zdrojový kód, větev 5_1-new).** `src/Player.cpp`, TimingWindowSecondsInit. https://raw.githubusercontent.com/stepmania/stepmania/5_1-new/src/Player.cpp. **C.**
28. **Thresher, A. / Harmonix (2015).** How to Calibrate. https://www.harmonixmusic.com/blog/how-to-calibrate. **C/D.**
29. **Thorson, M. (n.d., vlákno 2020).** Celeste & Forgiveness. https://maddymakesgames.com/articles/celeste_and_forgiveness/. **D** (praxe autorky).
30. **MDN Web Docs.** Event.timeStamp; Window.requestAnimationFrame; Element: pointercancel event; CSS touch-action. https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp, …/Window/requestAnimationFrame, …/Element/pointercancel_event, https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action. **C.**
31. **Wikipedia.** Golf (1984 video game). https://en.wikipedia.org/wiki/Golf_(1984_video_game). **D.** Související článek Wireframe „Killer feature: golf’s innovative control method“ (přesměrován na whynowgaming.com, 403) **⚠ neověřeno**.
32. **Peng, P., & Lane, S. H. (n.d.).** Designing Rhythm Game Interfaces for Touchscreen Devices (studentský poster, UPenn). https://beatsportable.com/static/misc/cis400/siggraph/poster.pdf. **D.** Srovnává osm rozvržení not včetně zmenšujících se zásahových zón. Bez čísel v dostupném textu, proto se o něj v textu neopírám.
33. **Pronk, T., Wiers, R. W., Molenkamp, B., & Murre, J. (2020).** Mental chronometry in the pocket? Timing accuracy of web applications on touchscreen and keyboard devices. *Behavior Research Methods*, 52, 1371–1382. DOI 10.3758/s13428-019-01321-2 (online 10. 12. 2019, open access). Externí měření 4 zařízení × 2–3 prohlížeče. **A** (pro tvrzení o měřených zařízeních; jen 2 telefony). Plný text ověřen 13. 10. 2026.

Pozn. k [33]: přidáno v ověřovacím kole. Pozor, že „nadhodnocení RT“ zahrnuje latenci displeje i vstupu (od skutečného objevení podnětu po časovou značku události).

**Neověřeno / nenalezeno v rámci této rešerše** (vyhledávací limit session byl vyčerpán uprostřed práce): empirické studie prožitku z QTE; okna Rhythm Heaven v ms; přesné hodnoty coyote time v Celeste; studie ovládání prakem (Angry Birds); Meeuwsen a kol. 1997 (CAT a věk); ~~latence prohlížeče nad nativní vrstvou na mobilech~~ (částečně doplněno [33], levné telefony a zátěž canvasem stále neměřeny); primární text Repp & Su 2013 (přehled synchronizace); Niemi & Näätänen 1981.

---

## Ověřovací kolo 13. 10. 2026

Ověřeno proti primárním textům (fronta README §4: V6, S24, S25, S26; nízká: Green 1999):
- **Wearden 1991 [12] (V6, vysoká):** plný text je čitelný (dřívější „sken nešel přečíst“ neplatí). CV 0,10–0,16 u produkce intervalu bez počítání potvrzen. Pro 0,5–1,3 s je to 0,11–0,14 (n = 4). Počítání snižuje CV, ale bylo měřeno u 2–32 s. Výpočet pro holuba platí, doplněno užší pásmo (perfektní naslepo ~66–78 %). Kvalita B⚠ → B.
- **Green, Ivry & Woodruff-Pak [11]:** rok 1999, *Psychological Science* 10(1), 19–23 ověřen. Upozornění: věta o skalární vlastnosti je citací Gettyho a Gibbona a model obsahuje konstantní složku rozptylu.
- **Deber 2015 [3] (S24, R22):** plný text. JND 69 / 11 / 96 / 55 ms potvrzeny, N = 14. Doplněno, že jde o vnímání zpoždění odezvy, ne o přesnost časování. B⚠ → B.
- **Parhi 2006 [16] (S25, R6):** plný text. Rozpor R6 vyřešen: věta o chybovosti (≥ 9,6 / ≥ 7,7 mm) i doporučení 9,2 / 9,6 mm jsou obě z abstraktu, doporučení zohledňuje i rozptyl dopadů a subjektivní hodnocení. N = 20. Doplněna poznámka k R-N8 v N13.
- **Latence webu (S26):** nový zdroj Pronk 2020 [33] (plný text, open access). Web na iPhonu 6S a Galaxy S7 měl latenci 58–70 ms se SD ~7 ms, uvnitř nativního rozsahu. **Změna závěru:** problém férovosti perfektního okna je hlavně stálý posun podle zařízení, ne náhodný rozptyl. Posíleno N12 (kalibrace a telemetrie), §1 bod 3 a §4 bod 4 upraveny. Levné Androidy a zátěž canvasem zůstávají neměřené.
- **Kód:** faktor oken 1 + 0,1·úroveň ověřen v `config.js` a `events.js`. Odstraněno „předpoklad podle popisu“ (R9).

Rozpor **R-N1** (04 N10 proti 06 N4): doplněn výpočet v 3.4. Posun středu ±150–250 ms je 2–4 SD přesnosti odměřování. Memorování perfektního zásahu zabrání (zbude ~1–27 %), úspěch nechá většinou dosažitelný (~64–98 %). Implikace 04 N10 a 06 N4 jsou slučitelné, 04 N10 byla v bloku 04 upravena.

**Doplněk — účinek úspěšného holuba (R12, ověřeno v kódu 13. 10. 2026):** `events.js` při úspěchu nebo perfektním zásahu nastaví nesení `carry = 0,8 / 1,1 s × qte`, `vx = max(10, vx)` a `vy = max(.4, vy)`. Rychlost tedy nikdy nesníží. Během nesení `core.js` posouvá vlaštovku konstantní rychlostí bez gravitace a bez odporu. Vítr je ve hře i simulaci nulový, takže vypnutý vertikální vítr při nesení nic nemění. Párová simulace (oba modely, úrovně 0–5, úhly 5–40°, síla 0–1, 40 seedů, zasažen první nebo každý holub; 76 800 párů): **žádný let s úspěšným holubem nebyl kratší** než stejný let bez vstupu, 66 000 bylo delších, zbytek stejných (holub před dopadem nepřišel). Jediná teoretická výjimka: u šipky s `vx` mezi 10 a 11 m/s (pod cestovní rychlostí 11) nesení na chvíli zastaví zrychlování k cestovní rychlosti. Vliv na dolet je zanedbatelný a v simulaci se neprojevil. Záporné hodnoty v `simulation/QTE-BALANCE.md` (P10 až −25 %) jsou z pravidel 0.4.0, kdy se `vy` nastavovalo napevno na +0,4 m/s, a pro aktuální kód neplatí. Dokument by bylo vhodné přeměřit.

Neověřeno: Niemi & Näätänen 1981, Meeuwsen 1997, Repp & Su 2013, Rhythm Heaven, coyote time v Celeste, Wireframe a PGA Tour 2K23, studie ovládání prakem, latence levných Androidů ve webu.
