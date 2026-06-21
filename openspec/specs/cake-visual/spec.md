# cake-visual Specification

## Purpose
TBD - created by archiving change cake-visual-clickable-zones. Update Purpose after archive.
## Requirements
### Requirement: Cake image renders at viewport bottom

The cake image SHALL be positioned at the bottom center of the viewport using fixed positioning. It SHALL span the full viewport width in portrait mode and full viewport height in landscape mode.

#### Scenario: Landscape orientation
- **WHEN** viewport width >= height
- **THEN** `<body>` SHALL have class `horizontal`
- **AND** cake image SHALL use `height: 100vh` with `width: auto`

#### Scenario: Portrait orientation
- **WHEN** viewport width < height
- **THEN** `<body>` SHALL have class `vertical`
- **AND** cake image SHALL use `height: 90%` with `width: auto`

### Requirement: Orientation class is set on load and on resize

The system SHALL detect viewport orientation on page load and whenever the viewport is resized, and SHALL apply `.horizontal` or `.vertical` class to `<body>` accordingly.

#### Scenario: Page load
- **WHEN** page loads in landscape viewport
- **THEN** `<body>` SHALL have class `horizontal` immediately

#### Scenario: Window resize changes orientation
- **WHEN** viewport resizes from portrait to landscape
- **THEN** `<body>` SHALL class change from `vertical` to `horizontal`

### Requirement: Glow effects animate on visible class

The CSS zoom animation SHALL be removed. Glow effects SHALL still transition opacity on `.visible` class toggle but SHALL NOT animate with a keyframe loop.

Glow overlay images SHALL have `opacity: 0` by default and SHALL transition to `opacity: 1` when their parent `.glow` element receives the `.visible` class. No keyframe animation SHALL be applied.

#### Scenario: Glow becomes visible
- **WHEN** `.glow.visible` class is applied
- **THEN** child `<img>` SHALL have `opacity: 1`
- **AND** SHALL NOT animate with any keyframe animation

#### Scenario: Glow hidden
- **WHEN** `.visible` class is removed from `.glow`
- **THEN** child `<img>` SHALL transition back to `opacity: 0` over 1 second

