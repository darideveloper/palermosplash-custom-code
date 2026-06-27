## Why

The brand logo currently rendered at the top-right of the cake-visual landing page competes with the hero illustration and is no longer wanted on this page. The existing `brand-logo-styling` capability mandates that the logo be visible, sized, blend-mode-integrated, and pinned to the top-right — every one of those requirements now needs to be inverted.

The change is reversible: the original styling block will be preserved as a commented-out reference in the CSS so the logo can be brought back in one edit if the design direction changes.

## What Changes

- Modify `palermo-cake/palermo-cake.css` so the `#logo` element is hidden on the cake-visual landing page.
- Replace the live `#logo img` rule with `#logo { display: none; }` (hiding the Elementor wrapper, robust to tag changes).
- Keep the original `#logo img` rule block in the file as a commented-out reference for easy reversion.
- Update the `brand-logo-styling` capability so its requirements describe the hidden state and reference the commented fallback.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `brand-logo-styling`: Requirements change from "logo MUST be visible at top-right with overlay blend mode" to "logo MUST be hidden on the cake-visual page; the previous visible-styling block is preserved as a commented fallback for easy reversion."

## Impact

- **Code**: `palermo-cake/palermo-cake.css` (one file, ~10 lines: live rule + commented fallback).
- **HTML**: unchanged. The Elementor `#logo` element is still rendered server-side; the CSS just hides it.
- **JS**: unchanged. `palermo-cake.js` does not reference `#logo`.
- **Other pages**: none. The rule lives in the feature-scoped `palermo-cake.css`, so it only applies where that stylesheet is enqueued.
- **Enqueue / PHP**: none.
- **Assets**: none. Logo image still lives in the WP media library and is not removed.
- **WP Engine cache**: may show the hidden logo until purged; flag for the deploy step.
