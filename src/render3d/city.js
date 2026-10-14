// Město: keš míst podle indexu (cityChunk je lokální), skupina posunutá o chunkOffset(screen), stream nejvýš 1 nového místa za snímek,
// prewarm v Dílně, volání districts[i].build/update. Vlastní R1.
// createCity(ctx) → {group,buildChunk(index,screen),stream(plan),prewarm(indices),update(frameCtx),dispose(),stats()}.
// ctx = {scene,materials,ramp,hull,mood(),reduced,shop()}: shop() = true, dokud Dílnu kreslí shop bloky z cityChunk(0) (bez workshop.js R3).
import * as THREE from 'three';
import {mergeBlocks,cityChunk,placeIndex} from './geometry.js';
import {districtOf} from './districts/index.js';

export function bufferOf(m){const g=new THREE.BufferGeometry();for(const [k,n] of [['position',3],['normal',3],['uv',2],['color',3],['outline',3]])g.setAttribute(k,new THREE.BufferAttribute(m[k],n));g.computeBoundingSphere();return g;}
// Klíč keše: index místa; u indexu 0 zvlášť první obrazovka (Dílna + zem doleva) a další okruhy (bez Dílny).
export const chunkKey=(index,screen)=>index===0?(screen===0?'0s':'0r'):String(index);

export function createCity(ctx){
 const M=ctx.materials,group=new THREE.Group(),cache=new Map(),live=new Map();
 // Sestaví místo jednou pro daný klíč: budovy + obrys v jednom bufferu, záře, cedule, zem a volitelná skupina čtvrti.
 function buildChunk(index,screen=index){
  index=placeIndex(index);const key=chunkKey(index,screen);if(cache.has(key))return cache.get(key);
  const c0=cityChunk(index),keep=b=>key==='0s'&&ctx.shop()||!b.shop,c={...c0,screen,blocks:c0.blocks.filter(keep),signs:c0.signs.filter(keep)},g=new THREE.Group(),geos=[];
  const solid=c.blocks.filter(b=>!b.beacon).concat(c.lamps.map(l=>({type:'box',x:l.x,w:.5,z:l.z,d:.5,h:l.h,biome:c.biome,tone:1})));
  const glow=c.blocks.filter(b=>b.beacon).map(b=>({...b,glow:'#ff4d6d'})).concat(c.lamps.map(l=>({type:'box',x:l.x-.6,w:1.7,z:l.z,d:.9,h:.5,y:l.h,glow:l.color})));
  for(let x=c.x0;x<c.x1-7;x+=14)glow.push({type:'box',x,w:7,z:3,d:.3,h:.05,glow:c.ground.water?'#2f6f9a':'#3b2d6e'});
  const geo=bufferOf(mergeBlocks(solid,M.colorOf)),mesh=new THREE.Mesh(geo,M.building),gg=bufferOf(mergeBlocks(glow,b=>M.rgb(b.glow)));geos.push(geo,gg);
  mesh.castShadow=mesh.receiveShadow=true;g.add(mesh,new THREE.Mesh(geo,ctx.hull),new THREE.Mesh(gg,M.glow));
  for(const s of c.signs){const m=new THREE.Mesh(M.unit,M.sign(s.text,s.color,s.vertical));m.scale.set(s.w,s.h,1);m.position.set(s.x+s.w/2,s.y+s.h/2,s.z);g.add(m);}
  const left=key==='0s'?c.x0-600:c.x0,pg=new THREE.PlaneGeometry(c.x1-left+.5,1250),ground=new THREE.Mesh(pg,M.ground[c.biome]);geos.push(pg);
  ground.rotation.x=-Math.PI/2;ground.position.set((left+c.x1)/2,0,-40);ground.receiveShadow=true;g.add(ground);
  const d=districtOf(index),dg=d.build(c,{scene:ctx.scene,materials:M,ramp:ctx.ramp,hull:ctx.hull,mood:ctx.mood(),reduced:ctx.reduced});if(dg)g.add(dg);
  const e={key,group:g,geos,district:d,dg,screen:null};cache.set(key,e);return e;
 }
 // Připojí místa z plan.places (seřazená od středu záběru); nové sestaví nejvýš jedno za snímek, z keše bez omezení. Ostatní odpojí (zůstávají v keši).
 function stream(plan){
  let built=0;const need=new Set(plan.places.map(p=>p.screen));
  for(const [s,e] of live)if(!need.has(s)){group.remove(e.group);e.screen=null;live.delete(s);}
  for(const p of plan.places){if(live.has(p.screen))continue;const key=chunkKey(p.index,p.screen);let e=cache.get(key);
   if(!e){if(built>=1)continue;e=buildChunk(p.index,p.screen);built++;}
   if(e.screen!=null)continue;// stejný index na dvou obrazovkách naráz (nenastane, místa se opakují po 16)
   e.group.position.x=p.x0;e.screen=p.screen;group.add(e.group);live.set(p.screen,e);}
  return built;
 }
 const prewarm=(indices=[0,1,2])=>indices.forEach(i=>buildChunk(i,i));
 function update(frameCtx){for(const e of live.values())if(e.dg)e.district.update(e.dg,frameCtx);}
 function dispose(){for(const e of cache.values()){group.remove(e.group);e.geos.forEach(g=>g.dispose());e.group.traverse(o=>{if(o.geometry&&o.geometry!==M.unit&&!e.geos.includes(o.geometry))o.geometry.dispose();});}cache.clear();live.clear();}
 return {group,buildChunk,stream,prewarm,update,dispose,stats:()=>({cached:cache.size,live:live.size,screens:[...live.keys()]})};
}
