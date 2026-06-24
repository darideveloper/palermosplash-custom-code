## Why

The layer info popup currently closes only by clicking outside it or by clicking another layer button. There is no explicit, discoverable way to dismiss the popup from inside it. On touch devices and for users who instinctively look for a close affordance inside a panel, this is a missing escape hatch.

## What Changes

- **Add** a close button (an "X" icon) inside the popup, positioned in the top-right corner.
- **Wire** the close button to the existing close flow: removing `.open` from the popup and `.is-active` from the active layer button, and resetting `activeLayerId` to `null`.
- **Style** the close button so it is visible and clickable but does not compete visually with the "Explore" CTA.
- **Update** the existing `layer-info-popup` capability to document the new close affordance.

The close button complements (does not replace) the existing click-outside and click-another-button close behaviors. All three ways to close the popup continue to work.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `layer-info-popup`: A new requirement is added specifying that the popup SHALL contain a close button (an "X" element) positioned in the top-right corner. Clicking the close button SHALL close the popup and remove the `is-active` class from the active layer button, with the same effect as clicking outside the popup or clicking another layer button.

## Impact

- `palermo-cake/palermo-cake.js` — when building the popup content in `openPopup`, add a close button element (created via `document.createElement('button')` to keep DOM-API construction consistent with the rest of the popup). Attach a `click` listener that invokes the same close logic used by the click-outside handler.
- `palermo-cake/palermo-cake.css` — add a `.palermo-popup-close` rule block for the close button (positioned absolutely in the top-right of the popup, sized as a square hit area, styled as a subtle "X"). Add `position: relative` to `.palermo-popup` so the absolute-positioned close button anchors to the popup (the popup is currently `position: fixed`, so absolute children already anchor to it — verify during implementation).
- `palermo-cake/palermo-cake.js` (no structural changes) — the existing `closePopup` function and the click-outside document listener already implement the close logic; the close button reuses the same code path.
- No new dependencies, no new files. The close button is data-free (always rendered the same way for every layer).
- No external changes (Elementor HTML, functions.php enqueue) needed — the popup is created entirely in JS.
- Out of scope: keyboard shortcuts (Escape to close), focus management (auto-focus the close button on open). These remain deferred to a future accessibility-focused change.
