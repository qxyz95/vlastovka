import {fresh} from './core.js';
export const KEY='just-throw-it-v1';
export function decode(raw) {
  if(raw===null) return fresh();
  const p=JSON.parse(raw);
  if(!p||![1,2,3].includes(p.version)||!Number.isSafeInteger(p.coins)||p.coins<0||!Number.isFinite(p.best)||p.best<0||!Number.isSafeInteger(p.attempts)||p.attempts<0||typeof p.completed!=='boolean'||!['dart','glider'].includes(p.model)||!p.levels) throw Error('Invalid save');
  const branches=['power','paper','fold'],valid=l=>l&&branches.every(b=>Number.isInteger(l[b])&&l[b]>=0&&l[b]<=5);
  // v2 had separate trees per model; shared tree keeps the better level of each branch.
  if(p.version===2){if(!valid(p.levels.dart)||!valid(p.levels.glider)) throw Error('Invalid levels');p.levels=Object.fromEntries(branches.map(b=>[b,Math.max(p.levels.dart[b],p.levels.glider[b])]));}
  if(!valid(p.levels)) throw Error('Invalid levels');
  p.levels=Object.fromEntries(branches.map(b=>[b,p.levels[b]]));p.version=3;
  if(p.model==='glider'&&p.best<100) p.model='dart';
  p.completed=p.best>=500; return p;
}
// A corrupt save is copied aside before the next save() overwrites it, so it can be recovered.
export function load() {
  let raw=null;
  try{raw=localStorage.getItem(KEY);return {data:decode(raw),warning:''};}
  catch{
    let backup=false;
    if(raw!==null)try{localStorage.setItem(KEY+'-corrupt',raw);backup=true;}catch{}
    return {data:fresh(),warning:backup?'Uložení je poškozené. Hraješ od začátku, původní data jsou zálohovaná.':'Uložení není dostupné nebo je poškozené. Hraješ od začátku.'};
  }
}
export function save(p) {try{localStorage.setItem(KEY,JSON.stringify(p));return '';}catch{return 'Postup nelze uložit. Zůstane jen do zavření stránky.';}}
