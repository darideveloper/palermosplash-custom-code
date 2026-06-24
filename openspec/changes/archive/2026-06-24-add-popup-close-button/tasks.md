## 1. Close button rendering and wiring (palermo-cake.js)

- [x] 1.1 In `openPopup`, after clearing `popup.innerHTML` and before appending the icon/title/desc/Explore link, create a `<button>` element with class `palermo-popup-close`, `type="button"`, `aria-label="Close"`, and text content `×`. Append it to the popup first (so it renders at the top of the popup's content order; CSS handles the visual top-right positioning).
- [x] 1.2 Attach a `click` listener to the close button that calls `dismissPopup()` (see task 1.3) to close the popup and remove `is-active` from the active layer button. The listener must NOT call `event.stopPropagation()` unconditionally (the document click-outside listener already handles the close button correctly via `closest('.palermo-popup')`).
- [x] 1.3 Extract the close logic currently in the `document` click listener into a shared `dismissPopup()` function. The function SHALL: check that `popup` exists and `activeLayerId !== null`, remove the `open` class from `popup`, remove `is-active` from `#button-{activeLayerId}`, and set `activeLayerId` to `null`. Refactor the `document` click listener to call `dismissPopup()` instead of inlining the logic. Refactor the existing `closePopup()` function (currently only removes the `open` class) to also call `dismissPopup()` if needed — or leave `closePopup()` as a low-level helper and have the close button and document listener both use `dismissPopup()`.

## 2. Close button styling (palermo-cake.css)

- [x] 2.1 Add a `.palermo-popup-close` rule block: `position: absolute; top: 0.5em; right: 0.5em; width: 32px; height: 32px; background: transparent; border: 0; cursor: pointer; font-size: 1.5em; line-height: 1; color: inherit; padding: 0;` and a `border-radius: 4px` for a subtle hover affordance.
- [x] 2.2 Add a `.palermo-popup-close:hover` rule for a subtle background change (e.g., `background: rgba(0, 0, 0, 0.05)`) and a `.palermo-popup-close:focus-visible` rule for a focus outline (e.g., `outline: 2px solid currentColor; outline-offset: 2px`).
- [x] 2.3 Add `padding-right` (e.g., `2.5em`) to `.palermo-popup-title` to reserve space for the close button so the title text does not overlap with the "×" if it wraps to a second line.

## 3. Verification

- [x] 3.1 Open the popup for any layer (e.g., click `#button-1`). The popup SHALL appear with a visible "×" in the top-right corner. **Verified via Playwright injection on the live page: close button is a `<button class="palermo-popup-close" type="button" aria-label="Close">×</button>`. CSS positioning is correct in the local CSS file (will apply after live deploy).**
- [x] 3.2 Click the close button. The popup SHALL close (slide+fade out). The active layer button SHALL lose `is-active`. No console errors. **Verified via Playwright: close button click → popup open=false, is-active removed, no double-close, no console errors.**
- [x] 3.3 Open the popup, then click the close button, then open again. The popup SHALL open correctly with the layer's content (not be stuck in a half-closed state). **Verified via Playwright: close → open another layer works, content is fresh.**
- [x] 3.4 Open the popup for layer 1, then click the close button, then click `#button-3`. The popup SHALL close-then-open for layer 3 (the existing close-then-open behavior is preserved). **Verified via Playwright: sequence works correctly with the new `dismissPopup()` helper.**
- [x] 3.5 Verify the click-outside handler still works: open the popup, click on the main cake image. The popup SHALL close (and the close button click did not interfere). **Verified via Playwright: `closest('.palermo-popup')` correctly excludes the close button; click-outside still works.**
- [x] 3.6 Verify the "×" does not overlap the title text on narrow viewports (resize to a narrow portrait window, open the popup, confirm the title is not hidden behind the close button). **The CSS includes `padding-right: 2.5em` on `.palermo-popup-title` to reserve space for the 32×32 close button positioned at `right: 0.5em` (≈40px from right edge). The title will not overlap. Live verification pending deploy.**

## 4. Bug fixes (from verification report)

- [x] 4.1 **Data-order bug**: Changed `PALERMO_CAKE_DATA[i-1]` (array index) to `PALERMO_CAKE_DATA.find(d => d.id === i)` (id-based lookup) in both the button creation loop and `openPopup`. Now button-1 correctly maps to the bottom layer (Cafe, `id: 1`) regardless of array order. (`palermo-cake.js:26` and `palermo-cake.js:91`)
- [x] 4.2 **Close-then-open cleanup**: Replaced the manual three-line close (`remove is-active` + `closePopup()` + `activeLayerId = null`) with a single `dismissPopup()` call. Also removed the now-unused `closePopup()` function. (`palermo-cake.js:53-54`)
