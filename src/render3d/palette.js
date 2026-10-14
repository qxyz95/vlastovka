// Palety barev pro 3D a UI vrstvu (čisté). Zdroj pravdy: stylová bible research/design/02-styl.md (kap. 2, 7). Nová barva = nový token se jménem
// role zde, ručně psaný hex v jiných souborech src/render3d/ ne; odchylky jen mix() z tokenu. Barvy čtvrtí (nebe, světla, stopa) jsou v mood.js.
// Vrstvy: primitivní tokeny (kap. 2.1) → ROLE (kap. 2.2) → CYBER (paleta podle částí scény, čtou ji scene/plane/ui-layer/companion3d).
// palette(id) → paleta; neznámé id = cyber. Stará jména klíčů zůstávají, dokud je dávky G1–G3 nepřevedou.
export const mix=(a,b,k)=>{const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),x=h(a),y=h(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
// Jádro (kap. 2.1): jedna tuš, bílý papír, jedna azurová, jedna magenta, zlatá jen hodnota, žlutý fokus; UI tokeny Atlasu (kap. 7).
export const INK='#15101f',PAPER='#ffffff',CYAN='#5cf2ff',MAGENTA='#ff4f9e',GOLD='#ffd166',FOCUS='#fff27a',MISS='#cfd3e0',
 NIGHT='#1b1444',PLATE='#251c57',PLATE2='#30256d',TEXT='#f5f1ff',DIM='#c9c0f0',MUTE='#a79cd8';
// Písma (kap. 7, Atlas --display/--body): zúžené bezpatkové, žádné monospace.
export const DISPLAY='"Bahnschrift Condensed","Bahnschrift SemiBold Condensed","Avenir Next Condensed","Roboto Condensed","Arial Narrow",sans-serif',
 BODY='"Bahnschrift","Segoe UI","Avenir Next",system-ui,sans-serif';
// Dekorace: maják a červená světla (jen dekorace, kap. 2.2), kouř a pára šedofialové pod jas vlaštovky (kap. 5.3: ≤ 60 % svítivosti papíru).
const SMOKE='#8a7aa8',BEACON='#ff4d6d';
export const STEAM=mix('#f3e6ff',SMOKE,.5);
// Teplý pastel místo zlaté v dekoracích (zlatá jen hodnota a neon, kap. 2.2).
const PEACH=mix(GOLD,MAGENTA,.25);
export const TOKENS=Object.freeze({ink:INK,paper:PAPER,cyan:CYAN,magenta:MAGENTA,gold:GOLD,focus:FOCUS,miss:MISS,night:NIGHT,plate:PLATE,plate2:PLATE2,
 text:TEXT,dim:DIM,mute:MUTE,display:DISPLAY,body:BODY,steam:STEAM,beacon:BEACON});
// Role (kap. 2.2): úspěch azurová, perfekt magenta všude, hodnota (mince, milník, cena) zlatá, minutí neutrální, varování „Get ready“ fokus.
export const ROLE=Object.freeze({success:CYAN,perfect:MAGENTA,value:GOLD,miss:MISS,warning:FOCUS});
const CREASE=[CYAN,MAGENTA],TRAIL=['#3c91ab','#913a90'],FX={smoke:SMOKE,water:'#78d8ee',beacon:BEACON,bird:'#d0daeb',rain:'#7fd6ff',star:'#e8f6ff',glow:true};
const COMPANION={body:'#cfc4f4',head:'#e6defe',beak:'#ffb347',tail:'#8f7fd0',bread:'#f0b860',wing:'#a898e6',eye:MAGENTA,steam:STEAM,vent:'#2a2440',grate:CYAN};
export const CYBER={
 id:'cyber',
 // Vlaštovka (kap. 4, 5.1): výplň papír (tónování světlem čtvrti nejvýš maxTint), obrys tuš, nejsilnější obrys ve scéně (plane.js, scene.js).
 plane:{fill:PAPER,outline:INK,crease:CREASE,maxTint:.2},
 // Stopa: jádro v barvě čtvrti (mood.trail; trail[0] je jen výchozí), lem trailEdge na obou okrajích ≥ 1 CSS px (kap. 5.2).
 trail:TRAIL,trailEdge:INK,fx:FX,
 // kid a shop: kopie 2D tématu cyber, ve 3D je nic nečte (Dílna bere workshop níže).
 kid:['#9e91bd',CYAN,MAGENTA,'#38466f'],shop:{wall:'#121b32',roof:'#793765',sign:MAGENTA,text:'#17172f',window:'#223c4d',light:CYAN,door:'#35344f'},
 // Částice podle druhu z juice.js: 0 prach, 1 jiskra perfektu, 2 jiskra úspěchu, 3 větrná čárka, 4 jiskra hodnoty (milník, mince; juice.js zatím dává milníku 1).
 particles:[SMOKE,ROLE.perfect,ROLE.success,TRAIL[0],ROLE.value],
 // Popupy: perfekt magenta, milník zlatý (hodnota), obrys písma tuš, písmo DISPLAY.
 popup:{perfect:ROLE.perfect,success:ROLE.success,miss:ROLE.miss,milestone:ROLE.value,land:PAPER,outline:INK,font:DISPLAY},
 flash:PAPER,
 // QTE kruh (ui-layer drawQte): stopa MUTE (≥ 3 : 1 na tušovém disku, G4), úspěch, perfekt, bílý bod, čárkované varování, výsledek jednou barvou; disc = tmavý podklad pod kruhem (kap. 5.5).
 qte:{track:MUTE,success:ROLE.success,perfect:ROLE.perfect,dot:PAPER,warning:ROLE.warning,disc:INK,discAlpha:.6,
  result:{perfect:ROLE.perfect,success:ROLE.success,other:'#6b6f8a'},
  gust:mix(CYAN,PAPER,.6),bird:{body:'#ad9fce',wing:CYAN,beak:COMPANION.beak}},
 // Štítky událostí a mířicí panel na tokenech UI (kap. 7); lišta síly fokusová žlutá na desce PLATE.
 label:{bg:NIGHT,text:TEXT},
 aim:{arrow:FOCUS,panel:PLATE,text:TEXT,bar:FOCUS,cap:PAPER},
 speed:{line:PAPER,ink:INK},
 // Město ve 3D (kap. 2.3, U11: bez zelené; Docks stěny #215a8c, střechy indigo, Core akcent z CYAN, Suburbs pastely bez tyrkysové) (dřív natvrdo ve scene.js a city.js z prototypu): stěna budov podle čtvrti (tóny 0–2 z ní zesvětlením, ztmavením a mlhou),
 // akcent (tón 3), střechy a lemy (tóny 4, 5), zem čtvrti (groundDark = ztmavení), pastelové domy Violet Suburbs (mísí se s duskFog), mlha fog0,
 // záře majáků (beacon) a pruhy u vody / ulic (water, lane).
 city:{biomes:['#322749','#215a8c','#63384e','#44214e'],
  // Zem Docks indigová: #10294a po světle Docks, mlze a posterizaci padal na tyrkysovou (G4, test render3d-leftovers).
  accent:['#3d7fa8','#a8458f','#c27a3a',mix(CYAN,INK,.4)],ground:['#4b3778','#1c2878','#342b38','#101a2c'],groundDark:[0,0,.25,.25],
  // Neon jen v cedulích, lampách a oknech: CYAN, MAGENTA, GOLD (kap. 2.2); 4. barva oken = teplé světlo mix(GOLD,PAPER).
  neon:[MAGENTA,CYAN,GOLD],windows:[MAGENTA,CYAN,GOLD,mix(GOLD,PAPER,.5)],
  suburbs:['#8f6ad8','#c56fb5','#6f86e0','#e08aa0','#ae5fc8','#a58be8','#d98ad0'],far:'#7a4f9e',light:PAPER,shade:'#1a1240',roof:'#2a1d52',trim:'#2b2352',
  fog0:'#4a1d63',duskFog:'#9c5598',beacon:BEACON,water:'#2f6f9a',lane:'#3b2d6e'},
 // Nebe ve scene.js (měsíc, slunce ve 3 kruzích, hvězdy) a výchozí světla, než přijde první nálada z mood.js.
 sky:{moon:'#ffe3f4',sun:{halo:'#ff9ec0',mid:'#ffc89a',core:'#ffe6b8'},stars:'#e8f6ff'},
 lights:{hemiSky:'#7f73ff',hemiGround:'#2a1030',key:'#ffe8ff',rim:MAGENTA},
 // Holub-kurýr a pára z ventilace (companion3d.js).
 companion:COMPANION,
 // Pára a kouř (life3d.js komíny, lokomotiva, tržnice; companion3d.js ventilace).
 steam:STEAM,
 // Živá čtvrť (life3d.js): neonové akcenty jen CYAN / MAGENTA (GOLD jen v cedulích), červená světla = BEACON, žádná zelená; koště robota dřevěné, ne zlaté.
 life:{car:{body:PAPER,cabin:'#e8e0ff',wheel:'#241838',head:'#fff4b8',tail:BEACON},
  train:{body:PAPER,roof:'#3a2a5a',wheel:'#241838',cars:['#ff5e8a',CYAN,'#a48bff',MAGENTA,CYAN,'#a48bff'],window:'#ffd68a'},
  windows:['#ffd27a','#ffb867','#fff0b0','#ff9ed2'],bulb:{on:'#ffd86b',off:'#4a2a4a',party:[PAPER,MAGENTA]},antenna:{on:BEACON,off:'#3a1a2a'},drone:{body:'#6a5aa8',rotor:'#d8c8ff',parcel:'#d9a35a',on:CYAN,off:'#1a1a3a'},
  bird:'#3a2050',basket:'#8a5a4a',rope:'#e0d0ff',cloud:'#ffd0e6',
  robot:{body:mix(CYAN,INK,.15),panel:MAGENTA,wheel:'#2a1d44',head:mix(CYAN,PAPER,.3),antenna:'#d8c8ff',eye:CYAN,tip:BEACON,stick:'#d9a35a',broom:'#e0a050'},
  pigeon:{body:'#9a8ac8',head:'#b8a8e8',beak:'#ffb347',tail:'#6a5aa8',bread:'#e0a050',eye:MAGENTA,wing:'#7a6ab0'},
  // Otočná reklama v pořadí FOLD & FLY, DUMPLINGS, BOLTS SWEEPS, NOODLES 24H: nejbližší z CYAN / MAGENTA / GOLD k dřívějším #ff4fc3, #ffb347, #53e6ff, #9dff6a.
  ads:[MAGENTA,GOLD,CYAN,GOLD],
  // Rozmístění Suburbs (life.js): oblečení a pastely bez zelené a bez GOLD (dřív #5ee0c8, #b4f06a, #ffd166 → CYAN, MAGENTA, PEACH),
  // statické doplňky (komíny, nádrže, antény, stánky, šňůry, tunel s kopcem, koleje, nástupiště, sloupy billboardu).
  people:{cloth:['#ff6fae',PEACH,CYAN,'#9d7dff','#ff8f5a','#7fd0ff',PAPER,MAGENTA],skin:['#ffd9b8','#e8b48f','#c98b62','#8d5a3b','#ffe6d0']},
  pastel:['#ff6fae',PEACH,CYAN,'#a48bff','#ff9a6a','#7fd0ff'],
  chimney:'#7a4f86',tanks:{body:'#6a9ad8',leg:'#3a2a5a',roof:'#ff8fb8'},mast:'#d8c8ff',stall:{base:'#a0627a',post:'#f0e0ff',stripe:'#fff4e8'},line:'#efe6ff',
  tunnel:{wall:'#5b4a92',mouth:'#1a1030'},pyramid:'#5a3f86',rail:{bed:'#3a2a4a',track:'#d0c0f0'},platform:'#8a6aa8',pole:'#3a2a5a'},
 // Dílna PAPER LAB (workshop.js PAL): vlaštovka v ruce jako letící (papír, záhyb magenta), azurová a magenta sjednocené.
 workshop:{wall:'#2c3c66',annex:'#3a3f74',roof:'#a24a86',trim:'#1a2142',door:'#4b4a72',frame:'#141a33',window:'#2a4d63',light:CYAN,warm:'#ffd59a',
  skin:'#c4b6e8',visor:CYAN,shirt:MAGENTA,legs:'#45558a',rail:'#7a5bb0',plane:PAPER,crease:MAGENTA}
};
// ── Papírové město (?styl=papir). Zdroj pravdy: bible research/design/05-styl-papir.md (kap. 2, 8, 9, 11), prototyp prototype/styly/papir-data.js.
// Tokeny kap. 2.1 (stejná jména jako papir-data.js TOKENS), role kap. 2.2. Nebe, opar a světlo čtvrtí jsou v paper-mood.js.
export const PAPER_TOKENS=Object.freeze({paper:'#ffffff',cream:'#fbf6ec',card:'#f4ecdc',graphite:'#2a2622',pencil:'#6b6158',pencil700:'#4a4038',kraft:'#c9a57c',kraftDark:'#9c7a55',
 desk:'#d9c4a0',tape:'#efe0a8',tomato:'#d9472b',tomato600:'#c43f25',tomatoDark:'#a8341e',teal:'#13807d',mustard:'#e2a43a',mustardText:'#8a5a00',cobalt:'#2456c9',miss:'#8c8379',shade:'#3b3560',
 display:'"Trebuchet MS","Segoe UI Semibold","Segoe UI","Avenir Next",sans-serif',body:'"Segoe UI","Avenir Next",system-ui,sans-serif',hand:'"Segoe Print","Bradley Hand",cursive'});
const PT=PAPER_TOKENS;
// Jedna role = jedna barva; perfekt se od úspěchu liší i tvarem (hvězda). planeUnder = spodní plochy vlaštovky (kap. 2.2).
export const PAPER_ROLE=Object.freeze({planeFill:PT.paper,planeUnder:'#cdd3e3',planeEdge:PT.graphite,trail:PT.graphite,success:PT.teal,perfect:PT.tomato,value:PT.mustard,
 valueText:PT.mustardText,miss:PT.miss,focus:PT.cobalt,warning:PT.graphite,text:PT.graphite,dim:PT.pencil});
// Karty čtvrtí (kap. 2.3): ulice, střed, dálka, kopce, střechy, zeleň, země. Čtvrť 1 navržená, 2–4 prozatímní (zeleň, okna a kopce bez vlastní barvy berou čtvrť 1 / dálku).
const D1C={near:['#e8735a','#f2b65a','#5aa6a0','#f4ece0','#e98fa0','#7f9ed6','#f0a27a','#9cc3a6'],mid:['#e9b9a5','#c6d8c0','#b6c9e4','#f0d59e','#e2bfd5','#f2c7a8'],
 far:['#a9b6d6','#b4b1d4','#a7bdd6'],hills:['#b3c3dc','#bfc6e0'],roof:['#3d4f7a','#b5503c','#6a5a8e','#3d4f7a'],trees:['#7fb08a','#5f9e86','#a8c48a','#8fbf9a'],trunk:PT.kraftDark,
 ground:{near:'#dcc29b',mid:'#e8d6b8',far:'#efe3cf'},window:'#3d4f7a',flat:PT.kraftDark,hedge:['#8fbf9a','#7fb08a'],glass:'#cfe2ec',glassRoof:'#9fc3cf'};
const dc=(near,mid,far,roof,ground,o={})=>Object.freeze({...D1C,near,mid,far,hills:[far[0],far[0]],roof:[roof,roof,roof,roof],ground:{near:ground,mid:ground,far:ground},...o});
const CARDS=Object.freeze([Object.freeze(D1C),
 dc(['#22355e','#c8a079','#f6eedd','#e0533a'],['#3d6f8f','#e8b03e','#5b8fb0'],['#9ec2d6'],'#22355e','#c8a079',{sea:'#2c6e9b'}),
 dc(['#b8863b','#f6eedd','#e0533a','#8fb07a'],['#d9a35a','#c98a4a','#e0b070'],['#d9967a'],'#7a3b2e','#b8863b'),
 dc(['#1d2b4d','#26365c'],['#2b3f6b','#33497a','#5a4a7a'],['#3a4a73'],'#151f38','#1d2b4d',{lantern:'#f2c14e'})]);
const PAPER_DISC='#fffaf0',PAPER_WARM='#ffe2a8',SKIN=['#f3d2b4','#e2b08c','#c98b62','#8d5a3b'],BALLOONS=['#e8735a','#f2b65a','#5aa6a0','#e98fa0','#7f9ed6'];
// Klíče jako CYBER (stejné čtenáře). Co bible ani prototyp nemají (drony, robot, reklamy, světla aut, vlak), zůstává z CYBER, než to rozhodne P2 / product-designer.
export const PAPIR={
 id:'papir',
 // Vlaštovka (kap. 3, 5.1 P1): papír bez tónování, obrys grafit 2,6 px, přehyb tužkou, spodní plochy planeUnder.
 plane:{fill:PT.paper,under:PAPER_ROLE.planeUnder,outline:PT.graphite,crease:[PT.pencil,PT.pencil],maxTint:0,outlinePx:2.6},
 // Stopa grafitová (ve čtvrti 4 krémová přes mood.trail), bez lemu: trailEdge = jádro. Tvar čárky v paper-cards.js PAPER_TRAIL.
 trail:[PT.graphite,PT.graphite],trailEdge:PT.graphite,
 fx:{smoke:PT.cream,water:CARDS[1].sea,beacon:PT.tomato,bird:PT.pencil,rain:'#a6d0e8',star:PT.cream,glow:false},
 kid:[PT.mustard,'#3d4f7a',SKIN[0],PT.graphite],shop:{wall:PT.cream,roof:PT.tomato,sign:PT.card,text:PT.graphite,window:PAPER_WARM,light:PAPER_WARM,door:'#3d4f7a'},
 // 0 prach (krém), 1 perfekt, 2 úspěch, 3 větrná čárka (tužka), 4 hodnota.
 particles:[PT.cream,PAPER_ROLE.perfect,PAPER_ROLE.success,PT.graphite,PAPER_ROLE.value],
 // Popupy jako papírové štítky (kap. 7): krémový podklad, grafitový text, natočení ±1,5°, stín zvednutí.
 popup:{perfect:PAPER_ROLE.perfect,success:PAPER_ROLE.success,miss:PAPER_ROLE.miss,milestone:PAPER_ROLE.valueText,land:PT.graphite,outline:PT.graphite,font:PT.display,bg:PT.cream,tilt:1.5},
 flash:PT.cream,
 // QTE (kap. 11): krémové mezikruží 0,95 se stínem zvednutého papíru, stopa warm-grey 6 px, úspěch 9 px, perfekt 11 px + hvězda, bod grafit.
 qte:{track:PT.miss,success:PAPER_ROLE.success,perfect:PAPER_ROLE.perfect,dot:PT.graphite,warning:PT.graphite,disc:PT.cream,discAlpha:.95,
  shadow:{color:'#28190a',alpha:.35,blur:4,dx:3,dy:3},width:{track:6,success:9,perfect:11},
  result:{perfect:PAPER_ROLE.perfect,success:PAPER_ROLE.success,other:PT.miss},gust:PT.cream,gustEdge:PT.graphite,bird:{body:'#b6c9e4',wing:'#7f9ed6',beak:'#f0a27a'}},
 // Štítek události: grafitová páska s krémovým textem, natočená −2° (kap. 11).
 label:{bg:PT.graphite,text:PT.cream,tilt:-2},
 aim:{arrow:PT.graphite,panel:PT.cream,text:PT.graphite,bar:PT.graphite,cap:PT.cream},
 // Rychlostní čáry: tenké grafitové čárky tužkou (1 px, alfa 0,5), pás ±24 px kolem vlaštovky volný (kap. 7).
 speed:{line:PT.graphite,ink:PT.graphite,alpha:.5,width:1,gap:24},
 // Město (kap. 2.3, 3): karty podle čtvrti, řezaná hrana cut, boky side, stín shade, mraky cloud, teplé okno warm.
 city:{districts:CARDS,cut:PAPER_DISC,side:'#5b4f7a',shadow:PT.shade,cloud:PAPER_DISC,warm:PAPER_WARM},
 sky:{moon:'#f6eedd',sun:{halo:'#ffd9a8',mid:'#ffd9a8',core:'#fff8e8'},stars:PT.cream},
 lights:{hemiSky:PT.paper,hemiGround:'#5b4f7a',key:'#fff8e8',rim:'#ffd9a8'},
 // Holub (origami, šedomodrý, kap. 7) a pára v barvách čtvrti 1 (zobák broskvový, hořčicová jen hodnota); tvar později (P3).
 companion:{body:'#b6c9e4',head:'#cfe2ec',beak:'#f0a27a',tail:'#7f9ed6',bread:PT.kraft,wing:'#a7bdd6',eye:PT.graphite,steam:PT.cream,vent:PT.pencil,grate:PT.pencil},
 steam:PT.cream,
 life:{...CYBER.life,people:{cloth:['#e8735a','#f2b65a','#5aa6a0','#7f9ed6','#e98fa0','#f4ece0'],skin:SKIN},pastel:BALLOONS,balloons:BALLOONS,cloud:PAPER_DISC,
  chimney:'#9a4a3a',tanks:{body:'#9fb7d9',leg:PT.pencil,roof:PT.tomato},mast:PT.pencil,stall:{base:PT.card,post:PT.pencil,stripe:PT.cream,stripes:[PT.tomato,'#5aa6a0','#e98fa0','#f2b65a']},
  line:PT.pencil,bunting:[PT.tomato,'#f2b65a',PT.teal,PT.cream,'#7f9ed6'],tunnel:{wall:'#9cc3a6',mouth:PT.graphite},pyramid:'#a8c48a',
  rail:{...CYBER.life.rail,bed:PT.kraftDark},platform:PT.card,pole:PT.pencil,car:{...CYBER.life.car,cabin:PT.cream,wheel:PT.graphite},basket:PT.kraftDark,rope:PT.pencil},
 // Místo odhodu (bible 05 kap. 9.4–9.5, rozhodnutí 06 bod 6, S-2 a S-3): krémový dům, rajčatová střecha, teplé sklo; rámy, dveře, zábradlí a nohy
 // dítěte tmavomodré D1.window (nikdy grafit), pláštěnka (shirt) D1.near[1] #f2b65a místo hořčicové, skládaná čepice (visor) z kraftu s rajčatovým
 // proužkem (capBand), klika krémová, provázky tužkou. sign* = papírová cedulka PAPER LAB. annex jen kvůli shodě klíčů s cyber (přístavek zrušen).
 workshop:{wall:PT.cream,annex:'#5aa6a0',roof:PT.tomato,trim:PT.cream,door:D1C.window,frame:D1C.window,window:PAPER_WARM,light:PAPER_WARM,warm:PAPER_WARM,
  skin:SKIN[0],visor:PT.kraft,capBand:PT.tomato,shirt:D1C.near[1],legs:D1C.window,rail:D1C.window,plane:PT.paper,crease:PT.pencil,
  desk:PT.kraftDark,cup:PT.teal,knob:PT.cream,sign:PT.card,signText:PT.graphite,signLine:PT.tomato,string:PT.pencil}
};
export const PALETTES={cyber:CYBER,papir:PAPIR};
export const palette=id=>PALETTES[id]??CYBER;
