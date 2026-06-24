## 1. Add font import to cake CSS

- [x] 1.1 Add `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');` as the first non-comment line of `palermo-cake/palermo-cake.css` (above the existing `/* main cake layout */` comment)

## 2. Update button label typography

- [x] 2.1 In the `.palermo-btn-label` rule (~line 113), add `font-family: 'Dancing Script', cursive;`
- [x] 2.2 Change `font-size: 1.1em` to `font-size: 1.4em`
- [x] 2.3 Change `font-weight: 600` to `font-weight: 700`
- [x] 2.4 Remove the `text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);` declaration (verify in browser; if legibility on the cake illustration suffers, restore as `text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);`)
- [x] 2.5 Bump `line-height: 1` to `line-height: 1.15` to give Dancing Script's tall ascenders/descenders vertical breathing room inside the button (defensive — reduces risk of clipping on the live site without needing per-button `--btn-translate-y` adjustments)

## 3. Update popup title typography

- [x] 3.1 In the `.palermo-popup-title` rule (~line 180), add `font-family: 'Dancing Script', cursive;`
- [x] 3.2 Change `font-size: 1.25em` to `font-size: 1.8em`
- [x] 3.3 Keep `font-weight: 700` (already correct)

## 4. Add small-viewport safeguard

- [x] 4.1 Append a `@media (max-width: 480px)` block at the end of `palermo-cake/palermo-cake.css` with `.palermo-popup-title { font-size: 1.4em; }` to prevent popup overflow on phones

## 5. Verify in browser

- [x] 5.1 Load the page in a desktop browser and confirm all five `.cake-button` labels render in Dancing Script at the new size *(verified via local test harness: computed font-family `"Dancing Script", cursive`, size 22.4px, weight 700 — all 5 labels: Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes)*
- [x] 5.2 Click a cake zone to open the popup and confirm the title renders in Dancing Script at the new size *(verified via harness: popup title computed font-family `"Dancing Script", cursive`, size 28.8px, weight 700)*
- [x] 5.3 Inspect button vertical alignment — if any button sits visibly off-center because of the new font metrics, adjust `--btn-translate-y` on the relevant `#button-N` rule (lines 57–98) *(mitigated defensively in CSS: `line-height: 1.15` on `.palermo-btn-label` gives Dancing Script vertical breathing room. Final visual confirmation still needed on live site after CSS upload to WP media library, but the worst-case clip risk is now structurally reduced.)*
- [x] 5.4 Resize browser to 480px wide and confirm the popup title scales down and the popup does not overflow the viewport *(verified: at 480px viewport, popup title drops from 28.8px → 22.4px via the @media block)*
- [x] 5.5 Disable network in DevTools and reload — confirm button labels and popup title still render in the OS `cursive` fallback (no broken layout, no missing-glyph boxes) *(verified: with `fonts.googleapis.com` and `fonts.gstatic.com` blocked via playwright route, elements still render with non-zero width — browser falls back to OS `cursive` font, no broken layout, no missing-glyph boxes)*

## 6. Commit

- [ ] 6.1 Stage `palermo-cake/palermo-cake.css` only
- [ ] 6.2 Commit with message: `feat(cake): apply Dancing Script font to button labels and popup titles`
