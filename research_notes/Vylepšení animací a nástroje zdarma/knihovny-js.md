# JS knihovny pro vylepšení animací a vykreslování ("Just Throw It")

Stav ověřen 2026-10-13. Verze, data vydání a licence z npm registry (`registry.npmjs.org/<balík>`, dotaz 2026-10-13). Velikosti jsem změřil sám: stáhl jsem uvedený soubor z jsDelivr a zabalil `gzip -9`. Jsou proto o pár procent menší než čísla z bundlephobia (gzip -6), ale navzájem srovnatelné.

Souhrnná tabulka:

| Knihovna | Verze (datum) | Licence | min+gz (měřený soubor) | ES modul z CDN bez bundleru |
|---|---|---|---|---|
| GSAP | 3.15.0 (2026-04-13) | vlastní „Standard No Charge“ (Webflow) | 28,3 kB (`gsap.min.js` core) | ano (`/+esm` nebo `dist/` ESM) |
| anime.js | 4.5.0 (2026-06-22) | MIT | 40,8 kB (`anime.esm.min.js`, celý bundle) | ano |
| @tweenjs/tween.js | 25.0.0 (2024-07-26) | MIT | 7,0 kB (neminifikovaný `tween.esm.js`) | ano, jeden soubor |
| Motion (motion.dev) | 14.1.0 (2026-10-09) | MIT | 47,9 kB celý UMD; `animate` hybrid ~18 kB podle dokumentace | ano přes `/+esm` (vícesouborový ESM) |
| PixiJS | 8.22.0 (2026-10-01) | MIT | 236,8 kB (`pixi.min.mjs`) | ano |
| pixi-filters | 6.1.5 (2025-11-29) | MIT | 44,2 kB (všechny filtry) | ano (vyžaduje pixi.js ≥ 8) |
| @pixi/particle-emitter | 5.0.10 (2026-01-08) | MIT | — | **nekompatibilní s Pixi v8** |
| twgl.js | 7.0.0 (2025-07-16) | MIT | (nezměřeno) | ano (`twgl-full.module.js`) |
| regl | 2.1.1 (2024-11-12) | MIT | 28,4 kB | UMD (lze přes `/+esm`) |
| OGL | 1.0.11 (2025-01-27) | Unlicense | 39,4 kB (celý `/+esm`) | ano, nativní ESM |
| glslCanvas | 0.2.6 (2022-11-23) | MIT | — | zastaralý |
| Phaser | 4.2.1 (2026-07-09) | MIT | 352 kB | UMD/ESM, těžký |
| KAPLAY | 3001.0.19 (2025-06-15); v4000 alpha.27.1 (2026-05-12) | MIT | 69,3 kB (`kaplay.mjs`) | ano |
| LittleJS | 1.27.0 (2026-10-09) | MIT | 167 kB (`littlejs.esm.min.js` se všemi pluginy, i 3D) | ano |
| tsParticles (slim) | 4.4.0 (2026-08-31) | MIT | 44,4 kB (`tsparticles.slim.bundle.min.js`) | UMD bundle |
| Proton (`proton-engine`) | 7.1.5 (2025-03-24) | MIT | 17,0 kB | UMD |
| simplex-noise | 4.0.3 (2024-07-26) | MIT | 4,7 kB (neminifikovaný ESM) | ano, jeden soubor |
| lottie-web (light canvas) | 5.13.0 (2025-05-21) | MIT | 54,2 kB | UMD |
| @lottiefiles/dotlottie-web | 0.81.0 (2026-10-06) | MIT | JS + WASM 1,24 MB (nekomprimovaný .wasm) | ano |
| @rive-app/canvas-lite | 2.44.2 (2026-10-10) | MIT | 109 kB (`rive.js`) + WASM | UMD |
| Spine (`@esotericsoftware/spine-canvas`) | 4.3.13 (2026-07-24) | Spine Runtimes License (vyžaduje licenci editoru) | 56,5 kB | IIFE/ESM |
| DragonBones JS | 5.7.4 (2021-04-16) | MIT | — | mrtvý |
| lygia | 1.4.1 (2026-02-07) | Prosperity 3.0.0 / Patron | — | GLSL soubory |
| glsl-noise | 0.0.0 (2013) | MIT | — | GLSL snippety |

Zdroj verzí, dat a licenčních polí: npm registry, např. [gsap](https://registry.npmjs.org/gsap), [pixi.js](https://registry.npmjs.org/pixi.js), [littlejsengine](https://registry.npmjs.org/littlejsengine). Zdroj velikostí: soubory stažené z [jsDelivr](https://cdn.jsdelivr.net/npm/) v uvedených cestách.

---

## 1. Tweenovací a animační knihovny (GSAP, anime.js v4, tween.js, Motion)

### Takeaway
Libovolné JS objekty (souřadnice, alfa, škálu pro canvas) umí tweenovat všechny čtyři. Projektu bez buildu a bez závislostí nejlépe sedí **tween.js** (MIT, jeden ESM soubor, ~7 kB gz) nebo vlastní mini-tweener. GSAP je zdarma i komerčně a umí nejvíc, ale má proprietární licenci s omezením „no-code visual animation builders“. Jinak je pro hru bez problémů.

### Cited Findings
- GSAP 3.15.0 vyšel 2026-04-13. Pole `license` v npm zní: „Standard 'no charge' license: https://gsap.com/standard-license“, tedy nejde o OSI licenci. — [npm registry gsap](https://registry.npmjs.org/gsap)
- Licence GSAP se jmenuje „Standard 'No Charge' GSAP License“, účinná od 2025-04-30, naposledy změněná 2025-05-30, © 2025 Webflow. FAQ: „Commercial usage is covered under the standard license.“ Dřívější members-only (bonus) pluginy jsou také zdarma pro komerční použití. — [gsap.com/standard-license](https://gsap.com/standard-license)
- Zakázané použití GSAP (Prohibited Uses): „any implementation and/or use of GSAP Products in tools that allow users to build visual animations without code“, pokud to „encourages, induces, or materially assists in creating a solution that competes with Webflow's visual…“. Dále se nesmí reverse-engineerovat kvůli konkurenčním produktům ani odstraňovat proprietary notices nebo branding. FAQ: „AI-generated code is not a 'Prohibited Use'.“ Webflow si vyhrazuje licenci kdykoli změnit a pokračující používání se počítá jako souhlas. Povinnou atribuci licence neuvádí. — [gsap.com/standard-license](https://gsap.com/standard-license)
- Core GSAP (`gsap.min.js` 3.15.0) má 72,9 kB min, 28,3 kB gz. — měřeno, [jsDelivr](https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js)
- anime.js 4.5.0 (2026-06-22) je pod MIT. — [npm registry animejs](https://registry.npmjs.org/animejs)
- anime.js v4 animuje i prosté objekty, příklad z dokumentace: `animate(vector2D, { x: 100, y: 150, modifier: utils.round(0), onUpdate: ... })`. Používá named ESM importy (`import { animate, utils } from 'animejs'`). — [animejs.com docs – JavaScript Objects](https://animejs.com/documentation/animation/targets/javascript-objects)
- Celý ESM bundle anime.js 4.5.0 (`dist/bundles/anime.esm.min.js`) má 118,7 kB min, 40,8 kB gz. Samotné `animate` bude po tree-shakingu menší, bez bundleru ale stahuješ celý soubor. — měřeno, [jsDelivr](https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.esm.min.js)
- Poslední vydání @tweenjs/tween.js je 25.0.0 z 2024-07-26 (MIT). Na GitHubu je poslední commit z 2026-09-22, takže repo žije, jen nevychází nové verze. — [npm registry](https://registry.npmjs.org/@tweenjs/tween.js), [GitHub API commits](https://api.github.com/repos/tweenjs/tween.js/commits?per_page=1)
- `tween.esm.js` 25.0.0: 43,4 kB neminifikovaný, 7,0 kB gz, jeden soubor bez závislostí. — měřeno, [jsDelivr](https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@25.0.0/dist/tween.esm.js)
- Motion 14.1.0 (2026-10-09) je pod MIT. — [npm registry motion](https://registry.npmjs.org/motion)
- Motion `animate` „comes in two sizes, mini (2.3kb) and hybrid (18kb)“. Prosté JS objekty animuje jen hybrid („Objects can be animated much in the same way as HTML & SVG elements“). Integrace pro Three.js a „vgpu“ jsou v placeném Motion+ early access. — [motion.dev/docs/animate](https://motion.dev/docs/animate)
- Celý UMD `motion.js` 14.1.0 má 144,9 kB min, 47,9 kB gz. Varianta `/+esm` na jsDelivr je jen re-export stub, který dotahuje další moduly. — měřeno, [jsDelivr](https://cdn.jsdelivr.net/npm/motion@14.1.0/dist/motion.js)

### Inferences
- Hra kreslí každý snímek sama (požadavek na rAF loop + fillRect). Tweener tu jen mění čísla v objektech. Hlavní hodnota je v easing funkcích a timeline (sekvence intro → hod → dopad). tween.js to pokrývá a vendorovat se dá jako jediný soubor.
- GSAP má nejlepší timeline API a pluginy (CustomEase, MotionPath, Physics2D se dají využít i na objekty). Licence je ale proprietární a jednostranně změnitelná, což jde proti hodnotě „legit licence“. Pro hru samotnou je použití povolené. Riziko vzniká jen při vendorování a změně licence do budoucna.
- Motion je zaměřený na DOM/React. Pro canvas hru nepřináší nic navíc oproti tween.js nebo anime.js a k tomu má vícesouborový ESM a placené Motion+ funkce.
- Vlastní tweener (easing tabulka plus lerp, ~50–80 řádků) je realistická alternativa s nulovou závislostí. Easing rovnice (Penner) jsou volně známé.

### Gaps
- Přesnou velikost samotného modulu `animate` z anime.js v4 bez bundleru jsem nezměřil (soubory v `dist/modules` jsem neprocházel).
- Chování GSAP licence při vendorování, tedy distribuci souboru v repu, licence výslovně neřeší. Jen zakazuje odstraňovat notices.

---

## 2. 2D WebGL renderery (PixiJS v8 + pixi-filters, twgl, regl, OGL, glslCanvas, Phaser, KAPLAY, LittleJS)

### Takeaway
PixiJS v8 + pixi-filters nabízí hotové efekty: Glow, Bloom, AdvancedBloom, CRT, Pixelate, Godray, Shockwave, OldFilm a další. Stojí to ~280 kB gz a de facto přepsání renderingu do scene graphu. Pro hru 640×360 s procedurálním kreslením je to přehnané. Lehčí cesta je ponechat Canvas 2D a přidat vlastní WebGL post-process pass, případně s twgl/OGL jako tenkým pomocníkem. Phaser a celé enginy (KAPLAY, LittleJS) by znamenaly přepis hry.

### Cited Findings
- PixiJS 8.22.0 vyšel 2026-10-01 pod MIT a je aktivně vyvíjen. Měsíční blogy v 2026 zmiňují v8.18 a v8.19. — [npm registry pixi.js](https://registry.npmjs.org/pixi.js), [PixiJS blog June 2026](https://pixijs.com/blog/june-2026)
- PixiJS má renderery pro WebGL i WebGPU. — [PixiJS README](https://github.com/pixijs/pixijs)
- Ve v8.16.0 se jako experimentální funkce vrátil Canvas 2D renderer s automatickým fallbackem. Nepokrývá všechny funkce GPU rendererů. — [PixiJS blog 8.16.0](https://pixijs.com/blog/8.16.0)
- `pixi.min.mjs` 8.22.0: 841 kB min, 236,8 kB gz. — měřeno, [jsDelivr](https://cdn.jsdelivr.net/npm/pixi.js@8.22.0/dist/pixi.min.mjs)
- pixi-filters 6.1.5 (2025-11-29, MIT) má peer dependency `pixi.js >= 8.0.0-0`. Celý `pixi-filters.mjs` má 215,5 kB raw a 44,2 kB gz. Obsahuje filtry: Adjustment, AdvancedBloom, Ascii, BackdropBlur, Bevel, Bloom, BulgePinch, CRT, ColorGradient, ColorMap, ColorOverlay, ColorReplace, Convolution, CrossHatch, Dot, DropShadow, Emboss, Glitch, Glow, Godray, HslAdjustment, KawaseBlur, MotionBlur, MultiColorReplace, OldFilm, Outline, Pixelate, RGBSplit, RadialBlur, Reflection, Shockwave, SimpleLightmap, SimplexNoise, TiltShift, Twist, ZoomBlur. — měřeno a vypsáno z [jsDelivr pixi-filters](https://cdn.jsdelivr.net/npm/pixi-filters@6.1.5/dist/pixi-filters.mjs), [package.json](https://cdn.jsdelivr.net/npm/pixi-filters@6.1.5/package.json)
- twgl.js 7.0.0 (2025-07-16, MIT). Soubory: `dist/7.x/twgl.js` (316 kB neminifikovaný), `twgl-full.module.js` (397 kB neminifikovaný, ESM). — [npm registry](https://registry.npmjs.org/twgl.js), [jsDelivr file listing](https://data.jsdelivr.com/v1/packages/npm/twgl.js@7.0.0?structure=flat)
- regl 2.1.1 (2024-11-12, MIT), `regl.min.js` 28,4 kB gz, UMD. — [npm registry](https://registry.npmjs.org/regl), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/regl@2.1.1/dist/regl.min.js)
- OGL 1.0.11 (2025-01-27) je pod licencí **Unlicense** (public domain), ne MIT. Celý balík přes `/+esm` má 39,4 kB gz. Je to nativní ESM a dá se importovat po modulech. — [npm registry ogl](https://registry.npmjs.org/ogl), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm)
- glslCanvas: poslední verze 0.2.6 z 2022-11-23. Fakticky neudržovaný. — [npm registry glslCanvas](https://registry.npmjs.org/glslCanvas)
- Phaser 4.2.1 (2026-07-09, MIT), `phaser.min.js` 1,38 MB min, 352 kB gz. — [npm registry phaser](https://registry.npmjs.org/phaser), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.min.js)
- KAPLAY: stabilní 3001.0.19 (2025-06-15, MIT). Vývoj běží na řadě 4000 alpha (alpha.26 2026-01-13, alpha.27 2026-03-19, alpha.27.1 2026-05-12). `kaplay.mjs` 3001.0.19 má 69,3 kB gz. — [npm registry kaplay](https://registry.npmjs.org/kaplay), [GitHub releases](https://github.com/kaplayjs/kaplay/releases), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/kaplay@3001.0.19/dist/kaplay.mjs)
- LittleJS 1.27.0 (2026-10-09, MIT). Uvádí „WebGL2 + Canvas2D hybrid rendering“, post-processing shadery ve stylu Shadertoy, particle systém s editorem a parallax vrstvy. README: „littlejs.min.js is about 135 KB gzipped, and the 3D plugins are a large part of that… with a bundler… a small 2D game comes to about 26 KB gzipped.“ Můj měřený `littlejs.esm.min.js` má 167 kB gz. Distribuce nově obsahuje 3D pluginy, editor a box2d. — [LittleJS README](https://github.com/KilledByAPixel/LittleJS), [npm registry](https://registry.npmjs.org/littlejsengine), [jsDelivr listing](https://data.jsdelivr.com/v1/packages/npm/littlejsengine@1.27.0?structure=flat)

### Inferences
- **Koexistence Pixi a Canvas 2D:** Pixi umí vytvořit texturu z HTMLCanvasElement. Šlo by tedy dál kreslit do offscreen Canvas 2D a Pixi použít jen jako „filtr pipeline“: jeden Sprite s texturou canvasu plus `filters = [new CRTFilter(), new AdvancedBloomFilter()]`. Tak se zachová celý stávající kód. Cena je ~280 kB gz (pixi + filters) za efekty, které by šly napsat ve ~100–200 řádcích vlastního WebGL. Tvrzení o API `Texture.from(canvas)` mám z obecné znalosti Pixi, v této session jsem ho neověřil.
- Bez bundleru je Pixi (236 kB gz jeden `.mjs`) i pixi-filters (jeden `.mjs`) technicky použitelné přímo z CDN. Vendorovat se dají jako 2 soubory.
- LittleJS, KAPLAY i Phaser jsou celé enginy s vlastní herní smyčkou, vstupem a kamerou. Přechod by znamenal přepis, ne upgrade. LittleJS je z nich nejbližší filozofii projektu (MIT, ESM, post-process shadery, particle editor). Bez bundleru se ale tahá ~167 kB gz včetně nepotřebného 3D.
- twgl/OGL/regl ušetří boilerplate (kompilace shaderů, buffery, uniformy), ale samotný post-process fullscreen quad je tak malý, že knihovna se vyplatí až při více průchodech (bloom = downsample + blur + composite).

### Gaps
- Přesnou min+gz velikost twgl 7 (minifikované ESM) jsem neměřil, protože jsDelivr nemá `twgl.module.js` v očekávané cestě.
- Datum vydání PixiJS 8.16.0 (návrat Canvas rendereru) jsem nedohledal.
- Stav Phaser 4 (finální vs. RC) mimo číslo verze na npm jsem neověřoval.

---

## 3. Částice (@pixi/particle-emitter, tsParticles, Proton, LittleJS particles)

### Takeaway
@pixi/particle-emitter **nepodporuje Pixi v8** (peer deps `<8.0.0`), pro nový projekt je slepá cesta. tsParticles je určený na pozadí webových stránek, ne do herní smyčky. Proton (MIT, 17 kB gz, má Canvas renderer) je jediná rozumná hotová canvas knihovna. Pro tuto hru je ale nejlevnější vlastní pool částic (~100 řádků), který už pravděpodobně v nějaké podobě existuje.

### Cited Findings
- @pixi/particle-emitter 5.0.10 (2026-01-08, MIT) má peer dependencies `@pixi/core`, `@pixi/display` ad. ve verzích `>=6.0.4 <8.0.0`. S Pixi v8 tedy nefunguje. README navíc uvádí, že particle editor „was built for an older version of the library“. Repo není archivované, poslední push 2026-01-09. — [package.json 5.0.10](https://cdn.jsdelivr.net/npm/@pixi/particle-emitter@5.0.10/package.json), [README](https://github.com/pixijs-userland/particle-emitter), [GitHub API](https://api.github.com/repos/pixijs/particle-emitter)
- tsParticles 4.4.0 (2026-08-31, MIT). `@tsparticles/slim` bundle má 158,9 kB min, 44,4 kB gz, UMD. — [npm registry tsparticles](https://registry.npmjs.org/tsparticles), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/@tsparticles/slim@4.4.0/tsparticles.slim.bundle.min.js)
- Proton (`proton-engine`) 7.1.5 (2025-03-24, MIT), `proton.min.js` 64,8 kB min, 17,0 kB gz, UMD. — [npm registry](https://registry.npmjs.org/proton-engine), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/proton-engine@7.1.5/build/proton.min.js)
- LittleJS má „Robust particle effect system with a library of ready made effects and an effect design tool“. Plugin `particleEffects.js` má 42,8 kB neminifikovaný, jádro `engineParticles.js` 35,2 kB neminifikované. — [LittleJS README](https://github.com/KilledByAPixel/LittleJS), [jsDelivr listing](https://data.jsdelivr.com/v1/packages/npm/littlejsengine@1.27.0?structure=flat)

### Inferences
- Ve hře s procedurálním kreslením se částice musí stylově lišit podle tématu: pixelové čtverečky, papírové konfety, čárové jiskry, měkké kruhy. Hotová knihovna přinese hlavně emitter a behaviour API, ne vzhled. Vlastní systém s callbackem `draw(ctx, p, theme)` dá víc kontroly a nulovou závislost.
- Particle editor z LittleJS ([online](https://killedbyapixel.github.io/LittleJS/examples/particles/)) může sloužit jako inspirace a ladicí nástroj pro parametry, i když engine nepoužijete.

### Gaps
- Aktivitu vývoje Protonu po 2025-03 (commity a issues) jsem neověřoval.

---

## 4. WebGL post-processing nad Canvas 2D výstupem a shaderové knihovny (licence: Shadertoy, lygia, glsl-noise)

### Takeaway
Hra dál kreslí do skrytého 640×360 Canvas 2D. Každý snímek se ten canvas nahraje jako textura (`gl.texImage2D(..., canvas)`) do druhého viditelného WebGL canvasu a projde fragment shaderem. Pro jeden průchod (CRT/scanlines, grain, vinětace, chromatická aberace, color grading) je to odhadem ~100–150 řádků raw WebGL. Bloom vyžaduje framebuffery a víc průchodů, tedy ~250+ řádků. **Pozor na licence:** Shadertoy shadery jsou ve výchozím stavu CC BY-NC-SA 3.0 (nekomerční, ShareAlike). **lygia NENÍ zdarma pro komerční použití** (Prosperity 3.0.0: komerčně jen 30denní trial, jinak Patron licence za sponzorství).

### Cited Findings
- lygia 1.4.1 (2026-02-07), pole licence v npm: „Prosperity License & Patron License (https://lygia.xyz/license)“. — [npm registry lygia](https://registry.npmjs.org/lygia)
- Text LICENSE.md v repu lygia: „The Prosperity Public License 3.0.0 … allows you to use and share this software for noncommercial purposes for free and to try this software for commercial purposes for thirty days.“ „Personal use for … hobby projects, amateur pursuits … without any anticipated commercial application, doesn't count as use for a commercial purpose.“ — [lygia LICENSE.md](https://github.com/patriciogonzalezvivo/lygia/blob/main/LICENSE.md)
- Stránka lygia.xyz/license (popis Patron licence) při pokusu o stažení vrátila ECONNREFUSED, takže podmínky Patron licence jsem z primárního zdroje neověřil. — [lygia.xyz/license](https://lygia.xyz/license)
- Shadertoy: několik sekundárních zdrojů uvádí, že shadery jsou „by default protected under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported license unless anything else has been stated by the author“. Totéž cituje hlavička příkladu v manuálu three.js. Primární stránka shadertoy.com/terms vrátila HTTP 403. — [Godot Shaders – port](https://godotshaders.com/shader/water-toon-torrent-shader/), [three.js manual – Shadertoy](https://threejs.org/manual/en/shadertoy.html)
- glsl-noise je pod MIT, ale jediná npm verze je 0.0.0 z 2013. Jde o kolekci GLSL snippetů (Ashima/stegu simplex noise), které je potřeba zkopírovat. — [npm registry glsl-noise](https://registry.npmjs.org/glsl-noise)
- OffscreenCanvas má celkovou podporu 96,27 %. Safari plně od 27, iOS Safari částečně od 16.2. — [caniuse data offscreencanvas.json](https://github.com/Fyrd/caniuse/blob/main/features-json/offscreencanvas.json)

### Inferences
- **Raw WebGL varianta (doporučená k prototypu):** 1 fullscreen trojúhelník, 1 textura (canvas 2D), 1 fragment shader na téma (pixel: CRT + scanlines + jemný bloom; papír: grain a papírová textura z noise + vinětace; blueprint: lehké rozostření čar a modrý tón papíru; dusk: color grading gradient + grain). Nahrání 640×360 textury za snímek je pro GPU triviální. Uniformy `time` a `resolution` stačí pro animovaný grain.
- Glow kolem objektů (letadlo, jiskry) jde napodobit i v Canvas 2D přes `ctx.shadowBlur`/`shadowColor` nebo aditivní blending (`globalCompositeOperation = 'lighter'`) bez WebGL. U malého počtu objektů je to levné, takže to stojí zkusit dřív než WebGL.
- Testy (`node --test`) neběží s WebGL. Post-process vrstva by proto měla být čistě volitelná: při nedostupném WebGL zůstane Canvas 2D výstup beze změny. Kód shaderů zůstane mimo testovanou logiku.
- Shadertoy kód nekopírovat bez kontroly licence konkrétního shaderu. Lygii nepoužívat, pokud hra může být kdy komerční (reklamy, prodej). Alternativy pod MIT: noise od Ashima/stegu (glsl-noise, webgl-noise) a vlastní jednoduché shadery.

### Gaps
- Patron licence lygia (podmínky sponzorství) neověřena, web byl nedostupný.
- Oficiální text výchozí licence Shadertoy jsem nezískal (403). Tvrzení CC BY-NC-SA 3.0 je ze sekundárních, ale konzistentních zdrojů.
- Nenašel jsem konkrétní kurátorovanou MIT sbírku post-process shaderů. Pixi-filters (MIT) mají zdrojové GLSL filtrů (CRT, bloom, godray), které by šlo pod MIT převzít a portovat do raw WebGL. To je inference, licenci jednotlivých shader souborů jsem neprocházel.

---

## 5. Knihovny pro šum (noise)

### Takeaway
simplex-noise 4.0.3 (MIT, ~4,7 kB gz, jeden ESM soubor, bez závislostí) je ideální kandidát k vendorování pro CPU šum: vítr, chvění, procedurální mraky, papírová nerovnost hran.

### Cited Findings
- simplex-noise 4.0.3 vyšel 2024-07-26 pod MIT. — [npm registry simplex-noise](https://registry.npmjs.org/simplex-noise)
- `dist/esm/simplex-noise.js` má 18,7 kB neminifikovaný, 4,7 kB gz. — měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/simplex-noise@4.0.3/dist/esm/simplex-noise.js)

### Inferences
- Knihovna je stabilní a hotová, takže chybějící nová vydání od 2024 nevadí. Používá seedovatelný PRNG (předat vlastní `random`), takže jde i o deterministické testy v `node --test`.

### Gaps
- Alternativy (open-simplex-noise, fast-simplex-noise) jsem neporovnával.

---

## 6. Runtimy pro autorované animace (Lottie/dotLottie, Rive, Spine, DragonBones)

### Takeaway
Runtimy Lottie i Rive jsou MIT a zdarma. Dávají smysl jen pro ručně animované prvky (maskot, UI, efekty v menu), ne pro procedurální svět hry. Přinášejí desítky kB JS, Rive a dotLottie navíc WASM (dotLottie ~1,2 MB nekomprimovaný .wasm). **Spine runtime vyžaduje platnou placenou licenci Spine Editoru** (Essential/Professional jen pro obrat pod 500 000 USD). DragonBones je mrtvý od 2021.

### Cited Findings
- lottie-web 5.13.0 (2025-05-21, MIT). Light canvas build má 203 kB min, 54,2 kB gz. — [npm registry](https://registry.npmjs.org/lottie-web), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light_canvas.min.js)
- @lottiefiles/dotlottie-web 0.81.0 (2026-10-06, MIT), ESM (`module: dist/index.js`). `dotlottie-player.wasm` má 1 238 072 B (nekomprimovaný). — [npm registry](https://registry.npmjs.org/@lottiefiles/dotlottie-web), [jsDelivr wasm](https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.81.0/dist/dotlottie-player.wasm)
- @rive-app/canvas a canvas-lite 2.44.2 (2026-10-10, MIT). LICENSE v repu rive-wasm: „MIT License, Copyright (c) 2020-2021 Rive“. `canvas-lite/rive.js` má 489,8 kB raw, 109 kB gz, UMD (webpack). Ke spuštění potřebuje WASM. — [npm registry](https://registry.npmjs.org/@rive-app/canvas-lite), [rive-wasm LICENSE](https://github.com/rive-app/rive-wasm/blob/master/LICENSE), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/@rive-app/canvas-lite@2.44.2/rive.js)
- Spine `@esotericsoftware/spine-canvas` 4.3.13 (2026-07-24), licence v npm „LicenseRef-LICENSE“. IIFE build má 56,5 kB gz. — [npm registry](https://registry.npmjs.org/@esotericsoftware/spine-canvas), měřeno z [jsDelivr](https://cdn.jsdelivr.net/npm/@esotericsoftware/spine-canvas@4.3.13/dist/iife/spine-canvas.min.js)
- Spine Runtimes License: mimo Sekci 2 Spine Editor License Agreement „each user of the Products must obtain their own Spine Editor license“. Redistribuce „must include this license and copyright notice“. — [esotericsoftware.com/spine-runtimes-license](https://esotericsoftware.com/spine-runtimes-license)
- Spine Editor License, Sekce 2: integrace runtimů je povolena, pokud produkt přidává „significant and primary functionality“ a vývojář drží platnou licenci Spine Editoru v době integrace. Trial licence je ze Sekce 2 vyloučena. Essential/Professional platí jen při hrubém obratu a financování pod 500 000 USD za 12 měsíců, nad tím je potřeba Enterprise. Education licence nejde použít komerčně. — [esotericsoftware.com/spine-editor-license](https://esotericsoftware.com/spine-editor-license)
- DragonBones JS: poslední npm verze 5.7.4 z 2021-04-16. Repo DragonBonesJS není archivované, poslední push 2026-01-23 (žádné nové vydání). — [npm registry dragonbones.js](https://registry.npmjs.org/dragonbones.js), [GitHub API](https://api.github.com/repos/DragonBones/DragonBonesJS)

### Inferences
- Pro tuto hru jsou autorované runtimy převážně nevhodné: čtyři stylově odlišná témata by potřebovala čtyři sady assetů a vizuální identita stojí na procedurálním kreslení. Výjimkou může být Lottie (light canvas, 54 kB gz) pro jednorázovou animaci v menu nebo na obrazovce výsledku. Animace by šla vytvořit zdarma (např. v editorech exportujících Lottie). Licence konkrétních animací z LottieFiles je nutné kontrolovat zvlášť.
- Rive: runtime je MIT, ale editor Rive má vlastní cenové podmínky (neověřeno v této session). Bez bundleru je integrace přes UMD + WASM.

### Gaps
- Ceny Spine Editoru a aktuální podmínky Rive editoru (free tier, export) jsem neověřil.
- Gzip velikost Rive WASM jsem neměřil.

---

## 7. Podpora WebGL2 / WebGPU v prohlížečích (2026)

### Takeaway
WebGL2 je de facto univerzální (97,13 % globálně), takže je bezpečným cílem pro post-processing. WebGPU má 85,8 % plné a 3,66 % částečné podpory. Firefox i Safari na desktopu ji mají jen částečně. Pro malou 2D hru WebGPU nic podstatného nepřináší.

### Cited Findings
- WebGL2: globální podpora 97,13 %. Chrome od 56, Firefox od 51, Safari od 15, iOS Safari od 15.0. — [caniuse webgl2.json (Fyrd/caniuse, commit 2026-10-13)](https://github.com/Fyrd/caniuse/blob/main/features-json/webgl2.json), [caniuse.com/webgl2](https://caniuse.com/webgl2)
- WebGPU: plná podpora 85,8 %, částečná 3,66 %, status W3C Working Draft. Chrome od 113, Firefox od 141 částečně (s poznámkami), Safari 27 částečně, iOS Safari 26.0 plně, Chrome Android 154, Samsung Internet 24. — [caniuse webgpu.json](https://github.com/Fyrd/caniuse/blob/main/features-json/webgpu.json), [caniuse.com/webgpu](https://caniuse.com/webgpu)

### Inferences
- Doporučený cíl je WebGL1/2 s fallbackem na čistý Canvas 2D. WebGPU zatím vynechat.

### Gaps
- Podrobné poznámky k částečné podpoře WebGPU ve Firefoxu (platformy) jsem nerozepisoval.

---

## Celkové hodnocení pro projekt (inference ze všech zjištění výše)

1. **Nejvyšší poměr přínos/náklad:** vlastní volitelný WebGL post-process pass nad stávajícím Canvas 2D (0 závislostí, ~100–250 řádků, per-téma shader: CRT/scanlines pro pixel, grain/papír pro koláž, tón pro blueprint, color grading pro dusk). Fallback na Canvas 2D a testy beze změny.
2. **Malé vendorovatelné knihovny, které dávají smysl:** `simplex-noise` (MIT, 4,7 kB gz) a případně `@tweenjs/tween.js` (MIT, 7 kB gz) nebo vlastní tweener.
3. **Až pokud by tým chtěl hodně hotových efektů naráz:** PixiJS v8 + pixi-filters jako pouhá filtrová vrstva nad texturou canvasu (~280 kB gz, MIT). Částice ale ne přes @pixi/particle-emitter (nepodporuje v8).
4. **Nedoporučeno:** Phaser, KAPLAY, LittleJS jako náhrada (přepis hry); lygia (Prosperity, komerčně jen 30denní trial); kopírování Shadertoy kódu bez ověření licence (výchozí CC BY-NC-SA 3.0); Spine (placená licence editoru); DragonBones (mrtvý); glslCanvas (neudržovaný od 2022); GSAP jen s vědomím proprietární, jednostranně měnitelné licence.
