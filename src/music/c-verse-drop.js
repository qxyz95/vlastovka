// C · Spider-Verse Drop (sketch): funky breakbeat / hip hop with comic-book effects. Techniques only, nothing quoted.
// Organ stabs, slap-ish 16th bass, breakbeat with ghost notes, brass stabs, scratch and glitch stutter at phrase ends; Docks dub, Horizon filmic brass.
import {ARC,rngFor,pick,euclid} from '../audio-mix.js';
import {deg,chord,near,phrase,progAt,motifBar,hum,events} from './compose.js';
const ID='C';
export const districts=[
 {name:'Violet Suburbs',bpm:96,mode:'lydian',style:'funk',verb:[.3,.1,.15,.3],echo:[0,0,0,.15],prog:[[0,1,0,1],[0,4,1,0]]},
 {name:'Moon Docks',bpm:84,mode:'aeolian',style:'dub',verb:[.6,.2,.3,.5],echo:[.35,0,.25,.45],prog:[[0,6,5,6],[0,3,0,4]]},
 {name:'Red Horizon',bpm:92,mode:'mixolydian',style:'film',verb:[.6,.15,.3,.5],echo:[0,0,0,.2],prog:[[0,6,3,0],[3,6,0,4]]},
 {name:'Neon Core',bpm:100,mode:'dorian',style:'break',verb:[.3,.1,.15,.3],echo:[0,0,0,.15],prog:[[0,3,0,3],[0,6,3,4]]}];
export function bar(i,d,{seed=1}={}){
 const c=districts[d],m=c.mode,ph=phrase(i),r=rngFor(seed,ID,d,i),pr=rngFor(seed,ID,d,'ph',ph.p),P=progAt(c.prog,seed,ID,d,ph.p),root=P[ph.pos%4],sec=ph.section,[ev,E]=events(),dub=c.style==='dub';
 const ch=near(chord(m,root,3,4),64),rot=Math.floor(pr()*4),hits=euclid(5+Math.floor(pr()*3),16,rot);
 // L0: organ stabs (funk/break), long organ (dub) or brass pad (film), sub drone.
 if(c.style==='film')for(const n of ch)E(0,3.9,n,'brass',0,.45,{a:.25,cut:1800});
 else if(dub)for(const n of ch)E(0,1,n,'organ',0,.4);
 else for(const b of [0,1.5,2.75])for(const n of ch)E(b,.22,n,'organ',0,.55);
 E(0,3.9,deg(m,root,2),'sub',0,.35);
 // L1: 16th euclidean slap bass (dub: long root and fifth).
 if(dub){E(0,1.5,deg(m,root,2),'bass',1,.9,{cut:400});E(2.5,1,deg(m,root+4,2),'bass',1,.7,{cut:400});}
 else hits.forEach((h,k)=>h&&E(k*.25,.2,pick(r,[deg(m,root,2),deg(m,root,2),deg(m,root,3),deg(m,root+4,2)]),'bass',1,hum(r,k%4?.65:.9),{cut:900,q:6,env:.04}));
 // L2: breakbeat with ghost snares, double-time hats in the Core, glitch stutter at phrase end; dub half-time.
 const glitch=ph.last&&c.style!=='dub';
 for(const b of dub?[0]:[0,1.75,2.5])E(b,.2,null,'kick',2,.9);
 for(const b of dub?[2]:[1,3])if(!(glitch&&b===3))E(b,.2,null,'snare',2,.85,{tone:2100});
 if(!dub)for(const b of [.75,2.25,3.25])if(r()<.6)E(b,.1,null,'snare',2,.18,{tone:2100,dec:.03});
 const hs=c.style==='break'&&r()<.3?.125:dub?.5:.25;for(let k=0;k*hs<4;k++)if(!(glitch&&k*hs>=3))E(k*hs,.1,null,'hat',2,hum(r,k%2?.35:.5),dub&&k%2?{open:true}:undefined);
 if(glitch)for(let k=0;k<8;k++)E(3+k*.125,.1,null,'snare',2,.3+k*.08,{tone:1800+k*200,dec:.02});
 // L3: brass stabs on the off-beats, leitmotif in brass in B/D, scratch "rewind" into the next phrase.
 for(const b of [.5,2.5])if(r()<.7)for(const n of ch)E(b,.2,n+12,'brass',3,.5);
 if(sec==='B'||sec==='D')for(const n of motifBar(r,ARC[d].motif,ARC[d].rhythm,m,{oct:5,root}))E(n.b,n.d,n.n,'brass',3,.55,{cut:3500});
 if(ph.last)E(3.5,.5,deg(m,root,4),'scratch',3,.7);
 return ev;
}
export default {id:ID,name:'Spider-Verse Drop',style:'funky breakbeat / hip hop',quality:'sketch',districts,bar};
