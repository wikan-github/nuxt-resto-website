<!--
  ============================================================================
  CategoryTabs.vue — Category Filter Buttons Component
  ============================================================================
  This component renders a row of filter buttons (All, Starters, Mains, etc.).
  When a button is clicked, it EMITS an event to the parent page.

  📚 LEARNING — Component Communication Pattern:
  - Parent (menu.vue) passes: `categories` array + `active` slug via PROPS
  - Child (this component) sends: the clicked slug back via EMITS

  This is Vue's "one-way data flow":
    Parent → Props → Child → Events → Parent
  It keeps data predictable and easy to debug.
-->
<template>
  <div class="category-tabs">
    <!--
      📚 LEARNING — `v-for` with `:key`:
      `v-for="cat in categories"` loops through each category in the array.
      For each one, it renders a <button>.

      Example: if categories = [{slug:'all', label:'All'}, {slug:'starters', label:'Starters'}]
      This creates 2 buttons: "All" and "Starters".

      📚 `:key="cat.slug"` — Vue needs a unique identifier for each item.
         This helps Vue efficiently update the DOM when the list changes.
         Always use a unique field (like slug or id), NOT the index.
    -->
    <!--
      📚 LEARNING — Dynamic Class Binding (`:class`):
      `:class="{ active: active === cat.slug }"` conditionally adds the
      "active" CSS class.

      How it works:
      - If `active === cat.slug` is TRUE → adds class "active"
      - If FALSE → does NOT add class "active"

      For example, if `active` is "all" and `cat.slug` is "all":
        → class="tab-btn active" → button appears green (filled)
      If `cat.slug` is "starters":
        → class="tab-btn" → button appears outlined (not filled)
    -->
    <!--
      📚 LEARNING — `@click` (Event Handling):
      `@click="$emit('select', cat.slug)"` means:
      When the user clicks this button, EMIT a 'select' event
      with `cat.slug` as the payload.

      The parent component listens for it:
        `@select="activeCategory = $event"`
      Where `$event` is the emitted value (e.g., "pasta").

      So the full flow is:
      1. User clicks "Pasta" button
      2. This component emits: $emit('select', 'pasta')
      3. Parent receives: @select="activeCategory = 'pasta'"
      4. activeCategory changes → filteredItems recalculates → UI updates
    -->
    <button
      v-for="cat in categories"
      :key="cat.slug"
      class="tab-btn"
      :class="{ active: active === cat.slug }"
      @click="$emit('select', cat.slug)"
    >
      <!--
        📚 `{{ cat.label }}` outputs the category's display name.
           For cat.slug = "pasta", cat.label = "Pasta".
      -->
      {{ cat.label }}
    </button>
  </div>
</template>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCRIPT SECTION                                                        ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  This script block does two things:
    1. Declares what props it expects (data from the parent)
    2. Declares what events it can emit (data back to the parent)
-->
<script setup lang="ts">
import type { Category } from '~/composables/useMenu'

// ── Props: data received from the parent ──
//
// 📚 LEARNING — `defineProps<Type>()`:
// This declares the props this component accepts.
//
// `categories: Category[]` — an array of {slug, label} objects
// `active: string` — the currently selected category's slug
//
// These are READ-ONLY inside this component. The parent owns the data.
// This component only READS it and displays it.
defineProps<{
  categories: Category[]  // Array of all category options to show as tabs
  active: string          // The slug of the currently active/selected tab
}>()

// ── Emits: events this component can send back to the parent ──
//
// 📚 LEARNING — `defineEmits()`:
// This declares the CUSTOM EVENTS this component can emit.
//
// `select` is the event name. When emitted, it sends a string (the slug).
//
// In the template: `@click="$emit('select', cat.slug)"`
// In the parent:   `@select="activeCategory = $event"`
//
// This is how the child communicates BACK to the parent.
// It's like calling a function that the parent provided.
defineEmits<{
  select: [slug: string]  // Emitted when a tab is clicked, sends the category slug
}>()
</script>
