// 2D UI vrstva nad 3D scénou (canvas #game, logické 640×360 přes setTransform). Čisté vůči kontextu: dostane ctx 2D, testy s falešným ctx.
// Vlastní R2. QTE kruh 1:1 z render.js, štítky událostí (dřív atmosphere.js), částice, popupy a záblesk (dřív fx-render.js), rychlostní čáry
// (themes-verse.js), mířidla (dřív natvrdo v ui.js), uiScale pro mobil. Barvy jen z palette.js.
// plan = {t, view:{cam,px,py,ground,k}, fx:fxMap(...), ui:{qte, aim:{angle(°),held,charge}, labels:[eventView(e,t)], reduced, uiScale, palette}}.
import {activeEvent} from '../events.js';
import {palette,CYBER,DISPLAY} from './palette.js';
import {eventView} from './events-view.js';
import {fxMap,gustStrips,scrapAngle,scrapTone,SCRAP} from './fx-map.js';
import {t} from '../i18n.js';
// Papír (P3, plan.style 'papir' nebo ui.palette 'papir'; bible 05 kap. 7, 8, 11): QTE mezikruží krémové se stínem zvednutého papíru, štítky a popupy
// jako natočené papírové štítky, mířidla grafitová na krémové kartě, rychlostní čáry tenké grafitové, jiskry jako útržky papíru, poryv jako proužky.
const TAU=Math.PI*2,AIM_VIEW={cam:0,px:148,py:258,ground:300,k:1},DEG=Math.PI/180;
const isPaper=p=>p?.id==='papir';
const rgba=(h,a)=>`rgba(${[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',')},${a})`;
// Stín zvednutého papíru {color,alpha,blur,dx,dy} v logických px; shadow* canvasu jsou v px zařízení, proto × měřítko transformace.
export function lift(c,sh){const m=c.getTransform?.(),k=m?Math.hypot(m.a,m.b):1;c.shadowColor=rgba(sh.color,sh.alpha);c.shadowBlur=sh.blur*k;c.shadowOffsetX=sh.dx*k;c.shadowOffsetY=sh.dy*k;}
// Písmo na úzké obrazovce: 10px text v 640 logických px má na 360 css px jen 5,6 px; zvětší se, aby měl aspoň ~9 css px (strop 2×).
export const uiScale=cssWidth=>cssWidth>0?Math.min(2,Math.max(1,576/cssWidth)):1;
// Otřes (shakeCamera: x,y v logických px, roll v rad) kolem středu plátna, vždy uvnitř save/restore.
export function withShake(c,sh,draw){
 c.save();try{if(sh&&(sh.x||sh.y||sh.roll)){c.translate(320+sh.x,180+sh.y);c.rotate(sh.roll||0);c.translate(-320,-180);}draw();}finally{c.restore();}
}
export function drawUi(c,plan={},visual={}){
 const s=(c.canvas?.width||640)/640,ui=plan.ui??{},v=plan.view??AIM_VIEW,fx=plan.fx??{},reduced=ui.reduced??visual.reduced??false,t=plan.t??0,p=palette(ui.palette??plan.style),scale=ui.uiScale??1;
 c.setTransform(s,0,0,s,0,0);
 try{
  if(ui.clear!==false)c.clearRect(0,0,640,360);
  withShake(c,fx.shake,()=>{
   if(!reduced)drawSpeedLines(c,fx.speedLines,p);
   drawParticles(c,fx.particles,p,reduced);
   drawPopups(c,fx.popups,v,p,scale);
   for(const l of ui.labels??[])drawLabel(c,l,v,p,scale);
   if(ui.qte)drawQte(c,ui.qte,v,t,reduced,p);
  });
  if(!reduced)drawFlash(c,fx.flash,p);
  if(ui.aim)drawAim(c,ui.aim,v,p);
 }finally{c.setTransform(1,0,0,1,0,0);}
}
// Pohodlné sestavení plánu UI přímo z ui.js (než ho bude dávat planFrame): stejné vstupy, jaké dnes dostává render.js.
export function uiFrame({f=null,view=AIM_VIEW,fx=null,qte=null,aim=null,reduced=false,settings={},clock=0,t=0,cssWidth=640,metersPerPx}={}){
 const e=activeEvent(f);
 return {t,view,fx:fxMap(fx,view,{reduced,clock,settings,metersPerPx,vx:f?.vx??0,frame:t,flying:!!f&&!f.landed}),ui:{qte,aim,labels:e?[eventView(e,f.t)]:[],reduced,uiScale:uiScale(cssWidth)}};
}
// Tmavý podklad kruhu QTE (bible kap. 5.5: ink 60 % alfa) jako mezikruží ±QTE_BASE px kolem kruhu: střed zůstává volný, vlaštovka pod ním neztmavne (S1).
export const QTE_BASE=9;
// Tloušťky oblouků QTE (výchozí cyber 7 px; papír palette.qte.width 6 / 9 / 11) a poloměr papírové hvězdy perfektu (px).
export const QTE_WIDTH=Object.freeze({track:7,success:7,perfect:7}),QTE_STAR=8;
// Pěticípá hvězda vystřižená z papíru (bible 05 kap. 7, 11), vnitřní poloměr 0,45; edge = světlý řez okolo (odliší ji od oblouku stejné barvy).
export function star(c,x,y,r,color,edge){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;c[i?'lineTo':'moveTo'](x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();
 if(edge){c.strokeStyle=edge;c.lineWidth=3;c.lineJoin='round';c.stroke();}c.fillStyle=color;c.fill();}
// Časovací kruh kolem vlaštovky: tmavý podklad, šedá stopa, tyrkysový oblouk úspěchu, magenta perfekt, bílý bod průběhu; varování čárkovaně, výsledek jednou barvou.
export function drawQte(c,q,view=AIM_VIEW,time=0,reduced=false,p=CYBER){
 const k=p.qte,paper=isPaper(p),W=k.width??QTE_WIDTH,ring=eventView(q.type).ring,R=ring.r,px=view.px,py=view.py,start=-Math.PI/2,at=x=>start+x*TAU,
  arc=(from,to,color,width)=>{c.beginPath();c.arc(px,py,R,at(from),at(to));c.strokeStyle=color;c.lineWidth=width;c.stroke();};
 c.save();
 if(q.phase==='warning'||q.result||q.zones){const ga=c.globalAlpha;if(k.shadow){c.save();lift(c,k.shadow);}c.globalAlpha=ga*(k.discAlpha??.6);c.fillStyle=k.disc??p.popup.outline;c.beginPath();c.arc(px,py,R+QTE_BASE,0,TAU);c.arc(px,py,Math.max(0,R-QTE_BASE),0,TAU,true);c.fill();c.globalAlpha=ga;if(k.shadow)c.restore();}
 if(q.type==='gust'&&!q.result){
  if(paper){c.save();c.lineCap=c.lineJoin='round';for(const [color,w] of [[k.gustEdge,4],[k.gust,2]]){c.strokeStyle=color;c.lineWidth=w;c.beginPath();
   for(const s of gustStrips(px,py,time,reduced))s.forEach(([x,y],j)=>j?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}c.restore();}
  else for(let i=0;i<3;i++){const x=reduced?0:(time*3+i/3)%1;c.fillStyle=k.gust;c.fillRect(Math.round(px-70+x*40),Math.round(py-14+i*12),18,2);}}
 if(q.type==='bird'&&!q.held&&!q.result){const bob=reduced?0:Math.sin(time*8)*3;c.fillStyle=k.bird.body;c.fillRect(px+34,py-36+bob,14,8);c.fillStyle=k.bird.wing;c.fillRect(px+30,py-40-bob,8,4);c.fillRect(px+44,py-40-bob,8,4);c.fillStyle=k.bird.beak;c.fillRect(px+48,py-33+bob,4,2);}
 if(q.phase==='warning'){c.globalAlpha=reduced?.8:.5+.4*Math.sin(time*12);c.setLineDash([6,6]);arc(0,1,k.warning,3);}
 else if(q.result)arc(0,1,k.result[q.result]??k.result.other,5);
 else if(q.zones){arc(0,1,k.track,W.track);arc(q.zones.success[0],q.zones.success[1],k.success,W.success);arc(q.zones.perfect[0],q.zones.perfect[1],k.perfect,W.perfect);
  // papír: perfekt se od úspěchu liší i tvarem, rajčatová hvězda uprostřed perfektní výseče na kruhu (střed kruhu patří vlaštovce)
  if(paper){const m=at((q.zones.perfect[0]+q.zones.perfect[1])/2);star(c,px+Math.cos(m)*R,py+Math.sin(m)*R,QTE_STAR,k.perfect,k.disc);}
  const a=at(q.progress??0),x=px+Math.cos(a)*R,y=py+Math.sin(a)*R;c.fillStyle=k.dot;
  if(ring.marker==='dot'){c.beginPath();c.arc(x,y,4.5,0,TAU);c.fill();}
  else if(ring.marker==='diamond'){c.beginPath();c.moveTo(x,y-5);c.lineTo(x+5,y);c.lineTo(x,y+5);c.lineTo(x-5,y);c.closePath();c.fill();}
  else c.fillRect(Math.round(x-4),Math.round(y-4),8,8);}
 c.restore();
}
// Štítek události: přilétá zprava k vlaštovce jako v atmosphere.js (x = px + max(55, 190 − 68·age)).
export function drawLabel(c,l,view,p=CYBER,scale=1){
 if(!l?.label)return;const x=view.px+Math.max(55,190-(l.age??0)*68),y=Math.max(88,Math.min(245,view.py-12));
 c.save();c.font=`bold ${Math.round(10*scale)}px ${isPaper(p)?p.popup.font:DISPLAY}`;const w=c.measureText(l.label).width+12*scale,h=19*scale,lx=Math.round(Math.min(625-w,x-10));
 // papír: grafitová páska natočená o label.tilt (°) kolem středu štítku
 if(p.label.tilt){const cx=lx+w/2,cy=y-20-h/2;c.translate(cx,cy);c.rotate(p.label.tilt*DEG);c.translate(-cx,-cy);}
 c.fillStyle=p.label.bg;c.fillRect(lx,Math.round(y-20-h),w,h);c.fillStyle=p.label.text;c.fillText(l.label,lx+6*scale,y-20-6*scale);c.restore();
}
// Částice z fxMap (už v obrazovkových px): prach a jiskry jako čtverečky, větrná čárka 1 px vysoká.
// Papír: jiskry (1 perfekt, 2 úspěch, 4 hodnota) jako natočené útržky (fx-map scrapAngle), úspěch střídá barvu role a krém (bible 05 kap. 7).
export function drawParticles(c,list=[],p=CYBER,reduced=false){
 if(!list?.length)return;c.save();const paper=isPaper(p);
 for(const q of list){c.globalAlpha=q.alpha;c.fillStyle=p.particles[q.kind]??p.particles[0];
  if(paper&&(q.kind===1||q.kind===2||q.kind===4)){const w=q.size*SCRAP.grow,h=w*SCRAP.ratio;if(q.kind===2&&scrapTone(q))c.fillStyle=p.particles[0];
   c.save();c.translate(q.x,q.y);c.rotate(scrapAngle(q,reduced));c.fillRect(-w/2,-h/2,w,h);c.restore();}
  else if(q.kind===3)c.fillRect(Math.round(q.x),Math.round(q.y),q.size,1);else c.fillRect(q.x-q.size/2,q.y-q.size/2,q.size,q.size);}
 c.restore();
}
// Popupy sledují vlaštovku (px+20, py−30, land nad ní); rise/scale počítá fxMap (reduced = bez pohybu).
export function drawPopups(c,list=[],view=AIM_VIEW,p=CYBER,scale=1){
 if(!list?.length)return;c.save();c.textAlign='center';c.lineJoin='round';
 // papír: krémový štítek se stínem zvednutí, natočený střídavě o ±popup.tilt (°), text v barvě role bez obrysu
 if(p.popup.bg){c.textBaseline='middle';
  for(const q of list){const big=q.style==='perfect'||q.style==='land',land=q.style==='land',fs=Math.round((big?17:13)*q.scale*scale);
   c.globalAlpha=q.alpha;c.font=`bold ${fs}px ${p.popup.font}`;
   const x=Math.max(70,Math.min(570,view.px+(land?0:20))),y=view.py-(land?40:30)-q.rise-q.i*16*scale-fs*.35,w=c.measureText(q.text).width+fs*.8,h=fs*1.3;
   c.save();c.translate(x,y);c.rotate((q.i%2?1:-1)*(p.popup.tilt??0)*DEG);if(p.qte.shadow)lift(c,p.qte.shadow);c.fillStyle=p.popup.bg;c.fillRect(-w/2,-h/2,w,h);c.restore();
   c.save();c.translate(x,y);c.rotate((q.i%2?1:-1)*(p.popup.tilt??0)*DEG);c.fillStyle=p.popup[q.style]??p.popup.land;c.fillText(q.text,0,0);c.restore();}
  c.restore();return;}
 for(const q of list){const big=q.style==='perfect'||q.style==='land',land=q.style==='land';
  c.globalAlpha=q.alpha;c.font=`bold ${Math.round((big?17:13)*q.scale*scale)}px ${p.popup.font}`;
  const x=Math.max(70,Math.min(570,view.px+(land?0:20))),y=view.py-(land?40:30)-q.rise-q.i*16*scale;
  c.strokeStyle=p.popup.outline;c.lineWidth=4;c.strokeText(q.text,x,y);c.fillStyle=p.popup[q.style]??p.popup.land;c.fillText(q.text,x,y);}
 c.restore();
}
export function drawFlash(c,alpha,p=CYBER){if(!(alpha>0))return;c.save();c.globalAlpha=alpha;c.fillStyle=p.flash;c.fillRect(-20,-20,680,400);c.restore();}
// Komiksové rychlostní čáry [x,y,délka] (fxMap.speedLines): bílé tahy a polovina z nich s tmavým stínem.
export function drawSpeedLines(c,lines=[],p=CYBER){
 if(!lines?.length)return;c.save();c.strokeStyle=p.speed.line;c.lineCap='round';c.globalAlpha=.75;
 // papír: jen tenké grafitové čárky tužkou (speed.width px, alfa speed.alpha), bez druhé tušové linky
 if(p.speed.alpha!=null){c.globalAlpha=p.speed.alpha;c.lineWidth=p.speed.width??1;c.beginPath();for(const [x,y,len] of lines){c.moveTo(x,y);c.lineTo(x-len,y);}c.stroke();c.restore();return;}
 for(const [x,y,len] of lines){c.lineWidth=1+((x*7)%2);c.beginPath();c.moveTo(x,y);c.lineTo(x-len,y);c.stroke();}
 c.strokeStyle=p.speed.ink;c.globalAlpha=.5;c.lineWidth=1;c.beginPath();for(const [x,y,len] of lines.slice(0,lines.length>>1)){c.moveTo(x+12,y+3);c.lineTo(x+12-len*.6,y+3);}c.stroke();c.restore();
}
// Mířidla (dřív natvrdo v ui.js na 148,258): čárkovaná šipka z vlaštovky pod úhlem, delší s nabitím, panel s pokynem a lišta síly.
// aim = {angle (°), held, charge 0–1}; view = view(null), takže šipka vychází z promítnuté vlaštovky.
export function drawAim(c,aim,view=AIM_VIEW,p=CYBER){
 const k=p.aim,charge=aim.held?aim.charge??0:0,a=(aim.angle??15)*Math.PI/180,len=65+charge*45;
 c.save();c.translate(view.px,view.py);c.rotate(-a);c.strokeStyle=k.arrow;c.lineWidth=3;c.setLineDash([7,5]);c.beginPath();c.moveTo(12,0);c.lineTo(len,0);c.stroke();
 c.setLineDash([]);c.beginPath();c.moveTo(len-10,-6);c.lineTo(len,0);c.lineTo(len-10,6);c.stroke();c.restore();
 // papír: panel je krémová karta se stínem zvednutého papíru (bible 05 kap. 8)
 const paper=isPaper(p);if(paper){c.save();lift(c,p.qte.shadow);c.fillStyle=k.panel;c.fillRect(205,168,265,37);c.fillRect(205,211,265,14);c.restore();}
 c.save();c.fillStyle=k.panel;c.fillRect(205,168,265,37);c.fillStyle=k.text;c.font=`bold 13px ${paper?p.popup.font:DISPLAY}`;c.fillText(t(aim.held?'aim.panelHeld':'aim.panelIdle'),220,191);
 c.fillStyle=k.panel;c.fillRect(205,211,265,14);c.fillStyle=k.bar;c.fillRect(207,213,261*charge,10);c.strokeStyle=k.cap;c.lineWidth=1;c.strokeRect(449,212,19,12);c.restore();
}
