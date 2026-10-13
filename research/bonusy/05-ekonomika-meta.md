# Bonusy 05 — Ekonomika, odměny a meta-progrese

**Založeno 13. 10. 2026.** Úhel: mince, vzorce odměn, ceny, využití mincí po 500 m, druhá měna, prestiž, režimy po hlavním cíli, poctivý náskok a přirozené ukončení session. Podklad: `00-zadani.md`, `CLAUDE.md`, `src/config.js`, `src/core.js`, `src/storage.js`, `src/scenes.js`, `simulation/monte-carlo.mjs`, `simulation/MONTE-CARLO.md`, KB `README`, `02`, `03`, `09` a stará KB (K5, §8). Web nepoužit, kód hry beze změny.

Štítky: **V** výzkum · **H** heuristika nebo praxe oboru · **N** naše hypotéza. Odkazy `03 §2.3` = blok KB 03, oddíl 2.3. Karty mají předponu **E** (ekonomika).

---

## 0. Výchozí čísla a principy

### 0.1 Průzkumný běh (13. 10. 2026, 0.6.1)

Pro ukotvení čísel v kartách jsem pustil vlastní skript v dočasném adresáři. Kód hry ani `simulation/` jsem neměnil. Skript používá fyziku a QTE ze `src/` a profily `SKILLS` z `monte-carlo.mjs`. Hráč nakupuje rovnoměrně, úhel se učí (krok 5°, 20 % průzkum) a model volí jako „lepší z obou“. Na profil je 300 hráčů a kampaň pokračuje **po 500 m až do plného stromu a 20 hodů navíc**. Jde o jednu strategii, ne o realistický mix z `MONTE-CARLO.md`, proto vychází 21 hodů místo 23. Čísla berte jako orientační.

| Ukazatel | slabý | průměrný | dobrý |
|---|---:|---:|---:|
| Hody do 500 m, P50 (P10–P90) | 28 (21–37) | 21 (17–27) | 18 (12–21) |
| Minuty do 500 m, P50 | 14,0 | 10,6 | 9,0 |
| Úrovně při 500 m, Ø síla / papír / přehyby | 3,1 / 2,8 / 2,5 | 2,9 / 2,5 / 2,1 | 2,7 / 2,2 / 2,0 |
| Utraceno při 500 m, medián (podíl stromu) | 1 005 (32 %) | 615 (19 %) | 615 (19 %) |
| Zůstatek při 500 m, medián | 150 | 142 | 143 |
| Průměrný hod před 500 m (≈ mince za hod) | 283 m (38) | 317 m (41) | 335 m (43) |
| QTE na hod / perfektní na hod před 500 m | 3,3 / 1,2 | 3,4 / 1,9 | 3,5 / 2,6 |
| Nových rekordů do 500 m, medián | 9 | 8 | 7 |
| Nejdelší mezera mezi nákupy před / po 500 m (hody, medián) | 5 / 6 | 4 / 6 | 4 / 5 |
| Hody do plného stromu, P50 (P10–P90) | 59 (53–65) | 52 (46–56) | 48 (44–52) |
| Minuty do plného stromu, P50 | 44 | 42 | 41 |
| Dolet s plným stromem, P10 / P50 / P90 | 558 / 975 / 1 232 m | 746 / 1 093 / 1 348 m | 863 / 1 156 / 1 408 m |
| Nejlepší dolet na konci, P50 | 1 300 m | 1 393 m | 1 436 m |

Co z toho plyne pro ekonomiku:
1. **Problém 3 165 proti úrovni 3–4 je ve skutečnosti ještě ostřejší.** Průměrný hráč dojde k 500 m s pětinou stromu (615 z 3 165). Zbylých ~2 550 mincí nemá cíl.
2. **Dohrát dnešní strom po 500 m trvá dalších ~31 hodů a ~31 minut.** Hod po 500 m trvá v průměru ~60 s (před 500 m ~30 s). Dlouhé lety jsou nový skrytý náklad času.
3. **S plným stromem končí trasa pro hráče kolem 1,1–1,4 km.** To jsou místa 0–4 (Skladiště u vody na 1 219 m), tedy začátek Měsíčních doků. Místa 5–15 (1 524–4 876 m) jsou dnes nedosažitelná. Každý cíl za ~1,4 km potřebuje nový růst.
4. **Rekordy jsou častý okamžik:** ~40 % hodů před 500 m je rekord. Odměna za rekord tedy dopadne skoro na každý druhý hod.
5. Trasa: místo *i* začíná na *i* · 304,8 m (`scenes.js`, `SCREEN_METERS`), čtvrť na *k* · 1 219 m. Cíl 500 m leží v místě 1 (Tržnice pod anténami). Nejbližší další místo jsou Zahrady na okraji na 610 m.

### 0.2 Společná pravidla všech karet

- **Pevně a předvídatelně.** Každá odměna je deterministická funkce toho, co hráč udělal, a hráč ji zná předem. Žádné truhly, náhodné násobiče ani „mystery“ (`02 §4.3` bod 1).
- **Nic nepropadá.** Žádné streaky, denní odměny, časovače, expirace ani hrozba ztráty (`02 §4.3` body 4–5, ICO std. 5, pokyny k čl. 28 DSA).
- **Rozpočtová neutralita.** Každá nová složka příjmu se v simulaci posuzuje proti dnešnímu tempu. Pokud zvedne příjem průměrného hráče do 500 m o víc než 10 %, upraví se ceny nebo jiná složka (E01).
- **Vidět přínos předem.** Každý nákup a každá odměna má náhled před rozhodnutím (E09, E10).
- **Mince nejsou peníze.** Nejdou koupit, směnit ani získat za reklamu. Druhá „měna“ (razítka, E05) se neutrácí, jen odemyká prahy, takže nevzniká vícevrstvá měna (`02 §2.9`, principy CPC).

---

## 1. Karty

### E01 — Účtenka hodu: přeladěná odměna se startovným
- Typ: Systém
- Kde: Výsledek
- Mechanika: Nová odměnová funkce nahrazuje `reward(f)` v `core.js`:
  `R = max(20, 5 + ⌊d/10⌋) + R_rekord (E02) + R_místo (E03) + R_perfekt (E04)`, kde `d = f.x − f.startX`.
  - Startovné klesá z 10 na 5, ale minimum hodu je 20 ◈. Hod pod 150 m tak dá stejně jako dnes, slabý hráč nic neztratí a softlock nehrozí.
  - Výsledková obrazovka ukazuje „účtenku“ po řádcích. Nahoře je výkon, startovné je dole a neokázalé, nulové řádky se nezobrazují. Příklad: `Dolet 412 m +41 · Nový rekord +12 m +2 · Perfektní zásahy 2× +4 · Startovné +5 = 52 ◈`.
  - Pravidlo rozpočtu: součet složek E02–E04 může průměrnému hráči do 500 m zvednout příjem nejvýš o 10 % proti dnešku (~760 ◈ → ≤ 840 ◈). Pokud ho zvedne víc, vynásobí se `PRICES` poměrem příjmů, zaokrouhleně na 5.
- Úrovně a cena / podmínka odemčení: od začátku, bez ceny.
- Proč je hra zábavnější: Odměna nese informaci o výkonu, ne o účasti. Opora: Deci 1999 (výkonová odměna škodí méně než za účast, informativní zpětná vazba d ≈ +0,33; `02 §2.6`, V), `02 N1` (výkonovou složku zobrazit výrazněji než startovné, N) a `03 §2.1` (vrstvení odměn v LtF dává víc os ke zlepšení, H). Rozpis podporuje přičitatelnost (`README P7`, N).
- Pocit „chci a potřebuju“: Hráč z účtenky vidí, *za co* mince dostal a na které ose (dolet, rekord, perfekt) se dá přidat. Další hod má konkrétní páku. Přínos zná předem, protože pravidla účtenky jsou stálá a vypsaná v Dílně.
- Rizika a etika: Pozor na „casino feel“: animace účtenky musí škálovat s hodnotou, slabý hod má skromnou výplatu a celé se dá přeskočit klepnutím (`02 §4.3` bod 10, `02 N3`). Snížení startovného nesmí dopadnout na slabého hráče, proto minimum 20 ◈. Bez náhody.
- Simulace: jen parametr (přepsat odměnu v workeru stejně jako dnes `rewardMul`). Měřit hody a minuty do 500 m po profilech, příjem do 500 m a podíl jednotlivých složek. *Hypotéza:* samotná změna 10 → max(20, 5 + d/10) sníží příjem průměrného hráče do 500 m o ~10 % (~−90 ◈) a prodlouží kampaň o ~1 hod. U slabého hráče dopad do ±1 hodu díky minimu. V kombinaci s E02–E04 má celkový příjem vyjít v pásmu +0 až +10 %.
- Náročnost implementace: S

### E02 — Rekordní prémie (teleskopická)
- Typ: Systém
- Kde: Výsledek
- Mechanika: Pokud hod překoná dosavadní `p.best` a ten je > 0, pak `R_rekord = ⌊(d − best_před)/5⌋` ◈ (1 ◈ za každých 5 m nad rekordem). První hod hry prémii nedostává.
  - Součet všech prémií za celou hru je `(best_konec − best_po_1._hodu)/5` bez ohledu na cestu. Nedá se tedy „farmit“ střídáním slabých a silných hodů a hráč si celkovou výši spočítá předem.
  - Na obrazovce míření zůstává řádek „Rekord 412 m · každých 5 m navíc +1 ◈“.
- Úrovně a cena / podmínka odemčení: od začátku.
- Proč je hra zábavnější: Rekord je osobní cíl, který si hráč nastavuje sám, a nese menší riziko demotivace než srovnání s ostatními (`09 §2.5`, `09 N3`, H/N). Odměna je navázaná na záměrné zlepšení, ne na náhodu (Schreiber, `03 §2.4`, H). Juice podle hodnoty výsledku (`02 N3`).
- Pocit „chci a potřebuju“: Hráč ví, že každý metr nad rekordem má trojnásobnou cenu (0,2 ◈/m proti 0,1 ◈/m z doletu). Hodí se to hlavně po 500 m, kdy rekordy přibývají pomalu a hod trvá minutu. Přínos je vidět předem na řádku rekordu.
- Rizika a etika: Odměna za rekord může přidat tlak na výkon. Je ale malá (pre-500 celkem ~60 ◈, ~8 % příjmu) a nikdy netrestá horší hod. Žádné „skoro rekord!“, jen pravdivá informace o odchylce (`02 §2.4`, `README P10`).
- Simulace: jen parametr. Měřit příjem z rekordů do 500 m a do plného stromu a změnu hodů do 500 m. *Hypotéza:* do 500 m +50 až +70 ◈ (průměrný), tedy −0 až −1 hod. Po 500 m +150 až +180 ◈ (rekord 500 → ~1 390 m), což zkrátí cestu k plnému stromu o ~2 hody. Na slabého a průměrného hráče dopadá prémie stejně, protože závisí na rozdílu rekordů, ne na úrovni.
- Náročnost implementace: S

### E03 — Objevné za nové místo
- Typ: Systém
- Kde: Výsledek, Let
- Mechanika: Když hod poprvé přistane v místě s indexem `i` (`routeAt(d).index`, místo `i` začíná na `i · 304,8 m`), vyplatí se jednorázově `R_místo = 25 · i` ◈ a za první místo nové čtvrti (`i = 4, 8, 12`) navíc +50 ◈.
  - Tabulka: Tržnice (305 m) 25, Zahrady (610 m) 50, Železnice (914 m) 75, Skladiště (1 219 m, nová čtvrť) 150, Jeřáby (1 524 m) 125 a tak dál až Střešní přístav (4 571 m) 375.
  - Pokud hod přeskočí víc míst najednou, vyplatí se všechna, protože hráč nad nimi skutečně proletěl.
  - Objev se ukládá do save (`places: [bool × 16]`, nové pole, migrace v `storage.js` z `best`: místa do `best` se označí jako objevená bez výplaty).
  - HUD po hodu a na míření: „Další místo: Zahrady na okraji · za 98 m · objevné 50 ◈“.
- Úrovně a cena / podmínka odemčení: od začátku. Objevné se vyplatí jednou za místo.
- Proč je hra zábavnější: Překvapení má plynout z obsahu, ne z náhodné výše mincí (`02 N4`, H/N). Zvědavost předpovídá dobrovolné hraní (Kao 2024, `README P3`, V) a blízké neobjevené místo funguje lépe než celá mapa (Loewenstein 1994, `08 N1`, V/N). Poměrový rytmus milníků podle Kivetze (`03 N3`, V/N).
- Pocit „chci a potřebuju“: Další místo má jméno, vzdálenost a cenu. Mezi 500 m a plným stromem nastávají skoky příjmu na 610, 914 a 1 219 m přesně tam, kde jinak hrozí hluché úseky. Přínos je vidět předem v HUD.
- Rizika a etika: Nesmí vzniknout vyrobený near-miss. Hranice místa je pevná geometrie trasy a dolet se nikdy neupravuje (`02 §4.3` bod 3). Text „za 98 m“ je pravdivá informace, žádné „SKORO!“. Objevné nepropadá.
- Simulace: jen parametr a index místa z `routeAt`. Měřit hody mezi objevy po 500 m a podíl objevného na příjmu. *Hypotéza:* do 500 m +25 ◈ (zanedbatelné). Po 500 m +275 ◈ (Zahrady, Železnice, Skladiště s bonusem čtvrti), což zkrátí cestu k plnému stromu o ~3 hody. Medián nejdelšího hluchého úseku po 500 m (bez nákupu i objevu) klesne z 6 na ≤ 5 hodů.
- Náročnost implementace: S (výplata), M (save a migrace)

### E04 — Prémie za perfektní zásah
- Typ: Systém
- Kde: Let, Výsledek
- Mechanika: Za každý QTE s výsledkem `perfect` připadne `R_perfekt = +2` ◈. Za `success` se neplatí nic, úspěch už se projeví v doletu.
  - Za letu se u hodnocení ukáže „★ Perfektní +2 ◈“ a na účtence řádek „Perfektní zásahy 2× +4“.
  - Volitelná varianta pro simulaci je +3 ◈.
- Úrovně a cena / podmínka odemčení: od začátku. Přehyby (`window +10 %/úr.`) zvyšují šanci na perfekt, takže prémie nepřímo zhodnocuje i tuto větev.
- Proč je hra zábavnější: Odměna kopíruje kvalitu provedení (Kao 2024, vazba efektu na úspěch, `README P1`, V). Přehyby dnes hráč těžko vidí (`README P8`, `03 N7`). Když přinesou viditelné mince navíc, dostanou druhou, čitelnou hodnotu.
- Pocit „chci a potřebuju“: Perfektní zásah je hned za letu vidět jako mince. Hráč, který „jen klikne“, uvidí, že přesnost něco nese. Přehyby se tak dají číst i jako „víc perfektů = víc mincí“.
- Rizika a etika: QTE mají stálý střed a dají se naučit nazpaměť (`06`, `README P9`). Prémie pak odměňuje odměřování, ne reakci. Proto ji zapnout spolu s variabilitou středu nebo ji nechat malou. Rozevře mírně rozdíl slabý a dobrý (1,2 proti 2,6 perfektu na hod, tedy ~2,4 proti ~5,2 ◈ na hod). Rozdíl je ale malý proti doletu (~38–43 ◈ na hod). Bez náhody, bez tlaku.
- Simulace: jen parametr (počet `perfect` už vrací `eventStats`). Měřit příjem z perfektů po profilech a poměr slabý/průměrný v hodech do 500 m. Navíc zjistit, zda se zkrátí odstup strategie „přehyby napřed“ od rovnoměrného nákupu. *Hypotéza:* +2 ◈ dá průměrnému hráči do 500 m ~+80 ◈ (~10 %, −1 hod), slabému ~+67 ◈. Poměr slabý/průměrný se změní o méně než 0,05. „Přehyby napřed“ se zlepší o 1–2 hody. Pokud E01–E04 dohromady překročí +10 % příjmu, upravit ceny podle E01.
- Náročnost implementace: S

### E05 — Atlas razítek (druhá „měna“, která se neutrácí)
- Typ: Systém
- Kde: Bonusy
- Mechanika: Razítko je trvalý záznam objevu nebo splněné výzvy. **Neutrácí se**, slouží jen jako počítadlo s prahy. Proto nejde o druhou platební měnu a nejde ho směnit za mince ani naopak.
  - Zdroje: 1 za každé objevené místo (16, E03), 1 za každou výzvu (E12, 8), 1 za medaili v Konstruktéru (E11, max 9) a 1 za každou čtvrť s objevenými všemi 4 místy (4).
  - Stránka Bonusy ukazuje atlas jako mřížku 4 čtvrtí × 4 místa plus výzvy a medaile. Neobjevená místa jsou siluety se jménem a vzdáleností.
  - Prahy (návrh, napojení na sloty Bonusů rozhodnou jiné karty): 2 razítka = 1. slot Bonusů, 5 = 2. slot, 9 = 3. slot, 14 = vzhled papíru „Mapa“ (E19).
  - Save: `stamps: string[]` (ID razítek), migrace z `best` u míst.
- Úrovně a cena / podmínka odemčení: první razítko (Dílna a první střechy) dostane hráč prvním hodem, protože místo 0 opravdu proletí (pravdivé, viz E15). Druhé přijde s Tržnicí (305 m) zhruba v 5.–8. hodu.
- Proč je hra zábavnější: Sbírka se zřetelnou strukturou a efekt „jeden krok od cíle“ (`08 §3.8`, Cao 2025, `README P6`, V). Horizontální progrese odděluje „co jsem objevil a dokázal“ od vertikálních čísel (`03 §2.4`, Fischer, H). Mince zůstávají ekonomikou letu, razítka mapou zážitků.
- Pocit „chci a potřebuju“: Hráč vidí prázdné místo v atlase se jménem a vzdáleností („Most přes záliv · 1 829 m“). Ví, kolik razítek chybí do dalšího slotu („7/9“), a zná přesnou podmínku každého razítka.
- Rizika a etika: Nesmí vzniknout „gotta catch 'em all“ s povinnými výzvami. Prahy slotů proto mají jít splnit samotným hraním trasy (místa 0–4 a 1–2 výzvy). Žádné razítko není časově omezené ani náhodné. Sbírka slábne daleko od dokončení (Cao 2025), takže vzdálená místa ukazovat jen jako rámec (`08 N2`).
- Simulace: nová logika (počítadlo razítek z míst a výzev). Měřit hod, ve kterém hráč dosáhne každého prahu (2/5/9), a podíl hráčů, kteří práh 9 do plného stromu nesplní. *Hypotéza:* práh 2 průměrný hráč splní do 8 hodů. Práh 5 až po 500 m (Zahrady, Železnice a 1 výzva) kolem 30. hodu. Práh 9 jen s E11/E12, jinak ho bez obsahu za 1,4 km nesplní nikdo.
- Náročnost implementace: M

### E06 — Kapitolová Dílna: úrovně 4–5 až po 500 m
- Typ: Odemčení
- Kde: Dílna
- Mechanika: Do dosažení 500 m (`p.completed`) jsou ve stromu jen úrovně 1–3 (9 nákupů, 1 005 ◈). Úrovně 4–5 všech větví („Mistrovské přehyby“) se odemknou oslavou na výsledkové obrazovce 500 m.
  - Ceny: varianta A ponechává `[35, 105, 195 | 300, 420]` (kapitola 2 stojí 2 160 ◈). Varianta B zlevňuje kapitolu 2 na `[35, 105, 195 | 240, 330]` (1 710 ◈).
  - V `buy()` stačí podmínka `level ≤ (p.completed ? 5 : 3)`.
- Úrovně a cena / podmínka odemčení: úrovně 1–3 hned, 4–5 od 500 m.
- Proč je hra zábavnější: Okamžik 500 m je nejrizikovější bod hry (Kivetz 2006: 17 % odchodů hned po odměně, reset motivace; `03 §2.3`, `README P5`, V). Hráči žánru kritizují prázdný konec (`03 §2.7`, H). Karta dá po cíli hotový další krok bez nového obsahu a odstraní nesoulad „strom 3 165, potřeba 3–4“: před 500 m je strom celý dosažitelný a při cíli má hráč koupenou zhruba 60–100 % nabídky místo 20–30 %.
- Pocit „chci a potřebuju“: Při 500 m hráč uvidí 6 nově rozsvícených úrovní a u každé náhled doletu (E10). Mince, které mu zbyly (~140), mají okamžitý cíl. Před 500 m Dílna působí méně zahlceně (9 tlačítek místo 15).
- Rizika a etika: Nabídka po cíli nesmí tlačit. Pořadí obrazovky je „oslava a konec kapitoly → možnost skončit → nabídka“ (`03 N1`, `02 N6`). Hráč, který si dřív koupil sílu 4, o ni při migraci nepřijde: úrovně > 3 v existujícím save zůstávají. Zámek není umělý časovač, odemkne se výkonem.
- Simulace: jen parametr (strop úrovně podle `p.completed`). Měřit hody do 500 m po nákupních strategiích, zůstatek při 500 m, hody 500 m → plný strom a mrtvá místa v kapitole 2. *Hypotéza:* hody do 500 m +0 až +1 (víc u „síla napřed“, kterou strop zpomalí). Zůstatek při 500 m vzroste u rychlých hráčů. Kapitola 2: varianta A ~28–31 hodů a ~30 min, varianta B ~22–25 hodů. Doporučuji simulovat obě a cílit na kapitolu 2 kratší než 25 min (otázka pro uživatele).
- Náročnost implementace: S

### E07 — Aerodynamika: čtvrtá větev, která zkracuje lety
- Typ: Vylepšení
- Kde: Dílna
- Mechanika: Nová větev odemčená na 500 m: `cruise × (1 + 0,15 · L)`, `L = 0–3`. Pole `cruise` už v `parameters()` je.
  - Průzkum (pasivní let, nejlepší úhel, síla 0,7, plný strom): kluzák při ×1,45 zrychlí let 71 → 53 s (−25 %) s doletem +1 % (645 → 653 m). Šipka zrychlí 40 → 32 s s doletem +3 %.
  - Ceny 150 / 250 / 350 (celkem 750 ◈).
  - Text v Dílně: „Rychlejší let: −8 / −15 / −22 % času, dolet skoro beze změny.“
- Úrovně a cena / podmínka odemčení: 3 úrovně, od 500 m.
- Proč je hra zábavnější: Po 500 m trvá hod v průměru ~60 s (průzkumný běh), což je dvojnásobek proti začátku. Hráč žánru chce „jen létat“ a překáží mu čekání (`03 §2.1`, kritika LtF, H). Mince tu kupují tempo, ne další grind.
- Pocit „chci a potřebuju“: Pociťovaný problém je dlouhý let, který hráč zná. Přínos je čitelný v sekundách. Náhled ukáže „tvůj poslední let 68 s → 58 s“ (E10).
- Rizika a etika: Hrozí vzor *Pay to Skip* (`02 §2.8`). Tady se platí herními mincemi, ale princip platí: lety se nesmějí uměle prodlužovat, aby se prodávalo zrychlení. **Poctivá alternativa:** pokud UX přidá zdarma tlačítko „zrychlit ×2“, tato karta ztrácí smysl a má vypadnout. Méně času letu znamená i méně QTE, a tedy méně perfektů (E04).
- Simulace: jen parametr (`cruise`). Měřit minuty (ne hody) 500 m → plný strom, QTE na hod a příjem za minutu. *Hypotéza:* hody beze změny (±1), minuty kapitoly 2 −12 až −18 %, QTE na hod −15 až −20 %. Pokud aerodynamika dolet zkrátí (kvůli méně QTE víc než přidá), je to past a cenu je třeba snížit.
- Náročnost implementace: S

### E08 — Etapy trasy s poměrovým rytmem
- Typ: Systém
- Kde: Výsledek, Let
- Mechanika: Hlavní cíl je jen jeden aktivní a ostatní jsou rámec.
  - **Kapitola 1:** 500 m (Tržnice).
  - **Kapitola 2: Doky:** cíl 1 219 m (Skladiště u vody, první místo nové čtvrti), dílčí zastávky Zahrady 610 m a Železnice 914 m. Poměry 500 → 610 → 914 → 1 219 jsou 1,22 / 1,50 / 1,33, celé kapitoly 2,44.
  - **Kapitola 3+:** zobrazit jen jako siluetu („Rudý horizont · 2 438 m“), dokud nevznikne růst, který ji zpřístupní (otázka pro uživatele).
  - Ukazatel cesty v HUD: „Kapitola 2 · 742 / 1 219 m“. Poctivý náskok řeší E15.
  - Po dosažení kapitoly přijde oslava, objevné (E03), razítko (E05) a uzavření (E14).
- Úrovně a cena / podmínka odemčení: kapitola 2 se odemkne na 500 m.
- Proč je hra zábavnější: Blízké dílčí cíle uvnitř vzdáleného rámce (Locke & Latham, Kivetz: úsilí roste s *podílem* zbývající vzdálenosti; `README P6`, `03 N3`, V/N). Žánrová norma je „cíl, pak něco navíc“ (`03 §2.1`, H). Jeden čitelný cíl odpovídá staré KB K5.
- Pocit „chci a potřebuju“: Po 500 m má hráč pojmenovaný další cíl 110 m za rekordem, ne prázdnotu. Kapitolový cíl 1 219 m odpovídá tomu, co strom reálně dovolí (P50 nejlepšího doletu s plným stromem je 1 393 m). Cíl je tedy na dosah, ale ne zadarmo.
- Rizika a etika: Neukazovat vzdálené cíle, které strom nedovolí, jako slib. Kapitola 2 musí jít ukončit a hra nesmí naznačovat, že hráč o něco přijde. Pozor na úsek 914 → 1 219 m: dolet tu roste pomalu, takže může vzniknout grind.
- Simulace: nová logika jen pro metriky (milníky z doletu). Měřit hody a minuty mezi milníky 500 / 610 / 914 / 1 219 m a podíl hráčů, kteří 1 219 m nedosáhnou do 60 hodů. *Hypotéza:* s dnešním stromem a E06 A průměrný hráč 500 → 610 m za 2–4 hody, 610 → 914 za 6–9, 914 → 1 219 za 10–15. Poslední úsek je nejrizikovější mrtvé místo. Slabý hráč 1 219 m nedosáhne v ~20–30 % kampaní (P10 doletu s plným stromem je 558 m, nejlepší dolet P10 1 058 m). Pokud ano, snížit cíl kapitoly na Železnici 914 m.
- Náročnost implementace: M

### E09 — Cíl nákupu a „kolik chybí“ (v mincích, ne v hodech)
- Typ: Systém
- Kde: Dílna, Výsledek
- Mechanika: Hráč v Dílně klepnutím připne jednu úroveň jako cíl („Šetřím na: Papír 3 · 195 ◈“). Bez připnutí se zobrazí nejbližší nákup, který si ještě nemůže dovolit.
  - Výsledková obrazovka ukazuje pruh `142 / 195 ◈ · chybí 53 ◈` a vedle neutrálně „poslední hod +47 ◈“.
  - **Žádný odhad počtu hodů.** Stará KB K5 výslovně říká „ukázat, kolik mincí zbývá, neuvádět garantovaný počet hodů“, a tím se rozpor R-N6 (`02 N5`) řeší ve prospěch K5. Údaj o posledním příjmu dává hráči informaci k vlastnímu odhadu bez slibu.
  - Odhad „~N hodů“ zůstane jen interní metrikou simulace.
- Úrovně a cena / podmínka odemčení: od prvního hodu.
- Proč je hra zábavnější: Gradient cíle, kdy se úsilí zrychluje s blížícím se cílem (Kivetz 2006, `03 §2.3`, V). Jeden aktivní cíl (K5, H). Připnutí je volba hráče (autonomie, `README P13`).
- Pocit „chci a potřebuju“: Hráč vidí, že mu k vytouženému papíru chybí méně než jeden hod, a ví to sám z čísel. Cíl si vybral on, takže „potřebuju“ je jeho rozhodnutí, ne nátlak hry.
- Rizika a etika: Pruh nesmí být návnadou v rozhodovacím momentu (`02 §4.3` bod 6): žádné blikání, žádné „už jen jeden hod!“ a tlačítko „Hrát dál“ nemá být výraznější než „Dílna“ nebo „Skončit“. Riziko z K5 je grind maskovaný barevným pruhem, proto hlídat mrtvá místa (E01–E04, E06).
- Simulace: nesimulovatelné behaviorálně (playtest). Simulátor ale dodá kontrolní metriku: rozdělení „hodů do dalšího nákupu“ v každém okamžiku a podíl stavů, kdy chybí ≥ 2 hody příjmu. *Hypotéza (playtest):* méně odchodů v Dílně bez nákupu a hráč dokáže pojmenovat svůj cíl (K5). *Hypotéza (sim):* před 500 m chybí ≥ 2 hody příjmu v < 30 % okamžiků, po 500 m (E06 A) v < 45 %.
- Náročnost implementace: S

### E10 — Předpověď přínosu: přehraj poslední hod s novou úrovní
- Typ: Systém
- Kde: Dílna
- Mechanika: Fyzika je deterministická podle seedu. Hra si proto uloží parametry posledního hodu `{model, angle, power, seed, výsledky QTE podle pořadí}`. U každé dostupné úrovně Dílna přehraje let (`createFlight` s `levels + 1` v dané větvi) tak, že každá událost dostane stejný výsledek jako v originálu (vynucené `resolve`, bez vstupu hráče).
  - Ukáže pak: „Papír 3: tvůj poslední hod 412 m → 471 m (+59 m, +6 ◈)“.
  - U přehybů ukáže navíc dva řádky, které replay nezachytí: „Okno poryvu 0,28 → 0,31 s · tvoje síla 62 % se počítá jako 68 %“.
  - Výpočet trvá jeden let na úroveň (≤ 3 lety, pod 50 ms). Text „odhad podle posledního hodu“ zůstává viditelný.
- Úrovně a cena / podmínka odemčení: od prvního nákupu.
- Proč je hra zábavnější: Smysluplná volba potřebuje předvídatelný důsledek (Compton, Meier: informace k rozhodnutí; `03 §2.5`, H). Přehyby jsou dnes nejméně čitelná volba (`README P8`, V/N). Rozpis „tvůj hod / vlaštovka“ posiluje přičitatelnost (`03 N8`, N).
- Pocit „chci a potřebuju“: Hráč vidí přesně, co mu nákup přinese **na jeho vlastním hodu**, ne abstraktní „+20 % klouzavosti“. „Potřebuju papír, protože by mi dal +59 m“ je silný a pravdivý důvod.
- Rizika a etika: Předpověď musí být pravdivá. Žádné zaokrouhlení nahoru ani „nejlepší z 10 replayů“. Pokud byl poslední hod netypický (výsledek < 50 % rekordu), použít místo něj rekordní hod a říct to. Výsledky QTE se drží, takže replay podceňuje přehyby (z minutí se v replayi nestane úspěch). Proto mají přehyby textové řádky navíc.
- Simulace: nová logika (replay s vynucenými výsledky QTE). Měřit, jak dobře předpověď sedí: korelace předpovězeného Δm se skutečným marginálním přínosem z tabulky `branchTable` a podíl případů, kdy předpověď seřadí větve stejně. Přidat novou nákupní strategii **„podle předpovědi“** (kupuje maximální předpovězené Δm na minci) a porovnat ji s rovnoměrnou. *Hypotéza:* pořadí větví předpověď trefí v ≥ 80 % případů. Strategie „podle předpovědi“ bude do 500 m stejně rychlá jako rovnoměrná (±2 hody) a přehyby bude systematicky podceňovat. Pokud je o ≥ 3 hody rychlejší, je to dominantní strategie a předpověď navádí na jediný správný postup (otázka pro uživatele).
- Náročnost implementace: M

### E11 — Konstruktér: režim s pevným rozpočtem
- Typ: Odemčení
- Kde: Bonusy
- Mechanika: Odemkne se na 500 m. Hráč si vybere jeden ze 3 rozpočtů (300 / 700 / 1 500 ◈ fiktivních mincí), v kopii stromu (s cenami `PRICES`) postaví vlaštovku, zvolí model a má 3 hody. Počítá se nejlepší z nich.
  - Hlavní strom ani peněženka se nemění. Medaile za pevné prahy dají razítko (E05) a při prvním zisku jednorázově 50 / 100 / 150 ◈ do hlavní peněženky.
  - Prahy jsou návrh z průzkumného běhu, kde se pro každý rozpočet hledala nejlepší sestava průměrného hráče (30 hodů, nejlepší úhel):
    - **300 ◈:** nejlepší sestava kluzák 2/2/0 → 405 m. Prahy bronz 330 / stříbro 400 / zlato 460 m.
    - **700 ◈:** nejlepší kluzák 3/2/2 → 572 m. Prahy 470 / 570 / 650 m.
    - **1 500 ◈:** nejlepší kluzák 4/4/2 → 839 m. Prahy 720 / 840 / 960 m.
  - **Nález z průzkumu:** v každém rozpočtu je v top 6 jen kluzák a nejlepší sestavy se liší o 3–4 %. Volba větví je tedy „rovinatá“ (dobré, rozhoduje vkus), ale volba modelu dominantní (špatné). Návrh: oddělené prahy pro šipku (≈ −12 % od kluzáku, ověřit simulací), nebo výzva „jen šipka“ (E12).
- Úrovně a cena / podmínka odemčení: od 500 m, rozpočet 1 500 ◈ až po zisku stříbra ve 700 ◈.
- Proč je hra zábavnější: Mění otázku z „jak daleko“ na „jak efektivně“. Je to horizontální výzva nad existujícím stromem (Learn 2 Fly Arcade, `03 §2.1`, `03 N6`, H/N). Z volby větví dělá skutečnou volbu, protože s malým rozpočtem nejde koupit vše rovnoměrně (`03 §2.5`, H).
- Pocit „chci a potřebuju“: Hráč má jasný a pojmenovaný cíl („zlato v 300 ◈ = 460 m“) a stavebnici, kterou zná. Přínos sestavy vidí předem (E10 funguje i tady). Medaile „chybí 22 m“ je pravdivá informace.
- Rizika a etika: Medaile nesmějí být povinné pro hlavní postup (sloty E05 jdou splnit i bez nich). Bez časového limitu, kolikrát chce. Prahy nesmějí cílit na těsné prohry (`README P10`).
- Simulace: nová logika (smyčka režimu: výběr sestavy, 3 hody, nejlepší). Měřit pravděpodobnost medaile na pokus po profilech a rozpočtech, rozdíl nejlepší sestavy šipky a kluzáku a počet sestav do 5 % od optima (míra zajímavosti volby). *Hypotéza:* průměrný hráč získá stříbro ve 300 ◈ za 2–4 pokusy, zlato za 6–12. Slabý zlato v 1 500 ◈ v < 10 % pokusů (přijatelné, je to výzva). Kluzák zůstane dominantní, dokud nebudou prahy podle modelu.
- Náročnost implementace: M

### E12 — Výzvy s omezením (stálá nabídka)
- Typ: Odemčení
- Kde: Bonusy, Výsledek
- Mechanika: Pevný seznam 8 výzev je vidět celý najednou, nic neexpiruje a nic se nelosuje. Za každou dá hráč 1 razítko a jednorázově pevné mince. Hra splnění kontroluje po `settle()` z dat letu.
  1. **Bez dotyku:** 350 m bez jediného vstupu do QTE. 60 ◈, od 100 m.
  2. **Tři hvězdy:** 3 perfektní zásahy v jednom letu. 60 ◈, od 100 m.
  3. **Lehká ruka:** síla ≤ 50 % a dolet ≥ 350 m. Pomáhá odpuštění z přehybů. 80 ◈, od 500 m.
  4. **Nízký let:** úhel ≤ 12° a dolet ≥ 400 m. 80 ◈, od 500 m.
  5. **Přesně do cíle:** přistát mezi 495 a 505 m. 100 ◈, od 500 m.
  6. **Jen šipka:** 700 m šipkou. 120 ◈, od 500 m.
  7. **Holubí pošta:** 2 holubi perfektně v jednom letu. 80 ◈, od 500 m.
  8. **Skromná vlaštovka:** 600 m, když součet úrovní ≤ 6. Hráč si v Dílně může dočasně „sklopit“ úrovně (přepínač „výzvové nastavení“, nic se neprodává ani neztrácí). 150 ◈, od 500 m.
  - Celkem 730 ◈ a 8 razítek. Prahy kalibrovat tak, aby průměrný hráč splnil výzvu s pravděpodobností 15–40 % na pokus.
- Úrovně a cena / podmínka odemčení: viz seznam.
- Proč je hra zábavnější: Nové podmínky místo užších oken pro zkušeného hráče (`README P14`, `04 N10`, V/N). Výzvy vrací k jiné výzvě (stará KB K7). Achievementy střídmě, s jasnou logikou splnění (Hamari & Eranti, `08`, H) a nepovinné (`08 N8`).
- Pocit „chci a potřebuju“: Každá výzva učí jednu dovednost, kterou kampaň skrývá (nízký úhel, slabý hod s přehyby, přesné přistání). Hráč vidí podmínku i odměnu předem a ví, proč selhal („přistál jsi na 512 m“).
- Rizika a etika: Riziko povinnosti a „checklistu“ (`08 N8`). Proto výzvy nejsou potřeba k hlavnímu postupu, nemají pořadí a nemají časový limit. Výzva 5 (přesné přistání) je nejblíž near-miss smyčce, ale kontrolu má hráč a hlásí se jen pravdivá odchylka. Výzva 8 nesmí vypadat jako ztráta úrovní: přepínač je vratný jedním klepnutím.
- Simulace: nová logika (podmínky z letu a strategie bota pro každou výzvu, např. míření na cílový dolet). Měřit pravděpodobnost splnění na pokus po profilech, počet pokusů do splnění a výzvy, které slabý hráč do 100 pokusů nesplní. *Hypotéza:* výzvy 1, 2 a 7 průměrný hráč splní za 2–6 pokusů, výzva 5 za 8–20 (bez ovládání přistání může být příliš těžká, pak rozšířit na ±15 m), výzva 6 vyžaduje plnou sílu a papír. Žádná výzva nesmí mít u slabého hráče s plným stromem pravděpodobnost < 3 % na pokus.
- Náročnost implementace: M

### E13 — Zakázky: doruč dopis do zóny
- Typ: Systém
- Kde: Bonusy, Let, Výsledek
- Mechanika: Odemkne se na 500 m. Tabule ukazuje 3 zakázky, například „Doruč dopis na Tržnici: přistaň mezi 380 a 420 m“.
  - Zóna je široká 40 m a během letu je vidět jako pruh na zemi. Odměna je pevná: `30 + ⌊střed zóny / 10⌋` ◈ (400 m → 70 ◈).
  - Zakázky se generují deterministicky z čísla dokončené zakázky (seed = počet splněných), ne z času. Pořadí je pevné pro všechny hráče a nic nevyprší.
  - Hráč může kteroukoli zakázku zdarma vyměnit za další v pořadí. Zóny se pohybují v rozsahu 40–90 % jeho rekordu.
  - Odměna se vyplácí místo běžné odměny za dolet, ne navíc. Rekord a objev se počítají normálně.
- Úrovně a cena / podmínka odemčení: od 500 m, nekonečný seznam bez povinnosti.
- Proč je hra zábavnější: Přidává novou dovednostní osu, ovládání doletu místo maxima. Na tu dnes hra nemá důvod. Odpovídá „vrstvení odměn“ a trefám objektů v LtF2 (`03 §2.1`, H). Nejistota je ve výsledku dovednosti, ne ve výplatě (`02 §2.7` bod 3).
- Pocit „chci a potřebuju“: Po 500 m, kdy jsou lety dlouhé a rekordy vzácné, nabídnou zakázky kratší a rychlejší hody s jasným cílem. Odměna se dá porovnat s „hodem naplno“ předem.
- Rizika a etika: Nesmí to být nekonečný sink času jen kvůli retenci (`02 N6`). Proto žádné série zakázek, žádné bonusy za „5 v řadě“ a odchod nic nestojí. Zakázky nesmějí vydělávat víc mincí za minutu než hod naplno, jinak se z nich stane dominantní farma.
- Simulace: nová logika (bot míří na cílový dolet, učí se mapu „úhel × síla → dolet“). Měřit pravděpodobnost zásahu zóny na pokus a mince za minutu oproti hodu naplno se stejnými úrovněmi. *Hypotéza:* průměrný hráč trefí 40m zónu v 15–30 % pokusů. Mince za minutu ze zakázek vyjdou na 50–80 % hodu naplno, zakázka je tedy volba pro zábavu, ne farma. Pokud vyjde > 100 %, snížit základ 30 ◈.
- Náročnost implementace: M

### E14 — Konec kapitoly a pohlednice (odměna za přirozené ukončení)
- Typ: Systém
- Kde: Výsledek, Bonusy
- Mechanika: Na „uzlech“ (500 m, první místo nové čtvrti, plná větev, splněná výzva) má výsledková obrazovka variantu **Konec kapitoly**.
  - Obsah: shrnutí („Kapitola 1 za 21 hodů a 11 min · nejlepší 512 m · 38 perfektních zásahů“), potvrzení „Postup je uložený“ a dvě rovnocenná tlačítka „Hrát dál“ a „Uložit a skončit“, stejně velká, „Hrát dál“ bez zvýraznění.
  - Za dosažení uzlu (ne za odchod) dostane hráč **pohlednici**: kartu s vykresleným místem, datem a statistikou kapitoly. Ukládá se do alba v Bonusech. Je to kosmetika bez herní hodnoty a dá se sdílet jako obrázek.
  - „Uložit a skončit“ zobrazí klidnou závěrečnou obrazovku s pohlednicí a bez výzvy k návratu.
  - **Zamítnutá varianta B, „Odpočatý papír“** (+25 % mincí za první 3 hody další session po pauze ≥ 30 min): nic sice nepropadá, ale odměňuje návrat a ten je návratovou pákou (`09 §2.2`: nátlak vzniká, když nevrácení něco stojí. Tady nic nestojí, ale odměna za pauzu a návrat se snadno přetaví v „vrať se pro bonus“). Navíc potřebuje hodiny reálného času. Ponechat nanejvýš jako testovanou variantu, nedoporučuji.
- Úrovně a cena / podmínka odemčení: od 500 m (první uzel).
- Proč je hra zábavnější: Konec po vrcholu je přirozený bod zastavení (Axon, `09 §2.1`, `09 N2`, V). Dobrý bod zastavení uzavírá, shrnuje, ukazuje „příště“ bez tlaku a ukládá (`09 §2.3`, H). Chybějící „poplácání po zádech“ je nejčastější kritika žánru (`03 N11`, H). ICO std. 5: neutrální nabídka pokračování a přestávka bez ztráty (`02 §2.9`, H).
- Pocit „chci a potřebuju“: Hráč dostane hmatatelné uzavření („mám pohlednici z Tržnice“) a album s prázdnými rámečky dalších kapitol. Chce se vrátit kvůli obsahu, ne kvůli bonusu.
- Rizika a etika: Pohlednice musí jít dostat i při „Hrát dál“, jinak by odměňovala odchod a hráč by odcházel jen kvůli ní. Sdílení bez výzvy k soutěži (`09 N4`). Žádný text typu „vrať se zítra“.
- Simulace: nesimulovatelné (jen playtest). Měřit podíl odchodů na uzlu proti odchodům jinde (kontext ukončení, `09 §2.10`), dobrovolné hody po 500 m a otázku lítosti „Hrál/a jsi déle, než jsi chtěl/a?“ (`03 N1`). *Hypotéza:* vyšší podíl odchodů na uzlech bez nárůstu lítosti a beze změny dobrovolného pokračování.
- Náročnost implementace: M (pohlednice jako render místa do malého canvasu), S bez pohlednice

### E15 — Započítaný pokrok (poctivý umělý náskok)
- Typ: Systém
- Kde: Výsledek, Dílna, Bonusy
- Mechanika: Náskok se zobrazí jen tam, kde jde o **skutečný** pokrok, který existující ukazatel zatím nezapočítal:
  1. Pruh kapitoly 2 začíná na `rekord / 1 219 m` (typicky 41–45 %), ne na nule. Metry hráč opravdu uletěl (`03 N4`).
  2. Atlas (E05) ukazuje po prvním hodu 1/16 (místo 0 hráč skutečně proletěl).
  3. Pruh cíle nákupu (E09) počítá i mince, které hráč měl před připnutím.
  4. Volitelně „drobné v kapse“: start s 10 ◈ a textem „Do začátku 10 ◈ z kapsy“. Nákup 35 ◈ je pak možný po prvním hodu (průměrně 30–35 ◈) místo po druhém. Je to dar a hra ho tak i pojmenuje.
  - **Zakázáno:** předtištěná razítka bez objevu, „bonusové metry“ v pruhu a pruh, který začíná nad skutečným stavem.
- Úrovně a cena / podmínka odemčení: od začátku a od 500 m.
- Proč je hra zábavnější: Obdarovaný pokrok urychluje dokončení (Nunes & Drèze: 34 % proti 19 %; Kivetz: 12,7 proti 15,6 dne; `03 §2.3`, V). Účinku stačí jakékoli zdůvodnění, pravdivost je naše etická volba (`README P13`, V/N). Prvních 5 hodů rozhoduje o většině webových návštěvníků (`09 N1`, V/N), proto bod 4.
- Pocit „chci a potřebuju“: Nová kapitola nezačíná od nuly („jsem už ve 42 %“), takže cíl je psychologicky blíž. U bodu 4 nastane první nákup po prvním hodu, tedy rychlé „aha, za mince je let lepší“.
- Rizika a etika: Hranici mezi přívětivostí a trikem data nevedou (`03 §3` bod 3). Proto tvrdé pravidlo: pruh nikdy neukazuje víc, než hráč udělal, a dar se jmenuje dar. Bod 4 je jediný skutečný dar a je malý (10 ◈).
- Simulace: bod 4 jen parametr (`fresh().coins = 10`), body 1–3 nesimulovatelné (prezentace). Měřit hod prvního nákupu a hody do 500 m. *Hypotéza:* první nákup se posune z 2. na 1. hod u ≥ 60 % průměrných hráčů. Hody do 500 m −0 až −1. Body 1–3 ověřit v playtestu: hráč umí říct, kolik mu chybí do kapitoly.
- Náročnost implementace: S

### E16 — Nový arch papíru (volitelná prestiž)
- Typ: Systém
- Kde: Bonusy, Dílna
- Mechanika: Volitelný restart, dostupný až po dosažení cíle kapitoly 2 (1 219 m) nebo s plným stromem.
  - Restart vynuluje úrovně a mince. Zachová rekord, objevy, razítka, pohlednice, kosmetiku, odemčený kluzák a deník.
  - Trvalý bonus „vodoznak“: každý arch přidá +10 % ke všem mincím (aditivně, nejvýš 3 archy, tedy +30 %). Výpočet `R · (1 + 0,1 · archy)`, zaokrouhleno dolů.
  - Nový běh má vlastní cíl: dojít k 500 m za co nejméně hodů (deník, E17).
  - Hra ukáže potvrzení s přesným seznamem toho, co se vynuluje a co zůstane. Restart nikdy nenabízí sama, je jen v Bonusech.
- Úrovně a cena / podmínka odemčení: 1 219 m nebo plný strom. Max 3 archy.
- Proč je hra zábavnější: Prestiž je standardní odpověď na „konec křivky“ a obdoba NG+ (Pecorella, Alharthi; `03 §2.6`, H/V). Pro krátkou hru ale nemáme doklad přínosu (`03 §3` bod 5) a `03 N10` doporučuje „prestiž zatím ne“, nanejvýš jako volitelný restart. **Moje hodnocení:** do 12minutové hry se hodí jen jako „hraj znovu lépe“ (skóre efektivity), ne jako motor růstu. Proto malý bonus a strop 3.
- Pocit „chci a potřebuju“: Hráč, který zná úhly a QTE, chce zjistit, jak rychle to dá znovu. Vodoznak +10 % je viditelný slib („tentokrát rychleji“), ale nerozhoduje. Rozhoduje dovednost.
- Rizika a etika: Reset může působit jako ztráta (`03 §2.6` omezení, `02 §2.5`), proto jen dobrovolně, s výpisem a nic neztrácející (vše nečíselné zůstává). Pozor na pravidlo Pecorelly „reset při +50–200 %“: +10 % je pod ním záměrně, aby restart nebyl ekonomicky „nutný“. Nesmí vzniknout nekonečný treadmill (strop 3).
- Simulace: nová logika (kampaň s počátečním bonusem a hráčem, který už zná úhel: inicializovaná mapa úhlů). Měřit hody do 500 m v archu 1–3 proti prvnímu běhu a rozložit zisk na „ekonomika“ a „naučený úhel“. *Hypotéza:* arch 1 průměrný ~16–18 hodů místo 21. Zhruba 3 hody z toho dá naučený úhel, ~1 hod vodoznak. Pokud vodoznak dává < 1 hod, je jen kosmetický a lze ho nahradit pohlednicí archu.
- Náročnost implementace: M

### E17 — Deník kampaně (skóre efektivity)
- Typ: Systém
- Kde: Výsledek, Bonusy
- Mechanika: Při dosažení 500 m (a cíle každé kapitoly) zapíše hra do deníku počet hodů, minuty, perfektní zásahy a nákupy.
  - Hodnocení je vlídné a pevné, bez posměchu. Pásma podle průzkumného běhu (P50 slabý 28, průměrný 21, dobrý 18): ≤ 16 hodů „Sokol“, ≤ 22 „Rorýs“, ≤ 30 „Vlaštovka“, nad 30 „Vytrvalá vlaštovka“.
  - Osobní nejlepší se porovnává jen se sebou (archy E16). Žádný globální žebříček.
- Úrovně a cena / podmínka odemčení: od 500 m.
- Proč je hra zábavnější: LtF1 počítá „dny“ do cíle a hráči je porovnávají, takže skóre efektivity dává důvod hrát znovu (`03 §2.1`, `03 N5`, H). Srovnání se sebou místo s ostatními (`09 N3`, V/N) odměňuje dovednost, ne nákupy (`README P7`).
- Pocit „chci a potřebuju“: „Rorýs za 21 hodů, Sokol od 16.“ Hráč vidí konkrétní hranici a ví, čím ji zlepší (úhel, perfekty).
- Rizika a etika: Tlak na dokonalost, proto nejnižší pásmo pozitivní a bez trestu. Bez sdílení „pod průměrem“. Pásma kalibrovat tak, aby slabý hráč „Vlaštovku“ dostal v ≥ 60 % kampaní.
- Simulace: jen parametr a výstup (rozdělení hodů do 500 m už simulátor má). Měřit podíl profilů v pásmech. *Hypotéza:* slabý 60–70 % „Vlaštovka“, průměrný ~50 % „Rorýs“, dobrý ~30 % „Sokol“. Upravit hranice podle P50 z hlavní simulace.
- Náročnost implementace: S

### E18 — Alternativní cenové křivky
- Typ: Systém
- Kde: Dílna
- Mechanika: Čtyři varianty k porovnání s dneškem (A = `[35, 105, 195, 300, 420]`, větev 1 055, strom 3 165):
  - **B, trojúhelníková (Schreiber):** `[30, 90, 180, 300, 450]`, strom 3 150. Levnější začátek, dražší úroveň 5.
  - **C, kapitolová (pro E06):** `[25, 75, 140 | 330, 520]`, strom 3 270. Kapitola 1 stojí 720 (strop úrovně 3), kapitola 2 stojí 2 550 a je pro ni horší než A.
  - **D, globální podle pořadí nákupu:** cena *k*-tého nákupu kamkoli je `≈ 13,3 · k^1,3`, zaokrouhleno na 5: `15, 35, 55, 80, 110, 135, 165, 200, 230, 265, 300, 335, 375, 410, 450` (součet 3 160, prvních 8 nákupů 795 ◈). Cena nezávisí na větvi, takže volba je čistě o účinku a odpadá strategie „nejlevnější“.
  - **E, A s mírnou slevou přehybů:** přehyby `[30, 90, 165, 255, 355]` (−15 %), kompenzace slabší větve, pokud E04 a E10 nestačí.
- Úrovně a cena / podmínka odemčení: varianty se vzájemně vylučují.
- Proč je hra zábavnější: Tempo určuje poměr růstu příjmu a růstu ceny. Rané úrovně mají přijít rychle a pozdější pomaleji (Schreiber, Pecorella; `03 §2.2`, `03 N9`, H). Volba nemá mít zjevně nejlepší možnost (`03 §2.5`, H).
- Pocit „chci a potřebuju“: U D hráč přestane počítat, „co je levnější“, a ptá se jen, „co chci“. Cena dalšího nákupu je vždy jedna, vidět předem. U C je kapitola 1 rychlá a kapitola 2 má váhu.
- Rizika a etika: **D má riziko dominance:** síla 1–5 by stála jen 295 ◈ (dnes 1 055), takže specializace výrazně zlevní a „síla napřed“ může začít vyhrávat. Simulace to musí vyloučit, než se D zvolí. U všech variant hlídat slabého hráče.
- Simulace: jen parametr (D vyžaduje drobnou změnu `buy()`: cena podle součtu úrovní). Měřit hody do 500 m po profilech a nákupních strategiích, rozptyl mezi strategiemi (max − min hodů, cíl ≤ dnešní) a nejdelší mezeru mezi nákupy. *Hypotéza:* B ≈ A do 500 m (±1 hod), rychlejší první nákupy. C s E06 −1 až −2 hody do 500 m, kapitola 2 +3 až +5 hodů proti E06 A. D do 500 m ≈ A, ale „síla napřed“ se z 29 hodů zlepší na ~22–24 a může být dominantní. E zkrátí „přehyby napřed“ o 2–4 hody.
- Náročnost implementace: S (A–C, E), S–M (D)

### E19 — Vzory papíru a stopy za mince (přiznaný kosmetický sink)
- Typ: Kosmetika
- Kde: Dílna (záložka „Vzhled“), Bonusy
- Mechanika: Konečný katalog bez náhody a bez rotace nabídky, vše vidět od začátku s cenou. Kosmetika nemění `parameters()`.
  - **8 vzorů papíru:** Noviny 120, Notový papír 160, Milimetrový 200, Účtenka 240, Mapa města (za 14 razítek, E05) 0, Origami 320, Neonový 400, Zlatá fólie 480.
  - **6 barev stopy:** 80–200 ◈.
  - Celkem ~2 500 ◈. Odemčení od 500 m, aby kosmetika nekonkurovala vylepšením v kapitole 1.
- Úrovně a cena / podmínka odemčení: od 500 m, jednorázové nákupy.
- Proč je hra zábavnější: Horizontální využití mincí místo dalšího vertikálního růstu (`03 N2` alternativa, `03 §2.4`, H). Konečný sink, ne nekonečný. `02 N6` varuje před vymýšlením nekonečného sinku jen kvůli retenci, a katalog má konec.
- Pocit „chci a potřebuju“: „Potřebuju“ tu není, je jen „chci“: vlastní vlaštovka a vidět svou volbu na každém hodu. Náhled vzoru na letadle před nákupem.
- Rizika a etika: Žádné časově omezené nabídky, žádná vzácnost a žádné „jen dnes“ (`02 §4.3` bod 7). Žádný vzor za náhodu. Pokud uživatel nechce sink, platí alternativa z `02 N6`: přiznat, že mince po dokončení ztratily využití, a skrýt je.
- Simulace: jen parametr (sink v ekonomice). Měřit zůstatek mincí po 500 m v čase a podíl hodů, kdy má hráč > 300 ◈ bez cíle. *Hypotéza:* s E06 a E19 nepřesáhne nevyužitý zůstatek 300 ◈ po víc než 5 hodů po sobě, dokud není katalog nebo strom hotový. Kosmetika se kupuje až po úrovních (racionální bot), takže v simulaci posune jen konec sinku.
- Náročnost implementace: M (vykreslení vzorů ve 4 tématech)

---

## 2. Vazby mezi kartami

| Kombinace | Vztah |
|---|---|
| E01 + E02 + E03 + E04 | jeden balík „účtenka“. Rozpočtová neutralita se počítá dohromady |
| E06 + E08 + E15 + E14 | jádro řešení „po 500 m“: zámek úrovní 4–5, kapitola 2 s blízkými zastávkami, poctivý náskok, klidné uzavření |
| E06 × E18 C | C je ceník navržený pro E06. E18 D se s E06 nekombinuje (globální cena nezná kapitoly) |
| E09 + E10 | náhled nákupu: kolik chybí a co to přinese |
| E05 ← E03, E11, E12 | razítka sbírají objevy a výzvy a odemykají sloty Bonusů |
| E16 + E17 | prestiž bez deníku nemá smysl, deník funguje i bez prestiže |
| E07 × tlačítko zrychlení | vzájemně se vylučují (viz E07) |
| E13 × E19 | zakázky přidávají příjem po 500 m, takže potřebují sink (E06, E07, E19) |

**Doporučené jádro k první simulaci:** E01–E04 (s rozpočtovou neutralitou), E06 (obě varianty cen), E08, E09, E10 a E15 bod 4. Režimy E11–E13 a E16 až potom.

---

## 3. Doporučení pro simulačního agenta

### 3.1 Úpravy simulátoru (bez zásahu do `src/`)
- **Pokračování po 500 m:** kampaň ukončit pravidlem „cíl kapitoly 2, nebo plný strom, nebo 120 hodů“, ne už na 500 m. Bez toho nejde měřit nic z E06–E08, E13 a E19.
- **Háček na odměnu:** místo `rewardMul` funkce `reward(f, p, ctx)`, kde `ctx` obsahuje předchozí rekord, objevená místa a `eventStats`. Pokryje E01–E04 a E16.
- **Háček na nákup:** strop úrovně podle stavu (E06), globální cena (E18 D) a nová strategie „podle předpovědi“ (E10).
- **Čas letu:** UI_SECONDS zůstává 8 s, ale po 500 m hlásit zvlášť sekundy letu na hod (průzkum: ~60 s), protože E07 mění minuty, ne hody.
- Známý problém: RNG streamy simulace se překrývají (CLAUDE.md). Pro párová srovnání karet používat common random numbers jako dnes.

### 3.2 Metriky napříč všemi bonusy
1. **Hody a minuty k cílům:** 100 m, 500 m, 610 / 914 / 1 219 m a plný strom (P10 / P50 / P90 po profilech). Cíl: průměrný hráč 500 m za 18–25 hodů a 10–15 min (dnešní rámec). Kapitola 2 má mít cílovou délku od uživatele.
2. **Intervaly mezi „událostmi pokroku“:** událost = nákup, nové místo, razítko nebo rekord o ≥ 5 %. Rozdělení intervalů a **mrtvá místa** = ≥ 6 hodů po sobě bez události. Hlásit podíl kampaní s aspoň jedním mrtvým místem, zvlášť před a po 500 m. Průzkum: medián nejdelší mezery mezi nákupy je dnes 4 hody před 500 m a 6 po něm.
3. **Tempo nákupů:** hod prvního nákupu, nákupy za 10 hodů a podíl stavů, kdy hráči do nejbližšího nákupu chybí ≥ 2 hody příjmu (kontrola E09 a K5).
4. **Zůstatek mincí:** při 500 m, průměrný nevyužitý zůstatek nad cenou nejbližšího nákupu a nejdelší úsek s > 300 ◈ bez cíle.
5. **Podíl nevyužitého stromu:** `1 − utraceno / cena stromu` při 500 m a na konci kapitoly 2. Dnes ~80 % při 500 m u průměrného hráče. Cíl s E06: ≤ 20 % při 500 m (z nabídky kapitoly 1).
6. **Rozklad příjmu:** podíl doletu, startovného, rekordu, místa, perfektů, zakázek a výzev. Kontrola, že startovné je < 20 % příjmu (E01, `02 N1`).
7. **Dominantní strategie:** rozdíl hodů mezi nejlepší a nejhorší nákupní strategií (dnes rovnoměrně 28 proti přehyby napřed 46 v průměru přes úhly) a test nových strategií („podle předpovědi“, „síla napřed“ při E18 D). Varovný práh: jedna strategie je o ≥ 3 hody lepší než všechny ostatní ve všech profilech. V Konstruktéru (E11) počet sestav do 5 % od optima a rozdíl šipka/kluzák. V průzkumu je v top 6 všude jen kluzák.
8. **Rozdíl slabý a průměrný:** poměr hodů do 500 m (dnes ~1,33). Hlídat, aby E04 (perfekty) ani E12 (výzvy) poměr nezvýšily nad 1,4.
9. **Citlivost na QTE:** každý scénář zopakovat se sníženou úspěšností QTE (např. šum σ × 1,5), protože E04 a E12 na ní stojí víc než dnešek.
10. **Délka letu:** sekundy na hod po 500 m a podíl hodů delších než 90 s (E07, E08).

### 3.3 Co simulace neověří (jen playtest)
E09 (porozumění pruhu a K5), E14 (odchod na uzlu, lítost), E15 body 1–3 (vnímání náskoku), E19 (zda hráči kosmetiku chtějí) a obecně „chci a potřebuju“. Tam navrhuji otázky z `02 §4.4` a `09 §4.1`: „Proč pokračuješ?“, „Hrál/a jsi déle, než jsi chtěl/a?“, „Umíš vysvětlit, proč jsi dostal tolik mincí?“.

---

## 4. Otázky pro uživatele

1. **Mince po 500 m: sink, nebo přiznání?** KB `02 N6` radí raději přiznat, že mince ztratily využití, než vymýšlet sink. Já navrhuji konečné sinky (E06, E07, E19). Které platí?
2. **Má hra mít kapitolu 2 a jak dlouhou?** Dohrát dnešní strom po 500 m trvá ~31 hodů a ~31 min. Je cíl spíš +10–15 min (E06 B, E18 C), nebo krátký epilog?
3. **Trasa za ~1,4 km:** s plným stromem hráč nedoletí dál než na začátek Doků. Má se strom rozšířit (úrovně 6+, nový růst), nebo zůstanou vzdálená místa jen „pohledem do dálky“ (siluety v atlase)?
4. **Razítka jako druhá „měna“, která se neutrácí** (prahy pro sloty Bonusů): souhlas? Nebo mají sloty Bonusů kupovat mince?
5. **Snížit startovné z 10 na 5** (s minimem 20 ◈ za hod) výměnou za odměny za rekord, místo a perfekty: ano, nebo nechat 10 a přecenit?
6. **Prestiž (E16):** chceš ji vůbec? Moje doporučení je „až po playtestu kapitoly 2“, nanejvýš jako NG+ se skóre hodů.
7. **Předpověď nákupu (E10)** může navést na jedinou správnou strategii. Je to v pořádku (transparentnost), nebo má zůstat prostor pro objevování?
8. **Kosmetika za mince (E19)** ve 4 vizuálních stylech znamená vykreslit každý vzor čtyřikrát. Stojí to za to?
9. **K5 proti `02 N5`:** souhlasíš s řešením „chybí X ◈ + poslední hod +Y ◈, bez počtu hodů“?
10. **Konstruktér (E11):** oddělené prahy pro šipku, nebo přijmout, že v režimu s rozpočtem vládne kluzák?
