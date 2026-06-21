## MODIFIED Requirements

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
