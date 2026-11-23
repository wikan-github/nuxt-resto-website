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


<script
  setup
  lang="ts"
>
  import CampaignHero from '~/components/monkey-forest/CampaignHero.vue';
  import StickyTopBar from '~/components/monkey-forest/StickyTopBar.vue';

  definePageMeta({
    layout: 'monkey-forest-exit'
  });
  const loremText ='Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore natus minima vel deleniti, possimus commodi illo neque quasi ullam suscipit? Facere eum incidunt qui laborum iure vero quasi asperiores deleniti.';
  
  const translatedStickyBarText = computed (
    () => loremText
  );

  const translatedCTAText = computed (
    () => "Get My Drink"
  );

</script>

<template>
  <main>
    <!-- Sticky offer bar for mobile view -->
    <StickyTopBar
      @claim-click=""
      :sticky-bar-text= translatedStickyBarText
      :cta-text= translatedCTAText
    />



    <!-- Campaign Hero -->
    <CampaignHero />

    <p>Campaign Hero now</p>

    <div></div>
  </main>
</template>

<style scoped></style>
