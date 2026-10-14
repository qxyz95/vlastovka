// Pózy dítěte a vlaštovky (čisté, bez three.js a DOM). Vlastní R3. Vzorce 1:1 z render.js (dítě a vlaštovka se tam kreslí inline),
// převedené do 3D: úhly v radiánech podle three.js (osa y nahoru, kladný úhel = proti směru hodin = nos nahoru), posuny v m přes 2,1 px/m.
// Smlouva: kamera v klidu restCamera() promítne HAND (vlaštovka v ruce) na view(null) = (148, 258) ±2 px; šipka míření tak vychází z vlaštovky.
import { PIXELS_PER_METER as PPM } from '../scenes.js';
import { noise1, fbm } from '../motion.js';
import { flightAngle } from '../juice.js';
import { follow, sideCamera } from './geometry.js';
import { LAUNCH, AIM_SHOT } from './models/launch-site.js';
// Klidový záběr (Dílna, míření): polodetail 16 m, na užší scéně tak, aby vlaštovka v ruce (hand m) měla aspoň handPx CSS px, nejméně 7 m
// (research/start/02 §2: desktop 16 m / 40 px, telefon 375 px 7 m / 27 px; rozhodnutí 06);
// při nabíjení se přisune o push·charge (01 §2.2 fáze 3). k = logické px na světový px (2,1 px/m) v hloubce ruky.
// Ruka (S4, místo odhodu G2b): HAND = launch-site LAUNCH.hand ve 12 m = výška výhozu fyziky (M-3), převod výhozu není potřeba.
// Klidový sklon AIM_SHOT.pitch −8° (kamera mírně zespodu, za vlaštovkou nebe; bible 05 kap. 9.2).
export const REST = {
  width: 16,
  narrow: 7,
  hand: 0.5,
  handPx: 27,
  push: 0.06,
  fov: 20,
  pitch: AIM_SHOT.pitch,
  k: 640 / PPM / 16,
};
export const HAND = LAUNCH.hand;
export const aimWidth = (cssWidth = 640) =>
  Math.max(REST.narrow, Math.min(REST.width, (REST.hand * cssWidth) / REST.handPx));
// Promítnutí bodu kamerou {position,target,fov} (up = +y) do logických px 640×360. Čisté, stejné jako THREE.PerspectiveCamera.lookAt.
export function project(cam, [x, y, z], aspect = 16 / 9) {
  const [ex, ey, ez] = cam.position,
    f = cam.target.map((v, i) => v - cam.position[i]),
    l = Math.hypot(...f),
    F = f.map(v => v / l),
    h = Math.hypot(F[0], F[2]),
    R = [-F[2] / h, 0, F[0] / h];
  const U = [R[1] * F[2] - R[2] * F[1], R[2] * F[0] - R[0] * F[2], R[0] * F[1] - R[1] * F[0]],
    d = [x - ex, y - ey, z - ez],
    dot = a => a[0] * d[0] + a[1] * d[1] + a[2] * d[2],
    t = Math.tan((cam.fov * Math.PI) / 360),
    depth = dot(F);
  return [320 + (dot(R) / (depth * t * aspect)) * 320, 180 - (dot(U) / (depth * t)) * 180];
}
// Kamera v klidu (Dílna, míření): follow + sideCamera jako za letu se šířkou width (REST.width); sklon posune ruku hand,
// proto se kamera (pozice i cíl) dorovná tak, aby ruka padla přesně na (148, 258). Vrací {cx,cy,width,height,lift,position,target,dist,fov}.
export function restCamera(
  aspect = 16 / 9,
  width = REST.width,
  { hand = HAND, pitch = REST.pitch } = {},
) {
  const v = follow(hand.x, hand.y, { width, aspect }),
    c = { ...v, ...sideCamera(v, REST.fov, pitch), fov: REST.fov };
  for (let i = 0; i < 6; i++) {
    const [sx, sy] = project(c, [hand.x, hand.y, hand.z], aspect),
      dx = ((sx - 148) / 640) * c.width,
      dy = ((258 - sy) / 360) * c.height;
    c.cx += dx;
    c.cy += dy;
    c.position = [c.position[0] + dx, c.position[1] + dy, c.position[2]];
    c.target = [c.target[0] + dx, c.target[1] + dy, c.target[2]];
  }
  return c;
}
const m = px => px / PPM;
// Dítě (models/kid-rig.poseKid): dýchá při míření (bob), při nabíjení couvne (back) a zakloní se (lean), po hodu mává (arm, rad).
// Reduced motion: anim = 0, takže bez dýchání. phase: 'rest' klid (Dílna), 'aim' míření, 'charge' nabíjení, 'throw' výhoz (švih ruky,
// swing 0→1 za KID_THROW s od puštění, since = čas letu f.t), 'wave' mávání; rest = klidový stav scény (Dílna, míření), state = visual.state.
export const KID_THROW = 0.3;
export function kidPose({
  charge = 0,
  thrown = false,
  t = 0,
  reduced = false,
  rest = !thrown,
  state = 'aim',
  since = 0,
} = {}) {
  const env = reduced ? 0 : t,
    bob = thrown ? 0 : m(Math.sin(env * 2.5)),
    back = m(charge * 3),
    arm = thrown ? 1.25 - Math.sin(env * 9) * 0.45 : null;
  const phase = rest
      ? charge > 0
        ? 'charge'
        : state === 'workshop'
          ? 'rest'
          : 'aim'
      : since < KID_THROW
        ? 'throw'
        : 'wave',
    swing =
      phase === 'throw' ? Math.max(0, Math.min(1, since / KID_THROW)) : phase === 'wave' ? 1 : 0;
  return { phase, swing, bob, back, lean: charge * 0.18, arm, charge };
}
// Vlaštovka: rotace z pružiny fx.rot.x (nebo flightAngle), −charge·0,25 (záklon nosu), flutter šumem, squash & stretch fx.stretch.x
// (bez fx −charge·0,2), stažení o charge·8 px a chvění nad 90 % nabití; v klidu se vznáší (fbm). Za letu charge = 0 jako ve 2D.
// anim = čas prostředí (reduced → 0), clock = reálné hodiny (chvění). size = délka vlaštovky / 7,75 m: posuny v ruce úměrně její velikosti
// (vlaštovka v ruce 0,5 m se stáhne o půl délky jako dřív 7,75 m). Vrací angle (rotation.z), squash [podél nosu, kolmo], dx, dy v m.
export function planePose({
  f = null,
  fx = null,
  charge = 0,
  anim = 0,
  clock = anim,
  reduced = false,
  size = 1,
} = {}) {
  charge = f ? 0 : charge;
  const tremble = charge > 0.9 && !reduced ? noise1(clock * 40, 6) * 1.5 : 0,
    lift = f ? 0 : fbm(anim * 0.5, 8) * 2 + tremble;
  const stretch = fx ? fx.stretch.x : -charge * 0.2,
    flutter = f && !f.landed ? noise1(anim * 3, 4) * 0.05 : noise1(anim * 0.7, 4) * 0.04;
  const a2d = (fx?.rotReady ? fx.rot.x : flightAngle(f)) - charge * 0.25 + flutter;
  return {
    angle: -a2d,
    squash: [1 + stretch, 1 - stretch * 0.6],
    dx: -m(charge * 8) * size,
    dy: -m(lift) * size,
    stretch,
  };
}
