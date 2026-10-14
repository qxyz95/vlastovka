# RippleLoop: rozbor hry a co z něj vzít pro vlaštovku

**14. 10. 2026.** Odpověď na otázku uživatele „Znáš hru RippleLoop na Steamu? … snažíme se napodobit tento gameplay, ale s vlaštovkou.“ Je to rozbor designu, ne kopie obsahu. Žádné texty ani assety hry se nepřebírají. Kód se neměnil.

Štítky jako v `research/kb`: **V** = ověřeno ze zdroje, **N** = můj výklad nebo odhad ze zdrojů, **?** = nezjištěno. Všechny zdroje jsem načetl 14. 10. 2026.

## Obsah
0. Shrnutí na jednu stranu
1. Co o hře víme (fakta se zdroji)
2. Jádro hry a smyčka
3. Ekonomika a progrese
4. Co recenze chválí a kritizují
5. Srovnání s naším návrhem (tabulka)
6. Návrh „RippleLoop s vlaštovkou“ (vstup pro 3. kolo)
7. Rizika a otázky pro uživatele
8. Zdroje

---

## 0. Shrnutí na jednu stranu

- **Hra existuje, ale ještě nevyšla.** RippleLoop (DistortedGameDev, sólový vývojář) je na Steamu jako „Coming soon“ bez data a ceny. Hratelné je jen **demo z 21. 8. 2026**: 40 recenzí, 97 % kladných. Celou hru proto nikdo nehodnotil a o její délce, konci a pozdní ekonomice nic nevíme. Všechno níže stojí na demu, patch notes a pár článcích.
- **O čem hra je:** házení žabek (kamínků po vodě) jako incremental. Hod → kamínek skáče po vodě → peníze podle vzdálenosti a násobku → strom vylepšení → další hod dál. Hra není idle: za letu se kliká (omezený počet „impulsů“ za hod, uhýbání překážkám, ptáci, kteří kamínek nesou).
- **Je to skoro náš žánr.** Hod, sledování letu, ptáci nesoucí předmět, vylepšení, která zrychlují a prodlužují dolet. Recenze ho srovnávají se starou flashovkou *Flight* (házení papírové vlaštovky), stejně jako se srovnává naše hra.
- **Co je u nich jinak a stojí za převzetí:** (1) **mince = vzdálenost × násobek** a čísla rostou viditelně, (2) **velký strom s mnoha malými uzly** a jasným „teď → po koupi“, (3) **rozpočet aktivních ťuknutí za hod** (hráč rozhoduje, kdy pomoct, ne jen reaguje na QTE), (4) **rychlý restart** hodu, (5) později **víc kamínků v jednom hodu** (pokud ho vůbec chceme).
- **Co nepřebírat:** prestige (hra ho podle IncrementalDB nemá a my ho nepotřebujeme), oddělené úrovně místo souvislé trasy, překážky, které ukončí hod.
- **Návrh v §6:** ekonomika „dolet × násobek čtvrti × kombo“ s cenami do desítek tisíc, strom Dílny rozbitý na ~90 malých uzlů, „Boost taps“ jako nová základní mechanika s počtem ve stromě, souhrn hodu s rekordy a tlačítko „Throw again“. Délka hry zůstane kolem 55–65 minut, jen se nákupy zhustí (cíl: v D1 nákup po každém hodu, později po 1–2 hodech).
- **Hlavní otázky pro uživatele (§7):** chceme rozpočet ťuknutí? Chceme víc vlaštovek v jednom hodu („letka“)? Má být hra delší, když demo RippleLoop kritizují hlavně za krátkost?

---

## 1. Co o hře víme

| Údaj | Hodnota | Zdroj | Štítek |
|---|---|---|---|
| Název | RippleLoop (jedno slovo), Steam app 3204820, demo app 4758450 | Steam | V |
| Vývojář a vydavatel | DistortedGameDev (oba) | Steam | V |
| Kdo to je | sólový vývojář, na itch.io výzva „50 her za rok“ (19 z 50, od prosince 2025). Předchůdce: jamová hra **Ricochet Clicker** (Trijam #358, 3 hodiny, Godot): klikání při dopadu kamínku zvyšuje násobek skóre | itch.io | V |
| Stav | plná hra „Coming soon / To be announced“; trailer 1. 6. 2026; playtest 21. 6. 2026; **demo 21. 8. 2026**; update dema 28. 9. 2026; přes 7 000 wishlistů (28. 9.) | Steam, IndieBunny, Playtester, Steam news | V |
| Datum vydání | neoznámeno. Discord uvádí 31. 12. 2026, to je nejspíš zástupné datum. GameSpew a The Nerdy Type píšou „2026“ | Discord, GameSpew | V (zástupné = N) |
| Cena | neuvedena | Steam, IndieBunny | V |
| Žánr Steam | Casual, Indie | Steam | V |
| Tagy plné hry | Incremental, Cozy, Relaxing, Physics, Nature, Pixel Graphics, Atmospheric, Arcade, Exploration, 2D, Minimalist, Colorful, Simulation, Cute, Singleplayer, Nostalgia, Idler | Steam | V |
| Tagy dema | navíc Action a **Sailing** | Steam demo | V |
| Jazyky | angličtina, francouzština (od 28. 9.) | Steam | V |
| HW | Windows, OpenGL 3.3, 250 MB | Steam | V |
| Hodnocení | plná hra: 0 recenzí (nevyšla). **Demo: 40 recenzí, 97 % kladných (Positive), za 30 dní 95 % z 22** | Steam, API recenzí | V |
| Herní doba | HowLongToBeat hru nemá. Demo: recenzenti měli při psaní recenze **31–60 min** (medián ~45 min), jeden „dohráno za 25–30 min“, jeden „po dvou bězích s vším vylepšeným“; nejdelší 4–8 h (opakované hraní) | API recenzí, diskuse | V (medián = N) |
| IncrementalDB | „No ending“, „No prestige“, Idle, Numbers go up, Linear progression, Loops, Early Access. Pozor: stránka má chybné datum (1. 1. 2026) a „Early Access“ hra není; údaje „No ending/No prestige“ beru jako slabé | IncrementalDB | V (spolehlivost nízká) |

## 2. Jádro hry a smyčka

**Co hráč dělá v jednom hodu (V ze zdrojů, doplněno N):**
1. **Výhoz.** Hráč hodí kamínek. Úhel dopadu na vodu je od update 28. 9. důležitější: strmý dopad kamínek zpomalí, hodně strmý ho potopí. „Hydro-launch“ (jedna z dovedností) míří vždy doprava a hráč řídí jen výšku (Steam news 28. 9.). V.
2. **Sledování skoků.** Kamínek skáče po vodě, HUD ukazuje vzdálenost, rychloměr, „surf bar“ a počítadlo impulsů (Playtester, Steam news). V.
3. **Aktivní zásahy.** Hráč má **omezený počet kliknutí za hod** (počítadlo „kolik kliků zbývá“ vpravo nahoře, Steam diskuse 4.–7. 9.). Kliknutím na kamínek ho popostrčí. Kupují se „aktivní boosty“ (The Nerdy Type). Recenze z 23. 8.: „není to opravdu idle, kliká se kvůli boostu a uhýbání překážkám“. V.
4. **Překážky.** Na trase jsou překážky, které hod ukončí, pokud kamínek nemá dost „odolnosti“ nebo je nepřeletí. Vylepšení zvětšují rozestupy překážek (The Nerdy Type). V.
5. **Ptáci.** Racek / holub / vlaštovka **nesou kamínek** vzduchem. Od 28. 9. ho neberou automaticky a hráč může nesenému kamínku dát impuls navíc. Vylepšení zvedne let ptáků výš. Na max úrovni si racci kamínky předávají a ty se vůbec nedotknou vody (Steam diskuse). Recenze opakovaně píšou, že racci a holub jsou **příliš silní**. V.
6. **Víc kamínků.** Ve stromě se odemyká **další kamínek** (diskuse 8. 9.: „nevěděl jsem, jak zaplatím vylepšení za 10k, než se odemkl další kámen“). Výsledek hodu má „nejlepší kámen“ a „celkem“ (941 m nejlepší, 7 513 m celkem, diskuse 24. 9.). Pokročilá technika „přeskakování“: hráč chytne opožděný kamínek, táhne a pustí, a ten přeletí vedoucí (diskuse 20. 9.). V. **Že se peníze počítají z celkové vzdálenosti všech kamínků, je N** (odvozeno z „total“ a z toho, že extra kámen zaplatil drahé vylepšení).
7. **Výsledek.** Souhrnná obrazovka s rekordy (rekordy při najetí myší), zkratka pro rychlý restart, tlačítko „Throw Again“ (Steam news, Playtester). V.

**Délka hodu: ?** Žádný zdroj ji neuvádí. Podle 941 m nejlepšího kamínku a tempa „flashové“ hry odhaduji desítky sekund (N, neověřeno).

**Aktivita × sledování (N):** víc aktivity než u nás. Hráč nereaguje na nabídnutou událost (jako naše QTE), ale sám **rozhoduje, kdy použít omezený impuls** a kterému kamínku. S více kamínky a ptáky je to spíš „žonglování“. Sledování ale pořád převažuje, jinak by recenze nepsaly „relaxing“ a „nechávám puštěné při učení“ (recenze 6. 10.).

## 3. Ekonomika a progrese

| Prvek | Co víme | Štítek |
|---|---|---|
| Měna | jedna, peníze („cash“). Výdělek roste se **vzdáleností a násobkem** (The Nerdy Type 7. 9., Playtester „multipliers boost your score“) | V |
| Násobek | v předchůdci Ricochet Clicker násobek rostl kliknutím při dopadu. V RippleLoop podrobnosti ? (pravděpodobně skoky / řetěz skoků, název hry „chain together stone skips“) | V / N |
| Strom | **tech tree** se zamčenými uzly a cenami; každý uzel ukazuje počet úrovní a kolik je hotovo, hodnotu „teď → po koupi“ (Steam news 28. 9.) | V |
| Typy vylepšení | let (antigravitace), rychlost, aktivní boosty (kliky), odolnost proti překážkám, rozestup překážek, ptáci, další kamínek, dovednosti (Hydro-launch, „surf“, „dive“, „boost“) | V |
| Ceny | demo už má **vylepšení za 10 000** | V |
| Úrovně (mapy) | víc vodních ploch: pouštní oáza, chata u jezera, ledové moře, krystalová jeskyně, borové kopce, lesní řeka (screenshoty). GameSpew: „many unlockable levels“. Recenze 23. 8. zmiňuje upgrady vázané na **checkpointy** | V |
| Prestige / reset | podle IncrementalDB „No prestige“. Nic o resetu jinde | V (slabé) |
| Offline / idle | žádná zmínka o offline výdělku. Tag „Idler“ je, ale hráči píšou, že idle není | V |
| Automatizace | ptáci od 28. 9. kamínek neberou sami, tedy vývoj šel **proti automatice** | V |
| Růst čísel | demo: z prvních hodů na ~1 km nejlepšího kamínku a 7–12 km celkem | V |
| Konec | demo končí hláškou „dokončil jsi demo“. O konci plné hry ? (IncrementalDB „No ending“ je nejisté) | V / ? |
| Dávkování novinek | nové síly a vodní plochy se odemykají postupně, svět se „otevírá s postupem“ (Steam popis). Tempo neznáme | V / ? |

**Vizuál, kamera, zvuk:** 2D pixel art (GameSpew: „gorgeous pixel art“), boční pohled, stopy trajektorie a kruhy na vodě. Hudba klidná, chválí se zvuk šplouchnutí (recenze 6. 10.). Kamera ?, z videí jsem ji neověřil. V.

## 4. Co recenze chválí a kritizují

Citace jsou krátké, z recenzí dema na Steamu (API recenzí, načteno 14. 10.) a z článků.

**Chválí**
- uspokojení z doletu: „There is something intensely satisfying about watching your little pebble soar through the air“ ([The Nerdy Type, 7. 9. 2026](https://www.thenerdytype.com/post/rippleloop-turns-skipping-stones-into-an-incredibly-satisfying-incremental))
- klid: „ridiculously cozy“, pixel art a hudba ([GameSpew, 6. 9. 2026](https://www.gamespew.com/2026/09/rippleloop-demo/)); „great game to play if you want to sit back and relax“ (recenze 2. 10.)
- nostalgie flashovek: „reminisce the old days of flash game“ (25. 9.), „Felt similar to the flash game Flight“ (31. 8.)
- dovednost v incrementalu: japonská recenze (1. 9.) chválí boost a dive jako dovednostní prvek; „UNBELIEVABLE potential“ (26. 9.)
- balanc stromu: „balance works well… like the tech tree“ (diskuse 8. 9.)
- „so addictive“ / „super addictive“ (5. 10., 11. 9.). Pro nás spíš varování než vzor (P13).

**Kritizují**
- **krátkost (nejčastější):** „The demo is really short“ (23. 9.), „very short“ (17. 9.), „very upset to see the message that I had completed the demo“ (26. 9.), dohráno za 25–30 min (28. 8.)
- **příliš silní ptáci:** „seagulls need to be nerfed“ (7. 9.), holub „overpowered“ (1. 9.), racci na konci dema silní (diskuse 8. 9.). Lekce: pomocník, který nese předmět, snadno přebije vlastní hod.
- **hod by měl víc záviset na technice** (7. 9.). Vývojář na to 28. 9. reagoval úhlem dopadu.
- **neefektivní běhy**, dokud hráč nedosáhne checkpointu (23. 8.). To je naše „sucho“.
- UI: počítadlo kliků daleko od místa, kam se dívám (diskuse), zavírání menu klávesou Esc (28. 8.)
- jedna záporná: podezření na AI texty (10. 10.)
- O grindu a konci plné hry recenze nic neříkají, protože hra nevyšla.

**Podobné hry zmíněné v recenzích a katalozích:** *Flight* (flashovka s papírovou vlaštovkou), obecně flashové „launch“ hry. Katalog TopIncrementalGames řadí vedle: *Far Fishing*, *Far Mining*, *Just Keep Fishing*, *Fishing Inc*, *Profit Sea Incremental*, *My Fire Is Bigger Than Yours*, *Get Rid Of Those Corners*. To je katalog, ne recenze.

## 5. Srovnání s naším návrhem

Podklady: `06-rozhodnuti.md` (hlavně 14. 10.), `08-navrh-kolo2.md`, `10-ladeni.md`, `research/svet/01-zivy-svet.md`, `research/kb/README.md` (P1–P15), `CLAUDE.md`.

| Prvek RippleLoop | U nás | Doporučení | Proč |
|---|---|---|---|
| Hod → let → peníze → strom → hod | **máme** (08: Dílna, Atlas, Kapsy) | ponechat | stejné jádro |
| Peníze = vzdálenost × násobek | **nemáme** (`10 + dolet/10`), ale **rozhodnuto 14. 10.** (rychlejší růst, násobek čtvrti, „+X % mincí“) | **převzít** | přesně to, co 06 chce. Násobek musí záviset na výkonu (kombo, místa), ne jen na čase (P1, P12) |
| Ceny v tisících (10k v demu) | rozhodnuto 14. 10. | převzít | viz výše |
| Strom s mnoha malými uzly, „3/5“, „teď → po koupi“ | máme 18 úrovní Dílny + 32 Atlasu + 2 kapsy; náhled U1 „≈ +X m“ | **upravit**: víc menších uzlů, ukázat i hodnotu efektu | incremental žije častými nákupy; 06 „čísla mají být vidět“ |
| Omezený rozpočet kliků za hod | **nemáme**. Máme QTE události + jednu aktivní schopnost v kapse (Z6 jedno tlačítko) | **upravit**: „Boost taps“ jako základ, počet ve stromě, sdílí tlačítko podle Z6 | dává hráči rozhodnutí místo pouhé reakce (P7, „šikovnost středně“). Riziko kolize s QTE, viz §7 |
| Ptáci nesou předmět, impuls k neseném | **máme** holuba-kurýra (`companion3d.js`, `f.carry`) a Gull Escort (A08) | ponechat, **hlídat sílu** | recenze RippleLoop: ptáci přebíjejí hod. Strop E a koše §2.7 v 08 už to řeší |
| Úhel dopadu / strmost ovlivní výsledek | máme úhel výhozu a Stone Skip s rychlostním prahem | ponechat | už v návrhu |
| Překážky, které ukončí hod, odolnost | **nemáme** | **nepřevzít** (zatím) | trest mimo hráčovu kontrolu u vysokých rychlostí, ztížila by čitelnost 3D při 200 m/s (10 §6). Případně jen v Night Route |
| Víc kamínků v jednom hodu | **nemáme** | otázka pro uživatele (§7), návrh jen jako pozdní „Wingmen“ | velký zásah do kamery, 3D výkonu a QTE (jedna vlaštovka = jedna pozornost, `01-zivy-svet` §1.4) |
| Oddělené vodní plochy (úrovně) | souvislá trasa 16 míst, vše z Dílny (06 varianta B) | **nepřevzít** | rozhodnuto 13. 10. (žádné startovní schránky) |
| Checkpointy zvyšují efektivitu | Atlas: místo odemkne bonus | ponechat | totéž v jiné podobě |
| Prestige | nemá (asi) | **nepřevzít** | hra má konec (06, 14. 10.). Reset by rozbil Atlas jako trvalou sbírku |
| Konec dema hláškou | finále „Delivered.“ + souhrn po dohrání | ponechat | rozhodnuto |
| Offline výdělek | nemá | nepřevzít | P13 (žádné „vrať se pro odměnu“) |
| Automatika jde proti hráči (ptáci neberou sami) | automatika QTE ve stromě jen na běžný zásah (06) | ponechat | stejná logika: automatika nesmí vzít hráči podíl (P7) |
| Rychlý restart, „Throw Again“ | výsledek → Dílna → míření, UI ~8 s na hod (simulátor) | **převzít** | incremental tempo, odhad −10 % minut (§6.5) |
| Souhrn hodu s rekordy | výsledek + komiksový strip (06) | **upravit**: přidat řádek rekordů a rozpis „hod / bonusy“ | P7, 06 „čísla vidět“ |
| Klidná hudba, šplouchnutí | hudba generovaná v kódu, rozpočet 0 | ponechat | |
| 2D pixel art | 3D komiksové město (rozhodnuto) | nepřevzít | rozhodnuto |
| „Addictive“ jako chvála | P13 proti nutkavosti | **nepřevzít jako cíl** | |
| Demo 30–60 min, kritika krátkosti | celá hra 53–62 min (F3) | otázka (§7) | publikum incrementalů čeká víc; my máme konec a „bez grindu“ |

## 6. Návrh „RippleLoop s vlaštovkou“

Cíl: převzít to, co dělá RippleLoop „incrementalem“ (rostoucí čísla, časté malé nákupy, vlastní rozhodnutí za letu, rychlý další hod), a zachovat vlaštovku, živé 3D město, souvislou trasu, konec hry a P13. Je to vstup pro 3. kolo návrhu progrese, které má podle 06 začít až po F5.

### 6.1 Smyčka jednoho hodu (~30 s, beze změny délky)
1. **Míření** jako dnes, vítr ukázaný předem.
2. **Let:** sledování města (60–70 % času, `01-zivy-svet` §1.1), QTE události jako v 08.
3. **Nově: Boost taps.** Hráč má za hod 1 ťuknutí (D1), stromem až 5–6. Ťuknutí kdykoli mimo událost dá krátký vodorovný výtrysk (koš „krátké výtrysky“ z 08 §2.7, doznívá ~2 s, nepřidává výšku). HUD ukazuje zbývající ťuknutí **u vlaštovky**, ne v rohu (poučení z diskuse RippleLoop). Rozhodnutí hráče: použít hned, nebo šetřit na konec letu / na zachránění klesající vlaštovky. Podle Z6 má tlačítko přednost událost.
4. **Dopad → souhrn:** dolet, přeletěná místa, kombo, **mince = základ × násobky** (rozepsané), rekord. Tlačítka „Throw again“ (rovnou míření, Dílna se přeskočí) a „Workshop (2 new)“, pokud je na co.

### 6.2 Ekonomika
Jedna měna (◈), žádná druhá prestižní měna.

```
mince = (10 + dolet/10) · M_čtvrť · (1 + kombo_max·k) · (1 + Σ coins%)
M_čtvrť  = 1 / 4 / 15 / 50 podle nejvzdálenější dosažené čtvrti (odemyká se doletem, ne časem)
kombo_max = nejvyšší kombo v hodu, k ≈ 0,05 (výkon hráče je vidět v penězích, P1)
coins%   = uzly stromu „+10 % mincí“ (5–8 uzlů v celé hře, levné, aby čísla rostla často)
```
- Ceny se násobí stejným `M_čtvrť` jako příjem, takže **délka hry se tím sama nemění**, mění se jen velikost čísel: D1 desítky až stovky ◈, D4 desítky tisíc (3. úroveň pozdního bonusu ~10 000–40 000 ◈, jak chce 06).
- Násobek z komba a „+X %“ je to, co hráč cítí jako „rychlejší než lineární“. Simulátor musí ověřit, že nezkrátí hru expertovi víc než o ~10 % (kombo zvýhodňuje přesné, „šikovnost středně“).
- **Bez prestige, bez offline, bez denních odměn** (P13). Night Route (odemčená ve stromě) je jediná „druhá smyčka“: stejná trasa v noci, mince dál na zbylé uzly, rekordy úseků.

### 6.3 Strom (místo dnešních 3 větví Dílny)
Dílnu rozbít na **~60 malých uzlů** (dnes 18 úrovní) se stejnou celkovou silou, plus Atlas 16 × 3 a kapsy. Celkem ~110 nákupů za hru místo ~60.
- **Paper** zůstává páteř (žebřík rychlosti, druh papíru otvírá 3. místo čtvrti podle 06). Každá úroveň papíru se rozdělí na 3–4 dílčí uzly (např. „Crease +4 % speed“).
- **Nové větve:** Boost taps (počet, síla), Coins (+%), Courier (holub častěji, ale pevný strop síly; poučení z RippleLoop), Autopilot (automatika QTE jen běžný zásah, 06), Night Route (jeden drahý uzel na konci).
- UI: uzel ukazuje „2/4“, „Speed 82 → 88 m/s“ a náhled U1 „≈ +120 m · past Wind Ridge“.
- **Cíl tempa:** v D1 nákup po každém hodu, v D2–D4 po 1–2 hodech. Sucho bez novinky jako dnes P90 ≤ 8 (06).

### 6.4 Co by se změnilo v návrhu 08
| 08 | Změna |
|---|---|
| §2.3 `odměna = 10 + floor(dolet/10)` | vzorec 6.2 |
| §3 Dílna 3 větve, 18 úrovní | strom ~60 uzlů, větve Boost / Coins / Courier / Autopilot / Night Route |
| §5 Kapsy | zůstávají, ale Paper Rocket se kryje s Boost taps → sloučit nebo Rocket změnit (např. jeden silný výtrysk místo dvou slabých) |
| §6 Z6 jedno tlačítko | doplnit pravidlo pro Boost taps (mimo událost, ne do 1 s před ní) |
| §8.4 Finále | souhrn po dohrání (06) s počty: hody, minuty, nejlepší kombo, místa za hod |
| §10.2 metriky | přidat „hody mezi nákupy“, „podíl mincí z komba“, „využití Boost taps“ |
| UX výsledek | „Throw again“ přímo z výsledku |

### 6.5 Změny v simulátoru (`simulation/progression/`)
- `campaign.mjs:108` má odměnu natvrdo (`10+Math.floor(x/10)`). Přesunout do `params.mjs` jako `economy.reward` s `M_čtvrť`, `kombo` a `coins%`; model musí vracet nejvyšší kombo letu.
- `params.mjs`: ceny přepočítat × `M_čtvrť`, Dílnu přepsat na seznam uzlů (`{id, branch, price, effect}`) místo polí `prices/steps`. `campaign.mjs` `options()` (ř. 52–55) to musí umět jako nový druh nákupu.
- `model.mjs`: mechanika Boost taps (rozpočet, výtrysk v koši burst) a bot, který ťuká (strategie: šetřit na pokles pod X m, nebo hned).
- Nové metriky: hody mezi nákupy (medián a P90 podle čtvrti), podíl mincí z komba, rozdíl expert / slabý v minutách.
- UI čas na hod 8 s → ~5 s s „Throw again“ (parametr). Hlídat, aby se tím nezměnily strategie nákupčího (realistický bot má trpělivost v hodech, ne v sekundách).

### 6.6 Dopad na délku hry (N, odhad bez simulace)
- Ekonomika 6.2 se stejně škálovanými cenami: počet hodů **beze změny** (~98–118 průměrný hráč).
- Kombo v násobku: expert −5 až −10 % hodů, slabý ~0 %. Rozdíl slabý / expert se zvětší, což jde proti „středně“. Vyrovnat cenami nebo menším `k`.
- Boost taps: +3–8 % doletu na stejné výbavě → ceny je třeba zvednout, jinak hra o ~5 % kratší.
- Rychlý restart: 98 hodů × 3 s ≈ **−5 min** (53 → ~48 min). Pokud má hra zůstat ~1 hodinu, zvednout ceny o ~10 % (víc hodů, ale každý rychlejší, víc nákupů).
- Night Route: +15–30 min navíc, dobrovolně.

## 7. Rizika a otázky pro uživatele

**Rizika**
1. **Nutkavost.** RippleLoop chválí recenze jako „addictive“. Častější nákupy a rostoucí čísla zvyšují tah ke „ještě jednomu hodu“. Pojistky: konec hry, žádné denní odměny, žádný offline, rovnocenná tlačítka „Keep flying / Done for today“ (08 U2), měřit v playtestu i dobrovolné přestání (P4, P13).
2. **Čísla zakryjí hráče (P7).** Násobek čtvrti roste sám. Proto násobek z komba a rozpis „tvůj hod / bonusy“ v souhrnu.
3. **Kolize Boost taps s QTE.** Dvě různé věci na jedno tlačítko (Z6). Pokud playtest ukáže zmatek, Boost taps omezit na klidné úseky s viditelným signálem.
4. **Pomocník přebije hod.** RippleLoop to má s ptáky. U nás holub-kurýr a Gull Escort musí zůstat ve stropu E.
5. **Hra „podle RippleLoop“, ale RippleLoop ještě nevyšel.** Neznáme jeho pozdní ekonomiku ani konec. Bereme principy z dema, ne ověřený celek. Po vydání (2026?) rozbor zopakovat.
6. **Demo je kritizované za krátkost.** Naše celá hra má ~1 hodinu. Pro web je to v pořádku, pro Steam (Electron, 06) může publikum incrementalů čekat 2–5 hodin.

**Otázky (odpověď stačí „ano / ne / jinak“)**
1. **Chceš „Boost taps“?** Příklad: za let máš 3 ťuknutí, kdy chceš. Když vlaštovka klesá těsně před Wind Ridge, ťukneš a přetáhneš ji přes hranici. Ve stromě koupíš čtvrté ťuknutí. *Doporučuji ano, jako základ hry, Paper Rocket z kapes pak předělat.*
2. **Chceš „letku“ (víc vlaštovek v jednom hodu)?** Příklad: v pozdní hře odhodíš hlavní vlaštovku a dvě malé ji doprovázejí, mince se sčítají. RippleLoop to má jako velký skok. U nás by to zkomplikovalo kameru, výkon 3D a QTE. *Doporučuji zatím ne, nebo jen jako pozdní bonus „Wingmen“ (malé vlaštovky letí za tou hlavní a přidají mince, ale nic se s nimi nedělá).*
3. **Délka hry:** zůstat u ~1 hodiny do finále, nebo prodloužit na ~2 hodiny (víc uzlů, delší D3–D4)? Příklad: demo RippleLoop má 30–60 min a hráči píšou „krátké, chci víc“. *Doporučuji nechat ~1 hodinu pro web a o délce pro Steam rozhodnout až s playtestem.*
4. **Kombo v penězích?** Příklad: kombo ×6 v hodu = +30 % mincí. Šikovný hráč je pak rychlejší (víc než dnes „středně“). *Doporučuji ano s malým účinkem (k ≈ 0,05).*
5. **„Throw again“ rovnou z výsledku?** Příklad: když nemáš na nic peníze, po dopadu ťukneš a hned míříš, bez Dílny. *Doporučuji ano.*
6. **Překážky, které ukončí let** (jako v RippleLoop)? Příklad: vlaštovka narazí do antény a spadne. *Doporučuji ne, nanejvýš v Night Route jako změna pravidel.*
7. **Prestige (reset za trvalý bonus)?** Příklad: po finále začneš od nuly, ale s násobkem ×2. *Doporučuji ne, odporuje „hra s dohráním“ a Atlasu jako trvalé sbírce. RippleLoop ho podle všeho také nemá.*

## 8. Zdroje (načteno 14. 10. 2026)

- [RippleLoop na Steamu (app 3204820)](https://store.steampowered.com/app/3204820/RippleLoop/): vývojář, stav, tagy, jazyky, HW
- [RippleLoop Demo na Steamu (app 4758450)](https://store.steampowered.com/app/4758450/RippleLoop_Demo/): datum dema 21. 8. 2026, hodnocení 97 % ze 40
- Steam API recenzí dema (`store.steampowered.com/appreviews/4758450?json=1`): 40 recenzí 23. 8.–10. 10. 2026, herní doby
- Steam news „Demo Update“ (`api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=3204820`), ~28. 9. 2026
- [Steam diskuse RippleLoop](https://steamcommunity.com/app/3204820/discussions/): vlákna „Demo Completed“ (2.–8. 9.), „Max distance in demo?“ (24. 9.–7. 10.), „Only thing I'd add…“ (4.–7. 9.), „Is Hydrofoil a downgrade?“ (9.–20. 9.), „is there no name for this genre“ (11. 10.)
- [GameSpew, Chris McMullen, 6. 9. 2026](https://www.gamespew.com/2026/09/rippleloop-demo/)
- [The Nerdy Type, Paula Vaynshteyn, 7. 9. 2026](https://www.thenerdytype.com/post/rippleloop-turns-skipping-stones-into-an-incredibly-satisfying-incremental)
- [Playtester.io](https://playtester.io/rippleloop): HUD, strom, biomy, playtest 21. 6. 2026
- [IndieBunny](https://indiebunny.com/news/ripple-loop-official-trailer): trailer 1. 6. 2026
- [IncrementalDB](https://www.incrementaldb.com/game/rippleloop): „No ending“, „No prestige“ (nízká spolehlivost)
- [TopIncrementalGames](https://www.topincrementalgames.com/games/rippleloop): podobné hry
- [Discord listing](https://discord.com/game/rippleloop-1547094508427018260): datum 31. 12. 2026 (pravděpodobně zástupné)
- [DistortedGameDev na itch.io](https://distortedgamedev.itch.io/) a [Ricochet Clicker](https://distortedgamedev.itch.io/ricochet-clicker): předchůdce
- HowLongToBeat: hledáno, stránka hry neexistuje.
- Nepodařilo se: obsah YouTube videí (bez popisu), X účet vývojáře (neověřoval jsem). Délku jednoho hodu ani mechaniku násobku jsem nezjistil.
