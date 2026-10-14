// Toon materiály objektů, které ještě nejsou z papírových karet (život čtvrti, holub): toon rampa, obrys inverted hull (vlastní shader,
// bez addonů) a obrys vlaštovky razítkem.
import * as THREE from 'three';
import { PAPER_OUTLINE } from './comic.js';
import { PAPER_TOKENS } from './palette.js';
const INK = PAPER_TOKENS.graphite;
// 3 tóny s ostrými přechody (NearestFilter = žádné plynulé stínování).
export function toonRamp(tones = [70, 150, 255]) {
  const t = new THREE.DataTexture(new Uint8Array(tones), tones.length, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
}
// Obrys: vrcholy se posunou ve směru atributu `outline` o `thickness` pixelů na obrazovce (stejně tlustý blízko i daleko).
// Funguje i pro InstancedMesh (instanceMatrix). Kvádry: BackSide (klasický inverted hull). Vlaštovka: zvětšená kopie za ní (depthWrite off, renderOrder).
// Mlhu řeší ručně, aby vzdálené obrysy mizely spolu s budovami.
export function outlineMaterial({
  color = INK,
  thickness = PAPER_OUTLINE.building,
  side = THREE.BackSide,
  fog = null,
} = {}) {
  return new THREE.ShaderMaterial({
    side,
    uniforms: {
      color: { value: new THREE.Color(color) },
      thickness: { value: thickness },
      resolution: { value: new THREE.Vector2(1280, 720) },
      fogColor: { value: new THREE.Color(fog?.color ?? INK) },
      fogNear: { value: fog?.near ?? 1e9 },
      fogFar: { value: fog?.far ?? 2e9 },
    },
    vertexShader: `attribute vec3 outline;uniform float thickness;uniform vec2 resolution;varying float vDepth;
void main(){mat4 M=modelViewMatrix;
#ifdef USE_INSTANCING
M=M*instanceMatrix;
#endif
vec4 mv=M*vec4(position,1.);vec4 clip=projectionMatrix*mv;vec4 c2=projectionMatrix*M*vec4(position+outline*.05,1.);
vec2 d=(c2.xy/c2.w-clip.xy/clip.w)*resolution;float l=length(d);if(l>1e-6)clip.xy+=d/l*thickness*2./resolution*clip.w;vDepth=-mv.z;gl_Position=clip;}`,
    fragmentShader: `uniform vec3 color;uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;varying float vDepth;
void main(){gl_FragColor=vec4(mix(color,fogColor,smoothstep(fogNear,fogFar,vDepth)),1.);
#include <colorspace_fragment>
}`,
  });
}
// Obrys vlaštovky razítkem (geometry.outlineStamp, atribut shift): každá kopie posunutá o thickness px obrazovky, grafit bez mlhy.
// Transparentní s renderOrder za stopou, aby ji stopa nepřekreslila; hloubka posunutá o `push` m dozadu, takže výplň vlaštovky
// (neprůhledná, kreslí se dřív) zakryje vnitřek razítka bez z-fightingu a obrys zůstane jen kolem siluety.
export function stampOutlineMaterial({
  color = INK,
  thickness = PAPER_OUTLINE.plane,
  push = 2,
} = {}) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      color: { value: new THREE.Color(color) },
      thickness: { value: thickness },
      resolution: { value: new THREE.Vector2(1280, 720) },
      push: { value: push },
    },
    vertexShader: `attribute vec2 shift;uniform float thickness;uniform vec2 resolution;uniform float push;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vec4 clip=projectionMatrix*mv,back=projectionMatrix*vec4(mv.xy,mv.z-push,1.);
clip.z=back.z/back.w*clip.w;clip.xy+=shift*thickness*2./resolution*clip.w;gl_Position=clip;}`,
    fragmentShader: `uniform vec3 color;void main(){gl_FragColor=vec4(color,1.);
#include <colorspace_fragment>
}`,
  });
}
