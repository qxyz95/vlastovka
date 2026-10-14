// Dítě, hrdina startu (karta H1 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.4): oblá papírová figurka C 1,2 m
// (research/plan-hratelnost/03-art.md kap. 1.3–1.8, dávka H2; předloha VAR.CH / VAR.C1 a POSE v research/design/img/hratelnost/hratelnost.mjs).
// Tuhé „soustružené“ díly (parts.lathe) s 6–16 stěnami na kostře bez skinningu (kap. 1.4): kořen v chodidlech, trup, hlava, čepice, ruce, nohy.
// Souřadnice: x = 0 střed chodidel, y = 0 podlaha, dítě hledí na +x (směr hodu), kamera na +z. T = vzdálenější ruka (z −), hází; F = blízká, ukazuje.
// Čisté: díly, kostra a pózy sdílí katalog (statické pózy) i hra (models/kid-rig.js skládá pózu za snímek do předem alokovaného bufferu).
import {palette,PAPER_TOKENS as T} from '../palette.js';
import {PERSON} from './person.js';
import {LOD_LAYER} from './scale.js';
import {cutout,lathe,plateX} from './parts.js';

// Délka ruky od ramene po střed dlaně je pevná (kap. 1.5), ruka se nenatahuje.
export const ARM_LEN=.55;
// Kostra (kap. 1.4): kloub v rodiči. Nohy a ruce: s = +1 blízko kamery (+z), −1 daleko.
export const RIG=Object.freeze({leg:Object.freeze([0,.46,.08]),shoe:Object.freeze([0,-.42,0]),trunk:Object.freeze([0,.44,0]),head:Object.freeze([.01,.47,0]),cap:Object.freeze([-.01,.255,0]),
 shoulder:Object.freeze([0,.41,.2]),hand:Object.freeze([0,-ARM_LEN,0])});
export const JOINTS=Object.freeze(['legR','shoeR','legL','shoeL','coat','head','cap','armT','handT','armF','handF']);
export const JOINT=Object.freeze(Object.fromEntries(JOINTS.map((j,i)=>[j,i])));
// Barvy z tokenů místa odhodu PAPIR.workshop (bible 9.4): pláštěnka D1.near[1], nohy D1.window, kůže life.people.skin[0], čepice kraft s rajčatovým
// proužkem, vlasy, boty a oči pencil700.
export const kidColors=()=>{const W=palette('papir').workshop;return {coat:W.shirt,legs:W.legs,skin:W.skin,hair:T.pencil700,cap:W.visor,capBand:W.capBand,shoe:T.pencil700,eye:T.pencil700};};

// Díly (kap. 1.3, tab.): [part, kloub, barva, geometrie]. LOD H 630 △, LOD 1 130 △ (bez dlaní, bot a očí).
const lim=(rings,n,o)=>()=>lathe(rings,n,o);
const H={leg:lim([[-.41,.055,.055],[-.2,.062,.062],[0,.065,.065]],8),shoe:lim([[-.06,.1,.06,.04],[-.02,.1,.065,.04],[.02,.07,.05,.02]],6,{top:true,bot:true}),
 coat:lim([[-.06,.15,.26],[.1,.15,.25],[.3,.13,.21],[.46,.11,.16],[.53,0,0]],16,{bot:true}),
 head:lim([[0,0,0],[.035,.12,.11],[.09,.16,.15],[.155,.17,.16],[.22,.16,.15],[.275,.12,.11],[.31,0,0]],16),
 hair:lim([[.1,.11,.15,-.07],[.22,.12,.15,-.06],[.31,.07,.09,-.04]],10),
 cap:lim([[-.045,.175,.165],[.025,.16,.15],[.115,.1,.09],[.195,0,0]],12),band:lim([[-.06,.18,.17],[-.015,.18,.17]],12),
 arm:lim([[-.5,.045,.045],[-.25,.05,.05],[0,.055,.055]],8),hand:lim([[-.06,0,0],[-.01,.055,.05],[.06,0,0]],6)};
const L1={leg:lim([[-.47,.06,.06],[0,.07,.07]],4),coat:lim([[-.06,.15,.26],[.46,.11,.16],[.53,0,0]],8,{bot:true}),
 head:lim([[0,0,0],[.06,.15,.14],[.2,.165,.155],[.31,0,0]],8),hair:lim([[.12,.11,.15,-.07],[.3,.08,.1,-.05]],6),
 cap:lim([[-.045,.175,.165],[.195,0,0]],8),band:lim([[-.06,.18,.17],[-.015,.18,.17]],8),arm:lim([[-.55,.05,.05],[0,.055,.055]],4)};
const partsOf=lod=>{const G=lod?L1:H,c=kidColors(),out=[['legs','legR',c.legs,G.leg],['legs','legL',c.legs,G.leg]];
 if(!lod)out.push(['shoe','shoeR',c.shoe,G.shoe],['shoe','shoeL',c.shoe,G.shoe]);
 out.push(['coat','coat',c.coat,G.coat],['head','head',c.skin,G.head],['hair','head',c.hair,G.hair]);
 if(!lod)out.push(['eye','head',c.eye,()=>plateX(.165,.15,.055,.02)],['eye','head',c.eye,()=>plateX(.165,.15,-.055,.02)]);
 out.push(['cap','cap',c.cap,G.cap],['capBand','cap',c.capBand,G.band],['arm','armT',c.coat,G.arm],['arm','armF',c.coat,G.arm]);
 if(!lod)out.push(['hand','handT',c.skin,G.hand],['hand','handF',c.skin,G.hand]);
 return out.map(([part,joint,color,geo])=>({part,joint:JOINT[joint],color,...geo()}));};
// Sloučené vrcholy LOD (pořadí dílů pevné): p, n (Float32Array), kloub a barva na vrchol, rozsahy dílů.
export const KID_MESH=Object.freeze([0,1].map(lod=>{const parts=partsOf(lod),count=parts.reduce((s,q)=>s+q.p.length/3,0),p=new Float32Array(count*3),n=new Float32Array(count*3),joint=new Uint8Array(count),color=[];
 let o=0;const ranges=parts.map(q=>{const k=q.p.length/3;p.set(q.p,o*3);n.set(q.n,o*3);joint.fill(q.joint,o,o+k);for(let i=0;i<k;i++)color.push(q.color);o+=k;return Object.freeze({part:q.part,joint:q.joint,color:q.color,start:o-k,count:k});});
 return Object.freeze({count,p,n,joint,color:Object.freeze(color),parts:Object.freeze(ranges)});}));

// ── Kostra: matice 3 × 3 (po řádcích) + posun na kloub, J = Float64Array(JOINTS.length × 12). Rotace jako v náčrtu: yaw kolem y (+x ke kameře),
// rz kolem z (záklon, švih ruky v rovině boku), rx kolem x (odtažení do boku).
const S=new Float64Array(9*3);
const setRot=(o,axis,a)=>{const c=Math.cos(a),s=Math.sin(a);o.fill(0,0,9);
 if(axis===1){o[0]=c;o[2]=-s;o[4]=1;o[6]=s;o[8]=c;}else if(axis===2){o[0]=c;o[1]=-s;o[3]=s;o[4]=c;o[8]=1;}else{o[0]=1;o[4]=c;o[5]=-s;o[7]=s;o[8]=c;}return o;};
const R1=S.subarray(0,9),R2=S.subarray(9,18),R3=S.subarray(18,27);
// O(9) = A(9) · B(9); O nesmí být A ani B.
const mul=(A,B,O)=>{for(let r=0;r<3;r++)for(let c=0;c<3;c++)O[r*3+c]=A[r*3]*B[c]+A[r*3+1]*B[3+c]+A[r*3+2]*B[6+c];return O;};
const ROOT=new Float64Array(12),LOC=new Float64Array(9);
// Kloub i: R = Rp · Rl, t = tp + Rp · pivot (rodič p jako 12 čísel v poli P od offsetu po).
function child(J,i,P,po,pv,Rl){const o=i*12;for(let r=0;r<3;r++){for(let c=0;c<3;c++)J[o+r*3+c]=P[po+r*3]*Rl[c]+P[po+r*3+1]*Rl[3+c]+P[po+r*3+2]*Rl[6+c];
 J[o+9+r]=P[po+9+r]+P[po+r*3]*pv[0]+P[po+r*3+1]*pv[1]+P[po+r*3+2]*pv[2];}}
const I3=Float64Array.of(1,0,0,0,1,0,0,0,1),PV=new Float64Array(3),pv=(x,y,z)=>{PV[0]=x;PV[1]=y;PV[2]=z;return PV;};
// Úhly pózy A = {yaw, lean (+ záklon), back (m), drop (m), bob (m, trup), head [yaw, kývnutí], armT/armF [rz, rx], legR, legL}; root = [x, y, z] chodidel.
export function kidJoints(A,J=new Float64Array(JOINTS.length*12),root=[0,0,0]){
 mul(setRot(R1,1,A.yaw),setRot(R2,2,A.lean??0),ROOT);ROOT[9]=root[0]-(A.back??0);ROOT[10]=root[1]+KID_GROUND-(A.drop??0);ROOT[11]=root[2];
 leg(J,1,JOINT.legR,JOINT.shoeR,A.legR);leg(J,-1,JOINT.legL,JOINT.shoeL,A.legL);
 const tr=JOINT.coat;child(J,tr,ROOT,0,pv(RIG.trunk[0],RIG.trunk[1]+(A.bob??0),RIG.trunk[2]),I3);
 child(J,JOINT.head,J,tr*12,RIG.head,mul(setRot(R1,1,A.head[0]),setRot(R2,2,A.head[1]),LOC));child(J,JOINT.cap,J,JOINT.head*12,RIG.cap,I3);
 arm(J,-1,JOINT.armT,JOINT.handT,A.armT[0],A.armT[1]);arm(J,1,JOINT.armF,JOINT.handF,A.armF[0],A.armF[1]);
 return J;
}
function leg(J,s,i,shoe,a){child(J,i,ROOT,0,pv(RIG.leg[0],RIG.leg[1],s*RIG.leg[2]),setRot(R1,2,a));child(J,shoe,J,i*12,RIG.shoe,I3);}
function arm(J,s,i,hand,a,b){child(J,i,J,JOINT.coat*12,pv(RIG.shoulder[0],RIG.shoulder[1],s*RIG.shoulder[2]),mul(setRot(R1,3,-b*s),setRot(R2,2,a),LOC));child(J,hand,J,i*12,RIG.hand,I3);}
// Vrcholy LOD v póze (J z kidJoints) do out (polohy) a outN (normály) od vrcholu `at` (bez alokace).
export function kidVertices(lod,J,out,outN,at=0){
 const M=KID_MESH[lod],P=M.p,N=M.n,jn=M.joint;
 for(let v=0;v<M.count;v++){const j=jn[v]*12,i=v*3,o=(at+v)*3,x=P[i],y=P[i+1],z=P[i+2],a=N[i],b=N[i+1],c=N[i+2];
  out[o]=J[j]*x+J[j+1]*y+J[j+2]*z+J[j+9];out[o+1]=J[j+3]*x+J[j+4]*y+J[j+5]*z+J[j+10];out[o+2]=J[j+6]*x+J[j+7]*y+J[j+8]*z+J[j+11];
  outN[o]=J[j]*a+J[j+1]*b+J[j+2]*c;outN[o+1]=J[j+3]*a+J[j+4]*b+J[j+5]*c;outN[o+2]=J[j+6]*a+J[j+7]*b+J[j+8]*c;}
}
// Poloha kloubu ve světě (posun J) do pole o.
export const jointAt=(J,j,o=[0,0,0])=>{o[0]=J[j*12+9];o[1]=J[j*12+10];o[2]=J[j*12+11];return o;};

// Ruka na cíl (kap. 1.5): d = cíl − rameno v souřadnicích trupu, dlaň = rx(−b·s) · rz(a) · [0, −L, 0] (T: s = −1). Směr ruky míří přesně na cíl
// (rz z atan2 a odtažení rx), ze dvou řešení to s rx blíž k póze b; délka zůstává pevná, takže chyba dlaně = |d| − L. Zapíše [a, b] do out.
const wrap=x=>Math.atan2(Math.sin(x),Math.cos(x));
export function armToward(dx,dy,dz,b,s=-1,out=[0,0]){
 const l=Math.hypot(dx,dy,dz)||1,ux=dx/l,uy=dy/l,uz=dz/l,r=Math.hypot(uy,uz),b1=-s*Math.atan2(uz,uy),b2=-s*Math.atan2(-uz,-uy);
 if(Math.abs(wrap(b1-b))<=Math.abs(wrap(b2-b))){out[0]=Math.atan2(ux,-r);out[1]=b1;}else{out[0]=Math.atan2(ux,r);out[1]=b2;}
 return out;
}

// Pózy (kap. 1.7, úhly v rad). charge: záklon a couvnutí dává za hry pose.kidPose, tady jen statická ukázka z náčrtu.
const P=(o)=>Object.freeze({lean:0,back:0,drop:0,bob:0,...o,head:Object.freeze(o.head),armT:Object.freeze(o.armT),armF:Object.freeze(o.armF)});
// Výška ruky T nad chodidly v míření (M-3: ruka 12 m, podlaha pavlače 10,6 m).
export const AIM_HAND=1.4;
// Spodek bot pod kořenem v póze míření: kořen stojí o KID_GROUND výš, aby boty stály na podlaze.
export const KID_GROUND=(()=>{const A={yaw:.55,head:[0,0],armT:[0,0],armF:[0,0],legR:.16,legL:-.12},M=KID_MESH[0];let g=0;
 const J=new Float64Array(JOINTS.length*12);mul(setRot(R1,1,A.yaw),setRot(R2,2,0),ROOT);ROOT[9]=ROOT[10]=ROOT[11]=0;
 leg(J,1,JOINT.legR,JOINT.shoeR,A.legR);leg(J,-1,JOINT.legL,JOINT.shoeL,A.legL);
 for(let v=0;v<M.count;v++){const j=M.joint[v];if(j>JOINT.shoeL)continue;const k=j*12;g=Math.min(g,J[k+3]*M.p[v*3]+J[k+4]*M.p[v*3+1]+J[k+5]*M.p[v*3+2]+J[k+10]);}
 return -g;})();
// rz ruky T v míření: dlaň přesně ve výšce AIM_HAND nad podlahou (náčrt 2,71 nedosáhne, ruka 0,55 m je pevná).
const AIM_RX=.1,AIM_ARM=(()=>{const y=AIM_HAND-KID_GROUND-RIG.trunk[1]-RIG.shoulder[1],c=-y/(ARM_LEN*Math.cos(AIM_RX));return Math.acos(Math.max(-1,Math.min(1,c)));})();
export const KID_POSES=Object.freeze({
 idle:P({yaw:.75,head:[.25,0],armT:[1.25,-.15],armF:[1.2,-.25],legR:0,legL:0}),
 aim:P({yaw:.55,head:[-.1,.1],armT:[AIM_ARM,AIM_RX],armF:[1.95,.05],legR:.16,legL:-.12}),
 charge:P({yaw:.55,lean:.08,back:.07,head:[-.1,.14],armT:[-2.5,.15],armF:[1.65,.05],legR:.22,legL:-.2}),
 throw:P({yaw:.25,lean:-.07,head:[0,-.05],armT:[1.9,.1],armF:[-.6,.15],legR:.38,legL:-.28}),
 wave:P({yaw:.9,head:[-.35,.1],armT:[.1,.12],armF:[2.75,.55],legR:0,legL:0}),
 sit:P({yaw:.6,drop:.36,head:[.3,0],armT:[-.45,.2],armF:[.55,.2],legR:1.5,legL:1.45}),
 desk:P({yaw:.5,lean:-.1,head:[0,-.4],armT:[1.1,.05],armF:[1.25,.05],legR:0,legL:0})});
export const POSES=Object.freeze(Object.keys(KID_POSES));
// Míry (bible 9.4): výška 1,2 m (person × 0,7), hlava ⌀ 0,34 m; nohy 0,46 m; vršek čepice; dlaň ruky T v míření od chodidel.
const AIM_J=kidJoints(KID_POSES.aim),AIM_PALM=Object.freeze(jointAt(AIM_J,JOINT.handT));
export const KID=Object.freeze({h:PERSON.h*PERSON.child,head:.17,legs:RIG.leg[1],ground:KID_GROUND,arm:ARM_LEN,aimHand:AIM_HAND,aimPalm:AIM_PALM,
 cap:KID_GROUND+RIG.trunk[1]+RIG.head[1]+RIG.cap[1]+.195});

// Karty modelu (katalog): jeden 'mesh' na díl, póza statická; spodek posunutý na y = 0 (sed sedí na podlaze).
function build(p,lod){
 const J=kidJoints(KID_POSES[p.pose]),M=KID_MESH[lod],pos=new Float32Array(M.count*3),nor=new Float32Array(M.count*3);kidVertices(lod,J,pos,nor);
 let y0=Infinity;for(let i=1;i<pos.length;i+=3)y0=Math.min(y0,pos[i]);if(p.pose==='aim')y0=0;
 return M.parts.map(q=>{const a=q.start*3,b=a+q.count*3,P=Array.from(pos.subarray(a,b),(v,i)=>i%3===1?v-y0:v),N=Array.from(nor.subarray(a,b));
  const ax=[0,1,2].map(k=>{let lo=Infinity,hi=-Infinity;for(let i=k;i<P.length;i+=3){lo=Math.min(lo,P[i]);hi=Math.max(hi,P[i]);}return [lo,hi];});
  return {shape:'mesh',x:ax[0][0],w:ax[0][1]-ax[0][0],y:ax[1][0],h:ax[1][1]-ax[1][0],z:(ax[2][0]+ax[2][1])/2,d:Math.max(1e-3,ax[2][1]-ax[2][0]),p:P,n:N,color:q.color,part:q.part};});
}
// Stínový proxy (11 kap. 4.2: ≤ 4 △): obrys nohy–pláštěnka–čepice, 5 bodů = 3 △, vepsaný do obalu pózy (sed nízký).
const shadow=p=>{const B=build(p,0).reduce((o,c)=>(o[0]=Math.min(o[0],c.x),o[1]=Math.max(o[1],c.x+c.w),o[2]=Math.max(o[2],c.y+c.h),o),[Infinity,-Infinity,0]),
 X=x=>Math.max(B[0],Math.min(B[1],x)),k=B[2]/KID.cap;
 return [cutout([[X(-.2),0],[X(.2),0],[X(.26),.45*k],[X(0),B[2]],[X(-.26),.45*k]],{front:-.01,color:kidColors().coat,part:'shadow'})];};
const Pp=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'kid',name:'Dítě (hrdina startu)',district:0,layers:LOD_LAYER,hero:true,
 prototype:'Papírový model z mnoha dílků (papercraft, Tearaway): oblé dítě v pláštěnce s čepicí-kornoutem z kraftu, které vlaštovky skládá a hází.',
 purpose:'Hráčova postava na pavlači místa odhodu: zblízka při každém míření (64–96 px), v úvodu a u stolu Dílny; LOD 1 pod 44 px (úvod na telefonu, oddálení).',
 params:Object.freeze({pose:Pp(POSES,'aim')}),
 // Výchozí póza míření (obal z modelu, m).
 size:Object.freeze({w:.62,h:1.42,d:.6}),
 // Strop 03-art kap. 1.8: [760 LOD H, 160 LOD 1, 0] (630 / 130 + 20 % rezerva).
 tris:Object.freeze([760,160,0]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),()=>[]]),shadow
});
