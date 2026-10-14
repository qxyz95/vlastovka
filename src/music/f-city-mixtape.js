// F · City Mixtape (sketch): a different genre per district, joined by the shared leitmotif and the tonic D.
// Suburbs lo-fi (B), Docks ambient dub (E with echo), Horizon summer pop (own), Core synthwave (A).
import {ARC,rngFor} from '../audio-mix.js';
import {deg,chord,near,phrase,progAt,motifBar,hum,events} from './compose.js';
import A from './a-neon-glide.js';
import B from './b-paper-lofi.js';
import E from './e-above-the-city.js';
const POP={name:'Red Horizon · summer pop',bpm:112,mode:'mixolydian',verb:[.4,.1,.2,.4],echo:[0,0,0,.2],prog:[[0,6,3,0],[3,0,6,3],[0,4,3,6]]};
function pop(i,{seed=1}={}){
 const c=POP,m=c.mode,ph=phrase(i),r=rngFor(seed,'Fpop',i),P=progAt(c.prog,seed,'Fpop',2,ph.p),root=P[ph.pos%4],[ev,add]=events();
 for(let b=0;b<4;b++)for(const n of near(chord(m,root,3,4),66))add(b,.85,n,'piano',0,hum(r,b?.4:.55));
 for(let k=0;k<8;k++)add(k*.5,.4,k%2?deg(m,root,3):deg(m,root,2),'bass',1,k%2?.6:.85,{cut:900});
 for(let k=0;k<16;k++)add(k*.25,.1,null,'shaker',1,k%4===2?.5:.3);
 for(const b of [0,2])add(b,.2,null,'kick',2,.9);for(const b of [1,3])add(b,.2,null,'clap',2,.8);for(const b of [.5,1.5,2.5,3.5])add(b,.1,null,'hat',2,.5,{open:true});
 if(ph.section!=='C')for(const n of motifBar(r,ARC[2].motif,ARC[2].rhythm,m,{oct:5,root}))add(n.b,n.d,n.n,'glock',3,.7);
 for(const b of [.75,1.75,2.75,3.75])add(b,.2,deg(m,root+4,5),'pluck',3,.35,{cut:3000,wave:'triangle'});
 return ev;
}
export const districts=[{...B.districts[0],name:'Violet Suburbs · lo-fi'},{...E.districts[1],name:'Moon Docks · ambient dub',echo:[.25,.4,.15,.45]},POP,{...A.districts[3],name:'Neon Core · synthwave'}];
export function bar(i,d,o={}){return d===0?B.bar(i,0,o):d===1?E.bar(i,1,o):d===2?pop(i,o):A.bar(i,3,o);}
export default {id:'F',name:'City Mixtape',style:'a genre per district (city radio)',quality:'sketch',districts,bar};
