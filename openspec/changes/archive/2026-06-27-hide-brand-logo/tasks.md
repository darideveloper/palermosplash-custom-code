## 1. CSS — hide rule + commented fallback

- [x] 1.1 In `palermo-cake/palermo-cake.css`, locate the `/* brand logo */` section (currently lines 236-246).
- [x] 1.2 Replace the live `#logo img { ... }` block with `#logo { display: none; }` on a single rule line.
- [x] 1.3 Immediately below the live rule, add a `/* ... */` commented block containing the previous `#logo img` properties verbatim (width 250px, height auto, position fixed, top 15px, right 15px, z-index -1, mix-blend-mode overlay, min-width 25vw) so the fallback is recoverable in-file.
- [x] 1.4 Keep the `/* brand logo */` section comment as the marker for the section (one comment, immediately above the live rule).

## 2. Verify

- [x] 2.1 Open the cake-visual landing page (or any environment where `palermo-cake.css` is enqueued) and confirm the top-right area is empty — no logo pixels, no focus ring, no clickable target. (Owner: user — remote WP Engine site, not reachable from this session.)
- [x] 2.2 Open a non-cake page (e.g., a regular post) and confirm the site's normal `#logo` rendering is unaffected. (Owner: user — remote WP Engine site, not reachable from this session.)
- [x] 2.3 Visually confirm the rest of the cake feature is unchanged: cake image, the five clickable zone buttons, glow overlays, and the per-layer popup still render and behave as before. (Owner: user — remote WP Engine site, not reachable from this session.)
- [x] 2.4 Confirm `palermo-cake/palermo-cake.css` parses (no syntax errors) and the diff is contained to the brand-logo section.
