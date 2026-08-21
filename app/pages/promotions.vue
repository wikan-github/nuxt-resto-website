<!--
  ============================================================================
  promotions.vue — Menu Promotions Page (route: /promotions)
  ============================================================================
  This page showcases all current restaurant promotions and special offers.
  It contains:
    1. Hero header with page title
    2. Featured promotions section (large cards for top promos)
    3. All promotions grid (filterable by category)
    4. CTA banner at the bottom

  📚 LEARNING — What's New on This Page:
  This page introduces THREE new concepts compared to the menu page:
    1. Computed `filter` — filters by category (same concept as menu page)
    2. `slice()` — limits how many items to show (featured section)
    3. `v-if` + `v-else-if` + `v-else` — multiple conditional renders
-->
<template>
  <div>

    <!-- ════════════════════════════════════════════════════════════════════
         PAGE HEADER
         Standard hero section with label, title, and subtitle.
         ════════════════════════════════════════════════════════════════════ -->
    <!-- The extra "promotions-header" class lets our scoped styles below target
         ONLY this header — the featured/all sections further down keep their
         original (visible) colors. -->
    <section class="hero promotions-header" style="padding-bottom: 1rem;">
      <div class="container">
        <!-- i18n: Small uppercase label for the promotions section -->
        <p class="section-label">{{ $t('promotionsPage.label') }}</p>
        <!-- i18n: Main heading for the promotions page -->
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">{{ $t('promotionsPage.title') }}</h1>
        <!-- i18n: Descriptive subtitle about available promotions -->
        <p class="section-text">{{ $t('promotionsPage.description') }}</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         FEATURED PROMOTIONS
         Large cards for the top promotions that get special attention.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section" style="padding-bottom: 1rem;">
      <div class="container">

        <!--
          📚 LEARNING — `v-if` (Conditional Rendering):
          `v-if="featuredPromos.length > 0"` checks if there are ANY
          featured promotions. If the array is empty, this entire section
          is NOT rendered (it doesn't exist in the DOM).

          This prevents showing an empty "Featured" heading with no cards.
        -->
        <div v-if="featuredPromos.length > 0">
          <!-- i18n: Label for the featured promotions section -->
          <p class="section-label">{{ $t('promotionsPage.featured.label') }}</p>
          <!-- i18n: Title for the featured promotions section -->
          <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">{{ $t('promotionsPage.featured.title') }}</h2>

          <!--
            📚 `.featured-promo-grid` uses CSS Grid with large cards.
               Each card spans the full width in a 2-column layout.
               This makes featured promos visually prominent.
          -->
          <div class="featured-promo-grid">
            <!--
              📚 LEARNING — `v-for` with object destructuring:
              `v-for="promo in featuredPromos"` loops through the featured array.
              For each iteration, `promo` is the current promotion object.

              `:key="promo.id"` gives Vue a unique identifier for efficient DOM updates.
            -->
            <PromoCard
              v-for="promo in featuredPromos"
              :key="promo.id"
              :promo="promo"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         ALL PROMOTIONS
         Category filter tabs + grid of all promotion cards.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <!-- i18n: Label for the full promotions list section -->
        <p class="section-label">{{ $t('promotionsPage.all.label') }}</p>
        <!-- i18n: Title for the full promotions list section -->
        <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">{{ $t('promotionsPage.all.title') }}</h2>

        <!-- Category filter tabs -->
        <!--
          📚 We REUSE the CategoryTabs component from the menu page!
             This is the power of components — write once, use everywhere.
             We just pass different data (promo categories instead of menu categories).
        -->
        <CategoryTabs
          :categories="promoCategories"
          :active="activeCategory"
          @select="activeCategory = $event"
        />

        <!-- Promotion cards grid -->
        <div class="promo-grid">
          <PromoCard
            v-for="promo in filteredPromos"
            :key="promo.id"
            :promo="promo"
          />
        </div>

        <!--
          📚 LEARNING — `v-if` for Empty State:
          When no promotions match the selected category, we show a
          friendly "no results" message instead of an empty grid.
          This is called an "empty state" — good UX practice.
        -->
        <p
          v-if="filteredPromos.length === 0"
          style="text-align: center; color: var(--color-text-muted); margin-top: 3rem; font-family: var(--font-content);"
        >
          {{ $t('promotionsPage.noPromos') }}
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CTA BANNER
         Green banner encouraging WhatsApp reservation.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-banner">
          <!-- i18n: CTA heading encouraging users to act on promotions -->
          <h2>{{ $t('promotionsPage.ctaTitle') }}</h2>
          <!-- i18n: CTA description inviting contact for reservations or questions -->
          <p>{{ $t('promotionsPage.ctaDescription') }}</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20want%20to%20know%20about%20your%20promotions"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            <!-- i18n: Button label for WhatsApp contact link -->
            {{ $t('promotionsPage.chatBtn') }}
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCRIPT SECTION                                                        ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  📚 LEARNING — This script section introduces:
  1. Calling a composable: `usePromotions()`
  2. A computed property that FILTERS data
  3. Array methods: `.filter()`, `.slice()`
  4. The spread operator `...` to build an array
-->
<script setup lang="ts">

// ── Step 1: Fetch promotions from the server API ──
//
// 📚 LEARNING — `useFetch()` (Nuxt Data Fetching):
// `useFetch('/api/promotions')` sends a GET request to our server API route.
// During SSR, Nitro reads `server/data/promotions.json` and returns it.
// During client-side navigation, it fetches via HTTP like normal.
//
// `data` is a Ref containing the response body (parsed JSON).
// `pending` is true while the request is in progress.
// `error` contains any error that occurred.
const { data: promotions } = await useFetch<Promotion[]>('/api/promotions')

// ── Step 2: Reactive state for the active filter category ──
const activeCategory = ref('all')

// ── Step 3: Build the category tabs for the filter ──
//
// 📚 LEARNING — Array of Objects (manual definition):
// These categories are page-specific (different from menu categories).
// We define them inline since this page has its own set of promo categories.
const promoCategories = [
  { slug: 'all', label: 'All' },
  { slug: 'food', label: 'Food' },
  { slug: 'drink', label: 'Drinks' },
  { slug: 'set-menu', label: 'Set Menus' },
  { slug: 'daily', label: 'Daily Specials' },
]

// ── Step 4: Computed — Featured Promotions ──
//
// 📚 SAFETY CHECK — `promotions.value ?? []`:
// During SSR or before the fetch completes, `promotions.value` could be null.
// The `??` (nullish coalescing) operator returns `[]` (empty array) as fallback.
//
// 📚 LEARNING — `.filter()` and `.slice()`:
// `.filter(p => p.isFeatured)` keeps only featured promos.
// `.slice(0, 2)` takes only the first 2 from the filtered array.
const featuredPromos = computed(() => {
  if (!promotions.value) return []
  return promotions.value.filter(p => p.isFeatured).slice(0, 2)
})

// ── Step 5: Computed — Filtered Promotions ──
//
// 📚 Same filtering pattern as the menu page:
// If "All" is selected, show everything.
// Otherwise, filter by the selected category slug.
const filteredPromos = computed(() => {
  if (!promotions.value) return []
  if (activeCategory.value === 'all') return promotions.value
  return promotions.value.filter(p => p.category === activeCategory.value)
})
</script>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ STYLE SECTION (scoped)                                                ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  📚 LEARNING — Why these overrides are needed:
  The global stylesheet (main.css) has `.hero h1` and `.hero p` rules that
  paint text WHITE (via --color-hero-heading / --color-hero-text). That is
  correct for the homepage hero, which sits on a dark image card — but this
  page reuses the `.hero` class on a plain light background, so the header
  text was invisible.

  📚 LEARNING — `<style scoped>`:
  Vue attaches a unique data attribute (e.g., data-v-99f6e4f6) to every
  element in THIS component and rewrites each selector to match only that
  attribute. Combined with the `.promotions-header` wrapper class, each rule
  below has HIGHER specificity than the global `.hero h1` / `.hero p` rules,
  yet still applies ONLY to the header of the /promotions page.
-->
<style scoped>
/* Fix the small uppercase label ("Special Offers") in the page header */
.promotions-header .section-label {
  /* Dedicated black variable instead of the shared white hero text color */
  color: var(--color-promotions-label);
}

/* Fix the main heading ("Menu Promotions") in the page header */
.promotions-header .section-title {
  /* Dedicated black variable instead of the shared white hero heading color */
  color: var(--color-promotions-title);
}

/* Fix the subtitle paragraph in the page header */
.promotions-header .section-text {
  /* Dedicated black variable instead of the shared white hero paragraph color */
  color: var(--color-promotions-description);
}
</style>
