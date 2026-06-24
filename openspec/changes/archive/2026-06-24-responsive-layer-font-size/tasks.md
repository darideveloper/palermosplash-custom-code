## 1. Verify current CSS matches the new spec

- [x] 1.1 Confirm `palermo-cake/palermo-cake.css` `.cake-button` rule declares a viewport-relative `font-size` (currently `2.5vh`)
- [x] 1.2 Confirm `palermo-cake/palermo-cake.css` `.palermo-btn-label` rule has no `font-size` declaration (inherits from `.cake-button`)
- [x] 1.3 Confirm `.palermo-popup-title` keeps `1.8em` and the `max-width: 480px` media query keeps the `1.4em` reduction

## 2. Run OpenSpec verification

- [x] 2.1 Run `openspec verify change responsive-layer-font-size` and confirm all scenarios pass against the unchanged CSS
- [x] 2.2 Resolve any spec wording that the verifier flags as ambiguous

## 3. Archive the change

- [x] 3.1 Run `openspec archive change responsive-layer-font-size` to merge the delta into `openspec/specs/cake-typography/spec.md` and the new spec into `openspec/specs/responsive-layer-typography/spec.md`
- [x] 3.2 Confirm the archived `cake-typography` spec no longer pins the button label to a fixed `1.4em` and references the scaling root pattern
