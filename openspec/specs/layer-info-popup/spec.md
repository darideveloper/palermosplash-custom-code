# layer-info-popup Specification

## Purpose
TBD - created by archiving change cake-layer-info-popup. Update Purpose after archive.
## Requirements
### Requirement: A single popup element is created and appended to body

The system SHALL create a single popup container element on `DOMContentLoaded` and append it to `<body>`. The element SHALL have a class indicating it is a popup (for example `palermo-popup`) and SHALL be hidden by default.

#### Scenario: Popup exists after page load
- **WHEN** DOM content is loaded
- **THEN** a single popup element SHALL exist in the DOM
- **AND** it SHALL be a child of `<body>`
- **AND** it SHALL NOT be visible

### Requirement: Popup renders the active layer's content

When the popup is open, it SHALL render the active layer's `icon`, `fullName`, `description`, and an "Explore" anchor whose `href` is the layer's `url`. If the layer's `targetBlank` is `true` (or absent), the anchor SHALL have `target="_blank"` and `rel="noopener noreferrer"`. If `targetBlank` is `false`, the anchor SHALL open in the same tab.

#### Scenario: Popup content reflects the active layer
- **WHEN** the popup is open for layer 3
- **THEN** the popup SHALL display the icon, fullName, and description from `PALERMO_CAKE_DATA[2]`
- **AND** it SHALL contain an "Explore" anchor with `href` equal to that entry's `url`

#### Scenario: Explore link opens in a new tab by default
- **WHEN** the active layer's entry omits `targetBlank` or sets it to `true`
- **THEN** the "Explore" anchor SHALL have `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: Explore link opens in the same tab when opted out
- **WHEN** the active layer's entry has `targetBlank: false`
- **THEN** the "Explore" anchor SHALL NOT have `target="_blank"`

### Requirement: Clicking a layer button opens the popup

When the user clicks a `.cake-button` and no popup is open, the system SHALL open the popup for that layer.

#### Scenario: Open from closed state
- **WHEN** the popup is closed
- **AND** the user clicks `#button-2`
- **THEN** the popup SHALL open
- **AND** the popup SHALL show layer 2's content
- **AND** `#button-2` SHALL receive the class `is-active`

### Requirement: Clicking a different layer button closes then opens the popup

When the user clicks a `.cake-button` while the popup is open for a different layer, the system SHALL close the popup first, then open it for the newly clicked layer. The previous active button SHALL lose the class `is-active` and the new active button SHALL receive it.

The close transition SHALL complete (or near-complete) before the open transition starts, so the user perceives two distinct transitions rather than a single content swap. The system SHALL wait for the close transition's duration (matching the CSS `transition` value) before triggering the open.

#### Scenario: Switch from layer 1 to layer 4
- **WHEN** the popup is open for layer 1
- **AND** the user clicks `#button-4`
- **THEN** the popup SHALL begin its close transition
- **AND** the close transition SHALL complete before the open transition begins
- **AND** `#button-1` SHALL NOT have the active state class
- **AND** `#button-4` SHALL have the active state class
- **AND** at no point SHALL the popup's content swap visually without going through the close transition

#### Scenario: Click on the already-active layer is a no-op
- **WHEN** the popup is open for layer 2
- **AND** the user clicks `#button-2`
- **THEN** the popup SHALL remain open
- **AND** the popup SHALL continue to show layer 2's content
- **AND** the popup SHALL NOT close-then-open (no visible transition)

### Requirement: Clicking outside the popup and outside any layer button closes the popup

When the user clicks anywhere on the document that is neither inside the popup nor on a `.cake-button`, the popup SHALL close. The active button SHALL lose the class `is-active`.

#### Scenario: Close via click on background
- **WHEN** the popup is open
- **AND** the user clicks on a part of the page that is not the popup and not a `.cake-button`
- **THEN** the popup SHALL close
- **AND** no `.cake-button` SHALL have the class `is-active`

#### Scenario: Click on a layer button does not count as outside
- **WHEN** the popup is open
- **AND** the user clicks a `.cake-button` that is not the active layer
- **THEN** the popup SHALL NOT close from this click alone (the close-then-open sequence handles it)

### Requirement: Popup positions to the right rail in landscape orientation

When `<body>` has class `horizontal` and the popup is open, the popup SHALL be fixed-positioned on the right edge of the viewport (anchored at `right: 0`). Its vertical center SHALL align with the vertical center of the active layer's `.cake-button` (so the popup appears at the same vertical level as the cake layer it represents).

The popup's height SHALL be content-based but SHALL be bounded by a `max-height` of `80vh` (landscape). If the content exceeds the max-height, the popup SHALL become internally scrollable (`overflow-y: auto`) so the full description remains reachable.

#### Scenario: Horizontal popup alignment
- **WHEN** the page is in landscape orientation
- **AND** the popup is open for `#button-3`
- **THEN** the popup SHALL be positioned at the right edge of the viewport
- **AND** the popup's vertical center SHALL match the vertical center of `#button-3`

#### Scenario: Horizontal popup overflow
- **WHEN** the popup is open in landscape
- **AND** the popup's content (icon, fullName, description, Explore anchor) exceeds `80vh` in height
- **THEN** the popup SHALL cap its height at `80vh`
- **AND** the popup's content SHALL scroll vertically within the popup

### Requirement: Popup positions to the bottom sheet in portrait orientation

When `<body>` has class `vertical` and the popup is open, the popup SHALL be fixed-positioned at the bottom of the viewport with full viewport width. Its height SHALL be content-based (sized to fit its content) but SHALL be bounded by a `max-height` of `60vh` (portrait). If the content exceeds the max-height, the popup SHALL become internally scrollable.

#### Scenario: Vertical popup placement
- **WHEN** the page is in portrait orientation
- **AND** the popup is open for any layer
- **THEN** the popup SHALL be positioned at the bottom of the viewport
- **AND** the popup SHALL span the full viewport width
- **AND** the popup's height SHALL be determined by its content
- **AND** the popup's height SHALL NOT exceed `60vh`

#### Scenario: Vertical popup overflow
- **WHEN** the popup is open in portrait
- **AND** the popup's content exceeds `60vh` in height
- **THEN** the popup SHALL cap its height at `60vh`
- **AND** the popup's content SHALL scroll vertically within the popup

### Requirement: Popup uses a slide + fade transition

When the popup opens, it SHALL transition from a hidden state to a visible state with both an opacity change and a translate. In landscape, the popup SHALL slide in from the right. In portrait, the popup SHALL slide in from the bottom. When closing, the transition SHALL reverse.

#### Scenario: Horizontal open transition
- **WHEN** the popup opens in landscape orientation
- **THEN** the popup SHALL fade in
- **AND** the popup SHALL translate horizontally from off-screen-right to its final position

#### Scenario: Vertical open transition
- **WHEN** the popup opens in portrait orientation
- **THEN** the popup SHALL fade in
- **AND** the popup SHALL translate vertically from off-screen-bottom to its final position

#### Scenario: Close transition reverses the open
- **WHEN** the popup closes
- **THEN** the popup SHALL fade out
- **AND** the popup SHALL translate back to its hidden anchor edge

### Requirement: Only one popup can be open at a time

The system SHALL maintain a state where at most one layer's popup is open. Opening a popup for any layer while another is open SHALL cause the previous popup to close.

#### Scenario: Invariant: never two popups open
- **WHEN** the popup is open for layer 1
- **AND** the user clicks layer 3
- **THEN** at no point SHALL two popups be visible simultaneously

### Requirement: Popup contains a close button in the top-right corner

When the popup is open, it SHALL contain a close button element (a `<button>` with class `palermo-popup-close`) positioned in the top-right corner of the popup. The button's visible content SHALL be the `×` character (U+00D7). The button SHALL be reachable via mouse click and SHALL have `type="button"` and an `aria-label` of `"Close"`.

Clicking the close button SHALL close the popup and remove the `is-active` class from the active layer button, with the same effect as clicking outside the popup or clicking another layer button.

#### Scenario: Close button is present when the popup is open
- **WHEN** the popup is open for any layer
- **THEN** a `<button class="palermo-popup-close">` element SHALL be a child of the popup
- **AND** its text content SHALL be `×`
- **AND** it SHALL have `type="button"`
- **AND** it SHALL have an `aria-label` attribute equal to `"Close"`

#### Scenario: Close button is positioned in the top-right corner
- **WHEN** the popup is open
- **THEN** the close button SHALL be visually positioned in the top-right corner of the popup (e.g., via `position: absolute; top: 0; right: 0` or equivalent)

#### Scenario: Click on the close button closes the popup
- **WHEN** the popup is open for layer 3
- **AND** the user clicks the close button
- **THEN** the popup SHALL close (class `open` removed)
- **AND** `#button-3` SHALL NOT have the class `is-active`
- **AND** the popup's content SHALL be cleared on the next open (consistent with the existing close behavior)

#### Scenario: Close button click does not trigger click-outside close
- **WHEN** the popup is open
- **AND** the user clicks the close button
- **THEN** the popup SHALL close exactly once (not twice from the close button + the document click-outside listener)
- **AND** the document click-outside listener SHALL NOT additionally close the popup because the close button is inside the popup and `closest('.palermo-popup')` matches

#### Scenario: Close button is reachable from any layer
- **WHEN** the popup is opened for layer 1
- **OR** the popup is opened for layer 5
- **OR** the popup is opened for any other layer
- **THEN** the close button SHALL be present and functional

