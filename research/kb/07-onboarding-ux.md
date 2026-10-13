# Blok 7 — Onboarding, UX a přístupnost

**Blok:** 7 / 9 (viz `research/00-temata.md`) · **Datum rešerše:** 13. 10. 2026 · **Stav:** první verze rešerše, prošla ověřovacím kolem 13. 10. 2026 (změny viz poslední oddíl). Nejde o doporučení ani o výsledky hráčského testu.

**Štítky:** **V** výzkumný poznatek · **H** heuristika / praxe oboru / guideline platformy · **N** naše hypotéza pro Just Throw It.
**Odkazy na zdroje:** [Z1]–[Z31], registr v oddílu 6. Navazuje na `KB zabavnost a motivace.md` (principy K1–K7, backlog B01–B14). Témata zpětné vazby (S3 Burgers et al.) a rychlého „Znovu“ (B14) tam už jsou, zde je jen doplňujeme z pohledu UX.

**Rozsah ověření (opraveno v ověřovacím kole 13. 10. 2026, rozpor R20):** Plné texty jsem otevřel u [Z1], [Z2], [Z3], [Z5], [Z8], [Z9], [Z11], [Z12], [Z13], [Z14] (poster i verze GEM 2015), [Z25], [Z27] a u guidelines [Z15]–[Z24], [Z29], [Z30]. Původní úvod řadil [Z25] mezi guidelines s plným textem, ve skutečnosti byl tehdy ověřen jen abstrakt. Plný text byl otevřen až v ověřovacím kole. U [Z6], [Z10], [Z26] a [Z28 – Birch] jsem viděl jen abstrakt, metadata nebo sekundární citaci. Během rešerše došel rozpočet webového vyhledávání, takže některá podtémata zůstala neprohledaná (viz oddíl 4).

---

## 1. Klíčová zjištění v kostce

1. **V — Tutoriál není automaticky přínosem. Rozhoduje složitost hry.** Ve velkém experimentu na webových hrách (> 45 000 hráčů) zvýšily tutoriály dobu hraní až o 29 % jen v nejsložitější, nekonvenční hře. Ve dvou jednodušších kasuálních hrách neměly významný efekt [Z1]. Pro arkádu typu „zamiř a hoď“ je to nejpřenositelnější výsledek celého bloku.
2. **V — Nápověda „na vyžádání“ může uškodit.** V hře Refraction snížilo tlačítko nápovědy počet dokončených úrovní o 12 % a dobu hraní o 15 %. Ve Foldit naopak pomohlo [Z1]. Blokující („stencil“) tutoriály nepomohly v žádné ze tří her [Z1].
3. **V — Kontext je lepší než manuál předem, ale jen tam, kde tutoriál vůbec pomáhá.** Instrukce v okamžiku potřeby zvýšily ve Foldit dobu hraní o 16 % a progres o 40 % proti manuálu. Jinde efekt neměly [Z1]. Teorie kognitivní zátěže tento směr podporuje (rozdělená pozornost, přechodné informace) a dodává efekt obrácení expertízy: co pomáhá nováčkům, zkušeným může škodit [Z5, Z6].
4. **V (slabší) — Tutoriál může pomáhat nezkušeným a zkušeným nevadit.** Laboratorní studie s 40 hráči mobilní hry zjistila vyšší flow u nezkušených s tutoriálem a žádný efekt u zkušených [Z2]. Vzorek je malý a expertíza byla určená sebehodnocením.
5. **H — Heuristiky pro hry se shodují na několika bodech:** konzistentní odezva, viditelný stav hry, učení v průběhu hry místo manuálu, přeskočitelnost opakovaného obsahu a rychlý vstup do hraní [Z8, Z9, Z11, Z15]. Validace heuristik je ale slabá: 5 hodnotitelů a 1 demo [Z11], jedna případová studie ve firmě [Z8].
6. **V (smíšené) — Diegetické UI není univerzálně lepší.** Odstranění HUD zvýšilo imerzi jen u zkušených hráčů FPS (10 expertů, 14 nováčků) [Z13]. V malém výkonovém testu (10 hráčů v posteru, 20 v plné verzi GEM 2015) vyšel nejlépe ukazatel přímo u zbraně [Z14], a to proti nejhorší variantě HUD. Pro nováčky zůstává HUD důležitý.
7. **H — Čitelnost na mobilu je u nás nejkonkrétnějším rizikem.** Apple uvádí pro iOS výchozí velikost textu 17 pt a minimum 11 pt [Z24]. Xbox (XAG 101) žádá na mobilu ještě větší písmo [Z18]. Hlavní QTE výzva v našem canvasu má 10 px na ploše 640 px. Na telefonu s šířkou 360 CSS px se zmenší zhruba na 5 CSS px (výpočet v oddílu 2.6).
8. **H — Přístupnost má jasná minima:** kontrast textu 4,5 : 1, grafických prvků 3 : 1, informace nesmí nést jen barva, dotykový cíl aspoň 24 × 24 CSS px (WCAG AA) a vypínatelný pohyb (prefers-reduced-motion) [Z22, Z23, Z19, Z20]. Časování QTE je jádro hry, takže na něj WCAG 2.2.1 ani XAG 116 nedopadají. GAG přesto doporučuje nabídnout alternativu k přesnému načasování [Z17, Z21].
9. **H — Čeština:** desetinná čárka, mezera mezi skupinami číslic (ideálně nezlomitelná), mezera před jednotkou a „%“, úhel bez mezery („15°“) [Z29]. Krátké anglické řetězce se v překladech prodlužují nejvíc, až 2–3× [Z30]. České popisky bývají delší než anglické, takže layout musí pružně zalamovat.
10. **Mezera v důkazech:** recenzovaný výzkum přímo o rozvržení výsledkových obrazovek (co ukázat první, srovnání s rekordem) jsem nenašel. Doporučení k nim jsou proto odvozená (H/N).

---

## 2. Podrobné sekce

### 2.1 Tutoriály: zda, kdy a jak

**[Z1] Andersen et al., CHI 2012 — V, silná vnější validita pro webové kasuální hry.**
Šlo o vícefaktorový online experiment ve třech hrách vlastního vývoje: Refraction (puzzle, 13 158 hráčů), Hello Worlds (plošinovka, 22 417 hráčů, sběr 2 dny) a Foldit (složitá hra o skládání proteinů, 9 743 hráčů). Refraction a Hello Worlds běžely na portálu Kongregate. Experiment měnil čtyři faktory: přítomnost tutoriálu, kontextovost (instrukce v okamžiku potřeby proti manuálu předem), svobodu (blokující „stencil“, který zašedí obrazovku, proti neblokujícímu) a nápovědu na vyžádání. Měřila se doba hraní, počet dokončených úrovní a návratnost.
- Tutoriál pomohl jen ve Foldit (doba hraní až +29 %, progres až +75 %). V Refraction a Hello Worlds neměl významný efekt. V Hello Worlds se dokonce o 3,5 % méně hráčů vrátilo s kontextovými tutoriály než bez tutoriálu.
- Kontextovost: ve Foldit +40 % úrovní a +16 % času proti manuálu. Jinde bez přínosu, v Hello Worlds návratnost asi o 2 % nižší.
- Omezení svobody nepřineslo žádný prokazatelný zisk.
- Tlačítko nápovědy: ve Foldit asi +12 % času. V Refraction −12 % úrovní a −15 % času, přitom ho použilo jen 31 % hráčů, kteří ho měli. Autoři jen spekulují, proč.
- Závěr autorů: hráči jednodušších her se zřejmě učí víc experimentováním než čtením textu. Rané úrovně proto mají umožnit objevování.
- **Omezení (autoři):** neznámá demografie a samovýběr hráčů, nekomerční hry, tutoriály jen s textem a obrázky (bez videa a animací), všechny čtyři hypotézy se ukázaly jako chybné nebo neúplné. **Přenositelnost:** vysoká. Webový prohlížeč, kasuální publikum a krátké hraní odpovídají naší situaci. Náš let je ovšem z velké části automatický, takže „experimentování“ se u nás týká hlavně míření a QTE.

**[Z2] Passalacqua et al., MTI 2020 — V, slabší.**
Laboratorní experiment se 40 hráči mobilní hry Saber's Edge (match-3 RPG). Měřila se elektrodermální aktivita, flow a záměr pokračovat. Tutoriál zvýšil vnímané flow u nezkušených, u zkušených neměl efekt. Flow předpovídal záměr dál hrát v obou skupinách. **Omezení (autoři):** expertíza podle sebehodnocení, jediná hra a jediný typ tutoriálu, krátký laboratorní časový rámec. **Přenositelnost:** střední. Studie podporuje volitelný nebo adaptivní tutoriál spíš než povinný, ale „záměr pokračovat“ není chování.

**[Z3] Petersen et al., CHI PLAY 2017 — V (metodická studie), H pro praxi.**
28 účastníků hrálo onboarding tří F2P her na tabletu, každou asi 7 minut. Kombinovaly se fyziologické míry s grafem prožitku a stimulovaným vybavením. Kvalitativně: 19 účastníků vadilo dlouhé automatické čekání v bitvách (WinterForts) a 24 cítilo frustraci z opakovaných smrtí (Pogo Chick). Onboarding se v práci definuje jako „prvních několik minut“, včetně odkazů na definice z praxe. **Omezení:** jde hlavně o srovnání metod, vzorek je malý a nevyvážený (21 žen, 7 mužů). **Přenositelnost:** dvě varování pro nás. Pasivní čekání v prvních minutách je zdrojem nevole (náš let je automatický) a stejně tak opakované selhání bez pochopení příčiny.

**[Z4] Adams, Game Developer 2011 — H.** Osm chyb tutoriálu: povinný i pro zkušené, hodně čtení, vágní popis ovládání, vynechané kroky, trestání nezkušenosti, povýšený tón, nemožnost tutoriál opustit, ale také úplná absence tutoriálu. Jde o názor zkušeného návrháře bez dat. Andersen et al. ho citují jako motivaci.

**[Z16] GAG „Include interactive tutorials“ (Basic, kognitivní) — H.** Interaktivní výuka je podle GAG „mnohem užitečnější“ než obrazovka s instrukcemi a méně zatěžuje krátkodobou paměť. Ještě lepší je učit mechaniky přímo v hraní.

**Syntéza a síla důkazu.** Shoda je na jednom bodě: učit konáním, v kontextu a krátce. Silný je jen [Z1], ostatní jsou malé studie nebo heuristiky. Že by plošně pomohla nápověda na vyžádání nebo vynucené kroky, důkazy nepotvrzují. [Z1] naopak ukazuje riziko.

### 2.2 Kognitivní zátěž a postupné odkrývání

**[Z5] Sweller, van Merriënboer a Paas, Educational Psychology Review 2019 — V (přehled teorie s velkou empirickou základnou ve vzdělávání).**
Teorie kognitivní zátěže vychází z kapacitně omezené pracovní paměti a neomezené dlouhodobé paměti. Pro UI her jsou relevantní tyto efekty:
- **rozdělená pozornost:** dva zdroje informací, které je nutné mentálně propojit, zatěžují víc, než když jsou fyzicky sloučené. Příkladem je text pod scénou, který se týká dění v canvasu;
- **redundance:** stejná informace několikrát zatěžuje zbytečně;
- **přechodné informace:** co zmizí, si musí člověk držet v paměti;
- **interaktivita prvků** a **obrácení expertízy:** pomoc pro nováčky ztrácí smysl, nebo škodí, jakmile hráč má schéma.

**Omezení:** teorie byla ověřována hlavně na školních úlohách (matematika, technika). Měření zátěže je podle autorů samostatný otevřený problém. Do her ji přenášíme analogií.

**[Z6] Kalyuga et al., Educational Psychologist 2003 — V (ověřen jen abstrakt a citace v [Z5]).** Techniky účinné u nezkušených mohou u zkušenějších ztratit účinnost, nebo mít negativní důsledky. *Ověřovací kolo:* bibliografie ověřena v Crossref (38(1), 23–31, DOI 10.1207/S15326985EP3801_4). Repozitář UOW blokuje automatický přístup, plný text tedy zůstává neotevřený. Obsah efektu podrobně popisuje plný text [Z5] a nezávisle ho podporuje i přehled Raviv a kol. 2022 (blok 04 [30]: začátečníkům pomáhá nízká variabilita, zkušeným vyšší). Pro nás z toho plyne, že tutoriálové události mají zůstat jen v prvním letu, jak je to dnes, a návody se mají postupně vypínat.

**[Z7] Nielsen, NN/g 2006 — H.** Postupné odkrývání (progressive disclosure) znamená ukázat napřed malou sadu nejdůležitějších voleb a pokročilé ukázat na požádání. Nejvýš dvě úrovně, rozdělení podle dat o používání a ověřené testem. Zvlášť definuje „staged disclosure“, tedy lineární kroky jako v průvodci. Důkazy v článku jsou převážně kvalitativní. **Přenositelnost:** strom vylepšení (3 větve × 5 úrovní) a dva modely jsou kandidáti na postupné odkrývání. Neprokázali jsme ale, že je dnes hráči považují za zahlcující.

### 2.3 Heuristiky použitelnosti a hratelnosti

**[Z8] Federoff, diplomová práce, Indiana University 2002 — H, slabá validace.** Heuristiky z literatury doplněné týdenní případovou studií jednoho herního týmu (5 rolí, rozhovory a pozorování). Dělí je do tří oblastí: rozhraní, mechaniky, hratelnost. Z relevantních: „hra má dávat nápovědy, ale ne příliš“, „poskytni zajímavý a pohlcující tutoriál“, nápověda má být primárně tutoriálem a menší položky v rozhraní. **Omezení:** jedna firma a jedna hra v rané fázi, autorka sama uvádí, že tým s pojmem použitelnost zápasil.

**[Z9] Desurvire, Caplan a Toth, CHI 2004 (HEP) — H, slabá validace.** 43 heuristik ve čtyřech kategoriích: hratelnost, příběh, mechanika, použitelnost. Srovnání s uživatelským testem na jednom vznikajícím návrhu: HEP našla víc obecných problémů, test víc specifických (terminologie, formulace). Mezi relevantními heuristikami: „hráče rychle a snadno zapoj, pomocí tutoriálů nebo postupné obtížnosti“, „dovednosti uč krátce před tím, než jsou potřeba“, „hráč nemá potřebovat manuál“, „rozhraní co nejméně rušivé“. **Omezení:** pozdní výsledky (4 strany), jeden návrh, autoři sami vyzývají k ověření.

**[Z10] Desurvire a Wiberg, 2009 (PLAY) — H.** Zobecnění HEP. Podle abstraktu 54 hráčů hodnotilo hry s vysokým a nízkým hodnocením na Metacritic podle 116 kandidátních heuristik. Plný text jsem neověřil. *Ověřovací kolo:* název, autoři a místo vydání ověřeny v Crossref (*Online Communities and Social Computing*, LNCS 5621, s. 557–566). Čísla 54 a 116 zůstávají jen z abstraktu, Springer stránku automatickému přístupu neotevřel.

**[Z11] Pinelle, Wong a Stach, CHI 2008 — H s empirickým základem.** Analýza recenzí 108 PC her (18 z každého ze 6 žánrů) vedla ke 12 kategoriím problémů a 10 heuristikám. Pro nás relevantní:
- H1 konzistentní odezva na akce;
- H2 nastavitelné video, audio, obtížnost a rychlost;
- H5 přeskočitelný neinteraktivní a opakovaný obsah;
- H6 intuitivní a přemapovatelné vstupy;
- H7 ovládání s přiměřenou citlivostí;
- H8 informace o stavu hry;
- H9 instrukce, trénink a nápověda;
- H10 snadno interpretovatelné vizuální reprezentace bez nutnosti „mikromanagementu“.

Předběžné ověření: 5 hodnotitelů, 1 demo, 45 problémů. Nejčastěji se uplatnily H6, H8, H9 a H10. **Omezení (autoři):** recenze nepsali odborníci na použitelnost, chybí ověření na více žánrech. Kasuální webové hry ve vzorku nejsou. **Přenositelnost:** jako kontrolní seznam pro audit dobře, jako důkaz účinku ne.

**Rozpor:** H9 (poskytni nápovědu) a [Z1] (tlačítko nápovědy může škodit) si zdánlivě protiřečí. Smíření (N): nápověda ano, ale kontextová a vázaná na skutečnou chybu, ne jako obecné tlačítko „?“.

### 2.4 HUD, diegetické UI a stav hry

**[Z12] Fagerholt a Lorentzon, diplomová práce, Chalmers / EA DICE 2009 — H.** Zavádí rozlišení UI na diegetické, nediegetické, prostorové a meta. Z něj vznikly návrhové zásady pro imerzi ve FPS, například „posilovat vjemové propojení hráče a avatara“. Doporučení vycházejí z analýzy her, literatury a malých uživatelských testů. **Přenositelnost:** taxonomie je užitečná i pro nás. Štítek místa (`#scene-label`) je prostorový nebo meta prvek, HUD dolet/rekord/odměna je nediegetický, neonové cedule ve scéně jsou diegetické.

**[Z13] Iacovides et al., CHI PLAY 2015 — V, malý vzorek.** Battlefield 3 s HUD a bez něj, studie 1 s 9 účastníky, studie 2 s 24 (10 expertů, 14 nováčků; 7 dalších vyřazeno, protože nezvládli ovládání). Bez HUD měli experti vyšší imerzi, konkrétně kognitivní zapojení a pocit kontroly. U nováčků se rozdíl neprojevil. **Omezení:** FPS, jedna úroveň, samohodnocená expertíza, jen muži ve studii 1. **Přenositelnost:** nízká až střední. Princip „rozhodnutí o UI závisí na expertíze“ se přenáší dobře, konkrétní efekt ne.

**[Z14] Peacocke et al., GI 2015 (poster) a IEEE GEM 2015 — V, malý vzorek.** Poster: 10 pravidelných hráčů FPS, 5 způsobů zobrazení munice, 15 pokusů na každý. Nejlépe vyšlo číslo přímo ve hře u zbraně. Autoři to vysvětlují menším počtem a kratšími sakádami než u čísla v HUD. Poster cituje i opačný kvalitativní nález (Fragoso: HUD prvky méně rušivé, hráči je preferovali). Ten jsem neověřoval. *Ověřovací kolo (plný text GEM 2015):* plná verze má **20 účastníků** (16 mužů, 18–38 let, všichni pravidelní hráči). Procenta z abstraktu jsou potvrzena: s číslem ve hře hráči po vyprázdnění zásobníku vystřelili o 35 % méně ran a přebíjeli o 26 % rychleji. **Obojí je srovnání s nejhorší variantou (ikony v HUD), ne s HUD obecně.** Číslo ve hře preferovalo 70 % účastníků. Text GEM dále cituje Llanos a Jørgensen (hráči oceňují estetiku diegetického UI, ale víc jasné sdělení informace). To známe jen z této citace.

**Syntéza.** Pro HUD v arkádě je přenositelná hlavně myšlenka umístění: kritickou informaci dát tam, kam se hráč dívá. U nás se během QTE dívá na vlaštovku v canvasu, ne na pruh pod scénou. To odpovídá efektu rozdělené pozornosti [Z5]. Diegetizovat všechno kvůli imerzi důkazy pro nováčky nepodporují.

### 2.5 První minuta a FTUE ve webových a kasuálních hrách

- **V** [Z1]: webové kasuální hry s konvenčními mechanikami se hráči naučili experimentováním. Text přínos neměl.
- **V/H** [Z3]: v prvních minutách vadí nucené pasivní čekání a opakované selhání.
- **H** [Z15] (GAG Basic): „umožni spustit hru bez procházení více úrovní menu“, „používej jednoduchý jasný jazyk“, „nech hráče postupovat textem vlastním tempem“.
- **H** [Z9]: „hráče zapoj rychle“, dovednost naučit těsně před potřebou.
- **Mezera:** kvantitativní data o tom, kolik webových hráčů odejde v první minutě a při jaké délce úvodu, jsem z ověřitelných zdrojů nezískal. Oborové benchmarky (GameAnalytics a podobné) zůstaly neprohledané.

**Vztah k naší hře (popis, ne hodnocení):** dnes hráč vidí úvodní text, scénu, dílnu se dvěma modely a strom vylepšení. Hodit může tlačítkem „Hodit vlaštovku ↗“. Míření má jednu krátkou instrukci a popis ovládání pro myš, dotyk i klávesnici. První let obsahuje dvě tutoriálové události (poryv, holub).

### 2.6 Čitelnost textu a velikosti na mobilu

**[Z24] Apple HIG, Typography a Accessibility (stav 2026) — H.** Pro iOS a iPadOS platí výchozí velikost 17 pt a minimum 11 pt. U tenkých řezů se doporučuje volit větší písmo. Výslovně se doporučuje testovat čitelnost herního textu na každé platformě. Výchozí cíl pro ovládací prvek je 44 × 44 pt, minimum 28 × 28 pt. Kolem prvků s rámečkem stačí asi 12 pt odstupu, bez rámečku asi 24 pt. Kontrast se řídí WCAG AA: do 17 pt 4,5 : 1, od 18 pt nebo tučně 3 : 1.

**[Z18] XAG 101 Text display — H.** Minimální *výchozí* velikost měřená jako výška písma od dolního dotahu po horní: 26 px na konzoli a 18 px na PC při 1080p. Mobil 18 px při 100 DPI s lineárním škálováním, tedy fyzicky asi 4,6 mm. Dále: škálování do 200 %, alespoň jedno bezpatkové písmo, nestylizovaná varianta písma, věty ne celé verzálkami (výjimkou jsou jedno- až dvouslovné popisky), zarovnání podle jazyka. Lupa systému se jako náhrada nepočítá.

**Výpočet pro naši hru (N, zatím neměřeno na zařízení):**
- Canvas má interní šířku 640 px a CSS `width:100%`. Při šířce viewportu 360 CSS px a odsazení 16 px z každé strany je canvas široký asi 328 CSS px, měřítko ≈ 0,51.
- Popisek QTE (`bold 10px monospace`, „! PŘIPRAV SE“, „↓ KLEPNI“, „↕ PODRŽ / PUSŤ“) tak má asi 5 CSS px.
- Cedule „PAPER LAB“ (11–12 px) a texty blueprint motivu (9–10 px) vycházejí na 4,5–6 CSS px.
- Pod `max-width:650px` mají HTML popisky HUD 8 px a štítek místa 7 px.

Všechno je hluboko pod minimem 11 pt podle Apple [Z24] a ještě dál od XAG [Z18]. Tím se potvrzuje známý problém z CLAUDE.md. Hodnoty HUD (16 px tučně) jsou na hraně, ale nad minimem.

**Rozpor mezi zdroji:** XAG pro mobil vychází zhruba na 26–28 CSS px výšky písma, tedy asi 1,6× víc než výchozí tělo textu u Apple (17 pt). Jde o hrubý odhad: přepočet výšky písma na `font-size` závisí na fontu. XAG cílí i na streamované konzolové hry. Za realistický práh pro naši webovou hru považuji spíš výchozí hodnoty Apple: nic informačního pod 11–12 CSS px, klíčové výzvy výrazně víc. To je ale náš úsudek (N).

### 2.7 Dotykové cíle, palec a orientace

- **[Z25] Parhi, Karlson a Bederson, MobileHCI 2006 — V (plný text ověřen 13. 10. 2026):** při ovládání jedním palcem stačí terče 9,2 mm pro jednotlivé úkoly a 9,6 mm pro sériové, bez zhoršení výkonu a preferencí. Chybovost se přestala významně lišit od 9,6 mm (diskrétní) a 7,7 mm (sériové). Doporučení zohledňuje i rozptyl dopadů a subjektivní hodnocení (rozpor R6 s blokem 06 je jen zdánlivý). Proměnná byla i poloha na displeji. Nejpohodlnější byl střed, nejhorší rohy (levé a pravý dolní). Vzorek tvořilo 20 praváků (17 mužů), kteří stáli a ovládali přístroj jedním palcem, výběr se potvrzoval zvednutím prstu. **Omezení:** PDA a telefony z roku 2006, malé displeje, malý a nevyvážený vzorek.
- **[Z26] Bergstrom-Lehtovirta a Oulasvirta, CHI 2014 — V (ověřen abstrakt a metadata):** model dosažitelné oblasti palce podle velikosti displeje, ruky a polohy ukazováčku vzadu. Dobrá shoda s trajektoriemi 20 účastníků. Podstatné pro nás: oblast dosahu závisí na úchopu a zařízení, univerzální „heatmapa palce“ neexistuje.
- **[Z27] Hoober, UXmatters 2013 — H/V (observační; čísla znovu ověřena na stránce 13. 10. 2026):** 1 333 pozorování na veřejnosti, z toho 780 lidí dotýkajících se displeje. Jednou rukou 49 %, v dlani přidržované druhou rukou 36 %, oběma rukama 15 % (z toho 90 % na výšku). Autor sám upozorňuje, že jeho kresby dosahu palce vznikly neformálně a ať se nepoužívají (komentář z roku 2017: „please, please everyone ignore those drawings“). Úchopy se mění po několika sekundách. Data se týkají běžného používání telefonu, ne hraní.
- **[Z22] WCAG 2.2 — H/norma:** 2.5.8 Target Size (AA) žádá aspoň 24 × 24 CSS px, s výjimkami (rozestup, ekvivalent). 2.5.7 Dragging Movements (AA) žádá alternativu k tažení. 1.3.4 Orientation (AA) zakazuje zamknout obsah na jednu orientaci. [Z15] GAG Basic: „interaktivní prvky / virtuální ovládání velké a dobře rozmístěné, zvláště na malých dotykových displejích“.

**Vztah k naší hře:** tlačítka mají `min-height:46px` (splňuje). Míření tažením v canvasu má ekvivalent v posuvníku úhlu a tlačítku „Podrž a pusť“ (2.5.7 tedy zřejmě splněno). Uzly stromu mají `min-width:44px`. Krajina 16 : 9 na výšku znamená malý canvas, a tím i malé texty v něm (2.6).

### 2.8 Výsledková obrazovka a cesta „Znovu“

**Stav důkazů:** recenzovanou studii, která by porovnávala rozvržení výsledkových obrazovek, jsem nenašel. Použitelné jsou nepřímé zdroje:
- **V** (KB S3, Burgers et al. 2015): typ a vyznění zpětné vazby ovlivňují kompetenci a okamžité opakování. Podrobněji je to v KB a v bloku 4.
- **V** [Z5]: redundance a přechodné informace zvyšují zátěž. Šest statistik, rozpis mincí a souvislý řetězec textu („Silný hod · nápověda úhlu · ★ Nový rekord! · Kluzák odemčen!“) soupeří o pozornost.
- **H** [Z11] H8 a H10: stav a reprezentace mají být snadno interpretovatelné a odlišit důležité od nedůležitého.
- **H** [Z9]: „hráč by měl dostat okamžitou pozitivní zpětnou vazbu“ a „hra je příjemná k opakovanému hraní“.
- **H** [Z15] GAG Basic: rychlý start bez vrstev menu.
- **H** [Z4]: „neztěžuj okamžitý nový pokus po chybě“.

**Současný stav v kódu (popis):** pořadí je nadpis („Hod dokončen!“ / „Obzor je tvůj!“), pruh 0–500 m, pak mřížka 6 statistik (Vzdálenost, Čas letu, Síla, Úhel, Události ve formátu „x / y · ★ z“, Rekord), rozpis mincí, celkem a nakonec textový řádek, ve kterém je i „★ Nový rekord!“. „Znovu“ dostane fokus. Z výsledku se tak jedním klepnutím nebo Enterem dostanete do míření, kde fokus přechází na „Podrž a pusť“. Esc vede do dílny. Rekord se ukazuje až po aktualizaci, takže chybí rozdíl proti předchozímu rekordu. Ten je na úrovni kódu k dispozici (`previous`).

### 2.9 Přístupnost: guidelines

**[Z15] Game Accessibility Guidelines — H (kolaborativní dílo studií, specialistů a akademiků; úrovně Basic / Intermediate / Advanced).** Basic položky relevantní pro nás:
- nastavitelná rychlost hry;
- velké a dobře rozmístěné ovládací prvky;
- celé UI ovladatelné stejným vstupem jako hra;
- žádné blikání ani opakující se vzory;
- vlastní tempo u textových výzev;
- interaktivní tutoriál;
- jednoduchý jazyk a formátování;
- čitelná výchozí velikost písma;
- vysoký kontrast;
- žádná podstatná informace jen barvou;
- žádná podstatná informace jen zvukem;
- oddělené ovládání hlasitosti;
- ukládání nastavení;
- informace o přístupnosti ve hře.

**[Z17] GAG „Do not make precise timing essential…“ (Advanced, motorika) — H.** Doporučuje alternativy jako režim čekání, akce během pauzy nebo přeskočení. Formuluje to slovy „vyhni se požadavkům na časování, pokud to jde“.

**[Z18]–[Z21] Xbox Accessibility Guidelines — H (platformní standard).**
- **XAG 102 (kontrast):** 4,5 : 1 pro běžný text a důležité prvky, 3 : 1 pro velký text a neaktivní prvky, 7 : 1 v režimu vysokého kontrastu. Kontrast nad proměnlivým pozadím se měří proti nejméně kontrastnímu místu. Doporučuje volitelné podklady pod text, obrysy a respektování systémového nastavení kontrastu.
- **XAG 103 (další kanály):** podstatnou informaci nést aspoň dvěma smysly. Barvu doplnit tvarem, ikonou nebo textem. Šedé zamčené prvky doplnit symbolem zámku. Simulátory barvosleposti nenahrazují test s lidmi. Upozorňuje, že znaky Unicode (třeba ◈, ↻, ⌂) přečte čtečka obrazovky svým oficiálním názvem.
- **XAG 116 (časové limity):** platí pro UI mimo jádro hry. Časování v jádru je výjimkou, ale tutoriálové texty s automatickým zmizením mají mít nastavitelnou délku až 10×, nebo se zavírat vstupem.
- **XAG 117 (pohyb):** vypnout otřesy kamery, rozmazání pohybem a opakovaný pohyb nahoru a dolů, nebo k nim dát vypínač. Nabídnout podklad pod text nad pohybující se scénou.

**[Z22] WCAG 2.2 (W3C Recommendation, 12. 12. 2024) — norma pro web.**
- 1.4.1 Use of Color (A);
- 1.4.3 Contrast (AA) 4,5 : 1, velký text 3 : 1;
- 1.4.11 Non-text Contrast (AA) 3 : 1 pro grafické objekty nutné k porozumění;
- 2.2.1 Timing Adjustable (A) s výjimkou pro limity „podstatné“ a „real-time“;
- 2.3.1 nejvýš tři záblesky za sekundu (A);
- 2.3.3 Animation from Interactions (AAA);
- 2.4.7 Focus Visible (AA);
- 2.4.11 Focus Not Obscured (AA);
- 2.5.7, 2.5.8 a 1.3.4 viz 2.7.

**[Z23] W3C Understanding 2.3.3 — H.** Nejvíc jsou dotčeni lidé s vestibulárními poruchami (závratě, nevolnost, bolesti hlavy, někdy až nutnost ležet). Typickým spouštěčem je paralaxa. Techniky: `prefers-reduced-motion` v CSS a JS a vlastní přepínač na stránce. Prevalenci tato stránka neuvádí.

**[Z28] Barevné vidění — V (sekundární citace).** Přehled z roku 2025 v PMC uvádí s odkazem na Birch (2012) a další asi 8 % mužů a 0,5 % žen s červeno-zelenou poruchou barvocitu. Jeho tabulka uvádí pro ženy evropského původu 0,4 %. Původní článek Birch (JOSA A 2012) jsem neotevřel.

**Audit barev v kódu (N, výpočet podle vzorce WCAG; reálné hodnoty závisí na motivu a pozadí canvasu):**
- Text:
  - popisek QTE v canvasu (`#eefaff` na `#141c32`) vychází 15,9 : 1 (dobře);
  - text HUD a nadpisky (eyebrow) jsou v základních barvách `style.css` v pořádku (10,9 : 1 a 8,5 : 1).
- HTML časovací pruh:
  - motiv Kyberpunk: perfektní zóna proti úspěšné 2,0 : 1, úspěšná zóna proti stopě 1,9 : 1;
  - základní barvy `style.css`: perfektní zóna `#f2ce87` proti úspěšné `#6d9a78` jen 2,1 : 1, bílá ručička na perfektní zóně jen 1,5 : 1.
- Štítek místa nemá podklad. Proti světlé obloze vychází málo, například `#fff2c9` na `#a2c9c5` 1,6 : 1. V motivu Kyberpunk je štítek `#7bffed` nad proměnlivou nocí. Měřit proti nejsvětlejšímu místu [Z19].

Výchozí motiv je podle CLAUDE.md `cyber`. Základní barvy v `style.css` jsou podle CLAUDE.md zčásti pozůstatkem starého zeleného tématu, a čísla pro ně jsou proto jen orientační.

Podle CLAUDE.md a kódu (`.timing{opacity:.25}`) se QTE od verze 0.6 ukazuje hlavně jako časovací kruh ve scéně, takže HTML pruh je za letu ztlumený. Pro 1.4.11 je proto rozhodující kontrast barev kruhu (`theme.fx`) proti scéně. Ten jsem neměřil.

**Reduced motion v kódu (N):** `render.js`, `atmosphere.js` a `decorations.js` při `prefers-reduced-motion` vypínají animace, stopu a dekorace. Blikání neonu je vázané na animační čas, takže se vypne také. Ale `prepare()` volá `scrollIntoView({behavior:'smooth'})` bez ohledu na preferenci. Vlastní přepínač pohybu ve hře chybí. Při běžném běhu bliká neon zhruba 3,7 Hz v krátkých oknech. Frekvenci a počet záblesků za sekundu by bylo dobré změřit kvůli 2.3.1 (odhadem jde o 1 záblesk na okno, tedy pod limitem).

### 2.10 Lokalizace a čeština

- **[Z29] Internetová jazyková příručka ÚJČ AV ČR — H (normativní pro češtinu):**
  - skupiny po třech číslicích oddělené mezerou („6 378 km“), čtyřmístná čísla smějí být bez mezery, letopočty se nečlení;
  - desetinná čárka bez mezer („2,18 km“);
  - mezera mezi číslem a značkou, oboje na stejném řádku („10 ha“);
  - procenta jako podstatné jméno s mezerou („14 %“), jako přídavné jméno bez ní nebo slovem („dvacetiprocentní“);
  - úhlový stupeň bez mezery („60°“), teplota s mezerou („24 °C“);
  - znak × s mezerami.
- **Lokální ověření (N):** `toLocaleString('cs')` v Node vrací „12 345“ s nezlomitelnou mezerou (U+00A0), „1 234 567,5“ a pro 1 234 také „1 234“. Pravidla množného čísla `Intl.PluralRules('cs')` rozlišují one, few, many (desetinná čísla) a other. Pro správné tvary („1 mince / 2 mince / 5 mincí / 1,5 mince“) je tedy použitelné API prohlížeče. Výstup se v jiných prohlížečích může lišit podle verze ICU.
- **[Z30] W3C Internationalization, „Text size in translation“ — H:** podle směrnic IBM se anglický řetězec do 10 znaků v překladu prodlouží na 200–300 %, 11–20 znaků na 180–200 % a nad 70 znaků na asi 130 %. Doporučuje pružné rozvržení, žádné pevné šířky ani text v grafice a žádné zkratky kvůli místu. Pro češtinu je relevantní hlavně opačný směr: hra je česká, ale tlačítka a štítky musí unést delší slova a skloňování. Nejrizikovější jsou krátké popisky (HUD, tlačítka). Data o délce českých textů proti anglickým jsem nenašel.
- **V kódu (N):**
  - `num()` používá `toLocaleString('cs')`, ale část výstupů skládá řetězce ručně (`Math.floor(p.best)+' m'`, `' / 500 m'`, `p.coins`). Hrozí tak běžná mezera místo nezlomitelné a chybějící oddělení tisíců u velkých čísel mincí;
  - „15°“ i „42 %“ odpovídají pravidlům;
  - anglické nápisy v canvasu („PAPER LAB“) jsou podle CLAUDE.md záměrné, jde o neonové reklamy. Z pohledu přístupnosti jsou jen dekorací, problém by nastal, kdyby nesly informaci.

---

## 3. Shrnutí síly důkazů

| Téma | Nejsilnější zdroj | Síla | Hlavní limit přenosu |
|---|---|---|---|
| Tutoriál ano/ne | [Z1] | V, velký vzorek, randomizace | Puzzle a plošinovka, ne automatický let; text bez animace |
| Kontextová nápověda | [Z1], [Z5] | V | Efekt jen tam, kde tutoriál vůbec pomáhá |
| Nováček proti expertovi | [Z2], [Z6], [Z13] | V, malé vzorky | Sebehodnocená expertíza |
| Heuristiky | [Z11], [Z9], [Z8] | H | Slabá validace, PC a konzole |
| HUD / diegetické UI | [Z13], [Z14] | V, n ≤ 24 | FPS |
| Čitelnost a velikosti | [Z24], [Z18] | H (platformy) | Zdroje se navzájem liší |
| Dotyk | [Z25], [Z26], [Z22] | V + norma | Starší zařízení; nejde o hraní |
| Výsledková obrazovka | — | žádný přímý V | Jen odvozeno |
| Přístupnost | [Z15]–[Z23] | H / norma | Guidelines nejsou studie účinku |

---

## 4. Rozpory a otevřené otázky

1. **Nápověda: ano, nebo ne?** Pinelle H9, HEP a GAG doporučují nápovědu a tutoriál. Andersen et al. ale naměřili, že tlačítko nápovědy v jednoduché hře snížilo hraní o 12–15 % [Z1, Z11, Z9, Z15]. *Otevřené:* je u nás kontextová rada po neúspěchu (dnešní nápověda úhlu ve výsledku) blíž „kontextovému tutoriálu“, nebo „tlačítku nápovědy“? Neověřeno. *Ověřovací kolo (rozpor R-N2 s blokem 04):* blok 04 N2 po ověření Smeddinck 2016 (plný text: preference ruční volby nebyla v pořadí významná) vypustil trvalé tlačítko „Poradit?“ a ponechal ustupující nápovědu spouštěnou chybou. Oba bloky se teď shodují s N2 níže. Nápověda po letu, kterou hráč nemusí vyvolat, je strukturně blíž kontextové instrukci než tlačítku „?“, rozhodne ale až test.
2. **Jak složitá je naše hra?** Podle [Z1] je to klíčová proměnná. Jádro (úhel + síla) je konvenční, ale ekonomika (dva modely, 15 uzlů, rozdílné bonusy modelů, QTE poryv proti holubovi s odlišným ovládáním „klepni“ / „podrž a pusť“) přidává interaktivitu prvků [Z5]. Kde přesně hráči tápou, nevíme bez testu.
3. **HUD proti imerzi.** Experti profitovali z odebrání HUD [Z13], nováčci ne. Na odměnu v HUD jsme navázali průběžnou motivaci (KB K1). Ruší ta průběžná čísla zážitek z krajiny, nebo ho drží? Nevíme.
4. **Minimální velikost textu na mobilu.** XAG (≈ 4,6 mm) [Z18] se výrazně liší od Apple (11 pt minimum, 17 pt výchozí) [Z24]. Přímé srovnání obou čísel v CSS px je přibližné.
5. **QTE a přístupnost.** Normy časování v jádru hry vyjímají [Z21, Z22], ale GAG Advanced doporučuje alternativu [Z17]. Volitelný „klidný režim“ s širšími okny nebo bez QTE by mohl hráčům s motorickým omezením dovolit hrát, ale mohl by oslabit pocit zvládnutí (blok 4 a 6). Rozhodnutí je produktové.
6. **Výsledková obrazovka.** Přímý výzkum chybí. Co ukázat první (vzdálenost proti rekordu, proti odměně, proti příčině), zda zvýraznit „nový rekord“, nebo „o kolik chybělo“ (pozor na etiku near-miss, blok 2), a kolik statistik je moc, to všechno zůstává otevřené.
7. **Neprohledáno (došel rozpočet vyhledávání):**
   - průmyslová data o odchodech v první minutě webových her;
   - Celia Hodent a GDC talky o onboardingu;
   - studie o čitelnosti textu ve hrách na malých displejích;
   - studie o vlivu orientace displeje na hraní;
   - Linehan et al. (křivky učení v puzzle hrách);
   - Llanos a Jørgensen 2011 (preference integrovaného UI; po ověřovacím kole známe jen z citace v GEM verzi [Z14]);
   - původní plné texty [Z6], [Z10], [Z26] a Birch 2012 ([Z25] doplněn v ověřovacím kole 13. 10. 2026).

   Po ověřovacím kole zůstávají otevřené všechny body kromě [Z25].

---

## 5. Relevance pro Just Throw It — kandidátní implikace (N)

*Všechny body jsou hypotézy k ověření, ne rozhodnutí. Číslování navazuje na KB jen tam, kde je vazba výslovně uvedena.*

### 5.1 Onboarding a první minuta

- **N1 — Učit konáním, ne textem.** Úvodní odstavec a návod v sekci míření zkrátit nebo nechat volitelný a učit přímo ve scéně: šipka úhlu, pulzující „podrž“ a po prvním hodu jedna věta o tom, co udělal. Opora: [Z1], [Z16], [Z9]. Riziko: pro nekonvenčnější části (ekonomika) může text chybět. *Test:* čas od načtení k prvnímu hodu a podíl hráčů, kteří první hod pustí do 1 s (signál nepochopení „podrž a pusť“).
- **N2 — Žádné blokující tutoriály ani obecné tlačítko „?“.** Opora: [Z1]. Pokud nápověda, pak kontextová a spuštěná chybou (např. po dvou hodech s nabitím pod 35 %). *Ověřovací kolo:* v souladu s upravenou 04 N2 (ustupující nápověda, znovu po opakované chybě, bez trvalého tlačítka „Poradit?“). Rozpor R-N2 je tím na úrovni návrhu uzavřený, empiricky ho rozhodne test.
- **N3 — Tutoriálové události jen v prvním letu je správný směr** (obrácení expertízy [Z6]). Ověřit, že popisky v prvním letu hráč stihne přečíst. Dnes jsou v canvasu malé (N8).
- **N4 — Nepasivní první let.** Petersen et al. ukazují nevoli z dlouhého automatického čekání [Z3]. U automatického letu sledovat, zda první let bez událostí nepůsobí jako čekání. Tutoriálové události v prvním letu to dnes částečně řeší.
- **N5 — Postupné odkrývání dílny.** Při 0 mincích a prvním návratu ukázat ve stromu jen první dostupné uzly a zbytek sbalit [Z7]. Riziko: hráč neuvidí, kam spoří (KB K1/K5). *Test A/B:* porozumění cíli, ne klik.

### 5.2 HUD a let

- **N6 — Kritickou informaci QTE ukazovat u vlaštovky, ne pod scénou.** Opora: [Z5] (rozdělená pozornost), [Z14] (číslo „ve hře“ rychleji čitelné). Od 0.6 je výzva i časovací kruh ve scéně (v souladu). Mimo scénu zůstává `#event-help`. Ověřit, zda na něj hráči při QTE nepřesouvají pohled.
- **N7 — HUD během letu ztlumit na to podstatné**, například dolet a další milník, a odměnu ukázat až při změně. Opora: [Z11] H10, [Z13]. Jde o konflikt s KB K1 a nutí ho otestovat, ne rozhodnout.
- **N8 — Texty v canvasu nepovažovat za čitelné na mobilu.** Hlavní výzvu QTE vykreslit jako HTML překryv nad canvasem (velikost v CSS px, ne v px canvasu) nebo ji v canvasu škálovat podle `getBoundingClientRect` tak, aby měla aspoň 11–12 CSS px, raději 16+. Opora: [Z24], [Z18]. Totéž pro štítek místa (dnes 7 px) a popisky HUD (8 px).

### 5.3 Výsledek a „Znovu“

- **N9 — Hierarchie výsledku:**
  1. vzdálenost a změna proti rekordu („+12,4 m nad rekord“, případně „rekord 231 m“);
  2. jedna příčina („pustil jsi při 62 %, ideál je vrchol“);
  3. mince;
  4. podrobné statistiky sbalit.

  Opora: [Z5] (redundance), [Z11] H8/H10, KB K1. „★ Nový rekord!“ dnes stojí až v posledním řádku. *Pozn. z ověřovacího kola (R-N3):* bod 2 je hlášení odchylky toho, co hráč udělal (KR), a s blokem 04 N1 je v souladu. Formulace „ideál je vrchol“ popisuje princip, ne předepsanou hodnotu. Blok 04 odmítá jen přímé zobrazení ideálního úhlu (`bestAngle`). *Test:* co hráč po zavření výsledku zopakuje vlastními slovy.
- **N10 — Zachovat jedno klepnutí a Enter na „Znovu“** (dnes splněno, KB B14). Na mobilu ověřit, že „Znovu“ je bez rolování vidět v dialogu. Při `max-height` a mnoha řádcích může spadnout pod okraj.
- **N11 — „Události 2 / 3 · ★ 1“ přepsat srozumitelně** („Zvládnuté události: 2 ze 3, perfektně 1“). Opora: [Z15] (jednoduchý jazyk).

### 5.4 Kontrolní seznam přístupnosti pro hru (kandidátní)

| # | Kontrola | Zdroj | Stav dnes (z kódu, neověřeno na zařízení) |
|---|---|---|---|
| A1 | Žádný informační text pod 11–12 CSS px na mobilu, klíčové výzvy ≥ 16 CSS px | Z24, Z18 | **Ne:** canvas ~5 px, HUD popisky 8 px, štítek místa 7 px |
| A2 | Kontrast textu ≥ 4,5 : 1 i nad pohyblivou scénou (měřit proti nejsvětlejšímu místu) | Z22, Z19 | Většina ano; štítek místa bez podkladu ✗ |
| A3 | Zóny QTE (kruh ve scéně i pruh) a ručička ≥ 3 : 1 proti sousedům | Z22 1.4.11 | HTML pruh kandidát ✗ (Kyberpunk ~2 : 1), ale za letu je ztlumený. Kruh ve scéně neměřen |
| A4 | Úspěch / perfektní / minutí nejen barvou (tvar, text, zvuk) | Z22 1.4.1, Z20, Z15 | Text „perfektní“ existuje; ověřit u všech zpětných vazeb |
| A5 | Barvoslepost: otestovat neonovou paletu (zejména růžová / tyrkysová / zelená) simulací **a** s lidmi | Z20, Z28 | Neověřeno |
| A6 | `prefers-reduced-motion` respektovat všude, včetně plynulého scrollu; vlastní přepínač ve hře | Z23, Z21 | Částečně; `scrollIntoView smooth` ✗; přepínač chybí |
| A7 | Blikání ≤ 3 záblesky za sekundu | Z22 2.3.1 | Pravděpodobně ano; změřit |
| A8 | Viditelný a nezakrytý fokus; celé UI ovladatelné klávesnicí | Z22 2.4.7, 2.4.11; Z15 | Fokus je stylovaný; ověřit fokus v dialogu a po návratu |
| A9 | Dotykové cíle ≥ 24 × 24 CSS px (lépe 44) a dost rozestupu | Z22 2.5.8, Z24, Z25 | Tlačítka 46 px ✓; ověřit uzly stromu na úzkém displeji |
| A10 | Alternativa k tažení (míření) | Z22 2.5.7 | ✓ posuvník a tlačítko |
| A11 | Neomezovat orientaci, v portrétu nabídnout použitelné rozvržení | Z22 1.3.4 | Neomezeno; portrét = malý canvas |
| A12 | Tutoriálové texty nemizí dřív, než je lze přečíst, nebo se zavírají vstupem | Z21, Z15 | Ověřit délku zobrazení popisků v 1. letu |
| A13 | Volitelná pomoc s časováním (širší okna nebo „klidný let“) | Z17, Z15 | Chybí; produktové rozhodnutí (oddíl 4, bod 5) |
| A14 | Zvuk nikdy jediným nositelem informace; oddělená hlasitost | Z15, Z20 | Ověřit podle stavu zvuku |
| A15 | Symboly Unicode (◈ ↻ ⌂ ★) mají srozumitelné popisky pro čtečky | Z20 | Částečně (`aria-label` u Znovu / Dílna); ◈ v textech bez popisu |
| A16 | Nastavení (motiv, budoucí přepínače) se ukládá | Z15 | Motiv ✓ (localStorage) |
| A17 | Čísla přes `Intl` s nezlomitelnou mezerou; jednotky „m“, „s“, „%“ s mezerou, „°“ bez mezery | Z29 | Částečně (ruční skládání řetězců) |
| A18 | Prázdná stránka „Bonusy“ v navigaci (známý problém) vede do slepé uličky | Z11 H8, Z15 | ✗ (podle CLAUDE.md) |

---

## 6. Registr zdrojů

Hodnocení kvality: **A** recenzovaná empirická studie s rozumným vzorkem · **B** recenzovaná, ale malý vzorek nebo slabá validace / přehled teorie · **C** guideline platformy, norma nebo kurátorovaný standard · **D** názor odborníka nebo blog · ⚠ = otevřen jen abstrakt, metadata nebo sekundární citace.

1. **[Z1]** Andersen, E., O'Rourke, E., Liu, Y.-E., Snider, R., Lowdermilk, J., Truong, D., Cooper, S., Popović, Z. (2012). *The Impact of Tutorials on Games of Varying Complexity.* CHI 2012, s. 59–68. Online experiment, n > 45 000. https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf — **A**
2. **[Z2]** Passalacqua, M., Morin, R., Sénécal, S., Nacke, L. E., Léger, P.-M. (2020). *Demystifying the First-Time Experience of Mobile Games: The Presence of a Tutorial Has a Positive Impact on Non-Expert Players' Flow and Continuous-Use Intentions.* Multimodal Technologies and Interaction. Laboratorní experiment, n = 40. https://publications.polymtl.ca/9418/1/2020_Passalacqua_Demystifying_First-Time_Experience_Mobile_Games.pdf — **B**
3. **[Z3]** Petersen, F. W., Thomsen, L. E., Mirza-Babaei, P., Drachen, A. (2017). *Evaluating the Onboarding Phase of Free-to-Play Mobile Games: A Mixed-Method Approach.* CHI PLAY '17, s. 377–388. DOI 10.1145/3116595.3125499. n = 28, smíšené metody. https://vbn.aau.dk/ws/files/281451421/p377_petersen.pdf — **B**
4. **[Z4]** Adams, E. (2011). *The Designer's Notebook: Eight Ways to Make a Bad Tutorial.* Gamasutra / Game Developer. https://www.gamedeveloper.com/design/the-designer-s-notebook-eight-ways-to-make-a-bad-tutorial — **D**
5. **[Z5]** Sweller, J., van Merriënboer, J. J. G., Paas, F. (2019). *Cognitive Architecture and Instructional Design: 20 Years Later.* Educational Psychology Review, 31, 261–292. Přehled, open access. https://link.springer.com/article/10.1007/s10648-019-09465-5 — **B** (silná teorie, přenos do her analogií)
6. **[Z6]** Kalyuga, S., Ayres, P., Chandler, P., Sweller, J. (2003). *The Expertise Reversal Effect.* Educational Psychologist, 38(1), 23–31. DOI 10.1207/S15326985EP3801_4. https://ro.uow.edu.au/edupapers/136 — **B** ⚠ (abstrakt a citace v Z5; bibliografie ověřena v Crossref 13. 10. 2026, repozitář blokuje automatický přístup)
7. **[Z7]** Nielsen, J. (2006). *Progressive Disclosure.* Nielsen Norman Group. https://www.nngroup.com/articles/progressive-disclosure/ — **D**
8. **[Z8]** Federoff, M. A. (2002). *Heuristics and Usability Guidelines for the Creation and Evaluation of Fun in Video Games.* MS thesis, Indiana University. Případová studie a literatura. https://ocw.metu.edu.tr/pluginfile.php/2510/mod_resource/content/0/ceit706_2/10/MelissaFederoff_Heuiristics.pdf — **D/B**
9. **[Z9]** Desurvire, H., Caplan, M., Toth, J. A. (2004). *Using Heuristics to Evaluate the Playability of Games.* CHI EA 2004, s. 1509–1512. DOI 10.1145/985921.986102. https://hci.rwth-aachen.de/materials/conferences/CHI2004/2p1509.pdf — **B**
10. **[Z10]** Desurvire, H., Wiberg, C. (2009). *Game Usability Heuristics (PLAY) for Evaluating and Designing Better Games: The Next Iteration.* OCSC 2009, LNCS 5621 (Springer), s. 557–566. DOI 10.1007/978-3-642-02774-1_60. https://link.springer.com/chapter/10.1007/978-3-642-02774-1_60 — **B** ⚠ (abstrakt; název, autoři a strany ověřeny v Crossref 13. 10. 2026, plný text neotevřen)
11. **[Z11]** Pinelle, D., Wong, N., Stach, T. (2008). *Heuristic Evaluation for Games: Usability Principles for Video Game Design.* CHI 2008, s. 1453–1462. DOI 10.1145/1357054.1357282. 108 recenzí, ověření s 5 hodnotiteli. Kopie: https://web.archive.org/web/2016id_/https://course.ccs.neu.edu/is4300f15/ssl/pinelle-chi08.pdf — **B**
12. **[Z12]** Fagerholt, E., Lorentzon, M. (2009). *Beyond the HUD: User Interfaces for Increased Player Immersion in FPS Games.* MS thesis, Chalmers (ve spolupráci s EA DICE). https://publications.lib.chalmers.se/records/fulltext/111921.pdf — **D/B**
13. **[Z13]** Iacovides, I., Cox, A., Kennedy, R., Cairns, P., Jennett, C. (2015). *Removing the HUD: The Impact of Non-Diegetic Game Elements and Expertise on Player Involvement.* CHI PLAY '15, s. 13–22. DOI 10.1145/2793107.2793120. n = 9 a 24. https://eprints.whiterose.ac.uk/id/eprint/130581/1/Diegesis_and_immersion_final.pdf — **B**
14. **[Z14]** Peacocke, M., Teather, R. J., Carette, J. (2015). *Performance of HUDs and Diegetic Displays in FPS Games.* Graphics Interface 2015, poster; plná verze Peacocke, Teather, Carette, MacKenzie, IEEE GEM 2015, DOI 10.1109/GEM.2015.7377211. n = 10 (poster), n = 20 (GEM). https://www.csit.carleton.ca/~rteather/pdfs/GI2015_poster2.pdf ; plná verze https://www.csit.carleton.ca/~rteather/pdfs/GEM2015_HUDs.pdf — **B** (procenta z GEM ověřena plným textem 13. 10. 2026; strany se v citacích liší, 1–8 proti 138–145, neověřeno)
15. **[Z15]** Game Accessibility Guidelines, úplný seznam (Basic / Intermediate / Advanced). https://gameaccessibilityguidelines.com/full-list/ — **C**
16. **[Z16]** GAG: *Include interactive tutorials.* https://gameaccessibilityguidelines.com/include-interactive-tutorials/ — **C**
17. **[Z17]** GAG: *Do not make precise timing essential to gameplay…* (Advanced). https://gameaccessibilityguidelines.com/do-not-make-precise-timing-essential-to-gameplay-offer-alternatives-actions-that-can-be-carried-out-while-paused-or-a-skip-mechanism/ — **C**
18. **[Z18]** Microsoft. *Xbox Accessibility Guideline 101: Text display.* https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101 — **C**
19. **[Z19]** Microsoft. *XAG 102: Contrast.* https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102 — **C**
20. **[Z20]** Microsoft. *XAG 103: Additional channels for visual and audio cues.* https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103 — **C**
21. **[Z21]** Microsoft. *XAG 116 (časové limity v UI)* a *XAG 117 (vizuální rozptýlení a pohyb).* https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/116 ; https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117 — **C**
22. **[Z22]** W3C (2024). *Web Content Accessibility Guidelines (WCAG) 2.2.* W3C Recommendation, 12. 12. 2024. https://www.w3.org/TR/WCAG22/ — **C**
23. **[Z23]** W3C WAI. *Understanding SC 2.3.3: Animation from Interactions.* https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — **C**
24. **[Z24]** Apple. *Human Interface Guidelines: Typography; Accessibility* (stav 2026, načteno přes JSON stránky). https://developer.apple.com/design/human-interface-guidelines/typography ; https://developer.apple.com/design/human-interface-guidelines/accessibility — **C**
25. **[Z25]** Parhi, P., Karlson, A. K., Bederson, B. B. (2006). *Target Size Study for One-Handed Thumb Use on Small Touchscreen Devices.* MobileHCI 2006. DOI 10.1145/1152215.1152260. https://www.microsoft.com/en-us/research/?p=155150 ; PDF https://www.cs.umd.edu/~bederson/images/pubs_pdfs/p203-parhi.pdf — **B** (plný text ověřen 13. 10. 2026; n = 20, hodnocení sníženo z A kvůli malému vzorku a sjednoceno s blokem 06 [16])
26. **[Z26]** Bergstrom-Lehtovirta, J., Oulasvirta, A. (2014). *Modeling the Functional Area of the Thumb on Mobile Touchscreen Surfaces.* CHI 2014, s. 1991–2000. n = 20. https://www.bibsonomy.org/bibtex/11ef214641e9bca5a59e14e96ea949d8b — **A** ⚠ (abstrakt a metadata)
27. **[Z27]** Hoober, S. (2013). *How Do Users Really Hold Mobile Devices?* UXmatters, 18. 2. 2013. Observace, n = 1 333 / 780. https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php — **D** (systematická observace bez recenze; stránka otevřena 13. 10. 2026, čísla potvrzena)
28. **[Z28]** Prevalence poruch barvocitu: přehledový článek v PMC (2025), *A Global Perspective of Color Vision Deficiency: Awareness, Diagnosis, and Lived Experiences*, cituje Birch, J. (2012), *Worldwide prevalence of red-green color deficiency*, JOSA A 29(3), 313–320. https://pmc.ncbi.nlm.nih.gov/articles/PMC12385717/ — **B** ⚠ (Birch neotevřen)
29. **[Z29]** Ústav pro jazyk český AV ČR. *Internetová jazyková příručka:* „Členění čísel… a desetinná čísla“ (https://prirucka.ujc.cas.cz/?id=791) a „Značky, čísla a číslice“ (https://prirucka.ujc.cas.cz/?id=785) — **C**
30. **[Z30]** W3C Internationalization. *Text size in translation* (s daty IBM). https://www.w3.org/International/articles/article-text-size — **C/D**
31. **[Z31]** Vlastní kontrola: chování `Intl.NumberFormat` / `Intl.PluralRules` pro `cs` v Node (ICU), 13. 10. 2026. Výpočty kontrastu podle vzorce WCAG z barev v `style.css`. Rozměry canvasu z `index.html` / `style.css` / `src/*.js`. — interní ověření, ne externí zdroj

*Poznámka k ID:* v KB zábavnosti se používají S1–S4. Zde jsou použita Z1–Z31, aby se ID nepletla. Sloučení ID se provede v `kb/README.md`.

---

## Ověřovací kolo 13. 10. 2026

Ověřeno (fronta README §4: S25, S27; nízká: Peacocke GEM, Desurvire & Wiberg, Hoober):
- **[Z25] Parhi 2006 (S25, R6):** plný text. Doporučení 9,2 / 9,6 mm potvrzena, n = 20 praváků. Doplněna data o poloze na displeji (rohy nejhorší). Kvalita **A⚠ → B** kvůli malému vzorku, sjednoceno s blokem 06.
- **[Z14] Peacocke GEM 2015:** plný text. Procenta −35 % / −26 % / 70 % potvrzena. **Upřesněno:** jde o srovnání s nejhorší variantou HUD (ikony), ne s HUD obecně. Plná verze má n = 20, ne 10. Opraveno i v §1 bod 6.
- **[Z6] Kalyuga 2003 (S27):** jen bibliografie (Crossref). Plný text zůstává neotevřený, protože repozitář blokuje automatický přístup. Tvrzení stojí na [Z5] (plný text) a nově i na Raviv 2022 (blok 04).
- **[Z10] Desurvire & Wiberg 2009:** bibliografie a strany ověřeny (LNCS 5621, 557–566). Čísla 54 hráčů a 116 heuristik jen z abstraktu.
- **[Z27] Hoober 2013:** stránka otevřena, čísla potvrzena.
- **Rozsah ověření v úvodu (R20):** opraven. [Z25] tehdy nebyl ověřen plným textem, [Z27] byl stránkou ověřen.

Rozpory:
- **R-N2** (tlačítko „Poradit?“): blok 04 upravil N2 (bez trvalého tlačítka, nápověda ustupuje a vrací se po chybě). 07 N2 platí beze změny, oba bloky jsou teď v souladu.
- **R-N3** (číselná zpětná vazba): 07 N9 bod 2 je hlášení odchylky (KR), s upravenou 04 N1 je v souladu.

Věcně nic nepadlo. Oslabeno je jen tvrzení o výhodě diegetického čísla v [Z14] (srovnání s nejhorší variantou).

Neověřeno: plné texty [Z6], [Z10], [Z26], Birch 2012; Llanos & Jørgensen 2011 (jen citace v [Z14]); Fragoso; průmyslová data o odchodech v první minutě; Hodent, Linehan.
