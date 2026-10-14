// Komiksové materiály prototypu: toon rampa, obrys inverted hull (vlastní shader, bez addonů),
// textura oken, neonové cedule a post-process (posterizace + půltónové body ve stínu).
import * as THREE from 'three';
import {windowPattern} from './life.js';
// 3 tóny s ostrými přechody (NearestFilter = žádné plynulé stínování).
export function toonRamp(tones=[70,150,255]){const t=new THREE.DataTexture(new Uint8Array(tones),tones.length,1,THREE.RedFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.needsUpdate=true;return t;}
// Obrys: vrcholy se posunou ve směru atributu `outline` o `thickness` pixelů na obrazovce (stejně tlustý blízko i daleko).
// Funguje i pro InstancedMesh (instanceMatrix). Kvádry: BackSide (klasický inverted hull). Vlaštovka: zvětšená kopie za ní (depthWrite off, renderOrder).
// Mlhu řeší ručně, aby vzdálené obrysy mizely spolu s budovami.
export function outlineMaterial({color='#07051a',thickness=2.2,side=THREE.BackSide,fog=null}={}){
 return new THREE.ShaderMaterial({side,uniforms:{color:{value:new THREE.Color(color)},thickness:{value:thickness},resolution:{value:new THREE.Vector2(1280,720)},
  fogColor:{value:new THREE.Color(fog?.color??'#000')},fogNear:{value:fog?.near??1e9},fogFar:{value:fog?.far??2e9}},
  vertexShader:`attribute vec3 outline;uniform float thickness;uniform vec2 resolution;varying float vDepth;
void main(){mat4 M=modelViewMatrix;
#ifdef USE_INSTANCING
M=M*instanceMatrix;
#endif
vec4 mv=M*vec4(position,1.);vec4 clip=projectionMatrix*mv;vec4 c2=projectionMatrix*M*vec4(position+outline*.05,1.);
vec2 d=(c2.xy/c2.w-clip.xy/clip.w)*resolution;float l=length(d);if(l>1e-6)clip.xy+=d/l*thickness*2./resolution*clip.w;vDepth=-mv.z;gl_Position=clip;}`,
  fragmentShader:`uniform vec3 color;uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;varying float vDepth;
void main(){gl_FragColor=vec4(mix(color,fogColor,smoothstep(fogNear,fogFar,vDepth)),1.);
#include <colorspace_fragment>
}`});
}
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
// Okna: 8 × 8 v dlaždici, část svítí (růžová, tyrkysová, teplá žlutá). Okraj (uv 0,0) zůstává tmavý pro střechy.
export function windowTexture(seed=7,lit=.38){
 const c=canvas(256,256),g=c.getContext('2d');
 g.fillStyle='#000';g.fillRect(0,0,256,256);const colors=['#ff6fd0','#62ecff','#ffc86b','#ffe9a8'];
 // Vzor sdílí life.js (facadeWindows), aby okna za vlaštovkou svítila přesně v tmavých buňkách.
 for(const p of windowPattern(seed,lit))if(p.lit){g.fillStyle=colors[p.color];g.globalAlpha=p.alpha;g.fillRect(p.col*32+10,p.row*32+11,13,12);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.NearestFilter;t.anisotropy=8;return t;
}
// Neonová cedule: text s rozzářením na tmavém podkladu s barevným rámem. Cache podle (text, barva, orientace).
const signs=new Map();
export function signTexture(text,color,vertical=false){
 const key=text+color+vertical;if(signs.has(key))return signs.get(key);
 const w=vertical?96:512,h=vertical?384:128,c=canvas(w,h),g=c.getContext('2d');
 g.fillStyle='#0c0820';g.fillRect(0,0,w,h);g.strokeStyle=color;g.lineWidth=8;g.shadowColor=color;g.shadowBlur=18;g.strokeRect(10,10,w-20,h-20);
 g.fillStyle='#fff';g.font=`bold ${vertical?54:68}px monospace`;g.textAlign='center';g.textBaseline='middle';
 if(vertical){const ch=[...text.replace(/[^A-Z0-9]/g,'')].slice(0,6);ch.forEach((s,i)=>g.fillText(s,w/2,h/2+(i-(ch.length-1)/2)*56));}else g.fillText(text,w/2,h/2+4,w-40);
 g.globalCompositeOperation='source-atop';g.shadowBlur=0;g.fillStyle=color;g.globalAlpha=.35;g.fillRect(0,0,w,h);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;signs.set(key,t);return t;
}
// Nebe jako přechod na pozadí scény (barvy kyber nebe: tmavě fialová → růžový obzor).
export function skyTexture(stops=['#0b0824','#1d1150','#52206a','#b0407e']){
 const c=canvas(4,256),g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);stops.forEach((s,i)=>gr.addColorStop(i/(stops.length-1),s));g.fillStyle=gr;g.fillRect(0,0,4,256);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
// Post-process bez EffectComposer: scéna do render targetu, pak celoobrazovkový trojúhelník s tímto shaderem.
export function postPass(){
 const mat=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},resolution:{value:new THREE.Vector2(1,1)},levels:{value:6},dotSize:{value:5},mode:{value:1}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 resolution;uniform float levels;uniform float dotSize;uniform float mode;varying vec2 vUv;
void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 s=pow(max(c.rgb,0.),vec3(1./2.2));vec3 p=floor(s*levels+.5)/levels;
float l=dot(s,vec3(.299,.587,.114));vec2 g=mat2(.7071,-.7071,.7071,.7071)*(vUv*resolution)/dotSize;float d=length(fract(g)-.5);
float shade=clamp((.42-l)/.42,0.,1.);float ink=mode>.5?(1.-smoothstep(.5*sqrt(shade)-.06,.5*sqrt(shade),d))*step(.03,shade):0.;
gl_FragColor=vec4(mix(p,p*.25+vec3(.02,0.,.06),ink*.85),c.a);}`,depthTest:false,depthWrite:false});
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,0,2],2));
 const scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1),mesh=new THREE.Mesh(geo,mat);mesh.frustumCulled=false;scene.add(mesh);
 return {mat,scene,cam};
}
