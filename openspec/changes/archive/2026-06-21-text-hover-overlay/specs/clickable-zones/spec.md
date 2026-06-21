## MODIFIED Requirements

### Requirement: Button hover triggers glow visibility

Hover SHALL trigger visibility on both the glow element AND the overlay text element simultaneously.

Hovering over each `.cake-button` SHALL add class `.visible` to both the corresponding `#glow-N` element AND the corresponding `#text-N-over` element. Leaving SHALL remove the class from both.

#### Scenario: Hover activates glow and text overlay
- **WHEN** mouse enters `#button-3`
- **THEN** `#glow-3` SHALL receive class `visible`
- **AND** `#text-3-over` SHALL receive class `visible`

#### Scenario: Mouse leave deactivates glow and text overlay
- **WHEN** mouse leaves `#button-3`
- **THEN** `#glow-3` SHALL have class `visible` removed
- **AND** `#text-3-over` SHALL have class `visible` removed
