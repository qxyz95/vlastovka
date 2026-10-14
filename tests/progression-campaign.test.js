import {test} from 'node:test';
import assert from 'node:assert/strict';
import {P,setParams} from '../simulation/progression/params.mjs';
import {campaign,paperTiers} from '../simulation/progression/campaign.mjs';
import {summarize,checks,starProbe,atlasProbe,SENSITIVITY} from '../simulation/progression/run.mjs';

setParams();
// rekord v okamžiku n-té koupě papíru (koupě po hodu č. throw, rekord = maximum doletů do toho hodu)
const bestAtPaperBuy=(R,k)=>{const b=R.buys.filter(x=>x.id==='paper')[k-1];if(!b)return null;return Math.max(...R.flights.slice(0,b.throw).map(f=>f[3]));};

test('progression campaign: paper tier opens at place openAtPlace of the district',()=>{
 const pl=P.route.place;
 assert.equal(P.workshop.paper.openAtPlace,3);
 assert.equal(paperTiers(0),1);assert.equal(paperTiers(2*pl-.01),1);assert.equal(paperTiers(2*pl),2); // Kraft od 609,6 m (začátek 3. místa)
 assert.ok(Math.abs(2*pl-609.6)<1);assert.equal(paperTiers(6*pl-.01),2);assert.equal(paperTiers(6*pl),3);assert.equal(paperTiers(10*pl),4);assert.equal(paperTiers(1e5),4);
 setParams({workshop:{paper:{openAtPlace:5}}});
 assert.equal(paperTiers(2*pl),1);assert.equal(paperTiers(4*pl-.01),1);assert.equal(paperTiers(4*pl),2); // 1 219 m = hranice D2 jako v 08
 assert.equal(paperTiers(8*pl),3);assert.equal(paperTiers(12*pl),4);setParams();
});

test('progression campaign: Kraft bought after 610 m (openAtPlace 3) vs. 1 219 m (5)',()=>{
 const spec={profile:'expert',strategy:'paper-first',id:1,seed:2};
 const a=campaign(spec),ba=bestAtPaperBuy(a,4);assert.ok(ba!=null&&ba>=609.6,'openAtPlace 3: '+ba);
 setParams({workshop:{paper:{openAtPlace:5}}});const b=campaign(spec),bb=bestAtPaperBuy(b,4);setParams();
 assert.ok(bb!=null&&bb>=1219.2,'openAtPlace 5: '+bb);
 // karty čtvrtí se dál řídí hranicí čtvrti
 for(const R of [a,b])for(let d=0;d<R.districts.length;d++)assert.ok(Math.max(...R.flights.slice(0,R.districts[d].throws).map(f=>f[3]))>=(d+1)*P.route.place*P.route.perDistrict-1);
 assert.ok(a.crane&&a.crane.newPlace<=a.crane.tugs);
});

const fake=(droughts,extra={})=>({done:true,throws:100,minutes:60,districts:[],flights:[[0,10,10,100]],droughts,placeGaps:[5],firstPocket:30,levelsBought:.7,gliderThrows:50,
 eCap:0,betaCap:0,qte:{done:1,hits:1},dive:{uses:0,crash:0},crane:{tugs:0,newPlace:0},...extra});

test('progression campaign: summarize reports droughtMaxP90 of per-campaign maxima',()=>{
 const rs=Array.from({length:10},(_,i)=>fake([1,i+1,2]));rs.push(fake([]));
 const s=summarize(rs);
 assert.equal(s.droughtMax,10);assert.equal(s.droughtMaxP90,9); // maxima 0,1..10 (11 kampaní) → P90 = 9
 const s2=summarize([...Array.from({length:19},()=>fake([3])),fake([30])]);
 assert.equal(s2.droughtMax,30);assert.equal(s2.droughtMaxP90,3);assert.equal(s2.droughtMaxMedian,3);
 const s3=summarize([fake([1],{crane:{tugs:2,newPlace:1}}),fake([1],{crane:{tugs:0,newPlace:0}})]);
 assert.equal(s3.craneTugRate,1);assert.equal(s3.craneNewPlace,.5);
});

test('progression campaign: checks compare drought by droughtStat',()=>{
 const s=summarize([...Array.from({length:19},()=>fake([3])),fake([30])]),key=`average|${P.targets.reference??'balanced'}|auto|better`;
 const row=()=>checks({[key]:s}).find(c=>c.name.startsWith('Sucho'));
 assert.equal(P.targets.droughtStat,'p90');let r=row();assert.equal(r.ok,true);assert.match(r.name,/P90/);
 setParams({targets:{droughtStat:'max'}});r=row();setParams();assert.equal(r.ok,false);assert.match(r.name,/max$/);
});

test('progression campaign: new Atlas metrics (Star in-flight, Tape weak, Crane info)',()=>{
 const st=starProbe(6);
 assert.equal(st.bonus,'star');assert.equal(st.flights,6);assert.ok(st.keys>=6&&st.scheduled>0&&st.scheduled<=1);
 assert.ok(st.seen>=0&&st.seen<=1);assert.ok(st.gain>-.5&&st.gain<1,'gain '+st.gain);
 const fakeAtlas=['chain','tape','paperCrane','star'].map(b=>({bonus:b,gain:0,...(b==='paperCrane'?{rate:.1}:{})}));
 const c=checks({},{atlas:fakeAtlas,atlasWeak:[{bonus:'tape',gain:.05}],star:{...st,gain:.04}});
 assert.equal(c.find(x=>x.name.startsWith('Atlas chain')).ok,false);
 for(const b of ['tape','paperCrane','star'])assert.equal(c.find(x=>x.name.startsWith(`Atlas ${b} `)).ok,null);
 assert.equal(c.find(x=>x.name.startsWith('Packing Tape')).ok,true);assert.equal(c.find(x=>x.name.startsWith('Shooting Star')).ok,true);
 assert.equal(c.find(x=>x.name.startsWith('Paper Crane úr. 3')).ok,null);
 assert.equal(checks({},{star:{...st,gain:.01}}).find(x=>x.name.startsWith('Shooting Star')).ok,false);
 const crane=atlasProbe(4).find(a=>a.bonus==='paperCrane');assert.ok(crane.rate>=0&&crane.rate<=1);
});

test('progression campaign: sensitivity has switches back to F3 behaviour',()=>{
 const names=SENSITIVITY.map(([n])=>n).join('|');
 for(const k of ['openAtPlace 5','thermal.perfect 0','dive.maxSink null','whistle.window 1'])assert.ok(names.includes(k),k);
 const o=Object.fromEntries(SENSITIVITY.map(([n,f])=>[n,f()]));
 assert.equal(Object.values(o).find(x=>x.specials?.dive)?.specials.dive.maxSink,null);
 setParams(Object.values(o).find(x=>x.specials?.dive));assert.equal(P.specials.dive.maxSink,null);setParams();
});
