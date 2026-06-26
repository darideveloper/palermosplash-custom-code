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

Each `.cake-button` SHALL contain an icon element and a label element, populated from `PALERMO_CAKE_DATA[i-1]` where `i` is the button's numeric suffix. The icon SHALL display the entry's `icon` field and the label SHALL display the entry's `shortName` field.

The `.cake-button` element itself SHALL use `mix-blend-mode: color-burn` so the icon and label inside it visually integrate with the cake illustration beneath the button, producing an effect as if the text and icon are burned into the cake layer.

#### Scenario: Button content matches its data entry
- **WHEN** DOM content is loaded and `PALERMO_CAKE_DATA` is defined
- **THEN** each `#button-i` SHALL contain an icon element whose text content is `PALERMO_CAKE_DATA[i-1].icon`
- **AND** each `#button-i` SHALL contain a label element whose text content is `PALERMO_CAKE_DATA[i-1].shortName`

#### Scenario: Button text and icon blend with the cake illustration
- **WHEN** the cake-visual page is rendered with the cake illustration visible
- **THEN** each `.cake-button` SHALL have `mix-blend-mode: color-burn`
- **AND** the text and icon inside the button SHALL appear to be part of the cake layer rather than sitting on top as solid text

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

When the user hovers over a `.cake-button`, the icon and label elements inside SHALL scale up to `1.05` of their normal size, with a smooth CSS transition. When the user moves the mouse away, the scale SHALL return to `1` (no scale).

#### Scenario: Hover scales the text and icon
- **WHEN** the mouse enters `#button-3`
- **THEN** the `.palermo-btn-icon` inside `#button-3` SHALL have `transform: scale(1.05)`
- **AND** the `.palermo-btn-label` inside `#button-3` SHALL have `transform: scale(1.05)`

#### Scenario: Mouse leave restores the text and icon scale
- **WHEN** the mouse leaves `#button-3`
- **THEN** the `.palermo-btn-icon` inside `#button-3` SHALL have `transform` not equal to `scale(1.05)`
- **AND** the `.palermo-btn-label` inside `#button-3` SHALL have `transform` not equal to `scale(1.05)`

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

