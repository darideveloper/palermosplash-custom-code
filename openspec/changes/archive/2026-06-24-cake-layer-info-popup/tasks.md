## 1. Data file

- [x] 1.1 Create `palermo-cake/palermo-cake-data.js` with the global `PALERMO_CAKE_DATA` array. 5 entries with real content (icon, shortName, fullName, description, url). Entries are ordered top-to-bottom (Custom Cakes first, Cafe last); the runtime maps entries to buttons by `id`, not by array index.

  Final content (for reference):
  - `id: 1` (Cafe) — ☕ — "The Café"
  - `id: 2` (Wholesale) — 📦 — "Wholesale"
  - `id: 3` (Ready to Order) — 🛒 — "Ready to Order"
  - `id: 4` (365 Online Shop) — 🛍️ — "365 Online Shop"
  - `id: 5` (Custom Cakes) — 🎂 — "Custom Cakes"

  All URLs point to `https://ccdev2026.wpenginepowered.com/<shortName-kebab>`. `targetBlank` is omitted on all entries to exercise the default (`true`).

- [x] 1.2 Real content populated for all 5 layers.
- [ ] 1.3 Enqueue the data file in `functions.php` (child theme, out of this repo) with `wp_enqueue_script`, `$in_footer = false` (load in `<head>`), and declare `palermo-cake.js` as depending on the data file's handle. **(out of this repo)**

## 2. Button creation, content, and hover behavior (palermo-cake.js)

- [x] 2.1 Add a guard at the top of the main script: if `typeof PALERMO_CAKE_DATA === 'undefined'`, log a warning and skip button creation without throwing, so a missing data file does not break the page.
- [x] 2.2 In the button-creation loop, create each `.cake-button` dynamically with `document.createElement('div')`, set `id="button-${i}"` and class `cake-button`, populate with an icon element and a label element using `PALERMO_CAKE_DATA[i-1].icon` and `PALERMO_CAKE_DATA[i-1].shortName`, then append to `<body>`.
- [x] 2.3 Attach `mouseenter` / `mouseleave` handlers that toggle `.visible` only on `#glow-N`. The text-overlay reference (`#text-N-over`) is removed entirely.

## 3. Popup state and click behavior (palermo-cake.js)

- [x] 3.1 Add a module-level `activeLayerId` variable initialized to `null` and a reference to a single popup element. Create the popup element once on `DOMContentLoaded` and append it to `<body>`; do not show it.
- [x] 3.2 Add a `click` listener on each `.cake-button`. Behavior:
  - If `activeLayerId === i` → no-op.
  - Else if `activeLayerId !== null` → close the popup first (remove `.open`, remove `.is-active` from the previous button, set `activeLayerId = null`), wait for the close transition to complete (or for a fixed delay matching the CSS `transition-duration`, 300ms), then open the popup for layer `i`.
  - Else → open the popup for layer `i`.
  - Guard against re-entry during the close-then-open transition via an `isTransitioning` flag.
- [x] 3.3 Add a single `document` `click` listener that closes the popup when the click target is not inside the popup and not a `.cake-button`. Use `event.target.closest('.palermo-popup, .cake-button')` to determine if the target is inside either.

## 4. Popup rendering and positioning (palermo-cake.js)

- [x] 4.1 When opening the popup, populate it with the active layer's `icon`, `fullName`, `description`, and an "Explore" anchor whose `href` is the entry's `url`. Set `target="_blank"` and `rel="noopener noreferrer"` if `targetBlank` is not explicitly `false`. Build content via DOM APIs (`createElement` + `textContent`), not `innerHTML`.
- [x] 4.2 When opening the popup in landscape (`<body>` has class `horizontal`), the CSS `.palermo-popup.horizontal` rule anchors the popup at `right: 0`; the JS only needs to set `top` so the popup's vertical center matches the active button's vertical center, read from `getBoundingClientRect()`.
- [x] 4.3 When opening the popup in portrait (`<body>` has class `vertical`), the CSS `.palermo-popup.vertical` rule anchors the popup at `bottom: 0; left: 0; width: 100vw`; the height is content-based (no fixed height in CSS). The JS clears `top` so the CSS rule applies.
- [x] 4.4 Toggle the `is-active` class on the clicked button and remove it from any previously active button.

## 5. CSS cleanup and additions (palermo-cake.css)

- [x] 5.1 Remove the rule blocks for `#cake-parts .text`, `#cake-parts .text.over`, and `#cake-parts .text.over.visible`.
- [x] 5.2 Add styles for the button content: `.palermo-btn-icon` and `.palermo-btn-label` inside `.cake-button`. Use a flex layout for `.cake-button` to keep icon and label on one line. Apply `mix-blend-mode: color-burn` to `.cake-button` (the parent) — NOT to the children — so the text blends with the cake illustration behind the button. Putting it on the children fails to reach the cake because they blend with the transparent button backdrop.
- [x] 5.3 Add an `.is-active` state for `.cake-button` with `transform: scale(1.05)`. Add `transition: transform` to `.cake-button` so the state animates smoothly.
- [x] 5.3b Add a `:hover` state for `.palermo-btn-icon` and `.palermo-btn-label` with `transform: scale(1.05)` and a `transition: transform 200ms ease` for a subtle interactive cue.
- [x] 5.4 Add a base `.palermo-popup` rule block with `position: fixed`, `z-index: 5` (above buttons), default `opacity: 0`, default `pointer-events: none`, and a `transition` for `opacity` and `transform`.
- [x] 5.5 Add `.palermo-popup.horizontal` (anchored at `right: 0`, hidden transform `translate(100%, -50%)`) and `.palermo-popup.vertical` (anchored at `bottom: 0; left: 0; width: 100vw`, hidden transform `translateY(100%)`) rules.
- [x] 5.6 Add `.palermo-popup.open` with `opacity: 1`, `pointer-events: auto`, and the final position transform (landscape: `translate(0, -50%)`; portrait: `translateY(0)`).
- [x] 5.7 Add `max-height` rules for popup overflow: `max-height: 80vh` in landscape, `max-height: 60vh` in portrait, with `overflow-y: auto` so content scrolls internally when it exceeds the cap.
- [x] 5.8 Add styles for popup internals: `.palermo-popup-icon`, `.palermo-popup-title`, `.palermo-popup-desc`, `.palermo-popup-btn` (the "Explore" anchor styled as a button, with its own hover state).

## 6. External changes (out of this repo)

- [ ] 6.1 In the Elementor HTML widget (cake parts container), remove the `<img>` elements with IDs `text-1`, `text-2`, `text-3`, `text-4`, `text-5`. Keep `#glow-1` through `#glow-5`, `#logo`, the base background `<img>`, and the main cake `<img>`. Do NOT add placeholder `#button-N` divs — the buttons are created dynamically in JS. **(out of this repo — must be done in WordPress admin)**
- [ ] 6.2 Confirm in the live page (after enqueue) that the data file loads before `palermo-cake.js` and that `PALERMO_CAKE_DATA` is defined on `window` before `DOMContentLoaded` fires. **(out of this repo — must be done in WordPress admin)**

## 7. Verification

- [ ] 7.1 Visual check: each `.cake-button` displays its icon and short name. The text image elements are gone; no broken images in the page. Buttons are created dynamically (not present in the source HTML). **(requires live WordPress deploy with Elementor HTML edits + enqueue done)**
- [ ] 7.2 Hover on any button: the corresponding `#glow-N` becomes visible. Mouseleave hides it. The icon and label inside the button scale up to 1.05 on hover. No text-overlay element receives `.visible` anymore. **(requires live deploy)**
- [ ] 7.3 Click a button: the popup appears on the right (landscape) or at the bottom (portrait) with the correct icon, full name, description, and "Explore" link. Verify the icon and label text on the button are blended with the cake via `color-burn` and that hovering scales them slightly. **(requires live deploy)**
- [ ] 7.4 Click a second, different button while the popup is open: the popup closes, then opens with the new layer's content. The previously clicked button loses its active state, the new one gains it. **(requires live deploy)**
- [ ] 7.5 Click the already-active button: nothing changes (no flicker, no close-then-open). **(requires live deploy)**
- [ ] 7.6 Click on the background (not the popup, not a button): the popup closes. The active button loses its active state. **(requires live deploy)**
- [ ] 7.7 Click "Explore" in the popup: the link opens in a new tab by default. Layers with `targetBlank: false` open in the same tab. **(requires live deploy)**
- [ ] 7.8 Resize the viewport from landscape to portrait while the popup is open: confirm the popup remains visible and repositioning is acceptable for this change (resize-aware repositioning is deferred). **(requires live deploy)**
