## Why

The current cake visual renders 5 empty clickable `<div>`s over the cake illustration. There is no visible affordance — users cannot tell what each layer represents until they hover and see the existing text-image overlay. The text labels are baked into WebP images, so they cannot be restyled, translated, or augmented. There is no per-layer content beyond the text image, and there is no path to a modal/expanded view in the future.

This change adds visible per-layer affordance (icon + short name), introduces a structured data source for each layer (full name, description, destination URL, and open-in-new-tab behavior), and introduces a click-based popup that shows the detailed layer info. The popup is positioned contextually (right rail in landscape, bottom sheet in portrait) and lays the groundwork for a future modal without committing to a full modal implementation now.

## What Changes

- **Add** a new global data source `PALERMO_CAKE_DATA` in a dedicated file `palermo-cake/palermo-cake-data.js`, uploaded to WordPress and enqueued in `<head>` so it is available synchronously to `palermo-cake.js`. The data file ships with real per-layer content (icon, fullName, description, url) for all 5 layers; the structural contract is exercised end-to-end from the first deploy.
- **Create** the 5 layer buttons dynamically in JS (one `<div class="cake-button" id="button-N">` per layer, appended to `<body>`), populate them with an icon and short name from `PALERMO_CAKE_DATA[i-1]`, and attach hover + click listeners. This replaces the original pattern of pre-existing placeholder divs in the Elementor HTML.
- **Replace** the hover→glow-and-text-overlay handler with a click-based interaction: clicking a layer button opens a popup with that layer's full info (icon, full name, description, "Explore" button linking to the layer's URL). The popup stays open until the user clicks another layer button or clicks outside the popup.
- **Keep** the hover→glow behavior on each layer (independent of popup state, so glow remains a visual discovery aid).
- **Add** a hover scale (1.05) on the button's icon and label elements, giving a subtle visual cue that the button is interactive.
- **Apply** `mix-blend-mode: color-burn` to `.cake-button` (not the children) so the text and icon inside the button visually integrate with the cake illustration beneath them, producing an effect as if the text is burned into the cake layer. The blend mode is on the parent so it correctly reaches the cake behind the button in the stacking context.
- **Remove** the text image elements (`#text-1` through `#text-5`) and the JS duplication logic that created `#text-N-over` clones, plus the `.text` / `.text.over` / `.text.over.visible` CSS rules. The glow overlay alone is enough visual feedback.
- **Add** a slide + fade transition to the popup (slide from right in landscape, slide up from bottom in portrait).
- **Add** an active visual state to the clicked button (class `is-active` with scale 1.05).
- **Add** per-layer `targetBlank` field in the data, defaulting to `true`, controlling whether the "Explore" link opens in a new tab.
- **Bound** the popup's height with `max-height: 80vh` (landscape) and `60vh` (portrait), with internal scroll on overflow, so long descriptions and small viewports do not cover the cake.

## Capabilities

### New Capabilities

- `layer-data`: New dedicated data file `palermo-cake/palermo-cake-data.js` exposing a global `PALERMO_CAKE_DATA` array. Each entry holds `id`, UTF-8 `icon`, `shortName`, `fullName`, `description`, `url`, and `targetBlank` (defaults to `true`). Entries are ordered top-to-bottom (Custom Cakes, 365 Online Shop, Ready to Order, Wholesale, Cafe) for readability; the runtime maps entries to buttons by `id` (not by array index), so `button-1` still corresponds to the bottom layer (Cafe, `id: 1`). The file ships with real content populated for all 5 layers; future content edits are made in this single file.

- `layer-info-popup`: New popup system built on a single popup element appended to `<body>`. The popup renders the active layer's icon, full name, description, and an "Explore" anchor. State tracks `activeLayerId` (null or 1..5). Clicking a layer button either opens the popup (if no popup is open) or closes-then-opens it (if another layer is active). Clicking outside the popup and outside any layer button closes the popup. In landscape, the popup is fixed on the right and its vertical center aligns with the active layer's button. In portrait, the popup is fixed at the bottom, full width, with content-based height. The popup uses a slide + fade transition (slide from right in landscape, from bottom in portrait). The clicked button receives an active state (scale 1.05).

### Modified Capabilities

- `clickable-zones`: The hover behavior on each `.cake-button` is reduced to toggling the `.visible` class only on the corresponding `#glow-N` element (the simultaneous toggling on `#text-N-over` is removed). A new requirement is added for button content: each `.cake-button` SHALL render an icon and short name inside, populated from `PALERMO_CAKE_DATA[i-1]`. The `.cake-button` container SHALL use `mix-blend-mode: color-burn` so the text and icon blend with the cake illustration behind the button. Another new requirement adds the `is-active` class to the clicked button when its popup is open, and removes it from any previously active button. Another new requirement scales the icon and label by 1.05 on hover for a subtle interactive cue. The buttons themselves are created dynamically in JS (appended to `<body>`), not pre-existing in the Elementor HTML. The existing requirements for per-orientation positioning are unchanged.

- `text-hover-overlay`: All existing requirements are removed. The text image elements and the JS cloning logic that generated overlay duplicates are discontinued in favor of data-driven rendered text on the buttons. The glow overlay (a sibling feature) is not affected by this change and remains governed by `cake-visual`.

## Impact

- `palermo-cake/palermo-cake.js` — replace the hover→glow-and-text handler with: dynamic button creation (one `<div class="cake-button" id="button-N">` per layer appended to `<body>`), button content rendering (icon + shortName), a state variable for the active layer, click handlers (open / close-then-open), a click-outside handler, and popup positioning logic. The orientation detection and the existing resize listener are unchanged.
- `palermo-cake/palermo-cake.css` — remove the `.text`, `.text.over`, and `.text.over.visible` rule blocks. Add `mix-blend-mode: color-burn` to `.cake-button` (parent) so the text and icon inside blend with the cake illustration. Add styling for button content (`.palermo-btn-icon`, `.palermo-btn-label`) with a hover scale (1.05). Add a new `.palermo-popup` rule block with orientation-specific positioning (`.palermo-popup.horizontal` on the right rail, `.palermo-popup.vertical` as a bottom sheet), a `.palermo-popup.open` state with slide + fade transition, content blocks (`.palermo-popup-icon`, `.palermo-popup-title`, `.palermo-popup-desc`, `.palermo-popup-btn`), an `.is-active` state on `.cake-button` (scale 1.05), and `max-height` / `overflow-y: auto` rules for popup overflow.
- `palermo-cake/palermo-cake-data.js` — new file. Plain global `const PALERMO_CAKE_DATA = [...]` with 5 entries (real content populated), no module syntax (no build pipeline available).

### External changes required (NOT in this repo)

These changes live in the WordPress install and must be applied in addition to the code in this repo. The feature is not live until they are done.

- **Elementor HTML (cake parts container)** — remove the `<img>` elements with IDs `text-1`, `text-2`, `text-3`, `text-4`, `text-5`. Keep `#glow-1` through `#glow-5`, `#logo`, the base background `<img>`, and the main cake `<img>`. The buttons (`#button-1`..`#button-5`) are created dynamically in JS and do NOT need to be in the HTML.
- **`functions.php` (child theme)** — add a `wp_enqueue_script` call for `palermo-cake-data.js` in the `<head>` (footer = false), listed as a dependency of `palermo-cake.js` so the global is always available before the main script runs.

### Constraints and out-of-scope

- No build tools, no npm, no server-side file writes. WP Engine hosting constraints are preserved.
- No new third-party libraries. No accessibility work (role/focus/reduced-motion) in this change — that is intentionally deferred to a later change once the modal interaction is fully designed.
