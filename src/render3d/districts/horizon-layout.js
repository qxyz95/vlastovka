// Rozložení čtvrti Red Horizon (místa 8–11) pro cityChunk (geometry.js). Čisté, bez three.js. Vlastní D3 (Horizon). Formát viz suburbs-layout.js.
export const HORIZON_LAYOUT={id:'horizon',places:[8,9,10,11],tall:.5,
 kinds:{fields:{near:[0],mid:[.25,5,10],signs:0,open:true,lamps:false},turbines:{near:[0],mid:[.2,5,10],signs:0,turbines:5,open:true,lamps:false},
  peaks:{near:[0],mid:[0],signs:0,peaks:true,open:true,lamps:false},observatory:{near:[.2,5,9,10,14],mid:[0],signs:.1,peaks:true,observatory:true,open:true}},
 extras(kind,{add,rng,between,W}){const k=this.kinds[kind];
  if(k.turbines)for(let i=0;i<k.turbines;i++){const x=30+i*W/k.turbines;add({x,w:1.4,z:-70,d:1.4,h:44,tone:1});add({x:x-11,w:24,z:-69,d:.6,h:1,y:43,tone:1});add({x:x-.2,w:1.8,z:-69,d:.6,h:24,y:32,tone:1});}
  if(k.peaks)for(let i=0;i<5;i++){const w=between(90,180);add({type:'pyramid',x:i*W/5-w/4,w,z:-200-rng()*80,d:w*.6,h:between(50,120),tone:5});}
  if(k.observatory){add({x:W*.55,w:14,z:-60,d:14,h:10,y:30,tone:1});add({x:W*.55-30,w:74,z:-60,d:30,h:30,tone:5});add({type:'pyramid',x:W*.55+1,w:12,z:-60,d:12,h:8,y:40,tone:3});}}};
