<!--
  ============================================================================
  HeroAfterMonkeyForest.vue — Campaign hero for Sanctuary-exit traffic
  ============================================================================
  Full-width hero with dark overlay on the self-hosted rice-field WebP.
  Copy comes from i18n `campaignHero.*` (exact strings, EN/ID) and resolves
  in the active locale automatically. All visual classes are the shared
  homepage hero classes, so every mobile rule applies with zero new CSS
  except the eyebrow line below.

  WhatsApp CTA: fixed English template with the offer title + optional
  `(src: …)` segment, encoded via encodeURIComponent, sent to the number
  in `runtimeConfig.public.whatsappPhone`.
-->
<template>
  <section class="hero">
    <div class="container">
      <div
        class="hero-card"
        style="background-image: url('/images/hero-rice-field.webp'); background-size: cover; background-position: center;"
      >
        <div class="hero-bg"></div>
        <div class="hero-content">
          <p class="hero-eyebrow">{{ $t('campaignHero.eyebrow') }}</p>
          <h1>{{ $t('campaignHero.h1') }}</h1>
          <p>{{ $t('campaignHero.sub') }}</p>
          <div class="hero-buttons">
            <a
              :href="whatsappUrl"
              class="btn btn-white"
              target="_blank"
              rel="noopener"
            >
              {{ $t('campaignHero.ctaPrimary') }}
            </a>
            <NuxtLink to="/menu" class="btn btn-outline-white">
              {{ $t('campaignHero.ctaSecondary') }}
            </NuxtLink>
          </div>
          <p class="hero-note">{{ $t('campaignHero.note') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  offerSlug: string | null
  utmSource: string | null
}

const props = defineProps<Props>()

// Active locale ('en' | 'id', default 'en' per i18n config). All copy above
// renders through $t(), which auto-resolves in this locale — no manual
// branching needed. Destructured here to make the dependency explicit.
const { locale } = useI18n()
void locale

// WhatsApp destination from public runtime config (mirrors the DB restaurant row).
const { public: { whatsappPhone } } = useRuntimeConfig()

// Known offer slugs → display titles embedded in the WA message.
// Unknown slugs are humanized ("sanctuary-combo" → "Sanctuary Combo");
// no slug falls back to the default Guest Special title.
const KNOWN_OFFERS: Record<string, string> = {
  'sanctuary-combo': 'Ubud Monkey Forest Guest Special',
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const offerTitle = computed(() => {
  if (!props.offerSlug) return 'Ubud Monkey Forest Guest Special'
  return KNOWN_OFFERS[props.offerSlug] ?? humanizeSlug(props.offerSlug)
})

const whatsappUrl = computed(() => {
  const src = props.utmSource ? ` (src: ${props.utmSource})` : ''
  const message = `Hi Tropical View Ubud, I just finished the Monkey Forest. I'd like to claim: ${offerTitle.value}.${src}`
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
})
</script>

<style scoped>
/* Eyebrow line: mirrors .section-label in white for the dark hero. */
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
</style>
