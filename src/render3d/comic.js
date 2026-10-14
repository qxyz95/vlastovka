// Komiksový vzhled (čisté): půltón, posterizované pásy oblohy, „on twos“, rychlostní čáry, palety VERSE. Vlastní R4.
// Čisté části zkopírované ze src/themes-verse.js a mix ze src/themes.js (oba se budou mazat, proto se neimportují).
// comicLook(mood,quality) → plan.comic: parametry toon rampy (toon.toonRamp), obrysu (toon.outlineMaterial) a post-procesu (toon.postPass).
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
export function mix(a,b,k){const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');}
export const INK='#15101f',TWOS=12,HALFTONE_TILE=6,PATTERN_SCALE=2;
// Každá kresba drží 1/fps s („on twos“ při 24 fps filmu = 12 kreseb za sekundu).
export const onTwos=(time,fps=TWOS)=>Math.floor(time*fps+1e-9)/fps;
// 45° Ben-Day mřížka v dlaždici o straně s: 4 rohové tečky + středová, sousedé s/√2 od sebe. Pokrytí k (0–1): 2πr²/s² = k, strop před dotykem.
export const dotRadius=(k,s=HALFTONE_TILE)=>Math.min(s/(2*Math.SQRT2)*.96,s*Math.sqrt(Math.max(0,k)/(2*Math.PI)));
export const dotSpacing=(s=HALFTONE_TILE)=>s/Math.SQRT2;
export function halftoneDots(k,s=HALFTONE_TILE){const r=dotRadius(k,s);return [[0,0],[s,0],[0,s],[s,s],[s/2,s/2]].map(([x,y])=>[x,y,r]);}
// Posterizovaná obloha: ploché pásy, každý okraj změkčený `steps` půltónovými proužky další barvy (pokrytí roste).
export function skyBands(colors,edges,steps=3,zone=18){
 const out=[];
 colors.forEach((color,i)=>{const y0=edges[i],y1=edges[i+1];out.push({y:y0,h:y1-y0,color});
  if(i<colors.length-1)for(let j=0;j<steps;j++){const h=zone/steps;out.push({y:y1-zone+j*h,h,color,dot:colors[i+1],k:(j+1)/(steps+1)});}});
 return out;
}
// Jeden tvrdý tón stínu (bez přechodu): barva těla posunutá k inkoustu.
export const shadeTone=color=>mix(color,INK,.42);
// Rychlostní čáry: pod `from` m/s žádné, s rychlostí víc a delší; stabilní pro jednu kresbu (frame), takže drží „on twos“.
export function speedLines(vx,frame=0,from=40){
 const k=Math.max(0,Math.min(1,(vx-from)/110));if(!k)return [];
 const n=Math.round(6+k*18),seed=Math.floor(frame*TWOS);
 return Array.from({length:n},(_,i)=>{const r=noise(seed*31+i*7.3);return [noise(seed*13+i)*700-30,12+noise(i*17.1+seed*.37)*336,(50+r*110)*(.5+k)];});
}
// Paleta po čtvrtích: obloha shora k obzoru, budovy [svítící, tělo, akcent], vzdálené město, zem, slunce.
export const VERSE=[
 {sky:['#2ea8b8','#7fd9c4','#fff0a0','#ffb08a'],biome:['#ff7a59','#c23d5a','#fff36b'],far:'#5aa0b4',ground:'#2d2440',sun:'#fff7cf'},
 {sky:['#1d47a0','#3a88dc','#9ad4ff','#eef6ff'],biome:['#4ec3c7','#215a8c','#ffe14d'],far:'#6d9bd2',ground:'#0f2b4c',sun:'#ffffff'},
 {sky:['#f2782a','#ffaa45','#ffdc85','#fff3d2'],biome:['#9a63db','#4a2f8a','#ffd23f'],far:'#c47ad6',ground:'#3b1f4f',sun:'#fffbe8'},
 {sky:['#0f1336','#283a8f','#2aa99c','#d2ee48'],biome:['#ff4f9e','#3a1f5c','#5cf2ff'],far:'#3a4c9c',ground:'#0b0a20',sun:'#f4ffd8'}];
export const SKY_EDGES=[0,92,168,232,360];
// Stupně kvality: 0 nízká (bez půltónu), 1 střední, 2 vysoká. Přijímá i 'low'|'mid'|'high' a objekt {level}.
const Q={low:0,mid:1,medium:1,high:2};
const qLevel=q=>{const v=typeof q==='string'?Q[q]:typeof q==='number'?q:q?.level!=null?qLevel(q.level):2;return Math.max(0,Math.min(2,Math.round(v??2)));};
// Komiksový vzhled pro scénu a post-proces. Hodnoty odpovídají toon.js (rampa [70,150,255], obrys 2,2, post levels 6 / dotSize 5).
//  ramp      tóny toon rampy 0–255 (3 kroky, v noci tvrdší stín) · shadeLimit jas, pod kterým post kreslí půltón
//  levels    posterizace post-procesu (úrovně na kanál) · dotSize perioda půltónu v px obrazovky · halftone 0|1 (uniform mode)
//  outline   {color,thickness} pro outlineMaterial (thickness v jednotkách shaderu, jako výchozí 2,2) · lineWidth obrys UI v logických px
//  bands     skyBands(mood.sky,SKY_EDGES) pro 2D zálohu oblohy (logické px 640×360) · paletteId index VERSE/čtvrti · twos fps „on twos“
export function comicLook(mood={},quality=2){
 const q=qLevel(quality),night=Math.max(0,Math.min(1,mood.night??0)),hold=Math.max(0,Math.min(1,mood.hold??0));
 const sky=mood.sky?.length?mood.sky:VERSE[mood.district??0].sky;
 return {quality:q,ramp:[Math.round(70-12*night),Math.round(150-10*night),255],shadeLimit:.42,
  levels:q?Math.round(6-hold):8,dotSize:q===2?5:6,halftone:q?1:0,
  outline:{color:mix(INK,'#07051a',.5),thickness:[1.6,2,2.2][q]},lineWidth:[1.8,2.2,2.6][q],
  bands:skyBands(sky,SKY_EDGES,q?3:0),paletteId:Math.max(0,Math.min(3,mood.district??0)),twos:TWOS,ink:INK};
}
