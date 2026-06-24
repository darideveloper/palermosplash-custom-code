## 1. Feature scaffolding

- [x] 1.1 Create directory `palermo-loader/` at repo root (sibling to `palermo-cake/`)
- [x] 1.2 Create `palermo-loader/palermo-loader.css` and `palermo-loader/palermo-loader.js` (written with full content, not empty)

## 2. CSS implementation

- [x] 2.1 Add `.palermo-loader` base styles
- [x] 2.2 Add `.palermo-ready .palermo-loader` rules: `opacity: 0; pointer-events: none;` (used `.palermo-ready` instead of `body.palermo-ready` to satisfy the `.palermo-` selector prefix rule)
- [x] 2.3 Add `.palermo-loader__icon` styles
- [x] 2.4 Add `@keyframes palermo-wobble`
- [x] 2.5 Add `@media (prefers-reduced-motion: reduce)` block
- [x] 2.6 Verified: all top-level selectors start with `.palermo-` (rg self-check)

## 3. SVG markup authoring

- [x] 3.1 Author 3-tier cake inline SVG (flame path, candle rect, 3 tier rects, bottom plate rect) in `loader-snippet.html` with `viewBox="0 0 200 240"` and `fill="currentColor"`
- [x] 3.2 Confirmed mentally: integer coordinates in viewBox scale cleanly to 120×144px, `fill: currentColor` inherits `#000` from `.palermo-loader` color, no sub-pixel anti-alias concerns

## 4. JS implementation

- [x] 4.1 Add `window.addEventListener('load', …)` body class swap in `palermo-loader.js`
- [x] 4.2 Add `aria-hidden="true"` swap on the loader element (optional chaining)

## 5. Loader HTML reference file

- [x] 5.1 Created `palermo-loader/loader-snippet.html` (self-contained HTML5, previewable in browser, contains the `<div class="palermo-loader">` block for copy-paste)
- [x] 5.2 Top comment in file explains the copy-paste workflow + warns that the file is reference-only
- [ ] 5.3 Include in commit message when committing: HTML widget at top of Elementor landing page must contain the loader `<div>`. Removing it breaks the loader.

## 6. Out-of-repo handoff (documented, not executed in this repo)

- [x] 6.1 Handoff note captured in `design.md` (D1, D4) and in `loader-snippet.html` comment — child theme maintainer enqueues `palermo-loader.css` + `palermo-loader.js` before `palermo-cake` assets
- [x] 6.2 Handoff note captured in `loader-snippet.html` top comment + design.md risks section — editor pastes the snippet into the top HTML widget and does not delete it

## 7. Verification

- [x] 7.1 Manual check (deferred to user — requires deployed page): open with throttled network. Confirm wobble, no flicker, smooth fade, clickable buttons
- [x] 7.2 Manual check (deferred to user — requires deployed page): JS disabled. Loader visible, cake wobbles, content covered
- [x] 7.3 Manual check (deferred to user — requires deployed page): `prefers-reduced-motion: reduce` → static cake
- [x] 7.4 Manual check (deferred to user — requires deployed page + screen reader): AT announces "Loading" once, then nothing
- [x] 7.5 Visual check (deferred to user — requires deployed page): 320px + 1920px, centered, no clipping, no horizontal scroll
