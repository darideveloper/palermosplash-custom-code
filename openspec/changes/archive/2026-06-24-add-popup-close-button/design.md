## Context

The layer info popup was added by the `cake-layer-info-popup` change (archived 2026-06-24). It currently closes via two paths: clicking outside the popup (document click listener) and clicking another layer button (which triggers a close-then-open sequence). A click on the already-active button is a no-op, so the user has no way to close the popup from inside it.

This change adds a dedicated close button inside the popup, providing an explicit, discoverable dismiss affordance. The implementation reuses the existing close logic — the close button is a new trigger, not a new close path.

Constraints (from `AGENTS.md` and existing conventions):
- No build pipeline, vanilla CSS + JS only
- Popup is created entirely in JS (no Elementor HTML changes needed)
- No accessibility work in this change (keyboard shortcuts, focus management deferred to a later change)
- Class names prefixed with `palermo-` to avoid Elementor conflicts

## Goals / Non-Goals

**Goals:**
- Add a visible "X" close button in the top-right corner of the popup
- Clicking the close button closes the popup and removes the `is-active` class from the active layer button
- The close button does not interfere with the click-outside handler (clicking the close button must not be treated as an "outside" click)
- Reuse the existing `closePopup` function and `is-active` removal logic (no duplicated close code)
- Visually subordinate to the "Explore" CTA but clearly tappable

**Non-Goals:**
- Keyboard shortcuts (Escape to close) — deferred
- Focus management (auto-focus the close button when popup opens) — deferred
- Animated close icon (rotation, morph, etc.) — keep it simple
- Configurable position or label — fixed top-right, "×" character

## Decisions

### Decision 1: Use an HTML `<button>` element, not a `<span>` with click handler

The close button is rendered as a real `<button>` element (not a `<div>` or `<span>` with a `click` listener).

**Rationale:**
- Semantic: a `<button>` is the correct element for an action that dismisses a panel
- Built-in keyboard support: focusable, activatable with Enter/Space, even though full keyboard navigation is deferred
- Built-in click semantics: the browser handles `disabled`, `aria-*`, and event ordering
- Type safety: `type="button"` prevents accidental form submission if the popup is ever nested in a form

**Alternatives considered:**
- *`<span>` with click handler* — works but loses semantic meaning and keyboard support. Rejected.
- *`<a href="#">` with click handler* — semantic for navigation, not for closing. Rejected.
- *`<div role="button">` with click handler* — semantically valid but verbose. Rejected; the native `<button>` is simpler and better.

### Decision 2: Reuse the existing close logic via a shared helper

The close button's click handler calls a shared close function that performs the same operations as the click-outside handler: remove `.open` from the popup, remove `.is-active` from the active button, and set `activeLayerId` to `null`. The click-outside handler is refactored to call the same helper (no duplicated code).

**Rationale:**
- Single source of truth for close behavior
- Easy to keep in sync if the close logic changes (e.g., adding a focus restoration step later)
- The close button is just another trigger of the same close path

**Implementation pattern:**
```js
function dismissPopup() {
    if (!popup || activeLayerId === null) return;
    popup.classList.remove('open');
    const btn = document.getElementById('button-' + activeLayerId);
    if (btn) btn.classList.remove('is-active');
    activeLayerId = null;
}

function closePopup() {
    if (popup) popup.classList.remove('open');
}

// document click listener uses dismissPopup:
// close button click uses dismissPopup
```

**Alternatives considered:**
- *Duplicate the close logic in the close button handler* — two sources of truth, easy to drift. Rejected.
- *Dispatch a synthetic click on the document to trigger the existing listener* — hacky, indirect, and would not stop the close button click from also being treated as an outside click. Rejected.

### Decision 3: Position the close button absolutely in the top-right of the popup

The close button is `position: absolute; top: 0; right: 0` inside the popup. The popup already has `position: fixed`, so absolute children anchor to it without needing `position: relative` on the popup.

**Rationale:**
- Absolute positioning is the standard pattern for "close X" inside a panel
- The popup's existing `position: fixed` already establishes a containing block for absolute children
- Top-right is the universal convention for dismiss buttons — no visual discovery needed

**Alternatives considered:**
- *Flexbox layout with the close button in a flex header* — would restructure the popup's internal layout. The current popup uses simple block flow (icon → title → desc → btn). Adding a header row is a larger change. Rejected for minimalism.
- *Position the close button outside the popup (in the corner of the viewport)* — confusing on landscape where the popup is mid-screen, not at the edge. Rejected.

### Decision 4: Use a UTF-8 "×" (multiplication sign, U+00D7) for the icon

The close button's visible content is the character `×` (U+00D7, MULTIPLICATION SIGN). No icon font, no SVG, no image.

**Rationale:**
- Renders consistently across platforms
- Matches the existing icon convention in the data file (UTF-8 characters)
- Visually clear as a close affordance
- No external dependency

**Alternatives considered:**
- *SVG `×` icon* — more control over styling, but adds DOM weight and a separate asset. The `×` character is simple enough that SVG is overkill.
- *Two crossed `<span>` lines* — common CSS trick, but the `×` character is simpler and more accessible (screen readers can read it as "times" or "multiplication sign", or with `aria-label="Close"` it's just "Close").

### Decision 5: Size the close button as a 32×32 hit area with a 16px icon

The button is a 32×32 square. The `×` character is rendered at `1.5em` (about 24px) inside it. The button has `background: transparent; border: 0; cursor: pointer`.

**Rationale:**
- 32×32 is the minimum recommended touch target (WCAG 2.5.5, though full a11y is deferred)
- Transparent background keeps the button visually light so it doesn't compete with the popup content
- `cursor: pointer` signals interactivity on desktop
- The icon size (24px in a 32px box) leaves comfortable padding around the click target

**Alternatives considered:**
- *Larger button (44×44)* — better for touch, but visually heavier. The popup already has clear content; a 32×32 close is enough.
- *Visible border or background* — would draw too much attention to the close button vs the "Explore" CTA.

## Risks / Trade-offs

- **Close button overlaps the popup title on narrow viewports** → In portrait, the popup is full-width and the title has plenty of space. In landscape, the popup is 320px wide and the title is the first child; the close button at top-right doesn't overlap. If the title becomes very long (unlikely with current content), the right padding on the title can be increased. Mitigation: add `padding-right` to the title to reserve space for the close button.
- **Click on close button also bubbles to document and triggers click-outside** → The click-outside listener checks `e.target.closest('.palermo-popup, .cake-button')`. The close button is inside the popup, so `closest('.palermo-popup')` matches and the listener returns early. No double-close.
- **Close button is not keyboard-accessible without focus styling** → Out of scope for this change (focus management deferred). The button IS keyboard-focusable (native `<button>`), but the popup does not move focus to it on open. Acceptable for this change; will be addressed when full a11y is added.

## Open Questions

- None. The change is small and well-scoped.
