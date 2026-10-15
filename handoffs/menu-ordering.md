# Handoff — Menu & ordering

> **Agent:** read this file FIRST before touching menu, promos, cart, order,
> reservation, or contact code. Log every modification in `## Changelog` below.

## Scope
Menu browsing → cart (dual pricing) → WhatsApp order; promotions list;
reservation + contact endpoints.

## Key files
- `app/pages/menu.vue:1-233` — menu page, category tabs + `menu-grid`.
- `app/pages/promotions.vue:1-264` — featured + all promo grids.
- `app/components/MenuCard.vue:1-69`, `app/components/PromoCard.vue:1-108`,
  `app/components/CategoryTabs.vue:1-118`, `app/components/AddToCartButton.vue:1-125`.
- `app/components/CartDrawer.vue:1-159` — slide-over; item `:key` must be
  `id + orderType` (see bug below).
- `app/components/OrderModal.vue:1-302` — order form → wa.me message. Uses
  canonical WA `restaurant.json:3`/`OrderModal.vue:184` number via DB.
- `app/composables/useCart.ts:1-286` — `useState` cart; `getItemPrice:81` is
  the single price source; `addToCart:150` matches on id+orderType.
- `app/composables/useMenu.ts:1-71`, `app/composables/usePromotions.ts`,
  `app/composables/useLocation.ts:1-310` — geofence (`isNearRestaurant`) picks
  dine-in vs takeaway pricing.
- `server/api/menu.get.ts`, `server/api/categories.get.ts`,
  `server/api/promotions.get.ts` — legacy menu APIs (see bug below).
- `server/api/orders/index.get.ts` + `index.post.ts`,
  `server/api/reservations/index.get.ts` + `index.post.ts`,
  `server/api/contact.post.ts`, `server/api/restaurant.get.ts`.

## Rules
- Prices: `priceTakeaway`/`priceDinein` per item; promos add
  `promoPriceTakeaway/PriceDinein` + `originalPrice*`. Never hardcode `$`/IDR in
  templates — use `common.currency`.
- `CartItem` carries `orderType`; mixed carts are legal.

## Open issues (from audit — verify before closing)
- **Prod API break:** `menu/categories/promotions` routes use
  `readFileSync(... server/data/*.json)` — missing from `.output/`. Fix: import JSON or `serverAssets`.
- **`useCart` orderType bug:** `removeFromCart:176` filters on id alone (kills both
  rows), `updateQuantity:184` finds on id alone; drawer/modal `:key` on id alone
  → duplicate keys. Fix: key on `id + orderType`.
- Contact form posts to `/api/contact` (persisted) — verify end-to-end.
- `getItemOriginalPrice` (`useCart.ts`) is dead code; `PromoCard` reimplements inline.
- `validUntil` populated but never rendered; expired promos unfiltered.
- No reservation page UI (API + table ready); no loading/error states on menu/promos.

## Changelog
- (seed) 2026-10-15 — handoff created from audit state; no code change yet.
