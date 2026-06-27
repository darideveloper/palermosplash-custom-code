## Context

The `LAYER_PERCENTAGES` constant in `palermo-cake/palermo-cake.js` was set to placeholder values (0.93 / 0.78 / 0.61 / 0.44 / 0.27) during the original `fix-cake-button-tracking` change. Re-measuring the live cake illustration on production shows the correct fractions of the cake's rendered height are 0.71 / 0.60 / 0.49 / 0.37 / 0.24. The spec at `openspec/specs/cake-button-tracking/spec.md` mirrors those placeholder values in two scenarios ("Vertical orientation percentages" and "Horizontal orientation percentages") and currently lies about the contract it is meant to enforce.

Both consumers — the JS constant and the spec scenarios — must be updated together so the implementation and the spec stay in sync. The shape of the table, the offset semantics, the orientation-aware code path, and the "tunable from a single constant" contract are all unchanged.

## Goals / Non-Goals

**Goals:**
- Replace the placeholder `LAYER_PERCENTAGES` values with the calibrated set in `palermo-cake/palermo-cake.js` for both `vertical` and `horizontal` entries.
- Update the two pinned-percentage scenarios in `openspec/specs/cake-button-tracking/spec.md` to match the new values.
- Ship both edits as a single change so the spec and code never disagree on the calibration.

**Non-Goals:**
- Changing the table shape, the orientation-keyed structure, or the offset semantics (`± buttonHeight / 2`).
- Refactoring `positionButtons()` or the resize / `ResizeObserver` machinery.
- Touching CSS, HTML, the cake image resolver, or the cake layer popup code.
- Removing the legacy `bottom: <vh>` CSS fallback rules — they remain in place for the brief window between `DOMContentLoaded` and the first `positionButtons()` run.

## Decisions

### Update both orientations to the same values

The current table carries identical values for `vertical` and `horizontal`. The proposal keeps that pattern: both entries use 0.71 / 0.60 / 0.49 / 0.37 / 0.24. The table shape stays orientation-keyed so the orientation-aware code path is preserved; only the per-cell numbers move.

**Alternatives considered:**
- Different values per orientation (rejected — the production cake illustration is centred on the same artwork in both orientations; the per-layer Y fractions are identical. Splitting them would be premature complexity).
- Removing the orientation key and using a single flat table (rejected — would change the code path and the "tunable from a single constant" contract; the proposal explicitly preserves both).

### Update the spec in the same change

The spec currently encodes the old values in the "Vertical orientation percentages" and "Horizontal orientation percentages" scenarios. Leaving the spec untouched would create exactly the "spec lies" problem the proposal calls out, so the spec moves with the code.

**Alternatives considered:**
- Spec-only change (rejected — the production buttons would still be misaligned; the change would be documentation-only).
- Code-only change (rejected — the spec would encode stale values; future drift).

### No CSS, HTML, or PHP changes

The `bottom: <vh>` rules in `palermo-cake.css` are a CSS fallback for the first paint only. The new JS values supersede them as soon as `positionButtons()` runs, which is the same behavior as before — only the per-layer Y numbers move. The cake image, button IDs, popup machinery, and enqueue path are all unchanged.

## Risks / Trade-offs

- **[Buttons are visibly repositioned on the live site]** → The whole point of the change. The new positions reflect the actual layer artwork; QA against the live cake illustration is the verification path.
- **[Stale browser cache shows old positions]** → WP Engine page cache; trigger a purge on deploy.
- **[Future re-measurement could shift the values again]** → The "tunable from a single constant" contract and the percentages-are-tunable scenario still hold. Any future change updates the same one constant and the same two spec scenarios.
- **[Spec-vs-code drift if the sync is skipped]** → The archive step applies the delta to the main spec; if skipped, the spec would encode the old values. The default archive path syncs.
