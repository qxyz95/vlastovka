// Music prototype (research/hudba/01 §6): six procedural directions, a real flight from core.js rendered by render.js,
// blind rating, a 10-minute fatigue test, own-file comparison and load measurement. Not loaded by the game.
import {createAudio,benchmark} from '../../src/audio.js';
import {createSfx} from '../../src/sfx.js';
import {trackFor,boundaryCue,comboAfter,createTickPlanner,rngFor,ARC,ROUTE_METERS} from '../../src/audio-mix.js';
import {TRACKS,TRACK_IDS} from '../../src/music/index.js';
import {createFlight,step,activeEvent,eventInput} from '../../src/core.js';
import {windows,TIMING,eventProgress} from '../../src/events.js';
import {DT} from '../../src/config.js';
import {render,view} from '../../src/render.js';
import {createFx,fxEvent,stepFx} from '../../src/juice.js';
import {THEMES,setTheme} from '../../src/themes.js';
import {verse} from '../../src/themes-verse.js';
import {SECTION_METERS,routeAt,districtAt} from '../../src/scenes.js';
import {throwSettings,chargeAt} from '../../src/throw.js';
import {lerp} from '../../src/motion.js';
import {CRITERIA,DIRS,blindMap,loadStore,saveStore,summary} from './blind.js';
const $=id=>document.getElementById(id),canvas=$('game'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const audio=createAudio(),sfx=createSfx(audio),ctx=audio.ctx;let store=loadStore();
const ui={dir:'A',district:0,follow:false,blind:false,x:'X1'};let started=false;// music is on by default and starts on the first gesture
// ---------- music selection ----------
for(const id of TRACK_IDS)$('dir').add(new Option(`${id} · ${TRACKS[id].name} (${TRACKS[id].style}${TRACKS[id].quality==='sketch'?', skica':''})`,id));
$('dir').add(new Option('Bez hudby (jen efekty)','off'));$('dir').add(new Option('Vlastní soubor','file'));
ARC.slice(0,4).forEach((a,i)=>$('district').add(new Option(`${i+1} · ${a.name} (D ${a.mode})`,i)));
const musicKey=()=>ui.blind?store.map[ui.x]:ui.dir;// the actual direction
const label=()=>ui.blind?ui.x:ui.dir;// what the page may show
const district=()=>ui.follow?trackFor({best:S.best}).district:ui.district;
function applyMusic(){const k=musicKey();if(TRACKS[k])audio.play(TRACKS[k],district());else if(k==='off')audio.stop();}
$('dir').onchange=()=>{ui.dir=$('dir').value;if(ui.dir==='file'&&!audio.file)$('file-out').textContent='Nejdřív přetáhni soubor.';if(ui.dir!=='file')applyMusic();};
$('district').onchange=()=>{ui.district=Number($('district').value);applyMusic();};
$('follow').onchange=()=>{ui.follow=$('follow').checked;$('district').disabled=ui.follow;applyMusic();};
$('best').oninput=()=>{S.best=Number($('best').value);if(ui.follow)applyMusic();};
const INTENSITY=[['Dílna',{screen:'workshop'}],['Míření',{screen:'aim'}],['Let, klid',{screen:'flight',speed:1}],['Let po zásahu',{screen:'flight',speed:1.1,hits:1}],['Kombo 3, rychle',{screen:'flight',speed:1.6,hits:3,combo:3}]];
$('intensity').oninput=()=>{$('int-out').value=INTENSITY[$('intensity').value][0];};$('intensity').oninput();
// ---------- settings ----------
const pct=v=>Math.round(v*100)+' %';
function showSettings(){const s=audio.settings;for(const k of ['master','music','sfx']){$(k).value=Math.round(s[k]*100);$('o-'+k).value=pct(s[k]);}$('latency').value=Math.round(s.latency*1000);$('o-latency').value=Math.round(s.latency*1000)+' ms';for(const k of ['tick','calm','muted'])$(k).checked=s[k];}
for(const k of ['master','music','sfx'])$(k).oninput=()=>{audio.setSettings({[k]:$(k).value/100});showSettings();};
$('latency').oninput=()=>{audio.setSettings({latency:$('latency').value/1000});showSettings();};
for(const k of ['tick','calm','muted'])$(k).onchange=()=>{audio.setSettings({[k]:$(k).checked});};
showSettings();
// ---------- visual equivalents: a lamp for every sound, flashed at its audio time ----------
const LAMPS={beat:'♩ beat',bar:'▮ bar',tick:'⏱ tik',success:'✓ success',perfect:'★ perfect',combo:'↗ kombo',miss:'○ miss',jingle:'♫ znělka',duck:'▼ duck',throw:'➶ hod',boost:'» boost',land:'▂ dopad',wind:'≈ vítr',charge:'⚡ nabití',switch:'⇄ skladba'};
const lamps={};for(const [k,t] of Object.entries(LAMPS)){const s=document.createElement('span');s.className='lamp '+k;s.textContent=t;$('cues').append(s);lamps[k]=s;}
const meterLamp=(k,v)=>{lamps[k].style.background=v>.02?`color-mix(in srgb,var(--cyan) ${Math.round(v*100)}%,#0b0820)`:'';lamps[k].style.color=v>.3?'#000':'';};
const timers=new Map(),flash=(k,text)=>{const l=lamps[k];if(!l)return;if(text)l.textContent=text;l.classList.add('on');clearTimeout(l._t);l._t=setTimeout(()=>{l.classList.remove('on');},k==='jingle'?1500:180);};
const at=(when,fn)=>setTimeout(fn,Math.max(0,(when-ctx.currentTime+(ctx.outputLatency||0))*1000));
audio.on((type,info)=>{
 if(type==='cue'){if(info.name==='wind'||info.name==='charge'){meterLamp(info.name,info.level);return;}
  timers.set(info.id,at(info.when,()=>{timers.delete(info.id);flash(info.name,info.name==='combo'?`↗ kombo ${info.combo}`:info.name==='jingle'?`♫ ${ARC[info.district]?.name??''}`:null);}));}
 if(type==='uncue'){clearTimeout(timers.get(info.id));timers.delete(info.id);}
 if(type==='bar'){at(info.when,()=>flash('bar'));for(let b=0;b<4;b++)at(info.when+b*info.spb,()=>flash('beat'));}
 if(type==='switch')at(info.when,()=>flash('switch'));
 if(type==='unlock'){$('unlock').hidden=true;if(!started){started=true;if(ui.dir!=='file')applyMusic();}}
});
$('unlock').onclick=()=>audio.unlock();
// ---------- auto flight ----------
const LEVELS={early:{power:1,paper:1,fold:1},mid:{power:3,paper:3,fold:3},late:{power:5,paper:5,fold:5}};
const S={on:false,phase:'workshop',t:0,f:null,prev:null,acc:0,fx:createFx(),combo:0,hits:0,throws:0,best:0,preBest:0,landedAt:0,power:0,release:1,decisions:[],seen:new Set(),seeds:{},banner:null};
const planner=createTickPlanner(when=>audio.settings.tick?sfx.tick(when):null);
$('auto').onclick=()=>setAuto(!S.on);
function setAuto(on){S.on=on;$('auto').setAttribute('aria-pressed',on);$('auto').textContent=on?'■ Stop':'▶ Auto flight';if(on){audio.unlock();if(!audio.track&&!audio.file)applyMusic();enter('aim');}else{planner.clear(ctx);sfx.chargeStop();sfx.wind(0);S.f=null;enter('workshop');}}
function enter(phase){S.phase=phase;S.t=0;if(phase==='aim'){S.power=0;S.release=.85+.3*Math.random();}}
function throwPlane(){
 const k=musicKey()??'off';S.seeds[k]=(S.seeds[k]??0)+1;const seed=S.seeds[k],r=rngFor('throw',seed);
 const f=createFlight('dart',LEVELS[$('stage-lv').value],seed,{x:0,y:0},throwSettings(16+r()*6,S.power));
 const start=ui.follow?Math.max(0,S.best-150):ui.district*SECTION_METERS+(seed*173)%700;f.x=f.startX=start;
 const p=$('qte').value,rate=p==='bot70'?.7:p==='bot95'?.95:0,br=rngFor('bot',seed);S.decisions=f.events.map(()=>({hit:br()<rate,perfect:br()<rate*.6}));
 Object.assign(S,{f,prev:null,acc:0,fx:createFx(),combo:0,hits:0,landedAt:0,preBest:Math.max(S.best,start),seen:new Set()});S.throws++;
 fxEvent(S.fx,'throw',{power:S.power});sfx.chargeStop();sfx.throw(S.power);enter('flight');
}
function bot(f){if($('qte').value==='player')return;f.events.forEach((e,i)=>{const d=S.decisions[i];if(!d?.hit||e.result)return;
 if(e.type==='gust'&&f.t>=e.at+(d.perfect?TIMING.gustCenter:1.2))eventInput(f,'down','sim');
 if(e.type==='bird'){if(e.heldAt===null&&f.t>=e.at+1)eventInput(f,'down','sim');if(e.heldAt!==null&&f.t>=e.heldAt+(d.perfect?TIMING.birdCenter:.55))eventInput(f,'up','sim');}});}
function feedback(e){
 S.combo=comboAfter(S.combo,e.result);if(e.result!=='miss')S.hits++;fxEvent(S.fx,e.result);
 if(e.result==='perfect')sfx.perfect(S.combo);else if(e.result==='success')sfx.success(S.combo);else sfx.miss();
 if(e.type==='gust'&&e.result!=='miss'){fxEvent(S.fx,'boost');sfx.boost();}
 if($('qte').value==='player'){const k=audio.settings.muted||audio.settings.music===0||musicKey()==='off'?'off':musicKey()==='file'?'file':musicKey(),q=store.qte[k]??={n:0,hit:0,perfect:0};q.n++;if(e.result!=='miss')q.hit++;if(e.result==='perfect')q.perfect++;saveStore(store);showQte();}
}
function onBoundary(c){
 const name=c.district>=4?'Finale':ARC[c.district].name;S.banner={text:(c.type==='new'?'NEW DISTRICT · ':'')+name,until:performance.now()+2000};
 if(c.type==='new'){sfx.jingle(c.district);if(ui.follow&&c.district<4){S.best=Math.max(S.best,c.district*SECTION_METERS);applyMusic();}}else sfx.jingle(c.district,{short:true});
}
function simulate(dt,now){
 S.t+=dt;
 if(S.phase==='aim'){const held=Math.max(0,S.t-.3);S.power=chargeAt(Math.min(held,S.release));if(S.t>.3)sfx.charge(S.power);if(held>=S.release)throwPlane();return;}
 if(S.phase==='result'&&S.t>2.5)enter(S.throws%4===0?'workshop':'aim');
 if(S.phase==='workshop'&&S.t>4)enter('aim');
 if(S.phase!=='flight')return;
 const f=S.f;
 if(S.fx.hitstop>0)S.fx.hitstop=Math.max(0,S.fx.hitstop-dt);else S.acc+=dt;
 while(S.acc>=DT&&!f.landed){S.prev={x:f.x,y:f.y,vx:f.vx,vy:f.vy,t:f.t};bot(f);const px=f.x;step(f);S.acc-=DT;const c=boundaryCue(px,f.x,S.preBest);if(c)onBoundary(c);}
 for(const e of f.events)if(['success','perfect','miss'].includes(e.result)&&!S.seen.has(e)){S.seen.add(e);feedback(e);}
 planner.update(ctx,f.t+(f.landed?0:S.acc),activeEvent(f),windows(f),audio.settings.latency);
 if(f.landed&&!S.landedAt){S.landedAt=now;const sp=S.prev?Math.hypot(S.prev.vx,S.prev.vy):0,kind=routeAt(f.x).kind;sfx.land(sp,['bridge','lighthouse'].includes(kind)?'water':'roof');fxEvent(S.fx,'land',{speed:sp,text:Math.floor(f.x-f.startX)+' m'});
  if(f.x>S.best){S.best=Math.min(ROUTE_METERS,f.x);$('best').value=S.best;if(ui.follow)applyMusic();}}
 if(S.landedAt&&now-S.landedAt>850){planner.clear(ctx);enter('result');}
}
// ---------- manual events ----------
let manualQte=null,manualCombo=0,manualFx=createFx();
const EVENTS={
 'Varování + okno (tik)':()=>{manualQte={start:ctx.currentTime,result:null};const w=windows(null).gust;manualQte.tick=audio.settings.tick?sfx.tick(ctx.currentTime+w.center-(ctx.outputLatency||0)+audio.settings.latency):null;},
 'Success':()=>{manualCombo++;sfx.success(manualCombo);fxEvent(manualFx,'success');},
 'Perfect':()=>{manualCombo++;sfx.perfect(manualCombo);fxEvent(manualFx,'perfect');},
 'Miss':()=>{manualCombo=0;sfx.miss();fxEvent(manualFx,'miss');},
 'Znělka čtvrti':()=>sfx.jingle(district()),
 'Krátká znělka':()=>sfx.jingle(district(),{short:true}),
 'Hranice (nová čtvrť)':()=>{const d=(district()+1)%4;sfx.jingle(d);ui.district=d;$('district').value=d;applyMusic();},
 'Finále (znělka)':()=>sfx.jingle(4),
 'Hod':()=>{sfx.throw(.9);fxEvent(manualFx,'throw',{power:.9});},
 'Dopad':()=>{sfx.land(18);fxEvent(manualFx,'land',{speed:18,text:'flop'});},
 'Dopad do vody':()=>sfx.land(14,'water'),
 'Nabíjení 1 s':()=>{let p=0;const id=setInterval(()=>{p+=.05;sfx.charge(chargeAt(p));if(p>=1.05){clearInterval(id);sfx.chargeStop();sfx.throw(.95);}},50);},
 'Vítr nahoru/dolů':()=>{let p=0;const id=setInterval(()=>{p+=.05;sfx.wind(Math.sin(Math.PI*Math.min(1,p/3)));if(p>=3){clearInterval(id);sfx.wind(0);}},50);}};
for(const [name,fn] of Object.entries(EVENTS)){const b=document.createElement('button');b.textContent=name;b.onclick=()=>{audio.unlock();if(!audio.track&&!audio.file)applyMusic();fn();};$('ev-buttons').append(b);}
function manualPhase(){if(!manualQte)return 'none';const t=ctx.currentTime-manualQte.start;if(t<TIMING.warning)return 'warning';if(t<TIMING.warning+TIMING.bar&&!manualQte.result)return 'window';if(t<TIMING.warning+TIMING.bar+.6)return 'effect';manualQte=null;return 'none';}
function manualPress(){if(manualPhase()!=='window')return;const w=windows(null).gust,d=Math.abs(ctx.currentTime-manualQte.start-w.center);manualQte.result=d<=w.perfect?'perfect':d<=w.success?'success':'miss';manualQte.tick?.cancel?.();EVENTS[manualQte.result==='perfect'?'Perfect':manualQte.result==='success'?'Success':'Miss']();}
// ---------- input ----------
const press=kind=>{if(S.on&&S.phase==='flight'&&S.f&&$('qte').value==='player')eventInput(S.f,kind,'key');else if(!S.on&&kind==='down')manualPress();};
addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();if(!e.repeat)press('down');}if(e.code==='KeyM'&&e.target.tagName!=='INPUT'){audio.setSettings({muted:!audio.settings.muted});showSettings();}});
addEventListener('keyup',e=>{if(e.code==='Space')press('up');});
canvas.addEventListener('pointerdown',()=>press('down'));addEventListener('pointerup',()=>press('up'));
// ---------- theme ----------
const STYLES={...THEMES,verse};for(const id of Object.keys(STYLES))$('theme').add(new Option(STYLES[id].name,id));$('theme').value='verse';setTheme(verse);$('theme').onchange=()=>setTheme(STYLES[$('theme').value]);
// ---------- frame loop ----------
const zones=(f,kind)=>{const w=windows(f)[kind],c=(kind==='gust'?w.center-TIMING.warning:w.center)/TIMING.bar,s=w.success/TIMING.bar,pf=w.perfect/TIMING.bar;return {success:[c-s,c+s],perfect:[c-pf,c+pf]};};
// ?timer: a timer loop instead of requestAnimationFrame (for automated checks in a hidden window).
const TIMER=new URLSearchParams(location.search).has('timer'),nextFrame=TIMER?cb=>setTimeout(()=>cb(performance.now()),16):requestAnimationFrame;
let last=0,glide=0,frameMs=0;
function frame(now){
 const dt=last?Math.min(.1,(now-last)/1000):0;last=now;
 if(!document.hidden||TIMER){
  if(S.on)simulate(dt,now);
  if(fat.on)fatigueStep(dt);
  const f=S.on?S.f:null,inFlight=S.on&&S.phase==='flight'&&f,e=inFlight?activeEvent(f):null;
  // Mix state: from the auto flight, or from the intensity slider and manual QTE.
  const st=S.on?{screen:S.phase,event:e?{warning:'warning',interaction:'window',effect:'effect'}[e.phase]??'none':'none',combo:S.combo,hits:S.hits,speed:inFlight?f.vx/f.p.cruise:1,height:inFlight?f.y:0}
   :{...INTENSITY[$('intensity').value][1],event:manualPhase()};
  if(!S.on&&st.event!=='none')st.screen='flight';// a manual QTE always thins like in flight
  audio.setMix(st);sfx.wind(inFlight&&!f.landed?Math.max(0,Math.min(1,(f.vx/f.p.cruise-.8)/1.6)):0);
  // Draw: the flight (interpolated between physics steps) or a gentle glide in manual mode.
  const t0=performance.now();let shown,qte=null,fx=S.on?S.fx:manualFx,charge=0;
  if(inFlight){const a=Math.min(1,S.acc/DT);shown=S.prev&&!f.landed?{...f,x:lerp(S.prev.x,f.x,a),y:lerp(S.prev.y,f.y,a),vx:lerp(S.prev.vx,f.vx,a),vy:lerp(S.prev.vy,f.vy,a),t:lerp(S.prev.t,f.t,a)}:f;
   if(e)qte={type:e.type,phase:e.phase,result:e.result,held:e.heldAt!==null,progress:eventProgress(f,e),zones:zones(f,e.type)};}
  else if(S.on){shown=S.phase==='result'?f:null;charge=S.phase==='aim'?S.power:0;}
  else{glide+=dt*22;shown={x:district()*SECTION_METERS+glide%1100,y:35,vx:22,vy:0,t:now/1000,events:[],landed:false};const ph=manualPhase();
   if(ph!=='none'){const fake={p:{window:1}},z=zones(fake,'gust');qte={type:'gust',phase:ph==='window'?'interaction':ph,result:manualQte?.result??null,held:false,progress:Math.max(0,Math.min(1,(ctx.currentTime-(manualQte?.start??0)-TIMING.warning)/TIMING.bar)),zones:z};}}
  stepFx(fx,dt,shown,view(shown));
  render(canvas,shown,'dart',now/1000,{reduced:reduced.matches,qte,fx,charge,clock:now/1000});
  frameMs=frameMs*.95+(performance.now()-t0)*.05;
  hud(st,shown);
 }
 nextFrame(frame);
}
function hud(st,shown){
 const k=musicKey(),tr=TRACKS[k],d=district(),name=ui.blind?label():tr?`${k} · ${tr.name}`:k==='file'?`soubor: ${audio.file?.name??'—'}`:'bez hudby';
 const dd=tr?.districts[audio.district]??null,m=audio.mix;
 $('hud').textContent=[`${name}${dd&&!ui.blind?` · ${dd.name} · ${dd.bpm} BPM · D ${dd.mode}`:dd?` · čtvrť ${audio.district+1}`:''}`,
  `stav ${st.screen}${st.event&&st.event!=='none'?' · '+st.event:''} · kombo ${st.combo??0} · zásahy ${st.hits??0}`,
  shown?`${Math.floor(shown.x)} m · ${districtAt(shown.x).name}`:'',S.on&&S.f?`rychlost ${(S.f.vx/S.f.p.cruise).toFixed(2)}× · výška ${S.f.y.toFixed(0)} m · seed ${S.f.seed}`:'',
  S.on&&S.phase==='flight'&&$('qte').value==='player'?'MEZERNÍK = QTE':''].filter(Boolean).join('\n');
 $('best-out').value=Math.floor(S.best)+' m → '+ARC[trackFor({best:S.best}).district].name;
 const b=S.banner&&performance.now()<S.banner.until;$('banner').hidden=!b;if(b)$('banner').textContent=S.banner.text;
}
// ---------- layer meters and load ----------
$('layers').innerHTML=['L0 bed','L1 pulse','L2 groove','L3 lead'].map((n,i)=>`<div>${n} <span class="meter"><i id="lm${i}"></i></span> <output id="lv${i}"></output></div>`).join('')+'<div>filtr <output id="lf"></output> · pad <output id="lp"></output> · úroveň <span class="meter"><i id="rms"></i></span></div>';
const buf=new Float32Array(512);
setInterval(()=>{const g=audio.g;g.layers.forEach((L,i)=>{const v=L.gain.gain.value;$('lm'+i).style.width=Math.min(100,v*100)+'%';$('lv'+i).value=v.toFixed(2);});$('lf').value=Math.round(g.lp.frequency.value)+' Hz';$('lp').value=Math.round(g.layers[0].lp.frequency.value)+' Hz';
 g.analyser.getFloatTimeDomainData(buf);let s=0;for(const x of buf)s+=x*x;$('rms').style.width=Math.min(100,Math.sqrt(s/buf.length)*300)+'%';
 const st=audio.stats();$('load').textContent=`hlasy ${st.voices} (špička ${st.peak}) · fronta ${st.queue}\nplánovač ${st.schedAvg.toFixed(3)} ms prům. / ${st.schedMax.toFixed(2)} ms max (každých 25 ms)\nrender ${frameMs.toFixed(2)} ms/snímek · ${st.state} · ${st.rate} Hz · latence ${(st.base*1000).toFixed(0)}+${(st.output*1000).toFixed(0)} ms${st.underruns!=null?` · výpadky ${st.underruns} (${st.underrunMs.toFixed(0)} ms)`:''}`;},100);
$('bench').onclick=async()=>{$('bench-out').textContent='běží…';const rows=[];for(const id of TRACK_IDS){const r=await benchmark(TRACKS[id],district(),8);rows.push(`${ui.blind?'?':id} čtvrť ${r.district+1}: 8 s za ${r.ms.toFixed(0)} ms = ${r.factor.toFixed(1)}× realtime · špička ${r.peak} hlasů · ${r.events} not`);$('bench-out').textContent=rows.join('\n')+'\nběží…';}$('bench-out').textContent=rows.join('\n');};
// ---------- blind mode ----------
for(const x of Object.keys(store.map)){const b=document.createElement('button');b.textContent=x;b.dataset.x=x;b.onclick=()=>{ui.x=x;pickX();applyMusic();};$('blind-picks').append(b);}
const pickX=()=>{for(const b of $('blind-picks').children)b.setAttribute('aria-pressed',b.dataset.x===ui.x);};pickX();
$('blind').onchange=()=>{ui.blind=$('blind').checked;$('dir').disabled=ui.blind;$('blind-picks').hidden=!ui.blind;showRatings();applyMusic();};
$('rate-form').innerHTML=CRITERIA.map(c=>`<span>${c.label}</span><select id="rc-${c.id}"><option value="">–</option>${[1,2,3,4,5].map(v=>`<option>${v}</option>`).join('')}</select>`).join('');
let revealed=false;
$('rate-save').onclick=()=>{const scores={};for(const c of CRITERIA){const v=Number($('rc-'+c.id).value);if(v)scores[c.id]=v;}if(!Object.keys(scores).length)return;
 store.ratings.push({x:ui.blind?ui.x:null,dir:musicKey(),blind:ui.blind,district:audio.district,mode:S.on?'auto':'manual',at:new Date().toISOString(),scores,note:$('rate-note').value});saveStore(store);
 for(const c of CRITERIA)$('rc-'+c.id).value='';$('rate-note').value='';showRatings();};
$('reveal').onclick=()=>{revealed=!revealed;showRatings();};
$('new-session').onclick=()=>{const seed=Date.now()%100000;store.seed=seed;store.map=blindMap(seed);saveStore(store);revealed=false;showRatings();applyMusic();};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({exported:new Date().toISOString(),store,summary:summary(store)},null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='music-ratings.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
function showRatings(){
 const hide=ui.blind&&!revealed,inv=Object.fromEntries(Object.entries(store.map).map(([x,d])=>[d,x]));
 const lines=store.ratings.slice(-8).map(r=>`${hide?(r.x??'?'):r.dir}${r.x&&!hide?' ('+r.x+')':''} č${r.district+1}: ${Object.entries(r.scores).map(([k,v])=>k+' '+v).join(', ')}${r.note?' · '+r.note:''}`);
 let out=`${store.ratings.length} hodnocení`+(lines.length?'\n'+lines.join('\n'):'');
 if(!hide){const s=summary(store);out+='\n\nPrůměry:\n'+DIRS.filter(d=>s[d]).map(d=>`${d}${ui.blind?' = '+inv[d]:''}: `+CRITERIA.map(c=>s[d].scores[c.id]?c.id+' '+s[d].scores[c.id].toFixed(1):'').filter(Boolean).join(', ')+(Object.keys(s[d].fatigue).length?' · únava '+Object.entries(s[d].fatigue).map(([m,v])=>m+'. min '+v).join(', '):'')).join('\n');}
 $('ratings').textContent=out;
}
showRatings();
function showQte(){const s=summary(store),rows=Object.entries(s).filter(([,o])=>o.qteN).map(([d,o])=>`${ui.blind&&!revealed&&d.length===1?'?':d}: ${o.qteN} událostí · zásah ${(o.hitRate*100).toFixed(0)} % · perfekt ${(o.perfectRate*100).toFixed(0)} %`);$('qte-stats').textContent=rows.length?rows.join('\n'):'Zapni Auto flight v režimu „Hraju já“. Zásahy se počítají zvlášť pro každý směr a pro „off“ (ztlumeno / bez hudby), na stejných seedech.';}
showQte();
// ---------- fatigue test ----------
const fat={on:false,t:0,asked:new Set(),dir:null,x:null};const ASK=[1,5,10];
$('fatigue').onclick=()=>{if(fat.on){stopFatigue('přerušeno');return;}Object.assign(fat,{on:true,t:0,asked:new Set(),dir:musicKey(),x:ui.blind?ui.x:null});$('fatigue').textContent='■ Přerušit';$('dir').disabled=true;$('blind').disabled=true;if(!S.on)setAuto(true);};
function fatigueStep(dt){fat.t+=dt;const m=Math.floor(fat.t/60);$('fatigue-status').textContent=`${Math.floor(fat.t/60)}:${String(Math.floor(fat.t%60)).padStart(2,'0')} / 10:00 · ${fat.x??fat.dir} · čtvrť ${district()+1}`;
 for(const q of ASK)if(m>=q&&!fat.asked.has(q)){fat.asked.add(q);ask(q);}}
function ask(minute){const box=$('fatigue-ask');box.hidden=false;box.innerHTML=`<b>${minute}. minuta:</b> jak moc tě hudba unavuje? `;for(let v=1;v<=5;v++){const b=document.createElement('button');b.textContent=v+(v===1?' vůbec':v===5?' vypnul bych':'');b.onclick=()=>{store.fatigue.push({dir:fat.dir,x:fat.x,minute,score:6-v,raw:v,district:district(),at:new Date().toISOString()});saveStore(store);box.hidden=true;showRatings();if(minute===10)stopFatigue('hotovo');};box.append(b);}}
function stopFatigue(why){fat.on=false;$('fatigue').textContent='▶ Spustit únavový test';$('dir').disabled=ui.blind;$('blind').disabled=false;$('fatigue-status').textContent+=` · ${why}`;}
// ---------- own file ----------
async function useFile(file){if(!file)return;audio.unlock();try{const info=await audio.playFile(await file.arrayBuffer(),file.name);ui.dir='file';$('dir').value='file';$('file-out').textContent=`${file.name} · ${info.duration.toFixed(1)} s, smyčka přes stejný filtr a ducking (bez vrstev)`;}catch(err){$('file-out').textContent='Soubor nejde dekódovat: '+err.message;}}
const drop=$('drop');drop.ondragover=e=>{e.preventDefault();drop.classList.add('over');};drop.ondragleave=()=>drop.classList.remove('over');
drop.ondrop=e=>{e.preventDefault();drop.classList.remove('over');useFile(e.dataTransfer.files[0]);};$('file').onchange=()=>useFile($('file').files[0]);
nextFrame(frame);
// Debug handle for console checks.
globalThis.musicProto={audio,sfx,S,ui,store};
