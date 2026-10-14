// Papírové město (three.js): materiály papíru, stíny na zem (maska), nebe a post. Vlastní P1.
// Převzato z archiv/prototype/styly/papir.js a stiny.js (bible research/design/05-styl-papir.md kap. 3–4, stíny research/design/08-stiny.md, spec 06 kap. 3).
// Barvy z palette('papir'), plan.mood a paper-shadow.js, ne napevno.
// paperKit() → {uniforms, material(id,opts), shadows, applyMood(mood), setQuality(level), dispose()}: sdílené materiály pro city.js a čtvrti (ctx.materials.paper).
// Stíny jsou oddělené za rozhraním shadows (groundShadows), aby šla technika vyměnit bez zásahu do města a scény.
import * as THREE from 'three';
import {ID,cardVertices} from './paper-cards.js';
import {PAPER_KEYS} from './mood.js';
import {palette,PAPER_TOKENS} from './palette.js';
import {qualityPreset} from './quality.js';
import {SHADOW_LOOK,shadowLight} from './paper-shadow.js';

const P=palette('papir'),cache=new Map();
// Barva '#rrggbb' (sRGB) → THREE.Color v lineárním prostoru, keš jen pro čtení (nemutovat).
export const lin=h=>{let c=cache.get(h);if(!c){c=new THREE.Color(h);cache.set(h,c);}return c;};
export {ID};
// Vrstva three.js, ve které jsou jen vrhače stínu (maska); hlavní kamera ji nevidí.
export const MASK_LAYER=1;

const NOISE=`float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+1.),f.x),f.y);}`;
// Sdílené uniformy všech papírových materiálů: řez, boky (palette), opar, světlo (plan.mood), vlákna zap/vyp (kvalita),
// stíny na zem: maska tMask v rozlišení res, studený tint a síla k, maskOn (kvalita 1–2), aoOn (pata karet).
export function paperUniforms(){
 const [r,g,b]=SHADOW_LOOK.tint;
 return {cut:{value:lin(P.city.cut).clone()},side:{value:lin(P.city.side).clone()},hazeLow:{value:new THREE.Color()},hazeHigh:{value:new THREE.Color()},
  L:{value:new THREE.Vector3(.62,.5,-.6).normalize()},hz:{value:new THREE.Vector4(20,700,.72,.8)},fiberOn:{value:1},
  tMask:{value:null},res:{value:new THREE.Vector2(1,1)},tint:{value:new THREE.Color().setRGB(r/255,g/255,b/255,THREE.SRGBColorSpace)},k:{value:SHADOW_LOOK.k},maskOn:{value:0},aoOn:{value:1}};
}
// Zápis nálady do sdílených uniforem; barvy oparu se přepíší jen při změně řetězce. Světlo a síla stínu z paper-shadow.shadowLight (bez alokace).
export function moodWriter(u){const last={};const set=(k,v)=>{if(v&&last[k]!==v){last[k]=v;u[k].value.set(v);}};
 return m=>{const h=m?.haze;if(h){set('hazeLow',h.low);set('hazeHigh',h.high);u.hz.value.set(h.from,h.to,h.max,h.curve);}
  const s=shadowLight(m??{});u.L.value.set(s.dir[0],s.dir[1],s.dir[2]);u.k.value=s.k;};}
// Papír (kap. 3): čelo = barva karty (nahoře o 5 % světlejší), horní řez = světlé jádro kartonu, boky do studeného stínu, přivrácené ke slunci světlejší,
// vlákna (3 oktávy šumu ve světových m, statická), pata karty ztmavená (ao), zem násobená maskou stínu studeným tintem (před oparem), opar podle hloubky z.
export function paperMaterial(id,{cutK=.55,sideK=.3,fiber=.07,haze=1}={},u=paperUniforms()){
 const A=SHADOW_LOOK.ao.h,aoH=id===ID.near?A.near:id===ID.mid?A.mid:id===ID.far?A.far:0;
 return new THREE.ShaderMaterial({vertexColors:true,
  uniforms:{...u,cutK:{value:cutK},sideK:{value:sideK},fiber:{value:fiber},hazeK:{value:haze},recv:{value:id===ID.ground?1:0},aoH:{value:aoH},aoK:{value:SHADOW_LOOK.ao.k}},
  vertexShader:`varying vec3 vC;varying vec3 vN;varying vec3 vW;void main(){vC=color;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader:`uniform vec3 cut,side,hazeLow,hazeHigh,L,tint;uniform float cutK,sideK,fiber,fiberOn,hazeK,recv,aoH,aoK,aoOn,maskOn,k;uniform vec4 hz;uniform vec2 res;uniform sampler2D tMask;
varying vec3 vC;varying vec3 vN;varying vec3 vW;${NOISE}
void main(){vec3 c=vC,n=normalize(vN);
 if(n.z>.5)c*=.95+.05*clamp(vW.y/30.,0.,1.);
 else if(n.y>.95)c=mix(c,cut,cutK);
 else{float l=dot(n,L);c=l>.05?mix(c,cut,.12*l*cutK/.55):mix(c,side,sideK);}
 if(fiberOn>.5){vec2 q=n.z>.5?vW.xy:n.y>.95?vW.xz:vW.zy;float f=vn(q*.9)*.55+vn(q*3.7)*.3+vn(q*13.)*.15;c*=1.+(f-.5)*fiber;}
 if(aoOn>.5&&aoH>0.&&n.y<.95)c*=1.-aoK*(1.-smoothstep(0.,aoH,vW.y));
 if(maskOn>.5&&recv>.5)c*=mix(vec3(1.),tint,texture2D(tMask,gl_FragCoord.xy/res).r*k);
 float h=hz.z*hazeK*pow(clamp((-vW.z-hz.x)/(hz.y-hz.x),0.,1.),hz.w);c=mix(c,mix(hazeLow,hazeHigh,clamp(vW.y/160.,0.,1.)),h);
 gl_FragColor=vec4(c,1.);}`});
}

// ── Geometrie karet (paper-cards.cardVertices → BufferGeometry s barvou vrcholů v lineárním RGB).
export function cardGeometry(list){
 const v=cardVertices(list),n=v.p.length/3,g=new THREE.BufferGeometry(),C=new Float32Array(n*3);
 for(let i=0;i<n;i++){const c=lin(v.c[i]);C[i*3]=c.r;C[i*3+1]=c.g;C[i*3+2]=c.b;}
 g.setAttribute('position',new THREE.Float32BufferAttribute(v.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(v.n,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingSphere();return g;
}
const quad=()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,0,2],2));return g;};
const FULL=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;

// ══ Stíny na zem (vyměnitelný blok, 08-stiny.md S2–S3). Rozhraní pro city.js, scene.js a P3 (vlaštovka):
//   shadows = groundShadows(u)              u = paperUniforms() (tMask, res, maskOn, aoOn čtou papírové materiály)
//   shadows.cast(mesh) → Mesh               vrhač karty: stejná geometrie, projekce na zem, vrstva MASK_LAYER; přidat jako sourozence meshe
//                                           se stejnou transformací (city.js: do skupiny místa). Sdílí geometrii, nedisponovat zvlášť.
//   shadows.castPlane(geometry) → Mesh      vrhač vlaštovky (P3, S4): přidat jako DÍTĚ meshe vlaštovky (dědí matrixWorld, skryje se s ní),
//                                           síla exp(−výška / fade.plane), žádná alokace za snímek
//   shadows.render(renderer,scene,camera)   před hlavním průchodem: vrhače do masky (MaxEquation do R), rozmazání, u.tMask; vrací počet průchodů
//   shadows.resize(w,h) drawing buffer · shadows.setQuality(preset) maska a rozmazání podle quality.js · shadows.dispose()
export function projectMaterial({plane=false}={},u=paperUniforms()){
 return new THREE.ShaderMaterial({depthTest:false,depthWrite:false,side:THREE.DoubleSide,blending:THREE.CustomBlending,blendEquation:THREE.MaxEquation,blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor,
  uniforms:{L:u.L,fade:{value:new THREE.Vector3(...SHADOW_LOOK.fade.card)},pf:{value:SHADOW_LOOK.fade.plane},isPlane:{value:plane?1:0}},
  vertexShader:`uniform vec3 L,fade;uniform float pf,isPlane;varying float vS;void main(){vec4 w=modelMatrix*vec4(position,1.);float hgt=max(w.y,0.);
 vS=isPlane>.5?exp(-hgt/pf):1.-fade.z*smoothstep(fade.x,fade.y,hgt);w.xyz-=L*(hgt/L.y);w.y=.02;gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader:`varying float vS;void main(){gl_FragColor=vec4(vS,0.,0.,1.);}`});
}
// Rozmazání masky: oddělitelné (5 vzorků ve směru d) nebo jeden 2D průchod (9 vzorků, stan 3 × 3) pro kvalitu 1.
export function blurMaterial(cross=false){return new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{t:{value:null},d:{value:new THREE.Vector2()}},vertexShader:FULL,
 fragmentShader:cross?`uniform sampler2D t;uniform vec2 d;varying vec2 vUv;void main(){vec4 s=texture2D(t,vUv)*.25;
 s+=(texture2D(t,vUv+vec2(d.x,0.))+texture2D(t,vUv-vec2(d.x,0.))+texture2D(t,vUv+vec2(0.,d.y))+texture2D(t,vUv-vec2(0.,d.y)))*.125;
 s+=(texture2D(t,vUv+d)+texture2D(t,vUv-d)+texture2D(t,vUv+vec2(d.x,-d.y))+texture2D(t,vUv-vec2(d.x,-d.y)))*.0625;gl_FragColor=s;}`
 :`uniform sampler2D t;uniform vec2 d;varying vec2 vUv;void main(){vec4 s=texture2D(t,vUv)*.2270;s+=(texture2D(t,vUv+d*1.3846)+texture2D(t,vUv-d*1.3846))*.3162;s+=(texture2D(t,vUv+d*3.2308)+texture2D(t,vUv-d*3.2308))*.0703;gl_FragColor=s;}`});}
export function groundShadows(u=paperUniforms()){
 const card=projectMaterial({},u),plane=projectMaterial({plane:true},u),sep=blurMaterial(),cross=blurMaterial(true),geo=quad();
 const bq=new THREE.Mesh(geo,sep);bq.frustumCulled=false;const bs=new THREE.Scene();bs.add(bq);const bc=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 const rt=[0,1].map(()=>new THREE.WebGLRenderTarget(4,4,{depthBuffer:false}));
 let q=qualityPreset(2),size=[4,4];const keep={color:new THREE.Color(),alpha:0,bg:null};
 const mk=(g,m)=>{const x=new THREE.Mesh(g,m);x.layers.set(MASK_LAYER);x.frustumCulled=false;x.userData.shadow=true;return x;};
 const fit=()=>{const s=q.mask||.25,w=Math.max(4,Math.round(size[0]*s)),h=Math.max(4,Math.round(size[1]*s));for(const r of rt)r.setSize(w,h);};
 const pass=(m,src,dx,dy)=>{bq.material=m;m.uniforms.t.value=src.texture;m.uniforms.d.value.set(dx,dy);};
 function render(renderer,scene,camera){
  if(!q.mask){u.maskOn.value=0;return 0;}
  const mask=camera.layers.mask;keep.bg=scene.background;renderer.getClearColor(keep.color);keep.alpha=renderer.getClearAlpha();
  scene.background=null;camera.layers.set(MASK_LAYER);renderer.setClearColor(0,0);
  try{renderer.setRenderTarget(rt[0]);renderer.render(scene,camera);}
  finally{camera.layers.mask=mask;scene.background=keep.bg;}
  const w=rt[0].width,h=rt[0].height,b=SHADOW_LOOK.blur;let out=rt[0];
  if(q.blur>=2){pass(sep,rt[0],b/w,0);renderer.setRenderTarget(rt[1]);renderer.render(bs,bc);pass(sep,rt[1],0,b/h);renderer.setRenderTarget(rt[0]);renderer.render(bs,bc);}
  else if(q.blur===1){pass(cross,rt[0],b/w,b/h);renderer.setRenderTarget(rt[1]);renderer.render(bs,bc);out=rt[1];}
  renderer.setClearColor(keep.color,keep.alpha);u.tMask.value=out.texture;u.maskOn.value=1;return 1+q.blur;
 }
 return {cast:m=>mk(m.geometry,card),castPlane:g=>mk(g,plane),render,materials:{card,plane},
  resize(w,h){size=[w,h];u.res.value.set(w,h);fit();},
  setQuality(p){q=p;u.aoOn.value=p.ao?1:0;if(!p.mask)u.maskOn.value=0;fit();},
  get quality(){return q;},get targets(){return rt;},
  dispose(){for(const m of [card,plane,sep,cross])m.dispose();geo.dispose();for(const r of rt)r.dispose();u.tMask.value=null;}};
}
// ══ konec bloku stínů

// Sada sdílených materiálů papíru pro jednu scénu. material(id,opts) z keše podle id a opts (jeden program, různé uniformy).
export function paperKit(){
 const u=paperUniforms(),mats=new Map(),write=moodWriter(u),shadows=groundShadows(u);let level=null;
 const material=(id,o={})=>{const k=id+JSON.stringify(o);if(!mats.has(k))mats.set(k,paperMaterial(id,o,u));return mats.get(k);};
 write(PAPER_KEYS[0]);
 return {uniforms:u,material,shadows,applyMood:write,
  get quality(){return level;},
  setQuality(l){const q=qualityPreset(l);if(q.level===level)return false;level=q.level;u.fiberOn.value=q.fiber?1:0;shadows.setQuality(q);return true;},
  dispose(){for(const m of mats.values())m.dispose();mats.clear();shadows.dispose();}};
}

// ── Post (kap. 4): převod do sRGB, statické zrno papíru 3,5 %, teplý tón, vinětace 0,14. Žádné rozmazání, bloom ani posterizace.
export const POST=Object.freeze({grain:.035,vignette:.14,tint:Object.freeze([1,250/255,242/255])});
export function paperPost(){
 const tint=new THREE.Color().setRGB(...POST.tint,THREE.SRGBColorSpace);
 const mat=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},resolution:{value:new THREE.Vector2(1,1)},grain:{value:POST.grain},vignette:{value:POST.vignette},tint:{value:tint}},depthTest:false,depthWrite:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 resolution;uniform float grain,vignette;uniform vec3 tint;varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec3 s=pow(max(texture2D(tDiffuse,vUv).rgb,0.),vec3(1./2.2))*tint;vec2 px=floor(vUv*resolution/1.5);s+=(h(px)-.5)*grain*(.5+.5*(1.-dot(s,vec3(.33))));
float v=length(vUv-.5)*1.4;s*=1.-vignette*pow(v,2.6);gl_FragColor=vec4(clamp(s,0.,1.),1.);}`});
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,0,2],2));
 const scene=new THREE.Scene(),m=new THREE.Mesh(geo,mat);m.frustumCulled=false;scene.add(m);
 return {mat,scene,cam:new THREE.OrthographicCamera(-1,1,1,-1,0,1),setGrain(on){mat.uniforms.grain.value=on?POST.grain:0;},dispose(){geo.dispose();mat.dispose();}};
}

// ── Nebe (kap. 4): plynulý přechod podle mood.sky / skyAt, záře slunce (9× kotouč), světlý lem a papírový kotouč. Kreslí se do plátna
// jen při změně velikosti nebo nálady o víc než SKY_REDRAW úrovní kanálu (0–255), ne každý snímek.
export const SKY_REDRAW=2,SKY_MAX_W=1024;
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const rgba=(h,a)=>`rgba(${rgb(h).join(',')},${a})`;
// Největší rozdíl dvou nálad nebe v úrovních kanálu (polohy a velikost slunce × 255); Infinity = jiný tvar nebo první snímek.
export function skyDelta(a,b){
 if(!a||!b||a.sky.length!==b.sky.length)return Infinity;let d=0;const c=(x,y)=>{const p=rgb(x),q=rgb(y);for(let i=0;i<3;i++)d=Math.max(d,Math.abs(p[i]-q[i]));};
 a.sky.forEach((s,i)=>c(s,b.sky[i]));const sa=a.sun??{},sb=b.sun??{};
 for(const k of ['x','y','r','alpha'])d=Math.max(d,Math.abs((sa[k]??0)-(sb[k]??0))*255);
 if(sa.color&&sb.color){c(sa.color,sb.color);c(sa.halo,sb.halo);}
 for(let i=0;i<Math.max(a.skyAt?.length??0,b.skyAt?.length??0);i++)d=Math.max(d,Math.abs((a.skyAt?.[i]??0)-(b.skyAt?.[i]??0))*255);
 return d;
}
// Kresba nebe do 2D kontextu (testovatelné bez DOM s náhradním kontextem).
export function drawSky(g,m,w,h){
 const gr=g.createLinearGradient(0,0,0,h),n=m.sky.length;m.sky.forEach((s,i)=>gr.addColorStop(m.skyAt?.[i]??i/(n-1),s));g.globalAlpha=1;g.fillStyle=gr;g.fillRect(0,0,w,h);
 const s=m.sun;if(!s||!(s.alpha>0)||s.x==null)return;
 const x=s.x*w,y=s.y*h,r=s.r*h,glow=g.createRadialGradient(x,y,0,x,y,r*9);
 glow.addColorStop(0,rgba(s.halo,.8));glow.addColorStop(.25,rgba(s.halo,.333));glow.addColorStop(1,rgba(s.halo,0));
 g.globalAlpha=s.alpha;g.fillStyle=glow;g.fillRect(0,0,w,h);
 g.fillStyle=rgba(PAPER_TOKENS.paper,.333);g.beginPath();g.arc(x,y,r*1.35,0,7);g.fill();g.fillStyle=s.color;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.globalAlpha=1;
}
// paperSky({make}) → {texture, paint(mood,w,h) → texture, draws, dispose()}. make(w,h) vytvoří plátno (výchozí OffscreenCanvas / <canvas>).
const makeCanvas=(w,h)=>{if(globalThis.OffscreenCanvas)return new OffscreenCanvas(w,h);const c=globalThis.document.createElement('canvas');c.width=w;c.height=h;return c;};
export function paperSky({make=makeCanvas}={}){
 let canvas=null,g=null,tex=null,last=null,draws=0;
 function paint(m,W,H){
  const w=Math.max(4,Math.min(SKY_MAX_W,Math.round(W))),h=Math.max(4,Math.round(w*H/Math.max(1,W)));
  const resized=!canvas||canvas.width!==w||canvas.height!==h;
  if(!resized&&skyDelta(last,m)<=SKY_REDRAW)return tex;
  if(resized){tex?.dispose();canvas=make(w,h);canvas.width=w;canvas.height=h;g=canvas.getContext('2d');tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;}
  drawSky(g,m,w,h);tex.needsUpdate=true;last={sky:[...m.sky],skyAt:m.skyAt?[...m.skyAt]:null,sun:m.sun?{...m.sun}:null};draws++;return tex;
 }
 return {get texture(){return tex;},get draws(){return draws;},paint,dispose(){tex?.dispose();tex=null;canvas=null;last=null;}};
}

// ── Měření kontrastu vlaštovky z pixelů (spec 06 kap. 5, krit. 1): A = snímek s vlaštovkou, B = bez ní (stopa skrytá v obou), RGBA okna n × n.
// Změněné pixely = vlaštovka (+ její stín); výplň = nejvzdálenější od grafitu, obrys = nejbližší, okolí = průměr nezměněných. Kontrast WCAG.
const L=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;};return .2126*f(r)+.7152*f(g)+.0722*f(b);};
export const contrast=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const toHex=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
export function planeContrast(A,B,{edge=PAPER_TOKENS.graphite,threshold=24}={}){
 const E=rgb(edge),changed=[],bg=[0,0,0];let nb=0;
 for(let i=0;i<A.length;i+=4){const a=[A[i],A[i+1],A[i+2]];if(Math.hypot(a[0]-B[i],a[1]-B[i+1],a[2]-B[i+2])>threshold)changed.push(a);else{bg[0]+=B[i];bg[1]+=B[i+1];bg[2]+=B[i+2];nb++;}}
 const bgc=bg.map(v=>v/Math.max(1,nb)),dist=p=>Math.hypot(p[0]-E[0],p[1]-E[1],p[2]-E[2]);let mx=0;for(const p of changed)mx=Math.max(mx,dist(p));
 const avg=l=>l.length?[0,1,2].map(k=>l.reduce((s,p)=>s+p[k],0)/l.length):[0,0,0];
 const fill=avg(changed.filter(p=>dist(p)>mx*.8)),ed=avg(changed.filter(p=>dist(p)<mx*.25)),fv=+contrast(fill,bgc).toFixed(2),ev=+contrast(ed,bgc).toFixed(2);
 return {px:changed.length,fill:toHex(fill),edge:toHex(ed),bg:toHex(bgc),fillVsBg:fv,edgeVsBg:ev,pass:changed.length>0&&Math.max(fv,ev)>=3};
}
