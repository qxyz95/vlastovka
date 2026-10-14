import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDirector,direct,titleAlpha,punchZoom,speedZoom,placeTitle,ZOOM_RANGE,TITLE} from '../src/render3d/camera.js';
import {follow} from '../src/render3d/geometry.js';
import {PLACE_EN,onTwos,wrap} from '../src/render3d/life.js';
import {ROUTE} from '../src/scenes.js';

// Owned by R5 (camera). Moved from the prototype's life test.
test('director: title and punch-in only at place boundaries, zoom bounded, plane stays put in frame',()=>{
 assert.equal(PLACE_EN.length,ROUTE.length);assert.deepEqual(placeTitle(1),{title:'Market under the Antennas',sub:'VIOLET SUBURBS · 2/4',district:0,first:false});
 assert.equal(titleAlpha(null),0);assert.equal(titleAlpha(1),1);assert.equal(titleAlpha(TITLE.fadeIn+TITLE.hold+TITLE.fadeOut+.01),0);
 assert.equal(punchZoom(null),1);assert.ok(punchZoom(.8)<.9);assert.equal(speedZoom(10),1);assert.ok(speedZoom(200)>1.4);
 const s=createDirector(),titles=[];let t=0;
 for(let x=0;x<1300;x+=.5,t+=1/60){direct(s,{x,v:30,t,dt:1/60,flying:true});if(s.at===t)titles.push(s.title.title);assert.ok(s.zoom>=ZOOM_RANGE[0]-1e-9&&s.zoom<=ZOOM_RANGE[1]+1e-9);
  const v=follow(x,10,{width:120*s.zoom});assert.ok(Math.abs((x-(v.cx-v.width/2))/v.width-148/640)<1e-9,'plane at px 148');}
 assert.deepEqual(titles,PLACE_EN.slice(0,5));
 const g=createDirector();direct(g,{x:400,v:0,t:0,dt:1/60,flying:false});assert.equal(g.title,null,'no title while aiming');
 assert.ok(Math.abs(onTwos(.99)-11/12)<1e-12&&wrap(-1,0,10)===9);
});
