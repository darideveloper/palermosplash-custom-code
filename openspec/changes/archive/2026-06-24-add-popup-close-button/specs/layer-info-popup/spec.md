# layer-info-popup Specification (delta)

## ADDED Requirements

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
