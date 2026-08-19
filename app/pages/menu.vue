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
        <p class="section-label">Tropical View Ubud</p>
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">Our Menu</h1>
        <p class="section-text">Explore our curated selection of authentic Indonesian and international dishes.</p>
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
          No items found in this category.
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
          <h2>Need Help Choosing?</h2>
          <p>Our staff is happy to help you find the perfect dish. Contact us anytime!</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20need%20help%20with%20the%20menu"
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

  📚 LEARNING — `<script setup lang="ts">`:
  - `<script setup>` is Vue 3's "Composition API" with a simpler syntax.
    Everything declared here is automatically available in the template above.
    No need for `return { ... }` — Vue handles it.

  - `lang="ts"` enables TypeScript in this file. TypeScript adds type checking
    to JavaScript, catching errors before the code runs.
-->
<script setup lang="ts">

// ── Step 1: Get menu data from the composable ──
// 📚 `useMenu()` is auto-imported from composables/useMenu.ts.
//    It returns { categories, menuItems }.
//    This is ES6 destructuring — it extracts properties from the returned object.
const { categories, menuItems } = useMenu()

// ── Step 2: Create reactive state for the active category ──
// 📚 LEARNING — `ref()` (Reactive Reference):
// `ref('all')` creates a reactive variable with initial value 'all'.
//
// "Reactive" means: when this value CHANGES, any part of the template
// that uses it will AUTOMATICALLY re-render.
//
// For example, when the user clicks the "Pasta" tab:
//   1. CategoryTabs emits `select` with value "pasta"
//   2. The template updates: `activeCategory = $event` → activeCategory becomes "pasta"
//   3. `filteredItems` (which depends on activeCategory) automatically recalculates
//   4. The menu grid re-renders with only pasta dishes
//
// IMPORTANT: Access the value with `.value` in JavaScript: `activeCategory.value`
// But in the TEMPLATE, you use it WITHOUT `.value`: `:active="activeCategory"`
const activeCategory = ref('all')

// ── Step 3: Computed property — automatically filters dishes ──
// 📚 LEARNING — `computed()`:
// A computed property is like a derived value that recalculates AUTOMATICALLY
// whenever its dependencies change.
//
// Here, `filteredItems` depends on `activeCategory.value` and `menuItems`.
// When either changes, Vue runs this function again and updates the template.
//
// It's similar to a mathematical formula: if x changes, y = f(x) updates too.
//
// 📚 `readonly` is not used here because `ref()` exposes `.value`.
//    In the template, Vue auto-unwraps refs, so you just write `filteredItems`.
const filteredItems = computed(() => {
  // If "All" is selected, show every dish
  if (activeCategory.value === 'all') return menuItems

  // Otherwise, filter dishes where `item.category` matches the selected tab's slug
  // 📚 `.filter()` is a JavaScript array method that creates a NEW array
  //    containing only items that pass the test (return true).
  return menuItems.filter(item => item.category === activeCategory.value)
})
</script>
