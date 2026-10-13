# Techniky animací a renderování pro 4 vizuální styly hry "Just Throw It" (Canvas 2D)

Poznámka k metodě: Proběhlo zhruba 16 vyhledávání a stažení stránek. Primárních zdrojů s konkrétními čísly je málo. GDC talky (Nesbitt, Ferrari 2016) nebyly nalezeny jako přepis, takže tvrzení o nich jsou v Gaps. Řemeslné postupy bez zdroje jsou uvedeny jen v Inferences jako návrh implementace.

## 1) Kyberpunk pixel: omezený frame rate, snapping, color cycling, glow, déšť, CRT

### Takeaway
Nejlevnější a nejautentičtější kroky jsou tři. Zaprvé animovat sprity a ambient na 8–12 fps, zatímco pohyb kamery a letadla zůstane na 60 fps. Zadruhé snapovat všechny pozice na celé pixely (floor, ne round). Zatřetí použít color cycling nebo jeho canvasovou obdobu: přebarvování jen předpočítaných „animovaných“ pixelů. Glow dělat předkreslenými pixely nebo additivní vrstvou, ne `filter: blur` za běhu. Déšť jako 4snímkovou smyčku 1px čar s dopadovými kroužky.

### Cited Findings
- Color cycling (Mark Ferrari, Living Worlds): všechny efekty vody a ohně jsou „one single flat image with one 256 color palette“, bez vrstev a alfa kanálů. Scény byly IFF/ILBM z Deluxe Paint. — [80.lv: Color cycling from the 90s returns with HTML5](https://80.lv/articles/color-cycling-from-the-90s-returns-with-html5)
- Ferrariho varianta „BlendShift“: barvy v cyklu se při posunu prolínají, takže vznikají mezisnímky při stejné rychlosti cyklu. Vypadá to plynuleji a působí to dojmem více barev. — [80.lv](https://80.lv/articles/color-cycling-from-the-90s-returns-with-html5)
- Canvas implementace (Joseph Huckaby / Effect Games): indexovaný obraz 640×480 se v reálném čase renderuje do 32bit canvasu. Optimalizace: při načtení se najdou pixely používající animované indexy palety a jejich offsety se uloží do menšího pole, takže se každý snímek přepisují jen ty. Data jsou v JSON, gzip asi 100 KB na scénu. Demo: effectgames.com/demos/canvascycle/ — [80.lv](https://80.lv/articles/color-cycling-from-the-90s-returns-with-html5); autorství Huckabyho potvrzuje [TheNextWeb](https://thenextweb.com/shareables/2010/07/29/color-cycling-done-awesome/)
- Repo a demo Living Worlds se dál používají a portují (např. na F256K), technika žije v komunitě. — [tinkerdifferent.com](https://tinkerdifferent.com/threads/f256k-living-worlds.2757/); [Ian Gilman: Clockwork Goldfish Color Cycling](https://iangilman.substack.com/p/clockwork-goldfish-color-cycling)
- Frame rate pixel animace: 12 fps se uvádí jako standardní výchozí bod, 24 fps prý téměř nikdy není potřeba. Pozor, zdroj je výrobce hardwaru (Divoom), ne uznávaný umělec. — [Divoom: Pixel Art Animation FPS 8 vs 12 vs 24](https://divoom.com/blogs/setup-ideas/pixel-art-animation-frame-rate)
- Timing je důležitější než počet snímků: klíčové (impact) snímky držet déle a nádechy krátce. Začít s menším počtem snímků. Aseprite umožňuje nastavit dobu držení každého snímku. — [Sprite AI: pixel art animation](https://www.sprite-ai.art/blog/pixel-art-animation); [Sprite AI: sprite animation frames](https://www.sprite-ai.art/fr/blog/sprite-animation-frames)
- Sub-pixel jitter: „pixel-perfect implikuje a vyžaduje jitter“, dá se jen zmírnit. Kamera se kvantizuje na pixelovou mřížku. U GameMakeru se doporučuje `floor()` místo `round()`, protože rounding střídavě skáče mezi sousedními pixely a dělá 1px shimmer. Neceločíselné škálování rozmazává a vrací shimmer. Snapping je nejviditelnější při pomalém pohybu. — [bugnet: fix pixel perfect camera jitter](https://bugnet.io/blog/how-to-fix-pixel-perfect-camera-jitter); [bugnet: GameMaker view jitter](https://bugnet.io/blog/fix-gamemaker-view-following-player-jittering); [Unity discussions](https://discussions.unity.com/t/smooth-looking-pixel-art-in-motion/907566); [Godot forum](https://forum.godotengine.org/t/smooth-camera-in-pixel-perfect-game/112586?page=2)
- Hybrid: snapovat jen popředí a pozadí nechat sub-pixelově hladké (Godot: vše 4× větší, popředí snapované na násobky 4). — [Godot forum: sub-pixel camera](https://forum.godotengine.org/t/how-to-set-up-smooth-sub-pixel-camera-movement-for-pixel-art-games/38765)
- Pixel déšť: 4snímková smyčka, 1px šikmé čáry se stálým sklonem, posun o několik px za snímek, wrap nahoru s jiným X. Dopadové kroužky (splash) na zemi, jinak déšť „nepatří“ do prostředí. — [BudgetPixel: rain and reflections in 4 frames](https://budgetpixel.com/blog/how-to-animate-pixel-art-rain-and-reflections-in-4-frames)
- Neon glow (obecný digitální postup): základní tvar, vnitřní glow a vnější bloom. Glow v režimu Screen (aditivní světlo), stíny v Multiply. — [návod neon effect](https://cloud.motorsport.unibo.it/article/how-to-draw-neon-effect-the-art-of-glowing-digital-mastery) (zdroj nízké kvality)
- Katana ZERO: komentář k oficiálnímu artu uvádí paletu 4–6 barev od nejtmavší fialové po nejsvětlejší oranžovou. Fanouškovská hra inspirovaná Katana ZERO popisuje look jako modrou, fialovou a růžovou v mnoha odstínech. — [CUNY OpenLab (studentský komentář)](https://openlab.citytech.cuny.edu/schoenbrun-3313fa2021/author/alexg13/page/4); [calebstudios devlog](https://calebstudios.itch.io/neo-samurai-mommy-issues/devlog/324311/development-log-playtests-art-and-design)
- Slynyrd (Raymond Schlitter) vede číslovaný „Pixelblog“ s tutoriály (prostředí, tilesety, animace), pracuje v Aseprite. — [slynyrd.com/about](https://www.slynyrd.com/about)

### Inferences
- **Dvě časové osy.** Globální `animTick = Math.floor(t * 10)` (10 fps) řídí blikání neonů, střídání snímků a fáze deště. Pohyb letadla a parallaxu jede na 60 fps. Současné `sin(t)` oscilace kvantizovat: `sin(Math.floor(t*10)/10 * w)`. Tím se ztratí „vektorová hladkost“, která v pixel artu působí nepatřičně.
- **Snapping.** Všechny `fillRect` a `drawImage` s `Math.floor(x - camX)`. Kameru snapovat také. Vzdálené parallax vrstvy s rychlostí < 1 px/snímek snapovat stejně (floor), protože jinak „stepují“ nepravidelně. Sledovat, zda to při malé rychlosti nevadí. `ctx.imageSmoothingEnabled = false`.
- **Bez mixelů.** Nekreslit nic ve vyšším rozlišení než 640×360 (žádné tenké čáry 0,5 px, žádné rotace spritů o libovolný úhel). Rotaci letadla řešit předkreslenými sprity pro např. 8–16 úhlů.
- **Color cycling v Canvas 2D levně.** Nejde o skutečnou indexovanou grafiku. Okna, neonové nápisy a vodu v docích kreslit barvou vybranou z malé palety přes `pal[(i + animTick) % n]`. Vznikne „cyklus“ (pás světel bežící po billboardu, vlny ve vodě, blikající okna). Pro offscreen statické pozadí lze použít Huckabyho trik: pixely s „animovaným indexem“ uložit do seznamu a jen je přepisovat přes `ImageData`.
- **Glow.** Předkreslit glow jednou do offscreen canvasu (2–3 soustředné obrysy s klesající alfou nebo dithered halo) a pak jen `drawImage` s `globalCompositeOperation = 'lighter'`. `ctx.filter = 'blur()'` ani `shadowBlur` za běhu nepoužívat: drahé a rozmaže pixely.
- **Mokrá ulice.** Odraz = pod linií ulice překreslit neonové prvky zrcadlově (`scale(1,-1)`), s nízkou alfou a horizontálním „rozřezáním“ na 1–2px pruhy posunuté o ±1 px podle `animTick` (vlnění). Dithered přechod lze udělat šachovnicí 2×2.
- **CRT/scanlines.** Předkreslený overlay pattern (každý druhý řádek ve výsledném upscalovaném rozlišení černý s alfou ~0,15–0,25), přidaný přes CSS overlay nebo `createPattern`. Vinětaci kreslit jednou do offscreenu. Chromatickou aberaci a zakřivení obrazu bez WebGL nedělat.

### Gaps
- Nenalezen primární zdroj ke GDC 2016 talku Marka Ferrariho („8-bit & 8-bitish Graphics Outside the Box“) s konkrétními rychlostmi cyklů. Číselné rychlosti cyklů nejsou v nalezených zdrojích.
- Nenalezeny autorské breakdowny renderingu deště a odrazů v Katana ZERO, The Last Night ani VA-11 Hall-A (Askiisoft, Odd Tales, Sukeban). Vše výše je obecný postup.
- Konkrétní tutoriály saint11 (Pedro Medeiros) a Slynyrd o glow a timingu nebyly přímo načteny. Dostupné jsou na saint11.org a slynyrd.com/blog.
- Výraz „mixels“ ve vyhledávání nenarazil na zdroj.

## 2) Papírová koláž: stop-motion „boiling“, kloubové loutky, vrstvy se stíny, textura

### Takeaway
Autentický papírový pocit dává hlavně (a) nízký „stop-motion“ frame rate pro ambient (na dvojky nebo trojky, tj. kolem 8–12 fps), (b) náhodný mikro-jitter pozice a rotace přegenerovaný jen při každém novém „snímku“, (c) tvrdé offsetové stíny, které se mění s výškou vrstvy, a (d) textura papíru jako předkreslený pattern. Nalezené zdroje k těmto věcem jsou slabé. Nintendo popisuje hlavně koncept (fyzické origami makety), ne rendering.

### Cited Findings
- Paper Mario: The Origami King: tým vyráběl skutečné papírové origami modely postav. Cílem byl vzhled kombinující realistické origami s potřebou se hýbat a vyjadřovat emoce. Producent Tanabe hledal papírové nápady, které série ještě nepoužila (origami, konfety). — [VGC interview](https://videogameschronicle.com/features/interviews/paper-mario-origami-king); [GameLuster](https://gameluster.com/paper-mario-creative-team-talk-the-origami-king/)
- „Animace na dvojky“: každá kresba se drží 2 snímky. Při 24 fps to dává 12 unikátních kreseb za sekundu, při 12 fps jen 6. „Boil“ = obrysy a tahy, které se mezi snímky jemně mění. Pozor: nalezené zdroje jsou jen AI promptové stránky, které pojmy částečně zaměňují. — [youmind stop-motion prompt](https://youmind.com/prompts/video/stop-motion) (zdroj nízké kvality)

### Inferences
- **Stop-motion takt.** `stepT = Math.floor(t * 12) / 12` (na dvojky při 24 fps; pro „hrubší“ stop-motion 8 fps). Všechny ambientní sway a bob počítat z `stepT`, ne z `t`. Parallax scroll nechat plynulý (ve skutečné stop-motion by trhal, ale ve hře by to unavovalo).
- **Boiling.** Na každý objekt deterministický seed. Pro každý stop-motion snímek `rnd(seed, frameIdx)` → posun ±0,5–1 px a rotace ±0,5–1°. Lze použít jen 2–3 varianty, které se cyklí (A, B, C, A…), což odpovídá ručnímu „boil“ cyklu z animace.
- **Kloubové loutky (South Park, Lotte Reiniger).** Ptáci, jeřáby a větrníky jako hierarchie dílů s pivoty (`save/translate/rotate/restore`). Úhly kvantizovat po krocích (např. 5°) a měnit je jen na stop-motion snímcích.
- **Stíny.** Stín = stejný tvar vyplněný `rgba(0,0,0,0.2–0.3)` posunutý o (dx,dy) úměrně „výšce“ vrstvy nad podkladem. Bližší vrstvy mají větší offset. Tvrdý stín bez rozostření je levný. Měkký stín předkreslit jednou do offscreenu.
- **Textura papíru.** Jednou vygenerovat šumovou texturu (např. 128×128 s náhodnými světlými a tmavými skvrnkami a vlákny) → `createPattern`. Vyplňovat s `globalCompositeOperation='multiply'` přes barevné plochy. Každá „látka“ (karton, balicí papír, novinový papír) má vlastní pattern a posun patternu, aby se neopakoval stejně.
- **Ohyby a sklady.** Plochu rozdělit diagonálou a jednu polovinu ztmavit o 5–10 % (origami fazeta). Pro „ruční střih“ přidat okrajům mírně nepravidelný polygon (předgenerovaný, ne každý snímek).

### Gaps
- Nenalezeny autorské informace k renderingu Tearaway, Lumino City (skutečný papír fotografovaný), Kirby's Epic Yarn ani k frame rate South Park nebo Lotte Reiniger. Typické hodnoty pro stop-motion (12 fps „na dvojky“ při 24 fps) jsou obecně známé, ale v této rešerši nejsou podloženy kvalitním zdrojem.

## 3) Technický výkres: line boil, kreslení tahu, Rough.js, konstrukční čáry

### Takeaway
Rough.js (MIT) umí kreslit „sketchy“ čáry do Canvas 2D s parametry `roughness` a `bowing`, ale za běhu je dražší. Vhodnější je předgenerovat několik variant (2–3) a cyklit je na ~8–12 fps, což dává „line boil“. Efekt „čára se kreslí“ jde v Canvas 2D udělat přes `setLineDash([L, L])` a animovaný `lineDashOffset` z L na 0.

### Cited Findings
- Rough.js: malá knihovna pro kreslení „sketchy, hand-drawn-like“ stylem, funguje s Canvas i SVG. Primitiva: line, curve, arc, polygon, circle, ellipse a SVG path. Volby `roughness` (míra jitteru) a `bowing` (prohnutí čar). Licence MIT, aktuální řada 6.0.x (JSR). Autor původního projektu je Preet Shihn. — [JSR @rough/roughjs](https://jsr.io/@rough/roughjs); [JSR 6.0.5 docs](https://jsr.io/@rough/roughjs@6.0.5/doc); [Yarn roughjs](https://classic.yarnpkg.com/en/package/roughjs)
- „Boil“ v animaci = obrysy, které se mezi snímky jemně mění („subtly alive frame to frame“). — [youmind](https://youmind.com/prompts/video/stop-motion) (zdroj nízké kvality)

### Inferences
- **Line boil bez knihovny.** Každou čáru kreslit jako polyline s 2–4 mezilehlými body. Každý bod posunout o šum ±0,5–1 px ze seedu `(id, boilFrame)`, kde `boilFrame = Math.floor(t*8) % 3`. Ve hře to stojí jen pár `lineTo` navíc.
- **Rough.js prakticky.** Používat `generator` API (rough.generator) k předgenerování „drawable“ objektů pro 3 seedy na objekt (Rough.js má volbu `seed`). Za běhu jen vykreslovat. Nové tvary negenerovat každý snímek. Ověřit volby `seed` a `generator` v aktuální dokumentaci.
- **Draw-on animace.** Pro objekt, který vjíždí do záběru: `ctx.setLineDash([len, len]); ctx.lineDashOffset = len * (1 - p)`, kde p jde 0→1 během ~0,5–1 s podle vzdálenosti od okraje obrazovky. Délku `len` cestu předpočítat (součet segmentů).
- **Konstrukční čáry a anotace.** Před nakreslením budovy zobrazit tenké přerušované vodítko (prodloužené za rohy o 4–8 px), kótu s šipkami a číslem (např. výška domu v „m“), a ty pak vybledne. Kompas-slunce nechat pomalu rotovat s kvantizací na kroky.
- **Šrafy místo výplní.** Stíny jako šrafování 45° (pattern předkreslený jednou). Mraky přerušovanou čárou s `lineDashOffset` pomalu posouvaným (efekt „pochodujících mravenců“).
- Obra Dinn je 1bit dither (jiný směr). Pro blueprint lze maximálně převzít uspořádaný (Bayer) dither pro tónování ploch dvěma barvami.

### Gaps
- Nebyly načteny zdroje k Line Rider, „doodle“ hrám ani Return of the Obra Dinn (Lucas Pope devlog o ditheringu je na forums.tigsource.com). Výkonnost Rough.js na snímek nebyla změřena ani nalezena.

## 4) Soumrak (Alto-like): gradienty, atmosférická perspektiva, dynamický čas dne, počasí

### Takeaway
Alto's Adventure stojí na několika odstínech jedné barvy na prostředí, vrstvách s klesajícím kontrastem k horizontu (atmosférická perspektiva) a plně dynamickém osvětlení a počasí: bouřky, sníh, mlha, padající hvězdy, duha po dešti, světlušky, rozsvícené domy v noci. Technický způsob implementace (shader vs. baked) není veřejně popsán v nalezených zdrojích. Pro Canvas 2D je vhodné interpolovat klíčové palety v OKLab (ne v OKLCH, ne v sRGB) podle fáze trasy.

### Cited Findings
- Alto's Adventure nabízí „fully dynamic lighting and weather effects“, výslovně bouřky, vánice, mlhu a padající hvězdy. — [altosadventure.com press kit](https://www.altosadventure.com/press/spiritofthemountain)
- V recenzích: ranní slunce svítí zezadu, odpoledne krajina zezlátne, v noci je terén skoro neviditelný a svítí okna domů. — [ZPlay: Alto's Adventure features](https://www.zplay.com/en/blog/204/31)
- Nesbitt dělal veškerou grafiku a měl plnou tvůrčí kontrolu. Cíl byl minimalistický „moving art“ look. Ve světě jsou dynamické světlo a počasí, duha po dešti a světlušky. — [80.lv: Alto's Adventure, a game with style](https://80.lv/articles/altos-adventure-a-game-with-style)
- Hra používá jen hrstku odstínů na vyjádření nálady, počasí a krajiny. — [Design Milk](https://design-milk.com/altos-adventure-keeps-simple/)
- Sekundární analýza: krajiny z jednoduchých geometrických tvarů, odstíny jedné barvy pro pocit tepla a chladu, omezená paleta na oblast, tmavnoucí gradienty pro záři slunce a měsíce. Popředí má čistší barvu, pozadí je tónované. — [Ulster blog o Nesbittovi](https://blogs.ulster.ac.uk/cormacmccann/?p=794) (studentský blog, ne Nesbitt sám)
- Nesbitt: přitahuje ho minimalistický a impresionistický přístup. V Odyssey si hraje s hranicí minimalismu a surrealismu. — [MacStories](https://www.macstories.net/?p=194895); [Game Developer: Road to the IGF](https://www.gamedeveloper.com/business/road-to-the-igf-team-alto-s-i-alto-s-odyssey-i-)
- Nesbitt sepsal post „The Making of Alto's Adventure“ s podrobnostmi o vývoji (zmiňuje ho Ryan Cash). Inspirace Tiny Wings. Release iOS únor 2015. Nesbitt byl keynote NZGDC 2018. — [ryancash.net](https://ryancash.net/tagged/Alto); [NZGDA](https://nzgda.com/news/first-keynote-speaker-for-nzgdc18-announced)
- OKLab (Björn Ottosson, 23. 12. 2020) je percepčně uniformní prostor navržený mj. pro míchání barev a gradienty, od 2021 v CSS Color 4 a 5. Interpolace v OKLab jde „po přímce“. V OKLCH může hue jít po kruhu mimo sRGB gamut. Tailwind v4 nakonec zvolil OKLab jako bezpečnější výchozí volbu. Postup: převést do OKLab, lineárně míchat, převést zpět do sRGB. — [Wikipedia: Oklab](https://en.wikipedia.org/wiki/Oklab_color_space); [HN diskuse](https://hn.svelte.dev/item/45010876); [Bill Mill: interactive review of Oklab](https://notes.billmill.org/visualization/interactive_explainers/An_interactive_review_of_Oklab.html)
- Protipohled: gradienty v lineárním sRGB nejsou automaticky lepší. — [Aras Pranckevičius](https://aras-p.info/blog/2021/11/29/Gradients-in-linear-space-arent-better/)

### Inferences
- **Čas dne podél trasy.** Pro 16 míst definovat 4–6 klíčových palet (zlatá hodina → západ → modrá hodina → noc) s barvami: obloha nahoře a u horizontu, slunce, hřebeny 1–4, mlha. Paletu interpolovat v OKLab podle pozice na trase. Výsledek cachovat (přepočítat jen při změně o >0,5 %), protože `createLinearGradient` každý snímek je levný, ale převody barev ne.
- **Atmosférická perspektiva.** Barva hřebene i = `mix(barvaHřebene, barvaMlhy, k_i)`, kde k roste se vzdáleností (např. 0,15/0,35/0,55/0,75). Rychlost parallaxu klesá se vzdáleností. Mezi hřebeny kreslit horizontální pásy mlhy (gradient s alfou 0→0,4→0), pomalu driftující.
- **Slunce a paprsky.** Velký kruh plus 2–3 předkreslené radiální gradienty (glow) s `'lighter'` nebo `'screen'`. Paprsky jako trojúhelníky s nízkou alfou, pomalu rotující, předkreslené do offscreenu.
- **Noc.** Hvězdy předgenerované, mrkání = alfa ze `sin` s náhodnou fází. Padající hvězda náhodně každých 8–20 s jako úsečka s gradientovým ohonem. Světlušky jako 1–2 px body s Perlinovým nebo sin driftem a pulzující alfou. Okna domů se rozsvěcují postupně s náhodným zpožděním, když fáze dne překročí práh.
- **Odraz na vodě (doky, most).** Překreslit krajinu nad hladinou zrcadlově se ztmavením a horizontálními 1–2 px pruhy posunutými o `sin(y*0.3 + t)` (vodní vlnění). Kreslit jen pruhy (např. každý 2. řádek), aby to bylo levné.
- **Počasí.** Mlha = 2–3 velké poloprůhledné vrstvy. Bouřka = záblesk celé obrazovky (bílá alfa 0,6→0 během 150–300 ms) s krátkým zesvětlením siluet.

### Gaps
- Nenalezen přepis ani slajdy GDC talku Harryho Nesbitta. Nenalezen ani text „The Making of Alto's Adventure“. Způsob implementace dynamického světla v Alto (shader, Unity) zůstává neznámý.
- Monument Valley a Journey nebyly zkoumány.

## 5) Napříč styly: parallax, popředí blízko kamery, globální vítr, čas dne

### Takeaway
Ve zdrojích je nejlépe podložen čas dne a počasí jako hlavní nositel „živosti“ (Alto) a malá paleta s jasnou separací popředí a pozadí. Ostatní body (vítr jako sdílený signál, okludéry v popředí) jsou osvědčená řemeslná praxe, pro kterou jsem nenašel primární zdroj s čísly.

### Cited Findings
- Popředí s čistší barvou a tónované pozadí je hlavní prostředek hloubky v Alto. — [Ulster blog](https://blogs.ulster.ac.uk/cormacmccann/?p=794) (sekundární)
- Dynamické počasí (bouřky, sníh, mlha) a čas dne jako klíčová vlastnost „živého světa“. — [Alto press kit](https://www.altosadventure.com/press/spiritofthemountain); [80.lv](https://80.lv/articles/altos-adventure-a-game-with-style)
- Při pixel-perfect renderingu je nutné rozhodnout, které vrstvy snapovat. Hybrid (snapované popředí, hladké pozadí) je běžný kompromis. — [Godot forum](https://forum.godotengine.org/t/how-to-set-up-smooth-sub-pixel-camera-movement-for-pixel-art-games/38765)

### Inferences
- **Globální vítr.** Jedna funkce `wind(t) = base + gust`, kde `gust` je pomalý šum (součet 2–3 sinů s nesoudělnými periodami, např. 7,3 s, 11,1 s a 17,9 s). Řídí úhel deště, sklon kouře, sway stromů a jeřábových lan, rychlost mraků i rotaci větrníků. Hodnota se aplikuje se zpožděním podle X (`wind(t - x/200)`), takže poryv „přejíždí“ scénou. Ve stylech s nízkým fps (pixel, papír, blueprint) se výsledek kvantizuje na stylový takt.
- **Okludéry v popředí.** Občas (např. každých 5–15 s podle místa) projede těsně před kamerou rozmazaný nebo tmavý prvek (drát, větev, lampa, jeřábové lano, pták) s parallax faktorem 1,3–2× rychlejším než herní vrstva. Siluetu kreslit bez detailů: v soumraku jako tmavou siluetu, v blueprintu jako tlustší čáru, v papíru s velkým stínem.
- **Více vrstev a různé rychlosti.** Minimálně 4–5 vrstev (obloha, daleké hory nebo město, střední, herní, popředí), faktory např. 0,05/0,2/0,45/1,0/1,6. Haze (mix k barvě oblohy) se zvyšuje se vzdáleností ve všech stylech, jen v pixel stylu přes výběr z palety místo alfa míchání.
- **Čas dne podél trasy.** 16 míst rozdělit do fází (začátek odpoledne → zlatá hodina → západ → modrá hodina → noc s majákem a observatoří → svítání u vysílací věže a přístavu). Vhodné tematicky: maják a observatoř v noci. Pro každý styl je to jiná paleta, ale stejná fáze.
- **Jednotný „stylový takt“.** Pixel ~10 fps, papír 8–12 fps s boilem, blueprint boil 8 fps, soumrak plynulých 60 fps. Herní pohyb (letadlo, kamera) vždy 60 fps.
- **WebGL není nutné** pro nic z výše uvedeného. WebGL by bylo potřeba jen pro skutečný bloom nebo blur za běhu, zakřivený CRT s chromatickou aberací, per-pixel distorzi vody a skutečnou paletovou indexaci celé obrazovky s velkým rozlišením.

### Gaps
- Nenalezeny primární zdroje (GDC, postmortemy) ke globálnímu větru jako sdílenému signálu ani k frekvenci okludérů v popředí. Čísla v Inferences jsou návrhy k ladění, ne převzatá data.
