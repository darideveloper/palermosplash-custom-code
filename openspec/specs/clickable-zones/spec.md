# clickable-zones Specification

## Purpose
TBD - created by archiving change cake-visual-clickable-zones. Update Purpose after archive.
## Requirements
### Requirement: Five clickable zones are created dynamically

The system SHALL generate 5 `div` elements with class `cake-button` and IDs `button-1` through `button-5` on DOMContentLoaded. Each SHALL be appended to `<body>`.

#### Scenario: Buttons exist after page load
- **WHEN** DOM content is loaded
- **THEN** 5 `div.cake-button` elements SHALL exist in the DOM
- **AND** their IDs SHALL be `button-1`, `button-2`, `button-3`, `button-4`, `button-5`

### Requirement: Button hover triggers glow visibility

Hovering over each `.cake-button` SHALL add class `.visible` to the corresponding `#glow-N` element. Leaving SHALL remove the class. Hovering SHALL NOT toggle any text-overlay element (the text-hover-overlay system is removed).

#### Scenario: Hover activates only the glow
- **WHEN** mouse enters `#button-3`
- **THEN** `#glow-3` SHALL receive class `visible`
- **AND** no `#text-N-over` element SHALL receive or lose any class as a result

#### Scenario: Mouse leave deactivates the glow
- **WHEN** mouse leaves `#button-3`
- **THEN** `#glow-3` SHALL have class `visible` removed

### Requirement: Each button renders an icon and a short name

Each `.cake-button` SHALL contain a single label element populated from `PALERMO_CAKE_DATA[i-1]` where `i` is the button's numeric suffix. The label SHALL display the entry's `shortName` field. The button SHALL NOT contain an icon element on the map.

The `.cake-button` element itself SHALL continue to use `mix-blend-mode: color-burn` so the label inside it visually integrates with the cake illustration beneath the button, producing an effect as if the text is burned into the cake layer.

#### Scenario: Button content matches its data entry (label only)

- **WHEN** DOM content is loaded and `PALERMO_CAKE_DATA` is defined
- **THEN** each `#button-i` SHALL contain a label element whose text content is `PALERMO_CAKE_DATA[i-1].shortName`
- **AND** each `#button-i` SHALL NOT contain any `.palermo-btn-icon` element as a direct or nested child

#### Scenario: Button label blends with the cake illustration

- **WHEN** the cake-visual page is rendered with the cake illustration visible
- **THEN** each `.cake-button` SHALL have `mix-blend-mode: color-burn`
- **AND** the label inside the button SHALL appear to be part of the cake layer rather than sitting on top as solid text

#### Scenario: Click on a button opens the popup for that layer

- **WHEN** the user clicks `#button-2`
- **THEN** the system SHALL open the popup for layer 2 (governed by the `layer-info-popup` capability)

#### Scenario: Click on the active button is a no-op

- **WHEN** the popup is open for layer 2
- **AND** the user clicks `#button-2` again
- **THEN** the popup SHALL remain open and unchanged

### Requirement: Each button has an active state while its layer's popup is open

When the popup for a layer is open, the corresponding `.cake-button` SHALL have the class `is-active` applied to it. The class SHALL be removed when the popup is closed or when a different layer becomes active.

#### Scenario: Active state on the open layer
- **WHEN** the popup is open for layer 4
- **THEN** `#button-4` SHALL have the class `is-active`
- **AND** no other `.cake-button` SHALL have the class `is-active`

#### Scenario: Active state cleared on close
- **WHEN** the popup is open for layer 4
- **AND** the user dismisses the popup
- **THEN** `#button-4` SHALL NOT have the class `is-active`

### Requirement: Button text and icon scale up on hover

When the user hovers over a `.cake-button`, the label element inside SHALL scale up to `1.05` of its normal size, with a smooth CSS transition. When the user moves the mouse away, the scale SHALL return to `1` (no scale). The button SHALL no longer contain an icon element, so no icon scale is expected or required.

#### Scenario: Hover scales the label

- **WHEN** the mouse enters `#button-3`
- **THEN** the `.palermo-btn-label` inside `#button-3` SHALL have `transform: scale(1.05)`

#### Scenario: Mouse leave restores the label scale

- **WHEN** the mouse leaves `#button-3`
- **THEN** the `.palermo-btn-label` inside `#button-3` SHALL have `transform` not equal to `scale(1.05)`

#### Scenario: No icon element is present to scale

- **WHEN** the mouse enters any `.cake-button`
- **THEN** the button SHALL contain no `.palermo-btn-icon` element to scale
- **AND** no scale transition SHALL be applied to a missing icon child

### Requirement: Layer buttons are created dynamically in JS

The 5 layer button elements (`#button-1` through `#button-5`) SHALL be created on `DOMContentLoaded` by `palermo-cake.js` (one `<div class="cake-button" id="button-N">` per layer, appended to `<body>`). The Elementor HTML SHALL NOT need to contain pre-existing placeholder button divs.

#### Scenario: Buttons exist after the main script runs
- **WHEN** `palermo-cake.js` runs after `DOMContentLoaded` and `PALERMO_CAKE_DATA` is defined
- **THEN** elements `#button-1`, `#button-2`, `#button-3`, `#button-4`, `#button-5` SHALL exist in the DOM
- **AND** each SHALL be a `<div>` with class `cake-button`
- **AND** each SHALL be a child of `<body>`

#### Scenario: Buttons not created when data is missing
- **WHEN** `palermo-cake.js` runs but `PALERMO_CAKE_DATA` is undefined
- **THEN** no `#button-N` elements SHALL be created
- **AND** the page SHALL NOT have any `.cake-button` elements

### Requirement: Button positioning tracks the cake image

The `.cake-button` elements SHALL be positioned to track the cake image's rendered bounding rect, expressed as a percentage of the cake's height and a horizontal-center anchor on the cake. The per-orientation positioning SHALL be implemented in `palermo-cake.js` (via the `cake-button-tracking` capability) and SHALL produce a layer-aligned layout on every real device, regardless of system bars, URL bar collapse, or orientation. The computed `top` SHALL be offset by `± buttonHeight / 2` so the button's center lands on the layer Y; the sign is `+` in vertical mode and `-` in horizontal mode. The existing per-orientation `bottom: <vh>` rules in `palermo-cake.css` SHALL remain in effect as a fallback for the brief moment between `DOMContentLoaded` and the first `positionButtons()` run; they SHALL NOT be the authoritative positioning contract for the buttons.

#### Scenario: Initial position after page load
- **WHEN** the page loads on a real device in any orientation
- **THEN** each `.cake-button` SHALL be visually centered on a specific layer of the cake illustration
- **AND** the alignment SHALL NOT depend on the device's system bars or URL bar state
- **AND** the alignment SHALL be equivalent to the alignment seen in Chrome DevTools' responsive simulator for the same logical dimensions

#### Scenario: DevTools responsive simulator visual parity
- **WHEN** the page is viewed in Chrome DevTools' responsive simulator at a given device profile
- **THEN** the buttons SHALL align with the cake layers in the same way they did before this change
- **AND** the inline `top` set by `positionButtons()` SHALL be the active positioning for the buttons

#### Scenario: Orientation switch
- **WHEN** the viewport orientation changes
- **THEN** the buttons SHALL be repositioned using the orientation-specific percentage table
- **AND** the buttons SHALL remain aligned with their target cake layers after the switch

### Requirement: Button label is centered within the button

The `.palermo-btn-label` element inside each `.cake-button` SHALL be centered both horizontally and vertically within the button. Horizontal centering SHALL be achieved by the flex parent's `justify-content: center` and SHALL be reinforced by `text-align: center` on the label itself so wrapped text remains centered. Vertical centering SHALL be achieved by the flex parent's `align-items: center`.

#### Scenario: Single-line label is centered

- **WHEN** the page is rendered and the button's `shortName` fits on one line
- **THEN** the `.palermo-btn-label` SHALL be visually centered horizontally within `.cake-button`
- **AND** the `.palermo-btn-label` SHALL be visually centered vertically within `.cake-button`

#### Scenario: Label element declares text-align center

- **WHEN** the computed style of `.palermo-btn-label` is inspected
- **THEN** `text-align` SHALL resolve to `center`

