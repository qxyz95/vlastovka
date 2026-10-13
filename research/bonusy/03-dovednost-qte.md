# Bonusy a vylepšení — úhel 3: dovednost, hod a QTE

**Sepsáno 13. 10. 2026** podle `00-zadani.md`. Podklady: `src/config.js`, `core.js`, `events.js`, `throw.js`, `juice.js`, `simulation/monte-carlo.mjs`, KB 04, 05, 06 a 02 §4.3. Web se nepoužil, kód se neměnil.

**Úhel pohledu:** odměňovat a rozvíjet dovednost hráče, ne jen zvyšovat čísla. Každá karta má navazovat na problém nebo touhu, kterou hráč opravdu cítí, a přínos musí být vidět **předem**.

## 0. Výchozí měření a společné předpoklady

### 0.1 Co dnes dovednost reálně vynáší
Měřeno vlastním skriptem mimo `simulation/` (`simulate()` z `core.js`, 200 seedů, síla 0,9, nejlepší úhel z `bestAngle`):

| Situace | Šipka úr. 0 (25°) | Kluzák úr. 0 (34°) | Šipka 3/3/3 (26°) |
|---|---:|---:|---:|
| Bez QTE | 192 m | 190 m | 396 m |
| Všechny QTE „úspěch“ | 257 m | 263 m | 578 m |
| Všechny QTE „perfektní“ | 272 m | 286 m | 635 m |
| Událostí na let | 3,0 | 4,0 | 5,5 |
| Pasivní dolet při síle 0,93 → 1,0 | 195 → 202 m | 193 → 199 m | 400 → 408 m |
| Délka letu | ~13 s | ~21 s | ~27 s |

**Závěry pro návrh:**
- **QTE jsou dnes hlavní páka dovednosti.** Úspěch přidává asi +34 % doletu, jenže ho jde odměřit naslepo (KB 06 §3.4).
- **Perfektní zásah proti úspěchu přidává jen +6 až +10 %.** Dovednost nad úrovní „trefil jsem“ se tedy skoro nevyplácí.
- **Hod:** rozdíl mezi silou 0,93 a 1,0 dělá +3,6 % doletu a okno „Perfektní síly“ je ±198 ms (KB 06 N10). Dovednost v hodu tak skoro neexistuje.
- **Počet událostí roste s délkou letu.** Mechaniky vázané na QTE (kombo, nové události) proto s postupem samy sílí, což je dobře, ale je potřeba to hlídat.

### 0.2 Pracovní pravidla všech karet
1. **Oddělit zásluhu (KB 04 §2.7, N4, P7).** Efekty dovednosti se počítají ze **surového** vstupu hráče (čas uvolnění, odchylka od středu), ne z hodnot upravených přehyby. Přehyby (`steady`, `window`) zůstávají odpuštěním a v rozpisu výsledku je vidět zvlášť (DQ-16).
2. **Efekt odpovídá úspěchu (KB 05 bod 3, Kao 2024).** Oslava je odstupňovaná: perfektní > úspěch > bez bonusu. Efekt samotné akce (hod, aktivace schopnosti) má být slabší než efekt úspěchu.
3. **Žádná náhodná výše odměny ani vyrobený near-miss (KB 02 §4.3, body 1, 3 a 10).** Náhoda smí určovat jen **podmínky** (kde je termika, kam plave střed okna). Ty musí být vidět předem. Výsledek určuje vstup hráče.
4. **Asistence nejsou trest.** Nestojí mince, nezabírají slot, neoznačují rekordy a nesnižují odměnu (GAG, XAG, Celeste Assist Mode, KB 04 §2.4, KB 06 §3.11).
5. **Starting small (KB 04 N10, Raviv 2022).** Nové podmínky přicházejí postupně, první lety zůstávají jako dnes.

### 0.3 Pracovní předpoklad pro stránku Bonusy
Kde karta říká „Bonusy (slot)“, počítám se dvěma sloty, třetí se otevře po 500 m. Asistence a systémové změny slot nezabírají. Ceny v mincích jsou výchozí návrh pro simulaci. Navazují na to, že mince po 500 m dnes nemají využití.

### 0.4 Rozšíření profilů dovednosti v simulátoru (společné pro karty)
Dnešní `SKILLS` v `monte-carlo.mjs` mají `mu, sigma` (síla), `angle`, `qte` (šum časování v s) a `react`. Pro karty níže navrhuji přidat:

| Pole | slabý | průměrný | dobrý | expert | Význam |
|---|---:|---:|---:|---:|---|
| `rel` (σ času uvolnění kolem vrcholu, s), varianta **P** (přesná) | 0,25 | 0,15 | 0,09 | 0,05 | Hráč sleduje ukazatel, šum ~ šum QTE |
| `rel`, varianta **K** (kalibrovaná na dnešní `mu`) | 0,55 | 0,40 | 0,28 | 0,16 | σ, při níž průměrná síla z `chargeAt` odpovídá dnešnímu `mu` |
| `read` (podíl událostí, kdy čte kruh, ne odměřuje) | 0,4 | 0,6 | 0,8 | 0,95 | Rozhoduje u plujícího středu (DQ-01) |
| `alt` (σ odhadu výšky u schopností, v s času do země) | 0,20 | 0,13 | 0,08 | 0,05 | Střemhlav, přízemní efekt |
| `device` (stálý posun zařízení, s) | N(0,06; 0,03) pro všechny | | | | Kalibrace (DQ-15) |

Uvolnění se pak modeluje jako `t_rel = 1,15 + bias_rel + N(0, rel)` a síla jako `chargeAt(t_rel)`. Varianty P a K slouží jako dolní a horní mez, protože skutečnou přesnost hráčů neznáme. Pravděpodobnost zásahu okna ±60 ms: P = 19 / 31 / 50 / 77 %, K = 9 / 12 / 17 / 29 % (normální aproximace, bez osobního biasu).

---

## 1. Karty

### DQ-01 — Plující střed okna
- Typ: Systém
- Kde: Let
- Mechanika: Každá událost dostane při `createEvents` ze seedovaného RNG posun `e.shift`. `windows(f,e)` počítá střed pro každou událost zvlášť a šířky se nemění.
  - **Poryv:** `center = 1,4 + shift`, `shift ~ U[−0,20; +0,20] s`. Okno úspěchu ±0,28 s se vždy vejde do pruhu 0,8–2,0 s.
  - **Holub:** cílová délka držení `0,75 + shift`, `shift ~ U[−0,15; +0,20] s` (0,60–0,95 s, KB 06 N8).
  - Kruh se zmenšuje tak, aby dosedl přesně na posunutý střed. Zóny na pruhu (`zonesFor`) se kreslí podle `e`.
  - **Náběh:** seedy 1–3 mají posun 0. Od hodu 4 je amplituda 50 %, od hodu 8 nebo po 10 zásazích (co nastane dřív) 100 %.
  - **Kompenzace čtení:** `HELP.perfect` 1,25 → 1,35 a `HELP.birdPerfect` 1,1 → 1,2, aby se čtení kruhu vyplatilo víc než dnes (+6 % na šipce úr. 0).
- Úrovně a cena / podmínka odemčení: Bez ceny, zapíná se postupně podle náběhu.
- Proč je hra zábavnější: Řeší známý problém „QTE se dají naučit nazpaměť“ (KB 06 §3.4, N4, N8; README P9).
  - Posun ±150–250 ms je malý vůči pruhu, ale velký vůči přesnosti odměřování (2–4 SD, Wearden 1991). Hráč tak musí číst scénu (V/N).
  - Náročnost přibývá novou podmínkou, ne zúžením oken (KB 04 N10, Lomas: krátké limity odrazují, V).
- Pocit „chci a potřebuju“: Dovednost, kterou hráč získal, zůstane ceněná: „Perfektní“ zase něco znamená a nejde ho opakovat bez dívání. Předem to vidí na kruhu, který dosedá jinam, a v textu u prvního posunutého letu („Vítr se mění, sleduj kruh“). Zvýšený bonus za perfektní zásah je napsaný v nápovědě události („★ +35 %“).
- Rizika a etika: Hráč, který kruh nečte, ztratí část úspěchů. Odhad pro memorující: úspěch průměrného 95 → 87 %, slabého 80 → 74 %. Proto náběh a karta DQ-02. Posun je podmínka viditelná předem, výsledek dál určuje vstup, takže nejde o vyrobený near-miss.
- Simulace: **Nová logika.**
  - Bot má s pravděpodobností `read` plán „skutečný střed + bias + N(0, qte)“, jinak „1,4 + bias + N(0, qte)“ (memoruje).
  - Měřit úspěšnost a perfektní zásahy podle profilu a podle `read`, hody a minuty do 500 m.
  - Hypotéza (normální aproximace, posun ±0,2 s):
    - Memorující: perfekt průměrného 52 → 40 %, dobrého 73 → 46 %, experta 95 → 49 %. Čtoucí beze změny.
    - Hody do 500 m P50 se změní o ≤ 1 u všech profilů. Softlock 0 %.
    - Čtoucí expert dostane o ≥ 8 % delší lety než memorující expert.
- Náročnost implementace: M

### DQ-02 — Ladička (čitelnost plujícího středu)
- Typ: Vylepšení
- Kde: Dílna (nová malá větev) nebo Bonusy bez slotu
- Mechanika: Zlepšuje **čtení** signálu, ne šířku okna, takže zásah zůstane zásluhou hráče.
  - **Ú1 Tik:** tři zvukové tiky po 300 ms končící přesně ve středu okna (−0,6 / −0,3 / 0 s) a záblesk prstence ve středu. Zvuk se časuje přesněji než obraz (KB 06 bod 6, N6). Vizuál zůstává primární a funguje i ztlumeně.
  - **Ú2 Předznamenání:** perfektní pásmo se na pruhu ukáže už během varování (0,8 s předem), takže hráč posun vidí dřív, než začne pruh.
  - **Ú3 Odchylka:** po každém QTE krátký text „brzy o 0,07 s“ / „pozdě o 0,12 s“ / „přesně“ podle skutečné odchylky (KR, KB 04 N1, 02 N2).
- Úrovně a cena / podmínka odemčení: 3 úrovně, 40 / 90 / 150 mincí. Nabídne se po prvním letu s posunutým středem.
- Proč je hra zábavnější: Směrová zpětná vazba učí, binární „✓/○“ ne (St. Germain 2023, V). Rytmický odpočet mění QTE v jednu notu rytmické hry (KB 06 §3.5, H). Hráč se zlepšuje sám, hra mu jen dává lepší informaci (KB 04 §2.7).
- Pocit „chci a potřebuju“: Navazuje na frustraci „střed teď plave a já ho netrefím“. Předem jde v Dílně přehrát 3s ukázku jedné události s tiky a bez nich. Ú3 řeší „nevím, jestli jsem byl brzo, nebo pozdě“.
- Rizika a etika: Ú3 hlásí jen skutečnou odchylku a nikdy nepřikrášluje („skoro!“) (KB 02 §4.3 bod 3). Tik musí jít vypnout (KB 05 §4 c, d). Hrozí závislost na vedení (KB 04 §2.9), ale ve hře zpětná vazba nezmizí a efekt je slabý.
- Simulace: **Nová logika (parametr bota).**
  - Ú1: šum čtoucího bota `qte × 0,85`.
  - Ú2: `read + 0,2` (oříznout na 1).
  - Ú3: nesimulovatelné, jen playtest (počet hodů do stabilní odchylky < 0,1 s).
  - Hypotéza: s Ú1 + Ú2 vrátí průměrný hráč při plujícím středu perfektní zásahy na ≥ 95 % úrovně se stálým středem. Dolet průměrného +3 až +5 % proti DQ-01 bez Ladičky.
- Náročnost implementace: M (zvuk zatím ve hře chybí, Web Audio)

### DQ-03 — Řetěz (kombo zásahů v jednom letu)
- Typ: Systém
- Kde: Let
- Mechanika: Za letu se počítá `f.chain`: úspěch +1, perfektní +2, minutí nebo nečinnost vrátí řetěz na 0. Jinak se netrestá, efekt nikdy neklesne pod dnešní základ. V `resolve()` se účinek násobí `1 + 0,07 × min(chain_před_zásahem, 6)`, tedy nejvýš +42 %. U vlaštovky se ukazuje „Řetěz ×N“ a záře stopy roste s N. Řetěz končí s letem a mezi lety se nepřenáší.
- Úrovně a cena / podmínka odemčení: Bez ceny. Zapne se od hodu 3 (po tutoriálu).
- Proč je hra zábavnější: Dlouhé lety (5,5 události na úrovni 3) dostanou dramatický oblouk a každý další zásah něco znamená, takže QTE už nejsou samostatné a stejné. Efekt je navázaný na úspěch a odstupňovaný (KB 05 bod 3, P1, V). Odměňuje konzistenci, ne náhodu.
- Pocit „chci a potřebuju“: Touha „chci, aby se dobrý let rozjel“. Hráč přínos vidí za letu: před další událostí je u kruhu napsané „Řetěz ×3 → +21 %“, takže ví, o co jde, ještě než klepne.
- Rizika a etika: Nejde o „streak“ ve smyslu KB 02 §4.3 bod 4: žije jen uvnitř jednoho letu, nemá denní vazbu ani hrozbu ztráty mimo let. Pozor na framing: neříkat „přijdeš o řetěz“, jen ukázat aktuální stav (02 N10). Zvětšuje rozdíl mezi slabým a silným hráčem, proto sledovat slabý profil.
- Simulace: **Parametr + malá logika** (čítač v `resolve`).
  - Měřit dolet podle profilu, hody do 500 m a rozptyl doletu.
  - Hypotéza: expert +8 až +12 % doletu, průměrný +4 až +6 %, slabý +1 až +3 %. Hody do 500 m: expert −2 až −3, slabý −0 až −1. Softlock 0 %.
  - Pokud expert zkrátí kampaň o > 25 %, snížit koeficient na 0,05.
- Náročnost implementace: S

### DQ-04 — Perfektní vypuštění (Švih)
- Typ: Systém
- Kde: Let (hod)
- Mechanika: Na vrcholu ukazatele síly vznikne úzká zóna **±60 ms** kolem 1,15 s (a kolem dalších vrcholů), tedy `chargeAt ≥ 0,993`. Uvolnění v zóně dá **×1,05 rychlosti výhozu** navíc k `0,7 + 0,4·síla`.
  - Hodnotí se ze **surového** `chargeAt(heldTime)`, ne z `steady` po přehybech.
  - Signál: krátký „cvak“ a pulz okraje ukazatele v okamžiku vrcholu. Po hodu nápis „ŠVIH ✓“ a slabší efekt než perfektní QTE (KB 05 §4.2). Při minutí zóny se ve výsledku ukáže „uvolněno 0,09 s po vrcholu“ (KB 06 N3).
  - Pro přesnost uvolnění převést čas na `event.timeStamp` místo snímku (KB 06 N11), protože ±60 ms jsou asi 7 snímků.
- Úrovně a cena / podmínka odemčení: Bez ceny. Zóna se zobrazí od hodu 4. První tři hody mají hráče naučit, že silnější hod je lepší.
- Proč je hra zábavnější: Dnes dělí dobrý a skvělý hod jen ~2,5 % rychlosti (KB 06 N1). Ostrý vrchol dává hodu mistrovství jako u golfového ukazatele (KB 06 §3.8, H). Cosinové odpuštění pro začátečníka zůstává (N2).
- Pocit „chci a potřebuju“: Touha „chci, aby záleželo, jak hodím“. Hodnota je vidět předem: u ukazatele stojí „ŠVIH: +5 % rychlosti ≈ +7 % doletu“. Po hodu výsledek ukáže, kolik metrů švih přidal (DQ-16).
- Rizika a etika: Okno ±60 ms je na hraně latence dotyku (KB 06 §3.7). Na pomalém zařízení se proto vyplatí kalibrace (DQ-15). Zóna se smí nanejvýš rozšířit asistencí, nikdy ne vylepšením za mince (pravidlo 0.2/1).
- Simulace: **Nová logika** (model uvolnění `rel`, varianty P a K).
  - Měřit podíl švihů, dolet, hody do 500 m.
  - Hypotéza, podíl švihů P/K: slabý 19/9 %, průměrný 31/12 %, dobrý 50/17 %, expert 77/29 %.
  - Očekávaný přínos doletu = podíl × ~7 %, tedy expert +2 až +5,5 %, slabý +0,6 až +1,3 %.
  - Hody do 500 m: expert −1, ostatní ±0.
  - Pokud je přínos pod 1 % u všech kromě experta, zvětšit bonus na ×1,07.
- Náročnost implementace: S

### DQ-05 — Druhý nádech (přetažené nabití)
- Typ: Bonus
- Kde: Bonusy (slot)
- Mechanika: Kdo drží přes první vrchol, vstoupí do **přepětí**: ukazatel změní barvu a druhý cyklus (2,3–4,6 s, vrchol 3,45 s) má multiplikátor `0,50 + 0,64·síla`, tedy nejvýš 1,14 proti 1,10. Pod silou ~0,63 vychází hůř než první cyklus. Švih (DQ-04) platí i ve druhém cyklu, ale jen ±50 ms. Po 4,6 s se ukazatel vrátí do běžného cyklu („vydechl“).
- Úrovně a cena / podmínka odemčení: 1 úroveň, 180 mincí, nebo zkouška „5× švih celkem“ (DQ-17).
- Proč je hra zábavnější: Je to volba riziko × odměna, kterou hráč dělá při každém hodu, a horizontální bonus (dílčí výhoda s cenou), ne další procento. Delší interval je podle skalárního časování těžší trefit (Wearden, V). Riziko je tedy skutečné a čitelné, výsledek řídí hráč.
- Pocit „chci a potřebuju“: Touha „mám švih v ruce, chci víc“. Předem: popis bonusu ukazuje graf obou cyklů a větu „Až +4 % rychlosti navíc, když trefíš druhý vrchol. Mineš-li ho, hod je slabší.“ V Bonusech jde ukázku vyzkoušet nanečisto (cvičný ukazatel bez letu).
- Rizika a etika: Nesmí dominovat. Má být výhodný jen pro dobrého a experta, jinak se stane povinností a slot ztratí smysl. Bez náhody ve výplatě.
- Simulace: **Nová logika.**
  - V druhém cyklu σ uvolnění × 1,3 (delší interval). Bot volí cyklus 2 jen při znalosti vlastního `rel`, plus varianta „vždy“.
  - Předběžný Monte Carlo výpočet očekávaného multiplikátoru (varianta P), cyklus 1 → cyklus 2:
    - s `0,55 + 0,6·c` a ±60 ms: slabý 1,069 → 1,060, průměrný 1,101 → 1,124, expert 1,140 → 1,182 (příliš štědré),
    - s `0,45 + 0,67·c` a ±45 ms: expert 1,140 → 1,144 (zbytečné).
  - Cílová hypotéza pro `0,50 + 0,64·c` a ±50 ms: expert +2 %, dobrý +1 %, průměrný −1 %, slabý −4 %. Rozptyl doletu u všech vyšší.
  - Simulátor má najít koeficienty, které tento cíl splní.
- Náročnost implementace: S

### DQ-06 — Termika (nový typ události)
- Typ: Událost
- Kde: Let
- Mechanika: Nový typ `thermal`. 2,0 s předem se před vlaštovkou objeví mihotavý sloup. Jeho šířka odpovídá **1,3 s letu** (náhodně 1,0–1,6 s, viditelné).
  - **Vstup:** držet, dokud je vlaštovka ve sloupu (kroužení). Při držení uvnitř `vy += 4,0·dt` navíc proti gravitaci a strop `vy ≤ +1,5 m/s`.
  - **Pustit před výstupem ze sloupu.** Perfektní je pustit v posledních 0,25 s před okrajem: +1,0 m výšky navíc („výstup z termiky“) a řetěz +2.
  - **Držení přes okraj** znamená přetažení: `vx −= 1,5` jednou a výsledek „bez bonusu“. Je to jediný malý trest, takže hra je čitelná a riziko vychází ze hry, ne z náhody.
  - Start parametrů ladit tak, aby perfektní termika přidala asi 1,3× tolik co perfektní poryv (poryv ≈ +15 m na šipce úr. 0).
- Úrovně a cena / podmínka odemčení: Odemčení za 150 mincí nebo zkouškou „3 perfektní zásahy v jednom letu“. Pak tvoří ~30 % událostí (poryv 35 %, holub 35 %). V prvním letu po odemčení přijde jako tutoriál.
- Proč je hra zábavnější: Je to třetí typ vstupu (držet a pustit podle **prostoru**, ne podle času), takže konec okna nejde odměřit naslepo. Rozšiřuje obsah, který stál jen na 2 typech (CLAUDE.md, obsah). Novost přes obsah, ne přes náhodné odměny (02 N4, P3).
- Pocit „chci a potřebuju“: Touha „chci delší let“ a zvědavost „co to je za sloup?“. Na kartě v Bonusech je krátká smyčka ukázky (vlaštovka stoupá ve sloupu) a odhad „až ~+20 m na zásah“ z deterministického přehrání. Po odemčení se sloup v letu objeví i hráči, který ho nechytne, takže přínos vidí na vlastním letu.
- Rizika a etika: Vstup se podobá holubovi (držení). Odlišit ho vizuálem a textem, jinak hrozí záměna. Odhad „+20 m“ musí být spočtený, ne nadsazený.
- Simulace: **Nová logika** (typ události, fyzika držení).
  - Bot drží od vstupu + `react` a pouští v čase `výstup − 0,12 s + N(0, qte)`.
  - Měřit dolet, podíl přetažení podle profilu a události za let.
  - Hypotéza: přetažení slabý ~25 %, expert < 3 %. Dolet průměrného +3 až +6 % proti stavu bez termiky. Hody do 500 m −1 až −2 (pokud se odemkne před 500 m).
- Náročnost implementace: L (render sloupu, nový vstup, tutoriál)

### DQ-07 — Reklamní dron (odrazový bod)
- Typ: Událost
- Kde: Let
- Mechanika: Nový typ `drone`. Dron se objeví vpředu ve výšce vlaštovky −3 až +6 m (seed). Kolem dronu se zmenšuje approach circle.
  - **Klepnutí** v okamžiku největšího přiblížení dá odraz `vy = max(vy, 3,5)`, `vx += 1,0`. Perfektní (±80 ms): `vy = max(vy, 4,5)`, `vx += 1,5`. Úspěch ±0,22 s.
  - **Střed** je čas přiblížení = vzdálenost / `vx`, takže se přirozeně mění (1,0–1,8 s po objevení). Odměřit naslepo nejde, je nutné číst prostor.
  - Na dronu běží reklamy s humorem („Holubí pojišťovna“, „Papír, který neztratí nervy“).
- Úrovně a cena / podmínka odemčení: Odemčení za 220 mincí nebo zkouškou „Řetěz ×4“. Od 300 m nebo ve čtvrti jádra.
- Proč je hra zábavnější: Časování navázané na pohyb objektu v prostoru je koincidenčně-anticipační úloha, kterou dospělí zvládají dobře (KB 06 §3.3, V). Spojitý pohyblivý podnět je čitelnější než záblesk (Booth & Elliott, V). Přidává humor a svět, kterých je dnes málo (CLAUDE.md, obsah; 08 humor).
- Pocit „chci a potřebuju“: Touha „chci se od něčeho odrazit“, okamžitě srozumitelná. Ukázka v Bonusech a číslo „odraz ≈ +18 m“ ze stejného přehrání jako u termiky.
- Rizika a etika: Reklamy nesmí parodovat skutečné značky. Approach circle musí dosedat přesně (KB 06 N7). Pozor na zrakové rušení scénou (Booth & Elliott, distraktory).
- Simulace: **Nová logika.**
  - Střed se generuje z výšky a `vx`. Bot klepne v čase `střed + bias + N(0, 1,1·qte)` (prostorové čtení o něco těžší).
  - Měřit úspěšnost a perfektní zásahy a zisk doletu.
  - Hypotéza: úspěch slabý ~72 %, expert ~99 %. Perfektní 30 / 90 %. Memorující strategie nefunguje (úspěch memorujícího bota < 60 %).
- Náročnost implementace: L

### DQ-08 — Parní dvojtakt (vlak v docích)
- Typ: Událost
- Kde: Let
- Mechanika: Nový typ `steam`, který se váže na místa s vlakem nebo komíny (animace v `route-render.js`). Mimo ně chodí jako náhodná událost od 300 m.
  - Z lokomotivy vystoupí **dva obláčky** po sobě. Interval je 0,40–0,55 s, viditelný předem z rozestupu obláčků.
  - **Dvě klepnutí do rytmu.** Úspěch ±0,20 s, perfektní ±0,09 s na každý. Každý zásah `vy += 1,2`.
  - Oba zásahy dají „Dvojtakt“: `vx += 1,0` a řetěz +1 navíc. Oba perfektní dají „Plný tah“, efekt ×1,3.
- Úrovně a cena / podmínka odemčení: Odemčení za 180 mincí nebo dosažením místa s vlakem.
- Proč je hra zábavnější: Je to rytmický vzor dvou not, kvalitativně jiná dovednost než jednorázový stisk (KB 06 §3.5). Váže událost na místo, takže trasa nese obsah a zvědavost (P3, 08 environmentální vyprávění).
- Pocit „chci a potřebuju“: Zvědavost „u vlaku se něco děje“ a touha „chci projet doky s parou“. Na mapě trasy nebo ve štítku místa je ikonka páry a popis „u vlaku můžeš chytit páru“, takže hráč ví předem, kde a co.
- Rizika a etika: Dvě klepnutí za 0,5 s jsou pro motoricky omezené hráče těžká. Asistence DQ-13 a DQ-14 je musí pokrýt (automatika zahraje obě).
- Simulace: **Nová logika.** Bot hraje dvě klepnutí se šumem `qte` a druhé je korelované s prvním (stejný bias, 0,7× šum).
  - Měřit podíl dvojtaktů podle profilu.
  - Hypotéza: dvojtakt slabý ~50 %, průměrný ~80 %, expert ~99 %. Dolet průměrného +2 až +4 % u letů, které místem projdou.
- Náročnost implementace: M

### DQ-09 — Bouřkový pilot (déšť jako zvolená výzva)
- Typ: Bonus
- Kde: Bonusy (slot)
- Mechanika: Se zapnutým bonusem se v letech od 150 m objevují **dešťové zóny**, ohlášené mrakem 3 s předem a dlouhé 4 s letu.
  - V dešti je klouzavost ×0,88 (papír těžkne).
  - Každé QTE v dešti má účinek ×1,4 a řetěz +1 navíc. Plující střed (DQ-01) má v dešti amplitudu ×1,5.
  - Mimo zóny se nic nemění.
- Úrovně a cena / podmínka odemčení: 120 mincí, odemčeno po 300 m.
- Proč je hra zábavnější: Je to horizontální volba „těžší podmínky za vyšší odměnu“ s feedforwardem (Lomas c, KB 04 N11, V/H). Dobrý hráč si přidá výzvu sám a slabý ji nemusí brát, místo DDA (KB 04 N5).
- Pocit „chci a potřebuju“: Touha experta „hra je mi už lehká, chci se ukázat“. Popis bonusu předem uvádí čísla („−12 % klouzavosti v dešti, zásahy v dešti +40 %“) a deterministický odhad podle hráčovy úspěšnosti QTE z posledních 10 letů („pro tebe asi +6 %“).
- Rizika a etika: Odhad podle vlastních dat musí být pravdivý a označený jako odhad (02 N5). Déšť se objevuje jen se zapnutým bonusem, nikdy jako skrytá podmínka. Pozor na reduced motion (déšť z `ambient.js`).
- Simulace: **Nová logika** (zóny a modifikátory v kroku letu).
  - Porovnat profily s bonusem a bez něj.
  - Hypotéza: slabý −4 až −6 % doletu, průměrný ±1 %, dobrý +3 %, expert +6 až +8 %. Racionální volba se tedy láme mezi průměrným a dobrým. Pokud vychází výhodně pro průměrného, snížit ×1,4 na ×1,3.
- Náročnost implementace: M

### DQ-10 — Vítr a korouhvička
- Typ: Systém (vítr) + Bonus (korouhvička)
- Kde: Let, míření
- Mechanika: Každý hod dostane ze seedu vítr `wind.x ∈ {−1,5; −1; −0,5; 0; +0,5; +1; +1,5} m/s`. `createFlight` vítr už umí, dnes dostává vždy 0.
  - **Náběh:** prvních 5 hodů a tutoriál bez větru, pak amplituda ±0,5, od 100 m plná.
  - Při míření je rukáv se třemi stupni (slabý/střední/silný) a směrem a částice ve scéně.
  - `bestAngle` a `angleHint` vítr započítají, aby nápověda nelhala (KB 04 N10).
  - **Bonus Korouhvička** (bez slotu): přesné m/s a duch dráhy posledního hodu ve stejném větru. Ukazuje odchylku, nepředepisuje úhel (KB 04 N1, N3).
- Úrovně a cena / podmínka odemčení: Vítr bez ceny. Korouhvička 60 mincí.
- Proč je hra zábavnější: Řeší „vítr je vždy nulový“. Úhel se zase stává rozhodnutím při každém hodu, ne jednou naučenou hodnotou, což je náročnost přes podmínku (KB 04 N10). Rozptyl je malý („starting small“, Caballero 2024: nízká variabilita, V).
- Pocit „chci a potřebuju“: Hráč, který se naučil úhel, cítí „pořád stejné“. Vítr přidá „dnes fouká v zádech, tohle může být rekord“. Korouhvička navazuje na frustraci „nevím, jestli jsem to pokazil já, nebo vítr“. Předem: ukázka rukávu i ducha dráhy na kartě.
- Rizika a etika: Vítr ovlivní výsledek bez vstupu hráče, takže musí být vidět předem a rozpis (DQ-16) ho musí ukázat zvlášť („vítr +8 m“). Jinak hráč přisoudí rekord štěstí (KB 04 §2.7, 03 „stížnosti na štěstí“). Symetrické rozložení, aby průměr zůstal stejný.
- Simulace: **Jen parametr** (`wind` v `createFlight`) + úprava učícího bota.
  - Varianta A: bot ignoruje vítr. Varianta B: bot si pamatuje nejlepší úhel podle stupně větru.
  - Hypotéza: průměrný dolet ±2 % (symetrie). Směrodatná odchylka doletu +8 až +15 %. Bot B má o 3–6 % delší lety než bot A. Hody do 500 m ±1. Rekordy padají častěji v zadním větru, poměr změřit.
- Náročnost implementace: M

### DQ-11 — Střemhlav a vybrání
- Typ: Bonus
- Kde: Bonusy (slot), Let
- Mechanika: Schopnost za letu, jen když `activeEvent(f)` je null.
  - **Podržení** spustí střemhlav: gravitace ×3, strop klesání vypnutý, `vx += 2,4·dt`.
  - **Uvolnění** je vybrání: `vy = max(vy, 0) + 0,45·(vx − cruise)`, `vx = cruise + 0,6·(vx − cruise)`.
  - **Nízký průlet:** uvolnění ve výšce 2–5 m (zvýrazněný pás nad zemí) dá konverzi 0,60 místo 0,45 a řetěz +1.
  - Dotyk země během střemhlavu znamená dopad. Je to skutečné riziko, které řídí hráč.
  - Začne-li událost, střemhlav skončí automatickým vybráním. Ú1 dovolí 1 použití za let, Ú2 2 použití.
- Úrovně a cena / podmínka odemčení: Ú1 200 mincí (nebo zkouška „dolet 300 m“), Ú2 250 mincí.
- Proč je hra zábavnější: Dává hráči aktivní řízení letu, které dnes chybí, protože let je automatický (KB 05 §2.1, Swink „real-time control“, H). Výměna výšky za rychlost s nervy u země je čitelné riziko × odměna a selhání je přičitatelné sobě (Juul 2009, V/H).
- Pocit „chci a potřebuju“: Touha „chci letu taky něco udělat“. V Bonusech je ukázka dvou duchů dráhy (bez a s nízkým průletem) a čísla z deterministického přehrání („vysoké vybrání ≈ 0 m, nízký průlet ≈ +25 m“).
- Rizika a etika: Hrozí, že konverze vytvoří „perpetuum mobile“. Simulace musí potvrdit, že vysoké vybrání je neutrální a zisk vzniká jen nízkým průletem. Kolize vstupu s QTE je vyřešená pravidlem „jen bez aktivní události“. Pád do země neoznačovat posměšně.
- Simulace: **Nová logika.**
  - Bot se ponoří po vrcholu ve výšce > 25 m a pustí v cílové výšce 3,5 m s chybou `N(0, alt)·|vy|`. Je-li výška < 0, dopadne.
  - Měřit zisk doletu, podíl pádů a nízkých průletů podle profilu.
  - Hypotéza: pády slabý ~15 %, expert < 2 %. Vysoké vybrání (výška > 8 m) mění dolet −2 až +2 %. Nízký průlet +6 až +10 %. Očekávaný přínos: slabý ~0 %, expert +6 %.
- Náročnost implementace: L

### DQ-12 — Přízemní polštář (klouzavý manévr)
- Typ: Bonus
- Kde: Bonusy (slot), Let
- Mechanika: Jednou za let, když je vlaštovka pod 6 m a neběží událost, aktivuje klepnutí polštář.
  - Aktivace ve výšce ≤ 1,0 m (perfektní): klesání = 0 po dobu 1,6 s.
  - Ve výšce 1,0–2,5 m: klesání 0 po dobu 1,2 s.
  - Ve výšce 2,5–6 m: klouzavost ×1,4 po dobu 1,5 s.
  - Pod vlaštovkou svítí pás 0–1 m a 1–2,5 m a ukazatel „polštář připraven“.
  - Rychlost se dál řídí podle `cruise`, takže zisk je asi `cruise × doba`.
- Úrovně a cena / podmínka odemčení: 1 úroveň, 140 mincí.
- Proč je hra zábavnější: Mění konec každého letu z pasivního doklouzání v okamžik dovednosti („záchrana na poslední chvíli“). Hráč ho řídí sám, takže těsnost je skutečná, ne vyrobená (KB 02 §4.3 bod 3, P10).
- Pocit „chci a potřebuju“: Frustrace „spadl jsem kousek před hranicí místa / rekordem“. Hráč vidí předem, co polštář dává: „perfektní polštář ≈ +17 m (šipka), +13 m (kluzák)“, tedy `cruise × 1,6 s` a `cruise × 1,2 s` z `MODELS`.
- Rizika a etika: Nesmí se z něj stát „automatická +15 m“ bez dovednosti. Ve výšce 2,5–6 m proto dává jen asi třetinu. Výsledkový text smí uvádět jen pravdivou těsnost („do Zahrad chybělo 6 m“).
- Simulace: **Nová logika.**
  - Bot klepne v cílové výšce 0,6 m s chybou `N(0, alt)·|vy|`. Pozdě znamená dopad bez efektu.
  - Měřit zisk a podíl perfektních aktivací podle profilu.
  - Hypotéza: zisk slabý +3 až +5 m, expert +14 až +17 m (šipka). Na šipce úr. 0 to je +2 až +8 %, s postupem relativně méně. Hody do 500 m −0 až −1.
- Náročnost implementace: M

### DQ-13 — Pohodlné časování (asistence)
- Typ: Systém
- Kde: Bonusy (sekce Asistence, bez slotu) a nastavení
- Mechanika: Přepínač, který ve fázích `warning` a `interaction` zpomalí hru na 0,6× (krok fyziky se násobí 0,6) a rozšíří okna ×1,4 (`f.p.window × 1,4`).
  - Vypnuto ve výchozím stavu.
  - Hra ho neutrálně nabídne po 4 minutích v řadě nebo po 3 letech s úspěšností QTE < 40 %: „Chceš pomalejší události? Jde to kdykoli vypnout.“
  - Nestojí mince, nesnižuje odměnu, rekordy neoznačuje.
- Úrovně a cena / podmínka odemčení: Zdarma, dostupné od začátku.
- Proč je hra zábavnější: GAG „adjust game speed“ a XAG 107/116 doporučují zpomalení a prodloužení limitů (KB 06 §3.11, N14, H). Transparentní, hráčem zvolená pomoc místo skryté DDA (KB 04 N5, Celeste Assist Mode, H). Kdo by jinak odešel s pocitem „na to nemám reflexy“, zůstane (Lomas: začátečníci hrají déle při vyšší úspěšnosti, V).
- Pocit „chci a potřebuju“: Frustrace „holub mi pořád ujde, jsem na to pomalý“. Nabídka přijde přesně v okamžiku, kdy problém cítí, a ukáže krátkou ukázku zpomalené události.
- Rizika a etika: Nabídka nesmí znít jako výsměch (Celeste přejmenovala „Cheat Mode“). Neříkat „snadný režim“. Nabídnout jen jednou za sezení. Zpomalení prodlouží let asi o 1,3 s na událost.
- Simulace: **Parametr** (okna ×1,4) + šum bota v herním čase `qte × 0,6`.
  - Měřit úspěšnost QTE a hody do 500 m pro slabý profil.
  - Hypotéza: úspěch slabého 80 → ~99 %, perfekt 35 → ~75 %. Hody do 500 m slabého −3 až −5. Expert < 1 hod. Simulace navíc ověří, že slabý s asistencí nepředběhne dobrého bez ní (cíl: stále ≥ 2 hody pozadu).
- Náročnost implementace: S

### DQ-14 — Automatické QTE a holub klepnutím (asistence)
- Typ: Systém
- Kde: Bonusy (sekce Asistence, bez slotu) a nastavení
- Mechanika: Dva samostatné přepínače.
  - **Holub klepnutím:** první klepnutí začne držet, druhé ho ukončí, takže prst nemusí ležet na displeji (XAG 107). Řeší i riziko `pointercancel` při pohybu prstu (KB 06 N10). Okna se nemění.
  - **Automatické QTE:** každá událost se ve středu sama vyhodnotí jako **úspěch** (nikdy perfektní), řetěz +1. Švih (DQ-04) nezahrnuje. U Dvojtaktu (DQ-08) zahraje obě noty jako úspěch.
  - Nestojí mince a výsledek neoznačuje.
- Úrovně a cena / podmínka odemčení: Zdarma, dostupné od začátku.
- Proč je hra zábavnější: GAG doporučuje vypnutí nebo zjednodušení QTE (KB 06 N15, H). Úspěch bez perfektního bonusu nevytváří dominantní strategii. Perfektní zásahy a řetěz z nich zůstávají odměnou dovednosti.
- Pocit „chci a potřebuju“: Hráč s motorickým omezením nebo hrající jednou rukou v tramvaji: „chci jen házet a dívat se na město“. V nastavení je u přepínače napsané přesně, co dělá: „úspěch v každé události, perfektní zásahy jen ručně“.
- Rizika a etika: Automatika nesmí být lepší než průměrný hráč s řetězem a švihem, jinak by dovednost ztratila smysl. Hlídá to simulace. Bez trestu a bez hanby (pravidlo 0.2/4).
- Simulace: **Jen parametr:** `simulate(..., profile=1, {perfectRate:0})` a v kampani `hit=1, perfect=0`.
  - Hypotéza: dolet automatiky ≈ 257 m (šipka úr. 0, hod 0,9), tedy víc než slabý a méně než dobrý (~265 m). S DQ-03 dobrý vede o ≥ 6 %. Hody do 500 m: automatika jako průměrný ±2.
- Náročnost implementace: S

### DQ-15 — Kalibrace prstu
- Typ: Systém
- Kde: Bonusy (sekce Asistence) a nastavení
- Mechanika: Krátký test: 8 klepnutí do rytmu 600 ms (zvuk + bliknutí). Medián odchylky se uloží jako `offset`, oříznutý na ±120 ms, a odečte se od času každého vstupu QTE a švihu.
  - Hra test nabídne, když průměrná odchylka posledních 10 zásahů má stejné znaménko a |průměr| > 60 ms: „Klepeš soustavně o 0,07 s pozdě. Zkalibrovat?“
  - Kalibruje se jen čistá latence vstupu a výstupu, ne „styl hráče“ (KB 06 N12).
- Úrovně a cena / podmínka odemčení: Zdarma.
- Proč je hra zábavnější: Latence telefonů se liší o 35–140 ms, na webu hlavně jako stálý posun se SD ~7 ms (Nicosia 2022, Pronk 2020, V), což je řád perfektního okna. Rytmické hry kalibraci nabízejí standardně (Harmonix, H). S plujícím středem a švihem ±60 ms je to podmínka férovosti.
- Pocit „chci a potřebuju“: Frustrace „klepl jsem přesně a píše to pozdě“. Nabídka přichází s konkrétním číslem z vlastních dat, takže hráč přínos vidí předem.
- Rizika a etika: Nabídka musí stát na skutečných datech. Kalibrace nesmí jít zneužít jako skryté rozšíření okna (ořez ±120 ms).
- Simulace: **Nová logika** (posun zařízení `device ~ N(0,06; 0,03)` přičtený ke všem vstupům, po kalibraci zbytek `N(0; 0,015)`).
  - Hypotéza: bez kalibrace perfekt průměrného 52 → ~40 %, švih P 31 → ~20 %. Kalibrace vrátí ≥ 90 % původních hodnot.
- Náročnost implementace: M

### DQ-16 — Rozpis zásluhy (co jsi udělal ty a co papír)
- Typ: Systém
- Kde: Výsledek
- Mechanika: Po dopadu se deterministicky (stejný seed, bez událostí) přepočítají tři lety:
  - (a) referenční hod modelu na úrovni 0 (ideální úhel, síla 0,75, bez QTE),
  - (b) hráčův hod na úrovni 0 bez QTE,
  - (c) hráčův hod s jeho úrovněmi bez QTE.

  Řádky rozpisu:
  - **Tvůj hod** = b − a (úhel, síla, švih),
  - **Vylepšení** = c − b,
  - **Tvoje zásahy** = skutečný dolet − c (QTE, řetěz, schopnosti),
  - **Vítr** zvlášť, pokud je zapnutý (DQ-10).

  Pod rozpisem jedna KR věta s odchylkou („poryv: pozdě o 0,06 s ★“, „uvolněno 0,09 s po vrcholu“). Přehyby se ukazují v řádku vylepšení.
- Úrovně a cena / podmínka odemčení: Bez ceny.
- Proč je hra zábavnější: Přímo plní pokyn „oddělit podíl dovednosti a vylepšení“ (KB 04 N4, §2.7, P7; 03 N8; 07 N9). Hráč, který vidí „tvůj hod +31 m“, si zlepšení připíše sobě (Lomas: effectance, V/H). Spolu s KR učí (St. Germain, V).
- Pocit „chci a potřebuju“: Odpovídá na otázku, kterou si hráč klade po každém rekordu: „bylo to mnou, nebo tím, co jsem koupil?“ Zároveň zviditelní ostatní karty: hráč vidí, kolik mu dal švih nebo řetěz, a ví, co trénovat.
- Rizika a etika: Pořadí odečítání ovlivní čísla. Pevně ho stanovit (hod → vylepšení → zásahy) a nepřikrášlovat. Zobrazovat i záporné hodnoty („tvůj hod −12 m“), jinak by šlo o výběr jen dobrých pokusů (KB 04 N9).
- Simulace: Jako prožitek **nesimulovatelné, jen playtest** (otázka „Proč byl tvůj nejlepší hod lepší?“, KB 04 návrh měření). Simulace jen ověří výpočetní náklady (3 pasivní lety < 5 ms) a stabilitu znaménka řádků napříč seedy.
- Náročnost implementace: M

### DQ-17 — Pilotní zkoušky (odemykání dovedností za dovednost)
- Typ: Odemčení
- Kde: Bonusy
- Mechanika: Každý bonus nebo nová událost má dvě cesty k odemčení: **mince** (ceny v kartách výše) nebo **zkoušku** s viditelným postupem:
  - Termika: 3 perfektní zásahy v jednom letu,
  - Dron: Řetěz ×4,
  - Druhý nádech: 5× švih celkem,
  - Střemhlav: dolet 300 m,
  - Bouřkový pilot: 10 letů s úspěšností QTE ≥ 80 %.

  Bez časových limitů a bez expirace. Postup se ukazuje jen na stránce Bonusy, ne za letu.
- Úrovně a cena / podmínka odemčení: Viz výše.
- Proč je hra zábavnější: Dává blízké učební cíle uvnitř vzdáleného rámce (Locke & Latham, P6, V). Dovednost je vidět a má hodnotu. Mince zůstávají alternativou, takže slabší hráč není zablokovaný (P14).
- Pocit „chci a potřebuju“: „Chci termiku a jsem jeden perfektní zásah od ní.“ Hráč cíl vidí předem a má ho v rukou. Po 500 m dávají zkoušky smysl i mincím, které jinak ležely ladem.
- Rizika a etika: Achievementy mohou působit jako povinnost (KB 08 N8). Proto žádné notifikace za letu, střídmý počet (≤ 6) a možnost vše prostě koupit. Bez umělé těsnosti cíle.
- Simulace: **Nová logika** (sledovat splnění zkoušek v `campaign`).
  - Měřit hod, ve kterém každý profil zkoušku splní, a kdy by si bonus mohl koupit.
  - Hypotéza: expert splní zkoušky do hodu ~10, slabý z většiny až po 30+. Mincemi slabý odemkne první bonus kolem hodu 25 (po 500 m). Rozdíl potvrdí, že obě cesty jsou potřeba.
- Náročnost implementace: M

### DQ-18 — Odpuštění předčasného stisku (konec reakční pasti)
- Typ: Systém
- Kde: Let
- Mechanika: Stisk ve fázi `interaction` dřív než **120 ms před otevřením okna úspěchu** se ignoruje stejně jako stisk ve varování. U poryvu bez posunu je to od 0,20 s po začátku pruhu, úspěch se otevírá v 0,32 s. Spotřebovaný pokus ani „miss“ nevzniká. Hráč klepne znovu.
  - Pro holuba analogicky: uvolnění dřív než 0,25 s po stisku ruší držení bez vyhodnocení (pravděpodobně omyl).
  - S DQ-01 se hranice počítá od posunutého okna.
- Úrovně a cena / podmínka odemčení: Bez ceny.
- Proč je hra zábavnější: Odstraní neintuitivní selhání „brzy“ u hráče, který rychle reaguje na objevení pruhu (zraková RT + latence ≈ 0,29–0,47 s, KB 06 §3.4, N5). Je to standardní skryté odpuštění v duchu bufferu z Celeste (KB 06 §3.6, H) a neubírá dovednost, protože perfektní zásah dál vyžaduje přesnost.
- Pocit „chci a potřebuju“: Frustrace „klepl jsem hned, jak to naskočilo, a napsalo to bez bonusu“. Přínos je vidět v nápovědě po prvním takovém stisku: „Ještě ne, počkej na kruh.“
- Rizika a etika: Nesmí umožnit „mačkat stále“. Mezi ignorovanými stisky je pauza 0,25 s a po 3 ignorovaných stiscích v jedné události se další vyhodnocují normálně.
- Simulace: **Malá logika.** Do `flyOnce` přidat model reaktivního hráče (podíl 30 %): stiskne v `začátek pruhu + react + N(0, qte)`. Dnešní `pl.press += .25` při `null` už opakování modeluje.
  - Měřit úspěšnost poryvu pro reaktivní a anticipující hráče.
  - Hypotéza: úspěch poryvu u reaktivního slabého +5 až +10 p.b., u ostatních +0 až +2 p.b. Perfekt beze změny.
- Náročnost implementace: S

---

## 2. Přehled pro simulaci

| ID | Název | Typ | Nárok na simulátor | Hlavní metrika | Hypotéza ve zkratce |
|---|---|---|---|---|---|
| DQ-01 | Plující střed okna | Systém | nová logika (`read`) | perfekt memorujících | memorování perfektu ztratí 12–46 p.b., hody ±1 |
| DQ-02 | Ladička | Vylepšení | parametr bota | perfekt čtoucích | vrátí ≥ 95 % perfektu |
| DQ-03 | Řetěz | Systém | malá logika | dolet podle profilu | expert +8–12 %, slabý +1–3 % |
| DQ-04 | Perfektní vypuštění | Systém | nová logika (`rel`) | podíl švihů | 9–77 % podle profilu a varianty |
| DQ-05 | Druhý nádech | Bonus | nová logika | očekávaný multiplikátor | výhodný jen pro dobrý a expert |
| DQ-06 | Termika | Událost | nová logika | přetažení, dolet | průměrný +3–6 % |
| DQ-07 | Reklamní dron | Událost | nová logika | úspěch memorujícího | < 60 % (memorování nefunguje) |
| DQ-08 | Parní dvojtakt | Událost | nová logika | podíl dvojtaktů | 50 / 80 / 99 % |
| DQ-09 | Bouřkový pilot | Bonus | nová logika | dolet s bonusem a bez | zlom mezi průměrným a dobrým |
| DQ-10 | Vítr a korouhvička | Systém + Bonus | parametr | SD doletu, bot A/B | SD +8–15 %, čtení větru +3–6 % |
| DQ-11 | Střemhlav a vybrání | Bonus | nová logika (`alt`) | pády, zisk | vysoké vybrání ≈ 0, nízký průlet +6–10 % |
| DQ-12 | Přízemní polštář | Bonus | nová logika (`alt`) | zisk v m | slabý +3–5 m, expert +14–17 m |
| DQ-13 | Pohodlné časování | Systém | parametr | QTE a hody slabého | úspěch → ~99 %, −3 až −5 hodů |
| DQ-14 | Automatické QTE | Systém | parametr | dolet proti profilům | mezi slabým a dobrým |
| DQ-15 | Kalibrace prstu | Systém | nová logika (`device`) | perfekt s posunem a bez | vrací ≥ 90 % |
| DQ-16 | Rozpis zásluhy | Systém | jen playtest | přičitatelnost | — |
| DQ-17 | Pilotní zkoušky | Odemčení | nová logika (sledování) | hod splnění | expert ~10, slabý 30+ |
| DQ-18 | Odpuštění předčasného stisku | Systém | malá logika | úspěch reaktivních | slabý +5–10 p.b. |

**Doporučené pořadí simulace:**
1. DQ-04 a DQ-01 s rozšířenými profily, protože mění základní model dovednosti.
2. DQ-03, DQ-13, DQ-14 a DQ-18: levné a ovlivní, jak se balancují další karty.
3. Nové události a schopnosti.

Společné kontrolní kritérium: **rozdíl hodů do 500 m mezi slabým a expertem se nemá zvětšit o víc než 30 %** proti dnešku, softlock 0 % a slabý s asistencí stále za dobrým bez ní.

---

## 3. Otázky pro uživatele

1. **Kolik dovednosti má rozhodovat?** Karty DQ-01, 03, 04, 05, 09 a 11 posouvají hru od „vylepšení táhnou“ k „ruka táhne“. Je to záměr, nebo má hra zůstat hlavně relaxační arkádou s jemnou dovedností?
2. **Plující střed pro všechny, nebo až po náběhu?** Návrh: od hodu 4, plná síla od hodu 8. Jde zapnout i jen pro poryv a holuba nechat stálého.
3. **Zvuk:** Ladička (DQ-02) a kalibrace (DQ-15) stojí na zvuku, který hra zatím nemá. Je zvuk v plánu?
4. **Schopnosti za letu (DQ-11, DQ-12)** mění jednotlačítkový let na řízený. Chcete aktivní řízení, nebo má let zůstat „sleduj a reaguj na události“?
5. **Odemykání:** mají nové události a bonusy jít za mince, za zkoušky (DQ-17), nebo obojí? A mají přijít před 500 m, nebo až jako obsah po něm?
6. **Asistence:** smí je hra sama neutrálně nabídnout po sérii nezdarů (DQ-13), nebo jen v nastavení?
7. **Vítr:** může ovlivnit rekord (rozpis ho ukáže zvlášť), nebo se má v zadním větru rekord počítat jinak?
8. **Humor dronu:** jaký tón reklam? Smyšlené firmy v neonovém městě, nebo spíš suchý humor ve stylu příběhů míst?
