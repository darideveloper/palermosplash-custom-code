## MODIFIED Requirements

### Requirement: Per-orientation layer percentage table is defined in JS

The system SHALL define a `LAYER_PERCENTAGES` constant in `palermo-cake.js` with two entries, one per orientation (`vertical` and `horizontal`). Each entry SHALL map button index (1..5) to a number in the range 0..1 representing the button's Y position as a fraction of the cake's height, measured from the top of the cake. Button 1 (Custom Cakes) corresponds to the bottom layer of the cake; button 5 (Cafe) corresponds to the top layer. The `vertical` and `horizontal` entries SHALL carry the values 0.71, 0.60, 0.49, 0.37, 0.24 in that order (button index 1..5); the table shape SHALL remain orientation-keyed so the code path stays orientation-aware.

#### Scenario: Vertical orientation percentages
- **WHEN** `<body>` has class `vertical`
- **THEN** `LAYER_PERCENTAGES.vertical[1]` SHALL be approximately 0.71
- **AND** `LAYER_PERCENTAGES.vertical[2]` SHALL be approximately 0.60
- **AND** `LAYER_PERCENTAGES.vertical[3]` SHALL be approximately 0.49
- **AND** `LAYER_PERCENTAGES.vertical[4]` SHALL be approximately 0.37
- **AND** `LAYER_PERCENTAGES.vertical[5]` SHALL be approximately 0.24

#### Scenario: Horizontal orientation percentages
- **WHEN** `<body>` has class `horizontal`
- **THEN** `LAYER_PERCENTAGES.horizontal[1]` SHALL be approximately 0.71
- **AND** `LAYER_PERCENTAGES.horizontal[2]` SHALL be approximately 0.60
- **AND** `LAYER_PERCENTAGES.horizontal[3]` SHALL be approximately 0.49
- **AND** `LAYER_PERCENTAGES.horizontal[4]` SHALL be approximately 0.37
- **AND** `LAYER_PERCENTAGES.horizontal[5]` SHALL be approximately 0.24
