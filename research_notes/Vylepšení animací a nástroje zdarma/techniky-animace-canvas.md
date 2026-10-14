> **ZASTARALÉ (15. 10. 2026):** implementace pro Canvas 2D (640×360, paralaxa, 4 styly); hra je 3D (`src/render3d/`). Obecné techniky (easing, pružiny, šum, hitstop) platí jako podklad a jsou v `src/motion.js` a `src/juice.js`. Nečíst jako zadání.

# Code-level animation & game-feel techniques for a vanilla Canvas 2D game ("Just Throw It")

Context: 640×360 canvas (pixel theme 1×, smooth themes 2× = 1280×720), fixed physics step 1/60 s, rAF render, parallax (.035 / .28 / 1.0), today mostly `sin(t)` oscillations, modulo loops, fixed blinks. Research date: 2026-10-13. Formulas/pseudo-code in "Inferences" are my implementation suggestions derived from the cited sources.

## 1. Easing, tweening, springs, frame-rate-independent smoothing

### Takeaway
Replace linear/`sin` motion with (a) one-shot tweens using Penner/easings.net curves for discrete events (UI pop, ring scale, landing), and (b) continuous "follow" motion with exponential decay `lerp(x, target, 1 - exp(-k*dt))` or a half-life-parametrized critically damped spring (Daniel Holden) for camera, plane tilt, UI counters. Springs keep velocity continuous, plain lerp does not.

### Cited Findings
- easings.net catalogues the standard Penner set: Sine, Quad, Cubic, Quart, Quint, Expo, Circ, Back, Elastic, Bounce, each as In / Out / InOut; rationale: "Objects in real life don't just start and stop instantly, and almost never move at a constant speed" (drawer → ease-out; dropped object → bounce). Formulas live in the open-source repo github.com/ai/easings.net. — [easings.net](https://easings.net/); original equations: [Robert Penner – Easing](http://robertpenner.com/easing/)
- Holden's exact damper: `x = lerp(x, g, 1 - exp(-(ln2 * dt)/(halflife+eps)))` — fixes decay rate, stable for any dt; halflife is the intuitive parameter ("time to cover half the remaining distance"). — [Daniel Holden, Spring-It-On / spring-roll-call](https://theorangeduck.com/page/spring-roll-call)
- Fast approximation of `exp(-x)`: `1/(1 + x + 0.48x² + 0.235x³)`. — [Holden](https://theorangeduck.com/page/spring-roll-call)
- Critically damped spring (goal velocity 0), verbatim logic:
  ```
  y = (4*ln2/halflife)/2; j0 = x - goal; j1 = v + j0*y; e = negexp(y*dt)
  x = e*(j0 + j1*dt) + goal;  v = e*(v - j1*y*dt)
  ```
  Underlying ODE `a = s(g−x) + d(q−v)`; exact solutions avoid the velocity discontinuities of the plain damper; for many springs with same halflife/dt precompute `y` and `eydt`. — [Holden](https://theorangeduck.com/page/spring-roll-call)
- Freya Holmér's talk "Lerp smoothing is broken" (YouTube LSNQuFEDOyQ) popularised the frame-rate-independent form `b + (a−b)*exp(−decay*dt)`; a community summary suggests decay values ≈1–25 work well. (Secondary sources only; I did not watch the video.) — [itch.io comment referencing the talk](https://itch.io/post/13497385); [r3f-gamedev smooth-interpolation skill](https://skills.sh/verekia/r3f-gamedev/smooth-interpolation)
- Jonasson & Purho demoed "tween, stretch, or squeeze in-game objects to give their titles a sense of life" on a Breakout clone; juice = "maximum output for minimum input". — [Game Developer, 2013: "Is your game juicy enough?"](https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough-)

### Inferences
- Standard easings (t ∈ [0,1], from easings.net repo / Penner):
  - `easeOutCubic = 1 - (1-t)**3` — default for anything that "arrives" (UI slide-in, plane settling, score fly-in).
  - `easeInOutSine = -(Math.cos(Math.PI*t) - 1)/2` — ambient loops that must not look mechanical (crane swing tween between noise targets).
  - `easeOutBack(c1=1.70158, c3=c1+1) = 1 + c3*(t-1)**3 + c1*(t-1)**2` — overshoot for pops: QTE ring appearing, "PERFECT!" label, score digits.
  - `easeOutElastic`: `t==0?0:t==1?1: 2**(-10t) * sin((t*10-0.75)*(2π/3)) + 1` — sparingly, for wobbly reward text.
  - `easeOutBounce` — landing of the plane on ground/roof (a single small bounce is plenty).
  - `easeInQuad/Cubic` — things leaving/falling (anticipation pull-back of throw, fading UI out).
- Minimal tween engine (no deps): array of `{obj, key, from, to, t0, dur, ease, onDone}`; update in render loop with `p = clamp((now-t0)/dur)`; `obj[key] = from + (to-from)*ease(p)`. Pool tween objects to avoid GC.
- Frame-rate independence: in the 1/60 fixed step dt is constant, so `lerp(x,t,0.1)` is already deterministic there — but anything updated in the rAF render function (camera, UI, parallax smoothing) must use `1-Math.exp(-k*dt)` because 120/144 Hz displays call rAF more often.
- Where to use springs in this game: camera follow (halflife ≈ 0.15–0.3 s), plane visual rotation chasing velocity angle (halflife ≈ 0.05–0.1 s — removes jitter when velocity flips), charge-bar fill, kid character's arm/head reacting, hanging signs/crane hook reacting to wind gusts (underdamped spring: semi-implicit Euler `v += (k*(g-x) - c*v)*dt; x += v*dt` with c below 2√k for wobble).
- Interpolate render state between physics steps (`alpha = accumulator/step; drawPos = prev + (cur-prev)*alpha`) — otherwise on 120 Hz screens motion stutters even with perfect easing.

### Gaps
- Could not read Freya Holmér's talk directly; formula attributed via secondary sources.
- No empirical source found ranking which easing curve "feels best" for which event — guidance is practitioner convention.

## 2. 12 principles of animation applied to this game

### Takeaway
The highest-value principles for a paper-plane thrower are squash & stretch (plane, kid, landing), anticipation (throw wind-up), follow-through/overlapping action (plane wingtips, kid's arm/hair, rope), slow-in/out (everything via easings), arcs (already from physics) and secondary motion (props reacting to the plane's passage/wind). All are cheap transforms in Canvas 2D (`ctx.translate/rotate/scale`).

### Cited Findings
- The 12 principles (Thomas & Johnston, Disney, "The Illusion of Life", 1981): squash & stretch, anticipation, staging, straight-ahead/pose-to-pose, follow-through & overlapping action, slow in/out, arcs, secondary action, timing, exaggeration, solid drawing, appeal. — [Wikipedia: Twelve basic principles of animation](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation) (not fetched in this session; standard reference)
- Jonasson & Purho's juicy Breakout explicitly used stretch/squeeze and tweening of objects. — [Game Developer](https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough-)
- Nijman's Nuclear Throne breakdown uses a "weapon kick" (sprite jerks back by 2 and snaps back) — follow-through/recoil as a code-level offset. — [Infovore summary of Nijman](https://infovore.org/?p=5275)

### Inferences (concrete recipes)
- **Squash & stretch, volume-preserving:** `sx = 1 + s; sy = 1/(1+s)` (area constant). Plane in flight: `s = clamp(speed/vmax,0,1)*0.25` stretched along velocity (rotate to velocity angle, then scale). On landing impact: set `s = -0.35` and spring it back to 0 (underdamped, halflife ~0.08 s) → squash + jiggle. Kid on release: 3-frame squash (sy 0.9) → stretch (sy 1.1) → rest.
- **Anticipation:** while charging the throw, kid leans back proportional to charge (`lean = easeOutQuad(charge)*maxLean`), arm rotates backwards; on release, snap forward with easeOutBack over ~120 ms. Plane can slightly shrink/tilt back during charge. The QTE ring can "breathe in" (scale 1.0→0.95) right before the perfect window.
- **Follow-through & overlapping action:** kid's arm overshoots past release angle and settles (spring); hair/cap/scarf as 3–5 Verlet points (see §4) lagging behind body. Plane wing tips: draw wing polygon with tip y-offset driven by a spring chasing `-angularVelocity*k` → wings "flex" on pitch changes.
- **Secondary motion:** when the plane flies by a prop (bird flock, laundry line, smoke puff, crane hook), add an impulse proportional to plane speed and 1/distance → birds scatter, smoke bends, rope swings more. Cheap: one distance check per prop per frame.
- **Arcs:** already from physics; enhance readability with a fading trail ribbon (§3) that makes the arc visible.
- **Slow in/out & timing:** never move UI linearly; use easeOut for entries (150–250 ms), easeIn for exits (100–150 ms) — exits faster than entries.
- **Exaggeration:** perfect-QTE throw gets larger stretch, brief hitstop and bigger particle burst than a normal throw (tiered feedback).
- **Staging:** dim/vignette background slightly during QTE so the ring reads (multiply overlay, §5).

### Gaps
- No game-specific empirical study on squash/stretch magnitudes; numbers above are starting values to tune.

## 3. Game feel / juice: screenshake, hitstop, camera, flashes, trails, particles; empirical evidence; accessibility

### Takeaway
Use trauma-based noise shake (shake = trauma², decaying linearly), 10–60 ms hitstop on meaningful impacts, camera look-ahead along plane velocity with spring smoothing, 1–2-frame impact flashes, trail ribbon, landing dust and popping numbers. Empirical research supports *moderate* juice: medium/high beats none and extreme. Provide a reduced-motion toggle (honour `prefers-reduced-motion`) and keep full-screen flashes under 3 per second.

### Cited Findings
- **Trauma shake (Bevy implementation of the Eiserloh GDC 2016 model):** trauma ∈ [0,1], decays `0.5/s` (full trauma → 0 in 2 s), `shake = trauma^2` (higher exponent = more abrupt), max angle 10°, max translation 20 px, 1D Perlin noise at speed 20 with independent seeds/offsets (t+0, t+100, t+200) for roll, x, y; each hit adds 0.4 trauma. — [Bevy 2D screen shake example](https://bevy.org/examples/camera/2d-screen-shake/)
- The talk itself: Squirrel Eiserloh, "Math for Game Programmers: Juicing Your Cameras With Math", GDC 2016 (camera framing, split screen, screen shake math). — [Game Developer: Sprucing up cameras with math](https://gamedeveloper.com/programming/video-sprucing-up-cameras-with-math)
- **Nijman (Vlambeer) pistol shot in Nuclear Throne:** camera kicked back 6 px from the aim point; "add 4 to the screenshake", decays fast; weapon kick 2; bullet round on the first frame to fake muzzle flash; enemy pushed 3 px/frame; "The game freezes for about 10-20 milliseconds whenever you hit something" (hitstop). Talk "The art of screenshake", INDIGO 2013. — [Infovore summary](https://infovore.org/?p=5275); [Juicy Robots page (talk date/venue)](https://jimaroonie.itch.io/juicy-robots)
- **"Juice it or lose it"** (Martin Jonasson & Petri Purho, 2012; Nordic Game / GDC Europe — sources disagree on first venue): juice = things that "wobble, squirt, bounce around, and make little cute noises"; "maximum output for minimum input". — [Game Developer 2013](https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough-); [GDC Europe 2012 preview](https://www.gamedeveloper.com/business/gdc-europe-2012-details-the-top-sessions-for-next-week-s-show)
- **Hicks, Gerling, Dickinson et al., CHI PLAY 2019, "Juicy Game Design: Understanding the Impact of Visual Embellishments on Player Experience":** two studies (n=40 with Cuber/Frogger-clone + Dungeon Descent FPS; n=32 with Quake 3 Arena); visual embellishments improved visual appeal in all games but affected competence etc. only under specific circumstances. — [Staffordshire repository / search summary](https://eprints.staffs.ac.uk/8847/); DOI [10.1145/3311350.3347171](https://doi.org/10.1145/3311350.3347171)
- **Hicks, Dickinson, Holopainen, Gerling, DiGRA 2018 "Good Game Feel: An Empirically Grounded Framework for Juicy Design"** — framework from a survey of 17 developers + affinity diagram. — [DiGRA library](https://dl.digra.org/index.php/dl/article/view/936)
- **Kao et al. 2020, "The effects of juiciness in an action RPG", Entertainment Computing 34:** four versions (none / medium / high / extreme); medium and high beat none and extreme on all measures; both none and extreme significantly reduced player experience. — [Improbable Research summary](https://improbable.com/tag/rpg/); [Lin et al. 2022 citing it](https://arxiv.org/abs/2208.06155)
- **Lin, Duan, Wen, Cai 2022 (IEEE GEM), "What Features Influence Impact Feel?"**: 19-feature framework; "hit stop, sound coherence, and camera control may strongly influence players' impact feel"; lacking one "may ruin players' impact feel". — [arXiv 2208.06155](https://arxiv.org/abs/2208.06155)
- Survey of game-feel research (Pichlmair & Johansen, "Designing Game Feel. A Survey", 2020/IEEE ToG). — [arXiv 2011.09201](https://arxiv.org/pdf/2011.09201)
- Haptic juice study (Waterloo): both low- and high-juicy vibrotactile feedback improved player-experience measures. — [UWaterloo Haptic Experience Lab](https://uwaterloo.ca/haptic-experience-lab/projects/juicy-haptic-design-vibrotactile-embellishments-can-improve)
- **Accessibility:** `prefers-reduced-motion: reduce` — baseline widely available since Jan 2020; scaling/panning large objects can trigger vestibular discomfort. — [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- **Photosensitivity (WCAG 2.3.1):** no more than 3 flashes in any 1 s, unless below general/red flash thresholds; general flash = opposing luminance change ≥10 %; area threshold ≈ 25 % of a 10° field ≈ 341×256 px at 1024×768 (87,296 CSS px²); saturated red flashes are a separate, stricter case. — [W3C Understanding SC 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)

### Inferences (recipes for this game)
- **Trauma shake in Canvas:** `trauma = min(1, trauma + hit)`; each frame `trauma = max(0, trauma - 0.8*dt)`; `s = trauma*trauma`; `ox = MAXOFF*s*noise1(seed+t*F)`, `oy = ...noise1(seed2+...)`, `rot = MAXROT*s*noise1(seed3+...)`; apply `ctx.translate(W/2+ox, H/2+oy); ctx.rotate(rot); ctx.translate(-W/2,-H/2)` only to world layers, never to HUD. For a 640×360 view scale Bevy's numbers down: max 6–8 px, 2–3°. Pixel theme: round offsets to integer to avoid shimmer. Parallax: multiply shake by layer factor (sky barely moves) — sells depth.
- Events → trauma: perfect throw release 0.25, plane crash 0.6, hitting obstacle 0.4; gentle landing 0.1. Directional "kick" (Nijman): on throw, offset camera 4–6 px opposite to throw direction and spring back.
- **Hitstop:** on crash/perfect-QTE, skip physics steps for 40–80 ms (`freezeTimer`), keep rendering (and keep particles/flash animating) — at 60 Hz that's 2–5 steps. Nijman's 10–20 ms is for frequent hits; rare climactic events can be longer. Combine with a 1-frame white silhouette of the plane (draw sprite with `globalCompositeOperation='source-atop'` fill white on an offscreen copy, or just a white-tinted cached version).
- **Camera look-ahead:** `target = plane.pos + plane.vel * lookAheadTime (0.3–0.5 s)` clamped; smooth with spring (halflife 0.2 s); add slight zoom-out with speed (`zoom = lerp(1, 0.9, speed01)`) — with fixed 640×360 a scale transform around the plane works.
- **Speed lines:** when speed > threshold, spawn thin lines (1 px, alpha 0.3–0.6) at screen edges moving opposite to velocity, length ∝ speed; draw all in one `beginPath()` + one `stroke()`.
- **Trail ribbon:** ring buffer of last N (16–30) plane positions; draw as polyline with decreasing width (draw segments with `lineWidth = w*i/N`, `globalAlpha = i/N`), or one tapered polygon (offset points ± normal × width). Paper plane: thin white/wind streaks off wingtips (two ribbons).
- **Landing dust:** 6–12 particles in a half-circle, initial velocity outward/up, drag `v *= exp(-4dt)`, size grows while alpha drops (`size = s0*(1+2p)`, `alpha = (1-p)^2`).
- **Number pop-ups (distance, score):** spawn at world position, rise with easeOutCubic 20 px over 0.6 s, scale easeOutBack 0→1 in 150 ms, fade last 30 %; counting-up totals via exponential lerp toward target value (`shown += (target-shown)*(1-exp(-10dt))`, round for display) + small scale bump each time digits change.
- **Impact flash:** full-screen white `fillRect` with alpha 0.4→0 over ~100 ms max once per event — stays well under WCAG 3 flashes/s; avoid saturated red flashes; under reduced-motion use a soft colour tint instead.
- **Settings:** `reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches` as default for an in-game toggle that scales shake ×0, disables zoom pulses/speed lines, keeps hitstop short. Also a "shake intensity" slider (0/50/100 %).
- Calibration per Kao 2020: aim for "medium–high", not "extreme"; layer effects only on meaningful events.

### Gaps
- Could not access Steve Swink's "Game Feel" (2008, Morgan Kaufmann) text directly — no quotes; it defines game feel as real-time control + simulated space + polish. Treat as background, not cited.
- Original Eiserloh slides not fetched; trauma-model numbers come from Bevy's implementation of it.
- Full text of Hicks 2019 not read (only abstract-level summary); author list beyond Hicks/Gerling/Dickinson unconfirmed.

## 4. Procedural / noise animation, Verlet, particles

### Takeaway
Replace `sin(t)` with 1D value/Perlin noise (sum of 2–3 octaves) for wind, sway, flicker and idle drift — it never visibly repeats. Use Verlet points + distance constraints (Jakobsen) for the crane rope, laundry lines, flags, kid's scarf. Use a pooled particle system with lifetime curves for smoke, dust, sparks, rain splashes.

### Cited Findings
- Noise = random numbers arranged in a line/grid, smoothed by interpolation; frequency = horizontal size of features, amplitude = vertical size; summing octaves (powers of two) → fractal/fBm; red (Brownian) noise emphasises low frequencies and reads as "natural", white noise = uniform random. — [Red Blob Games: Noise functions and map generation](https://www.redblobgames.com/articles/noise/introduction.html)
- Bevy shake uses 1D Perlin noise in [-1,1] sampled at offset seeds for independent channels. — [Bevy example](https://bevy.org/examples/camera/2d-screen-shake/)
- Jakobsen, "Advanced Character Physics" (IO Interactive, Hitman, GDC 2001): Verlet integration (position from current & previous, no stored velocity), collisions by projection, constraint solver by relaxation (satisfy each constraint in turn, iterate), rigid bodies approximated as particles + constraints. Weakness: few iterations → "bouncy"/stretchy. — [Game Developer: Advanced Character Physics](https://gamedeveloper.com/programming/advanced-character-physics); [Tuts+ tearable cloth tutorial](https://code.tutsplus.com/simulate-tearable-cloth-and-ragdolls-with-simple-verlet-integration--gamedev-519t); [GameDev.net discussion](https://gamedev.net/forums/topic/296733-verlet-with-rigid-body/2881006/)
- `globalCompositeOperation = 'lighter'` adds colour values where shapes overlap (additive blending); baseline widely available since July 2015. — [MDN globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

### Inferences (recipes)
- **1D value noise (no lib, ~10 lines):** `hash(i) = fract(sin(i*127.1)*43758.5453)`; `noise1(x){i=floor(x); f=x-i; u=f*f*(3-2f); return lerp(hash(i),hash(i+1),u)*2-1}`; `fbm(x) = n(x) + 0.5n(2x) + 0.25n(4x)` normalised. For Perlin-quality gradients use 1D gradient noise (`g=hash*2-1; lerp(g0*f, g1*(f-1), u)`). Cost: negligible.
- Applications: **wind** global `wind(t) = base + gust*fbm(t*0.3)` shared by smoke drift, rain angle, flags, bird flock, plane turbulence (tiny force) → coherent world. **Crane rope sway** = Verlet rope driven by wind. **Window flicker** = `noise1(t*8 + windowId*13.7) > 0.6` instead of fixed blink; TV-blue flicker: brightness `0.7+0.3*noise(t*15+id)`. **Lighthouse beam** intensity jitter ±5 % via noise; **birds**: per-bird phase offsets + noise on wingbeat frequency and path (or simple boids: separation/alignment/cohesion with 10–30 birds is cheap). **Idle kid**: breathing scale `1+0.02*sin` plus noise-driven head look.
- **Smoke:** particles rise, drift with `wind + curl-like swirl`: cheap pseudo-curl in 2D = take a noise field `n(x,y,t)` and use velocity `(∂n/∂y, −∂n/∂x)` via finite differences (divergence-free → swirling, non-clumping). Size grows, alpha fades, colour lerps from warm grey to sky colour. (Curl noise origin: Bridson et al., SIGGRAPH 2007 — not fetched, background.)
- **Verlet rope (crane, laundry, flag rows):** points `{x,y,px,py}`; step: `vx=(x-px)*damp; px=x; x+=vx+ax*dt²`; then K=3–8 iterations of `for each link: d=dist; diff=(d-L)/d; move both ends by 0.5*diff*delta` (pinned end fixed). Flag = grid of points (e.g. 6×4) with structural constraints, drawn as quads/triangles with shading by vertical displacement. Runs in the fixed 1/60 step → stable.
- **Particle system:** fixed-size pool (struct-of-arrays `Float32Array` x,y,vx,vy,life,maxLife,size,…) to avoid GC spikes on mobile; emitters with rate + burst; per-particle `p = age/life` drives curves (`alpha=(1-p)^2`, `size=s0*easeOutCubic(p)`), drag via `exp(-k*dt)`. Draw by type in batches: set `fillStyle` once, `globalCompositeOperation='lighter'` for sparks/glow, 'source-over' for dust/smoke. Pre-render soft round particle sprites (radial gradient) once into small offscreen canvases and `drawImage` them, tinted variants cached per colour.
- Rain improvement: angle from wind, length ∝ fall speed, splash particles (2–3 px) on rooftops/ground, occasional drops streaking across the camera layer (foreground parallax >1.0).

### Gaps
- No benchmark numbers found for particle counts sustainable in Canvas 2D on mid-range mobile; needs in-game profiling.
- Curl-noise primary source (Bridson 2007) not fetched.

## 5. Canvas 2D lighting & post-processing without WebGL (with 2025–2026 browser support)

### Takeaway
Blend modes (`lighter`, `screen`, `multiply`, `overlay`, `soft-light`) are universally supported and are the backbone of lighting/grading. `ctx.filter` (blur etc.) is **still not enabled by default in Safari/iOS Safari as of Safari 26–27 (2026)** — do not rely on it; fake blur/bloom with downscaled offscreen canvases. OffscreenCanvas is supported everywhere relevant (Safari 17+).

### Cited Findings
- `ctx.filter`: Chrome 52+, Edge 79+, Firefox 49+; **Safari macOS 18.0–27.1 and Technology Preview: present but disabled by default; iOS Safari 18.0–27.2: disabled by default**; MDN marks it "Limited availability – not Baseline". — [caniuse: canvas filter](https://caniuse.com/mdn-api_canvasrenderingcontext2d_filter); [MDN ctx.filter](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter)
- WebKit bug 198416 (2019 request) shows RESOLVED FIXED, yet the feature remains flag-gated; bug 275436 (OffscreenCanvas `.filter`) still NEW in snapshot seen. A partial polyfill exists (`context-filter-polyfill`). — [WebKit bug 198416](https://bugs.webkit.org/show_bug.cgi?id=198416); [WebKit bug 275436](https://bugs.webkit.org/show_bug.cgi?id=275436); [npm context-filter-polyfill](https://npmjs.org/package/context-filter-polyfill)
- OffscreenCanvas: Chrome 69+, Edge 79+, Firefox 105+, Safari 17.0+ (partial 16.2–16.6), iOS Safari 17.0+; ~96.8 % global usage. — [caniuse OffscreenCanvas](https://caniuse.com/offscreencanvas)
- Blend modes: `lighter` = additive; `screen` = lighter result (inverse of multiply); `multiply` = darker; `overlay` = darks darker/lights lighter; `soft-light`; `color-dodge`; `destination-out` (erase); `source-atop` (draw only over existing pixels) — Baseline widely available since July 2015. — [MDN globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

### Inferences (recipes)
- **Feature detection:** `'filter' in ctx` is not enough on Safari when the property exists but is ignored — test: set `ctx.filter='blur(2px)'`, read back; or draw a 1-px dot blurred on a tiny canvas and check neighbouring pixel alpha. Fallback path always.
- **Fake blur / bloom (works everywhere):** render bright elements (lights, beam, windows, sun, sparks) to a separate offscreen canvas; `drawImage` it into a ¼-size canvas, then back up to ½ and to full with `imageSmoothingEnabled=true` (bilinear upscale = blur); composite with `'lighter'` or `'screen'` at alpha 0.5–0.8. Two downsample passes give a soft glow at a fraction of `shadowBlur` cost. In pixel theme, keep glow layer smooth but draw at 1× under integer offsets.
- **Static glows:** pre-render radial-gradient "light blobs" (lamp, lighthouse lens, window) once into small offscreen canvases; per frame only `drawImage` with `globalAlpha` from noise flicker. Never create gradients per frame for many objects.
- **Lighthouse beam / light shafts:** a cached tall triangle/trapezoid with a linear gradient (alpha 0.25→0), drawn rotated with `'screen'` or `'lighter'`; add dust motes (few particles) only inside beam using `'source-atop'` on a beam mask canvas.
- **Night/dusk lighting:** draw world → overlay a dark blue full-screen rect with `'multiply'` → punch lights by drawing light sprites into a "light map" canvas (black bg, lights 'lighter'), then composite light map with `'screen'`/`'lighter'`. Light map can be ¼ resolution.
- **Colour grading per theme/time of day:** one full-screen gradient (top colour → bottom colour) drawn with `'overlay'` or `'soft-light'` at alpha 0.2–0.35; cache the gradient object once (only re-create on theme change). Cost: one fullscreen fill per frame.
- **Vignette:** pre-rendered radial gradient (transparent centre → rgba(0,0,0,0.35) edges) cached in an offscreen canvas; `drawImage` each frame (or once into the HUD layer). Strengthen briefly during QTE.
- **Fog / atmospheric perspective:** between parallax layers draw a horizontal band gradient with sky colour at alpha 0.15–0.4 → far city recedes; animate band offset with slow noise. Equivalent of depth-of-field: pre-blur the far-city layer *once* at load (downscale/upscale trick or `filter` where available — it's offline, so a slow fallback is fine) and cache it.
- **Static layer caching:** far city / sky tiles are drawn once into offscreen canvases (wide strip, tile horizontally) — per frame just 1–2 `drawImage` per layer with integer x for the pixel theme. Use `createImageBitmap` for decoded image assets to avoid first-draw decode jank.
- **Additive particles:** sparks, glints on plane when catching sunlight, perfect-QTE burst with `'lighter'`; reset `globalCompositeOperation` after batch.

### Gaps
- No authoritative statement found on *when* Safari will enable canvas `filter` by default; treat as unavailable for 2026.
- Didn't find precise per-op costs of each blend mode on mobile GPUs; plausible but unverified that non-separable modes (overlay/soft-light) cost more than lighter/multiply.

## 6. Performance budget for Canvas 2D at 60 fps on mobile

### Takeaway
At 60 fps the frame budget is 16.7 ms (8.3 ms at 120 Hz). Expensive: `shadowBlur`, `filter`, text rendering, per-frame gradient creation, many small paths with state changes, scaling in `drawImage`, sub-pixel coordinates. Cheap: `drawImage` of cached sprites at integer coords, batched paths, blend modes on modest areas.

### Cited Findings
- MDN canvas optimisation list: pre-render repeated objects to an offscreen canvas; use integer coordinates (sub-pixel → extra anti-aliasing); don't scale images in `drawImage` (cache sizes); multiple layered canvases by update frequency; CSS backgrounds for static large images; scale the canvas via CSS transforms; `getContext('2d',{alpha:false})`; batch calls (one polyline instead of many lines); avoid unnecessary state changes; render only screen differences; **avoid `shadowBlur`**; avoid text rendering; use rAF. — [MDN Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- `ctx.filter` not available in Safari by default (see §5), so any filter-based effect is both a perf and compat risk. — [caniuse](https://caniuse.com/mdn-api_canvasrenderingcontext2d_filter)

### Inferences
- **Budget sketch for this game (mid mobile, 1280×720 smooth themes):** ≤ 3–4 full-screen composites per frame (background cache, colour grade, vignette, optional bloom), ≤ ~300–500 small sprite draws, particles capped by pool (e.g. 256), text cached into canvases (score digits as pre-rendered glyph atlas, re-render only on change).
- Consider rendering smooth themes at 1× logical (640×360) world with 2× only for HUD, or dynamic resolution: drop to 1× when measured frame time > 14 ms for N frames.
- Replace `shadowBlur` glows with cached glow sprites (§5). Text with outline/shadow → pre-render once.
- Group draws by style: all smoke (same fillStyle), then all sparks ('lighter'), then UI — minimise `save/restore` (each restore resets all state). Use `setTransform` directly instead of nested save/translate/restore for each sprite.
- Pixel theme: `imageSmoothingEnabled=false`, round all world positions after camera transform (`Math.round`) — also prevents parallax shimmer; apply sub-pixel smoothness only to smooth themes.
- Pause expensive ambient effects off-screen (cull by x range per parallax layer).
- Measure with `performance.now()` around update/render; show debug overlay; test on real iOS Safari (strictest).
- OffscreenCanvas in a Worker is possible for full rendering offload (Safari 17+), but adds complexity; for this game the main win is just caching layers to (Offscreen)canvases on the main thread.

### Gaps
- No authoritative 2025–2026 benchmark for Canvas 2D cost of blend modes, gradients or path counts on specific mobile devices; must profile in-game.
- MDN tips page is undated/evergreen; some tips (e.g., "layered canvases") have varying impact across modern GPU-accelerated canvas implementations.
