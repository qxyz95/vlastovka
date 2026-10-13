import {BRANCHES,PRICES,DT} from './config.js';
import {fresh,buy,createFlight,step,activeEvent,eventInput,settle,reward} from './core.js';
import {load,save} from './storage.js';
import {render} from './render.js';
import {districtAt,routeAt,SCREEN_METERS} from './scenes.js';
import {chargeAt,throwSettings} from './throw.js';
import {eventProgress,eventStats,windows,TIMING} from './events.js';
import {createDecorations,stepDecorations} from './decorations.js';
const $=id=>document.getElementById(id),loaded=load();let p=loaded.data,f=null,state='workshop',picked={branch:'power',level:1},last=0,acc=0;
let decorations=null, inputOwner=null, milestoneQueue=[], seenMilestones=new Set(), banner=null, lastDistrict=0, districtUntil=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
$('warning').textContent=loaded.warning;
function persist(){const warning=save(p);if(warning)$('warning').textContent=warning;}
const num=(x,d=1)=>x.toLocaleString('cs',{minimumFractionDigits:d,maximumFractionDigits:d});
// Story line under the scene: the current place in flight, otherwise the farthest place reached.
function setStory(text){if($('journey-story').textContent!==text)$('journey-story').textContent=text;}
function storyAt(x,prefix=''){const place=routeAt(x);return prefix+place.name+' · '+place.story;}
function refresh(){
  $('model-upgrades').textContent='Vylepšení · platí pro obě vlaštovky';
  $('coins').textContent=p.coins;$('best').textContent=Math.floor(p.best)+' m';$('milestone').textContent=([100,250,500].find(n=>n>p.best)??Math.ceil((Math.floor(p.best/SCREEN_METERS)+1)*SCREEN_METERS))+' m';
  setStory(p.best>0?storyAt(p.best,'Nejdál: '):storyAt(0));
  for(const m of ['dart','glider']){$(m).classList.toggle('selected',p.model===m);$(m).setAttribute('aria-pressed',p.model===m);}
  $('glider').disabled=p.best<100;$('glider-description').textContent=p.best<100?'Odemkneš doletem 100 m.':'Pomalejší start, dlouhé klouzání. Víc vytěží z poryvů a holubů.';
  $('tree').replaceChildren();
  for(const b of BRANCHES){const row=document.createElement('div');row.className='branch';const label=document.createElement('div');label.className='branch-label';label.textContent=b.icon+'  '+b.name;row.append(label);const nodes=document.createElement('div');nodes.className='nodes';
    for(let l=1;l<=5;l++){const node=document.createElement('button'),owned=l<=p.levels[b.id],locked=l>p.levels[b.id]+1;node.className='node'+(owned?' owned':locked?' locked':'')+(picked.branch===b.id&&picked.level===l?' picked':'');node.innerHTML=`${owned?'✓':locked?'·':b.icon} ${l}<small>${owned?'hotovo':PRICES[l-1]+' ◈'}</small>`;node.setAttribute('aria-label',`${b.name}, úroveň ${l}, ${owned?'zakoupeno':locked?'zamčeno':p.coins<PRICES[l-1]?'nedostatek mincí':'dostupné'}`);node.onclick=()=>{picked={branch:b.id,level:l};refresh();$('tree').querySelectorAll('.branch')[BRANCHES.indexOf(b)].querySelectorAll('button')[l-1].focus();};nodes.append(node);}row.append(nodes);$('tree').append(row);}
  const b=BRANCHES.find(b=>b.id===picked.branch),l=picked.level,owned=l<=p.levels[b.id],locked=l>p.levels[b.id]+1;
  $('detail').innerHTML=`<span class="eyebrow">VYLEPŠENÍ / ÚROVEŇ ${l}</span><h3>${b.icon} ${b.name}</h3><p>${b.effect}</p><p>${owned?'✓ Tuto úroveň už máš.':locked?`Nejprve kup úroveň ${l-1} této větve.`:`Cena ${PRICES[l-1]} ◈ · ${p.coins<PRICES[l-1]?`Chybí ${PRICES[l-1]-p.coins} mincí.`:'Připraveno k nákupu.'}`}</p><button id="buy" ${owned||locked||p.coins<PRICES[l-1]?'disabled':''}>${owned?'Zakoupeno':'Koupit za '+PRICES[l-1]+' ◈'}</button>`;
  $('buy').onclick=()=>{if(buy(p,b.id,l)){persist();refresh();$('launch').focus();}};
}
let angle=15, held=false, heldTime=0, owner=null;
function show(next){state=next;document.body.classList.toggle('in-flight',next==='flight');for(const id of ['workshop','flight','aim'])$(id).hidden=id!==next;$('game').classList.toggle('aiming',next==='aim');if(next!=='flight'){$('milestone-banner').hidden=true;$('scene-label').classList.remove('district-highlight');}if(next==='workshop'||next==='aim'){$('flight-reward').textContent='10 ◈';decorations=null;}}
function prepare(){if($('result').open)$('result').close();f=null;held=false;owner=null;heldTime=0;acc=0;show('aim');updateAim();$('hold').focus();$('game').scrollIntoView({block:'center',behavior:'smooth'});}
function workshop(upgrades=false){if($('result').open)$('result').close();held=false;owner=null;f=null;show('workshop');refresh();if(upgrades){$('tree').scrollIntoView({block:'center'});$('tree').querySelector('button').focus();}else $('launch').focus();}
function updateAim(){const charge=held?chargeAt(heldTime):0;$('angle').value=angle;$('angle-value').textContent=Math.round(angle)+'°';$('charge-fill').style.width=charge*100+'%';$('charge-label').textContent=(held?'Pusť pro hod':'Připraveno')+' · '+Math.round(charge*100)+' %';}
function begin(source){if(state!=='aim'||held||document.hidden)return;held=true;owner=source;heldTime=0;}
function release(source){if(!held||owner!==source||state!=='aim')return;const launch=throwSettings(angle,chargeAt(heldTime));held=false;owner=null;f=createFlight(p.model,p.levels,p.attempts+1,{x:0,y:0},launch);acc=0;decorations=createDecorations(f.seed);zoneKind=null;inputOwner=null;milestoneQueue=[];seenMilestones=new Set();banner=null;lastDistrict=0;districtUntil=0;show('flight');$('event-help').textContent=launch.label;$('action').disabled=true;}
function cancelHold(){held=false;owner=null;heldTime=0;updateAim();}
function aimPointer(e){const r=$('game').getBoundingClientRect();const x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*360/r.height;angle=Math.max(5,Math.min(40,Math.atan2(258-y,Math.max(1,x-148))*180/Math.PI));updateAim();}
for(const target of [$('hold'),$('game')]){
 target.addEventListener('pointerdown',e=>{if(state!=='aim'||e.button!==0||held)return;e.preventDefault();if(target===$('game'))aimPointer(e);target.setPointerCapture(e.pointerId);begin(e.pointerId);});
 target.addEventListener('pointermove',e=>{if(state==='aim'&&target===$('game')&&(!held||owner===e.pointerId))aimPointer(e);});
 target.addEventListener('pointerup',e=>{release(e.pointerId);});
 target.addEventListener('pointercancel',cancelHold);
 target.addEventListener('lostpointercapture',()=>{if(held)cancelHold();});
}
$('angle').oninput=()=>{angle=Number($('angle').value);updateAim();};
$('launch').onclick=prepare;$('retry').onclick=prepare;$('upgrades').onclick=()=>workshop(true);$('return').onclick=()=>workshop();$('cancel-aim').onclick=()=>workshop();
$('result').addEventListener('cancel',e=>{e.preventDefault();workshop();});
for(const m of ['dart','glider'])$(m).onclick=()=>{if(m==='glider'&&p.best<100)return;p.model=m;persist();refresh();};
function flightDown(source){if(state!=='flight'||document.hidden||inputOwner!==null)return;const e=activeEvent(f);if(!e||e.result)return;inputOwner=source;eventInput(f,'down',source);}
function flightUp(source){if(inputOwner!==source)return;eventInput(f,'up',source);inputOwner=null;}
function flightCancel(){if(inputOwner!==null)eventInput(f,'cancel',inputOwner);inputOwner=null;}
$('game').addEventListener('pointerdown',e=>{if(state!=='flight'||e.button!==0||inputOwner!==null)return;e.preventDefault();try{$('game').setPointerCapture(e.pointerId);}catch{}flightDown(e.pointerId);});
$('game').addEventListener('pointerup',e=>{if(state==='flight')flightUp(e.pointerId);});
$('game').addEventListener('pointercancel',e=>{if(state==='flight'&&inputOwner===e.pointerId)flightCancel();});
$('action').addEventListener('pointerdown',e=>{if(e.button!==0||inputOwner!==null)return;e.preventDefault();$('action').setPointerCapture(e.pointerId);flightDown(e.pointerId);});
$('action').addEventListener('pointerup',e=>flightUp(e.pointerId));
$('action').addEventListener('pointercancel',e=>{if(inputOwner===e.pointerId)flightCancel();});
$('action').addEventListener('lostpointercapture',e=>{if(inputOwner===e.pointerId)flightCancel();});
// Space on another focused button (e.g. "Zpět do dílny") must activate that button, not throw.
const otherButton=e=>e.target instanceof HTMLButtonElement&&e.target!==$('hold')&&e.target!==$('action');
window.addEventListener('keydown',e=>{
 if(state==='aim'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&e.target!==$('angle')){e.preventDefault();angle=Math.max(5,Math.min(40,angle+(['ArrowUp','ArrowRight'].includes(e.code)?1:-1)));updateAim();}
 if((e.code==='Space'||e.code==='Enter'&&e.target===$('action'))&&(state==='flight'||state==='aim')&&!otherButton(e)){e.preventDefault();if(!e.repeat){if(state==='aim')begin('key');else flightDown('key');}}
});
window.addEventListener('keyup',e=>{if(otherButton(e))return;if(e.code==='Space'||e.code==='Enter'){if(state==='aim'){e.preventDefault();release('key');}else if(state==='flight'){e.preventDefault();flightUp('key');}}});
window.addEventListener('blur',()=>{if(state==='aim')cancelHold();flightCancel();});
$('reset').onclick=()=>{if(confirm('Opravdu smazat mince, vylepšení a rekord?')){p=fresh();persist();workshop();}};
document.addEventListener('visibilitychange',()=>{last=0;acc=0;if(document.hidden){if(state==='aim')cancelHold();flightCancel();}$('paused').hidden=!document.hidden;});
function finish(){const previous=p.best;settle(p,f);persist();refresh();show('result');
 $('result-title').textContent=f.x>=500?'Obzor je tvůj!':'Hod dokončen!';
 $('stat-distance').textContent=num(f.x)+' m';$('stat-time').textContent=num(f.t)+' s';
 $('stat-power').textContent=Math.round(f.launch.power*100)+' %';$('stat-angle').textContent=Math.round(f.launch.angle*180/Math.PI)+'°';
 const stats=eventStats(f);
 $('stat-events').textContent=stats.hits+' / '+stats.completed+' · ★ '+stats.perfect;$('stat-best').textContent=num(p.best)+' m';
 $('reward-breakdown').textContent='Za pokus 10 ◈ + za vzdálenost '+(reward(f)-10)+' ◈';$('stat-reward').textContent=reward(f);
 $('result-progress').value=Math.min(500,p.best);$('result-progress-label').textContent=p.best>=500?'Cíl splněn · rekord '+num(p.best,0)+' m':Math.floor(p.best)+' / 500 m';
 $('result-text').textContent=[f.launch.label,f.x>previous?'★ Nový rekord!':'',previous<100&&p.best>=100?'Kluzák odemčen!':''].filter(Boolean).join(' · ');
 $('result').showModal();$('retry').focus();
}
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;if(!document.hidden){
 if(state==='aim'){if(held)heldTime+=elapsed;updateAim();}
 if(state==='flight'){acc+=elapsed;while(acc>=DT&&!f.landed){step(f);stepDecorations(decorations,f);acc-=DT;}if(f.landed)finish();
 updateFlightUI();
 }
 $('distance').textContent=Math.floor(f?.x??0)+' m';$('scene-label').textContent=state==='aim'?'ZAMIŘ A PODRŽ · UVOLNĚNÍM HODÍŠ':districtAt(f?.x??0).name;render($('game'),f,p.model,now/1000,{decorations,reduced:reduced.matches,qte:qteVisual()});
 if(state==='aim'){const c=$('game').getContext('2d'),a=angle*Math.PI/180,len=65+(held?chargeAt(heldTime)*45:0);c.save();c.translate(148,258);c.rotate(-a);c.strokeStyle='#fff0a6';c.lineWidth=3;c.setLineDash([7,5]);c.beginPath();c.moveTo(12,0);c.lineTo(len,0);c.stroke();c.setLineDash([]);c.beginPath();c.moveTo(len-10,-6);c.lineTo(len,0);c.lineTo(len-10,6);c.stroke();c.restore();c.fillStyle='#203b3e';c.fillRect(205,168,265,37);c.fillStyle='#fff0b3';c.font='bold 13px monospace';c.fillText(held?'PUSŤ NA VRCHOLU SÍLY':'ZAMIŘ A PODRŽ PRO HOD',220,191);c.fillStyle='#203b3e';c.fillRect(205,211,265,14);c.fillStyle='#f2ce87';c.fillRect(207,213,261*(held?chargeAt(heldTime):0),10);c.strokeStyle='#fff';c.strokeRect(449,212,19,12);}
 }requestAnimationFrame(frame);}
// Bar position of an event's success/perfect windows, as fractions of the bar.
function zonesFor(kind){const w=windows(f)[kind],c=(kind==='gust'?w.center-TIMING.warning:w.center)/TIMING.bar,s=w.success/TIMING.bar,pf=w.perfect/TIMING.bar;return {success:[c-s,c+s],perfect:[c-pf,c+pf]};}
let zoneKind=null;
// What the canvas needs to draw the in-scene timing ring.
function qteVisual(){if(state!=='flight'||!f)return null;const e=activeEvent(f);if(!e)return null;return {type:e.type,phase:e.phase,result:e.result,held:e.heldAt!==null,progress:eventProgress(f,e),zones:zonesFor(e.type)};}
function updateFlightUI(){
 const e=activeEvent(f), interactive=e&&!e.result;
 if(e&&e.type!==zoneKind){zoneKind=e.type;const z=zonesFor(zoneKind);for(const [cls,[a,b]] of [['success-zone',z.success],['perfect-zone',z.perfect]]){const el=document.querySelector('.'+cls);el.style.left=a*100+'%';el.style.width=(b-a)*100+'%';}}
 $('event-title').textContent=e?(e.type==='gust'?'Poryv z ventilace':'Kyberholub-kurýr'):'Město pod křídly';
 $('action').disabled=!interactive;$('action').textContent=e?.type==='bird'?(e.heldAt!==null?'Pusť do zóny':'Podrž · mezerník'):'Klepni · mezerník';
 $('flight').dataset.kind=e?.type??'none';$('flight').dataset.phase=e?.phase??'idle';
 $('needle').style.left=(e?eventProgress(f,e)*100:0)+'%';
 const help=e?.phase==='warning'?'Připrav se…':interactive?(e.type==='gust'?'Klepni, až ukazatel projde světlým středem.':e.heldAt!==null?'Drž… pusť ve světlé zóně.':'Podrž tlačítko, pak ho pusť do zóny.'):f.t<f.feedbackUntil?f.feedback:'Let je automatický. Sleduj další příležitost.';
 if($('event-help').textContent!==help)$('event-help').textContent=help;
 $('flight-reward').textContent=reward(f)+' ◈';setStory(storyAt(f.x));
 for(const m of [100,250,500])if(f.x>=m&&!seenMilestones.has(m)){seenMilestones.add(m);milestoneQueue.push(m);}
 if(banner&&f.t>=banner.until)banner=null;
 if(!e&&!banner&&milestoneQueue.length)banner={value:milestoneQueue.shift(),until:f.t+1.5};
 $('milestone-banner').hidden=!!e||!banner||f.landed;
 if(banner)$('milestone-banner').textContent='★ '+banner.value+' m · '+(banner.value===500?'Obzor je tvůj!':'Další kus cesty za tebou');
 const district=districtAt(f.x).index;if(district!==lastDistrict){lastDistrict=district;districtUntil=f.t+1.5;}
 $('scene-label').classList.toggle('district-highlight',f.t<districtUntil);
}
refresh();requestAnimationFrame(frame);






