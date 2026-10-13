# Vylepšení v Dílně (vertikální progrese) — návrhové karty

**Sepsáno 13. 10. 2026** podle zadání v `00-zadani.md`. Jde o návrhy k simulaci, ne o rozhodnutí. Úhel pohledu: Dílna, tedy trvalé úrovně, které mění čísla letu. Bonusy se sloty a kompromisy řeší jiný soubor.

**Podklady:** `src/config.js`, `core.js`, `events.js`, `throw.js` (verze 0.6.1), `simulation/monte-carlo.mjs` a `MONTE-CARLO.md`, KB bloky 02, 03 a 04 a rejstřík `research/kb/README.md`. Odkazy na KB píšu jako `03 N7` (blok 03, implikace N7) nebo `README P8` (průřezové zjištění P8). Štítky: **V** výzkum, **H** heuristika oboru, **N** naše hypotéza.

---

## 0. Co vyplývá z fyziky (vlastní sondy, kód se neměnil)

Spustil jsem pár sond: skript ve scratchpadu importoval `src/`, házel pasivně, tedy bez QTE, se silou 0,75 a vybíral nejlepší úhel z mřížky 5–40°. Čísla jsou orientační a slouží jen k nastřelení hodnot v kartách. Ověřit je musí Monte Carlo.

| Sonda (pasivní let, síla 0,75) | Výsledek | Důsledek pro návrh |
|---|---|---|
| Šipka / kluzák bez vylepšení | 177 / 177 m (let 13 / 20 s) | výchozí bod |
| +1 úroveň síly / papíru, šipka | 208 / 193 m | síla je pro šipku nejsilnější větev |
| Start o 4 m výš („Vyšší patro“ 1), šipka / kluzák | 190 / 199 m | jedna úroveň patra se rovná zhruba úrovni papíru |
| Patro 5 (start +20 m) při papíru 0 / 5, kluzák | +108 / +216 m | **patro a papír se násobí**, protože ve fázi klouzání platí dx/dy = klouzavost |
| Odpor −15 %/úr., úroveň 5, šipka se silou 0 / 5 | +9 / +47 m | odpor vzduchu je bez síly téměř bezcenný |
| Cestovní rychlost +1,5/úr., úroveň 3, šipka se silou 5 | +19 m | **cruise při klouzání neovlivní dolet**, jen délku letu (klesání = vx / klouzavost) |
| Přehyby 3 / 5 při síle 0,5 (slabý hráč), šipka | +22 / +37 m | odpuštění pomáhá hlavně slabému hráči |
| Kluzák se vším na 5 + patro 5 | 797 m, let **92 s** | délka letu v reálném čase je skryté riziko vyšších úrovní |

Z tabulky plynou tři pravidla pro celý návrh:
1. **Výška startu a klouzavost se násobí.** To je čitelná synergie: „každý metr výšky × klouzavost“.
2. **Odpor a cestovní rychlost jsou slabé páky.** Mění hlavně balistickou fázi letu. Jako samostatná větev by byly pastí, podobně jako dnešní přehyby.
3. **Klouzavé modely na vysokých úrovních letí přes minutu.** Každý návrh, který zvedá klouzavost nebo výšku, musí v simulaci hlásit i průměrnou délku letu.

## Společná kritéria pro Monte Carlo

Aby šly karty porovnat, navrhuji pro všechny stejná měřítka. Základ 0.6.1: průměrný hráč 23 hodů do 500 m, slabý 31, rovnoměrný nákup 28, přehyby napřed 46.
- **Tempo:** hody a minuty do 500 m (P10, P50, P90) podle profilu, softlock 0 %.
- **Žádná dominantní strategie:** nejrychlejší rozumná nákupní strategie nesmí být o víc než 15 % rychlejší než mediánová. Nejpomalejší rozumná nesmí být víc než 1,3× pomalejší než nejrychlejší (dnes 46 / 28 = 1,64).
- **Využití stromu:** podíl ceny dostupného stromu, který má hráč koupený v okamžiku cíle kapitoly. Cíl je ≥ 70 % (dnes asi 32–60 % celého stromu, `03 §2.2`).
- **Podíl zásluhy:** rozdíl doletu mezi profily „slabý“ a „expert“ při stejných úrovních, vyjádřený jako procento doletu. Vylepšení ho nemá stlačit pod dnešní hodnotu (`README P7`, `03 N8`).
- **Délka letu:** průměr a P90 sekund letu podle modelu a úrovně (sonda: kluzák na vysokých úrovních 60–90 s).

---

## Karty

### D01 — Náhled „S další úrovní doletíš sem“
- Typ: Systém
- Kde: Dílna
- Mechanika: U každé dostupné úrovně Dílna ukáže dva oblouky na miniatuře trasy: šedý pro „tvůj typický hod dnes“ a barevný pro „tentýž hod s touto úrovní“. Výpočet: vezme medián síly a úhlu z posledních 5 hodů aktuálního modelu (při méně hodech výchozí 0,75 a `bestAngle`). Pak spustí `createFlight` + `step` s `events=[]` pro současné `levels` a pro `levels` s +1 v dané větvi, stejně jako `bestAngle` v `core.js`. Zobrazí rozdíl v metrech a nejbližší hranici místa, kterou nový oblouk překročí („+31 m → přes hranici Tržnice“). U větví, jejichž účinek pasivní let nezachytí (Křidélka, Vyvážení), ukáže místo oblouku vlastní náhled (viz D03, D04). Text je vždy „odhad bez poryvů a holubů“.
- Úrovně a cena / podmínka odemčení: zdarma, od prvního otevření Dílny.
- Proč je hra zábavnější: Compton: volba musí být předvídatelná, hráč má tušit, co způsobí (`03 §2.5`, H). Progrese je „viditelná vzdálenost k cíli“ (`03 §2.4`, H). Blízké dílčí cíle v metrech fungují lépe než abstraktní procenta (`README P6`, V/N). Hráč také uvidí, že síla a papír se násobí, takže nemusí hádat, proč vyhrává rovnoměrný nákup.
- Pocit „chci a potřebuju“: „Padám 30 m před Tržnicí. Která koupě mě tam dostane?“ Hráč vidí předem a konkrétně, že s papírem 2 by jeho běžný hod přeletěl hranici místa. Touha je vázaná na jeho skutečný hod, ne na abstraktní +20 %.
- Rizika a etika: Odhad nesmí být nafouknutý. Počítá se z hráčova *mediánu*, ne z nejlepšího hodu, a bez QTE (spíš podhodnocuje). Nikdy neukazovat „skoro!“, jen čísla (`02 §4.3` body 3 a 10). Riziko „opisování“: náhled ukazuje účinek *koupě*, ne ideální úhel, takže nekoliduje s `04 N1`. Výpočet 36 úhlů × 2 lety při otevření Dílny je levný, stačí cache.
- Simulace: Nesimulovatelné jako prožitek, jen playtest (rozumí hráč, proč kupuje?). Do Monte Carla lze přidat nákupní strategii „náhled“: kup úroveň s největším ziskem metrů na minci podle stejného výpočtu. Hypotéza: strategie „náhled“ bude ±5 % od nejrychlejší strategie a o 10–20 % rychlejší než strategie „náhodně“. Pokud ano, náhled hráče dovede k dobré volbě bez návodu. Nárok: nová logika (nákupní strategie), funkce náhledu je čistá a testovatelná.
- Náročnost implementace: M

### D02 — Rozpis zásluhy ve výsledku: „Tvůj hod / tvoje vlaštovka“
- Typ: Systém
- Kde: Výsledek
- Mechanika: Po dopadu hra přepočítá dva kontrafaktuální pasivní lety se stejným seedem a úhlem: (a) s úrovněmi 0 a skutečnou silou, (b) se skutečnými úrovněmi a silou 0,75 bez QTE. Rozpis má tři řádky: „Vlaštovka (vylepšení): +X m“ = b − let s úrovněmi 0 a silou 0,75; „Tvůj výhoz (úhel a síla): ±Y m“ = skutečný pasivní let − b; „Poryvy a holubi: +Z m“ = skutečný dolet − skutečný pasivní let. Součet sedí na celkový dolet, zbytek z interakcí se přičte k řádku vylepšení. Volitelně se k řádku Vyvážení nebo Křidélek připíše „z toho Vyvážení ti vrátilo 14 m“ (D03).
- Úrovně a cena / podmínka odemčení: zdarma, od prvního hodu. Řádek vylepšení se objeví až po prvním nákupu.
- Proč je hra zábavnější: Přímo řeší „vertikální růst zakrývá zásluhu hráče“ (Fischer, Schreiber, `03 §2.4`, `03 N8`, H). Hráči chtějí cítit odpovědnost za výsledek (Juul, `04 §2.4`, V). Odpouštějící mechanika má být viditelná, ne skrytá (`04 N4`, N). Hráč launch her si jinak výsledek připíše „štěstí“ (`03 §2.1`, H). Opora je nepřímá, viz `README P7`: přímý experiment chybí.
- Pocit „chci a potřebuju“: „Byl to můj hod, nebo jen lepší papír?“ Rozpis to řekne a zároveň ukáže, *která* koupě se vyplatila. Potřeba dalšího nákupu tak vzniká z dat („holubi mi dávají jen 4 m → Křidélka“), ne z reklamy.
- Rizika a etika: Čísla musí být pravdivá a přepočítaná, ne odhadnutá. Nesmí zahltit výsledek: tři řádky a jedna věta, podrobnosti po klepnutí (`README R-N9`, let zůstává čistý). Záporné „Tvůj výhoz −20 m“ formulovat věcně, bez posměchu (`02 N10`).
- Simulace: Monte Carlo může rozpis spočítat pro každý hod a vypsat průměrné podíly podle profilu a fáze hry (prvních 5 hodů, kolem 250 m, kolem 500 m). Hypotéza: u průměrného hráče klesne podíl „tvůj výhoz + QTE“ z ~30–40 % v prvních hodech na ~10–15 % kolem 500 m. Pokud klesne pod 10 %, je to signál, že vylepšení přebíjejí dovednost, a argument pro D12 a D18. Nárok: nová logika (dva přepočty letu na hod, čisté funkce).
- Náročnost implementace: M

### D03 — Přehyby se mění na „Vyvážení“: jedna věc, odpuštění síly
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Dnešní větev `fold` se rozdělí. Vyvážení dál mění jen `steady`: +0,15 za úroveň, tedy účinná síla = síla + (1 − síla) · steady (stejný vzorec jako dnes v `createFlight`). Okna a účinek QTE odcházejí do D04. Nově je účinek vidět: ukazatel síly při míření má za skutečnou náplní druhou, průhlednou náplň „s vyvážením“. Hráč tak při každém nabití vidí, kolik mu větev vrací. V Dílně náhled ukáže „tvůj průměrný výhoz 58 % → s Vyvážením 2 počítán jako 71 %“ a přepočet na metry jako v D01.
- Úrovně a cena / podmínka odemčení: 5 úrovní, cenová křivka „podpůrná“ (D13): 20 / 60 / 110 / 170 / 240 = 600 mincí. Varianta B pro simulaci: steady +0,2 za úroveň se stropem 0,8.
- Proč je hra zábavnější: Řeší `README P8` a `03 N7`: dnes přehyby mění tři neviditelné věci a stojí 46 hodů proti 28. Princip „každá větev mění jednu čitelnou věc“ (komentář v `config.js`). Je to transparentní, hráčem zvolená pomoc, ne skrytá DDA (`04 N5`, Celeste Assist, `04 §2.4`, H). Sonda: pro slabého hráče (síla 0,5) dá Vyvážení 3 +22 m, pro průměrného jen +11 m. Volba je tedy situační, což je podle Comptona znak smysluplné volby (`03 §2.5`, H).
- Pocit „chci a potřebuju“: „Pořád mi ujede síla a hod je slabý.“ Hráč, kterému se nedaří trefit horní pásmo, vidí na vlastním ukazateli, že s Vyvážením by jeho typický výhoz padl do „Silného hodu“. Kdo sílu trefuje, vidí malý rozdíl a větev oprávněně odloží.
- Rizika a etika: Odpuštění snižuje váhu dovednosti. Proto strop 0,75 (dnes) nebo 0,8 (varianta B), nikdy 1. A proto D02 ukazuje, kolik metrů přidalo Vyvážení. Ukazatel síly už sám odpouští ±198 ms (`README P8`), takže hráči, kteří trefují, větev nepotřebují. To je v pořádku, nemá být povinná.
- Simulace: Hypotéza: s podpůrnými cenami a bez QTE složek klesne strategie „Vyvážení napřed“ u průměrného hráče ze 46 na ≤ 34 hodů (≤ 1,3× nejrychlejší strategie). U slabého hráče bude Vyvážení napřed do 10 % od nejrychlejší strategie, protože síla ~N(0,5; 0,12) je přesně profil, kterému větev pomáhá. Nárok: jen parametr (přejmenovaná větev, `steady` beze změny vzorce, `window` a `qte` přesunuté do nové větve). Je nutné rozšířit `BR` a `shop()` o novou větev.
- Náročnost implementace: S (logika), M (vizuál ukazatele)

### D04 — Křidélka: holub a poryv mi neutečou
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Nová větev z druhé poloviny dnešních přehybů. `window = 1 + 0,08 · úroveň` (poloviční šířky oken v `windows(f)`) a `qte = model.qte · (1 + 0,15 · úroveň)` (síla poryvu a délka nesení holubem v `resolve`). Dvě pole, ale jedna čitelná věc: „události ti víc vyjdou a víc dají“. V Dílně se náhled ukáže přímo na časovacím kruhu: zelená výseč „úspěch“ se viditelně rozšíří. Pod ním je pravdivý přepočet z vlastních dat: „Z tvých posledních 6 událostí by s Křidélky 2 vyšla navíc 1 (holub, puštěno o 0,04 s pozdě).“ Počítá se z uložených odchylek (viz D16).
- Úrovně a cena / podmínka odemčení: 5 úrovní, podpůrná křivka 20 / 60 / 110 / 170 / 240 = 600 mincí. Okno na úrovni 5 = 1,4× (gust success ±0,39 s z pruhu 1,2 s). Dál ne, jinak by okno pokrylo skoro celý pruh.
- Proč je hra zábavnější: Události jsou místo, kde se hráč cítí jako hráč. Větev zesiluje odměnu za zásah, takže je spíš zesilovač dovednosti než náhrada (`README P1`: zpětná vazba vázaná na výkon, V). Nezužovat okna jako obtížnost, spíš je kupovatelně rozšiřovat (`04 N6`, `04 N10`). Rozdělení plní princip jedné čitelné věci.
- Pocit „chci a potřebuju“: „Holub mi zase utekl.“ Hráč vidí na vlastních minutých událostech, které by s další úrovní vyšly. Expert, který trefuje perfektně, vidí hlavně „účinek +15 %“ a kupuje kvůli síle poryvu. Slabší hráč kupuje kvůli oknu.
- Rizika a etika: Přepočet „vyšla by navíc 1“ musí být pravdivý (skutečná odchylka proti novému oknu), nikdy vymyšlený near-miss (`02 §4.3` bod 3, `04 N8`). Širší okno snižuje tlak na memorování jen částečně. Variabilní střed QTE (`README P9`) je samostatné téma a Křidélka ho nenahrazují. Pozor na součet s ±198 ms tolerance ukazatele: to se týká síly, ne QTE, takže tu se tolerance nesčítají.
- Simulace: Monte Carlo už QTE simuluje šumem časování, takže efekt je přímo měřitelný. Hypotéza: Křidélka 5 přidají průměrnému hráči +8–14 % doletu (dnes přehyby 5 +12 %, tabulka marginálního vlivu), slabému +12–20 %, expertovi +6–10 %. Strategie „Křidélka napřed“ nebude o víc než 1,3× pomalejší než nejrychlejší. Zároveň změřit úspěšnost QTE podle úrovně: u slabého hráče na úrovni 0 vs. 5, cílové pásmo 70–90 % (`04 N6`). Nárok: jen parametr (nová větev s `window` a `qte`).
- Náročnost implementace: S

### D05 — Vyšší patro (výškový start)
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Nové pole `height` v `parameters()`: výška startu `y = 12 + 4 · úroveň` (dnes pevně 12 v `createFlight`). Diegeticky: házíš z vyššího okna dílny, potom ze střechy, potom z antény. Scéna startu se o patro zvedne a hráč to vidí při každém hodu. Sonda: +13 m za úroveň u šipky a +22 m u kluzáku bez papíru. S papírem 5 je to +25 m u šipky a +43 m u kluzáku (patro × klouzavost).
- Úrovně a cena / podmínka odemčení: 5 úrovní, podpůrná křivka 20 / 60 / 110 / 170 / 240 = 600 mincí. Odemkne se spolu s kluzákem po 100 m („z dílny ses dostal na střechu“), aby první minuty zůstaly jednoduché (`07`, `README P14`).
- Proč je hra zábavnější: Je to nejčitelnější možná synergie: „výška × klouzavost“. Hráč ji pochopí bez čísel, protože vidí vyšší start i delší klouzání. Dává kluzáku důvod existovat (kluzák z patra těží o 70 % víc než šipka), takže se role modelů rozcházejí (`03 §2.4`: žánr zpestřuje vertikální růst díly s jiným chováním, H). Diegetická progrese posiluje svět (blok 08, environmentální vyprávění).
- Pocit „chci a potřebuju“: „Kluzák je pomalý a v půlce letu nemá z čeho klouzat.“ Náhled (D01) ukáže dvě dráhy z různých výšek a rozdíl v metrech. Na scéně je navíc vidět, že další patro je fyzicky nad tebou.
- Rizika a etika: Zvyšuje délku letu (sonda: kluzák s papírem 5 a patrem 5 letí ~80 s). Spolu s papírem může zrychlit progresi tolik, že 500 m padne dřív, než se hráč naučí úhel. Proto podpůrné ceny a odemčení až po 100 m. Úroveň 5 nesmí vizuálně „utéct“ z kamery: canvas 360 px, 32 m start se vejde, ověřit v `render.view`.
- Simulace: Hypotéza: přidání větve sníží hody do 500 m u průměrného hráče o 2–4 (z 23 na 19–21) a nezmění softlock. Strategie „patro + papír“ bude u kluzáku nejrychlejší, ale do 15 % od rovnoměrné (žádná dominance), protože patro bez papíru i papír bez patra jsou slabší. Měřit délku letu: P90 pod 60 s do 500 m. Nárok: nový parametr `height`, tedy jedna řádka v `createFlight` (`y:12+p.height`), plus větev v `BR` a `shop()`.
- Náročnost implementace: S (logika), M (scéna startu po patrech)

### D06 — Aerodynamika nosu (odpor vzduchu)
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: `drag = model.drag · (1 − 0,15 · úroveň)`. Vlaštovka déle drží rychlost výhozu, než spadne na cestovní rychlost (`integrate` v `core.js`). Sonda ukázala, že bez síly je efekt skoro nulový (+2 m za úroveň). Se silou 5 dává u šipky +9 m za úroveň, u kluzáku +3 m. Návrh proto větev **nedává jako samostatnou**, ale jako **synergii se silou**. Na úrovních 3 a 5 Síly se v Dílně odemkne „Aerodynamika“ se 3 úrovněmi (−15 % odporu za úroveň). Náhled ji ukazuje jako delší rovný úsek dráhy, než se oblouk zlomí.
- Úrovně a cena / podmínka odemčení: 3 úrovně po 90 / 150 / 220 = 460 mincí. První úroveň se odemkne při Síle 3, další dvě při Síle 5. Varianta pro simulaci: úplně vyřadit, pokud zisk vyjde < 10 m za úroveň.
- Proč je hra zábavnější: Žánrový předobraz je „odpor vzduchu“ v Learn to Fly (`03 §2.1`, H). Hlubší úroveň pro hráče, který se specializuje na sílu, dává specializaci odměnu, místo aby byla jen pomalejší (`03 §2.2`: multiplikátory dočasně posouvají prioritu, Pecorella, H).
- Pocit „chci a potřebuju“: „Hodím obrovskou silou, ale šipka se po chvíli zlomí a padá.“ Problém má jen hráč se silnou šipkou, tedy právě ten, komu se větev odemkne. Náhled ukáže rovnější a delší první úsek.
- Rizika a etika: Je to slabá páka. Jako samostatná větev by byla další past jako dnešní přehyby (`03 N7`). Proto odemčení až se silou a malá cena. Pokud simulace potvrdí slabý efekt, vyřadit. Cestovní rychlost (`cruise`) jako větev **nedoporučuji**: při klouzání nemění dolet, jen délku letu (sonda: +19 m za 3 úrovně se silou 5).
- Simulace: Hypotéza: Aerodynamika 3 přidá šipce se Silou 5 +20–30 m (4–7 %), kluzáku < 10 m. Strategie „síla napřed“ se zrychlí o 0–2 hody a nestane se dominantní. Pokud se zrychlí o víc než 15 % proti rovnoměrné, snížit na −10 % za úroveň. Nárok: jen parametr (`drag`) a podmínka odemčení v `buy()`.
- Náročnost implementace: S

### D07 — Výbava modelu: zatížená špička (Šipka) a prodloužená křídla (Kluzák)
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Každý model má vlastní malou větev, která platí jen pro něj. Sdílený strom zůstává. **Šipka — Zatížená špička:** `speed × (1 + 0,08 · úroveň)`, násobí se se Silou. **Kluzák — Prodloužená křídla:** `glide × (1 + 0,10 · úroveň)`, násobí se s Papírem a Patrem. Uložit jako `levels.dartKit` a `levels.gliderKit`, `parameters(model, levels)` použije jen tu svou. V Dílně jsou karty pod obrázkem modelu, ne ve sdíleném stromu.
- Úrovně a cena / podmínka odemčení: 3 úrovně, 60 / 140 / 240 = 440 mincí za model. Šipka od 250 m, Kluzák od 250 m (po 100 m odemčení a prvních hodech). V návrhu struktury jsou až v kapitole 2, v simulaci otestovat obě varianty.
- Proč je hra zábavnější: Volba „který model je můj“ dostane váhu. Dnes simulace ukazuje, že „lepší model“ je prostě kluzák (918 proti 731 m se vším na 5). Výbava modelu umožní hráči šipky šipku dotáhnout a role se prohloubí místo sjednocení (`03 §2.4`, horizontální zpestření vertikální osy, H). Vztah ke kritériím smysluplné volby: důsledek je jasný a trvalý (`03 §2.5`).
- Pocit „chci a potřebuju“: „Mám rád šipku, ale kluzák s ní vždycky vyhraje.“ Náhled ukáže oblouk šipky s výbavou proti posledním hodům kluzáku. Hráč vidí, zda jeho oblíbený model dožene ten druhý.
- Rizika a etika: Rozmělnění: mince do výbavy jednoho modelu nepomohou druhému, takže hráč, který model střídá, se může cítit potrestaný. Náhled proto vždy ukazuje i druhý model. Šipka má výbavu silnější (8 % rychlosti zhruba odpovídá 2/3 úrovně Síly), protože kluzák je dnes výchozím vítězem.
- Simulace: Hypotéza: s výbavou se rozdíl hodů do 500 m mezi modelovými strategiemi „šipka“ a „kluzák“ zmenší ze současného rozdílu na ≤ 10 %. Podíl hodů kluzákem u strategie „lepší“ se přiblíží 50–65 % místo převahy kluzáku. Zároveň se nezvýší celkový počet hodů do 500 m o víc než 1, protože mince jdou do výbavy místo sdíleného stromu. Nárok: nová logika (větve podle modelu v `parameters`, `buy`, `shop`, migrace savu v4).
- Náročnost implementace: M

### D08 — Nový model: Sokol (pro hráče, kteří trefují události)
- Typ: Odemčení
- Kde: Dílna
- Mechanika: Nový záznam v `MODELS`: `sokol:{speed:14, glide:3.4, drag:.12, cruise:9, ideal:34, qte:1.5}`. Pasivně je slabší než kluzák (sonda bez QTE: 164 proti 177 m), ale z poryvů a holubů těží nejvíc (bot s úspěšností 95 %: 244 proti 225 m u kluzáku, na úrovni 3 531 proti 496 m). Strmý ideální úhel 34° dává jiný pocit hodu („vyhoď vysoko a chytej vítr“). Sdílí strom a Křidélka na něm mají největší účinek.
- Úrovně a cena / podmínka odemčení: Odemkne se dosažením místa „Zahrady na okraji“ (~610 m, první místo za cílem 500 m). Zdarma, zásluhou letu.
- Proč je hra zábavnější: Dává cíl po 500 m, který je *blízký* a konkrétní (Loewenstein, `03 N1`, `README P3`, V). Model je horizontální obsah (nové chování), ne další číslo (`03 §2.4`, Fischer, H). Odměňuje dovednost (QTE), takže zásluha hráče roste (`README P7`).
- Pocit „chci a potřebuju“: „Trefuju holuby skoro vždycky, ale kluzák z toho skoro nic nemá.“ Výsledková obrazovka po 500 m ukáže siluetu Sokola u Zahrad s větou „Sokol víc vytěží z poryvů a holubů“. V Dílně je jeho náhled počítaný s hráčovou skutečnou úspěšností QTE (D16), ne s ideální.
- Rizika a etika: Model nesmí být obecně lepší, jinak strom přestane mít volbu (sonda „sokolA“ se speed 15 a glide 3,6 byl silnější ve všem, proto slabší varianta B). Pro slabé hráče má být Sokol horší než kluzák, a to UI musí říct pravdivě. Odemčení dosažením místa je pravdivé, žádný „dar“ (`03 N4`).
- Simulace: Hypotéza: s profilem expert je Sokol na stejných úrovních o 5–12 % lepší než kluzák, se slabým profilem o 5–15 % horší. Strategie „lepší model“ u experta zvolí Sokola v ≥ 60 % hodů, u slabého hráče v ≤ 30 %. Měřit délku letu (sonda: 53 s na úrovni 5). Nárok: jen parametr (nový model) a rozšíření `chooseModel` a podmínky odemčení v simulaci, která dnes končí na 500 m. Kampaň je nutné prodloužit za 500 m (viz D15).
- Náročnost implementace: M (model + vlastní kresba letadla)

### D09 — Nový model: Albatros (klidný plachtař pro vysoké starty)
- Typ: Odemčení
- Kde: Dílna
- Mechanika: `albatros:{speed:10, glide:7.0, drag:.08, cruise:8, ideal:32, qte:.7}`. Bez vylepšení je stejně dobrý jako kluzák (sonda 176 proti 177 m). S Patrem a Papírem je nejlepší (síla 3, papír 5, patro 5: 736 proti 675 m kluzáku, +9 %). Z událostí těží nejméně. Role: hráč, který chce klidný dlouhý let a staví na výšce a papíru.
- Úrovně a cena / podmínka odemčení: Odemkne se dosažením místa „Železnice k řece“ (~914 m). Zdarma.
- Proč je hra zábavnější: Třetí rozdílná role (rychlá šipka, QTE Sokol, výškový Albatros) dělá z nákupů ve stromu skutečnou stavbu sestavy. Patro a papír mají u Albatrosa smysl, síla méně. To vytváří situační priority, které Pecorella doporučuje proti dominantní strategii (`03 §2.2`, H). Pro hráče s horším časováním (motorika, latence zařízení, `README P15`) je to legitimní cesta, kde QTE nerozhoduje.
- Pocit „chci a potřebuju“: „Události mi nejdou, ale rád stavím vlaštovku, co doletí sama.“ Náhled v Dílně ukáže Albatrosa s hráčovým Patrem a Papírem proti jeho nejlepšímu modelu.
- Rizika a etika: **Délka letu.** Sonda: 89–99 s na vysokých úrovních. Bez zrychlení klouzavé fáze (otázka pro uživatele) hrozí nuda a delší sezení bez herního rozhodnutí. Albatros snižuje roli dovednosti (qte 0,7), proto ho D02 musí ukazovat poctivě a nesmí být nejlepší pro všechny.
- Simulace: Hypotéza: Albatros je s Patrem ≥ 3 a Papírem ≥ 4 o 5–10 % lepší než kluzák, jinak horší. Strategie „lepší model“ ho volí hlavně u slabého a průměrného hráče s vysokým Patrem. Měřit sekundy letu na hod: pokud P50 přesáhne 60 s, Albatros neschvalovat bez zrychlení klouzání. Nárok: jen parametr (nový model) a prodloužená kampaň.
- Náročnost implementace: M

### D10 — Stabilizátor: vítr mě nesrazí
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Podmínka: hra zavede vítr (dnes `wind={x:0,y:0}`, `04 N10` navrhuje malý rozptyl). Stabilizátor tlumí jen **nepříznivou** složku: `wind.x` při protivětru a `wind.y` při sestupném proudu se násobí `(1 − 0,15 · úroveň)`, příznivý vítr zůstává celý. Implementace: v `createFlight` uložit `f.wind` už upravený podle `p.stab`. Před hodem hra vítr ukazuje (šipka a síla), Dílna ukáže „při protivětru 2 m/s by tvůj hod ztratil 34 m, se Stabilizátorem 2 jen 24 m“.
- Úrovně a cena / podmínka odemčení: 3 úrovně, 60 / 120 / 200 = 380 mincí. Odemkne se s prvním hodem s nenulovým větrem (návrh: vítr od čtvrti Měsíční doky, tedy od ~1 219 m, nebo od 500 m).
- Proč je hra zábavnější: Vítr je nová podmínka místo užších oken (`04 N10`, „starting small“, Raviv `04 §2.11`, V). Stabilizátor je přímá odpověď na nový problém, takže strom roste spolu s výzvou (Schreiber: hra má „těžknout“, `03 §2.4`, H). Asymetrie (tlumí jen škodu) je čitelná: „vítr mi už tolik neuškodí“.
- Pocit „chci a potřebuju“: „Protivítr mě srazil o celé místo.“ Výsledek ukáže pravdivou ztrátu z větru (kontrafaktuál bez větru, jako v D02) a Dílna ukáže, kolik by z ní Stabilizátor vrátil.
- Rizika a etika: Vítr musí být viditelný před hodem a hráč na něj musí umět reagovat úhlem, jinak je náhoda příčinou a ne podmínkou (`04 §2.7`). Nápověda úhlu (`angleHint`, `bestAngle`) musí vítr zohlednit, jinak bude lhát (`04 N10`). Vítr nesmí být nikdy laděný podle toho, jak blízko je hráč milníku (vyrobený near-miss, `02 §4.3` bod 3). Seed větru jen podle čísla hodu.
- Simulace: Nejdřív simulovat samotný vítr: rozptyl `wind.x ~ U(−2, 2)` m/s, `wind.y ~ U(−0,3, 0,3)`. Hypotéza: vítr zvýší rozptyl doletu o 10–20 % a hody do cíle o 1–3. Stabilizátor 3 vrátí 40–50 % ztráty v protivětru a průměrný dolet zvedne o 3–6 %. Nárok: nová logika (generátor větru podle seedu, simulátor dnes posílá nulový vítr).
- Náročnost implementace: M (s větrem L)

### D11 — Nový model: Střela (na protivítr a rychlé hody)
- Typ: Odemčení
- Kde: Dílna
- Mechanika: `strela:{speed:24, glide:2.4, drag:.10, cruise:14, ideal:12, qte:.9, windK:.5}`. Nové pole `windK` násobí vliv větru na model (vzduch se počítá s `wind × windK`). Plochý ideální úhel 12° (jiný pohyb ruky). Krátký let: sonda 10–28 s proti 20–92 s kluzáku. Bez větru je mírně pod šipkou (Patro a Papír jí moc nepomáhají), v protivětru výrazně nad ní.
- Úrovně a cena / podmínka odemčení: Odemkne se spolu se zavedením větru (D10), doporučení: první hod v protivětru silnějším než 1,5 m/s. Zdarma.
- Proč je hra zábavnější: Model jako odpověď na podmínku dává hráči volbu *před* hodem: „dnes fouká proti, beru Střelu“. To je situační, předvídatelná volba podle Comptona (`03 §2.5`). Krátké lety jsou i přirozenou volbou pro hráče, kterého dlouhé klouzání nudí (`README P14`).
- Pocit „chci a potřebuju“: „V protivětru můj kluzák skoro stojí.“ Pravdivý údaj o ztrátě z větru (D10) a náhled Střely ve stejném větru.
- Rizika a etika: Bez větru je zbytečná, proto neodemykat dřív. Nesmí se stát nejlepší pro všechno: sonda s `speed:26, glide:2.6` byla bez větru lepší než šipka, proto slabší hodnoty.
- Simulace: Hypotéza: ve větru U(−2, 2) bude Střela nejlepší volbou v protivětru silnějším než ~1,2 m/s a horší jinde. Strategie „model podle větru“ zrychlí kampaň za 500 m o 5–10 % proti „vždy kluzák“. Nárok: nová logika (vítr, `windK`, volba modelu podle větru v `chooseModel`).
- Náročnost implementace: M

### D12 — Mistrovské přehyby na 5. úrovni (zesilovače dovednosti)
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Dosažení 5. úrovně v jádrové větvi odemkne jeden pasivní „mistrovský“ efekt, který působí **jen při dobře provedené akci**. **Síla 5 — Švih:** hod s nabitím ≥ 0,93 („Perfektní síla“ v `throwSettings`) má rychlost × 1,08. **Papír 5 — Vztlak:** perfektní zásah poryvu nebo holuba má účinek × 1,3 (násobí `HELP.perfect`, `HELP.birdPerfect`). **Patro 5 — Rozběh po střeše** (volitelně): perfektní síla navíc přidá +2 m výšky startu. Ve výsledku se objeví samostatný řádek „Švih: +18 m“.
- Úrovně a cena / podmínka odemčení: Bez vlastní ceny, je součástí 5. úrovně dané větve (420 mincí za Sílu a Papír, 240 za Patro). Vidět v Dílně už od 3. úrovně jako šedý cíl s popisem.
- Proč je hra zábavnější: Proti „vertikální růst zakrývá zásluhu“ (`03 N8`, `README P7`): vylepšení na vrcholu větve dovednost nenahrazuje, ale zesiluje. Odměna je vázaná na výkon (`README P1`, Kao 2024, V). Prahové bonusy posouvají prioritu mezi větvemi a narušují dominanci rovnoměrného nákupu (Pecorella, multiplikátory na prazích, `03 §2.2`, H).
- Pocit „chci a potřebuju“: „Trefuju perfektní sílu, ale hra mi za to nic navíc nedá.“ V Dílně je u Síly 4 vidět šedý Švih a přepočet z vlastních dat: „Z posledních 10 hodů jsi měl 4 perfektní. Se Švihem by daly průměrně +16 m.“
- Rizika a etika: Zvyšuje rozdíl mezi expertem a slabým hráčem. To je záměr, ale slabý hráč nesmí 5. úroveň vnímat jako zbytečnou. Základní efekt úrovně platí pro všechny a mistrovský efekt je navíc. Práh 0,93 je viditelný na ukazateli („Perfektní síla“ už v UI je), žádná skrytá podmínka.
- Simulace: Hypotéza: Švih přidá expertovi (μ 0,95, σ 0,04, perfektní síla v ~70 % hodů) +4–6 % doletu, slabému (μ 0,5) skoro nic. Rozdíl expert × slabý na úrovni 5 se zvětší o 3–6 procentních bodů (měřítko zásluhy). Strategie „síla napřed“ se u experta zrychlí o 1–3 hody a nepřekročí hranici dominance 15 %. Nárok: jen parametr a podmínka (charge ≥ 0,93 je v simulátoru dostupná jako `charge`, perfektní QTE jako `result`).
- Náročnost implementace: S

### D13 — Cenové křivky podle role větve (varianty pro simulaci)
- Typ: Systém
- Kde: Dílna
- Mechanika: Ceny nejsou jedna společná řada `PRICES`, ale řada podle role větve (`PRICES[role][level]`). Čtyři varianty k porovnání:
  - **V0 (dnes):** všechny větve 35 / 105 / 195 / 300 / 420.
  - **V1 jádro + podpora:** Síla, Papír 35 / 105 / 195 / 300 / 420 (1 055). Vyvážení, Křidélka, Patro 20 / 60 / 110 / 170 / 240 (600). Výbava modelu 60 / 140 / 240. Aerodynamika 90 / 150 / 220. Stabilizátor 60 / 120 / 200.
  - **V2 globální index:** cena další úrovně v *libovolné* větvi = 30 · 1,12^n, kde n je počet už koupených úrovní celkem (1. nákup 30, 10. nákup 83, 15. nákup 147, 25. nákup 459). Specializace pak není dražší než rovnoměrný nákup a pořadí rozhoduje jen účinek.
  - **V3 levné ochutnání:** jako V1, ale 1. úroveň každé větve stojí 15 mincí, aby hráč vyzkoušel všechno brzy.
- Úrovně a cena / podmínka odemčení: Viz varianty. Celková cena stromu kapitoly 1 (do 500 m, D18) ve V1: 1 240 mincí.
- Proč je hra zábavnější: Ceny mají smysl jen relativně k příjmu a k účinku (Schreiber, `03 §2.2`, H). Dnes stojí přehyby stejně jako síla, ale dávají 10× méně metrů, a to je hlavní zdroj pasti 46 proti 28 (`03 §2.5`). Rané úrovně mají přijít rychle a pozdější pomaleji (Schreiber, `03 N9`).
- Pocit „chci a potřebuju“: Nepřímý: podpůrné větve jsou levné, takže „zkusím, jestli mi Křidélka pomůžou“ nestojí čtyři hody. U V3 se hráč dostane ke všem větvím do 3–4 hodů.
- Rizika a etika: Žádná skrytá sleva ani časový tlak („sleva jen teď“, `02 §4.3` bod 7). Ceny jsou pevné a vidět předem. V2 je pro hráče méně čitelná (cena se mění u všech větví po každém nákupu), proto ji v UI musí doprovodit věta „každá koupě zdraží další o 12 %“.
- Simulace: Spustit faktoriál strategií (jako `FACTORIAL` v `monte-carlo.mjs`) pro V0–V3. Hypotézy: V1 sníží poměr nejpomalejší / nejrychlejší rozumná strategie z 1,64 na ≤ 1,3 a hody do 500 m se nezmění o víc než ±2. V2 sníží poměr na ≤ 1,15, ale prodlouží kampaň o 2–4 hody, protože pozdní nákupy zdraží. V3 zkrátí čas do prvního nákupu všech větví na ≤ 5 hodů, a přitom nezkrátí kampaň o víc než 1 hod. Nárok: jen parametr (ceny podle větve, `buy()` dnes bere `PRICES[level-1]`).
- Náročnost implementace: S

### D14 — Přestavba vlaštovky (vrácení úrovní)
- Typ: Systém
- Kde: Dílna
- Mechanika: Tlačítko „Rozložit a složit znovu“: vrátí všechny koupené úrovně (kromě odemčených modelů) a 100 % utracených mincí. Hráč pak nakoupí znovu. Dostupné jen v Dílně mezi hody, bez omezení počtu. Varianta pro test: vrácení jednotlivé poslední úrovně ve větvi.
- Úrovně a cena / podmínka odemčení: Zdarma, od 3. nákupu (dřív nemá smysl).
- Proč je hra zábavnější: Ruší past špatného pořadí, ať už jde o přehyby napřed (46 hodů) nebo cokoli jiného (`03 N7`, `README P8`). Hráč může experimentovat bez trestu za chybu. Juul: kasuální hráče neodrazuje selhání, ale ztráta postupu (`04 §2.4`, V). Learn 2 Fly chválí recenze za možnost zkoušet sestavy (`03 §2.5`, H). Vytváří skutečný důvod zkoušet nové modely (D08, D09, D11) se sestavou šitou na ně.
- Pocit „chci a potřebuju“: „Koupil jsem přehyby, a teď vidím, že mi nic nedávají. To je škoda mincí.“ Místo lítosti má hráč cestu ven. V náhledu (D01) může nejdřív porovnat „moje současná sestava“ proti „stejná cena rozdělená jinak“.
- Rizika a etika: Snižuje váhu jednotlivých rozhodnutí. Pokud je přestavba volná, optimální hráč si sestavu přeskládá před každým hodem, což je tření a ne volba. Proto ji nabízet jen v Dílně a ne na obrazovce míření. Žádné poplatky, které by z ní dělaly „pay to fix“ (`02 §2.8`).
- Simulace: Přidat strategii „přehyby napřed + přestavba po 250 m na rovnoměrně“. Hypotéza: past 46 hodů klesne na ≤ 30 (jen o 2 hody pomalejší než rovnoměrně), protože ztracený čas je jen doba před přestavbou. U ostatních strategií se nic nezmění. Nárok: nová logika (strategie s přestavbou, `fresh().levels` + vrácení mincí, čisté).
- Náročnost implementace: S

### D15 — Mistrovské úrovně 6–7 a druhá kapitola trasy
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Po dosažení 500 m (`p.completed`) se jádrovým větvím (Síla, Papír) a Patru otevřou úrovně 6 a 7 se stejným účinkem za úroveň (síla +12 %, papír +20 %, patro +4 m). Zbylé větve končí na 5. Kapitola 2 má cíl **914 m** (Železnice k řece), kapitola 3 **1 219 m** (konec Fialového předměstí, hranice čtvrti v `scenes.js`). Po konci čtvrti strom končí a hra to řekne. Sonda: šipka a kluzák se silou a papírem 7 dolétnou pasivně 744 a 844 m. S Patrem a QTE je 1 219 m dosažitelných.
- Úrovně a cena / podmínka odemčení: Síla a Papír 6–7: 520 / 640 (1 160 za větev). Patro 6–7: 300 / 370 (670). Celkem 2 990 mincí. Odemčení: dosažení 500 m pro úroveň 6, 914 m pro úroveň 7.
- Proč je hra zábavnější: Dnes mince po 500 m nemají využití a většina stromu zůstane nevyužitá (`03 N2`, `README P5`). Strom má pokračovat po kapitolách s blízkým cílem (`03 N1`, `03 N3`: poměrový rytmus 500 → 914 → 1 219 m, poměry 1,8 a 1,3) a obdarovaným pokrokem, který je pravdivý (500 z 1 219 m už uletěno, `03 N4`). Strop zabrání tomu, aby hráč „utekl křivce“ (`03 N9`).
- Pocit „chci a potřebuju“: „Doletěl jsem do 500 m. Co dál? Vidím, že Zahrady a Železnice jsou kousek.“ Oslava a konec kapitoly 1 přijdou nejdřív, potom jeden blízký cíl s náhledem: „S Papírem 6 by tvůj typický hod přeletěl Zahrady“ (D01).
- Rizika a etika: Riziko nekonečného sinku jen kvůli retenci (`02 N6`). Proto konečný strop (7) a pevný konec u hranice čtvrti, bez dalších úrovní „navždy“. Pokračování nabízet neutrálně, s možností spokojeně skončit (`02 §2.7`, kritéria 4 a 5). Měřit lítost („Hrál/a jsi déle, než jsi chtěl/a?“, `02 §4.4`). Délka letu na vysokých úrovních (D09) platí i tady.
- Simulace: Rozšířit kampaň o kapitoly 2 a 3 (cíle 914 a 1 219 m, `UNLOCK` modelů podle míst). Hypotéza: 500 → 914 m za 12–20 hodů a 914 → 1 219 m za 12–20 hodů u průměrného hráče, bez softlocku. Mezera mezi nákupy ≤ 5 hodů (`02 N5`). Při cíli 1 219 m má hráč koupeno ≥ 70 % stromu kapitol 2–3. Mince na konci bez využití ≤ 300. Nárok: nová logika (prodloužená kampaň s více cíli, strop úrovní podle kapitoly).
- Náročnost implementace: M

### D16 — Diagnóza z posledních hodů (proč a co koupit)
- Typ: Systém
- Kde: Dílna
- Mechanika: Hra si u posledních 10 hodů pamatuje nabití síly, úhel proti `bestAngle`, a u každé události její odchylku od středu okna (`delta`, dnes se počítá v `grade` a zahazuje). Dílna nahoře zobrazí jeden řádek s nejsilnějším zjištěním a větví, která ho řeší, přepočteným pravdivě:
  - průměrná síla < 0,7 → „Tvůj výhoz je v průměru 58 %. Vyvážení 2 ti vrátí ~14 m.“
  - ≥ 2 minuté události s odchylkou do 1,1× okna → „2 z posledních 6 událostí jsi minul těsně. Křidélka 1 by je zachránila.“
  - úhel mimo ±3° v ≥ 50 % hodů → žádný nákup, ale „Zkus úhel, víc ti dá úhel než koupě“ (úhel rozhoduje zhruba dvojnásobně, `03 N8`).
  - jinak → nejlepší poměr metrů na minci podle D01.
- Úrovně a cena / podmínka odemčení: Zdarma, od 5. hodu (dřív málo dat).
- Proč je hra zábavnější: Dělá z podpůrných větví situačně nejlepší volbu, což je podmínka smysluplnosti (`03 N7`, Compton). KR o odchylce místo předpisu (`04 N1`, St. Germain 2023, V). Selhání nese jednu srozumitelnou příčinu (`04 N7`). Doporučení „úhel, ne koupě“ chrání zásluhu hráče: hra přizná, když problém není v papíru.
- Pocit „chci a potřebuju“: Přesně ten, který zadání chce: koupě začíná u problému, který hráč pocítil („holub mi utekl“, „hod je slabý“) a přínos vidí v metrech nebo zachráněných událostech předem.
- Rizika a etika: Nesmí to být prodejní okno. Jedna věta, žádné blikání, žádné „kup hned“ (`02 §4.3` body 6 a 7). Když nákup nepomůže, hra to řekne. Čísla musí pocházet z uložených skutečných dat. Hypotéza vedení: hráč nemá jen poslouchat. Proto diagnóza ustupuje (`04 N2`): po 3 hodech bez změny problému se už neopakuje.
- Simulace: Přidat nákupní strategii „diagnóza“ (pravidla výše s daty simulovaného hráče, simulátor zná `charge` i výsledky QTE). Hypotéza: „diagnóza“ bude u každého profilu do 5 % od nejrychlejší strategie a u slabého hráče nejrychlejší. To by ukázalo, že doporučení dovede hráče k situačně správné větvi. Nárok: nová logika (strategie v `shop()`, ukládání `delta` v `resolve`).
- Náročnost implementace: M

### D17 — Zkušební hod s další úrovní
- Typ: Systém
- Kde: Dílna
- Mechanika: U každé dostupné úrovně, na kterou hráč ještě nemá, je tlačítko „Vyzkoušet“. Spustí jeden normální hod (míření, nabití, QTE) s dočasně přidanou úrovní. Po dopadu ukáže „S Papírem 3: 342 m (tvůj průměr 298 m)“ a vrátí do Dílny. Zkušební hod nedává mince, nepočítá se do rekordu, milníků ani `attempts` a scéna je označená („ZKOUŠKA“). Jedna zkouška na každou úroveň.
- Úrovně a cena / podmínka odemčení: Zdarma, 1× za každou úroveň každé větve, od prvního otevření Dílny.
- Proč je hra zábavnější: Nejsilnější možné „vidět předem“: hráč přínos nejen vidí, ale cítí v ruce. Zvědavost s jistotou, že ji jde uspokojit (Loewenstein, `README P3`, V). Volba je pak informovaná (`03 §2.5`, H). Dovolí vyzkoušet i podpůrné větve, jejichž efekt číslo neukáže (Křidélka, Vyvážení).
- Pocit „chci a potřebuju“: „Nevím, jestli Křidélka stojí za to.“ Hráč je vyzkouší na jednom letu a pozná, jestli mu holub vyšel díky nim.
- Rizika a etika: Zkouška nesmí být „návnada“: po ní žádné „kup teď“, jen neutrální „Koupit / Zpět“ (`02 §4.3` bod 6). Výsledek zkoušky je skutečný, tedy i horší než průměr, pokud se hod nepovede. Nedávat zkoušku úrovně, kterou hráč nemůže zaplatit déle než ~5 hodů, aby to nepůsobilo jako ochutnávka nedostupného.
- Simulace: Ekonomicky neutrální (žádné mince), takže v Monte Carlu nemění tempo. Lze simulovat jako lepší informaci strategie (zkouška = 1 vzorek doletu s úrovní), hypotéza: strategie „zkouška + nákup nejlepší“ je ±3 % od D01. Hlavní měření je playtest: kolik hráčů zkoušku použije a zda po ní koupí jinou větev, než by koupili. Nárok: nesimulovatelné jako prožitek, jen playtest.
- Náročnost implementace: M

### D18 — Kapitolový strop úrovní
- Typ: Systém
- Kde: Dílna
- Mechanika: Maximální úroveň větví závisí na kapitole: do 500 m strop **3** (u všech větví), po 500 m strop **5** a u Síly, Papíru a Patra už i mistrovská úroveň 6, po 914 m úroveň 7 (D15). Cílem kapitoly 3 je 1 219 m, potom strom končí. Dílna ukazuje vyšší úrovně šedě s popisem „otevře se za 500 m“ a s náhledem účinku. Ceny se nemění. Mění se jen to, co je kdy k mání.
- Úrovně a cena / podmínka odemčení: Kapitola 1 ve V1 (D13): Síla 1–3 (335) + Papír 1–3 (335) + Vyvážení 1–3 (190) + Křidélka 1–3 (190) + Patro 1–3 (190, od 100 m) = **1 240 mincí**.
- Proč je hra zábavnější: Řeší „většina stromu zůstane k 500 m nevyužitá“. Strom kapitoly je dokončitelný a efekt „jeden krok od cíle“ funguje u zřetelně uzavřené sbírky (Cao 2025, `README P6`, V). Snižuje cenu špatného pořadí: když hráč do 500 m koupí skoro celý strop, pořadí přestane rozhodovat. Poslední úrovně přecházejí do další kapitoly jako motor (`03 N2`). Zároveň brání tomu, aby vertikální růst do 500 m přerostl dovednost (`03 N8`).
- Pocit „chci a potřebuju“: „Mám všechno na trojce, co dál?“ Šedá čtyřka s náhledem a konkrétní hranicí místa (Zahrady) dává blízký cíl hned po oslavě 500 m, ne dřív.
- Rizika a etika: Strop může působit jako umělé zdržení („proč to nemůžu koupit?“). Proto vysvětlení navázané na svět (vyšší patro dílny, nové materiály v další čtvrti), ne „zamčeno“. Pozor na softlock: se stropem 3 musí 500 m dosáhnout i slabý hráč. Sonda: šipka se silou a papírem 3 pasivně 353 m, s Patrem 3 ~414 m, s QTE průměrného hráče okolo 470–530 m. Hraniční, nutno ověřit.
- Simulace: Hypotéza: se stropem 3 a cenami V1 zůstane hod do 500 m u průměrného hráče 21–25, u slabého ≤ 35, softlock 0 %. Při 500 m bude koupeno ≥ 75 % stromu kapitoly 1 (dnes 32–60 % celého stromu). Poměr nejpomalejší / nejrychlejší strategie ≤ 1,2. Pokud slabý hráč přesáhne 40 hodů, zvýšit strop Patra na 4. Nárok: jen parametr (strop v `buy()` podle `p.best`) a kampaň s více cíli (D15).
- Náročnost implementace: S

---

## Návrh struktury stromu

Strom se skládá ze **dvou jádrových větví, tří podpůrných, výbavy modelu a modelů jako odemčení**. Každá větev mění jednu věc, kterou hráč vidí: rychlost výhozu, klouzavost, výšku startu, odpuštění síly, události, a později vítr.

| Kapitola (cíl) | Co je k mání | Cena (V1) | Nová touha, kterou otevírá |
|---|---|---:|---|
| **1: Dílna → 500 m** (strop 3) | Síla 1–3, Papír 1–3, Vyvážení 1–3, Křidélka 1–3; po 100 m Kluzák a Patro 1–3 | **1 240** | „Doletět za Tržnici, chytit holuba, dostat se z dílny na střechu“ |
| **2: 500 → 914 m** (strop 5) | Všech 5 větví 4–5 (2 670) + mistrovské efekty Švih a Vztlak (D12) + Výbava Šipky a Kluzáku (2 × 440) + Aerodynamika při Síle 3/5 (460) + Sokol zdarma u Zahrad (610 m) + úroveň 6 jádra a Patra od 500 m (520 + 520 + 300) | **5 350** | „Specializace se vyplácí, můj model má roli“ |
| **3: 914 → 1 219 m** (strop 7) | Úroveň 7 jádra a Patra (640 + 640 + 370) + Albatros zdarma u Železnice (914 m) + vítr, Stabilizátor (380) a Střela (pokud uživatel vítr schválí) | **2 030** | „Dokončit Fialové předměstí“ |
| **Celkem** | | **8 620** | strom končí na hranici čtvrti, žádné nekonečné úrovně |

**Systémy, které strom drží čitelný:** náhled (D01) a diagnóza (D16) v Dílně, rozpis zásluhy (D02) ve výsledku, zkušební hod (D17) jako volitelné ověření a přestavba (D14) jako pojistka proti špatné volbě.

**Pořadí pro simulaci (doporučení):** (1) D03 + D04 + D13 V1 (rozdělení přehybů a ceny podle role, levné na implementaci, míří na problém 46 / 28), (2) D18 + D05 (strop a Patro, využití stromu), (3) D14 a D16 jako strategie, (4) D15 + D08 + D09 (prodloužená kampaň), (5) D10 + D11 až po rozhodnutí o větru. D06 a D07 testovat jako varianty, mohou vypadnout.

**Odhad tempa (hypotéza k ověření):** kapitola 1 21–25 hodů (beze změny proti dnešku), kapitoly 2 a 3 dohromady 25–40 hodů u průměrného hráče. Celá hra 45–65 hodů, tedy asi 25–40 minut, pokud se délka letu udrží pod 30 s v průměru. To je v pásmu žánru (Learn to Fly 14–35 hodů do cíle, `03 §1` bod 5) jen pro kapitolu 1, další kapitoly jsou dobrovolné.

## Otázky pro uživatele

1. **Rozdělit přehyby na Vyvážení a Křidélka?** Je to nejlevnější a nejsilnější zásah proti pasti 46 / 28, ale znamená migraci savu (v4) a pátou větev v UI.
2. **Má hra pokračovat za 500 m s Dílnou (kapitoly 2–3), nebo má 500 m zůstat koncem a mince se přiznají jako bez využití** (`README R-N4`, `02 N6`)? Na tom stojí D08, D09, D15 a D18.
3. **Zavést vítr?** Bez něj odpadá D10 a D11. S ním je nutné upravit nápovědu úhlu (`bestAngle`).
4. **Délka letu:** kluzák a Albatros na vysokých úrovních letí 60–100 s v reálném čase. Smí hra zrychlit klouzavou fázi (např. ×2 po vrcholu bez událostí), nebo mají klouzavé modely zůstat „pomalé a klidné“?
5. **Sdílený strom, nebo výbava modelu (D07)?** Výbava prohlubuje role, ale nabourává rozhodnutí z 0.6, že vylepšení jsou společná.
6. **Přestavba (D14) zdarma, nebo vůbec?** Ruší past, ale snižuje váhu volby.
7. **Diegetické Patro:** souhlasíš s tím, aby se startovní scéna po úrovních měnila (okno → střecha → anténa)? Znamená to kresbu ve všech čtyřech vizuálních stylech.
