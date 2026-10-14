import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SHADOW_LOOK,SHADOW_STRENGTH,shadowLight,projectToGround,cardFade,planeFade,aoAt,MIN_ELEVATION} from '../src/render3d/paper-shadow.js';
import {moodAt,PAPER_KEYS} from '../src/render3d/mood.js';
import {SCREEN_METERS} from '../src/scenes.js';

// Stíny Papírového města „na zem“ (research/design/08-stiny.md S1, rozhodnutí 14. 10.): směr ze slunce za městem, síla po čtvrtích, kontakt u paty.
const at=place=>moodAt((place+.5)*SCREEN_METERS,0,{style:'papir'});

test('projekce na zem: bod leží na y = 0, posun proti směru ke světlu úměrný výšce, bod na zemi se nehne',()=>{
 for(const place of [0,1,5,9,13]){const {dir:L}=shadowLight(at(place));
  for(const p of [[10,0,-20],[3,12,-100],[-40,45,-357],[0,80,0]]){const q=projectToGround(p,L),t=p[1]/L[1];
   assert.equal(q[1],0);assert.ok(Math.abs(q[0]-(p[0]-L[0]*t))<1e-9&&Math.abs(q[2]-(p[2]-L[2]*t))<1e-9);
   if(!p[1])assert.deepEqual(q,p);}}
});

test('čtvrť 1 ráno: slunce vpravo za městem → stíny doleva (x < 0) a ke kameře (z > 0), směr jednotkový',()=>{
 for(const place of [0,1,2,3]){const {dir}=shadowLight(at(place)),q=projectToGround([0,20,-50],dir);
  assert.ok(Math.abs(Math.hypot(...dir)-1)<1e-9);assert.ok(dir[2]<0,'světlo zezadu');assert.ok(q[0]<0,'doleva');assert.ok(q[2]>-50,'dopředu');}
 // ráno = směr z prototypu stiny.js (LIGHT = [.62,.5,−.6] normalizovaný)
 const {dir}=shadowLight(PAPER_KEYS[1]),l=Math.hypot(.62,.5,.6);[.62/l,.5/l,-.6/l].forEach((v,i)=>assert.ok(Math.abs(dir[i]-v)<1e-9));
});

test('síla po čtvrtích: ráno 0,62, Zlatá pole výraznější 0,8 a delší (nižší slunce), večer 0,3; přechod mezi čtvrtěmi plynulý',()=>{
 assert.equal(SHADOW_LOOK.k,SHADOW_STRENGTH[0]);
 const k=p=>shadowLight(at(p)).k,len=p=>{const {dir}=shadowLight(at(p));return Math.hypot(dir[0],dir[2])/dir[1];};
 assert.equal(k(1),.62);assert.equal(k(9),.8);assert.equal(k(13),.3);
 assert.ok(len(9)>len(1)*1.3,'Zlatá pole: delší stíny');assert.ok(shadowLight(at(9)).dir[1]>=0);
 let prev=k(0);for(let x=0;x<16*SCREEN_METERS;x+=5){const v=shadowLight(moodAt(x,0,{style:'papir'})).k;assert.ok(Math.abs(v-prev)<.05,`skok síly v ${x} m`);prev=v;}
 // nízké slunce nemá elevaci pod mez (úsvit)
 assert.ok(shadowLight(PAPER_KEYS[16]).dir[1]>0);
 const flat=shadowLight({light:[.62,.5,.6],sun:{x:.8,y:.99,alpha:1}});assert.ok(flat.dir[1]>0);
 assert.ok(Math.abs(flat.dir[1]-MIN_ELEVATION/Math.hypot(.62,MIN_ELEVATION,.6))<1e-9);
});

test('kontakt: síla stínu klesá s výškou vrhače (u paty 1, nad 45 m 0,55), vlaštovka exp(−h/70), pata karet tmavší jen dole',()=>{
 let a=2;for(let h=0;h<=80;h+=1){const v=cardFade(h);assert.ok(v<=a+1e-12);a=v;}
 assert.equal(cardFade(0),1);assert.ok(Math.abs(cardFade(45)-.55)<1e-12);assert.ok(Math.abs(cardFade(200)-.55)<1e-12);
 assert.equal(planeFade(0),1);assert.ok(Math.abs(planeFade(70)-Math.exp(-1))<1e-12);assert.ok(planeFade(40)>planeFade(60));
 assert.ok(Math.abs(aoAt('near',0)-.8)<1e-12);assert.equal(aoAt('near',1.4),1);assert.equal(aoAt('mid',2.8),1);assert.ok(aoAt('far',3)<1);assert.equal(aoAt('ground',0),1);
 assert.deepEqual([...SHADOW_LOOK.tint],[93,100,168]);
});
