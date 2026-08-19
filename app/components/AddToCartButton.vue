<!--
  ============================================================================
  AddToCartButton.vue — Add to Cart Button Component
  ============================================================================
  This component renders an "Add to Cart" button that, when clicked,
  adds the given item (MenuItem or Promotion) to the shared cart state.

  📚 LEARNING — Dual Pricing + Proximity Detection:
  This button now uses the `useLocation` composable to determine whether
  the user is near the restaurant (within 10 meters). Based on proximity:
  - Near restaurant → button shows "Dine In" label
  - Far from restaurant (or location unknown) → button shows "Take Away" label

  The selected order type is passed to `addToCart()` so the correct price
  is used throughout the cart and order flow.

  Props:
    - item: MenuItem | Promotion — the item to add to the cart
    - itemType: 'menu' | 'promotion' — which source the item comes from

  Behavior:
    1. Button label changes based on user proximity ("Take Away" or "Dine In")
    2. User clicks the button
    3. Item is added to the cart with the current order type
    4. Button briefly shows "Added!" with a checkmark
    5. Returns to normal state after 1.5 seconds
-->
<template>
  <!--
    📚 The button container uses dynamic class binding:
    `.added` class is applied when `showFeedback` is true,
    which changes the button's appearance to green with "Added!" text.
  -->
  <button
    class="add-to-cart-btn"
    :class="{ added: showFeedback }"
    @click="handleAddToCart"
    :disabled="showFeedback"
  >
    <!--
      📚 Conditional rendering (`v-if` / `v-else`):
      - If `showFeedback` is true → show "Added! ✓"
      - Otherwise → show the order type label:
        - "Take Away" if user is far from restaurant
        - "Dine In" if user is within 10 meters
    -->
    <span v-if="showFeedback">Added! &#10003;</span>
    <span v-else>{{ currentOrderTypeLabel }}</span>
  </button>
</template>

<script setup lang="ts">
// Import both item types for the union type in props
import type { MenuItem } from '~/composables/useMenu'
import type { Promotion } from '~/composables/usePromotions'
// Import OrderType from the central config for type safety
import type { OrderType } from '~/config/restaurant'

// ── Props ──
// 📚 `defineProps` returns a typed, reactive props object.
//    We assign it to `props` so we can access it in the script (e.g., `props.item`).
const props = defineProps<{
  item: MenuItem | Promotion       // The item to add to the cart
  itemType: 'menu' | 'promotion'  // Source type for categorization
}>()

// ── Get cart and location functions from composables ──
// 📚 Both composables are auto-imported by Nuxt (no import statement needed).
const { addToCart } = useCart()
const { isNearRestaurant } = useLocation()

// ── Computed: Current Order Type ──
// 📚 DETERMINES WHETHER THIS IS A "takeaway" or "dine-in" ORDER:
// - `isNearRestaurant.value === true` → user is within 10 meters → 'dine-in'
// - `isNearRestaurant.value === false` → user is far away (or location unknown) → 'takeaway'
//
// This computed value is reactive — it automatically updates if the user
// moves toward or away from the restaurant while the page is open.
const currentOrderType = computed<OrderType>(() => {
  return isNearRestaurant.value ? 'dine-in' : 'takeaway'
})

/**
 * currentOrderTypeLabel: the human-readable button text.
 * - 'takeaway' → "Take Away"
 * - 'dine-in' → "Dine In"
 *
 * 📚 This is separate from `currentOrderType` so we can display friendly text
 *    while passing the technical value to the cart.
 */
const currentOrderTypeLabel = computed(() => {
  return currentOrderType.value === 'dine-in' ? 'Dine In' : 'Take Away'
})

// ── Local state for button feedback ──
// `showFeedback` controls whether the button shows "Added!" or the order type label
const showFeedback = ref(false)

// ── Click Handler ──
/**
 * handleAddToCart adds the item to the cart with the current order type
 * and shows brief feedback.
 *
 * 📚 DUAL PRICING — Passes `currentOrderType.value` to `addToCart()`:
 * This ensures the cart stores the correct price (takeaway or dine-in)
 * for this specific item.
 */
function handleAddToCart() {
  // Add the item to the shared cart state with the current order type
  addToCart(props.item, props.itemType, currentOrderType.value)

  // Show the "Added!" feedback
  showFeedback.value = true

  // After 1.5 seconds, reset the button back to the order type label
  setTimeout(() => {
    showFeedback.value = false
  }, 1500)
}
</script>
