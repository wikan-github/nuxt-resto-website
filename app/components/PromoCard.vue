<!--
  ============================================================================
  PromoCard.vue — A Single Promotion Card Component
  ============================================================================
  This component displays ONE promotion: its image, badge, title, description,
  pricing, and expiry date. It's reusable — the parent passes data via props.

  📚 LEARNING — Dual Pricing Display:
  This component now shows promo and original prices based on user proximity.
  - Near restaurant → dine-in prices
  - Far from restaurant → takeaway prices

  Card layout:
  ┌──────────────────────────────────────────────┐
  │  ┌────────────────────────────────────────┐  │
  │  │              IMAGE                     │  │
  │  │         (full width)                   │  │
  │  │    ┌─────────┐                         │  │
  │  │    │  20%OFF │ ← discount badge        │  │
  │  │    └─────────┘                         │  │
  │  └────────────────────────────────────────┘  │
  │  Category Tag                                │
  │  Promotion Title                             │
  │  Description text...                         │
  │  ┌──────────────┐  ┌───────────────────┐     │
  │  │ $XX  (was $XX)│  │  Add to Cart     │     │
  │  └──────────────┘  └───────────────────┘     │
  └──────────────────────────────────────────────┘
-->
<template>
  <div class="promo-card">

    <!-- ═══ Image Section ═══ -->
    <div class="promo-card-img">
      <img :src="promo.image" :alt="promo.title" loading="lazy" />
      <!-- Discount badge overlay -->
      <span class="promo-badge">{{ promo.discount }}</span>
      <!-- Featured badge: only shown if promo.isFeatured is TRUE -->
      <!-- i18n: Featured badge — shown on featured promos -->
      <span v-if="promo.isFeatured" class="promo-featured-badge">{{ $t('promoCard.featured') }}</span>
    </div>

    <!-- ═══ Text Content Section ═══ -->
    <div class="promo-card-body">
      <!-- Category tag (e.g., "FOOD", "DRINK", "SET-MENU") -->
      <span class="category-tag">{{ promo.category }}</span>
      <!-- Promotion title -->
      <h3 class="promo-card-title">{{ promo.title }}</h3>
      <!-- Description text -->
      <p class="promo-card-desc">{{ promo.description }}</p>

      <!-- ═══ Price Row ═══ -->
      <!--
        📚 DUAL PRICING — Shows original and promo prices based on proximity.
        - `displayOriginalPrice` → original price (strikethrough) or null
        - `displayPromoPrice` → discounted price (bold, green)
      -->
      <div class="promo-card-pricing">
        <div class="promo-prices">
          <!-- Show original (strikethrough) price if it exists -->
          <!-- i18n: Currency symbol for original price -->
          <span v-if="displayOriginalPrice !== null" class="promo-price-original">
            {{ $t('common.currency') }}{{ displayOriginalPrice }}
          </span>
          <!-- i18n: Currency symbol for promo price -->
          <span class="promo-price-current">{{ $t('common.currency') }}{{ displayPromoPrice }}</span>
        </div>

        <!-- Add to Cart button for this promotion -->
        <AddToCartButton :item="promo" item-type="promotion" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Promotion } from '~/composables/usePromotions'

// ── Props ──
const props = defineProps<{ promo: Promotion }>()

// ── Get location state from the composable ──
const { isNearRestaurant } = useLocation()

// ── Computed: Display Prices ──
// 📚 Returns the correct prices based on the user's current proximity.
//    These are reactive — they update automatically if the user moves.

/**
 * displayOriginalPrice: the original (pre-discount) price to show.
 * Returns null if the promotion doesn't have an original price (e.g., "2 FOR 1").
 */
const displayOriginalPrice = computed(() => {
  return isNearRestaurant.value
    ? props.promo.originalPriceDinein
    : props.promo.originalPriceTakeaway
})

/**
 * displayPromoPrice: the discounted price to show.
 * This is the price the customer actually pays.
 */
const displayPromoPrice = computed(() => {
  return isNearRestaurant.value
    ? props.promo.promoPriceDinein
    : props.promo.promoPriceTakeaway
})
</script>
