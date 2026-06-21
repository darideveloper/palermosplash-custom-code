## Why

The cake visual text labels had no hover feedback. All texts were a single image with uniform color — users couldn't tell which cake layer they were hovering over, and the texts were hard to read against the glow effects when they appeared. This reduced the interactive feel and made the clickable zones feel disconnected from their labels.

Simply changing text color via CSS on hover was too complex because of z-index management: before hover, texts should appear visually behind the glow (depth/embedded in cake), but after hover they should appear over the glow (forward, readable). Reordering z-layers on a single text element while keeping smooth transitions was impractical. A two-layer text overlay solves this cleanly and adds realism/tridimensionality — the text feels like it lifts forward from the cake when hovered.

## What Changes

- **Split single text image into 5 separate per-layer text images**: Each cake layer now has its own standalone text element (`.text` with `#text-1` through `#text-5`), enabling independent hover treatment per layer
- **Added text duplication via JS**: Each `.text` element is cloned at runtime, appended with class `.over` and ID suffix `-over` (e.g., `#text-1-over`). The original stays always-visible, the overlay is revealed on hover
- **Base text layer styling**: `.text` uses `mix-blend-mode: color-burn; opacity: 0.8; z-index: 2` — semi-transparent, allows glow to show through underneath
- **Overlay text layer styling**: `.text.over` uses `mix-blend-mode: darken; z-index: 4; opacity: 0; transition: 1s; pointer-events: none` — hidden by default, positioned above glow (z-index 4 vs glow at z-index 1), darker color for readability
- **Hover reveals overlay**: On mouseenter, `.text.over.visible` sets `opacity: 1` — the darker overlay fades in, creating the illusion of text changing color without moving z-layers. The spatial effect: before hover, text appears embedded inside the cake (behind/at same depth as glow, semi-transparent base). After hover, the dark overlay appears over the glow, making the text feel like it lifts forward — adding realism and tridimensionality
- **Unified hover handler**: JS now toggles `.visible` on both `glowElement` AND `overTextElement` in one function, keeping glow + text hover synchronized
- **Removed glow zoom animation**: `animation: zoomer 2s linear infinite` removed from `#cake-parts .glow.visible img` — the text overlay provides sufficient hover feedback, glow no longer needs to pulse
- **Deleted old commented-out CSS blocks**: ~80 lines of dead code removed from CSS file

## Capabilities

### New Capabilities

- `text-hover-overlay`: Per-layer text split into base + overlay images, where the overlay darkens on hover to indicate active layer and remain readable against glow effects

### Modified Capabilities

- `cake-visual`: Remove glow zoom animation requirement — text overlay provides hover feedback instead
- `clickable-zones`: Hover now toggles `.visible` on both glow element AND overlay text element simultaneously

## Impact

- Modified files: `palermo-cake/palermo-cake.css` (−136 lines), `palermo-cake/palermo-cake.js` (−33 / +28 lines)
- 5 new text image assets per cake layer (hosted in WP media library)
- JS adds duplication logic — no new dependencies
- No breaking changes to existing pages or Elementor components
