# 04 — Svět, trasa, cíle a sbírky

**Založeno 13. 10. 2026.** Úhel pohledu: bonusy a vylepšení, které vycházejí z trasy 16 míst ve 4 čtvrtích (`src/scenes.js`). Řeší známé problémy z `CLAUDE.md`: cíl 500 m pokryje jen 2 ze 16 míst, po 500 m nic nenavazuje, mince nemají využití, málo humoru a obsahu. Formát karet je podle `00-zadani.md`. Kód se neměnil.

**Štítky:** V výzkumný poznatek · H heuristika oboru · N naše hypotéza. Odkazy `08 N1` = blok `research/kb/08-cile-zvedavost.md`, implikace N1. `02 §4.3/3` = blok 02, seznam „ne“, bod 3. `P3` = průřezové zjištění v `research/kb/README.md`.

---

## 0. Výchozí fakta, ze kterých karty vycházejí

### 0.1 Trasa (1 místo = 640 px / 2,1 px/m = 304,76 m)

| # | Místo | Úsek (m) | Čtvrť |
|---:|---|---|---|
| 0 | Dílna a první střechy | 0–305 | Fialové předměstí |
| 1 | Tržnice pod anténami | 305–610 | Fialové předměstí |
| 2 | Zahrady na okraji | 610–914 | Fialové předměstí |
| 3 | Železnice k řece | 914–1 219 | Fialové předměstí |
| 4 | Skladiště u vody | 1 219–1 524 | Měsíční doky |
| 5 | Les přístavních jeřábů | 1 524–1 829 | Měsíční doky |
| 6 | Most přes záliv | 1 829–2 133 | Měsíční doky |
| 7 | Maják na konci mola | 2 133–2 438 | Měsíční doky |
| 8 | Pole za zálivem | 2 438–2 743 | Rudý horizont |
| 9 | Větrný hřeben | 2 743–3 048 | Rudý horizont |
| 10 | Horské sedlo | 3 048–3 352 | Rudý horizont |
| 11 | Observatoř nad údolím | 3 352–3 657 | Rudý horizont |
| 12 | Brány metropole | 3 657–3 962 | Neonové jádro |
| 13 | Zahrady ve výškách | 3 962–4 267 | Neonové jádro |
| 14 | Vysílací věž | 4 267–4 571 | Neonové jádro |
| 15 | Střešní přístav | 4 571–4 876 | Neonové jádro |

### 0.2 Klíčové zjištění: trasa za ~1 km je dnes fyzicky nedosažitelná
Podle `simulation/MONTE-CARLO.md` (marginální vliv větví, průměrný hráč) je průměrný dolet s plným stromem (úroveň 5 ve všem, 3 165 mincí) **731 m šipkou a 918 m kluzákem**. Ani maximálně vylepšená vlaštovka tedy z Dílny průměrně nedoletí za *Zahrady na okraji* (místo 2) a 12 ze 16 míst (*Skladiště* až *Střešní přístav*) zůstává jen kulisou. Nafouknout vylepšení tak, aby šipka doletěla 4,9 km, by rozbilo ekonomiku i čitelnost. Proto je páteří tohoto návrhu **štafeta poštovních schránek** (SV05): hod lze začít z dříve dosaženého místa. Teprve s ní dávají smysl zakázky, sbírky a místní vlastnosti v docích, na hřebeni nebo na mostě.

### 0.3 Hrubý odhad štafety (pomocný skript mimo projekt, ne náhrada Monte Carla)
Skript ve scratchpadu (`relay.mjs`) použil `createFlight/step/eventInput` ze `src/` beze změn, botí profily dovednosti z `monte-carlo.mjs`, rovnoměrný nákup a **optimistický** úhel (`bestAngle` + šum profilu, kluzák od 100 m). Do 500 m mu proto vychází méně hodů než Monte Carlu (průměrný hráč 12 proti 23). Relativní srovnání variant ale platí. 40 kampaní na profil, medián hodů:

| Varianta schránek | průměrný: 610 m / 1 219 m / 2 438 m / 4 876 m | slabý: 4 876 m | Minuty do 4 876 m (průměrný) |
|---|---|---|---|
| každé místo | 13 / 15 / 18 / 22 | 29 | 20,0 |
| **každé 2. místo (návrh)** | 15 / 18 / 20 / 24 | 34 | 23,3 |
| jen začátky čtvrtí (každé 4.) | 15 / 43 / 45 / 47 | 60 | 66,4 |

Závěry pro karty: (a) schránky po čtvrtích znamenají grind (úsek 1 219 m je nad průměrným doletem plného stromu), (b) schránky po dvou místech dávají ~1 nové místo až 2 na hod, (c) na konci trasy má průměrný bot součet úrovní ~10 z 15, takže **mince mají smysl až do konce trasy** (zbytek stromu), (d) let s plným stromem trvá kolem minuty, celá trasa tak přidá zhruba 10–12 minut hraní.

### 0.4 Rozpočet mincí navržených karet
Celý strom stojí 3 165 mincí. Karty v tomto dokumentu přidávají pevné (nikdy náhodné) odměny: objev míst 900, známky 320, zakázky 705, výzvy 440, celkem ~2 365. To je příliš, pokud by se zavedlo všechno: první úkol Monte Carla je změřit, zda zrychlení stromu nezkrátí trasu pod ~15 hodů za 500 m (viz Otázky, bod 3).

---

## 1. Páteř: kam dál po 500 m

### SV01 — Atlas 16 míst (sbírka pohlednic)
- Typ: Systém
- Kde: Bonusy | Výsledek
- Mechanika: Stránka `bonus.html` (dnes prázdná) se stane Atlasem: mřížka 4 × 4 = čtvrti × místa. Pohlednice místa *i* se odkryje, když `best ≥ i·304,76 m` poprvé (místo 0 je odkryté od začátku). Odkrytá pohlednice ukazuje název, vlastní kresbu místa (výřez z `drawPlace`), příběh z `ROUTE[i].story`, místní vlastnost (SV07–SV10), sloty pro známku (SV11) a zakázku (SV06). Neodkrytá ukazuje siluetu a „???“, kromě **nejbližšího** neodkrytého místa, které ukazuje název a teaser (SV03). U každé čtvrti počitadlo „3/4 Fialové předměstí“, nahoře „7/16 míst“. Žádná nová pole `parameters()`; save +`places:[bool×16]` (dá se odvodit z `best`, ale se štafetou SV05 je `best` absolutní, takže stačí odvozovat).
- Úrovně a cena / podmínka odemčení: Zdarma, roste s objevy. 16 pohlednic, 4 sady.
- Proč je hra zábavnější: Viditelná struktura sbírky a blízkost dokončení zvyšují ochotu přidávat položky (08 §3.8, Cao 2025, Ruan 2024 — V). Sbírané položky jsou zážitky, ne inventář (08 N7 — N). Landmarky jako paměťová kotva „kam až jsem doletěl“ (08 §3.7, Ruddle 2011 — V/N). Rámující fikce zvyšuje účinek cílů (08 §3.2, Sailer & Homner 2020 — V).
- Pocit „chci a potřebuju“: Hráč vidí mřížku s prázdnými místy a jedno pojmenované místo, které je „hned za rohem“. Struktura „3/4“ dělá z posledního místa čtvrti cíl s vlastní hodnotou (efekt jednoho kroku od cíle). Přínos vidí předem: siluetu, název nejbližšího místa a to, že pohlednice přináší nálezné (SV02) a otevírá schránku (SV05).
- Rizika a etika: Sbírka nesmí být podmínkou postupu ani obsahovat položky jen pro grind (08 N7, 02 §2.8 Zagal). Neukazovat vzdálená místa jako aktivní cíl (08 N2). Žádné „chybí ti 9 míst!“ — počitadlo je informace, ne výčitka (02 N10).
- Simulace: Měřit rozložení objevených míst po N hodech (histogram indexů 0–15) a medián hodů mezi objevy. Hypotéza: s SV05 objeví průměrný hráč nové místo v průměru každé 1–2 hody za 500 m, bez SV05 objeví nejvýš 3 místa. Nárok: nová logika (kampaň pokračuje za 500 m, záznam prvního dosažení každého místa). Atraktivitu atlasu samotného jen playtest.
- Náročnost implementace: M

### SV02 — Nálezné za objev místa
- Typ: Systém
- Kde: Výsledek
- Mechanika: Při prvním dosažení místa *i* (*i* = 1…15) přičte `settle()` jednorázově `20 + 5·i` mincí (Tržnice 25, Zahrady 30 … Střešní přístav 95, součet 900). Ve výsledku samostatný řádek „Nové místo: Zahrady na okraji · nálezné +30 ◈“. Odměna je deterministická, nezávisí na štěstí, jen na dosažené vzdálenosti.
- Úrovně a cena / podmínka odemčení: Automaticky, jednou za místo.
- Proč je hra zábavnější: Mince jako informace o výkonu, ne mzda (02 N1, P12 — V/N). Intenzita oslavy kopíruje hodnotu výsledku: nové místo je víc než běžný hod (02 N3, Dixon 2010 — V). Odměna navázaná na objev podporuje zvědavost jako motor dalšího pokusu (P3 — V).
- Pocit „chci a potřebuju“: „Za Zahradami čeká +30 a nová pohlednice.“ Částka je vidět předem v atlasu (SV01) i v HUD cíli (SV03), takže hráč ví, co hod může přinést, a mince dostávají pocit pokroku k dalšímu nákupu.
- Rizika a etika: Pevná částka, žádný „bonus navíc“ ani náhodný násobič (02 §4.3/1). Nevázat na čas ani na počet pokusů. Riziko: zrychlí strom (viz 0.4).
- Simulace: Hypotéza z pomocného skriptu: nálezné 20 + 5·i zkrátí cestu na konec trasy o ~1 hod (průměrný 24 → 23, slabý 34 → 31), do 500 m beze změny (objevy před 500 m jsou jen Tržnice). Měřit: hody a minuty do 610 / 1 219 / 4 876 m, úrovně stromu na konci trasy. Nárok: jen nová jednoduchá logika v `settle` (simulátor ji snadno přidá).
- Náročnost implementace: S

### SV03 — Nejbližší místo jako cíl (teaser jedné věty)
- Typ: Systém
- Kde: Let | Výsledek
- Mechanika: HUD i výsledek ukazují vždy jen **jeden** aktivní cíl: nejbližší neobjevené místo. Za letu: „Do Zahrad na okraji 63 m“. Ve výsledku: „Chybělo 41 m do Zahrad na okraji“ (jen ze skutečného letu, žádné zaokrouhlení ve prospěch napětí) a teaser vhledového typu, jedna věta, která slibuje rozuzlení. Návrh teaserů:

| # | Místo | Teaser (nejbližší neobjevené místo) |
|---:|---|---|
| 1 | Tržnice pod anténami | „Kdo tam v noci prodává? A komu?“ |
| 2 | Zahrady na okraji | „Za posledním domem prý někdo pěstuje neonová rajčata.“ |
| 3 | Železnice k řece | „Noční vlak houká přesně ve chvíli, kdy…“ |
| 4 | Skladiště u vody | „Ve skladišti č. 7 se svítí, i když tam nikdo nepracuje.“ |
| 5 | Les přístavních jeřábů | „Jeřábnice Máňa chytá všechno, co letí. Opravdu všechno.“ |
| 6 | Most přes záliv | „Lana mostu jsou napnutá jako struny. Zkus na ně dopadnout.“ |
| 7 | Maják na konci mola | „Maják svítí každou noc. Ale na koho čeká?“ |
| 8 | Pole za zálivem | „Za vodou prý končí město a začíná ticho.“ |
| 9 | Větrný hřeben | „Elektrárny dýchají teplý vzduch nahoru.“ |
| 10 | Horské sedlo | „V sedle fouká dolů. Kdo přiletí vysoko, přeletí.“ |
| 11 | Observatoř nad údolím | „Odtud je prý vidět až na konec cesty.“ |
| 12 | Brány metropole | „Brány se otevírají jen tomu, kdo přiletí.“ |
| 13 | Zahrady ve výškách | „Rajčata z předměstí tu mají příbuzné.“ |
| 14 | Vysílací věž | „Nejvyšší bod cesty. Vysílá něco, co se týká tebe.“ |
| 15 | Střešní přístav | „Tady končí poslední dopis.“ |

- Úrovně a cena / podmínka odemčení: Zdarma, od prvního hodu (místo 1 je cíl od začátku spolu se 100/250/500 m; cíle 100/250/500 zůstávají, ukazuje se ten bližší).
- Proč je hra zábavnější: Zvědavost je nejsilnější prediktor dobrovolné doby hraní (Kao 2024, P3 — V). Lidé se mezeře nevystavují, když je šance ji zavřít malá (Loewenstein 1994, 08 §3.5 — V), proto jen nejbližší místo (08 N1 — N). Vhledový teaser má působit silněji než výčet (08 N1 — N). Jeden aktivní cíl s průběžnou zpětnou vazbou (Locke & Latham, 08 N3 — V/N). Pravdivé „chybělo X m“ jako příležitost k obnovení úkolu (Ovsiankina, 08 N4 — V).
- Pocit „chci a potřebuju“: Informační mezera, o které hráč věří, že ji zavře, protože vidí metry. Věta je napůl rozuzlená a rozuzlení přijde na pohlednici po doletu. Přínos vidí předem: vzdálenost, název, nálezné.
- Rizika a etika: Nikdy neupravovat výsledek kvůli těsnosti, necílit ladění na víc těsných proher (02 §4.3/3, P10). Teaser musí dodržet slib: pohlednice rozuzlení opravdu přinese (Carson: pravidla světa se neporušují, 08 §3.6).
- Simulace: Bot zvědavost nemá, takže efekt na chování je jen playtest (počet dobrovolných hodů po 500 m, položka Curiosity v miniPXI). Simulátor může změřit rozložení vzdálenosti „chybělo X m“ (kolik % hodů skončí do 50 m před hranicí), aby bylo vidět, jak často hráč teaser uvidí. Nárok: parametr (výpis z existujících letů).
- Náročnost implementace: S

### SV04 — Kapitoly po čtvrtích (konec kapitoly, ne konec hry)
- Typ: Systém
- Kde: Výsledek
- Mechanika: Cíl 500 m zůstává jako **Prolog** („Obzor je tvůj!“). Pak čtyři kapitoly, každá uzavřená dosažením první hrany další čtvrti: Kapitola 1 *Fialové předměstí* → Skladiště u vody (1 219 m). Kapitola 2 *Měsíční doky* → Pole za zálivem (2 438 m). Kapitola 3 *Rudý horizont* → Brány metropole (3 657 m). Kapitola 4 *Neonové jádro* → Střešní přístav, konec trasy (4 876 m). Při uzavření kapitoly: celoobrazovková pohlednice čtvrti, barva stopy (SV15) a dvě rovnocenná tlačítka „Pokračovat“ a „Pro dnešek stačí“. Druhé uloží a ukáže, kde hráč příště začne. Po Prologu výsledek nejdřív oslaví a až pak ukáže teaser Zahrad (110 m za cílem).
- Úrovně a cena / podmínka odemčení: Postupně podle vzdálenosti. Bez mincí za kapitolu (odměnou je pohlednice čtvrti a stopa).
- Proč je hra zábavnější: Okamžik 500 m je nejrizikovější bod hry (P5, Kivetz 2006, Axon — V/H). Sjednocená sekvence „oslava a konec kapitoly → jeden blízký cíl bez tlaku“ (03 N1, 02 N6, 08 N11 — N). Etapové cíle v poměrovém rytmu (03 N3, Kivetz — V/N): prolog 500, kapitoly ~1,2 / 2,4 / 3,7 / 4,9 km jsou poměry 2,4× / 2× / 1,5× / 1,3×, ale díky štafetě je každá kapitola z posledního startu jen 1–2 dobré hody. Přirozená zastávka (02 §2.7, kritérium 4).
- Pocit „chci a potřebuju“: Hráč, který chce skončit, má pocit hotové kapitoly. Hráč, který chce pokračovat, vidí jednu blízkou mezeru (Zahrady 110 m) a vzdálený rámec (4 kapitoly). Struktura kapitol je viditelná v atlasu od začátku.
- Rizika a etika: Tlačítka rovnocenná, žádné blikající „Pokračovat“ (02 §4.3/6). Žádné „ještě kousek a…“ (02 N10). Kapitoly bez časového limitu.
- Simulace: Měřit hody a minuty mezi kapitolami podle profilu (cíl: každá kapitola 3–8 hodů průměrného hráče, žádná nad 15) a podíl botů, kteří kapitolu nedokončí do limitu 300 hodů. Hypotéza (pomocný skript, varianta schránek po 2 místech): průměrný bot Prolog 12 → K1 18 → K2 20 → K3 22 → K4 24 hodů, tedy 6 / 2 / 2 / 2 hody. Kapitoly 2–4 jsou spíš krátké, proto karty SV07–SV10 mají úseky dělat různorodé, ne delší. Nárok: nová logika (kampaň za 500 m).
- Náročnost implementace: M

### SV05 — Poštovní štafeta (startovní schránky)
- Typ: Odemčení
- Kde: Bonusy | Let
- Mechanika: Na začátku každého druhého místa stojí poštovní schránka: Dílna (0 m), Zahrady na okraji (610 m), Skladiště u vody (1 219 m), Most přes záliv (1 829 m), Pole za zálivem (2 438 m), Horské sedlo (3 048 m), Brány metropole (3 657 m), Vysílací věž (4 267 m). Schránka se odemkne prvním dosažením svého místa. Na míření hráč volí start (výchozí je nejvzdálenější odemčená). Hod ze schránky: `createFlight` začíná `x = startX = poloha schránky`, `y = 12`, fyzika beze změny. Rekord `best` se počítá absolutně (`f.x`), mince dál z `f.x − startX` (už tak v `reward`). Kulisa a pozadí se posunou na start (stejně jako dnes `routeAt`). Poznámka k implementaci: `settle` dnes počítá `best` jako `f.x − startX`, pro štafetu se musí rozlišit „dolet hodu“ a „nejvzdálenější bod“.
- Úrovně a cena / podmínka odemčení: 7 schránek, zdarma, odemčení dosažením. Varianta B (ke srovnání v simulaci): schránka se odemkne jen **přistáním** v jejím místě (dopis musí do schránky dopadnout), takže přelet nestačí. Varianta C viz SV22 (za poštovné).
- Proč je hra zábavnější: Bez štafety je 12 ze 16 míst nedosažitelných (0.2) a vzdálený cíl bez blízkých kroků je horší než žádný (Locke & Latham, 08 §3.1 — V; 08 N2 — N). Schránka mění vzdálený rámec (4,9 km) na řadu blízkých kroků ~610 m, které odpovídají doletu, na který hráč dosáhl kolem 500 m (03 N3 — N). Navazuje na žánr launch her, kde se postupuje po etapách (03 §2 — H).
- Pocit „chci a potřebuju“: Nejsilnější „potřebuju“ v celém dokumentu: první schránka v Zahradách leží jen 110 m za cílem 500 m a slibuje „odtud doletíš do doků“. Hráč přínos vidí předem: na míření je seznam schránek a zamčená schránka ukazuje, kam z ní dosáhne průměrný hod („z Zahrad ~1 400 m daleko“, počítáno z jeho posledních doletů).
- Rizika a etika: Nesmí vzniknout grind: úsek mezi schránkami musí být pod průměrným doletem hráče s úrovní ~3–4 (proto ne po čtvrtích, viz 0.3). Hod z Dílny zůstává vždy dostupný.
- Simulace: Klíčová karta pro Monte Carlo. Hypotéza z pomocného skriptu: průměrný bot dosáhne konce trasy za 24 hodů / 23 min (12 hodů za 500 m), slabý za 34 / 31 min, všichni dokončí. Schránky po místech 22 hodů, po čtvrtích 47 hodů / 66 min (grind, zamítnout). Varianta B (přistání) očekávám +30–60 % hodů za 500 m. Měřit: hody a minuty do 610 / 1 219 / 2 438 / 3 657 / 4 876 m, rozložení dosažených míst po 30 a 50 hodech, úrovně stromu na konci, podíl hodů ze schránek. Nárok: nová logika (startX ≠ 0, absolutní rekord, volba startu botem = nejvzdálenější schránka).
- Náročnost implementace: M

### SV22 — Schránka za poštovné (využití mincí, varianta SV05)
- Typ: Odemčení
- Kde: Bonusy
- Mechanika: Stejné schránky jako SV05, ale po dosažení místa se schránka nabídne k odemčení za pevnou cenu: Zahrady 100, Skladiště 150, Most 200, Pole 250, Sedlo 300, Brány 350, Věž 400 mincí (celkem 1 750). Cena je vidět v atlasu od chvíle, kdy je místo cílem SV03. Mince jdou do stejné kasy jako Dílna, takže hráč volí: další úroveň stromu, nebo nová startovní čára.
- Úrovně a cena / podmínka odemčení: 7 schránek, 100–400 mincí, podmínka dosažení místa.
- Proč je hra zábavnější: Řeší otevřený spor o mince po 500 m (R-N4, 01 N2 proti 02 N6) smysluplným horizontálním využitím místo nekonečného sinku (03 N2 — N). Volba „vylepšení, nebo schránka“ je skutečná volba s předvídatelným důsledkem (03 N7, Compton — H).
- Pocit „chci a potřebuju“: „Mám 260 mincí. Kup si papír 4, nebo schránku v Mostě a skoč přes záliv.“ Hráč vidí cenu i přínos (odkud poletí) předem.
- Rizika a etika: Pevné ceny, žádná sleva ani časový tlak (02 §4.3/7). Riziko grindu u slabého hráče: když mezi nákupy vychází víc než ~5 hodů bez nové volby, je to signál grindu (02 N5).
- Simulace: Porovnat se SV05 (zdarma). Bot pravidlo: koupit schránku, jakmile je dostupná a dražší než nejbližší úroveň stromu není (nebo dvě strategie: „schránky napřed“ / „strom napřed“). Hypotéza: +4–8 hodů na celou trasu u průměrného hráče, +8–14 u slabého; strategie „schránky napřed“ rychlejší. Měřit maximální počet hodů bez nákupu. Nárok: nová logika (obchod se schránkami).
- Náročnost implementace: S (nad SV05)

---

## 2. Místní vlastnosti trasy

Společný technický základ (SV07–SV10): `wind` dnes je jeden konstantní objekt `{x,y}` (a v `ui.js` vždy nula). Místní vlastnost znamená `wind(x)` v `integrate`: vítr podle polohy, deterministický, stejný při každém hodu a vidět v kulise. Žádná náhoda, takže nevzniká „štěstí“, jen čitelné pravidlo místa (Carson, 08 §3.6 — H).

### SV07 — Přístavní vítr v Měsíčních docích
- Typ: Událost
- Kde: Let
- Mechanika: V úseku 1 219–2 438 m (celé doky) `wind.x = +1,5 m/s` (zadní vítr). Klesání se počítá ze vzduchové rychlosti (`vx − wind.x`), takže zadní vítr klesání nezvyšuje a prodlouží let v docích zhruba o 14–19 % (cruise 8–11 m/s). V kulise vlají vlajky na jeřábech a letí papírky stejným směrem, HUD ukáže při vstupu „Přístavní vítr ➜“.
- Úrovně a cena / podmínka odemčení: Platí vždy po dosažení doků. Na pohlednici doků (SV01) je popsán předem.
- Proč je hra zábavnější: Místo, které se *chová* jinak, je nová informace, ne jen nová kulisa. Percepční novost bez změny chování vyprchává (Kidd & Hayden, 08 §3.5 — V). Variabilita má být nesena obsahem a výsledkem, ne náhodnými efekty (P3 výhrada, Kao 2024 — V). Řeší i známý problém „vítr je vždy nulový“.
- Pocit „chci a potřebuju“: „V docích to nese“ = doky jsou slib rychlého postupu po náročném předměstí. Hráč se předem dozví z teaseru a pohlednice, takže první let doky vnímá jako odměnu za dosažení.
- Rizika a etika: Žádné. Pozor na čitelnost: pokud hráč změnu necítí, je to jen číslo (playtest).
- Simulace: Hypotéza: průměrný dolet ze schránky Skladiště +100–140 m; hody z 1 219 na 2 438 m klesnou zhruba o 1 (z ~2 na ~1). Měřit dolety ze schránek 1 219 a 1 829 m s a bez větru. Nárok: nová logika (`wind(x)` v `integrate`; simulátor jen předá funkci).
- Náročnost implementace: S

### SV08 — Termika nad Větrným hřebenem
- Typ: Událost
- Kde: Let
- Mechanika: Tři stoupavé sloupy u turbín na 2 800, 2 900 a 3 000 m, každý široký 24 m, `wind.y = +2,0 m/s`. Kluzák (cruise 8 m/s) jedním sloupem proletí za ~3 s a získá ~6 m výšky, tj. s klouzavostí 5,4–10,8 asi +32–65 m doletu. Šipka (11 m/s) získá ~4,4 m, tj. +14–28 m. Sloupy jsou vidět jako chvějící se teplý vzduch nad turbínami (animace už existuje), v nízké výšce je hráč mine, pokud let skončí před nimi.
- Úrovně a cena / podmínka odemčení: Vždy po dosažení hřebene.
- Proč je hra zábavnější: Dává modelu kluzák místo, kde je jasně lepší (situační volba modelu, 03 N7 — N). Hráč objevuje pravidlo místa a učí se ho využít (učební cíl „využij všechny 3 sloupy“, Locke & Latham, 08 §3.1 — V; viz SV13 V6).
- Pocit „chci a potřebuju“: „Kluzák nad elektrárnami poletí dál, šipka ne.“ Přínos je vidět v teaseru a na pohlednici, po prvním průletu hráč uvidí ve výsledku „Termika: +3 sloupy“.
- Rizika a etika: Žádné etické. Balanční riziko: příliš silná termika udělá z Rudého horizontu jediný hod.
- Simulace: Hypotéza: kluzák ze schránky Pole (2 438 m) doletí o 100–190 m dál, šipka o 40–80 m; podíl hodů kluzákem v Rudém horizontu vzroste nad 70 %. Měřit dolet podle modelu a podíl kluzáku ve hrách „lepší model“. Nárok: nová logika (`wind(x)`).
- Náročnost implementace: S

### SV09 — Odraz na mostě
- Typ: Událost
- Kde: Let
- Mechanika: Při prvním dopadu (`y ≤ 0`) v úseku 1 829–2 133 m, pokud `vy < −0,5`, vlaštovka se jednou za let odrazí od lan mostu: `y = 0,1`, `vy = +4,5 m/s`, `vx × 0,8`, pak normální let. Dopad mimo most nebo druhý dopad na mostě let ukončí jako dnes. Kulisa: lana se zachvějí, popup „Odraz!“.
- Úrovně a cena / podmínka odemčení: Vždy po dosažení mostu.
- Proč je hra zábavnější: Malé překvapení vystupující z čitelného vzoru (Antony 2021, Kidd & Hayden, 08 §3.12 — V). Most se ze slabého hodu stane „druhou šancí“, což vytváří vlastní mikrocíl („dopadni na most“). Juice vázaný na skutečný úspěch (P1 — V).
- Pocit „chci a potřebuju“: Teaser „Zkus na ně dopadnout“ (SV03) slibuje vlastnost předem. Hráč, který doletí do mostu, ví, že tam má druhou šanci, a chce ji zažít.
- Rizika a etika: Odraz je pevné pravidlo, ne náhoda; nesmí se upravovat podle výsledku. Pozor na výklad jako „near-miss“: odraz je skutečná výhoda, ne fingovaná blízkost.
- Simulace: Hypotéza: odraz přidá v průměru 40–70 m doletu letům, které skončí na mostě (vy 4,5 → apex ~5,6 m × klouzavost); hody z 1 829 na 2 438 m klesnou o ~0,3. Měřit podíl letů končících na mostě a zisk z odrazu. Nárok: nová logika v `step` (dopad).
- Náročnost implementace: S

### SV10 — Padavý vítr v Horském sedle
- Typ: Událost
- Kde: Let
- Mechanika: Horské sedlo (3 048–3 352 m): v první polovině (3 048–3 200 m) `wind.y = −0,5 m/s` (padavý vítr), ve druhé (3 200–3 352 m) `wind.y = +0,8 m/s` (závětrný výstup k observatoři). Kulisa: sníh a mraky tečou dolů, pak nahoru. Kdo do sedla vletí vysoko (nad ~10 m), propadne a pak se zvedne; kdo nízko, dopadne v sedle.
- Úrovně a cena / podmínka odemčení: Vždy po dosažení sedla. Schránka Horské sedlo (SV05) leží na začátku padavého větru, takže hod ze sedla musí jít strměji.
- Proč je hra zábavnější: Jediné místo, kde je úhel z Dílny špatně a hráč musí přenastavit, tj. nová podmínka místo užších oken (04 N10, P14 — N). Rozbíjí monotónii „každý úsek stejný“. Dává `angleHint` nový význam.
- Pocit „chci a potřebuju“: Teaser „Kdo přiletí vysoko, přeletí“ předem prozradí pravidlo a sedlo se stane mini hádankou, kterou hráč chce rozlousknout.
- Rizika a etika: Riziko frustrace slabého hráče (sedlo jako stěna). Musí platit: průměrný hráč s úrovní 3 přeletí sedlo ze schránky Sedlo alespoň v 40 % hodů. `angleHint` musí počítat se startem ve schránce (jinak dává špatnou radu).
- Simulace: Hypotéza: z 3 048 m klesne průměrný dolet o 60–100 m při úhlu z Dílny, o méně než 20 m při úhlu o +6–10° strměji; hody přes Rudý horizont +1. Měřit podíl přeletů sedla podle profilu a úhlu, maximum hodů na tomto úseku u slabého hráče. Nárok: nová logika (`wind(x)`, `bestAngle` se startem).
- Náročnost implementace: S

---

## 3. Sběratelné předměty a zakázky

### SV11 — Známky ve vzduchu (16 pevných pozic)
- Typ: Systém
- Kde: Let | Bonusy
- Mechanika: V každém místě visí jedna poštovní známka na pevné pozici (x, y). Sebere se, když letadlo projde do 3 m od ní (test po každém kroku fyziky). Pozice jsou ve všech hodech stejné, v atlasu vidí hráč u objeveného místa slot známky s nápovědou výšky. Návrh pozic (kalibrovat simulací tak, aby každou známku průměrný hráč s vhodným vybavením trefil alespoň v 5 % hodů, které místem proletí):

| # | Místo | x (m) | y (m) | Nápověda v atlasu |
|---:|---|---:|---:|---|
| 0 | Dílna | 60 | 24 | „Nad komínem“ (strmý hod) |
| 1 | Tržnice | 430 | 6 | „Mezi stánky“ (nízký let) |
| 2 | Zahrady | 700 | 14 | „Nad skleníkem“ |
| 3 | Železnice | 1 100 | 3 | „Těsně nad kolejemi“ |
| 4 | Skladiště | 1 300 | 26 | „Na střeše skladu č. 7“ (strmě ze schránky) |
| 5 | Jeřáby | 1 700 | 18 | „Na rameni jeřábu“ |
| 6 | Most | 2 000 | 3 | „Na lanech“ (po odrazu, SV09) |
| 7 | Maják | 2 300 | 12 | „V kuželu světla“ |
| 8 | Pole | 2 520 | 24 | „Nad strašákem“ |
| 9 | Hřeben | 2 900 | 32 | „Na vrcholu termiky“ (SV08) |
| 10 | Sedlo | 3 200 | 6 | „Na dně sedla“ (SV10) |
| 11 | Observatoř | 3 500 | 22 | „U kopule“ |
| 12 | Brány | 3 720 | 20 | „Pod obloukem brány“ |
| 13 | Terasy | 4 100 | 9 | „Mezi visutými zahradami“ |
| 14 | Věž | 4 380 | 36 | „U vrcholu věže“ |
| 15 | Přístav | 4 800 | 4 | „Na přistávací ploše“ |

Odměna: 20 mincí za známku (celkem 320) a sada 4 známek čtvrti otevře vzor papíru (SV14).
- Úrovně a cena / podmínka odemčení: Slot známky se ukáže s objevem místa. 16 známek, 4 sady.
- Proč je hra zábavnější: Učební cíl místo výkonového (objev, jak se dostat nízko / vysoko, Locke & Latham, 08 §3.1 — V). Přidává cíl, který není „dál“, takže dává smysl i po dokončení trasy a i silně vylepšené vlaštovce (horizontální výzva, 03 N6 — N). Zřetelná sada 4 známek (08 §3.8 — V).
- Pocit „chci a potřebuju“: Prázdný slot se siluetou známky a konkrétní nápovědou „Mezi stánky“ = uzavíratelná mezera s jasným postupem. Hráč vidí předem, kde známka je a co sada otevře.
- Rizika a etika: Nesmí být podmínkou postupu (08 N7). Pozice nepřizpůsobovat hráči ani je nepřesouvat. Žádná „vzácná“ známka. Riziko povinnosti úplnosti (Cruz 2017, 08 §3.2): počitadlo skromně, bez upozornění „sebereš všechny?“.
- Simulace: Měřit pro každou známku pravděpodobnost sebrání na hod, který místem proletí, podle profilu, modelu a úrovní (cíl 5–40 %). Hypotéza: snadné (Dílna, Tržnice, Maják) 25–40 %, těžké (Hřeben, Věž) 5–10 %. Počet hodů do sebrání všech 16 u průměrného hráče s cíleným botem 40–70. Nárok: nová logika (záznam trajektorie, cílící bot volící úhel podle výšky známky). Zábavnost hledání jen playtest.
- Náročnost implementace: M

### SV12 — Ztracené dopisy (příběh v jedné odpovědi)
- Typ: Systém
- Kde: Let | Bonusy
- Mechanika: Čtyři obálky, jedna v každé čtvrti, na pevných těžších pozicích: Tržnice (560 m, 10 m), Maják (2 400 m, 18 m), Observatoř (3 600 m, 15 m), Vysílací věž (4 520 m, 30 m). Sebrání stejné jako u známky (3 m). Každý dopis odkryje odstavec příběhu: Dílnu kdysi vedla paní Vlasta, která posílala vlaštovky bratrovi do Střešního přístavu. Dopisy jsou kousky jejich korespondence. Rozuzlení přijde jediným kusem informace v posledním: vlaštovka, kterou hráč hází, je Vlastin poslední nedoručený dopis. Při dosažení Střešního přístavu (4 876 m) atlas napíše „Doručeno.“, a pokud má hráč všechny 4 dopisy, přidá krátký závěr. Bez dopisů se trasa dohrát dá, chybí jen rozuzlení.
- Úrovně a cena / podmínka odemčení: 4 dopisy, odemčení sebráním. Odměnou je jen příběh a vzor papíru „Vlastin dopis“ (SV14), žádné mince.
- Proč je hra zábavnější: Zvědavost je silnější u „vhledových“ problémů, kde jeden kus informace vyřeší celek (Loewenstein 1994, 08 §3.5 — V). Rámující fikce (08 §3.2 — V) a mikronarativy rozmístěné po prostoru (Jenkins, 08 §3.6 — H). Dává celé trase emocionální oblouk a důvod, proč se jmenuje Střešní přístav „konec poslední cesty“.
- Pocit „chci a potřebuju“: Po prvním dopisu („Jestli tohle čteš, vlaštovka doletěla dál než já…“) chce hráč vědět, komu a proč. Atlas ukazuje 4 obálky a místa, kde leží, takže mezera je uzavíratelná a viditelná předem.
- Rizika a etika: Žádný parasociální tlak („Vlasta bude smutná, když přestaneš“, 02 N9). Příběh nesmí slibovat víc, než přinese (Carson). Bez odměn v mincích, aby nebyla přidaná vnější odměna nad vnitřně motivovaný obsah (Birk 2016, 08 §3.2 — V).
- Simulace: Měřit pravděpodobnost sebrání každého dopisu na průlet a medián hodů do všech 4 (hypotéza 15–30 hodů navíc nad dokončením trasy u průměrného cílícího bota). Nárok: nová logika (stejná jako SV11). Účinek příběhu jen playtest (vybavení si příběhu, položka Curiosity).
- Náročnost implementace: M

### SV06 — Poštovní zakázky (doruč přesně)
- Typ: Systém
- Kde: Bonusy | Výsledek
- Mechanika: Nástěnka v Dílně ukazuje nejvýš 3 aktivní zakázky z pevného seznamu (pořadí je dané, ne náhodné). Zakázka se splní, když hod **přistane** v 40m okně v místě. Zakázka se zobrazí, jakmile je místo objevené. Žádná expirace, žádný limit pokusů. Za letu je okno vidět jako svítící dvorek na zemi.

| # | Adresát | Místo | Okno přistání | Odměna |
|---:|---|---|---|---:|
| Z1 | Soused z prvních střech | Dílna | 150–190 m | 25 |
| Z2 | Robot Šroubek, stánek s anténami | Tržnice | 420–460 m | 30 |
| Z3 | Pěstitelka neonových rajčat | Zahrady | 760–800 m | 40 |
| Z4 | Výpravčí nočního vlaku | Železnice | 1 050–1 090 m | 45 |
| Z5 | Hlídač skladu č. 7 | Skladiště | 1 380–1 420 m | 50 |
| Z6 | Jeřábnice Máňa | Jeřáby | 1 650–1 690 m | 55 |
| Z7 | Rybář pod mostem | Most | 1 960–2 000 m | 60 |
| Z8 | Strážce majáku | Maják | 2 398–2 438 m | 65 |
| Z9 | Strašák (ano, opravdu) | Pole | 2 600–2 640 m | 70 |
| Z10 | Astronomka | Observatoř | 3 480–3 520 m | 80 |
| Z11 | Vrátný brány | Brány | 3 800–3 840 m | 85 |
| Z12 | Adresát neznámý | Střešní přístav | 4 820–4 860 m | 100 |

Součet 705 mincí. Hod se počítá z libovolné schránky.
- Úrovně a cena / podmínka odemčení: Odemčení objevem místa, každá zakázka jednou.
- Proč je hra zábavnější: Nová dovednost (dávkovat sílu a úhel, nebo QTE vynechat) místo „vždy dál“, takže silně vylepšený hráč dostane výzvu, kterou strom nevyřeší (03 N6 horizontální výzva — N). Krátká Z1 je pro vylepšenou vlaštovku těžší než pro začátečníka, což je čitelná ironie. Výzva na jeden pokus je bezpečná, když je volitelná a vyhodnotí se v jednom letu (08 §3.3 — N). Adresáti jsou malé postavy (SV17).
- Pocit „chci a potřebuju“: Konkrétní adresát, konkrétní okno a částka jsou vidět předem. Po minutí výsledek pravdivě řekne „přistál jsi 23 m za dvorkem“ — směrová zpětná vazba, která učí (St. Germain 2023, 04 §2.8 — V).
- Rizika a etika: Pevné odměny, žádný „bonus za první pokus“. Nástěnka nesmí tlačit („3 zakázky čekají!“). Pozor na rozpočet mincí (0.4).
- Simulace: Hypotéza: průměrný hráč splní zakázku v 15–35 % pokusů, slabý v 8–20 %; Z1 (krátký hod) těžší pro vylepšenou šipku než pro kluzák. Měřit úspěšnost podle zakázky, profilu a úrovně a dopad příjmu 705 mincí na tempo stromu. Nárok: nová logika (cílící bot: zvolí sílu a úhel podle tabulky doletů, přistání v okně).
- Náročnost implementace: M

### SV13 — Výzvy místa na jeden pokus
- Typ: Systém
- Kde: Bonusy | Výsledek
- Mechanika: Osm pevných výzev, každá se ukáže po objevu svého místa, vyhodnotí se v jediném letu a odměna je pevná:

| # | Výzva | Podmínka (jeden let) | Odměna |
|---:|---|---|---:|
| V1 | Bez pomoci | doleť za Tržnici (≥ 305 m) bez úspěšného QTE | 30 |
| V2 | Holubí pošta | 3 úspěšní holubi v jednom letu | 40 |
| V3 | Po kolejích | proleť celou Železnici (914–1 219 m) pod 10 m | 50 |
| V4 | Do lan a zpátky | odraz od mostu (SV09) a pak dolet za Most (≥ 2 133 m) | 50 |
| V5 | Šipkou přes záliv | šipkou ze schránky Most do Pole (≥ 2 438 m) | 60 |
| V6 | Tři sloupy | proleť všemi 3 termikami (SV08) | 60 |
| V7 | Přes sedlo | proleť Horské sedlo bez poklesu pod 6 m | 70 |
| V8 | Nejvyšší bod | dosáhni výšky 40 m u Vysílací věže (4 267–4 571 m) | 80 |

Součet 440 mincí. Splněná výzva dá razítko na křídlo (SV16).
- Úrovně a cena / podmínka odemčení: Objev místa, každá jednou.
- Proč je hra zábavnější: Specifické učební cíle (objev způsobu), které se neřeší jen nákupem (Locke & Latham, 08 §3.1 — V). Signifikátor ukazuje možnost hry, násobitel 1 (Hamari & Eranti, 08 N8 — H/N). V1 a V5 odměňují dovednost bez vylepšení a podporují přičitatelnost úspěchu hráči (P7 — N).
- Pocit „chci a potřebuju“: Výzva je po objevu místa viditelná s odměnou i podmínkou a dává konkrétní důvod hodit znovu i ze schránky, kterou hráč už „má“.
- Rizika a etika: Žádné řady „100× …“ (08 N8). Žádný časový limit mimo let, žádná denní výzva (02 §4.3/4). Malý počet (8), aby nevznikla povinnost úplnosti.
- Simulace: Měřit podíl botů, kteří výzvu splní do 10 / 30 pokusů, a pravděpodobnost na pokus podle profilu. Hypotéza: V1, V2, V4 splní průměrný hráč do 10 pokusů; V5, V7 jsou pro slabého hráče nad 30 pokusů (záměrně volitelné). Nárok: nová logika (trajektorie, počty QTE z `eventStats`).
- Náročnost implementace: M

### SV23 — Poštovní pas (8 informativních odznaků)
- Typ: Systém
- Kde: Bonusy
- Mechanika: Malý pas s 8 razítky, každé za první splnění: Prolog 500 m, každá ze 4 kapitol (SV04), první zakázka, první známka, první odraz od mostu. Žádné mince, jen záznam s datem prvního splnění a krátkým vtipným textem („Most tě vrátil do hry. Mosty to tak dělají.“).
- Úrovně a cena / podmínka odemčení: 8 razítek, splněním.
- Proč je hra zábavnější: Odznak jako informace o tom, co ve hře jde dělat (Hamari & Eranti, 08 §3.2 — H), střídmě a bez mincí (08 N8 — N). Humor jako koření (08 N10 — N).
- Pocit „chci a potřebuju“: Prázdná razítka ukazují možnosti, o kterých hráč nevěděl (odraz, zakázky), a sami tak fungují jako nápověda.
- Rizika a etika: Žádný žebříček ani srovnání s ostatními (P13). Bez řad a bez počitadel hodů.
- Simulace: Nesimulovatelné jako motivace, jen playtest (zda si pasu všimnou, Hamari 2017). Simulátor může změřit, kdy průměrný hráč získá každé razítko.
- Náročnost implementace: S

---

## 4. Kosmetika za objevy

### SV14 — Šuplík s papíry (vzory vlaštovky)
- Typ: Kosmetika
- Kde: Dílna
- Mechanika: Vzory papíru, které mění jen kresbu vlaštovky (žádné pole `parameters()`). Zdroje jsou pevné a vidět předem: *Účtenka z tržnice* (sada 4 známek předměstí), *Lodní mapa* (sada doků), *Hvězdná mapa* (sada Rudého horizontu), *Neonový plakát* (sada jádra), *Vlastin dopis* (všechny 4 ztracené dopisy, SV12), *Noviny* (od začátku). Volitelně papírnictví za mince (otázka pro uživatele): *Notový papír* 150, *Milimetrový papír* 150, *Balicí papír* 150.
- Úrovně a cena / podmínka odemčení: 5 vzorů za objevy, 3 volitelně za mince.
- Proč je hra zábavnější: Úprava vlastního avatara zvyšuje ztotožnění, autonomii a čas hraní (Birk 2016, 08 §3.10 — V, pro vlaštovku extrapolace N). Horizontální odemčení místo dalšího vertikálního růstu (03 N2 — N). Vzor nese příběh místa, kde byl získán (pamětní předmět).
- Pocit „chci a potřebuju“: V šuplíku jsou vidět zamčené vzory s náhledem a podmínkou („Lodní mapa: 4 známky z doků, máš 2“). Hráč vidí, jak bude vlaštovka vypadat, ještě než ji získá.
- Rizika a etika: Žádná náhodná kosmetika, žádné „limitované“ vzory (02 §4.3/1, /7). Kosmetika za mince jen jako přiznaný volitelný sink, ne jako cílený retenční propad (02 N6).
- Simulace: Nesimulovatelné jako přitažlivost (playtest). Simulátor: kdy průměrný hráč získá každý vzor (navazuje na SV11). Pokud papírnictví: dopad 450 mincí na dokončení stromu (zanedbatelný, protože jde až po stromu nebo jako alternativa).
- Náročnost implementace: M (kresba vzorů ve 4 stylech)

### SV15 — Barevná stopa čtvrti
- Typ: Kosmetika
- Kde: Let
- Mechanika: Uzavření kapitoly (SV04) odemkne barvu stopy (stopa existuje v `juice.js`): fialová (předměstí), měsíčně stříbrná (doky), rudá (horizont), neonově vícebarevná (jádro, konec trasy). Hráč volí v Dílně. Stopa se nemění podle výsledku hodu (aby nevznikla oslava nezávislá na hodnotě).
- Úrovně a cena / podmínka odemčení: 4 barvy, kapitola 1–4.
- Proč je hra zábavnější: Viditelná trofej kapitoly, kterou hráč nese v každém hodu (paměťová kotva, 08 §3.7 — N). Pamětní, ne výkonová odměna k uzavření kapitoly (08 N11 — N).
- Pocit „chci a potřebuju“: V atlasu je u každé čtvrti náhled stopy. Neonová stopa jádra je „trofej konce cesty“, kterou hráč vidí od začátku.
- Rizika a etika: Respektovat reduced motion (stopa jen statická). Žádné jiné riziko.
- Simulace: Nesimulovatelné (jen playtest). Čas získání odpovídá kapitolám SV04.
- Náročnost implementace: S

### SV16 — Razítka na křídle
- Typ: Kosmetika
- Kde: Let | Dílna
- Mechanika: Každá splněná zakázka (SV06) a výzva (SV13) přidá na vlaštovku malé razítko (ikona adresáta nebo výzvy). Na křídle je místo pro 6 viditelných razítek, hráč si vybere, která ukáže. Ostatní jsou v pasu (SV23).
- Úrovně a cena / podmínka odemčení: 20 razítek (12 zakázek + 8 výzev).
- Proč je hra zábavnější: Viditelný záznam vlastních činů, ne nákupů (přičitatelnost, P7 — N). Vlastní volba výzdoby (Birk 2016 — V/N).
- Pocit „chci a potřebuju“: Razítko je vidět u zakázky předem („Razítko: rybka“), takže zakázka nese i viditelnou trofej.
- Rizika a etika: Bez srovnávání s ostatními. Bez upozornění na chybějící razítka.
- Simulace: Nesimulovatelné jako motivace, jen playtest.
- Náročnost implementace: S

---

## 5. Humor, postavy a malé příběhy

### SV17 — Postavy z dekorací (obyvatelé trasy)
- Typ: Systém
- Kde: Let | Výsledek | Bonusy
- Mechanika: Dekorace z `decorations.js` dostanou jména a pevnou čtvrť: robot **Šroubek** (předměstí, typ `robot`), jeřábnice **Máňa** (doky, `cargo`), strojvedoucí **Pan Páral** (horizont, `train`), dron **Leťka** (jádro, `drone`, nápis „LEŤ!“ už existuje). Každá postava má 3 krátké repliky, které se odemykají postupem v její čtvrti (objev místa, splněná zakázka, sebraná známka) a objeví se ve výsledku jako jedna věta („Šroubek: Ten dopis jsem si objednal v roce 2087. Ale díky.“). V atlasu má postava kartu s tím, co o ní hráč ví. Repliky jsou pevné a jdou popořadě, žádné náhodné vybírání.
- Úrovně a cena / podmínka odemčení: 4 postavy × 3 repliky = 12 kousků, odemčení postupem.
- Proč je hra zábavnější: Humor zlepšuje vnímání postavy a hry (Gagnon 2022, 08 §3.9 — V), tedy prožitek, ne nutně retenci (08 N10 — N). Postavy s jménem a povahou zvyšují vztah (Darling 2015, 08 §3.10 — V). Mikronarativy rozložené po prostoru (Jenkins — H). Řeší „málo humoru a obsahu“.
- Pocit „chci a potřebuju“: Karta postavy v atlasu má 3 sloty replik, z toho 2 prázdné s podmínkou („Další replika: doruč Šroubkovi zásilku“). Hráč ví předem, co odemkne a kde.
- Rizika a etika: Postavy nesmějí hráče přemlouvat k pokračování („Nechoď ještě!“, Radesky 2022, 02 N9). Vtip se opakováním okouká, proto každá replika zazní ve výsledku jen jednou, pak je jen v atlasu (08 N6 — N).
- Simulace: Nesimulovatelné (playtest: vybavení si postav po hře, položka „hra je vtipná“). Simulátor jen ověří, že všech 12 replik je dosažitelných do konce trasy.
- Náročnost implementace: M (texty, 4 karty, napojení na dekorace)

### SV18 — Místní holubi a poryvy (texty událostí podle čtvrti)
- Typ: Událost
- Kde: Let
- Mechanika: Mechanika QTE se nemění, mění se text a drobný vizuál podle čtvrti (`districtAt(f.x).index`): předměstí — „Kyberholub s bagetou“ / „Poryv z ventilace tržnice“; doky — „Racek-kurýr s rybou“ / „Mlha z komína lodi“; horizont — „Holub s hvězdnou mapou“ / „Teplý dech elektrárny“; jádro — „Dron-holub s reklamou“ / „Výfuk klimatizace mrakodrapu“. Úspěšný holub v každé čtvrti má jinou děkovnou repliku.
- Úrovně a cena / podmínka odemčení: Automaticky podle polohy.
- Proč je hra zábavnější: Dvě události se stejnými texty jsou kandidát na rychlé vyhasnutí percepční zvědavosti (Kidd & Hayden, 08 N6 — V/N). Čtvrť se ohlašuje i událostí, takže hráč do 15 s ví, kde je (Carson, 08 N5 — H).
- Pocit „chci a potřebuju“: Malý: „Jaký holub bude v docích?“ Ukazuje se předem v atlasu jako fauna čtvrti (silueta, dokud ji hráč nepotká).
- Rizika a etika: Žádné. Texty krátké kvůli čitelnosti na mobilu (`CLAUDE.md`, texty v canvasu).
- Simulace: Nesimulovatelné (playtest: „všiml sis opakování textů?“, 08 §5 testy).
- Náročnost implementace: S

### SV19 — Dalekohled v Observatoři (předzvěst konce cesty)
- Typ: Odemčení
- Kde: Bonusy | Výsledek
- Mechanika: Při objevu Observatoře nad údolím (3 352 m) se v atlasu odkryjí siluety a názvy všech 4 míst Neonového jádra a jedna věta z posledního dopisu (SV12) „…uvidíš ji ze střechy, až se setmí“. Výsledek ukáže panoramatický pohled: město v dálce (příběh místa 11 už slibuje „poprvé zahlédneš světla vzdáleného města“). Teaser SV03 dál ukazuje jen nejbližší místo, Dalekohled jen přidává rámec.
- Úrovně a cena / podmínka odemčení: Objev Observatoře.
- Proč je hra zábavnější: Vzdálená místa jako rámec, ne cíl, a předzvěst až ve chvíli, kdy je reálně dosažitelná (08 N2 — N). Zvědavost roste s věděním v oblasti a blízko zavření mezery (Loewenstein, 08 §3.5 — V): odtud jsou k cíli 3 schránky.
- Pocit „chci a potřebuju“: Po 11 místech hráč poprvé vidí cíl celé cesty a zjistí, že je na dosah. Teaser Observatoře (SV03) slibuje výhled předem.
- Rizika a etika: Žádné.
- Simulace: Nesimulovatelné jako motivace. Simulátor: medián hodů od Observatoře do konce (hypotéza 2–4 u průměrného hráče se štafetou).
- Náročnost implementace: S

### SV20 — Kronika letu ve výsledku
- Typ: Systém
- Kde: Výsledek
- Mechanika: Výsledek ukáže pás malých pohlednic míst, kterými let prolétl (od startovní schránky po místo dopadu), s vyznačeným novým místem, sebranými předměty a místní vlastností („Přístavní vítr +118 m“, „Odraz na mostě +52 m“). Síla oslavy má pevné stupně podle hodnoty: běžný hod (skromně) < rekord < nové místo < konec kapitoly.
- Úrovně a cena / podmínka odemčení: Zdarma.
- Proč je hra zábavnější: Oslava škálovaná podle skutečné hodnoty výsledku (02 N3, P1, Dixon 2010 — V). Rozpis „co udělal hráč, co vylepšení, co místo“ (P7, 03 N8 — N). Redundantní podání názvu místa (Jenkins, 08 N5 — H).
- Pocit „chci a potřebuju“: Hráč vidí, které místo mu ještě chybí na pásu a jak velký kus trasy uletěl. Rozpis ukazuje, že místní vlastnost je skutečná výhoda (motivuje k jejímu dalšímu využití).
- Rizika a etika: Animace přeskočitelná, reduced motion (02 N3). Žádná oslava nezávislá na hodnotě (02 §4.3/10).
- Simulace: Nesimulovatelné jako prožitek. Simulátor může dodat rozložení počtu proletěných míst na hod (hypotéza: se štafetou 2–3 místa na hod při plném stromu).
- Náročnost implementace: M

---

## 6. Po konci trasy

### SV21 — Zpáteční pošta (jeden volitelný noční okruh)
- Typ: Odemčení
- Kde: Bonusy | Let
- Mechanika: Po dosažení Střešního přístavu (4 876 m) se nabídne jeden konečný okruh „Zpáteční pošta“: stejná trasa (`routeAt` už počítá `chapter = 2` za 4 876 m), ale v noci, s obráceným přístavním větrem (`wind.x = −1,0 m/s` v docích, doky se stávají výzvou), 16 nových známek na jiných pozicích a 4 nové zakázky „zpáteční“. Schránky okruhu 2 se odemykají znovu. Na konci okruhu definitivní závěr („Pošta doručena. Dílna je tvoje.“) a hra už nic dalšího nenabízí.
- Úrovně a cena / podmínka odemčení: Konec trasy. Jeden okruh, ne nekonečná smyčka.
- Proč je hra zábavnější: Nové podmínky místo užších oken (04 N10 — N). Volitelný „nový okruh“ až po vzniku dlouhé trasy, nikdy povinný reset (03 N10 — N). Konečná smyčka s přirozenou zastávkou (02 §2.7, kritérium 4).
- Pocit „chci a potřebuju“: Po dohrání má hráč, který chce dál, viditelný a ohraničený obsah: „Okruh 2: 16 známek, 4 zakázky, protivítr v docích.“ Kdo chce skončit, má hotový závěr.
- Rizika a etika: Opakování obsahu (habituace). Okruh musí být jasně volitelný a konečný (02 N6). Žádné prestižní body ani restarty stromu.
- Simulace: Měřit hody na okruh 2 s plným stromem (hypotéza: průměrný hráč 10–15 hodů, protivítr v docích +2–3 hody), podíl hodů pod 300 m v docích. Nárok: nová logika (okruh, vítr podle okruhu).
- Náročnost implementace: L

---

## 7. Shrnutí pro simulaci

**Co simulátor dnes umí:** kampaň `fresh()` → 500 m, profily dovednosti, nákupní strategie, učící úhel, volbu modelu, QTE se šumem časování, sken cen a násobek odměny (`rewardMul`).

**Co potřebuje pro karty tohoto dokumentu (podle priority):**
1. Kampaň pokračující za 500 m až do 4 876 m s cílem po místech (SV01–SV05, SV22). Startovní poloha ≠ 0 a absolutní rekord. Volba startu botem: nejvzdálenější schránka.
2. Pevné odměny navíc v `settle` (nálezné, zakázky, výzvy) a strategie „schránky / strom napřed“ (SV02, SV22).
3. `wind(x)` v `integrate` a jednorázový odraz v `step` (SV07–SV10, SV21).
4. Záznam trajektorie a test vzdálenosti k bodům (SV11, SV12, SV13).
5. Cílící bot pro přistání v okně (SV06): volí sílu a úhel z tabulky doletů, se šumem profilu.

**Hlavní metriky:** hody a minuty do 500 / 610 / 1 219 / 2 438 / 3 657 / 4 876 m podle profilu; rozložení dosažených míst po 20 / 30 / 50 hodech; maximální počet hodů bez nového místa nebo nákupu (signál grindu, práh ~5, 02 N5); úrovně stromu a mince na konci trasy; podíl kluzáku podle čtvrti.

**Hypotéza celku (karty SV01–SV05 + SV07–SV10):** průměrný hráč dosáhne 500 m beze změny (~23 hodů, ~12 min), konce trasy za ~35–40 hodů a ~25–30 min (pomocný skript s optimistickým botem: 24 hodů / 23 min), slabý hráč za ~45–55 hodů. Žádný úsek mezi schránkami nesmí průměrnému hráči trvat víc než 5 hodů.

---

## Otázky pro uživatele

1. **Štafeta schránek (SV05):** souhlasíte, že trasa za ~1 km má být dosažitelná startem z dosaženého místa, a ne dalším vertikálním růstem? A má se schránka odemknout přeletem (rychlejší), přistáním v místě (varianta B, dovednost), nebo za poštovné (SV22, využití mincí)?
2. **Délka hry:** je cílem, aby celá trasa přidala ~10–15 minut ke 12 minutám do 500 m, nebo má být kampaň delší (pak by šlo schránky zředit na každé 3. místo, úsek ~914 m)?
3. **Rozpočet mincí:** všechny pevné odměny dohromady (~2 365) by zrychlily strom. Kterým dát přednost: nálezné za místa, zakázky, nebo výzvy? Nebo část zakázek a výzev odměňovat jen razítkem?
4. **Využití mincí po stromu:** přiznat, že mince po dokončení stromu ztratí smysl (KB 02 N6), nebo přidat papírnictví s kosmetikou za pevné ceny (SV14)?
5. **Příběh paní Vlasty (SV12):** líbí se vám emocionální oblouk „vlaštovka je poslední nedoručený dopis“, nebo má hra zůstat čistě arkádová s lehkým humorem?
6. **Místní vlastnosti (SV07–SV10):** smí místo měnit fyziku letu (vítr, termika, odraz), nebo má fyzika zůstat všude stejná a místa jen kulisou?
7. **Zpáteční okruh (SV21):** chcete obsah po konci trasy, nebo má hra skončit ve Střešním přístavu?
8. **Stránka Bonusy:** má se `bonus.html` stát Atlasem (SV01), nebo zůstane pro horizontální bonusy podle pracovního rozlišení v `00-zadani.md` a atlas bude jinde?
