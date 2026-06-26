## ADDED Requirements
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
