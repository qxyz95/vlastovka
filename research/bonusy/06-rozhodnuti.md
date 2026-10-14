# Rozhodnutí uživatele k bonusům

Průběžný záznam rozhodnutí k návrhům v `01–05`. Platí přednostně před doporučeními v kartách.

## 13. 10. 2026
- **Postup:** nespěchat. Nejdřív důkladný návrh (review, mezery, rozhodnutí, druhé kolo), Monte Carlo až nad užším výběrem.
- **Sloty (B01):** neotvírají se automaticky po metrech. První slot je za mince. Hráč na něj musí vydělat hraním a vylepšováním základů vlaštovky (Dílna), takže přijde jako odměna za první fázi hry.
- **Bonusy a mince:** jednotlivé bonusy se vylepšují za mince (bonusy mají úrovně). Způsob odemčení nechal na nás.
- **Stránka Bonusy (`bonus.html`) = Atlas trasy.** Postupným dosahováním míst na trase se odemykají další bonusy. Tím je dáno i odemykání: místo na trase odemkne bonus a mince ho vylepšují.
- **Vyváženost:** povinná, ověří se Monte Carlem.
- **Sloty jen pro pár speciálních bonusů (varianta C).** Většina bonusů z Atlasu jsou permanentní vylepšení, která platí pořád (odemčená doletem na místo, úrovně za mince). Do slotů jde jen několik speciálních bonusů, typicky silných nebo s kompromisem. První slot se kupuje za mince (viz výše). Karty je třeba roztřídit na permanentní a slotové.
- **Vzdálená místa: varianta B (vlaštovka zesílí, až doletí celou trasu ~4,9 km z Dílny).** Žádné startovní schránky (SV05/SV22 zamítnuto). Podmínka: let nesmí trvat dlouho. S bonusy má růst i rychlost letu, takže i 5 km má být krátký let (cílově desítky sekund, upřesní simulace). Silná vlaštovka v pozdní hře je tedy záměr, ne chyba. Podle toho musí být škálovaná čísla a odemykání Atlasu (16 míst postupně, bez grindu).
- **Aktivní schopnost za letu: ano, jako speciální bonus do slotu.** Variant má být víc (např. střemhlav DQ-11, polštář DQ-12 a další), hráč si jednu nasadí. Ve druhém kole vymyslet několik variant.
- **Šikovnost: středně.** Šikovný hráč má být znát (plující střed QTE, série), ale slabší hráč musí dojít do cíle taky.
- **Příběh a sběratelství: ne.** Žádné dopisy paní Vlasty (SV12) ani sbírky navíc. Stačí Atlas. 
- **Postavy (SV17) i místní holubi a poryvy (SV18): ano, oboje.**
- **Celá hra bude v angličtině** (všechny texty ve hře: menu, Dílna/Workshop, Atlas, příběhy míst, postavy, události). Návrhové dokumenty a komunikace zůstávají česky. Nové herní texty v návrzích psát rovnou anglicky. Překlad stávající hry je samostatný úkol.
- **Vítr: ano, slabý,** každý hod trochu jiný, ukázaný před hodem.
- **K návrhu 2. kola (`08-navrh-kolo2.md`, otázky §11): vše podle doporučení.**
  1. Poslední hody ~30 s (rychlé, kamera se oddálí).
  2. Klidné klouzání mezi událostmi se automaticky zrychlí 1,4×, v nastavení půjde vypnout.
  3. Dílnu lze předělat: Paper jako žebřík rychlosti (Copy → Kraft → Washi → Neon Foil, druh po čtvrtích), Power a Folds na 3 úrovně.
  4. Po trase zatím jen finále („Delivered.“), noční kolo případně později.
  5. Rozdíl slabý / průměrný / šikovný ~140 / 115 / 95 hodů je v pořádku.
- **Další krok: ověření Monte Carlem** podle plánu `09-plan-overeni.md`, práce delegovaná agentům.
- **Opravy mechanik z auditu F2 (`simulation/progression/AUDIT.md` §5, body 1–5).** Rozhodl Claude na základě důvěry uživatele („věřím ti“). Jde o opravy, aby bonusy fungovaly tak, jak karty zamýšlely. Uživatel je může zvrátit.
  1. Dive: zisk z vybrání jen z rychlosti nabrané střemhlavem (od začátku Dive), ne z celého přebytku rychlosti.
  2. Paper Crane: dosah ze šířky místa (~9 / 15 / 24 m), ne z doletu.
  3. Stone Skip: přísnější podmínka odrazu, aby nešlo o jistotu v každém letu (cíl zhruba 30–50 % letů na úr. 3, upřesní F3).
  4. Shooting Star: vzácná událost **navíc**, nevytlačuje jinou. Obecně: nové události Atlasu nesmějí snižovat dolet tím, že vytlačí jiné.
  5. Strop E: ponechat jako pojistku, F3 nastaví hodnotu tak, aby se zasáhl v ≤ 20 % letů (§10.2).
- **Ohlášený cíl (B16): vyřazen.** Uživatel ho nepovažuje za dost zábavný, aby ho hráč dobrovolně používal. Obecně z toho plyne: volitelné výzvy a „sázky“ na výkon nejsou žádoucí, pokud nejsou samy o sobě zábavné.

## 14. 10. 2026
- **K návrhům z ladění F3 (`10-ladeni.md` §5): vše podle doporučení.** Plán implementace v `11-plan-implementace.md`.
  1. **Další druh papíru se otevře doletem na 3. místo čtvrti** (Gardens at the Edge → Kraft, Bridge over the Bay → Washi, Mountain Saddle → Neon Foil), ne až na hranici další čtvrti. Odstraní „zeď“ na hranici čtvrti. Velký moment na hranici zůstává (karta čtvrti, nové kapsové bonusy).
  2. **Paper Crane, Shooting Star a Packing Tape se neměří ziskem 3 % doletu:** Paper Crane místy přeletěnými navíc, Shooting Star ziskem v letu, kde se objeví, Packing Tape u slabého hráče.
  3. **Termika dostane „perfekt“** (střed jádra), takže se k ní váže Echo.
  4. **Dive: strop rychlosti střemhlavu** (násobek běžného klesání), ne sklouznutí po dopadu. Riziko pádu zůstává.
  5. **Whistle: přivolaná událost má užší okno** (risk za odměnu), varování zůstává.
  6. **Sucho bez novinky se hodnotí jako P90** maxima kampaní, ne jako absolutní maximum. Měřítko se mění až po zapracování bodu 1.
- **Směr žánru (k rozboru „incremental gameplay“, 14. 10.):**
  1. **Víc k incremental žánru, ale s dohráním.** Hra má konec (finále trasy), ale progrese má víc připomínat incremental hry. **QTE se díky bonusům nemusí dělat:** hráč si může koupit automatické zvládání událostí. Pozor, mění to dosavadní „šikovnost středně“ (13. 10.): navrhnout, jak automatika zachová výhodu šikovného hráče (např. auto = jen běžný zásah, bez perfektu a komba).
  2. **Night Route** jako dobrovolné druhé kolo **ano, ale až po odemčení ve stromě bonusů** (ne automaticky po finále).
  3. **Mince rostou rychleji než lineárně** podle fáze hry. Ceny pozdních úrovní můžou být v tisících až desetitisících (např. 3. úroveň bonusu za 10 000 ◈). Mění to ekonomiku F3/F5 (odměna `10 + dolet/10`), potřeba nové kolo návrhu a ladění.
  4. Osobní statistiky po finále zatím ne, ale **souhrn po dohrání** ano.
  5. **Čísla mají být vidět** (dávají radost z růstu): rychlost, násobky, přeletěná místa, odměny. Hlídat, aby čísla nezakryla podíl hráče (P7), a nepřidávat nutkavé prvky (P13).
- **Souhrnná rozhodnutí 14. 10. (seznam 1–24 v konverzaci, vše podle doporučení Clauda, rozpočet na hudbu 0):**
  - *Progrese:* 3. kolo návrhu (posun k incrementalu) až po dokončení F5. Automatika QTE ve stromě bonusů zvládá jen běžný zásah (bez perfektu, komba a Echa). Rychlejší růst mincí kombinací násobitele podle čtvrti a bonusů „+X % mincí“, ověří simulátor.
  - *Grafika:* hlavní směr **3D město v komiksovém stylu** (obrysy, půltón a barvy z prototypu `verse` přenést do 3D). Zda 3D nahradí 2D, se rozhodne podle živé čtvrti v 3D prototypu. Cíl je jeden hlavní styl, ne dlouhodobě dvojí údržba. 2D `verse` pozastaven. Barevná cesta „za sluncem“ přijata (`research/svet/01-zivy-svet.md`).
  - *Živý svět:* zrychlení klouzání vypnout na dosud neviděných místech (nejdřív ověřit simulátorem). Komiksový strip ze tří záběrů ve výsledku ano. Vyhlídkový let odložit (případně v Night Route). Humor podle 08: suchý, laskavý, každá hláška jednou.
  - *Hudba* (`research/hudba/01-vyzkum-a-plan.md`): **rozpočet 0** (hudba generovaná v kódu, případně CC0 / ověřené bezplatné knihovny). AI hudba jen pro ukázky, ne jako finální. Skladba podle postupu hráče (nejvzdálenější čtvrť), ne podle polohy vlaštovky. QTE se na takt nezarovnává, kvantují se jen ozdoby. Vypečení do souboru (ffmpeg) až v případě, že generování za běhu nestačí výkonem. Hudba ve výchozím stavu zapnutá (60 %, efekty 80 %, na webu po prvním klepnutí). Ladit ke 3D komiksovému městu. Soundtrack jako DLC rozhodnout později.
  - *Vydání:* zatím jen web, Electron pro Steam až s hratelnou verzí. Překlad hry do angličtiny až po ustálení grafiky a obsahu.
  - *Úklid:* commit do samostatné větve rozdělený po tématech a souhrnná aktualizace `CLAUDE.md` po dokončení F5.
- **3D město nahradí 2D grafiku** (14. 10.): uživatel: „3D město bude určitě vypadat lépe než 2D grafika.“ Dnešní 2D styly zůstanou jen do doby, než bude 3D ve hře hratelné.
- **2D grafika města končí** (14. 10.): uživatel po vyzkoušení živé čtvrti ve 3D prototypu: „3D grafika vyhrává na plné čáře. 2D grafiku města můžeš hodit do koše.“ 2D vykreslování (`render.js`, `route-render.js`, `backgrounds.js`, `themes.js` se 4 styly, `themes-verse.js`, SVG oblohy) se odstraní, **až bude 3D ve hře hratelné**. Do té doby by hra bez 2D nešla spustit. Odstranění bude samostatný krok s commitem, aby šlo vrátit.
- **K plánu převodu 3D (`research/3d/01-plan-prevodu.md` §6, 14. 10.):** (1) bez WebGL jen hláška „Hra potřebuje WebGL“, žádný nouzový režim. (2) 2D se smaže po hrubém 3D všech 16 míst (fáze b0). (3) Referenční zařízení: uživatelův výkonný notebook (HW v plánu) a iPhone 15 Pro (Safari). (4) 3D je ve hře výchozí hned po fázi a5, 2D jen přes `?render=2d` do smazání.
- **K rozboru RippleLoop (`13-rippleloop.md` §7, 14. 10.): vše podle doporučení.** Vstup pro 3. kolo progrese (po F5):
  1. **Boost taps: ano.** Pár ťuknutí za hod, kterými hráč vlaštovku postrčí. Nesmí kolidovat s QTE na jednom tlačítku.
  2. **Letka (víc vlaštovek v jednom hodu): ne.** Nanejvýš pozdní bonus „Wingmen“.
  3. **Kombo zvyšuje i mince: ano**, s malým účinkem.
  4. **„Throw again“ přímo z výsledku: ano.**
  5. **Překážky: ne.**
  6. **Prestige / reset: ne.**
  7. **Prodloužení hry na ~2 h: rozhodne se až po playtestu.**
  Převzít i mince = dolet × násobek čtvrti s cenami v tisících a strom s mnoha malými uzly a viditelnými čísly (hodnota teď → po koupi). Nepřevzít oddělené úrovně, offline výdělek ani nutkavé prvky (P13).
- **K návrhu Atlasu (`research/atlas/01-navrh-atlasu.md` §9, 14. 10.): vše podle doporučení.**
  1. Atlas je **panel ve hře** (`<dialog id="atlas">` v `index.html`), `bonus.html` jen přesměruje na `./#atlas`.
  2. Bonus nejbližšího místa (teaser) je vidět předem: jméno a jedna věta, bez čísel.
  3. Hlášky postav jdou v Atlasu přečíst, ale jen ty, které už zazněly, bez počtu („2/3“).
  4. Tečka na tlačítku Atlas jen při nové, dosud neviděné věci, nikdy kvůli možnosti koupě.
  5. Automatika QTE a Night Route jsou uzly v Atlasu (Night Route u Rooftop Harbor, po finále).
- **Jazyk hry: přepínatelný EN / CS (14. 10.).** Uživatel chce překlad celé hry hned a s možností přepnout jazyk. Mění to dřívější „překlad až po ustálení grafiky a obsahu“. Výchozí jazyk je **angličtina** (hra je primárně anglická), čeština jako druhý jazyk. Každý nový herní text se od teď píše přes klíče v obou jazycích.
- **Ke 4 druhům papíru (`research/design/01-papiry.md`, 14. 10.): vše podle doporučení.**
  1. Korunka Copy Paper = „Ruled contrails“ (dvě modré linky z konců křídel), ne rychlostní čáry.
  2. Kraft jako letecká pošta (okraj se šipkami, razítko), návaznost na „Delivered.“.
  3. Washi se vzorem vlnek.
  4. Animace výměny papíru jen v Dílně po koupi, ne při dalším hodu.
- **Atlas A1, čeština (14. 10.):** české texty Atlasu se doplní už v prototypu A1 (sloupec CS v `research/atlas/03-texty.md`, prototyp přes `?lang=cs`), aby se delší čeština ověřila na 360 px dřív než ve hře.
- **Jednotný vizuální styl (14. 10.):** zavádí se stylová bible `research/design/02-styl.md` (jediný zdroj pravdy o vzhledu), agent `art-director` a skill `art-review`. Bibli napíše art-director z toho, co ve hře funguje. Závazná bude až po schválení pilířů stylu a palety uživatelem.
- **K prototypu Atlasu A1 (`research/atlas/02-design-spec.md`, 14. 10.): vše podle doporučení.**
  1. Kapsy na mobilu rolují s mapou.
  2. Autopilot jako 5 samostatných uzlů po čtvrtích.
  3. Účinek jako dvě věty „Now · Level 2“ / „Level 3“.
  4. Věta „Progress saved. Nothing here runs out.“ zůstává.
- **K výsledkům F5 (`research/bonusy/12-ladeni2.md` §5 a §7, 14. 10.): vše podle doporučení.** Vstup pro 3. kolo progrese:
  1. Sucho v D3–D4 řeší drobná novinka mezi místy (např. pravdivá těsnost „37 m short of …“ nebo dílčí odměna za nový nejdelší let v rámci místa). Cíl sucha P90 ≤ 8 zůstává.
  2. Pára a Ad Drone se přidávají do rozvrhu navíc jako Shooting Star, ne vahou do směsi událostí.
  3. Dive: zrychlení a strop střemhlavu odvozené od základní rychlosti (`cruise`) bez π, síla nesmí růst s výbavou.
  4. Sada „šum ×2“: pásma posunuta (mezi místy P90 ≤ 16, první kapsa ≤ 45. hod, koupené úrovně ≤ 90 %), expert / průměrný 0,69 přijato. Packing Tape se měří v sadě „šum ×2“.
- **Ke stylové bibli (`research/design/02-styl.md`, 14. 10.): vše podle doporučení. Bible je po zapracování závazná.**
  1. Pilíře stylu: varianta A „Cesta za sluncem“ (vlaštovka vždy vidět, tištěný komiks, barva vypráví cestu za sluncem, jedna výrazná věc na obrazovku).
  2. Paleta: varianta A, uklizená dnešní (barvy čtvrtí z `mood.js`, jedna tuš, bílá vlaštovka).
  3. Jedno UI pro celou hru na tokenech Atlasu (indigo `#1b1444`, Bahnschrift, rámy 3 px tuš, bez monospace); `style.css` hry se na ně převede.
  4. Perfekt je vždy magenta, zlatá znamená jen hodnotu (mince, odměny).
  5. Pás obzoru v Neon Core se posouvá z limetkové do tyrkysové (`#2aa99c` → `#7ff0d8`).
  6. Půltón jen ve stínech budov.
- **Pohlednice Atlasu bez výjimky (14. 10.):** půltón jen ve stínech platí přísně i pro pohlednice, vzor čtvrti v nebi (`ht-0…3`) se odstraní. Stopa letu dostane tušový lem (návrh art directora, beze změny voleb).
- **Pořadí oprav grafiky (14. 10.):** dávka G0 (tokeny) až po commitu současné práce přes `/release`, pak G1, G2, P1, G3 souběžně ve worktree, P2 po dokončení češtiny v prototypu Atlasu.
- **Pohlednice Railway (14. 10.):** zůstává s barvami jako ve 3D (tuš × obzor 7,9 : 1). Kritérium „tuš × nejsvětlejší pás ≥ 9 : 1“ platí pro referenční místo každé čtvrti (1, 5, 9, 13).
- **Nová vizuální identita (14. 10.): směr B „Papírové město“** (`research/design/04-nove-smery.md`). Uživatel se dnešní paleta ani styl nelíbí a chce hru, kterou by chtěl hrát, i za cenu větší práce.
  1. Styl B: diorama z papíru, den, měkké stíny. Co se líbí na referencích: Alto's Odyssey (klid, světlo, siluety), Tearaway a Paper Mario (svět z papíru, hmatové materiály), Monument Valley (čistá geometrie, pastely). Cestovní plakáty ne.
  2. Postup: nejdřív jedna čtvrť (Violet Suburbs) v novém stylu přímo ve hře, zahrát a teprve pak přestavět zbytek.
  3. Názvy a nálady čtvrtí se smí změnit podle nového stylu.
  4. Bible `02-styl.md` platí pro současnou grafiku, dokud ji nenahradí nová bible stylu B. Hotové dávky G0–G4 (tokeny, jedna tuš, čitelnost vlaštovky a stopy) zůstávají jako základ.
- **Struktura menu jako ve hrách (14. 10.):** hlavní obrazovka nemá vypadat jako aplikace.
  1. Hlavní menu: název hry jen tady, živá 3D scéna na pozadí, tlačítka Házet (hlavní), Dílna, Atlas, Nastavení (jazyk EN/CS, hudba a zvuky, omezení pohybu); mince malým údajem v rohu.
  2. Hra: jen scéna, malý HUD (vzdálenost, mince) a pauza (Pokračovat, Nastavení, Menu).
  3. Výsledek: skóre (vzdálenost, rekord, mince), tlačítka Házet znovu (hlavní), Dílna, Atlas a malá ikonka Menu.
  4. Z hlavní obrazovky pryč: logo v hlavičce, odkazy „01 / Workshop“, „02 / Atlas“, přepínač stylu, EN/CS a úvodní text.
  Rozložení nezávisí na grafickém stylu, vzhled převezme styl B.
- **Bible Papírového města schválena (14. 10., `research/design/05-styl-papir.md`): vše podle doporučení.**
  1. Pilíře „Diorama za úsvitu“: barevné papírové karty, opar, vlaštovka jako jediná nakreslená věc.
  2. Paleta čtvrti 1 „ráno“ beze změny (perfekt rajčatový s hvězdou, úspěch tyrkysový, mince hořčicové).
  3. Názvy čtvrtí: Sunrise Roofs / Střechy za úsvitu, Bright Harbor / Slunný přístav, Golden Fields / Zlatá pole, Lantern City / Město lampionů, a 4 nové názvy míst podle kap. 12.
  4. Vlaštovka na úzkých obrazovkách o 15 % větší.
  5. Písmo zatím systémové, rozhodne se po zahrání.
  6. Postup podle `06-papir-ctvrt1.md`: příznak `?styl=papir`, dávky P0–P4; nové menu (`07-menu.md`) se staví až po dávkách P, protože sdílí `ui.js` a `style.css`.
