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

### Requirement: Cake image is the position reference for clickable zones

The cake illustration SHALL be the position reference for the clickable layer zones. The viewport SHALL NOT determine the Y position of any layer zone after the first `positionButtons()` call. The cake image is resolved by `getCakeImage()`, which prefers the `<img>` inside the `#main-cake` Elementor widget and falls back to the first `<img>` child of `#cake-parts` that is not inside a `.glow` element and not inside an element whose id starts with `glow-`. If no candidate is found, the function returns `null` and positioning is skipped.

#### Scenario: Buttons are anchored to the cake rect
- **WHEN** `positionButtons()` has run at least once
- **THEN** the rendered position of each `.cake-button` SHALL be a function of the cake image's `getBoundingClientRect()`
- **AND** the rendered position SHALL NOT be a function of `window.innerHeight`, `vh`, `dvh`, `svh`, or `lvh`

#### Scenario: Cake image resizes are observed
- **WHEN** the cake image's rendered size changes for any reason and `ResizeObserver` is defined
- **THEN** a `ResizeObserver` SHALL detect the change
- **AND** `positionButtons()` SHALL be called to re-anchor the buttons

#### Scenario: Anchor source is the main cake image
- **WHEN** `getCakeImage()` runs
- **THEN** it SHALL return the `<img>` inside `#main-cake` if that widget is present
- **AND** otherwise it SHALL return the first `<img>` child of `#cake-parts` that is not inside a `.glow` element and not inside an element whose id starts with `glow-`
- **AND** if no candidate is found, it SHALL return `null` and `positionButtons()` SHALL no-op

