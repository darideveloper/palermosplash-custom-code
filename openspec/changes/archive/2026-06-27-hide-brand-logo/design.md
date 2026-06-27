## Context

The cake-visual landing page renders a `<div id="logo">` (Elementor) containing the Palermo Splash brand logo. Today, `palermo-cake/palermo-cake.css:236-246` styles the inner `<img>` as a fixed, top-right, `mix-blend-mode: overlay`, `z-index: -1` mark. The `brand-logo-styling` capability spec formalises those presentation rules.

The client now wants the logo hidden on this page. The element itself is still in the DOM (rendered by Elementor, outside this repo); only its presentation needs to change. The original styling block is still useful as a reversion reference, so it will be preserved as a commented-out block in the same file.

## Goals / Non-Goals

**Goals:**
- Hide `#logo` on the cake-visual landing page so nothing is rendered in the top-right corner.
- Preserve the previous styling block as a commented-out reference for easy one-edit reversion.
- Update the `brand-logo-styling` capability to reflect the hidden state.
- Keep the fix to a single CSS file; no HTML, JS, or PHP changes.

**Non-Goals:**
- Removing the logo image from the WordPress media library.
- Hiding the logo on pages other than the cake-visual landing page (the rule is feature-scoped to `palermo-cake.css`, so other pages are unaffected by design).
- Adding a JS-driven toggle, animation, or scroll-based show/hide.
- Re-styling the logo (size, position, blend mode) — those decisions are deferred to whoever wants to bring the logo back.

## Decisions

### Hide the wrapper, not the `<img>`

`#logo { display: none; }` targets the Elementor container rather than the inner `<img>`. Elementor may swap the inner tag in the future (e.g., inline SVG, an `<a>` link, a text mark). Hiding the wrapper is robust to any such change and matches the AGENTS.md guidance to target stable wrappers rather than Elementor-generated inner tags.

**Alternatives considered:**
- `#logo img { display: none; }` — works today, but breaks if Elementor swaps the tag inside the wrapper.
- `#logo { visibility: hidden; }` — no real benefit (the logo is `position: fixed`, no layout space to preserve; `visibility: hidden` also leaves the element focusable, which we don't want).
- JS `document.getElementById('logo').remove()` — adds runtime work, introduces a flash of unstyled content before DOMContentLoaded, and the element can be re-rendered by Elementor if its widgets re-mount.
- Tweak the existing `z-index: -1` to make the logo disappear behind the body — fragile and depends on the body's stacking context.

### CSS-only fix (no JS)

A single CSS rule is the smallest viable change. The element is rendered server-side; CSS already controls its presentation; there is no event handling or state to coordinate. Adding JS would be overkill and would add a FOUC window.

### Preserve the old block as a comment

Per the user's request, the previous `#logo img { ... }` block stays in the file, commented out, immediately above the live hide rule. This costs ~10 lines of CSS, gives one-step reversion (uncomment the block, delete the hide rule), and keeps a self-documenting history in the file itself. A git revert would also work, but a commented block is visible without `git blame`.

**Comment format:** use `/* ... */` block comments. Per `AGENTS.md`, the file already uses `/* brand logo */` as a section marker — the commented block will live under that same marker so the section structure stays intact.

### Scope stays at the feature CSS file

The rule belongs in `palermo-cake/palermo-cake.css` (where the original styling lives), not in the child theme's global stylesheet. This keeps the change scoped to the cake-visual page where the logo is unwanted, and leaves the rest of the site's `#logo` rendering untouched.

## Risks / Trade-offs

- **[WP Engine page cache serves stale CSS]** → Mitigation: trigger a WP Engine cache purge after deploy. The CSS change is small and additive (no selector rename), so a hard refresh on the client's side will also pick it up.
- **[Commented block drifts from a future restored version]** → Mitigation: the comment is a snapshot of the current rule, not a guaranteed-future-correct rule. If the live block is ever restored, the team should re-validate it against the current capability spec (or refresh it) before relying on it.
- **[Future logo re-introduction needs a separate change]** → Acceptable. The capability spec is updated to describe the hidden state, so any future "show the logo" work will be a proper OpenSpec change that supersedes this one and re-introduces visible-styling requirements with fresh decisions.
- **[Accessibility: a hidden landmark is not announced]** → The `#logo` element is decorative on this page (no `alt` text drives navigation, the page is a single hero). Hiding it does not regress any accessibility-relevant signal. If a future change makes the logo meaningful, the hide rule should be re-evaluated.
