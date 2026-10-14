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
