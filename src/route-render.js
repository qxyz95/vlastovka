import {ROUTE,SCREEN_PIXELS} from './scenes.js';
const colors=[['#322749','#131b31','#ea70c8'],['#294559','#10263a','#78d8ee'],['#63384e','#302638','#ffa66d'],['#44214e','#18142f','#60eed9']];
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(x,y,w,h);}
function triangle(c,color,x,y,w,h){c.fillStyle=color;c.beginPath();c.moveTo(x,y);c.lineTo(x+w/2,y-h);c.lineTo(x+w,y);c.fill();}
function building(c,x,base,w,h,p,seed){
 rect(c,p[1],x,base-h,w,h);rect(c,p[0],x+w-5,base-h,5,h);
 for(let row=0;row<Math.floor((h-15)/15);row++)for(let col=0;col<Math.floor((w-10)/12);col++)
  if(noise(seed+row*17+col)>.35)rect(c,p[2],x+7+col*12,base-h+10+row*15,4,3);
}
// World-space chunks slide through the viewport. Only visible chunks are drawn;
// no canvas-sized bitmap is swapped when the player crosses a screen boundary.
export function drawRouteLayer(c,camera,height,foreground=false,time=0){
 const speed=foreground?1:.28,width=SCREEN_PIXELS*speed,offset=camera*speed;
 const first=Math.max(0,Math.floor(offset/width)-1),last=Math.ceil((offset+640)/width);
 for(let screen=first;screen<=last;screen++){
  const index=screen%ROUTE.length,biome=Math.floor(index/4),p=colors[biome];
  const x=screen*width-offset,base=300+height*(foreground?1:.15);
  c.save();c.translate(x,0);
  if(!foreground){
   for(let j=0;j<4;j++){
    const bx=j*width/4,h=35+noise(screen*9+j)*90;
    if(biome===2)triangle(c,p[0],bx-20,base,width/2,h+55);
    else rect(c,p[0],bx,base-h,width/4-3,h);
   }
  }else{
   // Adjacent grounds meet in world space: street → water → soil → street.
   rect(c,biome===1?'#122e44':biome===2?'#342b38':'#101a2c',0,base-8,640,Math.max(100,360-base+8));
   for(let j=0;j<16;j++)rect(c,p[0],j*41,base+12+(j%3)*9,26,2);
   drawPlace(c,ROUTE[index].kind,base,p,screen,time);
  }
  c.restore();
 }
}
function drawPlace(c,kind,b,p,seed,time){
 const r=(x,y,w,h,color=p[1])=>rect(c,color,x,b+y,w,h);
 const house=(x,w,h)=>building(c,x,b-8,w,h,p,seed+x);
 const tree=(x,h=55)=>{r(x,-h,5,h);triangle(c,p[0],x-24,b-20,53,h);};
 const crane=x=>{r(x,-160,7,152);r(x-50,-160,155,6,p[2]);r(x+97,-156,2,85,p[2]);r(x+78,-71,40,25);};
 switch(kind){
  case 'roofs': house(190,95,85);house(340,120,120);house(510,100,65);break;
  case 'market': house(20,70,100);for(let j=0;j<5;j++){r(130+j*86,-47,65,39);triangle(c,p[2],120+j*86,b-47,85,24);}break;
  case 'garden': for(let j=0;j<7;j++)tree(50+j*85,40+(j%3)*18);r(260,-25,80,6,p[2]);break;
  case 'rail': r(0,-14,640,4,p[2]);for(let j=0;j<21;j++)r(j*31,-10,5,15);for(let j=0;j<4;j++)house(170+j*96,90,48);break;
  case 'warehouse': for(let j=0;j<3;j++){house(30+j*205,170,75);triangle(c,p[0],20+j*205,b-83,190,22);}break;
  case 'cranes': crane(100);crane(360);r(160,-23,280,30);r(195,-50,170,27,p[0]);break;
  case 'bridge': r(0,-58,640,10,p[2]);for(const x of [100,490]){r(x,-190,12,220);c.strokeStyle=p[2];c.beginPath();c.moveTo(x-140,b-58);c.lineTo(x+6,b-188);c.lineTo(x+146,b-58);c.stroke();}break;
  case 'lighthouse': r(0,-4,430,18,p[0]);r(300,-150,35,142);r(293,-157,49,13,p[2]);triangle(c,p[0],289,b-157,57,22);c.fillStyle='#decba720';c.beginPath();c.moveTo(317,b-150);c.lineTo(620,b-220);c.lineTo(620,b-130);c.fill();break;
  case 'fields': for(let j=0;j<12;j++){r(j*55,-20,3,20,p[2]);r(j*55-5,-23,13,3,p[2]);}house(410,110,50);triangle(c,p[0],398,b-58,135,30);break;
  case 'turbines': for(const x of [100,310,530]){r(x,-135,5,130);c.save();c.translate(x+2,b-135);c.rotate(time*.65);for(let j=0;j<3;j++){c.rotate(Math.PI*2/3);rect(c,p[2],0,-3,57,5);}c.restore();}break;
  case 'peaks': triangle(c,p[0],-40,b-8,300,165);triangle(c,p[1],180,b-8,350,220);triangle(c,p[2],309,b-175,92,53);triangle(c,p[0],460,b-8,220,115);break;
  case 'observatory': triangle(c,p[0],100,b-8,420,90);r(270,-120,130,50);c.fillStyle=p[2];c.beginPath();c.arc(335,b-120,65,Math.PI,0);c.fill();r(326,-170,12,65,p[1]);break;
  case 'gate': house(140,75,175);house(420,75,175);r(140,-175,355,24,p[2]);break;
  case 'terraces': for(let j=0;j<4;j++){house(30+j*155,120,90+j*30);r(25+j*155,-100-j*30,130,10,p[2]);tree(70+j*155,120+j*30);}break;
  case 'tower': house(240,140,235);r(304,-290,8,47,p[2]);r(220,-205,180,8,p[2]);house(20,110,90);house(490,100,130);break;
  case 'port': house(110,420,100);r(95,-111,450,11,p[2]);r(280,-155,90,44);r(305,-142,40,5,p[2]);break;
 }
}
