# Ladění systému progrese Monte Carlem (fáze F3)

**13. 10. 2026.** Fáze F3 z `09-plan-overeni.md`: zapracovat opravy mechanik 1–5 z `06`, velký běh simulátoru `simulation/progression/`, ladění čísel proti cílům `08` §10.2 a citlivost §10.3. Hra (`src/`) se neměnila. Výsledky a tabulky jsou v `simulation/progression/REPORT.md`, surová data v `simulation/progression/out/f3-*.{md,json}`. Původní čísla z `08` jsou uložená v `out/params-08.json`, doladěná sada je teď výchozí v `params.mjs`.

## Shrnutí na jednu stranu

- **Délka hry je v cíli.** Průměrný hráč (SKILLS, realistický nákup) dojde do cíle za **98 hodů / 53 min**, ve „šum ×2“ za **118 hodů / 62 min**. Slabý 115 / 62 a 140 / 72, expert 75 / 41 a 84 / 46. Dojdou všechny kampaně (~19 800 ve finálních bězích), nejhorší potřebovala 207 hodů (slabý „šum ×2“ s Dive, limit 250). Start byl 58 hodů / 31 min.
- **Poslední hody trvají ~28 s** (medián D4 28,5 s skutečného času), P90 všech letů 31–32 s. Délka letu se přitom neprodloužila: hra je delší díky cenám a tempu papíru, ne delším letům.
- **Dominance kapes je pod kontrolou.** Whistle dával +20–26 % doletu (s 3 použitími za let). S jedním použitím je nejlepší volbou u 6 z 8 kombinací profilu a sady, ale vždy jen o 1–7 % v minutách před druhou volbou (cíl ≤ 8 %).
- **Opravy 1–5 jsou zapracované s testy.** Dive po opravě 1 navíc potřeboval zavřít „vznášení ťukáním“: vybrání nulovalo běžné klesání (viz níže).
- **Nesplněno (data níže):** rozložení D2 / D3 (D3 je u SKILLS krátká, 16 hodů, ve všech ~15 cenových variantách 14–19), sucho max (10–14, cíl ≤ 8), část bonusů Atlasu pod 3 % (hlavně nové události, Shooting Star, Paper Crane, Packing Tape u přesných hráčů), pády Dive ve „šum ×2“, „Atlas napřed“ u experta SKILLS (23 %), „každý speciál nejlepší aspoň jednou“. U většiny jde o rozpor cílů nebo o mechaniku, ne o čísla. Návrhy k rozhodnutí jsou v části 5.

## 1. Opravy mechanik 1–5 (rozhodnutí v `06`) a jejich výklad

| # | Oprava | Jak je zapracovaná | Výklad tam, kde je víc možností | Test |
|---|---|---|---|---|
| 1 | Dive: zisk z vybrání jen z rychlosti nabrané střemhlavem | Simulátor si za ponoření vede `dive.gain` (zrychlení `accel·π·dt`, doznívá stejným `drag` jako `vx`). Při vybrání se převede `ex = min(gain, vx − cruise)`, push z událostí v `vx` zůstane. | Vzorec 08 `vy = max(vy,0) + …` nulováním klesání dával zisk i bez střemhlavu: ťuknutí na Dive kdykoli zastavilo klesání, takže by šlo „ťukáním“ vznášet (bot s mikro-ponořeními +5 %, při vyšší konverzi perpetuum). V duchu opravy („zisk jen ze střemhlavu“) se `vy` po vybrání vrací nejvýš na hodnotu ze začátku ponoření. Přepínač `specials.dive.fromDiveOnly`. | ano |
| 2 | Paper Crane: dosah ze šířky místa | `reach = [.03, .05, .08] × 304,8 m = 9 / 15 / 24 m` | Čísla karty (3 / 5 / 8 %) zůstala, jen se vztahují k šířce místa. | ano |
| 3 | Stone Skip: přísnější podmínka, cíl 30–50 % letů na úr. 3 | První odraz jen při rychlém dopadu: efektivní vodorovná rychlost (vč. výtrysku) > `1,75 · cruise`. Kámen, který se odrazil, skáče dál: druhý odraz úr. 3 už s původní podmínkou `0,5 · cruise`. | Karta říká „jen při dostatečné rychlosti“, proto rychlostní práh (ne „jen voda“: v D4 voda není a bonus by v pozdní hře zmizel). Rychlost při dopadu je skoro vždy nad `cruise` (push doznívá pomalu), proto práh 1,75. Podíl letů s odrazem na plné výbavě: průměrný SKILLS 41 %, slabý 30 %, „šum ×2“ 26 % / 14 %, expert ~65 %. Pojí odraz s dovedností (zásah těsně před dopadem). | ano |
| 4 | Shooting Star navíc, nové události nesmí snižovat dolet vytlačením | Hvězda se vloží před běžnou událost č. 2–4 s mezerou 0,5 s. Běžná událost po ní začne v čase, kdy by začala bez hvězdy, nejdřív ale 0,5 s po konci hvězdy. Rozvrh ostatních událostí (typy, mezery, náhoda) je s hvězdou i bez ní stejný. Pára, termika a dron se do směsi přidávají dál vahou (jako v 08), ale čísla jsou nastavená tak, aby v okamžiku odemčení dolet nesnižovaly (část 3). | Mechanika „navíc“ jen pro hvězdu (jak říká 06). U ostatních nových událostí jsem pravidlo splnil čísly, ne změnou rozvrhu. | ano |
| 5 | Strop E jako pojistka, zasažen v ≤ 20 % letů | Strop 2,0. S čísly 08 byl strop 1,5 nedosažitelný. Po zesílení Crowd Chain je maximum `0,6 + 0,85 + 0,7 = 2,15`, strop se zasáhne v 2–10 % letů kampaně (podle profilu), na plné výbavě průměrného hráče ve 26–33 % letů. | – | ano |

## 2. Hráč, boti a nákup (AUDIT F2 §5, body 6–11)

- **Profily:** základ `SKILLS` beze změny a povinně hlídaná sada **„šum ×2“** (`--profileset x2`). Navíc informativní sada **„výpadek pozornosti“** (`--profileset lapse`): hráč na událost s pravděpodobností 12 / 7 / 4 / 2 % (slabý / průměrný / dobrý / expert) vůbec nezareaguje. Výpadek zhoršuje zásah událostí, ale ne přesnost schopností, a tak modeluje nepozornost bez přehnané nešikovnosti botů (AUDIT §3.2). Výsledky leží mezi SKILLS a „šum ×2“ (průměrný 103 hodů / 55 min).
- **`scaleWithPace = true`** (vzorec 08). Varianta sond je v citlivosti.
- **Okna páry a Packing Tape:** okno obláčku ×0,9 okna poryvu (bylo ×0,6), částečný zásah páry 0,6 pushe (bylo 0) a poloviční termika 0,6. Packing Tape 30 / 45 / 60 % tak nikdy nedá víc než částečný zásah.
- **Realistický referenční nákupčí** (`strategy: realistic`, reference všech metrik). Vidí náhled U1 jako hra, ale přínos na minci odhaduje s chybou (log-normální, σ 0,5, nový los při každém rozhodnutí). Na vybranou věc čeká nejvýš 6 hodů příjmu, jinak koupí nejlepší z toho, na co má. Papíru dává váhu 1,25 (preference viditelného: papír mění vzhled vlaštovky a má největší náhled). Optimální nákupčí (`balanced`) je rychlejší o 4–16 %. Kontrola „Paper napřed“ tak konečně něco měří.
  - Model jsem zvolil předem a pak ho nelaďil, aby procházely cíle. Jediná změna během ladění: trpělivost 2 → 6 hodů. Se 2 hody hráč utrácel za drobnosti a papír kupoval o čtvrť později, než se otevřel, což je spíš karikatura než typický hráč. Citlivost na trpělivost (3 / 10), chybu odhadu (0,25 / 0,8) a preferenci papíru je v `REPORT.md`.
- **Záloha kapes:** záložní speciál (Cushion, Sharp Edge) se nasadí jen při kladném náhledu na posledních 3 hodech. Náhled koupě kapsy přehrává hod s tím, co by do ní hráč nasadil. Předtím ukazoval prázdnou kapsu, a proto se první kapsa kupovala až kolem 50. hodu.
- **Dive bot:** ponoří se kdykoli po vrcholu nad 25 m, nejvýš 3× za let, pouští v 5 m (pásmo nízkého průletu 2–7 m).
- **Pinwheel bot:** přetočí, když je nový los v průměru lepší než současný vítr (úr. 3 tedy přetočí i bezvětří).
- **`readNoise`** je v citlivosti (0 / 0,4).
- **Sucho slabého hráče** ve „šum ×2“ kleslo z 19 na 14 hodů. Hlavní příčinu jsem našel jako „zeď“ (část 4, iterace c15) a odstranil ji. Zbytek je strukturální (část 5).

## 3. Tabulka změn čísel proti 08

| Co | 08 | F3 | Proč |
|---|---|---|---|
| Copy Paper (ceny) | 100 / 180 / 300 | 180 / 320 / 520 | D1 měla 20 hodů, cíl 25–35 |
| Kraft Paper (ceny) | 650 / 900 / 1 150 | 1 210 / 1 600 / 1 980 | délka D2 |
| Washi (ceny) | 1 900 / 2 400 / 2 900 | 3 360 / 4 080 / 4 800 | délka D3, Washi se nesmí přeskočit úplně |
| Neon Foil (ceny) | 3 500 / 4 100 / 4 700 | 2 640 / 3 190 / 3 740 | **zlevněno**: D4 byla nejdelší (50 hodů), všechny pozdní náklady se hromadily v D4 |
| Kroky papíru | .65 / .80 / .75 / .85 (π 10,15) | .62 / .70 / .66 / .64 (π 2,86 / 4,96 / 6,94 / 8,86) | plná výbava létala 6,9 km (cíl ~5,4). Kroky D1–D2 jsou blízko 08, aby plně vybavený slabý hráč „šum ×2“ dosáhl hranice čtvrti (jinak „zeď“, část 4). Ubralo se hlavně z Neon Foil. |
| Power, Folds (ceny) | 40 / 120 / 260 | 50 / 160 / 350 | délka D1 |
| Folds: odpuštění / okna | .25 / +15 % | .30 / +20 % | pomáhá nepřesným hráčům víc než přesným, zmenšuje rozdíl SKILLS proti „šum ×2“ a slabý proti expertovi |
| Atlas úr. 2 / 3 podle čtvrti | 50/100, 200/400, 450/900, 750/1 500 | 40/90, 170/340, 600/1 200, 480/960 | „Atlas napřed“ byl o 60–85 % pomalejší, Atlas byl na minci výrazně horší než papír |
| Kapsy | 600 / 3 500 | 300 / 5 040 | první kapsa se kupovala kolem 50. hodu (cíl 20–40). Druhá se zdražila s ostatními cenami D3. |
| Crowd Chain | 8 %×4, 10 %×4, 12 %×5 | 10 %×4, 13 %×5, 17 %×5 | úr. 3 dávala 1 % (cíl ≥ 3 %) |
| Crane Lift | +2 m/úr. | +1,5 m/úr. | prodlužoval lety v D3 |
| Stone Skip | podmínka 0,5·cruise, vy 2,2 | 1,75·cruise (první dotek), vy 3,0 | oprava 3: z 100 % na ~40 % letů, silnější odraz místo četnosti |
| Gull Escort | – | beze změny | 3,3 % |
| Momentum | 2/3/4 % za místo, strop 30/35/40 % | 0,8/1,8/2,8 %, strop 8/18/25 % | dávalo 15,7 % (nad 15 %) a úr. 1 zdarma na začátku D3 hráče hned přenesla přes D3 |
| Echo | 40/60/80 % | 25/50/75 % | silně zvýhodňovalo přesné hráče (expert / slabý jen 0,5) |
| On Air | +8/12/16 % | +10/15/20 % | pod 3 % |
| Packing Tape | 25/40/55 % | 30/45/60 % | pomoc slabým, nejvýš jako částečný zásah |
| Pinwheel | přetočení 1/2/2 | 1/2/3 | úr. 3 přetočí i bezvětří, 1,6 → 2,9 % |
| Pára | okno ×0,6, zdvih 1, push 1,5, částečný 0, úr. 2 +0,3, výtrysk +15 % | ×0,9, 1,6, 2,4, 0,6, +0,7, +30 % | ve směsi snižovala dolet (−1,2 %) |
| Termika | jádro ±0,175 s, Δvy 3, push 1, polovina 0,5, úr. 2 +0,3 | ±0,25 s, 3,7, 3,0, 0,6, +0,7 | −1,5 % (nemá perfekt, takže ji v pozdní hře poráží poryv s Echem) |
| Ad Drone | Δvy 2,5, push 1,3, dvojice 35 % | 3,0, 2,2, 50 % | 0,9 % |
| Shooting Star | Starburst +40 %, slot 2.–5. | +100 % (4 s doznívá), slot 2.–4. | vzácný moment má být cítit (~+4 % letu, „+200 m“). Pětina hvězd ve slotu 5 se nestihla. |
| Strop E | 1,5 | 2,0 | oprava 5 (pojistka) |
| Whistle | 3× za let | **1× za let** | +20–26 % doletu, dominoval všem profilům |
| Calm Sky | push ×1,5 | ×1,6 | se ×1,5 byl záporný (−1 %). ×2,0 dominoval v minutách (méně událostí = víc zrychleného klouzání). |
| Sharp Edge | push ×1,3 | ×1,45 | nikde nebyl nejlepší |
| Paper Rocket | výtrysk +1·cruise | +1,4·cruise | nejlepší volba pro slabého hráče, jak čekalo 08 §5.3 |
| Dive | konverze .45 / .60, pásmo 2–5 m | .40 / .78, pásmo 2–7 m | po opravě 1 byl Dive ztrátový (−8 až −11 %). Zisk je v konverzi velmi strmý (0,45 → 0,9 = z −4 % na +42 %, vícenásobné ponoření). Nastaveno: vysoké vybrání ±2 %, expert v kampani srovnatelný s ostatními volbami. Širší pásmo kvůli pádům. |
| Bot Dive | cíl 3,5 m, 1× za let | 5 m, nejvýš 3× | pády slabého (SKILLS) 20 → 14 % |

Beze změny zůstaly: Power krok 0,14, push 1,5 (`scaleWithPace`), směs událostí 2-2-1-1-1, vítr, zrychlení klouzání 1,4×, UI 8 s, Glider, Gull Escort, Cushion, odměna `10 + dolet/10`, hranice čtvrtí a pravidlo „druh papíru se otevře v další čtvrti“.

## 4. Průběh iterací

Ladicí skripty jsou ve scratchpadu relace (`camp.mjs`, `atlas1.mjs`, `dive*.mjs`, `wall.mjs`, `trace.mjs`, `decomp.mjs`, `pkcamp.mjs`). Jednotlivé iterace běžely s n = 40–100 kampaněmi na skupinu, finální běh s n = 150–200.

| Krok | Co se měnilo | Výsledek (průměrný, SKILLS / „šum ×2“) | Poučení |
|---|---|---|---|
| 0 | 08 + opravy 1–5 + realistický nákupčí | 87 hodů / 48 min (netrpělivý nákupčí) | Dive po opravě −8 až −11 % |
| Dive I | konverze, pásmo, chování bota | vysoké vybrání +5 % i bez střemhlavu | nulování `vy` = vznášení ťukáním, zavřeno. Zisk je na `lowConv` extrémně strmý. |
| a2–a6 | síla nových událostí, Chain, Skip, Momentum | nové události z −2 % na 0 až +2 % | vodorovný push je slabý, protože strop klesání `vx/glide` váže klesání na rychlost. Push nese jen ~20 % doletu. |
| c0–c1 | kroky papíru ×0,86 | 65 hodů / 37 min | hra pořád krátká |
| c2–c5 | ceny ×1,5–2,5, trpělivost 6 | 91–119 hodů, D3 krátká, D4 až 52 | **trasování:** hráč došel do cíle jen s Paper 6, přes Atlas a rozptyl rekordu (dolety 2,5–5,1 km se stejnou výbavou) |
| decomp | rozklad dovednosti | expert / průměrný 0,55 | Dive u experta rozhodoval: kampaň se řídí rekordem, takže bonus s rozptylem má větší cenu než jeho průměr. Konverze 0,92 → 0,82. |
| c6–c9 | Momentum úr. 1, Echo, Folds, Tape, ceny Washi a Neon | c9: 96 / 114 hodů, všechna pásma OK | rozdíl sad zmenší to, co pomáhá nepřesným (okna) |
| c10–c13 | Atlas levnější, papír dražší, preference papíru | Paper napřed z +14–20 % na +1–9 % | |
| c15 | n = 100 | **sucho až 37–73 hodů** | **zeď:** plná výbava D2 slabého „šum ×2“ létala 0,90 hranice. Hráč měl vše koupené a další papír zamčený za hranicí. |
| c16–c21 | kroky papíru přesunuty z Neon do Copy a Kraft | zdi pryč (0,96–0,99 hranice), D3 krátká | strukturální rozpor (část 5) |
| f3-pre | plný běh se všemi kontrolami | **Whistle +20–26 %**, Skip 74 % letů, termika −0,6 % | Whistle 1×, Calm ×2,0, Skip 1,6 → 1,75 |
| d1–d7 | ceny ×1,1, D1 zpět, Atlas D2–D4 levnější | d7: 99 / 120 hodů | d8, d9, e1, e2 (jiné rozložení Kraft / Neon / Atlas D2) D3 jen zkrátily. Ponecháno d7. |
| kapsy | matice 4 profily × 7 voleb | Whistle a Calm vždy nejlepší | Calm ×1,6, Rocket 1,4, Sharp ×1,45, pásmo Dive 2–7 m |
| finále | n = 200, obě sady, druhý seed | 98 / 118 hodů, druhý seed 98 | |

**Chyba nalezená během ladění:** při zápisu komentáře do `params.mjs` se omylem zakomentovaly parametry botů Cushion, Rocket a Whistle, takže v jednom předběžném běhu tyto schopnosti nic nedělaly. Odhalila to sonda (přesně 0,0 %). Opraveno, ladicí běhy přes JSON to nezasáhlo, finální běhy jsou po opravě.

## 5. Nesplněné cíle a návrhy k rozhodnutí uživatele

Každý bod: co měří, proč čísla nepomohou a co navrhuji. Mechaniky jsem neměnil.

**5.1 D3 je krátká, D2 dlouhá (SKILLS 30 / 16 hodů, „šum ×2“ 34 / 18; cíl 20–30).** Součet D2 + D3 (46 / 52) je v cíli, rozdělení ne. V ~15 cenových variantách (Kraft, Washi, Neon, Atlas D2 a D3) zůstala D3 u realistického SKILLS hráče na 14–19 hodech. Proč: hranici D3 přeletí výbava z D2, k tomu bonusy D3 odemčené zdarma (Momentum, Thermal, Echo) a rozptyl rekordu (rekord je zhruba +25–35 % nad mediánem hodu). Washi se pak dokupuje až v D4. Snížit tempo z D2 nejde: pravidlo „další papír až v další čtvrti“ vytvoří zeď pro slabého „šum ×2“ (c15, sucho 37–73 hodů). **Návrh:** otevřít další druh papíru dřív, např. na 3. místě čtvrti (Bridge, Fields, Sky Terraces) místo na hranici čtvrti. Zmizí tím zeď a hranice čtvrtí pak mohou ležet výš vůči výbavě, takže D3 i D4 budou mít podobnou délku. Druhá možnost: rozšířit cíl D3 na 15–30.

**5.2 Sucho max 10–14 hodů (cíl ≤ 8), medián 2 (OK).** Delší sucha jsou v D3 a D4 při šetření na drahou položku a mezi místy po 305 m, která slabší hráč protíná zřídka. Medián maxima jedné kampaně je 7 (SKILLS) a 8 („šum ×2“), takže max ≤ 8 platí asi pro polovinu kampaní. Levnější pozdní položky by sucha zkrátily, ale zkrátí i hru. **Návrh:** buď cíl formulovat jako P90 maxima (dnes 10–12), nebo přidat malý pozdní cíl. Kandidát je pravdivá těsnost U4 („37 m short of …“) jako novinka. Rozhodnutí 06 ale výzvy navíc nechce, proto nic nepřidávám.

**5.3 Bonusy Atlasu pod 3 % (průměrný na plné výbavě, SKILLS / „šum ×2“):** Pinwheel 2,9 / 2,7, pára 1,2 / 1,0, Packing Tape 0,8 / 3,1, termika −0,2 / 2,6, Shooting Star 0,4 / 0,4, Ad Drone 2,6 / 1,9, Paper Crane 0,0 / 0,0. Ve „šum ×2“ navíc Crowd Chain 2,2 a Gull Escort 2,7: oba se vážou na kombo a zásahy, takže nepřesnému hráči dávají méně. V pásmu jsou Crane Lift, Stone Skip, Momentum, Echo a On Air (3–9 %), nad 15 % není žádný. Celý Atlas dává na plné výbavě ×1,56 (6 440 proti 4 130 m), 08 počítalo s ×1,4.
- **Paper Crane (0,0 %, tah v 7–10 % letů):** po opravě 2 tahá nejvýš 24 m z ~5 km, takže na doletu se projevit nemůže. Jeho přínos je pocit („doletěl jsem k místu“). Rozpor opravy 2 s cílem 3 %. **Návrh:** u Paper Crane měřit „přeletěná místa navíc“, ne dolet, a 3 % pro něj neplatí.
- **Shooting Star (0,4 %):** padá v 8–16 % letů. Průměr ≥ 3 % by chtěl +20–30 % doletu v jednom hodu, tedy loterii v rekordu, kterou 08 samo uvádí jako riziko. Teď dá ~+4 % v letu, kde se objeví. **Návrh:** měřit zisk v letu s hvězdou, ne průměr.
- **Packing Tape (0,8 % SKILLS, 3,1 % „šum ×2“, 6,8 % slabý „šum ×2“):** pomáhá jen tomu, kdo minul. To je záměr karty („slabý +8–12 %, silný +1 %“), cíl 3 % pro všechny je s ním v rozporu.
- **Pára, termika, dron (1–3 %):** v okamžiku odemčení dolet nesnižují (pára +1 %, termika 0 až +1,6 %, dron −1 až +2,7 %), na úr. 3 dají +2–5 %. Na plné výbavě je oslabují Echo a Gull Escort, které posilují poryv a holuba. Silnější čísla by prodloužila lety (termika přidá svislou rychlost) a zvětšila rozptyl. **Návrh:** dát termice „perfekt“ (střed jádra), aby se k ní vázalo Echo. Je to výklad simulátoru F1, ne text 08, ale mění to chování, takže rozhodnutí nechávám uživateli.
- **Pinwheel (2,9 %):** strop je daný slabým větrem (06). Nechat.

**5.4 Pády Dive ve „šum ×2“: slabý 19 %, expert 3 % (cíl ≤ 15 / ≤ 3); SKILLS 14 / 0 % OK.** Chyba bota je časová (σ = qte) × rychlost klesání ve střemhlavu (~15 m/s), takže σ 0,44 s znamená ±7 m. Čísly se srazí jen tím, že nízký průlet přestane existovat. **Návrh (mechanika):** strop rychlosti střemhlavu (např. 3× běžné klesání) nebo „sklouznutí“ místo dopadu při doteku země ve střemhlavu. Kromě toho Dive u slabého a průměrného hráče dolet snižuje (−4 až −8 %) a nikde není nejlepší kapsou. Zůstává volbou pro experty, kteří jsou s ním srovnatelní s ostatními volbami (41,6 proti 38,8–41,5 min).

**5.5 Kapsy: „každý speciál nejlepší aspoň v jednom profilu“ neplatí.** Nejlepší je Whistle (6× z 8), Sharp Edge (slabý SKILLS) a Paper Rocket (slabý „šum ×2“). Calm Sky, Cushion a Dive nejsou nejlepší nikde, ale rozpětí nejlepší / druhý je všude ≤ 7 % (OK). Whistle je silný, protože v tomto modelu je každá událost čistý zisk a SKILLS skoro nemíjejí. Riziko „minutí nuluje kombo“ se tak skoro neprojeví. Whistle už má jedno použití za let, další slabení čísly nejde (vyšší `minY` nemá účinek). **Návrh:** Whistle s cenou (např. přivolaná událost má užší okno nebo začíná bez varování), nebo připustit, že Whistle je „hlavní“ volba a ostatní jsou styl.

**5.6 „Atlas napřed“ u experta SKILLS o 23 % pomalejší (cíl ≤ 20 %), u slabého s asistencí těsně nad 20 %; ostatní profily a celá sada „šum ×2“ 5–19 % OK, sada s výpadkem pozornosti u experta 27 %.** Expert přechází čtvrti rychle a každý odklad papíru ho zdrží víc. Další zlevnění Atlasu by zkrátilo hru všem. Navrhuji přijmout.

**5.7 Okrajové hodnoty:** minuty D4 13,9 (cíl 14–20), D2 „šum ×2“ 17,8 min (cíl ≤ 16), „mezi místy“ P90 17 ve „šum ×2“ (cíl ≤ 14), koupené úrovně v cíli 87 % ve „šum ×2“ (cíl ≤ 85 %), Skip 26 % letů ve „šum ×2“ (cíl 30–50 %), nejdelší let 60,5 s (slabý s asistencí DQ-13, která zpomaluje čas při událostech; bez asistence nejvýš 57 s).

## 6. Jen pro playtest (Monte Carlo neověří)

- Čitelnost scény při ~220 m/s (plná výbava, průměrná rychlost) a oddálení kamery. Proti 08 (160 m/s) je rychlost vyšší, protože se zkrátil let, ne dolet.
- Pocit ze zrychlení klouzání 1,4×.
- Srozumitelnost Stone Skip s rychlostním prahem: hráč musí odraz spojit s „rychlým dopadem“ (rychlostní čáry, zásah těsně před zemí).
- Dive: je nízký průlet v pásmu 2–7 m čitelný a zábavný? Vícenásobné ponoření za let je silná zbraň, kterou bot používá opatrně.
- Whistle 1× za let: stojí jedno použití za zabranou kapsu?
- Shooting Star jako vzácný moment (~+4 % letu).
- Termika se silným vodorovným pushem (×3): působí ještě jako „stoupavý proud“?
- Humor postav, velký moment na hranici čtvrti, finále.
- Model realistického hráče (trpělivost 6 hodů, preference papíru) je odhad. Skutečné nákupní chování ukáže až playtest.
