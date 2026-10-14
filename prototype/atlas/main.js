// Klikací prototyp Atlasu (A1). Falešná data, žádný import ze src/. Vykresluje DOM jen při změně stavu.
import {PLACES,BONUSES,SPECIALS,NODES,DISTRICTS,PAPERS,VERBS,TAGS} from './content.js';
import {numbers,placeStart,FINISH,PROVISIONAL,PREVIEW_THROWS} from './numbers.js';
import {postcard,skyline,portrait,DEFS,PAL} from './art.js';
import * as L from './logic.js';
const {t,fmtCoins,fmtMeters,fmtNum,fmtPct,fmtList,goalText}=L;
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const coin=(n,cls='')=>`<span class="coin ${cls}" aria-label="${esc(t('wallet.aria',{count:n}))}"><span aria-hidden="true">${esc(fmtCoins(n))}</span></span>`;
const coinText=n=>fmtCoins(n);
// Atlas a pod ním falešná hra se objeví od prvního místa (Glider), práh = placeStart(0) z numbers.js
const atlasOpen=p=>p.best>=placeStart(0);

// ---------- jazyk (?lang=en|cs, výchozí EN) a statické texty HTML (data-i18n, data-i18n-aria) ----------
const Q=new URLSearchParams(location.search);
L.setLang((Q.get('lang')??'en').trim().toLowerCase());
document.documentElement.lang=L.getLang();document.title=t('meta.title');
document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
document.querySelectorAll('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.i18nAria));});

// ---------- volby (otevřené otázky §9 + čísla) ----------
const opts={mode:Q.get('mode')??'panel',teaserBonus:Q.get('teaser')!=='hidden',lines:Q.get('lines')??'heard',dot:Q.get('dot')??'novelty',
 autopilot:Q.get('autopilot')??'atlas',long:Q.has('long'),scale:Q.has('incremental')?100:1,coinMult:Q.has('coinmult'),preview:Q.get('preview')??'real',motion:Q.get('motion')??'system'};
let N=numbers(opts);

// ---------- scénáře (falešný save v4) ----------
const fresh=()=>({best:0,coins:0,throws:0,lastThrow:0,atlas:{levels:{},seen:[],pending:[],pockets:{owned:0,slots:[null,null]},nodes:{},auto:{},finished:false,hintOpens:0,undo:null}});
const SCEN={
 empty:{label:'Before 100 m (40 m, link #atlas)',best:40,coins:14,throws:2},
 first:{label:'First open (112 m, Glider found)',best:112,coins:64,throws:4},
 suburbs:{label:'Violet Suburbs (560 m)',best:560,coins:240,throws:12,seen:['roofs','market'],levels:{chain:1}},
 docks:{label:'Moon Docks (2,010 m, Pocket 1)',best:2010,coins:820,throws:41,seen:['roofs','market','gardens','railway','warehouses','cranes'],levels:{chain:2,pinwheel:1,steam:1,tape:1},owned:1,slots:['cushion',null],hint:4,nodes:{autoBasic:true}},
 horizon:{label:'Red Horizon (3,420 m, Pocket 2 visible)',best:3420,coins:6400,throws:72,seen:['roofs','market','gardens','railway','warehouses','cranes','bridge','lighthouse','fields','ridge','saddle'],levels:{chain:2,pinwheel:2,steam:2,tape:2,crane:1,skip:1,gull:2,momentum:1},owned:1,slots:['dive','sharp'],hint:9},
 core:{label:'Neon Core (4,700 m)',best:4700,coins:9800,throws:101,seen:PLACES.slice(0,15).map(p=>p.id),levels:{chain:2,pinwheel:2,steam:2,tape:2,crane:2,skip:2,gull:2,momentum:2,thermal:1,echo:2,star:1,drone:1},owned:2,slots:['rocket','calm'],hint:12},
 delivered:{label:'Delivered (finished)',best:4910,coins:22400,throws:112,seen:PLACES.map(p=>p.id),levels:{chain:2,pinwheel:2,steam:2,tape:2,crane:2,skip:2,gull:2,momentum:2,thermal:2,echo:2,star:1,drone:1,paperCrane:1,onAir:1},owned:2,slots:['dive','sharp'],hint:15,finished:true},
};
function scenario(id){const s=SCEN[id],p=fresh();Object.assign(p,{best:s.best,coins:s.coins,throws:s.throws,lastThrow:Math.round(s.best*.92)});
 Object.assign(p.atlas,{seen:[...(s.seen??[])],levels:{...(s.levels??{})},hintOpens:s.hint??0,finished:!!s.finished,nodes:{...(s.nodes??{})}});
 p.atlas.pockets={owned:s.owned??0,slots:[...(s.slots??[null,null])]};return p;}
const S={scen:SCEN[Q.get('scenario')]?Q.get('scenario'):'suburbs',p:null,sel:null,focusI:0,revealed:new Set(),night:false,hintOpen:false,sheet:false,result:null,from:null};
S.p=scenario(S.scen);S.p.atlas.seen.forEach(id=>S.revealed.add(id));
const isTwoCol=()=>matchMedia('(min-width: 760px), (orientation: landscape) and (max-height: 560px)').matches;
const reduced=()=>opts.motion==='reduce'||(opts.motion==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const applyMotion=()=>{document.documentElement.dataset.motion=reduced()?'reduce':'full';};

// ---------- DOM kostra ----------
document.body.insertAdjacentHTML('afterbegin',DEFS);
const atlas=$('#atlas'),map=$('#atlas-map'),detail=$('#atlas-detail'),sheetEl=$('#atlas-sheet'),toasts=$('#atlas-toasts');

// ---------- hlavička, cíl, kapsy ----------
let shownCoins=null;
function renderTop(){const p=S.p,g=L.nextGoal(p),gp=L.goalParts(g);
 const w=$('#atlas-wallet');w.setAttribute('aria-label',t('wallet.aria',{count:p.coins}));tweenWallet(p.coins);
 $('#atlas-goal').innerHTML=g.delivered?`<span class="goal-delivered">${esc(gp.text)}</span>`:`<b>${esc(gp.label)}</b> ${esc(gp.text)}`;
 const showRule=p.atlas.hintOpens<=3||S.hintOpen;
 $('#atlas-rule').hidden=!showRule;$('#atlas-rule-btn').hidden=p.atlas.hintOpens<=3;$('#atlas-rule-btn').setAttribute('aria-expanded',String(showRule));
 $('#atlas-autonote').hidden=opts.autopilot!=='workshop'||!atlasOpen(p);
 renderPockets();}
function tweenWallet(to){const el=$('#atlas-wallet-n');if(shownCoins==null||reduced()){shownCoins=to;el.textContent=coinText(to);return;}
 const from=shownCoins;shownCoins=to;if(from===to){el.textContent=coinText(to);return;}const t0=performance.now();
 const step=now=>{const k=Math.min(1,(now-t0)/400),e=1-Math.pow(1-k,3);el.textContent=coinText(Math.round(from+(to-from)*e));if(k<1&&shownCoins===to)requestAnimationFrame(step);};requestAnimationFrame(step);}
function renderPockets(){const p=S.p,box=$('#atlas-pockets'),pk=p.atlas.pockets;
 if(!atlasOpen(p)){box.hidden=true;return;}box.hidden=false;
 let h='';for(let k=0;k<2;k++){
  if(!L.pocketVisible(p,N,k))continue;
  if(k<pk.owned){const id=pk.slots[k],sp=id&&SPECIALS[id];
   h+=`<button class="pocket owned${id?'':' empty'}" data-pocket="${k}" aria-label="${esc(t('pocket.aria',{n:k+1,content:sp?sp.name:t('pocket.empty')}))}">
    <span class="pocket-n">${esc(t('pocket.name',{n:k+1}))}</span><span class="pocket-v">${sp?`<span class="verb">${esc(VERBS[sp.verb])}</span> ${esc(sp.name)}`:esc(t('pocket.empty'))}</span></button>`;}
  else if(k===pk.owned){const c=N.pocketPrice(k),can=p.coins>=c;
   h+=`<button class="pocket locked" data-buy-pocket="${k}" ${can?'':'aria-disabled="true"'}><span class="pocket-n">${esc(t('pocket.name',{n:k+1}))}</span><span class="pocket-v">${can?esc(t('button.openPocket',{price:coinText(c)})):esc(t('button.toGo',{price:coinText(c-p.coins)}))}</span></button>`;}
  else h+=`<div class="pocket future"><span class="pocket-n">${esc(t('pocket.locked',{n:k+1,price:coinText(N.pocketPrice(k))}))}</span></div>`;}
 box.innerHTML=h;}

// ---------- mapa ----------
function cardHTML(st,cols){const pl=PLACES[st.i],b=BONUSES[pl.bonus],d=pl.district,dc=PAL[d];
 const tab=st.i===S.focusI?0:-1;
 if(st.state==='unknown')return `<li><button class="pc unknown" data-i="${st.i}" tabindex="${tab}" aria-disabled="true" aria-label="${esc(t('card.unknownAria'))}"><span class="pc-art"><span class="q" aria-hidden="true">${esc(t('card.unknown'))}</span></span><span class="pc-cap"><span class="pc-name">${esc(t('card.unknown'))}</span></span></button></li>`;
 if(st.state==='teaser'){const bon=opts.teaserBonus?b.name:t('card.unknown');
  return `<li><button class="pc teaser" data-i="${st.i}" tabindex="${tab}" aria-label="${esc(`${pl.name}. ${t('teaser.distance',{m:fmtMeters(st.metersToGo)})}. ${opts.teaserBonus?b.name:''}`)}">
   <span class="pc-art">${postcard(pl.kind,d,{mode:'silhouette'})}<span class="flag">${esc(t('label.next'))}</span></span>
   <span class="pc-cap"><span class="pc-name">${esc(pl.name)}</span><span class="pc-meta">${esc(t('teaser.distance',{m:fmtMeters(st.metersToGo)}))}</span><span class="pc-bonus shadow">${esc(bon)}</span></span></button></li>`;}
 const lv=st.level,max=st.max,isLast=PLACES.findIndex((_,k)=>!L.isFound(S.p.best,k))===st.i+1||(st.i===15&&S.p.best>=placeStart(15));
 let pips='';if(!st.unlevelled){pips=max<=5?`<span class="pips" aria-hidden="true">${Array.from({length:max},(_,k)=>`<i class="${k<lv?'on':''}${k===lv-1&&S.justLevel===st.i?' pop':''}"></i>`).join('')}</span>`:`<span class="bar" aria-hidden="true"><i style="width:${lv/max*100}%"></i></span>`;
  pips+=`<span class="lv">${st.state==='max'?`<svg class="crown" viewBox="0 0 16 12" aria-hidden="true"><path d="M1 11 2 3l4 4 2-6 2 6 4-4 1 8Z"/></svg>${esc(t('label.maxCrown'))}`:esc(max<=5?t('label.level',{n:lv}):t('label.levelOf',{n:lv,max}))}</span>`;}
 else if(pl.bonus==='encore')pips=`<span class="lv">${esc(S.p.atlas.finished?t('label.delivered'):t('card.encoreLocked'))}</span>`;
 else pips=`<span class="lv">${esc(VERBS.model)}</span>`;
 const reveal=!S.revealed.has(pl.id);
 const aria=`${pl.name}. ${b.name}${st.unlevelled?'':`, ${t('label.levelOf',{n:lv,max})}`}${st.state==='max'?`, ${t('label.maxCrown')}`:''}${st.isNew?`. ${t('label.new')}`:''}`;
 return `<li><button class="pc ${st.state}${reveal?' reveal':''}" data-i="${st.i}" tabindex="${tab}" aria-label="${esc(aria)}" ${S.sel?.i===st.i?'aria-current="true"':''}>
  <span class="pc-art"><span class="sil">${postcard(pl.kind,d,{mode:'silhouette'})}</span><span class="col">${postcard(pl.kind,d,{night:S.night})}</span>${st.isNew?`<span class="sticker">${esc(t('label.new'))}</span>`:''}${pl.bonus==='encore'&&S.p.atlas.finished?`<span class="stamp">${esc(t('delivered.stamp'))}</span>`:''}</span>
  <span class="pc-cap"><span class="pc-name">${esc(pl.name)}</span><span class="pc-bonus">${esc(b.name)}</span><span class="pc-lv">${pips}</span>${isLast?`<span class="best"><svg viewBox="0 0 20 10" aria-hidden="true"><path d="M1 6 19 1 6 9 7 6Z"/></svg>${esc(t('label.yourBest',{m:fmtMeters(S.p.best)}))}</span>`:''}</span></button></li>`;}
function renderMap(){const p=S.p,st=L.placeStates(p,N),keepFocus=map.contains(document.activeElement)&&document.activeElement.matches('.pc');
 let h='';
 if(p.best<placeStart(0))h+=`<p class="empty-atlas">${esc(t('empty.atlas',{m:L.fmtMeters(placeStart(0))}))}</p>`;
 DISTRICTS.forEach((D,d)=>{const reached=L.districtReached(p.best,d),cards=st.filter(s=>PLACES[s.i].district===d);
  const shown=reached||cards.some(c=>c.state==='teaser');
  const found=cards.filter(c=>['found','level','max'].includes(c.state)).length;
  h+=`<section class="district ${reached?'reached':'frame'}" data-d="${d}" style="--dc:${PAL[d].route}" aria-labelledby="dh-${d}">
   <header class="d-head"><h2 id="dh-${d}"><span class="d-num" aria-hidden="true">${d+1}</span><span class="d-name">${esc(D.name)}</span></h2>
   ${reached?`<span class="d-count">${esc(t('label.found',{found,total:4}))}</span>`:''}${reached&&opts.coinMult&&N.coinMult[d]>1?`<span class="d-mult">${esc(t('label.coinMult',{x:N.coinMult[d]}))}</span>`:''}
   ${d===3&&p.atlas.finished?`<span class="d-stamp">${esc(t('delivered.stamp'))}</span>`:''}</header>`;
  if(!shown){h+=`<div class="frame-art" role="img" aria-label="${esc(t('card.frameAria',{district:D.name}))}">${skyline(d)}</div><p class="frame-line">${esc(D.frame)}</p></section>`;return;}
  if(!reached){h+=`<p class="frame-line">${esc(D.frame)}</p>`;}
  h+=`<ul class="cards" role="list">${cards.filter(c=>reached||c.state==='teaser').map(c=>cardHTML(c)).join('')}</ul>`;
  const nodes=L.visibleNodes(p,opts).filter(n=>n.district===d&&n.kind==='autopilot');
  if(nodes.length)h+=`<ul class="nodes" role="list">${nodes.map(n=>`<li><button class="node${n.owned?' owned':''}" data-node="${n.id}" ${S.sel?.node===n.id?'aria-current="true"':''}><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 3v7l5 3"/></svg><span class="node-name">${esc(n.name)}</span><span class="node-v">${n.owned?esc(n.on?t('label.on'):t('label.off')):esc(coinText(N.nodePrice(n.id)))}</span></button></li>`).join('')}</ul>`;
  const heard=L.linesHeard(p.best,d);
  if(reached&&opts.lines==='heard'&&heard){const c=D.character;
   h+=`<footer class="d-foot"><div class="who">${portrait(d)}<p><b>${esc(c.name)}</b><span>${esc(c.role)}</span></p></div>
    <h3 class="sr-only">${esc(t('label.heard',{name:c.name}))}</h3><ul class="lines" role="list">${c.lines.slice(0,heard).map(l=>`<li class="bubble">${esc(l)}</li>`).join('')}</ul>
    <p class="locals"><span>${esc(t('label.locals'))}:</span> <span class="chip">${esc(D.locals.bird)}</span> <span class="chip">${esc(D.locals.gust)}</span></p></footer>`;}
  h+='</section>';});
 map.querySelector('.route').innerHTML=h;
 // odhalení (tisk pohlednice) jen jednou
 const rv=[...map.querySelectorAll('.pc.reveal')];if(rv.length){rv.forEach(el=>{const id=PLACES[+el.dataset.i].id;S.revealed.add(id);});
  if(reduced())rv.forEach(el=>el.classList.remove('reveal'));else requestAnimationFrame(()=>rv.forEach(el=>el.classList.add('go')));}
 S.justLevel=null;
 if(keepFocus)focusCard(S.focusI,false);}

// ---------- detail ----------
function previewLine(i){const pl=PLACES[i],b=BONUSES[pl.bonus],p=S.p,lv=L.levelOf(p,i);
 if(opts.preview==='none'||!b.preview)return t('preview.none');
 if(b.preview==='crane')return t('preview.crane',{count:lv,last:PREVIEW_THROWS});
 if(b.preview==='star')return t('preview.star',{pct:fmtPct(.03+lv*.01)});
 if(b.preview==='tape')return t('preview.tape',{count:2,m:fmtMeters(16+lv*8)});
 const m=Math.round(10+i*4+lv*6),end=p.lastThrow+m,past=PLACES.findIndex((_,k)=>placeStart(k)>p.lastThrow&&placeStart(k)<=end);
 return past>=0?t('preview.distance',{m:'+'+fmtMeters(m),place:PLACES[past].name}):t('preview.distanceNoPlace',{m:'+'+fmtMeters(m)});}
const effHTML=(id,vals)=>L.effectLine(id,vals).map(s=>`<span class="eff-s">${s.map(x=>x.num!=null?`<b class="num">${esc(x.num)}</b>`:esc(x.text)).join('')}</span>`).join(' ');
function tagsHTML(b){return `<ul class="tags" role="list"><li class="verb">${esc(VERBS[b.verb])}</li>${b.tags.map(k=>`<li class="tag">${esc(TAGS[k])}</li>`).join('')}</ul>`;}
function renderDetail(){const p=S.p,sel=S.sel;
 if(!sel){detail.innerHTML=`<div class="detail-empty"><p>${esc(t('empty.detail'))}</p></div>`;return;}
 if(sel.node)return renderNode(sel.node);
 const i=sel.i,pl=PLACES[i],b=BONUSES[pl.bonus],d=pl.district,st=L.placeStates(p,N)[i],dname=DISTRICTS[d].name;
 let art='',body='',bar='';
 const head=`<p class="dt-place">${esc(pl.name)} · <span>${esc(t('label.placeOf',{district:dname,n:i%4+1}))}</span></p>`;
 if(st.state==='teaser'){
  art=`<div class="dt-art sil">${postcard(pl.kind,d,{mode:'silhouette'})}</div>`;
  body=`<p class="dt-place">${esc(t('label.placeOf',{district:dname,n:i%4+1}))}</p><h3 class="dt-bonus" id="dt-title">${esc(pl.name)}</h3><p class="dt-teaser">${esc(pl.teaser)}</p><p class="dt-dist"><b>${esc(t('teaser.distance',{m:fmtMeters(st.metersToGo)}))}</b></p>
   <div class="dt-shadow">${opts.teaserBonus?`<span class="shadow-icon" aria-hidden="true">?</span><p><b>${esc(b.name)}</b> · ${esc(b.pitch)}</p>`:`<span class="shadow-icon" aria-hidden="true">?</span><p>${esc(t('teaser.bonusHidden'))}</p>`}</div>`;
 }else if(st.state==='unknown'){return;}
 else{
  const lv=st.level,max=st.max,cost=L.nextCost(p,N,i),u=p.atlas.undo;
  art=`<div class="dt-art loop" data-kind="${pl.kind}" data-d="${d}">${postcard(pl.kind,d,{frame:0,night:S.night})}</div>`;
  body=`${head}<h3 class="dt-bonus" id="dt-title">${esc(b.name)}</h3>${tagsHTML(b)}<p class="dt-pitch">${esc(p.atlas.finished&&b.pitchDone?b.pitchDone:b.pitch)}</p>`;
  if(pl.bonus==='glider')body+=`<p class="dt-note">${esc(t('card.gliderNote'))}</p><a class="link" href="#workshop" data-workshop>${esc(t('button.workshopLink'))} →</a>`;
  else if(pl.bonus==='encore'){
   if(!p.atlas.finished)body+=`<p class="dt-note lock">${esc(t('card.encoreLocked'))}</p>`;
   else{const nr=p.atlas.nodes.nightRoute,c=N.nodePrice('nightRoute');
    body+=`<button class="btn" data-summary>${esc(t('button.summary'))}</button>
     <div class="node-box" data-d="3"><h4>${esc(NODES.nightRoute.name)}</h4><p>${esc(NODES.nightRoute.pitch)}</p><p class="dim">${esc(t('node.nightNote'))}</p>
     ${nr?`<div class="seg" role="group" aria-label="${esc(NODES.nightRoute.name)}"><button class="btn sm" aria-pressed="${!S.night}" data-night="0">${esc(t('label.day'))}</button><button class="btn sm" aria-pressed="${S.night}" data-night="1">${esc(t('label.night'))}</button></div>`:''}</div>`;
    if(!nr)bar=p.coins>=c?`<button class="btn buy" data-buy-node="nightRoute">${esc(t('button.unlock',{price:coinText(c)}))}</button>`:`<button class="btn togo" aria-disabled="true">${esc(t('button.toGo',{price:coinText(c-p.coins)}))}</button>`;}}
  else{
   const now=N.value(pl.bonus,lv),next=lv<max?N.value(pl.bonus,lv+1):null;
   body+=`<div class="eff"><p class="eff-row"><span class="eff-k">${esc(t('label.now'))} · ${esc(max<=5?t('label.level',{n:lv}):t('label.levelOf',{n:lv,max}))}</span>${effHTML(pl.bonus,now)}</p>
    ${next?`<p class="eff-row next"><span class="eff-k">${esc(t('label.nextLevel',{n:lv+1}))}</span>${effHTML(pl.bonus,next)}</p>`:''}</div>
    <div class="preview"><span class="eff-k">${esc(t('label.preview'))}</span><p>${esc(previewLine(i))}</p></div>`;
   if(pl.opensPaper)body+=`<a class="link" href="#workshop" data-workshop>${esc(t('button.paperLink',{paper:PAPERS[pl.opensPaper]}))} →</a>`;
   body+=`<p class="dt-story">${esc(pl.story)}</p>
    <details class="more"><summary>${esc(t('button.more'))}</summary><table><tbody>${Array.from({length:max},(_,k)=>`<tr${k+1===lv?' class="cur"':''}><th scope="row">${esc(t('label.level',{n:k+1}))}</th><td>${esc(L.effectText(pl.bonus,N.value(pl.bonus,k+1)))}</td><td class="num">${k===0?esc(t('label.free')):esc(coinText(N.price(pl.bonus,d,k)))}</td></tr>`).join('')}</tbody></table>${PROVISIONAL?`<p class="dim">${esc(t('label.provisional'))}</p>`:''}</details>`;
   if(u?.kind==='level'&&u.i===i)bar=`<button class="btn undo" data-undo>${esc(t('button.undo'))}</button>`;
   if(cost==null)bar=`<button class="btn max" aria-disabled="true"><svg class="crown" viewBox="0 0 16 12" aria-hidden="true"><path d="M1 11 2 3l4 4 2-6 2 6 4-4 1 8Z"/></svg>${esc(t('button.max'))}</button>`+bar;
   else if(p.coins>=cost)bar=`<button class="btn buy" data-buy="${i}">${esc(t('button.levelUp',{price:coinText(cost)}))}</button>`+bar;
   else bar=`<button class="btn togo" aria-disabled="true">${esc(t('button.toGo',{price:coinText(cost-p.coins)}))}</button>`+bar;}}
 detail.innerHTML=`<div class="dt-scroll">${art}<div class="dt-body">${body}</div></div>${bar?`<div class="dt-bar">${bar}</div>`:''}`;
 startLoop();}
function renderNode(id){const p=S.p,n=NODES[id],owned=!!p.atlas.nodes[id],on=p.atlas.auto[id]!==false,c=N.nodePrice(id);
 detail.innerHTML=`<div class="dt-scroll"><div class="dt-body"><p class="dt-place">${esc(DISTRICTS[n.district].name)}</p><h3 class="dt-bonus" id="dt-title">${esc(n.name)}</h3>
  <ul class="tags" role="list"><li class="verb">${esc(VERBS.passive)}</li><li class="tag">${esc(TAGS.miss)}</li></ul><p class="dt-pitch">${esc(n.pitch)}</p><p class="dt-note">${esc(t('node.autopilotRule'))}</p>
  ${owned?`<div class="seg" role="group" aria-label="${esc(n.name)}"><button class="btn sm" aria-pressed="${on}" data-auto="${id}" data-v="1">${esc(t('label.on'))}</button><button class="btn sm" aria-pressed="${!on}" data-auto="${id}" data-v="0">${esc(t('label.off'))}</button></div>`:''}
  <p class="dim">${esc(t('label.provisional'))}</p></div></div>
  ${owned?(p.atlas.undo?.kind==='node'&&p.atlas.undo.id===id?`<div class="dt-bar"><button class="btn undo" data-undo>${esc(t('button.undo'))}</button></div>`:''):`<div class="dt-bar">${p.coins>=c?`<button class="btn buy" data-buy-node="${id}">${esc(t('button.unlock',{price:coinText(c)}))}</button>`:`<button class="btn togo" aria-disabled="true">${esc(t('button.toGo',{price:coinText(c-p.coins)}))}</button>`}</div>`}`;}
// smyčka tří snímků (desktop i otevřený sheet; reduced motion = statický 1. snímek)
let loopT=null;function startLoop(){clearInterval(loopT);const el=detail.querySelector('.dt-art.loop');if(!el||reduced())return;let f=0;
 loopT=setInterval(()=>{if(!document.contains(el)){clearInterval(loopT);return;}f=(f+1)%3;const pl=PLACES[S.sel.i];el.innerHTML=postcard(pl.kind,pl.district,{frame:f,night:S.night});},420);}

// ---------- výběr, sheet, fokus ----------
function select(sel,{focusDetail=true}={}){S.sel=sel;
 if(sel?.i!=null){S.focusI=sel.i;const id=PLACES[sel.i].id;if(!S.p.atlas.seen.includes(id)&&L.isFound(S.p.best,sel.i))S.p.atlas.seen.push(id);}
 renderMap();renderDetail();renderNotice();
 if(!isTwoCol())openSheet();
 if(focusDetail){const h=detail.querySelector('#dt-title');if(h){h.tabIndex=-1;h.focus({preventScroll:!isTwoCol()?false:true});}}}
function openSheet(){if(S.sheet)return;S.sheet=true;atlas.classList.add('sheet-open');sheetEl.setAttribute('role','dialog');sheetEl.setAttribute('aria-modal','true');sheetEl.setAttribute('aria-labelledby','dt-title');map.inert=true;$('.atlas-top').inert=true;
 history.pushState({atlas:true,sheet:true},'',location.pathname+location.search+'#atlas/'+(S.sel?.i!=null?PLACES[S.sel.i].id:S.sel?.node??''));}
function closeSheet(fromPop=false){if(!S.sheet)return;S.sheet=false;atlas.classList.remove('sheet-open');sheetEl.removeAttribute('aria-modal');sheetEl.removeAttribute('role');map.inert=false;$('.atlas-top').inert=false;
 const back=S.sel?.i;S.sel=null;clearInterval(loopT);if(!fromPop)history.back();renderMap();
 if(back!=null)focusCard(back);else map.querySelector('.node')?.focus();}
function focusCard(i,scroll=true){const el=map.querySelector(`.pc[data-i="${i}"]`);if(!el)return;map.querySelectorAll('.pc').forEach(b=>b.tabIndex=-1);el.tabIndex=0;S.focusI=i;el.focus({preventScroll:true});
 // posun jen uvnitř mapy (scrollIntoView by posunul i dialog a schoval hlavičku)
 if(scroll){const r=el.getBoundingClientRect(),m=map.getBoundingClientRect();if(r.top<m.top+8)map.scrollTop-=m.top+8-r.top;else if(r.bottom>m.bottom-8)map.scrollTop+=r.bottom-m.bottom+8;}
 atlas.scrollTop=0;}
map.addEventListener('keydown',e=>{const el=e.target.closest('.pc');if(!el)return;
 const all=[...map.querySelectorAll('.pc')],k=all.indexOf(el),ul=el.closest('.cards'),cols=getComputedStyle(ul).gridTemplateColumns.split(' ').length;
 const mv={ArrowRight:1,ArrowLeft:-1,ArrowDown:cols,ArrowUp:-cols,Home:-k,End:all.length-1-k}[e.key];
 if(mv!=null){e.preventDefault();const n=all[Math.max(0,Math.min(all.length-1,k+mv))];focusCard(+n.dataset.i);}});

// ---------- akce ----------
function toast(msg,undo=false){const el=document.createElement('div');el.className='toast';el.innerHTML=`<span>${esc(msg)}</span>${undo?`<button class="btn sm" data-undo>${esc(t('button.undoShort'))}</button>`:''}`;
 toasts.append(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),reduced()?150:250);},undo?5000:3200);}
function rerender(){renderTop();renderMap();renderDetail();renderNotice();renderResult();}
atlas.addEventListener('click',e=>{const p=S.p,b=e.target.closest('button,a');if(!b)return;
 if(b.matches('.pc')){if(b.getAttribute('aria-disabled')==='true')return;select({i:+b.dataset.i});return;}
 if(b.matches('[data-node]')){select({node:b.dataset.node});return;}
 if(b.hasAttribute('data-buy')){const i=+b.dataset.buy,id=PLACES[i].bonus;if(L.upgrade(p,N,i)){S.justLevel=i;rerender();toast(t('toast.levelUp',{bonus:BONUSES[id].name,n:L.levelOf(p,i)}),true);detail.querySelector('[data-undo]')?.focus();}return;}
 if(b.hasAttribute('data-undo')){toasts.querySelectorAll('.toast').forEach(x=>x.querySelector('[data-undo]')&&x.remove());const u=L.undoLast(p);if(u){rerender();toast(t('toast.undone',{price:coinText(u.price)}));detail.querySelector('.btn.buy,.btn.togo')?.focus();}return;}
 if(b.hasAttribute('data-buy-pocket')){if(b.getAttribute('aria-disabled')==='true')return;const k=+b.dataset.buyPocket;if(L.buyPocket(p,N)){rerender();toast(t('toast.pocketOpen',{n:k+1}),true);openPicker(k);}return;}
 if(b.hasAttribute('data-pocket')){openPicker(+b.dataset.pocket);return;}
 if(b.hasAttribute('data-buy-node')){const id=b.dataset.buyNode,c=N.nodePrice(id);if(p.coins>=c){p.coins-=c;p.atlas.nodes[id]=true;p.atlas.undo={kind:'node',id,price:c};rerender();toast(t('toast.unlocked',{node:NODES[id].name}),true);}return;}
 if(b.hasAttribute('data-auto')){p.atlas.auto[b.dataset.auto]=b.dataset.v==='1';rerender();toast(t(b.dataset.v==='1'?'toast.autopilotOn':'toast.autopilotOff',{node:NODES[b.dataset.auto].name}));return;}
 if(b.hasAttribute('data-night')){S.night=b.dataset.night==='1';rerender();return;}
 if(b.hasAttribute('data-summary')){openDelivered();return;}
 if(b.hasAttribute('data-workshop')){e.preventDefault();closeAtlas('workshop');return;}
 if(b.id==='atlas-close'){closeAtlas();return;}
 if(b.id==='atlas-to-workshop'){closeAtlas('workshop');return;}
 if(b.id==='atlas-throw'){closeAtlas('aim');return;}
 if(b.id==='sheet-close'){closeSheet();return;}
 if(b.id==='atlas-rule-btn'){S.hintOpen=!S.hintOpen;renderTop();return;}});
// tažení sheetu dolů (handle)
{let y0=null,dy=0;const h=$('#sheet-handle');
 h.addEventListener('pointerdown',e=>{if(!S.sheet||e.target.closest('button'))return;y0=e.clientY;h.setPointerCapture(e.pointerId);sheetEl.style.transition='none';});
 h.addEventListener('pointermove',e=>{if(y0==null)return;dy=Math.max(0,e.clientY-y0);sheetEl.style.transform=`translateY(${dy}px)`;});
 const end=()=>{if(y0==null)return;sheetEl.style.transition='';sheetEl.style.transform='';if(dy>90)closeSheet();y0=null;dy=0;};h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);}
atlas.addEventListener('cancel',e=>{e.preventDefault();if(S.sheet)closeSheet();else closeAtlas();});

// ---------- výběr kapsy ----------
const picker=$('#picker');
function openPicker(k){const p=S.p,cur=p.atlas.pockets.slots[k],reach=L.reachedDistrict(p.best);
 const item=id=>{const sp=SPECIALS[id],c=L.canEquip(p,k,id),sel=cur===id;
  return `<li><button class="sp${sel?' sel':''}" data-equip="${id}" ${c.ok?'':'aria-disabled="true"'} aria-pressed="${sel}" ${c.ok||sel?'':`aria-describedby="why-${id}"`}>
   <span class="sp-top"><span class="verb">${esc(VERBS[sp.verb])}</span><b>${esc(sp.name)}</b></span><span class="sp-t">${esc(sp.tradeoff)}</span>${!c.ok&&!sel?`<span class="why" id="why-${id}">${esc(c.reason)}</span>`:''}${sel?`<span class="why ok">${esc(t('reason.equipped'))}</span>`:''}</button></li>`;};
 const group=(active)=>{const ids=Object.keys(SPECIALS).filter(id=>SPECIALS[id].active===active),open=ids.filter(id=>L.specialUnlocked(p,id)),locked=ids.filter(id=>!L.specialUnlocked(p,id));
  const nextD=locked.length?Math.min(...locked.map(id=>SPECIALS[id].district)):null;
  return `<section><h3>${esc(active?t('pocket.active'):t('pocket.passive'))}</h3><p class="rule">${esc(active?t('pocket.activeRule'):t('pocket.passiveRule',{a:SPECIALS[L.EXCLUSIVE[0][0]].name,b:SPECIALS[L.EXCLUSIVE[0][1]].name}))}</p><ul role="list">${open.map(item).join('')}</ul>${nextD!=null?`<p class="more-in">${esc(t('pocket.moreIn',{district:DISTRICTS[nextD].name}))}</p>`:''}</section>`;};
 picker.innerHTML=`<div class="pk"><header><h2 id="pk-title">${esc(t('pocket.name',{n:k+1}))}: ${esc(t('pocket.pick'))}</h2><button class="btn icon" data-close aria-label="${esc(t('button.closeCard'))}">✕</button></header>
  <div class="pk-body">${group(true)}${group(false)}<p class="dim">${esc(t('pocket.swapFree'))}</p></div>
  ${cur?`<footer><button class="btn" data-unequip>${esc(t('button.emptyPocket'))}</button></footer>`:''}</div>`;
 picker.dataset.k=k;picker.setAttribute('aria-labelledby','pk-title');if(!picker.open)picker.showModal();picker.querySelector('.sp:not([aria-disabled])')?.focus();}
picker.addEventListener('click',e=>{const p=S.p,k=+picker.dataset.k,b=e.target.closest('button');if(!b){if(e.target===picker)picker.close();return;}
 if(b.hasAttribute('data-close')){picker.close();return;}
 if(b.hasAttribute('data-unequip')){p.atlas.pockets.slots[k]=null;picker.close();rerender();toast(t('toast.emptied',{n:k+1}));return;}
 if(b.hasAttribute('data-equip')){if(b.getAttribute('aria-disabled')==='true')return;const id=b.dataset.equip,old=p.atlas.pockets.slots[k];
  if(L.equip(p,k,id)){picker.close();rerender();toast(old?t('toast.swapped',{old:SPECIALS[old].name,special:SPECIALS[id].name}):t('toast.equipped',{special:SPECIALS[id].name,n:k+1}));}}});
picker.addEventListener('close',()=>{const k=picker.dataset.k;atlas.querySelector(`[data-pocket="${k}"],[data-buy-pocket="${k}"]`)?.focus();});

// ---------- otevření / zavření Atlasu ----------
const atlasBtn=$('#open-atlas');
function openAtlas(from='result'){S.from=from;const p=S.p;p.atlas.hintOpens++;S.hintOpen=false;
 const first=atlasOpen(p)&&!p.atlas.seen.length;
 if(opts.mode==='page'){document.body.classList.add('atlas-page');atlas.show();}else atlas.showModal();
 if(location.hash.indexOf('#atlas')!==0)history.pushState({atlas:true},'',location.pathname+location.search+'#atlas');
 S.sel=null;S.sheet=false;atlas.classList.remove('sheet-open');map.inert=false;$('.atlas-top').inert=false;
 // výchozí fokus: první otevření = Glider v detailu, jinak první novinka, teaser, nebo první karta
 const st=L.placeStates(p,N);const nw=st.find(s=>s.isNew),ts=st.find(s=>s.state==='teaser');S.focusI=(nw??ts??st[0]).i;
 renderTop();renderMap();
 if(first&&!isTwoCol()){S.sel={i:0};p.atlas.seen.push('roofs');renderMap();renderDetail();openSheet();detail.querySelector('#dt-title')?.focus();}
 else if(first||isTwoCol()&&nw){select({i:(nw??st[0]).i},{focusDetail:false});focusCard(S.focusI);}
 else{renderDetail();focusCard(S.focusI);}
 map.scrollTop=0;if(S.focusI>3)focusCard(S.focusI);renderNotice();}
function closeAtlas(to){if(S.sheet){S.sheet=false;atlas.classList.remove('sheet-open');map.inert=false;$('.atlas-top').inert=false;}
 clearInterval(loopT);atlas.close();document.body.classList.remove('atlas-page');
 if(location.hash.startsWith('#atlas'))history.replaceState(null,'',location.pathname+location.search);
 renderNotice();renderResult(to);atlasBtn.hidden?$('#throw-again').focus():atlasBtn.focus();}
addEventListener('popstate',()=>{if(!atlas.open)return;if(S.sheet)closeSheet(true);else if(!location.hash.startsWith('#atlas'))closeAtlas();});
atlasBtn.addEventListener('click',()=>openAtlas('result'));

// ---------- falešná hra: výsledek, hod, karta čtvrti, Delivered ----------
function renderNotice(){const on=L.atlasNotice(S.p,N,opts.dot);atlasBtn.classList.toggle('dot',on);atlasBtn.setAttribute('aria-label',on?t('atlas.buttonNew'):t('atlas.button'));atlasBtn.hidden=!atlasOpen(S.p);}
function renderResult(to){const r=S.result,box=$('#result-lines');
 const state=to==='aim'?t('proto.aiming'):to==='workshop'?t('proto.workshop'):'';
 $('#game-state').textContent=state;
 box.innerHTML=r?`<p class="r-dist">${esc(fmtMeters(r.d))}${r.newBest?` <span>${esc(t('result.newBest'))}</span>`:''}</p><p class="r-line">${esc(r.line)}</p>`:`<p class="r-dist">${esc(fmtMeters(S.p.lastThrow))}</p><p class="r-line">${esc(goalText(L.nextGoal(S.p)))}</p>`;
 $('#proto-state').textContent=`best ${fmtMeters(S.p.best)} · ${fmtCoins(S.p.coins)} · throws ${S.p.throws}`;}
function throwTo(d){const p=S.p,prev=p.best;d=Math.max(1,Math.round(d));p.throws++;p.lastThrow=d;L.clearUndo(p);
 p.coins+=Math.round((10+d/10)*(opts.coinMult?N.coinMult[L.reachedDistrict(Math.max(prev,d))]:1));
 const nb=d>prev;if(nb)p.best=d;
 const found=L.discoveries(prev,p.best);
 // jedna novinka za hod (priorita), ostatní do fronty
 p.atlas.pending.push(...found.filter(n=>n.kind==='place'));
 const big=found.find(n=>n.kind==='finale')??found.find(n=>n.kind==='district');
 let line;if(big?.kind==='finale'){p.atlas.finished=true;line=t('delivered.title');}
 else{const n=p.atlas.pending.shift();line=n?L.noveltyLine(n):goalText(L.nextGoal(p));}
 S.result={d,newBest:nb,line};renderResult();renderNotice();
 if(big?.kind==='finale')openDelivered();else if(big?.kind==='district')openDistrict(big.d);}
const dcard=$('#dcard'),deliv=$('#delivered');
function openDistrict(d){const D=DISTRICTS[d],pl=PLACES[d*4],specials=Object.entries(SPECIALS).filter(([,s])=>s.district===d).map(([,s])=>s.name);
 dcard.style.setProperty('--dc',PAL[d].route);
 dcard.innerHTML=`<div class="dc"><div class="dc-card"><div class="dc-art">${postcard(pl.kind,d)}</div><h2 class="dc-title" id="dc-title"><span>${esc(D.name)}</span></h2></div>
  <p class="dc-lead">${esc(t('district.lead',{district:D.name}))}</p>
  <figure class="dc-line"><div class="who">${portrait(d)}<figcaption><b>${esc(D.character.name)}</b><span>${esc(D.character.role)}</span></figcaption></div><blockquote class="bubble">${esc(D.character.lines[0])}</blockquote></figure>
  <ul class="dc-news" role="list">${specials.length?`<li>${esc(t('district.specials',{list:fmtList(specials)}))}</li>`:''}${d===N.pockets.secondFromDistrict?`<li>${esc(t('district.pocket2',{price:coinText(N.pocketPrice(1))}))}</li>`:''}</ul>
  <p class="dim">${esc(t('district.saved'))}</p>
  <div class="eq3"><button class="btn" data-keep>${esc(t('button.keepFlying'))}</button><button class="btn" data-atlas>${esc(t('button.openAtlas'))}</button><button class="btn" data-stop>${esc(t('button.doneForNow'))}</button></div></div>`;
 dcard.setAttribute('aria-labelledby','dc-title');dcard.showModal();const ct=dcard.querySelector('#dc-title');ct.tabIndex=-1;ct.focus();dcard.scrollTop=0;}
dcard.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;dcard.close();
 if(b.hasAttribute('data-atlas'))openAtlas('district');else if(b.hasAttribute('data-stop'))showStop();else $('#throw-again').focus();});
function openDelivered(){const p=S.p;p.atlas.finished=true;
 deliv.innerHTML=`<div class="dl"><h2 class="dl-title" id="dl-title">${esc(t('delivered.title'))}</h2><p class="dl-lead">${esc(t('delivered.lead'))}</p>
  <ol class="dl-grid" aria-label="${esc(t('delivered.gridAria',{count:PLACES.length}))}">${PLACES.map(pl=>`<li style="--dc:${PAL[pl.district].route}" title="${esc(pl.name)}">${postcard(pl.kind,pl.district)}<span class="sr-only">${esc(pl.name)}</span></li>`).join('')}</ol>
  <dl class="dl-stats"><div><dt>${esc(t('delivered.throws'))}</dt><dd>${fmtNum(p.throws||112)}</dd></div><div><dt>${esc(t('delivered.longest'))}</dt><dd>${esc(fmtMeters(Math.max(p.best,FINISH)))}</dd></div><div><dt>${esc(t('delivered.mostPlaces'))}</dt><dd>${fmtNum(5)}</dd></div><div><dt>${esc(t('delivered.bestCombo'))}</dt><dd>×${fmtNum(7)}</dd></div></dl>
  <h3>${esc(t('delivered.lastWords'))}</h3><ul class="dl-words" role="list">${DISTRICTS.map((D,d)=>`<li style="--dc:${PAL[d].route}"><div class="who">${portrait(d)}<b>${esc(D.character.name)}</b></div><p class="bubble">${esc(D.character.lines[2])}</p></li>`).join('')}</ul>
  <div class="eq2"><button class="btn" data-done>${esc(t('button.done'))}</button><button class="btn" data-keep>${esc(t('button.keepFlying'))}</button></div></div>`;
 deliv.setAttribute('aria-labelledby','dl-title');deliv.showModal();const dt=deliv.querySelector('#dl-title');dt.tabIndex=-1;dt.focus();deliv.scrollTop=0;rerender();}
deliv.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;deliv.close();if(b.hasAttribute('data-done'))showStop();});
function showStop(){$('#game-state').innerHTML=`<b>${esc(t('stop.title'))}</b> ${esc(t('stop.text'))}`;$('#throw-again').focus();}
$('#throw-again').addEventListener('click',()=>throwTo(+$('#ctl-dist').value||S.p.best+120));

// ---------- ovládání prototypu ----------
const ctl=$('#controls');
ctl.querySelector('#ctl-scen').innerHTML=Object.entries(SCEN).map(([k,v])=>`<option value="${k}"${k===S.scen?' selected':''}>${esc(v.label)}</option>`).join('');
const sync=()=>{for(const [k,v] of Object.entries({mode:opts.mode,teaser:opts.teaserBonus?'shown':'hidden',lines:opts.lines,dot:opts.dot,autopilot:opts.autopilot,preview:opts.preview,motion:opts.motion}))ctl.querySelectorAll(`[name="${k}"]`).forEach(r=>r.checked=r.value===v);
 ctl.querySelector('#ctl-long').checked=opts.long;ctl.querySelector('#ctl-inc').checked=opts.scale>1;ctl.querySelector('#ctl-mult').checked=opts.coinMult;
 $('#ctl-dist').value=Math.round(Math.min(FINISH+40,S.p.best+150));};
ctl.querySelectorAll('[name="lang"]').forEach(r=>r.checked=r.value===L.getLang());
ctl.addEventListener('change',e=>{const el=e.target;
 // jazyk: přenačtení s ?lang= (texty se neukládají do stavu, výsledek hodu by zůstal v původním jazyce)
 if(el.name==='lang'){const u=new URL(location.href);u.searchParams.set('lang',el.value);u.hash='';location.href=u.href;return;}
 if(el.id==='ctl-scen'){S.scen=el.value;S.p=scenario(el.value);S.revealed=new Set(S.p.atlas.seen);S.result=null;S.night=false;}
 else if(el.name==='mode')opts.mode=el.value;else if(el.name==='teaser')opts.teaserBonus=el.value==='shown';else if(el.name==='lines')opts.lines=el.value;
 else if(el.name==='dot')opts.dot=el.value;else if(el.name==='autopilot')opts.autopilot=el.value;else if(el.name==='preview')opts.preview=el.value;
 else if(el.name==='motion'){opts.motion=el.value;applyMotion();}
 else if(el.id==='ctl-long')opts.long=el.checked;else if(el.id==='ctl-inc')opts.scale=el.checked?100:1;else if(el.id==='ctl-mult')opts.coinMult=el.checked;
 N=numbers(opts);shownCoins=null;sync();renderResult();renderNotice();});
ctl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const p=S.p;
 if(b.id==='ctl-throw')throwTo(+$('#ctl-dist').value);
 if(b.dataset.add)throwTo(p.best+ +b.dataset.add);
 if(b.id==='ctl-next'){const g=L.nextGoal(p);throwTo(g.delivered?p.best+50:p.best+g.metersToGo+12);}
 if(b.id==='ctl-nextd'){const d=L.reachedDistrict(p.best)+1;throwTo(d<4?placeStart(d*4)+15:FINISH+20);}
 if(b.dataset.coins){p.coins+=+b.dataset.coins;renderResult();renderNotice();}
 if(b.id==='ctl-hash'){openAtlas('link');}
 if(b.id==='ctl-hint'){p.atlas.hintOpens=0;}
 if(b.id==='ctl-dcard')openDistrict(Math.max(1,L.reachedDistrict(p.best)));
 if(b.id==='ctl-deliv')openDelivered();
 sync();});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',applyMotion);
addEventListener('resize',()=>{if(!atlas.open)return;if(isTwoCol()&&S.sheet){S.sheet=false;atlas.classList.remove('sheet-open');map.inert=false;$('.atlas-top').inert=false;sheetEl.removeAttribute('aria-modal');sheetEl.removeAttribute('role');}});
applyMotion();sync();renderResult();renderNotice();
if(location.hash.startsWith('#atlas'))openAtlas('link');
window.__atlas={S,opts,openAtlas,closeAtlas,throwTo,openDistrict,openDelivered,openPicker};
