// Palety barev pro 3D a UI vrstvu (čisté). Vlastní R2. Data zkopírovaná z THEMES.cyber (src/themes.js se ve fázi f smaže, proto se neimportuje)
// a z barev, které dnes mají natvrdo render.js (QTE kruh), atmosphere.js (štítky), fx-render.js (částice, popupy, záblesk),
// ui.js (mířidla) a themes-verse.js (rychlostní čáry). palette(id) → paleta; neznámé id = cyber.
const CREASE=['#00bddb','#ff43b5'],TRAIL=['#3c91ab','#913a90'],FX={smoke:'#8a7aa8',water:'#78d8ee',beacon:'#ff4d6d',bird:'#d0daeb',rain:'#7fd6ff',star:'#e8f6ff',glow:true};
export const CYBER={
 id:'cyber',plane:{fill:'#efffff',outline:'#0b1935',crease:CREASE},trail:TRAIL,fx:FX,
 kid:['#9e91bd','#61eafa','#ee50b4','#38466f'],shop:{wall:'#121b32',roof:'#793765',sign:'#ef59c1',text:'#17172f',window:'#223c4d',light:'#53dbea',door:'#35344f'},
 // Částice podle druhu z juice.js: 0 prach, 1 zlatá jiskra, 2 akcentová jiskra, 3 větrná čárka.
 particles:[FX.smoke,'#ffd166',CREASE[0],TRAIL[0]],
 popup:{perfect:'#ffd166',success:CREASE[0],miss:'#cfd3e0',milestone:'#ffd166',land:'#ffffff',outline:'#141c32',font:'monospace'},
 flash:'#ffffff',
 // QTE kruh (render.js drawQte): stopa, úspěch, perfekt, bílý bod, čárkované varování, výsledek jednou barvou.
 qte:{track:'#3b4170',success:'#2fb5c9',perfect:'#ff5fc8',dot:'#ffffff',warning:'#fff0a6',result:{perfect:'#ff5fc8',success:'#2fe0c9',other:'#6b6f8a'},
  gust:'#bff8ff',bird:{body:'#ad9fce',wing:'#65f7ef',beak:'#ffd166'}},
 label:{bg:'#141c32',text:'#eefaff'},
 aim:{arrow:'#fff0a6',panel:'#203b3e',text:'#fff0b3',bar:'#f2ce87',cap:'#ffffff'},
 speed:{line:'#ffffff',ink:'#15101f'}
};
export const PALETTES={cyber:CYBER};
export const palette=id=>PALETTES[id]??CYBER;
