## 1. Generate per-layer text images

- [x] 1.1 Split original single text composite image into 5 individual text images (`text-1.webp` through `text-5.webp`)
- [x] 1.2 Upload each text image to WP media library
- [x] 1.3 Replace the single `full-texts.webp` reference with 5 individual text elements in the HTML

## 2. CSS: Base text styling

- [x] 2.1 Replace old `.texts` rule with new `.text` rule: `mix-blend-mode: color-burn; z-index: 2; opacity: 0.8`
- [x] 2.2 Add `.text.over` rule: `mix-blend-mode: darken; z-index: 4; opacity: 0; transition: all 1s ease-in-out; pointer-events: none`
- [x] 2.3 Add `.text.over.visible` rule: `opacity: 1`

## 3. CSS: Remove glow animation

- [x] 3.1 Remove `animation: zoomer 2s linear infinite` from `#cake-parts .glow.visible img`

## 4. CSS: Cleanup dead code

- [x] 4.1 Remove all commented-out CSS blocks from `palermo-cake.css`

## 5. JS: Text duplication

- [x] 5.1 After orientation detection, add loop: `document.querySelectorAll('.text')` → `cloneNode(true)` each
- [x] 5.2 For each clone, append `-over` to original ID, add class `over`, insert after original in DOM

## 6. JS: Unified hover handler

- [x] 6.1 In the button generation loop, add query for `#text-{i}-over` alongside existing `#glow-{i}` query
- [x] 6.2 Create unified `toggleVisibility` function that toggles `.visible` on both elements
- [x] 6.3 Replace separate `mouseenter`/`mouseleave` handlers with single `toggleVisibility` for both events

## 7. JS: Cleanup

- [x] 7.1 Remove commented-out code and redundant comments from JS file
