<!--
  ============================================================================
  after-monkey-forest.vue — Conversion landing page for Ubud Monkey Forest guests
  ============================================================================
  Dedicated URL for Sanctuary-exit traffic (flyers, QR codes, guides):
  `/after-monkey-forest` (EN) and `/id/after-monkey-forest` (ID).

  Funnel: hero (special offer) → ticket banner → benefits → location → final CTA.
  Every WhatsApp button uses the special-offer message (i18n `hero.monkeyForestMessage`)
  and the DB number (useRestaurant). All copy is i18n-keyed (EN/ID).
-->
<template>
  <div>

    <!-- Campaign hero: query-driven offer (?offer=, ?utm_source=) + locale-aware copy. -->
    <CampaignHeroAfterMonkeyForest :offer-slug="offerSlug" :utm-source="utmSource" />

    <!-- ═══════════ TICKET OFFER BANNER ═══════════ -->
    <section class="section">
      <div class="container">
        <div class="guest-banner">
          <div class="guest-banner-text">
            <h2>{{ $t('afterForest.offerTitle') }}</h2>
            <p>{{ $t('afterForest.offerText') }}</p>
          </div>
          <a
            :href="waMeUrl($t('hero.monkeyForestMessage'))"
            class="btn btn-green"
            target="_blank"
            rel="noopener"
          >
            {{ $t('afterForest.offerBtn') }}
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════ BENEFITS — why stop here ═══════════ -->
    <section class="section">
      <div class="container">
        <div class="green-card">
          <p class="section-label">{{ $t('values.label') }}</p>
          <h2 class="section-title">{{ $t('values.title') }}</h2>
          <p class="section-text">{{ $t('values.description') }}</p>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">🚶</div>
              <h3>{{ $t('values.walk.title') }}</h3>
              <p>{{ $t('values.walk.description') }}</p>
            </div>
            <div class="value-card">
              <div class="value-icon">🌾</div>
              <h3>{{ $t('values.shade.title') }}</h3>
              <p>{{ $t('values.shade.description') }}</p>
            </div>
            <div class="value-card">
              <div class="value-icon">⚡</div>
              <h3>{{ $t('values.fast.title') }}</h3>
              <p>{{ $t('values.fast.description') }}</p>
            </div>
            <div class="value-card">
              <div class="value-icon">👪</div>
              <h3>{{ $t('values.family.title') }}</h3>
              <p>{{ $t('values.family.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ LOCATION — steps away + map ═══════════ -->
    <section class="section">
      <div class="container">
        <div class="about-row">
          <div>
            <p class="section-label">{{ $t('location.label') }}</p>
            <h2 class="section-title">{{ $t('location.title') }}</h2>
            <p class="section-text" style="margin-bottom: 2rem;">
              {{ $t('afterForest.locationText') }}
            </p>
            <a
              :href="mapsLink"
              class="btn btn-green"
              target="_blank"
              rel="noopener"
            >
              {{ $t('location.directionsBtn') }}
            </a>
          </div>
          <div class="location-map">
            <iframe
              :src="restaurant?.mapEmbedUrl"
              width="100%"
              height="100%"
              style="border: 0; border-radius: 12px;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ FINAL CTA ═══════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-banner">
          <h2>{{ $t('cta.title') }}</h2>
          <p>{{ $t('cta.description') }}</p>
          <a
            :href="waMeUrl($t('hero.monkeyForestMessage'))"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            {{ $t('cta.reserveBtn') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Sticky offer bar (this page only): slim, dismissible, safe-area aware.
         The floating WA button hides while this is visible (see FloatingWhatsApp),
         so the two never overlap. Dismiss persists via shared useState. -->
    <div v-if="showOfferBar" class="offer-bar">
      <p>{{ $t('afterForest.offerTitle') }}</p>
      <a
        :href="waMeUrl($t('hero.monkeyForestMessage'))"
        class="btn btn-white offer-bar-btn"
        target="_blank"
        rel="noopener"
      >
        {{ $t('afterForest.offerBtn') }}
      </a>
      <button
        class="offer-bar-close"
        :aria-label="$t('afterForest.dismissBar')"
        @click="showOfferBar = false"
      >
        ×
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
// WhatsApp number + map URLs from the `restaurant` row in SQLite;
// special-offer message from i18n (hero.monkeyForestMessage).
const { restaurant, waMeUrl, mapsLink } = useRestaurant()

// Campaign query params: ?offer=<slug>&utm_source=<source>.
// Normalized to string|null (first value wins if the key repeats).
const route = useRoute()

function firstQueryParam(value: string | string[] | null | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

const offerSlug = computed<string | null>(() => firstQueryParam(route.query.offer))
const utmSource = computed<string | null>(() => firstQueryParam(route.query.utm_source))

// Page-specific SEO so this landing page isn't treated as duplicate content.
// NOTE: useI18n() exposes `t` (not `$t`) in <script setup>; $t is template-only.
const { t } = useI18n()
useSeoMeta({
  title: () => t('seo.afterForest.title'),
  description: () => t('seo.afterForest.description'),
  ogTitle: () => t('seo.afterForest.title'),
  ogDescription: () => t('seo.afterForest.description'),
  ogType: 'website',
})

// Sticky offer bar visibility. Persisted in shared state so dismissing it
// sticks across navigation; FloatingWhatsApp reads the same key to hide itself.
const showOfferBar = useState('offer-bar-visible', () => true)
</script>

<style scoped>
/* Bottom-fixed offer strip, landing page only.
   z-index 140: above content/header (100) but below cart/modal (200+).
   Safe-area padding keeps it off phone notches/gesture bars. */
.offer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 140;
  background: var(--color-green);
  color: #fff;
  padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
}

.offer-bar p {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.35;
  font-family: var(--font-content);
}

.offer-bar .btn {
  flex-shrink: 0;
  min-height: 44px;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.offer-bar-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;
}

@media (max-width: 380px) {
  .offer-bar p {
    font-size: 0.8rem;
  }
}
</style>
