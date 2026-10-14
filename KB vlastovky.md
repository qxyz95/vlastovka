# Just Throw It — znalostní báze o papírových vlaštovkách

Rešerše a přístup ke všem uvedeným zdrojům: **11. 10. 2026**. Stav: podklady pro vývoj; hra ani její fyzika dosud nejsou implementované a otestované.

Zvolený směr je **fyzikou inspirovaná arkáda**, nikoli simulátor skutečného papírového modelu. Navazující úkoly obsahuje [Plán realizace](<archiv/Plan realizace.md>) (archiv). Původní rozbor zůstává historickým podkladem; při rozporu se řídit touto KB a aktualizovaným checklistem.

## Jak číst KB

Každé téma odděluje poznatek, omezení důkazů a naše herní rozhodnutí. NASA poskytuje obecné aerodynamické vztahy; odborná studie zkoumá konkrétní experimentální tělesa; Fold’N Fly poskytuje praktické konstrukční reference a vlastní pokusy. Žádný zdroj nepotvrzuje naše herní koeficienty, ekonomiku ani zábavnost.

## K1 — Let bez motoru

**Ověřený poznatek:** Po vypuštění působí na bezmotorový model tíha, vztlak a odpor. Ustálený klouzavý let v klidném vzduchu spotřebovává výšku. Počáteční hod dodává kinetickou energii. [S1](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/three-forces-on-a-glider/)

**Omezení zdroje:** Výklad ustáleného klouzání nevylučuje přechodné stoupání po hodu ani stoupání vůči zemi ve vzestupném proudu. Neurčuje délku letu našeho modelu.

**Rozhodnutí pro hru:** Síla hodu mění pouze počáteční rychlost. Za běžného letu není motor ani trvalý tah. Bez vnější pomoci musí model konečně dopadnout; krátké počáteční stoupání je přípustné.

## K2 — Vztlak a odpor

**Ověřený poznatek:** Velikosti sil lze zapsat `L = 0,5 × rho × V² × S × CL` a `D = 0,5 × rho × V² × S × CD`. Koeficienty shrnují závislost na geometrii a podmínkách a obecně vyžadují měření. Vztlak je kolmý na relativní proudění, odpor působí proti pohybu vůči vzduchu. [S1](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/three-forces-on-a-glider/), [S2](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/), [S3](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/)

**Omezení zdrojů:** Rovnice samy neurčují správné koeficienty papírové vlaštovky. Konstantní efektivní koeficienty nezachycují všechny úhly náběhu, odtržení proudění ani nestabilní let.

**Rozhodnutí pro hru:** Použít jednoduchý vektorový model se seřízenými efektivními koeficienty a omezeným rozsahem parametrů. Koeficienty jsou laditelné herní hodnoty. Neimplementovat plnou rotační dynamiku, CFD ani deformace papíru. Zvýšení vztlaku samo neoznačovat za univerzálně lepší konstrukci.

## K3 — Rychlost a vítr

**Ověřený poznatek:** Pro aerodynamiku rozhoduje vektor `v_air = v_ground − v_wind`. Vítr po směru letu při stejné rychlosti vůči zemi snižuje rychlost vůči vzduchu. [S4](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/relative-velocity/)

**Omezení zdroje:** Jednoduché příklady nejsou modelem turbulence nebo okamžité odezvy papírové konstrukce na poryv. Změna větru neznamená okamžitou změnu rychlosti vůči zemi.

**Rozhodnutí pro hru:** Světová poloha se integruje z rychlosti vůči zemi; síly používají vzdušnou rychlost. Základní prostředí má nulový vítr. Rozhraní jádra umožní zadat vektor větru pro kontrolní scénáře. QTE poryv je samostatný arkádový impuls, nikoli druhý současně aplikovaný fyzikální vítr.

## K4 — Klouzavost a délka letu

**Ověřený poznatek:** Při ustáleném klesání platí `tan(gamma) = ztráta výšky / vodorovná vzdálenost`. Menší úhel klesání umožňuje větší vzdálenost ze stejné výšky. [S5](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/glide-angle/)

**Omezení zdroje:** Ustálená geometrie klesání nepopisuje celý hod včetně stoupání a událostí. Sama neurčuje čas letu.

**Rozhodnutí pro hru:** Hodnotit zvlášť dolet, čas letu a výdělek za celý cyklus. Delší let není automaticky lepší výkon. Výhoda kluzáku v doletu a šipky v rychlém opakování je návrh k ověření, nikoli přírodní zákon.

## K5 — Vyvážení, přehyby a stabilita

**Ověřený poznatek:** Li a spoluautoři experimentovali s tenkými deskami a změnou polohy těžiště. Posun zatížení k přední hraně vedl přes různé režimy pohybu ke stabilnímu klouzání a při dalším posunu ke strmému pádu. [S6](https://doi.org/10.1017/jfm.2022.89)

**Omezení zdroje:** Jde o konkrétní geometrie a experimenty včetně desek ve vodě. Jejich optimální polohu těžiště ani koeficienty nelze bez ověření přenést na složenou šipku nebo široký kluzák. Studie neposkytuje univerzální návod „zatěžovat špičku“.

**Rozhodnutí pro hru:** Větev „Přehyby a vyvážení“ zastupuje lepší seřízení a efektivní klouzavost. V prototypu se těžiště ani momenty sil samostatně nesimulují; jejich účinek reprezentují laděné koeficienty modelu. Upgrade nesmí vést k nekonečnému růstu vztlaku.

## K6 — Kvalita papíru

**Ověřený poznatek:** Vlastní pokus Fold’N Fly s různými gramážemi u Basic Dart neukázal jednoznačné zlepšování doletu s vyšší gramáží. Výsledky ovlivňovala variabilita hodu a lehký vítr. [S7](https://www.foldnfly.com/lounge/paper-weight.php)

**Omezení zdroje:** Praktický experiment není univerzální materiálový zákon ani izolovaný test povrchového odporu. Gramáž, tuhost a kvalita nejsou zaměnitelné veličiny.

**Rozhodnutí pro hru:** „Kvalita papíru“ bude stylizované snížení aerodynamických ztrát při zachování hmotnosti. Nevydávat je za doložený účinek těžšího papíru. V první verzi nenabízet skutečné gramáže s tvrzením o přesné simulaci jejich vlastností.

## K7 — Reference obou modelů

**Ověřený poznatek:** Basic Dart je praktická reference úzké rychlé šipky s tuhými křídly. Stealth Glider je reference klouzavé konstrukce. [S8](https://www.foldnfly.com/1d.html), [S9](https://www.foldnfly.com/43.html)

**Omezení zdrojů:** Jednotlivé konstrukce ani jejich uváděné výsledky nedokazují obecnou převahu celé kategorie. Výsledky závisejí na zhotovení a hodu; nejsou kalibrací naší hry.

**Rozhodnutí pro hru:** Navrhnout vlastní rozlišitelné siluety: úzká šipka pro rychlý pokus, širší kluzák pro delší klouzání. Oba ponechat užitečné a ověřit, zda některý nedominuje ve všech metrikách. Ilustrace a skládací návody pouze odkazovat, nekopírovat do herních assetů.

## H1 — Schválená arkádová pravidla

Následující jsou naše návrhy, nikoli výsledky rešerše:

- Cíl 500 m, milníky 100/250/500 m a celkový postup 10–15 minut.
- Dva modely, tři společné větve po pěti úrovních a automatický let.
- Výchozí ceny 10/30/55/85/120 mincí a odměna `10 + floor(dolet / 10)`.
- Obvykle 2–3 QTE, jejich časovací okna a hypotéza přínosu 20–40 % doletu.
- Poryv jako omezený přírůstek rychlosti a holub jako časově omezené nesení. Jde o vnější pomoc; její energii nelze zahrnout do kontroly pasivního letu.
- Vzdálenosti jsou herní metry. Použití jednotek v rovnicích není tvrzením, že běžná vlaštovka z ruky dosáhne 500 m nebo že hra předpovídá skutečný let.

## H2 — Fyzikální kontrakt pro implementaci

Tato část je návrh rozhraní a zjednodušení, nikoli citace naměřeného modelu.

- Svět: `x` doprava, `y` vzhůru, zem `y = 0`; čas v sekundách, poloha v herních metrech, rychlost v m/s, hmotnost v kg a síly v N. Převod na pixely i obrácení obrazovkové osy Y patří pouze do renderu.
- Dolet: vodorovný rozdíl `x_dopad − x_vypusteni`; kamera, částice a QTE jej přímo nepřičítají.
- Jádro eviduje polohu, rychlost vůči zemi, čas a režim běžný let / nesení. Vzdušnou rychlost odvozuje z rychlosti vůči zemi a větru; neudržuje dvě nezávisle aktualizované kopie rychlosti.
- Konfigurace obsahuje kladnou hmotnost a plochu, hustotu vzduchu, gravitaci, efektivní `CL`, nezáporný `CD`, počáteční rychlost a úhel. Jejich konkrétní hodnoty se určí při ladění a zaznamenají s verzí pravidel.
- Odpor směřuje proti `v_air`, vztlak kolmo k ní podle orientace seřízeného modelu. Při nulové rychlosti jsou obě aerodynamické síly nulové a normalizace se přeskočí. Model není určen k akrobacii nebo obrácenému letu.
- Běžný krok je 1/60 s; krok 1/120 s slouží ke kontrole numerické chyby. Vstupy a události se vážou na simulační čas, nikoli počet vykreslených snímků.
- Síla hodu mění počáteční rychlost. Kvalita papíru snižuje efektivní ztráty při stejné hmotnosti. Přehyby a vyvážení mění efektivní klouzavost. Všechny úrovně musí zůstat v ověřeném konečném rozsahu.
- Poryv aplikuje omezený impuls jednou; nepřidává zároveň další vítr. Nesení má vlastní dobu a rychlost, po vypuštění plynule navazuje běžný let. Žádný režim neposkytuje přímý bonus ke vzdálenosti.
- Veřejné API nevzniká. Stejné interní jádro a konfigurace používá prohlížeč i dávková simulace.

## H3 — Co a jak ověřovat

**Fyzika:** směry sil, nulová vzdušná rychlost, protivítr a vítr po směru letu při stejné počáteční rychlosti vůči zemi, determinismus a dopad. V klidném vzduchu bez vnější pomoci sledovat `E = 0,5 × m × |v_ground|² + m × g × y`: vztlak nemá dodávat energii, odpor ji odebírá. Numerický drift a rozdíl doletu porovnat pro kroky 1/60 a 1/120 s; toleranci stanovit a zveřejnit podle použitého integrátoru, výsledky nepřepisovat umělým ořezem energie.

**Balanc:** zkontrolovat všechny úrovně větví u obou modelů a mezní kombinace. První menší dávku simulací provést před finální grafikou. Následnou plnou analýzu provést podle checklistu; profil bez úspěšných QTE reportovat samostatně.

**Metriky:** výdělek za minutu je součet mincí dělený celkovým časem cyklů v minutách, včetně hodu, letu, výsledku, dílny a nákupů, bez dvojího započtení animací. Oddělit čas simulovaného letu od odhadované režie UI. Zábavnost a čitelnost vyhodnocovat skutečným hraním.

**Stav důkazů:** Rešerše a kontrola dokumentace jsou hotové. Fyzikální testy, simulace balancu a hráčské testy jsou budoucí úkoly, bez naměřených výsledků.

## Registr zdrojů

U všech položek je datum přístupu **11. 10. 2026**. Poznatky výše jsou parafrázované; obrázky ani skládací návody nejsou převzaty.

| ID | Autor / instituce a název | URL | Omezení použitelnosti |
|---|---|---|---|
| S1 | NASA Glenn Research Center — Three Forces on a Glider | https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/three-forces-on-a-glider/ | Obecný výklad; neparametrizuje konkrétní papírový model. |
| S2 | NASA Glenn Research Center — Lift Equation | https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/ | Bez experimentálních koeficientů neurčuje číselný vztlak. |
| S3 | NASA Glenn Research Center — Drag Equation | https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/ | Koeficient souvisí s použitou referenční plochou; není univerzální konstanta. |
| S4 | NASA Glenn Research Center — Relative Velocity | https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/relative-velocity/ | Vysvětluje relativní rychlost, nikoli turbulenci a dynamiku poryvů. |
| S5 | NASA Glenn Research Center — Glide Angle | https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/glide-angle/ | Vztahy pro ustálené klesání; ne celý přechodový let. |
| S6 | Huilin Li, Tristan Goodwill, Z. Jane Wang, Leif Ristroph — Centre of mass location, flight modes, stability and dynamic modelling of gliders; JFM 937, A6 (2022) | https://doi.org/10.1017/jfm.2022.89 | Experimenty a model konkrétních tenkých desek, nikoli všech skládaných vlaštovek. |
| S7 | Fold’N Fly — Does Paper Weight Matter? | https://www.foldnfly.com/lounge/paper-weight.php | Vlastní praktický experiment s variabilitou hodů a větru. |
| S8 | Fold’N Fly — Basic Dart | https://www.foldnfly.com/1d.html | Reference jedné konstrukce; výkon závisí na podmínkách. |
| S9 | Fold’N Fly — Stealth Glider | https://www.foldnfly.com/43.html | Reference jedné konstrukce, nikoli univerzální definice kluzáku. |
