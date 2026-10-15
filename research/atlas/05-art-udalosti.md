# Art spec C2a: nové události ve scéně

> **NÁVRH 15. 10. 2026** (art-director, Opus). Zadání pro dávku **C2a** z `research/atlas/04-plan-zapojeni.md` §5. Závazné podklady: rozhodnutí `research/bonusy/06-rozhodnuti.md` (15. 10.: Ad Drone → **Sky Lantern**, ID `drone` zůstává; On Air → **Chimes**; papírové město bez dronů a robotů; kouř papírový, H5), bible `research/design/05-styl-papir.md` (P1–P4, kap. 2, 3, 6, 7, 11, 13, 17.4), formát a rozpočty podle `research/plan-hratelnost/03-art.md`, `.claude/rules/render3d.md`.
> Čísla časování jsou z kódu: `src/flight.js` (`windowsOf`, `press`, `updateEvents`, `setBurst`), `src/progression-numbers.js` (`events.*`, `combo`, `atlas.chain`, `atlas.onAir`), `src/events.js` `TIMING`. Kontrasty jsou spočtené z hex (WCAG poměr). **Vzhled ve hře NOT ASSESSED** (prohlížeč jsem nepoužil; nové události ještě nejsou ve hře).

Kód stavíš v `companion3d.js` (3D), `ui-layer.js` (kruh, výtrysk, kombo), `events-view.js` (tvar kruhu), případně v nových modelech `src/render3d/models/` (`sky-lantern.js`, `thermal.js`, `shooting-star.js`) a v testech. Nic z toho nemění fyziku ani časování.

---

## 0. Společná pravidla pro všechny nové události

**Proč:** P1 (vlaštovka vždy vidět), P4 (jedna věc na obrazovku), hierarchie bible kap. 6: *vlaštovka a stopa > QTE a nejbližší událost > město > obloha*.

| Pravidlo | Hodnota | Opora |
|---|---|---|
| Materiál 3D | `paperMaterial` z `paper.js` (čelo, řezaná hrana, boky, vlákna), barvy vertexů. Žádný obrys (`hull` tloušťka 0 je v pořádku), žádný toon, žádná emise kromě lampionu ve čtvrti 4. Žádné ikosaedry ani koule: papír je plochý výstřižek nebo „soustružený“ díl s 6–8 stěnami. | P2, bible kap. 3 a 13 bod 2 |
| Barvy | jen tokeny `PAPER_TOKENS` a karty čtvrtí (`palette.js`). Nové klíče patří do `PAPIR.companion` (návrh v každé kapitole). Role (`tomato` perfekt, `teal` úspěch, `mustard` hodnota, `cobalt` fokus) nikdy na 3D objektu události. | bible kap. 2.2, 13 bod 3 |
| Bílá + grafit | nikdy. Nic ve výšce letu není bílé ani grafitové; pára a kouř krémové `PT.cream`, alfa ≤ 0,6. | bible kap. 6 bod 2 |
| Velikost | nic v pásu letu není větší než vlaštovka (7,75 m, × 1,15 na úzké scéně) a zároveň světlejší. Objekty událostí mají **herní velikost** jako holub (výjimka M-1 pro „jmenovité herní velikosti“, bible kap. 13 bod 11). | P1 |
| Čas | 3D prostředí události kreslí polohu „on twos“ (`onTwos(t)`, 12 kreseb/s), ale **okamžik středu okna se nikdy nekvantuje**: vrchol páry, kontakt lampionu a průlet hvězdy padnou přesně na `e.w.c` (kreslit z nekvantovaného `t` jen u objektu, který nese časování). | bible kap. 7 „prostředí“, P1 |
| Hitstop | **žádný nový.** Platí dnešní: úspěch 0,05 s, perfekt 0,09 s (bible kap. 7). Dílčí výsledky (`half`, `partial`, první obláček páry) hitstop nemají. | zadání, bible kap. 7 |
| Záře | žádná neonová záře, bloom ani aditivní míchání. Jediné světlo je lampion ve čtvrti 4 (rozhodnutí 06, 14. 10.: „všechno, co svítí, svítí jen ve Městě lampionů“). | 06, bible kap. 16.3 |
| Paměť | vše vytvořit jednou v `createCompanion`, za snímek jen matice a uniformy, `dispose` všeho. Jen jedna událost je aktivní najednou, objekty se proto sdílejí. | render3d.md |
| Rozpočet | **v jednu chvíli nejvýš +4 draw calls a +400 △** navíc proti dnešku (holub a ventilace dnes: 5 DC, ~370 △). Mimo událost 0 DC (`visible = false`). | render3d.md (120 DC scéna) |
| Reduced motion | pohyb pryč, informace zůstane: objekt stojí v poloze, kde bude ve středu okna, výsledek ukáže změnou tvaru nebo zmizením, ne pohybem. Bez otřesu a záblesku. | bible kap. 7, render3d.md |

### 0.1 Kruh QTE pro všechny nové události (UI vrstva)

Základ zůstává `drawQte` (bible kap. 11): krémové mezikruží ±9 px kolem kruhu (alfa 0,95, stín zvednutého papíru), stopa `miss` 6 px, úspěch `teal` 9 px, perfekt `tomato` 11 px + pěticípá hvězda, bod průběhu grafit, varování čárkovaně (blikání 1,9 Hz, pod 3 Hz). Nová pravidla:

1. **Průběh nových událostí jde od `e.w.open` do `e.w.close`**, ne přes pevné `TIMING.bar`: `progress = (t − open) / (close − open)`, začátek nahoře (12 h), po směru hodin. Zóny se počítají **z `e.w` konkrétní události** (ne z `windows(f)[kind]` jako dnes `zonesFor` v `ui.js`), jinak plující střed nebude vidět. Stejně se počítá i poryv, který má od M2 plující střed (`e.off`).
2. **Plující střed** = zóna úspěchu a perfektu leží u každé události jinde na kruhu (u poryvu a hvězdy střed 0,29–0,71 obvodu podle `e.off`, rampa hodů 3–15). Během události se **nehýbe**. Aby ho hráč stihl přečíst, **zóny se kreslí už ve varování** v alfě 0,5 pod čárkovaným kruhem (dnes varování ukazuje jen čárkovaný kruh). Při začátku interakce plná alfa. Reduced motion: totéž, bez blikání čárkování (alfa 0,8 jako dnes).
3. **Velikost na telefonu.** Poloměr v logických px je v `EVENT_VIEWS` (steam 32, thermal 34, drone 30, star 28). Na šířce 360 CSS px je to jen 16–19 px a vnitřní hrana mezikruží (r − 9) ≈ 11 px leží **přes vlaštovku** (ta má ≥ 24 px, opsaná kružnice ≤ 18 px, bible M4). Návrh: celý kruh (poloměr, mezikruží, tloušťky, hvězda, bod) škálovat `z = max(1, 30 / (r · s))`, kde `s = cssWidth / 640`. Výsledek v CSS px:

| Šířka | `s` | r 28 / 30 / 32 / 34 log. px → CSS px | vnitřní hrana mezikruží | stopa / úspěch / perfekt |
|---|---|---|---|---|
| 360 (telefon na výšku) | 0,5625 | **30 / 30 / 30 / 30** (z 1,90 / 1,78 / 1,67 / 1,57) | 20–21 px (vlaštovka ≤ 18) | 5,7–6 / 8,5–9 / 10,4–11 |
| 375 | 0,586 | 30 / 30 / 30 / 30 | 21 px | ~6 / 9 / 11 |
| 932 × 430 (na šířku) | 1,456 | 41 / 44 / 47 / 50 | 28–37 px | 8,7 / 13 / 16 |
| 1280 | 2,0 | **56 / 60 / 64 / 68** | 38–50 px | 12 / 18 / 22 |

   Totéž by mělo platit pro poryv a holuba (jinak by nové kruhy byly na telefonu větší než staré): **BLOCKED 2** na konci.
4. **Stav nikdy jen barvou:** zóny se liší tloušťkou (6 / 9 / 11 px) a perfekt hvězdou; výsledek kromě barvy oblouku nese popup (text přes i18n, C2b) a u vícedílných událostí tvar značky (kap. 1.2).
5. Kontrasty na krémovém mezikruží (z hex, `cream #fbf6ec`): `teal` 4,42, `tomato` 3,99, `miss` 3,46, `kraftDark` 3,66, `graphite` 13,9, `#3d4f7a` 7,50. Vše ≥ 3 : 1.

| Událost | Rozpětí kruhu (s) | Střed / zóny (podíl obvodu, základ bez Folds) | Perfekt na kruhu | Značka bodu | Zvláštnost |
|---|---|---|---|---|---|
| Poryv (dnes, s plujícím středem) | 1,2 | střed 0,29–0,71; úspěch ±0,233 | 60° (360: 31 px oblouku, 1280: 63 px) | čtverec | zóny už ve varování |
| **Pára** | 1,20–1,35 | středy ≈ 0,40 a ≈ 0,80; úspěch ±0,19–0,21 | 2 × 48–54° (360: 2 × 26 px) | tečka | 2 hvězdy, 2 pecky (kap. 1.2) |
| **Termika** | 1,30 | střed 0,5; jádro ±0,192, sloup = celý kruh | 44° (360: 23 px, 1280: 52 px) | tečka | stopa = sloup, `kraftDark` (kap. 2.2) |
| **Sky Lantern** | 1,20 | střed 0,90; úspěch 0,667–1,0 (úr. 2: 0,597–1,0) | 0,817–0,983 = 60° | kosočtverec | zarážka kontaktu ve 12 h (kap. 3.2) |
| **Hvězda** | 1,20 | střed 0,29–0,71; úspěch = perfekt ±0,167 | 120° (360: 63 px) | kosočtverec | jen rajčatový oblouk, žádný tyrkysový |

---

## 1. Pára (Steam Hop, `steam`)

**Mechanika (kód):** varování 0,8 s; dva obláčky `c = [at + 1,3; at + 1,3 + puffGap]`, `puffGap` 0,45–0,6 s; okno každého ±0,252 s (perfekt ±0,09) × Folds; dva stisky („ťuk-ťuk“). 2 zásahy = `success` (oba perfekt = `perfect`), 1 = `partial`, 0 = `miss`. Úr. 3 + perfekt = výtrysk `flat 0,3` na 2 s (kap. 5).

### 1.1 Ve scéně (3D): ventilace se dvěma výtrysky
**Znovu použít:** ventilaci z `companion3d.js` (skříň 4,4 × 1,6 × 3 m + mřížka) a její umístění „tam, kde bude vlaštovka ve středu okna“: `ventX = X + vx · (c[0] − t)` při začátku varování (dnes s `TIMING.gustCenter`). Ventilace dnes patří poryvu, viz **BLOCKED 1**.

| | Hodnota | Proč |
|---|---|---|
| Tvar | ventilace beze změny (skříň `PAPIR.companion.vent`, mřížka `grate`, rozměr jako dnes). Výtrysk = **plochý zužující se pruh** (karta čelem ke kameře, 2 △ na výtrysk, šířka 1,2 m dole → 0,6 m nahoře) + **hlava ze 3 papírových obláčků** (osmiúhelník `CircleGeometry(1, 8)`, ⌀ 1,6 / 2,2 / 2,6 m, natočené o pevný náhodný úhel). | P2: stejný jazyk jako papírový kouř H5 (`03-art.md` kap. 3.3), ale svislý a rychlý. |
| Barva | pruh i obláčky `PAPIR.companion.steam = PT.cream`, alfa **0,55** (bible ≤ 0,6), `depthWrite: false`, `renderOrder` pod stopou a vlaštovkou. | P1: krém × nebe 1,1–2,6 : 1, je to skvrna, ne hrana; vlaštovka se kreslí přes. |
| Velikost | obláček ≤ 2,6 m = **⅓ vlaštovky**. Pruh od mřížky k hlavě, hlava končí **1 m pod břichem vlaštovky** (`Y − 1`). | bible kap. 6 bod 2 |
| Pohyb (smyčka) | každý výtrysk vystřelí **0,5 s před svým středem** a hlava dorazí k vlaštovce **přesně v `c[i]`** (rychlost hlavy = výška / 0,5 s, kreslit z nekvantovaného `t`). Po středu hlava stoupá dál 0,3 s a rozplyne se zmenšením (smoothstep velikosti k 0). Mezi výtrysky mřížka „dýchá“ (alfa 0,35 → 1 podle blízkosti dalšího středu, jako dnes `grate.opacity`). | Dva viditelné údery = „ťuk-ťuk“. Hráč vidí, kdy obláček dorazí. |
| Zásah obláčku | hlava se rozfoukne nahoru: obláčky × 1,3, pruh se utrhne od mřížky a odletí 0,3 s. | odměna, ne trest |
| Minutí obláčku | hlava se zastaví 4 m pod vlaštovkou a splaskne (velikost k 0 za 0,25 s). | minutí je vtip |
| Reduced motion | oba pruhy stojí v plné výšce od začátku interakce, hlavy bez stoupání; zásah = obláčky × 1,3 bez pohybu, minutí = obláček zmizí. | bible kap. 7 |
| △ / DC | skříň 12 + mřížka 2 (dnes), 2 pruhy 4, obláčky 2 × 3 × 8 = 48 v jednom `InstancedMesh` (místo dnešních 16 ikosaedrů = 320 △). **≈ 66 △, nejvýš 4 DC** (skříň, mřížka, pruhy, obláčky; sloučí-li game-dev pruhy do instancí obláčků, 3 DC). | rozpočet kap. 0 |

Nový klíč: žádný (`steam`, `vent`, `grate` už v `PAPIR.companion` jsou). Dnešní `steamMat` (toon, ikosaedr, alfa 0,85) **porušuje bible** (kap. 3, kap. 6 bod 2): v C2a nahradit plochým osmiúhelníkem s alfou 0,55.

### 1.2 Kruh: ťuk-ťuk = dvě pecky
- Na kruhu **dvě zóny úspěchu a dvě hvězdy perfektu** (podíl obvodu ≈ 0,40 a ≈ 0,80, kap. 0.1). Zóny se při širokých oknech (Folds) slijí, proto je mezi nimi **krémová mezera 2 px** (řez kartonu) v polovině mezi středy.
- **Dvě pecky** = počet stisků: dva malé terčíky ⌀ 7 px (log.) vně kruhu ve 12 h, 6 px od mezikruží, krém s grafitovým lemem 1,5 px. Po každém stisku nebo propadnutí obláčku se pecka změní **tvarem i barvou**: perfekt = malá rajčatová hvězda, úspěch = plný `teal` terčík, minutí = prázdný kroužek `miss`. Další očekávaná pecka má o 1,5 px silnější lem (kde jsem).
- **Puls:** v okamžiku každého středu `c[i]` se jeho zóna úspěchu na 0,1 s zesílí o 2 px (jediný „ťuk“ vizuálně, ≤ 3 Hz, protože středy jsou ≥ 0,45 s od sebe). Reduced motion: bez pulzu, pecky zůstávají.
- Varování: čárkovaný kruh + zóny v alfě 0,5 + obě pecky prázdné.

### 1.3 Zpětná vazba
| Výsledek | Kdy | Co |
|---|---|---|
| První obláček zasažen | po 1. stisku | jen pecka + 3 krémové útržky (`particles` kind 0) u vlaštovky. Bez popupu a hitstopu (druhý stisk hned následuje). |
| `perfect` (oba perfekt) | po 2. stisku | dnešní perfekt (`fxEvent 'perfect'`): rajčatová hvězda, útržky, hitstop 0,09. Úr. 3: start výtrysku (kap. 5). |
| `success` | po 2. stisku | dnešní úspěch: útržky `teal` + krém, hitstop 0,05. |
| `partial` (1 ze 2) | po 2. stisku / propadnutí | útržky jen krémové (4 ks), popup „½“ přes i18n (C2b), **bez hitstopu**. |
| `miss` | | dnešní minutí (šedý popup), bez hitstopu. |

### 1.4 Kontrolní body (art review, perf)
- Hlava výtrysku je u vlaštovky přesně v `c[i]` (test v Node: poloha hlavy z čisté funkce v `life.js` nebo nového čistého modulu, ne z three.js).
- Obláček ≤ 2,6 m, alfa ≤ 0,6, barva ≠ `#ffffff`; žádný ikosaedr (`tests/render3d-*`).
- Snímek v šedi na 25 %: vlaštovka první, ventilace a pára až za kruhem.
- Perf: ≤ 4 DC a ≤ 120 △ během páry, 0 mimo ni.

---

## 2. Termika (Thermal, `thermal`; úr. 3 druhý sloup)

**Mechanika (kód):** varování **2 s**; sloup ±0,65 s kolem `c = at + 2,65`; jádro ±0,25 s (× Folds), perfekt ±0,08 s; jeden stisk. V jádru `success`/`perfect`, jinde ve sloupci `half` (0,6 účinku), mimo nic. Úr. 3: s pravděpodobností 0,4 přijde druhý sloup (`follow`, 0,3 s po konci účinku prvního, tedy ≥ 1,3 s po stisku, a znovu s varováním 2 s).

### 2.1 Ve scéně (3D): sloup teplého vzduchu z papírových stužek
Sloup je časové okno převedené do prostoru: šířka `2 · 0,65 · vx`, jádro `2 · w.s · vx` (při 60 m/s 78 m a 30 m, záběr letu ~120 m). Střed `colX = X + vx · (c − t)` se určí při začátku varování a pak stojí; při 2 s varování vjede sloup do záběru zprava, takže hráč vidí, **kam** letí.

| | Hodnota | Proč |
|---|---|---|
| Tvar | **okraje sloupu** = dvě svislé zvlněné papírové stužky (pás 0,5 m široký, 12 segmentů, vlna ±0,8 m s periodou 14 m), od země do `Y + 25 m`. **Tělo sloupu** = jeden průsvitný obdélník mezi okraji. **Jádro** = 10 stoupajících útržků (obdélníček 0,8 × 0,5 m, natočený), jen v šířce jádra. | P2: papírová „spirála z ozdoby“, P3: teplý vzduch. Okraje = kde začíná „half“, útržky = kde je jádro. |
| Barva | stužky `PT.kraftDark #9c7a55` (× nebe čtvrti 1: 1,8–3,2; čtvrť 3: 2,1–3,4; čtvrť 4: 2,6–3,5); tělo `PT.tape #efe0a8` alfa **0,22** (ve čtvrti 4 `CARDS[3].lantern #f2c14e` alfa 0,18); útržky `PT.kraft` a `#b5503c` (cihlová, `D1.roof[1]`) střídavě. Nový klíč `PAPIR.companion.thermal = { edge, body, scraps }`. | žádná role, žádná bílá. Okraje se čtou jako hrana pole, ne jako čára (pás 0,5 m, ne tužka). |
| Velikost | útržek 0,8 m (≈ ⅒ vlaštovky); stužky tenké. Tělo velké, ale skoro průhledné a tmavší než vlaštovka. | P1 |
| Pohyb | útržky stoupají 6 m/s, natáčí se (π/s), znovu od země (smyčka 4 s, on twos); stužky se vlní „on twos“ (fáze `0,9 · t`). | P3 |
| Zásah jádra | útržky 2× rychleji a 6 z nich se na 0,6 s otočí kolem vlaštovky (poloměr 4 m) a odletí nahoru; stužky se natáhnou o 20 % nahoru. Perfekt totéž + dnešní perfekt. | |
| `half` | jen útržky 1,5× rychleji, 0,4 s. | |
| Minutí (žádný stisk) | sloup za 0,5 s zprůhlední (alfa těla k 0, stužky ztratí výšku shora). | |
| Druhý sloup (úr. 3) | stejný model, znovu z poolu (jen jeden sloup naráz, mezi nimi ≥ 1,3 s). Rozlišení: **štítek** varování „Again!“ přes i18n (C2b) a na kruhu dvě pecky jako u páry, druhá aktivní (počet sloupů v řadě, ne nový tvar). | P4: žádný nový objekt navíc |
| Reduced motion | stužky rovné, útržky stojí rozložené po výšce jádra; zásah = útržky o 2 m výš skokem, minutí = sloup zmizí. | |
| △ / DC | stužky 2 × 24 + tělo 2 = 50 △ v jedné sloučené geometrii (1 DC, vertexy jen přepsat při vlnění on twos: 52 vertexů); útržky `InstancedMesh` 10 × 2 = 20 △ (1 DC). **70 △, 2 DC.** | |

### 2.2 Kruh: ťuk ve sloupci = stopa je sloup, jádro tyrkysové
- **Celý kruh je sloup** (`open` = začátek sloupu, `close` = konec), proto stopa **není šedá „minutí“, ale `PT.kraftDark` 6 px** (3,66 : 1 na krému) = „tady ještě něco dostaneš“. Nový klíč `PAPIR.qte.half = PT.kraftDark` (nová role „částečný účinek“, používá ji i `partial` u páry v popupu, pokud bude barevný).
- Jádro `teal` 9 px (138° = podíl ±0,192), perfekt `tomato` 11 px + hvězda (44°).
- **Sloup s jádrem čitelný tvarem:** na hranicích jádra dvě krátké radiální zarážky (2 × 10 px log., `pencil700`), aby šlo jádro najít i v šedi. Bod průběhu = tečka.
- Varování trvá 2 s: čárkovaný kruh + zóny v alfě 0,5. Blikání čárkování 1,9 Hz jako dnes (≤ 3 Hz).
- Úr. 3 druhý sloup: dvě pecky ve 12 h (kap. 1.2), první vyplněná výsledkem prvního sloupu.

### 2.3 Zpětná vazba
`perfect` a `success` jako dnes (hitstop 0,09 / 0,05). `half`: popup „Half“ (i18n, C2b) v `kraftDark`, 4 útržky kraft, **bez hitstopu**. `miss`: dnešní minutí.

### 2.4 Kontrolní body
- Šířka sloupu = `2 · col · vx_při_varování`, střed na `vx · (c − t)` (test v Node přes čistou funkci polohy).
- V šedi na 25 %: okraje sloupu viditelné, ale vlaštovka a kruh první; tělo sloupu nesmí zesvětlit nebe kolem vlaštovky víc než o 8 % jasu (alfa 0,22 tape).
- Perf: 2 DC, ≤ 80 △; vlnění on twos bez alokace.

---

## 3. Sky Lantern (ID `drone`): papírový lampion, odraz

**Rozhodnutí 06 (15. 10.):** Ad Drone → Sky Lantern, „odraz od papírového lampionu v Městě lampionů“, ID `drone` zůstává. **Mechanika (kód):** varování 0,8 s, kontakt `close = at + 2,0`, střed `c = contact − 0,12`; úspěch ±0,28 s (úr. 2 × 1,3), perfekt ±0,1 s; po kontaktu se už nedá stisknout. Úr. 3: s pravděpodobností 0,5 druhý lampion (`followGap` 0,2 s po konci účinku).

### 3.1 Ve scéně (3D): létající papírový lampion
| | Hodnota | Proč |
|---|---|---|
| Tvar | **kongming lampion:** komolý „soustružený“ hranol, 8 stěn, nahoře ⌀ 3,6 m, dole ⌀ 2,8 m, výška 4,4 m; nahoře zavřený (pól), dole otevřený; dole drátěný kruh (lišta 0,15 m). Na plášti 3 vodorovná žebra jako tmavší pruhy ve vertexových barvách (ne geometrie). Žádný provázek (lampion letí sám). | P2: soustružený díl jako dítě C (`parts.js` `lathe`, pokud po H2 existuje). Herní velikost jako holub (≈ 0,6 vlaštovky), výjimka M-1. |
| Barva ve dne (čtvrti 1–3) | plášť **cihlová `#b5503c`** (`D1.roof[1]`, nástupce červené podle bible 17.4 S4), žebra a horní pól `#3d4f7a` (`D1.window`), drát `PT.kraftDark`. Plášť × nebe: 1,8–4,4 : 1 (nejhorší horní pás čtvrti 2), tmavomodrá žebra 2,9–7,1 : 1 dávají hranu vždy. **Nesvítí** (06: svítí jen čtvrť 4). | žádná role (`tomato` je perfekt), čitelná hodnotou |
| Barva ve čtvrti 4 | plášť `CARDS[3].lantern #f2c14e`, žebra `#7a3b2e` (střecha čtvrti 3). **Svítí:** plášť bez stínování (konstantní jas, `toneMapped: false`), za ním **měkký kotouč** stejné barvy, poloměr 1,5 × výška lampionu, alfa 0,22, normální míchání (ne aditivní), nepulzuje. Plášť × večerní nebe 3,8–8,3 : 1. Pravidlo stejné jako lampionový skin K4 (bible 17.4 S6). | 06 (14. 10.), bible 16.3 |
| Kde | při začátku varování `lanX = X + vx · (close − t)`, `lanY` = `Y` v tu chvíli. Během interakce se lampion **jemně stáčí do dráhy**: `lanY` se blíží k aktuálnímu `Y` rychlostí ≤ 3 m/s, aby se kontakt (nos vlaštovky × plášť) stal přesně v `close`. `z = −0,8` (za vlaštovkou: vlaštovka se kreslí přes lampion, P1; opraveno podle art review 16. 10., B1). | „kam“ čte hráč z lampionu, „kdy“ z kruhu |
| Smyčka | houpání ±4° (1,2 Hz) a stoupání/klesání ±0,3 m (0,5 Hz), on twos. | |
| Zásah (odraz) | v kontaktu se lampion **odrazí dozadu nahoru**: náklon 25° od vlaštovky, posun +2 m nahoru a −3 m po x za 0,4 s, pak se houpe tlumeně (2 kmity). Perfekt navíc **jedna otočka kolem svislé osy** (0,5 s) a 4 útržky v barvě pláště. Vlaštovku zvedá fyzika (`dvy`), ne animace. | odměna, „odraz“ ze jména |
| Minutí | vlaštovka proletí těsně pod lampionem: lampion se zhoupne o 10° a pomalu odplouvá nahoru (+1 m/s), za 1 s zmizí za horním okrajem nebo zprůhlední. | minutí je vtip, žádná srážka |
| Druhý lampion (úr. 3) | stejný model, druhá instance z poolu (dva lampiony mohou být v záběru současně, když první odplouvá): jiný natočení a o 10 % menší. | |
| Reduced motion | bez houpání; lampion stojí v bodě kontaktu. Zásah = náklon 25° skokem (žádný pohyb), minutí = zmizí v kontaktu. Záře ve čtvrti 4 zůstává (nepulzuje). | |
| LOD | LOD 0: 8 stěn, plášť 8 × 2 × 3 pásy = 48 △ + pól 8 + drát 16 = **72 △**; LOD 1 (lampion < 20 px na obrazovce, rychlá kamera): 6 stěn, bez drátu = **30 △**. | |
| DC | lampion 1 (oba lampiony v jednom `InstancedMesh`, 2 instance), kotouč záře 1 jen ve čtvrti 4 (`CircleGeometry(1, 16)`, 16 △). **2 DC, ≤ 160 △** (2 lampiony + 2 kotouče). | |

Nový klíč: `PAPIR.companion.lantern = { day: '#b5503c', dayRib: '#3d4f7a', night: '#f2c14e', nightRib: '#7a3b2e', wire: PT.kraftDark, glowAlpha: 0.22 }`.

### 3.2 Kruh: ťuk před kontaktem
- Perfekt leží těsně před koncem (0,817–0,983), úspěch 0,667–1,0 (úr. 2 širší). **Ve 12 h (konec kruhu) je zarážka kontaktu:** radiální čárka 3 × 14 px (log.) `graphite` přes mezikruží, která říká „tady se dotkne“. Bod průběhu = kosočtverec.
- Varování: čárkovaný kruh, zóny alfa 0,5, zarážka už vidět.
- Úr. 3 druhý lampion: dvě pecky ve 12 h vedle zarážky (kap. 1.2).

### 3.3 Zpětná vazba
Dnešní `success` / `perfect` / `miss` (hitstop 0,05 / 0,09 / 0). Perfekt s odrazem: žádný otřes navíc (vlaštovku nese fyzika). Ve čtvrti 4 při perfektu kotouč záře **nemění jas** (žádný záblesk; pravidlo „svítí, nepulzuje“).

### 3.4 Kontrolní body
- Silueta v šedi na 25 %: lampion se nesmí plést s vlaštovkou (není bílý, nemá grafit) ani s balónem života čtvrti (balóny jsou kotouče `BALLOONS`, lampion je komolý hranol s tmavými žebry).
- Ve čtvrtích 1–3 lampion **nesvítí** (test: materiál ve dne bez `toneMapped: false` a bez kotouče).
- Kontakt v `close` ± 1 snímek (test polohy v Node).
- Perf: ≤ 2 DC, ≤ 160 △.
- **Rozpory k opravě v bibli** (po schválení, orchestrátor): kap. 12 „Ad Drone jako papírový drak“ a kap. 17.4 razítko „Drone papírový drak“ → **„Sky Lantern: lampion“** (rozhodnutí 06 15. 10. má přednost).

---

## 4. Padající hvězda (Shooting Star, `star`)

**Mechanika (kód):** událost navíc (8 / 12 / 16 % letů podle úrovně), varování 0,8 s, interakce 1,2 s, střed `at + 1,4 + off` (plující), okno ±0,2 s a **každý zásah je perfekt** (`success` neexistuje). Zásah: výtrysk `linear` amp 1,0 na 4 s (kap. 5), kombo +2. Minutí: kombo 0.

### 4.1 Ve scéně (3D): papírová hvězdička z kusu noci
| | Hodnota | Proč |
|---|---|---|
| Tvar | **čtyřcípá hvězda** (ne pěticípá: ta je rajčatová role perfektu, bible 17.4 razítka), vystřižená z kartonu: plochá karta 0,15 m silná, cípy 1,6 m (průměr 3,2 m ≈ 0,4 vlaštovky), vnitřní poloměr 0,4. **Ohon** = 3 zužující se papírové pásky (délka 9 / 7 / 5 m, šířka 0,6 → 0 m), každá 6 segmentů. | P2: řezaná hrana (světlé jádro kartonu na boku hvězdy) říká „papír“. |
| Barva ve dne (čtvrti 1–3) | hvězda **`#3d4f7a`** (`D1.window`, „kousek noční oblohy, co spadl do dne“), řez hrany světlý podle shaderu (`mix(barva, #fffaf0, .55)`); ohon stejná barva, alfa 0,6 → 0 po délce. Hvězda × nebe 2,9–7,1 : 1 (nejhorší horní pás čtvrti 2). | Jediná barva, která drží proti všem denním nebům a není role ani grafit. Krém nebo páska by ve dne zmizely (1,0–2,6 : 1). |
| Barva ve čtvrti 4 | hvězda `PT.cream` (× večerní nebe 5,9–13 : 1), ohon krém alfa 0,6 → 0. **Nesvítí** (je to papír, ne světlo). Pozor na pravidlo „bílá + grafit“: krém bez obrysu, OK. | P1, 06 |
| Dráha | přímka **zprava shora šikmo dolů**, 30° pod vodorovnou, relativní rychlost vůči vlaštovce 60 m/s v obraze. Poloha: `P(t) = plane(t) + dir · 60 · (w.c − t)` (kreslit z nekvantovaného `t`), takže hvězda **protne místo vlaštovky přesně ve středu okna**; posun o 2 m nad trup, aby ji nezakryla. Při začátku varování je ~120 m vpravo nahoře = vjede do záběru. | „kdy“ i „kam“ v jednom: hráč ťukne, když hvězda doletí k vlaštovce |
| Smyčka | hvězda se točí 1 otáčka/s kolem osy z (on twos). | |
| Zásah | hvězda se v okamžiku stisku **rozpadne na 6 malých čtyřcípých hvězdiček** (⌀ 0,8 m, stejná barva), které se na 4 s výtrysku drží za vlaštovkou v ohonu (kap. 5) a postupně mizí (lineárně jako `burst`). | výtrysk je vidět jako „hvězdný prach“ |
| Minutí | hvězda proletí dál, za 0,6 s zmizí v oparu dole vlevo (alfa k 0). | |
| Reduced motion | hvězda stojí od začátku varování **v bodě setkání** (2 m nad vlaštovkou, posouvá se s ní), ohon nakreslený statický ve směru dráhy; nerotuje. Zásah = hvězda zmizí a hvězdičky stojí za vlaštovkou bez pohybu; minutí = hvězda zmizí. | informace zůstane |
| △ / DC | hvězda: 2 × 8 (líce) + 8 × 2 (bok) = 32 △; ohon 3 × 12 = 36 △ (1 sloučená geometrie s hvězdou, vertexy ohonu přepsat za snímek, 36 vertexů); hvězdičky `InstancedMesh` 6 × 8 = 48 △. **≈ 116 △, 2 DC.** | |

Nový klíč: `PAPIR.companion.star = { day: '#3d4f7a', night: PT.cream, tailAlpha: 0.6 }`.

### 4.2 Kruh
Jen **rajčatový oblouk perfektu 11 px** (120°, podíl ±0,167) s hvězdou perfektu, bez tyrkysové zóny (úspěch = perfekt). Bod průběhu kosočtverec. Zóna už ve varování (plující střed). Štítek „STAR!“ (i18n `event.star`, C2b) grafitová páska jako jinde.

### 4.3 Zpětná vazba
Zásah = dnešní perfekt (hvězda, útržky, hitstop 0,09) + start výtrysku. Minutí = dnešní minutí + **přetržení komba** (kap. 6.3). Hvězda je vzácná: žádný zvláštní záblesk navíc (P4: efekt je odměna, ale jedna věc na obrazovku).

### 4.4 Kontrolní body
- Hvězda protne polohu vlaštovky v `w.c` (test v Node).
- Čtyřcípá, nikdy pěticípá; ve dne `#3d4f7a`, v noci krém; nikdy `tomato` ani `mustard`.
- V šedi: hvězda tmavá skvrna, vlaštovka světlá s grafitovou hranou, nesplynou (hvězda 2 m nad trupem).
- Perf: ≤ 2 DC, ≤ 120 △.

---

## 5. Výtrysk (burst): pára úr. 3, hvězda, Echo

**Mechanika (kód):** `f.burst = {amp, dur, shape, t0, tag}`, `burstLeft(f)` (export `flight.js`) vrací aktuální sílu. Pára: `flat 0,3` na 2 s; hvězda: `linear 1,0 → 0` za 4 s; Echo má vlastní tag. **Výtrysk zvyšuje `f.x`, ne `f.vx`** (`f.x += burstAt · cruise · dt`), takže dnešní rychlostní čáry z `vx` ho **neuvidí**.

| | Hodnota | Proč |
|---|---|---|
| Rychlostní čáry | `fxMap` dostane `vEff = vx + burstLeft · cruise` místo `vx` (stejný vzorec jako `flight.js` ř. ~746). Čáry zůstávají grafitové tužkou 1 px, alfa 0,5, pás ±24 px kolem vlaštovky volný. | bible kap. 7, R11 |
| Tah za vlaštovkou (UI vrstva) | 3 krátké vodorovné **čárky tužkou** (`particles` kind 3) za ocasem, délka `8 + 40 · burstLeft/amp` log. px, rozestup 6 px, on twos. Pára: navíc každých 0,25 s jeden krémový obláček ⌀ 6 px za ocasem (2D, alfa 0,5). Hvězda: hvězdičky ze 4.1 (3D). | „rychleji“ čitelné i bez 3D; žádná nová barva |
| Konec | výtrysk dojde bez efektu (linear dojede k 0, flat skončí: čárky zmizí za 0,15 s). | žádné „dobití“ navíc |
| Reduced motion | rychlostní čáry vypnuté (bible), **tah zůstává jako 3 statické čárky**, jejichž délka se zkracuje s `burstLeft` (mění se délka, ne poloha). | informace zůstane |
| Rozpočet | 0 DC (UI vrstva), hvězdičky viz 4.1. | |

**Kontrolní body:** rychlostní čáry reagují na výtrysk (test `fxMap` s `burstLeft`); tah nikdy nezasáhne do pásu ±24 px před nosem; v reduced motion čárky stojí.

---

## 6. Kombo: Crowd Chain a Chimes (dřív On Air)

**Mechanika (kód):** `f.combo` roste: úspěch +1, perfekt +2, `partial` +1, hvězda +2; minutí = 0. Bonus `min(combo, max) · step`; základ `max 3`, Crowd Chain úr. 1–3 `max 4 / 5 / 5` (`atlas.chain`). Chimes (`atlas.onAir`): bonus β, když `combo ≥ 3`.

### 6.1 Papírový řetěz (UI vrstva, roh vpravo nahoře)
**Proč řetěz:** dětský papírový řetěz z proužků je přesně „Crowd Chain“ v papírovém světě (P2), jeho délka je strop komba, takže **úroveň bonusu je vidět jako delší řetěz** (hráč pozná, co si koupil).

| | Hodnota |
|---|---|
| Kde | UI vrstva, vpravo nahoře **pod štítkem vzdálenosti** (bible kap. 6 bod 5: nic vlevo nahoře, pás letu volný). Kotva se předá z `ui.js` (obdélník `#hud-dist` v CSS px) jako `plan.ui.comboAnchor`; bez kotvy x = 640 − 12, y = 40 log. px. Nikdy blíž než 60 px od vlaštovky (na telefonu na šířku vlaštovka letí vlevo, px 148/640). |
| Tvar | vodorovný řetěz **očka = papírové kroužky** (elipsa 10 × 7 log. px, tah 2,5 px), každé další očko přes předchozí (překryv 3 px). Počet oček = `comboSpec.max` (3–5). |
| Stav | vyplněné očko (`teal`, tah 2,5 px) = jeden bod komba do stropu; prázdné očko čárkované `miss` 1,5 px. **Číslo vždy:** vlevo od řetězu `×N` písmem `--display` 11 px `graphite` na krémovém štítku (stav ne jen barvou). Nad stropem jen číslo roste. |
| Růst | nové očko „zacvakne“: 0,15 s z měřítka 1,3 → 1 (reduced: bez měřítka). |
| Přetržení (minutí) | vyplněná očka se rozpadnou na útržky `teal` + krém (`particles` kind 2), padají 0,4 s; reduced: očka zmizí, číslo `×0`. Bez hitstopu. |
| Viditelnost | řetěz je vidět jen za letu a jen když `combo ≥ 1` nebo hráč vlastní Crowd Chain; po dopadu zmizí s HUD. |
| Čtečky | text komba do `aria-live="polite"` v HUD (DOM, `ui.js`, vlastník C2b), jen při změně o ≥ 1 a nejvýš 1× za 2 s. |
| Rozpočet | 0 DC, canvas. |

Nový klíč `PAPIR.combo = { link: PAPER_ROLE.success, empty: PT.miss, text: PT.graphite, tag: PT.cream }` (jen odkazy na role).

### 6.2 Chimes (β při kombu ≥ 3)
- Když je Chimes ve výbavě a `combo ≥ 3`, na konci řetězu visí **papírový zvoneček**: lichoběžník 9 × 10 log. px `PT.kraftDark` se světlým řezem `PT.cream` 1 px dole a srdcem `#3d4f7a` ⌀ 2 px. Při dosažení 3 se zhoupne ±15° (2 kmity, 2 Hz) a ozve se zvonkohra (audio-designer). Pod 3 zvoneček nevisí.
- Reduced motion: zvoneček visí bez houpání.
- Proč kraft, ne hořčice: hořčicová jen hodnota (mince); Chimes je bonus k letu, ne mince.

### 6.3 Kontrolní body
- Počet oček = `comboSpec.max` podle úrovně Crowd Chain (test v Node: `drawCombo` s falešným ctx kreslí 3 / 4 / 5 oček).
- Číslo `×N` je vždy nakreslené (stav ne jen barvou).
- Na 375 × 667 a 932 × 430 řetěz nezakrývá vlaštovku ani kruh QTE (snímek).

---

## 7. Co znovu použít z existujícího

| Existující | Kde | Pro co |
|---|---|---|
| Ventilace + umístění „kde bude vlaštovka ve středu“ | `companion3d.js` (`vent`, `ventX`) | pára (kap. 1); stejný vzorec pro sloup termiky, lampion i hvězdu (`X + vx · (čas − t)`) |
| Instancovaný pool obláčků a `hideAll` | `companion3d.js` | obláčky páry, útržky termiky, hvězdičky (jen jiná geometrie: osmiúhelník, obdélníček, čtyřcíp) |
| Holub: přílet/držení/odlet z `life.companion` (čistá funkce) | `life.js` ř. 467 | vzor pro čisté funkce poloh nových objektů (`companion` rozšířit o `steam`, `thermal`, `drone`, `star`; vrací offsety v m, testovatelné v Node) |
| Proužky poryvu `gustStrips` | `fx-map.js`, `ui-layer.js` | beze změny pro poryv; pro novou páru ne (jiná událost, jiný tvar) |
| Kruh, mezikruží, hvězda, bod `square/dot/diamond` | `ui-layer.drawQte`, `events-view.EVENT_VIEWS` | všechny nové kruhy; přidat pecky, zarážky, `half` stopu, zóny z `e.w` |
| Popupy, útržky, hitstop | `juice.js`, `fx-map.js` | všechna hodnocení; nové jen `half`/`partial` bez hitstopu |
| Papírový kouř H5 (návrh) | `03-art.md` kap. 3.3 | tvar obláčku páry (osmiúhelník, krém, alfa ≤ 0,6) |
| Lampiony čtvrti 4 `CARDS[3].lantern` | `palette.js` | barva lampionu a těla termiky večer |

## 8. Souhrn rozpočtu a kontrol pro art review a perf

| Událost | △ max | DC navíc max | Nové klíče palety |
|---|---|---|---|
| Pára | 120 | 4 | (žádné; oprava `steamMat`) |
| Termika | 80 | 2 | `companion.thermal`, `qte.half` |
| Sky Lantern (2 ks, čtvrť 4 se září) | 160 | 2 | `companion.lantern` |
| Hvězda + hvězdičky výtrysku | 120 | 2 | `companion.star` |
| Výtrysk, kombo, Chimes | 0 | 0 | `combo` |

Najednou je aktivní jedna událost (hvězdičky výtrysku mohou doběhnout souběžně s další událostí): **strop +4 DC a +400 △**, scéna dál ≤ 120 DC. Měřit `perf-check` (`__r3d.bench`, viditelné okno) během každé události ve čtvrtích 1 a 4.

**Art review (skill `art-review`)** na 375 × 667, 932 × 430, 1280 × 800, pro každou událost varování, interakce, zásah, minutí, ve čtvrti 1 a 4 (lampion a hvězda i ve 2 a 3):
1. Šeď 25 %: vlaštovka první, kruh druhý, objekt události třetí.
2. Nic bílého s grafitem v pásu letu; žádná role na 3D objektu; lampion svítí jen ve čtvrti 4.
3. Kruh na telefonu nezasahuje do vlaštovky (vnitřní hrana ≥ 20 CSS px od středu).
4. Pára a kouř ≤ ⅓ vlaštovky, alfa ≤ 0,6.
5. Reduced motion (`prefers-reduced-motion`): nic se nehýbe, výsledek čitelný.
6. Blikání ≤ 3 Hz (čárkované varování 1,9 Hz, puls páry ≤ 2,2 Hz).

---

## 9. BLOCKED (rozhodnutí uživatele)

**BLOCKED 1: Ventilace s párou dnes patří poryvu, nově by patřila páře.** Ve hře se dnes u poryvu („GUST! Tap“) objeví na střeše **šedá ventilace, ze které stoupá pára** (`companion3d.js`), a kolem vlaštovky krémové proužky větru. Nová událost Steam Hop („pára, ťukni dvakrát“) potřebuje přesně tuhle ventilaci. Kdyby ji měly obě, hráč by viděl stejný objekt a jednou by měl ťuknout jednou, jindy dvakrát. Možnosti:
(a) **ventilace jen u páry, poryv jen papírové proužky větru** (tak to popisuje bible kap. 7: „poryv = zvlněné krémové proužky“); 
(b) obojí s ventilací, pára se liší jen dvěma výtrysky; 
(c) pára z jiného zdroje (komín) a poryv si ventilaci nechá.
**Doporučuji (a):** jeden objekt = jedna událost, a poryv tím odpovídá bibli. Obrázek dnešního poryvu: `research/design/img/papir/desktop-udalost-qte.jpg` (proužky), ventilace je vidět ve hře při poryvu.

**BLOCKED 2: Větší kruh QTE na telefonu i pro poryv a holuba.** Na telefonu na výšku má kruh dnes poloměr jen ~17 px a jeho krémový lem leží přes vlaštovku (ta má ~24 px). Nové události dostanou kruh nejméně 30 px (kap. 0.1, tabulka). Možnosti:
(a) **stejný větší kruh pro všechny události, i poryv a holuba** (na desktopu beze změny, 60 px); 
(b) větší jen nové události; 
(c) nechat všechny malé.
**Doporučuji (a):** jednotný kruh a vlaštovka uvnitř volná (bible P1, kap. 11 „střed zůstává volný“). Vzhled na skutečném telefonu je NOT ASSESSED, ověří art review po C2a.
