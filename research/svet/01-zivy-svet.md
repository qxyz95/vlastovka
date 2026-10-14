> **ZASTARALÉ (15. 10. 2026):** vizuální stránka (komiksové město, tuš, půltón, neonová nálada, „barevná cesta za sluncem“ v původní podobě); platí `research/design/05-styl-papir.md` a `research/plan-hratelnost/03-art.md`. Nápady na život města, postavy a humor platí jako podklad. Nečíst jako zadání.

# Živý svět: návrh pro 3D komiksové město

Návrhový dokument, 14. 10. 2026. Jen návrh, kód se nemění. Navazuje na `research/bonusy/08-navrh-kolo2.md` (dále **08**), rozhodnutí `research/bonusy/06-rozhodnuti.md` (**06**), zásady P1–P15 z `research/kb/README.md` a na 3D prototyp (`archiv/prototype-3d.html`, `archiv/prototype/3d/`). Herní texty jsou anglicky, výklad česky. Štítky jako v KB: **V** opřeno o výzkum, **H** praxe nebo norma, **N** náš návrh nebo odhad k ověření.

**Zadání uživatele:** „Chceme mít živý a barevný svět, kde bude zábava se pohybovat a létat. Většinu hry hráč pouze sleduje obrazovku a prohlíží si animace.“ Směr: 3D město ve stylu komiksu. Techniky z `src/themes-verse.js` (tuš, půltón, posterizace, „on twos“, misregistrace) slouží jako inspirace.

## Obsah
0. Shrnutí na jednu stranu
1. Principy živého světa pro hru, kterou hráč hlavně sleduje
2. Barvy a nálada podle čtvrti
3. Katalog 16 míst
4. Kamera jako režisér
5. Postavy v pozadí a dav
6. Rozpočet výkonu a obsahu
7. Dopad na progresi (návrhy k rozhodnutí)
8. Plán realizace po fázích
9. Otevřené otázky pro uživatele

---

## 0. Shrnutí na jednu stranu

- **Svět reaguje na hráče, ne jen hraje sám pro sebe.** Každé místo má jednu hlavní scénku čitelnou do 1 s a tři úrovně reakce: na průlet (drobná, vždy), na perfektní zásah (výrazná) a na dopad poblíž (pointa s vtipem). Síla reakce roste s kvalitou výkonu (P1). Oslava za nic není.
- **Rytmus „nádech a výdech“.** Události QTE trvají ~2–3 s a mezi nimi je 3–7 s klidu. V klidu svět „hraje“ (gagy, vyhlídka kamery). Během varování a okna QTE svět „zadrží dech“: žádný nový gag, pozadí o stupeň tlumenější, kamera se nehýbe.
- **Hierarchie čitelnosti je pevná:** 1. vlaštovka a kruh QTE, 2. texty události, 3. reakce postav na hráče, 4. hlavní scénka místa, 5. drobné animace, 6. nebe a panorama. Vlaštovka je jediný papírově bílý objekt s nejsilnější tuší ve scéně.
- **Barvy vyprávějí cestu za sluncem:** Violet Suburbs za fialového soumraku → Moon Docks v měsíční noci s mrholením → Red Horizon, kde vlaštovka po výstupu z doků **dohoní slunce a zažije druhý západ** → Neon Core v plné neonové noci → finále „Delivered.“ za úsvitu. Nálada se mění plynule po 16 klíčových snímcích (jeden na místo), ne skokem na hranici čtvrti.
- **Čtvrti se navrhují pro rychlost, kterou v nich hráč poprvé letí.** Předměstí vidí hráč poprvé pomalu (místo je na obrazovce 7–22 s), takže unese jemné mikropříběhy. Neon Core vidí poprvé až při ~130–160 m/s (místo na ~2–3 s), takže potřebuje obří, tučné tvary a jedno silné gesto.
- **Kamera je režisér s jediným pravidlem:** nikdy nestříhá a nikdy se nehýbe během okna QTE. Velké záběry (nové místo, hranice čtvrti, dopad) se odehrávají jen v klidu nebo po dopadu.
- **Hodně života levně:** instancovaný dav, jehož hlavy sledují vlaštovku přes uniformu ve vertex shaderu, „mexická vlna“ jako fáze podle vzdálenosti od vlaštovky, siluety s jedním akcentem, animace 12 fps (on twos). Rozpočet je velkorysý: dnešní prototyp kreslí ~1 000 trojúhelníků na místo, cíl je 20–40 tisíc.
- **K rozhodnutí (§7):** zrychlení klouzání 1,4× vypnout na místech, kde hráč ještě nebyl (první návštěva „naplno“); pohlednice letu jako komiksový strip ve výsledku; vyhlídkový let v Encore. Cíl ~30 s posledních hodů z 06 se nemění.

---

## 1. Principy živého světa pro hru, kterou hráč hlavně sleduje

### 1.1 Co hráč za letu dělá
Let trvá 15 s na začátku a ~30 s skutečného času na konci (08 §2.4). Událostí je za let 5–10 (`events.js`: první v 1,5 s, další po 3 s, pak po 4–7 s; varování 0,8 s, pruh 1,2 s, potom efekt). Asi **60–70 % letu hráč nic nemačká**. Ten čas je hlavní obsah hry a musí být „k dívání“, ne čekání.

### 1.2 Co udrží pozornost (P1, P2, P3, N)
1. **Zvědavost na nejbližší věc (P3, V).** Před vlaštovkou je vždy vidět silueta dalšího místa (vysoký orientační bod na obzoru) a na hraně obrazovky začínající scénka. Loewenstein: zvědavost táhne, jen když je odpověď blízko. Proto ne mapa celé trasy, ale „co je za tím kopcem“.
2. **Svět, který si hráče všimne (P1, V/N).** Nejsilnější prvek celého návrhu. Postavy otáčejí hlavy za vlaštovkou, dav fandí kombu, maják na chvilku posvítí za ní. Reakce je zpětná vazba na výkon: průlet = drobnost, úspěch = gesto, perfekt = malá oslava, minutí = vtip, ne lítost. Kao 2024: efekty oddělené od úspěchu motivaci snižují, efekty vázané na úspěch ji zvyšují.
3. **Juice s mírou (P2, V).** Svět je bohatý, ale efekty kolem vlaštovky zůstávají střídmé. Juice zlepšuje dojem, ne kompetenci, a má optimum. Bohatost patří do pozadí, kde neruší čtení QTE.
4. **Obměna proti habituaci (P3, 08 N6).** Stejné místo hráč přeletí desítkykrát. Každé místo má **3–5 drobných animací** (běží vždy) a **2–3 vzácné gagy** (jeden za 5–10 hodů, 08 §8.3). Gag se nesmí opakovat dvakrát po sobě a vybírá ho vlastní RNG proud ze seedu hodu (deterministické, ale mimo RNG fyziky).
5. **Pravdivost (P10).** Svět nikdy nepředstírá „skoro!“ Reakce na těsný dopad odpovídá skutečné vzdálenosti („37 m short of Wind Ridge“).

### 1.3 Rytmus letu: nádech a výdech
Doporučená „partitura“ pozdního hodu (~30 s, tempo π ≈ 10):

| Čas | Co se děje | Svět | Kamera |
|---|---|---|---|
| 0–1,5 s | výhoz z okna Dílny | dítě v okně, kočka na střeše | sleduje, mírný náklon za výhozem |
| 1,5–4 s | 1. událost | zadrží dech | stojí |
| 4–8 s | klid (zrychlení 1,4×) | gag v pozadí, hranice místa bliká názvem | vyhlídka (§4.4) |
| ~8 s | **hranice čtvrti** (velký moment) | neonový název čtvrti, změna nálady | oddálení 1,5 s, jen pokud zrovna neběží událost |
| 8–25 s | střídání událostí a klidu | reakce postav na zásahy, dav fandí kombu | sledování, krátké vyhlídky |
| 25–30 s | klesání, poslední událost | místo dopadu se „připravuje“ (postava vzhlédne) | přiblížení k zemi |
| dopad + 0,85 s | pointa | reakce na dopad, vtip (08 §8.1) | krátký záběr na reakci, tap přeskočí |

Pravidla rytmu (N):
- **Událost má vždy přednost.** Gag, záběr kamery i velká animace se odloží, když do začátku události zbývá < 1 s nebo událost běží (stejně jako dnes `decorations.js`, který nový prvek nespustí při `activeEvent`).
- **Jedna věc naráz.** V klidové chvíli smí začít nejvýš jeden gag. Hranice čtvrti vytlačí gag.
- **Kontrast tempa.** Klidné klouzání má jemný pohyb (vítr, dav, světla). Velké pohyby (jeřáby, vlak, vzducholoď) jsou časované do klidných oken, ne náhodně.

### 1.4 Hierarchie čitelnosti
Pořadí, které se nikdy neporuší (H/N):

| Úroveň | Prvek | Jak se drží nahoře |
|---|---|---|
| 1 | **vlaštovka** | jediný papírově bílý objekt (`#fffaf0`), nejsilnější tuš (2,6 px a víc), misregistrace jen u ní (jako `verse`), nic ji nezakryje: v popředí (z > 0) jen nízké lampy (už v prototypu) |
| 1 | **kruh QTE a jeho zóna** | kreslí se nad post-processem, mimo půltón a posterizaci, vlastní kontrast ≥ 3 : 1 (07 A3), informace i tvarem, ne jen barvou |
| 2 | text události („! GET READY“, „↓ TAP“) | tmavý štítek, nad scénou |
| 3 | reakce postav na hráče | jen v okolí trasy, až ve fázi `effect` (po vyhodnocení), nikdy během okna |
| 4 | hlavní scénka místa | střední vrstva, sytost a kontrast o stupeň nižší než vlaštovka |
| 5 | drobné animace | nízký kontrast, malé plochy |
| 6 | nebe, panorama | posterizované pásy, mlha, nejnižší kontrast |

Konkrétní pravidla:
- **Koridor letu:** pás ±8 m kolem výšky vlaštovky na její hloubce (z = 0) je bez objektů. Postavy a dekorace stojí za ním nebo pod ním.
- **Jas:** velké plochy pozadí mají relativní jas nejvýš ~70 % jasu vlaštovky. Sytý neon jen na malých plochách (cedule, okna), ne za vlaštovkou v jejím okolí.
- **Během varování a okna:** pozadí se ztlumí o ~15 % (jas i sytost, plynule 0,2 s), drobné animace poběží dál, ale nezačne nic nového. Po vyhodnocení se svět „nadechne“ a reaguje.
- **Částice zásahu** (`juice.js`) mají barvu čtvrti, ale tvar a jas vždy výraznější než efekty světa.

### 1.5 Přístupnost (P15, H)
- **Blikání (WCAG 2.3.1, úroveň A):** nejvýš 3 záblesky za sekundu na jakékoli ploše větší než ~1/10 obrazovky; žádné velké červené záblesky. Blikající cedule a majáky jsou malé a pomalé (≤ 1 Hz, dnešní `blink` má periody 1–2,2 s, to je v pořádku). Bouřka s blesky v docích **ne**. Ohňostroj jen jako „rozkvetlé“ tvary s pomalým náběhem, ne bílý záblesk přes nebe. Rotující světlo majáku je měkký kužel s nízkou alfou, ne bílá plocha přes celou obrazovku.
- **Reduced motion (WCAG 2.3.3, MDN):** ve 3D je paralaxa vestavěná (perspektiva), takže nestačí zastavit animace. Při `prefers-reduced-motion` nebo v nastavení **Calm camera**:
  - žádné oddalování a přibližování, žádné záběry, žádný otřes (už dnes),
  - zrychlení klouzání vypnuto (06, 08 §2.5),
  - hloubka zploštělá: vzdálené vrstvy blíž k rovině letu nebo ortografická kamera, takže pozadí ubíhá jedním tempem,
  - animace prostředí zpomalené na ~25 % (ne úplně zamrzlé: svět má zůstat „živý“, ale bez velkých pohybů); velké pohyblivé plochy (vlak, vzducholoď) stojí,
  - reakce postav zůstanou jako změna pózy (on twos, bez pohybu přes obrazovku).
- **Vlastní přepínače:** Calm camera, Screen shake, Flashing lights (cedule nesvítí přerušovaně, jen svítí), Speed lines. Nejen systémová preference (07 A6).
- **Kinetóza:** rotace kamery kolem vlaštovky max ~3°, žádný „dutch“ náklon, pohyby kamery vždy s plynulým náběhem (`damp` z `motion.js`).
- **Zvuk nenese jedinou informaci (P11).** Všechny reakce jsou vidět.

---

## 2. Barvy a nálada podle čtvrti

### 2.1 Princip: cesta za sluncem
Hod je vždy večer, ale každá čtvrť je jiná hodina. Hráč letí na západ (+x) a cestou zažije:
1. **Violet Suburbs:** slunce právě zapadlo, fialový soumrak, rozsvěcují se okna.
2. **Moon Docks:** modrá noc, velký měsíc nad zálivem, mrholení a mlha nad vodou (`atmosphereAt` rain .85).
3. **Red Horizon:** krajina stoupá do hor a z výšky je **slunce znovu vidět nad obzorem** (skutečný jev: s výškou se obzor posouvá). Druhý západ slunce je velký moment přechodu z doků. Během čtvrti slunce zapadá podruhé: pole zlatá, hřeben při dotyku slunce s obzorem, sedlo v růžovém alpském žáru, observatoř už pod hvězdami.
4. **Neon Core:** plná noc, světlo dávají jen neony, lehký déšť (rain .45) kvůli odleskům.
5. **Finále:** po přeletu 4 876 m za Rooftop Harbor svítá. „Delivered.“ za úsvitu (08 §8.4).

Je to srozumitelný oblouk bez příběhu (06: příběh ne, Atlas stačí) a z barev je cítit postup.

### 2.2 Palety
Výchozí návrh pro toon materiál (3 tóny rampy) a půltónové stíny. Hodnoty jsou startovní, ladí se v prototypu.

| | Violet Suburbs | Moon Docks | Red Horizon | Neon Core |
|---|---|---|---|---|
| Denní doba | fialový soumrak | měsíční noc | druhý západ slunce → šero | plná noc |
| Nebe nahoře → obzor | `#2a1f5c` → `#6b3fa0` → `#ff9ec4` → `#ffc58a` | `#0d1b3d` → `#1e4f7a` → `#5f8fb8` | `#3b1f6e` → `#e8573a` → `#ffc35a` | `#0b0a20` → `#283a8f` → `#2aa99c` → `#d2ee48` (pás nad městem) |
| Hlavní světlo | nízké teplé z obzoru `#ffb38a`, slabé | měsíc studený `#cfe3ff` shora zleva, ostré stíny | slunce `#ff8a3d` přímo před vlaštovkou, dlouhé stíny, protisvětlo | žádné dominantní, světlo z neonů |
| Doplňkové / obrys | nebe `#8a7cff`, obrys `#ff6fb5` | modrá `#3a5f9a`, sodíkové lampy `#ffb347` | fialová stínová `#6a3a74` (doplněk k oranžové) | magenta `#ff4f9e` a azurová `#5cf2ff` |
| Budovy (tělo / stín / akcent) | levandulová `#8e6bbf` / `#4a3477` / korálové střechy `#ff7a8a` | `#215a8c` / `#0f2b4c` / kontejnery v primárních barvách `#e8574a`, `#ffd23f`, `#2fb8b0` | pole `#e8b04a`, plodiny `#c98a2e`, skály `#9a63db` / `#4a2f8a` | indigo `#3a1f5c` / `#1d1233` / neon `#ff4f9e`, `#5cf2ff`, `#ffe14d` |
| Okna | teplá `#ffd27a`, 40 % svítí | 25 % svítí, sodíkově oranžová | jen samoty a observatoř | 75 % svítí, barevná |
| Mlha | `#6a4a9a`, řídká | `#2a4a6e`, hustá u vody | oranžový opar `#c8603a` → fialový | `#1a1240`, tenká, neon v ní září |
| Počasí | jasno, světlušky, prádlo ve větru | mrholení, kaluže, mlhové pásy, odlesky měsíce na vodě | sucho, prach a pyl ve světle, sníh na sedle | lehký déšť, mokré ulice s odlesky neonů |
| Stopa vlaštovky | růžová | azurová | zlatá | magenta (mění se na hranici čtvrti, 08 §8.2) |

Vazba na dnešní kód: `VERSE` v `themes-verse.js` má palety po čtvrtích (Suburbs tam vychází jako tyrkysové ráno). Pro 3D navrhuji posunout Suburbs do soumraku, aby oblouk „za sluncem“ fungoval. Docks, Horizon a Core z `VERSE` sedí skoro beze změny.

### 2.3 Plynulé přechody za letu
- **`moodAt(distance)`** jako čistá funkce (vedle `atmosphereAt` v `scenes.js`, testovatelná, bez three.js): 16 klíčových snímků nálady (jeden na místo), mezi nimi `smooth` podle polohy. Vrací barvy nebe, směr, barvu a sílu hlavního světla, barvy hemisféry, mlhu (barva, near, far), podíl svítících oken, sílu neonů, déšť, hustotu částic (světlušky, pyl, sníh).
- **Hranice čtvrti není skok barvy.** Dnešní `districtAt` míchá jen v posledních 152 m (při 160 m/s < 1 s, to je ve 3D trhnutí). Barva se má posouvat celým místem, hranici čtvrti nese **událost** (neonový název, změna stopy, změna počasí), ne střih barev.
- **Počasí s náběhem:** déšť v docích začíná mrholením nad skladišti, sílí u jeřábů, u majáku se mlha zvedá a odhalí druhé slunce na obzoru. Přechod z Core do finále: déšť ustane, mraky se roztrhnou.
- **Stabilní při rychlosti:** při 220 m/s se vše mění rychle, proto se mění jen nízkofrekvenční parametry (barva nebe, mlha), ne kontrast kolem vlaštovky.

---

## 3. Katalog 16 míst

### 3.1 Jak číst katalog
Každé místo má:
- **Hlavní scénku:** jeden orientační bod nebo děj, čitelný do 1 s. Při rychlém průletu zbude jen ten.
- **Drobné animace (3–5):** běží vždy, nízký kontrast, v klidu i během událostí.
- **Postavy a zvířata.**
- **Reakce na vlaštovku:** *průlet* (vždy, drobná), *perfekt* (výrazná, až po vyhodnocení), *dopad poblíž* (pointa, často s hláškou z 08 §8.1).
- **Vazbu na Atlas a události z 08** (bonus místa, druh holuba a poryvu čtvrti podle 08 §7.2–7.3).
- **Vtip nebo překvapení:** vzácný gag (1 za 5–10 hodů) bez odměny (08 §8.3).

Kolik času má hráč na místo **při první návštěvě** (bod v rovině letu, šířka záběru podle `tempoZoom`, se zrychlením 1,4× v klidu):

| Čtvrť | Rychlost při první návštěvě | Záběr | Bod na obrazovce | Co to znamená pro návrh |
|---|---|---|---|---|
| Violet Suburbs | 14–47 m/s | 305–328 m | 22 → 7 s | mikropříběhy, detaily, jemné gesta |
| Moon Docks | 47–81 m/s | 328–359 m | 7 → 3,2 s | 1 velký děj + 2–3 detaily |
| Red Horizon | 81–120 m/s | 359–396 m | 4,4 → 2,4 s | krajinné siluety, světlo, velká zvířata a stroje |
| Neon Core | 120–160 m/s | 396–436 m | 3,3 → 1,9 s | obří tvary, obrazovky, jedno silné gesto |

Vzdálené vrstvy (z = −110 a −380 m) ubíhají při úzkém FOV 20° jen ~1,2–1,6× pomaleji, paralaxa je tedy slabá. **Proto mají být orientační body vysoké** (vidět na obzoru o místo dřív), ne jen vzdálené. Starší místa hráč později přelétá rychleji: návrh každého místa má dvě vrstvy, „detail pro první návštěvu“ a „silueta pro průlet“.

### 3.2 Violet Suburbs (fialový soumrak)
Postava čtvrti: **Bolts**, vysloužilý doručovací robot. Holub **Cyber Pigeon** (s bagetou), poryv **Market Vent**.

#### 1. Workshop & First Roofs · Atlas **Glider** (na 100 m)
- **Hlavní scénka:** okno Dílny s neonem PAPER LAB, v něm dítě, které hodilo vlaštovku, a za ním police s papíry. Po výhozu se dítě vykloní a sleduje let.
- **Drobné animace:** prádlo na šňůře mezi střechami (už v `route-render.js`), kouř z komínů nakloněný větrem hodu, natáčející se satelitní talíř, holubi na drátech, soused zalévá květiny na balkoně.
- **Postavy a zvířata:** dítě (hráčův „avatar“, jen silueta), **kočka na střeše Dílny**, soused s konví, holubi.
- **Reakce:** *průlet:* trička na šňůře se otočí za vlaštovkou v závanu. *Perfekt:* kočka vyskočí a máchne tlapkou do prázdna. *Dopad poblíž:* soused na balkoně jí nudle a vlaštovka mu přistane v misce („Landed in a noodle bowl. The noodles were fine.“), nebo na spící kočce („Parked on a sleeping cat. The cat allowed it.“).
- **Vazba:** na 100 m komín s praporkem „100“. Při odemčení Glideru se v okně Dílny objeví druhý model připíchnutý na nástěnce. Crane Lift (A06) přidá do této scény hák jeřábu, na kterém dítě stojí.
- **Gag:** z protějšího okna vyletí cizí papírová vlaštovka a 2 s závodí vedle (08 §8.3). Hází ji „soupeř“ z protějšího domu, po chvíli spadne do okapu a z okna se ozve komiksové „AW!“.

#### 2. Market under the Antennas · Atlas **Crowd Chain**
- **Hlavní scénka:** noční tržnice pod lesem antén, šňůry lampionů, plno lidí mezi stánky. Nahoře na střeše zametá **Bolts**.
- **Drobné animace:** pára z knedlíkových košů (to je i zdroj poryvu Market Vent), lampiony se kývají a střídavě svítí (už dnes), prodavač natahuje nudle vysokým obloukem, dítě s balónkem, vrány na anténách.
- **Postavy:** dav (instancovaný, §5), Bolts, prodavači, dítě s balónkem.
- **Reakce:** *průlet:* hlavy davu se otáčejí za vlaštovkou jako slunečnice. *Kombo:* **dav fandí podle kroku komba** (Crowd Chain viditelně): ×1 tleská pár lidí, ×2 zvednou lampiony, ×3 projede tržnicí mexická vlna, ×4 a víc zvednou ruce všichni a nad tržnicí vzlétnou papírové konfety. *Perfekt:* šňůra petard „rozkvete“ komiksovými hvězdičkami (bez záblesku). *Dopad poblíž:* vlaštovka spadne do koše na knedlíky, prodavač ji zapaří a podá zpátky: „Steamed. Lightly.“
- **Vazba:** Crowd Chain (A02) mění sílu jásotu. Bolts řekne první hlášku z 08 §7.1. Na jeho displeji občas běží „LOG: WEATHER“ (narážka na hlášku 2).
- **Gag:** Cyber Pigeon ukradne ze stánku bagetu a odletí s ní. Prodavač mu hrozí pěstí. Je to ten holub, se kterým se hráč později potká v události.

#### 3. Gardens at the Edge · Atlas **Pinwheel** · otevírá Kraft Paper (06)
- **Hlavní scénka:** zahrádkářská kolonie plná **větrníků, které se točí podle větru tohoto hodu**. Při zadním větru se točí rychle, při protivětru pozpátku, v klidu stojí. Svět tak ukazuje vítr z 08 Z3 bez čísla.
- **Drobné animace:** světlušky nad živými ploty (už dnes), postřikovač s obloukem vody, svítící skleník, ježek přechází cestičku, strašák se kývá ve větru.
- **Postavy a zvířata:** děda v lehátku s rádiem, ježek, zahradní trpaslíci, žáby v jezírku.
- **Reakce:** *průlet:* větrníky pod vlaštovkou se roztočí ve vlně, jak jimi projde závan. *Perfekt:* odkvetlá pampeliška vybuchne chmýřím, které chvíli letí za vlaštovkou. *Dopad poblíž:* vlaštovka přistane strašákovi na klobouku. Strašák kývne. (Je to děda.)
- **Vazba:** Pinwheel (A03) je ve scéně doslova. Thermal v předměstí má vzhled **Rooftop Heat** z rozpálené střechy skleníku, Steam Hop vzhled **Kettle Chimney**. Kůlna s balíky hnědého papíru „KRAFT“ je pohlednice pro odemčení Kraft Paper.
- **Gag:** zahradní trpaslík otáčí hlavou za vlaštovkou. Jednou za čas jeden trpaslík chybí a v dalším hodu stojí o záhon dál.

#### 4. Railway to the River · Atlas **Steam Hop** · hranice do Moon Docks
- **Hlavní scénka:** vlak (dnes každých 11 s) s lokomotivou, která **puchá v rytmu Steam Hop** („chug–chug“, rozestup 0,45–0,6 s). Ještě před odemčením tak hráč vidí rytmus budoucí události (diegetická předzvěst).
- **Drobné animace:** návěstidlo (už dnes), závory přejezdu s čekajícím autem, cestující v oknech vagonů, nádražní hodiny, pes běží s vlakem.
- **Postavy a zvířata:** strojvedoucí, cestující, pes, výpravčí s plácačkou.
- **Reakce:** *průlet:* cestující se přimáčknou na okna a ukazují. *Perfekt:* strojvedoucí zatáhne za píšťalu, komiksové „TOOT!“ a obláček ve tvaru srdce. *Dopad poblíž:* vlaštovka přistane na střeše vagonu a odjede s ním: „Took the 21:14.“
- **Vazba:** Steam Hop (A04). Bolts hláška 3 („Past the railway already?“). **Velký moment hranice čtvrti** (§4.3): vlak přejede most do doků a kamera se oddálí, na vodárně se rozsvítí neon MOON DOCKS.
- **Gag:** nádražní hodiny ukazují pořád 21:14. Jednou za čas se ručička posune a hodiny cinknou.

### 3.3 Moon Docks (měsíční noc, mrholení)
Postava čtvrti: **Marge**, jeřábnice s termoskou. Holub **Courier Gull** (s rybou), poryv **Funnel Draft**.

#### 5. Warehouses by the Water · Atlas **Packing Tape**
- **Hlavní scénka:** řada skladů s rolovacími vraty (dnes už se otvírají), uvnitř vysokozdvižné vozíky přehazují bedny. Jedna obří bedna nese nápis FRAGILE.
- **Drobné animace:** oranžové majáčky vozíků (pomalé, ≤ 1 Hz), kruhy v kalužích od mrholení, dešťová voda stéká z vlnitých střech, dopravní pás s krabicemi, odraz měsíce v kaluži.
- **Postavy a zvířata:** skladníci v pláštěnkách, jeden s deštníkem, kočka na bednách.
- **Reakce:** *průlet:* skladníkovi se v závanu obrátí deštník naruby. *Perfekt:* skladníci zvednou tabulky s hodnocením „9.5“, „9.8“ a jeden pro jistotu „10“. *Minutí s Packing Tape:* na střeše skladu se otočí obří odvíječ pásky, komiksové „RRRIP“ a „Taped.“ *Dopad poblíž:* do bedny FRAGILE („Into a crate marked FRAGILE. Ironic.“), bedna dostane razítko RETURN TO SENDER.
- **Vazba:** Packing Tape (A05). Funnel Draft z komínů kotvících lodí.
- **Gag:** jedna bedna se sama posune. Za chvíli z ní vykoukne kočka.

#### 6. Crane Forest · Atlas **Crane Lift**
- **Hlavní scénka:** les jeřábů nad kontejnerovou lodí, uprostřed jeřáb s rozsvícenou kabinou, kde sedí **Marge** s hrnkem čaje (pára z termosky).
- **Drobné animace:** kontejnery se houpou na lanech (dnes už), reflektor přejíždí palubu, racci sedí na kontejnerech, kouř z lodního komína, námořníci kotví lana.
- **Postavy a zvířata:** Marge, námořníci, racci.
- **Reakce:** *průlet:* Marge zvedne hrnek na pozdrav. *Perfekt:* **jeřáby se jeden po druhém ukloní** (výložníky skloní špičky jako řada obrů). *Dopad poblíž:* vlaštovka se zachytí na háku a Marge ji opatrně položí na kontejner: „Mind the hooks, love. They don't mind you.“
- **Vazba:** Crane Lift (A06): po odemčení se Marge objeví i u Dílny a zvedá dítě na háku. Marge hláška 1.
- **Gag:** jeden kontejner má nápis THIS SIDE UP vzhůru nohama.

#### 7. Bridge over the Bay · Atlas **Stone Skip** · otevírá Washi (06)
- **Hlavní scénka:** dlouhý visutý most, po něm proudy předních a zadních světel (už dnes), pod ním otevřená voda s měsíční cestou.
- **Drobné animace:** remorkér táhne loď, rybář pod mostem, ryby vyskakují, světla na lanech mostu postupně naskakují (běžící had, pomalý), mlha se valí přes vozovku.
- **Postavy a zvířata:** rybář, děti na molu, kachna v malé loďce, ryby.
- **Reakce:** *průlet:* řidiči zatroubí (vizuálně komiksové „HONK“), praporky na anténách aut se otočí. *Perfekt:* **ryba vyskočí v oblouku vedle vlaštovky** jako delfín u lodi. *Dopad na vodu:* Stone Skip udělá 1–3 odrazy s kruhy na vodě a děti na molu počítají „ONE! TWO!“ v komiksových bublinách. Bez odrazu vlaštovku chytí rybář: „Caught by a fisherman. Released.“
- **Vazba:** Stone Skip (A07), hranice Washi papíru (pohlednice: japonský papír suší rybář na šňůře).
- **Gag:** kachna v loďce vesluje proti proudu. Pokaždé o kus dál.

#### 8. Lighthouse at the Pier's End · Atlas **Gull Escort** · hranice do Red Horizon
- **Hlavní scénka:** maják na konci mola, měkký kužel světla obchází záliv, v hnízdech pod ochozem racci.
- **Drobné animace:** loďka se kolébá (už dnes), vlny tříští o molo komiksovou pěnou, strážce majáku s dalekohledem, bóje se zvonem, mlha se trhá.
- **Postavy a zvířata:** strážce majáku, racci, tuleň na bóji.
- **Reakce:** *průlet:* **kužel majáku se na 1 s zastaví na vlaštovce** (08 §8.3, tady jako stálá reakce), měkce, bez záblesku. *Perfekt:* racci vzlétnou z hnízd a 2 s letí ve tvaru V za vlaštovkou (předzvěst Gull Escort). *Dopad poblíž:* racek vlaštovku sebere a pustí: „Landed on a seagull. Mutual surprise.“
- **Vazba:** Gull Escort (A08), Marge hláška 3 („Past it, the sea stops being my problem.“). **Hranice čtvrti:** mlha se zvedne a na obzoru je znovu slunce. Druhý západ slunce je největší barevný zlom celé trasy.
- **Gag:** tuleň na bóji tleská ploutvemi, ale jen když hráč minul. (Laskavě, ne posměšně.)

### 3.4 Red Horizon (druhý západ slunce)
Postava čtvrti: **Stella**, astronomka. Holub **Stargazer Pigeon** (s mapou hvězd), poryv **Turbine Wake**.

#### 9. Fields beyond the Bay · Atlas **Momentum**
- **Hlavní scénka:** nekonečné zlaté lány ve slunci proti vlaštovce, přes ně běží vlny větru. Kombajn se světly sklízí řádek.
- **Drobné animace:** plodiny se vlní (už dnes, ve 3D jako shader trávy), větrník na stodole (už dnes), balíky slámy, vrány nad strništěm, zavlažovač s duhou v protisvětle.
- **Postavy a zvířata:** krávy, farmář na traktoru, vrány.
- **Reakce:** *průlet:* **pod vlaštovkou se v obilí rozevře brázda** jako stopa po člunu. S Momentum se brázda prodlužuje a rozšiřuje s každým přeletěným místem, takže zrychlení je vidět v krajině. *Perfekt:* všechny krávy zvednou hlavy naráz („The cows were briefly impressed.“). *Dopad poblíž:* do kupky sena („Landed in a haystack. Still no needle.“).
- **Vazba:** Momentum (A09).
- **Gag:** v poli se jednou objeví kruh ve tvaru papírové vlaštovky. Předzvěst UFO u observatoře.

#### 10. Wind Ridge · Atlas **Thermal**
- **Hlavní scénka:** hřeben s obřími větrnými elektrárnami v protisvětle, slunce se dotýká obzoru. Nad loukou **krouží jestřábi v mihotavém sloupu teplého vzduchu**: termika je vidět dřív, než ji hráč odemkne (08 A10: „co to je?“).
- **Drobné animace:** rotory (už dnes), pomalá světla na gondolách (0,5 Hz), technik na gondole mává, ovce, draci na šňůrách dětí.
- **Postavy a zvířata:** technik, děti s draky, ovce, jestřábi.
- **Reakce:** *průlet:* draci se natočí za vlaštovkou. *Perfekt:* jestřábi v termice se přidají do spirály kolem vlaštovky. *Dopad poblíž:* turbína se zastaví a jednou lopatkou zamává („A wind turbine waved.“).
- **Vazba:** Thermal (A10) jako **Ridge Thermal**, poryv Turbine Wake.
- **Gag:** jedné ovci drak odnese čepici. Čepice pak letí kus vedle vlaštovky.

#### 11. Mountain Saddle · Atlas **Echo** · otevírá Neon Foil (06)
- **Hlavní scénka:** skalnaté sedlo, ze štítu se práší sníh (už dnes), vrcholy v růžovém alpském žáru. Na chatě stojí muž s **alpským rohem**.
- **Drobné animace:** krouživý orel (už dnes), pás mraků (už dnes), kozorožci na skalách, lanovka, malý vodopád.
- **Postavy a zvířata:** hornista, kozorožci, orel, turisté u chaty.
- **Reakce:** *průlet:* kozorožci zvednou hlavy. *Perfekt:* hornista zatroubí a **komiksové „★…★“ se odrazí od protějšího štítu** jako viditelné kruhy zvuku. Přesně to je mechanika Echo (A11): ozvěna perfektu po 0,6 s. *Dopad poblíž:* kozorožec okusí roh vlaštovky: „A goat tasted you. 6/10.“ (nová hláška pro Horizon).
- **Vazba:** Echo (A11). Pohlednice Neon Foil: v trhlině ledovce se leskne fólie. Stella hláška 2. **Vyhlídka:** odsud je poprvé vidět světla vzdálené metropole (příběh místa 12 v `scenes.js`), kamera tu v klidu nabídne nejširší vyhlídku celé trasy (§4.4).
- **Gag:** hornista se jednou nadechne a vyletí mu jen bublina.

#### 12. Observatory above the Valley · Atlas **Shooting Star**
- **Hlavní scénka:** kopule observatoře se otevírá, dalekohled skenuje oblohu (už dnes). Na ochozu **Stella** s deskou poznámek. Nad ní první hvězdy.
- **Drobné animace:** hvězdy se rozsvěcují, jak tmavne, přelety satelitů (pomalé tečky), sova na zábradlí, noční květy se otvírají, padající hvězda (už v `ambient.js`).
- **Postavy a zvířata:** Stella, sova, kočka astronoma.
- **Reakce:** *průlet:* **dalekohled se otočí a sleduje vlaštovku.** *Perfekt:* Stella zvedne ceduli s označením „A4-1“ (vlaštovka jako nová kometa). *Dopad poblíž:* vlaštovka se zasekne v hledáčku dalekohledu: „Statistically, you're a comet.“
- **Vazba:** Shooting Star (A12). Hvězda přilétá nad observatoří. Stella hláška 1 a 3.
- **Gag:** nad kopulí jednou blikne UFO, pomalu, jako tečka, ne záblesk (08 §8.3). Stella: „I didn't see that. Officially.“

### 3.5 Neon Core (plná noc, neon)
Postava čtvrti: **Zippy**, reklamní dron, který by radši byl holub. Holub **Drone Pigeon**, poryv **AC Exhaust**. Celá čtvrť je navržená pro rychlost 120–220 m/s: obří tvary, obrazovky, jedno silné gesto na místo.

#### 13. Gates of the Metropolis · Atlas **Ad Drone** · hranice čtvrti
- **Hlavní scénka:** obří brána s nápisem METROPOLIS (už v prototypu), za ní se kříží reflektory (už ve 2D). Kolem hlídkují drony.
- **Drobné animace:** proudy aut dálnice do města, prapory na bráně (už dnes), maglev projíždí pod obloukem, hologramy nad mýtnými budkami.
- **Postavy:** drony (Zippy mezi nimi), řidiči taxíků.
- **Reakce:** *průlet:* **reflektory chytí vlaštovku jako hvězdu na premiéře** a 1 s ji drží. *Perfekt:* písmena na bráně se rozsvítí jedno po druhém a vznikne WELCOME (sekvence, ne blikání). *Dopad poblíž:* na střeše taxíku („Landed on a taxi. The meter's running.“).
- **Vazba:** Ad Drone (A13), Zippy hláška 1 („BUY NOW! ...Sorry. Reflex. Hi.“). **Hranice Red Horizon → Neon Core** (§4.3): poslední paprsek slunce zmizí za obzorem přesně ve chvíli, kdy brána naskočí neonem.
- **Gag:** Zippy proletí s praporkem BUY SOCKS, zastydí se a praporek otočí na rubovou stranu: „sorry“.

#### 14. Sky Terraces · Atlas **Paper Crane**
- **Hlavní scénka:** terasy visutých zahrad s vodopády (už dnes), na šňůrách visí stovky **origami jeřábků**, kteří se točí ve větru.
- **Drobné animace:** vodopády z teras, koi v jezírkách, zavlažovací drony, lampiony, spáč v houpací síti.
- **Postavy a zvířata:** obyvatelé cvičí tai-či, koi, spáč.
- **Reakce:** *průlet:* jeřábci na šňůrách se natočí za vlaštovkou. *Perfekt:* **hejno jeřábků se odpoutá a krátce letí kolem vlaštovky**, pak se vrátí. Po odemčení Paper Crane jeden z nich zůstane. Je to „přítel“ z A14. *Dopad poblíž:* do jezírka, koi okusují roh. *Paper Crane přetáhne vlaštovku přes hranici:* jeřábek na provázku, komiksové „HNNNG!“ a „Paper Crane tugged you 41 m.“
- **Vazba:** Paper Crane (A14). Zippy hláška 2.
- **Gag:** obyvatel teras složí vlastní vlaštovku, hodí ji a ta hned spadne. Pokrčí rameny.

#### 15. Broadcast Tower · Atlas **On Air**
- **Hlavní scénka:** nejvyšší věž trasy s vysílacími kruhy (už dnes) a fasádami obřích obrazovek kolem. Věž je vidět už ze Sky Terraces (vysoký orientační bod).
- **Drobné animace:** výtah jezdí po věži (už dnes), myči oken na plošině, satelitní talíře, bazén na střeše s večírkem, zpravodajský dron.
- **Postavy:** moderátorka počasí na obrazovce, myči oken, lidé na večírku.
- **Reakce:** *průlet:* zpravodajský dron se na 1 s pověsí za vlaštovku a obrazovka ukáže dlaždici LIVE. *Kombo ≥ 3 s On Air:* **všechny obrazovky ukazují siluetu vlaštovky a rychlost**, „Signal lost“ při minutí (A15). *Perfekt:* obrazovky pustí okamžitý replay s nápisem WOW! *Dopad poblíž:* „A billboard ate you. You're on the menu now.“
- **Vazba:** On Air (A15).
- **Gag:** moderátorka počasí ukáže na mapě za sebou na vlaštovku: „...and a paper front moving in from the west.“

#### 16. Rooftop Harbor · Atlas **Encore** · finále
- **Hlavní scénka:** střešní přístav se vzducholodí u stožáru (už dnes), běžící přistávací světla (už dnes). Uprostřed paluby obří **poštovní schránka**, cíl celé cesty. Před prvním příletem je z dálky vidět jen tmavá silueta (08 §1).
- **Drobné animace:** vzducholoď se pohupuje (už dnes), nákladní drony, neonoví racci, lidé na palubě čekají s kufry, signalista s terčíky.
- **Postavy:** signalista (navádí vlaštovku jako letadlo), cestující, Zippy.
- **Reakce:** *průlet:* signalista navádí terčíky směr „dál“. *Perfekt:* vzducholoď zahouká a z paluby vzlétnou konfety. *Dopad poblíž:* signalista ukáže „Gate 4“.
- **Vazba:** Encore (A16), Zippy hláška 3. **Finále** (08 §8.4): let se zpomalí, kamera se oddálí na celé město, 16 míst se postupně rozsvítí, každé svou reakcí (dav na tržnici, jeřáby se ukloní, maják posvítí, Stella zamává). Vlaštovka vklouzne do schránky a za ní vyjde slunce. Titulek „Delivered.“
- **Gag:** vzducholoď má na boku jméno THE SLOW ONE.

### 3.6 Přehled vazeb (rychlá kontrola)

| # | Místo | Hlavní scénka | Reakce na perfekt | Atlas | Rychlost 1. návštěvy |
|---|---|---|---|---|---|
| 1 | Workshop & First Roofs | okno Dílny s dítětem | kočka máchne tlapkou | Glider | 14 m/s |
| 2 | Market | dav pod anténami | petardy, vlna podle komba | Crowd Chain | 23 |
| 3 | Gardens | větrníky podle větru | chmýří pampelišky | Pinwheel | 26 |
| 4 | Railway | vlak v rytmu páry | „TOOT!“ | Steam Hop | 35 |
| 5 | Warehouses | vozíky a bedny | tabulky „9.5“ | Packing Tape | 47 |
| 6 | Crane Forest | Marge v kabině | jeřáby se ukloní | Crane Lift | 55 |
| 7 | Bridge | most a měsíční voda | ryba vyskočí vedle | Stone Skip | 65 |
| 8 | Lighthouse | kužel majáku | racci ve tvaru V | Gull Escort | 75 |
| 9 | Fields | zlaté lány v protisvětle | krávy zvednou hlavy | Momentum | 81 |
| 10 | Wind Ridge | turbíny, jestřábi v termice | spirála jestřábů | Thermal | 95 |
| 11 | Mountain Saddle | alpský roh, růžové štíty | ozvěna „★…★“ | Echo | 105 |
| 12 | Observatory | Stella a dalekohled | cedule „A4-1“ | Shooting Star | 120 |
| 13 | Gates | brána a reflektory | nápis WELCOME | Ad Drone | 125 |
| 14 | Sky Terraces | origami jeřábci | hejno jeřábků | Paper Crane | 132 |
| 15 | Broadcast Tower | věž a obrazovky | replay WOW! | On Air | 145 |
| 16 | Rooftop Harbor | vzducholoď a schránka | houkání a konfety | Encore | 160 |

Rychlosti jsou hrubý odhad podle 08 §2.4 (střední hráč, průměrná rychlost letu).

---

## 4. Kamera jako režisér

### 4.1 Základ: sledování
- Výchozí stav = dnešní `follow` / `render.view(f)` v metrech (`archiv/prototype/3d/geometry.js`): vlaštovka na `px` 148/640 zleva, zem 60/360 nad spodním okrajem, kamera se zvedá nad 190/360 výšky.
- **Oddálení podle tempa** z 08 §2.5: `zoom = clamp(1 − .035·(π − 1), .70, 1)` a posun vlaštovky z px 148 na 120 (`tempoZoom`, `tempoPx`, už v prototypu). Ve 3D se nemění FOV, ale vzdálenost kamery (méně deformace).
- **Prostor před vlaštovkou** roste s rychlostí: při 160 m/s je vidět ~2 s letu dopředu. Ještě víc (px 110) jen ve vyhlídce, nikdy během události.
- Všechny pohyby kamery jdou přes `damp`/`spring` z `motion.js` (nezávislé na fps).

### 4.2 Stavy kamery

| Stav | Kdy | Co dělá | Trvání | Smí během QTE? |
|---|---|---|---|---|
| **Follow** | výchozí | sleduje, zoom podle tempa | – | ano (jediný) |
| **Vista** (vyhlídka) | klid ≥ 2,5 s, další událost ≥ 1,5 s daleko | o 8–12 % širší záběr, horizont níž, ukáže orientační bod | dokud trvá klid | ne, vrací se do Follow 1 s před událostí |
| **Place intro** | první průlet novým místem (rekord ještě nedosáhl) | jemné natočení 2–3° k hlavní scénce, název místa u horního okraje (0,6 s, 08 §2.5) | 1,2 s | ne, jen název |
| **District** | hranice čtvrti | oddálení na ~1,5× šířky, neonový název přes nebe, změna stopy (08 §8.2) | 1,5 s | ne, zkrátí se na název a změnu stopy |
| **Perfect** | perfektní zásah | **žádný pohyb kamery**, jen hitstop a juice (`juice.js`), mikropříblížení ≤ 2 % se zpožděním 0,15 s po vyhodnocení | 0,4 s | – |
| **Landing** | dopad | přiblížení k místu dopadu a reakce postavy | 0,85 s (dnes), s reakcí až 1,4 s, tap přeskočí | – |
| **Finale** | 4 876 m | oddálení na celé město, rozsvícení 16 míst | ~8 s, přeskočitelné | – |

### 4.3 Pravidla, aby kamera nerušila QTE (H/N)
1. **Nikdy střih za letu.** Všechny změny jsou plynulé. Střih by rozbil odhad polohy a časování (06: hráč čte pohyb, KB 06 §3.3: spojitý pohyb pomáhá časování).
2. **Zámek během varování a okna.** Od začátku varování do 0,3 s po vyhodnocení se kamera nepohne jinak než sledováním. Zoom se nemění ani podle tempa (tempo se mezi tím nemění skokem).
3. **Kruh QTE na stálém místě obrazovky.** Kruh je vázaný na vlaštovku a vlaštovka během okna nesmí po obrazovce cestovat víc než o pár pixelů (kromě vlastního letu).
4. **Velké záběry se plánují dopředu.** Režisér zná `events` (časy jsou v letu známé, `at` a `gap`). Když by se hranice čtvrti potkala s událostí, záběr District se zkrátí na název a změnu stopy. Události se kvůli kameře **neposouvají**, jinak by se změnil balanc (Monte Carlo měří časy událostí).
5. **Otřes a záblesk** zůstávají v `juice.js`, mají vlastní přepínač a při reduced motion se nahradí lokálním efektem (KB 05 §4).
6. **Hitstop zastaví jen vykreslení, ne časování QTE** (už dnes v `ui.js`).

### 4.4 Vyhlídka v klidném klouzání
V klidu (dnes běží zrychlení 1,4×) kamera nabídne „vyhlídku“:
- záběr se pomalu (2 s) rozšíří o 8–12 % a horizont sjede níž, aby byl vidět orientační bod a nebe,
- vzdálená vrstva dostane víc světla (nebe, slunce, měsíc),
- svět v tu chvíli pustí naplánovaný gag (gag režisér, §5.4),
- 1 s před další událostí se kamera vrátí do Follow.
Nejsilnější vyhlídky: Mountain Saddle (první pohled na metropoli), Lighthouse (druhé slunce), Gates (brána se rozsvítí), Broadcast Tower (věž přes celý záběr).

Vyhlídka a zrychlení klouzání jdou proti sobě (zrychlení zkracuje právě ten klid). Návrh řešení je v §7.

---

## 5. Postavy v pozadí a dav

### 5.1 Princip: siluety s jedním akcentem
Komiksový styl je výhoda: postava nepotřebuje detail. Silueta v barvě stínu čtvrti, tlustá tuš, jedna akcentová barva (šála, deštník, lampion) a 2–4 pózy. Čitelnost dělá tvar, ne textura.

### 5.2 Techniky (od nejlevnější)
1. **Instancovaný dav (`InstancedMesh`).** Jedna geometrie postavy (~60–120 trojúhelníků: trup, hlava, dvě ruce jako kvádry a jehlany jako dnešní `boxVertices`/`pyramidVertices`), stovky instancí v jednom draw callu. Atributy instance: poloha, barva akcentu, fáze, typ pózy.
2. **Animace ve vertex shaderu, bez kostí.** Vrcholy jsou označené (hlava, ruka L/P). Shader dostane uniformy `planeX`, `planeY`, `time`, `cheer`:
   - **hlavy sledují vlaštovku:** natočení hlavy podle `planeX − x`, levné a nejvíc „živé“ (celé město se dívá),
   - **mexická vlna:** zvednutí rukou s fází `(x − planeX)/rychlost`, takže vlna běží s vlaštovkou,
   - **síla jásotu** `cheer` = krok komba (Crowd Chain) nebo perfekt.
3. **On twos (12 fps).** Pózy davu se přepínají v krocích 1/12 s (`onTwos` z `themes-verse.js`). Komiksový charakter a polovina výpočtů. Kamera a vlaštovka zůstávají plynulé (stejně jako `verse`).
4. **Sprity s flipbookem pro dálku.** Ve střední vrstvě postavy jako kartičky natočené ke kameře (atlas 4 × 4 póz, jeden draw call). V panoramatu už jen světla oken a pohybující se tečky (auta).
5. **Zvířata jako hejna.** Holubi, racci, vrány: předem spočtené dráhy (Lissajous + `fbm` šum), mávání křídel ve shaderu (`sin(time·11 + i)` jako dnešní hejno v `ambient.js`). Vyrušení vlaštovkou: hejno se rozletí od `planeX` (jeden uniform).
6. **Vozidla jako proudy.** Auta na mostě a dálnici: instance po křivce s rychlostí, světla jako emisivní body. Vlak, kombajn, vzducholoď jsou jednotlivé ruční objekty.

### 5.3 Rozpočet života na místo (N)
| Prvek | Kusů na místo | Trojúhelníků | Draw calls |
|---|---:|---:|---:|
| dav blízko (3D instance) | 40–200 (tržnice 300) | 5–25 tis. | 1 (+1 obrys) |
| dav střední vrstva (sprity) | 100–400 | 0,2–0,8 tis. | 1 |
| hejna | 10–40 | 0,5 tis. | 1 |
| vozidla | 20–60 | 2–5 tis. | 1–2 |
| hlavní postava / zvíře (ruční) | 1–3 | 0,5–2 tis. | 1–3 |

### 5.4 Gag režisér
Logika jako dnes `decorations.js` (další gag za 6–10 s, jen bez události), rozšířená:
- seznam gagů na místo s podmínkami (místo, čtvrť, klidné okno ≥ 2,5 s, nejvýš jednou za N hodů),
- vlastní RNG proud ze seedu (`seed ^ konstanta`), takže je let reprodukovatelný a simulace se nemění,
- historie posledních gagů v paměti relace (ne v save), aby se neopakovaly hned po sobě,
- čistá funkce testovatelná bez DOM (`stepGags(state,f)`), vykreslení zvlášť.

---

## 6. Rozpočet výkonu a obsahu

### 6.1 Cílové platformy
- **Web:** Chrome, Edge, Firefox na běžném notebooku s integrovanou grafikou a na telefonu střední třídy (WebGL 2). Cíl 60 fps na desktopu, 60 fps na telefonu s nižším rozlišením (`dpr` 1–1,5), nouzově 30 fps.
- **Steam (Windows, Linux, bez Macu):** pro 3D doporučuji obal s Chromiem (Electron nebo NW.js), protože Tauri na Linuxu používá WebKitGTK se slabším WebGL. Steam Deck je dobré referenční zařízení (N, ověřit).

### 6.2 Odhad na čtvrť (N)
Na obrazovce jsou současně ~2–3 místa (305 m každé, záběr 305–436 m) plus panorama.

| Položka | Dnes v prototypu (odhad) | Cíl na 1 místo | Cíl na snímek |
|---|---:|---:|---:|
| trojúhelníky statické (sloučené budovy) | ~0,5 tis. (+ stejně za obrys) | 8–15 tis. | 30–50 tis. |
| trojúhelníky živé (dav, vozidla, zvířata, hlavní objekty) | téměř 0 | 10–30 tis. | 30–80 tis. |
| draw calls | ~5 + 1 na každou ceduli | 8–14 | 40–70 (desktop ≤ 120, mobil ≤ 80 se stíny) |
| textury | okna, cedule, nebe | atlas cedulí, atlas póz | ≤ 32 MB GPU |

Celkem do ~150 tis. trojúhelníků na snímek na desktopu a ~80 tis. na mobilu. To je daleko pod možnostmi i slabých GPU, úzké hrdlo budou spíš draw calls, stíny a post-process (půltón, posterizace), ne geometrie.

Doporučení z prototypu:
- **Atlas cedulí:** dnes má každý text cedule vlastní materiál a mesh, což dělá desítky draw callů. Jeden atlas a instancované obdélníky s UV ofsetem → 1 draw call.
- **Obrys:** inverted hull zdvojuje trojúhelníky a draw calls. Pro budovy zvážit obrys v post-processu (hrany z hloubky a normál), vlaštovce nechat hull. Porovnat v `?perf=1`.
- **Stíny:** jedna směrová mapa 2048 zdvojí kreslení. Při vysokém tempu stíny aktualizovat ob snímek nebo nahradit kontaktními stíny (tmavé obdélníky pod objekty) a v Docks/Core se stíny měsíce obejít úplně (noc, světlo z lamp).
- **Stavba místa:** dnes `stream` staví max 2 místa za snímek. Při 220 m/s přijde nové místo každých ~1,4 s, stavba musí být < 4 ms, nebo předem ve chvíli míření. Trasa se opakuje po 16, geometrii se vyplatí stavět jednou na index a znovu použít.

### 6.3 LOD při vysoké rychlosti (N)
Řídí se tempem π a rychlostí na obrazovce, ne jen vzdáleností:
- **π < 4 (Suburbs, Docks):** plný detail, dav 3D blízko, drobné animace všechny.
- **π 4–7:** popředí bez drobností pod ~1 m (květináče, cedulky), dav blízko jako sprity, hejna menší.
- **π > 7 (pozdní hra):** popředí jen siluety a rychlostní čáry (`speedLines` z `verse`, od 40 m/s), drobné animace v blízké vrstvě vypnuté (stejně je není vidět), **orientační body a hlavní scénky v plném detailu** (to je, co hráč stihne vidět). Stíny ob snímek.
- Animace pozadí on twos ve všech LOD. Půltónová mřížka ukotvená k objektu (jako v `verse`), aby se při rychlém posunu netvořil moiré.

### 6.4 Co je procedurální a co ruční
| Procedurálně (kód, ze seedu a `ROUTE`) | Ručně (kód z primitiv, později případně glTF) |
|---|---|
| budovy, okna, cedule (`cityChunk`, `SIGNS`) | 16 hlavních scének (maják, Marge v jeřábu, observatoř, brána, věž, vzducholoď, schránka, vlak, most) |
| stromy, plodiny, tráva (shader), větrníky | 4 postavy čtvrtí (Bolts, Marge, Stella, Zippy) a dítě v okně |
| dav, vozidla, hejna (rozmístění, fáze) | ~10 zvířat a figurek (kočka, kráva, kozorožec, tuleň, sova, racek, ryba, ježek, trpaslík, koi) |
| počasí, světlo, nálada (`moodAt`) | 30–50 gagů (data: podmínka, trvání, animace) |
| odezvy davu (vlna, hlavy) | komiksové nápisy (TOOT!, HONK, BOING, ★…★) jako atlas |

Celková ruční práce je hlavně v 16 hlavních scénkách a gazích. Vše zůstává bez závislostí (vanilla JS + vendorovaný three.js), geometrie z primitiv v duchu `geometry.js`.

### 6.5 Co převzít z dnešního 2D kódu
- **`scenes.js`:** `ROUTE` (16 míst, `kind`, příběhy), `routeAt`, `districtAt`, `atmosphereAt` (déšť, hejno). Nový `moodAt` patří vedle nich.
- **`motion.js`:** `wind`, `drift`, `sway`, `noise1`, `fbm`, `damp`, `spring`. Sdílený vítr dál řídí kouř, stromy, prádlo, větrníky, vlajky i déšť. Ve 3D stačí předat stejné hodnoty do uniforem.
- **`route-render.js`:** časování a chování 16 animací míst (vlak každých 11 s, vozík jeřábu, maják `sin(time·.9)`, padající voda z teras, běžící světla přístavu, výtah věže). Jsou to hotové „scénáře“ pro 3D.
- **`decorations.js`:** plánování (6–10 s, jen bez události) jako základ gag režiséra a typy dekorací po čtvrtích (`robot` = Bolts, `cargo` = Marge, `drone` = Zippy).
- **`juice.js` a `fx-render.js`:** stav trauma, hitstop, částice, popupy a `fxEvent` (perfect, success, miss, land) jsou přesně spouštěče reakcí světa.
- **`events.js`:** `activeEvent`, fáze `warning`/`interaction`/`effect` pro zámek kamery a ztlumení pozadí.
- **`themes-verse.js`:** `onTwos`, `speedLines`, `dotRadius`/`halftoneDots` (matematika půltónu do shaderu), `VERSE` palety, misregistrace vlaštovky, `INK`.
- **Prototyp 3D:** `cityChunk`, `follow`, `tempoZoom`, `tempoPx`, `sideCamera`, toon rampa, obrys, post-process, měření `perf.js`.

---

## 7. Dopad na progresi (návrhy k rozhodnutí uživatele)

Dokumenty 06 a 08 se tímto nemění. Jsou to návrhy, o kterých rozhoduje uživatel.

### 7.1 Napětí
Rozhodnutí 06: poslední hody ~30 s a zrychlení klouzání 1,4×. Na konci hry ale hráč přeletí 16 míst za ~30 s, tedy **~1,9 s na místo**. Kdyby byl let hlavní podívanou, pozdní hra by svět spíš míjela než ukazovala. Současně ale rychlost je záměr (06, varianta B: „silná vlaštovka v pozdní hře je záměr“) a pocit „letím přes celé město“ je sám podívaná.

Závěr: **délku letu neprodlužovat.** Delší lety by šly proti 06 („let nesmí trvat dlouho“) a P2 (juice nenahrazuje smysl). Podívanou je lepší přesunout tam, kde je hráč poprvé, a do chvil, kdy nic nedělá.

### 7.2 Návrhy

**R1. První návštěva naplno (doporučuji).** Zrychlení klouzání 1,4× neběží za hranicí hráčova rekordu, tedy na místech, která ještě neviděl, a 1 místo před ní. Známá místa ubíhají rychle, nové místo hráč vidí v normálním tempu s Place intro.
- Proč: nové místo je přesně to, co táhne zvědavost (P3), a hráč ho vidí poprvé tak, jak bylo navržené. Opakované průlety jsou krátké.
- Dopad na čas: prodlouží jen konec letu, který je za rekordem, typicky posledních 100–400 m. Odhad +0,5 až 2 s skutečného času u hodů, které posouvají rekord. Ověřit v simulátoru (`simulation/progression/`, parametr zrychlení podle `x > rekord`).
- Riziko: hod, který rekord nepřekoná, se nemění vůbec.

**R2. Vyhlídka místo zpomalení (doporučuji, bez vlivu na balanc).** V klidu kamera nabídne vyhlídku (§4.4). Širší záběr sníží rychlost na obrazovce o 8–12 % bez změny simulace.

**R3. Pohlednice letu (doporučuji, M).** Výsledek ukáže **komiksový strip ze tří panelů** sejmutých za letu: výhoz, nejlepší okamžik (perfekt, hranice čtvrti nebo Shooting Star) a dopad s reakcí. Skutečné snímky z render targetu ve chvíli `fxEvent`, s komiksovým rámem a nápisem. Je to podívaná bez prodloužení letu, pravdivá (P10) a přičitatelná (P7: panel ukazuje, co hráč udělal). Max 3 řádky výsledku z 08 U4 zůstávají, strip je obrázek nad nimi a jde vypnout.

**R4. Vyhlídkový let v Encore (volitelně, později).** Po finále v Night Route přepínač **Sightseeing**: let bez mincí a rekordů, s tempem π = 3 a kamerou ve Vista. Dobrovolné, bez tlaku (P13). Nahrazuje potřebu zpomalovat hlavní hru.

**R5. Zrychlení klouzání vázat na dosažitelnost (alternativa k R1, nedoporučuji).** Zrychlení 1,2× místo 1,4× všude. Jednodušší, ale prodlouží všechny lety o ~1,5–2 s a zmírní rozhodnutí 06 bez cíle.

**R6. Hranice čtvrti nezastavuje let.** Potvrzení 08 §8.2: velký moment běží za letu (1,5 s) a poprvé po dopadu jako Karta čtvrti. Nic dalšího se nepřidává.

### 7.3 Co by si hráč měl odnést
Hráč, který hraje hodinu (~115 hodů), uvidí každé místo poprvé v klidu a s reakcemi. Pozdní lety jsou rychlé průlety, v nichž se svět ozývá na jeho výkon (dav, jeřáby, obrazovky), a finále celé město najednou rozsvítí.

---

## 8. Plán realizace po fázích

Odhady: **S** do 1 dne, **M** 2–4 dny, **L** 1–2 týdny práce agenta s ověřením. Vše nejdřív v `archiv/prototype/3d/` a `archiv/prototype-3d.html`, hra (`src/`) se mění až po rozhodnutí, že 3D nahradí 2D.

| Fáze | Obsah | Odhad | Závisí na |
|---|---|---|---|
| **F0** (běží) | Živá čtvrť **Violet Suburbs** v 3D prototypu (souběžně jiný agent) | – | – |
| **F1** | `moodAt` (16 klíčových snímků nálady, plynulé přechody, testy), světla, mlha, nebe a počasí všech čtyř čtvrtí v hrubé podobě | M | F0 |
| **F2** | Hierarchie čitelnosti a přístupnost: koridor letu, ztlumení při QTE, Calm camera, Flashing lights, kontrola ≤ 3 záblesků/s | S–M | F0 |
| **F3** | Kamera režisér: stavy Follow / Vista / Place intro / District / Landing, zámek během QTE, testy plánování nad `events` | M | F1 |
| **F4** | Technika života: instancovaný dav s hlavami za vlaštovkou a vlnou, sprity s atlasem póz, hejna, proudy vozidel, gag režisér (čistý stav + testy) | M | F0 |
| **F5** | Moon Docks: déšť, kaluže, voda s odlesky, jeřáby, Marge, maják, druhé slunce na hranici | L | F1, F4 |
| **F6** | Red Horizon: lány (shader), turbíny, termika, sedlo, observatoř, Stella | L | F1, F4 |
| **F7** | Neon Core: atlas cedulí, obří obrazovky, drony, Zippy, brána, věž, přístav | L | F1, F4 |
| **F8** | Výkon: atlas cedulí, obrys v post-processu proti hullu, stíny podle tempa, LOD podle π, představba míst, měření na telefonu a na Steam Decku | M | F5–F7 (průběžně) |
| **F9** | Reakce na Atlas a nové události (Crowd Chain, On Air, Stone Skip, Paper Crane…) po implementaci nového systému podle `11-plan-implementace.md` | M | nový systém ve hře |
| **F10** | Finále, Karta čtvrti a pohlednice letu (R3) | M–L | F3, F9 |

**Doporučené pořadí:** F0 → F2 → F1 → F3 → F4 → **rozhodovací bod** (playtest: 3D Suburbs proti dnešní hře a `verse`; měřit výkon na telefonu) → F5 → F6 → F7 → F8 → F9 → F10. Přístupnost (F2) jde dopředu záměrně: je levná na začátku a drahá dodatečně.

**Rozhodovací bod po F4:** jestli 3D nahradí 2D jako hlavní render. Kdyby ne, většina návrhu platí i pro 2D `verse` (barvy, katalog, reakce, gag režisér, kamera bez hloubky).

---

## 9. Otevřené otázky pro uživatele
1. **R1 „První návštěva naplno“:** vypnout zrychlení klouzání za hranicí rekordu? (doporučuji ano, po ověření simulátorem)
2. **R3 Pohlednice letu:** komiksový strip ze tří panelů ve výsledku? (doporučuji ano)
3. **R4 Sightseeing v Encore:** zařadit do konce hry, nebo odložit? (doporučuji odložit, rozhodnout po finále)
4. **Oblouk „cesta za sluncem“** (soumrak → měsíc → druhý západ slunce → neon → úsvit): přijmout jako barevný rámec celé trasy? Mění tón Violet Suburbs proti dnešní paletě `verse` (z rána na soumrak).
5. **Míra humoru v reakcích:** jsou postavy jako tuleň tleskající při minutí a kozorožec hodnotící chuť vlaštovky v pořádku, nebo držet suchý tón jen v textech?
6. **Platforma Steam:** souhlas s obalem s Chromiem (Electron/NW.js) kvůli WebGL na Linuxu?
