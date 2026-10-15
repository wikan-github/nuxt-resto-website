# Handoff — Shell & styling

> **Agent:** read this file FIRST before touching layout, header/footer,
> global CSS, images, or the floating WA button. Log every modification in
> `## Changelog` below.

## Scope
`app/layouts/default.vue` (header/nav, footer + map, mounts CartDrawer +
OrderModal), `app/assets/css/main.css` (whole design system, ~2189 lines),
`app/components/FloatingWhatsApp.vue`, `LanguageSwitcher.vue`,
`NavBreadcrumb.vue`, `public/images/*`.

## Key facts
- `main.css` sections: 1 tokens (`:root`), 2 reset, 3 utilities, 4 header,
  5 hero, 6 buttons, 7 layouts, 8 values grid (4-col), 9 about row,
  10 tabs, 11 menu grid, 12 CTA banner, 13 footer, 14 promo cards,
  16 add-to-cart, 17 menu-card actions, 18 cart icon, 19 cart drawer,
  20 order modal, 21 Vue transitions, **22 responsive (must stay LAST for
  cascade order)**. Every rule is commented (teaching style).
- Breakpoints 900px/768px/380px. Touch targets ≥44–48px on phones.
- `FloatingWhatsApp.vue:35-37` hides while any landing-page sticky bar is up
  (shared `offer-bar-visible` state) — extend the route check for new funnels.
- Footer map iframe is `loading="lazy"` (non-blocking).
- Images: `hero-rice-field.webp` + `.svg` fallback, `offer-sanctuary-combo.svg`,
  `placeholder.svg`, `logo.png`. 30 Unsplash URLs + 3 hotlinked images remain
  as placeholders site-wide.

## Rules
- Page-specific CSS only with justification; prefer shared classes.
- Footer clearance for the floating WA button on every new fixed element.

## Open issues
- Placeholder imagery everywhere (see above); no real photography yet.
- `hero-rice-field.webp` 328KB (target ≤180KB).

## Changelog
- 2026-10-15 — Commented every uncommented rule in `main.css`; fixed stale
  SECTION 8 (3→4 col) and misnumbered responsive section (15→22).
- 2026-10-14 — `FloatingWhatsApp` hide logic extended to `monkey-forest-exit`.
