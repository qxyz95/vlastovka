// Živá čtvrť Violet Suburbs (místa 1–4 trasy): čisté funkce bez three.js a bez DOM.
// Rozmístění (auta, vlak, lidé, komíny, prádlo, vlajky, okna, ptáci, balóny, mraky), časování pohybu a plán reakcí.
// Vlastní D1 (Suburbs). Testy: tests/render3d-life.test.js. Kreslí je life3d.js.
import {SCREEN_METERS,ROUTE,DISTRICTS} from '../scenes.js';
import EN from '../locales/en.js';
import {random} from '../random.js';
import {TIMING} from '../events.js';
import {LAUNCH} from './models/launch-site.js';
import {cityChunk,chunkOffset,WINDOW_TILE} from './geometry.js';
import {CYBER} from './palette.js';

export const SUBURBS={x0:0,x1:4*SCREEN_METERS,screens:[0,1,2,3]};
// Anglické názvy míst a čtvrtí (08-navrh-kolo2 §4.2), zdroj je slovník src/locales/en.js.
export const PLACE_EN=ROUTE.map(r=>EN['place.'+r.kind]),DISTRICT_EN=DISTRICTS.map(d=>EN['district.'+d.id]);
// Hlášky z 08 §7.2 (Cyber Pigeon, Market Vent), čte je jen prototype/3d.
export const EVENT_TEXT={bird:{name:'CYBER PIGEON',hit:'Coo. Carbs delivered.',miss:'The pigeon kept the baguette.'},gust:{name:'MARKET VENT',hit:'Smells like dumplings. Feels like lift.',miss:'Just steam and regret.'}};
// Postavičky animované „on twos“ (12 snímků/s), kamera, auta a vlaštovka plynule.
export const TWOS=12;
export const onTwos=t=>Math.floor(t*TWOS+1e-9)/TWOS;
export const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const hash=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};
export const wrap=(x,a,b)=>a+(((x-a)%(b-a))+(b-a))%(b-a);
// Vzor oken v textuře (stejný generátor jako toon.js windowTexture): 8 × 8 buněk, část svítí.
export function windowPattern(seed=7,lit=.38){let a=seed;const rnd=()=>{a=(a*16807)%2147483647;return a/2147483647;},out=[];
 for(let row=0;row<8;row++)for(let col=0;col<8;col++){const on=rnd()<lit;out.push(on?{row,col,lit:true,color:Math.floor(rnd()*4),alpha:.55+rnd()*.45}:{row,col,lit:false});}return out;}
// Tmavá okna na čelní stěně kvádru přesně tam, kde je v textuře tmavá buňka (uv jako boxVertices, CanvasTexture flipY).
export function facadeWindows(b,pattern=windowPattern()){
 const TW=WINDOW_TILE.w,TH=WINDOW_TILE.h,ou=b.ou??0,ov=b.ov??0,y0=b.y??0,out=[];
 for(const p of pattern){if(p.lit)continue;const u0=(p.col*32+10)/256,u1=(p.col*32+23)/256,v0=1-(p.row*32+23)/256,v1=1-(p.row*32+11)/256;
  for(let k=-1;k<=Math.ceil(b.w/TW)+1;k++)for(let m=-1;m<=Math.ceil(b.h/TH)+1;m++){const xa=b.x+(u0-ou+k)*TW,xb=b.x+(u1-ou+k)*TW,ya=y0+(v0-ov+m)*TH,yb=y0+(v1-ov+m)*TH;
   if(xa>=b.x+.2&&xb<=b.x+b.w-.2&&ya>=y0+1&&yb<=y0+b.h-.3)out.push({x:(xa+xb)/2,y:(ya+yb)/2,z:b.z+b.d/2+.05,w:xb-xa,h:yb-ya,row:p.row,col:p.col});}}
 return out;
}
const K=CYBER.life,CLOTHES=K.people.cloth,SKIN=K.people.skin,PASTEL=K.pastel;
export const LANES=[{z:-4.6,dir:1},{z:-7.2,dir:-1}],TRACK={z:-15,portal:656,end:1560,cars:6,len:12,gap:1,speed:17,pause:5},CAR_RANGE=[-140,1360];
// Auto v pruhu přes místo odhodu (Papírové město, S4): pruhy LANES vedou skrz opěrnou zeď H6 a pod domem H2, auto (střed x, půl délky half)
// se proto v rozsahu zdi nekreslí, jinak by trčelo nad zeď.
export const behindLaunch=(x,half=2.1)=>x+half>LAUNCH.wallX&&x-half<LAUNCH.wallX+LAUNCH.wallW;
// Celé rozmístění čtvrti. Deterministické (vlastní seed), vychází z cityChunk(0–3), takže lidé a komíny sedí na střechách.
// view = pás výhledu S-1 jako papírové karty (cityChunk view), aby komíny a lidé seděli na snížených střechách místa 1.
export function suburbLife({view=false}={}){
 const rng=random(90210),R=(a,b)=>a+rng()*(b-a),pick=a=>a[Math.floor(rng()*a.length)],pattern=windowPattern();
 const chunks=SUBURBS.screens.map(s=>({...cityChunk(s,{view:view&&s===0}),screen:s,dx:chunkOffset(s)})),tag=c=>b=>({...b,x:b.x+c.dx,screen:c.screen,kind:c.kind});// cityChunk je lokální, život ve světových m
 const near=chunks.flatMap(c=>c.blocks.filter(b=>b.type==='box'&&b.tone===0&&b.z<=-20&&b.z>-40).map(tag(c)));
 const mid=chunks.flatMap(c=>c.blocks.filter(b=>b.type==='box'&&b.tone===1&&b.z<=-100&&b.z>-130).map(tag(c)));
 const front=b=>b.z+b.d/2,L={cars:[],people:[],chimneys:[],tanks:[],antennas:[],laundry:[],bunting:[],pinwheels:[],windows:[],stalls:[],bulbs:[],flocks:[],balloons:[],clouds:[],static:[]};
 // Auta ve dvou pruzích (opačné směry), rozestupy aspoň 20 m.
 for(const [li,lane] of LANES.entries())for(let x=CAR_RANGE[0];x<CAR_RANGE[1]-20;x+=R(22,60))L.cars.push({lane:li,z:lane.z,dir:lane.dir,x0:x,speed:R(9,14)*(li?1.1:1),color:pick(PASTEL),len:4.2});
 // Střechy: komíny, nádrže, lidé (otočí se, mávnou, ukážou, vyskočí), antény nad tržnicí.
 const roofKinds={roofs:['turn','wave','point','jump'],market:['wave','point','jump'],garden:['wave','turn'],rail:['point','wave','turn']};
 for(const b of near){const k=b.kind;
  if(rng()<.55)L.chimneys.push({x:b.x+R(1,Math.max(1.2,b.w-2)),y:b.h,z:b.z+R(-2,2),h:R(1.6,2.8),phase:rng()});
  if(rng()<.25&&b.w>9)L.tanks.push({x:b.x+R(1,b.w-4),y:b.h,z:b.z-1.5});
  const n=b.w<8?0:k==='garden'?(rng()<.5?1:0):rng()<.25?2:1;
  for(let i=0;i<n;i++)L.people.push({x:b.x+1+rng()*(b.w-2),y:b.h,z:front(b)-1.2-rng()*2,kind:pick(roofKinds[k]),place:b.screen,crowd:false,cloth:pick(CLOTHES),skin:pick(SKIN),seed:rng()});
  if(k==='market'&&rng()<.7)L.antennas.push({x:b.x+R(1,b.w-1),y:b.h,z:b.z+R(-3,1),h:R(4,9)});
  if((k==='roofs'||k==='garden'||k==='market')&&b.w>=8&&b.h>=9&&rng()<.45){const y=Math.round(b.h*R(.45,.65)),z=front(b)+.45,items=[];
   for(let x=b.x+1.2;x<b.x+b.w-1.6;x+=R(1.1,1.7))items.push({x,y,z,w:R(.7,1.15),h:R(.75,1.3),color:pick(CLOTHES)});
   L.laundry.push({x0:b.x+.6,x1:b.x+b.w-.6,y,z,items});}
  for(const w of facadeWindows(b,pattern))if(rng()<.85)L.windows.push({...w,h0:rng()});}
 for(const b of mid){if(rng()<.3)L.chimneys.push({x:b.x+R(2,Math.max(2.5,b.w-3)),y:b.h,z:b.z,h:R(2.5,4),phase:rng(),big:true});
  if(b.kind==='market'&&rng()<.6)L.antennas.push({x:b.x+R(2,b.w-2),y:b.h,z:b.z,h:R(8,16)});}
 // Tržnice: stánky s markýzami, žárovky, dav na chodníku, dvě šňůry vlaječek přes náměstí.
 const M0=SCREEN_METERS+50,M1=2*SCREEN_METERS-55;
 for(let x=M0,i=0;x<M1-8;x+=R(9,12),i++){const color=PASTEL[i%PASTEL.length];L.stalls.push({x,w:7,z:-13.6,d:3,color});for(let j=0;j<8;j++)L.bulbs.push({x:x+.4+j*.9,y:2.55,z:-11.7,i:L.bulbs.length});}
 for(let i=0;i<70;i++)L.people.push({x:R(M0,M1),y:0,z:R(-11.2,-9),kind:pick(['wave','jump','point','turn']),place:1,crowd:true,cloth:pick(CLOTHES),skin:pick(SKIN),seed:rng()});
 for(const [y,z] of [[6.8,-12.2],[8.4,-16.5]]){const items=[];for(let x=M0;x<M1;x+=1.5)items.push({x,y,z,color:PASTEL[items.length%PASTEL.length]});L.bunting.push({x0:M0,x1:M1,y,z,items});}
 // Zahrady: větrníky (A03 Pinwheel) a zahradníci.
 for(let i=0;i<14;i++)L.pinwheels.push({x:R(2*SCREEN_METERS+70,3*SCREEN_METERS-20),y:2.6,z:R(-16,-9.5),color:pick(PASTEL),dir:rng()<.5?1:-1});
 for(let i=0;i<10;i++)L.people.push({x:R(2*SCREEN_METERS+70,3*SCREEN_METERS-20),y:0,z:R(-15,-9.5),kind:pick(['wave','turn']),place:2,crowd:false,cloth:pick(CLOTHES),skin:pick(SKIN),seed:rng()});
 // Železnice: nástupiště za odstavenými vagony.
 for(let i=0;i<12;i++)L.people.push({x:R(1100,1168),y:.8,z:R(-12.4,-11.4),kind:pick(['wave','point','jump']),place:3,crowd:false,cloth:pick(CLOTHES),skin:pick(SKIN),seed:rng()});
 // Vzduch ve vrstvách: hejna (střed), balóny (daleko), mraky (nebe; ve hře je nekreslí nic, jen paper-cards.lifeCards).
 for(let i=0;i<4;i++)L.flocks.push({x0:R(-100,1300),y:R(28,60),z:R(-70,-150),v:R(5,9)*(rng()<.7?1:-1),n:7+Math.floor(rng()*5),seed:rng()*9});
 for(let i=0;i<8;i++)L.balloons.push({x:R(0,1300),y:R(55,130),z:R(-170,-280),r:R(5,8),color:pick(PASTEL),v:R(.6,1.6),phase:rng()*6});
 for(let i=0;i<14;i++)L.clouds.push({x:R(-200,1500),y:R(110,230),z:R(-520,-760),sx:R(12,26),sy:R(4,7),v:R(.5,1.5)});
 // Statické doplňky (kvádry pro mergeBlocks): komíny, nádrže, antény, stánky, koleje, tunel, nástupiště, sloupky větrníků.
 const S=(b,color)=>L.static.push({type:'box',y:0,...b,color});
 for(const c of L.chimneys)S({x:c.x-.5,w:c.big?1.6:1,z:c.z,d:c.big?1.6:1,h:c.h,y:c.y},K.chimney);
 for(const t of L.tanks){S({x:t.x,w:2.6,z:t.z,d:2.6,h:2.6,y:t.y+.9},K.tanks.body);S({x:t.x+.3,w:.3,z:t.z,d:.3,h:.9,y:t.y},K.tanks.leg);S({x:t.x+2,w:.3,z:t.z,d:.3,h:.9,y:t.y},K.tanks.leg);L.static.push({type:'pyramid',x:t.x,w:2.6,z:t.z,d:2.6,h:1.2,y:t.y+3.5,color:K.tanks.roof});}
 for(const a of L.antennas){S({x:a.x-.12,w:.24,z:a.z,d:.24,h:a.h,y:a.y},K.mast);S({x:a.x-1.2,w:2.4,z:a.z,d:.16,h:.16,y:a.y+a.h*.7},K.mast);S({x:a.x-.8,w:1.6,z:a.z,d:.16,h:.16,y:a.y+a.h*.85},K.mast);}
 for(const s of L.stalls){S({x:s.x,w:s.w,z:s.z,d:s.d,h:1.1},K.stall.base);for(const dx of [.1,s.w-.3])S({x:s.x+dx,w:.2,z:s.z+1.3,d:.2,h:2.5},K.stall.post);
  for(let j=0;j<4;j++)S({x:s.x-.3+j*1.9,w:1.9,z:s.z+.3,d:3.8,h:.35,y:2.5},j%2?K.stall.stripe:s.color);}
 for(const l of [...L.laundry,...L.bunting])S({x:l.x0,w:l.x1-l.x0,z:l.z,d:.06,h:.06,y:l.y},K.line);
 for(const p of L.pinwheels)S({x:p.x-.06,w:.12,z:p.z,d:.12,h:p.y},K.stall.post);
 S({x:TRACK.portal-12,w:22,z:TRACK.z,d:9,h:9},K.tunnel.wall);S({x:TRACK.portal-4,w:6,z:TRACK.z+4.3,d:.6,h:5.4},K.tunnel.mouth);
 L.static.push({type:'pyramid',x:TRACK.portal-20,w:36,z:TRACK.z-6,d:20,h:16,color:K.pyramid});
 S({x:TRACK.portal-2,w:TRACK.end+300-TRACK.portal,z:TRACK.z,d:3.2,h:.18},K.rail.bed);for(const dz of [-.75,.75])S({x:TRACK.portal-2,w:TRACK.end+300-TRACK.portal,z:TRACK.z+dz,d:.14,h:.32},K.rail.track);
 S({x:1094,w:78,z:-11.9,d:2.6,h:.8},K.platform);
 return L;
}
// ── Pohyb (čisté funkce času t v sekundách).
export const carX=(c,t)=>wrap(c.x0+c.dir*c.speed*t,CAR_RANGE[0],CAR_RANGE[1]);
// Vlak vyjede z tunelu, přejede k řece a po pauze znovu. Vrací levý okraj každého vozu (null = v tunelu nebo pryč).
export const trainPeriod=()=>(TRACK.end-TRACK.portal+TRACK.cars*(TRACK.len+TRACK.gap))/TRACK.speed+TRACK.pause;
export function trainHead(t){return TRACK.portal+TRACK.speed*wrap(t,0,trainPeriod());}
export function trainCars(t){const h=trainHead(t);return Array.from({length:TRACK.cars},(_,i)=>{const x=h-(i+1)*(TRACK.len+TRACK.gap)+TRACK.gap;return x>TRACK.portal-TRACK.len&&x<TRACK.end?x:null;});}
// Hejno v klínu: vedoucí letí napříč čtvrtí, ostatní za ním; mávání křídel on twos.
export function birdAt(fl,i,t){const lead=wrap(fl.x0+fl.v*t,-250,1500),side=i%2?1:-1,rank=Math.ceil(i/2),T=onTwos(t);
 return {x:lead-Math.sign(fl.v)*rank*2.4,y:fl.y+Math.sin(t*.35+fl.seed)*5+rank*.5,z:fl.z+side*rank*1.6,flap:Math.floor(T*TWOS/2+i)%2?1:-.5,dir:Math.sign(fl.v)};}
export const balloonAt=(b,t)=>({x:wrap(b.x+b.v*t,-200,1500),y:b.y+Math.sin(t*.3+b.phase)*3,z:b.z});
// ── Stopa vlaštovky: historie {t,x,y} (x roste) → kdy vlaštovka minula bod x (lineárně mezi vzorky), jinak null.
export function createTrail(){return {t:[],x:[],y:[]};}
export function pushTrail(h,t,x,y){const n=h.x.length;if(n&&x<=h.x[n-1])return h;h.t.push(t);h.x.push(x);h.y.push(y);return h;}
export function passTime(h,x){const n=h.x.length;if(!n||x>h.x[n-1])return null;if(x<=h.x[0])return {t:h.t[0],y:h.y[0]};
 let a=0,b=n-1;while(b-a>1){const m=(a+b)>>1;if(h.x[m]<x)a=m;else b=m;}const k=(x-h.x[a])/(h.x[b]-h.x[a]||1);return {t:h.t[a]+(h.t[b]-h.t[a])*k,y:h.y[a]+(h.y[b]-h.y[a])*k};}
// Vír za vlaštovkou: náraz hned po průletu, slábne s věkem a s výškovým rozdílem.
export const wake=(age,dy)=>age==null||age<0||age>4?0:Math.exp(-Math.abs(dy)/9)*Math.exp(-age/.9)*smooth(age/.06);
// Okno za vlaštovkou: rozsvítí se se zpožděním podle náhody h, „pop“ přes 1, svítí 5–12 s a zhasne. Jen do 28 m od výšky letu.
export function windowLight(age,dy,h=0){if(age==null||Math.abs(dy)>28)return 0;const a=age-(.08+h*.55+Math.abs(dy)*.012),hold=5+h*7;
 if(a<0||a>hold+.3)return 0;if(a>hold)return 1-smooth((a-hold)/.3);const p=Math.min(1,a/.2);return p<1?p*(1+.6*Math.sin(p*Math.PI)):1;}
// ── Reakce postav. Všimnou si vlaštovky 30 m před sebou (age = čas od té chvíle), pokud letí do 45 m nad nimi.
export const NOTICE_AHEAD=30,NOTICE_HEIGHT=45;
export const REACT={turn:3.4,wave:3,point:3,jump:2.4,cheer:2.2};
export function noticeAge(h,p,t){const pass=passTime(h,p.x-NOTICE_AHEAD);return pass&&pass.y-p.y<NOTICE_HEIGHT&&pass.y-p.y>-8?t-pass.t:null;}
// Póza: yaw (otočení za vlaštovkou, dx = vlaštovka − postava), arm (zvednutí ruky v rad), hop (výskok v m). Čas on twos.
export function pose(kind,age,dx=0,seed=0){if(age==null||!(age>=0)||age>=REACT[kind])return {yaw:0,arm:0,hop:0};
 const a=onTwos(age),env=smooth(a/.25)*smooth((REACT[kind]-a)/.45),look=Math.max(-1.1,Math.min(1.1,Math.atan2(dx,10)))*env;
 if(kind==='turn')return {yaw:look,arm:0,hop:0};
 if(kind==='wave')return {yaw:look*.7,arm:env*(2.1+.55*Math.sin(a*13+seed*6)),hop:0};
 if(kind==='point')return {yaw:look*.8,arm:env*2.3,hop:0};
 if(kind==='jump')return {yaw:look*.5,arm:env*2.7,hop:env*Math.abs(Math.sin(a*8+seed))*.55};
 return {yaw:0,arm:env*(2.6+.4*Math.sin(a*16+seed*9)),hop:env*Math.abs(Math.sin(a*10+seed*6))*.7};}// cheer
// Dav na tržnici zajásá po trefené události; silnější z obou póz vyhrává.
export function crowdPose(p,age,dx,cheerAge){const a=pose(p.kind,age,dx,p.seed),c=pose('cheer',cheerAge,dx,p.seed);return c.arm>a.arm?c:a;}
// Holub s bagetou (bird) a pára z tržnice (gust) kolem vlaštovky podle fáze události. Offset v metrech od vlaštovky.
export function companion(e,ft){if(!e)return null;const age=ft-e.at;
 if(e.type==='bird'){if(e.phase==='warning')return {dx:34-age/TIMING.warning*24,dy:7-age*4,flap:true};
  if(e.phase==='interaction')return {dx:8+Math.sin(age*3)*.6,dy:3.2+Math.sin(age*5)*.4,flap:true};
  const k=ft-(e.resolvedAt??ft),hit=e.result==='success'||e.result==='perfect';return hit?{dx:.6,dy:2+Math.min(1,k*3)*.3,flap:true,hit}:{dx:8+k*16,dy:3+k*11,flap:true,hit};}
 if(e.phase==='warning'||e.phase==='interaction')return {dx:10,dy:0,steam:Math.min(1,age/TIMING.warning)};
 return {dx:0,dy:0,steam:Math.max(0,1-(ft-(e.resolvedAt??ft))*1.2),hit:e.result==='success'||e.result==='perfect'};}
