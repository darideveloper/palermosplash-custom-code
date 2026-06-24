## ADDED Requirements

### Requirement: Layer button container sets a viewport-relative font-size root

The `.cake-button` element (the clickable zone rendered over the cake illustration) MUST set its own `font-size` to a viewport-relative unit (`vh`) so that all text inside the button resolves against a scaling root. The value MUST be tied to viewport height so the layer text grows and shrinks with the screen, not with the surrounding paragraph text.

#### Scenario: Container declares a viewport-relative font-size
- **WHEN** `palermo-cake/palermo-cake.css` is loaded by the browser
- **THEN** the `.cake-button` rule declares a `font-size` whose unit is a viewport-relative unit (for example `vh`)

#### Scenario: Container font-size is independent of inherited body text
- **WHEN** the parent of `.cake-button` changes its `font-size` (for example a media query adjusts body text on a small viewport)
- **THEN** the computed `font-size` of `.cake-button` is determined by the viewport, not by the inherited cascade

### Requirement: Layer button label does not override the container size

The `.palermo-btn-label` element MUST NOT declare its own `font-size` (in any unit). It MUST inherit the `font-size` declared on its `.cake-button` parent so the label's text scales with the viewport-driven root.

#### Scenario: Label has no font-size declaration
- **WHEN** `palermo-cake/palermo-cake.css` is loaded
- **THEN** the `.palermo-btn-label` rule does not contain a `font-size` declaration

#### Scenario: Label computed size follows viewport height
- **WHEN** the viewport height is changed (for example the browser window is resized from 900px to 600px tall)
- **THEN** the computed `font-size` of `.palermo-btn-label` changes in proportion to the viewport height because it inherits from the `.cake-button` parent that uses a viewport-relative unit
