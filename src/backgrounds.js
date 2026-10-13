import {DISTRICTS,districtAt,tileOffset} from './scenes.js';
import {drawRouteLayer} from './route-render.js';
export {DISTRICTS,districtAt} from './scenes.js';
const images=DISTRICTS.map(d=>{const img=new Image();img.src=new URL(`../assets/backgrounds/${d.id}-sky.svg`,import.meta.url).href;return img;});
function sky(c,image,camera){
 if(!image.complete||!image.naturalWidth)return;
 for(let x=tileOffset(camera,.035);x<640;x+=960)c.drawImage(image,x,0,960,360);
}
export function drawBackground(c,distance,camera,height){
 const d=districtAt(distance);
 c.fillStyle='#120e30';c.fillRect(0,0,640,360);
 sky(c,images[d.index],camera);
 // Only light/sky color blends. Geography stays anchored in world coordinates.
 if(d.blend&&images[d.next].complete&&images[d.next].naturalWidth){
  c.save();c.globalAlpha=d.blend;sky(c,images[d.next],camera);c.restore();
 }
 drawRouteLayer(c,camera,height);
}
