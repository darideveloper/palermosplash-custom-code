## Why

The Palermo Splash hero uses a handcrafted illustrated cake with five clickable zones (buttons) and an info popup per layer. Currently all text inherits the theme's default sans-serif, which reads as generic and undercuts the artisan-bakery brand. Adding Dancing Script — a free Google Font designed to evoke handwritten cursive — gives the button labels and popup titles the warm, crafted feel that matches the illustration. Without it, the visual identity of the cake piece is undermined by the typography that sits on top of it.

## What Changes

- Add Dancing Script (weights 400, 700) to the `palermo-cake` feature via a single `@import` at the top of `palermo-cake/palermo-cake.css`.
- Apply Dancing Script to `.palermo-btn-label` (text inside each of the five `.cake-button` elements) and bump its size from `1.1em` to `1.4em` so the script strokes have enough visual weight.
- Apply Dancing Script to `.palermo-popup-title` (heading inside the `palermo-popup` panel) and bump its size from `1.25em` to `1.8em`.
- Bump `.palermo-btn-label` weight from `600` to `700` — Dancing Script only ships 400 and 700, so 600 would trigger synthesized bold and look poor on script glyphs.
- Re-tune the existing `text-shadow` on `.palermo-btn-label` (or remove it) because the white halo was tuned for sans-serif and can muddy thin script strokes.

## Capabilities

### New Capabilities

- `cake-typography`: Defines the typographic identity for the cake visual — which font families are used for cake-zone button labels and layer info popup titles, the weights/sizes that apply, and the loading strategy (Google Fonts via CSS `@import`). Future typographic changes to the cake feature belong here.

### Modified Capabilities

None. This change adds a new visual-styling capability but does not alter the behavioral requirements of any existing capability (`cake-visual`, `clickable-zones`, `layer-info-popup`, etc. — no click targets, no popup flow, no zone positions change).

## Impact

- **CSS only**: `palermo-cake/palermo-cake.css` is the single file modified. No JS, no PHP, no HTML changes.
- **External dependency**: Adds a runtime fetch to `fonts.googleapis.com` on first page load. The request uses `display=swap` so fallback fonts render immediately and swap when the font loads.
- **Performance**: CSS `@import` is render-blocking and slightly slower than a `<link>` tag in `<head>` — acceptable for a single landing-page hero. If Lighthouse regresses, move the import to a `<link>` in the child theme's `functions.php` (out of repo scope).
- **No build pipeline**: matches project conventions (no npm, no bundler, vanilla CSS/JS).
- **Cumulative Layout Shift**: minimal — `display=swap` avoids the FOIT/FOUT flash; both fallback and Dancing Script occupy similar advance widths at the bumped sizes.
- **Visual side effect to verify in browser**: vertical alignment of `.cake-button` elements (which use `transform: translateY(var(--btn-translate-y))` for positioning) may shift because script ascenders/descenders differ from the previous font. Per-breakpoint `--btn-translate-y` adjustments may be needed.
