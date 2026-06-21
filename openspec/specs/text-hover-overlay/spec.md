# text-hover-overlay Specification

## Purpose
TBD - created by archiving change text-hover-overlay. Update Purpose after archive.
## Requirements
### Requirement: Texts are split per cake layer

Each cake layer label SHALL be a separate `.text` element with ID `text-1` through `text-5`, positioned independently (not as a single composite image).

#### Scenario: Individual text elements exist
- **WHEN** DOM content is loaded
- **THEN** elements `#text-1`, `#text-2`, `#text-3`, `#text-4`, `#text-5` SHALL exist in the DOM

### Requirement: Text elements are duplicated as overlays

On DOMContentLoaded, each `.text` element SHALL be cloned and the clone SHALL be inserted immediately after the original. The clone SHALL have class `.over` and ID `text-{N}-over`.

#### Scenario: Overlay elements created
- **WHEN** DOM content is loaded
- **THEN** for each `#text-N`, an element `#text-N-over` SHALL exist
- **AND** each `#text-N-over` SHALL have class `over`

### Requirement: Base text is semi-transparent

The base `.text` elements SHALL use `mix-blend-mode: color-burn` with `opacity: 0.8` at `z-index: 2`, allowing glow effects at `z-index: 1` to be partially visible through the text.

#### Scenario: Base text styling
- **WHEN** any `.text` element is rendered
- **THEN** it SHALL have `mix-blend-mode: color-burn; opacity: 0.8; z-index: 2`

### Requirement: Overlay text is hidden by default, revealed on hover

The `.text.over` elements SHALL have `opacity: 0; z-index: 4` with `mix-blend-mode: darken` and `pointer-events: none`. When the corresponding clickable zone is hovered, the overlay SHALL receive `.visible` class and transition to `opacity: 1`.

#### Scenario: Overlay hidden by default
- **WHEN** page loads
- **THEN** all `.text.over` elements SHALL have `opacity: 0`

#### Scenario: Overlay revealed on hover
- **WHEN** `#button-3` is hovered
- **THEN** `#text-3-over` SHALL receive class `visible` and transition to `opacity: 1`

