# Handoff - 2026-10-13

## Goal
Nuxt 4 marketing/order site for Tropical View Ubud, repositioned around Ubud Monkey Forest foot traffic, with a dedicated conversion landing page. Dual pricing, WhatsApp checkout, EN/ID i18n. Local: `/media/kastawan/Kingston250-SSD/MEGAsync/@OpenCode/Output/Nuxt-Resto-Website/`. Dev: `0.0.0.0:3001`.

## Stack & Constraints
- Nuxt 4.5.2, Vue 3.5, i18n 10.6, pnpm. **SQLite + MikroORM v7 via `defineEntity` — NEVER decorators**. Circular relations use lazy thunks.
- DB: `data/resto.db` (gitignored). Rebuild: `pnpm migration:up && pnpm seed`. Canonical WA is the `restaurant` row: `6281805444270` / `+62 81-805-444-270`. Special-offer message: i18n `hero.monkeyForestMessage`.
- Mobile-first CSS: 900px/768px/380px breakpoints. No eslint/prettier/typecheck/tests/CI.

## Decisions Made (with reason)
- `defineEntity` over decorators because Nitro emits ES decorators and esbuild can't emit metadata.
- Entities as schema references (not globs) because Nitro bundles have no `.ts` to glob.
- `server/data/*.json` orphaned but kept as seed reference.
- All WA links resolve the number from DB at runtime; message from one i18n key.
- Landing page `/after-monkey-forest` reuses homepage blocks + shared CSS (zero page-specific styles); dedicated `afterForest` i18n namespace for its exact copy.
- Breakpoint aligned 767px → 768px per stakeholder spec.

## Current State
- Done: SQLite migration (8 tables, seeded), DB-backed APIs, frontend rewired, homepage Monkey Forest angle (hero, banner, 4 benefits, location, final CTA, floating WA, header CTA), landing page + nav links (desktop/mobile), full mobile pass, WA unified to `6281805444270`.
- Verified: all pages + APIs HTTP 200 (EN+ID), writes persist, i18n parity (163 keys), zero hardcoded numbers.
- Audit: 3/20 resolved. See `audit-report.html` (live status). Translation editor deferred to `HANDOFF-translations.md`.

## Next Steps
1. [ ] Fix geofence/map coords 20km mismatch (DB row) → audit #4
2. [ ] Fix `useCart` mutators (`id + orderType`) → `useCart.ts`
3. [ ] SEO (`useSeoMeta`, hreflang, og)
4. [ ] Reservation page UI (API + table ready)
5. [ ] CMS + POS sync design

## Open Questions
- Real restaurant photography to replace placeholders?
- Production deploy target (DB path/migration strategy)?
- Who re-translates ID copy (see `HANDOFF-translations.md`)?
