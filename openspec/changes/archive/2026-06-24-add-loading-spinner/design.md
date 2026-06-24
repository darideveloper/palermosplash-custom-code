## Context

Landing page renders a layered cake visual (WebP images painted server-side by Elementor). The JS feature `palermo-cake` runs on `DOMContentLoaded` and wires hover/click zones, but the WebP image data still streams in after first paint. Result: user sees half-loaded layers, then the clickable hit zones snap in. That snap breaks the premium feel we want.

This change adds a pre-content overlay that owns the viewport until the browser signals everything is loaded, then fades out. The overlay's animation is pure CSS — no JS participates in rendering, only in retiring the overlay.

Constraints from `AGENTS.md`: vanilla CSS+JS, one file pair per feature, `palermo-` prefix on all selectors, no build step, no lint/typecheck. The loader must integrate with the existing `palermo-cake` feature without modifying its files.

## Goals / Non-Goals

**Goals:**
- Hide the layering/snap-in flicker on the landing page.
- Loader animation = pure CSS (no JS in animation loop). JS only adds a class to retire the loader.
- Accessible: respect `prefers-reduced-motion`, expose status to assistive tech, no keyboard trap.
- Cover screen with solid white background and a single 3-tier cake icon (true black via `fill: currentColor` + `color: #000`).
- Follow the project's `palermo-cake` style: feature folder `palermo-loader/`, `palermo-` prefix, vanilla files.

**Non-Goals:**
- No PHP changes in this repo.
- No edits to `palermo-cake.css` or `palermo-cake.js`.
- No dark-mode variants (page has no dark mode today).
- No internationalization of the loader label (English "Loading" is fine for a single landing page).
- No analytics events for loader show/hide.
- No spinner during in-page navigation (full page reload model, not SPA).

## Decisions

### D1. Loader HTML lives in an Elementor HTML widget, not `wp_body_open`

**Why:** Project AGENTS.md is clear that PHP and `functions.php` are out of this repo. An HTML widget at the very top of the Elementor page gives us a no-code touch point. Documented in tasks; not a code change here.

**Alternative considered:** PHP `wp_body_open` hook — bulletproof, can't be deleted by an editor, but requires touching child theme `functions.php` (out of repo). Revisit if the widget gets deleted in production.

### D2. Inline SVG cake, not emoji or external SVG file

**Why:** Cake emoji (🎂 / 🍰) renders colored on all major platforms. `filter: grayscale(1) brightness(0)` would make it black but degrades anti-aliasing on the curved edges — looks fuzzy at small sizes. Inline SVG with `fill: currentColor` and `color: #000` gives a crisp, themeable, true-black icon with zero HTTP requests. Tradeoff: the SVG path lives in HTML (a few hundred bytes) instead of cached as a separate asset. Acceptable — the page already serves a dozen WebPs.

**Alternative considered:** External SVG in WP media library — extra request for a 200-byte icon, caches marginally better, not worth it.

### D3. Wobble (`rotate -8deg ↔ +8deg`) around base, not full spin

**Why:** A 3-tier cake rotating 360° reads as a cake falling sideways — wrong emotional signal. A small wobble around the base reads as playful nodding, on-brand for artisan bakery. `transform-origin: 50% 90%` pins the pivot at the cake's bottom plate. Reduced wobble angle (±8° not ±15°) keeps the silhouette stable.

**Alternative considered:** Full 360° spin (user's first instinct). Rejected after visualizing the 3-tier shape rotating.

### D4. `window.load` event as the hide trigger

**Why:** `window.load` fires after all images (including the cake WebPs) finish loading. Matches the "hide UI until elements are ready" goal without coupling the loader to `palermo-cake.js` internals. `DOMContentLoaded` would fire too early — the images haven't streamed in yet.

**Alternative considered:** Custom event from `palermo-cake.js` (`palermo:cake-ready`). Tighter coupling, clearer intent, but `palermo-cake.js` does not need to know the loader exists. Decoupling is the right call.

**Alternative considered:** Fixed timeout. Rejected — either hides too early (flash) or too late (felt delay).

### D5. Pattern A: overlay covers content, content paints under it

**Why:** Elementor paints the page server-side. The white loader sits on top (`z-index: 9999`, `position: fixed`, full viewport). Underneath, the cake WebPs and Elementor widgets stream in normally. When `window.load` fires, the loader fades to `opacity: 0` and the content reveals in place. No need to gate the content's own opacity. Simpler, fewer transitions, less to debug.

**Alternative considered:** Pattern B (hide content until ready, reveal in sync with loader fade). Rejected because it doubles the transition surface and creates a second "blink" risk if either transition stutters.

### D6. JS file does one thing: add a class on `window.load`

**Why:** Minimal JS surface = minimal risk. No DOM mutation, no animation, no selectors to maintain. The whole JS file is ~6 lines. Failure mode (JS disabled or errors): loader stays visible. Acceptable fallback — see risks.

**Alternative considered:** Use a CSS-only timeout via `animation-delay: 5s; animation-fill-mode: forwards` + a finished animation keyframe that drops opacity. Clever but fragile (CSS animation timing is not a load signal) and harder to debug.

### D7. `pointer-events: none` on retired loader

**Why:** Once the loader fades, it must not eat clicks on the buttons that just appeared under it. `pointer-events: none` is a one-line addition that prevents "I clicked a button, nothing happened" reports during the 400ms fade-out window.

## Risks / Trade-offs

- **Editor deletes the HTML widget** → loader disappears, flicker returns. → Mitigation: document in tasks + commit message that this widget is load-bearing. Future mitigation: move to `wp_body_open` PHP hook.
- **JS disabled or blocked** → loader never retires, page appears blank white. → Mitigation: acceptable — the page is heavily JS-dependent (palermo-cake wiring). With JS off the cake visual would also be broken, so the white screen is the lesser evil. Document the dependency.
- **Slow connection keeps `window.load` pending** → loader visible for several seconds, possibly with image layers partially loaded under it (visible through the loader? No — solid white background, opaque). → Mitigation: none needed visually. Optionally add a max-wait timeout in JS to fade after 10s even if `load` never fires, if real-user telemetry shows long waits.
- **z-index conflict with Elementor popups (also ~9999)** → loader might appear under a popup. → Mitigation: use `z-index: 100000`. Elementor's popups do not exceed that.
- **3-tier cake + wobble reads as "falling" if wobble angle too high** → mitigated by ±8° and base pivot.
- **Wobble feels too slow / too fast** → Mitigation: `1.6s` duration is a starting point. Single CSS var to tune without touching `@keyframes`. Trivial to adjust post-launch.
- **FOUC on cached revisits** → browsers may restore the page from bfcache with loader already gone, or with loader still visible. → Mitigation: the `palermo-ready` class absence on bfcache restore is acceptable; users perceive the page as already loaded.
