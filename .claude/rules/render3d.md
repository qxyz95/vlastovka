---
paths:
  - "src/render3d/**"
  - "archiv/prototype/3d/**"
---

# 3D renderer

- **Čisté moduly** (`geometry`, `camera`, `life`, `mood`, `pose`, `fx-map`, `comic`, `palette`, `events-view`, `quality`, `frame`, `ui-layer`, `districts/*-layout.js`) neimportují three.js ani DOM a běží v Node. Hlídá to `tests/render3d-purity.test.js`; nový čistý modul do něj přidat.
- **three.js moduly** (`scene`, `city`, `plane`, `workshop`, `companion3d`, `life3d`, `toon`, `index`) jen kreslí podle plánu z `frame.js`, herní logiku nepočítají.
- Smlouvy v `index.js` (`render(canvas,f,model,time,visual)`, `view(f)`, `plan`, `ctx`, `frameCtx`) neměnit bez úpravy 2D zálohy a `ui.js`. `view(null)` = Dílna.
- Vše vytvořené uvolňovat (`dispose` geometrií, materiálů, textur), i při ztrátě a obnově kontextu. Nealokovat v každém snímku.
- Rozpočty: desktop P95 ≤ 16,7 ms, CPU ≤ 6 ms, ≤ 120 draw calls; na místo nejvýš 14 draw calls a 15 tis. trojúhelníků; telefon ≥ 30 fps, DPR ≤ 1,5. Dílna a výsledek 30 fps, skrytá záložka nekreslí.
- Reduced motion: bez otřesu a zoomu, zpětná vazba zůstává.
- Výkon měřit ve viditelném okně (`?perf=1`, `__r3d.bench`), výsledky do `reports/3d/`. Ve skrytém okně jen funkční kontrola (`?timer`).
- `archiv/prototype/3d/` importuje z `src/render3d/`, nové věci psát do `src/render3d/`. Prototyp se smaže ve fázi g.
- Testy `tests/render3d-*.test.js`, autopilot `tests/helpers/auto-input.js`.
