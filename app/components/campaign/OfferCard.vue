<!--
  ============================================================================
  OfferCard.vue — Sanctuary Cool-Down Combo offer card
  ============================================================================
  Renders FIXED campaign copy from i18n `campaignOffer.*` (exact strings,
  EN/ID). The `offer` prop supplies dynamic data only: prices, validity
  window, ticket flag, and slug. Its text fields (title/subtitle/description/
  terms/discountLabel) are accepted for API compatibility (e.g. offers coming
  from the DB) but do not override the fixed campaign copy.

  Behaviour:
  - Ticket icon (🎟️) next to validity when `offer.requiresTicket`.
  - Expired when Date.now() > validUntil OR local time outside
    [timeStart, timeEnd] ("HH:MM"): 60% opacity, CTA disabled, badge → Ended.
  - Price shows promoPriceDinein; a "Takeaway: IDR X" line appears only when
    promoPriceTakeaway differs. Numbers formatted per active locale.
-->
<template>
  <div class="promo-card offer-card" :class="{ expired }">
    <div class="promo-card-body">
      <!-- Discount / Ended badge -->
      <span class="offer-badge">
        {{ expired ? $t('campaignOffer.ended') : $t('campaignOffer.badge') }}
      </span>

      <!-- Title + subtitle (fixed campaign copy) -->
      <h3 class="promo-card-title">{{ $t('campaignOffer.title') }}</h3>
      <p class="promo-card-desc">{{ $t('campaignOffer.subtitle') }}</p>

      <!-- What's included -->
      <ul class="offer-included">
        <li>{{ $t('campaignOffer.included.item1') }}</li>
        <li>{{ $t('campaignOffer.included.item2') }}</li>
      </ul>

      <!-- Validity window (+ ticket icon when required) -->
      <p class="offer-validity">
        <span v-if="offer.requiresTicket" class="offer-ticket" aria-hidden="true">🎟️</span>
        {{ $t('campaignOffer.validity') }}
      </p>

      <!-- Price: dine-in primary; takeaway line only when it differs -->
      <div class="offer-price">
        <span class="offer-price-label">{{ $t('campaignOffer.priceLabel') }}</span>
        <strong class="offer-price-main">
          {{ $t('campaignOffer.pricePrefix') }} {{ formatPrice(offer.promoPriceDinein) }}
        </strong>
        <small v-if="offer.promoPriceTakeaway !== offer.promoPriceDinein" class="offer-price-alt">
          {{ $t('cart.takeaway') }}: {{ $t('campaignOffer.pricePrefix') }} {{ formatPrice(offer.promoPriceTakeaway) }}
        </small>
      </div>

      <!-- CTA: live WhatsApp link, or disabled button when expired -->
      <a
        v-if="!expired"
        :href="whatsappUrl"
        class="btn btn-green offer-cta"
        target="_blank"
        rel="noopener"
      >
        {{ $t('campaignOffer.cta') }}
      </a>
      <button v-else class="btn btn-green offer-cta" disabled>
        {{ $t('campaignOffer.cta') }}
      </button>

      <!-- Terms (native disclosure, no JS) -->
      <details class="offer-terms">
        <summary>{{ $t('campaignOffer.termsLabel') }}</summary>
        <p>{{ $t('campaignOffer.terms') }}</p>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CampaignOffer {
  slug: string
  title: string
  subtitle: string
  description: string
  terms: string
  discountLabel: string
  promoPriceDinein: number
  promoPriceTakeaway: number
  originalPriceDinein: number
  validUntil: string | number | Date
  timeStart: string
  timeEnd: string
  requiresTicket: boolean
}

const props = defineProps<{
  offer: CampaignOffer
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}>()

const { t, locale } = useI18n()
const { public: { whatsappPhone } } = useRuntimeConfig()

function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

const expired = computed(() => {
  // Past the valid-until date?
  if (props.offer.validUntil != null) {
    const end = new Date(props.offer.validUntil).getTime()
    if (!Number.isNaN(end) && Date.now() > end) return true
  }
  // Outside today's [timeStart, timeEnd] window? Handles overnight ranges too.
  const start = parseTimeToMinutes(props.offer.timeStart)
  const end = parseTimeToMinutes(props.offer.timeEnd)
  if (start != null && end != null) {
    const now = new Date()
    const mins = now.getHours() * 60 + now.getMinutes()
    if (end >= start) {
      if (mins < start || mins > end) return true
    }
    else if (mins < start && mins > end) {
      return true
    }
  }
  return false
})

function formatPrice(value: number): string {
  return new Intl.NumberFormat(locale.value === 'id' ? 'id-ID' : 'en-US').format(value)
}

const whatsappUrl = computed(() => {
  const parts: string[] = []
  if (props.utmSource) parts.push(`src: ${props.utmSource}`)
  if (props.utmMedium) parts.push(`med: ${props.utmMedium}`)
  if (props.utmCampaign) parts.push(`camp: ${props.utmCampaign}`)
  const suffix = parts.length ? ` (${parts.join(' | ')})` : ''
  const message = `Hi Tropical View Ubud, I'd like to claim: ${t('campaignOffer.title')}.${suffix}`
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
})
</script>

<style scoped>
/* Expired state: faded card, no hover lift. */
.offer-card.expired {
  opacity: 0.6;
}
.offer-card.expired:hover {
  transform: none;
  box-shadow: none;
}

/* Badge: inline pill (no image to overlay, unlike .promo-badge). */
.offer-badge {
  display: inline-block;
  background: var(--color-green);
  color: #fff;
  font-family: var(--font-content);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

/* Included list. */
.offer-included {
  margin: 0 0 1rem 1.1rem;
  padding: 0;
  font-family: var(--font-content);
  font-size: 0.9rem;
  color: var(--color-text-body);
}
.offer-included li {
  margin-bottom: 0.35rem;
}
.offer-included li::marker {
  color: var(--color-green-accent);
}

/* Validity line with optional ticket icon. */
.offer-validity {
  font-family: var(--font-content);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-green);
  margin-bottom: 1rem;
}
.offer-ticket {
  margin-right: 0.35rem;
}

/* Price block. */
.offer-price {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-bottom: 1.25rem;
}
.offer-price-label {
  font-family: var(--font-content);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.offer-price-main {
  font-family: var(--font-content);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-green);
}
.offer-price-alt {
  font-family: var(--font-content);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* Full-width CTA; disabled state is non-interactive. */
.offer-cta {
  width: 100%;
}
.offer-cta:disabled {
  cursor: not-allowed;
}

/* Terms disclosure. */
.offer-terms {
  margin-top: 1rem;
  font-family: var(--font-content);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.offer-terms summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-green);
}
.offer-terms p {
  margin: 0.5rem 0 0;
  line-height: 1.5;
}
</style>
