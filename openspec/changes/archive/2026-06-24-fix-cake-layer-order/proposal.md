## Why

The illustrated cake visual on the landing page renders its layers in the wrong order: Cafe appears on the bottom layer and Custom Cakes appears on the top. The intended product layout places Cafe on the top of the cake and Custom Cakes on the bottom. The bug surfaces because the data array assigns `id:1` to Cafe and `id:5` to Custom Cakes, but the CSS positions button-1 at the bottom of the cake and button-5 at the top, so the visual order is inverted relative to the layer labels. There is currently no spec governing the layer-to-position mapping, which allowed the inversion to ship.

## What Changes

- Reassign the `id` field on the two end entries of `PALERMO_CAKE_DATA` in `palermo-cake/palermo-cake-data.js`: the `Custom Cakes` entry changes from `id: 5` to `id: 1`, and the `Cafe` entry changes from `id: 1` to `id: 5`. All other fields (icon, shortName, fullName, description, url) remain untouched.
- Introduce a new `cake-visual-layout` spec that codifies the layer-to-position contract: Cafe is the top layer (id 5) and Custom Cakes is the bottom layer (id 1), with Wholesale (id 4), Ready to Order (id 3), and 365 Online Shop (id 2) stacked top-to-bottom in between.
- Add a follow-up task noting that the existing `layer-data` spec's "top layer / bottom layer" wording becomes self-contradictory after this change and should be reconciled in a separate OpenSpec change.

No CSS, no per-layer content (icons, descriptions, URLs), and no other specs are modified by this change.

## Capabilities

### New Capabilities

- `cake-visual-layout`: Defines which cake layer (Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes) occupies the top, middle, and bottom of the cake visual, and binds each layer to its numeric id in `PALERMO_CAKE_DATA`.

### Modified Capabilities

None. The `layer-data` spec wording drift is documented as a follow-up task and will be addressed in a separate change.

## Impact

- `palermo-cake/palermo-cake-data.js` (lines 3 and 39): two single-digit id swaps.
- `palermo-cake/palermo-cake.js`: unaffected. It already uses `find(d => d.id === i)` to wire buttons to data, so swapping ids transparently routes the correct entry to each CSS-positioned button.
- `palermo-cake/palermo-cake.css`: unaffected. Button-1 stays at the bottom of the cake, button-5 stays at the top; only the label behind each id changes.
- New spec file `openspec/changes/fix-cake-layer-order/specs/cake-visual-layout/spec.md` (will be promoted to `openspec/specs/cake-visual-layout/spec.md` on archive).
- Follow-up: `openspec/specs/layer-data/spec.md` lines 17-18 and 82-115 document the old top/bottom assumption and will need a separate OpenSpec change to reconcile.
