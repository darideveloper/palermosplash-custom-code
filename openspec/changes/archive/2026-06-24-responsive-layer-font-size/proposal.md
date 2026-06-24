## Why

The cake-typography spec pins the layer button label and popup title font sizes to fixed `em` values, but the implemented code uses a viewport-relative unit (`1.9vh`) on the `.cake-button` container so text scales with screen height. This drift between spec and code is undocumented. The change formalizes the responsive behavior in the spec so future reviewers and contributors do not "fix" it back to fixed `em` values, while keeping the existing visual outcome.

## What Changes

- Document that the cake-zone button text scales with viewport height (responsive), not a fixed size.
- Update the `.palermo-btn-label` requirement to describe a viewport-relative base on its parent rather than a fixed `1.4em`.
- Keep the popup title at a relative unit (`em` on its parent container) and keep the small-viewport reduction, but reframe both as responsive, viewport-aware behavior.
- Add a new requirement pinning the parent container's base font-size as the scaling root for the layer buttons.
- No code changes are required — the current CSS already implements the responsive behavior. This change closes the spec/code drift and records the decision.

## Capabilities

### New Capabilities
- `responsive-layer-typography`: describes the responsive, viewport-scaled font-size behavior of cake-zone button labels and the scaling-root pattern used on the `.cake-button` parent.

### Modified Capabilities
- `cake-typography`: requirement text for `.palermo-btn-label` and `.palermo-popup-title` sizes changes from fixed `em` to viewport-relative. The 480px breakpoint behavior is preserved.

## Impact

- `openspec/specs/cake-typography/spec.md` — requirement text updates.
- `openspec/changes/responsive-layer-font-size/specs/cake-typography/spec.md` — delta spec.
- `palermo-cake/palermo-cake.css` — no edits; current values (`2.5vh` on `.cake-button`, no `font-size` on `.palermo-btn-label`, `1.8em` on `.palermo-popup-title`, `1.4em` on small viewport) match the new requirement.
- No PHP, JS, or asset URL changes. No breaking changes for callers or theme consumers.
