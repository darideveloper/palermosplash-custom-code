# loading-state Specification

## Purpose
TBD - created by archiving change add-loading-spinner. Update Purpose after archive.
## Requirements
### Requirement: Loader overlay is visible on first paint
The loader overlay SHALL be present in the DOM at first paint, before any JavaScript executes, so that the page never shows unstyled content between render and JS wiring.

#### Scenario: HTML widget contains loader markup
- **WHEN** the landing page HTML is served
- **THEN** the first Elementor element on the page contains a `<div class="palermo-loader">` with an inline SVG child and no other siblings

#### Scenario: CSS paints overlay over content immediately
- **WHEN** the browser parses `palermo-loader.css`
- **THEN** the `.palermo-loader` element is rendered as a fixed full-viewport white layer at `z-index: 100000`, covering all other page content

### Requirement: Loader icon is a true-black 3-tier cake
The loader SHALL display a 3-tier cake silhouette rendered as inline SVG. The icon SHALL be true black (not gray, not colored), SHALL scale crisply at any size, and SHALL require no external HTTP request to render.

#### Scenario: Icon color is black
- **WHEN** the loader is rendered
- **THEN** the SVG fills with `#000` (or computed equivalent) via `fill: currentColor` on a `color: #000` parent

#### Scenario: Icon is inline SVG
- **WHEN** the loader HTML is inspected
- **THEN** the icon is an `<svg>` element directly inside `.palermo-loader` with no `<img>` tag, no CSS `background-image` URL, and no font-icon class

### Requirement: Cake icon animates with a wobble effect
The cake icon SHALL perform a continuous wobble animation (rotating back and forth between two angles) and SHALL NOT perform a full 360° rotation. The animation SHALL be implemented entirely in CSS, SHALL respect `prefers-reduced-motion: reduce`, and SHALL pivot around the base of the cake (not its center) to avoid a "falling" visual.

#### Scenario: Wobble is pure CSS
- **WHEN** the page is loaded with JavaScript disabled
- **THEN** the cake icon still wobbles continuously (animation defined in CSS, not JS)

#### Scenario: Pivot is at the base
- **WHEN** the cake rotates during the wobble
- **THEN** the rotation point is the bottom of the icon (transform-origin set so the base stays visually anchored)

#### Scenario: Wobble angle stays within ±15 degrees
- **WHEN** the wobble keyframes are inspected
- **THEN** no keyframe specifies an absolute rotation angle greater than 15 degrees in either direction

#### Scenario: Reduced motion disables animation
- **WHEN** the user has `prefers-reduced-motion: reduce` set in their OS
- **THEN** the cake icon is rendered statically with no rotation animation

### Requirement: Loader retires after page resources finish loading
The loader SHALL fade out and become non-interactive once the browser's `load` event has fired (i.e., all images and sub-resources have completed). The retirement SHALL be triggered by adding a single CSS class to `<body>` via a minimal JavaScript listener. No JavaScript SHALL be required for the loader to be visible; JavaScript SHALL only be required to retire it.

#### Scenario: window.load triggers retirement
- **WHEN** the browser dispatches the `load` event on `window`
- **THEN** the `<body>` element receives the class `palermo-ready` within the same event tick

#### Scenario: Retired loader fades out
- **WHEN** `<body>` has the class `palermo-ready`
- **THEN** `.palermo-loader` transitions to `opacity: 0` over no more than 500ms

#### Scenario: Retired loader does not block clicks
- **WHEN** `<body>` has the class `palermo-ready`
- **THEN** `.palermo-loader` has `pointer-events: none`, so clicks pass through to the buttons underneath

### Requirement: Loader exposes its state to assistive technology
The loader SHALL be announced to screen readers as a status region. Once retired, the loader SHALL be removed from the accessibility tree so it is not re-announced on focus changes.

#### Scenario: Loader is a status region
- **WHEN** the loader HTML is inspected
- **THEN** `.palermo-loader` has `role="status"` (or equivalent live region attribute) and a descriptive `aria-label`

#### Scenario: Retired loader is hidden from AT
- **WHEN** `<body>` has the class `palermo-ready`
- **THEN** `.palermo-loader` has `aria-hidden="true"` (applied via CSS `[hidden]` or via a class-scoped selector)

### Requirement: Loader uses project's CSS class prefix convention
All CSS selectors added by this feature SHALL begin with `.palermo-` to avoid conflicts with Elementor-generated class names. No global selectors (e.g., bare `body`, `html`, `*`) SHALL be introduced by the loader stylesheet.

#### Scenario: Selectors are scoped
- **WHEN** `palermo-loader.css` is grepped for selector lines
- **THEN** every selector begins with `.palermo-` or is a `@` rule (keyframes, media queries)

