## Context

The `palermo-cake` feature renders five clickable zone buttons over a cake illustration. Each button contains an icon and a label in Dancing Script. The original `cake-typography` spec pinned the label to `1.4em` and the popup title to `1.8em` (with a `1.4em` reduction at `max-width: 480px`). The shipped CSS instead sets `font-size: 1.9vh` on the `.cake-button` parent and keeps the popup title at `1.8em` (with the `1.4em` reduction at small viewports). Because `em` on `.palermo-btn-label` and `.palermo-popup-title` resolves against their parent's font-size, the label text scales with viewport height while the popup title scales with the popup's own font-size cascade.

This change documents that intentional choice. No CSS edit is required — only the spec text needs to be aligned with the implementation.

## Goals / Non-Goals

**Goals:**
- Replace fixed `em` size pins in `cake-typography` with viewport-relative or parent-relative declarations that match the shipped CSS.
- Establish `.cake-button` as the documented scaling root for the layer button labels.
- Keep the small-viewport reduction rule intact.
- Provide a delta spec for the change so the `archive` step updates `openspec/specs/cake-typography/spec.md` cleanly.

**Non-Goals:**
- Refactoring CSS to use `clamp()`, `min()`, or other modern responsive functions.
- Changing visual appearance, font family, weights, or the small-viewport breakpoint.
- Touching the popup body copy, popup close button, or any other unrelated text sizing.

## Decisions

- **Scaling root is `.cake-button`, not `.palermo-btn-label`.** Setting `1.9vh` on the parent and using `em` on the child keeps the label's `em` contract intact for other contributors while making the parent the single source of truth for viewport scaling. This is what the current CSS already does. Alternative considered: put the viewport unit directly on `.palermo-btn-label`. Rejected because it bypasses the parent's icon/label sizing relationship and would be a CSS change.
- **Popup title stays at `1.8em` of its parent.** The popup container is not given a viewport-relative base, so `1.8em` is effectively a relative unit on the theme's inherited root, which matches the existing implementation. Alternative considered: switch the title to `vh`. Rejected because the popup is a fixed-width panel and `em` relative to the inherited root is more predictable.
- **Small-viewport rule preserved at `1.4em`.** The `max-width: 480px` breakpoint on `.palermo-popup-title` stays. Alternative considered: switching to a viewport unit on small screens. Rejected to keep the change purely a documentation alignment.
- **No new CSS units, no new selectors.** The spec text is reworded to describe the actual behavior. This keeps the diff to a spec-only update and avoids any regression in the live page.

## Risks / Trade-offs

- [Spec reviewer confusion] → The new requirement text explicitly names the parent and the unit, with scenarios that read the computed value to verify.
- [Future "fix" reintroducing fixed `em` on `.palermo-btn-label`] → The new requirement pins the parent as the scaling root, so removing the parent's `vh` would fail the scenario check.
- [No code change, so no visual regression risk] → All existing visual behavior is preserved; only the spec text changes.

## Migration Plan

- Update the delta spec under `openspec/changes/responsive-layer-font-size/specs/cake-typography/spec.md`.
- Archive the change; this merges the delta into `openspec/specs/cake-typography/spec.md`.
- No deployment action needed — the live CSS is unchanged.

## Open Questions

- None. The current code is the final code per the change request; this proposal only records the decision in the spec.
