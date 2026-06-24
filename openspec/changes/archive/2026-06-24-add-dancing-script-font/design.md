## Context

The `palermo-cake` feature renders a hand-illustrated cake image with five clickable zone buttons and a per-layer info popup. All text on the cake piece currently inherits the WP theme's default sans-serif. The brand is artisan bakery, and the visual identity (illustrated cake, warm palette `#2b1d0e` on `#fffaf0`) is undermined by generic typography on the buttons and popup titles. The fix is a single-file CSS edit: import a script-style Google Font and apply it to the two affected selectors.

Constraints from `AGENTS.md`:
- No build tools, no npm, vanilla CSS/JS
- CSS selectors prefixed with `.palermo-` to avoid Elementor conflicts
- Asset URLs point to WP media library (not local) — fonts can be loaded from a third party (Google Fonts) since they're not images
- `palermo-cake.css` is enqueued via child theme `functions.php` (not in this repo), so any change to that PHP is out of scope

## Goals / Non-Goals

**Goals:**
- Add a handcrafted script typeface to the cake feature that matches the artisan-bakery brand
- Apply it to both interactive surfaces (zone button labels) and informational surfaces (popup titles)
- Zero new files, zero new dependencies in this repo, zero build step
- Keep load-time impact negligible for a single landing-page hero

**Non-Goals:**
- Changing font on any other element outside the cake feature (header, body text, etc. remain theme-controlled)
- Adding more than one script font (no secondary typeface for accents)
- Self-hosting fonts or migrating to a `<link>` in `functions.php` — current `@import` approach is acceptable for the page weight
- Changing button positioning, colors, hover behavior, or popup layout — typography only
- Accessibility overhaul: Dancing Script remains decorative, all text retains real DOM text content for screen readers and search

## Decisions

### Decision 1: Load via CSS `@import` (not `<link>`, not self-host)

**Chosen:** Single `@import url(...)` at line 1 of `palermo-cake.css`.

**Rationale:** Matches the project's "one file pair per feature" convention and "no build tools" constraint. Zero PHP touched, zero new files. `display=swap` ensures fallback fonts render immediately.

**Alternatives considered:**
- **`<link>` in `functions.php`**: parallel download, slightly faster, but requires editing PHP that lives outside this repo. Defer until Lighthouse regresses.
- **Self-hosted woff2**: best perf + GDPR-friendly, but adds a binary file and `font-face` declarations. Overkill for a font used in two selectors on one page.
- **Elementor font uploader**: out of scope — defeats the purpose of custom code.

### Decision 2: Use weights 400 and 700 only

**Chosen:** Request both `400` and `700` from Google Fonts (`family=Dancing+Script:wght@400;700`).

**Rationale:** Dancing Script ships only 400 and 700. Using `font-weight: 600` would trigger browser-synthesized bold, which looks broken on script glyphs (fake-thick loops, distorted flourishes). Use 700 directly for the headings/labels that need weight.

### Decision 3: Bump sizes + reset text-shadow

**Chosen:**
- `.palermo-btn-label`: `font-size: 1.4em` (was 1.1em), `font-weight: 700` (was 600), remove or soften `text-shadow`
- `.palermo-popup-title`: `font-size: 1.8em` (was 1.25em), `font-weight: 700` (unchanged)

**Rationale:** Script fonts have thinner strokes and longer ascenders/descenders than the previous sans-serif. They need more visual area to read at the same prominence. The existing `text-shadow: 0 1px 2px rgba(255,255,255,0.6)` was tuned for sans-serif (gives a soft white halo for legibility on the cake illustration); on script it muddies the thin strokes — likely remove entirely, verify in browser.

### Decision 4: Fallback stack is `cursive`

**Chosen:** `font-family: 'Dancing Script', cursive;`

**Rationale:** Tells the browser to use whatever script-style font the OS supplies if Dancing Script fails to load (e.g., Comic Sans on Windows, Apple Chancery on macOS). Always falls back to something cursive, never a sans-serif, so the brand intent survives a network failure.

## Risks / Trade-offs

- **Vertical alignment shifts** → Script ascenders differ from previous font, so `.cake-button` elements (positioned via `--btn-translate-y`) may sit off-center. **Mitigation:** verify in browser; adjust `--btn-translate-y` per breakpoint if needed (lines 57–98 of `palermo-cake.css`).
- **CLS from font swap** → Buttons render in fallback font, then re-flow when Dancing Script loads. **Mitigation:** `display=swap` keeps the swap fast (~100–200ms on broadband); sizes were bumped to reduce re-flow delta. Acceptable for hero.
- **text-shadow looks wrong on script** → White halo may muddy thin strokes. **Mitigation:** browser-test; default action is to remove the shadow on `.palermo-btn-label`.
- **Small-viewport popup overflow** → Popup title 1.8em may push content off-screen on phones < 480px. **Mitigation:** add a `@media (max-width: 480px)` block to drop title to 1.4em if verified needed.
- **External dependency on Google Fonts** → If `fonts.googleapis.com` is blocked (corporate firewall, China, GDPR region), font falls back to `cursive` OS font. **Mitigation:** documented in spec; mitigation path is self-hosting (out of scope for this change).
- **Render-blocking @import** → ~200–400ms slower than `<link>` in `<head>`. **Mitigation:** acceptable per scope; revisit if Lighthouse score regresses.

## Migration Plan

Single-step deployment:
1. Edit `palermo-cake/palermo-cake.css` per `tasks.md`.
2. Reload page in browser to verify.
3. Commit with conventional-commits message (e.g., `feat(cake): apply Dancing Script font to button labels and popup titles`).

**Rollback:** revert the single commit. No schema migrations, no cache invalidation beyond normal CSS cache.

## Open Questions

- Should the same script font extend to other cake-feature text (popup body `.palermo-popup-desc`, popup button `.palermo-popup-btn`)? **Proposed answer: no** — keep readable body text in the theme's sans-serif for accessibility, only apply script to display surfaces (labels + titles). User to confirm in `tasks.md`.
- Does the existing `text-shadow` on `.palermo-btn-label` need to stay for legibility against the cake illustration, or can it be removed? **Proposed answer: remove** — verify in browser. If legibility suffers, soften to `0 1px 1px rgba(255,255,255,0.4)`.
