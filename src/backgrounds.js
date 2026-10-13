import {DISTRICTS,districtAt,tileOffset} from './scenes.js';
import {drawRouteLayer} from './route-render.js';
import {theme} from './themes.js';
import {drawSkyLife} from './ambient.js';
export {DISTRICTS,districtAt} from './scenes.js';
const images=DISTRICTS.map(d=>{const img=new Image();img.src=new URL(`../assets/backgrounds/${d.id}-sky.svg`,import.meta.url).href;return img;});
// Cyber uses the pixel SVG skies; other themes paint their sky procedurally.
function sky(c,index,camera,time){
 const t=theme();if(t.sky)return t.sky(c,index,camera,time);
 const image=images[index];if(!image.complete||!image.naturalWidth)return;
 for(let x=tileOffset(camera,.035);x<640;x+=960)c.drawImage(image,x,0,960,360);
}
export function drawBackground(c,distance,camera,height,time=0){
 const d=districtAt(distance);
 c.fillStyle=theme().base;c.fillRect(0,0,640,360);
 sky(c,d.index,camera,time);
 // Only light/sky color blends. Geography stays anchored in world coordinates.
 if(d.blend){c.save();c.globalAlpha=d.blend;sky(c,d.next,camera,time);c.restore();}
 drawSkyLife(c,distance,time);
 drawRouteLayer(c,camera,height);
}
