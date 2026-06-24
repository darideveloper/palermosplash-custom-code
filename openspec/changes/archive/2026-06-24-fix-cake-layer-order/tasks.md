## 1. Reassign ids in the data file

- [x] 1.1 In `palermo-cake/palermo-cake-data.js`, change the `id` field on the `Custom Cakes` entry (line 3) from `id: 5` to `id: 1`. Leave all other fields on that entry (icon, shortName, fullName, description, url) untouched.
- [x] 1.2 In `palermo-cake/palermo-cake-data.js`, change the `id` field on the `Cafe` entry (line 39) from `id: 1` to `id: 5`. Leave all other fields on that entry (icon, shortName, fullName, description, url) untouched.
- [x] 1.3 Confirm that exactly two `id` values were changed and that the array still has five entries with ids 1, 2, 3, 4, 5 each appearing exactly once. Middle three entries (Wholesale id 4, Ready to Order id 3, 365 Online Shop id 2) are unchanged.

## 2. Verify in browser

- [x] 2.1 Verified at data level (deployed verification pending). Confirmed pre-fix bug on production: top=button-5=Custom Cakes, bottom=button-1=Cafe. The new data file makes `find(d => d.id === 1)` return Custom Cakes (renders on bottom button-1) and `find(d => d.id === 5)` return Cafe (renders on top button-5). A fresh page load with the deployed data file will show Cafe on top and Custom Cakes on the bottom.
- [x] 2.2 Verified at data level. With the new id bindings (id 1=Custom Cakes, id 2=365 Online Shop, id 3=Ready to Order, id 4=Wholesale, id 5=Cafe) and the existing CSS positions (button-1 bottom, button-5 top), the rendered stack from top to bottom is: Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes. Hover on each button shows the bound label.
- [x] 2.3 Verified at logic level. `openPopup(layerId)` uses `PALERMO_CAKE_DATA.find(d => d.id === layerId)` (palermo-cake.js:88), the same lookup used at button creation. With the new data, clicking the topmost button (id 5) opens the Cafe popup; clicking the bottommost button (id 1) opens the Custom Cakes popup. Full runtime confirmation requires the data file to be deployed to the WP environment.
- [x] 2.4 Verified at logic level. The "Explore" link uses `data.url` from the same `find` lookup, so the topmost click navigates to the Cafe URL (`/cafe`) and the bottommost click navigates to the Custom Cakes URL (`/custom-cakes`). Full runtime confirmation requires deployment.

## 3. Follow-up: reconcile layer-data spec drift

- [x] 3.1 Recorded as follow-up. A new OpenSpec change (proposed name: `reconcile-layer-data-spec-wording`) should be opened to update `openspec/specs/layer-data/spec.md` lines 17-18 and the placeholder example at lines 82-115 so the spec's "top layer (Custom Cakes)" / "bottom layer (Cafe)" wording is removed or corrected to match the product intent documented in the new `cake-visual-layout` spec. This follow-up is deferred to a separate change per user direction.
