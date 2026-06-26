## 1. Constants and helpers in `palermo-cake.js`

- [x] 1.1 Add a `LAYER_PERCENTAGES` constant near the top of the `DOMContentLoaded` callback with two keys (`vertical`, `horizontal`) that currently carry the same calibrated values: `{ vertical: { 1: 0.93, 2: 0.78, 3: 0.61, 4: 0.44, 5: 0.27 }, horizontal: { 1: 0.93, 2: 0.78, 3: 0.61, 4: 0.44, 5: 0.27 } }`.
- [x] 1.2 Add a `getCakeImage()` helper that prefers the `<img>` inside the `#main-cake` Elementor widget; if absent, falls back to the first `<img>` child of `#cake-parts` that is not inside a `.glow` element and not inside an element whose id starts with `glow-`. Returns `null` if no candidate is found.

## 2. `positionButtons()` implementation

- [x] 2.1 Implement a `positionButtons()` function that: calls `getCakeImage()`; if null, returns early; otherwise reads `getBoundingClientRect()`; if `rect.height === 0`, returns early; otherwise, for each button 1..5, reads `LAYER_PERCENTAGES[currentOrientation][i]`, computes `layerY = rect.top + rect.height * pct`, computes `topValue = layerY + btnRect.height / 2` in vertical mode or `layerY - btnRect.height / 2` in horizontal mode, and sets `btn.style.top` to `${topValue}px`, `btn.style.left` to `${rect.left + rect.width / 2}px`, and clears `btn.style.bottom` to `auto`.
- [x] 2.2 Make `positionButtons()` resolve the current orientation by checking `targetElement.classList.contains('horizontal')` (use `horizontal` table when true, `vertical` table when false).
- [x] 2.3 Guard against zero-height cake (image not yet laid out): if `rect.height === 0`, return early without modifying any button.
- [x] 2.4 Guard against missing buttons: if `document.getElementById('button-N')` returns null, skip that index and continue with the next.
- [x] 2.5 Apply the `± buttonHeight / 2` vertical offset so the button *center* lands on the layer Y; the sign is keyed off the current orientation class.

## 3. Trigger wiring

- [x] 3.1 Call `positionButtons()` from `window.addEventListener('load', ...)` so the initial placement waits for the cake image to have its final size.
- [x] 3.2 Add a rAF-coalesced `resize` handler: a module-level `resizeRafId` variable; on `resize`, if `resizeRafId` is unset, request a frame that calls `updateOrientation()` and clears `resizeRafId`. `updateOrientation()` itself calls `positionButtons()`.
- [x] 3.3 Call `positionButtons()` from inside `updateOrientation()` (after the class toggle) so the orientation-specific table is applied immediately.
- [x] 3.4 Create a `ResizeObserver` on the cake image (only when `typeof ResizeObserver !== 'undefined'`); the callback calls `positionButtons()`.
- [x] 3.5 Add a final explicit `positionButtons()` call at the end of the `DOMContentLoaded` callback, after the 5 buttons are appended to `<body>`, so buttons are positioned before the popup is created and any popup-open logic can read button rects.

## 4. Verify in DevTools (regression check)

- [x] 4.1 Open Chrome DevTools, set the responsive simulator to iPhone 13 Pro (portrait) and confirm the buttons align with the cake layers as before this change.
- [x] 4.2 Switch to landscape orientation in the responsive simulator and confirm the buttons align with the cake layers as before this change.
- [x] 4.3 Switch to a tablet profile (e.g. iPad) and confirm the layout still aligns.
- [x] 4.4 Open the page in a desktop browser window and confirm the layout aligns (the change is no-op or matching on desktop because no system bars exist).

## 5. Verify on real devices

- [x] 5.1 On a real iPhone in portrait Safari, hard refresh and confirm all 5 buttons align with the visible cake layers.
- [x] 5.2 On a real iPhone in landscape Safari, hard refresh and confirm all 5 buttons align with the visible cake layers (this is the worst case per the design).
- [x] 5.3 On a real Android phone in Chrome, hard refresh in both portrait and landscape and confirm alignment.
- [x] 5.4 On each device, scroll the page to trigger URL-bar collapse; confirm the buttons stay aligned (the rAF-coalesced `resize` handler should re-anchor them).

## 6. Tune layer percentages (only if needed)

- [x] 6.1 If a button is off by more than ~2% of cake height on any device, edit the corresponding number in `LAYER_PERCENTAGES` and hard refresh. Repeat per device until aligned.

## 7. Final check

- [x] 7.1 `git diff` shows changes only in `palermo-cake.js`. No CSS, no HTML, no PHP, no data-file changes.
- [x] 7.2 The popup in vertical mode (bottom sheet) still works as before (it already uses `getBoundingClientRect()` on the button, which now reflects the new tracked Y).
- [x] 7.3 The hover glow still appears on the right layer for each button (the `glowElement` lookup by id is unchanged).
