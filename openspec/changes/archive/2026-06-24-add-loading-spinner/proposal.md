## Why

Page paint shows the cake visual and clickable zones assembling from a stack of WebP layers. Between first paint and the moment `palermo-cake.js` finishes wiring hover/click targets, the user sees unstyled layers snap into place. This flicker kills the artisan-bakery feel. A pure-CSS loading overlay (cake icon, white background) bridges the gap with zero JavaScript blink.

## What Changes

- Add `palermo-loader/palermo-loader.css` — fixed fullscreen white overlay, centered 3-tier cake SVG that wobbles via `@keyframes`, `prefers-reduced-motion` aware, fades out when body has `palermo-ready` class.
- Add `palermo-loader/palermo-loader.js` — single listener on `window.load` that adds `palermo-ready` to `<body>`. No DOM mutation, no animation logic in JS.
- Add `palermo-loader/loader-snippet.html` — standalone reference file holding the exact `<div class="palermo-loader">…</div>` markup to paste into an Elementor HTML widget at the very top of the landing page. File is reference-only: not enqueued, not served by the page, just a copy-paste source for the editor. Loader sits in DOM at first paint, no JS dependency for visibility.
- Document enqueue order in child theme `functions.php` (loader assets before `palermo-cake` assets) — note lives in tasks; not a code change in this repo.

## Capabilities

### New Capabilities
- `loading-state`: governs the loader overlay behavior — when it renders, when it hides, accessibility role, and motion preferences. Spans the `palermo-loader` CSS+JS pair and the required HTML widget markup.

### Modified Capabilities
- (none) — existing `cake-visual`, `clickable-zones`, `text-hover-overlay` specs describe final-state behavior and stay untouched. Loader is pre-content scaffolding, not part of the cake feature surface.

## Impact

- New files only (`palermo-loader/palermo-loader.css`, `palermo-loader/palermo-loader.js`, `palermo-loader/loader-snippet.html`). No edits to existing `palermo-cake` files.
- Out-of-repo touch points (do not modify here, list for handoff):
  - Child theme `functions.php`: enqueue `palermo-loader.css` + `palermo-loader.js` before `palermo-cake` assets.
  - Elementor landing page: add HTML widget at the very top with the loader `<div>`.
- No new dependencies. No build step. No PHP in this repo.
- No breaking changes — feature is purely additive; with JS disabled the loader remains visible forever (acceptable fallback, see design.md mitigation).
