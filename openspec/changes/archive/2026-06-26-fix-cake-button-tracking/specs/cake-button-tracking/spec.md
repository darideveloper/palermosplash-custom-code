# cake-button-tracking Specification

## Purpose
TBD - created by archiving change fix-cake-button-tracking. Update Purpose after archive.
## ADDED Requirements
### Requirement: Layer buttons are positioned by tracking the cake image's bounding rect

After the cake image has loaded, the system SHALL position each `.cake-button` by reading the cake image's `getBoundingClientRect()` and computing the button's `top` and `left` from a per-orientation table of layer percentages applied to the cake's height and width. The cake image SHALL be the sole positioning reference; the viewport SHALL NOT determine button Y. The computed `top` SHALL be offset by `± buttonHeight / 2` so that the button's center, not its top edge, lands on the layer's Y coordinate; the sign of the offset is `+` in vertical mode and `-` in horizontal mode.

#### Scenario: Initial position after cake loads
- **WHEN** `palermo-cake.js` runs and the cake image has finished loading
- **THEN** each `#button-N` SHALL have an inline `top` value in pixels
- **AND** each `#button-N` SHALL have an inline `left` value in pixels
- **AND** the inline `left` of `#button-N` SHALL equal `cakeRect.left + cakeRect.width / 2`
- **AND** the inline `top` of `#button-N` SHALL equal `cakeRect.top + cakeRect.height * LAYER_PERCENTAGES[orientation][N]` plus `+ buttonHeight / 2` in vertical mode or `- buttonHeight / 2` in horizontal mode
- **AND** the inline `bottom` of `#button-N` SHALL be set to `auto` so the CSS `vh` fallback is no longer authoritative

#### Scenario: Orientation change repositions buttons
- **WHEN** the `<body>` class changes from `vertical` to `horizontal` (or vice versa)
- **THEN** each `#button-N` SHALL be repositioned using `LAYER_PERCENTAGES` for the new orientation
- **AND** the previous orientation's percentages SHALL NOT be used after the class change

#### Scenario: Window resize repositions buttons
- **WHEN** the window is resized (e.g. URL bar collapse, device rotation, split-view resize)
- **THEN** each `#button-N` SHALL be repositioned against the cake's new rect within one animation frame

#### Scenario: Cake image resizes for any other reason
- **WHEN** the cake image's rendered size changes without a window resize (e.g. a CSS-driven ancestor reflow, a font-load reflow, a parent layout shift)
- **THEN** a `ResizeObserver` on the cake image SHALL trigger a reposition
- **AND** each `#button-N` SHALL be repositioned against the cake's new rect

#### Scenario: Buttons are positioned once after being appended
- **WHEN** the 5 `.cake-button` elements have been appended to `<body>` inside the `DOMContentLoaded` callback
- **THEN** `positionButtons()` SHALL be called once explicitly before the popup element is created
- **AND** each `#button-N` SHALL already have an inline `top` and `left` before any popup-open code can read button rects

### Requirement: Per-orientation layer percentage table is defined in JS

The system SHALL define a `LAYER_PERCENTAGES` constant in `palermo-cake.js` with two entries, one per orientation (`vertical` and `horizontal`). Each entry SHALL map button index (1..5) to a number in the range 0..1 representing the button's Y position as a fraction of the cake's height, measured from the top of the cake. Button 1 (Custom Cakes) corresponds to the bottom layer of the cake; button 5 (Cafe) corresponds to the top layer. The `vertical` and `horizontal` entries MAY carry the same values; the table shape SHALL remain orientation-keyed so the code path stays orientation-aware.

#### Scenario: Vertical orientation percentages
- **WHEN** `<body>` has class `vertical`
- **THEN** `LAYER_PERCENTAGES.vertical[1]` SHALL be approximately 0.93
- **AND** `LAYER_PERCENTAGES.vertical[2]` SHALL be approximately 0.78
- **AND** `LAYER_PERCENTAGES.vertical[3]` SHALL be approximately 0.61
- **AND** `LAYER_PERCENTAGES.vertical[4]` SHALL be approximately 0.44
- **AND** `LAYER_PERCENTAGES.vertical[5]` SHALL be approximately 0.27

#### Scenario: Horizontal orientation percentages
- **WHEN** `<body>` has class `horizontal`
- **THEN** `LAYER_PERCENTAGES.horizontal[1]` SHALL be approximately 0.93
- **AND** `LAYER_PERCENTAGES.horizontal[2]` SHALL be approximately 0.78
- **AND** `LAYER_PERCENTAGES.horizontal[3]` SHALL be approximately 0.61
- **AND** `LAYER_PERCENTAGES.horizontal[4]` SHALL be approximately 0.44
- **AND** `LAYER_PERCENTAGES.horizontal[5]` SHALL be approximately 0.27

#### Scenario: Percentages are tunable
- **WHEN** a developer changes a value in `LAYER_PERCENTAGES`
- **THEN** the next call to `positionButtons()` SHALL use the new value
- **AND** no other constant or CSS rule SHALL need to change

### Requirement: Position is centered horizontally on the cake

Each button's inline `left` SHALL be the horizontal center of the cake image (in viewport pixels). Combined with the existing `transform: translate(-50%, 0)` on `.cake-button`, the button is visually centered on the cake regardless of the cake's rendered width.

#### Scenario: Button left matches cake horizontal center
- **WHEN** the cake image has rendered at any width
- **THEN** the inline `left` of each `#button-N` SHALL equal `cakeRect.left + cakeRect.width / 2`

### Requirement: Button center, not top edge, is anchored to the layer Y

The percentage table gives the Y coordinate of the layer center measured from the top of the cake. Because `style.top` positions the button's top edge, `positionButtons()` SHALL shift the computed `top` by `± buttonHeight / 2` so that the button's visual center lands on the layer Y. The sign SHALL be `+` in vertical mode and `-` in horizontal mode.

#### Scenario: Vertical-mode offset
- **WHEN** `<body>` has class `vertical` and `positionButtons()` runs
- **THEN** the inline `top` of each `#button-N` SHALL equal `cakeRect.top + cakeRect.height * pct + btnRect.height / 2`

#### Scenario: Horizontal-mode offset
- **WHEN** `<body>` has class `horizontal` and `positionButtons()` runs
- **THEN** the inline `top` of each `#button-N` SHALL equal `cakeRect.top + cakeRect.height * pct - btnRect.height / 2`

### Requirement: Buttons do not use viewport-relative units for Y position

After the initial `positionButtons()` call, the button's Y position SHALL be determined by the cake image's rect, not by any viewport unit (`vh`, `dvh`, `svh`, `lvh`, or percent of viewport height). The existing `bottom: <vh>` rules in `palermo-cake.css` SHALL remain only as a fallback for the brief window between `DOMContentLoaded` and the first `positionButtons()` run.

#### Scenario: Inline style overrides CSS vh rule
- **WHEN** `positionButtons()` has run at least once
- **THEN** each `#button-N` SHALL have a non-empty inline `top` value in pixels
- **AND** the inline `top` value SHALL take precedence over the CSS `bottom: <vh>` rule in the cascade

#### Scenario: Fallback vh rules remain in the stylesheet
- **WHEN** `palermo-cake.css` is loaded
- **THEN** the `.horizontal .cake-button#button-N` and `.vertical .cake-button#button-N` rules SHALL still declare `bottom: <vh>` values
- **AND** the declared values SHALL match the legacy positions (horizontal: 23, 35, 46, 58, 70.5 vh; vertical: 9, 19.5, 30, 41, 52 vh)

### Requirement: Resize handler is debounced via requestAnimationFrame

The window `resize` handler SHALL be coalesced through a single `requestAnimationFrame` request. If multiple `resize` events arrive within the same frame, only one reposition SHALL be scheduled for that frame.

#### Scenario: Multiple resize events in one frame
- **WHEN** the window fires multiple `resize` events within a single animation frame
- **THEN** `positionButtons()` SHALL be called no more than once for that frame

### Requirement: ResizeObserver target is the cake image

The system SHALL attach a `ResizeObserver` to the main cake image element resolved by `getCakeImage()` (the `<img>` inside `#main-cake`, or the first non-glow `<img>` child of `#cake-parts` when `#main-cake` is absent). The observer SHALL call `positionButtons()` on every observed resize of the target element. The observer creation SHALL be guarded by a `typeof ResizeObserver !== 'undefined'` check.

#### Scenario: Observer is attached to the main cake image
- **WHEN** `palermo-cake.js` runs and `ResizeObserver` is defined
- **THEN** a `ResizeObserver` SHALL be created
- **AND** the observer's `observe()` method SHALL be called with the main cake image element
- **AND** the glow images inside `.glow` elements (or elements whose id starts with `glow-`) SHALL NOT be observed

#### Scenario: Observed cake resize triggers reposition
- **WHEN** the `ResizeObserver` callback fires because the cake image's rendered size changed
- **THEN** `positionButtons()` SHALL be called
- **AND** each `#button-N` SHALL be repositioned against the new cake rect

### Requirement: Buttons remain clickable after repositioning

After `positionButtons()` runs, each button SHALL still receive click events. The button's `pointer-events` and `z-index` SHALL NOT be altered by the positioning code.

#### Scenario: Click handler still fires
- **WHEN** a user clicks `#button-N` after `positionButtons()` has run
- **THEN** the existing click handler SHALL open the popup for layer N (or no-op if already active)
