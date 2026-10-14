> **ZASTARALÉ (15. 10. 2026):** celá bible (cyber/komiks: tištěný komiks S2, neon, magenta perfekt, indigová UI) je nahrazená Papírovým městem; platí `research/design/05-styl-papir.md` (kap. 15 říká, co se z 02 přebírá a co ruší). Nečíst jako zadání.

# Stylová bible Just Throw It

> **Schváleno 14. 10. 2026.** Napsal art-director podle rozhodnutí „Jednotný vizuální styl“, uživatel schválil „vše podle doporučení“ (`research/bonusy/06-rozhodnuti.md`, blok „Ke stylové bibli“, 14. 10.): pilíře A, paleta A, jedno UI na tokenech Atlasu, perfekt = magenta, obzor Neon Core do tyrkysové, půltón jen ve stínech budov. **Bible je závazná.** Kde se kód liší, platí bible a rozdíl je úkol v `research/design/03-styl-implementace.md`. Změna bible = nové rozhodnutí uživatele.

Bible popisuje, **jak má hra vypadat a proč**. Je napsaná z toho, co už ve hře funguje (3D město v `src/render3d/`, UI v `style.css`, prototypy Atlasu a papírů), ne od nuly. Každé pravidlo odkazuje na pilíř (**S1–S4**). Čísla a barvy jsou převzaté z kódu, kontrasty jsou změřené (WCAG poměr, výpočet relativní svítivosti), ne odhadnuté.

**Jak číst:** „Pravidlo“ je to, co má platit. „Dnes“ je stav kódu. „Rozpor“ je místo, kde se kód a pravidlo liší. Všechny rozpory jsou souhrnně v kap. 11.

**Snímky** (`research/design/img/`) pořídil art-director 14. 10. v Chrome. Okno bylo skryté (`visibilityState = hidden`), scéna kreslena přes `?timer`. Statický vzhled je proto posouzený, **plynulost a animace NOT ASSESSED**. Snímky čtvrtí 2–4 jsou z ladicího letu přesunutého na místo (`__r3d.reset` + posun `f.x`, `__r3d.snapshot`), proto mají svislou „kapku“ stopy pod vlaštovkou (artefakt přesunu, ve hře není).

| Snímek | Co ukazuje |
|---|---|
| `desktop-dilna-stranka.jpg` | Dílna, celá stránka, 1280 × 800 |
| `desktop-mireni.jpg` | míření (panel „Aim and hold“) |
| `desktop-let-detail.jpg` | let ve Violet Suburbs zblízka, HUD, „Get ready“ |
| `desktop-udalost-qte.jpg` | událost (Vent gust), QTE kruh a lišta |
| `desktop-vysledek.jpg` | výsledek hodu |
| `desktop-let-1-suburbs.jpg` … `desktop-let-4-core.jpg` | 4 čtvrti za letu (místa 2, 6, 10, 14) |
| `mobil-dilna.png`, `mobil-let-udalost.png`, `mobil-vysledek.png` | telefon na výšku 375 × 667 |
| `mobil-nasirku-dilna.jpg` | telefon na šířku 932 × 430 |
| `atlas-pohlednice.png` | 16 pohlednic Atlasu vykreslených z `prototype/atlas/art.js` |
| `papiry-prototyp.png` | prototyp čtyř papírů |
| `varianty-palety.png` | 3 varianty palety, které byly k rozhodnutí; platí řádek A (kap. 2.5) |

---

## 1. Pilíře stylu

Čtyři věty, o které se opírá každé další pravidlo (schválená varianta **A „Cesta za sluncem“**):

- **S1 Vlaštovka je vždy vidět.** Čitelnost letu (vlaštovka, stopa, nejbližší událost) má přednost před každou ozdobou. Když se ozdoba a čitelnost přou, ustoupí ozdoba.
- **S2 Tištěný komiks.** Tuš (jeden tmavý obrys), ploché tóny, půltón jen ve stínu, ostré přechody. Ne fotorealismus, ne měkké přechody, ne pixel art.
- **S3 Barva vypráví cestu za sluncem.** Čtvrť = denní doba (soumrak → měsíční noc → druhý západ → neonová noc → úsvit). Barva říká „kde jsem“, tvar říká „co to je“ (papír, událost, ikona).
- **S4 Jedna výrazná věc na obrazovku.** Každá obrazovka má jeden vrchol pozornosti (let: vlaštovka; výsledek: vzdálenost; Atlas: pohlednice). Okraje, panely a pozadí jsou tiché.

Co hra **není:** kyberpunková temnota s jedním akcentem, retro pixel art (2D styl `cyber` končí), pastelová „cozy“ hra bez kontrastu, generický mobilní UI kit.

### 1.1 Zamítnuté varianty
- **B Neonová arkáda** (celé město tmavé, čtvrti jen jiným akcentem): zamítnuta, protože by vzala druhý západ slunce a pestrost cesty „za sluncem“ (06, 13. 10.).
- **C Tištěná pohlednice** (město zjednodušené k Atlasu): zamítnuta, protože by vyžadovala přestavbu 3D města, které uživatel schválil. Z C zůstává jen jednotná tuš a UI podle Atlasu (kap. 7).

---|---|---|---|
| Věty | S1–S4 výše | S1 + „Noc a neon: tma, ze které svítí jen důležité“ + „Rychlost je vidět“ + S4 | S1 + „Každý záběr je pohlednice: tuš, plochy, žádné textury“ + S3 + „Klid a humor místo efektů“ |
| Jak vypadá | dnešní 3D město, uklizené: méně půltónu, jedna tuš, jedna azurová a jedna magenta | celé město tmavší, čtvrti se liší hlavně akcentem, UI černomodré s azurovou | město zjednodušené k pohlednicím Atlasu: méně oken, plošší nebe, silnější obrys |
| Příklad | `desktop-let-1-suburbs.jpg` + oprava podle kap. 5; `varianty-palety.png` řádek A | `desktop-let-4-core.jpg`, `varianty-palety.png` řádek B | `atlas-pohlednice.png`, `varianty-palety.png` řádek C |
| Plus | navazuje na schválenou cestu „za sluncem“ (06, 13. 10.) a na 3D, které uživatel chválil; nejmenší přestavba | vlaštovka a stopa nejlépe vidět (tmavé pozadí) | nejjednotnější s Atlasem, nejčitelnější na telefonu |
| Minus | vyžaduje úklid barev a půltónu | ztrácí „druhý západ slunce“ a pestrost čtvrtí; Horizon by byl jen jiný odstín noci | největší přestavba 3D (okna, textury, obloha), riziko „chudšího“ dojmu |

---

## 2. Paleta

### 2.1 Primitivní barvy (jádro)

Dnes je v kódu (`src/render3d/*.js`, `style.css`) **35 různých odstínů azurové a 19 odstínů magenty** (např. `#00bddb`, `#2fb5c9`, `#53dbea`, `#5cf2ff`, `#61eafa`, `#62ecff`, `#66f7ef`, `#6ffff0` …). Většina vznikla ručně v jednotlivých souborech. Pravidlo (**S2, S4**): **každá role má jednu barvu**, odchylky jen jako zesvětlení nebo ztmavení té barvy v kódu (`mix`).

| Token | Hex | Původ v kódu | Role |
|---|---|---|---|
| `ink` | `#15101f` | `comic.js INK`, rychlostní čáry `palette.speed.ink` | tuš: obrysy, stíny písma, tvrdé stíny UI |
| `paper` | `#ffffff` (dnes `#efffff`) | `palette.plane.fill` | vlaštovka, papír, bílé plochy pohlednic |
| `cyan` | `#5cf2ff` | `mood.js` rim Core, `palette.companion.grate`, Atlas | neon akcent, „úspěch“ |
| `magenta` | `#ff4f9e` | `mood.js` stopa Core, Atlas `--d3` | neon akcent, **perfekt** (všude: QTE zóna, výsledek QTE, popup, záblesk jisker) |
| `gold` | `#ffd166` | Atlas `--coin`, dnes i `palette.popup.perfect` | **jen hodnota**: mince, cena, odměna, milník, korunka |
| `focus` | `#fff27a` | Atlas `--focus` | fokus klávesnice, varování „Get ready“ |
| `night` / `plate` / `plate2` | `#1b1444` / `#251c57` / `#30256d` | Atlas tokeny | podklad UI a panely |
| `text` / `dim` / `mute` | `#f5f1ff` / `#c9c0f0` / `#a79cd8` | Atlas tokeny | text UI ve 3 stupních |
| `miss` | `#cfd3e0` | `palette.popup.miss` | neutrální „minutí“ (ne červená, minutí je vtip, ne trest; svět §1) |

**Rozpor (inkoust):** dnes jsou tři „tuše“: `INK #15101f` (comic.js), obrys budov `mix(INK,'#07051a',.5)` ≈ `#0e0b1c` a výchozí `#07051a` (toon.js), obrys vlaštovky `#0b1935` (palette.js), Atlas `#120a2a`. Na pohled jsou skoro stejné, ale jsou to čtyři rozhodnutí místo jednoho. **Pravidlo:** jedna `ink #15101f` všude, včetně Atlasu a obrysu vlaštovky.

### 2.2 Sémantické role

| Role | Barva | Kde | Proč |
|---|---|---|---|
| Hráč (vlaštovka) | `paper` + `ink` obrys | 3D vlaštovka, ikona v UI | S1: nejsvětlejší a nejkontrastnější prvek scény |
| Stopa letu | barva čtvrti (2.3) | `plane.js` trail, `mood.trail` | S3: stopa říká „kde jsem“ |
| Úspěch | `cyan` | QTE úspěch, popup success | S4: jedna barva pro „povedlo se“ |
| Perfekt | `magenta` všude | QTE zóna, výsledek QTE, popup „Perfect“, jiskry perfektu | rozhodnutí 06 (14. 10.); odlišit od úspěchu i bez barvy: perfekt má navíc tvar (hvězda) a záblesk |
| Odměna / hodnota | `gold` | mince, milník, ceny, korunka | rozhodnutí 06 (14. 10.): zlatá = jen hodnota, nikde jinde (ne perfekt, ne dekorace UI) |
| Minutí | `miss` | popup miss | svět §1: minutí = vtip |
| Nebezpečí | **žádná vlastní barva** | | hra nemá trest, červenou nepoužívat jako signál; maják `#ff4d6d` je jen dekorace a smí jen pomalu blikat (≤ 1 Hz) |
| Neon (dekorace) | `cyan`, `magenta`, `gold` jen v cedulích a oknech | město | S3: neon roste s nocí (`mood.neon`) |

**Rozpor (perfekt):** dnes je perfekt v QTE magenta (`palette.qte.perfect #ff5fc8`), ale popup „perfect“ je zlatý (`palette.popup.perfect #ffd166`), stejně jako milník a mince. Hráč tak vidí dvě barvy pro jednu věc. **Rozhodnuto:** perfekt magenta, popup perfekt a „zlatá jiskra“ perfektu (`palette.particles[1]`) se přebarví; zlatá zůstane mincím a milníku (R3).

### 2.3 Paleta podle čtvrtí a denní doby (`mood.js`, střed 2. místa čtvrti; `mood.js` je zdroj pravdy pro barvy čtvrtí)

| | Violet Suburbs | Moon Docks | Red Horizon | Neon Core | Úsvit (za cílem) |
|---|---|---|---|---|---|
| Denní doba | fialový soumrak | měsíční noc, mrholení | druhý západ slunce | neonová noc, déšť | úsvit |
| Obloha shora → obzor | `#35287a` `#7048b0` `#f08cc0` `#ffb88a` | `#14306c` `#1e5c9a` `#5098d2` `#9ccef2` | `#4a2884` `#e05a44` `#ffa048` `#ffd06a` | `#18184c` `#303a98` `#2ea4a4` `#cce65a` → **nově** 3. a 4. pás `#2aa99c` `#7ff0d8` | `#5a7ad8` `#9ab8f0` `#ffd0e0` `#fff0b0` |
| Hlavní světlo | `#ffaa90` 1,25 | `#cfe3ff` 1,65 | `#ff8f48` 1,8 | `#d08aff` 1,0 | `#ffe0b0` 1,9 |
| Protisvětlo | `#ff6fb5` | `#ffb347` | `#ffc35a` | `#5cf2ff` | `#ffb0d0` |
| Mlha (barva, near–far m) | `#8060b0` 400–1450 | `#32608e` 240–1050 | `#d86a4a` 420–1650 | `#301e66` 360–1400 | `#e8c8e0` 480–1850 |
| Svítící okna / neon / noc | 0,40 / 0,35 / 0,15 | 0,25 / 0,30 / 0,65 | 0,10 / 0 / 0 | 0,65 / 0,85 / 0,85 | 0,15 / 0,15 / 0 |
| Stopa | `#ff8ccf` růžová | `#5ce6ff` azurová | `#ffd23f` zlatá | `#ff4f9e` magenta | `#ffe14d` |
| Stěna budov (`palette.city.biomes`) | `#322749` + pastelové domy `suburbs[]` | `#294559` | `#63384e` | `#44214e` | |
| Akcent budov | `#3d7fa8` | `#a8458f` | `#c27a3a` | `#3aa88f` | |

Pravidla:
- **Barva se mění plynule po celém místě**, hranici čtvrti nese událost, ne střih (svět §2.3, `moodAt` se `smooth`). **S3.**
- **Kontrast kolem vlaštovky se nesmí měnit skokem** (mění se jen nízkofrekvenční parametry nebe a mlhy). **S1.**
- **Doplňková dvojice v každé čtvrti:** teplé světlo × studený stín (Suburbs, Horizon) nebo studené světlo × teplé lampy (Docks), v Core magenta × azurová. **S3.**

**Rozpory:**
- `comic.js VERSE[0]` (paleta 2D prototypu) je tyrkysové ráno (`#2ea8b8`…), `mood.js` má Suburbs ve fialovém soumraku. 3D bere `mood.sky`, `VERSE` je jen záloha (`comicLook`: `mood.sky?.length ? mood.sky : VERSE…`). **Pravidlo:** `VERSE` se sladí s `mood.js` (nebo zmizí spolu s 2D).
- Atlas (`prototype/atlas/art.js PAL`) bere palety ze svět §2.2, ne z `mood.js`. Docks v Atlasu mají nebe `#0d1b3d → #5f8fb8` (3 pásy), ve 3D `#14306c → #9ccef2` (4 pásy, světlejší obzor). Horizon v Atlasu má zem zlatou `#c98a2e`, ve 3D tmavě hnědé hory. **Pravidlo:** zdroj pravdy pro barvy čtvrtí = `mood.js`, Atlas z něj čte (pohlednice místa i = `MOOD_KEYS[i]`).
- Stěny budov v Docks (`#294559`) vycházejí ve scéně **zelenomodře** (`desktop-let-2-docks.jpg`, budovy i pás země zelené), svět §2.2 chce modrou `#215a8c`. Ve Suburbs jsou některé domy tyrkysově zelené (`desktop-let-detail.jpg`, vlevo). Zelená v paletě čtvrtí není. **Pravidlo:** budovy bez zelené; zkontrolovat mísení `biomes` × hemisféra × mlha (scene.js `cityColors`).
- Pás obzoru Core `#cce65a` / `#d2ee48` je limetkový a ve snímku `desktop-let-4-core.jpg` dominuje (celá spodní třetina nebe). Je to jediná zelená plocha ve hře. **Rozhodnuto:** pás obzoru Core se posouvá do tyrkysové, 3. pás `#2aa99c`, 4. pás (obzor) `#7ff0d8`, pro všechna místa 12–15 (`mood.js` klíče 12–15, `comic.VERSE[3]`, `art.js PAL[3]`). Měřeno: tuš × `#7ff0d8` 13,6 : 1, tuš × `#2aa99c` 6,4 : 1. Stopa magenta × `#7ff0d8` jen 2,24 : 1, proto stopa potřebuje tušový lem (kap. 5).

### 2.4 Změřené kontrasty

Barvy vlaštovky jsou **odečtené ze snímků** (po osvětlení, toon rampě a post-procesu), ne z palety:

| Dvojice | Poměr | Verdikt |
|---|---|---|
| Vlaštovka Suburbs `#cfaad6` × budovy `#b16397` | 2,03 | slabé, nese to obrys |
| Vlaštovka Docks `#aed1fb` × tmavé pozadí `#133960` | 7,47 | dobré |
| Vlaštovka Horizon `#ff9b88` × nebe `#ffa954` | **1,07** | výplň splývá, papír je lososový místo bílého |
| Vlaštovka Core `#89a8ff` × pás obzoru `#57aa8e` | **1,21** | výplň splývá |
| Obrys `#0b1935` × světlé nebe Horizon `#ffa954` | 9,18 | obrys vlaštovku drží |
| Obrys × tmavé pozadí Docks `#133960` | 1,48 | obrys mizí, drží výplň |
| Stopa Horizon `#ffd23f` × nebe `#ff9a4a` | **1,46** | stopa splývá |
| Stopa Core `#ff4f9e` × tyrkysový pás `#2ea4a4` | **1,01** | stopa zmizí (stejná svítivost) |
| Stopa Docks `#5ce6ff` × `#1e5a96` | 4,81 | dobré |
| QTE stopa kruhu `#3b4170` × nebe Suburbs `#7a4fb8` | 1,67 | kruh se ztrácí, drží ho úspěšná zóna |
| UI text `#e5e8ff` × `#090d1b` | 15,96 | AAA |
| UI odstavec `#a9abc8` × `#090d1b` | 8,61 | AAA |
| UI zamčený uzel `#747b99` × `#14162a` | 4,28 | AA jen pro velký text (pod 4,5) |
| Atlas `--mute #a79cd8` × `--plate #251c57` | 6,07 | AA |
| Atlas čtvrť magenta `#ff4f9e` × `#1b1444` | 5,58 | AA (Atlas ji dává jen do grafiky) |
| `ink` × obloha Core nahoře `#141444` | 1,08 | tuš na noční obloze nenese nic (proto S1 „dvojí hrana“, kap. 5) |

### 2.5 Schválená paleta (varianta A)

Obrázek: `research/design/img/varianty-palety.png`, řádek A (ilustrace; Core v obrázku má ještě limetkový obzor, platí tyrkysový z kap. 2.3).

- Oblouk „za sluncem“ z `mood.js` beze změny pořadí a nálad, s tyrkysovým obzorem Core.
- Jedna tuš `#15101f` (kap. 2.1).
- Vlaštovka bílá `#ffffff`, tónování světlem čtvrti nejvýš 20 % (kap. 4).
- Stopa v barvě čtvrti s tušovým lemem (kap. 5).
- UI na tokenech Atlasu (`#1b1444`, `#f5f1ff`, `gold` jen hodnota, barvy čtvrtí jen v grafice; kap. 7).

Zamítnuto: **B Neonová noc všude** (bere druhý západ slunce, rozpor s 06, 13. 10.), **C Tištěná pohlednice** (vyžadovala by zjednodušit 3D město).

---

## 3. Tvar a měřítko

**Dnes:** město je z kvádrů a jehlanů (`geometry.js cityChunk`, `mergeBlocks`), řady v hloubkách (ulice, střed, panorama) podle `districts/*-layout.js` (`near`, `mid`, `tall`: Suburbs 1, Docks 0,7, Horizon 0,5, Core 1,4). Kulaté jsou jen balóny, holub a slunce s měsícem. Vlaštovka: `geometry.SHAPES` (dart: nos 0,55, ocas −0,45, rozpětí 0,36; glider: rozpětí 0,5), ve scéně `PLANE_SCALE 7,75` (≈ 7,75 m), kamera FOV 20°.

Pravidla:
- **Silueta před detailem (S2, S4).** Každé místo má jednu dominantu čitelnou do 1 s (maják, brána METROPOLIS, věž, hory; svět §3.1). Dominanta je vyšší nebo jiná tvarem (jehlan, oblouk) než řada okolo.
- **Hranaté město, oblá příroda a živé věci.** Budovy kvádry a jehlany. Stromy, balóny, zvířata, postavy a obláčky páry smí být oblé. Tvar tak sám odliší „město“ od „živého“. **S2.**
- **Hustota detailu klesá s hloubkou.** Ulice: okna, cedule, lampy, postavy. Střed: okna jako textura. Panorama: jen silueta a pár světel. **Dnes** svítí okna stejně hustě v popředí i v dálce (`windowTexture` 8 × 8 na dlaždici, ~38 % svítí, v Core 75 %), takže pozadí je stejně „hlučné“ jako popředí (`desktop-let-1-suburbs.jpg`, `desktop-let-4-core.jpg`). **Pravidlo:** vzdálené řady okna bez barevných variant, max. 1 barva; S1, S4.
- **Měřítko vlaštovky:** na telefonu musí být vlaštovka aspoň **24 CSS px** dlouhá (dnes na 375 px šířky ~20–25 px, `mobil-let-udalost.png`). Stopa aspoň 2 CSS px (01-papiry §4). **S1.**

**Obrysy (inverted hull, `toon.outlineMaterial`, tloušťka v px obrazovky × DPR):**

| Prvek | Dnes | Pravidlo |
|---|---|---|
| Budovy | 2,5 px (`scene.js hull`) | 2,5 px, `ink`, mizí s mlhou |
| Drobnosti (holub, život čtvrti) | 1,7 px (`thinHull`) | 1,7 px |
| Vlaštovka | 2,6 px `#0b1935` | **≥ 2,6 px, nejsilnější obrys ve scéně** (S1), `ink`; papíry mění tloušťku jen nahoru (Kraft 2,9; Foil + 4,6 magenta), Washi 2,0 jen pokud výplň drží kontrast (01-papiry §4) |
| Dílna | 2,4 / 2,2 / 1,6 (`workshop.js`) | sjednotit na 2,5 / 1,7 |
| Atlas (SVG) | 2,5 v rámu 160 × 120 | odpovídá ~2,5 px při šířce 160 px |

**Rozpor:** `comic.comicLook` vrací `outline.thickness` 1,6 / 2 / 2,2 podle kvality, ale `scene.js` z plánu bere jen barvu obrysu, tloušťku ne (pevně 2,5 / 1,7 / 2,6). Buď `comicLook` číslo odstranit, nebo ho scéna použije. Pozor: 01-papiry chce u vlaštovky ≥ 2 px i při nízké kvalitě.

**Půltón a posterizace (`toon.postPass`, `comic.comicLook`):**
- Dnes: posterizace 6 úrovní na kanál (při zadržení dechu 5, nízká kvalita bez post-procesu), půltón 45° mřížka, perioda `dotSize` 5 px × DPR (střední kvalita 6), kreslí se pod světlostí `shade = 0,42`, tečky tónem `p*.25 + (.02, 0, .06)`. Toon rampa 3 tóny `[70,150,255]`, v noci `[58,140,255]`.
- **Nález:** ve tmavých čtvrtích je pod hranicí 0,42 skoro celý obraz, takže půltón pokrývá celé město i nebe (`desktop-let-2-docks.jpg`, `desktop-let-4-core.jpg`), ne jen stíny. Na telefonu jsou tečky vůči scéně velké a obraz „šumí“ (`mobil-dilna.png`). To odporuje S2 („půltón jen ve stínu“) i S1.
- **Pravidlo (rozhodnutí 06, 14. 10.): půltón jen ve stínech budov**, tj. na stínové straně budov a stavbách (toon tón 0, vržený stín na budovách), na všech šířkách včetně telefonu. Nikdy na nebi, zemi, vlaštovce, stopě, postavách, QTE a textu. Perioda tečky 5 px × DPR (střední kvalita 6). Technicky: půltón řídí maska „stín budovy“ (materiál budov nebo stencil), ne globální práh jasu `shade 0,42` v post-procesu. **S1, S2.**
- **Atlas bez výjimky (rozhodnutí 14. 10.):** pohlednice nemají vzor čtvrti v nebi (`art.js` `ht-0…3` odstranit). Půltón jen na stínové straně dominanty (`ht-ink`). Identitu čtvrti bez barvy nese název čtvrti a silueta dominanty.
- **Posterizace** zůstává (6 úrovní), ale přechody pásů nebe nesmí vytvářet tenké proužky za budovami (Suburbs, `desktop-let-1-suburbs.jpg`, vodorovné pruhy u obzoru). **S2.**

---

## 4. Světlo a nálada

**Dnes (`mood.js` → `scene.apply`):** 17 klíčových nálad (16 míst + úsvit), mezi nimi `smooth`. Každá má 4 barvy nebe, slunce / druhé slunce / měsíc (výška nad obzorem, alfa), hlavní směrové světlo se stíny (`BasicShadowMap`, 2048²), protisvětlo, hemisféru, mlhu, podíl oken, neon, noc (hvězdy, 500 bodů), barvu stopy a částice (světlušky, mrholení, pyl, sníh, jiskry, prach). Při události „zadržení dechu“ (`breath`) pozadí ztlumí sytost o 45 % × hold a světla o 15–25 %, vlaštovka, stopa a okna zůstávají.

Pravidla:
- **Světlo čtvrti tónuje svět, ne hráče.** Vlaštovka se smí tónovat barvou hlavního světla nejvýš o 20 % (01-papiry §2 „lehce“). **Dnes** je v Horizon výplň lososová `#ff9b88` a v Core modrofialová `#89a8ff` (snímky), tónování je ~50 % a vlaštovka ztrácí identitu papíru. **S1, S3.**
- **Stíny jsou tvrdé a jednobarevné** (BasicShadowMap, toon rampa), žádné měkké stíny ani ambient occlusion. **S2.**
- **Neon roste s nocí** (`mood.neon` 0 → 1 v Core) a nikdy nesvítí víc než vlaštovka. Cedule blikají pomalu (šum, `scene.js`), nejvýš 3 záblesky za sekundu na ploše > 1/10 obrazovky (WCAG 2.3.1, svět §1). **S1, S3.**
- **Mlha odděluje plány:** vzdálené řady do barvy mlhy, obrysy mizí s nimi (shader řeší mlhu ručně). V Docks je mlha nejhustší (240–1050 m), proto tam musí mít vlaštovka nejsvětlejší výplň. **S1.**
- **Slunce a měsíc jsou ploché disky s halo**, kreslené jako komiks (3 kruhy), ne bloom. **S2.**
- **Úsvit je jediné místo s pastelovou oblohou** a nejsilnějším světlem (1,9), odměna za doručení. **S3.**

---

## 5. Hierarchie čitelnosti

Pořadí: **vlaštovka a stopa > QTE a nejbližší událost > město v ulici > panorama > obloha.** **S1, S4.**

Pravidla:
1. **Dvojí hrana vlaštovky.** Cíl: vlaštovka `paper #ffffff` (tónování ≤ 20 %) + obrys `ink` ≥ 2,6 px. V každé čtvrti musí platit aspoň jedno, ideálně obojí: výplň × okolí ≥ 3 : 1, nebo obrys × okolí ≥ 3 : 1. Proti světlému obzoru nese vlaštovku obrys (9,2 : 1), proti tmavé noci výplň (7,5 : 1). **Dnes selhává:** Docks obrys 1,48 (drží výplň, OK), Horizon výplň 1,07 (drží obrys, OK), ale **v místech, kde je pozadí středně světlé** (Suburbs: výplň 2,0, obrys 3,4) je rezerva malá. Řešení: bílá výplň (tónování ≤ 20 %) + tuš; bílá × střední pozadí Suburbs `#b16397` 4,1 : 1, bílá × `#7048b0` 6,5 : 1.
2. **Stopa ≥ 3 : 1 vůči okolí, pomocí tušového lemu.** Dnes Horizon 1,46 a Core 1,01 (i s novým obzorem `#7ff0d8` jen 2,24). Samotná změna barvy nestačí (např. `#fff3b0` × nebe Horizon 1,87). **Pravidlo:** stopa má lem `ink` na obou okrajích, aspoň 1 CSS px (tj. ≥ 1 × DPR px), jádro v barvě čtvrti. Lem × světlé nebe ≥ 9 : 1, jádro × lem ≥ 6 : 1 (magenta × tuš 6,1, zlatá × tuš 12,9). Barvy stopy podle čtvrti zůstávají (S3). **S1.**
3. **Nic v dráze letu nemá barvu stopy ani papíru.** Dnes mají obláčky kouře z komínů a páry skoro barvu papíru (`#f3e6ff`, `life3d.js` smoke a `palette.companion.steam`), ve scéně je světlo obarví do růžova a letí ve výšce vlaštovky vedle růžové stopy `#ff8ccf` (`desktop-let-detail.jpg`). **Pravidlo:** kouř a pára do šedofialové pod jas vlaštovky (např. `mix(steam, fog, .4)`, svítivost aspoň o 40 % nižší než vlaštovka). **S1.**
4. **Hodnotový strop města:** nejsvětlejší plocha města (okna, cedule) smí být nejvýš tak světlá jako vlaštovka, ale menší. Velké světlé plochy (Horizon slunce, pás obzoru Core) nesmí ležet ve výšce letu po delší dobu, nebo musí mít vlaštovka obrys ≥ 9 : 1. **S1.**
5. **QTE nad vším:** kruh QTE má vlastní tmavý podklad (dnes stopa kruhu `#3b4170` proti nebi Suburbs 1,67, `desktop-udalost-qte.jpg`). **Pravidlo:** pod kruhem tmavý disk `ink` 60 % alfa. **S1.**
6. **Zadržení dechu při události zůstává** (`breath`): pozadí ustoupí, vlaštovka a QTE ne. **S4.**

Kontrolní test: snímek scény převést do šedi a zmenšit na 25 %. Vlaštovka a stopa musí být první, co oko najde. Dnes v šedi projde Docks, ne Horizon a Core (výplň vlaštovky splyne, zůstane jen obrys). Test je kritérium ověření pro art-review.

---

## 6. Efekty a pohyb

**Dnes (`juice.js`, `fx-map.js`, `comic.js`):**

| Efekt | Čísla | Reduced motion |
|---|---|---|
| Rychlostní čáry | od 40 m/s, 6–24 čar podle rychlosti (do 150 m/s), bílé `#ffffff`, kresba „on twos“ 12 fps | vypnuté |
| Hitstop | perfekt 0,09 s, úspěch 0,05 s, dopad 0,12 s (zastaví jen fyziku, QTE běží) | zůstává |
| Otřes | trauma → posun kamery, náklon ≤ 3° | vypnutý |
| Záblesk | po perfektu, špička alfa 0,18, ≤ 1 Hz | vypnutý |
| Popupy | život 1,1 s, náběh outBack 0,25 s, stoupání 26 px | bez škálování a stoupání |
| Částice | 4 druhy (prach, zlatá jiskra, akcentová jiskra, větrná čárka), velikost × min(1, zoom) | zůstávají (01-papiry: vypnout, otevřené) |
| Prostředí | „on twos“ 12 kreseb/s, kamera a vlaštovka plynule | prostředí zamrzne |
| Výsledek | po dopadu 850 ms | 300 ms |

Pravidla:
- **Efekt je odměna za výkon, ne kulisa** (svět §1, Kao 2024). Velikost efektu: vypuštění < úspěch < perfekt < milník. **S4.**
- **Vlaštovka a kamera plynule, prostředí „on twos“.** Komiksový rytmus nesmí zhoršit čitelnost letu. **S1, S2.**
- **Rychlostní čáry neprocházejí vlaštovkou.** Dnes jsou rozhozené po celé obrazovce a mohou přejet přes vlaštovku (`desktop-let-1-suburbs.jpg`). **Pravidlo:** vynechat pás ±24 px kolem vlaštovky. Čáry jsou `paper` s tenkou `ink` linkou (jako `palette.speed.ink`). **S1.**
- **Barva efektu = role** (kap. 2.2): zlaté jiskry jen pro odměnu, azurové pro úspěch, magenta pro perfekt. **S4.**
- **Reduced motion: zpětná vazba zůstává, pohyb mizí.** Hitstop, barva popupu a stopa zůstávají; otřes, zoom, záblesk, rychlostní čáry a pohyb popupů ne (`.claude/rules/render3d.md`). **S1.**
- **Blikání:** max. 3 záblesky/s na velké ploše, žádný velký červený záblesk, maják jako měkký kužel (svět §1). **S1.**

---

## 7. UI a 2D grafika

**Dnes existují tři UI „nářečí“ a zbytek čtvrtého:**

| | Kde | Podklad | Akcent | Písmo | Rámy |
|---|---|---|---|---|---|
| 1 „Neon District“ | `style.css` (hra, `bonus.html`) | `#090d1b`, radiální `#302044` | azurová `#66f7ef`, magenta stín `#8d3e83` | Segoe UI, monospace (navigace, výsledek) | hranaté, 1–2 px, tvrdý stín 4–5 px |
| 2 Atlas | `prototype/atlas/atlas.css` (spec `research/atlas/02-design-spec.md` §3) | `#1b1444`, panely `#251c57` | `gold`, barvy čtvrtí jen v grafice | Bahnschrift Condensed (nadpisy), Bahnschrift / Segoe UI (text), tabulková čísla | 3 px `ink`, rádius 6, stín 4 px `ink` |
| 3 Papíry | `archiv/prototype-papers.html` | světle levandulová stránka s tečkami | `gold` | těžké zúžené písmo | 3 px tuš, tvrdý stín (`papiry-prototyp.png`) |
| zbytek | `style.css` základ, `<meta theme-color #162e32>`, mířicí panel `palette.aim.panel #203b3e` | tmavě zelenomodrá | zlatá `#f2ce87` | | z původní zelené verze, ve snímku `desktop-mireni.jpg` panel „Aim and hold“ zelený |

Plus 2D styly `paper`, `blueprint`, `dusk` v `style.css` (`body[data-theme]`), které se smažou s 2D (06, 14. 10.). Uložený styl `dusk` v prohlížeči se ve 3D neprojeví (přepínač jen ve 2D).

**Pravidlo (rozhodnutí 06, 14. 10.; S4, S2): jedno UI pro celou hru na tokenech Atlasu** (indigo `#1b1444`, Bahnschrift, rámy 3 px tuš, bez monospace). Je nejpromyšlenější (měřené kontrasty, tvar místo barvy, 44–48 px cíle) a navazuje na pohlednice. `style.css` se převede na tokeny Atlasu (`--night`, `--plate`, `--plate2`, `--ink`, `--text`, `--dim`, `--mute`, `--coin`, `--focus`, `--ok`, `--d0–d3`, `--display`, `--body`, `--t-fast 150 ms`, `--t-mid 240 ms`, `--t-reveal 480 ms`, `--r 6px`, `--shadow 4px 4px 0 var(--ink)`), s jedinou úpravou: `--ink` = `#15101f` (dnes v Atlasu `#120a2a`, kap. 2.1). Zbytky zelené verze (`theme-color`, panel míření) a 2D styly zmizí. Kanvasová UI vrstva (`ui-layer.js`, popupy, štítky, mířidla) čte stejné barvy z `palette.js`.

Typografie:
- **Nadpisy, čísla, tlačítka:** `--display` (Bahnschrift Condensed → Avenir Next Condensed → Roboto Condensed → Arial Narrow), tučně, čísla `tabular-nums`. **Text:** `--body`. **Monospace nepoužívat** (dnes navigace, výsledek, popupy `palette.popup.font: monospace`, cedule `signTexture` `bold monospace`), protože nepatří k tištěnému komiksu. Cedule ve městě smí mít vlastní neonové písmo, ale jen zúžené bezpatkové. **S2.**
- **Tiskový posun** (barevný stín písma posunutý o 2–3 px, dnes logo, `#result h2` a Atlas karta čtvrti) jen u **jednoho** titulku na obrazovce. Na telefonu ve výsledku dnes posun ruší čitelnost titulku (`mobil-vysledek.png`). **S4.**

Prvky:
- **Rámečky:** 3 px `ink`, rádius 6 px, tvrdý stín 4 px `ink` (u pohlednic stín v barvě čtvrti). **Tlačítka:** min. 48 px (malé 44 px), stisk = posun 2 px a menší stín. **S2.**
- **Ikony:** jednobarevné tvary s `ink` obrysem 1,2–2 px, čitelné při 18 px. Stav nikdy jen barvou (tečky úrovní + text „Level 2 of 3“). **S1.**
- **Komiksové bubliny** (hlášky postav, Bolts): bílá `paper`, obrys `ink` 2,5 px, ocásek k postavě, text `--body` `ink`. Jedna bublina na obrazovce. **S2, S4.**
- **Pohlednice Atlasu:** podle `02-design-spec.md` §1 a `art.js`: rám, bílý vnitřní okraj, tvrdý stín v barvě čtvrti, tuš 2,5, posterizované nebe, půltón jen ve stínu dominanty, každá čtvrť má jiný vzor v přechodu nebe (výjimka kap. 3) (tečky / šikmé čáry / vodorovné pásy / mřížka). Ve fázi 2 (snímky z 3D) musí snímek projít stejným rámem a barvy čtvrti brát z `mood.js` (kap. 2.3). **S2, S3.**
- **HUD ve scéně:** malé verzálky popisků + velká čísla, na tmavém přechodu. Dnes HUD čísla azurová `#78fff3` a na telefonu popisky 7–8 px (`style.css` `@media(max-width:450px) .hud span{font-size:7px}`). **Pravidlo:** popisky min. 10 px `--dim`, čísla `--text`, odměna (mince) `gold`; azurová je role „úspěch“, ne barva HUD. **S1, S4.**

---

## 8. Pravidla pro nové prvky (kontrolní seznam)

Před předáním nového vizuálního prvku (budova, postava, efekt, ikona, obrazovka) ověř:

1. **Silueta:** čitelná v malém (zmenšit na 25 % a převést do šedi). Dominanta místa poznat do 1 s. (S2, S4)
2. **Paleta:** jen tokeny z kap. 2.1 a barvy čtvrti z `mood.js` / `palette.js`. Žádné nové hex ručně v souboru; nová barva = nový token v `palette.js` se jménem role. (S3)
3. **Obrys:** `ink`, tloušťka podle kap. 3 (2,5 / 1,7, vlaštovka ≥ 2,6). (S2)
4. **Půltón:** jen na stínové straně, ne na vlaštovce, stopě, QTE a textu. (S1, S2)
5. **Hierarchie:** nepoužívá barvu stopy, papíru ani `gold`, pokud to není odměna. Ve výšce letu nemá velké světlé plochy. (S1)
6. **Kontrast:** text ≥ 4,5 : 1, grafika a ikony ≥ 3 : 1, vlaštovka podle „dvojí hrany“ (kap. 5). Změřit, ne odhadnout.
7. **Rozpočet:** na místo nejvýš 14 draw calls a 15 tis. trojúhelníků, scéna ≤ 120 draw calls; nic nealokovat ve snímku; vše `dispose` (`.claude/rules/render3d.md`).
8. **Pohyb:** varianta pro reduced motion (pohyb pryč, informace zůstane), blikání ≤ 3 Hz.
9. **Telefon:** vypadá dobře při 375 × 667 a 932 × 430 (snímek přiložit).
10. **Text:** každý hráčský text přes i18n (EN i CS), délka CS ověřená.

---

## 9. Ano / ne (příklady)

| Kap. | Ano | Ne |
|---|---|---|
| 1 Pilíře | `desktop-let-2-docks.jpg`: světlá vlaštovka jasně proti tmavé noci (7,5 : 1) | `desktop-let-3-horizon.jpg`: vlaštovka lososová, splývá s oranžovým nebem (1,07 : 1) |
| 2 Paleta | `atlas-pohlednice.png`: každá čtvrť má jasnou dvojici barev a jednu tuš | `src/render3d/life3d.js`, `workshop.js`: desítky ručních hex mimo `palette.js` (35 odstínů azurové v projektu) |
| 3 Tvar | `atlas-pohlednice.png` řada 2: maják a jeřáby jako jasné siluety | `desktop-let-4-core.jpg`: vzdálené věže stejně hustě posázené okny jako popředí, silueta se ztrácí |
| 3 Půltón | `toon.js postPass` jen pod `shade` a `art.js` `ht-ink` jen ve stínu | `mobil-dilna.png`: půltón přes celé město i nebe, obraz šumí |
| 4 Světlo | `mood.js` klíč 8 (druhý západ): světlo zezadu, dlouhé stíny | `desktop-let-4-core.jpg`: světlo `#d08aff` barví papír do modrofialové |
| 5 Hierarchie | `desktop-let-detail.jpg`: QTE „Get ready“ na tmavém štítku | `desktop-let-detail.jpg`: růžový kouř z komínů ve výšce letu vedle růžové stopy a vlaštovky |
| 6 Efekty | `fx-map.js speedLineCount`: počet čar poctivě podle rychlosti | `desktop-let-1-suburbs.jpg`: čára přejíždí přes vlaštovku |
| 7 UI | `prototype/atlas/atlas.css` tokeny a 48 px tlačítka | `desktop-mireni.jpg`: zelený panel míření `#203b3e` z původní verze; `desktop-vysledek.jpg`: monospace a jiné rámy než Atlas |

---

## 10. Rozhodnutí a otevřené otázky

Rozhodnuto 14. 10. 2026 (`06-rozhodnuti.md`, „Ke stylové bibli“, vše podle doporučení):
1. Pilíře: varianta A „Cesta za sluncem“ (kap. 1).
2. Paleta: varianta A, uklizená dnešní (kap. 2.5).
3. Jedno UI pro celou hru na tokenech Atlasu (kap. 7).
4. Perfekt je vždy magenta, zlatá znamená jen hodnotu (kap. 2.2).
5. Pás obzoru Neon Core: tyrkysová `#2aa99c` → `#7ff0d8` (kap. 2.3).
6. Půltón jen ve stínech budov (kap. 3).

Otevřené: zatím nic. Nová otázka ke vzhledu se zapisuje sem a jde k uživateli přes orchestrátora (`BLOCKED:`).

---

## 11. Rozpory kód × bible (souhrn)

| # | Rozpor | Kde | Co platí (podle bible) |
|---|---|---|---|
| R1 | 4 různé tuše (`#15101f`, `#07051a`, `#0b1935`, `#120a2a`) | `comic.js`, `toon.js`, `palette.js`, `art.js` | jedna `ink #15101f` |
| R2 | 35 odstínů azurové, 19 magenty | `src/render3d/*.js`, `style.css` | tokeny `cyan`, `magenta` (kap. 2.1) |
| R3 | perfekt magenta (QTE) × zlatá (popup) | `palette.qte`, `palette.popup`, `palette.particles` | perfekt magenta všude, zlatá jen hodnota |
| R4 | `VERSE[0]` tyrkysové ráno × `mood.js` fialový soumrak | `comic.js` | `mood.js` platí, `VERSE` sladit nebo smazat s 2D |
| R5 | barvy čtvrtí v Atlasu (svět §2.2) × 3D (`mood.js`) | `prototype/atlas/art.js PAL` | `mood.js` je zdroj, Atlas z něj čte |
| R6 | zelené budovy v Docks a Suburbs | `scene.js cityColors`, `palette.city` | zkontrolovat mísení, zelená mimo paletu |
| R7 | tloušťka obrysu z `comicLook` se nepoužije | `comic.js` × `scene.js` | jedno místo pravdy (palette / comicLook) |
| R8 | vlaštovka tónovaná světlem ~50 % (Horizon lososová, Core modrá) | `plane.js` `MeshToonMaterial` + světla | tónování ≤ 20 %, výplň bílá |
| R9 | stopa nečitelná v Horizon (1,46) a Core (1,01) | `mood.trail`, `plane.js` trail | tušový lem ≥ 1 CSS px |
| R10 | půltón pokrývá celé tmavé město a nebe | `toon.postPass shade .42` | jen ve stínech budov (maska), všude jinde nic |
| R11 | rychlostní čáry přes vlaštovku | `fx-map.speedLines` | vynechat pás kolem vlaštovky |
| R12 | tři UI nářečí + zbytek zelené verze (`theme-color #162e32`, panel míření `#203b3e`, `#f2ce87`) | `style.css`, `index.html`, `palette.aim` | jedno UI na tokenech Atlasu |
| R13 | monospace v UI a ceduli | `style.css`, `palette.popup.font`, `toon.signTexture` | `--display` / `--body` |
| R14 | barvy natvrdo mimo `palette.js` (komentář v `palette.js` tvrdí opak) | `life3d.js`, `workshop.js`, `scene.js` (měsíc `#ffe3f4`, slunce, hvězdy) | přesunout do `palette.js` |
| R15 | `PLANE_SCALE` 6,5 (`plane.js`) × 7,75 (`scene.js`) | `plane.js`, `scene.js` | jedno číslo (dnes platí 7,75) |
| R16 | HUD popisky na telefonu 7–8 px | `style.css` | min. 10 px |
| R17 | Atlas prototyp 14. 10. odpoledne nešel spustit (`content.js` bez exportu `UI`), rozpracovaný | `prototype/atlas/` | jen informace pro product-designera, ne stylový rozpor |
| R18 | limetkový obzor Neon Core `#cce65a` / `#d2ee48` | `mood.js` klíče 12–15, `comic.VERSE[3]`, `art.js PAL[3]` | tyrkysová `#2aa99c` → `#7ff0d8` (rozhodnutí 06) |

Plán oprav s vlastníky, dávkami a kritérii ověření: `research/design/03-styl-implementace.md`.
