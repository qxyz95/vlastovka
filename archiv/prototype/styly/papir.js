// Prototyp B „Papírové město“, finální návrh pro čtvrť 1 (Dílna + 4 místa). research/design/05-styl-papir.md, 06-papir-ctvrt1.md.
// Bere skutečné rozložení hry (cityChunk, suburbLife, kamery cameraFor / restCamera, HAND, KID) a kreslí ho papírově:
// karty s řezanou hranou a vlákny, opar podle hloubky (Alto), obloha přechodem se září slunce, měkké stíny vrstev ze siluety (skyline + stencil).
// Ladění: window.__papir = {set({shot,place,view,shadows,t,paused}), measure(), bench(mode), info(), qteContrast()}.
import * as THREE from 'three';
import {planeShape,outlineStamp} from '../../src/render3d/geometry.js';
import {stampOutlineMaterial} from '../../src/render3d/toon.js';
import {PLANE_SCALE} from '../../src/render3d/plane.js';
import {cameraFor} from '../../src/render3d/frame.js';
import {restCamera,HAND} from '../../src/render3d/pose.js';
import {KID,S} from '../../src/render3d/workshop.js';
import {TOKENS,ROLE,QTE,D1,ID,SHADOW,shadowOffset,placeCards,hills,lifeCards,cardVertices,skyline,skylineStrip,PLACE_W,NAMES,mix,contrast} from './papir-data.js';

const $=s=>document.querySelector(s),q=new URLSearchParams(location.search);
const state={shot:q.get('shot')??'let',place:+(q.get('place')??1),view:q.get('view')??'desktop',shadows:q.get('shadows')??'skyline',lang:q.get('lang')??'en',t:+(q.get('t')??NaN),paused:q.has('paused')};
const BARE=q.has('bare');
const VIEWS={desktop:[1280,800],phone:[375,667],landscape:[932,430]};
const SHOTS={dilna:'Dílna',let:'Let',udalost:'Událost (QTE)',vysledek:'Výsledek'};
const SHADOW_MODES={off:'bez stínů',skyline:'siluety (doporučeno)','map-near':'shadow map 1024 jen ulice','map-full':'shadow map 2048 PCFSoft vše'};

// ---------- stránka (makety herní stránky v papírovém UI) ----------
document.title='Just Throw It · Papírové město (čtvrť 1)';
const link=document.createElement('link');link.rel='stylesheet';link.href='./prototype/styly/papir.css';document.head.append(link);
const pickRow=(k,opts)=>`<div class="picks" role="group" aria-label="${k}">${Object.entries(opts).map(([v,l])=>`<button data-pick="${k}" data-value="${v}">${l}</button>`).join('')}</div>`;
const T=(en,cs)=>state.lang==='cs'?cs:en;
document.body.className='papir'+(BARE?' bare':'');
document.body.innerHTML=`
<header class="bar">
 <h1>Just Throw It · Papírové město, čtvrť 1 <small>návrh k research/design/05-styl-papir.md · <a href="?srovnani=1">srovnání 5 směrů</a></small></h1>
 ${pickRow('shot',SHOTS)}${pickRow('place',{0:'1 Dílna a střechy',1:'2 Trh',2:'3 Zahrady',3:'4 Železnice'})}
 ${pickRow('view',{desktop:'1280×800',phone:'375×667',landscape:'932×430'})}${pickRow('shadows',SHADOW_MODES)}${pickRow('lang',{en:'EN',cs:'CS'})}
 <div class="picks"><button id="pause">Pauza</button><button id="measure">Změřit</button></div>
</header>
<main>
 <div class="frame"><div id="pstage">
  <div class="page">
   <header class="brand"><div><b class="logo">Just Throw It</b><small class="sub" data-t="sub"></small></div><span class="wallet"><i class="coin" aria-hidden="true"></i><b>1,240</b></span></header>
   <nav class="tabs"><a aria-current="page" href="#" data-t="tab1"></a><a href="#" data-t="tab2"></a><span class="lang"><button aria-pressed="true">EN</button><button>CS</button></span></nav>
   <div class="intro"><small class="eyebrow" data-t="eyebrow"></small><h2 data-t="title"></h2></div>
   <div class="play"><div class="scene"><canvas id="pscene"></canvas>
    <div class="hud"><div class="tag"><small data-t="district"></small><b data-t="place"></b></div><div class="tag r"><small data-t="dist"></small><b id="hud-dist">0 m</b></div></div>
    <div id="qte" aria-hidden="true"><svg viewBox="-50 -50 100 100" width="96" height="96"><circle r="44" class="q-disc"/><circle r="33" class="q-track"/>
     <circle r="33" class="q-ok" pathLength="100" stroke-dasharray="22 78" stroke-dashoffset="-8"/><circle r="33" class="q-perfect" pathLength="100" stroke-dasharray="7 93" stroke-dashoffset="-15.5"/>
     <path class="q-star" d="M0,-8 L2.4,-2.6 8,-2.4 3.6,1.2 5,7 0,3.8 -5,7 -3.6,1.2 -8,-2.4 -2.4,-2.6Z"/><circle class="q-dot" cx="0" cy="-33" r="5.5" transform="rotate(68)"/></svg>
     <span class="q-label" data-t="gust"></span></div>
   </div>
   <section class="panel" id="panel"></section></div>
  </div>
  <div class="modal" id="result"><section class="result-card" aria-label="Result"><small data-t="delivered"></small><b class="big">1,412 m</b>
   <p><span class="best" data-t="newbest"></span><span class="val"><i class="coin" aria-hidden="true"></i>+86</span></p>
   <div class="row"><button class="btn primary" data-t="again"></button><button class="btn" data-t="upgrades"></button><button class="btn" data-t="workshop"></button></div></section></div>
 </div></div>
 <section class="info"><h2>Měření</h2><div id="out">Klikni „Změřit“ (kontrast vlaštovky z pixelů, draw calls, trojúhelníky, čas snímku).</div>
 <p class="note">URL: <code>?shot=dilna|let|udalost|vysledek&amp;place=0–3&amp;view=desktop|phone|landscape&amp;shadows=off|skyline|map-near|map-full&amp;t=…&amp;paused&amp;bare</code>. Ladění <code>__papir.measure()</code>, <code>__papir.bench('skyline')</code>.</p></section>
</main>`;
const TEXT={sub:['paper past the horizon','papírem za obzor'],tab1:['01 / Workshop','01 / Dílna'],tab2:['02 / Atlas','02 / Atlas'],
 eyebrow:[`${NAMES.districts.C[0][0]} / MORNING FLIGHT`,`${NAMES.districts.C[0][1]} / RANNÍ LET`],title:['Paper past the horizon.','Papírem za obzor.'],
 dist:['Distance','Vzdálenost'],gust:['GUST! <em>Tap</em>','PORYV! <em>Klepni</em>'],delivered:['Delivered.','Doručeno.'],newbest:['New best','Nový rekord'],
 again:['Throw again','Hodit znovu'],upgrades:['Upgrades','Vylepšení'],workshop:['Workshop','Dílna']};
const PANELS={
 dilna:()=>`<div class="card aim"><small>${T('Aim and hold','Zamiř a drž')}</small><p>${T('Drag back from the plane, release to throw.','Táhni od vlaštovky dozadu a pusť.')}</p></div><button class="btn primary big">${T('Throw','Hodit')}</button>`,
 let:()=>`<div class="card"><small>${T('Next milestone','Další milník')}</small><b>915 m</b></div><div class="card"><small>${T('Best','Rekord')}</small><b>748 m</b></div><p class="story">${T('Out of the Workshop window and over a waking street.','Z okna dílny vyrážíš nad probouzející se ulici.')}</p>`,
 udalost:()=>`<div class="card ev"><small>${T("It's in the air now",'Teď ve vzduchu')}</small><b>${T('Market vent gust','Poryv od tržnice')}</b></div><button class="btn primary">${T('Tap · Space','Klepni · Mezerník')}</button>`,
 vysledek:()=>``};

const stage=$('#pstage'),canvas=$('#pscene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,stencil:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.autoClear=false;renderer.info.autoReset=false;
const DPR=Math.min(devicePixelRatio,1.5);renderer.setPixelRatio(DPR);
const rt=new THREE.WebGLRenderTarget(4,4,{samples:4,stencilBuffer:true,depthBuffer:true});
const camera=new THREE.PerspectiveCamera(20,16/9,1,6000);
let scene=null,world=null;
const colorCache=new Map(),lin=h=>{let c=colorCache.get(h);if(!c){c=new THREE.Color(h);colorCache.set(h,c);}return c;};

// ---------- materiály ----------
const STENCIL_WRITE=id=>({stencilWrite:true,stencilRef:id,stencilFunc:THREE.AlwaysStencilFunc,stencilZPass:THREE.ReplaceStencilOp,stencilFail:THREE.KeepStencilOp,stencilZFail:THREE.KeepStencilOp,stencilWriteMask:0xff,stencilFuncMask:0xff});
const STENCIL_TEST=mask=>({stencilWrite:true,stencilRef:0,stencilFunc:THREE.EqualStencilFunc,stencilFuncMask:mask,stencilWriteMask:0,stencilFail:THREE.KeepStencilOp,stencilZFail:THREE.KeepStencilOp,stencilZPass:THREE.KeepStencilOp});
const NOISE=`float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+1.),f.x),f.y);}`;
// Papír: čelo = barva karty (lehce světlejší nahoře), horní řez = světlé jádro kartonu, boky a odvrácené střechy do studeného stínu,
// vlákna (3 oktávy šumu ve světových m), opar podle hloubky z (barva oparu od obzoru k nebi podle výšky).
function paperMaterial(id,{cutK=.55,sideK=.3,fiber=.07,haze=1}={}){
 return new THREE.ShaderMaterial({vertexColors:true,...STENCIL_WRITE(id),
  uniforms:{cut:{value:lin(D1.cut)},side:{value:lin(D1.side)},hazeLow:{value:lin(D1.haze.low)},hazeHigh:{value:lin(D1.haze.high)},L:{value:new THREE.Vector3(...D1.light).normalize()},
   cutK:{value:cutK},sideK:{value:sideK},fiber:{value:fiber},hz:{value:new THREE.Vector4(D1.haze.from,D1.haze.to,D1.haze.max*haze,D1.haze.curve)}},
  vertexShader:`varying vec3 vC;varying vec3 vN;varying vec3 vW;void main(){vC=color;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader:`uniform vec3 cut,side,hazeLow,hazeHigh,L;uniform float cutK,sideK,fiber;uniform vec4 hz;varying vec3 vC;varying vec3 vN;varying vec3 vW;${NOISE}
void main(){vec3 c=vC,n=normalize(vN);
 if(n.z>.5)c*=.95+.05*clamp(vW.y/30.,0.,1.);
 else if(n.y>.95)c=mix(c,cut,cutK);
 else{float l=dot(n,L);c=l>.05?mix(c,cut,.12*l*cutK/.55):mix(c,side,sideK);}
 vec2 q=n.z>.5?vW.xy:n.y>.95?vW.xz:vW.zy;float f=vn(q*.9)*.55+vn(q*3.7)*.3+vn(q*13.)*.15;c*=1.+(f-.5)*fiber;
 float h=hz.z*pow(clamp((-vW.z-hz.x)/(hz.y-hz.x),0.,1.),hz.w);c=mix(c,mix(hazeLow,hazeHigh,clamp(vW.y/160.,0.,1.)),h);
 gl_FragColor=vec4(c,1.);}`});
}
// Stín vrstvy ze siluety: oblast pod profilem aH, posunutá o offset, měkká o pen; kreslí se jen na vrstvy za ní (stencil).
function skylineShadowMaterial(caster){const c=SHADOW.casters[caster],o=shadowOffset(c.dz),a=SHADOW.alpha*(caster==='near'?1:caster==='mid'?.8:.55);
 return new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,...STENCIL_TEST(c.mask),
  uniforms:{off:{value:new THREE.Vector2(o.dx,o.dy)},pen:{value:o.pen},alpha:{value:a},col:{value:lin(D1.shadow)}},
  vertexShader:`attribute float aH;uniform vec2 off;varying float vY;varying float vH;void main(){vY=position.y;vH=aH;vec3 p=position;p.xy+=off;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
  fragmentShader:`uniform float pen,alpha;uniform vec3 col;varying float vY;varying float vH;void main(){float a=alpha*(1.-smoothstep(-pen,pen,vY-vH));if(a<.004)discard;gl_FragColor=vec4(col,a);}`});}
// Měkká elipsa (stín mraku): aLocal −1,4…1,4, okraj měkký.
function blobMaterial({mask,alpha}){return new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,...STENCIL_TEST(mask),
 uniforms:{alpha:{value:alpha},col:{value:lin(D1.shadow)}},
 vertexShader:`attribute vec2 aLocal;varying vec2 vL;void main(){vL=aLocal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform float alpha;uniform vec3 col;varying vec2 vL;void main(){float d=length(vL),a=alpha*(1.-smoothstep(.6,1.35,d));if(a<.004)discard;gl_FragColor=vec4(col,a);}`});}
// Plochý stín vlaštovky (její vlastní trojúhelníky posunuté podle světla), jen na vrstvy kromě země.
const planeShadowMaterial=()=>new THREE.MeshBasicMaterial({color:D1.shadow,transparent:true,opacity:SHADOW.plane.alpha,depthTest:false,depthWrite:false,side:THREE.DoubleSide,...STENCIL_TEST(SHADOW.plane.mask)});

// Post: převod do sRGB, zrno papíru (pevné, ne v čase: papír „nešumí“), teplý tón a lehká vinětace.
function postPass(){
 const mat=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},res:{value:new THREE.Vector2(1,1)},grain:{value:.035},vignette:{value:.14},tint:{value:new THREE.Color('#fffaf2')}},depthTest:false,depthWrite:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 res;uniform float grain,vignette;uniform vec3 tint;varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec3 s=pow(max(texture2D(tDiffuse,vUv).rgb,0.),vec3(1./2.2))*tint;vec2 px=floor(vUv*res/1.5);s+=(h(px)-.5)*grain*(.5+.5*(1.-dot(s,vec3(.33))));
float v=length(vUv-.5)*1.4;s*=1.-vignette*pow(v,2.6);gl_FragColor=vec4(clamp(s,0.,1.),1.);}`});
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,0,2],2));
 const sc=new THREE.Scene(),m=new THREE.Mesh(geo,mat);m.frustumCulled=false;sc.add(m);return {mat,scene:sc,cam:new THREE.OrthographicCamera(-1,1,1,-1,0,1)};
}
const POST=postPass();

// Obloha: plynulý přechod (bokashi), velká měkká záře slunce (Alto) a papírový kotouč slunce s tenkým světlým okrajem.
function skyTexture(w,h){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,h);
 D1.sky.forEach((s,i)=>gr.addColorStop(D1.skyAt[i],s));g.fillStyle=gr;g.fillRect(0,0,w,h);
 const s=D1.sun,x=s.x*w,y=s.y*h,r=s.r*h;
 const glow=g.createRadialGradient(x,y,0,x,y,r*9);glow.addColorStop(0,s.glow+'cc');glow.addColorStop(.25,s.glow+'55');glow.addColorStop(1,s.glow+'00');g.fillStyle=glow;g.fillRect(0,0,w,h);
 g.fillStyle='#ffffff55';g.beginPath();g.arc(x,y,r*1.35,0,7);g.fill();g.fillStyle=s.color;g.beginPath();g.arc(x,y,r,0,7);g.fill();
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}

// ---------- geometrie ----------
function cardGeometry(list){
 const v=cardVertices(list),n=v.p.length/3,g=new THREE.BufferGeometry(),C=new Float32Array(n*3);
 for(let i=0;i<n;i++){const c=lin(v.c[i]);C[i*3]=c.r;C[i*3+1]=c.g;C[i*3+2]=c.b;}
 g.setAttribute('position',new THREE.Float32BufferAttribute(v.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(v.n,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingSphere();return g;
}
function stripGeometry(s){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(s.position,3));g.setAttribute('aH',new THREE.Float32BufferAttribute(s.h,1));g.computeBoundingSphere();return g;}
function blobGeometry(items){const p=[],l=[];for(const b of items){const k=1.4,x0=b.x-b.rx*k,x1=b.x+b.rx*k,y0=b.y-b.ry*k,y1=b.y+b.ry*k;
 for(const [x,y,u,w] of [[x0,y0,-k,-k],[x1,y0,k,-k],[x1,y1,k,k],[x0,y0,-k,-k],[x1,y1,k,k],[x0,y1,-k,k]]){p.push(x,y,b.z);l.push(u,w);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('aLocal',new THREE.Float32BufferAttribute(l,2));g.computeBoundingSphere();return g;}
function groundCards(i){const x0=i*PLACE_W-1,w=PLACE_W+2,G=D1.ground;
 return [{shape:'box',x:x0,w,y:-.4,h:.4,z:-10,d:100,color:G.near},{shape:'box',x:x0,w,y:-.4,h:.4,z:-155,d:190,color:G.mid},{shape:'box',x:x0,w,y:-.4,h:.4,z:-575,d:650,color:G.far}];}

// Dílna v papíru: dům s krémovými stěnami a rajčatovou sedlovou střechou, teplé okno se stolem dítěte, cedule PAPER LAB jako papírový štítek,
// přístavek s plochou střechou a zábradlím; dítě jako papírová postavička (pláštěnka, skládaná čepice z papíru) s vlaštovkou v ruce (HAND).
function workshopCards(){
 const W={x:20,w:24,h:12,z:-7,d:6},front=W.z+W.d/2,ax=W.x+W.w,aw=HAND.x+7-ax,top=KID.y,az=HAND.z-4,ad=6,af=az+ad/2,out=[],B=o=>out.push({shape:'box',layer:'near',...o});
 B({x:W.x,w:W.w,y:0,h:W.h,z:W.z,d:W.d,color:TOKENS.cream});out.push({shape:'gable',layer:'near',x:W.x-.8,w:W.w+1.6,y:W.h,h:8,z:W.z,d:W.d+.4,color:TOKENS.cream,roof:TOKENS.tomato});
 B({x:W.x+2.4,w:12.2,y:1.4,h:5.6,z:front+.05,d:.1,color:TOKENS.graphite});B({x:W.x+2.8,w:11.4,y:1.8,h:4.8,z:front+.12,d:.1,color:D1.warm});
 B({x:W.x+3.2,w:10.6,y:3.1,h:.35,z:front+.2,d:.05,color:TOKENS.kraftDark});B({x:W.x+4,w:.9,y:3.45,h:1.3,z:front+.2,d:.05,color:TOKENS.teal});B({x:W.x+11,w:.25,y:3.45,h:1.7,z:front+.2,d:.05,color:TOKENS.graphite});
 out.push({shape:'flag',layer:'near',x:W.x+6,w:2.4,y:3.5,h:1,z:front+.22,d:.05,color:TOKENS.paper});
 B({x:W.x+W.w-6.6,w:4.2,y:0,h:6,z:front+.1,d:.2,color:'#3d4f7a'});B({x:W.x+W.w-3.3,w:.5,y:2.8,h:.5,z:front+.25,d:.1,color:TOKENS.mustard});
 B({x:ax,w:aw,y:0,h:top-.5,z:az,d:ad,color:'#5aa6a0'});B({x:ax-.3,w:aw+.6,y:top-.5,h:.5,z:az,d:ad+.6,color:TOKENS.cream});
 B({x:ax+3,w:11,y:1.4,h:3.8,z:af+.05,d:.1,color:D1.warm});B({x:ax+aw-7,w:4,y:0,h:5,z:af+.1,d:.2,color:'#3d4f7a'});
 for(let i=0;i<6;i++)B({x:ax+1+i*(aw-2.4)/5,w:.35,y:top,h:1.4,z:af-.4,d:.35,color:TOKENS.graphite});B({x:ax+1,w:aw-2,y:top+1.4,h:.3,z:af-.4,d:.4,color:TOKENS.graphite});
 // dítě (px ze 2D postavičky × S m, jako workshop.js)
 const px=(x,y,w,h,color,shape='box',d=1.6)=>({shape,layer:'near',x:KID.x+x*S,y:KID.y+y*S,w:w*S,h:h*S,z:.2-(d/2),d,color});
 out.push(px(1,0,5,10,'#3d4f7a'),px(10,0,5,10,'#3d4f7a'),px(0,10,16,20,TOKENS.mustard),px(3,30,10,10,'#f3d2b4'),px(2,38,12,3,TOKENS.graphite));
 out.push({shape:'pyr',layer:'near',x:KID.x+1*S,y:KID.y+40*S,w:14*S,h:7*S,z:-.6,d:1.8,color:TOKENS.paper});
 out.push(px(12,24,10,4,TOKENS.mustard,'box',1.2),{...px(21,23,5,6,'#f3d2b4','box',1.2)});
 return out;
}
function signTexture(text){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle=TOKENS.card;g.fillRect(0,0,512,96);
 g.fillStyle=TOKENS.graphite;g.font='700 58px "Trebuchet MS","Segoe UI",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,50);
 g.fillStyle=TOKENS.tomato;g.fillRect(150,82,212,6);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}

// ---------- vlaštovka a stopa ----------
function makePlane(){
 const s=planeShape('dart'),geo=new THREE.BufferGeometry(),n=s.positions.length/3,C=new Float32Array(n*3);
 // Horní plochy křídel bílé, kýl a spodní strany do studené šedé (vlaštovka má vlastní tvar i proti bílému nebi).
 for(let i=0;i<n;i++){const ny=s.normals[i*3+1],c=lin(ny>.3?ROLE.planeFill:'#cdd3e3');C.set([c.r,c.g,c.b],i*3);}
 geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('color',new THREE.BufferAttribute(C,3));
 const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}));mesh.renderOrder=22;
 const st=outlineStamp(s.positions),hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(st.positions,3));hg.setAttribute('shift',new THREE.Float32BufferAttribute(st.shift,2));
 const hull=new THREE.Mesh(hg,stampOutlineMaterial({color:ROLE.planeEdge,thickness:2.6}));hull.renderOrder=21;
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
 const crease=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:TOKENS.pencil}));crease.renderOrder=23;
 const chain=parts=>{const root=new THREE.Group(),pitch=new THREE.Group(),yaw=new THREE.Group(),roll=new THREE.Group();roll.add(...parts);yaw.add(roll);pitch.add(yaw);root.add(pitch);root.scale.setScalar(PLANE_SCALE);return {root,pitch,yaw,roll};};
 const main=chain([mesh,hull,crease]),sh=new THREE.Mesh(geo,planeShadowMaterial());sh.renderOrder=12;const shadow=chain([sh]);
 return {...main,shadow,mesh,hull,pose(x,y,a){for(const [c,dx,dy,dz] of [[main,0,0,0],[shadow,...(o=>[o.dx,o.dy])(shadowOffset(SHADOW.plane.dz)),SHADOW.plane.z]]){c.root.position.set(x+dx,y+dy,dz);c.pitch.rotation.z=a;c.yaw.rotation.y=-.2;c.roll.rotation.x=.42;}},
  dispose(){geo.dispose();hg.dispose();lg.dispose();mesh.material.dispose();hull.material.dispose();crease.material.dispose();sh.material.dispose();}};
}
// Stopa tužkou: čárkovaná grafitová linka (délka čárky v m), slábne ke konci. Také papírové proužky poryvu (bez čárek, krémové s grafitovým lemem).
const TN=90;
function makeRibbon(color,{dash=0,alpha=.9,order=15}={}){
 const pos=new Float32Array(TN*6),s=new Float32Array(TN*2),k=new Float32Array(TN*2),idx=[];for(let i=0;i<TN-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('aS',new THREE.BufferAttribute(s,1));geo.setAttribute('aK',new THREE.BufferAttribute(k,1));geo.setIndex(idx);
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{col:{value:lin(color)},dash:{value:dash},alpha:{value:alpha}},
  vertexShader:`attribute float aS;attribute float aK;varying float vS;varying float vK;void main(){vS=aS;vK=aK;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform vec3 col;uniform float dash,alpha;varying float vS;varying float vK;void main(){if(dash>0.&&fract(vS/dash)>.62)discard;float a=alpha*sqrt(clamp(vK,0.,1.));if(a<.01)discard;gl_FragColor=vec4(col,a);}`});
 const mesh=new THREE.Mesh(geo,mat);mesh.frustumCulled=false;mesh.renderOrder=order;
 return {mesh,update(pts,half,z=.5){const n=pts.length;let acc=0;for(let i=0;i<TN;i++){const j=Math.min(i,n-1),p=pts[j],q2=pts[Math.max(0,j-1)],r=pts[Math.min(n-1,j+1)];
   const tx=r[0]-q2[0],ty=r[1]-q2[1],l=Math.hypot(tx,ty)||1,nx=-ty/l,ny=tx/l,w=typeof half==='function'?half(j/(n-1)):half,o=i*6;if(i)acc+=Math.hypot(p[0]-pts[Math.max(0,j-1)][0],p[1]-pts[Math.max(0,j-1)][1]);
   pos[o]=p[0]+nx*w;pos[o+1]=p[1]+ny*w;pos[o+2]=z;pos[o+3]=p[0]-nx*w;pos[o+4]=p[1]-ny*w;pos[o+5]=z;s[i*2]=s[i*2+1]=acc;k[i*2]=k[i*2+1]=i<n?j/(n-1):0;}
  geo.attributes.position.needsUpdate=geo.attributes.aS.needsUpdate=geo.attributes.aK.needsUpdate=true;},dispose(){geo.dispose();mat.dispose();}};
}

// ---------- stavba scény ----------
let life=null;
function disposeWorld(){if(!scene)return;scene.traverse(o=>{if(o.geometry&&!o.userData.shared)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map?.dispose?.();m.dispose();});}});world?.sky?.dispose();scene=null;}
function build(mode=state.shadows){
 disposeWorld();scene=new THREE.Scene();life??=lifeCards();world={mode,meshes:{},calls:0};
 const MAP=mode.startsWith('map');renderer.shadowMap.enabled=MAP;renderer.shadowMap.type=mode==='map-full'?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;renderer.shadowMap.needsUpdate=true;
 const mat=(id,o)=>MAP?new THREE.MeshLambertMaterial({vertexColors:true}):paperMaterial(id,o);
 const all=[0,1,2,3].map(i=>placeCards(i)),hl=hills(-400,4*PLACE_W+400),wk=workshopCards();
 const byPlace=x=>Math.max(0,Math.min(3,Math.floor(x/PLACE_W)));
 for(let i=0;i<4;i++){
  const own=c=>byPlace(c.x+(c.w??0)/2)===i,cards=[...all[i],...life.cards.filter(c=>(c.layer==='near'||c.layer==='mid'||c.layer==='far')&&own(c)),...hl.filter(own),...(i===0?wk:[])];
  const layers={far:cards.filter(c=>c.layer==='far'),mid:cards.filter(c=>c.layer==='mid'),near:cards.filter(c=>c.layer==='near')};
  const g=new THREE.Mesh(cardGeometry(groundCards(i)),mat(ID.ground,{cutK:0,fiber:.05}));g.receiveShadow=true;scene.add(g);
  for(const [L,list] of Object.entries(layers)){const m=new THREE.Mesh(cardGeometry(list),mat(ID[L]));m.castShadow=MAP&&(mode==='map-full'||L==='near');m.receiveShadow=MAP&&(mode==='map-full'||L!=='near');scene.add(m);
   if(mode==='skyline'){const c=SHADOW.casters[L],o=shadowOffset(c.dz),zr=Math.max(...list.map(b=>b.z+b.d/2))-c.dz;
    const sk=skyline(list.filter(b=>b.shape!=='flag'&&!(b.shape==='box'&&b.h<.5)),i*PLACE_W-20,(i+1)*PLACE_W+20,{step:1,blur:o.pen});
    const sm=new THREE.Mesh(stripGeometry(skylineStrip(sk,{pen:o.pen,z:zr})),skylineShadowMaterial(L));sm.renderOrder=10;scene.add(sm);}}
 }
 // nebe: mraky, balóny (jedna sada pro celou čtvrť), stíny mraků na kulisu nebe
 const cl=new THREE.Mesh(cardGeometry(life.cards.filter(c=>c.layer==='cloud')),mat(ID.cloud,{cutK:.2,fiber:.04,haze:.35}));scene.add(cl);
 const bl=new THREE.Mesh(cardGeometry(life.cards.filter(c=>c.layer==='balloon')),mat(ID.balloon,{haze:.8}));scene.add(bl);
 if(mode==='skyline'){const o=shadowOffset(SHADOW.cloud.dz),b=new THREE.Mesh(blobGeometry(life.clouds.map(c=>({x:c.x+o.dx,y:c.y+c.sy*.3+o.dy,z:c.z-30,rx:c.sx*.8,ry:c.sx*.42}))),blobMaterial(SHADOW.cloud));b.renderOrder=11;scene.add(b);}
 // cedule Dílny
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(12,2.4),new THREE.MeshBasicMaterial({map:signTexture('PAPER LAB'),...STENCIL_WRITE(ID.near)}));sign.position.set(32,9.6,-3.7);scene.add(sign);
 for(const dx of [-5,5]){const s=new THREE.Mesh(new THREE.PlaneGeometry(.08,1.2),new THREE.MeshBasicMaterial({color:TOKENS.graphite}));s.position.set(32+dx,11.4,-3.75);scene.add(s);}
 // světla jen pro režimy shadow map (měření)
 if(MAP){const key=new THREE.DirectionalLight('#fff6e0',1.6),sz=mode==='map-full'?2048:1024;key.castShadow=true;key.shadow.mapSize.set(sz,sz);key.shadow.bias=-.0008;key.shadow.radius=4;
  scene.add(key,key.target,new THREE.HemisphereLight('#ffffff',D1.side,1.7));world.key=key;
  const back=new THREE.Mesh(new THREE.PlaneGeometry(9000,3000),new THREE.ShadowMaterial({opacity:.2,color:lin(D1.shadow)}));back.position.set(600,600,-800);back.receiveShadow=true;scene.add(back);}
 world.plane=makePlane();scene.add(world.plane.root);if(mode!=='off')scene.add(world.plane.shadow.root);world.plane.mesh.castShadow=MAP;
 world.trail=makeRibbon(ROLE.trail,{dash:2.4,alpha:.85});scene.add(world.trail.mesh);
 world.gust=[0,1,2].map(i=>{const e=makeRibbon(TOKENS.graphite,{alpha:.85,order:16}),c=makeRibbon(TOKENS.cream,{alpha:.95,order:17});scene.add(e.mesh,c.mesh);return {e,c};});
 world.sky=null;return world;
}

// ---------- let, záběry, kamera ----------
const SPEED=40,X0=70;
const flightAt=t=>{const x=X0+SPEED*t,y=40+14*Math.sin(t*.5)+5*Math.sin(t*1.3),dy=7*Math.cos(t*.5)+6.5*Math.cos(t*1.3);return {x,y,angle:Math.atan2(dy,SPEED)};};
const tForPlace=p=>(p*PLACE_W+PLACE_W*.45-X0)/SPEED;
function shotPose(){
 const s=state.shot;
 if(s==='dilna')return {x:HAND.x+1.5,y:HAND.y,angle:.25,rest:true};
 if(s==='vysledek'){const x=state.place*PLACE_W+PLACE_W*.55;return {x,y:2.2,angle:-.08,landed:true};}
 return flightAt(state.t);
}
function aimCamera(p){
 const aspect=canvas.width/canvas.height;
 if(p.rest){const c=restCamera(aspect);return c;}
 return cameraFor(p.x,p.y,{zoom:p.landed?1.5:1});
}
let pts=[],hideTrail=false;
function updateWorld(p){
 const w=world,pl=w.plane;
 const vis=state.shot!=='dilna'||true;pl.root.visible=pl.shadow.root.visible=vis;pl.pose(p.x,p.y,p.angle);
 // stopa: posledních ~2,2 s letu (ve výsledku dopadová křivka)
 pts.length=0;const t=p.landed?null:state.t;
 if(state.shot==='let'||state.shot==='udalost'){for(let i=TN-1;i>=0;i--){const g=flightAt(t-i*.025);pts.push([g.x-.45*PLACE_SCALE_X*Math.cos(g.angle),g.y-.45*PLACE_SCALE_X*Math.sin(g.angle)]);}}
 else if(p.landed){for(let i=TN-1;i>=0;i--){const k=i/(TN-1);pts.push([p.x-3-k*90,p.y+k*k*38]);}}
 w.trail.mesh.visible=pts.length>0&&!hideTrail;if(pts.length){const mpp=camWidthM()/canvasCssW(),half=Math.max(.22,1.1*mpp);w.trail.update(pts,half);}
 // poryv: tři zvlněné papírové proužky před vlaštovkou
 const ev=state.shot==='udalost';w.gust.forEach(({e,c},i)=>{e.mesh.visible=c.mesh.visible=ev;if(!ev)return;const g=[];for(let j=0;j<TN;j++){const u=j/(TN-1);g.push([p.x+18+u*34+i*3,p.y-6+i*5.5+Math.sin(u*6.3+i*1.7+state.t*2)*1.6+u*3]);}
  const mpp=camWidthM()/canvasCssW(),hw=u=>Math.max(.25,.55*Math.sin(Math.PI*u));e.update(g,u=>hw(u)+1.2*mpp,.6);c.update(g,hw,.7);});
}
const PLACE_SCALE_X=PLANE_SCALE;
let camW=120;const camWidthM=()=>camW,canvasCssW=()=>canvas.clientWidth||canvas.width/DPR;
function render(target=null){
 const p=shotPose(),c=aimCamera(p),w=canvas.width,h=canvas.height;camW=c.width;
 camera.fov=c.fov;camera.aspect=w/h;camera.position.set(...c.position);camera.lookAt(...c.target);camera.updateProjectionMatrix();
 if(world.key){world.key.position.set(c.cx+D1.light[0]*600,D1.light[1]*600,D1.light[2]*600);world.key.target.position.set(c.cx,0,-150);world.key.target.updateMatrixWorld();
  const sc=world.key.shadow.camera,e=world.mode==='map-full'?420:200;Object.assign(sc,{left:-e,right:e,top:e*.6,bottom:-e*.3,near:10,far:2200});sc.updateProjectionMatrix();}
 updateWorld(p);
 if(!world.sky){const sw=Math.min(1024,w),sh=Math.round(sw*h/w);world.sky=skyTexture(sw,sh);scene.background=world.sky;}
 rt.setSize(w,h);scene.traverse(o=>{const u=o.material?.uniforms?.resolution;if(u)u.value.set(w,h);});
 renderer.info.reset();renderer.setRenderTarget(rt);renderer.setClearColor(0,1);renderer.clear(true,true,true);renderer.render(scene,camera);
 world.calls=renderer.info.render.calls;world.tris=renderer.info.render.triangles;
 POST.mat.uniforms.tDiffuse.value=rt.texture;POST.mat.uniforms.res.value.set(w,h);renderer.setRenderTarget(target);renderer.clear();renderer.render(POST.scene,POST.cam);
 return {p,c};
}

// ---------- UI ----------
function sizeStage(){
 const [w,h]=VIEWS[state.view],avail=$('main').clientWidth-8,k=Math.min(1,avail/w,BARE?(innerHeight-8)/h:1);
 stage.style.width=w+'px';stage.style.height=h+'px';stage.style.transform=`scale(${k})`;stage.parentElement.style.height=h*k+'px';stage.dataset.view=state.view;
 const sc=$('.scene'),cw=sc.clientWidth,ch=Math.round(cw*9/16);sc.style.height=ch+'px';renderer.setSize(cw,ch,false);world&&(world.sky=null);
}
function updateUi(r){
 stage.dataset.shot=state.shot;document.querySelectorAll('[data-t]').forEach(e=>{const k=e.dataset.t;if(TEXT[k])e.innerHTML=T(...TEXT[k]);});
 const pi=state.shot==='dilna'?0:Math.max(0,Math.min(3,Math.floor((r.p.x)/PLACE_W)));
 $('[data-t=district]').textContent=`${T(...NAMES.districts.C[0])} · ${pi+1}/4`;$('[data-t=place]').textContent=T(...NAMES.places[pi]);
 $('#hud-dist').textContent=Math.round(Math.max(0,r.p.x-X0))+' m';$('#panel').innerHTML=PANELS[state.shot]();
 const v=new THREE.Vector3(r.p.x,r.p.y,0).project(camera),sc=$('.scene'),W=sc.clientWidth,H=sc.clientHeight,qe=$('#qte');
 qe.style.left=((v.x*.5+.5)*W+Math.max(70,W*.2))+'px';qe.style.top=((-v.y*.5+.5)*H-Math.min(60,H*.16))+'px';
 const dq=Math.min(96,Math.max(64,W*.12));qe.querySelector('svg').setAttribute('width',dq);qe.querySelector('svg').setAttribute('height',dq);
 document.querySelectorAll('[data-pick]').forEach(b=>b.setAttribute('aria-pressed',String(String(state[b.dataset.pick])===b.dataset.value)));$('#pause').setAttribute('aria-pressed',String(state.paused));
}

// ---------- měření ----------
const L=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;};return .2126*f(r)+.7152*f(g)+.0722*f(b);};
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const toHex=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
// Kontrast vlaštovky z vykresleného snímku: pixely, které se změní, když vlaštovku (i její stín a stopu) skryjeme; okno 48 × 48 CSS px.
function measure(){
 const gl=renderer.getContext(),W=canvas.width,H=canvas.height,Sx=Math.round(24*DPR),n=Sx*2+1,pl=world.plane;
 const grab=(x,y)=>{const b=new Uint8Array(n*n*4);gl.readPixels(Math.round(x)-Sx,H-Math.round(y)-Sx,n,n,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 hideTrail=true;let r=render();pl.root.updateMatrixWorld(true);
 const c=new THREE.Vector3().setFromMatrixPosition(pl.root.matrixWorld).project(camera),cx=(c.x*.5+.5)*W,cy=(-c.y*.5+.5)*H,A=grab(cx,cy);
 pl.root.visible=pl.shadow.root.visible=false;renderer.setRenderTarget(rt);renderer.clear(true,true,true);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(POST.scene,POST.cam);
 const B=grab(cx,cy);pl.root.visible=pl.shadow.root.visible=true;hideTrail=false;render();
 const E=[0x2a,0x26,0x22],changed=[],bg=[0,0,0];let nb=0;
 for(let i=0;i<n*n;i++){const a=[A[i*4],A[i*4+1],A[i*4+2]],b=[B[i*4],B[i*4+1],B[i*4+2]];if(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])>24)changed.push(a);else{bg[0]+=b[0];bg[1]+=b[1];bg[2]+=b[2];nb++;}}
 const bgc=bg.map(v=>v/Math.max(1,nb)),dist=p=>Math.hypot(p[0]-E[0],p[1]-E[1],p[2]-E[2]),mx=Math.max(0,...changed.map(dist)),avg=l=>l.length?[0,1,2].map(k=>l.reduce((s,p)=>s+p[k],0)/l.length):[0,0,0];
 const fill=avg(changed.filter(p=>dist(p)>mx*.8)),edge=avg(changed.filter(p=>dist(p)<mx*.25));
 return {shot:state.shot,view:state.view,t:+state.t.toFixed(2),px:changed.length,planePx:Math.round(planeLengthPx()),fill:toHex(fill),edge:toHex(edge),bg:toHex(bgc),fillVsBg:+ratio(fill,bgc).toFixed(2),edgeVsBg:+ratio(edge,bgc).toFixed(2)};
}
// Délka vlaštovky v CSS px (bible: na telefonu aspoň 24 px).
function planeLengthPx(){const pl=world.plane.root,a=new THREE.Vector3(.55,0,0),b=new THREE.Vector3(-.45,0,0);pl.updateMatrixWorld(true);a.applyMatrix4(world.plane.mesh.matrixWorld).project(camera);b.applyMatrix4(world.plane.mesh.matrixWorld).project(camera);
 return Math.hypot((a.x-b.x)/2*canvasCssW(),(a.y-b.y)/2*(canvas.clientHeight||canvas.height/DPR));}
// QTE: krémový disk (alfa) smíchaný s nejsvětlejším a nejtmavším pásem nebe; nejhorší prvek.
function qteContrast(){const out={};for(const s of [D1.sky[0],D1.sky[3]]){const d=mix(s,QTE.disc,QTE.discAlpha);for(const k of ['track','success','perfect','dot']){const v=contrast(QTE[k],d);out[k]=Math.min(out[k]??99,+v.toFixed(2));}}return out;}
// Výkon: N snímků se synchronizací GPU (readPixels 1 px), draw calls a trojúhelníky hlavního průchodu; GPU čas přes timer query, je-li k dispozici.
async function bench(mode=state.shadows,frames=90){
 if(mode!==world.mode){state.shadows=mode;build(mode);}
 const gl=renderer.getContext(),ext=gl.getExtension('EXT_disjoint_timer_query_webgl2'),px=new Uint8Array(4),queries=[];render();gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
 const t0=performance.now();let cpu=0;
 for(let i=0;i<frames;i++){const q2=ext?gl.createQuery():null;if(q2)gl.beginQuery(ext.TIME_ELAPSED_EXT,q2);const c0=performance.now();render();cpu+=performance.now()-c0;if(q2){gl.endQuery(ext.TIME_ELAPSED_EXT);queries.push(q2);}gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);}
 const wall=(performance.now()-t0)/frames;let gpu=null;
 if(ext){await new Promise(r=>setTimeout(r,200));const v=queries.filter(qq=>gl.getQueryParameter(qq,gl.QUERY_RESULT_AVAILABLE)).map(qq=>gl.getQueryParameter(qq,gl.QUERY_RESULT)/1e6);queries.forEach(qq=>gl.deleteQuery(qq));if(v.length)gpu=+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2);}
 return {mode,shot:state.shot,view:state.view,size:`${canvas.width}×${canvas.height}`,calls:world.calls,tris:world.tris,msWall:+wall.toFixed(2),msCpu:+(cpu/frames).toFixed(2),msGpu:gpu,visible:document.visibilityState};
}
function info(){return {calls:world.calls,tris:world.tris,mode:world.mode,meshes:scene.children.length};}

// ---------- smyčka ----------
let last=performance.now(),dirty=true;
if(!Number.isFinite(state.t))state.t=tForPlace(state.place);
function frame(){const r=render();updateUi(r);}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 const anim=(state.shot==='let'||state.shot==='udalost')&&!state.paused&&!RM;
 if(anim){state.t+=state.shot==='udalost'?dt*.15:dt;if(flightAt(state.t).x>4*PLACE_W-60)state.t=tForPlace(0)-1.5;dirty=true;}
 if(dirty&&document.visibilityState==='visible'){frame();dirty=anim;}requestAnimationFrame(loop);}
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function set(o={}){const rebuild=o.shadows&&o.shadows!==world?.mode;Object.assign(state,o);
 if(o.place!=null||o.shot)state.t=tForPlace(state.place);if(o.view)sizeStage();if(rebuild||!world)build(state.shadows);frame();dirty=true;
 const u=new URL(location);for(const k of ['shot','place','view','shadows','lang'])u.searchParams.set(k,state[k]);history.replaceState(null,'',u);}
document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.pick,v=k==='place'?+b.dataset.value:b.dataset.value;set({[k]:v});}));
$('#pause').addEventListener('click',()=>{state.paused=!state.paused;dirty=true;updateUi(render());});
$('#measure').addEventListener('click',async()=>{const m=measure(),qte=qteContrast(),b=await bench(state.shadows,60);
 $('#out').innerHTML=`<table><tr><th>vlaštovka výplň × okolí</th><td>${m.fillVsBg} : 1</td><th>obrys × okolí</th><td>${m.edgeVsBg} : 1</td><th>délka</th><td>${m.planePx} CSS px</td></tr>
 <tr><th>QTE nejhorší</th><td colspan="3">stopa ${qte.track}, úspěch ${qte.success}, perfekt ${qte.perfect}, bod ${qte.dot}</td><th>stíny</th><td>${b.mode}</td></tr>
 <tr><th>draw calls</th><td>${b.calls}</td><th>trojúhelníky</th><td>${b.tris}</td><th>ms/snímek</th><td>${b.msWall} (CPU ${b.msCpu}, GPU ${b.msGpu??'n/a'})</td></tr></table>`;});
addEventListener('resize',()=>{sizeStage();dirty=true;});
link.addEventListener('load',()=>{sizeStage();dirty=true;});
sizeStage();build(state.shadows);set({});requestAnimationFrame(loop);
window.__papir={set,measure,bench,info,qteContrast,state,renderer,build,planeLengthPx,world:()=>world,scene:()=>scene};
