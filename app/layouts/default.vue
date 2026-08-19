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
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/menu">Menu</NuxtLink></li>
            <li><NuxtLink to="/promotions">Promos</NuxtLink></li>
            <li><NuxtLink to="/about">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
          </ul>
        </nav>

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
        <button class="cart-icon-btn" @click="openCart" aria-label="Open cart">
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
          Reserve Now
        </a>
      </div>
    </header>

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
          📚 CSS Grid: `display: grid` + `grid-template-columns: 1.5fr 1fr 1fr 1.2fr`
          creates a 4-column layout. `fr` stands for "fraction of available space".
          - 1.5fr = takes 1.5 parts of the space
          - 1fr   = takes 1 part
          - 1.2fr = takes 1.2 parts
          So the first column is the widest, and the others are roughly equal.
        -->
        <div class="footer-grid">

          <!-- Column 1: Brand logo and description -->
          <div class="footer-brand">
            <img src="/images/logo.png" alt="Tropical View Ubud" class="logo-img" />
            <p>A unique dining experience amidst the calming natural atmosphere of Ubud. Indonesian and international dishes, specialty coffee, and cocktails.</p>
          </div>

          <!-- Column 2: Navigation links -->
          <div class="footer-col">
            <h4>Useful Links</h4>
            <ul>
              <li><NuxtLink to="/">Home</NuxtLink></li>
              <li><NuxtLink to="/about">About Us</NuxtLink></li>
              <li><NuxtLink to="/menu">Menu</NuxtLink></li>
              <li><NuxtLink to="/promotions">Promos</NuxtLink></li>
              <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Opening hours -->
          <div class="footer-col">
            <h4>Opening Hours</h4>
            <ul>
              <li><a href="#">Mon – Sun</a></li>
              <li><a href="#">7:00 AM – 10:00 PM</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact details -->
          <div class="footer-col">
            <h4>Contact Us</h4>
            <!--
              📚 Each contact item uses flexbox (`display: flex` in CSS)
                 to place the label and value side by side.
            -->
            <div class="footer-contact-item">
              <span class="label">Phone</span>
              <span class="value">+62 813-3877-4969</span>
            </div>
            <div class="footer-contact-item">
              <span class="label">WA</span>
              <span class="value">+62 813-3877-4969</span>
            </div>
            <div class="footer-contact-item">
              <span class="label">Email</span>
              <span class="value">tropicalview19@gmail.com</span>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
             GOOGLE MAP
             Embedded map showing the restaurant's location in Ubud, Bali.
             ═══════════════════════════════════════════════════════════════ -->
        <!--
          📚 LEARNING — `<iframe>` for Embedding External Content:
          An <iframe> embeds another website inside your page.
          - `src` — the URL of the content to embed (Google Maps embed URL)
          - `width="100%"` — fill the full width of the parent container
          - `style="border: 0"` — remove the default iframe border
          - `allowfullscreen` — let users click "full screen" on the map
          - `loading="lazy"` — delay loading until the user scrolls near it
            (improves initial page load speed)
          - `referrerpolicy="no-referrer-when-downgrade"` — security header
            that prevents sending referrer data when switching to HTTP

          📚 The `src` URL contains:
          - `pb=!1m18!1m12...` — encoded map parameters (zoom, position, etc.)
          - The coordinates point to Ubud, Bali (Monkey Forest Street area)
        -->
        <div class="footer-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.6!2d115.262!3d-8.506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMjEuNiJTIDExNcKwMTUnNDMuMiJF!5e0!3m2!1sen!2sid!4v1"
            width="100%"
            height="300"
            style="border: 0; border-radius: 12px;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
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
          <p>&copy; {{ new Date().getFullYear() }} Tropical View Ubud. All Rights Reserved.</p>
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
</script>
