// ============================================================================
// useCart.ts — Composable: Cart State & Order Management
// ============================================================================
// This composable manages the shopping cart across the entire application.
// It uses Nuxt's `useState()` to keep cart data shared between all components
// and persisted during navigation (no page reload needed).
//
// 📚 LEARNING — `useState()` vs `ref()`:
// - `ref()` creates state LOCAL to a single component.
//   If MenuCard uses `ref(0)`, PromoCard can't see it.
// - `useState()` creates SHARED state across the entire app.
//   Any component can call `useCart()` and get the SAME cart data.
//   This is Nuxt's built-in global state management (like Pinia, but simpler).
//
// 📚 LEARNING — Dual Pricing Integration:
// The cart now stores the `orderType` ('takeaway' | 'dine-in') with each item.
// This ensures the correct price is used throughout the entire order flow:
// cart display → total calculation → WhatsApp message.

import type { MenuItem } from '~/composables/useMenu'
import type { Promotion } from '~/composables/usePromotions'
import type { OrderType } from '~/types/restaurant'

// ── TypeScript Interfaces ──

/**
 * CartItem wraps a menu item or promotion with cart-specific data.
 *
 * 📚 DUAL PRICING — Added `orderType` field:
 * Each cart item now tracks whether it was added as a "takeaway" or "dine-in" order.
 * This determines which price to use for calculations.
 */
export interface CartItem {
  item: MenuItem | Promotion          // The actual menu item or promotion object
  itemType: 'menu' | 'promotion'     // Discriminator: which type of item is this?
  orderType: OrderType                // 'takeaway' or 'dine-in' — determines which price to use
  quantity: number                    // How many of this item the user wants
}

/**
 * CustomerInfo stores the orderer's contact details.
 * These fields are collected via the order form modal.
 */
export interface CustomerInfo {
  name: string            // Full name of the person placing the order
  whatsapp: string        // WhatsApp number (with country code, e.g., +62...)
  address: string         // Delivery or pickup address (takeaway-only orders)
  table?: string          // Table number or name (dine-in orders, e.g., "5").
                          // Optional because it only exists when the cart
                          // contains dine-in items — exactly one of
                          // address/table is collected per order.
}

// ── Helper Functions ──

/**
 * getItemName extracts the display name from either a MenuItem or Promotion.
 *
 * 📚 LEARNING — Type Guards (`in` keyword):
 * `'name' in item` checks if the `name` property exists on the object.
 * MenuItems have `name`, Promotions have `title`.
 * This function safely returns the correct name regardless of item type.
 */
function getItemName(item: MenuItem | Promotion): string {
  if ('name' in item) return item.name
  return item.title
}

/**
 * getItemPrice returns the correct price based on item type and order type.
 *
 * 📚 DUAL PRICING LOGIC:
 * - MenuItem with orderType 'takeaway' → `priceTakeaway`
 * - MenuItem with orderType 'dine-in' → `priceDinein`
 * - Promotion with orderType 'takeaway' → `promoPriceTakeaway`
 * - Promotion with orderType 'dine-in' → `promoPriceDinein`
 *
 * This function is the SINGLE SOURCE OF TRUTH for price calculation.
 * Every place that needs a price (cart, total, WhatsApp message) calls this.
 */
function getItemPrice(item: MenuItem | Promotion, orderType: OrderType): number {
  // Check if this is a MenuItem (has `priceTakeaway`) or a Promotion (has `promoPriceTakeaway`)
  if ('priceTakeaway' in item) {
    // It's a MenuItem — return the appropriate price based on order type
    return orderType === 'dine-in' ? item.priceDinein : item.priceTakeaway
  }
  // It's a Promotion — return the promo price based on order type
  return orderType === 'dine-in' ? item.promoPriceDinein : item.promoPriceTakeaway
}

/**
 * getItemOriginalPrice returns the original (pre-discount) price, or null if not applicable.
 * Used in the cart and order summary to show strikethrough pricing.
 */
function getItemOriginalPrice(item: MenuItem | Promotion, orderType: OrderType): number | null {
  // Only Promotions have originalPrice fields; MenuItems don't
  if ('originalPriceTakeaway' in item) {
    return orderType === 'dine-in' ? item.originalPriceDinein : item.originalPriceTakeaway
  }
  // MenuItems don't have an "original" price — return null
  return null
}

/**
 * getItemImage extracts the image URL from either item type.
 * Both MenuItem and Promotion have an `image` field, so this works for both.
 */
function getItemImage(item: MenuItem | Promotion): string {
  return item.image
}

// ── Composable Function ──

/**
 * useCart() returns the cart state and all functions to manipulate it.
 *
 * 📚 LEARNING — How This Composable Works:
 * 1. It uses `useState('cart')` to create SHARED reactive state.
 * 2. The string `'cart'` is a unique key — Nuxt uses it to identify this state.
 * 3. If multiple components call `useCart()`, they ALL share the same state.
 * 4. The state persists during client-side navigation (no data loss on page change).
 */
export function useCart() {

  // ── Shared State ──
  const items = useState<CartItem[]>('cart', () => [])
  // Initialize with an empty array. The second argument is a factory function
  // that returns the initial value — it only runs once on the client.

  const isCartOpen = useState<boolean>('cartOpen', () => false)
  // Controls whether the cart drawer is visible or hidden.

  const isOrderModalOpen = useState<boolean>('orderModalOpen', () => false)
  // Controls whether the order form modal is visible or hidden.

  // ── Actions: Functions to modify the cart ──

  /**
   * addToCart adds an item to the cart or increments its quantity.
   *
   * 📚 DUAL PRICING — Now accepts `orderType` parameter:
   * When the AddToCartButton is clicked, it passes the current order type
   * ('takeaway' or 'dine-in') based on the user's proximity to the restaurant.
   * This order type is stored WITH the cart item so it persists.
   *
   * 📚 LEARNING — Array Methods Used:
   * - `.find()` searches the array and returns the FIRST match (or undefined).
   * - `.push()` adds a new element to the end of the array.
   */
  function addToCart(item: MenuItem | Promotion, itemType: 'menu' | 'promotion', orderType: OrderType) {
    // Search for an existing cart item with the same id AND same order type
    // 📚 We check BOTH id AND orderType because the same dish can exist
    //    in the cart twice — once as takeaway and once as dine-in.
    const existing = items.value.find(
      cartItem => cartItem.item.id === item.id && cartItem.orderType === orderType,
    )

    if (existing) {
      // Item already in cart with same order type — increase quantity by 1
      existing.quantity++
    } else {
      // New item (or same item with different order type) — add it to the cart
      items.value.push({
        item,
        itemType,
        orderType,
        quantity: 1,
      })
    }
  }

  /**
   * removeFromCart removes an item from the cart entirely.
   * Uses `.filter()` to create a NEW array excluding the item with the given id.
   */
  function removeFromCart(itemId: number) {
    items.value = items.value.filter(cartItem => cartItem.item.id !== itemId)
  }

  /**
   * updateQuantity changes the quantity of a specific cart item.
   * If quantity reaches 0, the item is removed from the cart.
   */
  function updateQuantity(itemId: number, newQuantity: number) {
    // If the new quantity is 0 or less, remove the item entirely
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    // Find the cart item and update its quantity
    const cartItem = items.value.find(ci => ci.item.id === itemId)
    if (cartItem) {
      cartItem.quantity = newQuantity
    }
  }

  /**
   * clearCart empties the entire cart by resetting to an empty array.
   */
  function clearCart() {
    items.value = []
  }

  /**
   * openCart shows the cart drawer.
   */
  function openCart() {
    isCartOpen.value = true
  }

  /**
   * closeCart hides the cart drawer.
   */
  function closeCart() {
    isCartOpen.value = false
  }

  /**
   * openOrderModal shows the order form modal and closes the cart drawer.
   */
  function openOrderModal() {
    isOrderModalOpen.value = true
    isCartOpen.value = false
  }

  /**
   * closeOrderModal hides the order form modal.
   */
  function closeOrderModal() {
    isOrderModalOpen.value = false
  }

  // ── Computed Values: Derived data that auto-updates ──

  /**
   * cartTotal calculates the total price of all items in the cart.
   *
   * 📚 DUAL PRICING — Uses each item's stored orderType:
   * Each CartItem has its own `orderType`, so the total correctly mixes
   * takeaway and dine-in prices if the cart contains both.
   *
   * 📚 LEARNING — `.reduce()` Array Method:
   * `.reduce()` iterates through an array and accumulates a single value.
   * - `sum` is the accumulator (starts at 0)
   * - `cartItem` is the current element
   * - The arrow function returns the new sum for each iteration
   */
  const cartTotal = computed(() => {
    return items.value.reduce((sum, cartItem) => {
      // Get the price for this specific item using its stored order type
      return sum + getItemPrice(cartItem.item, cartItem.orderType) * cartItem.quantity
    }, 0)
  })

  /**
   * cartItemCount calculates the total number of individual items.
   * (e.g., 2x Bruschetta + 1x Salmon = 3 items total)
   */
  const cartItemCount = computed(() => {
    return items.value.reduce((sum, cartItem) => {
      return sum + cartItem.quantity
    }, 0)
  })

  // Return everything so components can use it
  return {
    items: readonly(items),       // Read-only array — use actions to modify
    isCartOpen: readonly(isCartOpen),
    isOrderModalOpen: readonly(isOrderModalOpen),
    cartTotal,                    // Computed total price
    cartItemCount,                // Computed total item count
    addToCart,                    // Add item to cart (with orderType)
    removeFromCart,               // Remove item from cart
    updateQuantity,               // Change item quantity
    clearCart,                    // Empty the cart
    openCart,                     // Show cart drawer
    closeCart,                    // Hide cart drawer
    openOrderModal,               // Show order form
    closeOrderModal,              // Hide order form
    getItemName,                  // Helper: get display name from item
    getItemPrice,                 // Helper: get price from item (requires orderType)
    getItemOriginalPrice,         // Helper: get original price from item
    getItemImage,                 // Helper: get image URL from item
  }
}
