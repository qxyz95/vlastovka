// Kousek města pro srovnání stylů (čisté, bez three.js). Stejné tvary pro všech 5 směrů, liší se jen kresbou.
// cityBlocks(kind,{flat}) → [{shape:'box'|'pyr',x,w,z,d,h,y,layer:0 dálka|1 střed|2 ulice,role,ci,rz?}]
// role: wall (stěna, barva z layers[layer][ci]), roof, accent, ground, water, dominant. flat = papírové kulisy (malá hloubka).
export const LAYER_Z=[-1250,-380,-80],SPAN=[-400,2700];
function rng(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export function cityBlocks(kind,{flat=false}={}){
 const r=rng({suburbs:11,docks:22,horizon:33,core:44}[kind]??1),out=[],R=(a,b)=>a+(b-a)*r(),I=n=>Math.floor(r()*n);
 const add=b=>{const o={y:0,ci:0,role:'wall',shape:'box',...b};if(flat&&o.role!=='ground'&&o.role!=='water'&&o.layer>0)o.d=Math.min(o.d,o.layer===2?3:8);out.push(o);return o;};
 const row=(layer,{w,gap,h,dz=30,d,fn})=>{let x=SPAN[0];while(x<SPAN[1]){const bw=R(...w),bh=R(...h),z=LAYER_Z[layer]+R(-dz,dz),b=add({x,w:bw,z,d:d??bw*.8,h:bh,layer,ci:I(8)});fn?.(b);x+=bw+R(...gap);}};
 // Zem pod každou vrstvou (dlouhé desky), aby šly vrstvy odlišit hodnotou i v plochých stylech.
 for(const [layer,z,d] of [[0,-1300,700],[1,-420,500],[2,100,560]])add({x:SPAN[0]-600,w:SPAN[1]-SPAN[0]+1200,z,d,h:2,y:-2,layer,role:'ground'});
 if(kind==='suburbs'){
  row(2,{w:[16,30],gap:[4,16],h:[10,22],dz:14,d:14,fn:b=>{add({shape:'pyr',x:b.x-1,w:b.w+2,z:b.z,d:b.d+2,h:R(7,13),y:b.h,layer:2,role:'roof'});if(r()<.3)add({x:b.x+b.w*.7,w:2.5,z:b.z,d:2.5,h:6,y:b.h+2,layer:2,role:'roof'});}});
  for(let x=SPAN[0]+60;x<SPAN[1];x+=R(40,90))add({shape:'pyr',x,w:9,z:-40,d:9,h:R(12,20),layer:2,role:'accent',ci:1});
  row(1,{w:[22,44],gap:[6,20],h:[22,56]});
  for(let x=300;x<SPAN[1];x+=900){for(const dx of [0,10])add({x:x+dx,w:1.6,z:-330,d:1.6,h:44,layer:1,role:'dominant'});add({x:x-4,w:20,z:-330,d:14,h:18,y:44,layer:1,role:'dominant'});add({shape:'pyr',x:x-5,w:22,z:-330,d:16,h:8,y:62,layer:1,role:'dominant'});}
  for(let x=SPAN[0];x<SPAN[1];x+=R(260,420))add({shape:'pyr',x,w:R(380,560),z:-1250,d:300,h:R(70,140),layer:0,ci:I(2)});
  row(0,{w:[40,80],gap:[30,120],h:[40,90]});
 }else if(kind==='docks'){
  add({x:SPAN[0]-600,w:SPAN[1]-SPAN[0]+1200,z:-30,d:50,h:.6,y:0,layer:2,role:'water'});
  add({x:SPAN[0]-600,w:SPAN[1]-SPAN[0]+1200,z:-700,d:500,h:.4,y:0,layer:1,role:'water'});
  row(2,{w:[40,70],gap:[10,40],h:[12,24],dz:10,d:30,fn:b=>{b.z=-85;}});
  for(let x=SPAN[0]+120;x<SPAN[1];x+=R(200,260)){add({x,w:3,z:-70,d:3,h:72,layer:2,role:'accent'});add({x:x-40,w:66,z:-70,d:3,h:3.5,y:66,layer:2,role:'accent'});add({x:x-42,w:7,z:-70,d:5,h:7,y:62,layer:2,role:'roof'});}
  row(1,{w:[10,16],gap:[2,30],h:[6,20],d:12});
  for(let x=SPAN[0]+200;x<SPAN[1];x+=640){add({x,w:140,z:-460,d:24,h:14,layer:1,role:'roof'});add({x:x+100,w:26,z:-460,d:16,h:16,y:14,layer:1,ci:1});}
  for(const x of [700,2000]){add({shape:'pyr',x:x-70,w:170,z:-1150,d:120,h:40,layer:0,ci:1});add({x,w:14,z:-1150,d:14,h:130,y:20,layer:0,role:'dominant'});add({x:x-3,w:20,z:-1150,d:20,h:14,y:150,layer:0,role:'accent'});add({shape:'pyr',x:x-3,w:20,z:-1150,d:20,h:12,y:164,layer:0,role:'dominant'});}
  row(0,{w:[40,90],gap:[60,200],h:[25,60]});
 }else if(kind==='horizon'){
  row(2,{w:[60,140],gap:[0,10],h:[1,4],dz:20,d:60});
  for(let x=SPAN[0]+80;x<SPAN[1];x+=R(150,200)){const h=R(60,80);add({x,w:2.4,z:-60,d:2.4,h,layer:2,role:'accent'});add({x:x-2,w:7,z:-60,d:4,h:4,y:h-2,layer:2,role:'accent'});
   const a=R(0,2.1);for(let k=0;k<3;k++)add({x:x+1.2-1,w:2,z:-58,d:1,h:30,y:h,layer:2,role:'accent',rz:a+k*2.094,pivot:[x+1.2,h]});}
  for(let x=SPAN[0];x<SPAN[1];x+=R(160,260))add({shape:'pyr',x,w:R(220,340),z:-420,d:200,h:R(30,70),layer:1,ci:I(2)});
  for(let x=SPAN[0]-200;x<SPAN[1];x+=R(380,560))add({shape:'pyr',x,w:R(520,820),z:-1300,d:500,h:R(120,230),layer:0,ci:I(2)});
  add({x:1500,w:12,z:-380,d:12,h:30,y:80,layer:1,role:'dominant'});add({shape:'pyr',x:1497,w:18,z:-380,d:18,h:12,y:110,layer:1,role:'dominant'});
 }else{
  row(2,{w:[20,40],gap:[4,14],h:[25,70],dz:15,d:24});
  row(1,{w:[30,60],gap:[6,24],h:[50,130],fn:b=>{if(r()<.3)add({shape:'pyr',x:b.x,w:b.w,z:b.z,d:b.d,h:R(20,50),y:b.h,layer:1,role:'roof'});}});
  row(0,{w:[50,90],gap:[10,60],h:[110,240]});
  for(const x of [900,2200]){add({x,w:60,z:-1150,d:60,h:380,layer:0,role:'dominant'});add({shape:'pyr',x,w:60,z:-1150,d:60,h:90,y:380,layer:0,role:'dominant'});add({x:x+29,w:2,z:-1150,d:2,h:60,y:460,layer:0,role:'accent'});}
 }
 return out;
}
// Okna: obdélníčky na přední stěně budov (role wall/dominant) v mřížce, podíl density; vrací [{x,y,z,w,h,layer,ci}].
export function windowsFor(blocks,density,seed=5){
 const r=rng(seed),out=[];if(!density)return out;
 for(const b of blocks){if(b.shape!=='box'||(b.role!=='wall'&&b.role!=='dominant')||b.h<8||b.w<8)continue;
  const s=b.layer===0?9:b.layer===1?6:4.5,cols=Math.floor(b.w/s),rows=Math.floor((b.h-2)/s*.85);
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)if(r()<density)out.push({x:b.x+(i+.5)*b.w/cols,y:(b.y??0)+2+(j+.5)*s/.85,z:b.z+b.d/2+.3,w:s*.45,h:s*.5,layer:b.layer,ci:Math.floor(r()*3)});}
 return out;
}
