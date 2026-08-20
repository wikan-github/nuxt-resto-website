<!--
  ============================================================================
  CartDrawer.vue — Slide-Out Cart Panel
  ============================================================================
  This component displays a slide-out panel from the right side of the screen
  showing all items in the cart, with quantity controls and an order button.

  📚 LEARNING — Dual Pricing in Cart:
  Each CartItem now stores its `orderType` ('takeaway' or 'dine-in').
  The cart drawer uses this stored orderType to display the correct price
  for each item. This means the cart can contain a mix of takeaway and
  dine-in items, each with its own pricing.

  Layout:
  ┌─────────────────────────────────────┐
  │ Your Order                 (X)     │ ← Header with close button
  ├─────────────────────────────────────┤
  │ ┌────┐ Bruschetta Trio [Takeaway]  │ ← Cart item with order type
  │ │img │  [-] 1 [+]           $12   │   Quantity controls + price
  │ └────┘                      (X)   │
  │ ┌────┐ Grilled Ribeye [Dine In]   │
  │ │img │  [-] 2 [+]           $44   │
  │ └────┘                      (X)   │
  ├─────────────────────────────────────┤
  │ Total:                    $100.00  │ ← Subtotal
  │                                     │
  │ [          Order Now          ]    │ ← Opens order form modal
  │ [         Clear Cart          ]   │ ← Empties the cart
  └─────────────────────────────────────┘
-->
<template>
  <Teleport to="body">
    <!-- Backdrop: dark semi-transparent overlay behind the drawer -->
    <Transition name="backdrop">
      <div
        v-if="isCartOpen"
        class="cart-backdrop"
        @click="closeCart"
      ></div>
    </Transition>

    <!-- Drawer panel: slides in from the right -->
    <Transition name="drawer">
      <div v-if="isCartOpen" class="cart-drawer">

        <!-- ═══ Drawer Header ═══ -->
        <div class="cart-drawer-header">
          <h3>{{ $t('cart.title') }}</h3>
          <!-- Close button: calls closeCart to hide the drawer -->
          <button class="cart-close-btn" @click="closeCart">&times;</button>
        </div>

        <!-- ═══ Empty State ═══ -->
        <div v-if="items.length === 0" class="cart-empty">
          <p>{{ $t('cart.empty') }}</p>
          <!-- i18n: Hint text encouraging users to browse the menu -->
          <p class="cart-empty-hint">{{ $t('cart.emptyHint') }}</p>
        </div>

        <!-- ═══ Cart Items List ═══ -->
        <div v-else class="cart-drawer-body">
          <div
            v-for="cartItem in items"
            :key="cartItem.item.id"
            class="cart-item"
          >
            <!-- Item thumbnail image -->
            <div class="cart-item-img">
              <img :src="getItemImage(cartItem.item)" :alt="getItemName(cartItem.item)" />
            </div>

            <!-- Item details: name, order type label, and price -->
            <div class="cart-item-info">
              <h4>{{ getItemName(cartItem.item) }}</h4>
              <!--
                📚 ORDER TYPE LABEL — Shows "Takeaway" or "Dine In" under the item name.
                   This tells the customer which pricing mode was selected for this item.
              -->
              <!-- i18n: Order type badge — switches between Dine In and Takeaway labels -->
              <span class="cart-item-order-type" :class="cartItem.orderType">
                {{ cartItem.orderType === 'dine-in' ? $t('cart.dineIn') : $t('cart.takeaway') }}
              </span>
              <!--
                📚 DUAL PRICING — Uses the stored orderType to get the correct price.
                   `getItemPrice(item, orderType)` returns takeaway or dine-in price.
              -->
              <!-- i18n: Currency symbol before item price -->
              <p class="cart-item-price">{{ $t('common.currency') }}{{ getItemPrice(cartItem.item, cartItem.orderType) }}</p>
            </div>

            <!-- Quantity controls and remove button -->
            <div class="cart-item-actions">
              <!-- Quantity adjuster: [-] number [+] -->
              <div class="cart-qty-controls">
                <button
                  class="cart-qty-btn"
                  @click="updateQuantity(cartItem.item.id, cartItem.quantity - 1)"
                >
                  -
                </button>
                <span class="cart-qty-value">{{ cartItem.quantity }}</span>
                <button
                  class="cart-qty-btn"
                  @click="updateQuantity(cartItem.item.id, cartItem.quantity + 1)"
                >
                  +
                </button>
              </div>
              <!-- Remove button: removes this item entirely -->
              <button
                class="cart-item-remove"
                @click="removeFromCart(cartItem.item.id)"
              >
                {{ $t('cart.remove') }}
              </button>
            </div>
          </div>
        </div>

        <!-- ═══ Drawer Footer: Total + Action Buttons ═══ -->
        <div v-if="items.length > 0" class="cart-drawer-footer">
          <!-- Total price row -->
          <div class="cart-total-row">
            <!-- i18n: Total label and currency symbol -->
            <span class="cart-total-label">{{ $t('cart.total') }}</span>
            <span class="cart-total-value">{{ $t('common.currency') }}{{ cartTotal.toFixed(2) }}</span>
          </div>

          <!-- Order Now button: opens the order form modal -->
          <button class="btn btn-green cart-order-btn" @click="openOrderModal">
            {{ $t('cart.orderNow') }}
          </button>

          <!-- Clear Cart button: empties all items -->
          <button class="btn btn-outline-green cart-clear-btn" @click="clearCart">
            {{ $t('cart.clearCart') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ── Get all cart state and actions from the composable ──
const {
  items,            // The reactive array of cart items
  isCartOpen,       // Whether the drawer is visible
  cartTotal,        // Computed total price (uses each item's orderType)
  closeCart,        // Function to hide the drawer
  openOrderModal,   // Function to show the order form modal
  removeFromCart,   // Function to remove an item
  updateQuantity,   // Function to change an item's quantity
  clearCart,        // Function to empty the cart
  getItemName,      // Helper: get display name from item
  getItemPrice,     // Helper: get price from item (requires orderType)
  getItemImage,     // Helper: get image URL from item
} = useCart()
</script>
