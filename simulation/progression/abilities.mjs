// Boti aktivních schopností (08 §5.2, karty DQ-11/12). Chyba časování podle profilu: ε ~ N(bias, qte),
// převedená na výšku přes |vy| (DQ-11: „pustí v cílové výšce s chybou N(0,alt)·|vy|“). Pozdě = dopad bez efektu.
import {P} from './params.mjs';
import {stream,gauss,canAct,activeEvent,startDive,pullUp,cushion,whistle,rocket,burstLeft,fly} from './model.mjs';

const eps=(f,tag)=>{if(f.abil['eps'+tag]==null){const r=stream(f.key,tag,f.n);f.abil['eps'+tag]=f.bias+f.sk.qte*(f.assist?.noise??1)*gauss(r);}return f.abil['eps'+tag];};
const override=(f,name)=>({...P.bots[name],...(f.ctx.bot?.[name]??{})});

// Dive: ponoří se, kdykoli klesá nad minY (po vrcholu, i opakovaně za let, nejvýš maxUses), pustí v cílové výšce
// (target 3,5 m = nízký průlet). Chyba časování se losuje pro každé ponoření zvlášť.
export function diveBot(f){
 const B=override(f,'dive'),k=f.abil.dives??0;
 if(f.dive){const th=B.target+eps(f,'dive'+(k-1))*Math.abs(f.vy);if(th>0&&f.y<=th)pullUp(f);return;}
 // počítá se každé ponoření (i to, které přeruší začátek události)
 if(k<(B.maxUses??1)&&f.vy<0&&f.y>B.minY&&!activeEvent(f)&&startDive(f))f.abil.dives=k+1;
}
// Cushion: klepne v cílové výšce 0,6 m (DQ-12). Práh ≤ 0 = klepl pozdě, dopadne.
export function cushionBot(f){
 if(f.abil.cushion||f.vy>=0||f.y>P.specials.cushion.maxY)return;
 const th=override(f,'cushion').target+eps(f,'cushion')*Math.abs(f.vy);if(th>0&&f.y<=th)cushion(f);
}
// Whistle: píská hned po vyhodnocení, když má kombo ≥ 2 (08 S3).
export function whistleBot(f){if(f.combo>=override(f,'whistle').combo&&f.y>=P.specials.whistle.minY&&canAct(f))whistle(f);}
// Paper Rocket: když odhad dopadu skončí do margin před hranicí místa, jinak na konci (nízko nad zemí).
export function rocketBot(f){
 const B=override(f,'rocket'),left=P.specials.rocket.charges-(f.abil.rocket??0);
 if(left<=0||f.vy>=0||burstLeft(f)>.05||!canAct(f))return;
 const pred=f.x+f.y*f.glide,bound=Math.ceil(pred/P.route.place)*P.route.place,gap=bound-pred;
 if(gap>0&&gap<=B.margin*pred)return void rocket(f);
 const th=B.endY*left+eps(f,'rocket')*Math.abs(f.vy);if(th>0&&f.y<=th)rocket(f);
}
export const BOTS={dive:diveBot,cushion:cushionBot,whistle:whistleBot,rocket:rocketBot};
export const botsFor=kit=>(kit.slots??[]).filter(s=>BOTS[s]).map(s=>BOTS[s]);
// Celý hod s boty schopností podle nasazených kapes.
export const throwOnce=(kit,ctx)=>fly(kit,ctx,botsFor(kit));
