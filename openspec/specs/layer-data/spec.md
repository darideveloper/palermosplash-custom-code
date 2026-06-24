# layer-data Specification

## Purpose
TBD - created by archiving change cake-layer-info-popup. Update Purpose after archive.
## Requirements
### Requirement: Data file exposes a global PALERMO_CAKE_DATA array

The system SHALL provide a file `palermo-cake/palermo-cake-data.js` that defines a top-level global constant named `PALERMO_CAKE_DATA`. The value SHALL be a JavaScript array of exactly 5 entries, one per cake layer, with the top layer first and the bottom layer last.

#### Scenario: Data file loads and defines the global
- **WHEN** the browser executes `palermo-cake/palermo-cake-data.js`
- **THEN** a global identifier `PALERMO_CAKE_DATA` SHALL exist on `window`
- **AND** its value SHALL be a non-empty array of length 5

#### Scenario: Entries are ordered top-to-bottom
- **WHEN** the data file is loaded
- **THEN** the first entry (`index 0`) SHALL correspond to the top layer (Custom Cakes)
- **AND** the last entry (`index 4`) SHALL correspond to the bottom layer (Cafe)

### Requirement: Each data entry contains the required fields

Each entry in `PALERMO_CAKE_DATA` SHALL be an object with the following fields:

- `id`: integer in the range 1..5, unique within the array
- `icon`: non-empty string containing a UTF-8 character (or short sequence) used as the visual mark
- `shortName`: non-empty string displayed on the layer button
- `fullName`: non-empty string displayed in the popup as the layer title
- `description`: non-empty string displayed in the popup as the body copy
- `url`: non-empty string with an absolute or root-relative URL the "Explore" link points to
- `targetBlank`: boolean; if absent, the system SHALL treat it as `true`

#### Scenario: Entry shape is honored by the consumer
- **WHEN** `palermo-cake.js` reads `PALERMO_CAKE_DATA[i-1]` for a layer with index `i` in 1..5
- **THEN** the entry SHALL have `id === i`
- **AND** the entry SHALL expose `icon`, `shortName`, `fullName`, `description`, and `url`

#### Scenario: targetBlank default
- **WHEN** an entry does not include a `targetBlank` field
- **THEN** the "Explore" link SHALL open in a new tab

#### Scenario: targetBlank false opt-in
- **WHEN** an entry has `targetBlank: false`
- **THEN** the "Explore" link SHALL open in the same tab

### Requirement: Data file is enqueued before palermo-cake.js

The WordPress enqueue SHALL load `palermo-cake-data.js` in the document `<head>` (footer = false) and SHALL declare `palermo-cake.js` as depending on the data file, so the global is always defined before the main script runs.

#### Scenario: Load order on a fresh page load
- **WHEN** the page is loaded with both scripts enqueued
- **THEN** `palermo-cake-data.js` SHALL be parsed before `palermo-cake.js`

#### Scenario: Main script guards against missing data
- **WHEN** `palermo-cake.js` runs but `PALERMO_CAKE_DATA` is undefined
- **THEN** the main script SHALL NOT throw an uncaught error
- **AND** buttons SHALL render without icon or label
- **AND** clicking a button SHALL NOT open a popup

### Requirement: Data file uses placeholders until real content is provided

Until the real per-layer content (icons, full names, descriptions, URLs) is gathered, the data file SHALL use clearly marked placeholders that satisfy the structural contract but obviously need to be replaced. The placeholders SHALL:

- Be strings in the form `'<placeholder-name-N>'` (angle brackets, layer number)
- Be distinguishable at a glance from real content (e.g., visible `<...>` markers)
- Keep the array length at 5 with `id` values 1..5
- Set `shortName` to the known layer label (Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes) so the buttons remain readable even with placeholders
- Omit `targetBlank` on all entries (so the default `true` is exercised)

#### Scenario: Placeholder data renders without errors
- **WHEN** the data file is loaded with placeholder content
- **THEN** `PALERMO_CAKE_DATA` SHALL be a valid array of length 5
- **AND** each entry SHALL have `id`, `icon`, `shortName`, `fullName`, `description`, and `url` fields
- **AND** the buttons SHALL render the placeholder icon and short name without throwing
- **AND** the popup SHALL open and display the placeholder full name and description when a button is clicked
- **AND** the "Explore" anchor SHALL point to the placeholder URL (which the user understands is not a real link yet)

**Placeholder data structure (informational).** The placeholder data file SHALL match this shape, with `<...>` values to be replaced before launch:

```js
const PALERMO_CAKE_DATA = [
  {
    id: 1,                                  // Layer 1 (bottom of cake)
    icon: '<icon-1>',                       // e.g., '☕'
    shortName: 'Cafe',                      // known label
    fullName: '<full-name-1>',              // e.g., 'Palermo Cafe'
    description: '<description-1>',         // 1-2 sentences about this layer
    url: '<url-1>',                         // e.g., 'https://palermosplash.../cafe'
    // targetBlank: true (default — omit to use the default)
  },
  {
    id: 2,                                  // Layer 2
    icon: '<icon-2>',
    shortName: 'Wholesale',
    fullName: '<full-name-2>',
    description: '<description-2>',
    url: '<url-2>',
  },
  {
    id: 3,                                  // Layer 3
    icon: '<icon-3>',
    shortName: 'Ready to Order',
    fullName: '<full-name-3>',
    description: '<description-3>',
    url: '<url-3>',
  },
  {
    id: 4,                                  // Layer 4
    icon: '<icon-4>',
    shortName: '365 Online Shop',
    fullName: '<full-name-4>',
    description: '<description-4>',
    url: '<url-4>',
  },
  {
    id: 5,                                  // Layer 5 (top of cake)
    icon: '<icon-5>',
    shortName: 'Custom Cakes',
    fullName: '<full-name-5>',
    description: '<description-5>',
    url: '<url-5>',
  },
];
```

The placeholders are intended as a contract scaffold so the proposal and the data-driven UI can be reviewed and tested before the real content (icons, full names, descriptions, URLs) is collected from stakeholders.

