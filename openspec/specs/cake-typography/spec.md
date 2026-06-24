# cake-typography Specification

## Purpose
TBD - created by archiving change add-dancing-script-font. Update Purpose after archive.
## Requirements
### Requirement: Cake feature loads Dancing Script

The cake feature SHALL load the Dancing Script typeface from Google Fonts in weights 400 and 700, using a CSS `@import` at the top of `palermo-cake/palermo-cake.css`. The import URL MUST include `display=swap` so fallback fonts render immediately and the script font swaps in when loaded.

#### Scenario: Import statement present and correct
- **WHEN** `palermo-cake/palermo-cake.css` is loaded by the browser
- **THEN** the first non-comment line of the file is an `@import` rule pointing to `https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap`

#### Scenario: Network failure falls back gracefully
- **WHEN** `fonts.googleapis.com` is unreachable or blocks the request
- **THEN** the browser uses the next `cursive` font in the OS font stack and no broken-text glyphs appear

### Requirement: Cake-zone button labels use Dancing Script

The `.palermo-btn-label` element (text inside each `.cake-button` zone) MUST render in Dancing Script at weight 700 and size 1.4em. The `font-family` declaration MUST include `cursive` as the final fallback so the script style is preserved if the network font fails to load.

#### Scenario: Button label displays in Dancing Script
- **WHEN** a `.cake-button` is rendered on the page and Dancing Script has loaded
- **THEN** the text inside `.palermo-btn-label` is rendered in Dancing Script at 700 weight and 1.4em size

#### Scenario: Button label retains script style on font load failure
- **WHEN** Dancing Script fails to load for any reason
- **THEN** `.palermo-btn-label` text is rendered in the OS `cursive` fallback font, never in a generic sans-serif

### Requirement: Layer info popup title uses Dancing Script

The `.palermo-popup-title` element (heading inside the `palermo-popup` panel shown when a cake zone is clicked) MUST render in Dancing Script at weight 700 and size 1.8em. The `font-family` declaration MUST include `cursive` as the final fallback.

#### Scenario: Popup title displays in Dancing Script
- **WHEN** a `palermo-popup` is shown for any cake zone and Dancing Script has loaded
- **THEN** the heading inside `.palermo-popup-title` is rendered in Dancing Script at 700 weight and 1.8em size

#### Scenario: Popup title is readable on small viewports
- **WHEN** the viewport is 480px wide or narrower
- **THEN** the `.palermo-popup-title` font-size is reduced so the popup content does not overflow the visible area (target: 1.4em)

### Requirement: Script font is scoped to the cake feature

Dancing Script MUST only be applied to the two declared selectors (`.palermo-btn-label`, `.palermo-popup-title`). It MUST NOT be applied to body text, popup body copy (`.palermo-popup-desc`), popup buttons (`.palermo-popup-btn`), or any element outside the `palermo-cake` feature. Body and description text remain in the theme's default font for readability and accessibility.

#### Scenario: Other text elements are unaffected
- **WHEN** the page is rendered with Dancing Script loaded
- **THEN** elements with classes `.palermo-popup-desc`, `.palermo-popup-btn`, and any non-cake-feature text are rendered in the theme's default font, not in Dancing Script

#### Scenario: No global font-family declarations added
- **WHEN** inspecting the cake feature's CSS
- **THEN** there are no `font-family` declarations on `body`, `html`, or universal selectors that would leak Dancing Script outside the cake feature

### Requirement: Button label has no decorative text-shadow

The `.palermo-btn-label` element MUST NOT carry a `text-shadow` declaration. The previous white halo (`0 1px 2px rgba(255,255,255,0.6)`) was tuned for sans-serif glyphs and muddies the thin strokes of a script font. Removing it keeps the script crisp on the cake illustration.

#### Scenario: No text-shadow on button label
- **WHEN** the cake feature CSS is loaded
- **THEN** `getComputedStyle(.palermo-btn-label).textShadow` resolves to `none`

