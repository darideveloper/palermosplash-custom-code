## 1. CSS — brand logo styles

- [x] 1.1 Add `/* main cake layout */` section comment at the top of `palermo-cake/palermo-cake.css` to mark the file's primary section
- [x] 1.2 Append a `/* brand logo */` section comment before the new rule block in `palermo-cake/palermo-cake.css`
- [x] 1.3 Add `#logo img` rule block with `width: 200px; height: auto;` for fixed-size aspect-preserving display
- [x] 1.4 Add `position: fixed; top: 15px; right: 15px;` to pin the logo to the top-right of the viewport
- [x] 1.5 Add `z-index: -1;` so the logo sits behind all interactive layers and never blocks clicks
- [x] 1.6 Add `mix-blend-mode: overlay;` to integrate the logo with the illustrated background

## 2. Verification

- [x] 2.1 Confirm `palermo-cake/palermo-cake.css` parses (no syntax errors) and the file diff matches the spec (`+12` lines: 1 top section comment + 1 blank line + 1 brand-logo comment + 9 rule lines)
- [x] 2.2 Confirm no other files were modified (HTML, JS, PHP untouched; no new assets added to repo)
- [x] 2.3 Confirm existing cake parts, clickable zones, and text hover overlays remain unaffected (no selector overlap, no z-index collisions with `#logo img`)
