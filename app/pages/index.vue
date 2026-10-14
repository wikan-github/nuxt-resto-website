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
          style="background-image: url('/images/hero-tropical-view.jpg'); background-size: cover; background-position: center;"
        >
          <!-- Dark overlay that sits on top of the background image -->
          <div class="hero-bg"></div>

          <!-- Text content, positioned at the bottom of the card -->
          <div class="hero-content">
            <!-- Hero heading — Ubud Monkey Forest angle -->
            <h1>{{ $t('hero.monkeyForestTitle') }}</h1>
            <!-- Hero subtitle — proximity + special deals -->
            <p>{{ $t('hero.monkeyForestSubtitle') }}</p>
            <!-- Primary + secondary actions side by side -->
            <div class="hero-buttons">
              <!-- Primary: WhatsApp claim link with pre-filled message -->
              <a
                :href="waMeUrl($t('hero.monkeyForestMessage'))"
                class="btn btn-white"
                target="_blank"
                rel="noopener"
              >
                {{ $t('hero.monkeyForestBtn') }}
              </a>
              <!-- Secondary: internal menu page -->
              <NuxtLink to="/menu" class="btn btn-outline-white">
                {{ $t('hero.viewMenu') }}
              </NuxtLink>
            </div>
            <!-- Opening-hours reassurance -->
            <p class="hero-note">{{ $t('hero.hoursNote') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         MONKEY FOREST GUEST BANNER
         Full-width promo strip for Ubud Monkey Forest ticket holders.
         Message and button text come from i18n (hero.guestBanner*).
         The WhatsApp number comes from the DB (useRestaurant).
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="guest-banner">
          <!-- Text: title + ticket offer description -->
          <div class="guest-banner-text">
            <h2>{{ $t('hero.guestBannerTitle') }}</h2>
            <p>{{ $t('hero.guestBannerDesc') }}</p>
          </div>
          <!-- CTA: WhatsApp claim button -->
          <a
            :href="waMeUrl($t('hero.monkeyForestMessage'))"
            class="btn btn-green"
            target="_blank"
            rel="noopener"
          >
            {{ $t('hero.guestBannerBtn') }}
          </a>
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

          <!-- 4-column grid of benefit cards (same .value-card style) -->
          <div class="values-grid">

            <!-- Card 1: proximity to the Sanctuary exit -->
            <div class="value-card">
              <div class="value-icon">🚶</div>
              <h3>{{ $t('values.walk.title') }}</h3>
              <p>{{ $t('values.walk.description') }}</p>
            </div>

            <!-- Card 2: shaded outdoor seating with rice field views -->
            <div class="value-card">
              <div class="value-icon">🌾</div>
              <h3>{{ $t('values.shade.title') }}</h3>
              <p>{{ $t('values.shade.description') }}</p>
            </div>

            <!-- Card 3: fast service after a hot walk -->
            <div class="value-card">
              <div class="value-icon">⚡</div>
              <h3>{{ $t('values.fast.title') }}</h3>
              <p>{{ $t('values.fast.description') }}</p>
            </div>

            <!-- Card 4: spacious, group- and kid-friendly -->
            <div class="value-card">
              <div class="value-icon">👪</div>
              <h3>{{ $t('values.family.title') }}</h3>
              <p>{{ $t('values.family.description') }}</p>
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
         LOCATION SECTION
         "How to Find Us" — text + Get Directions button + embedded map.
         Map embed + directions link come from the DB (useRestaurant).
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="about-row">
          <!-- Left: heading, proximity text, directions button -->
          <div>
            <p class="section-label">{{ $t('location.label') }}</p>
            <h2 class="section-title">{{ $t('location.title') }}</h2>
            <p class="section-text" style="margin-bottom: 2rem;">
              {{ $t('location.text') }}
            </p>
            <a
              :href="mapsLink"
              class="btn btn-green"
              target="_blank"
              rel="noopener"
            >
              {{ $t('location.directionsBtn') }}
            </a>
          </div>
          <!-- Right: embedded map showing the proximity -->
          <div class="location-map">
            <iframe
              :src="restaurant?.mapEmbedUrl"
              width="100%"
              height="100%"
              style="border: 0; border-radius: 12px;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
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
            :href="waMeUrl($t('hero.monkeyForestMessage'))"
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

<script setup lang="ts">
// The reservation WhatsApp links are built from the `restaurant` row in SQLite
// (via useRestaurant → GET /api/restaurant), so the number and message live in
// ONE place — edit the database, not the markup.
const { restaurant, waMeUrl, mapsLink } = useRestaurant()
</script>
