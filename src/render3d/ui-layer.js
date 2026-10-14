// 2D UI vrstva nad 3D scénou (canvas #game, logické 640×360 přes setTransform). Čisté vůči kontextu: dostane ctx 2D, testy s falešným ctx.
// Vlastní R2. QTE kruh 1:1 z render.js, štítky událostí (dřív atmosphere.js), částice, popupy a záblesk (dřív fx-render.js), rychlostní čáry
// (themes-verse.js), mířidla (dřív natvrdo v ui.js), uiScale pro mobil. Barvy jen z palette.js.
// plan = {t, view:{cam,px,py,ground,k}, fx:fxMap(...), ui:{qte, aim:{angle(°),held,charge}, labels:[eventView(e,t)], reduced, uiScale, palette}}.
import {activeEvent} from '../events.js';
import {palette,CYBER,DISPLAY} from './palette.js';
import {eventView} from './events-view.js';
import {fxMap} from './fx-map.js';
import {t} from '../i18n.js';
const TAU=Math.PI*2,AIM_VIEW={cam:0,px:148,py:258,ground:300,k:1};
// Písmo na úzké obrazovce: 10px text v 640 logických px má na 360 css px jen 5,6 px; zvětší se, aby měl aspoň ~9 css px (strop 2×).
export const uiScale=cssWidth=>cssWidth>0?Math.min(2,Math.max(1,576/cssWidth)):1;
// Otřes (shakeCamera: x,y v logických px, roll v rad) kolem středu plátna, vždy uvnitř save/restore.
export function withShake(c,sh,draw){
 c.save();try{if(sh&&(sh.x||sh.y||sh.roll)){c.translate(320+sh.x,180+sh.y);c.rotate(sh.roll||0);c.translate(-320,-180);}draw();}finally{c.restore();}
}
export function drawUi(c,plan={},visual={}){
 const s=(c.canvas?.width||640)/640,ui=plan.ui??{},v=plan.view??AIM_VIEW,fx=plan.fx??{},reduced=ui.reduced??visual.reduced??false,t=plan.t??0,p=palette(ui.palette),scale=ui.uiScale??1;
 c.setTransform(s,0,0,s,0,0);
 try{
  if(ui.clear!==false)c.clearRect(0,0,640,360);
  withShake(c,fx.shake,()=>{
   if(!reduced)drawSpeedLines(c,fx.speedLines,p);
   drawParticles(c,fx.particles,p);
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
// Časovací kruh kolem vlaštovky: tmavý podklad, šedá stopa, tyrkysový oblouk úspěchu, magenta perfekt, bílý bod průběhu; varování čárkovaně, výsledek jednou barvou.
export function drawQte(c,q,view=AIM_VIEW,time=0,reduced=false,p=CYBER){
 const k=p.qte,ring=eventView(q.type).ring,R=ring.r,px=view.px,py=view.py,start=-Math.PI/2,at=x=>start+x*TAU,
  arc=(from,to,color,width)=>{c.beginPath();c.arc(px,py,R,at(from),at(to));c.strokeStyle=color;c.lineWidth=width;c.stroke();};
 c.save();
 if(q.phase==='warning'||q.result||q.zones){const ga=c.globalAlpha;c.globalAlpha=ga*(k.discAlpha??.6);c.fillStyle=k.disc??p.popup.outline;c.beginPath();c.arc(px,py,R+QTE_BASE,0,TAU);c.arc(px,py,Math.max(0,R-QTE_BASE),0,TAU,true);c.fill();c.globalAlpha=ga;}
 if(q.type==='gust'&&!q.result)for(let i=0;i<3;i++){const x=reduced?0:(time*3+i/3)%1;c.fillStyle=k.gust;c.fillRect(Math.round(px-70+x*40),Math.round(py-14+i*12),18,2);}
 if(q.type==='bird'&&!q.held&&!q.result){const bob=reduced?0:Math.sin(time*8)*3;c.fillStyle=k.bird.body;c.fillRect(px+34,py-36+bob,14,8);c.fillStyle=k.bird.wing;c.fillRect(px+30,py-40-bob,8,4);c.fillRect(px+44,py-40-bob,8,4);c.fillStyle=k.bird.beak;c.fillRect(px+48,py-33+bob,4,2);}
 if(q.phase==='warning'){c.globalAlpha=reduced?.8:.5+.4*Math.sin(time*12);c.setLineDash([6,6]);arc(0,1,k.warning,3);}
 else if(q.result)arc(0,1,k.result[q.result]??k.result.other,5);
 else if(q.zones){arc(0,1,k.track,7);arc(q.zones.success[0],q.zones.success[1],k.success,7);arc(q.zones.perfect[0],q.zones.perfect[1],k.perfect,7);
  const a=at(q.progress??0),x=px+Math.cos(a)*R,y=py+Math.sin(a)*R;c.fillStyle=k.dot;
  if(ring.marker==='dot'){c.beginPath();c.arc(x,y,4.5,0,TAU);c.fill();}
  else if(ring.marker==='diamond'){c.beginPath();c.moveTo(x,y-5);c.lineTo(x+5,y);c.lineTo(x,y+5);c.lineTo(x-5,y);c.closePath();c.fill();}
  else c.fillRect(Math.round(x-4),Math.round(y-4),8,8);}
 c.restore();
}
// Štítek události: přilétá zprava k vlaštovce jako v atmosphere.js (x = px + max(55, 190 − 68·age)).
export function drawLabel(c,l,view,p=CYBER,scale=1){
 if(!l?.label)return;const x=view.px+Math.max(55,190-(l.age??0)*68),y=Math.max(88,Math.min(245,view.py-12));
 c.save();c.font=`bold ${Math.round(10*scale)}px ${DISPLAY}`;const w=c.measureText(l.label).width+12*scale,h=19*scale,lx=Math.round(Math.min(625-w,x-10));
 c.fillStyle=p.label.bg;c.fillRect(lx,Math.round(y-20-h),w,h);c.fillStyle=p.label.text;c.fillText(l.label,lx+6*scale,y-20-6*scale);c.restore();
}
// Částice z fxMap (už v obrazovkových px): prach a jiskry jako čtverečky, větrná čárka 1 px vysoká.
export function drawParticles(c,list=[],p=CYBER){
 if(!list?.length)return;c.save();
 for(const q of list){c.globalAlpha=q.alpha;c.fillStyle=p.particles[q.kind]??p.particles[0];if(q.kind===3)c.fillRect(Math.round(q.x),Math.round(q.y),q.size,1);else c.fillRect(q.x-q.size/2,q.y-q.size/2,q.size,q.size);}
 c.restore();
}
// Popupy sledují vlaštovku (px+20, py−30, land nad ní); rise/scale počítá fxMap (reduced = bez pohybu).
export function drawPopups(c,list=[],view=AIM_VIEW,p=CYBER,scale=1){
 if(!list?.length)return;c.save();c.textAlign='center';c.lineJoin='round';
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
 for(const [x,y,len] of lines){c.lineWidth=1+((x*7)%2);c.beginPath();c.moveTo(x,y);c.lineTo(x-len,y);c.stroke();}
 c.strokeStyle=p.speed.ink;c.globalAlpha=.5;c.lineWidth=1;c.beginPath();for(const [x,y,len] of lines.slice(0,lines.length>>1)){c.moveTo(x+12,y+3);c.lineTo(x+12-len*.6,y+3);}c.stroke();c.restore();
}
// Mířidla (dřív natvrdo v ui.js na 148,258): čárkovaná šipka z vlaštovky pod úhlem, delší s nabitím, panel s pokynem a lišta síly.
// aim = {angle (°), held, charge 0–1}; view = view(null), takže šipka vychází z promítnuté vlaštovky.
export function drawAim(c,aim,view=AIM_VIEW,p=CYBER){
 const k=p.aim,charge=aim.held?aim.charge??0:0,a=(aim.angle??15)*Math.PI/180,len=65+charge*45;
 c.save();c.translate(view.px,view.py);c.rotate(-a);c.strokeStyle=k.arrow;c.lineWidth=3;c.setLineDash([7,5]);c.beginPath();c.moveTo(12,0);c.lineTo(len,0);c.stroke();
 c.setLineDash([]);c.beginPath();c.moveTo(len-10,-6);c.lineTo(len,0);c.lineTo(len-10,6);c.stroke();c.restore();
 c.save();c.fillStyle=k.panel;c.fillRect(205,168,265,37);c.fillStyle=k.text;c.font=`bold 13px ${DISPLAY}`;c.fillText(t(aim.held?'aim.panelHeld':'aim.panelIdle'),220,191);
 c.fillStyle=k.panel;c.fillRect(205,211,265,14);c.fillStyle=k.bar;c.fillRect(207,213,261*charge,10);c.strokeStyle=k.cap;c.lineWidth=1;c.strokeRect(449,212,19,12);c.restore();
}
