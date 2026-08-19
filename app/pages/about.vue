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
    <section class="hero" style="padding-bottom: 1rem;">
      <div class="container">
        <!-- Small uppercase label above the heading -->
        <p class="section-label">Tropical View Ubud</p>
        <!-- Main page title -->
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">About Us</h1>
        <!-- Brief subtitle text -->
        <p class="section-text">Learn about our journey, our passion for food, and our love for nature.</p>
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
            <p class="section-label">Our Story</p>
            <h2 class="section-title">A Dream Born in Ubud</h2>

            <!--
              📚 Multiple <p> tags with .section-text class create well-spaced
                 paragraphs of readable body text.
            -->
            <p class="section-text" style="margin-bottom: 1.5rem;">
              Tropical View Ubud was born from a simple dream — to create a place where
              guests could enjoy delicious food while being surrounded by the breathtaking
              beauty of Ubud's rice terraces and tropical greenery.
            </p>
            <p class="section-text" style="margin-bottom: 1.5rem;">
              Located on the famous Monkey Forest Street, our restaurant offers more than
              just a meal. It offers an experience — the gentle sound of nature, warm
              Balinese hospitality, and flavors that tell a story.
            </p>
            <p class="section-text" style="margin-bottom: 2rem;">
              Since opening our doors, we have welcomed travelers from all over the world
              who come seeking authentic Indonesian cuisine and a tranquil atmosphere.
              Every dish we serve is prepared with locally sourced ingredients and
              traditional Balinese spices.
            </p>

            <!-- Button linking to the menu page -->
            <NuxtLink to="/menu" class="btn btn-outline-green">
              Explore Our Menu
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
          <p class="section-label">What We Stand For</p>
          <h2 class="section-title">Our Mission & Values</h2>
          <p class="section-text">Everything we do is guided by our commitment to quality, sustainability, and community.</p>

          <!-- 3-column grid of value cards -->
          <div class="values-grid">

            <!-- Value 1: Authentic Cuisine -->
            <div class="value-card">
              <div class="value-icon">🍽️</div>
              <h3>Authentic Cuisine</h3>
              <p>
                We celebrate Indonesian culinary traditions while embracing international
                flavors. Every dish is crafted with respect for authentic recipes and
                the freshest local ingredients.
              </p>
            </div>

            <!-- Value 2: Sustainability -->
            <div class="value-card">
              <div class="value-icon">🌿</div>
              <h3>Sustainability</h3>
              <p>
                We source our ingredients from local farmers and producers, supporting
                the Balinese community while minimizing our environmental footprint.
              </p>
            </div>

            <!-- Value 3: Warm Hospitality -->
            <div class="value-card">
              <div class="value-icon">🤝</div>
              <h3>Warm Hospitality</h3>
              <p>
                Balinese hospitality is world-renowned for its warmth and generosity.
                We treat every guest like family, ensuring your experience is
                memorable from start to finish.
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
            <p class="section-label">The Experience</p>
            <h2 class="section-title">Dining With a View</h2>

            <p class="section-text" style="margin-bottom: 1.5rem;">
              Imagine savoring a plate of Nasi Goreng while gazing at lush green rice
              terraces stretching as far as the eye can see. At Tropical View Ubud,
              every table offers a window into the soul of Bali.
            </p>
            <p class="section-text" style="margin-bottom: 1.5rem;">
              Our restaurant is designed to blend seamlessly with nature. Open-air seating,
              natural materials, and the gentle sounds of the tropical forest create an
              atmosphere that calms the mind and delights the senses.
            </p>
            <p class="section-text" style="margin-bottom: 2rem;">
              Whether you're enjoying a leisurely breakfast, a business lunch, or a
              romantic dinner, the magic of Ubud surrounds you at every moment.
            </p>

            <!-- Button linking to the contact page -->
            <NuxtLink to="/contact" class="btn btn-green">
              Get in Touch
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
          <h2>Ready to Experience Tropical View?</h2>
          <p>Book your table today and enjoy a dining experience you'll never forget.</p>
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
