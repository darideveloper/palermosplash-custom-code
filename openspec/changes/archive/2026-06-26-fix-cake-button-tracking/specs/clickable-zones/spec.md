## ADDED Requirements
### Requirement: Button positioning tracks the cake image

The `.cake-button` elements SHALL be positioned to track the cake image's rendered bounding rect, expressed as a percentage of the cake's height and a horizontal-center anchor on the cake. The per-orientation positioning SHALL be implemented in `palermo-cake.js` (via the `cake-button-tracking` capability) and SHALL produce a layer-aligned layout on every real device, regardless of system bars, URL bar collapse, or orientation. The computed `top` SHALL be offset by `± buttonHeight / 2` so the button's center lands on the layer Y; the sign is `+` in vertical mode and `-` in horizontal mode. The existing per-orientation `bottom: <vh>` rules in `palermo-cake.css` SHALL remain in effect as a fallback for the brief moment between `DOMContentLoaded` and the first `positionButtons()` run; they SHALL NOT be the authoritative positioning contract for the buttons.

#### Scenario: Initial position after page load
- **WHEN** the page loads on a real device in any orientation
- **THEN** each `.cake-button` SHALL be visually centered on a specific layer of the cake illustration
- **AND** the alignment SHALL NOT depend on the device's system bars or URL bar state
- **AND** the alignment SHALL be equivalent to the alignment seen in Chrome DevTools' responsive simulator for the same logical dimensions

#### Scenario: DevTools responsive simulator visual parity
- **WHEN** the page is viewed in Chrome DevTools' responsive simulator at a given device profile
- **THEN** the buttons SHALL align with the cake layers in the same way they did before this change
- **AND** the inline `top` set by `positionButtons()` SHALL be the active positioning for the buttons

#### Scenario: Orientation switch
- **WHEN** the viewport orientation changes
- **THEN** the buttons SHALL be repositioned using the orientation-specific percentage table
- **AND** the buttons SHALL remain aligned with their target cake layers after the switch

## REMOVED Requirements
### Requirement: Each button aligns to a cake layer
**Reason**: Replaced by the `Button positioning tracks the cake image` requirement. The legacy `bottom: <vh>`-based positioning is no longer the authoritative contract; positioning is now derived from the cake image's `getBoundingClientRect()` via the `cake-button-tracking` capability.
**Migration**: No caller migration needed. The fallback `vh` values are preserved in `palermo-cake.css` for the brief image-decode window between `DOMContentLoaded` and the first `positionButtons()` run. Once `positionButtons()` runs, inline `top` values take over.

### Requirement: Existing positioning rules are unchanged
**Reason**: The per-orientation `bottom: <vh>` rules are no longer the authoritative positioning contract. They remain in the stylesheet as a fallback for the brief moment before `positionButtons()` runs, but the visible position of every button is determined by the JS-tracked cake rect. The replacement requirement `Button positioning tracks the cake image` is the new contract.
**Migration**: No caller migration needed. The fallback `vh` values are preserved at their current numbers (horizontal: 23, 35, 46, 58, 70.5; vertical: 9, 19.5, 30, 41, 52) for the duration of the image-decode window. Once `positionButtons()` runs, inline `top` values take over.
