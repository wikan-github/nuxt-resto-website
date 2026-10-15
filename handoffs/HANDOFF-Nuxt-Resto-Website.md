# HANDOFF — Nuxt-Resto-Website (general index)

> **Agent directive (mandatory):** before modifying any feature, read that
> feature's sub-handoff in `handoffs/` FIRST. After modifying a feature,
> append a dated entry to that sub-handoff's `## Changelog` (date —
> what changed — files touched). A code change without its changelog
> entry is incomplete.

## Project
Nuxt 4 marketing/order site for Tropical View Ubud, repositioned around
Ubud Monkey Forest foot traffic. Dual pricing (takeaway vs dine-in via
geofence), WhatsApp checkout, EN/ID i18n.
Local: `/media/kastawan/Kingston250-SSD/MEGAsync/@OpenCode/Output/Nuxt-Resto-Website/`.
Dev: `pnpm dev` → `0.0.0.0:3001`.

## Global rules (apply everywhere)
- **MikroORM v7 `defineEntity` — NEVER decorators** (breaks Nuxt's TS pipelines).
- Canonical WhatsApp is the `restaurant` DB row: `6281805444270`. Zero hardcoded numbers in `app/`.
- i18n EN/ID parity on every change (see `i18n.md`).
- DB is gitignored (`data/resto.db`). Rebuild: `pnpm migration:up && pnpm seed`.
- Docs as HTML: single self-contained file, TOC on the left + content on the
  right (content takes all remaining right space), TOC resizable via divider,
  placed in `/docs/`. Content must be searchable via a search box inside the
  TOC section (so it resizes with it); typing filters both TOC entries and
  content sections, with a match count and empty-query reset.
- No eslint/prettier/typecheck/tests/CI. Mobile breakpoints: 900px/768px/380px.

## Sub-handoffs (read the matching one first)
| Feature | File | Covers |
|---|---|---|
| Exit funnel | `exit-funnel.md` | `monkey-forest-exit` + `after-monkey-forest` pages, campaign/redemption APIs, QR placements, `campaign/` components |
| Menu & ordering | `menu-ordering.md` | menu/promotions pages, cart, order modal, menu/order/reservation/contact APIs |
| i18n | `i18n.md` | `en.json`/`id.json`, namespaces, parity rule (plus `HANDOFF-translations.md` for the editor project) |
| Shell & styling | `shell-styling.md` | default layout, header/footer, `main.css` sections, images, floating WA |
| Database | `database.md` | entities, migrations, seeders, `resto.db` handling |
| Config & deploy | `config-deploy.md` | `nuxt.config.ts`, MikroORM config, scripts, env, build |

## Cross-feature decisions (with reason)
- `defineEntity` over decorators: Nitro emits ES decorators, esbuild can't emit metadata.
- Entities registered as schema references (not globs): Nitro bundles have no `.ts` to glob.
- `server/data/*.json` orphaned but kept as seed reference.
- `/after-monkey-forest` and `/monkey-forest-exit` reuse homepage blocks + shared CSS (page-specific CSS only where justified).
- i18n `prefix_except_default`: EN has no prefix (`/menu`), ID uses `/id/menu`. Never create `pages/[lang]/` routes.

## Current state (2026-10-15)
- Done: SQLite migration + seed, DB-backed APIs, homepage Monkey Forest angle, both landing pages, redemption tracking + stats APIs, full mobile pass, WA unified.
- Audit: 3+/20 resolved. Live report: `audit-report.html`. Old audit detail: `MEMORY.md` (repo root).
