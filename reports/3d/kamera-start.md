# Kamera startu a letu: metriky S1–S3 (14. 10. 2026)

Dávky S1 (kamera letu), S3 (velikost vlaštovky) a S2 (záběr míření a výhoz) podle `research/start/01-zacatek-a-kamera.md` §2–§4, `02-misto-odhodu-vzhled.md` M-2 a rozhodnutí v `research/bonusy/06-rozhodnuti.md` („Začátek hodu, místo odhodu a kamera“). Všechna čísla jsou **z Node** (čistý `frame.directorFor` + `camera.cameraView`, stejný řetěz přes `prev` jako `ui.js`). **Prohlížeč nebyl použit. Vzhled, px z pixelů, výkon a dotyk jsou NOT ASSESSED.**

## Co kamera dělá (shrnutí implementace)

| Prvek | Hodnota | Kde |
|---|---|---|
| Šířka letu | `W = 120 · zoom(stav) · ex / tempoZoom(π)`, `ex = 1 + 0,35·smooth(s/0,8)`, `s = max(0,(vx − c)/c)`, `c = cruise·π·(1+β)` | `camera.js` `EXCESS`, `excessOf`, `excessZoom` |
| π a c | `frame.paceOf(f)` = `f.d.pi` ?? `f.p.pi` ?? 1, `frame.cruiseOf(f)` = `f.cruise` ?? `f.p.cruise·π` (dnešní hra: π 1, Dart 11 m/s) | `frame.js` |
| Tlumení přebytku | ven poločas 0,25 s / strop 0,8 ln/s, dovnitř 1,2 s / 0,25 ln/s | `EASE` |
| Mrtvé pásmo, hystereze | cíl přebytku se mění až při rozdílu ≥ 5 %, změna směru nejdřív 0,6 s po minulé | `EXCESS.dead`, `hyst` |
| Před událostí | méně než 0,8 s do události: oddálení nezačne | `EXCESS.ahead` |
| Zámek QTE | beze změny (zoom, přebytek, tempo, px, natočení stojí); po zásahu se oddálí až 0,3 s po výsledku | `qteLock` |
| Dive | přebytek nejvýš +10 % | `EXCESS.dive`, `frame` předá `!!f.dive` |
| Krátký let | y < 3 m a klesá: oddálení výhozu stojí, rovnou záběr dopadu | `EXCESS.low` |
| Stavové záběry | vista, district, intro, landing jako dřív, celek za letu omezen na [0,8; 1,5]·W_let·T | `ZOOM_RANGE` |
| Záběr míření | 16 m; na užší scéně `0,5·cssWidth/27` m, nejméně 7 m (vlaštovka v ruce ≥ 27 px; 375 px → 7 m) | `pose.REST`, `aimWidth` |
| Nabíjení | přisunutí o 6 %·charge (tlumené) | `REST.push` |
| Výhoz | ease-out (1 − (1 − u)²) v ln šířky z klidového záběru na šířku letu za 1,2 s; svisle plynule z (148, 258); zobrazená vlaštovka vyletí z ruky (16 m) do výšky fyziky (12 m), `frame.launchLift` | `LAUNCH`, `launchEase` |
| Velikost vlaštovky | `L = max(0,5; min(7,75; 0,5·(W/16)^1,36); úzká scéna < 500 px: 24 px·W/css)`, × 1,15 papír na úzké scéně; plane.js v obou stylech, stopa úměrně | `frame.planeLength`, `planeSizeScale` |
| Calm camera / reduced motion | bez dynamického zoomu: klid = záběr míření (bez přisunutí), let = W_let·T(π), výhoz = střih (`camera.cut` na snímku výhozu) | `frame.calmOf` |
| Smlouva | `view(null)` = (148, 258) zachována; `k` v klidu ≈ 19 (16 m) místo 1,25 | `index.view` vrací pohled klidového plánu |

## Scénář měření

- Hra: `src/core.js` `createFlight` + rozhodování jako `core.simulate` (profil = podíl zásahů 0 / 50 / 100 %, perfekt = polovina), seedy 1–60, Dart a Glider, výbava výchozí a 5/5/5.
- Nový systém: `simulation/progression/model.mjs` (π, β, Dive, raketa), výbavy z `P.curve` (1. hod, po Paper 1, konec D1–D3, plná bez Atlasu), profily weak / expert, seedy 1–40; konec D3 navíc se slotem `dive` a `rocket` (profil average). `resolvedAt` doplněn po výsledku (model ho nenastavuje, hra ano).
- Klid před hodem: nabití 0,8, scéna 1280 CSS px. Metriky jen za letu (bez snímků po dopadu), rychlosti zoomu a změny směru až po výhozu (t > 1,2 s).
- Skript: `scratchpad/metrics.mjs` (mimo repo, plné znění v příloze). Nespouští `npm run simulate` ani jiné zakázané skripty a nic nezapisuje.

## Výsledky

| scénář | letů | snímků | bezpečná zóna min | mimo obraz | ven max ln/s | dovnitř max ln/s | přebytek ven / dovnitř | změny směru /10 s max (W / přebytek) | Δ ln W v zámku max | W při 1. varování / W_let·T min (n) | max W / W_let·T min, medián | podíl na W_max max (průměr) | konec výhozu max s |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hra Dart, výchozí výbava, zásahy 0 % | 60 | 35100 | 100.00 % | 0 | 0.027 | 0.055 | 0.000 / 0.055 | 1 / 0 | 0.0e+0 | 1.342 (60) | 1.342, 1.342 | 0.0 % (0.0 %) | 1.200 |
| hra Dart, výchozí výbava, zásahy 50 % | 60 | 40288 | 100.00 % | 0 | 0.027 | 0.067 | 0.000 / 0.067 | 1 / 0 | 0.0e+0 | 1.342 (60) | 1.342, 1.342 | 0.0 % (0.0 %) | 1.200 |
| hra Dart, výchozí výbava, zásahy 100 % | 60 | 46024 | 100.00 % | 0 | 0.027 | 0.191 | 0.000 / 0.060 | 1 / 0 | 0.0e+0 | 1.342 (60) | 1.342, 1.342 | 0.0 % (0.0 %) | 1.200 |
| hra Dart, výbava 5/5/5, zásahy 0 % | 60 | 91560 | 100.00 % | 0 | 0.253 | 0.269 | 0.000 / 0.068 | 5 / 0 | 0.0e+0 | 1.350 (60) | 1.350, 1.350 | 0.0 % (0.0 %) | 1.200 |
| hra Dart, výbava 5/5/5, zásahy 50 % | 60 | 120530 | 100.00 % | 0 | 0.390 | 0.281 | 0.219 / 0.070 | 7 / 4 | 0.0e+0 | 1.350 (60) | 1.350, 1.350 | 0.0 % (0.0 %) | 1.200 |
| hra Dart, výbava 5/5/5, zásahy 100 % | 60 | 155906 | 100.00 % | 0 | 0.388 | 0.287 | 0.260 / 0.061 | 7 / 4 | 0.0e+0 | 1.350 (60) | 1.350, 1.428 | 0.0 % (0.0 %) | 1.200 |
| hra Glider, výchozí, zásahy 0 % | 60 | 61680 | 100.00 % | 0 | 0.026 | 0.049 | 0.000 / 0.049 | 1 / 0 | 0.0e+0 | 1.197 (60) | 1.197, 1.197 | 0.0 % (0.0 %) | 1.200 |
| hra Glider, výchozí, zásahy 50 % | 60 | 69645 | 100.00 % | 0 | 0.271 | 0.268 | 0.257 / 0.061 | 4 / 3 | 0.0e+0 | 1.197 (60) | 1.197, 1.197 | 0.0 % (0.0 %) | 1.200 |
| hra Glider, výchozí, zásahy 100 % | 60 | 79639 | 100.00 % | 0 | 0.380 | 0.275 | 0.257 / 0.050 | 7 / 4 | 0.0e+0 | 1.197 (60) | 1.197, 1.257 | 0.0 % (0.0 %) | 1.200 |
| hra Glider, 5/5/5, zásahy 0 % | 60 | 207900 | 100.00 % | 0 | 0.395 | 0.249 | 0.000 / 0.060 | 6 / 0 | 0.0e+0 | 1.350 (60) | 1.350, 1.350 | 0.0 % (0.0 %) | 1.200 |
| hra Glider, 5/5/5, zásahy 50 % | 60 | 292816 | 100.00 % | 0 | 0.561 | 0.281 | 0.571 / 0.068 | 8 / 4 | 0.0e+0 | 1.350 (60) | 1.350, 1.358 | 0.0 % (0.0 %) | 1.200 |
| hra Glider, 5/5/5, zásahy 100 % | 60 | 394333 | 100.00 % | 0 | 0.561 | 0.452 | 0.571 / 0.062 | 8 / 4 | 0.0e+0 | 1.350 (60) | 1.394, 1.451 | 0.0 % (0.0 %) | 1.200 |
| model 1. hod (nic) (π 1.00), weak | 40 | 25904 | 100.00 % | 0 | 0.161 | 0.068 | 0.161 / 0.068 | 3 / 2 | 0.0e+0 | 1.027 (40) | 1.027, 1.276 | 0.0 % (0.0 %) | 1.200 |
| model 1. hod (nic) (π 1.00), expert | 40 | 33266 | 100.00 % | 0 | 0.267 | 0.263 | 0.037 / 0.040 | 2 / 1 | 0.0e+0 | 1.349 (40) | 1.349, 1.350 | 0.0 % (0.0 %) | 1.200 |
| model po Paper 1 (π 1.62), weak | 40 | 25904 | 100.00 % | 0 | 0.161 | 0.218 | 0.161 / 0.068 | 5 / 2 | 0.0e+0 | 1.027 (40) | 1.027, 1.276 | 0.0 % (0.0 %) | 1.200 |
| model po Paper 1 (π 1.62), expert | 40 | 33266 | 100.00 % | 0 | 0.267 | 0.263 | 0.037 / 0.040 | 2 / 1 | 0.0e+0 | 1.349 (40) | 1.349, 1.350 | 0.0 % (0.0 %) | 1.200 |
| model konec D1 (π 2.86), weak | 40 | 42683 | 100.00 % | 0 | 0.382 | 0.278 | 0.202 / 0.068 | 8 / 4 | 0.0e+0 | 1.350 (40) | 1.350, 1.395 | 2.9 % (0.5 %) | 1.200 |
| model konec D1 (π 2.86), expert | 40 | 45975 | 100.00 % | 0 | 0.270 | 0.270 | 0.057 / 0.039 | 6 / 1 | 0.0e+0 | 1.350 (40) | 1.350, 1.493 | 3.3 % (1.4 %) | 1.200 |
| model konec D2 (π 4.21), weak | 40 | 48588 | 100.00 % | 0 | 0.395 | 0.345 | 0.201 / 0.150 | 7 / 4 | 0.0e+0 | 1.350 (40) | 1.350, 1.484 | 2.1 % (0.7 %) | 1.200 |
| model konec D2 (π 4.21), expert | 40 | 51810 | 100.00 % | 0 | 0.395 | 0.345 | 0.051 / 0.150 | 9 / 1 | 0.0e+0 | 1.350 (40) | 1.480, 1.493 | 2.0 % (1.2 %) | 1.200 |
| model konec D3 (π 6.31), weak | 40 | 49410 | 100.00 % | 0 | 0.401 | 0.419 | 0.223 / 0.150 | 11 / 2 | 0.0e+0 | 1.350 (40) | 1.350, 1.472 | 3.5 % (0.6 %) | 1.200 |
| model konec D3 (π 6.31), expert | 40 | 53844 | 100.00 % | 0 | 0.469 | 0.444 | 0.000 / 0.150 | 10 / 0 | 0.0e+0 | 1.350 (40) | 1.350, 1.485 | 2.6 % (0.7 %) | 1.200 |
| model plná bez Atlasu (π 8.86), weak | 40 | 43218 | 100.00 % | 0 | 0.395 | 0.286 | 0.191 / 0.068 | 8 / 4 | 0.0e+0 | 1.350 (40) | 1.350, 1.490 | 4.6 % (1.6 %) | 1.200 |
| model plná bez Atlasu (π 8.86), expert | 40 | 47712 | 100.00 % | 0 | 0.396 | 0.331 | 0.101 / 0.043 | 9 / 2 | 0.0e+0 | 1.350 (40) | 1.489, 1.490 | 4.8 % (2.0 %) | 1.200 |
| model konec D3 + dive, average | 40 | 50943 | 100.00 % | 0 | 0.528 | 0.373 | 0.484 / 0.150 | 12 / 4 | 0.0e+0 | 1.350 (40) | 1.350, 1.446 | 2.4 % (0.5 %) | 1.200 |
| model konec D3 + rocket, average | 40 | 52356 | 100.00 % | 0 | 0.530 | 0.383 | 0.209 / 0.150 | 11 / 2 | 0.0e+0 | 1.350 (40) | 1.350, 1.474 | 2.8 % (0.5 %) | 1.200 |

Sloupce: „ven / dovnitř max“ = nejrychlejší změna celkové šířky (včetně stavových záběrů vista, district, intro); „přebytek“ = jen složka z přebytku rychlosti (`ex`). Změna směru se počítá, když |d ln W / dt| > 0,01 / s, nejvyšší počet v posuvném okně 10 s.

### Verdikty proti cílům 01 §4.2 (cíle jsou zástupné)

| Metrika | Cíl | Výsledek | Verdikt |
|---|---|---|---|
| Vlaštovka v bezpečné zóně (x 90–300, y 40–320), mimo obraz | ≥ 99 %, 0 | 100 % ve všech scénářích, 0 | HEALTHY |
| Rychlost zoomu z přebytku | ven ≤ 0,8 / s, dovnitř ≤ 0,25 / s | ven ≤ 0,571, dovnitř ≤ 0,150 | HEALTHY |
| Rychlost zoomu celkem (se stavovými záběry) | dtto | ven ≤ 0,571, **dovnitř až 0,452** | CONCERNS: vista (návrat z 1,1), intro (punch 0,87) a district mají dál symetrické tlumení 0,8 ln/s, jak spec říká „dnes, násobí se“. Pomalé přiblížení platí jen pro přebytek. |
| Změny směru zoomu za 10 s | ≤ 1 | přebytek: 0 bez zásahů, **2–4 se zásahy**; celkem až 12 (vista, intro, district) | CONCERNS, viz BLOCKED níže: každý zásah dá „vydechnutí“ (odměna podle rozhodnutí 06) a pak pomalý návrat, při událostech po 3–5 s to jsou 2 změny na událost. |
| Změna W během zámku QTE | 0 | 0 ve všech letech | HEALTHY |
| W při prvním varování | ≥ 0,9·W_let·T ve 100 % seedů | min 1,027 (model, slabý hod), jinak ≥ 1,197 | HEALTHY |
| Viditelné oddálení v raném hodu (Dart, π 1) | max W / W_let ≥ 1,25 | hra Dart výchozí 1,342 ve všech 180 letech; model 1. hod expert 1,349, **weak min 1,027** (medián 1,276) | HEALTHY pro hru; slabý (málo nabitý) hod modelu má malý přebytek záměrně (01 §2.5 bod 2) |
| Podíl času na W_max | ≤ 10 % letu i v pozdní fázi | max 4,8 % (plná výbava), průměr ≤ 2 % | HEALTHY |
| Konec oddálení výhozu | ≤ 1,2 s (první událost 1,5 s) | 1,200 s ve všech letech | HEALTHY |
| Raketa, Shooting Star (plné oddálení) | s ≥ 1 → +35 % | výtrysk (`f.burst`) v modelu posouvá x, ne `f.vx` | NOT ASSESSED: až nový systém přijde do hry, `frame.directorFor` musí dostat efektivní rychlost včetně výtrysku |
| Délka vlaštovky v CSS px | telefon ≥ 24 (P5), desktop ≥ 40 | spočteno níže, ne z pixelů | NOT ASSESSED (prohlížeč) |
| Výkon při W_max a W_aim | rozpočty render3d | – | NOT ASSESSED (`perf-check` ve viditelném okně) |

### Velikost vlaštovky (spočtená, CSS px = L(W)/W · šířka scény)

| W (m) | 360 | 390 | 768 | 1280 | 1920 |
|---|---|---|---|---|---|
| 7 (míření, telefon) | 25,7 | 27,9 | 54,9 | 91,4 | 137,1 |
| 16 (míření, desktop) | 24,0 | 24,0 | 24,0 | 40,0 | 60,0 |
| 30 | 24,0 | 24,0 | 30,1 | 50,2 | 75,2 |
| 60 | 24,0 | 24,0 | 38,6 | 64,4 | 96,6 |
| 120 (let) | 24,0 | 25,2 | 49,6 | 82,6 | 123,9 |
| 162 (let po výhozu, Dart) | 24,0 | 24,0 | 36,7 | 61,2 | 91,9 |
| 248 (W_max při π 8,9) | 24,0 | 24,0 | 24,0 | 40,0 | 60,0 |

Záběr míření se podle šířky scény volí sám (`aimWidth`): 360 a 375 px → 7 m, 768 px → 14,2 m, od 864 px → 16 m; hodnoty v řádcích 7 a 16 m jsou pro srovnání. Na desktopu (1280) roste vlaštovka při výhozu ze 40 na 61 px (Dart, W 162 m), při W 120 m na 83 px (02 M-2). Mezi 500 a 767 px platí jen 0,5 m v ruce a 7,75 m za letu bez podlahy 24 px: při W_max 248 m je na 640 px 20 px.

## Co není hotové nebo ověřené

- **Vzhled ve hře NOT ASSESSED** (prohlížeč nepoužit): záběr 16 m s dnešním obřím dítětem (11,75 m) a přístavkem, rozhraní zbytku Dílny, kontrast, matice viewport × stav, oba jazyky, reduced motion v prohlížeči.
- **Cyber styl, vlaštovka v ruce:** `workshop.js` (není v mém zadání) bere `plan.hand.scale` jen v papíru (`sc=scale*(paper?p.scale??1:1)`). V cyber stylu je proto vlaštovka v ruce dál 7,75 m, tedy v záběru 16 m přes polovinu obrazu, a po výhozu (plane.js už měří v obou stylech) skočí na 0,5 m. Oprava je jeden řádek ve `workshop.js:133`: `sc=scale*(p.scale??1)`.
- **Částice v klidu a při výhozu:** `fx-map.particleScreen` násobí světové px `k` z `view`. V klidu je teď `k ≈ 19` (dřív 1,25), takže efekty juice v klidu a v prvních snímcích výhozu (`fxEvent('throw')`) budou ~15× větší. NOT ASSESSED, `fx-map.js`/`juice.js` nejsou v zadání.
- **Mimo zadání, neudělané:** opoždění kamery 0,1 s při puštění, zástava 70 ms při perfektu (01 §2.2), sklon −8° při míření (02 §3) a prolnutí 0,2 s v reduced motion (renderer má jen příznak `camera.cut`).
- **Prototypy:** `prototype/styly/papir.js` volá `restCamera()` bez šířky, takže dostane nový záběr 16 m místo 244 m.
- Dítě v klidu: `kidPose` couvá o 1,43 m a dýchá ±0,48 m (měřítko obřího dítěte), v záběru 16 m to bude výrazné. Patří k S4 (dítě 1,2 m).

## Příloha: skript metrik

```js
// node metrics.mjs <kořen repa>
import {pathToFileURL} from 'node:url';
const root=pathToFileURL((process.argv[2]??'.').replace(/\\/g,'/')+'/').href,I=p=>import(new URL(p,root).href);
const {directorFor,planeWorld,planeLength,CAMERA}=await I('src/render3d/frame.js');
const {cameraView,ZOOM_RANGE,LAUNCH}=await I('src/render3d/camera.js');
const {tempoZoom}=await I('src/render3d/geometry.js');
const core=await I('src/core.js'),{eventInput}=await I('src/events.js'),{random}=await I('src/random.js');
const M=await I('simulation/progression/model.mjs'),{botsFor}=await I('simulation/progression/abilities.mjs'),{P}=await I('simulation/progression/params.mjs');
const css=1280;
function camRun(f,advance){
 let prev={director:directorFor({f:null,visual:{cssWidth:css,charge:.8}}),dirT:0};const fr=[];
 while(!f.landed&&f.t<180){advance(f);const d=directorFor({f,prev,time:f.t,visual:{cssWidth:css}}),[X,Y]=planeWorld(f),v=cameraView(d.camera,X,Y);
  fr.push({t:f.t,w:d.camera.width,ex:d.ex,lock:d.lock,state:d.state,launch:!!d.launch,px:v.px,py:v.py,ev0:f.events[0]?.phase});prev={director:d,dirT:f.t};}
 return fr;
}
function gameFlight(model,levels,seed,profile){
 const f=core.createFlight(model,levels,seed),rng=random((seed^0x9E3779B9)>>>0),pr=profile*.5,dec=f.events.map(()=>({hit:rng()<profile,perfect:rng()<pr}));
 const fr=camRun(f,f=>{f.events.forEach((e,i)=>{const d=dec[i];if(!d.hit||e.result)return;
  if(e.type==='gust'&&f.t>=e.at+(d.perfect?1.4:1.2))eventInput(f,'down','sim');
  if(e.type==='bird'){if(e.heldAt===null&&f.t>=e.at+1)eventInput(f,'down','sim');if(e.heldAt!==null&&f.t>=e.heldAt+(d.perfect?.75:.55))eventInput(f,'up','sim');}});core.step(f);});
 return {fr,pi:1,f};
}
function modelFlight(kit,seed,profile){
 const f=M.createFlight(kit,{key:'cam'+seed,n:5+seed,profile}),bots=botsFor(kit);
 const fr=camRun(f,f=>{M.playerEvents(f);for(const b of bots)b(f);M.step(f);M.updateEvents(f);for(const e of f.events)if(e.result&&e.resolvedAt==null)e.resolvedAt=f.t;});
 return {fr,pi:f.d.pi,f};
}
// metrics(): bezpečná zóna a mimo obraz z cameraView; d ln W/dt a d ln ex/dt po výhozu (t > LAUNCH.dur); změny směru (|d| > 0,01/s) v okně 10 s;
// Δ ln W mezi po sobě jdoucími snímky v zámku; W/(120·T) při prvním varování; max W/(120·T); podíl snímků s W ≥ 0,99·1,5·120·T.
// Scénáře: hra Dart/Glider × výbava 0/0/0 a 5/5/5 × zásahy 0/50/100 %, seedy 1–60; model P.curve[0,2,4,5,6,9] × weak/expert
// a konec D3 + dive / rocket (average), seedy 1–40.
```
