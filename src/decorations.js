import {random} from './random.js';
import {districtAt} from './scenes.js';
import {activeEvent} from './events.js';
import {theme,box} from './themes.js';
const TYPES=[['sign','robot'],['cargo','spotlight'],['train','steam'],['drone','hologram']];
export function createDecorations(seed){const rng=random(seed^0x75ac091);return {rng,nextAt:3+2*rng(),active:null};}
export function stepDecorations(state,f){
 if(f.landed){state.active=null;return;}
 if(state.active&&f.t>=state.active.until){state.active=null;state.nextAt=f.t+6+4*state.rng();}
 if(!state.active&&f.t>=state.nextAt&&!activeEvent(f)){
  state.active={type:TYPES[districtAt(f.x).index][Math.floor(state.rng()*2)],at:f.t,until:f.t+2+2*state.rng()};
 }
}
export function drawDecorations(c,state,f,px,py,reduced){
 if(reduced||!f||!state?.active)return;
 const e=state.active,t=(f.t-e.at)/(e.until-e.at),x=650-760*t,y=120;
 // No cut-out around the plane: it is drawn after decorations, so it stays on top without hiding what is behind it.
 c.save();
 const th=theme(),r=(color,x,y,w,h)=>box(c,th.tint(color),Math.round(x),Math.round(y),w,h);
 c.globalAlpha=Math.min(1,t*6,(1-t)*6)*.65;
 switch(e.type){
 case 'sign':r('#f778d4',420,154,105,24);c.fillStyle='#211a39';c.font='bold 12px monospace';c.fillText('PAPER LAB',433,171);break;
 case 'robot':r('#a4c8d4',x,272,15,17);r('#69eae4',x+2,275,10,3);r('#b2909e',x-10,248,35,25);r('#161d31',x,289,5,5);r('#161d31',x+11,289,5,5);break;
 case 'cargo':r('#31486b',x,y,80,20);r('#68dadb',x+8,y+5,14,4);r('#d19bad',x+28,y-16,37,16);r('#c67aee',x-6,y+20,20,3);r('#c67aee',x+64,y+20,20,3);break;
 case 'spotlight':c.fillStyle='#b7cdeb';c.globalAlpha*=.25;c.beginPath();c.moveTo(460,300);c.lineTo(100+350*t,50);c.lineTo(230+350*t,50);c.fill();break;
 case 'train':for(let i=0;i<4;i++){r('#3f3c59',x+i*68,210,63,20);for(let j=0;j<4;j++)r('#e8b287',x+i*68+5+j*13,214,8,7);}r('#7e6087',0,234,640,3);break;
 case 'steam':for(let i=0;i<6;i++)r('#b7a5c4',410+Math.sin(i+t*3)*12,255-i*12-t*30,24+i*5,14);break;
 case 'drone':r('#777794',x,y,34,12);r('#5ee8e0',x-13,y-5,18,2);r('#5ee8e0',x+27,y-5,18,2);r('#e568c2',x+5,y+18,54,22);c.fillStyle='#211a39';c.font='10px monospace';c.fillText('FLY!',x+13,y+33);break;
 case 'hologram':c.strokeStyle='#63e8e5';c.lineWidth=2;c.beginPath();c.moveTo(400,140);c.lineTo(490,164);c.lineTo(426,177);c.closePath();c.stroke();for(let i=0;i<7;i++)r('#56d9ec',410,184+i*5,70-i*8,1);break;
 }
 c.restore();
}
