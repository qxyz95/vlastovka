// Dítě H1 a praporek větru H5 ve hře (S4, čisté): jedna dynamická geometrie = 1 draw call (11 kap. 4.2: dítě „tělo + ruka → 1“).
// Pózu skládá CPU do předem alokovaného pole (žádná alokace za snímek): tělo (póza míření z modelu kid) se zakloní kolem chodidel a couvne,
// horní polovina dýchá, přední ruka je proužek od ramene k dlani podle fáze z pose.kidPose, praporek vlaje „on twos“ (reduced motion stojí, S-7).
// kidRig() → {count, positions, normals, colors, base, ranges, at}; poseKid(rig, kid, hand, {t, reduced}, out = rig.positions) zapíše polohy (svět, m).
import {buildModel,launchFlag} from './index.js';
import {KID} from './kid.js';
import {DIORAMA} from './launch-site.js';
import {cardVertices} from '../paper-cards.js';
import {onTwos} from '../life.js';

// Chodidla dítěte ve světě (launch-site DIORAMA): ruka v póze míření KID.hand.aim leží přesně v LAUNCH.hand (12 m).
export const KID_AT=DIORAMA.find(o=>o.id==='kid').at;
// pose.kidPose počítá posuny (couvnutí, dýchání) v m staré Dílny s dítětem 47 px × 0,25 m = 11,75 m; dítě H1 má 1,2 m.
export const KID_SCALE=KID.h/11.75;
// Přední ruka (jako model kid: proužek 0,1 m v čele 0,075, dlaň ⌀ 0,11 m v 0,085), mávání: délka ruky od ramene; praporek: rozkmit a rychlost.
export const ARM=Object.freeze({w:.1,front:.075,hand:.055,n:8,handFront:.085,wave:.62});
export const FLAG=Object.freeze({amp:.07,speed:7,wave:2.2});
const isFront=c=>c.part==='hand'||(c.part==='arm'&&c.z>0);

export function kidRig(){
 const cards=buildModel('kid',0,{pose:'aim'}),body=cardVertices(cards.filter(c=>!isFront(c))),flag=cardVertices(launchFlag());
 const arm=cards.find(c=>c.part==='arm'&&c.z>0).color,skin=cards.find(c=>c.part==='hand').color;
 const nb=body.p.length/3,na=6,nh=(ARM.n-2)*3,nf=flag.p.length/3,count=nb+na+nh+nf,positions=new Float32Array(count*3),normals=new Float32Array(count*3),base=new Float32Array(count*3);
 base.set(body.p,0);base.set(flag.p,(nb+na+nh)*3);normals.set(body.n,0);for(let i=nb;i<nb+na+nh;i++)normals[i*3+2]=1;normals.set(flag.n,(nb+na+nh)*3);
 const colors=[...body.c,...Array(na).fill(arm),...Array(nh).fill(skin),...flag.c];
 // kořen praporku (konec trámu) a jeho délka po větru: nejlevější a nejpravější bod
 let fx0=Infinity,fx1=-Infinity;for(let i=0;i<nf;i++){const x=flag.p[i*3];fx0=Math.min(fx0,x);fx1=Math.max(fx1,x);}
 const rig={count,positions,normals,colors,base,at:KID_AT,ranges:{body:[0,nb],arm:[nb,nb+na],hand:[nb+na,nb+na+nh],flag:[nb+na+nh,count]},flag:{x0:fx0,len:fx1-fx0},tmp:new Float64Array(2),last:new Float64Array(4),
  ring:Float64Array.from({length:ARM.n*2},(_,i)=>{const a=Math.PI/2+(i>>1)/ARM.n*Math.PI*2;return i&1?Math.sin(a)*ARM.hand:Math.cos(a)*ARM.hand;})};
 poseKid(rig,{phase:'aim',lean:0,back:0,bob:0});return rig;
}
// Bod těla (místní souřadnice od chodidel, y nahoru) → svět: dýchání horní poloviny, záklon kolem chodidel, couvnutí. Výsledek do rig.tmp[0..1].
function toWorld(rig,x,y,k){const t=rig.tmp,lean=k.lean??0,c=Math.cos(lean),s=Math.sin(lean),yy=y>KID.legs?y+(k.bob??0)*KID_SCALE:y;
 t[0]=KID_AT.x-(k.back??0)*KID_SCALE+x*c-yy*s;t[1]=KID_AT.y+x*s+yy*c;}
const ease=u=>u*u*(3-2*u);
const put=(out,i,x,y,z)=>{out[i]=x;out[i+1]=y;out[i+2]=z;};
// kid = plan.kid (pose.kidPose: phase, swing, lean, back, bob, arm), hand = poloha vlaštovky v ruce ve světě {x,y} (fáze klid, míření, nabíjení).
// Vrací rig.last = [rameno x, y, dlaň x, y] (svět).
export function poseKid(rig,k,hand=null,{t=0,reduced=false}={},out=rig.positions){
 const B=rig.base,[b0,b1]=rig.ranges.body,T=rig.tmp,z0=KID_AT.z;
 for(let i=b0;i<b1;i++){toWorld(rig,B[i*3],B[i*3+1],k);out[i*3]=T[0];out[i*3+1]=T[1];out[i*3+2]=z0+B[i*3+2];}
 toWorld(rig,KID.shoulder[0],KID.shoulder[1],k);const sx=T[0],sy=T[1];let hx,hy;
 if(k.phase==='wave'){const a=k.arm??1.25;hx=sx+Math.cos(a)*ARM.wave;hy=sy+Math.sin(a)*ARM.wave;}
 else if(k.phase==='throw'){const [ax,ay]=KID.hand.aim,[tx,ty]=KID.hand.throw,u=ease(k.swing??0);toWorld(rig,ax+(tx-ax)*u,ay+(ty-ay)*u,k);hx=T[0];hy=T[1];}
 else if(hand){hx=hand.x;hy=hand.y;}
 else{toWorld(rig,KID.hand.aim[0],KID.hand.aim[1],k);hx=T[0];hy=T[1];}
 // ruka: proužek (jako parts.strip, vějíř z prvního bodu: a b c, a c d), dlaň jako mnohoúhelník (paper-cards plate)
 const l=Math.hypot(hx-sx,hy-sy)||1,nx=-(hy-sy)/l*ARM.w/2,ny=(hx-sx)/l*ARM.w/2,za=z0+ARM.front,zh=z0+ARM.handFront;
 let o=rig.ranges.arm[0]*3;const C=rig.ring;
 put(out,o,sx-nx,sy-ny,za);put(out,o+3,hx-nx,hy-ny,za);put(out,o+6,hx+nx,hy+ny,za);put(out,o+9,sx-nx,sy-ny,za);put(out,o+12,hx+nx,hy+ny,za);put(out,o+15,sx+nx,sy+ny,za);o+=18;
 for(let i=1;i<ARM.n-1;i++,o+=9){put(out,o,hx+C[0],hy+C[1],zh);put(out,o+3,hx+C[i*2],hy+C[i*2+1],zh);put(out,o+6,hx+C[i*2+2],hy+C[i*2+3],zh);}
 // praporek: svislý rozkmit roste ke konci pásky (u kořene 0), vlna běží po větru; reduced motion = natočený, bez vlání
 const [f0,f1]=rig.ranges.flag,T2=reduced?0:onTwos(t);
 for(let i=f0;i<f1;i++){const x=B[i*3],u=(x-rig.flag.x0)/(rig.flag.len||1);out[i*3]=x;out[i*3+1]=B[i*3+1]+(reduced?0:FLAG.amp*u*Math.sin(T2*FLAG.speed-u*FLAG.wave));out[i*3+2]=B[i*3+2];}
 const L=rig.last;L[0]=sx;L[1]=sy;L[2]=hx;L[3]=hy;return L;
}
