// Tunable numbers of the Atlas (research/atlas/01-navrh-atlasu.md §6.2). PROVISIONAL = copy of simulation/progression/params.mjs
// as of 14. 10. 2026 (before F5). Step C1 replaces it with the tuned set and a parity test; nothing else may hardcode levels or prices.
import {SCREEN_METERS,ROUTE} from './scenes.js';

// Same order as params.mjs atlas.bonuses (place 1..16).
const BONUS_IDS=['glider','chain','pinwheel','steam','tape','crane','skip','gull','momentum','thermal','echo','star','drone','paperCrane','onAir','encore'];
const UNLEVELLED=['glider','encore'];
const DISTRICT_PRICES=[[40,90],[170,340],[500,1000],[500,1000]]; // params atlas.prices: [level 2, level 3] by district of the place
const lv=(a,i)=>a[Math.min(i,a.length-1)];
// values[id][level-1] = template values for that level (params atlas.* and events.*).
const VALUES={
 chain:[{step:.10,max:4},{step:.13,max:5},{step:.21,max:5}],
 pinwheel:[1,2,3].map((r,i)=>({rerolls:r,noHeadwind:[false,false,true][i]})),
 steam:[1,2,3].map(l=>({push:l>=2?.7:0,burst:l>=3?.3:0,dur:2})),
 tape:[.30,.50,.75].map(keep=>({keep})),
 crane:[1,2,3].map(l=>({lift:1.5*l})),
 skip:[0,1,2].map(i=>({keep:[.30,.45,.45][i],bounces:[1,1,2][i]})),
 gull:[0,1,2].map(i=>({carry:[.2,.35,.5][i],push:[.10,.15,.22][i]})),
 momentum:[0,1,2].map(i=>({step:[.004,.014,.022][i],cap:[.04,.12,.18][i]})),
 thermal:[1,2,3].map(l=>({push:l>=2?.7:0,second:l>=3?.4:0})),
 echo:[.10,.40,.50].map(share=>({share,delay:.6})),
 star:[.08,.12,.16].map(chance=>({chance,amp:1,dur:4})),
 drone:[1,2,3].map(l=>({wider:l>=2?.3:0,pair:l>=3?.5:0})),
 paperCrane:[.03,.05,.08].map(r=>({reach:Math.round(r*SCREEN_METERS)})),
 onAir:[.10,.15,.20].map(beta=>({beta,combo:3})),
};
const levelled=BONUS_IDS.filter(id=>!UNLEVELLED.includes(id));
export const PROVISIONAL={
 provisional:true,
 route:{place:SCREEN_METERS,places:ROUTE.length,perDistrict:4,finish:SCREEN_METERS*ROUTE.length},
 atlas:{
  bonuses:BONUS_IDS,
  maxLevel:Object.fromEntries(BONUS_IDS.map(id=>[id,UNLEVELLED.includes(id)?1:3])),
  // prices[id][level-1] = cost of reaching that level; level 1 is free (found by flying).
  prices:Object.fromEntries(BONUS_IDS.map((id,i)=>[id,UNLEVELLED.includes(id)?[null]:[null,...lv(DISTRICT_PRICES,Math.floor(i/4))]])),
  values:Object.fromEntries(levelled.map(id=>[id,VALUES[id]])),
 },
 pockets:{prices:[300,5040],secondFromDistrict:2,unlock:{cushion:0,sharp:0,dive:1,calm:1,whistle:2,rocket:2},
  active:['dive','cushion','whistle','rocket'],exclusive:[['sharp','calm']],oneActive:true},
 paper:{kinds:['copy','kraft','washi','neon'],openAtPlace:3},
 gliderAt:100,coinMultiplier:null,
 // Nodes not bound to a place (or bound optionally). price null = not tuned yet → "Coming soon".
 nodes:{nightRoute:{price:null},autoQte:{price:null}},
};
export const NUMBERS=PROVISIONAL;
