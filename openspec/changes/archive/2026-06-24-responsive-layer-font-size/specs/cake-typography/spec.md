## MODIFIED Requirements

### Requirement: Cake-zone button labels use Dancing Script

The `.palermo-btn-label` element (text inside each `.cake-button` zone) MUST render in Dancing Script at weight 700. The rule MUST NOT declare its own `font-size` so the label inherits the viewport-relative size of its `.cake-button` parent (see `responsive-layer-typography`). The `font-family` declaration MUST include `cursive` as the final fallback so the script style is preserved if the network font fails to load.

#### Scenario: Button label displays in Dancing Script
- **WHEN** a `.cake-button` is rendered on the page and Dancing Script has loaded
- **THEN** the text inside `.palermo-btn-label` is rendered in Dancing Script at 700 weight and the `.palermo-btn-label` rule does not contain a `font-size` declaration

#### Scenario: Button label retains script style on font load failure
- **WHEN** Dancing Script fails to load for any reason
- **THEN** `.palermo-btn-label` text is rendered in the OS `cursive` fallback font, never in a generic sans-serif

#### Scenario: Button label computed size follows viewport height
- **WHEN** the viewport height is resized
- **THEN** the computed `font-size` of `.palermo-btn-label` changes in proportion to viewport height because it inherits from the `.cake-button` parent that uses a viewport-relative unit
