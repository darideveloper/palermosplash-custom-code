## Why

The `LAYER_PERCENTAGES` table in `palermo-cake.js` (and its mirrored scenarios in the `cake-button-tracking` spec) carries values from a prior manual calibration that no longer match the production cake illustration. The current numbers (0.93 / 0.78 / 0.61 / 0.44 / 0.27) were placeholders from the original fix; after re-measuring the layer artwork on the live site, the correct fractions of the cake's rendered height are 0.71 / 0.60 / 0.49 / 0.37 / 0.24. Without updating both the JS constant and the spec, every layer button is misaligned on real devices and the spec lies about the contract it is supposed to enforce.

## What Changes

- Update the `LAYER_PERCENTAGES` constant in `palermo-cake/palermo-cake.js` to the new calibrated values for both `vertical` and `horizontal` entries. Both entries carry the same values, matching the existing orientation-keyed table shape.
- Update the pinned-percentage scenarios in `openspec/specs/cake-button-tracking/spec.md` ("Vertical orientation percentages" and "Horizontal orientation percentages") to match the new values, so the spec stays in sync with the implementation.
- Supersede any earlier proposed values for the same table. The values in this change (0.71, 0.60, 0.49, 0.37, 0.24) are the final, correct calibration of the codebase and override any prior draft numbers (including the 0.93 / 0.78 / 0.61 / 0.44 / 0.27 set).

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `cake-button-tracking`: the two `LAYER_PERCENTAGES` scenarios in the "Per-orientation layer percentage table is defined in JS" requirement are updated to the new calibrated values (0.71, 0.60, 0.49, 0.37, 0.24 for both orientations). The shape of the table, the offset semantics, the orientation-aware code path, and the "tunable from a single constant" contract are unchanged.

## Impact

- `palermo-cake/palermo-cake.js` — single constant object literal updated (5 numeric fields per orientation, 10 fields total).
- `openspec/specs/cake-button-tracking/spec.md` — 10 AND clauses across 2 scenarios updated.
- No CSS changes. The `bottom: <vh>` fallback rules in `palermo-cake.css` are unaffected; they only apply for the brief window between `DOMContentLoaded` and the first `positionButtons()` run.
- No HTML changes. The 5 `.cake-button` elements, their IDs, the cake image resolver, and the resize/orientation machinery are all untouched.
- No new dependencies, no new files, no breaking changes to public behavior beyond the corrected button Y positions.
