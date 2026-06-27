## 1. Edit `palermo-cake/palermo-cake.js`

- [x] 1.1 Remove the four lines that build the `.palermo-btn-icon` element (creation, className, textContent, appendChild) inside the `if (data)` block of the `for` loop in `DOMContentLoaded`. Leave the label creation lines and the `button.appendChild(button)` line at the bottom of the loop untouched.

## 2. Edit `palermo-cake/palermo-cake.css`

- [x] 2.1 Add `text-align: center;` to the `.palermo-btn-label` rule (around L116-123). Keep all other declarations on that rule unchanged.
- [x] 2.2 Add a comment line above the `.palermo-btn-icon` selector (L110-114) marking it as currently unused on the cake map buttons but kept for future restore. The rule body itself remains unchanged.
- [x] 2.3 Comment out the `.cake-button:hover .palermo-btn-icon` branch in the hover rule (L125) so the selector list reads `.cake-button:hover .palermo-btn-label /*, .cake-button:hover .palermo-btn-icon (unused) */`. Keep the label branch active.

## 3. Verify in browser

- [ ] 3.1 Reload the cake-visual page on a real device (or Chrome DevTools responsive simulator) in landscape. Confirm each of the 5 cake buttons renders a label only, with no emoji visible on the map. Labels are centered horizontally on the cake layers.
- [ ] 3.2 Switch to portrait. Confirm the same: 5 labels only, centered, no icons on the map.
- [ ] 3.3 Hover a button. Confirm the label scales up to 1.05 and returns to 1 on mouse leave. No icon is present to scale.
- [ ] 3.4 Click a button. Confirm the popup card opens, shows the icon emoji at the top, then the title, description, and Explore CTA. Close the popup and click a different button. Confirm the icon in the new popup matches that layer's emoji (proof that `data.icon` is still being read from the data file).
- [ ] 3.5 Open browser DevTools console. Confirm no JavaScript errors and no 404s for the CSS file.
- [ ] 3.6 Inspect a `.cake-button` element in DevTools. Confirm it contains exactly one child: a `<span class="palermo-btn-label">`. No `<span class="palermo-btn-icon">` should appear in the DOM.

## 4. Archive

- [ ] 4.1 Run `/opsx-verify` to confirm implementation matches the proposal, design, and delta spec.
- [ ] 4.2 Run `/opsx-archive` to finalize the change.
