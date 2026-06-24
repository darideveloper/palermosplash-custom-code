## Context

The cake-visual landing page (built with Elementor + custom CSS in `palermo-cake/`) currently has no brand logo on screen. The original design used an AI-generated placeholder logo during prototyping. The client now wants the real Palermo Splash brand logo (uploaded to the WordPress media library) to appear on the page. The logo element is already rendered by Elementor/WordPress as `#logo img`; only CSS styling is required.

The page's hero composition is the illustrated cake with clickable zones and text hover overlays. The logo must feel integrated with the illustration (blend in, not dominate) and must never block interaction with the cake parts.

## Goals / Non-Goals

**Goals:**
- Display the real brand logo on the cake-visual page.
- Position it as a persistent, non-intrusive element in the top-right of the viewport.
- Make the logo harmonize with the illustrated background via blend mode.
- Guarantee the logo never blocks clicks on the interactive cake zones or text overlays.
- Keep the change to one CSS file, no HTML/JS/PHP edits, no new assets in the repo.

**Non-Goals:**
- Replacing or re-uploading the logo image (already in WP media library).
- Adding responsive variants (mobile/tablet breakpoints). The current cake-visual is desktop-only.
- Animating the logo on scroll or hover.
- Adding a link wrapper or alt-text changes (handled by Elementor/WP).

## Decisions

**1. Position: `fixed` top-right with `top: 15px; right: 15px;`**
- Rationale: keeps the logo visible regardless of scroll and aligns with the convention for persistent brand marks on landing pages. 15px offset gives breathing room from the viewport edge without crowding.
- Alternatives considered: `absolute` inside a header element (rejected — page has no header container wired up for the cake-visual; would require HTML changes). Sticky inside a container (rejected — same reason, plus adds reflow complexity).

**2. Size: `width: 200px; height: auto;`**
- Rationale: large enough to be recognizable, small enough to stay subordinate to the cake hero. `height: auto` preserves aspect ratio for any logo swap.
- Alternatives considered: percentage-based width (rejected — hard to reason about across viewport sizes; cake-visual targets desktop only). Containment in a max-width clamp (overkill for a single breakpoint).

**3. Blend: `mix-blend-mode: overlay;`**
- Rationale: lets the logo's tones mix with the underlying illustration so it reads as part of the composition rather than a sticker on top. Works well with the warm palette of the cake illustration.
- Alternatives considered: `multiply` (rejected — would darken the logo and the background too aggressively). `screen` (rejected — would lighten to near-invisibility on the light cake tones). `normal` (rejected — looks pasted on, defeats the integration goal).

**4. Stacking: `z-index: -1;`**
- Rationale: places the logo behind every other element on the page (cake, hover text, cake zones). This guarantees the logo cannot intercept clicks, hover events, or pointer events on interactive layers, and removes the need for `pointer-events: none`.
- Alternatives considered: high positive z-index with `pointer-events: none` (rejected — leaves a visible stacking-context trap where future layers could appear under it). `z-index: 0` with `pointer-events: none` (rejected — same problem, just inverted).

**5. File organization: append new rule to existing `palermo-cake/palermo-cake.css` with a leading section comment**
- Rationale: one CSS file per feature is the project convention (`AGENTS.md`). The logo is part of the cake-visual feature. Adding a `/* brand logo */` section comment keeps the file scannable as it grows.
- Alternatives considered: separate `brand-logo.css` (rejected — adds an enqueue, splits a tightly related visual layer into two files).

## Risks / Trade-offs

- [Logo invisible on light-only sections] `mix-blend-mode: overlay` produces subtle output against very light backgrounds → Mitigation: if QA shows the logo disappearing on the cake's white/cream areas, swap to `multiply` or add a soft `filter: drop-shadow` for contrast. Documented as a known tuning point.
- [Negative z-index creates a new stacking context] any sibling with `position` and `z-index: auto` will still render above the logo, but anything with `z-index: 0` or unset will sit above too → Mitigation: the existing cake parts and hover overlays in this file do not set z-index, so they naturally stack above. Verified by reading `palermo-cake/palermo-cake.css`.
- [Logo shifts on scroll] `position: fixed` pins it, so no shift → no mitigation needed.
- [Future mobile support] the rule uses fixed pixel values and no media queries → Mitigation: out of scope per non-goals; revisit when cake-visual gets a mobile variant.

## Migration Plan

- No deployment steps beyond committing `palermo-cake/palermo-cake.css`. CSS is already enqueued by the child theme.
- Rollback: `git revert` the commit (or remove the `#logo img` block) — no data, cache, or schema impact. WP Engine page cache will refresh on next request.
- No environment-specific config, no feature flag, no migration script.

## Open Questions

None. All decisions above are resolvable from the existing code and the stated requirement (real brand logo styled to integrate with the illustrated cake). If QA reveals the blend mode looks wrong on a specific background, the swap path is documented in the Risks section.
