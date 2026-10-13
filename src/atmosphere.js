import {activeEvent} from './events.js';
import {theme,box} from './themes.js';
export function drawAtmosphere(c,f,px,py,time,reduced=false){
 const e=activeEvent(f);if(!e)return;
 const warning=e.phase==='warning',age=Math.max(0,f.t-e.at),x=px+Math.max(55,190-age*68),y=Math.max(88,Math.min(245,py-12));
 const t=theme(),r=(color,x,y,w,h)=>box(c,t.tint(color),Math.round(x),Math.round(y),w,h);
 c.save();c.strokeStyle=e.type==='gust'?'#76fff0':'#ffd08a';c.lineWidth=2;
 if(e.type==='gust'){
  r('#31475b',x+2,y+34,25,12);for(let i=0;i<4;i++)r('#73d6d9',x+5+i*5,y+36,2,8);
  for(let i=0;i<3;i++){c.beginPath();c.moveTo(x-15,y+20-i*13);c.lineTo(x+30,y+20-i*13);c.lineTo(x+37,y+15-i*13);c.stroke();}
  if(!reduced)for(let i=0;i<4;i++)r('#d0fff0',x-8+i*12,y-6+Math.sin(time*4+i)*9,4,3);
 }else{
  const wing=reduced?0:Math.round(Math.sin(time*9)*5);r('#a7a6cc',x,y,21,11);r('#e0d9ee',x+16,y-5,9,9);r('#ffcf7c',x+25,y,5,3);r('#18223b',x+20,y-3,2,2);r('#77f5e6',x+3,y-6,10,8);r('#d0daeb',x-9,y-7+wing,15,5);r('#d0daeb',x+2,y-12-wing,14,5);
 }
 c.font='bold 10px monospace';const label=e.phase==='effect'?'':warning?'! PŘIPRAV SE':e.type==='gust'?'↓ KLEPNI':'↕ PODRŽ / PUSŤ';
 if(label){const w=c.measureText(label).width+12;c.fillStyle='#141c32';c.fillRect(Math.round(Math.min(625-w,x-10)),Math.round(y-39),w,19);c.fillStyle='#eefaff';c.fillText(label,Math.min(625-w,x-10)+6,y-26);}
 c.restore();
}
