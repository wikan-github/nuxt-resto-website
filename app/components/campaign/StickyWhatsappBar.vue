<!--
  ============================================================================
  StickyWhatsappBar.vue — bottom claim bar (auto-import: CampaignStickyWhatsappBar)
  ============================================================================
  Extracted from the monkey-forest-exit page so the pattern is reusable.
  Fires redemption tracking fire-and-forget, then lets the anchor navigate
  to WhatsApp normally. Dismiss persists in shared state (FloatingWhatsApp
  reads the same key to hide itself while the bar is visible).
-->
<template>
  <div v-if="visible" class="offer-bar">
    <p>{{ title }}</p>
    <a
      :href="href"
      class="btn btn-white offer-bar-btn"
      target="_blank"
      rel="noopener"
      @click="onClaim"
    >
      {{ ctaLabel }}
    </a>
    <button
      class="offer-bar-close"
      :aria-label="dismissLabel"
      @click="visible = false"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  ctaLabel: string
  dismissLabel: string
  href: string
  placementId: string
  promotionId?: number | null
  utmSource?: string | null
  utmMedium?: string | null
  lang?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  promotionId: null,
  utmSource: null,
  utmMedium: null,
  lang: 'en',
})

const visible = useState('offer-bar-visible', () => true)
const { track } = useRedemptionTracking()
const { locale } = useI18n()

function onClaim(): void {
  track({
    placementId: props.placementId,
    promotionId: props.promotionId,
    utm_source: props.utmSource,
    utm_medium: props.utmMedium,
    lang: props.lang ?? locale.value,
  })
}
</script>

<style scoped>
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
