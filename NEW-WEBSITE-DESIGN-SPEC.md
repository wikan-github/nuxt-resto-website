# Tropical View Ubud — Redesign Spec

**Objective:** convert guests leaving Ubud Monkey Forest Sanctuary within the 2-minute "hot & hungry" window. **Primary KPI:** WhatsApp claim clicks + reservations originating from the `/after-monkey-forest` funnel (tracked per QR placement).

Real sites: restaurant — https://www.tropicalviewrestaurant.com/ · sanctuary — https://monkeyforestubud.com/

This spec builds on the existing Nuxt project (i18n, WhatsApp checkout, dual pricing, SQLite/MikroORM) rather than replacing it.

---

## 1. Sitemap

| Route | Role | Priority | Notes |
|---|---|---|---|
| `/after-monkey-forest` | **Campaign QR landing** (all sanctuary traffic) | P0 | Reads `?offer=` + `?utm_source=` |
| `/` | Home (general + sanctuary entry point) | P0 | Secondary CTA "Coming from Monkey Forest?" → campaign |
| `/menu` | Full menu, category tabs, dual pricing | P0 | Banner: "Sanctuary offer applies" |
| `/promotions` | Promotions hub (featured + all, filterable) | P0 | Renders expiry, hides expired |
| `/reserve` | Reservation form → DB + WhatsApp confirm | P1 | Missing today |
| `/visit` | Location, hours ("Open now"), directions, parking | P1 | Split from `/contact` |
| `/about` | Story, rice fields, photos, reviews | P2 | |
| `/contact` | Real contact form (exists), map, phone/email | P2 | |
| `/privacy` `/terms` | Legal (real site has these) | P2 | |
| `/id/*` | Indonesian mirror of every route | P0 | `prefix_except_default` already configured |
| `/[locale]/*` | Add tourist languages later (zh/ja/ko/fr/de/es/it/nl/ru/ar) | P3 | Real site runs 10; phase in |

Nav stays small: `Home · Menu · Promotions · After Monkey Forest · About · Contact` + persistent **Reserve** CTA.

### Campaign routing (QR → offer)
One page, many entries. The QR/flyer encodes:
```
/after-monkey-forest?utm_source=qr_ticket&utm_medium=qr&utm_campaign=sanctuary&offer=sanctuary-combo
```
Placements to attach (each its own `utm_source`): `qr_exit`, `qr_ticket`, `qr_guesthouse`, `qr_driver`, `qr_shop`, `guide_card`, `sticker_table`. Server resolves the active offer for `audience=monkey_forest_guest` if no `offer` param.

---

## 2. Page-by-page sections

### 2.1 `/after-monkey-forest` (rebuild, P0)
| # | Section | Content / behaviour |
|---|---|---|
| 1 | **Sticky offer bar** (mobile) | "15% off mains + free iced tea · 2 min walk" + WhatsApp **Claim**. Dismissible; hides on scroll-up on desktop. |
| 2 | **Hero** | H1 = the moment ("Just finished the Sanctuary? Cool down 2 minutes away"). Sub: offer + proximity. CTAs: **Claim on WhatsApp** (pre-filled w/ offer) + **See menu**. Note line: "Open now · 2–3 min walk from the exit". Real self-hosted photo (shaded rice-field seating). Language auto-detect. |
| 3 | **Offer card** | "Sanctuary Cool-Down Combo": what's included, validity window, "show your ticket/stamp", price. CTA claim. Rendered from DB (see §3). |
| 4 | **Why sit down here** | 4 benefits: 2–3 min walk · shaded seating · quick service · family friendly. |
| 5 | **Popular right now** | 3–6 dishes w/ dual pricing + add-to-cart; link to `/menu`. |
| 6 | **Active promotions** | Cards from DB filtered `audience=monkey_forest_guest` + `is_active`; link `/promotions`. |
| 7 | **Social proof** | Google/TripAdvisor rating + 2–3 review quotes + "N guests from the sanctuary this week" (from redemption counts). |
| 8 | **Getting here** | Map, "Open now", walking route from the sanctuary exit, parking/transport. |
| 9 | **Mini-FAQ** | Do I need the ticket? Is it walkable? Card/QRIS accepted? Halal/veg options? |
| 10 | **Final CTA** | "Ready to sit down and relax?" + WhatsApp. |
| 11 | **Persistent** | Floating WhatsApp (contextual message = offer). |

### 2.2 `/` Home (P0)
Hero (dual-intent, Reserve primary + "Coming from Monkey Forest?" secondary) → 4 value cards → signature dishes → featured promotions → location/hours/map → reviews strip → final CTA.

### 2.3 `/menu` (P0)
Header → sticky category nav → menu grid w/ dual-pricing toggle (dine-in vs takeaway, geofence-driven) → item detail/add-to-cart → "Sanctuary offer applies" banner → CTA.

### 2.4 `/promotions` (P0)
Header → **Sanctuary combo featured first** → featured grid → all promos with **DB-driven category tabs** (removes the current hardcoded 5 tabs bug) → **render `validUntil`, filter out expired, show countdown/badge** → promo detail (terms) → CTA.

### 2.5 `/reserve` (P1)
Form: party size, date, time, name, phone, email, notes → `POST /api/reservations` → store + return a `wa.me` confirmation link → success screen with "Add to calendar".

### 2.6 `/visit` (P1)
Map, address, **live "Open now"** (computed from hours), directions, walking route from sanctuary, parking, transport. (Also fixes the current 20 km coordinate mismatch — spec'd separately.)

### 2.7 Layout / global (P0)
Header nav + language switcher + cart + primary CTA (Reserve; swaps to "Claim offer" when arriving via campaign). Footer: contact, hours, map, social, TripAdvisor. `Restaurant` JSON-LD + per-page `useSeoMeta` + `hreflang`.

---

## 3. Promotion data model (DB)

Today `promotion` is a flat card table (free-text `category`, text `valid_until`, no audience/time/bundle/redemption). Redesign into a campaign-capable model. Keep the project convention: `defineEntity`, snake_case tables, append-only MikroORM migrations, seed is source of truth.

### 3.1 `promotion` (extend)
| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| slug | text unique | deep link `?offer=slug` |
| title / subtitle / description | text | EN base; translations in `promotion_translation` |
| terms | text | fine print |
| kind | text | `discount_pct` \| `discount_amount` \| `fixed_price` \| `bogo` \| `bundle` \| `free_item` \| `set_menu` |
| discount_label | text | display, e.g. "15% OFF" |
| **audience** | text | `all` \| `monkey_forest_guest` \| `local` \| `takeaway` ← campaign key |
| requires_ticket | bool | show sanctuary ticket/stamp |
| min_spend | real null | |
| max_redemptions | int null | global cap |
| per_customer_limit | int null | |
| valid_from | datetime null | |
| **valid_until** | datetime null | **real datetime** (replaces text) |
| days_of_week | text | csv `1..7` (Mon=1) |
| time_start / time_end | text | e.g. `11:00` / `15:00` (post-sanctuary window) |
| original_price_takeaway / _dinein | real null | |
| promo_price_takeaway / _dinein | real null | |
| hero_image / thumbnail | text | |
| is_active | bool | master switch |
| is_featured | bool | |
| priority | int | sort order |
| created_at / updated_at | datetime | |

### 3.2 `promotion_category` (new — replaces free-text `category`)
`id, slug, label, sort_order`. Same pattern as `Category`; feeds `/api/promotion-categories` (fixes hardcoded tabs).

### 3.3 `promotion_item` (new — bundles/combos)
`id, promotion_id FK, menu_item_id FK null, custom_name null, quantity, role` where `role ∈ {included, choice, free, discount_target}`.
→ "Sanctuary Cool-Down Combo" = 1 `choice` main (from a set) + 1 `free` item (iced tea).

### 3.4 `promotion_code` (new — QR placement / voucher)
`id, promotion_id FK, code unique, channel, max_uses, used_count, starts_at, expires_at, is_active`.
One code per QR placement enables per-source tracking and anti-abuse.

### 3.5 `promotion_redemption` (new — analytics)
`id, promotion_id FK null, code_id FK null, order_id FK null, reservation_id FK null, channel, utm_source, utm_medium, utm_campaign, redeemed_at`.
Powers "N guests this week", offers A/B, and channel ROI.

### 3.6 `campaign` (new — optional, placement registry)
`id, slug, name, channel, utm_source, utm_medium, utm_campaign, landing_path, default_promotion_id FK null, qr_image_path, scan_count`.
Maps a physical placement → landing URL + default offer. If skipped, encode this in `promotion_code.channel`.

### 3.7 `promotion_translation` (new — content i18n)
`id, promotion_id FK, locale, title, subtitle, description, terms`. Keeps promo copy out of the UI i18n JSON and translatable per language. Unique `(promotion_id, locale)`.

### Relations
`promotion 1─* promotion_item`, `promotion 1─* promotion_code`, `promotion 1─* promotion_redemption`, `promotion 1─* promotion_translation`, `promotion_redemption *─1 order/reservation`, `promotion_item *─1 menu_item`.

### API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/promotions?audience=&active=&channel=&featured=` | filtered list |
| GET | `/api/promotions/:slug` | detail + items + translations |
| GET | `/api/promotion-categories` | filter tabs |
| POST | `/api/promotions/validate-code` | `{code}` → validity + offer |
| POST | `/api/promotions/:id/redeem` | record redemption (also called on order/reserve) |
| POST | `/api/campaigns/:slug/scan` | increment `scan_count` |
| GET | `/api/campaigns/:slug` | resolve landing → default offer |

The `/after-monkey-forest` page calls: `GET /api/campaigns/:slug` (from `utm_source`) → `GET /api/promotions/:slug?audience=monkey_forest_guest` → renders offer + contextual WhatsApp message.

---

## 4. Cross-cutting

- **Analytics:** fire events for `qr_scan`, `offer_view`, `menu_view`, `wa_claim_click`, `reserve_submit`. WhatsApp click = primary conversion.
- **SEO:** per-page `useSeoMeta`, `i18n.baseUrl` + `useLocaleHead()` for hreflang, `Restaurant` + `Offer` JSON-LD, generated `sitemap.xml`, `robots.txt`, and a fully optimized **Google Business Profile** (category, hours, menu link, offers, photos, Q&A).
- **A11y:** modal `role="dialog"` + focus trap + Escape; keep 44–48px touch targets.
- **Performance:** self-host all imagery (no `tropicalviewrestaurant.com`/unsplash hotlinks), WebP, lazy below-fold, target fast paint on weak sanctuary wifi.

---

## 5. Build order (phased)

1. **P0 campaign:** fix coords → `promotion`/`promotion_category` migration + seed "Sanctuary Cool-Down Combo" → `/after-monkey-forest` rebuild (hero, offer, proof, map, sticky bar) → QR + UTM plumbing → GBP.
2. **P0 content:** `/promotions` DB tabs + expiry + featured-first; `/menu` offer banner; home dual-intent.
3. **P1:** `/reserve` (form → DB + WhatsApp), `/visit` with "Open now"; redemption tracking + analytics.
4. **P2/P3:** `/about`, `/contact`, legal, extra languages, `promotion_translation`.
