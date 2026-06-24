## ADDED Requirements

### Requirement: Brand logo placement
The system MUST position the `#logo img` element as a fixed element pinned to the top-right corner of the viewport with a 15px offset from the top and right edges.

#### Scenario: Logo is anchored to top-right
- **WHEN** the cake-visual page is rendered
- **THEN** the logo appears at the top-right of the viewport and stays in that position as the page scrolls

### Requirement: Brand logo size
The system MUST size the `#logo img` element at 200px wide with height auto, preserving the source image's aspect ratio.

#### Scenario: Logo width is 200px and proportional
- **WHEN** the cake-visual page is rendered
- **THEN** the rendered logo is exactly 200px wide and its height is computed proportionally from the source image

### Requirement: Brand logo visual integration
The system MUST apply `mix-blend-mode: overlay` to the `#logo img` element so the logo visually integrates with the illustrated background instead of sitting on top as a solid rectangle.

#### Scenario: Logo blends with background
- **WHEN** the cake-visual page is rendered over the illustrated cake composition
- **THEN** the logo's tones mix with the underlying pixels rather than overlaying as an opaque block

### Requirement: Brand logo does not block interaction
The system MUST stack the `#logo img` element behind all other page content (z-index: -1) so it cannot intercept clicks, hovers, or pointer events on the interactive cake zones or text hover overlays.

#### Scenario: Click reaches the cake zone underneath the logo
- **WHEN** a user clicks at the screen coordinates where the logo is rendered
- **THEN** the click event is delivered to the underlying interactive element (cake zone or text overlay) and is not captured by the logo

### Requirement: CSS section comment for brand logo
The system MUST include a `/* brand logo */` section comment immediately before the `#logo img` rule block in `palermo-cake/palermo-cake.css` to keep the file's sections explicit.

#### Scenario: File sections are scannable
- **WHEN** a developer opens `palermo-cake/palermo-cake.css`
- **THEN** the brand logo block is preceded by a `/* brand logo */` comment that marks the section boundary
