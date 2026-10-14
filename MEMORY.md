# Nuxt-Resto-Website - wikan-github/nuxt-resto-website
URL: https://github.com/wikan-github/nuxt-resto-website
Local: /media/kastawan/Kingston250-SSD/CODING/nuxt-resto-website
Studied: 2026-09-30
Purpose: Nuxt 4 marketing/order site for Tropical View Ubud restaurant. Dual pricing (takeaway vs dine-in via geofence), WhatsApp checkout, EN/ID i18n. Codebase is heavily teaching-oriented (dense 📚 LEARNING comments).

## Architecture

Nuxt 4 (srcDir `app/`), `@nuxtjs/i18n` 10.6, Nitro server routes, JSON-file data store, zero UI library, hand-written CSS.

```
server/data/*.json  →  server/api/*.get.ts  →  useFetch in composables  →  pages/components
```

- 5 pages: `index`, `menu`, `promotions`, `about`, `contact` (all exist, no orphan nav links)
- 9 components, 5 composables, 1 shared type file
- Global state via `useState()` in composables (no Pinia)
- i18n `prefix_except_default` → `/menu` (EN), `/id/menu` (ID); `lazy: true`, cookie `i18n_lang`

### Key Files

| File | Lines | Role |
|---|---|---|
| `app/assets/css/main.css` | 1792 | Entire design system, hand-written |
| `app/pages/contact.vue` | 728 | Longest page; also holds the fake form submit |
| `app/layouts/default.vue` | 388 | Header/nav, footer w/ Google Map iframe, mounts CartDrawer + OrderModal |
| `app/composables/useLocation.ts` | 310 | Geolocation + Haversine + `isNearRestaurant` geofence |
| `app/composables/useCart.ts` | 286 | `useState` cart, dual-price helpers, totals |
| `app/components/OrderModal.vue` | 302 | Order form → builds WhatsApp message |
| `app/composables/useRestaurant.ts` | 88 | Frontend bridge to `/api/restaurant` |
| `server/data/restaurant.json` | 32 | Single source of truth: WA, map, geofence, pricing, branding, address |
| `app/types/restaurant.ts` | 23 | Only `export type OrderType = 'takeaway' \| 'dine-in'` |

## Tech Stack

Nuxt `^4.5.2`, Vue `^3.5.41`, vue-router `^5.2.0`, `@nuxtjs/i18n` 10.6.0, TypeScript. pnpm. Fonts: Cardo (headings) / Inter (body) / Mulish (UI) via Google Fonts. Google Maps embed iframe. **No eslint, no prettier, no typecheck script, no tests, no CI, no `.github/`.**

## Important Patterns / Decisions

- **Dual pricing** is the core feature. Each item has `priceTakeaway` + `priceDinein`; promos have `promoPriceTakeaway/PriceDinein` + `originalPrice*`. Geofence picks which. `getItemPrice(item, orderType)` (`useCart.ts:81`) is the single source of truth for price.
- **Type guards** over classes: `'priceTakeaway' in item` discriminates `MenuItem` vs `Promotion` (`useCart.ts:83`).
- **`CartItem` holds `orderType`** so a mixed cart can mix prices; `addToCart` matches on `id` **AND** `orderType` (`useCart.ts:154`).
- **JSON data store** instead of DB — content ops = edit `server/data/*.json`, no rebuild.
- **`useFetch` with explicit `key`** for app-wide dedupe (`{ key: 'restaurant-info' }`, `useRestaurant.ts:44`).
- **Types-only file** `app/types/restaurant.ts`; runtime values deliberately live in `restaurant.json` (`restaurant.ts:5-7` explains why).
- Commit style: conventional commits (`feat(order):`, `fix(footer):`, `refactor(config):`). 30 commits, mostly `WikanSolution`.

## Gotchas / Notes — OPEN ISSUES (audited 2026-09-30)

### Critical

1. **All 4 API routes break in production.** `server/api/{menu,categories,promotions,restaurant}.get.ts` use `readFileSync(join(resolve('.'),'server','data','X.json'))`. `.output/` has no `data/` dir. Confirmed in built chunk: `.output/server/chunks/routes/api/menu.get.mjs:16`. Fix: import JSON directly or add nitro `serverAssets`/copy step.
2. **Two live WhatsApp numbers.** `restaurant.json:3` = `6281238047259` (only `OrderModal.vue:184` uses it). Old `6281338774969` hardcoded at `layouts/default.vue:99`, `index.vue:58,200`, `menu.vue:119`, `promotions.vue:142`, `about.vue:228`, `contact.vue:85,309,372`. The `useRestaurant` refactor is ~10% wired. Also unused: `whatsapp.reservationMessage`, `pricing.dineInMultiplier:1.15`, `branding.*`, `address.full`.
3. **Geofence vs map 20 km apart.** `restaurant.json:8-9` geofences `-8.6802432,115.2024576`; `embedUrl:10` renders `2d115.262!3d-8.506`. Haversine ≈ 20.45 km.
4. **Contact form is fake.** `contact.vue:441-455` = `alert()` + clear form. No `server/api/contact.post.ts`. Real version sketched in a comment at `:434`.

### Missing features

- No reservation page. 6 CTAs deep-link `wa.me` with hardcoded English `?text=Hello,%20I%20want%20a%20reservation` — label is i18n'd, message is not.
- Zero SEO: no `useSeoMeta`/`useHead` anywhere, no `i18n.baseUrl` (no `hreflang`), no og/twitter, `nuxt.config.ts:42` hardcodes `htmlAttrs:{lang:'en'}` with no `useLocaleHead()`. `public/robots.txt` has no sitemap; none generated.
- No `app/error.vue` (404/500).
- No loading/error states. `menu.vue:164-165`, `promotions.vue:180` discard `pending`/`error` — a failed fetch renders "No items found in this category". No skeleton/spinner in CSS.
- `validUntil` typed + populated in all 10 promos, **never rendered** (0 hits in `PromoCard.vue`); `promotions.get.ts:20` doesn't filter expired. Ids 3, 4 already past-dated.
- No modal a11y: `CartDrawer.vue:44` / `OrderModal.vue:38` lack `role="dialog"`, focus trap, Escape handler.
- No `.env.example` though `.gitignore:20` whitelists it.
- `README.md` is still the untouched Nuxt starter.
- Currency is `$` for a Ubud site; `OrderModal.vue:244,255` hardcodes `$${...}` bypassing `common.currency`.
- `promotions.vue:190-196` hardcodes 5 untranslated tab labels that should come from a `promo-categories.json` + `/api/categories` (the pattern `menu.vue` already uses).

### Bugs in shipped features

- **`useCart` mutators ignore `orderType`.** `addToCart:154` allows the same id twice, but `removeFromCart:177` filters on `id` alone (kills BOTH rows) and `updateQuantity:192` finds on `id` alone (decrements the wrong one). `:key="cartItem.item.id"` at `CartDrawer.vue:64` / `OrderModal.vue:56` yields duplicate Vue keys. Fix: key on `id + orderType`.
- **`useLocation` swallows errors.** Returns `userLocation/distanceToRestaurant/isLocationLoading/locationError/requestLocation` (`:302-309`) but only `isNearRestaurant` is consumed. Denied permission → silent takeaway-only, no manual override.
- **`getItemOriginalPrice` is dead code** — exported `useCart.ts:283`, zero callers; `PromoCard.vue:93-97` reimplements inline. No strikethrough price in cart/summary.

### Clean

- i18n parity: 144 keys each in `en.json`/`id.json`, zero asymmetry, all 157 `$t()` call sites resolve. **Do not re-audit this.**
- 6 orphan keys left after footer refactor (`6e0cfd9`): `footer.usefulLinks/openingHours/monSun/time`, `menuCard.currency`, `promoCard.currency` (superseded by `common.currency`).
- 6 code comments still say "within 10 meters" but `radiusMeters` is `30` (`AddToCartButton.vue:10,45,78`, `MenuCard.vue:60`, `useMenu.ts:20`).
- All imagery is placeholder: 30 `images.unsplash.com` URLs + 3 hotlinked from `tropicalviewrestaurant.com` (`index.vue:45`, `about.vue:64,206`).

## Suggested Fix Order

1. Prod break (issue 1) → 2. WA number drift (2) → 3. coords (3) → 4. contact endpoint (4) → 5. `useCart` orderType keys → 6. loading/error + `error.vue` + SEO → 7. reservation page + localized `?text` → 8. lint/test tooling.
