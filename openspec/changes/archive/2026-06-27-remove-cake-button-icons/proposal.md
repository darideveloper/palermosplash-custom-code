## Why

The five cake map hot-spot buttons currently render an emoji icon alongside each label. The icons are decorative duplicates of information already carried by the labels and shown again in the popup. Removing them from the map buttons gives the labels room to breathe, improves typographic hierarchy on the cake illustration, and simplifies the visual blend between text and cake layer. The icons remain inside the popup card, where they reinforce the layer's identity alongside title, description, and CTA.

## What Changes

- **`palermo-cake/palermo-cake.js`** — stop creating the `.palermo-btn-icon` element when each `.cake-button` is built. Only the `.palermo-btn-label` element is appended to the button.
- **`palermo-cake/palermo-cake.css`** — add `text-align: center;` to `.palermo-btn-label` so the label is centered as text (the flex parent already centers single-line children horizontally and vertically; `text-align: center` is a defensive guard for any future wrap). Existing `.palermo-btn-icon` selector and the `.cake-button:hover .palermo-btn-icon` branch are kept in place and annotated as unused, so a future restore requires only removing the comment.

No data file changes. No popup changes. `PALERMO_CAKE_DATA[*].icon` is still consumed by the popup builder.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `clickable-zones`: the "Each button renders an icon and a short name" requirement is tightened to label-only on the map button. The icon+label blend-mode scenario and the hover-scale requirement lose the icon leg. Popup icon rendering is unaffected (covered by `layer-info-popup`).

## Impact

- **Files edited:** `palermo-cake/palermo-cake.js`, `palermo-cake/palermo-cake.css`.
- **Files NOT edited:** `palermo-cake/palermo-cake-data.js` (popup still reads `data.icon`); popup builder code in `palermo-cake.js`; `.palermo-popup*` CSS rules.
- **Runtime:** the 5 dynamically created `.cake-button` divs become single-child flex containers. No layout shift: button bounding box (`width: 53vw; height: 11vh` in landscape, `100vw` in portrait) is fixed by CSS, so the blended area over the cake image is unchanged.
- **Accessibility:** no ARIA impact (the removed span was non-semantic and had no aria attributes). Labels remain the only accessible name of each button.
- **No new dependencies, no build, no WP backend changes.**
