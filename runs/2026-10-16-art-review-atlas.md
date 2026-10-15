# Art review: Atlas s bonusy (16. 10. 2026, art-director)

Zadání: art review nových vizuálních prvků (Atlas, Dílna 3/12/3, události, kapsy, papíry, celek) proti bibli 05 (kap. 2, 6, 7, 8, 10, 13, 17), specu `research/atlas/05-art-udalosti.md` a rozhodnutím 06. Ověřit opravu A1–A7 z `runs/2026-10-15-art-review-u5.md`. Kód se neměnil. Větev `f3-3d-prototypy`, HEAD `7a6aa6b`.

## Hotové kroky
1. Přečteno: bible 05 (celá), 05-art-udalosti, 06 (15. 10.), art-review-u5, reporty B1a, C2a, C2b, C3, C4, G1, G2, F1, stav.
2. Kód: `atlas-postcards.js`, CSS `.atlas-*`, Dílna (`.kind`, `.node`, `.preview`), `ui-layer.js` (drawQte, drawCombo, drawAbility, drawBurst, drawPopups, drawIntro), `event-fx.js`, `companion3d.js` (lampion, pára), `plane.js` (vzory papírů), `palette.js`, `ui.js` (ikony kapes).
3. Prohlížeč: server 4192, vlastní záložka. Hostitelská stránka s iframy 1280×800, 932×430, 375×667 a 360×740. Uložená hra 4192 byla zálohovaná a na konci vrácená (`best` 8 456 m). Snímky scény přes `__r3d.reset/advance/snapshot`, ořezy složené do mřížky. Kapsy přes `core.flightInput`, hod v iframu přes Space. **Použito 9 snímků z 10.** Detaily jsem měřil přes DOM a z kódu.
4. Úklid: záložka zavřená, server 4192 zastavený, save vrácený.

## Rozpracovaný krok
- žádný

## Jak bylo měřeno
- Okno bylo skryté (`document.hidden = true`). S `?timer` se scéna kreslila a snímky šly pořídit, vzhled je tedy hodnocený. Animace CSS a časovače stránky ve skrytém okně stojí, proto pohyb a časování ze snímků nehodnotím.
- Kontrasty jsou spočtené z hex (WCAG). Velikosti na plátně jsou spočtené z kódu: plátno má 640 logických px, `s = šířka CSS / 640`, `uiScale = clamp(576/šířka, 1, 2)`.
- Matice: Atlas (uprostřed hry i na konci, všechny 4 čtvrti), Dílna (uprostřed i na konci), pára, termika (varování), lampion (den, čtvrť 4: varování, kontakt, odraz), hvězda (před středem, po zásahu s výtryskem), poryv, Dive, Cushion (pásma a polštář), papíry v katalogu (zblízka a 24 px), čip kapes při míření i za letu, úvod na desktopu, let na šířku a na výšku.

---

## Nálezy

Závažnost: **MUSÍ** = před hraním, **MĚLO BY** = do opravné dávky, když se vejde, **POZDĚJI** = plánovaná dávka nebo nízká priorita.

### A. Opravná dávka teď

| # | Závažnost | Co je špatně | Pravidlo | Oprava (soubor, hodnota) |
|---|---|---|---|---|
| B1 | **MUSÍ** | **Lampion zakrývá vlaštovku.** Ve chvíli kontaktu a ~0,2 s po něm je lampion (z = +0,8, tedy před vlaštovkou) i jeho kotouč záře přímo přes trup vlaštovky ve středu kruhu. Ve čtvrti 4 je vlaštovka pod hnědožlutým osmiúhelníkem zatlumená. Ve dne zase lampion ve chvíli kontaktu leží přesně pod krémovým mezikružím (střed lampionu ~5,5 m před vlaštovkou ≈ 55 CSS px = pás 51–69 px) a hráč nevidí, čeho se dotkl. | P1, kap. 6 bod 1 a 13 bod 5, 05-art kap. 3.1 („kam“ čte hráč z lampionu) | `event-fx.js LANTERN_FX`: `z: 0.8 → -0.8` (lampion za vlaštovkou, vlaštovka se kreslí přes něj), `ahead: 5.5 → 3.5` (kontakt uvnitř volného středu kruhu: desktop ~37 px < 51, telefon ~11 px < 21). Záře v `companion3d.js` ř. 448: `pose.z - 1` zůstane (za lampionem). Test v Node: v `close` je `|lanX − X| ≤ 3,6 m` a `z < 0`. |
| B2 | **MUSÍ** | **Atlas barví čtvrti rolemi.** `.atlas-district[data-tone]` používá `tomato-600` (perfekt), `teal-600` (úspěch), `mustard-400` (hodnota) a `cobalt-600` (fokus). Stejné tóny dostávají siluety pohlednic, okraj karty a obrys „max úroveň“. Následky: (1) karty čtvrti 4 na max úrovni mají obrys `cobalt` 3 px, **stejný jako fokus klávesnice**; (2) čtvrť 3 má okraj a obrys hořčicový **2,03 : 1** proti krému (grafika musí mít ≥ 3 : 1); (3) Město lampionů je v Atlasu sytě modré a polední, ne večerní. | kap. 2.2 („jedna role = jedna barva“, cobalt jen fokus, „hořčicová jen hodnota“), kap. 10 (barvy čtvrti a denní doby z kap. 2.3), kap. 2.4 (grafika ≥ 3 : 1) | **Teď, bez čekání na volbu barev:** `.atlas-card.atlas-top-level { outline: 3px solid var(--ink) }` (stav nese i text „Max level“). **Barvy čtvrtí:** viz BLOCKED 1, doporučuji tokeny z kap. 2.3: čtvrť 1 `#3d4f7a`, 2 `#2c6e9b`, 3 `#7a3b2e`, 4 `#1d2b4d`, akcent siluet 1 `#f2b65a`, 2 `#e8b03e`, 3 `#e0533a`, 4 `#f2c14e`. Proti krému 7,5 / 5,1 / 7,8 / 13 : 1. Do `style.css` jako `--district-1…4` a `--district-1…4-accent` ve vrstvě 2. |
| B3 | **MUSÍ** | **Kombo a zvoneček na 360 px jsou drobné.** Štítek `×N` má 11 log. px × uiScale 1,6 × s 0,5625 = **9,9 CSS px**. Očko řetězu má 9 × 6 px a zvoneček Chimes **8 × 9 px**, takže na telefonu je to tečka. Teal očka proti nebi mají 2,1–2,9 : 1. | Atlas pravidla (text ≥ 12 px), kap. 6 (grafika ≥ 3 : 1), 05-art kap. 6.2 (zvoneček je odměna, má být vidět) | Stejný vzor jako `ringZoom`: v `event-fx.js` přidat `comboZoom(cssWidth, s) = max(1, 13 / (COMBO_UI.font · s · cssWidth/640))` a v `drawCombo` násobit `s` touto hodnotou (na 360 px ×1,31: text 13 px, očko 12 × 8 px). Zvoneček zvlášť `max(1, 14 / (9 · s · k))`, na 360 px 14 × 16 px. Celý řetěz podložit krémovým štítkem `K.tag` (alfa 0,9, `lift` jako popupy): pak se očka čtou proti krému 4,4 : 1, ne proti nebi. Test: `drawCombo` s falešným ctx na šířce 360 dá písmo ≥ 13 CSS px. |
| B4 | **MĚLO BY** | **Ikony kapes.** Autor navrhl ↘ ◡ ♪ » ◆ ≈. Dva znaky kolidují: **◆ Sharp Edge** se plete s ◈ mince (hořčicová jen hodnota) a s kosočtvercem bodu průběhu QTE (lampion, hvězda). **≈ Calm Sky** je už v Dílně jako „≈ +X m“ (odhad). | kap. 8 (jeden znak = jeden význam, stav ne jen barvou), kap. 2.2 | `src/ui.js` ř. 107 `POCKET_ICON`: `dive '↘'`, `cushion '◡'`, `whistle '♪'`, `rocket '»'` ponechat. **`sharp: '◣'`** (ostrý roh, blok Geometric Shapes jako ◡) a **`calm: '◠'`** (klenba nebe, zrcadlo ◡ polštáře). Všechny znaky bez emoji varianty. Rozhodnuto podle bible, ne BLOCKED. Na iOS a Androidu NOT ASSESSED (vykreslení znaků ◡ ◠ ◣ ověřit na telefonu). |
| B5 | **MĚLO BY** | **Polštář Cushion je bílá elipsa s grafitovým obrysem** těsně pod vlaštovkou (`drawAbility` pillow: `q.disc` + `q.dot` plná čára). Na snímku vypadá jako spodní půlka vlaštovky. | kap. 6 bod 2 a 13 bod 5 (ve výšce letu nic bílého s grafitem) | `ui-layer.js drawAbility` pillow: výplň `PT.tape #efe0a8` (alfa `0.4 + 0.5·k`), obrys `PT.kraftDark` 1 px čárkovaně `[3, 2]`, posun `a.y + 4` (mezera od trupu). |
| B6 | **MĚLO BY** | **Pás Dive má grafitové čárkované čáry přes celou šířku obrazovky** (`lowPass`: `q.dot`, alfa 0,5) a tyrkysový pruh přes celou ulici. Tím vzniká druhá grafitová čára v pásu letu. | kap. 6 bod 2 (žádná jiná grafitová čára v pásu letu kromě stopy a poryvu), P4 | Čáry `q.success` místo `q.dot` (pás už je tyrkysový, informace zůstane). Pruh kreslit jen od `view.px − 40` do `view.px + 260` log. px (před vlaštovkou) a konce zeslabit (lineární gradient 0 → alfa na 30 px). |
| B7 | **MĚLO BY** | **Záře lampionu ve čtvrti 4 je tvrdý osmiúhelník** (`CircleGeometry(1, 8)`, spec 16), `#f2c14e` alfa 0,22 přes tmavé nebe působí jako hnědá zátka, ne jako světlo. Má průměr 13 m, takže je větší než vlaštovka. | 05-art kap. 3.1 („měkký kotouč“, 16 segmentů), kap. 4 (večer svítí lampiony z hedvábného papíru) | `companion3d.js` ř. 199: `CircleGeometry(1, 16)` s alfou ve vrcholech (střed 0,30 → okraj 0) místo konstantní opacity. Poloměr `1.5 · 4.4 → 1.0 · 4.4` (průměr 8,8 m ≈ vlaštovka). Barva `mix(#f2c14e, #fffaf0, .3)`. |
| B8 | **MĚLO BY** | **Tělo termiky je obdélník s tvrdou horní a boční hranou** (páska alfa 0,22 až do `Y + 25 m`). Vypadá jako skleněná krabice nad městem, ne jako teplý vzduch. Stužky po okrajích fungují dobře. | P2, 05-art kap. 2.1 | V `companion3d.js writeThermal` dát alfu těla ve vrcholech: dole 0,22, v horní třetině lineárně k 0. Svislé hrany těla zúžit o 0,5 m dovnitř od stužek, aby hranu nesla jen stužka. |
| B9 | **MĚLO BY** | **Popup „½“ je nejmenší a nejslabší ze všech.** Styl `half` má malé písmo 13 log. px (na 360 px 11,7 CSS px), číslice zlomku jsou ~6,5 px a barva `kraftDark` má na krému 3,66 : 1, tedy pod 4,5 pro malý text. | kap. 7 (popupy), kap. 2.4, Atlas pravidla (text ≥ 12 px) | `ui-layer.js drawPopups`: `half` počítat jako `big` (17 log. px, na 360 px 15,3 CSS px). Kontrast velkého textu ≥ 3 : 1 je pak splněný. Text zůstává `½` (05-art kap. 1.3). |
| B10 | **MĚLO BY** | **Pára je u vlaštovky skoro neviditelná.** Pruh má na desktopu jen 2–3 px a obláčky krém alfa 0,55 přes ranní nebe mají 1,1–1,5 : 1. V šedi hráč nenajde, odkud pára jde a kdy dorazí. Kruh to nese, objekt ne. | hierarchie kap. 6 (objekt události je třetí, ale musí být k nalezení), 05-art kap. 1.4 | Obláčkům dát spodní stín papíru: spodní polovina osmiúhelníku `mix(cream, #5b4f7a, .25)` (jako boky karet, kap. 3), horní zůstane krémová, alfa beze změny (≤ 0,6). `STEAM_FX.jet` `[1.2, 0.6] → [2.0, 1.0]` m. |
| B11 | **MĚLO BY** | **Pohlednice čtvrtí 2–4 jsou ploché vektory bez řezané hrany, stínu vrstvy a vláken.** Vedle 3D fotek čtvrti 1 vypadají jako z jiné hry. | kap. 1 „Co hra není: levná kartonová krabice“, P2, kap. 10 | Levně v CSS a SVG (`atlas-ui.js postcardEl`, `style.css .atlas-pc*`): každé vrstvě `main`/`accent` dát `filter: drop-shadow(-1px 1px 0 color-mix(in srgb, #3b3560 25%, transparent))` (stín zvednutého papíru) a horní řez `stroke: color-mix(in srgb, #fffaf0 55%, var(--pc-c)); stroke-width: .8` jen na horních hranách (ve SVG stačí `paint-order: stroke` s tahem 0,8 na celém tvaru). Bílou `--paper` u tónu `light` nahradit `var(--cream-50)` (bílá patří vlaštovce). |
| B12 | **MĚLO BY** | **Siluety „Fields“ a „Rooftop Harbor“ (autor je sám označil za slabé), a k tomu „Sky Terraces“.** Fields = hnědá deska s rajčatovým pruhem a sloupkem: v malém se nedá poznat. Port = plachetnice na zemi: patří spíš do Slunného přístavu a z „Rooftop“ nemá nic. Terraces = schodovité obdélníky, čtou se jako trajekt. | kap. 13 bod 1 (dominanta poznat do 1 s), kap. 10 (identitu nese silueta) | `src/atlas-postcards.js SHAPES`: **fields** = obilné silo a stodola nad pruhy polí (silo je zastávka „Grain Silo“, 05-plan §): `hills`, pruhy `poly('accent',['0,80','0,70','160,64','160,80'])`, `poly('ground',['0,80','0,75','160,71','160,80'])`, silo `rect('main',106,30,16,40)` + kopule `S('path','main',{d:'M106 30A8 8 0 0 1 122 30Z'})`, stodola `poly('accent',['56,72','56,52','74,40','92,52','92,72'])`, vrata `rect('far',68,58,12,14)`. **port** = střechy města s kotvicím stožárem a lampionovou vzducholodí: střechy `poly('main',['0,80','0,60','20,48','40,60','40,80'])`, `poly('main',['36,80','36,54','62,40','88,54','88,80'])`, `poly('main',['84,80','84,62','104,50','124,62','124,80'])`; stožár `rect('main',61,18,2.4,24)`; vzducholoď `S('ellipse','accent',{cx:96,cy:22,rx:30,ry:9})` + gondola `rect('main',90,31,12,4)` + lano `S('path','main',{d:'M63 20L70 22',fill:'none','stroke-width':1})`; řetěz lampionů `circle('accent',x,58,2)` pro x 10, 26, 50, 74. **terraces** = přidat 3 stromy-kotouče `circle('accent',…,5)` na hrany teras a na nejvyšší terasu zábradlí. (Pokud `tests/atlas-postcards.test.js` povoluje jen `path/rect/circle`, elipsu zapsat jako `path` se dvěma oblouky `A`.) Kontrola: všech 12 siluet v šedi na 25 % (karta 149 × 113 px na telefonu). |
| B13 | **MĚLO BY** | **Atlas na šířku (932×430):** když se otevře detail (při novince sám), spodní list `max-height: 45dvh` (194 px) spolu s hlavičkou a horním blokem zabere celé okno a karty nejsou vidět. | P4 (jeden vrchol pozornosti: pohlednice), kap. 13 bod 9 | `style.css` v `@media (max-height: 500px) and (orientation: landscape)`: `.atlas-sheet { position: fixed; inset: 0 0 0 auto; width: 46%; max-height: none; border-left: var(--frame) solid var(--rule); border-top: 0 }` (detail jako pravý sloupec) a `.atlas-main { padding-right: 47% }`. |
| B14 | **MĚLO BY** | **Dílna a Atlas mluví různým papírovým jazykem.** Atlas má pásku a natočení, Dílna ploché rámy. **Žebřík papírů neukazuje papír:** Copy, Kraft, Washi a Fólie se liší jen jménem, přitom papír se podle bible pozná podle tónu (kap. 17). | kap. 8 (stejná věc vypadá stejně), kap. 17 („papír podle tónu a tvaru stopy“), P2 | `workshop-ui.js` + `style.css .kind-head`: vlevo před jméno vzorek papíru 32 × 22 px s CSS pozadím z `PLANE_PAPER`: Copy `#fff` + `repeating-linear-gradient(0deg, transparent 0 5px, #7f9ed6 5px 6px)`, Kraft `#ead7b5`, Washi `#fbe8cc` + `radial-gradient(circle at 50% 100%, transparent 4px, #3d4f7a33 4px 5px, transparent 5px) 0 0/10px 6px`, Fólie `linear-gradient(110deg, #cfe2ec, #ffe0e8, #fff0b0)`; obrys 1,5 px `--ink`, natočení −2°. Aktivní druh (`.kind.active`) dostane pásku `::before` jako `.atlas-found` (44 × 14 px, `--tape`, −2°). |
| B15 | **MĚLO BY** | **Náhled „≈ +X m“ v Dílně má hořčicovou hranu** (`.preview { border-left: 6px solid var(--color-reward) }`), ale ukazuje metry, ne mince. | kap. 2.2 (hořčicová jen hodnota) | `style.css .preview`: `border-left-color: var(--ink)` (nebo `--tape` s tečkovanou hranou tužkou). |
| B16 | **MĚLO BY** (zbytek A4) | **Na šířku 932×430 je „Throw it“ 72 px** (clamp podle 9vw) a sedí v řádku HUD mezi titulem a mincemi. A4 opravila pás, ale písmo vyrostlo z 52 na 72 px (17 % výšky). | 03-art kap. 2.2, kap. 9.2, P4 | `ui-layer.js introTextSize`: brát i výšku, `cssSize = clamp(32, min(0.09·w, 0.12·h), 72)`, `cssSub = clamp(15, min(0.038·w, 0.042·h), 18)`. Na 932×430 vyjde 52 / 18 px, desktop beze změny. `drawUi` předá `c.canvas.clientHeight`. |
| B17 | POZDĚJI (drobné) | Aktivní kapsa je odlišená jen páskou `inset 0 -3px 0 var(--tape)` (páska proti `card2` 1,12 : 1, není vidět). Text „· Pasivní“ u pasivních stav nese, takže to není chyba stavu. | kap. 8 | `.pocket-active { box-shadow: inset 0 -2px 0 var(--ink) }`. |
| B18 | POZDĚJI | Washi: seigaiha (`plane.js` pKind 2, síla 0,16, buňka 0,06 délky) není vidět ani zblízka v katalogu, Washi tam vypadá jako hladký broskvový papír. Bible chce „jemně“, ale v Dílně a v ruce se má poznat. | kap. 17.3 | `pSeig` síla `.16 → .28`, buňka `/.06 → /.085`. Zdálky (24 px) se dál slije (`far` už je). Ověřit, že L listu ≥ 0,69. |

### B. Už v plánovaných dávkách (nezadávat znovu)
- **U6:** úvod na desktopu: titul 83 px a „Throw it“ 72 px se nepřekrývají (A1 opraveno), ale dva velké nápisy dál soupeří o pozornost (P4). Řešit s výzvou U6.
- **U8 / S2 (záběr na výšku):** na 360×740 za letu je město pás ve 25–60 % výšky, spodních ~40 % je prázdný opar s čipem a tlačítkem. Vlaštovka ve chvíli prvních událostí letí v 0,64 (desktop) až 0,73 (telefon) šířky. Bible kap. 6 bod 5 chce levou část obrazu, takže před ní je málo místa pro štítek a lampion. Ověřit s kamerou S1 / S2.
- **H4:** lidé na střechách u místa odhodu jsou pořád velcí a růžoví / bílí (A6), tmavé hejno ptáků v nebi. Lampiony ve městě čtvrti 4 nejsou vidět (jen lampion události).
- **H5:** kouř komínů (nebyl v záběru).
- **H6:** pejsek (není ve hře).
- **G2 pokračování:** pohlednice čtvrtí 2–4 jako snímky, až budou modely. B11 a B12 jsou levný mezikrok do té doby.

### C. Ověření A1–A7 z U5

| # | Stav | Důkaz |
|---|---|---|
| A1 | opraveno | 1280×800: titul a „Throw it“ se nepřekrývají, nápověda 18 px pod výzvou (snímek 9). `introTextSize` clamp 32/72 a 15/18. |
| A2 | opraveno v kódu | `zoom` 1,25 / 1,5 v `style.css` ř. 1319–1330, `uiZoom` v plátně. Okno 2560 je ve hře NOT ASSESSED (měřil jsem v iframech). |
| A3 | opraveno | 375 / 360: výzva ≥ 32 px (snímek 3: „Hoď ji“ je větší než titul). |
| A4 | **částečně** | Pás `landText` [0,06; 0,20] je v kódu, ale písmo vyrostlo na 72 px → B16. |
| A5 | opraveno v kódu | `kid.js` `cap` y 0,285, oči `plateX(0.165, 0.15, …)`. Vizuálně v míření NOT ASSESSED (snímek míření zblízka nebyl). |
| A6 | trvá → H4 | Růžová a šedá postava na sousední střeše v úvodu (snímek 9). |
| A7 | opraveno | `scrollbar-width: thin; scrollbar-color: var(--kraft-400)` (`style.css` ř. 673, 1047). |

### D. Co je dobré a nechat
- **Kruh QTE:** jednotný pro všechny události, na 360 px poloměr 30 CSS px, vlaštovka uvnitř volná (snímek 6). Zóny ve varování v alfě 0,5, pecky páry nad kruhem, zarážky jádra termiky, zarážka kontaktu lampionu, u hvězdy jen rajčatová zóna s hvězdou. Stav je všude čitelný i tvarem.
- **Hvězda ve dne** tmavomodrá čtyřcípá s ohonem, dobře vidět proti nebi a nikdy rajčatová (05-art 4.1).
- **Poryv** jako krémové proužky s grafitovým lemem, ventilace zůstala jen páře (rozhodnutí 06).
- **Lampion ve dne** cihlový s tmavomodrými žebry, nesvítí. Ve čtvrti 4 svítí jen tam (06). Opravit jde jen poloha a záře (B1, B7).
- **Výtrysk:** tři tužkové čárky za ocasem, grafit 1 px, nic nové barvy.
- **Pohlednice čtvrti 1** (3D snímky) jsou přesně to, co chce kap. 10: dioráma v barvách rána, páska a natočení ±1–1,2°.
- **Dílna 3/12/3:** stav druhu textem (✓ Vše koupeno / 2 z 3 / Otevře se po… / ⚑ místo) i tvarem rámu (plný s tyrkysovou hranou, tučný grafit, čárkovaný). Uzly ✓ / ▱ / · s cenou 16 px. Písmo a tokeny z bible.
- **Papíry na vlaštovce:** Copy linky a okraj, Kraft tón a airmail lem s obrysem 2,9 px, Fólie perleť bez neonu a duhy. Na 24 px zůstává silueta a tón (kap. 17 záměr).
- **Čipy kapes:** „↘ Střemhlav · Počkej“ dole nad tlačítkem, stav slovem a tlumenou barvou. Neleží v pásu letu.

### E. Rozpory kód × bible / spec (návrh, co platí)
1. Atlas `--tone` = role (`atlas-*` v `style.css` ř. 1449–1460 a 1655–1673) × bible kap. 2.2 a 10 → platí bible (B2, BLOCKED 1 jen pro konkrétní barvy).
2. Záře lampionu `CircleGeometry(1, 8)`, poloměr 6,6 m × spec „měkký kotouč, 16 segmentů“ → platí spec, poloměr navrhuji zmenšit (B7).
3. `LANTERN_FX.z = 0.8` (před vlaštovkou podle spec 3.1 „jako holub“) × P1 → **platí P1**. Spec 05-art kap. 3.1 opravit na `z = −0,8` (B1).
4. Popup termiky: spec 2.3 chce „Half“ slovem, kód ukazuje `½` pro half i partial. Navrhuji ponechat `½` (bez jazyka) a zvětšit (B9). Product-designer potvrdí.
5. Bible kap. 10 „mapa trasy jako tužková čára s papírovými kapsami“: Atlas má mřížku karet a sloty kapes, tužkovou trasu ne. Navrhuji upravit bibli podle B1a (mřížka karet po čtvrtích). Rozhodne product-designer s art-directorem, není to blokující.
6. Bible kap. 12 a 17.4 ještě uvádějí „Ad Drone jako papírový drak“ a razítko „Drone papírový drak“. Platí 06 (Sky Lantern). Orchestrátor opraví text bible.

### F. NOT ASSESSED
- Reduced motion všech nových efektů (nešlo emulovat, animace ve skrytém okně stojí).
- Termika, hvězda a pára ve čtvrti 4 a ve čtvrtích 2–3 (lampion i hvězda jen ve čtvrti 1 a 4).
- Zvoneček Chimes na obrazovce (na snímku nebyl vidět, velikost spočtená z kódu).
- Hvězdičky výtrysku hvězdy (na ořezu nerozlišitelné).
- Test v šedi na 25 % (dělal jsem jen barevné snímky; hierarchii jsem hodnotil z kontrastů a ořezů).
- Ikony ◡ ◠ ◣ na iOS a Androidu, skutečný telefon, dotyk.
- Okno 2560 přímo (A2), póza míření zblízka (A5).
- Výkon (`perf-check`): záře, tělo termiky, pás Dive. Přístupnost textu Atlasu a Dílny ověřit `a11y-audit`.

### BLOCKED

**BLOCKED 1: Barvy čtvrtí v Atlasu.** Dnes má každá čtvrť v Atlasu jednu barvu ze „signálních“ barev hry: 1 rajčatová (= perfektní zásah), 2 tyrkysová (= úspěch), 3 hořčicová (= mince), 4 kobaltová (= rámeček výběru klávesnicí). Hráč pak vidí třeba modrý rámeček kolem karty a myslí si, že je vybraná. Navíc Město lampionů vypadá v Atlasu jako poledne. Bible říká, že tyhle barvy patří jen svým rolím a pohlednice má barvy své denní doby. Možnosti:
(a) **barvy denní doby z palety čtvrtí** (bible kap. 2.3): 1 ranní břidlicová `#3d4f7a`, 2 mořská `#2c6e9b`, 3 rezavá `#7a3b2e`, 4 noční `#1d2b4d` s lampionově žlutou; siluety pak vypadají jako ráno / poledne / odpoledne / večer;
(b) všechny čtvrti jednou neutrální tužkovou barvou, čtvrť pozná hráč jen podle jména a siluety;
(c) nechat dnešní barvy.
**Doporučuji (a):** každá čtvrť má v Atlasu svou denní dobu jako ve hře (P3) a žádná se nesplete s „povedlo se“ nebo „mince“. Obrázek dnešního stavu: Atlas ve hře po dohrání (snímky revize nejsou uložené v repu, zadání povolilo jen tento soubor; orchestrátor může pořídit jeden snímek mřížky čtvrtí 2–4); pro srovnání barev `research/design/img/papir/paleta.png`. (Obrys „max úroveň“ se mění na grafitový hned, nezávisle na volbě.)
