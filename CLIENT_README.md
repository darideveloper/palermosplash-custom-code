# Palermo Splash — Client Delivery Document

*Project: Interactive cake landing page for the Palermo Splash bakery website.*

---

## 1. What You Got — In Plain English

### What changed on the homepage

The homepage already had an interactive cake before this project started, but it was built quickly from an AI-generated design: the code was messy, hard to maintain, and the look did not feel like the real Palermo Splash brand. It worked, but it did not reflect the quality of the bakery.

This project replaced that version with a clean, hand-crafted version of the same idea. Visitors still see an illustrated cake, and each layer of the cake is a doorway into a different part of your business:

- **Cafe** (top layer)
- **Wholesale**
- **Ready to Order**
- **365 Online Shop**
- **Custom Cakes** (bottom layer)

When a visitor moves their mouse over a layer, that layer lights up with a soft glow. When they click it, a small card slides in with a short description of the offering and a button that takes them to the correct page on your site. There is also a small "loading" overlay that appears for a second or two the first time someone visits, so the page never looks half-built while the images load.

The big difference is that the new version is built to last: the code is organized, the assets are optimized, and the design language is closer to the AI-generated direction you liked, but refined and on-brand.

### What it needs to keep working

- Your WordPress site hosted on WP Engine (already in place).
- The Elementor page that hosts the homepage, set up with the same widgets that were used during delivery (we noted these in your WordPress admin).
- A small set of custom files for the two features: the interactive cake and the loading overlay. In total, there are two stylesheets, three small scripts (one of them is a data file that holds the per-layer content), and one reference HTML snippet that was used to build the loader block in Elementor. These are already enqueued in your child theme, so you do not need to add anything.
- The illustration assets (cake image, glow effects, background, logo) are hosted in your WordPress media library. They do not need to be re-uploaded unless you intentionally want to swap an image.

### What the visitor sees

- A full-screen illustrated cake on the landing page. To make sure the experience looks right on every device, the project was built with **two dedicated layouts**: one tuned for vertical (portrait) screens such as phones held upright, and one tuned for horizontal (landscape) screens such as desktops and tablets turned sideways. The page automatically picks the correct layout based on the visitor's screen, so the cake and the clickable layers always fit nicely without scrolling, zooming, or awkward empty space.
- A polished "Loading" screen on the very first visit while the page finishes loading its images, then a smooth reveal of the cake.
- Hover effects on each layer (soft glow), and clickable cards with the right copy and link for each business line.

### How to use it day-to-day

You do not need to "run" anything. The page is part of your live website. When a visitor opens the homepage, the experience is automatic.

If you want to preview it before it goes live, open the page from a private/incognito window, or have someone outside your team take a look.

### What to do if something looks off

Most issues fall into one of three buckets, and you can resolve them without calling us:

1. **A layer button does nothing when clicked.**
   - Make sure the page has not been heavily edited in Elementor. If you rearranged the cake parts widget, the clickable layers may have lost their targets. Reverting that widget usually fixes it.

2. **The "Loading" overlay never disappears.**
   - This almost always means the page has an image or script that failed to load (often because of a caching plugin or a hosting hiccup). Clear your site cache (or ask your hosting support to), then reload the page.

3. **A popup card shows the wrong text or the wrong link.**
   - The text and links for each layer live in a single small file on the site. This file is intentionally easy to edit — see the "What you can adjust yourself" section below.

If the issue is not any of the above, take a screenshot, note the device (phone/desktop) and browser (Chrome/Safari/etc.), and send it to us. That information is enough for us to act quickly.

---

## 2. Why We Built It This Way

A few decisions were made on purpose, so you know what you paid for and can defend the work to anyone who asks.

### Decision 1: A clean rebuild of the original interactive cake
The previous version of the cake was an AI-generated concept that was dropped into the site with hard-coded, unoptimized, hard-to-maintain code. We could not reuse any of it. We chose to start from scratch rather than patch it because trying to fix that kind of code usually makes it worse over time. The new version keeps the spirit of the original AI design (a tall, illustrated, layered cake that holds the five product lines) but with a clean code base, optimized WebP assets, and a layout that works on phones and desktops. The result is a page that looks closer to the AI direction you liked, but feels like a finished product instead of a draft.

### Decision 2: Vanilla code, no heavy plugins
The custom work is plain CSS and JavaScript. We did not pull in a JavaScript framework, a page-builder plugin, or a third-party animation library. This keeps the page fast, keeps it compatible with the rest of your WordPress setup, and keeps the maintenance surface very small. The whole interactive feature is a handful of small files, not a black box.

### Decision 3: A separate "data file" for the layer content
Every layer's name, description, icon, and link live in one small file (`palermo-cake-data.js`) rather than being hard-coded in the page itself. The reason: when you want to change a word, swap an icon, or update a link, you change one line in one file. The visual code does not need to be touched. This separation is also what makes it safe for you to adjust content without breaking the layout.

### Decision 4: A custom loading overlay, not a plugin
We added a simple loading screen with a wobbling cake icon that appears for the first second or two of a visit. We could have installed a loading plugin, but plugins add weight, can break on updates, and usually do more than you need. Our overlay is just CSS and one tiny script, it respects users who have asked their system to reduce motion, and it retires itself automatically once the page is ready.

### Decision 5: Tap-friendly, accessible-by-default
The interactive layers are clickable (not hover-only) so they work on phones and tablets. The popup cards can be closed with an "X" button, by clicking outside the card, or by clicking another layer — three ways to dismiss, including the one users instinctively try first. We also paid attention to keyboard focus and to the "reduce motion" preference for users who have it turned on.

---

## 3. Looking After It Going Forward

### What could change in the future

A few things outside our control might eventually require a small update:

- **You add a new product line.** If you want a sixth layer on the cake (for example, a new "Catering" line), the data file can grow, but the cake illustration and the layout positions are sized for five. Adding a layer is a small job but does require a code edit.
- **You redesign the cake illustration.** If the artwork changes, the clickable zones will need to be repositioned so they line up with the new layers. This is typically a one-to-two-hour task.
- **You change your branding.** If you rebrand (new colors, new logo), the popup cards and the layer text colors are designed to follow the brand automatically, but the logo and color palette are part of your theme and may need a designer to revisit.
- **Browsers change.** Every few years, browsers roll out changes that occasionally affect how animations or interactive elements behave. We monitor this and will flag anything that needs a touch-up.

### What you can adjust yourself

The **only** thing you should ever need to edit for the cake feature is the data file that controls the per-layer content. It is structured so that you (or anyone comfortable editing a text file) can change:

- The icon shown next to each layer name (currently a small emoji like ☕, 🎂).
- The short name that appears on the cake (for example, "365 Online Shop").
- The full name shown in the popup card.
- The short description shown in the popup card.
- The web address the "Explore" button sends visitors to.
- Whether each link should open in a new tab (the default) or the same tab.

If you do not feel comfortable editing the file yourself, your developer or web team can do it in a few minutes. Just point them at the data file and tell them which layer to update.

**Where to find the file:** the data file is named `palermo-cake-data.js` and lives inside the **Custom CSS & JS** plugin, which you can open from the left side menu of your WordPress admin. Open the plugin, find `palermo-cake-data.js` in the list, click it, and you will see the content for all five layers. Edit only the values you want to change (icon, short name, full name, description, link) and save. The cake on the live page will pick up your changes immediately after a hard refresh.

### When you need us again

Reach out if any of the following come up:

- You want a new product line on the cake.
- You want to swap the cake illustration for a new design.
- You want to add a contact form, a newsletter signup, or an order shortcut inside the popup cards.
- You want the experience to be available in a second language.
- You want analytics, A/B testing, or marketing tags wired into the interactions.
- You want a fuller "modal" popup (a larger, more detailed view of a single layer).
- You want accessibility reviewed and certified formally.

We are happy to scope any of these as a small follow-up project.

---

## Appendix: Files in This Delivery

For reference, the custom code for this project lives in just a handful of files, organized by feature. If a developer or another designer ever needs to look at the work, these are the only files they need to open.

**Interactive cake feature**
- `palermo-cake/palermo-cake.css` — all the visual styles for the cake, the clickable layers, and the popup cards.
- `palermo-cake/palermo-cake.js` — the behavior: orientation detection, clickable layers, popup open/close, transitions.
- `palermo-cake/palermo-cake-data.js` — the per-layer content (icon, names, description, link) for all five layers. This is the only file you might ever need to edit for content updates.

**Loading overlay feature**
- `palermo-loader/palermo-loader.css` — the loading screen styles and the wobble animation.
- `palermo-loader/palermo-loader.js` — a tiny script that hides the loading screen once the page is ready.
- `palermo-loader/loader-snippet.html` — a reference page that contains the loader block as HTML, used to copy the markup into your Elementor widget. It is not loaded by the site.

**Outside this repository (managed in your WordPress install)**
- The illustration assets (the main cake image, the glow effects, the background, the brand logo) live in your WordPress media library.
- The page is set up in Elementor with the cake parts widget at the top.
- The custom styles and scripts above are enqueued through your child theme's `functions.php`.
