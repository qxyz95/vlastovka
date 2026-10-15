// 3D vlaštovka (planeShape z geometry.js) a 3D stopa letu. Vlastní R1.
// createPlane(ctx) → {group,apply(planePlan,{t,flying}),setModel(model),setPaper(kind),trail,dispose()}; ctx = {planeHull,palette,scale,shadows}.
// Papír (P3): výplň MeshBasic s barvou vrcholů (nahoru list, jinak list × planeUnder), bez světla a mlhy; obrys razítkem (planeHull ze scény,
// grafit 2,6 px); měřítko × plan.plane.scale, stopa úměrně; stín na zem shadows.castPlane(geometrie) jako dítě meshe (S4, 08-stiny.md);
// stopa grafitová čárkovaná (paper-cards.PAPER_TRAIL), bez lemu.
// Druh papíru (G1, bible 05 kap. 17.3, plan.plane.paper): tón listu (barva vrcholů), vzor ve fragment shaderu (bez textur, 0 draw calls navíc),
// přehyb (Kraft čárkovaný steh), obrys Kraft 2,9 px delším posunem razítka. Výměna druhu jen přepíše uniformy a atributy.
// makePlane(model,…) → skupiny root → pitch → yaw → roll; applyPose(p,pose) zapíše plan.plane (úhel z juice.flightAngle jako ve 2D).
import * as THREE from 'three';
import { planeShape, outlineStamp } from './geometry.js';
import { PAPER_TRAIL } from './paper-cards.js';
import { PLANE_PAPER, PLANE_PAPER_IDS } from './palette.js';

// Stopa: points = vzorků, step = m mezi vzorky (tvar čárky PAPER_TRAIL).
export const PLANE_SCALE = 7.75,
  TRAIL = { points: 56, step: 0.6 };
export const paperOf = kind => PLANE_PAPER[kind] ?? PLANE_PAPER.copy;
// Barvy vrcholů papírové vlaštovky (lineární RGB): plochy s normálou nahoru (ny > 0,3) list, kýl a spodní strany under (bible 05 kap. 2.2).
export function planeColors(normals, { fill, under }, out = new Float32Array(normals.length)) {
  const n = normals.length / 3,
    a = new THREE.Color(fill),
    b = new THREE.Color(under ?? fill);
  for (let i = 0; i < n; i++) (normals[i * 3 + 1] > 0.3 ? a : b).toArray(out, i * 3);
  return out;
}
// Vzor papíru (bible 05 kap. 17.3) v souřadnicích modelu (délka 1, nos +x, rozpětí z): uv = list (x, |z|) nahoře, (x, y) na kýlu.
// pLine/pStripe drží průměrné pokrytí i pod 1 px (čára se rozšíří a zeslabí), takže se vzor zdálky slije do tónu a nebliká.
// Copy: linky sešitu po délce + okrajová linka u ocasu. Kraft: vlákna + airmail lem (šikmé pruhy) na odtokové hraně. Washi: seigaiha
// (soustředné oblouky šupin) + dlouhá vlákna ±7 % jasu. Fólie: perleť podle úhlu pohledu (úsvit → opar → světlo), 3 pruhy jasu, šikmé rýhy;
// mění se jen natočením (žádný čas, takže reduced motion nic nemění), bez duhy a záře.
const PAPER_VS = 'varying vec3 vPL,vPN,vPNv,vPV;\n',
  PAPER_VS_MAIN = '\nvPL=position;vPN=normal;vPNv=normalMatrix*normal;vPV=-mvPosition.xyz;',
  PAPER_FS = `uniform int pKind;uniform vec3 pA,pB,pC,pFill;uniform float pTail;varying vec3 vPL,vPN,vPNv,vPV;
float pHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float pNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(pHash(i),pHash(i+vec2(1.,0.)),f.x),mix(pHash(i+vec2(0.,1.)),pHash(i+1.),f.x),f.y);}
float pLine(float d,float w,float a){float W=max(w,a);return(1.-smoothstep(W-a*.5,W+a*.5,abs(d)))*w/W;}
float pStripe(float x,float per,float w){return pLine((fract(x/per+.5)-.5)*per,w,fwidth(x)+1e-5);}
float pSeig(vec2 p){float best=1e3,d=1.,r0=floor(p.y*2.);
for(int j=-2;j<=0;j++){float r=r0+float(j),o=mod(r,2.);for(int i=-1;i<=1;i++){
vec2 c=vec2(2.*floor((p.x-o)*.5)+1.+o+2.*float(i),r*.5),v=p-c;float l=length(v);
if(v.y>=0.&&l<1.&&c.y<best){best=c.y;d=l;}}}return d;}
vec3 paperPattern(vec3 c){
vec2 uv=abs(vPN.y)>.5?vPL.xz:vPL.xy;float s=abs(uv.y),x=uv.x-pTail,ax=fwidth(x)+1e-5;
if(pKind==0){c*=mix(vec3(1.),pA,.7*pStripe(s,.07,.004));c*=mix(vec3(1.),pB,.8*pLine(x-.09,.005,ax));}
else if(pKind==1){vec2 q=vec2(uv.x*14.,uv.y*150.);float far=smoothstep(.5,1.5,fwidth(q.y));
c*=mix(vec3(1.),pA,.4*mix(smoothstep(.7,.9,pNoise(q)),.1,far));
float k=(x+s)/.09,ph=fract(k),fa=smoothstep(.25,.6,fwidth(k)),band=1.-smoothstep(.055,.055+ax,x);
vec3 m=ph<.25?pB:(ph>=.5&&ph<.75?pC:vec3(1.));c*=mix(vec3(1.),mix(m,(pB+pC)*.25+.5,fa),.85*band);}
else if(pKind==2){vec2 p=vec2(s,x)/.06;float far=smoothstep(.3,.9,fwidth(p.x));
c*=mix(vec3(1.),pA,.16*(1.-far)*pStripe(pSeig(p),1./3.,.035));
vec2 q=vec2(uv.x*3.+uv.y*1.3,uv.y*70.-uv.x*9.);float g=smoothstep(.5,1.5,fwidth(q.y));
c*=1.+.07*mix(smoothstep(.55,.85,pNoise(q))-.25,0.,g);}
else{float f=abs(dot(normalize(vPNv),normalize(vPV))),h=clamp(.5+1.2*(f-.6)+.35*uv.x,0.,1.);
vec3 pearl=h<.5?mix(pA,pB,h*2.):mix(pB,pC,h*2.-1.),shade=c/pFill;
c=mix(c,pearl*shade,.6)*(1.+.05*(floor(clamp(x*3.,0.,2.))-1.));c*=1.-.05*pStripe(x+s,.018,.002);}
return c;}
`;
// Materiál výplně: MeshBasic s barvou vrcholů a vzorem papíru (uniformy v userData.paper sdílí program). Další onBeforeCompile
// (workshop.handDepthBias) se řetězí za tento.
export function planeMaterial(kind = 'copy') {
  const u = {
      pKind: { value: 0 },
      pA: { value: new THREE.Color() },
      pB: { value: new THREE.Color() },
      pC: { value: new THREE.Color() },
      pFill: { value: new THREE.Color() },
      pTail: { value: -0.45 },
    },
    m = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, fog: false });
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader =
      PAPER_VS +
      sh.vertexShader.replace('#include <fog_vertex>', '#include <fog_vertex>' + PAPER_VS_MAIN);
    sh.fragmentShader =
      PAPER_FS +
      sh.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\ndiffuseColor.rgb=paperPattern(diffuseColor.rgb);',
      );
  };
  m.customProgramCacheKey = () => 'planePaper';
  m.userData.paper = u;
  return paintMaterial(m, kind);
}
function paintMaterial(m, kind) {
  const u = m.userData.paper,
    P = paperOf(kind);
  u.pKind.value = Math.max(0, PLANE_PAPER_IDS.indexOf(kind));
  u.pA.value.set(P.pattern[0]);
  u.pB.value.set(P.pattern[1]);
  u.pC.value.set(P.pattern[2]);
  u.pFill.value.set(P.fill);
  return m;
}
// Přehyb tužkou: LineDashed (Kraft steh, ostatní plná = mezera 0); lineDistance v délkách vlaštovky.
export const creaseMaterial = (kind = 'copy') => paintCrease(new THREE.LineDashedMaterial(), kind);
function paintCrease(m, kind) {
  const P = paperOf(kind),
    [dash, gap] = P.dash ?? [1, 0];
  m.color.set(P.crease);
  m.dashSize = dash;
  m.gapSize = gap;
  return m;
}
export function creaseGeometry(s) {
  const c = s.creases,
    d = [],
    g = new THREE.BufferGeometry();
  for (let i = 0; i < c.length; i += 6)
    d.push(0, Math.hypot(c[i + 3] - c[i], c[i + 4] - c[i + 1], c[i + 5] - c[i + 2]));
  g.setAttribute('position', new THREE.Float32BufferAttribute(c, 3));
  g.setAttribute('lineDistance', new THREE.Float32BufferAttribute(d, 1));
  return g;
}
// Obrys razítkem; Kraft 2,9 px místo 2,6 px (bible 17.3) = delší posun kopií (základ posunu v userData.shift).
export function stampGeometry(positions) {
  const st = outlineStamp(positions),
    g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(st.positions, 3));
  g.setAttribute('shift', new THREE.Float32BufferAttribute(st.shift, 2));
  g.userData.shift = st.shift;
  g.userData.k = 1;
  return g;
}
export const outlineScale = kind => paperOf(kind).outlinePx / PLANE_PAPER.copy.outlinePx;
export function paintStamp(g, kind) {
  const k = outlineScale(kind);
  if (g.userData.k === k) return;
  const a = g.attributes.shift.array,
    b = g.userData.shift;
  for (let i = 0; i < a.length; i++) a[i] = b[i] * k;
  g.attributes.shift.needsUpdate = true;
  g.userData.k = k;
}
// Barvy vrcholů výplně podle druhu (přepíše atribut color na místě).
export function paintColors(geo, normals, kind) {
  planeColors(normals, paperOf(kind), geo.attributes.color.array);
  geo.attributes.color.needsUpdate = true;
}
// Druh papíru na díly vlaštovky (plane.js i vlaštovka v ruce ve workshop.js); materiály a geometrie zůstávají, mění se jen hodnoty.
export function paintPlane({ geo, normals, mat, crease, stamp }, kind) {
  paintColors(geo, normals, kind);
  paintMaterial(mat, kind);
  paintCrease(crease, kind);
  paintStamp(stamp, kind);
}
export function makePlane(model, ctx, kind = 'copy') {
  const { planeHull, scale = PLANE_SCALE, shadows } = ctx,
    s = planeShape(model),
    geo = new THREE.BufferGeometry(),
    tail = Math.min(...s.positions.filter((_, i) => i % 3 === 0));
  geo.setAttribute('position', new THREE.Float32BufferAttribute(s.positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(s.normals, 3));
  geo.setAttribute('outline', new THREE.Float32BufferAttribute(s.outline, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(planeColors(s.normals, paperOf(kind)), 3));
  const mesh = new THREE.Mesh(geo, planeMaterial(kind));
  mesh.material.userData.paper.pTail.value = tail;
  mesh.renderOrder = 2;
  // S4: vrhač do masky stínů (vrstva MASK_LAYER), dědí matrixWorld meshe a skryje se s ním; geometrie i materiál sdílené (nedisponovat zvlášť).
  const shadow = shadows ? shadows.castPlane(geo) : null;
  if (shadow) mesh.add(shadow);
  // Obrys razítkem (geometry.outlineStamp + toon.stampOutlineMaterial), renderOrder 2 = až po stopě (transparentní, renderOrder 1).
  const hg = stampGeometry(s.positions);
  paintStamp(hg, kind);
  const hull = new THREE.Mesh(hg, planeHull);
  hull.renderOrder = 2;
  const lg = creaseGeometry(s),
    crease = new THREE.LineSegments(lg, creaseMaterial(kind));
  crease.renderOrder = 3;
  const root = new THREE.Group(),
    pitch = new THREE.Group(),
    yaw = new THREE.Group(),
    roll = new THREE.Group();
  roll.add(mesh, hull, crease);
  yaw.add(roll);
  pitch.add(yaw);
  root.add(pitch);
  root.scale.setScalar(scale);
  const parts = { geo, normals: s.normals, mat: mesh.material, crease: crease.material, stamp: hg };
  return {
    model,
    kind,
    root,
    pitch,
    yaw,
    roll,
    mesh,
    hull,
    crease,
    shadow,
    paint(k) {
      if (k === this.kind) return;
      this.kind = k;
      paintPlane(parts, k);
    },
    dispose() {
      shadow?.removeFromParent();
      geo.dispose();
      hg.dispose();
      lg.dispose();
      mesh.material.dispose();
      crease.material.dispose();
    },
  };
}
// Póza: pitch = −angle (2D rotate kladně = nos dolů), roll náklon křídel k divákovi, squash [podél nosu, napříč].
export function applyPose(p, o) {
  p.root.visible = o.visible !== false;
  p.root.position.set(o.x, o.y, o.z ?? 0);
  p.pitch.rotation.z = -o.angle;
  p.yaw.rotation.y = o.yaw ?? -0.2;
  p.roll.rotation.x = o.roll ?? 0.42;
  const [sx, sy] = o.squash ?? [1, 1];
  p.yaw.scale.set(sx, sy, sy);
}
// Papírová stopa (bible 05 kap. 3, spec 06): grafitová tužka bez lemu, čárka PAPER_TRAIL.dash z periody period (m po dráze letu, čárky stojí ve světě),
// poloviční šířka max(half m, minPx CSS px), průhlednost alpha·√k ke konci.
const PAPER_TRAIL_VS = `attribute vec3 dir;attribute float side,halfW,alpha,dist;uniform vec2 res;uniform float dpr,minPx;varying float vA,vD;
void main(){vec4 c=projectionMatrix*modelViewMatrix*vec4(position,1.),c2=projectionMatrix*modelViewMatrix*vec4(position+dir,1.);
vec2 h=res*.5,d=c2.xy/c2.w*h-c.xy/c.w*h;d=dot(d,d)>1e-8?normalize(d):vec2(1.,0.);
float hw=max(halfW*projectionMatrix[1][1]*h.y/c.w,minPx*dpr);c.xy+=vec2(-d.y,d.x)*side*hw/h*c.w;vA=alpha;vD=dist;gl_Position=c;}`;
const PAPER_TRAIL_FS = `uniform vec3 core;uniform float dash,period;varying float vA,vD;
void main(){if(fract(vD/period)*period>dash||vA<.01)discard;gl_FragColor=vec4(core,vA);
#include <colorspace_fragment>
}`;
// Stopa: pás za vlaštovkou ve světových m (čárkovaná tužka, výše); průhlednost klesá ke konci, po dopadu se zkracuje jako stopa v juice.js.
// Pevná pole, za snímek se nic nealokuje.
const TRAIL_ATTRS = ['position', 'dir', 'halfW', 'alpha', 'dist'];
function makeTrail(color) {
  const N = TRAIL.points,
    pos = new Float32Array(N * 6),
    dir = new Float32Array(N * 6),
    side = new Float32Array(N * 2),
    halfW = new Float32Array(N * 2),
    alpha = new Float32Array(N * 2),
    dist = new Float32Array(N * 2),
    idx = [];
  for (let i = 0; i < N; i++) {
    side[i * 2] = -1;
    side[i * 2 + 1] = 1;
    if (i < N - 1) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry(),
    attr = (n, a, s) => geo.setAttribute(n, new THREE.BufferAttribute(a, s));
  attr('position', pos, 3);
  attr('dir', dir, 3);
  attr('side', side, 1);
  attr('halfW', halfW, 1);
  attr('alpha', alpha, 1);
  attr('dist', dist, 1);
  geo.setIndex(idx);
  const u = {
    res: { value: new THREE.Vector2(1, 1) },
    dpr: { value: 1 },
    core: { value: new THREE.Color(color) },
    minPx: { value: PAPER_TRAIL.minPx },
    dash: { value: PAPER_TRAIL.dash },
    period: { value: PAPER_TRAIL.period },
  };
  const mesh = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader: PAPER_TRAIL_VS,
      fragmentShader: PAPER_TRAIL_FS,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  mesh.visible = false;
  mesh.onBeforeRender = r => {
    r.getDrawingBufferSize(u.res.value);
    u.dpr.value = r.getPixelRatio();
  };
  const pts = [];
  let od = 0; // od = ujetá dráha stopy (m), poloha čárek
  function update(x, y, flying, ws = 1) {
    // ws = šířka stopy úměrně velikosti vlaštovky
    const last = pts.at(-1);
    if (flying) {
      const l = last ? Math.hypot(x - last[0], y - last[1]) : 0;
      if (!last || l > TRAIL.step) {
        od += l;
        pts.push([x, y, od]);
        if (pts.length > N) pts.shift();
      }
    } else if (pts.length) pts.shift();
    const n = pts.length;
    mesh.visible = n > 1;
    if (n < 2) return;
    for (let i = 0; i < N; i++) {
      const j = Math.min(i, n - 1),
        p = pts[j],
        a = pts[Math.max(0, j - 1)],
        b = pts[Math.min(n - 1, j + 1)],
        k = i < n ? i / (n - 1) : 1,
        o = i * 6;
      pos[o] = pos[o + 3] = p[0];
      pos[o + 1] = pos[o + 4] = p[1];
      pos[o + 2] = pos[o + 5] = -0.4;
      dir[o] = dir[o + 3] = b[0] - a[0];
      dir[o + 1] = dir[o + 4] = b[1] - a[1];
      dir[o + 2] = dir[o + 5] = 0;
      halfW[i * 2] = halfW[i * 2 + 1] = PAPER_TRAIL.half * ws;
      alpha[i * 2] = alpha[i * 2 + 1] = i < n ? PAPER_TRAIL.alpha * Math.sqrt(k) : 0;
      dist[i * 2] = dist[i * 2 + 1] = p[2];
    }
    for (const name of TRAIL_ATTRS) geo.attributes[name].needsUpdate = true;
  }
  return {
    mesh,
    uniforms: u,
    points: pts,
    update,
    reset() {
      pts.length = 0;
      od = 0;
      mesh.visible = false;
    },
    setColor(h) {
      u.core.value.set(h);
    },
    dispose() {
      geo.dispose();
      mesh.material.dispose();
    },
  };
}
export function createPlane(ctx) {
  const group = new THREE.Group(),
    trail = makeTrail(ctx.palette.trail[0]),
    base = ctx.scale ?? PLANE_SCALE;
  group.add(trail.mesh);
  let p = null,
    lastX = null,
    kind = 'copy';
  const setModel = model => {
    if (p?.model === model) return;
    if (p) {
      p.root.removeFromParent();
      p.dispose();
    }
    p = makePlane(model, ctx, kind);
    group.add(p.root);
  };
  const setPaper = k => {
    kind = PLANE_PAPER[k] ? k : 'copy';
    p.paint(kind);
  };
  setModel('dart');
  function apply(o, { flying = false, trailColor } = {}) {
    setModel(o.model ?? 'dart');
    setPaper(o.paper ?? 'copy');
    applyPose(p, o);
    const k = o.scale ?? 1,
      scale = base * k;
    p.root.scale.setScalar(scale); // plan.plane.scale: délka podle záběru (frame.planeLength) × +15 % papíru na úzké scéně
    if (lastX != null && o.x < lastX - 1) trail.reset();
    lastX = o.x; // nový hod: vlaštovka skočila zpět
    if (trailColor) trail.setColor(trailColor);
    trail.update(
      o.x - 0.45 * scale * Math.cos(o.angle),
      o.y + 0.45 * scale * Math.sin(o.angle),
      flying,
      k,
    );
  }
  return {
    group,
    apply,
    setModel,
    setPaper,
    trail,
    get current() {
      return p;
    },
    dispose() {
      p?.dispose();
      trail.dispose();
    },
  };
}
