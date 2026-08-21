<!--
  ============================================================================
  about.vue — About Us Page (route: /about)
  ============================================================================
  This page tells the story of Tropical View Ubud. It contains:
    1. Hero header with the page title
    2. Our Story section (image + text side by side)
    3. Mission & Values grid (3 cards)
    4. Experience section (what makes us special)
    5. CTA banner at the bottom

  📚 LEARNING — Why Create Separate Pages?
  In Nuxt, each .vue file in app/pages/ becomes a separate URL.
  - index.vue   → "/"        (homepage)
  - menu.vue    → "/menu"    (menu page)
  - about.vue   → "/about"   (this page)
  - contact.vue → "/contact" (contact page)

  Nuxt automatically creates routes for each file — no manual route config needed!
-->
<template>
  <!--
    Vue requires a SINGLE root element inside <template>.
    This outer <div> wraps everything on the page.
  -->
  <div>

    <!-- ════════════════════════════════════════════════════════════════════
         PAGE HEADER
         The top section with the page title "About Us".
         Reuses existing CSS classes: .hero, .section-label, .section-title, .section-text
         ════════════════════════════════════════════════════════════════════ -->
    <!--
      📚 The extra "about-header" class lets the scoped styles at the
         bottom of this file target ONLY this header section. Without it,
         the global `.hero h1` / `.hero p` rules (white text for the dark
         homepage hero) would win and paint these labels invisible on the
         plain light background of this page.
    -->
    <section class="hero about-header" style="padding-bottom: 1rem;">
      <div class="container">
        <!-- Small uppercase label above the heading -->
        <!-- i18n: Section label for the about page header -->
        <p class="section-label">{{ $t('aboutPage.label') }}</p>
        <!-- i18n: Main page title -->
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">{{ $t('aboutPage.title') }}</h1>
        <!-- i18n: Brief subtitle describing the about page -->
        <p class="section-text">{{ $t('aboutPage.subtitle') }}</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         OUR STORY SECTION
         Two-column layout: image on the left, story text on the right.
         Uses the .about-row CSS class (CSS Grid: 1fr 1fr).
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="about-row">

          <!-- Left column: restaurant photo -->
          <div class="about-img">
            <img
              src="https://www.tropicalviewrestaurant.com/wp-content/uploads/2025/02/tropical-view-ubud-38.jpg"
              alt="Tropical View Ubud restaurant interior with rice field view"
            />
          </div>

          <!-- Right column: our story text -->
          <div>
            <!-- i18n: Label for the story section -->
            <p class="section-label">{{ $t('aboutPage.story.label') }}</p>
            <!-- i18n: Title of the story section -->
            <h2 class="section-title">{{ $t('aboutPage.story.title') }}</h2>

            <!--
              📚 Multiple <p> tags with .section-text class create well-spaced
                 paragraphs of readable body text.
            -->
            <!-- i18n: First paragraph of the story section -->
            <p class="section-text" style="margin-bottom: 1.5rem;">
              {{ $t('aboutPage.story.paragraph1') }}
            </p>
            <!-- i18n: Second paragraph of the story section -->
            <p class="section-text" style="margin-bottom: 1.5rem;">
              {{ $t('aboutPage.story.paragraph2') }}
            </p>
            <!-- i18n: Third paragraph of the story section -->
            <p class="section-text" style="margin-bottom: 2rem;">
              {{ $t('aboutPage.story.paragraph3') }}
            </p>

            <!-- Button linking to the menu page; i18n: Explore Our Menu button text -->
            <NuxtLink to="/menu" class="btn btn-outline-green">
              {{ $t('aboutPage.exploreMenuBtn') }}
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         MISSION & VALUES SECTION
         Three cards on a green background, same layout as the homepage.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <!--
          📚 `.green-card` gives this container a light green background
             (#f1f5eb) with large rounded corners (41px).
             It's the same style used on the homepage values section.
        -->
        <div class="green-card">
          <!-- i18n: Label for the mission section -->
          <p class="section-label">{{ $t('aboutPage.mission.label') }}</p>
          <!-- i18n: Title of the mission section -->
          <h2 class="section-title">{{ $t('aboutPage.mission.title') }}</h2>
          <!-- i18n: Description of the mission section -->
          <p class="section-text">{{ $t('aboutPage.mission.description') }}</p>

          <!-- 3-column grid of value cards -->
          <div class="values-grid">

            <!-- Value 1: Authentic Cuisine -->
            <div class="value-card">
              <div class="value-icon">🍽️</div>
              <!-- i18n: Title of the Authentic Cuisine value card -->
              <h3>{{ $t('aboutPage.mission.authenticCuisine.title') }}</h3>
              <!-- i18n: Description of the Authentic Cuisine value -->
              <p>
                {{ $t('aboutPage.mission.authenticCuisine.description') }}
              </p>
            </div>

            <!-- Value 2: Sustainability -->
            <div class="value-card">
              <div class="value-icon">🌿</div>
              <!-- i18n: Title of the Sustainability value card -->
              <h3>{{ $t('aboutPage.mission.sustainability.title') }}</h3>
              <!-- i18n: Description of the Sustainability value -->
              <p>
                {{ $t('aboutPage.mission.sustainability.description') }}
              </p>
            </div>

            <!-- Value 3: Warm Hospitality -->
            <div class="value-card">
              <div class="value-icon">🤝</div>
              <!-- i18n: Title of the Warm Hospitality value card -->
              <h3>{{ $t('aboutPage.mission.warmHospitality.title') }}</h3>
              <!-- i18n: Description of the Warm Hospitality value -->
              <p>
                {{ $t('aboutPage.mission.warmHospitality.description') }}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         THE EXPERIENCE SECTION
         Highlights what makes dining at Tropical View special.
         Uses the same two-column grid layout but reversed (text left, image right).
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <!--
          📚 To reverse the image-text order, we simply swap the two <div>
             children. The CSS Grid puts the first child on the left and
             the second on the right. So putting text first = text on left.
        -->
        <div class="about-row">

          <!-- Left column: text content (swapped order) -->
          <div>
            <!-- i18n: Label for the experience section -->
            <p class="section-label">{{ $t('aboutPage.experience.label') }}</p>
            <!-- i18n: Title of the experience section -->
            <h2 class="section-title">{{ $t('aboutPage.experience.title') }}</h2>

            <!-- i18n: First paragraph of the experience section -->
            <p class="section-text" style="margin-bottom: 1.5rem;">
              {{ $t('aboutPage.experience.paragraph1') }}
            </p>
            <!-- i18n: Second paragraph of the experience section -->
            <p class="section-text" style="margin-bottom: 1.5rem;">
              {{ $t('aboutPage.experience.paragraph2') }}
            </p>
            <!-- i18n: Third paragraph of the experience section -->
            <p class="section-text" style="margin-bottom: 2rem;">
              {{ $t('aboutPage.experience.paragraph3') }}
            </p>

            <!-- Button linking to the contact page; i18n: Get in Touch button text -->
            <NuxtLink to="/contact" class="btn btn-green">
              {{ $t('aboutPage.contactBtn') }}
            </NuxtLink>
          </div>

          <!-- Right column: second restaurant photo -->
          <div class="about-img">
            <img
              src="https://www.tropicalviewrestaurant.com/wp-content/uploads/2025/02/tropical-view-ubud-23.jpg"
              alt="Tropical View Ubud rice field view from the restaurant"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CTA BANNER
         Green banner encouraging visitors to make a reservation.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-banner">
          <!-- i18n: CTA banner title -->
          <h2>{{ $t('aboutPage.ctaTitle') }}</h2>
          <!-- i18n: CTA banner description -->
          <p>{{ $t('aboutPage.ctaDescription') }}</p>
          <!-- External link to WhatsApp for reservations -->
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            <!-- i18n: Reservation button text in the CTA banner -->
            {{ $t('aboutPage.reserveBtn') }}
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<!--
  📚 LEARNING — No <script> Needed:
  This page is entirely static (no user interactions, no data fetching).
  It only uses HTML template and CSS classes defined in main.css.
  That's perfectly valid in Vue — not every component needs a <script> block.

  If you wanted to add animations or dynamic content later,
  you could add:
    <script setup lang="ts">
    const title = ref('About Us')
    </script>
-->

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCOPED STYLE                                                          ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  📚 LEARNING — `<style scoped>`:
  Adding `scoped` to a <style> tag means these CSS rules ONLY apply
  to THIS component. Vue attaches a unique data attribute to every
  element here and rewrites each selector to match only that attribute,
  so nothing leaks into other pages.

  📚 LEARNING — Why the header overrides below are needed:
  The global stylesheet (main.css) has `.hero h1` and `.hero p` rules that
  paint text WHITE (via --color-hero-heading / --color-hero-text). That is
  correct for the homepage hero, which sits on a dark image card — but this
  page reuses the `.hero` class on a plain light background, so the header
  text ("Tropical View Ubud" label, "About Us" title, and the subtitle)
  was invisible.

  Each override rule below pairs the `.about-header` wrapper class with
  a scoped attribute selector, giving HIGHER specificity than the global
  `.hero h1` / `.hero p` rules, while still applying ONLY to this page's
  header. Colors come from dedicated black variables defined in main.css
  (NOT the shared white hero variables).
-->
<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Page Header Color Fixes
   Restore visible dark text for the label, "About Us" heading, and the
   subtitle paragraph inside the light-background page header.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Fix the small uppercase brand label in the page header */
.about-header .section-label {
  /* Dedicated black variable instead of the shared white hero text color
     that `.hero p` would otherwise apply to this <p> element */
  color: var(--color-about-label);
}

/* Fix the main heading ("About Us") in the page header */
.about-header .section-title {
  /* Dedicated black variable instead of the shared white hero heading color
     that `.hero h1` would otherwise apply to this <h1> element */
  color: var(--color-about-title);
}

/* Fix the subtitle paragraph in the page header */
.about-header .section-text {
  /* Dedicated black variable instead of the shared white hero paragraph
     color that `.hero p` would otherwise apply to this <p> element */
  color: var(--color-about-description);
}
</style>

