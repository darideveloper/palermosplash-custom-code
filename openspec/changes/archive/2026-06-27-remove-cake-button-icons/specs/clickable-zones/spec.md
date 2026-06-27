## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Button label is centered within the button

The `.palermo-btn-label` element inside each `.cake-button` SHALL be centered both horizontally and vertically within the button. Horizontal centering SHALL be achieved by the flex parent's `justify-content: center` and SHALL be reinforced by `text-align: center` on the label itself so wrapped text remains centered. Vertical centering SHALL be achieved by the flex parent's `align-items: center`.

#### Scenario: Single-line label is centered

- **WHEN** the page is rendered and the button's `shortName` fits on one line
- **THEN** the `.palermo-btn-label` SHALL be visually centered horizontally within `.cake-button`
- **AND** the `.palermo-btn-label` SHALL be visually centered vertically within `.cake-button`

#### Scenario: Label element declares text-align center

- **WHEN** the computed style of `.palermo-btn-label` is inspected
- **THEN** `text-align` SHALL resolve to `center`
