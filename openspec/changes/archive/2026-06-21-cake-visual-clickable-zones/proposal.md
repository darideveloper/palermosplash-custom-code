## Why

The homepage needs an engaging, interactive hero section that showcases Palermo Splash's cake offerings. A static cake image lacks user engagement — visitors should be able to visually explore cake layers and discover links to different order paths (Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes). Interactive product exploration increases time-on-page and conversion to order pages.

The original hero was an AI-generated image inserted directly into the website via hardcoded, unoptimized, and chaotic code. That implementation was scrapped entirely — it could not be reused. Everything was rewritten from scratch with clean, maintainable, optimized code and assets.

## What Changes

- **Scrap old implementation**: Original AI-generated design was hardcoded, unoptimized, and chaotic — deleted entirely, no reuse
- **Split AI design into separate resources**: The original AI-generated image was decomposed into individual component parts for easier positioning and optimization:
  - Main cake body
  - Background image
  - Each text label as standalone element
  - Separate glow effect image per cake layer
- **Assets optimized**: All resources converted to WebP format and compressed; uploaded directly to WP media library (not in repo) to avoid server downtime or network errors
- **Add `palermo-cake/palermo-cake.css`** — CSS styles for the cake visual component: fixed-position cake image spanning viewport bottom, 5 clickable zone buttons overlaid on cake layers, glow animation effects on hover, and responsive layout via `.horizontal`/`.vertical` orientation classes. Two layout versions (vertical/horizontal) provide a stylish no-scroll full-viewport experience, preventing UI overflow and bad UX across all screen sizes
- **Add `palermo-cake/palermo-cake.js`** — JavaScript behavior: viewport orientation detection (adds `.horizontal`/`.vertical` to `<body>`), dynamic creation of 5 `.cake-button` divs, mouseenter/mouseleave event handlers to toggle `.visible` class on corresponding `#glow-N` elements for hover glow effects
- **Simplified to 2 files**: CSS + JS only; no additional files required currently (extensible in future)
- Update `.gitignore` — add `backups` to ignored entries

## Capabilities

### New Capabilities

- `cake-visual`: Illustrated cake component with fixed-position image, orientation-aware responsive layout, and glow overlay effects
- `clickable-zones`: Five invisible clickable areas overlaid on cake layers that glow on hover and navigate to separate order pages

### Modified Capabilities

*(none — first spec-driven change in this project)*

## Impact

- New files: `palermo-cake/palermo-cake.css`, `palermo-cake/palermo-cake.js`
- Modified file: `.gitignore` (add `backups` entry)
- Enqueued via child theme `functions.php` or custom plugin (outside repo)
- No breaking changes to existing pages or Elementor components
- Asset images hosted in WP media library (not in repo) — uploaded directly to avoid server downtime and network errors
- Hover zones implemented as invisible `div` squares positioned over specific cake layers, adapted to responsive layout and any screen size
