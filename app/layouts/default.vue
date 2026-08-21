<!--
  ============================================================================
  default.vue — The Default Layout (Header + Page Content + Footer)
  ============================================================================
  This layout wraps around EVERY page in your site. It provides:
    1. A sticky header with logo and navigation
    2. A <slot> where the page content appears
    3. A footer

  📚 LEARNING — Layouts in Nuxt:
  - All layout files go in app/layouts/
  - Nuxt auto-detects them. You don't need to register them anywhere.
  - To use a layout, just name it in <NuxtLayout name="default">
    (or omit `name` — "default" is used automatically).

  📚 LEARNING — Vue Template Syntax:
  - {{ expression }} → output a JavaScript value (e.g., {{ new Date().getFullYear() }})
  - :attribute="value" → bind a dynamic value to an HTML attribute
  - @click="handler" → listen for an event (short for v-on:click)
  - v-if="condition" → only render this element if condition is true
  - v-for="item in list" → loop over an array and render once per item
-->
<template>
  <div class="site-layout">

    <!-- ════════════════════════════════════════════════════════════════════
         HEADER — The navigation bar at the top of every page
         ════════════════════════════════════════════════════════════════════ -->
    <header class="site-header">
      <div class="container header-inner">

        <!-- Logo — clicking it takes you to the homepage -->
        <!--
          📚 <NuxtLink> is Nuxt's version of <a href="...">.
             The difference: NuxtLink does client-side navigation (no full page
             reload). It's faster and smoother. Use it for INTERNAL links.
             Use <a href="..."> for EXTERNAL links (other websites).
        -->
        <NuxtLink to="/" class="logo-link">
          <img src="/images/logo.png" alt="Tropical View Ubud" class="logo-img" />
        </NuxtLink>

        <!-- Navigation links -->
        <nav>
          <ul class="nav-links">
            <!-- i18n: Translates "Home" nav link label via nav.home key -->
            <li><NuxtLink to="/">{{ $t('nav.home') }}</NuxtLink></li>
            <!-- i18n: Translates "Menu" nav link label via nav.menu key -->
            <li><NuxtLink to="/menu">{{ $t('nav.menu') }}</NuxtLink></li>
            <!-- i18n: Translates "Promos" nav link label via nav.promos key -->
            <li><NuxtLink to="/promotions">{{ $t('nav.promos') }}</NuxtLink></li>
            <!-- i18n: Translates "About Us" nav link label via nav.about key -->
            <li><NuxtLink to="/about">{{ $t('nav.about') }}</NuxtLink></li>
            <!-- i18n: Translates "Contact Us" nav link label via nav.contact key -->
            <li><NuxtLink to="/contact">{{ $t('nav.contact') }}</NuxtLink></li>
          </ul>
        </nav>

        <!--
          Language Switcher: Toggle between English (EN) and Bahasa Indonesia (ID).
          Auto-imported by Nuxt — no import needed.
        -->
        <LanguageSwitcher />

        <!--
          ════════════════════════════════════════════════════════════════════
          CART ICON BUTTON
          Shows a shopping cart icon with an animated badge displaying
          the total number of items. Clicking it opens the cart drawer.

          📚 LEARNING — Cart State Integration:
          The `useCart()` composable is called here in the layout,
          making the cart state available to this component.
          The `cartItemCount` computed value auto-updates whenever
          items are added/removed from the cart.

          📚 The badge uses `v-if` to only show when there are items.
             `v-if="cartItemCount > 0"` hides the badge when cart is empty.
        -->
        <!-- i18n: Translates "Open cart" aria-label for accessibility via nav.openCart key -->
        <button class="cart-icon-btn" @click="openCart" :aria-label="$t('nav.openCart')">
          <!-- Simple cart icon using SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <!-- Animated badge showing item count -->
          <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </button>

        <!-- CTA (Call to Action) button — links to WhatsApp -->
        <!--
          📚 `target="_blank"` opens the link in a new browser tab.
             `rel="noopener"` is a security measure that prevents the new
             page from accessing your page's window object.
        -->
        <a
          href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
          class="header-cta"
          target="_blank"
          rel="noopener"
        >
        <!-- i18n: Translates "Reserve Now" CTA button text via nav.reserve key -->
          {{ $t('nav.reserve') }}
        </a>
      </div>
    </header>

    <!--
      Mobile Site Navigation Bar: lists EVERY page (Home · Menu · Promos ·
      About Us · Contact Us) in one horizontally scrollable row directly
      below the sticky header. Invisible on desktop/tablet — it only
      appears on phones (≤767px), replacing both the hidden `.nav-links`
      menu and the removed footer "Useful Links" column as THE mobile
      navigation. The current page is highlighted green + bold.
      Auto-imported by Nuxt — no import needed.
    -->
    <NavBreadcrumb />

    <!-- ════════════════════════════════════════════════════════════════════
         MAIN CONTENT — The <slot> is where page content gets inserted
         ════════════════════════════════════════════════════════════════════ -->
    <!--
      📚 LEARNING — Slots:
      <slot> is a Vue concept. Think of it as a "placeholder".
      When you use `<NuxtLayout>` in app.vue and put `<NuxtPage />`
      inside it, NuxtPage's content is injected into this <slot>.

      So the final HTML structure is:
        <header>...</header>
        <main>
          ← [Whatever page is active goes here]
        </main>
        <footer>...</footer>
    -->
    <main>
      <slot />
    </main>

    <!-- ════════════════════════════════════════════════════════════════════
         FOOTER — Links, contact info, and copyright
         ════════════════════════════════════════════════════════════════════ -->
    <footer class="site-footer">
      <div class="container">
        <!--
          📚 CSS Grid: `grid-template-columns: 1.2fr 1fr 1.4fr`
             creates a 3-column layout (brand, contact, google map).
             `fr` stands for "fraction of available space".
          - 1.2fr — takes 1.2 parts of the space (brand)
          - 1fr   — takes 1 part (contact details, the narrowest)
          - 1.4fr — takes 1.4 parts (map gets the widest share because
                    visual content needs more room than text)
        -->
        <div class="footer-grid">

          <!-- Column 1: Brand logo and description -->
          <!--
            📚 LEARNING — Template Refs (`ref="..."`):
            A `ref` attribute gives <script setup> a direct DOM handle to
            this element (exposed here as `brandEl`). We need it because
            rendered text height can't be known from CSS alone — the
            script MEASURES this container to compute the map's max height,
            and re-measures automatically when its content changes size
            (e.g., switching language EN ↔ ID changes the paragraph length).
          -->
          <div class="footer-brand" ref="brandEl">
            <img src="/images/logo.png" alt="Tropical View Ubud" class="logo-img" />
            <!-- i18n: Translates the footer brand description paragraph via footer.description key -->
            <p>{{ $t('footer.description') }}</p>
          </div>

          <!-- Column 2: Contact details -->
          <!--
            📚 Template ref #2 (`contactEl`): measured by the script and
            COMPARED against the brand column height — whichever of the
            two is taller becomes the Google Map's maximum height.
          -->
          <div class="footer-col" ref="contactEl">
            <!-- i18n: Translates "Contact Us" footer section heading via footer.contactUs key -->
            <h4>{{ $t('footer.contactUs') }}</h4>
            <!--
              📚 Each contact item uses flexbox (`display: flex` in CSS)
                 to place the label and value side by side.
            -->
            <div class="footer-contact-item">
              <!-- i18n: Translates "Phone" contact label via footer.phone key -->
              <span class="label">{{ $t('footer.phone') }}</span>
              <span class="value">+62 813-3877-4969</span>
            </div>
            <div class="footer-contact-item">
              <!-- i18n: Translates "WA" (WhatsApp) contact label via footer.wa key -->
              <span class="label">{{ $t('footer.wa') }}</span>
              <span class="value">+62 813-3877-4969</span>
            </div>
            <div class="footer-contact-item">
              <!-- i18n: Translates "Email" contact label via footer.email key -->
              <span class="label">{{ $t('footer.email') }}</span>
              <span class="value">tropicalview19@gmail.com</span>
            </div>
          </div>
          <!-- Column 3: Google Map -->
          <!--
            📚 LEARNING — `<iframe>` for Embedding External Content:
            An <iframe> embeds another website inside your page.
            - `src` — the URL of the content to embed (Google Maps embed URL)
            - `width="100%"` — fill the full width of its grid column
            - `style="border: 0"` — remove the default iframe border
            - `allowfullscreen` — let users click "full screen" on the map
            - `loading="lazy"` — delay loading until the user scrolls near it
              (improves initial page load speed)
            - `referrerpolicy="no-referrer-when-downgrade"` — security header
              that prevents sending referrer data when switching to HTTP

            📚 The `src` URL contains:
            - `pb=!1m18!1m12...` — encoded map parameters (zoom, position, etc.)
            - The coordinates point to Ubud, Bali (Monkey Forest Street area)

            NOTE: The map used to be a full-width block BELOW this grid;
            it is now a grid COLUMN (brand · contact · map) and therefore
            sits inside `.footer-grid`.

            DYNAMIC HEIGHT: the wrapper's height comes from
            `:style="mapWrapperStyle"` — a computed value produced by the
            script below as `Math.max(brandHeight, contactHeight)` on
            desktop. The iframe uses `height="100%"` so it always fills
            exactly whatever height its wrapper provides.
          -->
          <!-- `:style` binds an inline style ONLY when `mapWrapperStyle`
               is defined (desktop). Inline style beats the stylesheet's
               fallback height, and disappears on stacked layouts. -->
          <div class="footer-map" :style="mapWrapperStyle">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.6!2d115.262!3d-8.506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMjEuNiJTIDExNcKwMTUnNDMuMiJF!5e0!3m2!1sen!2sid!4v1"
              width="100%"
              height="100%"
              style="border: 0; border-radius: 12px;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <!-- Copyright line -->
        <!--
          📚 LEARNING — Vue Expressions in Templates:
          `{{ new Date().getFullYear() }}` is JavaScript inside {{ }}.
          Vue evaluates it and inserts the result into the HTML.
          So if the year is 2026, this renders as:
          "© 2026 Tropical View Ubud. All Rights Reserved."
        -->
        <div class="footer-bottom">
          <!-- i18n: Translates copyright text including restaurant name and rights notice via footer.copyright key -->
          <p>&copy; {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}</p>
        </div>
      </div>
    </footer>

    <!--
      ════════════════════════════════════════════════════════════════════
      CART & ORDER OVERLAY COMPONENTS
      These components are mounted in the layout so they're available
      on EVERY page. They use `<Teleport>` to render at the <body> level.

      📚 LEARNING — Why mount these in the layout?
      The CartDrawer and OrderModal need to work on ALL pages (menu, promos, etc.).
      By placing them in the layout, they're always available without
      needing to import them in every page separately.
    -->
    <CartDrawer />
    <OrderModal />
  </div>
</template>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCRIPT SECTION                                                        ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  📚 LEARNING — Layout Script:
  The layout needs a script section to access the cart composable.
  `useCart()` provides `cartItemCount` (for the badge) and `openCart` (for the click handler).
  These are used in the template above (cart icon button).
-->
<script setup lang="ts">
// ── Get cart state and functions from the composable ──
// 📚 The cart icon in the header needs `cartItemCount` for the badge
//    and `openCart` for the click handler.
const { cartItemCount, openCart } = useCart()

/*
  ╔═════════════════════════════════════════════════════════════════════╗
  ║ DYNAMIC GOOGLE MAP HEIGHT                                            ║
  ║ Goal: the map must never be taller than the text next to it.         ║
  ║ The script measures the BRAND and CONTACT columns, takes whichever   ║
  ║ is TALLER (`Math.max`), and pins that height onto the map wrapper.   ║
  ╚═════════════════════════════════════════════════════════════════════╝
*/

// Template ref → the brand column element (bound via ref="brandEl" above).
// `ref<HTMLElement | null>(null)` types it as "an HTMLElement or nothing"
// — it starts as null and is filled by Vue once the template mounts.
const brandEl = ref<HTMLElement | null>(null)

// Template ref → the contact column element (bound via ref="contactEl").
// Measured the same way so both columns can be compared fairly.
const contactEl = ref<HTMLElement | null>(null)

// Reactive holder for the computed max height (in pixels).
// `null` means "no inline height" → CSS fallback (300px) applies instead.
const mapMaxHeight = ref<number | null>(null)

// Breakpoint guard matching main.css: the footer grid is 3 columns
// side-by-side only at ≥992px. Below that, brand/contact/map STACK
// vertically, so capping the map by a short stacked column would
// squash it — we fall back to the stylesheet's fixed 300px height.
const DESKTOP_MIN_WIDTH = 992

/**
 * Measures both text columns and updates `mapMaxHeight`.
 * Called on mount, on window resize, and by the ResizeObserver.
 */
function updateMapHeight(): void {
  // Safety: never touch `window` during SSR/prerender (no browser there),
  // and skip entirely when the grid is stacked (<992px).
  if (!import.meta.client || window.innerWidth < DESKTOP_MIN_WIDTH) {
    // Clear any previously applied cap so the CSS fallback takes over.
    mapMaxHeight.value = null
    // Stop here — no measurement needed outside desktop layout.
    return
  }
  // `offsetHeight` = real rendered height including padding (px).
  // `?? 0` guards against the refs not being attached yet.
  const brandHeight = brandEl.value?.offsetHeight ?? 0
  // Same measurement for the contact column.
  const contactHeight = contactEl.value?.offsetHeight ?? 0
  // THE CORE RULE: the taller of the two wins.
  const tallest = Math.max(brandHeight, contactHeight)
  // Apply it, unless both measured 0 (refs missing) → keep fallback.
  mapMaxHeight.value = tallest > 0 ? tallest : null
}

// Handle to the ResizeObserver so we can disconnect it on unmount
// (prevents memory leaks when navigating between pages).
let mapResizeObserver: ResizeObserver | null = null

// Runs once after the component's HTML exists in the DOM —
// the earliest moment the template refs point at real elements.
onMounted(() => {
  // First measurement right away, so the map is sized before paint settles.
  updateMapHeight()
  /*
    📚 LEARNING — ResizeObserver:
    Fires whenever an observed element's SIZE changes — covering window
    resizes, font loading, AND i18n language switches (EN ↔ ID produce
    different text lengths). Far more precise than watching the window,
    because it reacts to the actual columns we care about.
  */
  mapResizeObserver = new ResizeObserver(updateMapHeight)
  // Observe each column only if the ref actually resolved to an element.
  if (brandEl.value) mapResizeObserver.observe(brandEl.value)
  if (contactEl.value) mapResizeObserver.observe(contactEl.value)
  // Window listener as a safety net for breakpoint crossings where the
  // columns themselves might not resize but the layout mode does.
  window.addEventListener('resize', updateMapHeight)
})

// Cleanup BEFORE the component is removed — standard hygiene for
// observers and listeners added in onMounted.
onBeforeUnmount(() => {
  // Stop observing; without this the observer would keep listening
  // to detached elements (a classic memory leak).
  mapResizeObserver?.disconnect()
  // Remove the window listener so no stale callbacks fire later.
  window.removeEventListener('resize', updateMapHeight)
})

/*
  📚 LEARNING — Computed style binding:
  Returns `{ height: 'NNNpx' }` while `mapMaxHeight` has a value
  (desktop), or `undefined` otherwise — Vue omits undefined bindings,
  so the wrapper falls back to plain CSS automatically.
*/
const mapWrapperStyle = computed<{ height: string } | undefined>(() =>
  mapMaxHeight.value !== null ? { height: `${mapMaxHeight.value}px` } : undefined
)
</script>
