<!--
  ============================================================================
  LanguageSwitcher.vue — Language Toggle Component
  ============================================================================
  A dropdown-style language switcher that lets users toggle between
  English (EN) and Bahasa Indonesia (ID).

  📚 LEARNING — Nuxt I18n Composables:
  - `locale` — the currently active language code (e.g., 'en' or 'id')
  - `locales` — array of all configured locale objects
  - `setLocale(code)` — switch to a different language (updates URL + content)
  - `switchLocalePath(code)` — returns the equivalent URL in the target language

  This component uses `<NuxtLink>` with `switchLocalePath()` so the URL
  updates correctly (e.g., /menu → /id/menu).
-->
<template>
  <!--
    Container: flex layout with gap between language buttons.
    `lang-switcher` class hooks into global CSS in main.css.
  -->
  <div class="lang-switcher">
    <!--
      Loop through all configured locales and render a button for each.
      `locale` is a reactive ref from useI18n() — current language code.
    -->
    <!--
      Each button represents one language option.
      - v-for: iterates over all configured locales
      - :key: unique identifier for Vue's reactivity system
      - :class: adds 'active' class when this locale matches the current one
      - @click: calls setLocale() to switch language (updates URL + content)
      - Content: displays locale code in uppercase (e.g., "EN", "ID")
    -->
    <button
      v-for="loc in locales"
      :key="loc.code"
      :class="['lang-btn', { active: locale === loc.code }]"
      @click="setLocale(loc.code)"
    >
      {{ loc.code.toUpperCase() }}
    </button>
  </div>
</template>

<!--
  📚 LEARNING — <script setup lang="ts">:
  This component uses Vue 3's <script setup> syntax with TypeScript.
  `useI18n()` is auto-imported by @nuxtjs/i18n — no manual import needed.
-->
<script setup lang="ts">
/*
  Destructure i18n composables from useI18n():
  - `locale`: reactive ref holding current language code ('en' or 'id')
  - `locales`: array of configured locale objects from nuxt.config.ts
  - `setLocale`: function to switch language (triggers URL + content update)
*/
const { locale, locales, setLocale } = useI18n()
</script>

<!--
  📚 LEARNING — Scoped Styles:
  The `scoped` attribute means these CSS rules ONLY apply to this component.
  They won't leak into other components or the global stylesheet.
-->
<style scoped>
/*
  Container: horizontal flex layout with small gap between language buttons.
*/
.lang-switcher {
  display: flex;
  gap: 4px;
  align-items: center;
}

/*
  Base button style for INACTIVE language options (e.g. "EN" when "ID" is active).

  ⚠️ CONTEXT FIX: This component renders inside the sticky header
  (main.css → .site-header), whose background is LIGHT off-white:
    background: rgba(249, 249, 249, 0.92)
  The previous colors (rgba(255,255,255,...) white text + white border)
  were designed for a DARK hero background — on the light header they
  rendered white-on-white and became invisible, making it hard to see
  and switch languages. All colors below now use dark theme tokens.
*/
.lang-btn {
  /* Transparent fill so the light header shows through the button */
  background: transparent;
  /* Light gray border token (#e5e5e5) — subtle but visible on the off-white header */
  border: 1px solid var(--color-border);
  /* Medium gray text token (#636363) — clearly readable, yet visually
     "dimmer" than the active button so the current language stands out */
  color: var(--color-text-muted);
  /* Compact pill padding sized for a small header control */
  padding: 4px 10px;
  /* Soft rounded corners matching the site's button style */
  border-radius: 6px;
  /* Small font size keeps the switcher compact inside the 80px-tall header */
  font-size: 0.75rem;
  /* Semi-bold weight so the two-letter codes stay legible at small size */
  font-weight: 600;
  /* Pointer cursor signals the buttons are clickable */
  cursor: pointer;
  /* Smoothly animate color/border changes between inactive/hover/active states */
  transition: all 0.2s ease;
  /* Same content font used across the site for visual consistency */
  font-family: var(--font-content);
  /* Slight letter spacing improves readability of uppercase codes ("EN", "ID") */
  letter-spacing: 0.5px;
}

/*
  Hover state for INACTIVE buttons: brand green border + text.
  Green is used instead of the old white because it stays visible
  on the light header and matches the nav link hover color
  (main.css → .nav-links a:hover), keeping feedback consistent.
*/
.lang-btn:hover {
  /* Deep forest green border signals interactivity on hover */
  border-color: var(--color-green);
  /* Deep forest green text gives clear, accessible hover feedback */
  color: var(--color-green);
}

/*
  Active state: the CURRENTLY SELECTED language.
  Soft light-green tint pill with deep green text — clearly distinct
  from the transparent inactive buttons while staying in harmony with
  the site's green brand palette (no harsh white block in the header).
*/
.lang-btn.active {
  /* Light green tint token (#f1f5eb) — a gentle brand-colored fill
     that stands out from the off-white header without overpowering it */
  background: var(--color-green-light);
  /* Deep forest green text (#034833) on the light tint passes
     contrast requirements and reinforces the active state */
  color: var(--color-green);
  /* Matching light-green border blends the pill into its own fill */
  border-color: var(--color-green-light);
}
</style>
