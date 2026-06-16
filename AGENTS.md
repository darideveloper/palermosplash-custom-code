# AGENTS.md — Palermo Splash Custom Code

## Project
WordPress landing page for artisan bakery (palermosplash.wpenginepowered.com). Custom CSS/JS enhancing Elementor-built pages.

## Tech
- **CMS**: WordPress + Elementor
- **Frontend**: Vanilla CSS + JS only (one file pair per feature)
- **PHP**: Minimal — Elementor widget registration, script enqueue
- **Images**: WebP, hosted in WP media library (NOT in this repo)
- **No build tools**, no npm, no test framework, no lint/typecheck

## Current Feature
Illustrated cake visual with clickable zones → navigate to separate pages (Cafe, Wholesale, Ready to Order, 365 Online Shop, Custom Cakes).

## File Conventions
- `feature-name.css` + `feature-name.js` per feature
- Enqueue via child theme `functions.php` or custom plugin (not in this repo)
- CSS selectors prefixed with `.palermo-` to avoid Elementor conflicts

## Workflow
- Openspec-driven: `opsx-propose` → `opsx-apply` → `opsx-verify` → `opsx-archive`
- Commit message format: `conventional commits`
- No codegen, migrations, or CI pipelines

## Gotchas
- All asset URLs point to WP media library, not local files
- Elementor outputs its own HTML wrappers — target elements by data attributes or custom classes, never by Elementor-generated class names
- WP Engine hosting: no server-side file writes, no shell access to WP core
