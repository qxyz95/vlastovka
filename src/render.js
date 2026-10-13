import {drawBackground} from './backgrounds.js';
import {drawAtmosphere} from './atmosphere.js';
import {drawDecorations} from './decorations.js';
import {drawRouteLayer} from './route-render.js';
import {PIXELS_PER_METER} from './scenes.js';
import {theme,box} from './themes.js';
import {drawRain} from './ambient.js';
import {noise1,fbm} from './motion.js';
import {shake,flightAngle} from './juice.js';
import {drawTrail,drawParticles,drawPopups,drawFlash} from './fx-render.js';
// Camera and plane placement on screen for a flight state; ui.js uses it to spawn effects.
export function view(f){const y=f?.y??12,ground=300+Math.max(0,y*2.1-190);return {cam:Math.max(0,(f?.x??0)*PIXELS_PER_METER),ground,px:148,py:f?ground-y*2.1:ground-42};}
// visual: {reduced, decorations, qte, fx (juice.js state), charge (0–1 while aiming), clock (real seconds)}
export function render(canvas,f,model,time=0,visual={}) {
 // In flight the scene runs on flight time; after landing the caller's clock keeps it alive.
 time=f&&!f.landed?f.t:time;
 // Pixel themes draw at 640×360; smooth themes at 2× so they stay sharp when scaled up.
 const t=theme(),width=t.pixel?640:1280;
 if(canvas.width!==width){canvas.width=width;canvas.height=width*9/16;canvas.style.imageRendering=t.pixel?'pixelated':'auto';}
 const c=canvas.getContext('2d');c.setTransform(width/640,0,0,width/640,0,0);c.imageSmoothingEnabled=!t.pixel;
 const x=f?.x??0,{cam,ground}=view(f),fx=visual.fx,charge=f?0:visual.charge??0;
 const r=(color,x,y,w,h)=>box(c,color,Math.round(x),Math.round(y),w,h);
 // Reduced motion freezes ambient animation; gameplay feedback still moves.
 const anim=visual.reduced?0:time,thrown=f&&f.t>0;
 // Camera shake from trauma (real clock, so it also reads during hitstop); slight zoom hides the edges.
 const sh=shake(fx,visual.clock??time,visual.reduced);
 if(sh.x||sh.y||sh.a){const z=1+fx.trauma**2*.03;c.translate(320+sh.x,180+sh.y);c.rotate(sh.a);c.scale(z,z);c.translate(-320,-180);}
 drawBackground(c,x,cam,ground-300,anim);
 drawRouteLayer(c,cam,ground-300,true,anim);
 // Workshop: the neon sign flickers now and then, the window light breathes.
 const shop=20-cam,s=t.shop,k=t.kid,flick=t.fx.glow&&noise1(anim*.6,7)>.45&&noise1(anim*30,9)>0;r(s.wall,shop,ground-82,95,74);r(s.roof,shop,ground-84,95,4);c.save();if(flick)c.globalAlpha=.35;r(s.sign,shop+7,ground-69,80,17);c.restore();c.fillStyle=s.text;c.font='bold 11px monospace';c.fillText('PAPER LAB',shop+12,ground-56);r(s.window,shop+10,ground-43,42,34);c.save();c.globalAlpha=.7+.3*Math.sin(anim*1.6);r(s.light,shop+13,ground-39,34,3);r(s.light,shop+20,ground-30,6,6);c.restore();r(s.door,shop+64,ground-40,21,32);
 // Kid breathes while aiming, leans back while charging and waves after the throw.
 const kx=124-cam-Math.round(charge*3),bob=thrown?0:Math.round(Math.sin(anim*2.5));
 r(k[0],kx+3,ground-48-bob,10,11);r(k[1],kx+6,ground-44-bob,9,3);r(k[2],kx,ground-37-bob,16,20);r(k[3],kx+1,ground-17,5,10);r(k[3],kx+11,ground-17,5,10);
 if(thrown){const a=-1.25+Math.sin(anim*9)*.45;c.save();c.translate(Math.round(kx+14),Math.round(ground-35-bob));c.rotate(a);r(k[2],0,-2,15,4);r(k[0],14,-3,5,6);c.restore();}
 // Anticipation: the plane is pulled back and trembles near full charge.
 const tremble=charge>.9&&!visual.reduced?noise1((visual.clock??time)*40,6)*1.5:0,v=view(f),px=v.px-charge*8,py=v.py+(f?0:fbm(anim*.5,8)*2+tremble);
 drawRain(c,x,anim);
 drawDecorations(c,visual.decorations,f,px,py,visual.reduced);
 drawAtmosphere(c,f,px,py,f?.t??time,visual.reduced);
 if(fx){drawTrail(c,fx,cam,px,py);drawParticles(c,fx,cam);}
 else if(f&&!f.landed&&!visual.reduced)for(let i=1;i<6;i++){c.fillStyle=t.trail[i%2?0:1];c.fillRect(Math.round(px-i*9),Math.round(py+i%2),5,2);}
 // Plane: spring-smoothed rotation, noise flutter, squash & stretch along the nose axis.
 const stretch=fx?fx.stretch.x:-charge*.2,flutter=f&&!f.landed?noise1(anim*3,4)*.05:noise1(anim*.7,4)*.04;
 c.save();c.translate(Math.round(px),Math.round(py));c.rotate((fx?.rotReady?fx.rot.x:flightAngle(f))-charge*.25+flutter);c.scale(1+stretch,1-stretch*.6);c.beginPath();c.moveTo(17,0);c.lineTo(-14,model==='glider'?-13:-7);c.lineTo(-7,0);c.lineTo(-14,model==='glider'?13:7);c.closePath();c.fillStyle=t.plane.fill;c.fill();c.strokeStyle=t.plane.outline;c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(-7,0);c.lineTo(17,0);c.strokeStyle=t.plane.crease[model==='glider'?1:0];c.stroke();c.restore();
 if(fx){drawPopups(c,fx,px,py,visual.reduced);drawFlash(c,fx,visual.reduced);}
 t.overlay?.(c);
 if(visual.qte)drawQte(c,visual.qte,px,py,time,visual.reduced);
 if(f?.carry>0){r(t.tint('#ad9fce'),px-10,py-20,20,8);r(t.tint('#65f7ef'),px-16,py-24+(visual.reduced?0:Math.sin(time*14)*4),12,5);r(t.tint('#65f7ef'),px+5,py-24-(visual.reduced?0:Math.sin(time*14)*4),12,5);}
}
// In-scene timing ring around the plane: same windows as the bar under the scene.
// Grey track, cyan success arc, pink perfect arc, white dot = current progress.
function drawQte(c,q,px,py,time,reduced){
 const R=30,start=-Math.PI/2,at=k=>start+k*Math.PI*2,arc=(from,to,color,width)=>{c.beginPath();c.arc(px,py,R,at(from),at(to));c.strokeStyle=color;c.lineWidth=width;c.stroke();};
 c.save();
 if(q.type==='gust'&&!q.result)for(let i=0;i<3;i++){const k=reduced?0:(time*3+i/3)%1;c.fillStyle='#bff8ff';c.fillRect(Math.round(px-70+k*40),Math.round(py-14+i*12),18,2);}
 if(q.type==='bird'&&!q.held&&!q.result){const bob=reduced?0:Math.sin(time*8)*3;c.fillStyle='#ad9fce';c.fillRect(px+34,py-36+bob,14,8);c.fillStyle='#65f7ef';c.fillRect(px+30,py-40-bob,8,4);c.fillRect(px+44,py-40-bob,8,4);c.fillStyle='#ffd166';c.fillRect(px+48,py-33+bob,4,2);}
 if(q.phase==='warning'){c.globalAlpha=reduced?.8:.5+.4*Math.sin(time*12);c.setLineDash([6,6]);arc(0,1,'#fff0a6',3);}
 else if(q.result){const color={perfect:'#ff5fc8',success:'#2fe0c9'}[q.result]??'#6b6f8a';arc(0,1,color,5);}
 else{arc(0,1,'#3b4170',7);arc(q.zones.success[0],q.zones.success[1],'#2fb5c9',7);arc(q.zones.perfect[0],q.zones.perfect[1],'#ff5fc8',7);
  const k=at(q.progress);c.fillStyle='#ffffff';c.fillRect(Math.round(px+Math.cos(k)*R-4),Math.round(py+Math.sin(k)*R-4),8,8);}
 c.restore();
}
