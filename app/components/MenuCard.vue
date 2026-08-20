<!--
  ============================================================================
  MenuCard.vue — A Single Dish Card Component
  ============================================================================
  This component displays ONE dish: its image, category tag, name, description,
  and price. It's used inside the menu page's `v-for` loop — once for each dish.

  📚 LEARNING — Dual Pricing Display:
  This component now shows the price based on the user's proximity to the restaurant.
  It uses `useLocation()` to determine whether to display the takeaway or dine-in price.

  Card layout:
  ┌──────────────────────────────────────────┐
  │  ┌─────────┐                             │
  │  │  IMAGE  │  Category Tag               │
  │  │ (60x60) │  Dish Name                  │
  │  └─────────┘  Short description...  $XX  │
  └──────────────────────────────────────────┘
-->
<template>
  <div class="menu-card">

    <!-- Dish Image -->
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
      📚 DUAL PRICING — Price display based on proximity:
      - If user is near restaurant → show dine-in price
      - If user is far away → show takeaway price
      The `displayPrice` computed property handles this logic.
    -->
    <div class="menu-card-actions">
      <!-- i18n: Currency symbol before display price -->
      <div class="menu-card-price">{{ $t('common.currency') }}{{ displayPrice }}</div>
      <AddToCartButton :item="item" item-type="menu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/composables/useMenu'

// ── Props ──
const props = defineProps<{ item: MenuItem }>()

// ── Get location state from the composable ──
// 📚 `isNearRestaurant` is a computed boolean that's true when the user
//    is within 10 meters of the restaurant.
const { isNearRestaurant } = useLocation()

// ── Computed: Display Price ──
// 📚 Returns the correct price based on the user's current proximity.
//    This is reactive — if the user moves, the price updates automatically.
const displayPrice = computed(() => {
  return isNearRestaurant.value ? props.item.priceDinein : props.item.priceTakeaway
})
</script>
