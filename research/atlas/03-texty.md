# Atlas: texty EN a CS (klíč → text)

**Stav 2026-10-14, product-designer (A1, doplněna CS podle 06 „Atlas A1, čeština“).** Zdroj pravdy je `prototype/atlas/content.js`, tahle tabulka je z něj vygenerovaná (`node prototype/atlas/gen-texty.mjs`, logika v `prototype/atlas/texty.js`; ručně neupravovat). Vývojář klíče přenese do `src/locales/en.js` a `cs.js` (stejné klíče a parametry, plurály `{one,other}` / `{one,few,many,other}` přes `count`) a ID do `src/atlas-content.js`. ID bonusů = `simulation/progression/params.mjs` `atlas.bonuses`. Prototyp: `prototype-atlas.html?lang=cs` (výchozí EN, přepínač i v ovládání prototypu).

Pravidla:
- `{token}` = dosazení. Čísla jen přes formátovače podle jazyka (prototyp `fmtCoins` / `fmtMeters` / `fmtPct`, ve hře `num` / `unit` / `pct` ze `src/i18n.js`): EN `1,240 m`, `+1.4 %`, `1.2M ◈`; CS `1 240 m`, `+1,4 %`, `1,2 mil. ◈`. Před jednotkou nedělitelná mezera.
- Vzdálenosti, ceny, úrovně a časy nikdy v textu napevno (`.claude/rules/atlas.md`): práh prvního místa je `{m}` z `placeStart(0)`, zpoždění Echa `{delay}` z `params.mjs` `echo.delay`.
- Šablona účinku je pole vět. Věta s podmínkou se ukáže, jen když má daná úroveň hodnotu (`{if:'push'}`). Jednotky tokenů jsou v Pozn.
- Seznamy (`{list}`) skládá `Intl.ListFormat` podle jazyka („A and B“ / „A a B“), ne ručně psaná spojka.
- Čeština: oslovení „ty“ jako ve hře (`cs.js`). Bez rodu hráče (žádné „doletěl jsi“): podmětem je vlaštovka, nebo přítomný či budoucí čas („Vlaštovka doletěla až sem“, „až tam doletíš“). Jména čtvrtí a míst stojí v 1. pádě (za dvojtečkou, „dál než {place}“, „ve čtvrti {district}“), aby se nemusela skloňovat. Jména postav (Bolts, Marge, Stella, Zippy) se nepřekládají. Termíny podle `cs.js`: Dílna, vlaštovka, Kluzák, mince, rekord, hod, let, perfektní, poryv, holub, Termika, Padající hvězda; „kombo“, nikdy „série“.
- Tón: suchý, laskavý, nikdo nepřemlouvá k hraní (08 §7, KB 02 N10, P13).

Zkontrolováno skriptem: 322 klíčů v EN i CS se stejnými parametry a plurály; 16 teaserů ≤ 90 znaků (nejdelší EN 73, CS 69); žádná zakázaná formulace v žádném jazyce (EN: `last chance`, `hurry`, `don't lose`, `streak`, `daily`, `limited`, `only now`, `miss out`, `come back`; CS: `poslední šance`, `pospěš`, `pohni si`, `nepřijď o`, `neztrať`, `série`, `denní`, `každý den`, `omezen`, `jen teď`, `pouze teď`, `jen dnes`, `nenech si ujít`, `vrať se`, `přijď zpátky`, `přijď znovu`); 420 šablon účinku (2 jazyky × 3 i 12 úrovní) má hodnotu pro každý token; všechny klíče dosadí všechny parametry; ID bonusů = `params.mjs`.

Delší čeština v ovládacích prvcích (CS > 1,3 × EN, ověřeno v prototypu na 360 px): `button.max` (9 → 15), `pocket.moreIn` (18 → 26), `button.more` (10 → 14). Nejdelší tlačítka v CS: „Navíc se otevře: {paper} v Dílně“, „Vrátit · do dalšího hodu“, „Otevřít kapsu · {price}“, „Odemknout · {price}“, „Vylepšit · {price}“.

## 1. Místa: jména, teasery (≤ 90 znaků), příběhy

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `place.roofs.name` | Workshop & First Roofs | Dílna a první střechy | čtvrť 1, bonus `glider` |
| `place.roofs.short` | First Roofs | První střechy | krátké jméno do řádku cíle |
| `place.roofs.teaser` | Clear the first roofs. A second plane is pinned to the workshop wall. | Přeleť první střechy. Na zdi dílny visí připíchnutá druhá vlaštovka. | EN 69 / CS 68 znaků |
| `place.roofs.story` | From the workshop window, you set off over a sleeping street. | Z okna dílny vyrážíš nad spící ulici. | příběh = `src/locales/*.js` `place.*.story` |
| `place.market.name` | Market under the Antennas | Tržnice pod anténami | čtvrť 1, bonus `chain` |
| `place.market.teaser` | Hundreds of people under the antennas, and none of them have cheered yet. | Pod anténami jsou stovky lidí a ještě nikdo z nich nezajásal. | EN 73 / CS 61 znaků |
| `place.market.story` | Past the houses, a square opens up with a night market. | Za domy se otevírá náměstí s noční tržnicí. | příběh = `src/locales/*.js` `place.*.story` |
| `place.gardens.name` | Gardens at the Edge | Zahrady na okraji | čtvrť 1, bonus `pinwheel`, papír `kraft` |
| `place.gardens.teaser` | Every garden here has a pinwheel. None of them agree on the wind. | Každá zahrada tu má větrník. Ani dva se neshodnou, odkud fouká. | EN 65 / CS 63 znaků |
| `place.gardens.story` | The roofs thin out. Gardens slide by under your wings. | Střechy řídnou, pod křídly zůstávají zahrady. | příběh = `src/locales/*.js` `place.*.story` |
| `place.railway.name` | Railway to the River | Železnice k řece | čtvrť 1, bonus `steam` |
| `place.railway.teaser` | The 21:14 puffs in a rhythm. Twice, a pause, twice again. | Vlak ve 21:14 funí v rytmu. Dvakrát, pauza, zase dvakrát. | EN 57 / CS 57 znaků |
| `place.railway.story` | You follow the tracks down to the first harbor pier. | Sleduješ koleje až k prvnímu přístavnímu molu. | příběh = `src/locales/*.js` `place.*.story` |
| `place.warehouses.name` | Warehouses by the Water | Skladiště u vody | čtvrť 2, bonus `tape` |
| `place.warehouses.teaser` | A whole warehouse of packing tape, and one crate marked FRAGILE. | Celé skladiště balicí pásky a jedna bedna s nápisem KŘEHKÉ. | EN 64 / CS 59 znaků |
| `place.warehouses.story` | The city fades behind you among the harbor warehouses. | Město za tebou mizí mezi přístavními sklady. | příběh = `src/locales/*.js` `place.*.story` |
| `place.cranes.name` | Crane Forest | Les přístavních jeřábů | čtvrť 2, bonus `crane` |
| `place.cranes.teaser` | A light in the tallest crane cab. Someone up there is having tea. | V kabině nejvyššího jeřábu svítí. Někdo si tam nahoře dělá čaj. | EN 65 / CS 63 znaků |
| `place.cranes.story` | You fly past cranes leaning over the cargo ships. | Prolétáš kolem jeřábů nad nákladními loděmi. | příběh = `src/locales/*.js` `place.*.story` |
| `place.bridge.name` | Bridge over the Bay | Most přes záliv | čtvrť 2, bonus `skip`, papír `washi` |
| `place.bridge.teaser` | Flat water under a long bridge. Perfect for skipping things. | Klidná voda pod dlouhým mostem. Jako stvořená na házení žabek. | EN 60 / CS 62 znaků |
| `place.bridge.story` | Along a long bridge, you cross the open water. | Podél dlouhého mostu překonáváš otevřenou vodu. | příběh = `src/locales/*.js` `place.*.story` |
| `place.lighthouse.name` | Lighthouse at the Pier's End | Maják na konci mola | čtvrť 2, bonus `gull` |
| `place.lighthouse.teaser` | The gulls under the lantern look like they know the way. | Rackové pod lucernou vypadají, že znají cestu. | EN 56 / CS 46 znaků |
| `place.lighthouse.story` | The lighthouse beam points the way to the far shore. | Světlo majáku ukazuje cestu k protějšímu břehu. | příběh = `src/locales/*.js` `place.*.story` |
| `place.fields.name` | Fields beyond the Bay | Pole za zálivem | čtvrť 3, bonus `momentum` |
| `place.fields.teaser` | Nothing out here to slow you down. Nothing at all. | Tady venku tě nic nebrzdí. Vůbec nic. | EN 50 / CS 37 znaků |
| `place.fields.story` | The harbor gives way to long strips of fields. | Přístav střídají dlouhé pásy polí. | příběh = `src/locales/*.js` `place.*.story` |
| `place.ridge.name` | Wind Ridge | Větrný hřeben | čtvrť 3, bonus `thermal` |
| `place.ridge.teaser` | Hawks circle over the ridge without flapping once. How? | Jestřábi krouží nad hřebenem a ani jednou nemávnou křídly. Jak? | EN 55 / CS 63 znaků |
| `place.ridge.story` | Wind turbines turn above the fields. | Nad poli se otáčejí větrné elektrárny. | příběh = `src/locales/*.js` `place.*.story` |
| `place.saddle.name` | Mountain Saddle | Horské sedlo | čtvrť 3, bonus `echo`, papír `neon` |
| `place.saddle.teaser` | A man with an alpine horn. The mountains always answer him. | Muž s alpským rohem. Hory mu vždycky odpovědí. | EN 59 / CS 46 znaků |
| `place.saddle.story` | The land rises into a rocky mountain saddle. | Krajina se zvedá do skalnatého horského sedla. | příběh = `src/locales/*.js` `place.*.story` |
| `place.observatory.name` | Observatory above the Valley | Observatoř nad údolím | čtvrť 3, bonus `star` |
| `place.observatory.teaser` | The telescope keeps following something gold across the sky. | Dalekohled pořád sleduje něco zlatého na obloze. | EN 60 / CS 48 znaků |
| `place.observatory.story` | Past the observatory, you first glimpse the lights of a distant city. | Za observatoří poprvé zahlédneš světla vzdáleného města. | příběh = `src/locales/*.js` `place.*.story` |
| `place.gates.name` | Gates of the Metropolis | Brány metropole | čtvrť 4, bonus `drone` |
| `place.gates.teaser` | Drones guard the gates. Mostly they guard ad space. | Brány hlídají drony. Hlavně ale hlídají reklamní plochy. | EN 51 / CS 56 znaků |
| `place.gates.story` | Down from the hills, you reach the gates of the neon metropolis. | Z kopců přilétáš k branám neonové metropole. | příběh = `src/locales/*.js` `place.*.story` |
| `place.terraces.name` | Sky Terraces | Zahrady ve výškách | čtvrť 4, bonus `paperCrane` |
| `place.terraces.teaser` | Hundreds of paper cranes on strings. One of them keeps looking at you. | Stovky papírových jeřábků na provázcích. Jeden se na tebe pořád dívá. | EN 70 / CS 69 znaků |
| `place.terraces.story` | You fly between terraces and hanging gardens. | Letíš mezi terasami a visutými zahradami. | příběh = `src/locales/*.js` `place.*.story` |
| `place.tower.name` | Broadcast Tower | Vysílací věž | čtvrť 4, bonus `onAir` |
| `place.tower.teaser` | Every screen in the city is waiting for something worth showing. | Každá obrazovka ve městě čeká na něco, co stojí za ukázání. | EN 64 / CS 59 znaků |
| `place.tower.story` | You pass the tallest tower, the brightest point of the whole route. | Míjíš nejvyšší věž, světelný bod celé cesty. | příběh = `src/locales/*.js` `place.*.story` |
| `place.harbor.name` | Rooftop Harbor | Střešní přístav | čtvrť 4, bonus `encore` |
| `place.harbor.teaser` | At the end of the route, a mailbox big enough for a paper plane. | Na konci trasy je schránka tak velká, že se do ní vejde vlaštovka. | EN 64 / CS 66 znaků |
| `place.harbor.story` | Past the rooftop harbor, another journey starts beyond the horizon. | Za střešním přístavem začíná další cesta za obzor. | příběh = `src/locales/*.js` `place.*.story` |

## 2. Čtvrti: jméno, věta rámce, postava, hlášky, místní

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `district.violet.name` | Violet Suburbs | Fialové předměstí | CS = `cs.js` `district.*` (tam verzálkami pro HUD) |
| `district.violet.frame` | Rooftops, washing lines and a market that never closes. | Střechy, šňůry s prádlem a tržnice, která nikdy nezavírá. | stav `frame`, jediná věta nálady |
| `character.bolts.name` | Bolts | Bolts | jméno se nepřekládá |
| `character.bolts.role` | Retired delivery robot | Doručovací robot v důchodu |  |
| `character.bolts.line1` | Oh. A paper plane. I used to deliver parcels. Then they invented you. | Á. Papírová vlaštovka. Já kdysi doručoval balíky. Pak vymysleli tebe. | 1 = první přílet do čtvrti (08 §7.1) |
| `character.bolts.line2` | I logged your flight as 'weather'. Nobody reads my logs anyway. | Tvůj let jsem zapsal jako „počasí“. Moje záznamy stejně nikdo nečte. | 2 = 3. místo čtvrti (08 §7.1) |
| `character.bolts.line3` | Past the railway already? Send me a postcard. I'll pretend it's for me. | Už za železnicí? Pošli mi pohlednici. Budu dělat, že je pro mě. | 3 = přelet do další čtvrti / finále (08 §7.1) |
| `district.violet.bird` | Cyber Pigeon | Kyberholub | holub (hold) |
| `district.violet.gust` | Market Vent | Větrák z tržnice | poryv (tap) |
| `district.docks.name` | Moon Docks | Měsíční doky | CS = `cs.js` `district.*` (tam verzálkami pro HUD) |
| `district.docks.frame` | Somewhere past the railway, cranes stand in the drizzle. | Někde za železnicí stojí v mrholení jeřáby. | stav `frame`, jediná věta nálady |
| `character.marge.name` | Marge | Marge | jméno se nepřekládá |
| `character.marge.role` | Crane operator, forty years in the cab | Jeřábnice, čtyřicet let v kabině |  |
| `character.marge.line1` | Mind the hooks, love. They don't mind you. | Bacha na háky, zlato. Ony na tebe bacha nedávají. | 1 = první přílet do čtvrti (08 §7.1) |
| `character.marge.line2` | Forty years lifting containers. You're the first thing that ever lifted my mood. | Čtyřicet let zvedám kontejnery. Ty jsi první věc, co mi kdy zvedla náladu. | 2 = 3. místo čtvrti (08 §7.1) |
| `character.marge.line3` | That's the lighthouse. Past it, the sea stops being my problem. | Tamhle je maják. Za ním už moře není můj problém. | 3 = přelet do další čtvrti / finále (08 §7.1) |
| `district.docks.bird` | Courier Gull | Racek kurýr | holub (hold) |
| `district.docks.gust` | Funnel Draft | Tah z lodního komína | poryv (tap) |
| `district.horizon.name` | Red Horizon | Rudý horizont | CS = `cs.js` `district.*` (tam verzálkami pro HUD) |
| `district.horizon.frame` | Past the lighthouse, the sun sets a second time. | Za majákem slunce zapadá podruhé. | stav `frame`, jediná věta nálady |
| `character.stella.name` | Stella | Stella | jméno se nepřekládá |
| `character.stella.role` | Astronomer at the observatory | Astronomka na observatoři |  |
| `character.stella.line1` | Statistically, you're a comet. Emotionally, you're a sheet of A4. | Statisticky jsi kometa. Citově jsi list A4. | 1 = první přílet do čtvrti (08 §7.1) |
| `character.stella.line2` | I named a star after you. It's very small. You'll get along. | Pojmenovala jsem po tobě hvězdu. Je hodně malá. Budete si rozumět. | 2 = 3. místo čtvrti (08 §7.1) |
| `character.stella.line3` | From up here the city looks like spilled sugar. Go on, it's not far now. | Odsud vypadá město jako rozsypaný cukr. Leť, už to není daleko. | 3 = přelet do další čtvrti / finále (08 §7.1) |
| `district.horizon.bird` | Stargazer Pigeon | Holub hvězdář | holub (hold) |
| `district.horizon.gust` | Turbine Wake | Vír za turbínou | poryv (tap) |
| `district.core.name` | Neon Core | Neonové jádro | CS = `cs.js` `district.*` (tam verzálkami pro HUD) |
| `district.core.frame` | Beyond the mountains, a city that never switches off. | Za horami je město, které se nikdy nevypíná. | stav `frame`, jediná věta nálady |
| `character.zippy.name` | Zippy | Zippy | jméno se nepřekládá |
| `character.zippy.role` | Ad drone who'd rather be a pigeon | Reklamní dron, který by radši byl holub |  |
| `character.zippy.line1` | BUY NOW! ...Sorry. Reflex. Hi. | KUPTE HNED! …Pardon. Reflex. Ahoj. | 1 = první přílet do čtvrti (08 §7.1) |
| `character.zippy.line2` | I'm contractually a billboard. In my heart, I'm a pigeon. | Podle smlouvy jsem billboard. V srdci jsem holub. | 2 = 3. místo čtvrti (08 §7.1) |
| `character.zippy.line3` | Rooftop Harbor is right ahead. Fly well. Not for the sponsors. For you. | Střešní přístav je hned před tebou. Leť dobře. Ne kvůli sponzorům. Kvůli sobě. | 3 = přelet do další čtvrti / finále (08 §7.1) |
| `district.core.bird` | Drone Pigeon | Dronoholub | holub (hold) |
| `district.core.gust` | AC Exhaust | Výdech klimatizace | poryv (tap) |

## 3. Bonusy: jméno, věta „chci“ (bez čísel), šablona účinku

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `bonus.glider.name` | Glider | Kluzák | sloveso `model`, štítky `style` |
| `bonus.glider.pitch` | A floatier second plane for longer, slower flights. | Lehčí druhá vlaštovka na delší a pomalejší lety. | teaser i karta, bez čísel |
| `bonus.chain.name` | Crowd Chain | Řetěz fanoušků | sloveso `tap`, štítky `combos` |
| `bonus.chain.pitch` | Your combo pushes harder with every step. | Tvoje kombo tlačí s každým krokem víc. | teaser i karta, bez čísel |
| `bonus.chain.effect.0` | Each combo step adds {step} push, up to Combo {max}. | Každý krok komba přidá {step} tahu, až do komba {max}. | vždy · `step`: +10 %; `max`: ×4 |
| `bonus.pinwheel.name` | Pinwheel | Větrník | sloveso `before`, štítky `every` |
| `bonus.pinwheel.pitch` | Spin the wind before you throw. | Roztoč vítr, než hodíš. | teaser i karta, bez čísel |
| `bonus.pinwheel.effect.0` | Re-spin the wind {rerolls} per throw. | Vítr můžeš přetočit {rerolls} za hod. | vždy · `rerolls`: once / jednou, twice / dvakrát, 3 times / 3krát |
| `bonus.pinwheel.effect.1` | A re-spin never lands on a headwind. | Přetočení nikdy nepadne na protivítr. | jen když úroveň má `noHeadwind` |
| `bonus.steam.name` | Steam Hop | Parní skok | sloveso `taptap`, štítky `combos` |
| `bonus.steam.pitch` | Puffs of steam you can ride. Tap each one. | Obláčky páry, na kterých se dá svézt. Klepni na každý. | teaser i karta, bez čísel |
| `bonus.steam.effect.0` | Tap both puffs for Full Steam. | Klepni na oba obláčky a jedeš plnou parou. | vždy |
| `bonus.steam.effect.1` | Full Steam pushes {push} harder. | Plná pára tlačí o {push} víc. | jen když úroveň má `push` · `push`: 25 % |
| `bonus.steam.effect.2` | Two perfect puffs add a {burst} speed burst. | Dva perfektní obláčky přidají zrychlení {burst}. | jen když úroveň má `burst` · `burst`: +10 % |
| `bonus.tape.name` | Packing Tape | Balicí páska | sloveso `passive`, štítky `miss` |
| `bonus.tape.pitch` | Misses still count for something. | I minutí se trochu počítá. | teaser i karta, bez čísel |
| `bonus.tape.effect.0` | A missed event still gives {share} of a hit. | Minutá událost dá pořád {share} zásahu. | vždy · `share`: 25 % |
| `bonus.tape.effect.1` | A miss still resets your combo. | Minutí ale pořád vynuluje kombo. | vždy |
| `bonus.crane.name` | Crane Lift | Jeřábový zdvih | sloveso `before`, štítky `every` |
| `bonus.crane.pitch` | Marge lifts you higher before every throw. | Marge tě před každým hodem zvedne výš. | teaser i karta, bez čísel |
| `bonus.crane.effect.0` | You start {lift} higher. | Startuješ o {lift} výš. | vždy · `lift`: 1.5 m / 1,5 m |
| `bonus.skip.name` | Stone Skip | Žabka | sloveso `landing`, štítky `every` |
| `bonus.skip.pitch` | Fast landings bounce like a skipped stone. | Rychlé přistání se odrazí jako žabka na vodě. | teaser i karta, bez čísel |
| `bonus.skip.effect.0` | A fast landing bounces {bounces}, keeping {keep} of your speed. | Rychlé přistání se {bounces} odrazí a udrží {keep} rychlosti. | vždy · `bounces`: once / jednou, twice / dvakrát, 3 times / 3krát; `keep`: 25 % |
| `bonus.gull.name` | Gull Escort | Racčí doprovod | sloveso `hold`, štítky `every` |
| `bonus.gull.pitch` | Pigeons and gulls carry you farther. | Holubi a rackové tě donesou dál. | teaser i karta, bez čísel |
| `bonus.gull.effect.0` | Birds carry you {carry} longer and push {push} harder. | Ptáci tě nesou o {carry} déle a tlačí o {push} víc. | vždy · `carry`: 25 %; `push`: 25 % |
| `bonus.momentum.name` | Momentum | Hybnost | sloveso `passive`, štítky `long` |
| `bonus.momentum.pitch` | Every place you pass makes you faster. | Každé místo, které přeletíš, tě zrychlí. | teaser i karta, bez čísel |
| `bonus.momentum.effect.0` | Each place you pass in a flight adds {step} speed, up to {cap}. | Každé místo přeletěné během letu přidá {step} rychlosti, nejvýš {cap}. | vždy · `step`: +10 %; `cap`: +10 % |
| `bonus.thermal.name` | Thermal | Termika | sloveso `tapPlace`, štítky `combos` |
| `bonus.thermal.pitch` | Columns of warm air. Tap in the bright core. | Sloupce teplého vzduchu. Klepni v jasném jádru. | teaser i karta, bez čísel |
| `bonus.thermal.effect.0` | Tap in the bright core to spiral up. Dead center counts as perfect. | Klepni v jasném jádru a vystoupáš ve spirále. Přesný střed je perfektní. | vždy |
| `bonus.thermal.effect.1` | Thermals push {push} harder. | Termika tlačí o {push} víc. | jen když úroveň má `push` · `push`: 25 % |
| `bonus.thermal.effect.2` | {second} chance of a second column right after. | Šance {second}, že hned za ní přijde druhý sloupec. | jen když úroveň má `second` · `second`: 25 % |
| `bonus.echo.name` | Echo | Ozvěna | sloveso `passive`, štítky `perfects` |
| `bonus.echo.pitch` | Perfect hits echo off the mountains. | Perfektní zásahy se odrážejí od hor. | teaser i karta, bez čísel |
| `bonus.echo.effect.0` | Every perfect echoes {delay} later at {share} strength. | Každý perfektní zásah se za {delay} ozve se silou {share}. | vždy · `delay`: 0.6 s / 0,6 s; `share`: 25 % |
| `bonus.star.name` | Shooting Star | Padající hvězda | sloveso `tap`, štítky `long` |
| `bonus.star.pitch` | Now and then, a golden star crosses the sky. | Občas oblohou přeletí zlatá hvězda. | teaser i karta, bez čísel |
| `bonus.star.effect.0` | A golden star crosses the sky in {chance} of flights. Tap it as it crosses the ring. | Zlatá hvězda přeletí oblohu v {chance} letů. Klepni, když prolétá kruhem. | vždy · `chance`: 25 % |
| `bonus.star.effect.1` | Your result always says when a star helped. | Výsledek vždycky řekne, když hvězda pomohla. | vždy |
| `bonus.drone.name` | Ad Drone | Reklamní dron | sloveso `tapPlace`, štítky `combos` |
| `bonus.drone.pitch` | Bounce off drones. Tap just before you hit one. | Odrážej se od dronů. Klepni těsně před nárazem. | teaser i karta, bez čísel |
| `bonus.drone.effect.0` | Tap right before a drone to bounce up and forward. | Klepni těsně před dronem a odrazíš se nahoru a dopředu. | vždy |
| `bonus.drone.effect.1` | The tap window is {window} wider. | Okno pro klepnutí je o {window} širší. | jen když úroveň má `window` · `window`: 25 % |
| `bonus.drone.effect.2` | Drones fly in pairs {pair} of the time. | Drony létají ve dvojicích v {pair} případů. | jen když úroveň má `pair` · `pair`: 25 % |
| `bonus.paperCrane.name` | Paper Crane | Papírový jeřábek | sloveso `passive`, štítky `miss` |
| `bonus.paperCrane.pitch` | A small friend who tugs you over the line. | Malý kamarád, který tě přetáhne přes čáru. | teaser i karta, bez čísel |
| `bonus.paperCrane.effect.0` | Once per flight, if you land within {reach} of the next place, it tugs you over. | Jednou za let, když přistaneš do {reach} před dalším místem, přetáhne tě přes něj. | vždy · `reach`: 1.5 m / 1,5 m |
| `bonus.paperCrane.effect.1` | Your result always says when it helped. | Výsledek vždycky řekne, když pomohl. | vždy |
| `bonus.onAir.name` | On Air | Ve vysílání | sloveso `passive`, štítky `combos`, `long` |
| `bonus.onAir.pitch` | Keep a combo going and the city puts you on screen. | Udrž kombo a město tě pustí na obrazovky. | teaser i karta, bez čísel |
| `bonus.onAir.effect.0` | At Combo {combo}, you go on air: {beta} speed while the combo lasts. | Při kombu {combo} jdeš do vysílání: {beta} rychlosti, dokud kombo trvá. | vždy · `combo`: ×4; `beta`: +10 % |
| `bonus.encore.name` | Encore | Přídavek | sloveso `finale`, štítky – |
| `bonus.encore.pitch` | The end of the route. Something opens when you get there. | Konec trasy. Až tam doletíš, něco se otevře. | teaser i karta, bez čísel |
| `bonus.encore.pitchDone` | You flew the whole route. Anything after this is optional. | Celá trasa je za tebou. Všechno další je jen navíc. | po finále |

## 4. Papíry (řádek „Also opens“)

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `paper.kraft` | Kraft Paper | Kraftový papír |  |
| `paper.washi` | Washi Paper | Papír washi |  |
| `paper.neon` | Neon Foil | Neonová fólie |  |

## 5. Speciály do kapes

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `special.cushion.name` | Cushion | Polštářek | aktivní, sloveso `tap`, odemyká čtvrť 1 |
| `special.cushion.tradeoff` | Once per flight, a soft landing. Small but safe. | Jednou za let měkké přistání. Malé, ale jisté. | kompromis jednou větou |
| `special.cushion.hint` | CUSHION · Tap just above the ground | POLŠTÁŘEK · Klepni těsně nad zemí | nápověda při prvním letu (08 §7.3), verzálky |
| `special.sharp.name` | Sharp Edge | Ostrá hrana | pasivní, sloveso `passive`, odemyká čtvrť 1 |
| `special.sharp.tradeoff` | Narrower windows, stronger hits. | Užší okna, silnější zásahy. | kompromis jednou větou |
| `special.sharp.hint` | SHARP EDGE · Narrower windows, stronger hits | OSTRÁ HRANA · Užší okna, silnější zásahy | nápověda při prvním letu (08 §7.3), verzálky |
| `special.dive.name` | Dive | Střemhlav | aktivní, sloveso `hold`, odemyká čtvrť 2 |
| `special.dive.tradeoff` | Trade height for speed. Pull up low for a burst. | Vyměň výšku za rychlost. Vyrovnej nízko a zrychlíš. | kompromis jednou větou |
| `special.dive.hint` | DIVE · Hold to dive, let go to pull up | STŘEMHLAV · Podrž a padej, pusť a vyrovnej | nápověda při prvním letu (08 §7.3), verzálky |
| `special.calm.name` | Calm Sky | Klidné nebe | pasivní, sloveso `passive`, odemyká čtvrť 2 |
| `special.calm.tradeoff` | Fewer events, each one stronger. | Méně událostí, každá silnější. | kompromis jednou větou |
| `special.calm.hint` | CALM SKY · Fewer events, each one stronger | KLIDNÉ NEBE · Méně událostí, každá silnější | nápověda při prvním letu (08 §7.3), verzálky |
| `special.whistle.name` | Whistle | Píšťalka | aktivní, sloveso `tap`, odemyká čtvrť 3 |
| `special.whistle.tradeoff` | Call the next bird early. Its window is tighter. | Přivolá dalšího ptáka dřív. Jeho okno je užší. | kompromis jednou větou |
| `special.whistle.hint` | WHISTLE · Tap to call the next bird | PÍŠŤALKA · Klepni a přivoláš dalšího ptáka | nápověda při prvním letu (08 §7.3), verzálky |
| `special.rocket.name` | Paper Rocket | Papírová raketa | aktivní, sloveso `tap`, odemyká čtvrť 3 |
| `special.rocket.tradeoff` | Two boosts per flight. You pick the moment. | Dvě zrychlení za let. Okamžik vybíráš ty. | kompromis jednou větou |
| `special.rocket.hint` | PAPER ROCKET · Tap to boost (2 left) | PAPÍROVÁ RAKETA · Klepni a zrychli (zbývají 2) | nápověda při prvním letu (08 §7.3), verzálky |

## 6. Uzly (automatika QTE, Night Route)

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `node.autoBasic.name` | Autopilot: gusts and birds | Autopilot: poryvy a ptáci | čtvrť 1, podmínka `roofs` |
| `node.autoBasic.pitch` | Handles gusts and birds for you. | Poryvy a ptáky zvládne za tebe. |  |
| `node.autoSteam.name` | Autopilot: steam | Autopilot: pára | čtvrť 1, podmínka `railway` |
| `node.autoSteam.pitch` | Handles Steam Hop for you. | Parní skok zvládne za tebe. |  |
| `node.autoThermal.name` | Autopilot: thermals | Autopilot: termika | čtvrť 3, podmínka `ridge` |
| `node.autoThermal.pitch` | Handles thermals for you. | Termiku zvládne za tebe. |  |
| `node.autoStar.name` | Autopilot: shooting stars | Autopilot: padající hvězdy | čtvrť 3, podmínka `observatory` |
| `node.autoStar.pitch` | Taps shooting stars for you. | Na padající hvězdy klepne za tebe. |  |
| `node.autoDrone.name` | Autopilot: drones | Autopilot: drony | čtvrť 4, podmínka `gates` |
| `node.autoDrone.pitch` | Handles drones for you. | Drony zvládne za tebe. |  |
| `node.nightRoute.name` | Night Route | Noční trasa | čtvrť 4, podmínka `finished` |
| `node.nightRoute.pitch` | Fly the whole route again, after dark. | Proleť celou trasu znovu, po setmění. |  |

## 7. Štítky: slovesa, „pro koho“, jednotky

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `verb.tap` | Tap | Klepni | zobrazuje se verzálkami (CSS) |
| `verb.hold` | Hold | Podrž | zobrazuje se verzálkami (CSS) |
| `verb.taptap` | Tap-tap | Klep-klep | zobrazuje se verzálkami (CSS) |
| `verb.tapPlace` | Tap in place | Klepni v místě | zobrazuje se verzálkami (CSS) |
| `verb.passive` | Passive | Pasivní | zobrazuje se verzálkami (CSS) |
| `verb.before` | Before throw | Před hodem | zobrazuje se verzálkami (CSS) |
| `verb.landing` | Landing | Přistání | zobrazuje se verzálkami (CSS) |
| `verb.model` | Model | Model | zobrazuje se verzálkami (CSS) |
| `verb.finale` | Finale | Finále | zobrazuje se verzálkami (CSS) |
| `tag.combos` | Combos | Komba |  |
| `tag.miss` | Helps when you miss | Pomáhá při minutí |  |
| `tag.perfects` | Rewards perfects | Odměňuje perfektní |  |
| `tag.every` | Every throw | Každý hod |  |
| `tag.long` | Long flights | Dlouhé lety |  |
| `tag.style` | Your style | Tvůj styl |  |
| `unit.once` | once | jednou | jednotka v šabloně účinku (`count`, `times`) |
| `unit.twice` | twice | dvakrát | jednotka v šabloně účinku (`count`, `times`) |
| `unit.times` | *one:* {count} time<br>*other:* {count} times | *one:* {count}krát<br>*few:* {count}krát<br>*many:* {count}krát<br>*other:* {count}krát | jednotka v šabloně účinku (`count`, `times`) |

## 8. UI: hlavička, tlačítka, štítky, náhledy, kapsy, prázdné stavy, toasty, výsledek, karta čtvrti, Delivered

| Klíč | EN | CS | Pozn. |
|---|---|---|---|
| `meta.title` | Just Throw It · Atlas prototype | Just Throw It · prototyp Atlasu |  |
| `atlas.title` | Atlas | Atlas |  |
| `atlas.subtitle` | The route | Trasa |  |
| `atlas.rule` | Fly farther to find places. Every place gives your plane a bonus. Coins level it up. | Leť dál a najdeš místa. Každé místo dá vlaštovce bonus. Za mince ho vylepšíš. |  |
| `atlas.ruleButton` | How the Atlas works | Jak funguje Atlas |  |
| `wallet.aria` | *one:* {count} coin<br>*other:* {count} coins | *one:* {count} mince<br>*few:* {count} mince<br>*many:* {count} mince<br>*other:* {count} mincí | aria-label peněženky a cen |
| `goal.label` | Next: | Další: | tučně před `goal.next` / `goal.finish` |
| `goal.next` | {place} · {m} past your best | {place} · {m} za rekordem |  |
| `goal.finish` | the finish line · {m} past your best | cíl trasy · {m} za rekordem |  |
| `goal.delivered` | Delivered. The Workshop is yours. | Doručeno. Dílna je tvoje. |  |
| `button.workshop` | ← Workshop | ← Dílna | tlačítko |
| `button.throw` | Throw ↗ | Hodit ↗ | tlačítko |
| `button.close` | Close Atlas | Zavřít Atlas | tlačítko |
| `button.closeCard` | Close | Zavřít | tlačítko |
| `button.levelUp` | Level up · {price} | Vylepšit · {price} | tlačítko |
| `button.toGo` | {price} to go | Chybí {price} | tlačítko |
| `button.max` | Max level | Nejvyšší úroveň | tlačítko |
| `button.undo` | Undo · until your next throw | Vrátit · do dalšího hodu | tlačítko |
| `button.undoShort` | Undo | Vrátit | tlačítko |
| `button.openPocket` | Open pocket · {price} | Otevřít kapsu · {price} | tlačítko |
| `button.unlock` | Unlock · {price} | Odemknout · {price} | tlačítko |
| `button.emptyPocket` | Empty this pocket | Vyprázdnit kapsu | tlačítko |
| `button.keepFlying` | Keep flying | Letět dál | tlačítko |
| `button.openAtlas` | Open Atlas | Otevřít Atlas | tlačítko |
| `button.doneForNow` | Done for now | Zatím stačí | tlačítko |
| `button.done` | Done | Hotovo | tlačítko |
| `button.summary` | See the summary | Zobrazit souhrn | tlačítko |
| `button.workshopLink` | Choose it in the Workshop | Vyber ho v Dílně | tlačítko |
| `button.paperLink` | Also opens: {paper} in the Workshop | Navíc se otevře: {paper} v Dílně | tlačítko |
| `button.more` | All levels | Všechny úrovně | tlačítko |
| `label.new` | New | Nové |  |
| `label.next` | Next | Další |  |
| `label.free` | Free | Zdarma |  |
| `atlas.button` | Atlas | Atlas |  |
| `atlas.buttonNew` | Atlas, something new | Atlas, je tu novinka |  |
| `label.level` | Level {n} | Úroveň {n} |  |
| `label.levelOf` | Level {n} of {max} | Úroveň {n} z {max} |  |
| `label.maxCrown` | Max level | Maximum |  |
| `label.now` | Now | Teď |  |
| `label.nextLevel` | Level {n} | Úroveň {n} |  |
| `label.found` | {found}/{total} found | Nalezeno {found}/{total} |  |
| `label.yourBest` | Your best: {m} | Tvůj rekord: {m} |  |
| `label.coinMult` | Coins ×{x} here | Mince ×{x} |  |
| `label.locals` | Locals | Místní |  |
| `label.heard` | What {name} said | {name} říká |  |
| `label.placeOf` | {district} {n}/4 | {district} {n}/4 |  |
| `label.preview` | On your last throw | V posledním hodu |  |
| `label.provisional` | Numbers are provisional | Čísla jsou zatím orientační |  |
| `label.on` | On | Zapnuto |  |
| `label.off` | Off | Vypnuto |  |
| `label.day` | Day | Den |  |
| `label.night` | Night | Noc |  |
| `label.delivered` | Delivered | Doručeno |  |
| `label.comingSoon` | Levels open with the new flight model. | Úrovně se otevřou s novým modelem letu. |  |
| `label.pockets` | Pockets | Kapsy |  |
| `label.details` | Postcard details | Detail pohlednice |  |
| `teaser.distance` | {m} past your best | {m} za rekordem |  |
| `teaser.bonus` | {bonus} · {pitch} | {bonus} · {pitch} |  |
| `teaser.bonusHidden` | You find out what it gives when you get there. | Co dává, zjistíš, až tam doletíš. |  |
| `card.unknown` | ??? | ??? |  |
| `card.unknownAria` | Undiscovered place | Neobjevené místo |  |
| `card.frameAria` | {district}, not reached yet | {district}, zatím mimo dolet |  |
| `card.encoreLocked` | Finish the route to open. | Otevře se na konci trasy. |  |
| `card.gliderNote` | No levels. Pick your plane in the Workshop any time between throws. | Bez úrovní. Vlaštovku vybereš v Dílně kdykoli mezi hody. |  |
| `preview.distance` | ≈ {m} on your last throw · past {place} | ≈ {m} v posledním hodu · dál než {place} |  |
| `preview.distanceNoPlace` | ≈ {m} on your last throw | ≈ {m} v posledním hodu |  |
| `preview.crane` | *one:* Would have tugged you past {count} more place in your last {last} throws<br>*other:* Would have tugged you past {count} more places in your last {last} throws | *one:* V posledních {last} hodech by tě přetáhl přes {count} další místo<br>*few:* V posledních {last} hodech by tě přetáhl přes {count} další místa<br>*many:* V posledních {last} hodech by tě přetáhl přes {count} dalšího místa<br>*other:* V posledních {last} hodech by tě přetáhl přes {count} dalších míst | `{last}` = počet hodů náhledu (`PREVIEW_THROWS`) |
| `preview.star` | When it appears: ≈ {pct} that flight | Když se objeví: ≈ {pct} v tom letu |  |
| `preview.tape` | *one:* You missed {count} event last flight. This would have kept ≈ {m}.<br>*other:* You missed {count} events last flight. This would have kept ≈ {m}. | *one:* V posledním letu ti utekla {count} událost. Tohle by z ní udrželo ≈ {m}.<br>*few:* V posledním letu ti utekly {count} události. Tohle by z nich udrželo ≈ {m}.<br>*many:* V posledním letu ti uteklo {count} události. Tohle by z nich udrželo ≈ {m}.<br>*other:* V posledním letu ti uteklo {count} událostí. Tohle by z nich udrželo ≈ {m}. |  |
| `preview.none` | No preview yet. The numbers above are exact. | Náhled zatím není. Čísla nahoře jsou přesná. |  |
| `pocket.name` | Pocket {n} | Kapsa {n} |  |
| `pocket.locked` | Pocket {n} · {price} | Kapsa {n} · {price} |  |
| `pocket.empty` | Empty. Tap to pick a special. | Prázdná. Klepni a vyber speciál. |  |
| `pocket.aria` | Pocket {n}: {content} | Kapsa {n}: {content} |  |
| `pocket.pick` | Pick a special | Vyber speciál |  |
| `pocket.active` | Active | Aktivní |  |
| `pocket.activeRule` | One active ability at a time. | Vždy jen jedna aktivní schopnost. |  |
| `pocket.passive` | Passive | Pasivní |  |
| `pocket.passiveRule` | {a} and {b} don't mix. | {a} a {b} spolu nejdou. | `{a}`, `{b}` = jména vylučujících se speciálů (`EXCLUSIVE`) |
| `pocket.moreIn` | More in {district} | Další ve čtvrti {district} |  |
| `pocket.swapFree` | Swapping is free between throws. | Výměna je mezi hody zdarma. |  |
| `reason.oneActive` | {special} is in Pocket {n}. One active ability at a time. | {special} je v kapse {n}. Vždy jen jedna aktivní schopnost. |  |
| `reason.exclusive` | Doesn't mix with {special} in Pocket {n}. | V kapse {n} je {special}, spolu nejdou. |  |
| `reason.inOther` | Already in Pocket {n}. | Už je v kapse {n}. |  |
| `reason.equipped` | In this pocket | V této kapse |  |
| `node.autopilotRule` | Regular hits only. No perfects, no combo, no Echo. | Jen běžné zásahy. Žádné perfektní, žádné kombo, žádná Ozvěna. |  |
| `node.nightNote` | Optional. The route is finished either way. | Dobrovolné. Trasa je dokončená tak jako tak. |  |
| `node.autopilotWorkshop` | Autopilot is set up in the Workshop. | Autopilot se nastavuje v Dílně. |  |
| `empty.atlas` | Nothing found yet. Fly past the first roofs, {m} out, to find your first place. | Zatím nic. Přeleť první střechy ({m}) a najdeš první místo. | prázdný stav |
| `empty.detail` | Pick a postcard to see what it does. | Vyber pohlednici a uvidíš, co dělá. | prázdný stav |
| `toast.levelUp` | {bonus} · Level {n} | {bonus} · úroveň {n} | toast (`aria-live`) |
| `toast.undone` | Undone. {price} back in your wallet. | Vráceno. {price} je zpátky. | toast (`aria-live`) |
| `toast.pocketOpen` | Pocket {n} is open. Pick a special. | Kapsa {n} je otevřená. Vyber speciál. | toast (`aria-live`) |
| `toast.equipped` | {special} is in Pocket {n}. | {special} je v kapse {n}. | toast (`aria-live`) |
| `toast.swapped` | Swapped {old} for {special}. | Vyměněno: {old} → {special}. | toast (`aria-live`) |
| `toast.emptied` | Pocket {n} is empty. | Kapsa {n} je prázdná. | toast (`aria-live`) |
| `toast.unlocked` | Unlocked: {node}. | Odemčeno: {node}. | toast (`aria-live`) |
| `toast.autopilotOn` | {node}: On. | {node}: zapnuto. | toast (`aria-live`) |
| `toast.autopilotOff` | {node}: Off. | {node}: vypnuto. | toast (`aria-live`) |
| `toast.found` | Found: {place} | Nalezeno: {place} | toast (`aria-live`) |
| `toast.saved` | Progress saved. | Postup uložen. | toast (`aria-live`) |
| `result.heading` | Result | Výsledek |  |
| `result.newBest` | New best | Nový rekord |  |
| `button.throwAgain` | Throw again | Hodit znovu | tlačítko |
| `result.workshop` | Workshop | Dílna |  |
| `result.found` | Found: {place} → {bonus} | Nalezeno: {place} → {bonus} |  |
| `result.foundPaper` | Found: {place} → {bonus} · {paper} is in the Workshop | Nalezeno: {place} → {bonus} · {paper} čeká v Dílně |  |
| `result.district` | New district: {district} | Nová čtvrť: {district} |  |
| `result.line` | {name}: “{line}” | {name}: „{line}“ |  |
| `result.migration` | *one:* Your past flights found {count} place.<br>*other:* Your past flights found {count} places. | *one:* Tvoje dřívější lety našly {count} místo.<br>*few:* Tvoje dřívější lety našly {count} místa.<br>*many:* Tvoje dřívější lety našly {count} místa.<br>*other:* Tvoje dřívější lety našly {count} míst. |  |
| `result.special` | New in your pockets: {list} | Nové v kapsách: {list} |  |
| `district.lead` | You flew all the way to {district}. | Vlaštovka doletěla až sem: {district}. |  |
| `district.specials` | New in your pockets: {list} | Nové v kapsách: {list} |  |
| `district.pocket2` | Pocket 2 is in the Atlas: {price} | Kapsa 2 je v Atlasu: {price} |  |
| `district.saved` | Progress saved. Nothing here runs out. | Postup je uložený. Nic tu neuteče. |  |
| `stop.title` | Saved. | Uloženo. |  |
| `stop.text` | The route will be right here. | Trasa tu na tebe počká. |  |
| `delivered.title` | Delivered. | Doručeno. |  |
| `delivered.lead` | Every place on the route, found. The Workshop is yours. | Všechna místa na trase jsou nalezená. Dílna je tvoje. |  |
| `delivered.gridAria` | *one:* {count} place<br>*other:* {count} places | *one:* {count} místo<br>*few:* {count} místa<br>*many:* {count} místa<br>*other:* {count} míst | aria-label mřížky pohlednic |
| `delivered.throws` | Throws to the finish | Hodů do cíle |  |
| `delivered.longest` | Longest throw | Nejdelší hod |  |
| `delivered.mostPlaces` | Most places in one throw | Nejvíc míst v jednom hodu |  |
| `delivered.bestCombo` | Best combo | Nejlepší kombo |  |
| `delivered.lastWords` | Last words from the route | Poslední slova z trasy |  |
| `delivered.stamp` | Delivered | Doručeno |  |
| `hint.firstFlight` | {hint} | {hint} |  |
| `proto.aiming` | Aiming… (prototype: use “Throw” in the controls below) | Míření… (prototyp: použij „Throw“ v ovládání níže) | jen prototyp, do hry nepřenášet |
| `proto.workshop` | Workshop (prototype placeholder) | Dílna (zástupná obrazovka prototypu) | jen prototyp, do hry nepřenášet |
