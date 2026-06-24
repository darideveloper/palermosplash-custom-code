## ADDED Requirements

### Requirement: Cake layer order is Cafe on top, Custom Cakes on bottom

The system SHALL render the illustrated cake visual with Cafe occupying the top layer and Custom Cakes occupying the bottom layer. Between them, the system SHALL render Wholesale above Ready to Order above 365 Online Shop, top to bottom in that order.

#### Scenario: Top layer is Cafe
- **WHEN** the cake visual is rendered on the landing page
- **THEN** the topmost layer SHALL be labeled Cafe and SHALL navigate to the Cafe page

#### Scenario: Bottom layer is Custom Cakes
- **WHEN** the cake visual is rendered on the landing page
- **THEN** the bottommost layer SHALL be labeled Custom Cakes and SHALL navigate to the Custom Cakes page

#### Scenario: Middle layers stack top to bottom in order
- **WHEN** the cake visual is rendered on the landing page
- **THEN** Wholesale SHALL sit directly below Cafe
- **AND** Ready to Order SHALL sit directly below Wholesale
- **AND** 365 Online Shop SHALL sit directly below Ready to Order and directly above Custom Cakes

### Requirement: PALERMO_CAKE_DATA binds each layer to a unique numeric id

The array `PALERMO_CAKE_DATA` in `palermo-cake/palermo-cake-data.js` SHALL contain exactly one entry per layer, with the entry's `id` field equal to the layer's numeric id in the range 1..5. The id-to-layer mapping SHALL be: id 1 = Custom Cakes, id 2 = 365 Online Shop, id 3 = Ready to Order, id 4 = Wholesale, id 5 = Cafe.

#### Scenario: Each id maps to exactly one entry
- **WHEN** `PALERMO_CAKE_DATA` is loaded
- **THEN** for every id `i` in 1..5, `find(d => d.id === i)` SHALL return exactly one entry
- **AND** no two entries SHALL share the same id

#### Scenario: id 1 is Custom Cakes
- **WHEN** the data file is loaded
- **THEN** the entry with `id === 1` SHALL have `shortName === "Custom Cakes"`

#### Scenario: id 5 is Cafe
- **WHEN** the data file is loaded
- **THEN** the entry with `id === 5` SHALL have `shortName === "Cafe"`

### Requirement: Cake button positioning remains stable

The CSS rules in `palermo-cake/palermo-cake.css` that position `.cake-button#button-N` elements SHALL continue to use `button-1` for the bottom layer and `button-5` for the top layer. Only the entry bound to each id changes.

#### Scenario: button-1 remains at the bottom
- **WHEN** the cake visual is rendered
- **THEN** `.cake-button#button-1` SHALL be positioned at the lowest `bottom` value (i.e., the bottom layer)

#### Scenario: button-5 remains at the top
- **WHEN** the cake visual is rendered
- **THEN** `.cake-button#button-5` SHALL be positioned at the highest `bottom` value (i.e., the top layer)

### Requirement: Popup wiring follows id, not array index

`palermo-cake/palermo-cake.js` SHALL continue to look up layer data via `find(d => d.id === i)` rather than by array index, so the visual layer order is determined by the id-to-position CSS mapping and not by the array order in the data file.

#### Scenario: Click on a layer opens the popup for that layer's id
- **WHEN** the user clicks the layer at the top of the cake
- **THEN** the popup SHALL display the title, description, and URL of the entry with `id === 5` (Cafe)

#### Scenario: Click on the bottom layer opens the popup for Custom Cakes
- **WHEN** the user clicks the layer at the bottom of the cake
- **THEN** the popup SHALL display the title, description, and URL of the entry with `id === 1` (Custom Cakes)
