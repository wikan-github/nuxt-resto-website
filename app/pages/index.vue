<!--
  ============================================================================
  index.vue — Homepage (route: /)
  ============================================================================
  This is the LANDING PAGE of the restaurant website. It contains:
    1. Hero banner with background image and CTA
    2. Values section (3 cards on green background)
    3. About section (image + text side by side)
    4. CTA banner at the bottom

  📚 LEARNING — Nuxt Pages:
  - Any .vue file in app/pages/ automatically becomes a route.
  - index.vue → the homepage ("/")
  - menu.vue  → "/menu"
  - about.vue → "/about"
  - You DON'T need a router config file — Nuxt handles it automatically!

  📚 LEARNING — Vue Single File Component (SFC) Structure:
  - <template> — HTML (what renders)
  - <script setup lang="ts"> — Logic (TypeScript with Vue 3 "setup" syntax)
  - <style>    — CSS (optional here, we use global CSS instead)
-->
<template>
  <!-- The outer <div> is required — Vue templates need a single root element. -->
  <div>

    <!-- ════════════════════════════════════════════════════════════════════
         HERO SECTION
         The large banner at the top with a background image, heading,
         description, and a "Make a Reservation" button.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="container">
        <!--
          📚 Inline styles: `style="..."` applies CSS directly in the template.
             Here we set the background image via inline style because the
             image URL is specific to this page. For shared styles, use CSS classes.

          The background image is set via inline `background-image: url('...')`.
          The actual image is covered by `.hero-bg` (a semi-transparent green overlay)
          so the text stays readable.
        -->
        <div
          class="hero-card"
          style="background-image: url('https://www.tropicalviewrestaurant.com/wp-content/uploads/2025/02/tropical-view-ubud-2.jpg'); background-size: cover; background-position: center;"
        >
          <!-- Dark overlay that sits on top of the background image -->
          <div class="hero-bg"></div>

          <!-- Text content, positioned at the bottom of the card -->
          <div class="hero-content">
            <h1>Embrace Nature's Serenity in the Heart of Ubud</h1>
            <p>Experience authentic Indonesian and international cuisine surrounded by lush rice field views and warm Balinese hospitality.</p>
            <!-- External link to WhatsApp for reservations -->
            <a
              href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
              class="btn btn-white"
              target="_blank"
              rel="noopener"
            >
              Make a Reservation
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         VALUES SECTION
         "Delicious food with meaning" — 3 feature cards on green bg.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <!--
          📚 `.green-card` is a CSS class that gives this div a light green
             background (#f1f5eb) and large rounded corners (41px).
        -->
        <div class="green-card">
          <!-- Small uppercase label: "OUR VALUES" -->
          <p class="section-label">Our Values</p>

          <!-- Large heading -->
          <h2 class="section-title">Delicious food with meaning</h2>

          <!-- Description text -->
          <p class="section-text">We are committed to providing an authentic and serene experience that reflects the beauty of nature and the warmth of Balinese hospitality.</p>

          <!-- 3-column grid of value cards -->
          <div class="values-grid">

            <!-- Card 1: Fresh Ingredients -->
            <div class="value-card">
              <div class="value-icon">🌿</div>
              <h3>Fresh Ingredients</h3>
              <p>Locally sourced produce and traditional Balinese spices in every dish.</p>
            </div>

            <!-- Card 2: Expert Chefs -->
            <div class="value-card">
              <div class="value-icon">🍳</div>
              <h3>Expert Chefs</h3>
              <p>Our culinary team brings passion and precision to every plate we serve.</p>
            </div>

            <!-- Card 3: Curated Drinks -->
            <div class="value-card">
              <div class="value-icon">🍹</div>
              <h3>Curated Drinks</h3>
              <p>Specialty coffee, fresh smoothies, wine, and handcrafted cocktails.</p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         ABOUT SECTION
         Image on the left, text on the right (2-column layout).
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <!--
          📚 `.about-row` uses CSS Grid: `grid-template-columns: 1fr 1fr`
             to create two equal columns side by side.
             On mobile, media queries change this to 1 column.
        -->
        <div class="about-row">

          <!-- Left column: restaurant photo -->
          <div class="about-img">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
              alt="Tropical View Ubud dining"
            />
          </div>

          <!-- Right column: text content -->
          <div>
            <p class="section-label">Tropical View Ubud</p>
            <h2 class="section-title">An Oasis of Taste in the Heart of Ubud</h2>

            <!--
              📚 Inline style: `style="margin-bottom: 1.5rem;"` adds space
                 below this paragraph. This is a quick one-off style.
                 For reusable styles, use CSS classes instead.
            -->
            <p class="section-text" style="margin-bottom: 1.5rem;">
              <!--
                📚 <strong> makes text bold. It's semantic HTML — it tells
                   screen readers and search engines this text is important.
                   Don't use <strong> just for visual bold — use CSS for that.
              -->
              <strong>Tropical View Ubud</strong> offers a unique dining experience amidst the calming natural atmosphere of Ubud. Strategically located on Monkey Forest Street, we serve various Indonesian and international dishes, including Nasi Goreng, Crispy Fried Duck, and Rib-Eye Steak.
            </p>

            <p class="section-text" style="margin-bottom: 2rem;">
              With beautiful rice field views and a comfortable design, this place is perfect for enjoying breakfast, lunch, or dinner. We are open daily from 7:00 to 22:00.
            </p>

            <!--
              📚 <NuxtLink> for internal navigation to the /menu page.
                 This does client-side navigation (no page reload).
            -->
            <NuxtLink to="/menu" class="btn btn-outline-green">
              View Our Menus
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CTA BANNER
         Green background, centered text, "Make a Reservation" button.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-banner">
          <h2>Get Our Best Offers Quickly</h2>
          <p>Are you ready to try a dish that will complete your trip? Tropical View Ubud will provide what you need!</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            Make a Reservation
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<!--
  📚 LEARNING — `<script setup lang="ts">`:
  This page doesn't need any JavaScript logic — it's purely static HTML.
  So there's no <script> block here. That's perfectly valid!
  Not every Vue component needs a script section.

  If you wanted to add interactivity later (e.g., an image carousel),
  you'd add:
    <script setup lang="ts">
    const currentIndex = ref(0)
    // ...logic here
    </script>
-->
