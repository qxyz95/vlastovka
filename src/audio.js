// Audio engine (presentation): AudioContext unlocked on the first gesture, master/music/sfx buses, look-ahead scheduler
// ("A Tale of Two Clocks"), layer mixing from audio-mix.js, suspend while the tab is hidden, settings in localStorage.
// The game does not load it yet; only prototype-music.html uses it.
import {mixTargets,audioSettings,duckPoints,nextBoundary,level} from './audio-mix.js';
import {createGraph,playVoice} from './music/synth.js';
export const AUDIO_KEY='just-throw-it-audio';
export function loadAudioSettings(){try{return audioSettings(JSON.parse(localStorage.getItem(AUDIO_KEY)??'null'));}catch{return audioSettings(null);}}
export function saveAudioSettings(s){try{localStorage.setItem(AUDIO_KEY,JSON.stringify(audioSettings(s)));}catch{}}
const LOOK=.12,AHEAD=.3,PUMP_MS=25,BEATS=4;
const set=(p,v,t,tc=.05)=>{p.cancelScheduledValues(t);p.setValueAtTime(p.value,t);p.setTargetAtTime(v,t,tc);};
export function createAudio({ctx,autoUnlock=true}={}){
 const AC=globalThis.AudioContext??globalThis.webkitAudioContext;ctx??=new AC({latencyHint:'interactive'});
 const g=createGraph(ctx),listeners=new Set(),ms=[];let settings=loadAudioSettings(),unlocked=false,timer=null,cueId=0;
 const a={ctx,g,get settings(){return settings;},track:null,district:0,seed:1,bar:0,barTime:0,barStart:0,spb:.6,density:.5,queue:[],ends:[],peak:0,mix:{...mixTargets({}),layers:[0,0,0,0]},pending:null,file:null};
 const emit=(type,info)=>{for(const f of listeners)f(type,info);};
 a.on=f=>{listeners.add(f);return()=>listeners.delete(f);};
 // Visual equivalents: every sound announces itself with the audio time it will be heard at.
 a.cue=(name,when=ctx.currentTime,info={})=>{const id=++cueId;emit('cue',{id,name,when,...info});return id;};
 a.uncue=id=>emit('uncue',{id});
 const applyVolumes=()=>{const t=ctx.currentTime,s=settings;set(g.master.gain,s.muted?0:level(s.master),t);set(g.music.gain,level(s.music),t);set(g.sfx.gain,level(s.sfx),t);};
 a.setSettings=patch=>{settings=audioSettings({...settings,...patch});saveAudioSettings(settings);applyVolumes();emit('settings',settings);return settings;};
 applyVolumes();
 a.unlock=()=>{try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}unlocked=true;if(ctx.state==='suspended'&&!document.hidden)ctx.resume();emit('unlock');};
 if(autoUnlock&&globalThis.addEventListener){for(const t of ['pointerdown','keydown','touchend'])addEventListener(t,a.unlock,{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)ctx.suspend();else if(unlocked)ctx.resume();});}
 a.unlocked=()=>unlocked&&ctx.state==='running';
 const applyDistrict=t=>{const d=a.track.districts[a.district];a.spb=60/d.bpm;g.layers.forEach((L,l)=>{set(L.verbSend.gain,d.verb?.[l]??.2,t,.3);set(L.echoSend.gain,d.echo?.[l]??0,t,.3);});g.delay.delayTime.setTargetAtTime(.75*a.spb,t,.2);g.sfxDelay.delayTime.setTargetAtTime(.75*a.spb,t,.2);};
 // Start or switch music; a running track changes on the next bar line.
 a.play=(track,district=0,seed=a.seed)=>{a.stopFile();if(!a.track){a.track=track;a.district=district;a.seed=seed;a.bar=0;a.barTime=ctx.currentTime+.08;applyDistrict(ctx.currentTime);}else a.pending={track,district,seed};emit('track',{track,district});};
 a.stop=()=>{a.track=null;a.pending=null;a.queue.length=0;for(const L of g.layers)set(L.gain.gain,0,ctx.currentTime,.3);a.mix={...a.mix,layers:[0,0,0,0]};};
 a.bpm=()=>60/a.spb;
 a.nextBeat=(unit=1)=>nextBoundary(ctx.currentTime,a.bpm(),a.barStart,unit);
 // Mix from the game state: thinning (warning/window) is immediate, everything else fades in on the next beat.
 a.setMix=state=>{const m=mixTargets({...state,calm:settings.calm}),t=ctx.currentTime,beat=a.track?a.nextBeat(1):t;a.density=Math.min(1,Math.max(0,((state.speed??1)-.6)/1.4));
  m.layers.forEach((v,l)=>{if(Math.abs(v-a.mix.layers[l])<1e-3)return;const p=g.layers[l].gain.gain,down=v<a.mix.layers[l];p.cancelScheduledValues(t);p.setValueAtTime(p.value,t);p.setTargetAtTime(v,down||m.urgent?t:beat,m.urgent?.04:.2);});
  const rel=(x,y)=>Math.abs(x-y)/y>.04;
  if(rel(m.filter,a.mix.filter)||a.mix.urgent!==m.urgent)g.lp.frequency.setTargetAtTime(m.filter,t,.25);
  if(rel(m.padFilter,a.mix.padFilter))g.layers[0].lp.frequency.setTargetAtTime(m.padFilter,t,m.urgent?.04:.3);
  if(Math.abs(m.reverb-a.mix.reverb)>.02)g.verbOut.gain.setTargetAtTime(m.reverb,t,.5);
  a.mix=m;return m;};
 a.duck=(when=ctx.currentTime,o={})=>{const p=g.duck.gain;p.cancelScheduledValues(when);p.setValueAtTime(1,when);for(const [t,v] of duckPoints(when,o))p.linearRampToValueAtTime(v,t);a.cue('duck',when,{db:o.db??-5});};
 // Voice bookkeeping for the load meter.
 a.voice=(end)=>{a.ends.push(end);};
 const play=e=>{const L=g.layers[e.l];a.ends.push(playVoice(g,e,e.t,a.spb,L.gain));if(e.l===3&&a.mix.octave&&e.n!=null)a.ends.push(playVoice(g,{...e,n:e.n+12,v:e.v*.4},e.t,a.spb,L.gain));};
 function pump(){
  const t0=performance.now(),now=ctx.currentTime;
  if(a.track&&ctx.state==='running'){
   if(a.barTime<now)a.barTime=now+.05;// after a stall, never schedule into the past
   let added=false;
   while(a.barTime<now+AHEAD){
    if(a.pending){const p=a.pending;a.pending=null;a.track=p.track;a.district=p.district;a.seed=p.seed;applyDistrict(a.barTime);emit('switch',{track:p.track,district:p.district,when:a.barTime});}
    const evs=a.track.bar(a.bar,a.district,{seed:a.seed,density:a.density});
    for(const e of evs)a.queue.push({...e,t:a.barTime+e.b*a.spb});
    emit('bar',{bar:a.bar,when:a.barTime,spb:a.spb});a.barStart=a.barTime;a.barTime+=BEATS*a.spb;a.bar++;added=true;
   }
   if(added)a.queue.sort((x,y)=>x.t-y.t);
   while(a.queue.length&&a.queue[0].t<now+LOOK){const e=a.queue.shift();if(e.t<now-.02)continue;if(a.mix.layers[e.l]<.001&&g.layers[e.l].gain.gain.value<.001)continue;play(e);}
  }
  a.ends=a.ends.filter(x=>x>now);a.peak=Math.max(a.peak,a.ends.length);
  ms.push(performance.now()-t0);if(ms.length>200)ms.shift();
 }
 a.start=()=>{if(!timer)timer=setInterval(pump,PUMP_MS);};a.halt=()=>{clearInterval(timer);timer=null;};
 a.stats=()=>({voices:a.ends.filter(x=>x>ctx.currentTime).length,peak:a.peak,schedAvg:ms.reduce((s,x)=>s+x,0)/Math.max(1,ms.length),schedMax:Math.max(0,...ms),queue:a.queue.length,state:ctx.state,base:ctx.baseLatency??0,output:ctx.outputLatency??0,rate:ctx.sampleRate,underruns:ctx.playbackStats?.underrunEvents??null,underrunMs:ctx.playbackStats?(ctx.playbackStats.underrunDuration*1000):null});
 // Own file (drag & drop) for comparison: decoded in memory only, looped through the same filter and ducking.
 a.playFile=async(buf,name='file')=>{const b=await ctx.decodeAudioData(buf);a.stop();a.stopFile();const s=ctx.createBufferSource(),gn=ctx.createGain();s.buffer=b;s.loop=true;gn.gain.value=.9;s.connect(gn);gn.connect(g.lp);s.start();a.file={s,gn,name,duration:b.duration};emit('file',a.file);return a.file;};
 a.stopFile=()=>{if(a.file){try{a.file.s.stop();}catch{}a.file.gn.disconnect();a.file=null;}};
 a.start();
 return a;
}
// CPU check: renders `sec` seconds of a direction with all layers open in an OfflineAudioContext.
export async function benchmark(track,district=0,sec=8,rate=44100){
 const ctx=new OfflineAudioContext(2,Math.floor(rate*sec),rate),g=createGraph(ctx),d=track.districts[district],spb=60/d.bpm,spans=[];
 g.layers.forEach((L,l)=>{L.gain.gain.value=[.8,.85,.8,.7][l];L.verbSend.gain.value=d.verb?.[l]??.2;L.echoSend.gain.value=d.echo?.[l]??0;});g.delay.delayTime.value=.75*spb;
 const t0=performance.now();let events=0;
 for(let bar=0,t=0;t<sec;bar++,t+=BEATS*spb)for(const e of track.bar(bar,district,{seed:1,density:.7})){const at=t+e.b*spb;if(at>=sec)continue;spans.push([at,playVoice(g,e,at,spb,g.layers[e.l].gain)]);events++;}
 const schedule=performance.now()-t0,t1=performance.now();await ctx.startRendering();const ms=performance.now()-t1;
 const marks=spans.flatMap(([s,e])=>[[s,1],[e,-1]]).sort((x,y)=>x[0]-y[0]||x[1]-y[1]);let cur=0,peak=0;for(const [,k] of marks){cur+=k;peak=Math.max(peak,cur);}
 return {id:track.id,district,sec,ms,schedule,factor:sec*1000/ms,peak,events};
}
