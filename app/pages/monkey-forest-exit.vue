<!--
  ============================================================================
  monkey-forest-exit.vue — "guest_exit" conversion funnel (P0 → full funnel)
  ============================================================================
  Route (i18n prefix_except_default):
    /monkey-forest-exit (EN) · /id/monkey-forest-exit (ID)
  Do NOT nest under pages/[lang]/ — @nuxtjs/i18n adds the prefix automatically.

  Funnel: Hero (WebP + SVG fallback) → Offer → SocialProof (live stats) →
  WalkingRoute (no embed, Maps link) → MiniFAQ → StickyWhatsAppBar (tracking).
  Deliberately NO map iframe and NO external scripts on this page so it stays
  < 2.5s on 4G Android. All copy is i18n-keyed (EN/ID symmetric).

  QR links look like:
    /monkey-forest-exit?utm_source=guest_exit&utm_medium=qr&utm_campaign=sf_exit
    /id/monkey-forest-exit?utm_source=qr_sf_01&utm_medium=qr
  `utm_source` doubles as the campaign placement resolver (guest_exit → qr_exit
  channel alias in server/api/campaigns/[placement].get.ts). Every WhatsApp CTA
  embeds src/med/camp segments AND fires POST /api/redemptions/track.
-->
<template>
  <div>
    <!-- ═══════════ HERO — WebP with SVG fallback ═══════════ -->
    <section class="hero">
      <div class="container">
        <div class="hero-card">
          <!-- <picture> serves the self-hosted WebP to capable browsers and
               falls back to the inline SVG when WebP is unsupported. No
               external requests on this path. fetchpriority speeds up LCP. -->
          <picture class="hero-picture" aria-hidden="true">
            <source srcset="/images/hero-rice-field.webp" type="image/webp" />
            <img
              src="/images/hero-rice-field.svg"
              alt=""
              fetchpriority="high"
              decoding="async"
              class="hero-img"
            />
          </picture>
          <div class="hero-bg"></div>
          <div class="hero-content">
            <p class="hero-eyebrow">{{ $t('campaignHero.eyebrow') }}</p>
            <h1>{{ $t('campaignHero.h1') }}</h1>
            <p>{{ $t('campaignHero.sub') }}</p>
            <div class="hero-buttons">
              <a
                :href="heroWaUrl"
                class="btn btn-white"
                target="_blank"
                rel="noopener"
                @click="trackClaim"
              >
                {{ $t('campaignHero.ctaPrimary') }}
              </a>
              <NuxtLink :to="localePath('/menu')" class="btn btn-outline-white">
                {{ $t('campaignHero.ctaSecondary') }}
              </NuxtLink>
            </div>
            <p class="hero-note">{{ $t('campaignHero.note') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ OFFER — live from /api/campaigns ═══════════ -->
    <section v-if="campaign?.offer" class="section">
      <div class="container">
        <p class="offer-label">{{ $t('monkey_forest_exit.offer.label') }}</p>
        <figure class="offer-figure">
          <!-- WebP is the future asset (see checklist); the SVG renders until
               it lands. SharedAppImage swaps on 404 — never a broken icon. -->
          <SharedAppImage
            src="/images/offer-sanctuary-combo.webp"
            fallback-src="/images/offer-sanctuary-combo.svg"
            alt="Sanctuary Cool-Down Combo"
            :width="800"
            :height="600"
            img-class="offer-figure-img"
          />
        </figure>
        <CampaignOfferCard
          :offer="campaign.offer"
          :utm-source="utmSource"
          :utm-medium="utmMedium"
          :utm-campaign="utmCampaign"
        />
        <p v-if="campaign.code" class="offer-code">
          {{ $t('monkey_forest_exit.offer.promo_code_label') }}: {{ campaign.code }}
        </p>
      </div>
    </section>

    <!-- ═══════════ SOCIAL PROOF — live weekly claim stats ═══════════ -->
    <CampaignSocialProof :placement="utmSource" />

    <!-- ═══════════ WALKING ROUTE — no embed, Maps link only ═══════════ -->
    <CampaignWalkingRoute
      :exit-lat="-8.5045"
      :exit-lng="115.2633"
      :exit-label="$t('monkey_forest_exit.route.exit_label')"
    />

    <!-- ═══════════ FAQ ═══════════ -->
    <CampaignMiniFaq />

    <!-- ═══════════ STICKY BAR (tracks claim, then opens WhatsApp) ═══════════ -->
    <CampaignStickyWhatsappBar
      :title="$t('afterForest.offerTitle')"
      :cta-label="$t('afterForest.offerBtn')"
      :dismiss-label="$t('afterForest.dismissBar')"
      :href="heroWaUrl"
      :placement-id="utmSource"
      :promotion-id="campaign?.offer?.id ?? null"
      :utm-source="utmSource"
      :utm-medium="utmMedium"
      :lang="locale"
    />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { public: { whatsappPhone } } = useRuntimeConfig()
const { track } = useRedemptionTracking()

const route = useRoute()

function firstQueryParam(value: string | string[] | null | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

// UTM params. utm_source doubles as the campaign placement; guest_exit is the
// default so bare QR scans still resolve (alias → qr_exit channel server-side).
const utmSource = computed(() => firstQueryParam(route.query.utm_source) ?? 'guest_exit')
const utmMedium = computed<string | null>(() => firstQueryParam(route.query.utm_medium))
const utmCampaign = computed<string | null>(() => firstQueryParam(route.query.utm_campaign))

// Campaign resolver (SSR-awaited so first paint already has the offer card).
const { campaign } = await useCampaign(utmSource.value)

// Single WhatsApp builder for hero + sticky bar: localized title + UTM segments.
const heroWaUrl = computed(() => {
  const parts: string[] = []
  if (utmSource.value) parts.push(`src: ${utmSource.value}`)
  if (utmMedium.value) parts.push(`med: ${utmMedium.value}`)
  if (utmCampaign.value) parts.push(`camp: ${utmCampaign.value}`)
  const suffix = parts.length ? ` (${parts.join(' | ')})` : ''
  const message = `Hi Tropical View Ubud, I just finished the Monkey Forest. I'd like to claim: ${t('campaignOffer.title')}.${suffix}`
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
})

// Fire-and-forget claim log; navigation to WhatsApp proceeds regardless.
function trackClaim(): void {
  track({
    placementId: utmSource.value,
    promotionId: campaign.value?.offer?.id ?? null,
    utm_source: utmSource.value,
    utm_medium: utmMedium.value,
    lang: locale.value,
  })
}

useSeoMeta({
  title: () => t('monkey_forest_exit.meta.title'),
  description: () => t('monkey_forest_exit.meta.description'),
  ogTitle: () => t('monkey_forest_exit.meta.title'),
  ogDescription: () => t('monkey_forest_exit.meta.description'),
  ogType: 'website',
})
</script>

<style scoped>
/* Hero media layer: picture fills the card behind the overlay/content.
   Inherits .hero* layout classes from global CSS; only the media fill is new. */
.hero-card {
  position: relative;
  overflow: hidden;
}
.hero-picture,
.hero-picture .hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-bg,
.hero-content {
  position: relative;
}
.hero-eyebrow {
  font-family: var(--font-content);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  opacity: 0.9;
  margin-bottom: 0.75rem;
}

/* Offer label + figure: capped width, lazy, rounded to match cards. */
.offer-label {
  font-family: var(--font-content);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-green);
  margin: 0 0 0.75rem;
}
.offer-figure {
  margin: 0 0 1.25rem;
}
.offer-figure :deep(.offer-figure-img) {
  width: 100%;
  max-width: 640px;
  height: auto;
  display: block;
  border-radius: 12px;
}
.offer-code {
  margin-top: 0.75rem;
  font-family: var(--font-content);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
