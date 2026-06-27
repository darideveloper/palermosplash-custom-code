## Context

The five `.cake-button` hot-spots on the Palermo splash page are dynamically created by `palermo-cake/palermo-cake.js` (loop at L77-127). Each button currently appends two children: a `.palermo-btn-icon` `<span>` populated with the emoji from `PALERMO_CAKE_DATA[i-1].icon`, and a `.palermo-btn-label` `<span>` populated with `PALERMO_CAKE_DATA[i-1].shortName`. The button container itself is `display: flex; align-items: center; justify-content: center; gap: 0.5em` and is anchored at `left: 50%` with `--btn-translate-x: -50%`, so the icon+label pair is centered as a group on the cake layer.

The icons are decorative duplicates of information already conveyed by the labels and rendered again inside the popup card (`.palermo-popup-icon` at `palermo-cake.js:159-162`). Removing the button-side icon improves typographic emphasis on the labels and reduces visual noise over the cake illustration while keeping the popup icon as the canonical visual identity for each layer.

Constraints (from project context):
- Vanilla CSS + JS only. No build, no framework.
- Elementor emits its own HTML wrappers — JS must keep working against those.
- `palermo-cake/palermo-cake-data.js` is shared with the popup and must NOT change.
- Popup builder code in `palermo-cake.js` (the `openPopup` function) and `.palermo-popup*` CSS rules are out of scope.

## Goals / Non-Goals

**Goals:**
- Each `.cake-button` renders only a label, no icon, in both landscape and portrait layouts.
- The label is centered horizontally (and vertically) within its button, robust to any future label wrap.
- The popup card continues to show the layer's icon, title, description, and CTA — unchanged.
- `data.icon` continues to flow from the data file to the popup builder without any plumbing change.
- Dead CSS for `.palermo-btn-icon` is preserved (not deleted) and annotated, so a future restore is trivial.

**Non-Goals:**
- Restyling the labels (font, weight, color, size). No visual change to the label itself.
- Changing button position, size, blend mode, or any layout property of the button container.
- Removing `PALERMO_CAKE_DATA[*].icon` from the data file.
- Touching the popup card or any other feature.
- Accessibility changes (the removed span was non-semantic with no aria attributes; removing it has no ARIA impact).

## Decisions

### Decision 1: Skip icon creation in JS, not hide it via CSS

**Choice:** Inside the `if (data)` block in `palermo-cake.js` (around L85-89), delete the four lines that build and append `iconEl`. Leave the label creation lines intact.

**Alternatives considered:**
- **CSS hide (`display: none` on `.palermo-btn-icon`):** rejected because it leaves a dead element in the DOM, wastes a tab stop, and creates a dead `:hover` branch in CSS. The JS-skip approach produces a cleaner DOM with no orphans.
- **Empty the icon text (`iconEl.textContent = ''`):** rejected as a worse version of the CSS hide — same dead DOM, uglier empty span.

**Rationale:** The icon span is generated solely by this one block; nothing else reads or references it. Removing the construction site is the smallest, most local change that achieves the goal.

### Decision 2: Keep `.palermo-btn-icon` CSS and the icon hover branch

**Choice:** Leave the `.palermo-btn-icon` rule (L110-114) and the `.cake-button:hover .palermo-btn-icon` branch (L125) in place. Annotate them with a brief comment marking them as unused-but-kept-for-future-restore.

**Rationale:** Per user direction, the dead CSS is preserved as defensive scaffolding. The cost is roughly 5 lines of commented-out-or-annotated CSS. The benefit is that restoring the icon later is a one-line JS change (un-delete the four lines) plus removing the annotation, with no CSS surgery.

### Decision 3: Add `text-align: center;` to `.palermo-btn-label`

**Choice:** Add a single `text-align: center;` declaration to the existing `.palermo-btn-label` rule.

**Rationale:** The flex parent (`align-items: center; justify-content: center`) already centers the single-child label both axes. `text-align: center` is a defensive guard for the (currently theoretical) case of a label that wraps to two lines — it ensures wrapped text stays centered rather than left-aligned within its box. Cost: one line. Benefit: future-proofs the "center the labels" intent.

### Decision 4: Do not touch `palermo-cake-data.js`

**Choice:** Leave the data file unchanged. The `icon` field is still consumed at `palermo-cake.js:161` (popup builder).

**Rationale:** Removing `data.icon` from the data file would be a coupling reduction in the wrong direction — it would force the popup builder to invent icons from `shortName` (e.g., title-case initials), which is a separate design decision and out of scope for this change.

## Risks / Trade-offs

- **[Risk] Reduced visual cue on the cake map.** The emoji icon currently acts as a quick-scan identifier next to the label. → **Mitigation:** The label is itself descriptive (`Custom Cakes`, `Wholesale`, `Cafe`, etc.) and remains a `Dancing Script` styled cue. The popup icon still anchors the visual identity. The cake image itself is the dominant visual.
- **[Risk] Dead CSS becomes confusing for future maintainers.** → **Mitigation:** A clear comment is added above the `.palermo-btn-icon` selector and the hover branch is commented inline as `(unused)`. The intent is obvious from context.
- **[Risk] Flex `gap: 0.5em` becomes a no-op with one child.** → **Mitigation:** Harmless. Left in place so the gap is restored automatically if the icon is ever re-added. Documented as part of the dead-CSS annotation.
- **[Risk] `text-align: center` is unnecessary for current single-line labels.** → **Mitigation:** True but the cost is negligible (one line, no runtime cost beyond a property application) and it future-proofs wrap behavior.
- **[Trade-off] Popup icon and button label are now visually decoupled on the map.** Acceptable — the popup is the canonical "expanded" view, and the map buttons are navigation hot-spots, not data displays.
