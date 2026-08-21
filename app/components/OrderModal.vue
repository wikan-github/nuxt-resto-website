<!--
  ============================================================================
  OrderModal.vue — Order Form Modal with WhatsApp Integration
  ============================================================================
  This component displays a modal overlay with a form for collecting
  the customer's order details (name, WhatsApp number, plus EITHER a
  table number/name for dine-in orders OR a delivery address for
  takeaway orders). When submitted, it generates a WhatsApp message
  with the full order.

  📚 LEARNING — Dual Pricing in WhatsApp Message:
  The WhatsApp message now includes the order type (Takeaway or Dine In)
  for each item, along with the correct price. This ensures the restaurant
  knows exactly what the customer ordered and at which price point.

  Flow:
    1. User fills in name and WhatsApp number
    2. Dine-in cart → user enters table number/name; takeaway-only → delivery address
    3. User clicks "Send Order via WhatsApp"
    4. The system builds a formatted WhatsApp message with order types
    5. WhatsApp opens with the pre-filled message
-->
<template>
  <Teleport to="body">
    <!-- Backdrop: dark overlay behind the modal -->
    <Transition name="backdrop">
      <div
        v-if="isOrderModalOpen"
        class="order-backdrop"
        @click="closeOrderModal"
      ></div>
    </Transition>

    <!-- Modal panel -->
    <Transition name="modal">
      <div v-if="isOrderModalOpen" class="order-modal">

        <!-- ═══ Modal Header ═══ -->
        <div class="order-modal-header">
          <!-- i18n: Modal header title -->
          <h3>{{ $t('order.title') }}</h3>
          <!-- Close button: X character -->
          <button class="order-close-btn" @click="closeOrderModal">&times;</button>
        </div>

        <!-- ═══ Order Summary ═══ -->
        <!--
          📚 Shows a compact recap of all items with their order type and price.
          Each line shows: "2x Grilled Ribeye [Dine In] — $88.00"
        -->
        <div class="order-summary">
          <div
            v-for="cartItem in items"
            :key="cartItem.item.id"
            class="order-summary-item"
          >
            <span class="order-summary-name">
              {{ cartItem.quantity }}x {{ getItemName(cartItem.item) }}
              <!-- Order type badge: Takeaway or Dine In -->
              <!-- i18n: Order type badge in summary -->
              <span class="order-summary-type" :class="cartItem.orderType">
                {{ cartItem.orderType === 'dine-in' ? $t('cart.dineIn') : $t('cart.takeaway') }}
              </span>
            </span>
            <span class="order-summary-price">
              {{ $t('common.currency') }}{{ (getItemPrice(cartItem.item, cartItem.orderType) * cartItem.quantity).toFixed(2) }}
            </span>
          </div>
          <!-- i18n: Total row with currency -->
          <div class="order-summary-total">
            <span>{{ $t('order.total') }}</span>
            <span>{{ $t('common.currency') }}{{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- ═══ Order Form ═══ -->
        <form class="order-form" @submit.prevent="handleOrder">

          <!-- Name field -->
          <div class="form-group">
            <!-- i18n: Name field label and placeholder -->
            <label for="order-name">{{ $t('order.nameLabel') }}</label>
            <input
              id="order-name"
              v-model="form.name"
              type="text"
              :placeholder="$t('order.namePlaceholder')"
              required
            />
          </div>

          <!-- WhatsApp Number field -->
          <div class="form-group">
            <!-- i18n: WhatsApp number field label and placeholder -->
            <label for="order-whatsapp">{{ $t('order.whatsappLabel') }}</label>
            <input
              id="order-whatsapp"
              v-model="form.whatsapp"
              type="tel"
              :placeholder="$t('order.whatsappPlaceholder')"
              required
            />
          </div>

          <!--
            ═══ TABLE FIELD (dine-in orders only) ═══
            📚 CONDITIONAL RENDERING with v-if / v-else:
            The two field groups below are MUTUALLY EXCLUSIVE — exactly one
            of them renders depending on what's in the cart:
            - Cart contains ANY dine-in item → show a dedicated required
              "Table Number / Name" input, so staff knows where to bring
              the food. A short single-line <input> fits table codes
              ("5", "Bali Terrace") better than a tall textarea.
            - Cart is takeaway-only → show the original delivery address
              textarea, unchanged.
            This replaces the old combined "Table Number / Address" field,
            which forced dine-in customers to guess what to type.
          -->

          <!-- Table number/name input — rendered ONLY for dine-in orders -->
          <div v-if="hasDineInItems" class="form-group">
            <!-- i18n: Table field label via order.tableLabel key -->
            <label for="order-table">{{ $t('order.tableLabel') }}</label>
            <!--
              📚 `required` uses native HTML5 validation: submitting without
                 a value blocks the form and shows the browser's message —
                 no custom validation code needed.
            -->
            <input
              id="order-table"
              v-model="form.table"
              type="text"
              :placeholder="$t('order.tablePlaceholder')"
              required
            />
          </div>

          <!-- Delivery/Pickup Address textarea — rendered ONLY when the cart has no dine-in items -->
          <div v-else class="form-group">
            <!-- i18n: Address label for delivery/takeaway orders -->
            <label for="order-address">{{ $t('order.addressLabelDelivery') }}</label>
            <!-- i18n: Address placeholder for delivery/takeaway orders -->
            <textarea
              id="order-address"
              v-model="form.address"
              :placeholder="$t('order.addressPlaceholderDelivery')"
              rows="3"
              required
            ></textarea>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            class="btn btn-green order-submit-btn"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? $t('order.sending') : $t('order.sendBtn') }}
          </button>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ── Get cart state and actions from the composable ──
const {
  items,              // All items currently in the cart
  isOrderModalOpen,   // Whether this modal is visible
  cartTotal,          // Computed total price of all items
  closeOrderModal,    // Function to hide this modal
  getItemName,        // Helper: get display name from item
  getItemPrice,       // Helper: get price from item (requires orderType)
} = useCart()

// ── Import WhatsApp number from central config ──
// 📚 Instead of hardcoding the number here, we import it from the config file.
//    If the number ever changes, we only need to update one file.
import { RESTAURANT_WHATSAPP } from '~/config/restaurant'

// ── Form State ──
const form = reactive({
  name: '',       // Customer's full name
  whatsapp: '',   // Customer's WhatsApp number
  address: '',    // Customer's delivery address (takeaway-only orders)
  table: '',      // Table number or name (dine-in orders, e.g., "5" or "Bali Terrace")
})

// ── Submission State ──
const isSubmitting = ref(false)

// ── Computed: Does the cart contain any dine-in items? ──
// 📚 Used to change the address field label and placeholder dynamically.
//    If the order has dine-in items, we ask for a table number instead.
const hasDineInItems = computed(() => {
  return items.value.some(cartItem => cartItem.orderType === 'dine-in')
})

/**
 * handleOrder builds the WhatsApp message and opens WhatsApp.
 *
 * 📚 DUAL PRICING — WhatsApp Message Format:
 * Each item now includes its order type label:
 *
 *   *New Order from Tropical View Ubud*
 *   --- Order Items ---
 *   2x Grilled Ribeye [Dine In] — $88.00
 *   1x Bruschetta Trio [Takeaway] — $12.00
 *   *Total: $100.00*
 *   --- Customer Details ---
 *   Name: John Smith
 *   WhatsApp: +62 812-3456-7890
 *   Table: 5
 *
 * For a takeaway-only order the last line is instead:
 *   Address: Jl. Monkey Forest 12, Ubud
 *
 * The restaurant staff can clearly see which items are dine-in vs takeaway.
 */
function handleOrder() {
  // Set submitting state to true (disables the button)
  isSubmitting.value = true

  // Build each line of the order message
  const lines: string[] = []

  // Header
  lines.push('*New Order from Tropical View Ubud*')
  lines.push('')

  // Order items — each with its order type label
  lines.push('--- Order Items ---')
  items.value.forEach(cartItem => {
    const name = getItemName(cartItem.item)
    const price = getItemPrice(cartItem.item, cartItem.orderType)
    const subtotal = price * cartItem.quantity
    // 📚 Add [Takeaway] or [Dine In] label to each item line
    const orderLabel = cartItem.orderType === 'dine-in' ? 'Dine In' : 'Takeaway'
    lines.push(`${cartItem.quantity}x ${name} [${orderLabel}] — $${subtotal.toFixed(2)}`)
  })

  // Total
  lines.push('')
  lines.push(`*Total: $${cartTotal.toFixed(2)}*`)

  // Customer info
  lines.push('')
  lines.push('--- Customer Details ---')
  lines.push(`Name: ${form.name}`)
  lines.push(`WhatsApp: ${form.whatsapp}`)
  // 📚 LOCATION LINE — exactly one of the two, matching which field was shown:
  // - Dine-in order → "Table: <number/name>" so staff brings food to the spot
  // - Takeaway-only → "Address: <delivery address>" as before
  if (hasDineInItems.value) {
    lines.push(`Table: ${form.table}`)
  } else {
    lines.push(`Address: ${form.address}`)
  }

  // Join all lines with newline characters
  const message = lines.join('\n')

  // Build the WhatsApp URL and open it in a new tab
  const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`

  // Open WhatsApp in a new browser tab
  window.open(whatsappUrl, '_blank')

  // Reset form after a short delay
  setTimeout(() => {
    // Clear the form fields
    form.name = ''
    form.whatsapp = ''
    form.address = ''
    form.table = ''     // Also clear the dine-in table field

    // Clear the cart (order has been "sent")
    useCart().clearCart()

    // Close the modal
    closeOrderModal()

    // Reset submitting state
    isSubmitting.value = false
  }, 1000)
}
</script>
