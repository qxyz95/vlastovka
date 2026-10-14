// Papírový materiál, obloha a post pro katalog modelů. Kopie z prototype/styly/papir.js (paperMaterial, postPass, skyTexture, cardGeometry),
// protože src/render3d/paper.js v HEAD ještě není (vzniká v dávce P1). Barvy a nálada ze src/render3d (PAPIR, PAPER_MOODS[0] = ráno čtvrti 1).
// Až P1 přinese paper.js, nahradit importem a tento soubor smazat.
import * as THREE from 'three';
import {PAPIR} from '../../src/render3d/palette.js';
import {PAPER_MOODS} from '../../src/render3d/paper-mood.js';
import {cardVertices} from '../../src/render3d/paper-cards.js';

const MOOD=PAPER_MOODS[0],CITY=PAPIR.city,cache=new Map();
export const lin=h=>{let c=cache.get(h);if(!c){c=new THREE.Color(h);cache.set(h,c);}return c;};
const NOISE=`float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+1.),f.x),f.y);}`;
// Bible 05 kap. 3: čelo = barva karty (nahoře o 5 % světlejší), horní řez = světlé jádro kartonu, boky do studeného stínu, vlákna, opar podle hloubky.
// Normála a poloha ve světě, takže otočený model (podstavec) se stínuje jako ve hře z pohledu kamery na +z.
export function paperMaterial({cutK=.55,sideK=.3,fiber=.07,haze=1}={}){
 return new THREE.ShaderMaterial({vertexColors:true,
  uniforms:{cut:{value:lin(CITY.cut)},side:{value:lin(CITY.side)},hazeLow:{value:lin(MOOD.haze.low)},hazeHigh:{value:lin(MOOD.haze.high)},L:{value:new THREE.Vector3(...MOOD.light).normalize()},
   cutK:{value:cutK},sideK:{value:sideK},fiber:{value:fiber},hz:{value:new THREE.Vector4(MOOD.haze.from,MOOD.haze.to,MOOD.haze.max*haze,MOOD.haze.curve)}},
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
// Post: převod do sRGB, statické zrno papíru, teplý tón a vinětace (bible kap. 4). gray = převod do šedi (kontrola siluety, 10-katalog kap. 2).
export function postPass(){
 const mat=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},res:{value:new THREE.Vector2(1,1)},grain:{value:.035},vignette:{value:.14},tint:{value:new THREE.Color('#fffaf2')},gray:{value:0}},depthTest:false,depthWrite:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 res;uniform float grain,vignette,gray;uniform vec3 tint;varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec3 s=pow(max(texture2D(tDiffuse,vUv).rgb,0.),vec3(1./2.2))*tint;vec2 px=floor(vUv*res/1.5);s+=(h(px)-.5)*grain*(.5+.5*(1.-dot(s,vec3(.33))));
float v=length(vUv-.5)*1.4;s*=1.-vignette*pow(v,2.6);s=mix(s,vec3(dot(s,vec3(.2126,.7152,.0722))),gray);gl_FragColor=vec4(clamp(s,0.,1.),1.);}`});
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,0,2],2));
 const scene=new THREE.Scene(),m=new THREE.Mesh(geo,mat);m.frustumCulled=false;scene.add(m);
 return {mat,scene,cam:new THREE.OrthographicCamera(-1,1,1,-1,0,1),dispose(){geo.dispose();mat.dispose();}};
}
// Obloha čtvrti 1 (plynulý přechod, slunce se září); kreslí se jednou při změně velikosti.
export function skyTexture(w,h){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,h);
 MOOD.sky.forEach((s,i)=>gr.addColorStop(MOOD.skyAt[i],s));g.fillStyle=gr;g.fillRect(0,0,w,h);
 const s=MOOD.sun,x=s.x*w,y=s.y*h,r=s.r*h,glow=g.createRadialGradient(x,y,0,x,y,r*9);
 glow.addColorStop(0,s.halo+'cc');glow.addColorStop(.25,s.halo+'55');glow.addColorStop(1,s.halo+'00');g.fillStyle=glow;g.fillRect(0,0,w,h);
 g.fillStyle='#ffffff55';g.beginPath();g.arc(x,y,r*1.35,0,7);g.fill();g.fillStyle=s.color;g.beginPath();g.arc(x,y,r,0,7);g.fill();
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}
// Sloučená geometrie karet (jeden draw call), barvy vrcholů převedené do lineárního prostoru.
export function cardGeometry(list){
 const v=cardVertices(list),n=v.p.length/3,g=new THREE.BufferGeometry(),C=new Float32Array(n*3);
 for(let i=0;i<n;i++){const c=lin(v.c[i]);C[i*3]=c.r;C[i*3+1]=c.g;C[i*3+2]=c.b;}
 g.setAttribute('position',new THREE.Float32BufferAttribute(v.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(v.n,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));
 g.computeBoundingSphere();return g;
}
