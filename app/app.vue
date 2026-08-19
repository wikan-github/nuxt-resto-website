<!--
  ============================================================================
  app.vue — The Root Component (Entry Point)
  ============================================================================
  In Nuxt 4, this file is the ENTRY POINT of your entire application.
  Every other page and component is rendered INSIDE this file.

  📚 LEARNING — Vue Component Structure:
  - A .vue file always has up to 3 sections:
    1. <template> — The HTML markup (what the user sees)
    2. <script>   — The JavaScript logic (data, functions, computed values)
    3. <style>    — The CSS styling (how things look)
  - You can have multiple <template>, <script>, and <style> blocks per file.

  📚 LEARNING — Nuxt Auto-Imports:
  - <NuxtLayout> and <NuxtPage> are NOT imported manually.
    Nuxt automatically makes them available in every .vue file.
  - <NuxtLayout> loads the layout file (app/layouts/default.vue)
  - <NuxtPage> renders the current page based on the URL (app/pages/*.vue)
-->
<template>
  <!--
    NuxtLayout wraps everything in a layout file.
    By default it uses app/layouts/default.vue.
    📚 You can create multiple layouts (e.g., admin.vue, blank.vue)
       and switch between them with `<NuxtLayout name="admin">`.
  -->
  <NuxtLayout>
    <!--
      NuxtPage renders the PAGE that matches the current URL.
      - "/" → renders app/pages/index.vue
      - "/menu" → renders app/pages/menu.vue
      - "/about" → renders app/pages/about.vue
      📚 This is called "file-based routing" — the URL structure
         automatically mirrors your file structure in app/pages/.
    -->
    <NuxtPage />
  </NuxtLayout>
</template>
