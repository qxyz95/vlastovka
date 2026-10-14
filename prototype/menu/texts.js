// Texty prototypu menu (EN výchozí, CS). Klíče = spec research/design/07-menu.md §10.
// Klíče označené „existing“ jsou ve hře už dnes (src/locales), tady jen kopie hodnot.
// proto.* jsou zástupné texty jen pro maketu (události, jména míst), ve hře je dodává jiný modul.
export const TEXTS={
 en:{
  'meta.title':'Just Throw It · menu prototype',
  'menu.label':'Main menu','menu.play':'Throw','menu.workshop':'Workshop','menu.atlas':'Atlas','menu.atlasNew':'Atlas, something new','menu.settings':'Settings',
  'menu.coins':{one:'{count} coin',other:'{count} coins'},
  'menu.loading':'Unfolding the city…','menu.delivered':'Route complete. Fly for fun.',
  'menu.loadError':"The game didn't load. Reload the page; your progress is safe.",'menu.reload':'Reload','menu.dismiss':'Close note',
  'hud.pause':'Pause','hud.distance':'DISTANCE','hud.next':'Next: {place} · {distance}','hud.bestLine':'Best {distance}',
  'hud.throwCoins':{one:'+{count} coin this throw',other:'+{count} coins this throw'},
  'aim.hint':'Drag to aim. Hold, then let go.','aim.angleDown':'Lower angle','aim.angleUp':'Higher angle','aim.angleValue':'Angle {angle}',
  'aim.holdShort':'Hold','aim.letGo':'Let go!','aim.keys':'Arrows change the angle. Hold Space to charge, release to throw.',
  'flight.btnIdle':'Gliding','flight.btnTap':'Tap','flight.btnHold':'Hold','flight.btnRelease':'Let go',
  'scene.paused':'Paused',
  'pause.resume':'Continue','pause.menu':'Main menu','pause.leaveCounts':'The throw lands on its own and counts.',"pause.leaveDiscard":"This throw won't count.",
  'pause.away':'Paused while the game was hidden.',
  'settings.title':'Settings','settings.close':'Close settings','settings.language':'Language','settings.sound':'Sound','settings.music':'Music','settings.sfx':'Sound effects',
  'settings.mute':'Mute all','settings.muted':'Muted','settings.motion':'Motion','settings.motionSystem':'Like device','settings.motionReduce':'Reduced','settings.motionFull':'Full',
  'settings.motionNow':'Now: {value}','settings.motionHelp':'Fewer camera moves, no shake or parallax. Feedback stays.',
  'settings.assist':'Timing help','settings.timingBar':'Timing bar under the scene','settings.timingBarHelp':'A second, larger view of each timing window.',
  'settings.wideWindows':'Wider timing windows','settings.wideWindowsHelp':'No penalty. Coins and places stay the same.',
  'settings.progress':'Progress','settings.resetHelp':'Coins, upgrades, places and best distance. Settings stay.','settings.saved':'Saved on this device.',
  'footer.reset':'Reset progress','footer.version':'PROTOTYPE {version} · Arcade flight',
  'confirm.title':'Start over?',"confirm.body":"This deletes coins, upgrades, places and your best distance. It can't be undone.",
  'confirm.keep':'Keep my progress','confirm.delete':'Delete progress','confirm.done':'Progress deleted.',
  'result.title':'Throw complete!','result.titleRecord':'New best!','result.overBest':'+{distance} over your best','result.bestLine':'Best: {distance}',
  'result.coinsLabel':{one:'{count} coin earned',other:'{count} coins earned'},'result.breakdown':'Throw {base} ◈ + distance {distance} ◈',
  'result.newPlace':'New place: {place}','result.next':'Next: {place} · {distance} to go','result.details':'Throw details',
  'result.time':'Flight time','result.power':'Throw power','result.angle':'Angle','result.events':'Events','result.eventsLine':'{hits} of {total} · perfect {perfect}',
  'result.again':'Throw again','result.workshop':'Workshop','result.atlas':'Atlas','result.menu':'Main menu','result.gliderUnlocked':'Glider unlocked!',
  'status.glLost':'Redrawing the city…','status.glBack':'The city is back.','status.glFlat':"3D isn't available here, so the city is drawn flat. Everything else works.",
  'status.counted':'Throw counted: {distance} · +{count} ◈',
  'workshop.title':'Your Workshop','workshop.back':'Back','workshop.empty':'No coins yet. Every throw earns some, even a short one.','workshop.preview':'Now {now} → after {after}',
  'workshop.launch':'Throw it ↗','workshop.upgrades':'Upgrades · for both planes',
  'model.dart':'Dart','model.dart.desc':'Quick start, flatter throw. Power helps it most.','model.glider':'Glider','model.glider.desc':'Slower start, long glide. Gets more out of gusts and pigeons.','model.glider.locked':'Unlocks at {distance}.',
  'branch.power':'Power','branch.paper':'Paper','branch.fold':'Folds','branch.power.what':'Launch speed','branch.paper.what':'Glide','branch.fold.what':'Event windows',
  'detail.missing':{one:'{count} coin short.',other:'{count} coins short.'},'detail.buy':'Buy for {price} ◈','detail.bought':'Bought','detail.max':'Max level',
  'atlas.title':'Atlas','atlas.sub':'The route','atlas.empty':'Fly past 100 m to find the first place.','atlas.found':'{found} of 16 places found',
  'proto.gust':'Gust! Tap','proto.bird':'Pigeon! Hold','proto.hit':'Nice!','proto.perfect':'Perfect!','proto.miss':'Missed',
  'proto.milestone':'★ {distance} · Another stretch behind you',
  'proto.hint.fine':'Clean release. A touch steeper next time.','proto.hint.weak':'Released early. Hold a little longer.','proto.hint.steep':'Too steep; it stalled. Try a flatter angle.',
  'proto.atlasFull':'Full Atlas: prototype-atlas.html','proto.lang.en':'English','proto.lang.cs':'Čeština'
 },
 cs:{
  'meta.title':'Just Throw It · prototyp menu',
  'menu.label':'Hlavní menu','menu.play':'Házet','menu.workshop':'Dílna','menu.atlas':'Atlas','menu.atlasNew':'Atlas, je tu něco nového','menu.settings':'Nastavení',
  'menu.coins':{one:'{count} mince',few:'{count} mince',many:'{count} mince',other:'{count} mincí'},
  'menu.loading':'Rozkládám město…','menu.delivered':'Trasa dokončena. Dál už jen pro radost.',
  'menu.loadError':'Hra se nenačetla. Načti stránku znovu, postup zůstal uložený.','menu.reload':'Načíst znovu','menu.dismiss':'Zavřít upozornění',
  'hud.pause':'Pauza','hud.distance':'DOLET','hud.next':'Další: {place} · {distance}','hud.bestLine':'Rekord {distance}',
  'hud.throwCoins':{one:'+{count} mince za tento hod',few:'+{count} mince za tento hod',many:'+{count} mince za tento hod',other:'+{count} mincí za tento hod'},
  'aim.hint':'Táhni a zamiř. Podrž a pusť.','aim.angleDown':'Nižší úhel','aim.angleUp':'Vyšší úhel','aim.angleValue':'Úhel {angle}',
  'aim.holdShort':'Podrž','aim.letGo':'Pusť!','aim.keys':'Šipky mění úhel. Podrž mezerník a pusť.',
  'flight.btnIdle':'Plachtí','flight.btnTap':'Klepni','flight.btnHold':'Podrž','flight.btnRelease':'Pusť',
  'scene.paused':'Pozastaveno',
  'pause.resume':'Pokračovat','pause.menu':'Hlavní menu','pause.leaveCounts':'Hod doletí sám a započítá se.','pause.leaveDiscard':'Tento hod se nezapočítá.',
  'pause.away':'Pozastaveno, hra byla skrytá.',
  'settings.title':'Nastavení','settings.close':'Zavřít nastavení','settings.language':'Jazyk','settings.sound':'Zvuk','settings.music':'Hudba','settings.sfx':'Zvukové efekty',
  'settings.mute':'Ztlumit vše','settings.muted':'Ztlumeno','settings.motion':'Pohyb','settings.motionSystem':'Podle zařízení','settings.motionReduce':'Omezený','settings.motionFull':'Plný',
  'settings.motionNow':'Teď: {value}','settings.motionHelp':'Méně pohybu kamery, bez otřesů a paralaxy. Zpětná vazba zůstane.',
  'settings.assist':'Pomoc s časováním','settings.timingBar':'Časovací pruh pod scénou','settings.timingBarHelp':'Druhý, větší pohled na okno časování.',
  'settings.wideWindows':'Širší okna časování','settings.wideWindowsHelp':'Bez postihu. Mince i místa zůstávají stejné.',
  'settings.progress':'Postup','settings.resetHelp':'Mince, vylepšení, místa a rekord. Nastavení zůstane.','settings.saved':'Uloženo v tomto zařízení.',
  'footer.reset':'Smazat postup','footer.version':'PROTOTYP {version} · Arkádový let',
  'confirm.title':'Začít znovu?','confirm.body':'Smaže mince, vylepšení, místa i rekord. Nejde to vrátit.',
  'confirm.keep':'Nechat postup','confirm.delete':'Smazat postup','confirm.done':'Postup smazán.',
  'result.title':'Hod dokončen!','result.titleRecord':'Nový rekord!','result.overBest':'o {distance} dál než rekord','result.bestLine':'Rekord: {distance}',
  'result.coinsLabel':{one:'získána {count} mince',few:'získány {count} mince',many:'získáno {count} mince',other:'získáno {count} mincí'},'result.breakdown':'Za pokus {base} ◈ + za vzdálenost {distance} ◈',
  'result.newPlace':'Nové místo: {place}','result.next':'Další: {place} · zbývá {distance}','result.details':'Podrobnosti hodu',
  'result.time':'Doba letu','result.power':'Síla hodu','result.angle':'Úhel','result.events':'Události','result.eventsLine':'{hits} z {total} · perfektně {perfect}',
  'result.again':'Hodit znovu','result.workshop':'Dílna','result.atlas':'Atlas','result.menu':'Hlavní menu','result.gliderUnlocked':'Kluzák odemčen!',
  'status.glLost':'Překresluji město…','status.glBack':'Město je zpět.','status.glFlat':'3D tu nejde spustit, město je proto nakreslené naplocho. Vše ostatní funguje.',
  'status.counted':'Hod započítán: {distance} · +{count} ◈',
  'workshop.title':'Tvoje dílna','workshop.back':'Zpět','workshop.empty':'Zatím žádné mince. Každý hod nějaké přinese, i ten krátký.','workshop.preview':'Teď {now} → po koupi {after}',
  'workshop.launch':'Hodit vlaštovku ↗','workshop.upgrades':'Vylepšení · platí pro obě vlaštovky',
  'model.dart':'Šipka','model.dart.desc':'Rychlý start, plošší hod. Nejvíc jí pomáhá síla.','model.glider':'Kluzák','model.glider.desc':'Pomalejší start, dlouhé plachtění. Víc vytěží z poryvů a holubů.','model.glider.locked':'Odemkne se na {distance}.',
  'branch.power':'Síla hodu','branch.paper':'Kvalita papíru','branch.fold':'Přehyby a vyvážení','branch.power.what':'Rychlost výhozu','branch.paper.what':'Klouzavost','branch.fold.what':'Okna událostí',
  'detail.missing':{one:'Chybí {count} mince.',few:'Chybí {count} mince.',many:'Chybí {count} mince.',other:'Chybí {count} mincí.'},'detail.buy':'Koupit za {price} ◈','detail.bought':'Zakoupeno','detail.max':'Nejvyšší úroveň',
  'atlas.title':'Atlas','atlas.sub':'Trasa','atlas.empty':'Doleť za 100 m a najdeš první místo.','atlas.found':'Nalezeno {found} z 16 míst',
  'proto.gust':'Poryv! Klepni','proto.bird':'Holub! Podrž','proto.hit':'Pěkně!','proto.perfect':'Perfektní!','proto.miss':'Vedle',
  'proto.milestone':'★ {distance} · Další úsek za tebou',
  'proto.hint.fine':'Čisté puštění. Příště o kousek strměji.','proto.hint.weak':'Puštěno brzy. Podrž o chvilku déle.','proto.hint.steep':'Moc strmě, vlaštovka ztratila rychlost. Zkus plošší úhel.',
  'proto.atlasFull':'Plný Atlas: prototype-atlas.html','proto.lang.en':'English','proto.lang.cs':'Čeština'
 }
};
// Zástupná jména míst (stejná v obou jazycích, ve hře je dodá Atlas).
export const PLACES=[[0,'Paper Lab'],[100,'Laundry Lines'],[250,'Chimney Row'],[420,'Lighthouse Steps'],[640,'Rooftop Harbor'],[900,'Crane Forest'],[1200,'Fish Market'],[1550,'Ferry Lights'],[1950,'Windmill Ridge'],[2400,'Mountain Saddle'],[2900,'Sunset Orchards'],[3400,'Railway Bend'],[3900,'Station Clock'],[4300,'Tram Garden'],[4650,'Tower Steps'],[4910,'The Last Roof']];
export const DISTRICTS=['Violet Suburbs','Moon Docks','Red Horizon','Neon Core'];
export function makeT(lang){
 const dict=TEXTS[lang]??TEXTS.en,pr=new Intl.PluralRules(lang==='cs'?'cs':'en');
 return (key,params={})=>{let v=dict[key]??TEXTS.en[key]??key;if(typeof v==='object')v=v[pr.select(params.n??params.count??0)]??v.other;
  // n = číslo pro plurál, count = už naformátovaný text
  return v.replace(/\{(\w+)\}/g,(m,k)=>params[k]??m);};
}
export function makeFormat(lang){
 const loc=lang==='cs'?'cs-CZ':'en-US',nf=d=>new Intl.NumberFormat(loc,{minimumFractionDigits:d,maximumFractionDigits:d});
 const num=(x,d=0)=>nf(d).format(x).replace(/ | /g,' ');
 return {num,m:(x,d=0)=>num(x,d)+' m',s:(x)=>num(x,1)+' s',pct:x=>num(Math.round(x*100))+(lang==='cs'?' %':'%'),deg:x=>num(Math.round(x))+'°'};
}
