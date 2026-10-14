// Palety barev pro 3D a UI vrstvu (čisté). Jediný styl je Papírové město (R0, rozhodnutí 06 15. 10.): zdroj pravdy bible
// research/design/05-styl-papir.md (kap. 2, 8, 9, 11), prototyp prototype/styly/papir-data.js. Nová barva = nový token se jménem role zde,
// odchylky jen mix() z tokenu. Nebe, opar a světlo čtvrtí jsou v paper-mood.js. palette() → PAPIR (parametr se ignoruje).
export const mix=(a,b,k)=>{const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),x=h(a),y=h(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
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
// Život čtvrti, který ještě kreslí life.js a life3d.js (auta, vlak, lidé, komíny, nádrže, stánky, okna, žárovky): barvy převzaté beze změny ze
// starého stylu, aby se vzhled hry s R0 nezměnil. H4 (research/plan-hratelnost/03-art.md kap. 3.2 P1–P2) ho nahradí papírovými modely z katalogu
// a barvami PAPIR.life; pak OLD_LIFE smazat.
const PEACH=mix('#ffd166','#ff4f9e',.25);
export const OLD_LIFE=Object.freeze({car:{body:PT.paper,cabin:'#e8e0ff',wheel:'#241838',head:'#fff4b8',tail:'#ff4d6d'},
 train:{body:PT.paper,roof:'#3a2a5a',wheel:'#241838',cars:['#ff5e8a','#5cf2ff','#a48bff','#ff4f9e','#5cf2ff','#a48bff'],window:'#ffd68a'},
 windows:['#ffd27a','#ffb867','#fff0b0','#ff9ed2'],bulb:{on:'#ffd86b',off:'#4a2a4a',party:[PT.paper,'#ff4f9e']},antenna:{on:'#ff4d6d',off:'#3a1a2a'},
 bird:'#3a2050',basket:'#8a5a4a',rope:'#e0d0ff',
 people:{cloth:['#ff6fae',PEACH,'#5cf2ff','#9d7dff','#ff8f5a','#7fd0ff',PT.paper,'#ff4f9e'],skin:['#ffd9b8','#e8b48f','#c98b62','#8d5a3b','#ffe6d0']},
 pastel:['#ff6fae',PEACH,'#5cf2ff','#a48bff','#ff9a6a','#7fd0ff'],
 chimney:'#7a4f86',tanks:{body:'#6a9ad8',leg:'#3a2a5a',roof:'#ff8fb8'},mast:'#d8c8ff',stall:{base:'#a0627a',post:'#f0e0ff',stripe:'#fff4e8'},line:'#efe6ff',
 tunnel:{wall:'#5b4a92',mouth:'#1a1030'},pyramid:'#5a3f86',rail:{bed:'#3a2a4a',track:'#d0c0f0'},platform:'#8a6aa8'});
export const PAPIR={
 id:'papir',
 // Vlaštovka (kap. 3, 5.1 P1): papír bez tónování, obrys grafit 2,6 px, přehyb tužkou, spodní plochy planeUnder.
 plane:{fill:PT.paper,under:PAPER_ROLE.planeUnder,outline:PT.graphite,crease:[PT.pencil,PT.pencil],outlinePx:2.6},
 // Stopa grafitová (ve čtvrti 4 krémová přes mood.trail), bez lemu. Tvar čárky v paper-cards.js PAPER_TRAIL.
 trail:[PT.graphite,PT.graphite],
 // 0 prach (krém), 1 perfekt, 2 úspěch, 3 větrná čárka (tužka), 4 hodnota.
 particles:[PT.cream,PAPER_ROLE.perfect,PAPER_ROLE.success,PT.graphite,PAPER_ROLE.value],
 // Popupy jako papírové štítky (kap. 7): krémový podklad, grafitový text, natočení ±1,5°, stín zvednutí.
 popup:{perfect:PAPER_ROLE.perfect,success:PAPER_ROLE.success,miss:PAPER_ROLE.miss,milestone:PAPER_ROLE.valueText,land:PT.graphite,font:PT.display,bg:PT.cream,tilt:1.5},
 flash:PT.cream,
 // QTE (kap. 11): krémové mezikruží 0,95 se stínem zvednutého papíru, stopa warm-grey 6 px, úspěch 9 px, perfekt 11 px + hvězda, bod grafit.
 qte:{track:PT.miss,success:PAPER_ROLE.success,perfect:PAPER_ROLE.perfect,dot:PT.graphite,warning:PT.graphite,disc:PT.cream,discAlpha:.95,
  shadow:{color:'#28190a',alpha:.35,blur:4,dx:3,dy:3},width:{track:6,success:9,perfect:11},
  result:{perfect:PAPER_ROLE.perfect,success:PAPER_ROLE.success,other:PT.miss},gust:PT.cream,gustEdge:PT.graphite,bird:{body:'#b6c9e4',wing:'#7f9ed6',beak:'#f0a27a'}},
 // Štítek události: grafitová páska s krémovým textem, natočená −2° (kap. 11).
 label:{bg:PT.graphite,text:PT.cream,tilt:-2},
 aim:{arrow:PT.graphite,panel:PT.cream,text:PT.graphite,bar:PT.graphite,cap:PT.cream},
 // Rychlostní čáry: tenké grafitové čárky tužkou (1 px, alfa 0,5), pás ±24 px kolem vlaštovky volný (kap. 7).
 speed:{line:PT.graphite,alpha:.5,width:1,gap:24},
 // Město (kap. 2.3, 3): karty podle čtvrti, řezaná hrana cut, boky side, stín shade, mraky cloud, teplé okno warm.
 city:{districts:CARDS,cut:PAPER_DISC,side:'#5b4f7a',shadow:PT.shade,cloud:PAPER_DISC,warm:PAPER_WARM},
 // Výchozí světla toon objektů (život čtvrti, holub), než přijde první nálada; papírový shader je nečte.
 lights:{hemiSky:PT.paper,hemiGround:'#5b4f7a',key:'#fff8e8',rim:'#ffd9a8'},
 // Holub (origami, šedomodrý, kap. 7) a pára v barvách čtvrti 1 (zobák broskvový, hořčicová jen hodnota); tvar později (P3).
 companion:{body:'#b6c9e4',head:'#cfe2ec',beak:'#f0a27a',tail:'#7f9ed6',bread:PT.kraft,wing:'#a7bdd6',eye:PT.graphite,steam:PT.cream,vent:PT.pencil,grate:PT.pencil},
 // Život čtvrti z papírových modelů (models/*, paper-cards.lifeCards).
 life:{people:{cloth:['#e8735a','#f2b65a','#5aa6a0','#7f9ed6','#e98fa0','#f4ece0'],skin:SKIN},pastel:BALLOONS,balloons:BALLOONS,cloud:PAPER_DISC,
  chimney:'#9a4a3a',tanks:{body:'#9fb7d9',leg:PT.pencil,roof:PT.tomato},mast:PT.pencil,stall:{base:PT.card,post:PT.pencil,stripe:PT.cream,stripes:[PT.tomato,'#5aa6a0','#e98fa0','#f2b65a']},
  line:PT.pencil,bunting:[PT.tomato,'#f2b65a',PT.teal,PT.cream,'#7f9ed6'],tunnel:{wall:'#9cc3a6',mouth:PT.graphite},pyramid:'#a8c48a',
  rail:{bed:PT.kraftDark},platform:PT.card,pole:PT.pencil,car:{cabin:PT.cream},basket:PT.kraftDark,rope:PT.pencil},
 // Místo odhodu (bible 05 kap. 9.4–9.5, rozhodnutí 06 bod 6, S-2 a S-3): krémový dům, rajčatová střecha, teplé sklo; rámy, dveře, zábradlí a nohy
 // dítěte tmavomodré D1.window (nikdy grafit), pláštěnka (shirt) D1.near[1] #f2b65a místo hořčicové, skládaná čepice (visor) z kraftu s rajčatovým
 // proužkem (capBand), klika krémová, provázky tužkou. sign* = papírová cedulka PAPER LAB.
 workshop:{wall:PT.cream,roof:PT.tomato,trim:PT.cream,door:D1C.window,frame:D1C.window,window:PAPER_WARM,light:PAPER_WARM,warm:PAPER_WARM,
  skin:SKIN[0],visor:PT.kraft,capBand:PT.tomato,shirt:D1C.near[1],legs:D1C.window,rail:D1C.window,plane:PT.paper,crease:PT.pencil,
  desk:PT.kraftDark,cup:PT.teal,knob:PT.cream,sign:PT.card,signText:PT.graphite,signLine:PT.tomato,string:PT.pencil}
};
export const palette=()=>PAPIR;
