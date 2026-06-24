## Context

The cake visual feature was built up across three archived changes:
- `cake-visual-clickable-zones`: base cake image, orientation detection, 5 empty clickable divs (`button-1`..`button-5`), hover → glow visibility
- `text-hover-overlay`: per-layer text image elements, JS duplication logic, hover reveals an overlay-text clone
- `brand-logo-styling`: logo positioning with `mix-blend-mode: overlay` and `z-index: -1`

The current state: 5 empty `<div>`s over the cake, no visible affordance, no per-layer content beyond a baked-in text image, and no path to expand the layer into more detail (no data source, no popup).

This change introduces a data source for the 5 layers, makes the buttons self-describing (icon + short name), and adds a click-based popup that surfaces the full layer info. The popup is a transitional surface — it lays the groundwork for a future modal without committing to a full modal implementation now.

Constraints (from `AGENTS.md` and the project conventions):
- No build pipeline, no npm, no bundler, no TypeScript
- WP Engine hosting, no shell access to WP core
- WordPress + Elementor for HTML structure
- Vanilla CSS + JS only
- All asset URLs point to the WP media library (not in this repo)
- No accessibility work in this change (deferred)

## Goals / Non-Goals

**Goals:**
- Render an icon and short name inside each `.cake-button`, populated from a single data source
- Click a layer button to see its detailed info (icon, full name, description, "Explore" link to its URL)
- Single popup at a time; closeable by clicking another layer button or by clicking outside
- Layout adapts: right rail in landscape, bottom sheet in portrait
- Keep the existing hover → glow behavior (decoupled from the popup)
- Data lives in a separate JS file, editable independently, preloaded in `<head>`
- Button text and icon blend with the cake illustration via `mix-blend-mode: color-burn`
- Hovering a button gives a subtle scale (1.05) on the text and icon as a discovery cue
- No new dependencies, no build step, no async fetch

**Non-Goals:**
- Full modal implementation (deferred to a later change)
- Accessibility features: `role="dialog"`, `aria-modal`, focus management, Escape key, `prefers-reduced-motion` (deferred)
- Editing data through the WordPress admin (the data file is a static JS file)
- Internationalization (strings are static for now)
- Resize-aware popup repositioning (acceptable for the initial change; can be added later)
- Removing or replacing the existing `cake-visual` (cake image, orientation, glow) — unchanged

## Decisions

### Decision 1: Plain global const in a separate JS file for the data source

`palermo-cake/palermo-cake-data.js` exposes a global `PALERMO_CAKE_DATA` array. Each entry holds `id`, UTF-8 `icon`, `shortName`, `fullName`, `description`, `url`, and `targetBlank` (defaults to `true`).

The file initially ships with placeholder strings in `<placeholder-name-N>` form (e.g., `<icon-1>`, `<full-name-1>`, `<description-1>`, `<url-1>`) so the structural contract is exercisable end-to-end before the real per-layer content is collected. The known layer labels (Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes) are used for `shortName` so the buttons remain readable while the rest of the content is pending.

**Rationale:**
- No build pipeline, so no ES modules, no TypeScript types
- WP Engine enqueue handles load order; loading in `<head>` makes the data synchronously available to `palermo-cake.js`
- Plain object access is faster and simpler than fetch+parse
- A separate file is editorially clear: content/copy can be edited in one place without touching behavior code
- Easy to swap content (one file, one enqueue line)
- Placeholders (visually obvious in `<...>` form) make it impossible to mistake the data file for production-ready content

**Alternatives considered:**
- *JSON file fetched at runtime* — adds async complexity, race conditions with the main script, a one-time network roundtrip that solves no real problem for static data
- *ES module (`import`) with `type="module"`* — would require a build step or an explicit module-aware enqueue path; complicates the dependency graph
- *Inline `<script>` tag in Elementor HTML* — data is content-shaped; an editor who wants to change copy shouldn't have to touch Elementor

**Placeholder data shape** (initial scaffold, replaced before launch):

```js
const PALERMO_CAKE_DATA = [
  { id: 1, icon: '<icon-1>', shortName: 'Cafe',            fullName: '<full-name-1>', description: '<description-1>', url: '<url-1>' },
  { id: 2, icon: '<icon-2>', shortName: 'Wholesale',       fullName: '<full-name-2>', description: '<description-2>', url: '<url-2>' },
  { id: 3, icon: '<icon-3>', shortName: 'Ready to Order',  fullName: '<full-name-3>', description: '<description-3>', url: '<url-3>' },
  { id: 4, icon: '<icon-4>', shortName: '365 Online Shop', fullName: '<full-name-4>', description: '<description-4>', url: '<url-4>' },
  { id: 5, icon: '<icon-5>', shortName: 'Custom Cakes',    fullName: '<full-name-5>', description: '<description-5>', url: '<url-5>' },
];
```

### Decision 2: Single popup element, content swapped on demand

The popup is built once, appended to `<body>`, and shown/hidden via CSS class toggles. When the active layer changes, the popup's content is replaced (icon, full name, description, "Explore" anchor) and the position is recomputed.

**Rationale:**
- The popup is conceptually one UI surface that reflects one active layer at a time
- Swapping `textContent` / rebuilding the inner contents is faster than creating/destroying 5 separate popups
- State machine is trivial: `activeLayerId` is `null` or `1..5`
- Transition lifecycle (open / close-then-open) is easier to control on a single element

**Alternatives considered:**
- *5 separate popup elements, one per layer* — 5 elements, 5 transitions to manage, more code with no benefit since only one is ever visible

### Decision 3: Click-based popup; hover retained only for glow

Click on a `.cake-button` opens (or swaps) the popup. Hover on a `.cake-button` only toggles the corresponding `#glow-N` `.visible` class. The two interactions are fully decoupled.

**Rationale:**
- A click signal is unambiguous and survives touch/pointer events (mobile has no hover)
- The popup needs to persist — it carries an interactive "Explore" link — so it cannot be hover-bound
- Keeping the hover → glow behavior gives a soft discovery affordance without competing with the popup
- Decoupling means the popup and glow never interfere (e.g., opening a popup does not turn the active layer's glow on permanently; hovering a different layer still glows it)

**Alternatives considered:**
- *Hover-only popup* — popup would need to be interactable, which conflicts with hover-leave; mobile has no hover
- *Click-only with no glow on hover* — removes the soft preview that makes the layers feel responsive during exploration

### Decision 4: Slide + fade transition via CSS class toggle

The popup is a fixed-positioned element with `opacity: 0` and a `transform: translateX(100%)` (landscape, off-screen-right) or `translateY(100%)` (portrait, off-screen-bottom) by default. A `.open` class sets `opacity: 1` and `transform: none` (with `translate(0, -50%)` in landscape to vertically center on its `top`). CSS transitions handle the animation.

**Rationale:**
- Slide direction matches the popup's anchor edge (right rail slides in from the right, bottom sheet slides up from the bottom), so the popup appears to "come from" where it lives
- Fade softens the appearance of a fixed panel
- CSS transition + a single `.open` class is the simplest implementation; no JS animation loop
- `prefers-reduced-motion` is deferred with the rest of accessibility

**Alternatives considered:**
- *No transition (appear instantly)* — feels abrupt for a panel that appears next to a clicked button
- *JS-driven animation (Web Animations API or rAF loop)* — more code, no benefit over CSS transitions for this use case

**Implementation note (close-then-open timing):** when switching layers, the close transition must complete before the open begins. The JS uses a `setTimeout` matching the CSS `transition-duration` (e.g., 300ms) between removing `.open` and re-adding it with the new content. This ensures the user sees two distinct transitions rather than an instant content swap.

### Decision 5: Click-outside detection via single document listener

A single `document.addEventListener('click', ...)` checks whether `event.target` is inside the popup or inside any `.cake-button`. If neither, the popup closes.

**Implementation pattern:**
```js
document.addEventListener('click', (e) => {
  if (e.target.closest('.palermo-popup, .cake-button')) return;
  closePopup();
});
```

**Rationale:**
- One listener, cheap, reliable
- `Element.closest()` is the standard pattern for "is this inside X" checks and handles nested elements correctly
- Avoids the bookkeeping of attaching/removing listeners per open/close
- The same click that opens the popup targets the button (which `closest()` catches), so the popup does not immediately close

**Alternatives considered:**
- *Per-button document listener attached on open, removed on close* — same effect, more lifecycle bookkeeping, leak risk if cleanup is missed
- *Checking `e.target === popup` only* — would close the popup when the user clicks on inner content (e.g., the description text)

### Decision 6: Active state on the clicked button (scale 1.05)

The clicked button gets the class `is-active` (BEM-style state class) that sets `transform: scale(1.05)`. The transform does not affect layout (no reflow).

**Rationale:**
- The glow on the active layer is one signal, but the button itself also needs to feel "selected" so the user can tell which layer is the source of the popup at a glance
- Scale is subtle, doesn't change layout, and reinforces the click without screaming for attention
- The `is-` prefix makes the class name unambiguously a state (not a content type or layout class), which keeps BEM-style naming conventions clean
- CSS-only state, toggled by JS adding/removing a class

**Alternatives considered:**
- *Different background color* — would clash with the cake illustration's aesthetic and require a palette decision
- *Border / outline* — the button is a hit area, not a visible card; an outline would be visually loud
- *Class name `active`* — works, but is ambiguous; `is-active` is the BEM-conventional state class name

### Decision 9: Popup overflow handling via max-height + internal scroll

The popup's content-based height is bounded by a `max-height` of `80vh` (landscape) and `60vh` (portrait). When content exceeds the cap, the popup becomes internally scrollable (`overflow-y: auto`).

**Rationale:**
- A popup with a long description or on a small portrait phone could otherwise cover the entire viewport and hide the cake visual
- Bounded height + internal scroll keeps the popup as a peek at the layer's detail without overwhelming the page
- The `max-height` values are conservative defaults; the actual implementation can tune them
- The Explore anchor (the only interactive element in the popup) stays visible at the bottom of the popup in landscape; in portrait it scrolls with the content

**Alternatives considered:**
- *No max-height (grow unbounded)* — rejected, can cover the whole viewport on small screens
- *Truncate description with "read more"* — rejected, hides content by default; full text is the point
- *Different max-heights per layer* — rejected, layers should feel consistent

### Decision 7: Data entries ordered top-to-bottom (Custom Cakes, 365 Online Shop, Ready to Order, Wholesale, Cafe)

**Rationale:**
- Reads as a top-to-bottom tour of the cake stack when scanning the data file
- The runtime maps entries to buttons by `id` (not by array index), so `button-1` still corresponds to the bottom layer (Cafe, `id: 1`) regardless of array order
- Array order matters only for readability of the data file

**Alternatives considered:**
- *Bottom-to-top* — also acceptable; the choice between top-to-bottom and bottom-to-top is purely a readability preference since the runtime uses `id` for mapping. Top-to-bottom was chosen to read the cake as it visually appears.

### Decision 8: `targetBlank` defaults to `true` in JS

If an entry omits `targetBlank`, the "Explore" anchor opens in a new tab. Entries can opt out by setting `targetBlank: false`.

**Rationale:**
- Cross-page exploration of an external destination typically wants to preserve the originating page
- New tab is the gentler default; same-tab navigation is the more disruptive option for an "Explore" action
- Data entries can override per layer

**Alternatives considered:**
- *Default false* — same-tab navigation interrupts the cake exploration more often than is necessary

### Decision 10: Layer buttons are created dynamically in JS, not declared in Elementor HTML

The main script creates the 5 layer button `<div>` elements on `DOMContentLoaded` (one per layer, `id="button-N"`, appended to `<body>`), populates them with icon + label from the data, and attaches hover + click listeners. The Elementor HTML does NOT need to contain `#button-1`..`#button-5` placeholder divs.

**Rationale:**
- Matches the original pre-change pattern (the previous code also created buttons in JS), so the convention is consistent
- Keeps the data and behavior colocated in the JS file; the HTML only needs the static cake illustration elements
- Avoids the risk of duplicate buttons if the Elementor HTML has placeholder divs but the JS also creates them

**Alternatives considered:**
- *Elementor HTML placeholder divs + JS populates them* — initially proposed in the spec, but rejected because it requires the WordPress admin to add 5 empty divs to the HTML widget, which is easy to forget and creates a fragile coupling between HTML and JS. Dynamic creation is self-contained.

### Decision 11: Button text and icon use `mix-blend-mode: color-burn` and a hover scale

The `.cake-button` element uses `mix-blend-mode: color-burn` so the icon and label inside it visually integrate with the cake illustration beneath. On hover, the `.palermo-btn-icon` and `.palermo-btn-label` children scale to `1.05` with a 200ms transition for a subtle interactive cue.

**Rationale:**
- `color-burn` makes the text appear to be "burned into" the cake layer, matching the illustrated aesthetic
- The blend mode is on the `.cake-button` container (not the children) because `mix-blend-mode` on a child element blends with the parent's backdrop (which is transparent), which can fail to reach the cake illustration behind the button. Putting it on the container creates the correct blending context with the cake image behind.
- The hover scale is on the children (not the button itself) so it composes cleanly with the `is-active` scale on the button container (the user can see both effects叠加 when hovering an active button)
- `transform: scale` (not `font-size`) avoids layout reflow and matches the existing transform-based pattern

**Alternatives considered:**
- *Blend mode on the text/icon children* — initially tried; failed to blend with the cake because the children blended with the transparent button backdrop instead of the cake behind it. Moved to the parent for correct stacking context.
- *Hover scale on the button itself* — conflicts with the `is-active` transform; would need to combine them or drop one
- *Use `font-size` for the hover effect* — causes reflow; rejected for performance

## Risks / Trade-offs

- **UTF-8 emoji rendering varies by OS and browser** → Mitigation: pick icons that render legibly on macOS, iOS, Windows, and Android. The data file centralizes the choice so a fallback can be swapped by editing one field. If emoji becomes a problem, replace the icon source (CSS-rendered symbol, SVG, or WebP) without touching behavior code.
- **Popup overlaps the brand logo in landscape when the top layers are active** → The popup is now on the right rail; the logo is at top-right. For the top layers (e.g., button-5), the popup's vertical position is near the top of the viewport and overlaps the logo's bounding box. The logo has `z-index: -1` and `mix-blend-mode: overlay`, so the popup (z-index: 5) sits on top of the logo; the logo blends into the popup's background rather than competing with it. Visually acceptable, but worth verifying after deploy. If the overlap is distracting, the popup can be capped to not extend into the top `~200px` (where the logo lives) by adjusting the `top` calculation.
- **Resize while popup is open leaves stale positioning** → Mitigation: the popup reads the active button's vertical position when it opens; resize between open and close will not reflow it. Acceptable for the initial change. A future change can add a resize handler that re-anchors the popup.
- **Click-outside listener must not fire on the same click that opened the popup** → Mitigation: the document listener checks `event.target` against the popup and any `.cake-button`; the open handler runs in the button's `click` listener with a higher priority (per-Element listener ordering), so the document listener either sees the same target (and ignores it) or runs after a synthetic event. Practically: `event.target` is the clicked button, which is excluded by the check, so the popup does not immediately close.
- **Popup content is built from data via DOM APIs** → Mitigation: data is static, written by the same dev who writes the behavior code. No untrusted input. If the data ever becomes user-editable, the popup content rendering must switch to textContent or sanitize inputs.
- **Two clicks on the same button in quick succession could cause close-then-open flicker** → Mitigation: the state machine treats "click on active layer" as a no-op. The popup stays as-is, no re-entry, no flicker.
- **Active button scale 1.05 may visually collide with the glow** → Mitigation: scale is a transform on the button, glow is an opacity transition on a different image element at `z-index: 1`; they layer cleanly and do not interact.
- **Removing the text-hover-overlay feature is a visible regression if the user expected the old effect** → Mitigation: the click-based popup with icon + shortName + "Explore" replaces the visual role the overlay used to play. The button now carries the affordance, the popup carries the detail.
- **Loading order regression risk** → Mitigation: the data file is enqueued as a dependency of `palermo-cake.js`, so WordPress guarantees the order. If the data file is missing or fails to load, `palermo-cake.js` should fall back gracefully (no icons/text on buttons, no popup on click) rather than throwing — implement a `typeof PALERMO_CAKE_DATA === 'undefined'` guard.
- **External changes in the live WordPress install are easy to forget** → Mitigation: tasks 6.1 and 6.2 in `tasks.md` flag the Elementor HTML edits and the `functions.php` enqueue explicitly. Anyone running `/opsx-apply` should be reminded to perform those steps in the WordPress admin / child theme after the code is deployed; this repo alone is not enough to make the feature live.
- **Class name `is-active` collides with another plugin/theme** → Mitigation: `is-active` is a generic state class name, but the selector is scoped to `.cake-button.is-active`, so other uses of `is-active` elsewhere on the page would not affect the cake buttons. If a collision is observed, the class can be renamed to `palermo-is-active` with a one-line JS + CSS update.

## Open Questions

- Will the icon set remain emoji-based, or move to SVG/WebP before launch? Emoji is the current decision; revisit if cross-platform consistency proves unsatisfactory.
- Should the popup be dismissible by pressing Escape? Deferred with the rest of accessibility.
- Should the popup reposition on `resize` while open? Deferred; can be added later by listening to `resize` and recomputing the popup's vertical position from the active button.
