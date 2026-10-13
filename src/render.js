import {drawBackground} from './backgrounds.js';
import {drawAtmosphere} from './atmosphere.js';
import {drawDecorations} from './decorations.js';
import {drawRouteLayer} from './route-render.js';
import {PIXELS_PER_METER} from './scenes.js';
export function render(canvas,f,model,time=0,visual={}) {
 time=f?.t??time;
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const x=f?.x??0,y=f?.y??12,cam=Math.max(0,x*PIXELS_PER_METER),ground=300+Math.max(0,y*2.1-190);
 const r=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
 drawBackground(c,x,cam,ground-300);
 drawRouteLayer(c,cam,ground-300,true,time);
 const shop=20-cam;r('#121b32',shop,ground-82,95,74);r('#793765',shop,ground-84,95,4);r('#ef59c1',shop+7,ground-69,80,17);c.fillStyle='#17172f';c.font='bold 11px monospace';c.fillText('PAPER LAB',shop+12,ground-56);r('#223c4d',shop+10,ground-43,42,34);r('#53dbea',shop+13,ground-39,34,3);r('#35344f',shop+64,ground-40,21,32);
 r('#9e91bd',127-cam,ground-48,10,11);r('#61eafa',130-cam,ground-44,9,3);r('#ee50b4',124-cam,ground-37,16,20);r('#38466f',125-cam,ground-17,5,10);r('#38466f',135-cam,ground-17,5,10);
 const px=148,py=f?ground-y*2.1:ground-42;
 drawDecorations(c,visual.decorations,f,px,py,visual.reduced);
 drawAtmosphere(c,f,px,py,f?.t??time,visual.reduced);
 if(f&&!f.landed&&!visual.reduced)for(let i=1;i<6;i++)r(i%2?'#3c91ab':'#913a90',px-i*9,py+i%2,5,2);
 c.save();c.translate(Math.round(px),Math.round(py));c.rotate(f?Math.max(-.5,Math.min(.5,-Math.atan2(f.vy,f.vx))):-.15);c.beginPath();c.moveTo(17,0);c.lineTo(-14,model==='glider'?-13:-7);c.lineTo(-7,0);c.lineTo(-14,model==='glider'?13:7);c.closePath();c.fillStyle='#efffff';c.fill();c.strokeStyle='#0b1935';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(-7,0);c.lineTo(17,0);c.strokeStyle=model==='glider'?'#ff43b5':'#00bddb';c.stroke();c.restore();
 if(visual.qte)drawQte(c,visual.qte,px,py,time,visual.reduced);
 if(f?.carry>0){r('#ad9fce',px-10,py-20,20,8);r('#65f7ef',px-16,py-24+(visual.reduced?0:Math.sin(time*14)*4),12,5);r('#65f7ef',px+5,py-24-(visual.reduced?0:Math.sin(time*14)*4),12,5);}
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
