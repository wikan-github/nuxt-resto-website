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

// ── Step 1: Get promotion data from the composable ──
// 📚 `usePromotions()` is auto-imported from composables/usePromotions.ts.
//    It returns { promotions } — an array of Promotion objects.
const { promotions } = usePromotions()

// ── Step 2: Reactive state for the active filter category ──
// 📚 `ref('all')` creates a reactive variable with initial value 'all'.
//    When the user clicks a different category tab, this value changes,
//    and `filteredPromos` automatically recalculates.
const activeCategory = ref('all')

// ── Step 3: Build the category tabs for the filter ──
//
// 📚 LEARNING — Array of Objects (manual definition):
// Instead of fetching categories from a composable, we build the list
// right here. This works fine for small, page-specific data.
//
// 📚 The spread operator `...` copies all elements from one array into another.
//    We start with [{ slug: 'all', label: 'All' }] and add more categories.
const promoCategories = [
  { slug: 'all', label: 'All' },
  { slug: 'food', label: 'Food' },
  { slug: 'drink', label: 'Drinks' },
  { slug: 'set-menu', label: 'Set Menus' },
  { slug: 'daily', label: 'Daily Specials' },
]

// ── Step 4: Computed — Featured Promotions ──
//
// 📚 LEARNING — `.filter()` and `.slice()`:
//
// `.filter(callback)` creates a NEW array with only items that pass the test.
//   The callback returns `true` to KEEP the item, `false` to DISCARD it.
//   Here: keep items where `isFeatured === true`.
//
// `.slice(0, 2)` takes only the FIRST 2 items from the filtered array.
//   `slice(start, end)` — start at index 0, stop BEFORE index 2.
//   So we get at most 2 featured promotions.
//
// The full chain: `promotions.filter(...).slice(0, 2)` means:
// "Find all featured promotions, then take only the first 2."
const featuredPromos = computed(() => {
  return promotions.filter(p => p.isFeatured).slice(0, 2)
})

// ── Step 5: Computed — Filtered Promotions ──
//
// 📚 LEARNING — Same filtering pattern as the menu page:
// If "All" is selected, show everything.
// Otherwise, filter by the selected category slug.
//
// 📚 `computed()` caches its result. If `activeCategory` hasn't changed,
//    Vue returns the previous result without re-running the filter.
//    This is a performance optimization.
const filteredPromos = computed(() => {
  if (activeCategory.value === 'all') return promotions
  return promotions.filter(p => p.category === activeCategory.value)
})
</script>
