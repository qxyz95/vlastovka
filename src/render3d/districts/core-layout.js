// Rozložení čtvrti Neon Core (místa 12–15) pro cityChunk (geometry.js). Čisté, bez three.js. Vlastní D4 (Core). Formát viz suburbs-layout.js.
export const CORE_LAYOUT={id:'core',places:[12,13,14,15],tall:1.4,
 kinds:{gate:{near:[.6,10,24,10,16],mid:[.8,20,50],signs:.5,gate:true},terraces:{near:[.7,8,18,12,20],mid:[.85,24,60],signs:.4,terraces:true},
  tower:{near:[.8,12,30,10,16],mid:[.9,30,80],signs:.5,tower:true},port:{near:[.9,14,34,10,18],mid:[.95,30,90],signs:.6}},
 extras(kind,{add,W}){const k=this.kinds[kind];
  if(k.gate){for(const f of [.35,.6])add({x:W*f,w:7,z:-40,d:7,h:60,tone:0});add({x:W*.35,w:W*.25+7,z:-40,d:6,h:5,y:55,tone:3,sign:'METROPOLIS'});}
  if(k.terraces)for(let i=0;i<4;i++)add({x:80+i*14,w:40-i*8,z:-60+i*6,d:14,h:46-i*10,tone:1});
  if(k.tower){const x=W*.5;add({x,w:14,z:-70,d:14,h:180,tone:1});add({x:x+6,w:2,z:-70,d:2,h:40,y:180,tone:3,beacon:true});}}};
