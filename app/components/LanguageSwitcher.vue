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
    <button
      v-for="loc in locales"
      :key="loc.code"
      <!-- Dynamically bind: add 'active' class when this locale is selected -->
      :class="['lang-btn', { active: locale === loc.code }]"
      <!--
        On click: call setLocale() to switch language.
        This updates the URL prefix, re-renders all $t() calls,
        and stores the preference in a cookie.
      -->
      @click="setLocale(loc.code)"
    >
      <!-- Display the locale code in uppercase (e.g., "EN", "ID") -->
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
  Base button style: transparent background, no border, small rounded corners.
  Cursor pointer indicates it's clickable.
*/
.lang-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-content);
  letter-spacing: 0.5px;
}

/*
  Hover state: white border and text for better visibility.
*/
.lang-btn:hover {
  border-color: rgba(255, 255, 255, 0.8);
  color: #fff;
}

/*
  Active state: solid white background with dark text.
  Clearly indicates which language is currently selected.
*/
.lang-btn.active {
  background: #fff;
  color: var(--color-green);
  border-color: #fff;
}
</style>
