## 1. JS — recalibrate `LAYER_PERCENTAGES`

- [x] 1.1 In `palermo-cake/palermo-cake.js`, replace the `vertical` entry of `LAYER_PERCENTAGES` with `{ 1: 0.71, 2: 0.60, 3: 0.49, 4: 0.37, 5: 0.24 }`.
- [x] 1.2 In the same constant, replace the `horizontal` entry with the same calibrated values `{ 1: 0.71, 2: 0.60, 3: 0.49, 4: 0.37, 5: 0.24 }`.

## 2. Verify

- [x] 2.1 Open the cake-visual landing page and confirm the five layer buttons are visually centred on their corresponding cake layers in both landscape and portrait orientations. (Owner: user — remote WP Engine site.)
- [x] 2.2 Confirm `palermo-cake.js` parses (no syntax errors) and the diff is contained to the `LAYER_PERCENTAGES` constant.
