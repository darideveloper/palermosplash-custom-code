## ADDED Requirements

### Requirement: Five clickable zones are created dynamically

The system SHALL generate 5 `div` elements with class `cake-button` and IDs `button-1` through `button-5` on DOMContentLoaded. Each SHALL be appended to `<body>`.

#### Scenario: Buttons exist after page load
- **WHEN** DOM content is loaded
- **THEN** 5 `div.cake-button` elements SHALL exist in the DOM
- **AND** their IDs SHALL be `button-1`, `button-2`, `button-3`, `button-4`, `button-5`

### Requirement: Each button aligns to a cake layer

Each `.cake-button` SHALL be positioned via CSS using viewport-relative units to overlay a specific section of the cake image. Positioning SHALL differ between `.horizontal` and `.vertical` orientations.

#### Scenario: Horizontal button positions
- **WHEN** `<body>` has class `horizontal`
- **THEN** `#button-1` SHALL be at `bottom: 24vh`
- **AND** `#button-2` at `bottom: 35vh`
- **AND** `#button-3` at `bottom: 46vh`
- **AND** `#button-4` at `bottom: 58vh`
- **AND** `#button-5` at `bottom: 70vh`

#### Scenario: Vertical button positions
- **WHEN** `<body>` has class `vertical`
- **THEN** `#button-1` SHALL be at `bottom: 9vh`
- **AND** `#button-2` at `bottom: 19vh`
- **AND** `#button-3` at `bottom: 30vh`
- **AND** `#button-4` at `bottom: 41vh`
- **AND** `#button-5` at `bottom: 52vh`

### Requirement: Button hover triggers glow visibility

Hovering over each `.cake-button` SHALL add class `.visible` to the corresponding `#glow-N` element. Leaving SHALL remove the class.

#### Scenario: Hover activates glow
- **WHEN** mouse enters `#button-3`
- **THEN** `#glow-3` SHALL receive class `visible`

#### Scenario: Mouse leave deactivates glow
- **WHEN** mouse leaves `#button-3`
- **THEN** `#glow-3` SHALL have class `visible` removed
