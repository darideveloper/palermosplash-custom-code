## Why

The 5 clickable cake layer buttons are positioned with `vh` units (e.g. `bottom: 9vh`, `19.5vh`, etc.) anchored to the viewport. In Chrome DevTools' responsive simulator the layout looks correct, but on real devices the buttons land at the wrong Y coordinates relative to the visible cake. The misalignment is consistent across iOS Safari (portrait and landscape), Android Chrome, and any device whose system bars (status bar at the top, home indicator or 3-button nav at the bottom) plus the mobile URL bar shrink the *visible* viewport below the layout viewport. The cake image extends behind those system zones; the buttons are pinned to the layout viewport, so the visible cake is shorter than the cake the buttons are calibrated to, and the layer-to-button alignment breaks. There is no `safe-area-inset` or dynamic-viewport handling in the current CSS, and the buttons cannot be reliably tied to the cake from CSS alone because the cake is rendered in an Elementor HTML widget that lives outside this repo.

## What Changes

- Add a new JS-based positioning system that reads the cake image's `getBoundingClientRect()` after load and assigns each button an explicit `top` and `left` in pixels, using a per-orientation table of layer percentages. The cake image becomes the position reference; the viewport is no longer used for button placement.
- Add a small `LAYER_PERCENTAGES` constant in `palermo-cake.js` carrying the per-orientation percentages. A single table is shared by both `vertical` and `horizontal` entries because, after calibration on real devices, the same layer-to-cake-height ratios align the buttons in both orientations. The constant lives in JS, not CSS, so the percentages are tunable from a single file.
- In `positionButtons()`, the computed `top` is offset by `± buttonHeight / 2` so the button's center, not its top edge, lands on the layer's Y coordinate. The sign of the offset is keyed to orientation: `+ buttonHeight / 2` in vertical mode, `- buttonHeight / 2` in horizontal mode.
- The cake image is resolved by a `getCakeImage()` helper that prefers the `<img>` inside the `#main-cake` Elementor widget, and falls back to the first `<img>` child of `#cake-parts` that is not inside a `.glow` element or an element whose id starts with `glow-`. If neither candidate exists, the function returns `null` and positioning is skipped.
- Wire the new positioning to `window.load` (initial placement once the cake image has its final size), `window.resize` (debounced via `requestAnimationFrame` coalescing), the existing orientation-change path (`updateOrientation()`), and a `ResizeObserver` on the cake image (guarded by a `typeof ResizeObserver !== 'undefined'` check). An additional `positionButtons()` call runs once at the end of the `DOMContentLoaded` callback, after the 5 buttons are appended to `<body>`, so buttons are positioned before the popup is created.
- Keep the existing `bottom: <vh>` rules in `palermo-cake.css` as a fallback for the brief moment between `DOMContentLoaded` and the first `positionButtons()` run, so a slow image load never shows buttons at the new top-but-unpositioned coordinate. Once positioned, the inline `style.top` / `style.left` take over.
- No CSS structural changes, no Elementor HTML edits, no popup changes, no data-file changes.

## Capabilities

### New Capabilities
- `cake-button-tracking`: positions the 5 layer buttons by reading the cake image's rendered bounding rect and placing each button at a percentage of the cake's height, shifted vertically by half the button's height so the button center lands on the layer center. The system is orientation-aware and recomputes on resize, orientation change, and cake-size change. The cake image is the only positioning reference; viewport units no longer determine button Y.

### Modified Capabilities
- `clickable-zones`: the "Existing positioning rules are unchanged" requirement and the per-orientation `vh` scenario pins become *fallback* values, not the authoritative positioning. A new requirement mandates that buttons SHALL be positioned to track the cake image's rendered rect, expressed as a percentage of the cake's height, with orientation-specific percentage tables.
- `cake-visual`: a new requirement makes the cake image the position reference for clickable zones. Buttons SHALL NOT be positioned relative to the viewport.

## Impact

- `palermo-cake/palermo-cake.js` — add `LAYER_PERCENTAGES` constant, `getCakeImage()` helper, `positionButtons()` function, debounced `resize` handler, `ResizeObserver` on the cake image, re-trigger from `updateOrientation()`, and a final `positionButtons()` call after the buttons are appended. No removal of existing behavior.
- `palermo-cake/palermo-cake.css` — no rule changes. Existing `bottom: <vh>` rules remain as fallback.
- `palermo-cake/palermo-cake-data.js` — no changes.
- Elementor HTML widget (out of this repo) — no changes.
- `functions.php` (out of this repo) — no changes.
- Popup code (`palermo-cake.js:131-140`) — unaffected; it already uses `getBoundingClientRect()` and the new cake-anchored button coordinates will feed it the correct Y automatically.
