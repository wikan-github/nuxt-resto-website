<!--
  ============================================================================
  MenuCard.vue — A Single Dish Card Component
  ============================================================================
  This component displays ONE dish: its image, category tag, name, description, and price.
  It's used inside the menu page's `v-for` loop — once for each dish.

  📚 LEARNING — Vue Components:
  A component is a REUSABLE piece of UI. Instead of writing the same HTML
  20 times (once for each dish), you write it ONCE here and reuse it.

  Think of a component like a function:
    - INPUT: props (data passed in)
    - OUTPUT: rendered HTML

  Example: `<MenuCard :item="someDish" />` renders this component
  with `someDish` as the `item` prop.
-->
<template>
  <!--
    📚 Card Layout (updated with image):
    ┌──────────────────────────────────────────┐
    │  ┌─────────┐                             │
    │  │  IMAGE  │  Category Tag               │
    │  │ (60x60) │  Dish Name                  │
    │  └─────────┘  Short description...  $12  │
    └──────────────────────────────────────────┘

    The card uses `display: flex` so the image sits on the left
    and the text + price fill the right side.
  -->
  <div class="menu-card">

    <!--
      📚 Dish Image:
      The image is wrapped in a `.menu-card-img` container that controls
      the size (60x60 pixels) and shape (rounded square) of the photo.

      `:src="item.image"` binds the `src` attribute to the item's image URL.
      This is dynamic — each dish shows a different photo.

      📚 LEARNING — `:src` vs `src`:
      - `src="photo.jpg"` → static, always the same image
      - `:src="item.image"` → dynamic, the URL comes from JavaScript data
        The `:` is shorthand for `v-bind:src`, which tells Vue "evaluate this
        as a JavaScript expression, not a literal string".
    -->
    <div class="menu-card-img">
      <img :src="item.image" :alt="item.name" loading="lazy" />
    </div>

    <!-- Text content: category tag, name, description -->
    <div class="menu-card-info">
      <!-- Category tag (e.g., "STARTERS") shown in small uppercase green text -->
      <span class="category-tag">{{ item.category }}</span>

      <!-- Dish name as a heading -->
      <h4>{{ item.name }}</h4>

      <!-- Short description of the dish -->
      <p>{{ item.description }}</p>
    </div>

    <!--
      Price on the right side (e.g., "$12")
      📚 `$` is a literal dollar sign in the template text.
         The `{{ item.price }}` outputs the number (e.g., 12).
         Together they display "$12".
    -->
    <div class="menu-card-price">${{ item.price }}</div>
  </div>
</template>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCRIPT SECTION                                                        ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  📚 LEARNING — `defineProps()`:
  Props are the data this component RECEIVES from its parent.

  `defineProps<{ item: MenuItem }>()` declares:
    - This component expects ONE prop called `item`
    - `item` must match the `MenuItem` type (from useMenu.ts)
    - TypeScript will warn if you pass the wrong data

  Usage in parent (menu.vue):
    `<MenuCard :item="someDish" />`

  After this, `item` is available in both the template AND the script.
  For example: `item.name`, `item.price`, `item.category`, `item.image`, etc.

  📚 LEARNING — `import type`:
  `import type { MenuItem }` imports ONLY the TypeScript type (not runtime code).
  This means it's completely removed after compilation — zero bundle cost.
  Always use `import type` when importing interfaces/types.
-->
<script setup lang="ts">
import type { MenuItem } from '~/composables/useMenu'

// Declare the props this component expects.
// 📚 `defineProps` is a Vue compiler macro — no import needed.
//    It's available automatically in `<script setup>`.
defineProps<{ item: MenuItem }>()
</script>
