## Why

The cake-visual landing page currently shows no brand identity. The original concept mockup used an AI-generated placeholder logo that was never intended for production. Now that the real Palermo Splash brand logo is available in the WordPress media library, we need to display it on the page and style it so it integrates cleanly with the illustrated cake composition (subtle, top-right, blending with the background) rather than competing with the hero visual.

## What Changes

- Add a CSS block in `palermo-cake/palermo-cake.css` that styles the existing `#logo img` element rendered by WordPress.
- Position the logo fixed to the top-right corner of the viewport so it persists across scroll.
- Size the logo at 200px wide (height auto) for a non-intrusive presence.
- Use `mix-blend-mode: overlay` so the logo harmonizes with the illustrated background instead of sitting on top as a hard rectangle.
- Use `z-index: -1` so the logo sits behind interactive layers (cake zones, hover overlays) and never blocks clicks.
- Add a top-of-file section comment (`/* main cake layout */`) to keep the file's section organization explicit as it grows.

No HTML, JS, or PHP changes. No new files. No new assets in this repo (logo is hosted in WP media library, per project convention).

## Capabilities

### New Capabilities

- `brand-logo-styling`: Visual presentation rules for the Palermo Splash brand logo on the cake-visual landing page, including placement, sizing, blend mode, and stacking context.

### Modified Capabilities

None. Existing capabilities (`cake-visual`, `clickable-zones`, `text-hover-overlay`) describe behavior that is not changing. The new logo styles are an additive visual layer and do not alter their requirements.

## Impact

- Affected code: `palermo-cake/palermo-cake.css` (one new rule block + one section comment, +12 lines).
- Affected runtime: WordPress page render of the `#logo` element. No enqueue changes needed (CSS already loaded).
- No new dependencies. No build step. No image files added to repo.
- Hosting: WP Engine, no server-side changes.
- Risk: low. The selector `#logo img` is scoped; blend mode and negative z-index are CSS-only and reversible.
