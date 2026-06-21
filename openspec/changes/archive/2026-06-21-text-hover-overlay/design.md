## Context

Before this change, all cake text labels were part of a single composite image (`full-texts.webp`). The texts had uniform color with `mix-blend-mode: darken` and sat at `z-index: 2`. When hovering a cake layer, the glow appeared behind the texts but the texts themselves gave no visual feedback — no color change, no indication of which layer was active. The glow also had a pulsing zoom animation that competed visually with the static text.

The core problem: making text change color on hover and also reordering z-index (text behind glow before hover, over glow after) was too complex with a single text element. The spatial illusion was critical — before hover, text should feel embedded inside the cake, visually at the same depth as the glow. On hover, it should lift forward, appearing over the glow for readability and a 3D pop effect. This design solves both the color feedback and the depth illusion with a two-layer text approach.

## Goals / Non-Goals

**Goals:**
- Visual hover feedback on text labels when hovering a cake layer
- Text remains readable when glow effects appear behind it
- No z-index reordering of text vs glow on hover
- Create spatial depth illusion: text appears embedded behind glow before hover, lifts forward over glow on hover (tridimensionality)
- Performance: no new dependencies, minimal JS

**Non-Goals:**
- Changing actual text content or color via CSS — the illusion is done with overlays
- Animating text position or size on hover
- Changes to the clickable zone hit areas

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Text split approach | Split single text image into 5 per-layer text elements, each duplicated as base + overlay | Avoids z-index reordering: glow at z-index 1, base text at z-index 2, overlay text at z-index 4. Before hover: base text sits above glow (semi-transparent, glow visible through it) — text feels embedded in the cake. On hover: overlay at z-index 4 fades in above glow — text appears to lift forward. This creates the 3D/tridimensional illusion without any element repositioning. A single text element couldn't achieve this without complex z-index swapping mid-transition |
| Overlay styling | `mix-blend-mode: darken` with full opacity | Darker color ensures readability against glow effects behind it |
| Base text styling | `mix-blend-mode: color-burn; opacity: 0.8` | Semi-transparent so glow is partially visible through the text, maintaining depth |
| Overlay pointer events | `pointer-events: none` | Prevents overlay from intercepting clicks meant for the `.cake-button` beneath |
| Glow animation removed | Removed `zoomer` keyframe from `.glow.visible img` | Text overlay provides enough hover feedback — pulsing glow was redundant and visually noisy |
| Text duplication | JS `cloneNode()` at DOMContentLoaded | Simple, no template strings or server-side rendering needed; each `.text` gets an exact `.over` clone positioned by CSS (same layout, same position, just different blend mode + opacity) |
| Unified hover handler | Single `toggleVisibility` function toggles `.visible` on both glow + overlay text | Ensures glow and text hover effects stay synchronized; one source of truth for hover state |

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Overlay text position might drift from base on different screen sizes | Both share the same parent and identical CSS positioning — no extra positioning rules needed for `.over`, it inherits from `.text` |
| Two images per text = double the elements in DOM | Only 5 texts → 10 total elements (5 base + 5 overlay), negligible impact |
| If `.text` elements are missing or renamed, JS silently skips duplication | JS uses `.text` class selector — if none found, no error, just no overlay; fails gracefully |
| Overlay text blocks glow interaction | `pointer-events: none` on `.over` ensures clicks/mouse events pass through to buttons beneath |
