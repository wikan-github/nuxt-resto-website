<!--
  ============================================================================
  contact.vue — Contact Us Page (route: /contact)
  ============================================================================
  This page lets visitors get in touch with the restaurant. It contains:
    1. Hero header with the page title
    2. Contact info cards (phone, email, WhatsApp, address)
    3. Contact form with name, email, subject, and message fields
    4. Map / location section

  📚 LEARNING — Forms in Vue:
  Vue makes HTML forms reactive. When a user types in an input field,
  Vue captures that value instantly with `v-model` (two-way data binding).
  This means the JavaScript always has the latest form values.

  Example flow:
    1. User types "John" in the name field
     2. Vue automatically updates: `form.name = 'John'`
    3. When the form is submitted, you can read `form.name` to get "John"
-->
<template>
  <div>

    <!-- ════════════════════════════════════════════════════════════════════
         PAGE HEADER
         ════════════════════════════════════════════════════════════════════ -->
    <!--
      📚 The extra "contact-header" class lets the scoped styles at the
         bottom of this file target ONLY this header section. Without it,
         the global `.hero h1` / `.hero p` rules (white text for the dark
         homepage hero) would win and paint these labels invisible on the
         plain light background of this page.
    -->
    <section class="hero contact-header" style="padding-bottom: 1rem;">
      <div class="container">
        <!-- i18n: page label above the main title -->
        <p class="section-label">{{ $t('contactPage.label') }}</p>
        <!-- i18n: main page heading -->
        <h1 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem);">{{ $t('contactPage.title') }}</h1>
        <!-- i18n: subtitle / introductory text -->
        <p class="section-text">{{ $t('contactPage.subtitle') }}</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CONTACT INFO CARDS
         4-column grid showing phone, email, WhatsApp, and address.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section" style="padding-top: 2rem;">
      <div class="container">
        <!--
          📚 CSS Grid with 4 equal columns:
             `grid-template-columns: repeat(4, 1fr)` creates 4 equal-width columns.
             On smaller screens (via media queries), these stack vertically.
        -->
        <div class="contact-info-grid">

          <!-- Card 1: Phone -->
          <div class="contact-info-card">
            <div class="contact-icon">📞</div>
            <!-- i18n: phone info card heading -->
            <h4>{{ $t('contactPage.info.phone') }}</h4>
            <p>+62 813-3877-4969</p>
          </div>

          <!-- Card 2: Email -->
          <div class="contact-info-card">
            <div class="contact-icon">✉️</div>
            <!-- i18n: email info card heading -->
            <h4>{{ $t('contactPage.info.email') }}</h4>
            <p>tropicalview19@gmail.com</p>
          </div>

          <!-- Card 3: WhatsApp (external link) -->
          <div class="contact-info-card">
            <div class="contact-icon">💬</div>
            <!-- i18n: whatsapp info card heading -->
            <h4>{{ $t('contactPage.info.whatsapp') }}</h4>
            <!--
              📚 `wa.me/` is WhatsApp's click-to-chat URL.
                 The `?text=` parameter pre-fills the first message.
                 `%20` is URL encoding for a space character.
            -->
            <a
              href="https://wa.me/6281338774969?text=Hello,%20I%20want%20to%20know%20more"
              target="_blank"
              rel="noopener"
              class="contact-link"
            >
              <!-- i18n: whatsapp chat link text -->
              {{ $t('contactPage.info.chatBtn') }}
            </a>
          </div>

          <!-- Card 4: Address -->
          <div class="contact-info-card">
            <div class="contact-icon">📍</div>
            <!-- i18n: address info card heading -->
            <h4>{{ $t('contactPage.info.address') }}</h4>
            <!-- i18n: full address text -->
            <p>{{ $t('contactPage.info.addressText') }}</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CONTACT FORM + OPENING HOURS (two-column layout)
         Left: a form the visitor can fill out.
         Right: opening hours and social media links.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <!--
          📚 Two-column grid using the same `.about-row` class
             defined in main.css (grid-template-columns: 1fr 1fr).
        -->
        <div class="about-row">

          <!-- ── LEFT COLUMN: Contact Form ── -->
          <div class="contact-form-wrapper">
            <!-- i18n: contact form heading -->
            <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">{{ $t('contactPage.form.title') }}</h2>

            <!--
              📚 LEARNING — The <form> Element:
              The HTML <form> element groups input fields together.
              `@submit.prevent` is a Vue directive that:
                1. Listens for the form's "submit" event
                2. Calls the `handleSubmit` function
                3. `.prevent` calls `event.preventDefault()` automatically,
                   which stops the browser from reloading the page (default behavior)

              Without `.prevent`, the browser would navigate to a new page on submit.
            -->
            <form class="contact-form" @submit.prevent="handleSubmit">

              <!-- Name field -->
              <div class="form-group">
                <!-- i18n: name field label -->
                <label for="name">{{ $t('contactPage.form.nameLabel') }}</label>
                <!--
                  📚 LEARNING — `v-model` (Two-Way Data Binding):
                  `v-model="form.name"` binds this input to the `form.name` property.

                  When the user types in this input:
                    → Vue updates `form.name` in real time

                  When you set `form.name` in JavaScript:
                    → The input field updates to show that value

                  This is "two-way" binding: input → JS, and JS → input.

                  `id="name"` and `for="name"` link the <label> to the <input>.
                  Clicking the label focuses the input (accessibility best practice).
                -->
                <!-- i18n: name input placeholder text -->
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  placeholder="{{ $t('contactPage.form.namePlaceholder') }}"
                  required
                />
              </div>

              <!-- Email field -->
              <div class="form-group">
                <!-- i18n: email field label -->
                <label for="email">{{ $t('contactPage.form.emailLabel') }}</label>
                <!--
                  `type="email"` validates that the input looks like an email address.
                  `placeholder` shows gray hint text inside the empty input.
                  `required` means the form cannot be submitted if this is empty.
                -->
                <!-- i18n: email input placeholder text -->
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="{{ $t('contactPage.form.emailPlaceholder') }}"
                  required
                />
              </div>

              <!-- Subject field -->
              <div class="form-group">
                <!-- i18n: subject field label -->
                <label for="subject">{{ $t('contactPage.form.subjectLabel') }}</label>
                <!-- i18n: subject input placeholder text -->
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  placeholder="{{ $t('contactPage.form.subjectPlaceholder') }}"
                  required
                />
              </div>

              <!-- Message field (multiline textarea) -->
              <div class="form-group">
                <!-- i18n: message field label -->
                <label for="message">{{ $t('contactPage.form.messageLabel') }}</label>
                <!--
                  📚 `<textarea>` is for multi-line text input (unlike <input>
                     which is single-line). It grows vertically as the user types.
                -->
                <!-- i18n: message textarea placeholder text -->
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  placeholder="{{ $t('contactPage.form.messagePlaceholder') }}"
                  required
                ></textarea>
              </div>

              <!-- Submit button -->
              <button type="submit" class="btn btn-green" style="width: 100%;">
                <!-- i18n: form submit button text -->
                {{ $t('contactPage.form.sendBtn') }}
              </button>
            </form>
          </div>

          <!-- ── RIGHT COLUMN: Opening Hours + Social ── -->
          <div>
            <!-- i18n: opening hours section heading -->
            <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">{{ $t('contactPage.hours.title') }}</h2>

            <!--
              📚 Reuses the .green-card class for a styled container
                 with light green background and rounded corners.
            -->
            <div class="green-card" style="margin-bottom: 1.5rem;">
              <!--
                📚 `.hours-list` is a custom CSS class for the schedule list.
                   Each row shows a day on the left and hours on the right.
              -->
              <div class="hours-list">
                <div class="hours-row">
                  <!-- i18n: monday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.monday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
                <div class="hours-row">
                  <!-- i18n: tuesday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.tuesday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
                <div class="hours-row">
                  <!-- i18n: wednesday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.wednesday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
                <div class="hours-row">
                  <!-- i18n: thursday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.thursday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
                <div class="hours-row">
                  <!-- i18n: friday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.friday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
                <div class="hours-row">
                  <!-- i18n: saturday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.saturday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
                <div class="hours-row">
                  <!-- i18n: sunday day name -->
                  <span class="hours-day">{{ $t('contactPage.hours.sunday') }}</span>
                  <!-- i18n: opening hours time range -->
                  <span class="hours-time">{{ $t('contactPage.hours.time') }}</span>
                </div>
              </div>
            </div>

            <!-- Quick WhatsApp reservation button -->
            <a
              href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
              class="btn btn-green"
              style="width: 100%; text-align: center;"
              target="_blank"
              rel="noopener"
            >
              <!-- i18n: whatsapp reservation button text -->
              {{ $t('contactPage.whatsappBtn') }}
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         MAP SECTION
         Embeds a Google Maps iframe showing the restaurant location.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        <!-- i18n: location section label -->
        <p class="section-label">{{ $t('contactPage.location.label') }}</p>
        <!-- i18n: location section heading -->
        <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2rem);">{{ $t('contactPage.location.title') }}</h2>

        <!--
          📚 LEARNING — `<iframe>` for embedding external content:
          An <iframe> embeds another website (Google Maps) inside your page.
          - `width="100%"` = fills the container width
          - `height="400"` = 400 pixels tall
          - `allowfullscreen` = lets the user click "full screen" on the map
          - `loading="lazy"` = delays loading until the user scrolls near it
            (improves page load performance)

          The `src` URL contains the restaurant's coordinates in Ubud, Bali.
        -->
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.6!2d115.262!3d-8.506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMjEuNiJTIDExNcKwMTUnNDMuMiJF!5e0!3m2!1sen!2sid!4v1"
            width="100%"
            height="400"
            style="border: 0; border-radius: 16px;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════════
         CTA BANNER
         Final call-to-action before the footer.
         ════════════════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-banner">
          <!-- i18n: call-to-action banner heading -->
          <h2>{{ $t('contactPage.ctaTitle') }}</h2>
          <!-- i18n: call-to-action banner description -->
          <p>{{ $t('contactPage.ctaDescription') }}</p>
          <a
            href="https://wa.me/6281338774969?text=Hello,%20I%20want%20a%20reservation"
            class="btn btn-white"
            target="_blank"
            rel="noopener"
          >
            <!-- i18n: book table button text -->
            {{ $t('contactPage.bookBtn') }}
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCRIPT SECTION                                                        ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  This section handles the contact form's data and submission logic.

  📚 LEARNING — Reactive Form State with `reactive()`:
  We use `reactive()` instead of `ref()` here because we have MULTIPLE
  related values (name, email, subject, message) that belong together.

  - `ref()` is best for a SINGLE value (e.g., `const count = ref(0)`)
  - `reactive()` is best for an OBJECT with multiple values

  With `ref()`:
    const name = ref('')
    const email = ref('')
    // Access: name.value, email.value (in script)

  With `reactive()`:
    const form = reactive({ name: '', email: '' })
    // Access: form.name, form.email (NO .value needed)

  📚 LEARNING — `reactive()` vs `ref()`:
  | Feature         | ref()               | reactive()            |
  |-----------------|---------------------|-----------------------|
  | Best for        | Single values       | Objects / forms       |
  | Access (script) | .value needed       | Direct (no .value)    |
  | Can be reassigned | Yes (x = ref(5)) | No (must mutate props)|
-->
<script setup lang="ts">

// 📚 `reactive()` creates a reactive object. Changes to its properties
// automatically update the template (and vice versa).
//
// `form.name`, `form.email`, `form.subject`, `form.message` are all
// two-way bound to their respective input fields via `v-model`.
const form = reactive({
  name: '',      // Bound to the name <input>
  email: '',     // Bound to the email <input>
  subject: '',   // Bound to the subject <input>
  message: '',   // Bound to the message <textarea>
})

// 📚 LEARNING — `handleSubmit()`:
// This function runs when the form is submitted (user clicks "Send Message").
//
// In a real project, you would send this data to an API endpoint:
//   await $fetch('/api/contact', { method: 'POST', body: form })
//
// For now, we just show an alert and reset the form.
//
// 📚 `$fetch` is Nuxt's built-in HTTP client (auto-imported).
//    It's similar to `fetch()` but with Nuxt-specific features.
function handleSubmit() {
  // Show a confirmation message with the user's name
  alert(`Thank you, ${form.name}! Your message has been received. We'll get back to you soon.`)

  // Reset all form fields to empty strings
  // 📚 `Object.assign(form, { ... })` copies the properties from the
  //    new object into the existing reactive `form` object.
  //    We don't do `form = { ... }` because reactive() cannot be reassigned.
  Object.assign(form, {
    name: '',
    email: '',
    subject: '',
    message: '',
  })
}
</script>

<!--
  ╔═══════════════════════════════════════════════════════════════════════╗
  ║ SCOPED STYLE                                                          ║
  ╚═══════════════════════════════════════════════════════════════════════╝

  📚 LEARNING — `<style scoped>`:
  Adding `scoped` to a <style> tag means these CSS rules ONLY apply
  to THIS component. They won't leak into other pages.

  This is different from main.css, which is GLOBAL (applies everywhere).

  Use scoped styles for styles that are specific to ONE component.
  Use global styles (main.css) for shared/reusable styles.

  📚 LEARNING — Why the header overrides below are needed:
  The global stylesheet (main.css) has `.hero h1` and `.hero p` rules that
  paint text WHITE (via --color-hero-heading / --color-hero-text). That is
  correct for the homepage hero, which sits on a dark image card — but this
  page reuses the `.hero` class on a plain light background, so the header
  text ("Get in Touch", "Contact Us", and the subtitle) was invisible.

  Each override rule below pairs the `.contact-header` wrapper class with
  a scoped attribute selector, giving HIGHER specificity than the global
  `.hero h1` / `.hero p` rules, while still applying ONLY to this page's
  header. Colors come from dedicated black variables defined in main.css
  (NOT the shared white hero variables).
-->
<style scoped>

/* ═══════════════════════════════════════════════════════════════════════════
   Page Header Color Fixes
   Restore visible dark text for "Get in Touch", "Contact Us", and the
   subtitle paragraph inside the light-background page header.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Fix the small uppercase label ("Get in Touch") in the page header */
.contact-header .section-label {
  /* Dedicated black variable instead of the shared white hero text color
     that `.hero p` would otherwise apply to this <p> element */
  color: var(--color-contact-label);
}

/* Fix the main heading ("Contact Us") in the page header */
.contact-header .section-title {
  /* Dedicated black variable instead of the shared white hero heading color
     that `.hero h1` would otherwise apply to this <h1> element */
  color: var(--color-contact-title);
}

/* Fix the subtitle paragraph in the page header */
.contact-header .section-text {
  /* Dedicated black variable instead of the shared white hero paragraph
     color that `.hero p` would otherwise apply to this <p> element */
  color: var(--color-contact-description);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Contact Info Cards Grid
   4 equal columns for phone, email, WhatsApp, and address.
   ═══════════════════════════════════════════════════════════════════════════ */
.contact-info-grid {
  /* CSS Grid: 4 equal columns with 1.25rem gap between them */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

/* Individual contact info card */
.contact-info-card {
  /* White background with subtle rounded corners */
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
  /* Smooth shadow transition on hover */
  transition: box-shadow var(--transition);
}

.contact-info-card:hover {
  /* Subtle shadow appears on hover */
  box-shadow: 0 4px 20px rgba(3, 72, 51, 0.06);
}

/* Green circle icon container (same as .value-icon on homepage) */
.contact-icon {
  width: 52px;
  height: 52px;
  /*
    📚 `border-radius: 50%` turns a square into a perfect circle.
       The icon (emoji) is centered inside using flexbox.
  */
  border-radius: 50%;
  background: var(--color-green-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.3rem;
}

.contact-info-card h4 {
  font-family: 'Mulish', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-green);
  margin-bottom: 0.35rem;
}

.contact-info-card p {
  font-family: var(--font-content);
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--color-text-body);
}

/* WhatsApp link styled differently from plain text */
.contact-link {
  font-family: var(--font-content);
  font-size: 0.85rem;
  font-weight: 500;
  /*
    📚 `text-decoration: underline` + `text-decoration-color` creates
       a colored underline that signals the text is clickable.
  */
  text-decoration: underline;
  text-decoration-color: var(--color-green-accent);
  text-underline-offset: 2px;
  color: var(--color-green);
  transition: color var(--transition);
}

.contact-link:hover {
  color: var(--color-green-accent);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Contact Form Styles
   ═══════════════════════════════════════════════════════════════════════════ */

/* White card wrapper for the form */
.contact-form-wrapper {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

/* Individual form field group (label + input) */
.form-group {
  margin-bottom: 1.25rem;
}

/* Label text above each input */
.form-group label {
  display: block;           /* Makes the label take full width (sits above the input) */
  font-family: var(--font-content);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.35rem;  /* Space between label and input */
}

/* Text input and textarea shared styles */
.form-group input,
.form-group textarea {
  width: 100%;              /* Fill the container width */
  font-family: var(--font-content);
  font-size: 0.9rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  /*
    📚 `outline: none` removes the default blue focus ring.
       `transition` makes the border color change smooth.
  */
  outline: none;
  transition: border-color var(--transition);
}

/* Focus state: green border when the user clicks into a field */
.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-green);
}

/* Placeholder text styling (the gray hint text inside empty inputs) */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-text-muted);
}

/* Textarea: allow vertical resizing but not horizontal */
.form-group textarea {
  resize: vertical;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Opening Hours List
   ═══════════════════════════════════════════════════════════════════════════ */

.hours-list {
  display: flex;
  flex-direction: column;   /* Stack rows vertically */
  gap: 0.6rem;              /* Space between each row */
}

/* Each row: day name on the left, hours on the right */
.hours-row {
  /*
    📚 `display: flex` + `justify-content: space-between` pushes the
       first child (day) to the left and the second child (hours) to the right.
       This creates a clean aligned schedule layout.
  */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.6rem;
  /* Thin border below each row (except the last one) */
  border-bottom: 1px solid var(--color-border);
}

/* Remove the border from the last row (no need for a line after the last item) */
.hours-row:last-child {
  border-bottom: none;
}

.hours-day {
  font-family: var(--font-content);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.hours-time {
  font-family: var(--font-content);
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--color-text-body);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Map Container
   Wraps the Google Maps <iframe> with rounded corners.
   ═══════════════════════════════════════════════════════════════════════════ */
.map-container {
  border-radius: var(--radius-md);
  overflow: hidden;         /* Clips the iframe to the rounded corners */
}

/* ═══════════════════════════════════════════════════════════════════════════
   Responsive Design
   Adjust layouts for smaller screens.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Tablet breakpoint (max 991px) */
@media (max-width: 991px) {
  /* 4 columns → 2 columns on tablets */
  .contact-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Phone breakpoint (max 767px) */
@media (max-width: 767px) {
  /* 2 columns → 1 column on phones */
  .contact-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
