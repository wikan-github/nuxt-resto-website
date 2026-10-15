markdown

# OpenCode Single Command: Monkey Forest Guest Exit Conversion

## Execute This Command to Your OpenCode Agent

```
Build the Monkey Forest Guest Exit Conversion landing page system with these specs:

GOAL: Convert Monkey Forest Sanctuary exit traffic to restaurant guests via QR code → landing page → WhatsApp claim → seated guest

TECH STACK:
- Nuxt 4 (pages/ router, SSR enabled)
- MikroORM v7 (defineEntity API, SQLite)
- i18n with prefix_except_default (EN + ID)
- No external scripts (performance < 2.5s on 4G Android)

CAMPAIGN MECHANICS:
1. User scans QR code at sanctuary exit: /en/monkey-forest-exit?utm_source=qr_sf_01&utm_medium=qr
2. Landing page resolves placement ID → campaign + offer via API
3. User sees: moment-specific hero + offer card + social proof + walking route + sticky WhatsApp CTA
4. User taps "Claim via WhatsApp" → fires redemption tracking → redirects to WhatsApp with prefilled message
5. Staff receives claim, checks guest in, logs order value
6. Weekly analytics: guest count, conversion rate, AOV

---

## PHASE 1: DATABASE & ENTITIES (MikroORM v7 defineEntity)

Create `server/db/entities/` folder with these entities using defineEntity():

### 1. Promotion
- id: UUID (primary)
- name: string (e.g., "Sanctuary Cool-Down Combo")
- description: string
- isActive: boolean
- validFrom: Date
- validUntil: Date
- price?: number (IDR)
- category: ManyToOne<PromotionCategory>
- items: OneToMany<PromotionItem>
- translations: OneToMany<PromotionTranslation>
- redemptions: OneToMany<PromotionRedemption>
- timestamps: createdAt, updatedAt

### 2. PromotionCategory
- id: UUID (primary)
- name: string ("Sanctuary Specials")
- displayOrder: number
- promotions: OneToMany<Promotion>

### 3. PromotionItem
- id: UUID (primary)
- promotion: ManyToOne<Promotion>
- name: string (e.g., "Grilled white fish")
- type: enum (INCLUDED | CHOICE | FREE | DISCOUNT_TARGET)
- quantity?: number
- displayOrder: number
- timestamps: createdAt

### 4. PromotionCode
- id: UUID (primary)
- code: string (unique, e.g., "PROMO_QR_SF_01")
- promotion: ManyToOne<Promotion>
- campaign: OneToOne<Campaign>
- maxRedemptions?: number (anti-abuse cap)
- usageCount: number (default: 0)
- isActive: boolean
- timestamps: createdAt

### 5. Campaign
- id: UUID (primary)
- placementId: string (unique, e.g., "qr_sf_01")
- name: string ("Monkey Forest Exit - Sticky Note")
- description: string
- promotionCode: OneToOne<PromotionCode>
- defaultOffer: ManyToOne<Promotion>
- coordinatesLat?: number (-8.5045)
- coordinatesLng?: number (115.2633)
- isActive: boolean
- redemptions: OneToMany<PromotionRedemption>
- timestamps: createdAt, updatedAt

### 6. PromotionTranslation
- id: UUID (primary)
- promotion: ManyToOne<Promotion>
- language: string (enum: "en" | "id")
- name: string (localized offer name)
- description: string (localized description)
- heroH1?: string (moment-specific headline for landing page)
- heroSubtitle?: string
- ctaText?: string (button text)
- validityText?: string
- timestamps: createdAt, updatedAt

### 7. PromotionRedemption
- id: UUID (primary)
- promotion: ManyToOne<Promotion>
- campaign: ManyToOne<Campaign>
- utm_source: string (placement ID, e.g., "qr_sf_01")
- utm_medium: string (e.g., "qr")
- userAgent?: string
- language: string ("en" | "id")
- whatsappClaimAt: Date (when user tapped button)
- checkedInAt?: Date (when staff logged guest arrival)
- orderedAt?: Date (when order placed)
- orderValue?: number (in IDR)
- notes?: string (staff notes)
- timestamps: createdAt
- Indexes: (promotion, createdAt), (utm_source)

---

## PHASE 2: API ENDPOINTS

Create `server/api/` folder:

### GET /api/campaigns/[placement].get.ts
Input: `placement` route param (e.g., "qr_sf_01"), optional `locale` query param (default: "en")
Output:
```json
{
  "placementId": "qr_sf_01",
  "campaign": { "id", "name", "description" },
  "offer": {
    "id", "name", "description", "price": 125000, "currency": "IDR",
    "imageUrl": "/images/offer-sanctuary-combo.webp",
    "includes": ["Grilled white fish", "Steam white rice", "Iced tea"],
    "validity": "2024-12-31"
  },
  "promotionCode": "PROMO_QR_SF_01",
  "translation": {
    "heroH1": "You've just explored 700 years of monkey history. Now cool down with us.",
    "heroSubtitle": "Fresh, iced, and ready in 10 minutes",
    "ctaText": "Claim via WhatsApp"
  },
  "stats": { "weeklyGuestCount": 18 }
}
```

Behavior:
- Resolve campaign by placementId
- Return localized translations (fetch PromotionTranslation by language)
- Include promotion items + weekly stats
- Cache response for 1 hour
- Return 404 if placement not found

### POST /api/redemptions/track.ts
Input body:
```json
{
  "placementId": "qr_sf_01",
  "promotionId": "uuid",
  "utm_source": "qr_sf_01",
  "utm_medium": "qr",
  "lang": "en"
}
```
Output: `{ "success": true, "redemptionId": "uuid" }`

Behavior:
- Create PromotionRedemption record
- Log timestamp, userAgent, language
- Fire-and-forget (don't block WhatsApp redirect)
- Return success even if fails (analytics, not critical path)

### GET /api/campaigns/[placement]/stats.get.ts
Output:
```json
{
  "placementId": "qr_sf_01",
  "weeklyGuestCount": 18,
  "averageOrderValue": 185000,
  "totalRedemptions": 142,
  "conversionRate": "12.7%"
}
```

Behavior:
- Query PromotionRedemption with createdAt filter (last 7 days)
- Count checked-in guests
- Calculate AOV from orderValue field
- Used by SocialProof component

---

## PHASE 3: PAGES & COMPONENTS

Create `app/pages/[lang]/monkey-forest-exit.vue`:
- Import: Hero, OfferCard, SocialProof, WalkingRoute, MiniFAQ, StickyWhatsAppBar
- useCampaign() composable to fetch campaign by utm_source
- useRedemptionTracking() composable to fire tracking on WhatsApp click
- Meta tags: title, description, og:title
- Layout: Hero full-width → wrap (cards below) → sticky bar

Create `app/components/MonkeyForestExit/` folder with:

### Hero.vue
Props: imageUrl, imageAlt, h1, subtitle
- Full-bleed image (height: clamp(300px, 60vh, 600px))
- Gradient overlay (dark-green transparent for text legibility)
- Centered H1 + subtitle
- Scroll indicator (animated arrow bounce)
- Image uses AppImage component (fallback to placeholder.svg)

### OfferCard.vue
Props: offer (name, price, imageUrl, includes[], validity), promotionCode
- 2-column grid (image left, details right; stack on mobile)
- Price prominently displayed (large, green)
- "What's included" with checkmarks
- Validity badge + promo code (small, muted)
- Image uses AppImage component

### SocialProof.vue
Props: rating, reviewCount, weeklyGuestCount, trustLine
- Star rating (4.7 ★)
- Trust line: "18 guests from Monkey Forest this week"
- 3-stat row: rating, reviews, sanctuary guests
- Data source: POST /api/campaigns/[placement]/stats.get.ts

### WalkingRoute.vue
Props: from (lat, lng), to (lat, lng), walkingMinutes
- Mapbox embed (lazy-load only if user scrolls below fold)
- Red pin: sanctuary exit
- Green pin: restaurant
- Walking time overlay: "12 min walk from here"
- Link: "Open in Google Maps"

### MiniFAQ.vue
Props: faqs[] (question, answer)
Hardcode initial FAQs:
1. "Can I book a table in advance?" → "Yes, tap WhatsApp below"
2. "Is it only available today?" → "Valid through Dec 31, 2024"
3. "Do you have kids meals?" → "Yes, same discount applies"
4. "Can I book ahead?" → "Yes, WhatsApp reserves instantly"
5. "What if I have allergies?" → "Staff speak English + Indonesian"

Styling: accordion (one open at a time) or disclosure triangles

### StickyWhatsAppBar.vue
Props: phoneNumber, prefilledMessage, placementId, promotionId
- Fixed to bottom (sticky)
- Full width on mobile, max-width on desktop
- Button: "📞 Claim via WhatsApp"
- OnClick:
  - Call useRedemptionTracking().track() (fire-and-forget)
  - Redirect: window.open(`https://wa.me/{number}?text={message}`, '_blank')
- Loading state while tracking
- Height: 64px + safe-area-inset-bottom
- Slight box-shadow to indicate floating

### Shared/AppImage.vue
Props: src, alt, fallbackSrc (default: /images/placeholder.svg), width?, height?
- Try to load src
- On error: swap to fallbackSrc
- Log warning once per missing src (not on every render)
- Never show broken-image icon
- Reset state if src prop changes

---

## PHASE 4: COMPOSABLES

Create `app/composables/` folder:

### useCampaign.ts
```typescript
export const useCampaign = async (placementId: string) => {
  const { data, error } = await useFetch(`/api/campaigns/${placementId}`, {
    cache: 3600, // 1 hour
  });
  return { campaign: data.value, error };
};
```

### useRedemptionTracking.ts
```typescript
export const useRedemptionTracking = () => {
  const track = async (payload: {
    placementId: string;
    promotionId: string;
    utm_source: string;
    utm_medium: string;
    lang: string;
  }) => {
    // Fire-and-forget, don't block WhatsApp redirect
    $fetch('/api/redemptions/track', {
      method: 'POST',
      body: { ...payload, timestamp: Date.now() },
    }).catch(err => console.warn('[Redemption] Track failed:', err));
  };
  return { track };
};
```

### useImageFallback.ts
```typescript
export const useImageFallback = (initialSrc: string) => {
  const src = ref(initialSrc);
  const isFailed = ref(false);
  const onImageError = () => {
    if (!isFailed.value) {
      isFailed.value = true;
      src.value = '/images/placeholder.svg';
      console.warn(`[Image] Failed to load: ${initialSrc}`);
    }
  };
  return { src: computed(() => src.value), isFailed, onImageError };
};
```

---

## PHASE 5: i18n & TRANSLATIONS

Create/update `locales/en.json` and `locales/id.json`:

```json
{
  "monkey_forest_exit": {
    "hero": {
      "h1": "You've just explored 700 years of monkey history. Now cool down with us.",
      "subtitle": "Fresh, iced, and ready in 10 minutes"
    },
    "offer": {
      "label": "This week's sanctuary guest special",
      "includes": "What's included",
      "validity": "Valid through {date}",
      "promo_code": "Staff reference"
    },
    "social_proof": {
      "trust_line": "{count} guests from Monkey Forest this week",
      "see_reviews": "See all reviews"
    },
    "map": {
      "walking_time": "{minutes} min walk from here",
      "open_in_maps": "Open in Google Maps"
    },
    "faq": {
      "can_book": "Can I book a table in advance?",
      "answer_book": "Yes. Tap WhatsApp below or call..."
    },
    "cta": {
      "question": "Ready to cool down?",
      "button": "📞 Claim via WhatsApp",
      "prefilled": "Hi, I'd like to claim the Sanctuary Cool-Down Combo."
    },
    "meta": {
      "title": "Tropical View Ubud — Sanctuary Cool-Down Combo",
      "description": "Fresh iced tea, grilled fish, and steam rice. Special offer for guests leaving Monkey Forest Sanctuary."
    }
  }
}
```

---

## PHASE 6: SEEDER & DATA

Create `server/db/seeders/sanctuary-combo.seeder.ts`:

Seed data:
1. PromotionCategory: "Sanctuary Specials"
2. Promotion: "Sanctuary Cool-Down Combo" (price: 125000 IDR, valid through Dec 31, 2024)
3. PromotionItems:
   - Grilled white fish (INCLUDED)
   - Steam white rice (INCLUDED)
   - Iced tea (INCLUDED)
4. PromotionTranslations (EN + ID):
   - EN: heroH1 = "You've just explored 700 years of monkey history. Now cool down with us."
   - ID: heroH1 = "Anda telah menjelajahi 700 tahun sejarah monyet. Sekarang dinginkan dengan kami."
5. PromotionCode: "PROMO_QR_SF_01" (maxRedemptions: 1000)
6. Campaign: placementId="qr_sf_01", name="Monkey Forest Exit - Sticky Note"

Run seeder in nuxt.config.ts hook or via script:
```bash
npm run db:seed sanctuary-combo
```

---

## PHASE 7: ASSETS & IMAGES

Create `public/images/` folder:

1. `hero-rice-field.webp` (1920×1080, WebP q82, max 180 KB)
   - Content: Shaded thatched-roof seating with rice field visible, warm afternoon light

2. `offer-sanctuary-combo.webp` (1200×800, WebP q82, max 120 KB)
   - Content: Combo plate (fish + rice + iced tea), top-down or 45°, wooden table

3. `placeholder.svg` (1200×800 SVG)
   - Content: Dark green background (#1f2a24), rice-field line art, venue name, "Image loading..."

---

## PHASE 8: CONFIGURATION

Update `nuxt.config.ts`:

i18n config:
```typescript
i18n: {
  locales: [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesian' },
  ],
  defaultLocale: 'en',
  strategy: 'prefix_except_default',
  lazy: true,
  langDir: './locales/',
}
```

nitro config:
```typescript
nitro: {
  prerender: {
    routes: ['/en/monkey-forest-exit', '/id/monkey-forest-exit'],
    crawlLinks: false,
  },
  cache: { maxAge: 3600 }, // 1 hour
}
```

---

## PERFORMANCE TARGETS

✓ Page load < 2.5s on 4G Android (DevTools throttle)
✓ QR scans → page views > 80%
✓ Page views → WhatsApp claims > 15%
✓ Claims → seated guests > 60%
✓ No third-party scripts (performance critical)

Optimizations:
- Hero image lazy-loads (preload in head)
- Map lazy-loads (only if user scrolls)
- Campaign API caches 1 hour
- Inline critical CSS for hero fold
- WebP images with SVG fallback
- Redemption tracking fire-and-forget

---

## TESTING CHECKLIST

Before launch:
- [ ] Campaign API resolves placement ID → offer
- [ ] Page loads < 2.5s on 4G Android
- [ ] WhatsApp button redirects with correct prefilled message
- [ ] Redemption tracking logs utm_source + timestamp
- [ ] i18n switches correctly: /en/ vs /id/
- [ ] Images fallback gracefully
- [ ] Sticky bar stays on screen, doesn't block scroll
- [ ] Lighthouse score > 75 (mobile)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## QR CODE GENERATION

Generate QR codes pointing to:
```
https://tropical-view-ubud.com/en/monkey-forest-exit?utm_source=qr_sf_01&utm_medium=qr
https://tropical-view-ubud.com/id/monkey-forest-exit?utm_source=qr_sf_01&utm_medium=qr
```

Print as waterproof stickers, place at sanctuary exit.

---

## SUCCESS METRICS (First 60 Days)

- Page load: < 2.5s ✓
- QR scans → views: > 80% ✓
- Views → claims: > 15% ✓
- Claims → seated: > 60% ✓
- AOV: ≥ dine-in average ✓
- Best placement identified: Week 4 ✓

---

## IMPLEMENTATION ORDER FOR OPENCODE AGENT

Execute in this sequence:

1. **Create MikroORM entities** (server/db/entities/) with defineEntity
2. **Create API endpoints** (server/api/campaigns/, server/api/redemptions/)
3. **Create composables** (app/composables/)
4. **Create components** (app/components/MonkeyForestExit/)
5. **Create page** (app/pages/[lang]/monkey-forest-exit.vue)
6. **Add i18n translations** (locales/en.json, locales/id.json)
7. **Create seeder** (server/db/seeders/sanctuary-combo.seeder.ts) + run
8. **Place images** (public/images/) or create placeholder SVG
9. **Update nuxt.config.ts** (i18n, nitro, prerender)
10. **Test on 4G Android** + verify metrics
11. **Generate QR codes** + deploy

---

## NOTES FOR OPENCODE

- Use defineEntity() for MikroORM v7 entities
- SSR enabled (Nuxt 4 default)
- No external libraries except Mapbox for map embed
- Fire-and-forget redemption tracking (don't block user)
- Graceful image fallback (SVG placeholder, no broken-image icon)
- Cache campaign API response 1 hour
- Locale-aware: pull translations by i18n.locale
- Sticky bar respects safe-area-inset-bottom for notched phones

---

END COMMAND
```

---

## How to Use This Command

**Paste the entire block above into your OpenCode agent** and it will:

1. Understand the full architecture (entities, APIs, components, pages)
2. Generate all MikroORM v7 defineEntity code
3. Create Nuxt 4 pages and components
4. Wire up composables and i18n
5. Generate API endpoints with correct response shapes
6. Create the seeder with hardcoded "Sanctuary Cool-Down Combo" data

**The agent will execute Phase 1 → Phase 10** in order, creating a complete, working landing page system.
