## Context

The 5 clickable cake layer buttons are positioned with CSS `bottom: <vh>` rules in `palermo-cake.css:62-104`. The cake image itself is `position: fixed; bottom: 0` (`palermo-cake.css:12-15`) and renders at `height: 90%` of body in vertical mode or `height: 100%` (i.e. `100vh`) in horizontal mode. In Chrome DevTools' responsive simulator the cake fills the layout viewport, the buttons land on the right Y, and the alignment looks correct. On real devices three forces conspire to break the alignment:

1. The status bar (top) and the home indicator / 3-button nav bar (bottom) overlay the visible area. The cake at `bottom: 0` extends behind the bottom system bar; the visible cake is shorter than the cake the buttons are calibrated to.
2. The mobile URL bar takes additional vertical pixels. When the URL bar collapses on scroll, the visible viewport grows, but `vh` values are stable in iOS Safari (large viewport) while Android Chrome's `vh` shrinks.
3. `100vh` is the *layout* viewport, not the *visible* viewport. The current code assumes a clean rectangular layout viewport with no system bars — only true in DevTools.

The cake image is in an Elementor HTML widget (out of this repo) and cannot be wrapped in a safe-area-respecting container from this codebase. The buttons are dynamically created in JS and appended to `<body>` (`palermo-cake.js:70`). The only positioning source we fully control is JavaScript. The cleanest fix is to anchor the buttons to the cake image's actual rendered bounding rect, computed at runtime.

## Goals / Non-Goals

**Goals:**
- Make the cake layer buttons align with the cake's visible layers on every real device and orientation, regardless of system bars, URL bar state, accessibility zoom, or custom user font size.
- Keep the change surgical: a single JS file, no CSS structural changes, no Elementor HTML edits, no `functions.php` edits.
- Preserve the current visual outcome in DevTools responsive simulator (no regression).
- Make the layer percentages easily tunable from a single JS constant.
- Keep the existing popup positioning logic working unchanged (it already reads `getBoundingClientRect()` from the button, so it inherits the corrected Y automatically).

**Non-Goals:**
- Refactoring the cake markup, moving the buttons into the Elementor HTML widget, or wrapping the cake in a `.palermo-stage` container.
- Touching the popup's safe-area positioning (user confirmed the popup is fine in the field).
- Changing the cake image, glow overlays, or the layer data file.
- Adding safe-area-inset CSS, `dvh` units, or any viewport-based fix (we anchor to the cake, not the viewport).
- Cross-browser polyfills, build tooling, or any new dependencies.

## Decisions

- **Anchoring source = `#main-cake > img`, with a fallback to `#cake-parts` children.** The Elementor HTML widget that holds the cake is identified by `id="main-cake"` and contains a single `<img>` (the visible cake illustration). `getCakeImage()` returns that `<img>` directly. If the `#main-cake` widget is not present in the current page (e.g. an alternate layout that only ships the `#cake-parts` container), `getCakeImage()` falls back to scanning the children of `#cake-parts` and returning the first `<img>` that is not inside a `.glow` element and not inside an element whose id starts with `glow-`. Glow images are decorative overlays; the cake is the one image that defines the layer positions. Anchoring to a wrapper element was considered and rejected because the Elementor HTML widget structure is out of our control.

- **Layer percentages live in a JS constant table, not CSS variables.** Two reasons. (1) The percentages need to be readable by the position function, and putting them in a JS table keeps them co-located with the function that uses them. (2) Tunable layer positions are part of the visual design, which is the JS file's domain in this codebase (per the `layer-data` capability pattern). Alternative considered: CSS custom properties on `:root` and read them via `getComputedStyle`. Rejected because reading custom properties is slower and the values are orientation-dependent (a 2D table is simpler in JS than a nested CSS-var scheme).

- **`LAYER_PERCENTAGES` is a 2-key table with identical vertical and horizontal entries.** After calibration on real devices, the same layer-to-cake-height ratios align the buttons in both orientations, so the `vertical` and `horizontal` entries are kept as separate keys (preserving the orientation-aware code path) but currently carry the same values: `{ 1: 0.93, 2: 0.78, 3: 0.61, 4: 0.44, 5: 0.27 }`. Keeping the two-key shape means a future calibration can diverge them without changing call sites or spec structure.

- **`top` is offset by `± buttonHeight / 2` so the button *center* lands on the layer Y.** The percentage table gives the Y coordinate of the layer center measured from the top of the cake. Buttons are positioned with `style.top`, which positions the button's *top edge*. To place the button center on the layer, the code adds half the button height in vertical mode and subtracts half the button height in horizontal mode. The sign is keyed off the current orientation class on `<body>`. Without this offset, the visual center of the button would sit half a button-height below (or above) the target layer, which is the kind of misalignment users actually feel.

- **Trigger points: `window.load`, debounced `resize`, `updateOrientation()`, `ResizeObserver` on the cake image, and a final `positionButtons()` call after the buttons are appended.**
  - `window.load` runs after all images (including the cake) have their final decoded size. This is the right hook for the initial positioning. `DOMContentLoaded` is too early — the cake image's intrinsic dimensions may not be known yet.
  - `resize` handles viewport changes, including device rotation on most browsers. Debounced via a single `requestAnimationFrame` request that coalesces multiple `resize` events in the same frame.
  - The existing `updateOrientation()` toggles the `horizontal` / `vertical` class on `<body>` and calls `positionButtons()` so the orientation-specific table is applied immediately.
  - A `ResizeObserver` on the cake image (created only when `ResizeObserver` is defined) catches cases where the cake's size changes without a window resize (e.g. an ancestor layout shift, a font-load reflow, an animation finishing). This is the safety net.
  - The final explicit `positionButtons()` call after the button-append loop guarantees that buttons have a tracked position before the popup is created and any popup-open logic can read button rects. Together with the other triggers it is idempotent and cheap.
  - Alternative considered: relying on `window.resize` alone. Rejected because some browser configurations (e.g. iOS Safari address-bar collapse without a window resize) and CSS-driven layout changes (e.g. a font load that reflows an ancestor) would not fire `resize` reliably.

- **Position math uses `getBoundingClientRect()` and `style.top` / `style.left`, not `style.bottom`.** Reason: when the buttons are anchored to the cake (which itself is `position: fixed`), expressing the button position as `top` + `left` of the cake's rect is straightforward and unambiguous. `bottom` plus a percent-of-cake-height would require an additional reference to the viewport bottom, which is exactly the coupling we are trying to break. The `left` of each button is `cakeRect.left + cakeRect.width / 2`, matching today's `left: 50%` and `transform: translateX(-50%)` centering.

- **Existing CSS `bottom: <vh>` rules remain in the stylesheet as fallback.** Reason: between `DOMContentLoaded` and `window.load` (the cake image decode window), the buttons need to be visible somewhere. Keeping the `vh` rules ensures a slow connection never shows buttons at `top: 0` waiting for JS to run. Once `positionButtons()` runs, the inline `style.top` / `style.left` take precedence and the `vh` rules are inert. The spec is updated so the `vh` rules are explicitly designated as fallback, not as the authoritative positioning contract.

- **No new dependencies, no build step.** Plain `getBoundingClientRect()` + `ResizeObserver` (universally supported in modern browsers; `ResizeObserver` is in iOS 13.4+ and Android Chrome 64+, both well below current market baselines). A `ResizeObserver` polyfill is not added; the few users on pre-2018 browsers will see buttons at the fallback `vh` positions, which is no worse than today.

- **Debounce strategy: rAF-coalesced, not setTimeout-throttled.** A single `requestAnimationFrame` request is set on `resize`; if a second `resize` arrives before the frame fires, the existing request is reused. This is cheaper and more visually smooth than a fixed 50ms throttle.

## Risks / Trade-offs

- [Buttons at fallback `vh` positions during the image-decode window] → the window is sub-second on most connections and the fallback positions match DevTools behavior, so the visual flash is small. The alternative (hiding buttons until positioned) introduces a longer flash on slow networks. Accepted as the lesser evil.

- [`getBoundingClientRect()` on an image with `height: 90%` returns layout viewport units, not visible viewport units] → on a device with a bottom system bar, the rect's `bottom` is below the home indicator and `height` is larger than the visible cake. This is exactly what we want: the percentages are applied to the *rendered* cake rect, so the buttons land on the same Y fraction of the cake regardless of whether part of the cake is behind the system bar. The user sees the visible portion of the cake with buttons correctly placed on it.

- [`ResizeObserver` not supported in very old browsers] → fallback to the `vh` rules. The pre-2018 browser share for a bakery landing page is negligible, and the fallback positions are no worse than today.

- [Layer percentages calibrated to the cake's actual layer art, not evenly spaced] → the JS table is in a clearly named constant. A visual check on a real device can shift any value by editing one number and hard-reloading.

- [Cake image resizes on font load or other async reflow] → the `ResizeObserver` catches this and re-positions. The frame the observer fires in may show briefly misaligned buttons (one frame at most). This is below the threshold of human perception in practice.

- [No automated visual-regression test in this repo] → verification is manual on real devices per the project's `AGENTS.md` "no test framework" constraint.

## Migration Plan

- Deploy `palermo-cake.js` only. No CSS, no HTML, no PHP changes.
- Hard refresh on a real iPhone (portrait and landscape) and Android Chrome to confirm alignment.
- If a layer is off by more than ~2% of cake height on any device, edit the corresponding number in the `LAYER_PERCENTAGES` table and hard refresh again. Repeat until aligned.
- Rollback: revert the single file. The fallback `vh` rules bring back the previous (DevTools-only) behavior, identical to today's pre-change state.
- No database migration, no cache flush required beyond standard WordPress asset cache.

## Open Questions

- None. The current proposal carries the minimum information needed to implement and verify. The layer percentages are the only tuning knob and live in a clearly named constant for easy adjustment.
