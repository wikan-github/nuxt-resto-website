# Handoff — Database

> **Agent:** read this file FIRST before touching entities, migrations,
> seeders, or `resto.db`. Log every modification in `## Changelog` below.

## Scope
MikroORM v7 + SQLite (`data/resto.db`, gitignored). Config: `mikro-orm.config.ts`
(entities registered as schema references, `dbName: ./data/resto.db`).

## Entities
- `server/entities/` — `Restaurant`, `Category`, `MenuItem`, `Promotion`
  (legacy menu promos → `menu_promotion` table), `Order`, `OrderItem`,
  `Reservation`, `ContactMessage`.
- `server/database/entities/` — `promotion.entity.ts` (`CampaignPromotion` →
  `promotion` table), `promotion-translation`, `promotion-category`,
  `promotion-code`, `promotion-redemption.entity.ts` (`PromotionRedemption`).
- **All `defineEntity`, never decorators.** Lazy property thunks for circular relations.

## Migrations & seed
- `server/migrations/` — `Migration20261013060208`, `Migration20261014024720`
  (campaign schema), `Migration20261014120000` (`promotion_redemption` + indexes).
- `server/seed.ts` (`pnpm seed`, legacy menu data) + `server/database/seeders/
  PromotionSeeder.ts` (idempotent upserts: `sanctuary-combo`, EN/ID
  translations, 5 QR channels incl. `qr_sf_01`/`PROMO_QR_SF_01`).
- Rebuild dev DB: `pnpm migration:up && pnpm seed` (+ MikroORM seeder for campaigns).
- Per-request `em.fork()` via `server/utils/orm.ts` (`useEntityManager`).

## Rules
- Schema change = new migration file, never edit applied migrations.
- Seeder upserts must never reset live counters (`usedCount` omitted by design).
- Never commit `data/*.db*`.

## Open issues
- **Geofence vs map ~20km apart** (DB `restaurant` row): geofence
  −8.6802432,115.2024576 vs map embed −8.506,115.262. Needs owner-confirmed coords.
- Production DB path/migration-on-deploy strategy undecided.

## Changelog
- 2026-10-14 — Campaign schema migration + `PromotionSeeder`; added
  `promotion_redemption` table + migration; added `qr_sf_01` channel.
