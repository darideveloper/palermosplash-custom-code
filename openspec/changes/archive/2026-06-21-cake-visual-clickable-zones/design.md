## Context

Palermo Splash homepage uses Elementor for page building. Custom CSS/JS is added per-feature as standalone file pairs (`.css` + `.js`) prefixed with `palermo-`. No build tools or npm. Assets (cake images, glow effect images) are hosted in WP media library. This feature adds an interactive cake visual as the hero section.

The original hero was an AI-generated image hardcoded directly into the website with unoptimized, chaotic code. That implementation was deleted entirely — nothing was reusable. The new version splits the original AI design into individual component parts (main cake, background, each text label, per-layer glow effects) for easier positioning, optimization, and maintainability. All resources were converted to WebP and compressed. Images are hosted directly in WP media library to avoid server downtime and network errors from external sources.

## Goals / Non-Goals

**Goals:**
- Fixed-position cake image at viewport bottom, responsive to orientation (landscape vs portrait)
- 5 invisible clickable zones overlaid on cake layers, positioned via CSS
- Glow effect layers that animate on hover over each clickable zone
- Orientation detection via JS that toggles `.horizontal`/`.vertical` classes on `<body>`
- All CSS selectors prefixed with `.palermo-` (via parent container class) to avoid Elementor conflicts
- No-scroll full-viewport layout with `.horizontal`/`.vertical` orientation classes — prevents UI overflow and bad UX on any screen size

**Non-Goals:**
- Navigation/URL routing — clickable zones will link to WP pages (handled in Elementor or HTML)
- Backend changes — no PHP modifications in this change
- Image assets — images are separately uploaded to WP media library
- Enqueue logic — handled outside this repo (child theme or custom plugin)

## Decisions

| Decision | Choice | Rationale |
|---|---|---|---|
| Asset sourcing | Split AI image into separate component parts (main cake, bg, texts, per-layer glows) | Original AI design was a single raster image; splitting enables independent positioning, responsiveness, and selective glow animation per layer — most efficient approach |
| Image format | WebP with compression | Modern format reduces file size significantly vs PNG/JPEG; maintains visual quality for the cake illustration |
| Asset hosting | WP media library (not repo or CDN) | Avoids server downtime, network errors, and external dependency; WP Engine serves media reliably |
| Layout approach | Two orientation variants (`.horizontal`/`.vertical`) with no-scroll full-viewport | Eliminates UI overflow and scroll jank; provides stylish full-screen experience on any device |
| Positioning strategy | Fixed positioning with viewport-relative units (vh/vw) | Cake must span full viewport bottom regardless of page content; no dependency on Elementor layout containers |
| Orientation detection | JS `window.innerWidth` vs `window.innerHeight` at load + resize | Simple, no external dependencies; CSS handles layout per class |
| 5 buttons | 5 separate zones per business lines | Matches 5 order paths (Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes) |
| Hover zones | Invisible `div` squares positioned over specific cake layers | Clean separation of hit areas from visual elements; responsive positioning via viewport units adapts to any screen size |
| Hover glow | CSS class toggle via JS `mouseenter/mouseleave` | Cleaner than CSS-only `:hover` on overlapping elements; glow effects can use CSS keyframe animations |
| Glow numbering | `#glow-N` elements mirror `#button-N` IDs | 1:1 mapping by index, simple JS loop, no complex data binding needed |
| Code footprint | 2 files only (CSS + JS) | Minimal surface area; easy to maintain and extend in future if needed |

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Fixed positioning overlaps other page content | Cake container scoped to landing page only via Elementor body class |
| Viewport unit positioning varies across screen ratios | `.horizontal`/`.vertical` classes provide separate positioning sets for landscape vs portrait |
| Images not in repo → link rot if WP media URLs change | Document image URLs in deployment notes; use WP media library attachment IDs where possible |
| Glow images may not load instantly | CSS `transition: opacity 1s` provides graceful reveal; preload via `<link rel=preload>` in page head |
| Old hardcoded implementation was deleted entirely | Clean slate — no legacy conflicts; but any site-wide Elementor changes that affected old markup are irrelevant since this is a fresh build |
