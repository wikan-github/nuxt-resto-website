<!--
  ============================================================================
  menu.vue — Menu Page (route: /menu)
  ============================================================================
  This page shows all restaurant dishes with category filtering.
  Clicking a category tab filters the dishes shown below.

  📚 LEARNING — What Makes This Page "Interactive":
  Unlike the homepage (which is mostly static), this page has:
    1. A reactive variable (`activeCategory`) that tracks which tab is selected
    2. A computed property (`filteredItems`) that recalculates when the category changes
    3. A loop (`v-for`) that renders a card for each dish

  These are the core Vue concepts for building dynamic UIs.
-->
<template>
  <div>

    <!-- ════════════════════════════════════════════════════════════════════
         PAGE HEADER
         Small intro section at the top of the menu page.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="hero" style="padding-bottom: 1rem;">
      <div class="container">
        <!-- i18n: Small uppercase label identifying the restaurant brand -->
        <p class="section-label">{{ $t('menuPage.label') }}</p>
        <!-- i18n: Main heading for the menu page -->
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">{{ $t('menuPage.title') }}</h1>
        <!-- i18n: Descriptive subtitle about the menu offerings -->
        <p class="section-text">{{ $t('menuPage.description') }}</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         MENU CONTENT
         Category tabs + filtered grid of dish cards.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">

        <!--
          ╔═══════════════════════════════════════════════════════════════╗
          ║ CATEGORY TABS COMPONENT                                      ║
          ╚═══════════════════════════════════════════════════════════════╝

          📚 LEARNING — Component Props:
          Props are data you pass FROM a parent component TO a child component.
          Think of them as function arguments.

          - `:categories="categories"` → passes the `categories` array as a prop
          - `:active="activeCategory"` → passes the currently selected category slug
          - `@select="activeCategory = $event"` → listens for an event from the child

          📚 LEARNING — Custom Events (@select):
          When the user clicks a tab in CategoryTabs, the child EMITS a 'select' event
          with the clicked category's slug. The parent receives it and updates its state.

          Data flow: Parent → Child (via props)  Child → Parent (via events)
        -->
        <CategoryTabs
          :categories="categories"
          :active="activeCategory"
          @select="activeCategory = $event"
        />

        <!--
          ╔═══════════════════════════════════════════════════════════════╗
          ║ MENU CARDS GRID                                               ║
          ╚═══════════════════════════════════════════════════════════════╝

          📚 LEARNING — `v-for` (List Rendering):
          `v-for="item in filteredItems"` loops through the `filteredItems` array
          and renders a <MenuCard> for EACH item.

          For example, if filteredItems has 5 dishes, this creates 5 MenuCard elements.

          📚 LEARNING — `:key="item.id"`:
          Vue needs a unique "key" for each item in a loop. This helps Vue
          efficiently update the DOM when items are added/removed/reordered.
          Always use a UNIQUE identifier (like `id`) — never use the array index.
        -->
        <div class="menu-grid">
          <MenuCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
          />
        </div>

        <!--
          📚 LEARNING — `v-if` (Conditional Rendering):
          `v-if="filteredItems.length === 0"` only renders this <p> element
          when the filtered list is empty (e.g., a category with no dishes).

          `v-else` would render something when the condition is FALSE.
          You can also use `v-else-if="..."` for additional conditions.
        -->
        <p
          v-if="filteredItems.length === 0"
          style="text-align: center; color: var(--color-text-muted); margin-top: 3rem; font-family: var(--font-content);"
        >
          {{ $t('menuPage.noItems') }}
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CTA BANNER
         WhatsApp contact prompt at the bottom.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-banner">
          <!-- i18n: CTA section heading prompting users to seek help -->
          <h2>{{ $t('menuPage.helpTitle') }}</h2>
          <!-- i18n: CTA section description offering staff assistance -->
          <p>{{ $t('menuPage.helpDescription') }}</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20need%20help%20with%20the%20menu"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            <!-- i18n: Button label for WhatsApp contact link -->
            {{ $t('menuPage.chatBtn') }}
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

  📚 LEARNING — `<script setup lang="ts">`:
  - `<script setup>` is Vue 3's "Composition API" with a simpler syntax.
    Everything declared here is automatically available in the template above.
    No need for `return { ... }` — Vue handles it.

  - `lang="ts"` enables TypeScript in this file. TypeScript adds type checking
    to JavaScript, catching errors before the code runs.
-->
<script setup lang="ts">

// ── Step 1: Fetch menu data and categories from the server API ──
//
// 📚 LEARNING — `useFetch()` (Nuxt Data Fetching):
// `useFetch('/api/menu')` sends a GET request to our server API route.
// On the server (SSR), it reads the JSON file and returns the data.
// On the client (navigation), it fetches via HTTP like normal.
//
// `useFetch` returns an object with: { data, pending, error }
// - `data` is a Ref containing the response (reactive!)
// - `pending` is true while the request is in progress
// - `error` contains any error that occurred
//
// 📚 `MenuItem[]` and `Category[]` are the TypeScript types for the response.
//    This ensures type safety — if the API returns something unexpected,
//    TypeScript will catch it at compile time.
const { data: menuItems } = await useFetch<MenuItem[]>('/api/menu')
const { data: categories } = await useFetch<Category[]>('/api/categories')

// ── Step 2: Create reactive state for the active category ──
//
// 📚 LEARNING — `ref()` (Reactive Reference):
// `ref('all')` creates a reactive variable with initial value 'all'.
// When this value changes, `filteredItems` automatically recalculates.
const activeCategory = ref('all')

// ── Step 3: Computed property — automatically filters dishes ──
//
// 📚 LEARNING — `computed()`:
// A computed property recalculates AUTOMATICALLY whenever its dependencies change.
// Here, it depends on `activeCategory.value` and `menuItems.value`.
//
// 📚 SAFETY CHECK — `menuItems.value ?? []`:
// During SSR or before the fetch completes, `menuItems.value` could be null.
// The `??` (nullish coalescing) operator returns `[]` (empty array) as fallback.
const filteredItems = computed(() => {
  // Guard: if menuItems hasn't loaded yet, return an empty array
  if (!menuItems.value) return []

  // If "All" is selected, show every dish
  if (activeCategory.value === 'all') return menuItems.value

  // Otherwise, filter dishes where `item.category` matches the selected tab's slug
  return menuItems.value.filter(item => item.category === activeCategory.value)
})
</script>
