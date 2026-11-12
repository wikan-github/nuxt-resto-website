<script setup lang="ts">
// Note: 'lang="t"' is likely a typo — should be 'lang="ts"' for TypeScript.
// With 'lang="ts"', you get type checking, autocompletion, and error detection.
// With an invalid lang value, Vue may not process <script setup> correctly.
// REF: https://vuejs.org/api/sfc-script-setup.html

// PURPOSE: Initialize internationalization (i18n) for the component.
// BEHAVIOR: useI18n() returns the translation function `t` and current `locale`.
// COMMON USAGE: Every component that displays translated text needs this.
// DETAIL: t('key.path') looks up the string in the active locale's messages.
// REF: https://i18n.nuxtjs.org/docs/getting-started/usage
const { t, locale } = useI18n()

// PURPOSE: Get the campaign offer data resolved from QR/UTM parameters.
// BEHAVIOR: useCampaign() reads the current route's query params (e.g., ?utm_source=qr_exit)
//           and returns the matching offer from the backend/database.
// COMMON USAGE: Campaign-specific pages that show one targeted offer.
// DETAIL: `offer` is reactive (a Ref). `.value` accesses the actual object in script.
//         If no offer matches, offer.value is null/undefined — child components use v-if.
const { offer, code, utmSource } = useCampaign()

// PURPOSE: Get the function that builds WhatsApp deep links.
// BEHAVIOR: useWhatsApp() exposes buildClaimUrl() which constructs a wa.me URL
//           with phone number + pre-filled message text.
// COMMON USAGE: Any component with a "Claim on WhatsApp" button.
// DETAIL: The generated URL follows the format:
//         https://wa.me/{phone}?text={urlencoded_message}
// REF: https://faq.whatsapp.com/5913398998672934
const { buildClaimUrl } = useWhatsApp()

// PURPOSE: Create a single, reusable WhatsApp URL for the entire page.
// BEHAVIOR: computed() caches the result. It only rebuilds when offer.value,
//           utmSource.value, or locale.value changes.
//           The URL embeds: offer title, traffic source (qr_exit, qr_ticket, etc.),
//           and current language.
// COMMON USAGE: Passed as a prop to every CTA button so all "Claim" taps
//               go to the same WhatsApp conversation with the same context.
// DETAIL: computed() is lazy — it doesn't run until something reads whatsappUrl.value.
//         If offer.value is null, offerTitle becomes undefined — buildClaimUrl
//         should handle that gracefully (e.g., fall back to a generic message).
// REF: https://vuejs.org/api/reactivity-core.html#computed
const whatsappUrl = computed(() =>
  buildClaimUrl({
    offerTitle: offer.value?.title,   // Optional chaining: safe if offer is null
    utmSource: utmSource.value,        // e.g., "qr_exit", "qr_ticket" — for attribution
    locale: locale.value,              // e.g., "en", "id" — language for pre-filled message
  })
)

// PURPOSE: Determine whether the restaurant is currently open.
// BEHAVIOR: useOpenNow({ open: '07:00', close: '22:00' }) compares current
//           local time against the provided open/close hours.
//           Returns a reactive `isOpen` boolean that updates automatically.
// COMMON USAGE: Show "Open now" / "Closed" badges; disable CTAs when closed.
// DETAIL: If current time is 23:00, isOpen is false. The comparison uses
//         the client's local timezone unless the composable accepts a timezone param.
const { isOpen } = useOpenNow({ open: '07:00', close: '22:00' })

// PURPOSE: Track that the user viewed the offer (page view event).
// BEHAVIOR: onMounted() runs once after the component's DOM is inserted into
//           the page (client-side only — not during SSR).
//           If an offer exists, it fires 'offer_view' with offer slug, source, and code.
// COMMON USAGE: Funnel analytics — measure how many QR scans result in page views.
// DETAIL: The check `if (offer.value)` prevents tracking a "view" when no offer loaded.
//         useTrackEvent is typically a client-only composable — it's a no-op on server.
// REF: https://vuejs.org/api/composition-api-lifecycle.html#onmounted
//      https://nuxt.com/docs/api/composables/use-track-event (if using @nuxtjs/plausible)
onMounted(() => {
  if (offer.value) {
    useTrackEvent('offer_view', {
      offer: offer.value.slug,         // Identifies which offer was seen
      utm_source: utmSource.value,      // Which QR placement brought them
      code: code.value,                 // The specific campaign code
    })
  }
})

// PURPOSE: Set SEO meta tags for search engines and social sharing.
// BEHAVIOR: useSeoMeta() injects <title>, <meta description>, and og:image
//           into the document head during SSR.
//           The arrow functions make title and description reactive — they
//           re-evaluate when the locale changes.
// COMMON USAGE: Any page that should rank in search or look good when shared.
// DETAIL: useSeoMeta is XSS-safe and TypeScript-typed, avoiding common
//         `name` vs `property` mistakes. The ogImage path points to a
//         social preview image (should be ~1200x630px).
// REF: https://nuxt.com/docs/api/composables/use-seo-meta [citation:4]
useSeoMeta({
  title: () => t('campaign.seo.title'),          // Reactive — updates on locale change
  description: () => t('campaign.seo.description'),
  ogImage: '/images/og-after-monkey-forest.webp', // Static — same for all locales
})
</script>

<template>
  <!-- PURPOSE: Semantic wrapper for the page's main content. -->
  <!-- BEHAVIOR: Renders as <main>. Improves accessibility and SEO. -->
  <main>

    <!-- ============================================ -->
    <!-- SECTION 1: Sticky Offer Bar (Playbook §4.1)   -->
    <!-- ============================================ -->
    <!-- PURPOSE: Keep the offer + CTA always visible while scrolling. -->
    <!-- BEHAVIOR: v-if="offer" means this renders only when an offer is loaded. -->
    <!--           If no offer, the sticky bar doesn't appear (graceful degradation). -->
    <!-- PROPS: -->
    <!--   discount-label: e.g., "15% OFF" — displayed in the bar -->
    <!--   whatsapp-url: the computed wa.me URL -->
    <!-- EMITS: claim-click — fires when user taps the CTA -->
    <StickyOfferBar
      v-if="offer"
      :discount-label="offer.discountLabel"
      :whatsapp-url="whatsappUrl"
      @claim-click="useTrackEvent('wa_claim_click', { source: 'sticky_bar', utm_source: utmSource })"
    />

    <!-- ============================================ -->
    <!-- SECTION 2: Campaign Hero (Playbook §4.2)      -->
    <!-- ============================================ -->
    <!-- PURPOSE: Pattern-interrupt headline that mirrors the guest's state. -->
    <!-- BEHAVIOR: Shows H1, subhead, primary CTA (WhatsApp), secondary CTA (menu), -->
    <!--           and an "Open now" indicator. -->
    <!-- PROPS: -->
    <!--   eyebrow: small text above H1 (e.g., "Just finished the Sanctuary?") -->
    <!--   h1: main headline (from i18n) -->
    <!--   sub: supporting line (offer + proximity) -->
    <!--   cta-primary-label: "Claim on WhatsApp" -->
    <!--   cta-primary-url: the wa.me link -->
    <!--   cta-secondary-label: "See menu" -->
    <!--   cta-secondary-url: "/menu" (internal route) -->
    <!--   open-now: reactive boolean from useOpenNow -->
    <!-- EMITS: claim-click — tagged with source: 'hero' -->
    <!-- NOTE: There's a stray "1``6" in the source — likely a typo that breaks parsing. -->
    <CampaignHero
      :eyebrow="t('campaign.hero.eyebrow')"
      :h1="t('campaign.hero.h1')"
      :sub="t('campaign.hero.sub')"
      :cta-primary-label="t('campaign.hero.ctaPrimary')"
      :cta-primary-url="whatsappUrl"
      :cta-secondary-label="t('campaign.hero.ctaSecondary')"
      cta-secondary-url="/menu"
      :open-now="isOpen"
      @claim-click="useTrackEvent('wa_claim_click', { source: 'hero', utm_source: utmSource })"
    />

    <!-- PURPOSE: Wrapper for the main content sections with consistent spacing. -->
    <!-- BEHAVIOR: Scoped CSS (below) applies max-width: 720px and vertical gaps. -->
    <div class="page-body">

      <!-- ============================================ -->
      <!-- SECTION 3: Offer Card (Playbook §4.3)         -->
      <!-- ============================================ -->
      <!-- PURPOSE: The actual product — what they get, clearly stated. -->
      <!-- BEHAVIOR: v-if="offer" — renders only when offer data exists. -->
      <!-- PROPS: -->
      <!--   offer: the full offer object (title, description, discount, etc.) -->
      <!--   whatsapp-url: for the claim CTA inside the card -->
      <!-- EMITS: claim-click — source: 'offer_card' -->
      <OfferCard
        v-if="offer"
        :offer="offer"
        :whatsapp-url="whatsappUrl"
        @claim-click="useTrackEvent('wa_claim_click', { source: 'offer_card', utm_source: utmSource })"
      />

      <!-- SECTION 4: Why Sit Here (Playbook §4.4) -->
      <!-- PURPOSE: Pre-empt objections: far? uncomfortable? slow? kids? -->
      <!-- BEHAVIOR: Static content — no props, no events. -->
      <!-- COMMON USAGE: Reusable across campaign pages. -->
      <WhySitHere />

      <!-- SECTION 5: Popular Right Now (Playbook §4.5) -->
      <!-- PURPOSE: Answers "what do they serve?" with photos + dual pricing. -->
      <!-- BEHAVIOR: Likely fetches menu items or receives them via slot/context. -->
      <PopularNow />

      <!-- SECTION 6: Active Promotions (Playbook §4.6) -->
      <!-- PURPOSE: Proves deals are live (filtered to monkey_forest_guest audience). -->
      <!-- BEHAVIOR: Queries the promotions database, expiry-aware. -->
      <ActivePromotions />

      <!-- SECTION 7: Social Proof (Playbook §4.7) -->
      <!-- PURPOSE: The tiebreaker — rating, reviews, weekly guest count. -->
      <!-- BEHAVIOR: -->
      <!--   rating: 4.5 (static prop here; could be fetched) -->
      <!--   review-count: 1100 (Google review count) -->
      <!--   weekly-guest-count: 142 (from redemption log — should be dynamic in production) -->
      <!-- DETAIL: The weekly guest count should come from the API (promotion_redemption -->
      <!--         table) so it updates as guests claim and show up. -->
      <SocialProof :rating="4.5" :review-count="1100" :weekly-guest-count="142" />

      <!-- SECTION 8: Getting Here (Playbook §4.8) -->
      <!-- PURPOSE: Kill "where is it?" — map, walking route from exit, open hours. -->
      <!-- BEHAVIOR: Static map embed or image + route description. -->
      <GettingHere />

      <!-- SECTION 9: Mini-FAQ (Playbook §4.9) -->
      <!-- PURPOSE: Answer the 4 real hesitations before the guest gives up. -->
      <!-- BEHAVIOR: Accordion or simple Q&A list. -->
      <MiniFaq />

      <!-- ============================================ -->
      <!-- SECTION 10: Final CTA (Playbook §4.10)        -->
      <!-- ============================================ -->
      <!-- PURPOSE: Catch people who read everything before deciding. -->
      <!-- PROPS: whatsapp-url — same computed link -->
      <!-- EMITS: claim-click — source: 'final_cta' -->
      <FinalCta
        :whatsapp-url="whatsappUrl"
        @claim-click="useTrackEvent('wa_claim_click', { source: 'final_cta', utm_source: utmSource })"
      />
    </div>

    <!-- ============================================ -->
    <!-- SECTION 11: Floating WhatsApp Button (§4.11)  -->
    <!-- ============================================ -->
    <!-- PURPOSE: Always-available claim button at any scroll position. -->
    <!-- BEHAVIOR: Fixed-position button (likely bottom-right). -->
    <!--           If they're convinced at any point, one tap opens WhatsApp. -->
    <!-- PROPS: whatsapp-url -->
    <!-- EMITS: claim-click — source: 'floating' -->
    <FloatingWhatsApp
      :whatsapp-url="whatsappUrl"
      @claim-click="useTrackEvent('wa_claim_click', { source: 'floating', utm_source: utmSource })"
    />
  </main>
</template>

<style scoped>
/* PURPOSE: Constrain content width for readability on desktop. */
/* BEHAVIOR: Centers the content block with max-width 720px. */
/* DETAIL: 720px ≈ 65-75 characters per line — optimal for reading. */
/* REF: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width */
.page-body {
  max-width: 720px;
  margin: 0 auto;          /* Centers horizontally */
  padding: 32px 20px;      /* Top/bottom 32px; left/right 20px for mobile safety */
}

/* PURPOSE: Add consistent vertical spacing between all direct children. */
/* BEHAVIOR: The lobotomized owl selector — selects any element that has a */
/*           preceding sibling, applying margin-top. */
/* DETAIL: Avoids margin-collapse issues and keeps spacing uniform. */
/* REF: https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/ */
.page-body > * + * {
  margin-top: 32px;
}
</style>
