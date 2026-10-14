import {ROUTE,SCREEN_PIXELS} from './scenes.js';
import {theme,box,tri,paint} from './themes.js';
import {wind,drift,sway,noise1} from './motion.js';
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const rect=box,triangle=tri,S=Math.sin;
// A few windows (~7 %) switch on and off at irregular, noise-driven moments.
function building(c,x,base,w,h,p,seed,time=0){
 rect(c,p[1],x,base-h,w,h);rect(c,p[0],x+w-5,base-h,5,h);theme().shade?.(c,x,base-h,w,h,p);
 for(let row=0;row<Math.floor((h-15)/15);row++)for(let col=0;col<Math.floor((w-10)/12);col++){
  const n=seed+row*17+col,flicker=noise(n*3.7)>.93&&noise1(time*(.15+noise(n)*.2),n)>.1;
  if((noise(n)>theme().lights)!==flicker)rect(c,p[2],x+7+col*12,base-h+10+row*15,4,3);
 }
}
// World-space chunks slide through the viewport. Only visible chunks are drawn;
// no canvas-sized bitmap is swapped when the player crosses a screen boundary.
export function drawRouteLayer(c,camera,height,foreground=false,time=0){
 const speed=foreground?1:.28,width=SCREEN_PIXELS*speed,offset=camera*speed;
 const first=Math.max(0,Math.floor(offset/width)-1),last=Math.ceil((offset+640)/width);
 for(let screen=first;screen<=last;screen++){
  const t=theme(),index=screen%ROUTE.length,biome=Math.floor(index/4),p=t.biomes[biome],far=t.far?.[biome]??p[0];
  const x=screen*width-offset,base=300+height*(foreground?1:.15);
  c.save();c.translate(x,0);
  if(!foreground){
   for(let j=0;j<4;j++){
    const bx=j*width/4,h=35+noise(screen*9+j)*90;
    if(biome===2)triangle(c,far,bx-20,base,width/2,h+55);
    else rect(c,far,bx,base-h,width/4-3,h);
   }
  }else{
   // Adjacent grounds meet in world space: street → water → soil → street.
   // Line themes draw only the horizon, so chunk seams stay invisible.
   c.fillStyle=t.ground[biome];c.fillRect(0,base-8,640,Math.max(100,360-base+8));
   if(t.mode==='line'){c.strokeStyle=t.ink('#ffffff');c.lineWidth=1.2;c.beginPath();c.moveTo(0,base-8);c.lineTo(640,base-8);c.stroke();}
   else if(t.mode==='paper'){c.fillStyle='#00000018';c.fillRect(0,base-8,640,3);}
   else if(t.mode==='ink'){c.fillStyle=t.line;c.fillRect(0,base-9,640,2);}
   for(let j=0;j<16;j++){c.fillStyle=t.mode==='line'?t.ink(t.dash):t.dash??p[0];c.fillRect(j*41,base+12+(j%3)*9,26,t.mode==='line'?1:2);}
   // Docks: glints drift and fade on the water.
   if(biome===1)for(let j=0;j<22;j++){const a=noise1(time*1.2,j);if(a<.2)continue;c.globalAlpha=a*.6;c.fillStyle=t.mode==='line'?t.ink(t.fx.water):t.fx.water;c.fillRect(j*29+noise1(time*.4,j+50)*8,base+6+(j*7)%38,6+(j%3)*4,1.5);}
   c.globalAlpha=1;
   drawPlace(c,ROUTE[index].kind,base,p,screen,time);
  }
  c.restore();
 }
}
function drawPlace(c,kind,b,p,seed,time){
 const t=theme(),fx=t.fx;
 const r=(x,y,w,h,color=p[1])=>rect(c,color,x,b+y,w,h);
 const house=(x,w,h)=>building(c,x,b-8,w,h,p,seed+x,time);
 // Trees sway with the shared wind: only the crown tip moves.
 const tree=(x,h=55)=>{const lean=sway(time,x)*4;r(x,-h,5,h);paint(c,p[0],()=>{c.moveTo(x-24,b-20);c.lineTo(x+2.5+lean,b-20-h);c.lineTo(x+29,b-20);c.closePath();},26*h);};
 const line=(color,pts,w=1)=>{c.strokeStyle=t.mode==='line'?t.ink(color):color;c.lineWidth=w;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,b+y):c.moveTo(x,b+y));c.stroke();};
 const fade=(a,draw)=>{c.save();c.globalAlpha*=Math.max(0,Math.min(1,a));draw();c.restore();};
 const blink=(x,y,period=2,phase=0,color=fx.beacon,s=3)=>{if((time/period+phase)%1<.45)r(x,y,s,s,color);};
 // Rising smoke/steam puffs that grow, fade and lean with the wind.
 const smoke=(x,y,n=4,speed=.35)=>{for(let i=0;i<n;i++){const k=(time*speed+i/n)%1,s=5+k*9;fade((1-k)*.7,()=>r(x+k*(8+14*wind(time))+noise1(time*1.5,i)*3-s/2,y-k*48-s/2,s,s,fx.smoke));}};
 // Hanging cargo on a swinging rope below a trolley that runs along the jib.
 const crane=x=>{r(x,-160,7,152);r(x-50,-160,155,6,p[2]);const tx=x+30+(S(time*.35+x)*.5+.5)*65,a=S(time*1.2+x)*.04+sway(time,x)*.08,ex=tx+S(a)*80,ey=-154+Math.cos(a)*80;
  r(tx-6,-156,14,4,p[0]);line(p[2],[[tx+1,-154],[ex,ey]],2);r(ex-18,ey,38,22);blink(x+101,-166,1.6,x*.01);};
 const flag=(x,y,color)=>{r(x,y,2,30,p[0]);paint(c,color,()=>{c.moveTo(x+2,b+y);for(let k=0;k<=4;k++)c.lineTo(x+2+k*6,b+y+S(drift(time)*6-k*.9+x)*(1.5+1.5*wind(time))*k/4);for(let k=4;k>=0;k--)c.lineTo(x+2+k*6,b+y+12+S(drift(time)*6-k*.9+x)*(1.5+1.5*wind(time))*k/4);c.closePath();},300);};
 const beam=(x,y,angle,len,spread,color)=>fade(.22,()=>{c.fillStyle=color;c.beginPath();c.moveTo(x,b+y);c.lineTo(x+Math.cos(angle-spread)*len,b+y+Math.sin(angle-spread)*len);c.lineTo(x+Math.cos(angle+spread)*len,b+y+Math.sin(angle+spread)*len);c.fill();});
 switch(kind){
  case 'roofs':
   house(190,95,85);house(340,120,120);house(510,100,65);
   r(395,-142,12,16,p[0]);smoke(401,-146);r(225,-117,2,24,p[2]);blink(224,-120,1.8);
   // Washing line between roofs: shirts swing in the wind.
   line(p[2],[[285,-80],[340,-88]]);for(let i=0;i<3;i++){const sx=294+i*15,sy=-82-i*2.5,a=sway(time,294+i*15)*.3+noise1(time*4,i)*.08;c.save();c.translate(sx,b+sy);c.rotate(a);rect(c,[p[2],fx.beacon,p[0]][i],-4,0,8,9);c.restore();}
   break;
  case 'market':
   house(20,70,100);
   for(let j=0;j<5;j++){r(130+j*86,-47,65,39);triangle(c,p[2],120+j*86,b-47,85,24+sway(time,130+j*86)*3);}
   // Lantern string over the stalls, lanterns bob and glow in turn.
   line(p[0],[[120,-88],[300,-80],[560,-90]]);
   for(let j=0;j<9;j++){const lx=135+j*48,ly=-88+Math.abs(j-3.5)*1.2+sway(time,135+j*48)*2.5;fade(.55+.45*S(time*3+j*.8),()=>r(lx,ly,6,8,j%2?p[2]:fx.beacon));}
   break;
  case 'garden':
   for(let j=0;j<7;j++)tree(50+j*85,40+(j%3)*18);r(260,-25,80,6,p[2]);
   // Fireflies (or butterflies in daylight) wander over the hedges.
   for(let j=0;j<10;j++){const fxp=40+j*58+noise1(time*.35,j)*30,fy=-40-noise(j)*50+noise1(time*.45,j+20)*14;fade(.4+.6*noise1(time*2,j+40),()=>r(fxp,fy,3,3,p[2]));}
   break;
  case 'rail':{
   r(0,-14,640,4,p[2]);for(let j=0;j<21;j++)r(j*31,-10,5,15);for(let j=0;j<4;j++)house(170+j*96,90,48);
   // A train crosses every 11 s; a signal turns red while it passes.
   const k=(time/11)%1,tx=-420+k*2.3*640;
   if(k<.75){for(let i=0;i<4;i++){r(tx+i*96,-38,90,24,p[0]);for(let w=0;w<5;w++)r(tx+i*96+8+w*16,-33,9,7,p[2]);}r(tx+384,-44,26,30,p[0]);}
   r(40,-60,4,46,p[0]);r(36,-66,12,10,p[1]);r(39,-63,6,4,k<.75?fx.beacon:p[2]);
   break;}
  case 'warehouse':
   for(let j=0;j<3;j++){house(30+j*205,170,75);triangle(c,p[0],20+j*205,b-83,190,22);
    // Roller doors open and close; roof beacons blink.
    const open=20+18*(.5+.5*S(time*.5+j*2));r(95+j*205,-8-38,40,38,p[1]);r(95+j*205,-8-38,40,38-open,p[0]);blink(112+j*205,-110,1.4,j/3);}
   break;
  case 'cranes':{
   crane(100);crane(360);const bob=S(time*1.1)*1.5;r(160,-23+bob,280,30);r(195,-50+bob,170,27,p[0]);smoke(415,-52+bob,3,.45);
   break;}
  case 'bridge':
   r(0,-58,640,10,p[2]);for(const x of [100,490]){r(x,-190,12,220);c.strokeStyle=t.mode==='line'?t.ink(p[2]):p[2];c.beginPath();c.moveTo(x-140,b-58);c.lineTo(x+6,b-188);c.lineTo(x+146,b-58);c.stroke();blink(x+3,-196,1.5,x*.003);}
   // Headlights go right, tail lights go left.
   for(let i=0;i<5;i++){r(((time*70+i*151)%760)-60,-63,8,3,p[2]);r(700-((time*55+i*173)%760),-55,6,2,fx.beacon);}
   break;
  case 'lighthouse':{
   r(0,-4,430,18,p[0]);r(300,-150,35,142);r(293,-157,49,13,p[2]);triangle(c,p[0],289,b-157,57,22);
   // The beam sweeps over the bay; the lamp pulses.
   const a=-.2+S(time*.9)*.55;beam(317,-150,a,330,.1,'#fff1c4');beam(317,-150,Math.PI-a,200,.08,'#fff1c4');fade(.6+.4*S(time*3),()=>r(310,-153,14,6,'#fff6d0'));
   // Small boat rocking near the pier.
   c.save();c.translate(140,b+2);c.rotate(S(time*1.4)*.08);rect(c,p[1],-22,-8,44,8);rect(c,p[2],-2,-30,2,22);tri(c,p[2],0,-10,18,18);c.restore();
   break;}
  case 'fields':
   // Crops wave in a rolling gust from left to right.
   for(let j=0;j<12;j++){const lean=sway(time,j*55)*4;line(p[2],[[j*55+1.5,-1],[j*55+1.5+lean,-20]],3);r(j*55-5+lean,-23,13,3,p[2]);}
   house(410,110,50);triangle(c,p[0],398,b-58,135,30);
   // Small farm windmill on the barn roof.
   c.save();c.translate(465,b-90);c.rotate(drift(time)*1.5);for(let j=0;j<4;j++){c.rotate(Math.PI/2);rect(c,p[2],0,-2,18,4);}c.restore();
   break;
  case 'turbines':
   for(const x of [100,310,530]){r(x,-135,5,130);c.save();c.translate(x+2,b-135);c.rotate(drift(time)*.8+x);for(let j=0;j<3;j++){c.rotate(Math.PI*2/3);rect(c,p[2],0,-3,57,5);}c.restore();blink(x,-141,2.2,x*.002);}
   break;
  case 'peaks':
   triangle(c,p[0],-40,b-8,300,165);triangle(c,p[1],180,b-8,350,220);triangle(c,p[2],309,b-175,92,53);triangle(c,p[0],460,b-8,220,115);
   // Snow blown off the summit, a cloud band and a circling eagle.
   for(let i=0;i<12;i++){const k=(time*.5+i/12)%1;fade(1-k,()=>r(356+k*120*wind(time),-228+k*30+S(time*3+i)*4,2,2,p[2]));}
   fade(.75,()=>paint(c,fx.smoke,()=>{const cx=((drift(time)*15)%840)-100;c.ellipse(cx,b-150,60,9,0,0,Math.PI*2);c.ellipse(cx+40,b-156,34,8,0,0,Math.PI*2);},1000));
   {const a=time*.5,ex=300+Math.cos(a)*55,ey=-262+Math.sin(a)*14,w=S(time*7)*3;line(fx.bird,[[ex-7,ey-w],[ex,ey],[ex+7,ey-w]],2);}
   break;
  case 'observatory':
   triangle(c,p[0],100,b-8,420,90);r(270,-120,130,50);
   // Telescope slowly scans the sky.
   c.save();c.translate(332,b-120);c.rotate(-.35+S(time*.25)*.45);rect(c,p[1],-6,-98,12,98);rect(c,p[2],-8,-100,16,5);c.restore();
   paint(c,p[2],()=>c.arc(335,b-120,65,Math.PI,0));fade(.5+.5*S(time*1.5),()=>r(329,-182,12,3,fx.beacon));
   for(let i=0;i<7;i++)fade(.5+.5*S(time*2+i*1.9),()=>r(170+i*55,-250+noise(i)*60,2,2,p[2]));
   break;
  case 'gate':
   // Searchlights cross behind the gate, flags flutter on top.
   beam(176,-175,-Math.PI/2+S(time*.6)*.5,260,.06,p[2]);beam(458,-175,-Math.PI/2-S(time*.6)*.5,260,.06,p[2]);
   house(140,75,175);house(420,75,175);r(140,-175,355,24,p[2]);flag(176,-205,fx.beacon);flag(458,-205,fx.beacon);
   break;
  case 'terraces':
   for(let j=0;j<4;j++){house(30+j*155,120,90+j*30);r(25+j*155,-100-j*30,130,10,p[2]);tree(70+j*155,120+j*30);
    // Water falls from each terrace edge.
    const top=-90-j*30,len=-8-top;for(let k=0;k<5;k++){const y=top+((time*60+k*len/5)%len);fade(.7,()=>r(150+j*155,y,3,8,fx.water));}}
   break;
  case 'tower':{
   house(240,140,235);r(304,-290,8,47,p[2]);r(220,-205,180,8,p[2]);house(20,110,90);house(490,100,130);
   // Radio rings leave the antenna; an elevator runs up and down.
   for(let i=0;i<3;i++){const k=(time*.6+i/3)%1;fade(1-k,()=>{c.strokeStyle=t.mode==='line'?t.ink(p[2]):p[2];c.lineWidth=1.5;c.beginPath();c.arc(308,b-292,8+k*55,-Math.PI*.85,-Math.PI*.15);c.stroke();});}
   blink(306,-296,1.2);r(372,-12-(S(time*.4)*.5+.5)*205,8,10,p[2]);
   break;}
  case 'port':{
   house(110,420,100);r(95,-111,450,11,p[2]);r(280,-155,90,44);r(305,-142,40,5,p[2]);
   // Landing lights chase along the deck; an airship docks and bobs.
   for(let i=0;i<14;i++){const on=(Math.floor(time*8)-i+140)%14;if(on<3)fade(1-on/3,()=>r(102+i*32,-115,5,3,fx.beacon));}
   const ay=-215+S(time*.9)*5,ax=430+S(time*.3)*12;paint(c,p[0],()=>c.ellipse(ax,b+ay,48,14,0,0,Math.PI*2),2000);r(ax-14,ay+12,28,8,p[1]);
   c.save();c.translate(ax-52,b+ay);c.rotate(time*8);rect(c,p[2],-1,-8,2,16);c.restore();blink(ax+44,ay-2,1,0,p[2]);
   break;}
 }
}
