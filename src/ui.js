import {BRANCHES,PRICES,DT} from './config.js';
import {fresh,buy,createFlight,step,activeEvent,eventInput,settle,reward,bestAngle,angleHint} from './core.js';
import {load,save} from './storage.js';
import {createFx,fxEvent,stepFx} from './juice.js';
import {lerp} from './motion.js';
import {districtAt,routeAt,SCREEN_METERS} from './scenes.js';
import {chargeAt,throwSettings} from './throw.js';
import {eventProgress,eventStats,windows,TIMING} from './events.js';
import {createDecorations,stepDecorations} from './decorations.js';
import {THEMES,THEME_IDS,setTheme,pickTheme} from './themes.js';
import {drawAim} from './render3d/ui-layer.js';
// Renderer: 3D výchozí (src/render3d/), ?render=2d nebo prohlížeč bez WebGL2 → 2D render.js (do smazání 2D, fáze f plánu 3D).
// Oba mají stejné rozhraní render(canvas,f,model,time,visual) a view(f); 3D kreslí mířidla v UI vrstvě, 2D je dostane přes drawAim.
const webgl2=()=>{try{const g=document.createElement('canvas').getContext('webgl2');g?.getExtension('WEBGL_lose_context')?.loseContext();return !!g;}catch{return false;}};
let mode=new URLSearchParams(location.search).get('render')!=='2d'&&webgl2()?'3d':'2d';
let {render,view}=await(mode==='3d'?import('./render3d/index.js').catch(e=>{console.warn('3D renderer unavailable, falling back to 2D',e);mode='2d';return import('./render.js');}):import('./render.js'));
// 3D selže až při vytvoření kontextu (první snímek) → přepnout na 2D za běhu.
function fallback2d(e){console.warn('3D renderer failed, falling back to 2D',e);mode='2d';document.body.dataset.render=mode;import('./render.js').then(m=>{({render,view}=m);}).catch(()=>{});render=()=>{};}
const $=id=>document.getElementById(id),loaded=load();let p=loaded.data,f=null,state='workshop',picked={branch:'power',level:1},last=0,acc=0;
let fx=null, prev=null, landedAt=0, decorations=null, inputOwner=null, milestoneQueue=[], seenMilestones=new Set(), banner=null, lastDistrict=0, districtUntil=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// ?timer: ladicí smyčka ~60 Hz přes MessageChannel (skrytá záložka škrtí rAF i setTimeout) a skrytá záložka se nebere jako pauza
// (automatické ověření ve skrytém okně prohlížeče; točí jedno jádro CPU, jen pro ladění).
const TIMER=new URLSearchParams(location.search).has('timer'),hidden=()=>document.hidden&&!TIMER,mc=TIMER?new MessageChannel():null;let tickAt=0;
if(mc)mc.port1.onmessage=()=>{const n=performance.now();if(n-tickAt>=16){tickAt=n;frame(n);}else mc.port2.postMessage(0);};
const tick=()=>mc?mc.port2.postMessage(0):requestAnimationFrame(frame);
$('warning').textContent=loaded.warning;
// Visual style: ?styl= in the URL wins, otherwise the last choice. Only presentation changes.
const THEME_KEY='just-throw-it-theme';
document.body.dataset.render=mode;$('theme-picker').hidden=mode==='3d';// styly patří 2D rendereru, 3D má vlastní vzhled
function applyTheme(id){setTheme(id);document.body.dataset.theme=id;for(const b of document.querySelectorAll('[data-theme-id]'))b.setAttribute('aria-pressed',b.dataset.themeId===id);try{localStorage.setItem(THEME_KEY,id);}catch{}}
if(mode==='2d'){for(const id of THEME_IDS){const b=document.createElement('button');b.type='button';b.dataset.themeId=id;b.textContent=THEMES[id].name;b.onclick=()=>applyTheme(id);$('theme-picker').append(b);}
{let stored=null;try{stored=localStorage.getItem(THEME_KEY);}catch{}applyTheme(pickTheme(new URLSearchParams(location.search).get('styl'),stored));}}
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
function prepare(){if($('result').open)$('result').close();f=null;fx=null;held=false;owner=null;heldTime=0;acc=0;show('aim');updateAim();$('hold').focus();$('game').scrollIntoView({block:'center',behavior:'smooth'});}
function workshop(upgrades=false){if($('result').open)$('result').close();held=false;owner=null;f=null;fx=null;show('workshop');refresh();if(upgrades){$('tree').scrollIntoView({block:'center'});$('tree').querySelector('button').focus();}else $('launch').focus();}
function updateAim(){const charge=held?chargeAt(heldTime):0;$('angle').value=angle;$('angle-value').textContent=Math.round(angle)+'°';$('charge-fill').style.width=charge*100+'%';$('charge-label').textContent=(held?'Pusť pro hod':'Připraveno')+' · '+Math.round(charge*100)+' %';}
function begin(source){if(state!=='aim'||held||hidden())return;held=true;owner=source;heldTime=0;}
function release(source){if(!held||owner!==source||state!=='aim')return;const launch=throwSettings(angle,chargeAt(heldTime));held=false;owner=null;f=createFlight(p.model,p.levels,p.attempts+1,{x:0,y:0},launch);acc=0;prev=null;landedAt=0;fx=createFx();fxEvent(fx,'throw',{power:launch.power});decorations=createDecorations(f.seed);zoneKind=null;inputOwner=null;milestoneQueue=[];seenMilestones=new Set();banner=null;lastDistrict=0;districtUntil=0;show('flight');$('event-help').textContent=launch.label;$('action').disabled=true;}
function cancelHold(){held=false;owner=null;heldTime=0;updateAim();}
function aimPointer(e){const r=$('game').getBoundingClientRect(),o=view(null);const x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*360/r.height;angle=Math.max(5,Math.min(40,Math.atan2(o.py-y,Math.max(1,x-o.px))*180/Math.PI));updateAim();}
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
function flightDown(source){if(state!=='flight'||hidden()||inputOwner!==null)return;const e=activeEvent(f);if(!e||e.result)return;inputOwner=source;eventInput(f,'down',source);}
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
document.addEventListener('visibilitychange',()=>{last=0;acc=0;if(hidden()){if(state==='aim')cancelHold();flightCancel();}$('paused').hidden=!hidden();});
function finish(){const previous=p.best;settle(p,f);persist();refresh();show('result');
 $('result-title').textContent=f.x>=500?'Obzor je tvůj!':'Hod dokončen!';
 $('stat-distance').textContent=num(f.x)+' m';$('stat-time').textContent=num(f.t)+' s';
 $('stat-power').textContent=Math.round(f.launch.power*100)+' %';$('stat-angle').textContent=Math.round(f.launch.angle*180/Math.PI)+'°';
 const stats=eventStats(f);
 $('stat-events').textContent=stats.hits+' / '+stats.completed+' · ★ '+stats.perfect;$('stat-best').textContent=num(p.best)+' m';
 $('reward-breakdown').textContent='Za pokus 10 ◈ + za vzdálenost '+(reward(f)-10)+' ◈';$('stat-reward').textContent=reward(f);
 $('result-progress').value=Math.min(500,p.best);$('result-progress-label').textContent=p.best>=500?'Cíl splněn · rekord '+num(p.best,0)+' m':Math.floor(p.best)+' / 500 m';
 $('result-text').textContent=[f.launch.label,angleHint(f.launch.angle*180/Math.PI,bestAngle(f.model,p.levels,f.launch.power)),f.x>previous?'★ Nový rekord!':'',previous<100&&p.best>=100?'Kluzák odemčen!':''].filter(Boolean).join(' · ');
 $('result').showModal();$('retry').focus();
}
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;if(!hidden()){
 if(state==='aim'){if(held)heldTime+=elapsed;updateAim();}
 if(state==='flight'){
  // Hitstop freezes physics for a few frames; QTE timing runs on flight time, so it is unaffected.
  if(fx.hitstop>0)fx.hitstop=Math.max(0,fx.hitstop-elapsed);else acc+=elapsed;
  while(acc>=DT&&!f.landed){prev={x:f.x,y:f.y,vx:f.vx,vy:f.vy,t:f.t};step(f);stepDecorations(decorations,f);acc-=DT;}
  juiceEvents();
  // Let the landing dust and shake play before the result dialog covers the scene.
  if(f.landed){if(!landedAt)landedAt=now;if(now-landedAt>(reduced.matches?300:850))finish();}
  updateFlightUI();
 }
 // Draw between the last two physics steps so motion is smooth on 120 Hz screens too.
 const a=Math.min(1,acc/DT),shown=f&&prev&&!f.landed?{...f,x:lerp(prev.x,f.x,a),y:lerp(prev.y,f.y,a),vx:lerp(prev.vx,f.vx,a),vy:lerp(prev.vy,f.vy,a),t:lerp(prev.t,f.t,a)}:f;
 if(fx)stepFx(fx,elapsed,shown,view(shown));
 $('distance').textContent=Math.floor(f?.x??0)+' m';$('scene-label').textContent=state==='aim'?'ZAMIŘ A PODRŽ · UVOLNĚNÍM HODÍŠ':districtAt(f?.x??0).name;
 const charge=state==='aim'&&held?chargeAt(heldTime):0,aim=state==='aim'?{angle,held,charge}:null;
 try{render($('game'),shown,p.model,f?f.t+(f.landed&&landedAt?(now-landedAt)/1000:0):now/1000,{decorations,reduced:reduced.matches,qte:qteVisual(),fx,charge,clock:now/1000,state,aim,best:p.best});}catch(e){if(mode!=='3d')throw e;fallback2d(e);}
 // 2D renderer mířidla nekreslí: stejná kresba jako UI vrstva 3D, z promítnuté vlaštovky view(null).
 if(aim&&mode==='2d'){const c=$('game').getContext('2d'),k=c.canvas.width/640;c.setTransform(k,0,0,k,0,0);drawAim(c,aim,view(null));c.setTransform(1,0,0,1,0,0);}
 }tick();}
// Bar position of an event's success/perfect windows, as fractions of the bar.
function zonesFor(kind){const w=windows(f)[kind],c=(kind==='gust'?w.center-TIMING.warning:w.center)/TIMING.bar,s=w.success/TIMING.bar,pf=w.perfect/TIMING.bar;return {success:[c-s,c+s],perfect:[c-pf,c+pf]};}
let zoneKind=null;
// Turn resolved events and the landing into feedback (each only once).
function juiceEvents(){
 for(const e of f.events)if(['success','perfect','miss'].includes(e.result)&&!fx.seen.has(e)){fx.seen.add(e);fxEvent(fx,e.result);if(e.type==='gust'&&e.result!=='miss')fxEvent(fx,'boost');}
 if(f.landed&&!fx.landed)fxEvent(fx,'land',{speed:prev?Math.hypot(prev.vx,prev.vy):0,text:num(f.x)+' m'});
}
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
 for(const m of [100,250,500])if(f.x>=m&&!seenMilestones.has(m)){seenMilestones.add(m);milestoneQueue.push(m);fxEvent(fx,'milestone');}
 if(banner&&f.t>=banner.until)banner=null;
 if(!e&&!banner&&milestoneQueue.length)banner={value:milestoneQueue.shift(),until:f.t+1.5};
 $('milestone-banner').hidden=!!e||!banner||f.landed;
 if(banner)$('milestone-banner').textContent='★ '+banner.value+' m · '+(banner.value===500?'Obzor je tvůj!':'Další kus cesty za tebou');
 const district=districtAt(f.x).index;if(district!==lastDistrict){lastDistrict=district;districtUntil=f.t+1.5;}
 $('scene-label').classList.toggle('district-highlight',f.t<districtUntil);
}
refresh();tick();






