// Zástupné komiksové pohlednice (fáze 1 z návrhu §6.5): SVG siluety podle kind, posterizované nebe, tuš, půltón ve stínu.
// Fáze 2 je nahradí snímky z 3D (assets/atlas/<placeId>.webp). Palety = research/svet/01-zivy-svet.md §2.2.
export const PAL=[
 {id:'violet',sky:['#2a1f5c','#6b3fa0','#ff9ec4','#ffc58a'],body:'#8e6bbf',shade:'#4a3477',accent:'#ff7a8a',ground:'#4a3477',light:'#ffd27a',far:'#6a4a9a',route:'#ff6fb5',sun:'#ffc58a'},
 {id:'docks',sky:['#0d1b3d','#1e4f7a','#5f8fb8'],body:'#215a8c',shade:'#0f2b4c',accent:'#ffd23f',ground:'#0f2b4c',light:'#ffb347',far:'#2a4a6e',route:'#5cc8ff',sun:'#cfe3ff'},
 {id:'horizon',sky:['#3b1f6e','#e8573a','#ffc35a'],body:'#9a63db',shade:'#4a2f8a',accent:'#e8b04a',ground:'#c98a2e',light:'#ffe14d',far:'#c8603a',route:'#ffc35a',sun:'#ff8a3d'},
 {id:'core',sky:['#0b0a20','#283a8f','#2aa99c','#d2ee48'],body:'#3a1f5c',shade:'#1d1233',accent:'#5cf2ff',ground:'#1d1233',light:'#5cf2ff',far:'#1a1240',route:'#ff4f9e',sun:'#ffe14d'},
];
export const INK='#120a2a';
const R=(x,y,w,h)=>`M${x} ${y}h${w}v${h}h${-w}Z`;
const P=(...pts)=>'M'+pts.map(p=>p.join(' ')).join('L')+'Z';
const house=(x,b,w,h)=>`M${x} ${b}V${b-h*.62}L${x+w/2} ${b-h}L${x+w} ${b-h*.62}V${b}Z`;
const C=(cx,cy,r)=>`M${cx-r} ${cy}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`;
const G=96; // horizont / zem
// každý druh: body (tělo dominanty), shade (stínová strana, půltón), lit (svítící okna / akcent), line (tenké čáry tuší)
const KINDS={
 roofs:()=>({body:house(6,G,30,28)+house(38,G,34,40)+R(54,40,7,14)+house(76,G,28,24)+house(108,G,46,52),shade:R(56,58,16,38)+R(132,64,22,32),lit:R(118,66,12,10)+R(46,70,7,7)+R(86,80,6,6),line:'M114 66h20M124 66v10'}),
 market:()=>({body:R(26,26,4,46)+R(18,34,20,3)+R(70,14,4,58)+R(60,22,24,3)+R(112,30,4,42)+R(104,38,20,3)+P([8,G],[14,74],[48,74],[54,G])+P([56,G],[62,72],[98,72],[104,G])+P([106,G],[112,76],[146,76],[152,G]),shade:P([36,G],[48,74],[54,G])+P([86,G],[98,72],[104,G]),lit:C(20,64,3)+C(40,60,3)+C(60,58,3)+C(80,57,3)+C(100,58,3)+C(120,61,3)+C(140,65,3),line:'M10 66Q40 54 70 58T150 66'}),
 garden:()=>({body:R(86,46,4,50)+P([88,46],[88,22],[104,40])+P([88,46],[112,46],[96,62])+P([88,46],[88,70],[72,52])+P([88,46],[64,46],[80,30])+'M6 96q10-18 22 0q10-16 22 0Z'+'M112 96q10-16 20 0q8-14 20 0Z'+R(28,74,26,22)+P([24,74],[41,62],[58,74]),shade:P([88,46],[112,46],[96,62])+P([88,46],[64,46],[80,30])+R(44,74,10,22),lit:R(34,80,8,7),line:''}),
 rail:()=>({body:R(30,62,70,26)+R(92,48,26,40)+R(42,46,10,16)+R(100,40,26,10)+R(118,66,30,22),shade:R(30,78,118,10)+R(92,48,8,40),lit:R(100,54,12,8)+R(124,70,8,6)+R(136,70,8,6),line:'M0 96h160M20 90h120',circ:[[44,90,6],[64,90,6],[84,90,6],[110,90,6]],puff:[[47,34,8],[60,24,6]]}),
 warehouse:()=>({body:'M4 96V56l20-12v12l20-12v12l20-12v12l20-12v12l20-12V96Z'+R(112,70,40,26),shade:'M84 96V56l20-12V96Z'+R(112,84,40,12),lit:R(16,70,12,10)+R(56,70,12,10),line:'M112 70l40 26M152 70l-40 26',text:[[132,66,'FRAGILE']]}),
 cranes:()=>({body:R(30,30,6,66)+R(14,26,70,5)+R(100,18,6,78)+R(92,14,62,5)+R(54,62,26,14)+R(120,70,30,16)+R(36,32,10,8),shade:R(54,70,26,6)+R(120,80,30,6),lit:R(38,33,6,5),line:'M66 31v31M136 19v51'}),
 bridge:()=>({body:R(0,76,160,6)+R(36,30,8,66)+R(112,30,8,66),shade:R(0,82,160,4),lit:C(20,72,1.6)+C(56,62,1.6)+C(80,58,1.6)+C(104,62,1.6)+C(140,72,1.6),line:'M0 72Q40 76 40 32Q78 70 116 32Q120 76 160 72M60 64v12M80 66v10M100 64v12',water:1}),
 lighthouse:()=>({body:P([70,G],[76,36],[96,36],[102,G])+R(70,28,32,8)+R(76,16,20,12)+P([74,16],[86,6],[98,16])+R(104,86,56,10),shade:P([88,G],[90,36],[96,36],[102,G]),lit:R(80,19,12,8),beam:P([92,22],[160,4],[160,40]),line:'M76 56h20M74 74h24',water:1}),
 fields:()=>({body:R(96,56,40,40)+P([92,58],[116,40],[140,58])+R(28,40,4,40)+P([30,40],[30,22],[40,34])+P([30,40],[48,40],[38,48])+P([30,40],[30,58],[20,46])+P([30,40],[12,40],[22,32]),shade:R(120,58,16,38),lit:R(110,74,10,10),line:'M0 100h160M0 106h160M0 112h160',gold:1}),
 turbines:()=>({body:R(34,40,3,56)+R(84,26,4,70)+R(130,46,3,50)+P([30,40],[40,40],[36,48]),shade:'',lit:C(35.5,40,2)+C(86,26,2.4)+C(131.5,46,2),line:'M35.5 40l-14-22M35.5 40l26 2M35.5 40l-10 22M86 26l-16-26M86 26l30 4M86 26l-12 26M131.5 46l-12-20M131.5 46l22 2M131.5 46l-8 20',hill:1}),
 peaks:()=>({body:P([0,G],[48,28],[86,72],[112,40],[160,G]),shade:P([48,28],[86,72],[64,G],[0,G])+P([112,40],[160,G],[132,G]),lit:P([48,28],[40,40],[48,38],[56,42])+P([112,40],[104,52],[112,50],[120,54]),line:'',horn:1}),
 observatory:()=>({body:R(52,62,56,34)+'M52 62a28 28 0 0 1 56 0Z'+R(30,80,22,16),shade:R(88,62,20,34)+'M80 34a28 28 0 0 1 28 28H80Z',lit:R(76,36,8,26)+R(60,74,8,8),line:'M84 40l18-18',stars:[[20,20],[40,12],[128,14],[146,30],[118,8]]}),
 gate:()=>({body:'M28 96V30h104v66h-24V58a28 28 0 0 0-56 0v38Z'+R(22,24,116,8),shade:R(108,32,24,64),lit:R(36,38,88,8),line:'',text:[[80,44.5,'METROPOLIS']]}),
 terraces:()=>({body:R(8,80,144,16)+R(24,64,112,16)+R(42,48,76,16)+R(60,36,40,12),shade:R(120,80,32,16)+R(112,64,24,16)+R(100,48,18,16),lit:R(16,84,8,6)+R(34,68,8,6)+R(52,52,8,6)+R(72,40,8,5),line:'M8 28Q60 18 150 30M30 26v8M60 22v8M92 22v8M124 26v8',cranes:1}),
 tower:()=>({body:P([72,G],[78,30],[82,30],[88,G])+R(76,20,8,10)+R(78.5,2,3,18)+R(4,52,30,44)+R(126,46,30,50),shade:P([80,30],[82,30],[88,G],[80,G])+R(22,52,12,44)+R(144,46,12,50),lit:R(8,58,18,14)+R(130,52,20,16),line:'',rings:1}),
 port:()=>({body:'M16 40c0-12 24-18 56-18s52 6 52 18-20 18-52 18-56-6-56-18Z'+P([116,40],[132,28],[132,52])+R(128,30,4,66)+R(0,84,160,12)+R(54,58,26,10)+R(70,64,18,20)+'M70 64q9-8 18 0Z',shade:'M16 40c0 12 24 18 56 18s52-6 52-18Z'+R(0,90,160,6),lit:R(74,68,10,4)+R(48,86,4,4)+R(72,86,4,4)+R(96,86,4,4)+R(120,86,4,4),line:'M60 58v-4M84 58v-4',text:[[66,42,'THE SLOW ONE']]}),
};
// mode: 'color' | 'silhouette' (teaser) ; frame 0–2: poloha vlaštovky pro smyčku tří snímků
export function postcard(kind,d,{mode='color',frame=-1,night=false,title=''}={}){
 const p=PAL[d],k=KINDS[kind](),sil=mode==='silhouette';
 const sky=night?[ '#0a0820','#1a1450','#2a2a70']:p.sky,n=sky.length,band=G/n;
 let s=`<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">`;
 if(title)s+=`<title>${title}</title>`;
 if(sil){s+=`<rect width="160" height="120" fill="${p.shade}"/><rect y="0" width="160" height="${G}" fill="${sky[n>3?1:0]}" opacity=".55"/><rect width="160" height="120" fill="url(#ht-${d})" opacity=".35"/>`;
  s+=`<path d="${k.body}${k.circ?k.circ.map(c=>C(...c)).join(''):''}" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect y="${G}" width="160" height="24" fill="${INK}"/>`;
  if(k.line)s+=`<path d="${k.line}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;return s+'</svg>';}
 sky.forEach((c,i)=>{s+=`<rect y="${i*band}" width="160" height="${band+1}" fill="${c}"/>`;});
 // půltónový přechod mezi pásy
 for(let i=1;i<n;i++)s+=`<rect y="${i*band-6}" width="160" height="6" fill="url(#ht-${d})" opacity=".55"/>`;
 // slunce / měsíc
 if(d===1||night)s+=`<circle cx="128" cy="24" r="13" fill="${p.sun}" stroke="${INK}" stroke-width="2"/>`;else if(d===2)s+=`<circle cx="24" cy="${G-6}" r="16" fill="${p.sun}" stroke="${INK}" stroke-width="2"/>`;
 if(k.stars||d===3||night)for(const [x,y] of (k.stars??[[18,14],[52,8],[110,12],[142,20]]))s+=`<path d="M${x} ${y-3}l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill="#fff6c8"/>`;
 // vzdálená silueta města
 s+=`<path d="M0 ${G}V80h12v-8h10v12h14v-16h8v10h16v-6h12v14h18v-10h10v6h14v-12h10v14h12v-8h12v16Z" fill="${p.far}" opacity=".9"/>`;
 if(k.beam)s+=`<path d="${k.beam}" fill="#fff3b0" opacity=".28"/>`;
 // zem
 s+=`<rect y="${G}" width="160" height="${120-G}" fill="${k.gold?'#e8b04a':k.water?'#1e4f7a':p.ground}" stroke="${INK}" stroke-width="2"/>`;
 if(k.water)s+=`<path d="M8 104h22M50 110h30M100 104h26M130 114h20" stroke="#5f8fb8" stroke-width="2"/>`;
 if(k.hill)s+=`<path d="M0 ${G}Q60 70 160 ${G}Z" fill="${p.shade}" stroke="${INK}" stroke-width="2.5"/>`;
 s+=`<path d="${k.body}" fill="${p.body}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
 if(k.shade)s+=`<path d="${k.shade}" fill="${p.shade}"/><path d="${k.shade}" fill="url(#ht-ink)" opacity=".6"/>`;
 if(k.lit)s+=`<path d="${k.lit}" fill="${p.light}" stroke="${INK}" stroke-width="1.2"/>`;
 if(k.circ)for(const c of k.circ)s+=`<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${p.accent}" stroke="${INK}" stroke-width="2"/>`;
 if(k.puff)for(const c of k.puff)s+=`<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="#f3e6ff" stroke="${INK}" stroke-width="2"/>`;
 if(k.line)s+=`<path d="${k.line}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
 if(k.text)for(const [x,y,tx] of k.text)s+=`<text x="${x}" y="${y}" font-size="6" font-weight="800" text-anchor="middle" fill="${INK}" font-family="Bahnschrift,Arial Narrow,sans-serif">${tx}</text>`;
 if(k.rings)s+=`<path d="M66 18q14-8 28 0M60 12q20-12 40 0" fill="none" stroke="${p.accent}" stroke-width="2.5"/>`;
 if(k.cranes)for(const x of [30,60,92,124])s+=`<path d="M${x-4} 38l4-4 4 4-4 2Z" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
 if(k.horn)s+=`<path d="M100 92l40-8 4 6-6 2" fill="none" stroke="${INK}" stroke-width="3"/>`;
 // vlaštovka pro smyčku tří snímků (frame 0–2) + komiksový efekt
 if(frame>=0){const xs=[30,74,118],ys=[60,46,40],x=xs[frame],y=ys[frame];
  s+=`<g transform="translate(${x} ${y}) rotate(${frame===1?-14:-4})"><path d="M-12 2L14 -2L-6 -8L-2 0Z" fill="#fffdf4" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></g>`;
  if(frame===1)s+=`<path d="M${x-24} ${y+4}h10M${x-26} ${y+10}h8M${x-22} ${y-2}h6" stroke="#fffdf4" stroke-width="2" stroke-linecap="round"/>`;
  if(frame===2)s+=`<g transform="translate(${x+18} ${y-12})"><path d="M0 -10l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="${p.light}" stroke="${INK}" stroke-width="1.4"/></g>`;}
 return s+'</svg>';
}
// panorama čtvrti pro stav frame (tmavá silueta)
export function skyline(d){const p=PAL[d];
 const shapes=['M0 60V36h14l8-10 8 10h10v-8h6v8h18l10-12 10 12h14v-6h12v6h20l8-10 8 10h16v24Z','M0 60V40h20v-16h4v16h26l4-20h4l4 20h30v-10h30v10h18V24h4v16h16v20Z','M0 60l30-30 22 18 26-34 30 30 20-14 32 30Z','M0 60V30h14V12h10v18h12V20h16v40h8V8h12v52h10V26h14v34h12V16h10v44h12V34h10v26Z'];
 return `<svg viewBox="0 0 160 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect width="160" height="60" fill="${p.sky[0]}"/><rect width="160" height="60" fill="url(#ht-${d})" opacity=".4"/><path d="${shapes[d]}" fill="${INK}"/></svg>`;}
// sdílené vzory půltónu (vkládá se jednou do stránky)
export const DEFS=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<pattern id="ht-ink" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${INK}"/></pattern>
${PAL.map((p,i)=>i===1?`<pattern id="ht-${i}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="1.4" height="5" fill="${p.route}" opacity=".7"/></pattern>`:i===2?`<pattern id="ht-${i}" width="5" height="4" patternUnits="userSpaceOnUse"><rect width="5" height="1.3" fill="${p.route}" opacity=".7"/></pattern>`:i===3?`<pattern id="ht-${i}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="1" fill="${p.route}" opacity=".6"/><rect width="1" height="5" fill="${p.route}" opacity=".6"/></pattern>`:`<pattern id="ht-${i}" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.3" fill="${p.route}" opacity=".8"/></pattern>`).join('')}
</defs></svg>`;
// portrét postavy: silueta s jedním akcentem (svět §5.1)
export function portrait(d){const p=PAL[d],ac=[p.route,'#ffd23f',p.accent,'#5cf2ff'][d];
 const bodies=['M14 44V26q0-8 8-8h8q8 0 8 8v18Z M20 10h12v8H20Z',
  'M12 44q0-16 14-16t14 16Z M18 18a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z',
  'M12 44q0-16 14-16t14 16Z M18 18a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z',
  'M8 24q18-10 36 0q-18 10-36 0Z M20 14h12v6H20Z'];
 const acc=['M23 13h2v2h-2ZM28 13h2v2h-2Z','M16 30h20v4H16Z','M30 12l8-6 2 3-8 5Z','M14 24h4M34 24h4'];
 return `<svg viewBox="0 0 52 48" aria-hidden="true" focusable="false"><rect width="52" height="48" rx="0" fill="${p.shade}"/><path d="${bodies[d]}" fill="${INK}"/><path d="${acc[d]}" fill="${ac}" stroke="${ac}" stroke-width="2"/></svg>`;}
