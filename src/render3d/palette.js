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
 // QTE kruh (ui-layer drawQte): stopa, úspěch, perfekt, bílý bod, čárkované varování, výsledek jednou barvou; disc = tmavý podklad pod kruhem (kap. 5.5).
 qte:{track:'#3b4170',success:ROLE.success,perfect:ROLE.perfect,dot:PAPER,warning:ROLE.warning,disc:INK,discAlpha:.6,
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
  accent:['#3d7fa8','#a8458f','#c27a3a',mix(CYAN,INK,.4)],ground:['#4b3778','#10294a','#342b38','#101a2c'],groundDark:[0,0,.25,.25],
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
  ads:[MAGENTA,GOLD,CYAN,GOLD]},
 // Dílna PAPER LAB (workshop.js PAL): vlaštovka v ruce jako letící (papír, záhyb magenta), azurová a magenta sjednocené.
 workshop:{wall:'#2c3c66',annex:'#3a3f74',roof:'#a24a86',trim:'#1a2142',door:'#4b4a72',frame:'#141a33',window:'#2a4d63',light:CYAN,warm:'#ffd59a',
  skin:'#c4b6e8',visor:CYAN,shirt:MAGENTA,legs:'#45558a',rail:'#7a5bb0',plane:PAPER,crease:MAGENTA}
};
export const PALETTES={cyber:CYBER};
export const palette=id=>PALETTES[id]??CYBER;
