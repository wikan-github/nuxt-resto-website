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
    <section class="hero" style="padding-bottom: 1rem;">
      <div class="container">
        <!-- Small uppercase green label -->
        <p class="section-label">Special Offers</p>
        <!-- Main heading — uses clamp() for responsive font sizing -->
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">Menu Promotions</h1>
        <!-- Subtitle text -->
        <p class="section-text">Take advantage of our exclusive deals, happy hours, and seasonal specials.</p>
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
          <p class="section-label">Don't Miss Out</p>
          <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">Featured Offers</h2>

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
        <p class="section-label">Browse All</p>
        <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">All Promotions</h2>

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
          No promotions in this category right now. Check back soon!
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
          <h2>Ready to Grab These Deals?</h2>
          <p>Contact us now to reserve your table or ask about any of our current promotions.</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20want%20to%20know%20about%20your%20promotions"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            Chat on WhatsApp
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
