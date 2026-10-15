# Handoff — Exit funnel (Monkey Forest guest conversion)

> **Agent:** read this file FIRST before touching any exit-funnel code
> (landing pages, campaign/redemption APIs, QR placements). Log every
> modification in `## Changelog` below.

## Scope
QR scan → landing page → WhatsApp claim → seated guest. Two landing pages,
one resolver API, one tracking API, one stats API.

## Flow
1. QR at sanctuary exit → `/monkey-forest-exit?utm_source=<channel>&utm_medium=qr`
   (EN) or `/id/monkey-forest-exit?...` (ID). `utm_source` doubles as placement.
2. Page SSR-fetches `GET /api/campaigns/:placement` → offer card + claim code.
3. Guest taps Claim → `POST /api/redemptions/track` (fire-and-forget) → wa.me link
   with `(src: … | med: … | camp: …)` attribution segment.
4. `SocialProof` reads `GET /api/campaigns/:placement/stats` (live counts).

## Key files
- `app/pages/monkey-forest-exit.vue:1-230` — P0 funnel: hero (`<picture>`
  WebP+SVG), offer figure, `CampaignOfferCard`, `CampaignSocialProof`,
  `CampaignWalkingRoute`, `CampaignMiniFaq`, `CampaignStickyWhatsappBar`.
  No map iframe, no external scripts (4G budget). Query parsing + WA builder in `<script setup>`.
- `app/pages/after-monkey-forest.vue:1-287` — older sibling funnel (hero,
  ticket banner, benefits, location+map iframe, final CTA, inline offer bar).
- `app/components/campaign/HeroAfterMonkeyForest.vue` — campaign hero (used by after-monkey-forest).
- `app/components/campaign/OfferCard.vue` — offer card; accepts optional
  `utmSource/utmMedium/utmCampaign` props appended to the WA message.
- `app/components/campaign/SocialProof.vue` — SSR-fetches stats; star row is
  opt-in props (no reviews source yet — hidden until one exists).
- `app/components/campaign/WalkingRoute.vue` — haversine walk estimate
  (exit −8.5045,115.2633 → DB restaurant coords) + Maps link. NO embed (banned by perf budget, no vendor token).
- `app/components/campaign/MiniFaq.vue` — native `<details>`, copy from `monkey_forest_exit.faq.*`.
- `app/components/campaign/StickyWhatsappBar.vue` — bottom bar; owns
  `offer-bar-visible` state, fires tracking on click.
- `app/components/shared/AppImage.vue` — plain `<img>` + error→fallback swap
  (fallback works on 404, unlike `<picture>`). Warns once per missing src.
- `server/api/campaigns/[placement].get.ts` — channel→code→promotion, else
  direct slug; `{ offer: null }` when nothing matches. Aliases: `guest_exit`→`qr_exit`.
- `server/api/campaigns/[placement]/stats.get.ts` — weekly guests, AOV, totals,
  conversion. 404 on unknown placement.
- `server/api/redemptions/track.post.ts` — always resolves `{ success }`,
  never throws (must not block WA redirect).
- `server/utils/campaign.ts` — shared `resolveCampaignPromotion()` + alias map.
- `app/composables/useCampaign.ts:1-34`, `app/composables/useRedemptionTracking.ts:1-37`.
- Channels (DB `promotion_code`): `qr_exit`/`MF-EXIT-01` (default),
  `qr_sf_01`/`PROMO_QR_SF_01` (strategy-doc IDs), `qr_ticket`, `qr_guesthouse`, `qr_driver`.

## Rules
- New QR placements = new `promotion_code` row (seeder + DB), never new tables.
- `checkedInAt`/`orderValue` are filled by the future staff check-in flow; stats treat absence as zero.
- Page must add zero external requests (self-hosted WebP/SVG only).

## Open issues
- `offer-sanctuary-combo.webp` asset missing (SVG fallback in use).
- `hero-rice-field.webp` is 328KB (checklist target ≤180KB).
- Staff check-in UI does not exist (API + columns ready).

## Changelog
- 2026-10-14 — Created `monkey-forest-exit.vue`, `[placement].get.ts` (renamed
  from `[slug]`), `PromotionSeeder` sanctuary-combo, `OfferCard` UTM props — exit-funnel P0.
- 2026-10-14 — Added `promotion_redemption` table + migration, track/stats APIs,
  `useCampaign`/`useRedemptionTracking`, SocialProof/WalkingRoute/MiniFaq/
  StickyWhatsappBar/AppImage, `monkey_forest_exit` i18n (EN/ID), `qr_sf_01` channel.
