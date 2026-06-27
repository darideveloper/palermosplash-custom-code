## REMOVED Requirements

### Requirement: Brand logo placement
**Reason**: The logo is no longer displayed on the cake-visual page, so its placement, size, blend mode, and stacking behaviour are all moot. The `display: none` rule removes the element from rendering entirely.
**Migration**: If the logo is reintroduced in the future, a new OpenSpec change must re-establish placement, size, blend mode, and stacking rules for the live styling. The previous values are preserved as a commented reference in `palermo-cake/palermo-cake.css` for convenience but must not be treated as the current requirement.

### Requirement: Brand logo size
**Reason**: Same as above — the logo is hidden, so its rendered dimensions are irrelevant.
**Migration**: See `Brand logo placement` migration note.

### Requirement: Brand logo visual integration
**Reason**: The blend mode is no longer in effect because the element is hidden.
**Migration**: See `Brand logo placement` migration note.

### Requirement: Brand logo does not block interaction
**Reason**: Hiding the element via `display: none` removes it from the layout and pointer-event flow, so an explicit non-blocking stacking rule is unnecessary.
**Migration**: If the logo is ever shown again, the new change must re-establish the non-blocking requirement (e.g., `z-index: -1` plus the section comment marker).

## MODIFIED Requirements

### Requirement: CSS section comment for brand logo
The system MUST include a `/* brand logo */` section comment immediately before the `#logo` hide rule in `palermo-cake/palermo-cake.css` to keep the file's sections explicit. The same section must also contain the previous visible-styling block as a commented-out reference for easy reversion.

#### Scenario: File sections are scannable
- **WHEN** a developer opens `palermo-cake/palermo-cake.css`
- **THEN** the brand logo block is preceded by a `/* brand logo */` comment that marks the section boundary
- **AND** the previous live `#logo img` styling (width 250px / height auto / position fixed top-right / z-index -1 / mix-blend-mode overlay / min-width 25vw) is preserved inside the same section as a `/* ... */` comment block

## ADDED Requirements

### Requirement: Brand logo is hidden on the cake-visual page
The system MUST hide the `#logo` element on the cake-visual page by applying `display: none` to the Elementor-rendered wrapper in `palermo-cake/palermo-cake.css`. Hiding the wrapper (rather than only the inner `<img>`) MUST be used so the rule is robust to any tag Elementor renders inside the wrapper.

#### Scenario: Logo is not rendered
- **WHEN** the cake-visual page is rendered
- **THEN** no pixels of the `#logo` element (nor its descendants) appear in the viewport
- **AND** the `#logo` element is not focusable, clickable, or announced by assistive technology

### Requirement: Previous visible-styling block is preserved as a commented fallback
The system MUST preserve the previous `#logo img` rule block (width 250px, height auto, position fixed, top 15px, right 15px, z-index -1, mix-blend-mode overlay, min-width 25vw) as a `/* ... */` commented block inside the brand-logo section of `palermo-cake/palermo-cake.css`, immediately adjacent to the live `#logo { display: none; }` rule, so that re-showing the logo is a single, in-file edit.

#### Scenario: Fallback is recoverable without git history
- **WHEN** a developer wants to bring the brand logo back on the cake-visual page
- **THEN** the commented block in `palermo-cake/palermo-cake.css` contains every property needed to re-enable the previous look without referring to `git log` or external archives

### Requirement: Hide rule is scoped to the cake-visual feature
The system MUST place the hide rule in `palermo-cake/palermo-cake.css` (the feature-scoped stylesheet) and MUST NOT modify the child theme or any other stylesheet, so the hide applies only on pages where the cake-visual feature is enqueued and the rest of the site is unaffected.

#### Scenario: Other pages are not affected
- **WHEN** any page other than the cake-visual landing page is rendered
- **THEN** the `#logo` element is styled by the site's normal rules and is not hidden by the cake-feature CSS
