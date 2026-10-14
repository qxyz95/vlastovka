// Papírový materiál, obloha a post pro katalog modelů: materiál, geometrie karet a kresba nebe ze src/render3d/paper.js (P1), nálada ráno čtvrti 1
// (PAPER_MOODS[0]: světlo mood.light, opar). Vypnutá pata karet (ao) a maska stínů, takže vzhled zůstává jako u kopie z K1.
// Post zůstává tady: hra nemá převod do šedi (kontrola siluety na 25 %, 10-katalog kap. 2).
import * as THREE from 'three';
import {paperUniforms,paperMaterial as gamePaper,kidMaterial as gameKid,cardGeometry,drawSky,lin,ID} from '../../src/render3d/paper.js';
import {PAPER_MOODS} from '../../src/render3d/paper-mood.js';

const MOOD=PAPER_MOODS[0],U=paperUniforms();
U.L.value.set(...MOOD.light).normalize();U.hazeLow.value.set(MOOD.haze.low);U.hazeHigh.value.set(MOOD.haze.high);U.hz.value.set(MOOD.haze.from,MOOD.haze.to,MOOD.haze.max,MOOD.haze.curve);
U.aoOn.value=0;U.maskOn.value=0;
export {lin,cardGeometry};
// Bible 05 kap. 3: čelo = barva karty (nahoře o 5 % světlejší), horní řez = světlé jádro kartonu, boky do studeného stínu, vlákna, opar podle hloubky.
export const paperMaterial=(opts={})=>gamePaper(ID.near,opts,U);
// Dítě C (karty 'mesh'): rampa po stěnách jako ve hře (bible 05 kap. 9.4, kidMaterial).
export const kidMaterial=()=>gameKid(U);
// Post: převod do sRGB, statické zrno papíru, teplý tón a vinětace (bible kap. 4, jako paperPost). gray = převod do šedi.
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
// Obloha čtvrti 1 (drawSky ze hry); kreslí se jednou při změně velikosti.
export function skyTexture(w,h){
 const c=document.createElement('canvas');c.width=w;c.height=h;drawSky(c.getContext('2d'),MOOD,w,h);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}
