import {fresh} from './core.js';
export const KEY='just-throw-it-v1';
export function decode(raw) {
  if(raw===null) return fresh();
  const p=JSON.parse(raw);
  if(!p||![1,2].includes(p.version)||!Number.isSafeInteger(p.coins)||p.coins<0||!Number.isFinite(p.best)||p.best<0||!Number.isSafeInteger(p.attempts)||p.attempts<0||typeof p.completed!=='boolean'||!['dart','glider'].includes(p.model)||!p.levels) throw Error('Invalid save');
  if(p.version===1){p.levels={dart:{...p.levels},glider:{...p.levels}};p.version=2;}
  for(const model of ['dart','glider']) for(const b of ['power','paper','fold']) if(!p.levels[model]||!Number.isInteger(p.levels[model][b])||p.levels[model][b]<0||p.levels[model][b]>5) throw Error('Invalid levels');
  if(p.model==='glider'&&p.best<100) p.model='dart';
  p.completed=p.best>=500; return p;
}
export function load() {try{return {data:decode(localStorage.getItem(KEY)),warning:''};}catch{return {data:fresh(),warning:'Uložení není dostupné nebo je poškozené. Hraješ od začátku.'};}}
export function save(p) {try{localStorage.setItem(KEY,JSON.stringify(p));return '';}catch{return 'Postup nelze uložit. Zůstane jen do zavření stránky.';}}
