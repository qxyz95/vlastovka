// PROVISIONAL čísla pro prototyp Atlasu. Kopie simulation/progression/params.mjs (stav F5, 14. 10. 2026) a karet 08 §4.
// Nic z toho není závazné: ceny, hodnoty i maxLevel dodá modul čísel po F5 a 3. kole. UI nesmí počítat s pevnými 3 úrovněmi.
export const PROVISIONAL=true;
export const SCREEN_METERS=640/2.1, PLACES=16, FINISH=SCREEN_METERS*16, GLIDER_AT=100;
export const placeStart=i=>i===0?GLIDER_AT:i*SCREEN_METERS;
export const PREVIEW_THROWS=10; // náhled Paper Crane: počet posledních hodů (zástupné, falešný přepočet U1)

const base={
 // ceny [úr. 2, úr. 3] podle čtvrti místa (params atlas.prices)
 prices:[[40,90],[170,340],[500,1000],[500,1000]],
 // hodnoty účinku po úrovních (index 0 = úroveň 1). Zdroj: params.mjs, kde chybí, karty 08 (označeno).
 values:{
  chain:[{step:.10,max:4},{step:.13,max:5},{step:.21,max:5}],
  pinwheel:[{rerolls:1},{rerolls:2},{rerolls:3,noHeadwind:1}],
  steam:[{},{push:.30},{push:.30,burst:.15}],            // 08 A04 (params mají jiné jednotky)
  tape:[{share:.30},{share:.50},{share:.75}],
  crane:[{lift:1.5},{lift:3},{lift:4.5}],
  skip:[{bounces:1,keep:.30},{bounces:1,keep:.45},{bounces:2,keep:.45}],
  gull:[{carry:.20,push:.10},{carry:.35,push:.15},{carry:.50,push:.22}],
  momentum:[{step:.004,cap:.04},{step:.014,cap:.12},{step:.022,cap:.18}],
  thermal:[{},{push:.30},{push:.30,second:.40}],          // 08 A10 + params secondChance
  echo:[{share:.10,delay:.6},{share:.40,delay:.6},{share:.50,delay:.6}], // delay = params echo.delay [s]
  star:[{chance:.08},{chance:.12},{chance:.16}],
  drone:[{},{window:.30},{window:.30,pair:.50}],          // 08 A13 + params pairChance
  paperCrane:[{reach:9},{reach:15},{reach:24}],
  onAir:[{combo:3,beta:.10},{combo:3,beta:.15},{combo:3,beta:.20}],
 },
 pockets:{prices:[300,5040],secondFromDistrict:2},
 // zástupné ceny uzlů (cenu dodá 3. kolo)
 nodes:{autoBasic:400,autoSteam:600,autoThermal:2000,autoStar:2500,autoDrone:4000,nightRoute:20000},
 coinMult:[1,1.6,2.4,3.5], // jen pro přepínač „násobitel mincí“ (3. kolo zatím nemá)
};

// Přepínače prototypu: long = dlouhý žebřík úrovní (3. kolo), scale = řád cen ×k (incremental, test formátu 1.2M).
export function numbers({long=false,scale=1}={}){
 const n=JSON.parse(JSON.stringify(base));
 n.maxLevel=id=>id==='glider'||id==='encore'?1:long?12:3;
 n.price=(id,district,level)=>{ // cena přechodu z level na level+1
  const max=n.maxLevel(id);if(level>=max)return null;
  const p=long?Math.round(base.prices[district][0]*Math.pow(1.55,level-1)/10)*10:base.prices[district][level-1];
  return p*scale;};
 n.value=(id,level)=>{const v=base.values[id];if(!v)return null;if(!long)return v[Math.min(level,v.length)-1];
  // dlouhý žebřík: lineární interpolace mezi úr. 1 a 3 rozprostřená na 12 úrovní (jen ilustrace)
  const a=v[0],b=v[v.length-1],t=(level-1)/11,o={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){const x=a[k]??0,y=b[k]??0;o[k]=k==='max'||k==='bounces'||k==='rerolls'||k==='combo'?Math.round(x+(y-x)*t)||y:+(x+(y-x)*t).toFixed(3);}
  for(const k in o)if(!o[k])delete o[k];if(b.noHeadwind){if(level===12)o.noHeadwind=1;else delete o.noHeadwind;}return o;};
 n.pocketPrice=i=>base.pockets.prices[i]*scale;
 n.nodePrice=id=>base.nodes[id]*scale;
 return n;
}
