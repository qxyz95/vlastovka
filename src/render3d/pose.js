// Pózy dítěte a vlaštovky (čisté, bez three.js a DOM). Vlastní R3. Vzorce 1:1 z render.js (dítě a vlaštovka se tam kreslí inline),
// převedené do 3D: úhly v radiánech podle three.js (osa y nahoru, kladný úhel = proti směru hodin = nos nahoru), posuny v m přes 2,1 px/m.
// Smlouva: kamera v klidu restCamera() promítne HAND (vlaštovka v ruce) na view(null) = (148, 258) ±2 px; šipka míření tak vychází z vlaštovky.
import {PIXELS_PER_METER as PPM} from '../scenes.js';
import {noise1,fbm} from '../motion.js';
import {flightAngle} from '../juice.js';
import {PLANE_OFFSET,follow,sideCamera} from './geometry.js';
// Klidový záběr Dílny: k = 1,25 (šířka 640/2,1/1,25 m), aby byla vidět celá dílna z cityChunk(0) (x 20–44 m) i dítě.
// Ve 2D je vlaštovka v klidu 42 px nad zemí → y = 42/360 výšky záběru = 16 m. Dítě proto stojí na střeše přístavku dílny.
export const REST={k:1.25,width:640/PPM/1.25,fov:20,pitch:6};
export const HAND={x:PLANE_OFFSET,y:42/360*REST.width*9/16,z:0};
// Promítnutí bodu kamerou {position,target,fov} (up = +y) do logických px 640×360. Čisté, stejné jako THREE.PerspectiveCamera.lookAt.
export function project(cam,[x,y,z],aspect=16/9){
 const [ex,ey,ez]=cam.position,f=cam.target.map((v,i)=>v-cam.position[i]),l=Math.hypot(...f),F=f.map(v=>v/l),h=Math.hypot(F[0],F[2]),R=[-F[2]/h,0,F[0]/h];
 const U=[R[1]*F[2]-R[2]*F[1],R[2]*F[0]-R[0]*F[2],R[0]*F[1]-R[1]*F[0]],d=[x-ex,y-ey,z-ez],dot=a=>a[0]*d[0]+a[1]*d[1]+a[2]*d[2],t=Math.tan(cam.fov*Math.PI/360),depth=dot(F);
 return [320+dot(R)/(depth*t*aspect)*320,180-dot(U)/(depth*t)*180];
}
// Kamera v klidu (Dílna, míření): follow + sideCamera jako za letu se šířkou REST.width; sklon 6° posune HAND o ~2 px,
// proto se kamera (pozice i cíl) dorovná tak, aby HAND padl přesně na (148, 258). Vrací {cx,cy,width,height,lift,position,target,dist,fov}.
export function restCamera(aspect=16/9){
 const v=follow(HAND.x,HAND.y,{width:REST.width,aspect}),c={...v,...sideCamera(v,REST.fov,REST.pitch),fov:REST.fov};
 for(let i=0;i<4;i++){const [sx,sy]=project(c,[HAND.x,HAND.y,HAND.z],aspect),dx=(sx-148)/640*c.width,dy=(258-sy)/360*c.height;
  c.cx+=dx;c.cy+=dy;c.position=[c.position[0]+dx,c.position[1]+dy,c.position[2]];c.target=[c.target[0]+dx,c.target[1]+dy,c.target[2]];}
 return c;
}
const m=px=>px/PPM;
// Dítě: dýchá při míření (ve 2D ±1 px, tady bez zaokrouhlení), při nabíjení couvne (2D: kx − charge·3 px) a zakloní se (3D navíc),
// po hodu mává (2D: rotate(−1,25 + sin(9t)·0,45) → three.js rotation.z s opačným znaménkem). Reduced motion: anim = 0, takže bez dýchání.
// Neon dílny (2D: blikne, když noise1(.6t,7) > .45 a noise1(30t,9) > 0) a dýchající světlo okna (.7 + .3·sin 1,6t) jsou tu taky.
export function kidPose({charge=0,thrown=false,t=0,reduced=false}={}){
 const env=reduced?0:t,bob=thrown?0:m(Math.sin(env*2.5)),back=m(charge*3),arm=thrown?1.25-Math.sin(env*9)*.45:null;
 return {pose:thrown?'wave':charge>0?'charge':'hold',bob,back,lean:charge*.18,arm,charge,
  flicker:noise1(env*.6,7)>.45&&noise1(env*30,9)>0,glow:.7+.3*Math.sin(env*1.6)};
}
// Vlaštovka: rotace z pružiny fx.rot.x (nebo flightAngle), −charge·0,25 (záklon nosu), flutter šumem, squash & stretch fx.stretch.x
// (bez fx −charge·0,2), stažení o charge·8 px a chvění nad 90 % nabití; v klidu se vznáší (fbm). Za letu charge = 0 jako ve 2D.
// anim = čas prostředí (reduced → 0), clock = reálné hodiny (chvění). Vrací angle (rotation.z), squash [podél nosu, kolmo], dx, dy v m.
export function planePose({f=null,fx=null,charge=0,anim=0,clock=anim,reduced=false}={}){
 charge=f?0:charge;
 const tremble=charge>.9&&!reduced?noise1(clock*40,6)*1.5:0,lift=f?0:fbm(anim*.5,8)*2+tremble;
 const stretch=fx?fx.stretch.x:-charge*.2,flutter=f&&!f.landed?noise1(anim*3,4)*.05:noise1(anim*.7,4)*.04;
 const a2d=(fx?.rotReady?fx.rot.x:flightAngle(f))-charge*.25+flutter;
 return {angle:-a2d,squash:[1+stretch,1-stretch*.6],dx:-m(charge*8),dy:-m(lift),stretch};
}
