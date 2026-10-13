# Nástroje zdarma pro tvorbu a animaci 2D herní grafiky (pro „Just Throw It“)

Stav k 2026-10-13. Legenda spolehlivosti: **[ověřeno]** = potvrzeno primárním/aktuálním zdrojem v tomto výzkumu; **[z paměti]** = znalost modelu, v této session neověřeno webem, před rozhodnutím zkontrolovat LICENSE/web projektu.

Pro vanilla Canvas 2D bez build kroku jsou nejsnáz použitelné výstupy: **PNG sprite sheet + JSON (rámce)**, **sekvence PNG**, **SVG** (lze `drawImage` přes `Image` se SVG), případně **Lottie JSON** (vyžaduje runtime lottie-web / dotLottie – knihovna, ne nástroj) a **.riv** (vyžaduje Rive runtime).

## Pixel art a sprite animace (téma cyberpunk pixel)

### Takeaway
Nejlepší legální volba zdarma je **Pixelorama** (MIT, aktivní 2025–2026) nebo **LibreSprite** (GPL, verze 1.2 v 2025); **Aseprite** je nejlepší nástroj, ale zdarma jen jako vlastní kompilace ze zdrojů „pro osobní účel“ – EULA neřeší vlastnictví vytvořené grafiky a samotnou kompilaci omezuje, takže pro tým/komerci je čistší koupit ($19.99) nebo použít Pixeloramu.

### Cited Findings
- **Aseprite EULA, čl. 2(g):** „You may only compile and modify the source code of the SOFTWARE PRODUCT for your own personal purpose“ (příp. pro návrh příspěvku do projektu). **[ověřeno]** — [Aseprite EULA.txt (GitHub)](https://github.com/aseprite/aseprite/blob/main/EULA.txt)
- **Aseprite EULA, čl. 2(b):** „You may not distribute copies of the SOFTWARE PRODUCT to third parties“ – zkompilované binárky tedy nelze sdílet s dalšími členy týmu; volně šířit lze jen zkušební (evaluation) verze. **[ověřeno]** — [Aseprite EULA.txt](https://github.com/aseprite/aseprite/blob/main/EULA.txt)
- EULA **neobsahuje** ustanovení o vlastnictví/komerčním užití grafiky vytvořené v programu; čl. 4 se týká jen obsahu dostupného *přes* software. (Interpretace: autorská práva k vlastní kresbě má autor; EULA je nijak neomezuje – ale „personal purpose“ u kompilace je nejednoznačné pro komerční projekt.) **[ověřeno, interpretace je moje]** — [Aseprite EULA.txt](https://github.com/aseprite/aseprite/blob/main/EULA.txt)
- Pozn.: URL aseprite.org/eula vrátila 404 (nový web 2026) – primární text je v repu. — [Aseprite EULA.txt](https://github.com/aseprite/aseprite/blob/main/EULA.txt)
- Cena Aseprite: minimum **$19.99** za řadu 1.x, součástí Steam klíč; aktuální verze v1.3.18 (blog 2026); od 06/2026 nový platební procesor s lokálními cenami. **[ověřeno]** — [Aseprite FAQ](https://aseprite.org/faq/), [itch.io purchase](https://dacap.itch.io/aseprite/purchase), [Aseprite blog 2026-06-30](https://blog.aseprite.org/2026/06/30/new-website-account/)
- Aseprite export: sprite sheet PNG + JSON (formát „Hash/Array“), který je de facto standard pro JS. **[z paměti]**
- **Pixelorama:** MIT, v1.1 vydána 03/2025 (tilemap vrstvy, audio vrstvy, indexovaný režim, text tool), v1.1.5 (09/2025) přidala projektové palety a načítání .kra, itch.io nabízí 1.1.8. **[ověřeno]** — [Pixelorama v1.1 devlog](https://orama-interactive.itch.io/pixelorama/devlog/913933/pixelorama-v11-is-out), [itch.io stránka](https://orama-interactive.itch.io/pixelorama), [PortableApps 1.1.1](https://portableapps.com/node/78813)
- Pixelorama běží i ve webu (HTML5 build) a exportuje PNG spritesheet / sekvenci / GIF / APNG. **[z paměti]**
- **LibreSprite** (GPL fork starého GPL Aseprite): verze 1.2 zabalena v Arch (2025-09-18), FreeBSD (2025-09-29), Alpine (2025-04); binárky pro Windows/Linux/macOS/Android na GitHub releases. **[ověřeno]** — [Arch Linux package](https://archlinux.org/packages/extra/x86_64/libresprite/), [FreshPorts](https://www.freshports.org/graphics/libresprite), [README](https://cdn.jsdelivr.net/gh/libresprite/libresprite@master/README.md)
- **Piskel** (web, Apache-2.0): jednoduchý online editor, export PNG spritesheet, GIF; vývoj spíše v údržbě. **[z paměti – ověřit aktivitu na github.com/piskelapp/piskel]**
- **GrafX2** (GPL): klasický Deluxe Paint styl, Windows build; spíše pro statické obrázky. **[z paměti]**
- **Lospec**: databáze palet (zdarma, export .hex/.gpl/PNG) a online nástroje (Pixel Editor); vhodné pro výběr cyberpunk palety. **[z paměti]**

### Inferences
- Pro „Just Throw It“ (malý tým, Windows 11, bez rozpočtu) doporučuji Pixeloramu jako primární pixel editor; kompilace Aseprite je legální jen pro osobní použití jednotlivce a binárku nelze předat kolegovi.
- Export PNG sheet + JSON z Pixeloramy/LibreSprite/Aseprite stačí: v Canvasu `drawImage(sheet, sx, sy, w, h, ...)` podle JSON rámců.
- Pro téma cyberpunk pixel art je nutné renderovat s `imageSmoothingEnabled = false` a celočíselným škálováním (640×360 se dobře škáluje).

### Gaps
- Přesná aktuální cena Aseprite na Steamu (regionální ceny od 2026) – nenačteno ze Steam store.
- Aktivita Piskel a GrafX2 v 2025–2026 neověřena.

## Vektor a cut-out (témata papírová koláž, blueprint, flat dusk)

### Takeaway
Pro statické vektorové assety stačí **Inkscape** (GPL) – export SVG/PNG; pro frame-by-frame a „papírovou“ texturu **Krita** (GPL, animační timeline); **Graphite** je slibný (Apache-2.0, procedurální, animace přes nody), ale stále **alfa** – nepoužívat jako hlavní nástroj. **Glaxnimate** (GPL, KDE) je nejlehčí cesta k Lottie / SVG sekvencím.

### Cited Findings
- **Graphite:** oficiálně „free, open source vector graphics editor and animation engine, available now in alpha“; web app živá, desktop (Windows/Mac/Linux) ve stavu release candidate; rastrová editace zatím nepodporována; animace řízená nody, timeline panel na roadmapě. **[ověřeno]** — [graphite.art](https://graphite.art/), [Graphite features](https://graphite.art/features/), [It's FOSS (01/2026)](https://itsfoss.com/graphite-graphics-editor/), [Digital Production 07/2025](https://digitalproduction.com/2025/07/14/graphite-open-source-vector-design-tool-with-a-twist/)
- **Glaxnimate 0.6.0** vydán 2026-03-01 (předchozí 0.5.4 z 09/2023): KDE build infrastruktura, Microsoft Store listing, přepracovaný SVG import/export, prekompozice, export animace jako **sekvence SVG snímků**; podporované formáty: Lottie, animované SVG, WebP, RIVE, video. **[ověřeno]** — [KDE apps: Glaxnimate](https://apps.kde.org/glaxnimate), [AlternativeTo 03/2026](https://alternativeto.net/news/2026/3/glaxnimate-0-6-0-enhances-kde-integration-timeline-tools-bezier-editing-and-svg-export)
- **SVGator free:** export max. **3 animací** (SVG, Lottie, GIF, video) s vodoznakem, omezené úložiště renderů; help uvádí 3 nové projekty/měsíc, GIF/video max 256×256; video cap se mezi stránkami SVGatoru liší (256×256 vs 1024×576). **[ověřeno, zdroje si odporují]** — [SVGator pricing](https://svgator.com/pricing), [SVGator help](https://www.svgator.com/help/payments-and-invoices/what-is-included-in-the-starter-plan)
- **Inkscape** (GPL-2.0+, verze 1.4.x): export SVG (plain/optimized), PNG; standard pro blueprint linky a flat vektory. **[z paměti]**
- **Krita** (GPL-3.0): kreslení + animační timeline (frame-by-frame, onion skin), export sekvence PNG; dobré pro papírové textury a ručně kreslený kid character. **[z paměti]**
- **Synfig Studio** (GPL-3.0): vektorová tweenová animace s kostmi; export PNG sekvence / SVG / Lottie (plugin); vysoká křivka učení. **[z paměti]**
- **OpenToonz** (BSD-3): profesionální 2D animace (Studio Ghibli fork Toonz), export PNG sekvence; složité, pro hru této velikosti nadbytečné. **[z paměti]**
- **Blender Grease Pencil** (GPL): 2D kreslení/animace v 3D prostoru, render PNG sekvence; v Blender 4.3 přepracován GP v3. **[z paměti]**
- **Penpot** (MPL-2.0, web, self-host možný): UI/vektorový design, export SVG/PNG; bez animační timeline (jen prototypové přechody). **[z paměti]**
- **Figma free (Starter):** zdarma omezený počet souborů/stránek; vlastník obsahu je uživatel – exportované SVG/PNG lze komerčně použít. **[z paměti – ověřit aktuální limity Starter planu]**

### Inferences
- Paper cut-out téma: Inkscape (tvary) + papírová textura z ambientCG/Material Maker, export PNG s průhledností; animace cut-out stylem jde dělat přímo v kódu (rotace/translace dílů) – tzn. stačí „rozložená“ PNG místo sprite sheetu.
- Blueprint téma: Inkscape SVG linky; animaci „kreslení čáry“ lze v Canvasu udělat `setLineDash` + `lineDashOffset` z path dat (dnešní procedurální přístup je zde pravděpodobně lepší než assety).
- Flat dusk (Alto-like): Inkscape/Graphite pro siluety parallax vrstev, export PNG v 2× rozlišení.
- SVGator free (3 exporty) není udržitelný pro iterativní práci; Glaxnimate je plně zdarma a pokrývá Lottie i SVG sekvence.

### Gaps
- Přesné aktuální verze Inkscape/Krita/Blender a Figma Starter limity v 2026 neověřeny v této session.
- Kvalita Lottie exportu Glaxnimate 0.6.0 nebyla v release notes popsána.

## Skeletální / cut-out animace

### Takeaway
**Rive** má free plán (exporty .riv **se splash screenem**, 3 kolaborativní soubory) – pro hru je splash nepoužitelný, takže reálně placený Cadet $9/měs. **DragonBones** a **Spriter 2** jsou de facto mrtvé (poslední DragonBones Pro 5.6.2 z 12/2018; Spriter 2 bez veřejné aktualizace od pre-orderu ~2017). Spine je placený. Zdarma nejrozumnější: animovat díly v kódu nebo Glaxnimate→Lottie / Synfig.

### Cited Findings
- **Rive plány:** Free $0 (editor + CLI, .riv exporty se splash screenem, 3 kolaborativní soubory, 1 projekt/workspace, import asset 10 MB); Cadet $9/seat/měs (bez splash, neomezené soubory); Voyager $32; Enterprise $120 pro firmy s obratem $10M+. **[ověřeno]** — [Rive pricing](https://rive.app/pricing)
- Ceníková stránka Rive neuvádí licenci runtime ani podmínky komerčního užití. **[ověřeno]** — [Rive pricing](https://rive.app/pricing)
- Rive web runtime (`@rive-app/canvas`, repo rive-wasm) je pod MIT. **[z paměti – ověřit LICENSE v github.com/rive-app/rive-wasm]**
- **DragonBones Pro:** poslední dohledatelná verze 5.6.2 z 12.12.2018 (Windows/macOS); žádné oficiální oznámení o konci ani 2025 download stránka nenalezena. **[ověřeno – absence aktualizací]** — [MajorGeeks](https://www.majorgeeks.com/files/details/dragonbones_pro.html)
- **Spriter 2:** pre-order ~2017 se slibovanou beta 2018; nenalezen žádný důkaz vydání ani zrušení do 2025. **[ověřeno – absence]** — [GameDev.net pre-order](https://www.gamedev.net/news/spriter-2-the-2d-animation-tool-now-available-for-pre-order-r483/), [GameFromScratch Alchemist Kickstarter](https://gamefromscratch.com/spriter-2-alchemist-kickstarter/)
- **LottieFiles free:** workspace limit 5 souborů pro export a 20 MB DAM úložiště; blog LottieFiles uvádí Lottie Creator „Free (5 exports); paid for unlimited“. Pro ~ $12/uživatel/měs dle třetí strany (Vendr, může být zastaralé). **[ověřeno/částečně]** — [LottieFiles docs: plans and limits](https://docs.lottiefiles.com/en/integrations/figma/03_workspace/plans-and-limits), [LottieFiles blog 2026](https://lottiefiles.com/blog/design-guides-and-tips/best-motion-design-tools-ranked-by-use-case), [Vendr](https://www.vendr.com/marketplace/lottiefiles)
- **Spine** (Esoteric Software) – jen pro kontext: Essential cca $69 jednorázově, runtime licence vyžaduje licenci editoru. **[z paměti]**
- **Creature** (Kestrel Moon) – placený. **[z paměti]**

### Inferences
- Pro letadlo, holuba a dítě v 640×360 je skeletální systém přehnaný; „cut-out v kódu“ (PNG díly + pivoty + sinusové/tweenové rotace) dává 90 % efektu bez runtime knihovny a sedí do „no build step“.
- Rive free je vhodný jen na experiment (splash screen v exportu).
- Lottie by vyžadovalo přidat lottie-web (~250 kB) – v rozporu s minimalismem projektu; spíš exportovat z Glaxnimate PNG/SVG sekvence.

### Gaps
- Licence Rive runtime a podmínky komerčního užití free plánu neověřeny z Terms of Service.
- „Pixelover“ nedohledáno v této session.
- Aktuální cena Spine Essential neověřena.

## Částice a efekty

### Takeaway
**Effekseer** (MIT) umí renderovat efekt do sprite sheetu/jednotlivých snímků – zdarma a legitimní; alternativně Blender render sekvence → packer. Pixel FX Designer a JuiceFX jsou placené (jen pro informaci).

### Cited Findings
- Effekseer je pod MIT (potvrzeno pro 1.7/1.7.3). **[ověřeno pro 1.7]** — [GameDev.net Effekseer 1.70](https://code3d.gamedev.net/news/released-effekseer-170-visual-effect-tool-r2344), [SourceForge mirror](https://www.sourceforge.net/mirror/effekseer)
- Effekseer umí exportovat efekt jako jednotlivé snímky nebo spritesheet (uživatelský komentář, ne oficiální dokumentace). **[částečně ověřeno]** — [itch.io post](https://itch.io/post/6799094)
- Pixi particle editor (pixijs/particle-emitter editor) generuje JSON konfiguraci pro pixi-particle-emitter – použitelné jen s PixiJS, ne čistým Canvasem. **[z paměti]**
- Pixel FX Designer (Codemanu, Steam, placený ~$15) a JuiceFX (placený) – jen pro kontext. **[z paměti]**

### Inferences
- Pro „Just Throw It“ jsou procedurální částice v Canvasu levnější a stylově flexibilnější; assety dávají smysl jen jako **textury částic** (měkký kruh, papírový útržek, pixelová jiskra) – 4–8 malých PNG.
- Effekseer je 3D-orientovaný; pro pixel art téma je lepší kreslit flipbooky ručně v Pixeloramě.

### Gaps
- Effekseer 1.8 / stav 2025–2026 neověřen.

## Utility, zdroje assetů a AI

### Takeaway
**Free Texture Packer** (MIT) je bezpečná volba pro packování; **TexturePacker Essential** je zdarma **jen pro nekomerční projekty**. Optimalizace: Squoosh, oxipng, SVGO. CC0 zdroje (Kenney, Poly Haven, ambientCG) jsou bez rizika; OpenGameArt/itch.io nutno kontrolovat licenci per asset. AI assety: Steam od 01/2026 vyžaduje disclosure pro hráčem viditelný AI obsah.

### Cited Findings
- **TexturePacker Essential:** základní funkce zdarma **pouze pro nekomerční projekty**; pro komerci nutná licence; pokročilé funkce v Essential módu obarví sprity načerveno; 7denní trial. **[ověřeno]** — [CodeAndWeb: Is TexturePacker free?](https://www.codeandweb.com/texturepacker/knowledgebase/is-texturepacker-free), [Essential mode for commercial](https://www.codeandweb.com/texturepacker/knowledgebase/use-essential-mode-for-commercial-product)
- **free-tex-packer-core** (open-source jádro Free Texture Packer): padding, rotace, trimming, více exportérů (vč. JSON hash/array). **[ověřeno]** — [free-tex-packer-core README](https://cdn.jsdelivr.net/npm/free-tex-packer-core@0.2.0/README.md)
- Free Texture Packer (desktop/web, MIT). **[z paměti – licence MIT ověřit v repu odrive/free-tex-packer]**
- ShoeBox (Adobe AIR, freeware, neudržovaný). **[z paměti]**
- Squoosh (Google, web, Apache-2.0), oxipng (MIT, CLI), SVGO (MIT, CLI/Node). **[z paměti]**
- Material Maker (MIT, Godot-based, procedurální textury – vhodné na papírové zrno). **[z paměti]**
- Kenney.nl assety CC0; Poly Haven CC0; ambientCG CC0 (papírové textury); OpenGameArt a itch.io – licence per asset (CC-BY, CC-BY-SA, GPL…). Coolors – generátor palet zdarma. **[z paměti]**
- **Steam AI disclosure (16.–17. 1. 2026):** pomocné AI nástroje (např. pro kód) se již nehlásí; hlásit je nutné AI generovaný obsah, který hráč vidí (in-game assety, marketing), rozlišeno pre-generated vs. live-generated. **[ověřeno]** — [Notebookcheck](https://www.notebookcheck.net/Steam-updates-AI-disclosure-form-requiring-developers-to-report-visible-and-in-game-AI-but-not-background-tools.1206103.0.html), [Gigazine 2026-01-20](https://gigazine.net/gsc_news/en/20260120-steam-updates-ai-disclosure-guidelines)
- Podíl her s AI disclosure se v 2026 různě uvádí (~20 % / ~33 % / 40 % za týden) – nekonzistentní zdroje. — [Tech Insider](https://tech-insider.org/steam-ai-disclosure-2026), [ainauten](https://news.ainauten.com/markdown/steam-ai-inhalte-werden-bereits-bei-einem-drittel-der-neuerscheinungen-offengelegt)
- Autorskoprávní ochrana čistě AI generovaných obrazů je nejistá (US Copyright Office: vyžaduje lidské autorství). **[z paměti]**

### Inferences
- Doporučený pipeline: Pixelorama/Inkscape/Krita → PNG snímky → Free Texture Packer (JSON hash) → oxipng → Canvas `drawImage`. SVG pro blueprint téma přes SVGO.
- Webová hra „Just Throw It“ není na Steamu – disclosure povinnost neplatí, ale AI assety nesou riziko nechráněnosti a reputační riziko; doporučuji AI jen pro koncepty/reference.

### Gaps
- Licence Free Texture Packer, Material Maker, Squoosh, oxipng, SVGO neověřeny čtením LICENSE souborů v této session (vysoká pravděpodobnost správnosti).
- Licence konkrétních packů Kenney/ambientCG ověřit na stránce každého assetu.
