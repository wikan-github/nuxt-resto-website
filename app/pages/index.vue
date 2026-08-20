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
            <!-- Hero heading — translated via i18n key 'hero.title' -->
            <h1>{{ $t('hero.title') }}</h1>
            <!-- Hero subtitle — translated via i18n key 'hero.subtitle' -->
            <p>{{ $t('hero.subtitle') }}</p>
            <!-- External link to WhatsApp for reservations -->
            <a
              href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
              class="btn btn-white"
              target="_blank"
              rel="noopener"
            >
              <!-- Hero button label — translated via i18n key 'hero.reserveBtn' -->
              {{ $t('hero.reserveBtn') }}
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
          <!-- Small uppercase label — translated via i18n key 'values.label' -->
          <p class="section-label">{{ $t('values.label') }}</p>

          <!-- Large heading — translated via i18n key 'values.title' -->
          <h2 class="section-title">{{ $t('values.title') }}</h2>

          <!-- Description text — translated via i18n key 'values.description' -->
          <p class="section-text">{{ $t('values.description') }}</p>

          <!-- 3-column grid of value cards -->
          <div class="values-grid">

            <!-- Card 1: Fresh Ingredients -->
            <div class="value-card">
              <div class="value-icon">🌿</div>
              <!-- Card title — translated via i18n key 'values.freshIngredients.title' -->
              <h3>{{ $t('values.freshIngredients.title') }}</h3>
              <!-- Card description — translated via i18n key 'values.freshIngredients.description' -->
              <p>{{ $t('values.freshIngredients.description') }}</p>
            </div>

            <!-- Card 2: Expert Chefs -->
            <div class="value-card">
              <div class="value-icon">🍳</div>
              <!-- Card title — translated via i18n key 'values.expertChefs.title' -->
              <h3>{{ $t('values.expertChefs.title') }}</h3>
              <!-- Card description — translated via i18n key 'values.expertChefs.description' -->
              <p>{{ $t('values.expertChefs.description') }}</p>
            </div>

            <!-- Card 3: Curated Drinks -->
            <div class="value-card">
              <div class="value-icon">🍹</div>
              <!-- Card title — translated via i18n key 'values.curatedDrinks.title' -->
              <h3>{{ $t('values.curatedDrinks.title') }}</h3>
              <!-- Card description — translated via i18n key 'values.curatedDrinks.description' -->
              <p>{{ $t('values.curatedDrinks.description') }}</p>
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
            <!-- About section label — translated via i18n key 'about.label' -->
            <p class="section-label">{{ $t('about.label') }}</p>
            <!-- About section title — translated via i18n key 'about.title' -->
            <h2 class="section-title">{{ $t('about.title') }}</h2>

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
              <!-- First about description — translated via i18n key 'about.description1' -->
              <strong>{{ $t('about.description1') }}</strong>
            </p>

            <!-- Second about description — translated via i18n key 'about.description2' -->
            <p class="section-text" style="margin-bottom: 2rem;">
              {{ $t('about.description2') }}
            </p>

            <!--
              📚 <NuxtLink> for internal navigation to the /menu page.
                 This does client-side navigation (no page reload).
            -->
            <NuxtLink to="/menu" class="btn btn-outline-green">
              <!-- About menu button — translated via i18n key 'about.viewMenuBtn' -->
              {{ $t('about.viewMenuBtn') }}
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
          <!-- CTA heading — translated via i18n key 'cta.title' -->
          <h2>{{ $t('cta.title') }}</h2>
          <!-- CTA description — translated via i18n key 'cta.description' -->
          <p>{{ $t('cta.description') }}</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            <!-- CTA button label — translated via i18n key 'cta.reserveBtn' -->
            {{ $t('cta.reserveBtn') }}
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
