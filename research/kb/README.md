# KB designu a psychologie her — rejstřík, překryvy a rozpory

**Sestaveno: 13. 10. 2026.** Krok 3 postupu ze `research/00-temata.md`. Podkladem je devět bloků `01`–`09` (první verze, před ověřovacím kolem), `KB zabavnost a motivace.md` (dále „stará KB“: K1–K7, backlog B00–B14) a kontrolní pohled do `src/config.js`, `style.css` a `simulation/MONTE-CARLO.md`. Web se při sestavení nepoužil. Bloky 01–09 nejsou upravené: chyby jsou jen zapsané v oddílu 3.

**Aktualizováno: 13. 10. 2026 — stav po ověřovacím kole 13. 10. 2026.** Oddíly 1–4 a 6 odpovídají sekcím „Ověřovací kolo 13. 10. 2026“ na konci bloků 01–09. U rozporů je doplněný stav (vyřešeno, kde a jak / otevřené), fronta má označené ověřené položky a přepočítaný zbytek. Nesrovnalosti mezi bloky, které zůstaly nebo vznikly po ověření, jsou v oddílu 3.4 (R23–R36). Bloky 01–09 se při této aktualizaci neměnily. Oddíly 5 a 7 jsou z první verze, v oddílu 7 jsou doplněné jen nové duplicity a stavy.

**Aktualizováno: 13. 10. 2026 — sjednocovací kolo.** Nesrovnalosti R23–R36 jsou opravené přímo v blocích 01, 03, 04, 05, 08 a 09 (každý blok má v ověřovací sekci odstavec „Sjednocení“). R12 je ověřené v kódu a párovou simulací (01 N4, 06 ověřovací sekce, oddíl 5.2). V4 (Nacke 2010) prošel druhým pokusem o dohledání (05 §2.7, registr [19]). Fronta v oddílu 4 je přepočítaná.

**Stav:** Nejde o doporučení. Jde o mapu pro společné shrnutí (krok 4) a pro případné další ověřovací kolo.

**Štítky:** **V** výzkumný poznatek · **H** heuristika nebo praxe oboru · **N** naše hypotéza pro Just Throw It.

**Odkazy:** `01 §2.3` je blok 01, oddíl 2.3. `04 [23]` je zdroj 23 v registru bloku 04. `07 Z1` / `09 Z3` jsou zdroje s předponou Z. Bloky 07 a 09 obě používají předponu Z, ale každý svou řadu, proto vždy uvádíme i číslo bloku. `S1`–`S4` jsou zdroje staré KB. `01 N3` je kandidátní implikace N3 bloku 01.

## Obsah

1. [Rejstřík bloků](#1-rejstřík-bloků)
2. [Průřezová zjištění](#2-průřezová-zjištění)
3. [Rozpory a nekonzistence](#3-rozpory-a-nekonzistence-mezi-bloky)
4. [Fronta pro ověřovací kolo a zbylá fronta](#4-fronta-pro-ověřovací-kolo-a-zbylá-fronta)
5. [Vztah ke staré KB](#5-vztah-ke-staré-kb)
6. [Mezery](#6-mezery)
7. [Zdroje citované ve více blocích](#7-zdroje-citované-ve-více-blocích)

---

## 1. Rejstřík bloků

Počty zdrojů jsou podle registrů. Podíly ověření jsou **odhad** sestavený z poznámek v registrech, protože ne každý registr uvádí úroveň ověření u každé položky. „Přímo“ znamená plný text, nebo u dokumentace, norem a blogů přímé přečtení stránky. „AB“ znamená abstrakt nebo metadata. „SEK“ znamená jen sekundární popis nebo neověřeno.

Sloupec „před“ je odhad z první verze, sloupec „po ověření“ je odhad přepočtený podle sekcí „Ověřovací kolo“ (posuny jednotlivých položek mezi úrovněmi, nové položky registru). Jde stále o odhad na celé procenta zaokrouhlený na jednotky.

| Blok | Zdrojů v registru (po ověření) | Přímo / AB / SEK — před | Přímo / AB / SEK — po ověření | Poznámka k síle po ověření |
|---|---|---|---|---|
| 01 Motivace | 32 + 6 jen zmíněných | ~34 % / ~41 % / ~25 % | **~47 % / ~31 % / ~22 %** | plný text nově u Kao 2024, Murayama 2010, Sailer 2020, Lazzaro 2004. Ballou 2026 dál nerecenzovaný preprint |
| 02 Odměny a etika | 32 (+ Dixon [30], Finserås [31], Samper-Martínez [32]) + ~11 jen zmíněných | ~50 % / ~40 % / ~10 % | **~56 % / ~35 % / ~9 %** | plný text nově u Finserås, Nagle, Wang. Hicks 2019 dál jen abstrakt |
| 03 Progrese a ekonomika | 28 (+ Burrito Bison [28]) + lokální data | ~75 % / ~15 % / ~10 % | **~79 % / ~10 % / ~11 %** | akademicky nově plný text Nunes & Drèze a Mekler. Přímo čtené jsou dál hlavně recenze a blogy (H) |
| 04 Obtížnost a učení | 35 (+ Depping & Mandryk [34], Zohaib [35]) | ~45 % / ~36 % / ~18 % | **~54 % / ~29 % / ~17 %** | plný text nově u Finserås, Smeddinck, Marschall, Raviv. Klasiky Salmoni a Winstein dál jen bibliograficky |
| 05 Game feel | 33 (+27b) | ~39 % / ~42 % / ~18 % | **~42 % / ~42 % / ~15 %** | Kao 2024 v plném textu. Kao 2020, Hicks 2019, Nacke 2010 a Kaaresoja 2014 dál jen abstrakt (n neznámé) |
| 06 Časování a QTE | 33 (+ Pronk 2020 [33]) | ~69 % / ~13 % / ~16 % | **~79 % / ~6 % / ~15 %** | plný text nově u Wearden, Deber, Parhi, Pronk. Empirie QTE dál chybí |
| 07 Onboarding a UX | 30 + interní výpočty | ~73 % / — / ~23 % (⚠) | **~80 % / — / ~17 % (⚠)** | plný text nově u Parhi a Peacocke, stránka Hoober. Kalyuga jen bibliografie |
| 08 Cíle a zvědavost | 28 (+ Hamari & Eranti [28]) + ~7 jen zmíněných | ~37 % / ~41 % / ~22 % | **~43 % / ~43 % / ~14 %** | plný text nově u Loewenstein 1994 a Hamari & Eranti. Cao 2025 z tiskové zprávy na metadata a DOI |
| 09 Retence a měření | 39 | ~33 % / ~44 % / ~23 % | **~38 % / ~41 % / ~21 %** | N! už jen 2 (Butler 2013, Johnson 2018 a licence PENS). Agarwal 2017 snížen na B (recenzován jen poster) |

Celkem asi **291** registrových položek (dříve 283). Po odečtení duplicit (oddíl 7) asi **262** různých zdrojů (dříve 255). Nová duplicita je Finserås 2021 (02 [31], 04 [17]). Podíl zdrojů čtených přímo vzrostl napříč KB zhruba z ~49 % na ~57 %.

**01 — Motivační teorie.** SDT a PENS, frustrace potřeb, efekt přeplacení (Deci 1999 proti Cameron 2001), flow a jeho nejednotná operacionalizace, self-efficacy, MDA a Lazzaro. Hlavní teze: potřeby silně předpovídají *hlášenou* zábavu, ale slabě *skutečné* hraní (Ballou 2026, preprint). Kao 2024 vidí motor volného hraní ve zvědavosti a v nejistém úspěchu. Kandidátní implikace N1–N10 se týkají mincí jako informace, frustrace kompetence (QTE, holub) a triangulace v playtestu. 32 zdrojů, plný text po ověření asi u poloviny. Po ověření: Kao 2024 v plném textu (zvědavost jediný prediktor doby hraní, hlášená zábava ji nepředpovídala), Klarkowski oslaben (R2), Lazzaro 2004 ověřen primárně. Hanus & Fox, Keller & Bless a Lehtivuori zůstávají jen sekundárně.

**02 — Odměny, posilování a etika.** Kriticky prochází „dopamin z her“ (Koepp 1998, n = 8, reanalýza Egerton 2009), variabilní poměr, loot boxy, near-miss (Clark 2009 proti Pisklak 2019), averzi ke ztrátě, compulsion loop a dark patterns (Zagal 2013 proti Deterding 2020). Dále regulaci: ICO Children's Code, pokyny k DSA a principy CPC. Výsledkem je operacionální test „engagement, ne compulsion“ (§2.7) a seznam „ne“ (§4.3). 32 zdrojů, víc než polovina v plném textu. Po ověření: near-miss v dovednostní hře už ne „spíš silnější“ (Finserås, R-I1), variabilní plán bez výhody (Nagle), Dixon 2010 doplněn. Regulace jsou ověřené jen ze stránek nebo souhrnů.

**03 — Progrese a ekonomika žánru.** Srovnává launch & upgrade hry (Learn to Fly 1–3, Burrito Bison, Toss the Turtle), matematiku idle her (Pecorella), Schreiberovy cenové křivky, gradient cíle (Kivetz 2006: reset a odchod po odměně) a obdarovaný pokrok. Přidává rozbor naší ekonomiky (ceny ≈ 35·n^1,55, kladná zpětná vazba příjmu) a scénáře po 500 m. 27 zdrojů. Většina z nich jsou recenze, komentáře a blogy (H nízké až střední kvality). Akademické jsou Kivetz, Alharthi, Nunes & Drèze a Mekler (všechny po ověření v plném textu), Spiel a Buergi (abstrakt). Po ověření: opravena chyba 1 920 → 1 905 (R1) a účinek obdarovaného pokroku nezávisí na pravdivosti zdůvodnění (Nunes & Drèze, studie 3).

**04 — Obtížnost, selhání a učení.** „Pravidlo 85 %“ (jen simulace), Lomas 2013 (začátečníci hrají déle, když je hra snazší), flow kanál, DDA (Denisova, Constant & Levieux, Smeddinck), Juulův paradox selhání, near-miss v dovednostních hrách. Těžiště je v motorickém učení: KR proti KP, St. Germain 2023 (směrová zpětná vazba funguje, binární ne), hypotéza vedení a korekce OPTIMAL teorie (McKay 2022). 35 zdrojů, víc než polovina v plném textu. Po ověření: Finserås v plném textu (těsná prohra nezvyšuje chuť pokračovat), Smeddinck oslaben (preference ruční volby nevýznamná), Depping & Mandryk je škála, ne experiment. Klasiky Salmoni 1984 a Winstein 1990 jsou dál jen bibliograficky.

**05 — Game feel a juice.** Rámce (Swink, Pichlmair & Johansen, Hicks 2018), empirie juice (Kao 2020: optimum, extrém škodí; Kao 2024: rozhoduje vazba na úspěch; Hicks 2019; Juul & Begy), hitstop a otřes z praxe, zvuk (Nacke 2010) a haptika (Singhal 2021, na iOS webu nedostupná). Dále prahy latence (Kaaresoja 2014) a přístupnost (WCAG 2.3.1 a 2.3.3). 33 zdrojů. Po ověření je Kao 2024 v plném textu a rozpor Kao 2020 × 2024 je vyřešený (R-I2). Kao 2020, Hicks 2019 a Nacke 2010 zůstávají v abstraktu, Nacke oslaben na B−.

**06 — Časování, QTE a ovládání.** Model chyb „temporal pointing“ (Lee & Oulasvirta 2016), latence 26 telefonů (Nicosia 2022), skalární časování, reakční doba, srovnání oken s osu! a StepManií a analýza aktuálního `events.js`. Hlavní nálezy (N): okna jsou tolerantní, ale stálý střed umožňuje odměřování naslepo. Poryv má „reakční past“: okno se otevírá až 320 ms po začátku pruhu. Ukazatel síly odpouští ±198 ms. 33 zdrojů. Velkou část tvoří specifikace a dokumentace (C). Po ověření: Wearden 1991 v plném textu (perfektní zásah holuba naslepo ~66–78 %), Pronk 2020 doplnil latenci webu (58–70 ms, SD ~7 ms). Kontrolovanou studii prožitku z QTE blok nenašel.

**07 — Onboarding, UX a přístupnost.** Andersen 2012 (> 45 000 hráčů: tutoriál pomáhá jen ve složité hře, tlačítko nápovědy může škodit), kognitivní zátěž, heuristiky (Pinelle, HEP), HUD a diegetické UI. Dále výpočty čitelnosti (texty v canvasu mají na telefonu asi 5 CSS px), kontrastů, češtiny (ÚJČ, `Intl`) a kontrolní seznam přístupnosti A1–A18. 30 externích zdrojů, převážně guidelines a normy (H) přečtené přímo. Silná empirická studie je jen 07 Z1. Po ověření: Parhi sníženo na B, Peacocke upřesněn (srovnání s nejhorší variantou HUD, n = 20).

**08 — Cíle, zvědavost a svět.** Locke & Latham (blízké a učební cíle), achievementy (malý průměrný účinek, riziko povinnosti) a meta-analýza Zeigarnikova a Ovsiankinina efektu (paměťový Zeigarnik se nepotvrdil). Zvědavost má tvar obráceného U (Kang 2009). Dále environmentální vyprávění (Jenkins, Carson), sběratelství (efekt „jeden krok od cíle“), humor (Gagnon 2022: mění vnímání, ne chování) a antropomorfismus. 28 zdrojů. Plný text asi u dvou pětin, zbytek převážně abstrakty. Po ověření: Loewenstein 1994 v plném textu (posiluje N1), doplněn Hamari & Eranti 2011, Cao 2025 opraven (autoři, ne terénní data).

**09 — Retence, sociální prvky a měření.** Data hry Axon (854 tisíc hráčů: 90 % má jedinou session, konec přichází po skoku ve skóre), série (Silverman & Barasch 2023), žebříčky (kvantita ano, vnitřní motivace ne) a slabá evidence hráčských typologií. Dále validita dotazníků (GEQ neobstál, nejvhodnější je PXI a miniPXI), playtest s malým vzorkem (RITE, Faulkner), statistická síla, ePrivacy a lokální logování. Končí konkrétním návrhem testu (§4.1). 39 zdrojů. Po ověření jsou N! už jen 2. Agarwal 2017 (Axon) snížen na B: recenzován byl jen poster. Čl. 5(3) ePrivacy ověřen.

---

## 2. Průřezová zjištění

U každého zjištění je na konci poznámka **Po ověření:** se směrem změny (posíleno / oslabeno / beze změny) podle sekcí „Ověřovací kolo 13. 10. 2026“.

**P1. Zpětná vazba má záviset na výkonu, ne být stejná pro každou akci.** Nejsilněji to podporují Kao 2024 (motivy zvýšila vazba na úspěch, samotné zesílení je snížilo; 01 §2.5, 05 §2.2) a Deci 1999 (pozitivní informační zpětná vazba d ≈ +0,33; 01 §2.3, 02 §2.6). Dále St. Germain 2023 (stupňovaná KR; 04 §2.8) a Zhou 2021 (pochvala spojená s informací; 04 §2.8). — **V**. Z toho vycházejí shodné hypotézy: intenzita efektů roste s kvalitou zásahu (01 N5, 02 N3, 05 §4 princip a), oslava nezávislá na výsledku je „casino feel“ (02 §2.10, §4.3 bod 10) a pochvala má nést konkrétní informaci (04 N9, 07 N9). — **N**. **Po ověření: posíleno.** Kao 2024 je ověřen plným textem (n = 1 699, preregistrace, hodnocení A v 01 i 05). „Zesílení“ znamenalo efekty spouštěné i při minutí, které přehlušily zpětnou vazbu zásahu (05 §3 bod 2). Rozhodující je tedy vazba efektů na úspěch, ne jejich množství. 05 §4.2 z toho přidává, že efekt vypuštění má zůstat slabší než efekt úspěchu. Oslava nezávislá na hodnotě výsledku má nově oporu v Dixon 2010 (02 [30], abstrakt).

**P2. Juice zlepšuje dojem, ne kompetenci, a má optimum.** Hicks 2019 a Meiners 2025 (02 §2.10, 05 §2.2) ukazují vyšší přitažlivost bez vlivu na kompetenci. Kao 2020 našel optimum: žádný i extrémní juice dopadly hůř. Juul & Begy vidí nevýznamný trend k horšímu výkonu. — **V**. Juice nemá nahrazovat smysl mincí ani progresi (05 §4.6, 02 N3). — **N**. **Po ověření: rozpor vyřešen, síla beze změny.** Kao 2020 a Kao 2024 si neodporují (R-I2): v roce 2024 se netestovalo „víc juice“, ale juice oddělený od úspěchu. Hicks 2019 podle shrnutí v plném textu Kao 2024: bez vlivu na výkon a použitelnost, zvědavost, kompetence a imerze se zlepšily jen v jedné ze tří her. Optimum z Kao 2020 stojí dál jen na abstraktu, obsah „extrémní“ úrovně neznáme.

**P3. Zvědavost a nejistý výsledek jako motor dalšího pokusu.** Kao 2024: zvědavost je jediný prediktor volné doby hraní (01 klíčové zjištění 6, 05). Kang 2009: obrácené U vůči jistotě. To et al. 2016: snesitelnost mezery závisí na důvěře, že ji hráč zavře (08 §3.5). Kidd & Hayden: novost s opakováním vyprchává (08). — **V/H**. Pro nás: blízké neobjevené místo místo celé mapy (08 N1), trasa jako zdroj zvědavosti (01 N6) a obměny textů událostí proti habituaci (08 N6). — **N**. **Po ověření: posíleno, s jednou výhradou.** Kao 2024 (plný text): zvědavost byla nejsilnějším prediktorem zábavy a jediným prediktorem dobrovolné doby hraní (6,2 proti 10,2 min). Hlášená zábava dobu hraní nepředpovídala. Loewenstein 1994 (plný text; 08 [10]): lidé se zvědavosti nevystavují, když je šance ji uspokojit malá nebo odpověď přijde až po dlouhém čekání. To přímo podporuje 08 N1 (jen *nejbližší* místo). Doslovné heslo „mezera nesmí být příliš velká ani malá“ u Loewensteina není. **Výhrada:** náhodná variabilita efektů v Kao 2024 zvědavost *nezvýšila* (01, 05 §4.6). Nejistotu tedy má nést obsah a výsledek (trasa, další místo), ne náhodné obměny efektů.

**P4. Mezi hlášenou motivací a skutečným chováním je mezera, proto je nutné měřit trojím způsobem.** Ballou 2026 (01 §2.1), self-report koreluje s volným chováním jen asi 0,4 (09 Z37) a herní prvky zvyšují kvantitu bez vlivu na vnitřní motivaci (Mekler 2017; 01, 02, 09). — **V**. Playtest proto má kombinovat dotazník, chování a rozhovor (01 N10, 09 §2.12 a §4.1, stará KB §6–7). Delší hraní samo zábavu nedokazuje. — **H/N**. **Po ověření: posíleno.** Ballou 2026 je dál nerecenzovaný preprint (Stage 2 registrované zprávy, A−), ale stejné rozpojení „zábava ≠ chování“ ukazuje recenzovaný Kao 2024. Mekler 2017 je potvrzen plným textem ve 02, 03 a 09 (n = 273). Nástroj: 01 N10 přijal miniPXI jako hlavní (R-N7). 09 doporučuje sledovat i položku Curiosity, protože právě zvědavost předpovídala chování.

**P5. Okamžik 500 m je nejrizikovější bod celé hry.** Kivetz 2006 ukazuje reset a nejvyšší odchod hned po odměně (03 §2.3). Axon ukazuje konec session po skokovém zlepšení (09 §2.1). Schreiber popisuje přechod do „elder game“ jako hlavní okamžik odchodu (03 §2.7). — **V/H**. Bloky se shodují, že 500 m je dnes slepý konec a mince ztrácejí smysl (01 N2, 02 N6, 03 N1–N2 a N11, 08 N11, 09 N2). **Po ověření: shoda v postupu, slabší opora z dat Axonu.** Agarwal 2017 (Axon) je dlouhá verze posteru z ICWSM 2017, recenzí prošel jen poster. 09 snížil hodnocení na B a jde o jednu observační studii jedné hry. Bloky 03 N1, 02 N6 a 08 N11 se po ověření shodují na sekvenci „oslava a konec kapitoly → jeden blízký cíl bez tlaku“ (R-N4). Kivetzovo „oslovit zákazníka hned po odměně“ je v 03 označené jako marketingová retenční logika. Otevřený zůstává jen produktový spor o mince (nový sink proti přiznání, že ztratily využití).

**P6. Blízké dílčí cíle uvnitř vzdáleného rámce.** Locke & Latham: samotný vzdálený cíl může být horší než „dej do toho maximum“ (08 §3.1). Kivetz: úsilí roste s *podílem* zbývající vzdálenosti (03 §2.3). Efekt „jeden krok od cíle“ a zřetelná struktura sbírky (08 §3.8). — **V**. Pro nás: milníky v poměrovém rytmu (03 N3), jeden aktivní cíl ve třech úrovních (08 N3), atlas „3/4 čtvrti“ (08 N7) a vzdálená místa jen jako předzvěst (08 N2). — **N**. **Po ověření: mírně posíleno.** Cao, Brucks & Reimann 2025 (opravené pořadí autorů, JCR 52(3)): efekt struktury sbírky slábne daleko od dokončení. Studie s hráči Genshin Impact není doložená jako terénní. Loewenstein (viz P3) podporuje vzdálená místa jen jako rámec. Hamari & Eranti 2011 doplnil popisný rámec achievementů (signifikátor, logika splnění, odměna), účinky ale neměří.

**P7. Přičitatelnost: co udělal hráč, co vylepšení a co náhoda.** Juul 2009: hráči chtějí cítit odpovědnost za selhání (04 §2.4). Lomas: úspěch motivuje, když ho hráč připíše sobě (04 §2.1). Clark 2009: near-miss motivuje jen při osobní kontrole (02, 04). Schreiber a Fischer: vertikální progrese zakrývá zlepšení hráče (03 §2.4). Hráči launch her si stěžují na „štěstí“ (03). — **V/H**. Několik bloků nezávisle navrhuje rozpis výsledku „tvůj hod / bonus vylepšení“ (03 N8, 04 N4, 04 §2.7, 07 N9, stará KB B03). — **N**. **Po ověření: empirická opora oslabena.** Depping & Mandryk 2017 (04 [34], CHI 2017) je konceptualizace a vývoj škály připisování příčin, **ne experiment**. Jako opora P7, 03 N8 a 04 N4 neslouží, jako měřicí nástroj do playtestu ano. Přímá studie poměru dovednosti a náhody v arkádě dál chybí (oddíl 6, mezera 5). Rozpis výsledku zůstává hypotézou **N** s nepřímou oporou (Juul, Lomas, Clark).

**P8. Přehyby jsou dnes nejméně čitelná volba ve stromu.** Simulace: „přehyby napřed“ stojí 46 hodů proti 28 při rovnoměrném nákupu (03 §2.5, MONTE-CARLO.md). Jejich účinek (odpuštění síly, okna QTE +10 %, zisk z QTE +12 %; `config.js`) se do doletu promítá málo. Volba podpoří autonomii, jen když hráč rozdíl cítí (Peng 2012; 01 N3). Kritéria smysluplné volby (Compton; 03 N7) ani transparentní pomoc (04 N4) to dnes nesplňuje. Cosinový ukazatel síly navíc už sám odpouští ±198 ms (06 §3.8), takže odpuštění z přehybů se sčítá s velkou vestavěnou tolerancí. — **V (Peng) + N**. **Po ověření: beze změny.** Faktor oken 1 + 0,1·úroveň je ověřen v kódu (06, R9). U „28 hodů“ 03 doplnil, že jde o průměr přes strategie úhlu, ne o hlavní scénář 23 hodů (R8). Meierova kritéria zajímavých rozhodnutí jsou ověřená jen z anotace přednášky.

**P9. QTE se stálým středem okna.** Známý problém z CLAUDE.md řeší tři bloky. 01 N6 ho popisuje jako kompromis mezi nejistotou (zvědavostí) a kompetencí. 04 N10 navrhuje malou variabilitu. 06 key 5, §3.4, N4 a N8 počítá, že úspěch holuba lze zvládnout naslepo s pravděpodobností ~96–99,9 % a že posuny musí být ve stovkách ms. 08 N6 přidává obměnu textů a vizuálu proti habituaci. — **V (skalární časování, předperioda) + N**. **Po ověření: posíleno a sjednoceno.** Wearden 1991 je ověřen plným textem: CV 0,10–0,16, pro intervaly 0,5–1,3 s 0,11–0,14 (n = 4). Úspěch holuba naslepo platí, nově je spočtený i perfektní zásah naslepo ~66–78 %. Rozpor R-N1 je vyřešený výpočtem v 06 §3.4: posun středu ±150–250 ms (2–4 SD přesnosti odměřování) sníží memorovaný perfektní zásah na ~1–27 % a úspěch nechá většinou dosažitelný (~64–98 %). 04 N10 přeškrtl nepřímou oporu Raviv a Caballero, takže „malá vůči pruhu, velká vůči přesnosti odměřování“ je společná formulace. Výhrada z P3: variabilitu zdůvodňovat dovedností (proti odměřování naslepo), ne zvědavostí.

**P10. Těsný výsledek: pravdivá informace ano, vyrobený near-miss ne.** Clark 2009 proti Pisklak 2019 (02 §2.4, 04 §2.5) a Finserås 2021: těsná prohra ve videohře působila nudněji (04 §2.5). — **V**. Shoda: „chybělo 24 m do Zahrad“ nebo „pozdě o 0,08 s“ jen podle skutečných dat (02 N2, 04 N8, 08 N4). Nikdy neupravovat rozložení výsledků (02 §4.3 bod 3, stará KB §8). — **H/N**. **Po ověření: posíleno, napětí s 01 N7 odstraněno.** Finserås 2021 je ověřen plným textem v 02 i 04: těsná prohra v závodní hře **nezvýšila chuť pokračovat** a působila nudněji než velká výhra (n = 40, výsledky předem nastavené, tedy bez kontroly hráče). Evidence pro „v dovednostní hře je near-miss silnější“ chybí, data jsou řídká a nejednoznačná (R-I1). 08 N4 přesunul oporu z near-miss na Ovsiankinu (návrat k přerušenému úkolu). 01 N7 je přeformulovaný: těsnost jen z rozložení cílů a cen, nikdy úpravou výsledku letu (R-N5). Pravdivá informace o odchylce zůstává, motivační přínos těsné prohry ale nepředpokládat.

**P11. Zvuk je pravděpodobně největší mezera, ale nesmí nést jedinou informaci.** Nacke 2010: zvuk zlepšil všechny dimenze GEQ. Tan 2010: bez zvuku byl výkon nejhorší (05 §2.7). Zvuková synchronizace je přesnější než vizuální (06 §3.3). — **V**. Kandidáti jsou tón nabíjení (05 §4.1), „tik“ na středu QTE (06 N6) a odstupňovaný zvuk zásahu (05 §4.4). Omezení: část mobilních hráčů hraje ztlumeně (údaj z roku 2013, neověřený). GAG a XAG říkají „nic podstatného jen zvukem“ (05 §2.7, 07 A14). Šťavnatý zvuk unavuje opakováním (05 §2.7). — **H/N**. **Po ověření: oslabeno na střední oporu.** Nacke 2010 z abstraktu v repozitáři: jen „významný hlavní efekt“ zvuku, směr ani n abstrakt neuvádí a GEQ má nepotvrzenou strukturu (09 Z29). Hodnocení B → B−. 05 klíčové zjištění 4 drží „pravděpodobně největší mezera“, ale s výhradou. Smets & van der Spek 2021 je ověřen jen abstraktem (n a velikost efektu neznámé). Tan 2010 a Appington 2013 zůstávají neověřené. *Sjednocovací kolo (V4):* plný text Nacke 2010 dál nedostupný, n neznámé. Nepřiřazená sekundární shrnutí uvádějí obvyklý směr (se zvukem pozitivní dimenze výš, negativní níž), jedno z nich ale jen pět významných dimenzí místo „všech“. Opora tedy zůstává střední. Zvuk je zároveň jediný kandidát z P11, který v kódu stále chybí (05, poznámka mimo rozsah ověření: `juice.js` už hitstop a otřes má).

**P12. Mince jsou endogenní odměna a riziko přeplacení je u nich malé, ale ne nulové.** Deci 1999 proti Cameron 2001, Mekler 2017 (01 §2.3, 02 §2.6, 08 §3.2). Birk, Mandryk & Atkins 2016: přidaná odměna nejvíc škodí hráčům s vysokou vnitřní motivací (08 §3.2). — **V**. Shoda: mince prezentovat jako důsledek výkonu, ne jako mzdu (01 N1, 02 N1). Základních 10 mincí neokázale (02 N1). Odměny za pouhou účast nepřidávat (02 N9). — **N**. **Po ověření: jádro beze změny, jeden argument navíc.** Nagle 2014 (02 [14], plný text, n = 210): „mírná výhoda variabilního plánu“ byla **nevýznamná ve všech měřítkách**, významně pomohlo jen přizpůsobení plánu preferenci hráče. Pro variabilní (náhodné) odměny mincí tedy neexistuje ani výkonový argument. Birk 2016 je znovu ověřen jen abstraktem (motivace manipulována ztotožněním s avatarem). Mekler 2017 je potvrzen plným textem.

**P13. Dobrovolnost: žádné série, denní odměny, globální žebříčky ani hrozba ztráty.** Zagal 2013 (02, 08, 09), ICO a DSA (02 §2.9), Silverman & Barasch 2023 (přerušená série odrazuje; 09 §2.2), Hanus & Fox a Landers (žebříček zvyšuje kvantitu, ne motivaci; 01, 08, 09) a Wang 2026 (informovanost hráče nechrání; 02). — **V/H**. Shoda se starou KB §8: srovnání se sebou místo s ostatními (09 N3), achievementy střídmě (08 N8), neutrální nabídka pokračování (02 §2.7). — **N**. **Po ověření: posíleno; hranice je etická, ne empirická.** Wang 2026 je ověřen plným textem (n = 153 / 129, β = 0,35 pro loot boxy, povědomí n. s., p = 0,78). Nunes & Drèze 2006 (03 [10], plný text): účinek obdarovaného pokroku (34 % proti 19 %) **nezávisí na pravdivosti zdůvodnění**, účelové zdůvodnění fungovalo stejně jako realistické (studie 3). Data tedy hranici mezi přívětivým začátkem a trikem nevedou, ukazují jen, že trik funguje. Pravdivost je etická podmínka (02, stará KB §8), ne podmínka účinku. Čl. 5(3) ePrivacy je ověřen ve znění (09 Z39): lokální log v playtestu jen s informací a souhlasem. Silverman & Barasch a Landers zůstávají jen v abstraktu, Hanus & Fox sekundárně.

**P14. Nováček a zkušený hráč potřebují jiné věci.** Lomas 2013 (začátečník hraje déle při vyšší úspěšnosti), Klarkowski 2016 a Abuhamdeh 2012 (experti chtějí výzvu; 01, 04), obrácení expertízy (Kalyuga; 07 Z6), Andersen 2012 (07 Z1) a Iacovides 2015 (HUD; 07 Z13). — **V**. Pro nás: lehký začátek a potom nové podmínky místo užších oken (04 N10), tutoriálové události jen v prvním letu (07 N3), nápověda ustupuje (04 N2). — **N**. **Po ověření: posíleno, s upřesněním.** Raviv 2022 (plný text; 04, nově i opora 07 Z6): princip „starting small“. Klarkowski: kompetence při nudě jen srovnatelná, rozdíl nevýznamný (R2). Smeddinck 2016 (plný text): „hráči preferují ruční volbu obtížnosti“ stojí jen na rozhovorech, pořadí preferencí bylo nevýznamné, robustní je jen efekt na autonomii. 04 N2 a 07 N2 jsou po ověření v souladu: bez trvalého tlačítka „Poradit?“, nápověda kontextová, ustupuje a vrací se po opakované chybě (R-N2). Lomas: 69 642 *sezení*, ne hráčů (R19). Kalyuga 2003 je ověřen jen bibliograficky.

**P15. Přístupnost a mobil: technická minima, která hra dnes zčásti nesplňuje.** Paralaxa je výslovně spouštěčem kinetózy (WCAG 2.3.3; 05 §2.11, 07 Z23). Texty v canvasu mají na telefonu asi 5 CSS px (07 §2.6). Zóny časovacího pruhu mají kontrast asi 2 : 1 (07 A3). GAG a XAG doporučují alternativu k přesnému časování (06 §3.11, 07 A13). Latence telefonů se liší o 35–140 ms (06 §3.7), na webu nejspíš víc. Prahy latence u ťuknutí jsou asi 70–150 ms (05 §2.9). `touch-action` za letu hrozí zrušením držení holuba (06 §3.7). — **H (normy) + V (latence) + N (výpočty z kódu)**. **Po ověření: závěr o latenci webu změněn.** Pronk 2020 (06 [33], plný text): webová aplikace na iPhonu 6S a Galaxy S7 měla latenci 58–70 ms se SD jen ~7 ms, tedy **uvnitř nativního rozsahu**. Předpoklad „na webu nejspíš víc“ se pro měřená zařízení nepotvrdil. Problém férovosti perfektního okna ±100 ms je proto hlavně *stálý posun podle zařízení*, ne náhodný rozptyl. Řešením je kalibrace nebo telemetrie odchylky (06 N12). Neměřené zůstávají levné Androidy a zátěž naším canvasem. Deber 2015 (plný text v 06, N = 14): JND 69 / 11 ms se týká vnímání zpoždění odezvy, ne přesnosti časování. Parhi 2006 (plný text, n = 20): 9,2 / 9,6 mm, rohy displeje nejhorší. Kaaresoja 2014 potvrzen z abstraktu (n neznámé).

---

## 3. Rozpory a nekonzistence mezi bloky

**Přehled stavu po ověřovacím kole:** z 22 faktických položek (3.1) je po sjednocovacím kole 18 vyřešených, 2 částečně (R3 originál PSPB nedostupný, R11 rozpor uvnitř CLAUDE.md a `ui.js`) a 2 otevřené mimo KB (R9 stará KB, R10 CLAUDE.md a 00-temata). R12 a R14 uzavřelo sjednocovací kolo. Ze 4 interpretačních rozporů (3.2) jsou 3 vyřešené, R-I3 zůstává hodnotovou volbou. Z 10 rozporů implikací (3.3) je 6 vyřešených nebo sjednocených, R-N4 a R-N6 zbývají jen jako produktové rozhodnutí nebo věc testu, R-N9 a R-N10 jsou slučitelné, ale netestované. Nové nesrovnalosti mezi bloky po ověření jsou v oddílu 3.4 (R23–R36). **Všech 14 je od sjednocovacího kola vyřešených v blocích.**

### 3.1 Faktické chyby a nesoulad v číslech

| # | Co | Kde | Pravděpodobně správně | Stav po ověření (13. 10. 2026) |
|---|---|---|---|---|
| R1 | **Chyba ve výpočtu:** „úroveň 4 všude stojí 1 920“ | `03 §2.2` (poslední odrážka), `03 N2` („1 005–1 920“) | **1 905** mincí: (35 + 105 + 195 + 300) × 3 = 635 × 3 | **Vyřešeno v 03** (§2.2, N2), ověřeno proti `config.js`. Opraven i navazující odhad podílu koupeného stromu |
| R2 | Klarkowski 2016: „nuda dala *nejvyšší* kompetenci“ | `01 §1 bod 4`, `01 §2.4` proti `04 §2.1` | „srovnatelná, rozdíl nevýznamný“ | **Vyřešeno v 01** (§2.4, klíčové zjištění 4) i v 04 (klíčové zjištění 3). Hodnocení sjednoceno na B (R30) |
| R3 | Abuhamdeh & Csikszentmihalyi 2012: „vyrovnané partie“ proti „~20 %“ | `01` proti `04` | obojí může platit | **Částečně.** 01 opravil na „těsné partie víc než jednostranné“ a na ~20 % už nestojí. 04 ověřil definici ~20 % (rozdíl ratingu ~262 bodů) a „těsné partie“ z plného textu Lomas 2013. Originál PSPB zůstává nedostupný. 01 od sjednocovacího kola přebírá stav z 04 (R27). Mezi bloky shodně, originál dál nedostupný |
| R4 | Pichlmair & Johansen: 2020 / C proti 2021 / B | `02 [29]`, `05 [2]` | IEEE ToG 2021 s odkazem na preprint | **Vyřešeno v 02** (2021, B). Oba bloky shodně |
| R5 | Meiners et al. 2025: „Rich“ proti „Reich“ | `02 [27]` proti `05 [14]` | — | **Fakt vyřešen v 02:** Damian **Rich** (repozitář). **Vyřešeno i v 05** (sjednocovací kolo): „Rich“, B− v obou (R23) |
| R6 | Parhi 2006: vnitřně nekonzistentní věta v 06 | `06 §3.10` proti `07 §2.7` | 9,2 / 9,6 mm | **Vyřešeno v 06 a 07** (plný text). Obě věty jsou z abstraktu, doporučení zohledňuje i rozptyl dopadů a subjektivní hodnocení. N = 20, hodnocení B v obou blocích |
| R7 | Počet QTE na let: „1–3 QTE“ | `05 §2.2` proti `06 §3.5`, `§3.9` | až 10 událostí | **Vyřešeno v 05:** až 10 událostí na let, průměrně asi 3 (`events.js`, MONTE-CARLO.md) |
| R8 | Monte Carlo: 23 proti 28 hodům | `03`, `02 §2.6`, `09 N1` | různé scénáře | **Vyřešeno v 03** (u 28 hodů doplněn scénář). 09 N1 uvádí 23 hodů správně jako hlavní scénář. Ve shrnutí dál vždy uvádět scénář |
| R9 | Časování QTE ve staré KB proti aktuálnímu stavu | stará KB §2, K3 proti `06` | 06 podle aktuálního `events.js` | **V KB vyřešeno:** 06 ověřil faktor 1 + 0,1·úroveň v `config.js` a `events.js`, „předpoklad“ odstraněn. **Otevřené mimo KB:** audit ve staré KB je dál zastaralý |
| R10 | Rozsah backlogu „B01–B10“ | `CLAUDE.md`, `00-temata.md` proti staré KB a `07` | **B00–B14** | **Otevřené mimo KB:** CLAUDE.md k 13. 10. 2026 dál uvádí „backlog B01–B10“ |
| R11 | „Po 500 m nic nenavazuje“ | `01 N2`, `03 N1`, `08 §5` proti `CLAUDE.md` | HUD ukazuje další hranici, chybí cíl, oslava a využití mincí | **Částečně.** 08 (Výchozí fakta) zpřesněno, 03 N1 přeformulováno, 01 N2 tvrzení neobsahuje. Rozpor uvnitř CLAUDE.md (Stav proti Známým problémům) trvá, `ui.js` neověřen |
| R12 | Holub zpomaluje let | `01 N4`, stará KB B00 proti `CLAUDE.md` 0.6 | rychlost 15 / 19,5 m/s mohla zůstat | **Vyřešeno (sjednocovací kolo, kód + simulace):** tvrzení už neplatí. `events.js` při úspěchu nastaví `vx = max(10, vx)`, `vy = max(.4, vy)` a nesení 0,8 / 1,1 s × qte bez gravitace a odporu (`core.js`), rychlost tedy nikdy nesníží. Párová simulace 76 800 letů (oba modely, úrovně 0–5, úhly 5–40°, síla 0–1, 40 seedů): žádný let s úspěšným holubem nebyl kratší, 66 000 delších, zbytek stejných. Záporné hodnoty v `simulation/QTE-BALANCE.md` jsou z pravidel 0.4.0 (`vy` napevno 0,4). Opraveno v 01 N4, doplněno do 06 |
| R13 | Zagal 2013: „plný text neotevřen“, B | `09 Z8` proti `02 [17]`, `08 [27]` | plný text ověřen ve 02 a 08 | **Stav ověření vyřešen v 09.** Hodnocení sjednoceno na C (R33) |
| R14 | Mekler 2017: úroveň ověření, design 2 × 4 / 4 × 2, rok | 01, 02, 03, 09 | n = 273, rok 2017 (online 2015) | **Vyřešeno (sjednocovací kolo).** Úroveň ověření, rok a DOI shodně. Design „4 × 2 between-subject“ (prvky × kauzální orientace) znovu ověřen v plném textu a sjednocen v 01 a 09, hodnocení B (R26) |
| R15 | Law, Brühlmann & Mekler 2018: „neotevřeno“ | `01 §2.7` proti `09 Z29` | ověřeno v 09 | **Vyřešeno v 01** (odkaz na 09 Z29) |
| R16 | Kivetz 2006 mezi neověřenými | `08` proti `03 [9]` | ověřeno v 03 | **Vyřešeno v 08** |
| R17 | Ghibellini & Meier: rok | `08 §3.4`, `[9]` | **2025** | Beze změny, jen poznámka pro zadání |
| R18 | Sailer & Homner 2020 jako evidence pro achievementy | `08 §2 bod 2` | gamifikace učení | **Vyřešeno v 08** (klíčové zjištění 2, §3.2, registr). Úroveň ověření sjednocena v 08 odkazem na plný text v 01 (R34) |
| R19 | Lomas 2013: „~70 000 hráčů“ proti „69 642 sezení“ | `04` | sezení | **Vyřešeno v 04** |
| R20 | Rozsah ověření v úvodu 07 | `07` hlavička proti registru | registr | **Vyřešeno v 07** |
| R21 | Kvalita Kao 2024: A− proti A | `01 [26]`, `05 [13]` | — | **Vyřešeno:** plný text, hodnocení A v obou blocích |
| R22 | Deber 2015: opatrnost 05 proti 06 | `05 §2.9` proti `06 §3.7` | — | **Vyřešeno v 06:** plný text, JND 69 / 11 / 96 / 55 ms potvrzeny, N = 14, jde o vnímání zpoždění, ne o přesnost časování. 05 od sjednocovacího kola přebírá stav z 06 (R24) |

Drobnosti bez dopadu: Fong 2014/2015, Klimmt 2018/2019, Finserås 2019/2021 (02 i 04 teď shodně „2021, online 2019“), Nicosia 2022/2023, Pisklak 2019/2020 a Schmalbrock 2021/2022 jsou rozdíly mezi rokem online vydání a tisku. Bloky je většinou samy uvádějí. Nově: Samper-Martínez et al. podle záznamů 2026, ne 2025 (02 [32]).

### 3.2 Rozdílná interpretace téže evidence

**R-I1. Near-miss v dovednostní hře: silnější, nebo slabší?** Blok 02 (§3 bod 3) z Clarkova nálezu o osobní kontrole vyvozoval, že v dovednostní hře je efekt „spíš silnější, ale legitimní“. Blok 04 (§2.5, §3 bod 6) přidal Finserås 2021: těsná prohra ve videohře působila *nudněji* a data v dovednostních hrách jsou „řídká a nejednoznačná“.
**Stav: vyřešeno ve prospěch 04.** Finserås ověřen plným textem v 02 [31] i 04 [17]: chuť pokračovat se mezi scénáři nelišila (n = 40, výsledek předem daný). 02 tvrzení „spíš silnější“ opravilo (§3 bod 3, klíčové zjištění 4, N2), 08 N4 přesunulo oporu na Ovsiankinu. Výhrada: Finserås neměl kontrolu hráče, takže Clarkův moderátor „osobní kontrola“ netestoval. Otázka, zda near-miss *s* kontrolou ve hře motivuje, zůstává bez dat.

**R-I2. Kao 2020 proti Kao 2024.** Vysoký juice pomohl (2020), samotné zesílení motivy snížilo (2024).
**Stav: vyřešeno v 05** (§3 bod 2, klíčové zjištění 1, princip a). Kao 2024 (plný text): „zesílení“ znamenalo efekty oddělené od úspěchu, spouštěné i při minutí, které přehlušily zpětnou vazbu zásahu. Rozhoduje vazba efektů na úspěch, ne jejich množství. 01 (N5, N6) to formuluje shodně. Obsah „extrémní“ úrovně Kao 2020 zůstává neověřený (jen abstrakt).

**R-I3. Skrytá adaptace.** Blok 04 shrnuje, že skrytá DDA zlepšila pohlcení (Denisova 2015). Stará KB K3 a 04 N5 ji přesto vylučují kvůli přičitatelnosti. 06 (§3.2) cituje doporučení skryté personalizace šířky okna a 06 N9 skrytý statický posun perfektního okna holuba o ~15 ms.
**Stav: otevřené jako hodnotová volba.** Constant & Levieux 2019 ověřen jen abstraktem: kontrolou byla náhodná obtížnost a „posílení sebedůvěry“ je hypotéza autorů. 04 proto N5 označil za „spíš hodnotovou volbu“. Statická kompenzace (06 N9) se s 04 N5 nevylučuje. Po Pronk 2020 je pro web navíc přirozenější otevřená kalibrace než skrytý posun (06 N12).

**R-I4. Nápověda: pomáhá, nebo škodí?** Pinelle, HEP a GAG doporučují nápovědu, Andersen naměřil u tlačítka nápovědy −12 % úrovní a −15 % času.
**Stav: vyřešeno.** Smíření „kontextová nápověda vázaná na chybu ano, obecné tlačítko ne“ teď drží 04 i 07 (viz R-N2).

### 3.3 Kandidátní implikace (N), které se navzájem vylučovaly nebo si odporovaly

**R-N1. Kolik variability do středu QTE?** `04 N10` „malá variabilita“ (Raviv 2022, Caballero 2024) proti `06 N4` ±150–250 ms a `06 N8` držení holuba 0,6–0,95 s.
**Stav: vyřešeno výpočtem (06 §3.4) a úpravou 04 N10.** Wearden ověřen plným textem (CV 0,11–0,14 pro 0,5–1,3 s). Posun ±150–250 ms je 2–4 SD přesnosti odměřování: memorovaný perfektní zásah klesne na ~1–27 %, úspěch zůstane ~64–98 %. 04 N10 přeškrtl Raviv a Caballero jako nepřímou oporu. Formulace „malá vůči pruhu, velká vůči přesnosti odměřování“ je společná. Zbývá ověřit simulací v `qte-balance` a telemetrií.

**R-N2. Tlačítko „Poradit?“** `04 N2` (vyžádaná ustupující nápověda) proti `07 N2` (žádné obecné tlačítko).
**Stav: vyřešeno v 04.** 04 N2 vypustil trvalé tlačítko, ruční vyžádání je jen testovaná varianta. Smeddinck 2016 (plný text) navíc oslabil argument „hráči preferují ruční volbu“. 07 N2 platí beze změny.

**R-N3. Číselná, nebo hrubá zpětná vazba?** `04 N1` „nikdy číselná“ proti `02 N2`, `06 N3`, `07 N9` a staré KB K1.
**Stav: vyřešeno v 04.** 04 N1 zakazuje jen *předepsání ideální hodnoty*, ne hlášení odchylky (přesná chybová KR v St. Germain 2023 také vedla k učení). 07 N9 bod 2 je hlášení odchylky, takže je v souladu. Marschall 2007 (plný text): efekt obrácení je slabý, publikační zkreslení autoři doložili. Ověřit testem „stálá proti ustupující“ nápovědě zůstává.

**R-N4. Co po 500 m: další cíl, nebo klidný konec?** `03 N1–N2` proti `02 N6`, `09 N2`, `01 N2`, most `08 N11`.
**Stav: sekvence sjednocena, mince otevřené.** 03 N1 je přeformulované na „oslava a konec kapitoly → jeden blízký cíl“ shodně s 02 N6 a 08 N11, měření doplněno o otázku na lítost. Kivetzovo „oslovit hned po odměně“ 03 označil jako marketingovou retenční logiku. **Otevřené:** produktové rozhodnutí o mincích (nový sink proti přiznání, že ztratily využití, 01 N2 proti 02 N6). Ověřit testem: dobrovolné hody po 500 m spolu s „Hrál jsi déle, než jsi chtěl?“.

**R-N5. Těsné výsledky jako cíl ladění.** `01 N7` proti `02 §4.3 bod 3`, staré KB §8 a `04 N8`.
**Stav: vyřešeno v 01, 02 a 08.** 01 N7 přeformulováno: těsnost jen z rozložení milníků, hranic míst a cen, nikdy úpravou výsledku letu. 02 N2 a 08 N4 doplnily „necílit ladění na těsné prohry“. Finserås oporu pro motivační přínos těsné prohry nedal.

**R-N6. Odhad „~N hodů do nákupu“.** `02 N5` proti staré KB K5.
**Stav: textově sjednoceno v 02.** N5 doplněno: odhad v UI výslovně označit jako odhad, nebo ho nechat jen jako interní metriku grindu. **Otevřené:** porozumění ověřit v testu.

**R-N7. Nástroj do playtestu.** `01 N10` BANGS proti `09 §4.1` miniPXI.
**Stav: vyřešeno v 01.** 01 N10 přijal miniPXI jako hlavní nástroj, z BANGS nanejvýš subškálu frustrace kompetence. 09 doplnil, že položka Curiosity je užitečná (Kao 2024), i když má hraniční test-retest reliabilitu. **Otevřené:** česká validace žádného nástroje není dohledaná. Depping & Mandryk 2017 (04 [34]) je nový kandidát na škálu atribuce, se dvěma dotazníky najednou ale 09 nesouhlasí.

**R-N8. Velikost dotykových cílů.** `06 N13` (XAG ≥ 15 mm) proti `07 A9` (46 px splněno).
**Stav: beze změny, jde o volbu normy.** Parhi 2006 ověřen v obou blocích (9,2 / 9,6 mm, n = 20, B), 06 N13 má doplněnou poznámku k rozporu. Vylučují se, jen pokud se XAG bere jako závazný.

**R-N9. HUD během letu.** `07 N7` (ztlumit) proti K1, `03 N8`, `04 N4`.
**Stav: beze změny, slučitelné.** Rozpis ve výsledkové obrazovce, let čistší. Peacocke (07 Z14) po ověření slabší: −35 % / −26 % je srovnání s nejhorší variantou HUD (ikony), ne s HUD obecně. Opora 03 N8 a 04 N4 v Depping & Mandryk odpadla (P7).

**R-N10. Denní seed a sdílení.** `09 N4` proti staré KB §8 a `02 §4.3 bod 4`.
**Stav: beze změny, otevřené.** Ověřovací kolo ghost, Wordle ani natural stopping points nedohledalo.

### 3.4 Nesrovnalosti mezi bloky po ověřovacím kole (nové)

Kontrola napříč bloky po ověření: stejná studie má v různých blocích rozdílný rok, autory, vzorek, úroveň ověření nebo hodnocení. Všechny položky šlo uzavřít bez nové rešerše, převzetím stavu z bloku, který zdroj ověřil podrobněji (sloupec „Správně podle“). **Stav 13. 10. 2026 (sjednocovací kolo): všech 14 položek je opravených přímo v blocích**, viz sloupec „Co udělat“. U hodnocení (R29–R33) platí společné pravidlo: recenzovaný laboratorní experiment s malým vzorkem = B, s předem daným výsledkem nebo jen sekundárním popisem = B−, normativní práce bez empirie = C. Blok 04 to má zapsané u své legendy, protože jeho škála jinak odvozuje písmeno z úrovně ověření.

| # | Zdroj | Nesrovnalost | Správně podle | Co udělat |
|---|---|---|---|---|
| R23 | Meiners et al. 2025 | `05 [14]` dál „**Reich**, D.“ a hodnocení **B**. `02 [27]` po ověření „**Rich**, D. (Damian)“ a **B−** | 02 (repozitář, 13. 10. 2026) | opravit jméno v 05, sjednotit hodnocení. ✅ **hotovo:** 05 [14] „Rich, D. (Damian)“, B− shodně s 02 |
| R24 | Deber et al. 2015 | `05 [24]` „ověřen abstrakt, čísla JND jen sekundárně“ (i v ověřovací sekci). `06 [3]` plný text, N = 14, čísla potvrzena | 06 | v 05 změnit úroveň ověření a doplnit výhradu „vnímání zpoždění, ne přesnost časování“. ✅ **hotovo:** 05 §2.9 a [24] uvádějí plný text v 06 [3], N = 14, s výhradou „vnímání zpoždění, ne přesnost časování“ |
| R25 | Depping & Mandryk 2017 | `03` (poznámka k metodě, ověřovací sekce) „nedohledáno / neověřeno“ a opora pro 03 N8. `04 [34]` dohledáno: CHI 2017, s. 1040–1052, škála, ne experiment | 04 | v 03 převzít stav z 04 a u N8 uvést, že opora pro atribuci není experimentální. ✅ **hotovo:** 03 převzal stav z 04 [34] (poznámka k metodě, ověřovací sekce), u N8 doplněno, že experimentální opora pro atribuci chybí |
| R26 | Mekler et al. 2017 | Zápis designu: `02 [13]` a `03 [27]` „4 × 2 (prvky × kauzální orientace), potvrzeno plným textem“, `01 [15]` a `09 Z11` „2 × 4“ a 01 radí „citovat jednotně podle 09“. Hodnocení: 01 B, 02 B, 03 V ●●●, 09 **A** | 02 a 03 (výslovně potvrzeno) | sjednotit na „4 × 2“, opravit doporučení v 01, sjednotit hodnocení (B, nebo A). ✅ **hotovo:** plný text znovu otevřen („4 × 2 between-subject“, prvky × kauzální orientace). Sjednoceno v 01 a 09, doporučení v 01 opraveno, hodnocení B v 01, 02 a 09 (03 má vlastní škálu ●●●) |
| R27 | Abuhamdeh & Csikszentmihalyi 2012, údaj ~20 % | `01 [20]` a ověřovací sekce 01: „~20 % z bloku 04 neověřen“. `04 [3]`: definice ~20 % (rozdíl ratingu ~262 bodů) ověřena z plného textu Lomas 2013 | 04 (sekundárně přes plný text [2]) | v 01 převzít formulaci „ověřeno jen přes Lomas 2013, originál nedostupný“. ✅ **hotovo:** 01 §2.4, [20] a ověřovací sekce: „ověřeno jen přes Lomas 2013 (04 [3]), originál nedostupný“ |
| R28 | Lazzaro 2004 | `01 [29]` primární text 2004 ověřen (Wayback, PT). `08` (§1 rozsah ověření, seznam neověřených, ověřovací sekce) „Lazzaro 2004 v původním znění neověřen“ | 01 | v 08 uzavřít odkazem na 01 [29]. ✅ **hotovo:** 08 (rozsah ověření, seznam neověřených, ověřovací sekce) odkazuje na 01 [29] |
| R29 | Hanus & Fox 2015 | `01 [16]` **C / SEK**, „korigendum neověřeno“ (ověřovací sekce 01). `08 [6]` **B−**, existence korigenda ověřena (Crossref, *Computers & Education* 127, 2018, s. 298). Design: 01 „kvazi-experiment, longitudinální“, 08 „16týdenní srovnání kurzů“ (slučitelné) | 08 (korigendum), hodnocení nerozhodnuto | sjednotit hodnocení, v 01 doplnit existenci korigenda. Obsah korigenda zůstává neověřený v obou. ✅ **hotovo:** B− v obou, 01 doplnil existenci korigenda podle 08. Obsah korigenda dál neověřen (S6) |
| R30 | Klarkowski et al. 2016 | `01 [22]` **B−**, `04 [5]` **A (malý vzorek)**. Fakta shodná (n = 45, plný text v obou) | — | sjednotit hodnocení. Zdůvodnění „A (malý vzorek)“ je vnitřně napjaté. ✅ **hotovo:** B v 01 i 04 |
| R31 | Finserås et al. 2021 | `02 [31]` **B−**, `04 [17]` **A** („B → A (malý vzorek, bez kontroly manipulace)“). Fakta shodná (n = 40, předem daný výsledek, plný text) | — | sjednotit hodnocení. Při n = 40 a bez kontroly hráče je spíš B−/B. ✅ **hotovo:** B− v 02 i 04 |
| R32 | Clark et al. 2009 | `02 [5]` **B**, `04 [16]` **A**. Fakta shodná (n = 40 a fMRI n = 15, plný text). Nesrovnalost existovala už v první verzi, README ji nezachytilo | — | sjednotit hodnocení. ✅ **hotovo:** B v 02 i 04 |
| R33 | Zagal, Björk & Lewis 2013 | `09 Z8` po „sjednocení“ dál **B**. `02 [17]` a `08 [27]` **C** (normativní, bez empirie) | 02 a 08 | v 09 sjednotit hodnocení na C. ✅ **hotovo:** 09 Z8 → C |
| R34 | Sailer & Homner 2020 | `01 [17]` **A / PT** (plný text, otevřený přístup, ověřeno 13. 10.). `08 [3]` **A**, „abstrakt (přes Semantic Scholar)“ | 01 | v 08 uvést, že čísla jsou ověřená plným textem v 01. ✅ **hotovo:** 08 [3] odkazuje na plný text v 01 [17] |
| R35 | Cao, Brucks & Reimann 2025 | `08 §3` (popis zdroje) dál „6 laboratorních **a terénních** studií“, ověřovací sekce 08 ale terénní povahu označila za nedoloženou. README v první verzi (S28) mělo pořadí autorů „Cao, Reimann & Brucks“, v této verzi opraveno | ověřovací sekce 08 | vnitřní nesoulad v 08 opravit. ✅ **hotovo:** 08 §3 a registr: „6 studií, terénní povaha nedoložena“ |
| R36 | Hlavičky bloků 01 a 05 | 01: „Stav: první verze, čeká na křížovou kontrolu“, 05: „neprošla křížovou kontrolou“. Obě jen větou doplňují, že ověřovací kolo proběhlo. Ostatní bloky (02, 03, 04, 06–09) mají stav „po ověřovacím kole“ | ostatní bloky | sjednotit stav v hlavičkách. ✅ **hotovo:** 01 a 05 mají stav „po ověřovacím kole a sjednocení“ |

Shodné po ověření (kontrolováno, bez nesrovnalosti): Kao 2024 (01 [26], 05 [13]: n = 1 699, A, plný text), Pichlmair & Johansen (02 [29], 05 [2]: 2021, B), Parhi 2006 (06 [16], 07 Z25: n = 20, B, plný text), Finserås (rok, vzorek a od sjednocení i hodnocení B−, R31), Long & Gutwin 2018 (05 [26], 06 [6]: B, abstrakt), Deci 1999 (01, 02: A, abstrakt a úvod; 08 sekundárně, viz 4.4), Kivetz 2006 (03, 08), Law et al. 2018 (01, 09).

---

## 4. Fronta pro ověřovací kolo a zbylá fronta

**Priorita:** **vysoká** = nese klíčové tvrzení v „Klíčových zjištěních“ nebo kandidátní implikaci, o které se bude rozhodovat · **střední** = podpůrné tvrzení nebo implikace s alternativní oporou · **nízká** = okrajové, kontext, regulace mimo náš případ.

**Značky stavu po ověřovacím kole 13. 10. 2026:** ✅ **ověřeno** (položka z fronty vypadává) · ◐ **částečně** (zůstává ve frontě se zbytkem, případně s novou prioritou) · ○ **neověřeno** (beze změny) · ↓ **přeřazeno** (nižší priorita, protože tvrzení už na položce nestojí nebo rozpor rozhodla jiná položka).

### 4.1 Vysoká priorita (původně 13 → zbývá 1)

| # | Zdroj (bloky) | Stav před | Tvrzení, které na něm stojí | Po ověření |
|---|---|---|---|---|
| V1 | Kao et al. 2024, CHI (01 [26], 05 [13]) | AB | Vazba na úspěch zvyšuje motivy, samotné zesílení je snižuje, zvědavost je jediný prediktor volné doby hraní | ✅ plný text v 01 i 05. Potvrzeno a zpřesněno („zesílení“ = efekty i při minutí, náhodná variabilita zvědavost nezvýšila), A v obou |
| V2 | Kao 2020, Entertainment Computing (05 [12]) | AB + sekundární | Juice má optimum, žádný i extrémní škodí (N = 3 018) | ◐ ↓ **střední.** Abstrakt znovu ověřen, úrovně None / Medium / High / Extreme potvrzeny. Rozpor R-I2 vyřešen bez plného textu. Zbývá obsah „extrémní“ úrovně (pro návrh testu „střední × extrémní“) |
| V3 | Hicks et al. 2019, CHI PLAY (02 [26], 05 [10]) | AB (ACM 403) | Juice zvyšuje přitažlivost, kompetenci jen za specifických okolností | ◐ ↓ **střední.** Doplněno ze shrnutí v plném textu Kao 2024: bez vlivu na výkon, zlepšení jen v 1 ze 3 her. Plný text dál nedostupný |
| V4 | Nacke, Grimshaw & Lindley 2010 (05 [19]) | AB, n neznámé | Zvuk zlepšil všechny dimenze GEQ. Nese prioritu zvuku | ◐ **zůstává vysoká.** Abstrakt v repozitáři: jen „významný hlavní efekt“, směr ani n neuvedeny. Tvrzení oslabeno, B → B−. Priorita zvuku (P11) přitom stojí hlavně na této studii. **Sjednocovací kolo (5 dotazů):** plný text nedostupný (OUP i ScienceDirect paywall, repozitář Bolton bez souboru, ResearchGate 403), n dál neznámé. Nepřiřazená sekundární shrnutí: se zvukem pozitivní dimenze výš, negativní níž, jedno uvádí jen pět významných dimenzí (imerze, kompetence, pozitivní a negativní afekt, výzva) proti „všem“ v abstraktu. Směr tedy jen jako indicie, B− beze změny. **Volné zdroje vyčerpány, další krok jen přes knihovní přístup** (DOI 10.1016/j.intcom.2010.04.005, s. 336–343) |
| V5 | Kaaresoja, Brewster & Lantz 2014 (05 [22]) | AB | Prahy kvality odezvy | ◐ ↓ **střední.** Potvrzeno z abstraktu (body subjektivní současnosti, práh 75 %). Zbývá n |
| V6 | Wearden 1991 (06 [12]) | ⚠ sken nečitelný | CV 0,10–0,16, výpočet „holub naslepo“ | ✅ plný text. CV potvrzeno, pro 0,5–1,3 s 0,11–0,14 (n = 4). Doplněn perfektní zásah naslepo ~66–78 % |
| V7 | Abuhamdeh & Csikszentmihalyi 2012, PSPB (01 [20], 04 [3]) | AB; ~20 % přes Lomas | 01 N7, „optimální úspěšnost“ v 04 | ◐ ↓ **nízká.** Abstrakt znovu ověřen (01). Definice ~20 % a „těsné partie“ ověřeny z plného textu Lomas 2013 (04). Originál nedostupný. 01 N7 je přeformulované a na čísle nestojí |
| V8 | Finserås et al. 2021 (02 [31], 04 [17]) | AB | 04 N8, R-I1, R-N5 | ✅ plný text v 02 i 04. Těsná prohra nezvýšila chuť pokračovat, R-I1 a R-N5 rozhodnuty |
| V9 | Constant & Levieux 2019, CHI (04 [10]) | AB, n neznámé | 04 N5, stará KB K3 | ◐ ↓ **střední.** Abstrakt ověřen, plný text uzavřený, n neznámé. Kontrolou byla náhodná obtížnost. 04 N5 teď výslovně hodnotová volba, takže na studii nestojí |
| V10 | Nunes & Drèze 2006, JCR (03 [10]) | AB, plný text 404 | Efekt obdarovaného pokroku závisí na zdůvodnění | ✅ plný text (archivovaná kopie). **Opraveno:** účinek na pravdivosti zdůvodnění nezávisí (studie 3). Čísla z myčky potvrzena |
| V11 | Agarwal, Burghardt & Lerman 2017 (09 Z3) | recenzní stav neověřen | 09 klíčová zjištění 1–2, N1, N2, P5 | ✅ stav ověřen: recenzován jen poster ICWSM 2017. Hodnocení sníženo na B, tvrzení zůstávají s výhradou |
| V12 | Ballou et al. 2026 (01 [8]) | preprint | 01 klíčové zjištění 1, N10, P4 | ✅ stav ověřen: nerecenzovaný preprint, Stage 2 registrované zprávy, A−. Sledovat publikaci (není rešerše) |
| V13 | Loewenstein 1994 (08 [10]) | jen bibliografie | 08 klíčové zjištění 5, N1 | ✅ plný text (s. 75–98). Teorie potvrzena a posiluje 08 N1, N11. Heslo „mezera nesmí být příliš velká ani malá“ doslova v textu není |

### 4.2 Střední priorita (původně 40 položek → zbývá 30)

| # | Zdroj (bloky) | Stav před | Tvrzení | Po ověření |
|---|---|---|---|---|
| S1 | Fong, Zaleski & Leach 2015 (01 [18], 04 [4]) | AB | Rovnováha výzvy a dovednosti středně souvisí s flow | ○ |
| S2 | Løvoll & Vittersø 2014 (01 [21]) | SEK | Rovnováha není optimum | ○ |
| S3 | Sitzmann & Yeo 2013 (01 [31]) | AB | Self-efficacy je produkt minulých výkonů | ○ |
| S4 | Vancouver et al. 2001/2002 (01 [32]) | SEK–AB | Přehnaná jistota a role zpětné vazby | ○ |
| S5 | Murayama et al. 2010, PNAS (01 [14]) | AB | Podkopání motivace u časovací úlohy | ✅ plný text (PMC): n = 28, okno ±50 ms kolem 5 s |
| S6 | Hanus & Fox 2015 (01 [16], 08 [6]) | SEK | Povinné odznaky a žebříček snižují vnitřní motivaci | ◐ existence korigenda ověřena (08, Crossref). Obsah korigenda a plný text neověřeny. Hodnocení sjednoceno na B− (R29) |
| S7 | Sailer & Homner 2020 (01 [17], 08 [3]) | AB | Malé a nestabilní účinky gamifikace | ✅ plný text v 01. R18 opraveno v 08 |
| S8 | BANGS, Ballou et al. 2024 (01 [7]) | AB | Kandidátní nástroj do playtestu | ↓ **nízká.** R-N7 rozhodnut ve prospěch miniPXI. BANGS jen pro subškálu frustrace kompetence |
| S9 | Salmoni, Schmidt & Walter 1984 (04 [19]) | SEK | Hypotéza vedení | ◐ jen bibliografie a DOI z referencí. Originál neotevřen. Váha klesla, protože 04 N1 už na zákazu čísel nestojí |
| S10 | Winstein & Schmidt 1990 (04 [20]) | SEK; „33 %“ | Méně častá KR zlepšuje retenci | ◐ bibliografie ověřena (JEP:LMC 16(4), 677–691). Podle Marschall exp. 1 škodlivost plné KR neukázal. „33 %“ neověřeno |
| S11 | Marschall, Bund & Wiemeyer 2007 (04 [22]) | AB | Efekt obrácení je slabý | ✅ plný text. Opraveno: publikační zkreslení autoři doložili (vote-counting, fail-safe N) |
| S12 | Smeddinck et al. 2016 (04 [11]) | AB | Hráči preferují ruční volbu obtížnosti | ✅ plný text. **Oslabeno:** preference nevýznamná, robustní jen efekt na autonomii |
| S13 | Raviv, Lupyan & Green 2022 (04 [30]) | AB | Variabilita ztěžuje počáteční učení | ✅ plný text (autorský rukopis). „Starting small“. Netýká se předvídatelnosti časového signálu (R-N1) |
| S14 | Depping & Mandryk 2017 (03, 04 [34]) | neověřeno | Přisuzování příčin hráči | ✅ metadata a výňatek abstraktu (04). **Škála, ne experiment.** P7 tím ztratil zamýšlenou oporu. 03 stav převzal (R25) |
| S15 | Coglode, čísla z myčky (03 [11]) | SEK | 03 klíčové zjištění 2 | ✅ nahrazeno plným textem Nunes & Drèze (V10), sekundární zdroj už není potřeba |
| S16 | Wang et al. 2026, CHI PLAY (02 [11]) | AB a diskuse | „Dark Pattern Paradox“ | ✅ plný text: n = 153 / 129, β = 0,35, povědomí n. s. (p = 0,78) |
| S17 | Nagle et al. 2014 (02 [14]) | AB | Variabilní plán mírně lepší | ✅ plný text. **Oslabeno:** výhoda variabilního plánu nevýznamná ve všech měřítkách |
| S18 | Dixon et al. 2010, LDW (02 [30]) | neověřeno | Oslava nezávislá na hodnotě výsledku | ✅ abstrakt, zařazeno do registru. Bod 10 seznamu „ne“ už nestojí na neověřeném zdroji |
| S19 | Smets & van der Spek 2021 (05 [18]) | neověřeno | Šťavnaté zvuky zvyšují imerzi | ◐ abstrakt ověřen. Zbývá n a velikost efektu |
| S20 | Tan, Baxa & Spackman 2010 (05 [20]) | AB | Bez zvuku nejhorší výkon | ○ |
| S21 | Singhal & Schneider 2021 (05 [15]) | AB | Jakákoli haptika pomáhá | ○ |
| S22 | Smith 2013 (RPS) a Armitage, parametry Nuclear Throne (05 [5]) | SEK | Hitstop 10–20 ms, odhoz kamery 6 px | ◐ citace u Armitage znovu ověřena, originál RPS neotevřen. Hitstop je mezitím v kódu (`juice.js`) |
| S23 | Appington/Amplify 2013 (05 [33]) | neověřeno | 73 % hraje se zvukem | ○ |
| S24 | Deber et al. 2015 (05 [24], 06 [3]) | AB / SEK | JND 69 / 11 ms | ✅ plný text v 06 (N = 14). 05 stav převzal (R24) |
| S25 | Parhi, Karlson & Bederson 2006 (06 [16], 07 Z25) | AB | 9,2 / 9,6 mm | ✅ plný text v 06 i 07, n = 20, B v obou |
| S26 | Latence prohlížeče a canvasu (06 §4 bod 4) | neměřeno | Férovost perfektního okna ±100 ms | ◐ nový zdroj Pronk 2020 (06 [33], plný text): web 58–70 ms, SD ~7 ms na 2 telefonech. Zbývá levný Android a zátěž canvasem (spíš vlastní měření než rešerše) |
| S27 | Kalyuga et al. 2003 (07 Z6) | AB | Obrácení expertízy | ◐ jen bibliografie (repozitář blokuje přístup). Tvrzení stojí na Z5 a nově Raviv 2022 |
| S28 | Cao, Brucks & Reimann 2025 (08 [19]) | tisková zpráva | Struktura sbírky a blízkost dokončení | ◐ autoři, stránky a DOI ověřeny, „terénní data“ opravena. Vzorek neověřen. (V první verzi README chybné pořadí autorů) |
| S29 | Ruan, Polman & Tanner 2024 (08 [20]) | AB | Efekt „jeden krok od cíle“ | ◐ abstrakt znovu ověřen, DOI, online 2023. Vzorek neověřen |
| S30 | Cruz, Hanus & Fox 2017 (08 [5]) | SEK | Achievementy jako povinnost | ○ |
| S31 | Hamari 2017 (08 [2]) | AB | Odznaky zvyšují aktivitu | ○ |
| S32 | Kao & Harrell 2018 (08 [7]) | AB | Na typu odznaku záleží | ○ |
| S33 | Birk, Mandryk & Atkins 2016 (08 [26]) | AB | Odměna škodí silně ztotožněným hráčům | ◐ abstrakt znovu ověřen (manipulace ztotožněním s avatarem). Vzorek neověřen |
| S34 | Gagnon et al. 2022 (08 [22]) | AB | Humor nemění chování | ◐ abstrakt znovu ověřen, beze změny |
| S35 | Silverman & Barasch 2023, JCR (09 Z7) | AB | Přerušená série odrazuje | ○ |
| S36 | Landers, Bauer & Callan 2017 (09 Z10) | AB, N neověřeno | Žebříček jako implicitní obtížný cíl | ◐ DOI a rok online doplněny, replikace 2025 upřesněna. N dál neověřeno |
| S37 | Faulkner 2003 (09 Z27) a Medlock et al. 2002, RITE (09 Z25) | AB / SEK | Velikost a průběh testu 10–12 lidí | ◐ Faulkner ✅ plný text (průměr 85 %, SD 9,3, jedna webová úloha). Medlock ○ |
| S38 | Čl. 5(3) ePrivacy (09 Z39) a česká validace miniPXI, PXI, IMI nebo BANGS (01, 09) | N! / neověřeno | Lokální log se souhlasem, interpretace dotazníku | ◐ ePrivacy ✅ znění ověřeno včetně výjimek, N! → B. Česká validace ○ |
| S39 | **Nové:** Zhu, Dapena & Bingham 2009 (04, kandidát) | nestaženo | Učení úhlu vypuštění (mezera 4) | ○ nová položka z ověřovacího kola 04 |

Do střední priority přešly z vysoké V2, V3, V5 a V9 (viz 4.1).

### 4.3 Nízká priorita (původně 114 položek → zbývá 105)

| Blok | Položky | Stav | Po ověření |
|---|---|---|---|
| 01 | Tyack & Mekler 2024; Cameron, Banko & Pierce 2001; Lehtivuori 2023; Johannes et al. 2021; Vansteenkiste & Ryan 2013; Przybylski, Rigby & Ryan 2010; Klimmt, Hartmann & Frey 2007; Bandura 1977; Lazzaro 2004/2008; kritiky MDA; Keller & Bless 2008; Allen & Anderson 2018; Csikszentmihalyi 1990; Lepper, Greene & Nisbett 1973; Engeser & Rheinberg 2008 | AB / SEK / neověřeno | ✅ Lazzaro 2004 primární text (01 [29]; 08 převzal, R28). Ostatní ○. Nově sem patří V7 a S8 |
| 02 | Schultz 1997; Zendle & Cairns 2018; Garea 2021; Spicer 2022; King & Delfabbro 2018; pokyny EK k DSA; principy CPC; Ruggeri 2020; Clark & Zack 2023; diplomová práce z Tasmánie; Gal & Rucker 2018; Yechiam 2019; Brooks & Clark 2022; González-Cabrera 2023; Przybylski, Weinstein & Murayama 2017; Zald 2004; Sundali 2012; taxonomie dark patterns (Samper-Martínez, Veiga, CHI PLAY 2023); Cameron & Pierce 1994; Eisenberger & Cameron 1996 | AB / SEK / neověřeno | ✅ Samper-Martínez et al. (abstrakt, registr [32], rok 2026). Ostatní ○ |
| 03 | Spiel 2019; Buergi 2024; Meier GDC 2012; Pecorella a Quantic Foundry; Burrito Bison Postmortem; Kitten Cannon; Hamster Cannon; Flappy Golf; analýzy Erica Guana; vydavatel Learn to Fly | AB / neověřeno | ◐ Meier: anotace v GDC Vault, kritéria neověřena. ◐ Burrito Bison: název, autoři a video existují (registr [28]), obsah neověřen. Ostatní ○ |
| 04 | Hunicke 2005; Guo 2024; Petralito 2017; Gilleade & Dix 2004; McKay 2022; Bacelar 2022; Wulf & Lewthwaite 2016; Chiviacowsky & Wulf 2007; Juul 2013; Zohaib 2018; Langer 1975; God Mode v Hades | AB / SEK / neověřeno | ✅ Zohaib 2018 (abstrakt, registr [35]). Ostatní ○ |
| 05 | Swink, prahy 100 / 240 ms; Eiserloh 2016; Nijman 2013; Kelly 2014; Hicks 2019b; Klimmt 2019; Ng 2012; Friston 2016; Long & Gutwin 2018; Halbhuber 2023; Raaen & Eg 2015; Meiners 2025; Pichlmair & Johansen 2021; 12 principů animace | AB / SEK / neověřeno | ✅ Meiners (autor ověřen v 02, R5; 05 převzal, R23). ✅ Pichlmair & Johansen (R4). Ostatní ○ |
| 06 | Green, Ivry & Woodruff-Pak 1999; Niemi & Näätänen 1981; Meeuwsen 1997; Wireframe a PGA Tour 2K23; coyote time v Celeste; Rhythm Heaven; studie ovládání prakem; Repp & Su 2013; Directive 8020; Bergstrom-Lehtovirta & Oulasvirta 2014 | AB / ⚠ / neověřeno | ✅ Green 1999 (rok a místo vydání; skalární věta je citací Gettyho a Gibbona). Ostatní ○ |
| 07 | Desurvire & Wiberg 2009; Hoober 2013; Peacocke et al. GEM 2015; Fragoso; Birch 2012; **nově** Llanos & Jørgensen 2011 (jen citace v Z14) | AB / SEK | ✅ Peacocke (plný text, n = 20, srovnání s nejhorší variantou HUD). ✅ Hoober (stránka). ✅ Desurvire (bibliografie a strany, čísla z abstraktu). Fragoso, Birch ○, Llanos & Jørgensen ○ (nové) |
| 08 | Koivisto & Hamari 2019; Ruddle 2011; Dormann & Biddle 2009; Epley 2007; Darling 2015; Birk et al. 2016 (avatar); Lynch 1960; McIntosh & Schmeichel 2004; Carey 2008; Hamari & Eranti 2011; Berlyne 1954/1960 | AB / SEK / neověřeno | ✅ Hamari & Eranti 2011 (plný text, registr [28]). Ostatní ○ |
| 09 | Juulových pět rysů; Bauckhage 2012; benchmarky GameAnalytics a Tenjin; Kratochvíl 2025; Bai 2021; Butler 2013; Busch 2016; BrainHex; Tondello 2019; Krug 2009; Johnson 2018 a licence PENS; místo publikace Haider 2024; McAuley 1989; literatura k think-aloud | AB / SEK / N! | ✅ Haider 2024 (CHI PLAY 2024, PACM HCI 8). ✅ Kratochvíl 2025 (záznam, časopis, DOI). Butler a PENS dál N! |

Výpočet: 114 − 12 ověřených (Lazzaro, Samper-Martínez, Zohaib, Meiners, Pichlmair, Green, Peacocke, Hoober, Desurvire, Hamari & Eranti, Haider, Kratochvíl) + 2 přeřazené (V7, S8) + 1 nová (Llanos & Jørgensen) = **105**.

### 4.4 Uzavřít bez rešerše (sjednocení podle jiného bloku)

**Uzavřeno v ověřovacím kole:** Mekler 2017 (01, 03 převzaly stav), Zagal 2013 (09 převzal stav ověření), Law 2018 (01), Kivetz 2006 (08).

**Uzavřeno ve sjednocovacím kole 13. 10. 2026 (14):** nové nesrovnalosti R23–R36 z oddílu 3.4: Meiners v 05 (R23), Deber v 05 (R24), Depping & Mandryk v 03 (R25), design a hodnocení Mekler (R26), ~20 % Abuhamdeh v 01 (R27), Lazzaro v 08 (R28), Hanus & Fox (R29), hodnocení Klarkowski (R30), Finserås (R31), Clark (R32), Zagal v 09 (R33), Sailer v 08 (R34), Cao v 08 (R35) a hlavičky 01 a 05 (R36).

**Zbývá sjednotit (1):** Deci, Koestner & Ryan 1999 (08 dál jen sekundárně reprodukovaný abstrakt, 01 a 02 abstrakt a úvod). Čísla jsou ve všech blocích shodná, jde jen o zápis úrovně ověření.

### 4.5 Souhrn zbylé fronty

**Původně:** 167 položek (13 vysoká, 40 střední, 114 nízká) + 5 k uzavření bez rešerše.
**Ověřeno v kole 13. 10. 2026:** 33 položek (7 vysoká, 14 střední, 12 nízká). Dalších 22 je ověřeno částečně a zůstává ve frontě se zbytkem.
**Zbývá: 136 položek — 1 vysoká, 30 střední, 105 nízká.** Do toho jsou započteny přeřazené (V2, V3, V5, V9 do střední; V7, S8 do nízké) a dvě nové (S39 Zhu 2009, Llanos & Jørgensen 2011). K tomu **1 sjednocení bez rešerše** (4.4, Deci 1999; 14 sjednocení R23–R36 uzavřeno 13. 10. 2026). Sjednocovací kolo počty rešeršní fronty nezměnilo: V4 zůstává ◐ (viz níže). R12 nebyla položka rešeršní fronty, ale ověření kódu, a je uzavřená.

**Jediná vysoká položka:** V4 Nacke 2010 (směr a velikost efektu zvuku). Rozhoduje, zda je zvuk „největší mezera“ (P11), nebo jen jedna z kandidátních úprav. Po sjednocovacím kole jsou volně dostupné zdroje vyčerpané. Zbývá knihovní přístup, nebo rozhodnout bez něj: P11 držet jako střední oporu a účinek zvuku ověřit vlastním testem (zvuk zap. / vyp.).

**Doporučené pořadí dalšího kola:** (1) ~~sjednocení 4.4~~ hotovo kromě Deci 1999, (2) V4 jen s knihovním přístupem, (3) V2 (obsah „extrémní“ úrovně, kvůli testu juice), (4) S26 jako vlastní měření latence na levném Androidu, (5) S39 a další zdroje k mezerám 4 a 5 (učení úhlu, atribuce), (6) S38 česká validace dotazníku před playtestem.

---

## 5. Vztah ke staré KB

### 5.1 Principy K1–K7

| Princip | Vztah | Hlavní opora a změna |
|---|---|---|
| **K1** Vidím, v čem se zlepšuji | **podporuje a zpřesňuje** | St. Germain 2023 (stupňovaná a chybová KR funguje, binární ne; 04), Kao 2024 (vazba na úspěch; 01, 05), přičitatelnost (03 N8, 04 N4). Zpřesnění: rozlišit *hlášení odchylky* od *předpisu ideálu* (R-N3). Hrozí iluze zlepšení ze zpětné vazby po dobrých pokusech (Carter 2016; 04 N9). Rekord přes stejnou konfiguraci podporuje 03 N8 a 09 (ghost) |
| **K2** Moje volba skutečně něco mění | **podporuje, zpřesňuje a varuje** | Peng 2012 je nejbližší experimentální analogie volby vylepšení (01). Simulace ale ukazuje dominanci rovnoměrného nákupu a „past“ přehybů (03 §2.5, P8). Návrh z K2 „odolnost vůči nepřesné síle“ je od 0.6.1 implementovaný (`steady`), takže K2 a B07 je nutné přehodnotit: rozdíl se změnil, ale stále není cítit (01 N3, 03 N7) |
| **K3** Výzva je čitelná a má rytmus | **zpřesňuje, zčásti zpochybňuje data** | Audit časování ve staré KB je zastaralý (R9). Podle 06 šířka okna problém není, problémem je stálý střed a reakční past 320 ms (06 N4, N5). Čitelnost brzdí texty v canvasu asi 5 CSS px (07 N8). „Nezvyšovat obtížnost skrytě“ podporují Constant & Levieux a Denisova 2019, ale Denisova 2015 ukazuje, že skrytá DDA pohlcení zlepšila. Jde o hodnotovou volbu, ne o zákaz plynoucí z dat (R-I3). Kontrastu nebo zvuku jako kanálu čitelnosti si K3 nevšímá (07 A3, 06 N6) |
| **K4** Chci vidět, co je za dalším místem | **podporuje a zpřesňuje** | Kang 2009, To et al. 2016 a Kao 2024 dávají hypotéze K4 výzkumný základ (dříve čistě N). Zpřesnění: ukazovat jen *nejbližší* místo, vzdálená místa jako rámec (08 N1, N2), proti habituaci obměňovat obsah (08 N6), do 15 s poznat „kde jsem“ (08 N5). Riziko z K4 („vizuální slib nedosažitelného“) potvrzuje 08 klíčové zjištění 5 |
| **K5** Každý pokus může mít malý cíl | **podporuje a zpřesňuje** | Locke & Latham (blízký a učební cíl; 08), Kivetz (podíl vzdálenosti; 03 N3), žebříček jako implicitní cíl (09). Zpřesnění: u nováčků učební cíle místo výkonových (08 N3). Rozpor s 02 N5 o „počtu hodů do nákupu“ (R-N6) |
| **K6** Úspěch je cítit přímo při akci | **silně podporuje a zpřesňuje** | Blok 05 dává K6 empirii (Kao 2020 a 2024, Hicks 2019) a parametry: hitstop ~50–80 ms při perfektním zásahu, směrový otřes, potvrzení v nejbližším snímku. Odmítnutí „dopaminové dávky“ podporuje 02 §2.2 (Koepp n = 8 a reanalýza). K6 odkládá zvuk na samostatný test, 05 ho ale považuje za pravděpodobně největší mezeru. Pořadí je nutné přehodnotit |
| **K7** Vracím se k jiné výzvě, ne k povinnosti | **podporuje, ale zpochybňuje prioritu** | Etiku podporují 02, 08 a 09 (série, schůzky, Zagal). Režim s pevným rozpočtem (03 N6) a ghost (09 N3) jsou noví kandidáti. Data Axonu (09) ale ukazují, že většina webových hráčů se nevrátí vůbec. Prvních pět hodů je důležitějších než návratové mechaniky, takže P2 a etapa 3 jsou správně pozdě. „Připomenout zvolený cíl při návratu“ nemá oporu v Zeigarnikově efektu (08 §3.4). Ovsiankina platí jen pro okamžitou příležitost |

### 5.2 Backlog B00–B14

| ID | Vztah | Poznámka |
|---|---|---|
| B00 audit holuba | **vyřešeno v kódu** (ověřeno 13. 10. 2026) | Úspěšný holub rychlost ani stoupání nesnižuje (`vx = max(10, vx)`, `vy = max(.4, vy)`) a v párové simulaci 76 800 letů žádný let nezkrátil. 01 N4 opraveno. `simulation/QTE-BALANCE.md` je ze starších pravidel 0.4.0 a stojí za přeměření. Viz R12 |
| B01 brzy / pozdě | **silně podporuje** | St. Germain (04), reakční past a posun při uvolnění (06), pravdivý near-miss (02 N2). Zpřesnění: přidat i kategorii „brzy kvůli rychlé reakci na pruh“ (06 N5) |
| B02 jedna pravdivá rada | **podporuje a zpřesňuje** | 04 N7 a 07 N9. Přidává ustupování (04 N2). Formát rady viz R-N3 a R-N2 |
| B03 rekord stejné konfigurace | **podporuje** | Přičitatelnost (03 N8, 04 N4). Ghost a deska osobních rekordů (09 N3) |
| B04 odezva zásahu | **silně zpřesňuje** | 05 §4.4: odstupňovat perfektní, dobrý a minutý zásah, hitstop pozastaví i časovač QTE, lokální záblesk ≤ 3/s. Zvuk ne až „následně“, ale jako hlavní kandidát (K6) |
| B05 navazující cíl po 500 m | **podporuje a otevírá spor** | Kivetz (03), Locke & Latham (08), Axon (09). *Jak* to udělat, je sporné (R-N4) |
| B06 čitelnější první QTE a trénink | **zpřesňuje, zčásti zpochybňuje** | Andersen 2012: v jednoduchých hrách text a blokující tutoriál nepomáhají, pomáhá experimentování (07 N1, N2). „Volitelný trénink“ proto testovat jen jako nepovinný. Čitelnost: HTML překryv místo textu v canvasu (07 N8), kruh dosedá na střed (06 N7) |
| B07 odlišná větev | **částečně implementováno, zpochybňuje** | 0.6.1 přidal odpuštění síly a okna. Simulace přesto ukazuje „přehyby napřed“ jako past (03 N7, P8) |
| B08 tempo odměn | **zpřesňuje** | Schreiberova heuristika „rané úrovně rychle“ odpovídá dnešním cenám (03 N9). Práh grindu ~5 hodů bez nové volby (02 N5, naše volba). Alternativní ceny D (03 N2) |
| B09 blízké objevy | **podporuje a zpřesňuje** | Mikronarativy a redundance (Jenkins, Carson; 08 N5), habituace (08 N6). Empirie environmentálního vyprávění chybí |
| B10 dovednostní úkoly | **podporuje** | Učební cíle (08 N3), střídmé odznaky bez mincí (08 N8, Birk 2016), „bez dodatečných mincí“ podporují Deci 1999 a Birk 2016 |
| B11 atlas | **podporuje** | Struktura sbírky a blízkost dokončení (08 N7). Riziko povinnosti (Cruz 2017) |
| B12 pevná výzva | **podporuje a rozšiřuje** | Režim s pevným rozpočtem (03 N6), denní seed s archivem (09 N4, R-N10) |
| B13 kosmetika | **bez nové opory** | Jen nepřímo: Birk 2016 varuje před přidáváním odměn hráčům, kteří hru už mají rádi |
| B14 rychlé Znovu | **podporuje se zpřesněním** | 07 N10 (Enter a viditelnost „Znovu“ na mobilu). 02 §2.7 a 09 N2: „Znovu“ nesmí být vizuálně zvýhodněné proti odchodu a odchod po rekordu je legitimní |

---

## 6. Mezery

Stav po ověřovacím kole 13. 10. 2026. U každé mezery je uvedeno, zda ji ověření zmenšilo (◐), nebo trvá beze změny (○).

**Témata ze `00-temata.md`, která nikdo nepokryl nebo pokryl jen formálně:**

1. ○ **Empirie QTE (blok 6).** Kontrolovaná studie prožitku z QTE chybí úplně (06 §3.1, §4 bod 7). Jsou jen eseje (Leach) a teoretický abstrakt. Všechny závěry o QTE jsou syntéza z časovacích úloh. Ověření posílilo jen časovací základ (Wearden v plném textu), ne prožitek.
2. ◐ **Latence dotyku na webu (blok 6).** Zmenšeno: Pronk 2020 (06 [33]) změřil web na dvou telefonech (58–70 ms, SD ~7 ms, uvnitř nativního rozsahu). Problémem je hlavně stálý posun podle zařízení. Trvá: levné Androidy, zátěž naším canvasem a přepisem DOM v každém snímku. Spíš úkol pro vlastní měření nebo telemetrii (06 N12) než pro rešerši.
3. ○ **Mechanika nabíjení síly (blok 6).** Golfový ukazatel je doložen jen Wikipedií, studie ovládání prakem nenalezena. Recenzované srovnání způsobů švihu neexistuje.
4. ○ **Učení úhlu vypuštění (blok 4).** Žádná studie o učení úhlu projektilu (04 §2.11), přitom podle simulace úhel rozhoduje dvojnásobně (03 N8). Kandidát Zhu, Dapena & Bingham 2009 se nepodařilo stáhnout (S39).
5. ○ **Atribuce a vztah náhody a dovednosti (blok 4).** Mezera je po ověření *zřetelnější*: Depping & Mandryk 2017 je škála, ne experiment (04 [34]), takže P7 a návrhy rozpisu výsledku (03 N8, 04 N4) nemají přímou empirickou oporu. Škála se ale dá použít v playtestu. Langer 1975 dál neověřen. Přímou studii poměru dovednosti a náhody v arkádě nikdo nenašel.
6. ◐ **Žánr „launch & upgrade“ (blok 3).** Mírně zmenšeno: Burrito Bison Postmortem existuje (název, autoři, video; 03 [28]), obsah neověřen. Meier GDC 2012 jen anotace. Kitten Cannon (jmenovaný v zadání) neověřen, Toss the Turtle jen dvě stránky. Výzkum přínosu prestiže pro hráče neexistuje. „Tempo“ je pokryto jen heuristikami (Schreiber).
7. ○ **Animační principy (blok 5).** Jediný empirický doklad se týká haptiky. Délky easingu a 12 principů nejsou ověřené. Otřes obrazovky a kinetóza ve 2D na mobilu: data chybí. Hitstop a otřes jsou přitom mezitím v kódu (`juice.js`, 50 / 90 / 120 ms; 05 poznámka mimo rozsah).
8. ○ **Kolik mobilních hráčů hraje se zvukem (blok 5).** Jediné číslo je z roku 2013 a neověřené. Mezera je po ověření závažnější, protože oslabil i Nacke 2010 (P11): priorita zvuku teď stojí na dvou slabých místech.
9. ○ **První minuta a FTUE ve webových hrách (blok 7).** Kvantitativní data o odchodech v první minutě a o délce úvodu chybí. Hodent, Linehan a GDC talky o onboardingu nebyly prohledány. Axon (09) je jediná nepřímá opora a po ověření jde o recenzovaný poster (B).
10. ○ **Výsledková obrazovka (bloky 7 a 9).** Recenzovaný výzkum rozvržení výsledků neexistuje nebo nebyl nalezen. Hierarchie v 07 N9 je čistě odvozená. Peacocke (07 Z14) po ověření pro HUD slabší (srovnání s nejhorší variantou).
11. ○ **Mobilní rozvržení a orientace (blok 7).** Vliv orientace displeje na hraní ani čitelnost textu ve hrách na malých displejích nebyly prohledány. Parhi 2006 přidal jen polohu cílů na displeji (rohy nejhorší).
12. ◐ **Achievementy přímo ve hrách (blok 8).** Zmenšeno: Hamari & Eranti 2011 je doplněn (plný text, 08 [28]), jde ale o popisný rámec z her na Steamu, účinky neměří. Kvantitativní evidence dál pochází z gamifikace ne-herních služeb a vzdělávání (Sailer & Homner výslovně gamifikace učení). Mise na jeden pokus: žádná studie.
13. ○ **Environmentální vyprávění, flavor text a humor (blok 8).** Jen eseje (Jenkins, Carson). Humor stojí na jedné dětské studii (Gagnon, abstrakt znovu ověřen). Postava a pojmenování neživého předmětu je čistá extrapolace.
14. ○ **Ghost, sdílení a přirozené body zastavení (blok 9).** Ghost soupeř, motivace ke sdílení u Wordle a studie „natural stopping points“ zůstaly neověřené, přitom na nich stojí 09 N3, N4 a N2.
15. ○ **Česká validace dotazníků (bloky 1 a 9).** Ani miniPXI (po R-N7 hlavní nástroj), ani PXI, IMI či BANGS nemají dohledanou českou verzi.

**Napříč bloky (mimo seznam témat, ale relevantní):**

- **Děti jako hráči.** Bloky 02 (regulace, Radesky), 06 (CAT u dětí) a 08 (Gagnon) děti zmiňují, ale žádný blok systematicky neřeší dětské publikum. Stará KB z testu dětskou použitelnost výslovně nevyvozuje. Beze změny.
- **Vítr jako nová podmínka.** Navrhuje ho jen 04 N10. Herní ani výzkumná opora pro proměnlivé podmínky letu chybí. Beze změny. Raviv 2022 („starting small“) podporuje jen pořadí: proměnlivost až po zvládnutí základu.
- **Vizuální styly (4 témata v CLAUDE.md).** Žádný blok neřeší, jak motiv ovlivní čitelnost QTE a kontrast. 07 měřil jen výchozí barvy a Kyberpunk a kruh ve scéně neměřil vůbec. Beze změny.
- **Nové: near-miss s kontrolou hráče ve videohře.** Finserås 2021 měl předem daný výsledek. Clarkův moderátor „osobní kontrola“ tak ve videohře nikdo netestoval (R-I1). Pro nás to není blokující, protože bloky se shodly nepředpokládat motivační přínos těsné prohry.
- **Nové: jednotná škála hodnocení zdrojů.** Bloky používají různé škály (A–C, ●●●, A/B) a stejná studie dostává v různých blocích jiné hodnocení (R26, R29–R33). Pro společné shrnutí (krok 4) je potřeba jedna škála. *Sjednocovací kolo:* u sdílených studií jsou písmena sjednocená (pravidlo v 3.4), samotné legendy bloků zůstaly různé.

---

## 7. Zdroje citované ve více blocích

Pro sloučení ID ve společném shrnutí (07 to v poznámce k registru odkazuje sem). Doporučený formát citace ve shrnutí je `[blok:číslo]`, například `[04:23]` nebo `[09:Z3]`. U duplicit níže použít první uvedený blok.

| Zdroj | Výskyty | Poznámka |
|---|---|---|
| Ryan, Rigby & Przybylski 2006 | S1, 01 [1] | plný text v 01 |
| Tyack & Mekler 2024 | S4, 01 [6] | AB |
| Burgers et al. 2015 | S3 (01, 04, 07 jen odkazem) | — |
| Sweetser & Wyeth 2005 | S2 (01, 04 jen odkazem) | — |
| Deci, Koestner & Ryan 1999 | 01 [11], 02 [12], 08 [8] | čísla shodná |
| Mekler et al. 2017 | 01 [15], 02 [13], 03 [27], 09 Z11 | plný text v 02, 03, 09. R14 a R26 vyřešeno: 4 × 2, B (03 ●●●) |
| Zagal, Björk & Lewis 2013 | 02 [17], 08 [27], 09 Z8 | R13 a R33 vyřešeno, C ve všech |
| Hanus & Fox 2015 | 01 [16], 08 [6] | SEK v obou, existence korigenda ověřena (08, převzato v 01), B− v obou (R29) |
| Sailer & Homner 2020 | 01 [17], 08 [3] | plný text v 01. R18 a R34 vyřešeno |
| Kao et al. 2024 | 01 [26], 05 [13] | plný text v obou, A. V1 a R21 vyřešeno |
| Hicks et al. 2019 (CHI PLAY) | 02 [26], 05 [10] | AB (05 navíc shrnutí z Kao 2024). V3 částečně |
| Meiners et al. 2025 | 02 [27], 05 [14] | autor „Rich“, B− v obou (R5, R23 vyřešeno) |
| Pichlmair & Johansen 2021 | 02 [29], 05 [2] | R4 vyřešeno: IEEE ToG 2021, B v obou |
| Clark et al. 2009 | 02 [5], 04 [16] | plný text v obou, B v obou (R32 vyřešeno) |
| Finserås et al. 2021 | 02 [31], 04 [17] | **nová duplicita** z ověřovacího kola. Plný text v obou, B− v obou (R31 vyřešeno) |
| Fong, Zaleski & Leach 2015 | 01 [18], 04 [4] | AB |
| Klarkowski et al. 2016 | 01 [22], 04 [5] | R2 a R30 vyřešeno, B v obou |
| Abuhamdeh & Csikszentmihalyi 2012 | 01 [20], 04 [3] | R3 částečně (originál nedostupný), V7 přeřazeno, ~20 % shodně (R27 vyřešeno) |
| Deber et al. 2015 | 05 [24], 06 [3] | plný text v 06 (R22), 05 převzal (R24) |
| Long & Gutwin 2018 | 05 [26], 06 [6] | AB |
| Parhi et al. 2006 | 06 [16], 07 Z25 | R6 vyřešeno, plný text a B v obou |
| Game Accessibility Guidelines | 05 [32], 06 [21][22], 07 Z15–Z17 | — |
| Xbox Accessibility Guidelines | 06 [19][20], 07 Z18–Z21 | různé URL (devdocs.xbox.com proti learn.microsoft.com) |
| WCAG 2.2 | 05 [30], 07 Z22–Z23 | — |
| Apple HIG | 06 [17], 07 Z24 | údaje shodné |
| Kivetz et al. 2006 | 03 [9] (08 odkazem) | R16 vyřešeno |
| Depping & Mandryk 2017 | 04 [34], 03 (bez čísla, odkazem na 04) | **nová duplicita.** Škála, ne experiment, shodně v obou (R25) |
| Lazzaro 2004 | 01 [29], 08 (odkazem) | primární text ověřen v 01, 08 převzal (R28) |
| Juul (2009, 2010, 2013; Juul & Begy 2016) | 04 [13][14], 09 Z1, 05 [8] | různá díla, nejde o duplicitu |
